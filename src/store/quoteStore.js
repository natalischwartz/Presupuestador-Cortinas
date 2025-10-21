import { create } from "zustand";
import { persist } from 'zustand/middleware';

export const useQuoteStore = create(
  persist(
    (set, get) => ({
      quotes: [],
      currentQuote: null,
      isLoading: false,
      selectedQuotes: [],

      // Precio por metro desde variable de entorno
      PRECIO_POR_METRO: Number(import.meta.env.VITE_PRECIO_POR_METRO) || 60000,
      ADICIONAL_FIJO: Number(import.meta.env.VITE_ADICIONAL_FIJO) || 15000,

      addQuote: (newQuote) => set((state) => ({
        quotes: [...state.quotes, { 
          ...newQuote, 
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),

      updateQuote: (id, updatedQuote) => set((state) => ({
        quotes: state.quotes.map(quote => 
          quote.id === id ? { 
            ...quote, 
            ...updatedQuote, 
            updatedAt: new Date()
          } : quote
        )
      })),

      deleteQuote: (id) => set((state) => ({
        quotes: state.quotes.filter(quote => quote.id !== id),
        selectedQuotes: state.selectedQuotes.filter(quoteId => quoteId !== id)
      })),

      toggleQuoteSelection: (quoteId) => set((state) => ({
        selectedQuotes: state.selectedQuotes.includes(quoteId)
          ? state.selectedQuotes.filter(id => id !== quoteId)
          : [...state.selectedQuotes, quoteId]
      })),

      clearSelectedQuotes: () => set({ selectedQuotes: [] }),

      selectAllQuotes: () => set((state) => ({
        selectedQuotes: state.quotes.map(quote => quote.id)
      })),

      setCurrentQuote: (quote) => set({ currentQuote: quote }),
      clearCurrentQuote: () => set({ currentQuote: null }),

      setLoading: (loading) => set({ isLoading: loading }),

      getSelectedQuotes: () => {
        const { quotes, selectedQuotes } = get();
        const selected = quotes.filter(quote => selectedQuotes.includes(quote.id));
        
        console.log('Quotes seleccionadas:', {
          totalQuotes: quotes.length,
          selectedIds: selectedQuotes,
          selectedQuotes: selected.length
        });
        
        return selected;
      },

      getQuoteById: (id) => {
        const { quotes } = get()
        return quotes.find(quote => quote.id === id)
      },

      // NUEVO CÁLCULO SIMPLIFICADO
      calculateTotal: (quote) => {
        if (!quote) return 0;
        
        const PRECIO_POR_METRO = get().PRECIO_POR_METRO;
        const ADICIONAL_FIJO = get().ADICIONAL_FIJO;
        const BASE_PRICES = get().getBasePrices();
        
        // Obtener medidas básicas
        const windowWidth = Number(quote.customWidth) || 0;
        const windowHeight = Number(quote.customHeight) || 0;
        const cantidadCortinas = Number(quote.curtainQuantity) || 1;
        
        // 1. Cálculo de cortinas (fórmula simplificada)
          let totalPorCortina;
          if (quote.formulaPersonalizadaActiva) {
            const multiplicador = Number(quote.formulaMultiplicador) || 2;
            const precioPersonalizado = Number(quote.formulaPrecioPersonalizado) || PRECIO_POR_METRO;
            const adicionalFijo  = Number(quote.adicionalFijo) || ADICIONAL_FIJO;
            totalPorCortina = windowWidth * multiplicador * precioPersonalizado + adicionalFijo;
          } else {
             // NUEVA FÓRMULA ESTÁNDAR CON VARIABLES DE ENTORNO
          const base = windowWidth * 2 * PRECIO_POR_METRO;
          totalPorCortina = base + ADICIONAL_FIJO;
          }


        const totalCortinas = totalPorCortina * cantidadCortinas;
        
        // 2. Cálculo de servicios adicionales
        let totalServicios = 0;
        
        // Toma de medidas
        if (quote.necesitaTM) {
          const cantidadVentanas = Number(quote.cantidadVentanas) || 1;
          const precioTM = quote.ubicacionTM === 'CABA' 
            ? BASE_PRICES.MEASUREMENT_CABA 
            : BASE_PRICES.MEASUREMENT_GBA;
          totalServicios += cantidadVentanas * precioTM;
        }
        
        // Rieles
        if (quote.necesitaRiel) {
          const cantidadVentanas = Number(quote.cantidadVentanasRiel) || 1;
          const metrosPorVentana = Number(quote.metrosPorVentana) > 0 
            ? Number(quote.metrosPorVentana) 
            : windowWidth;
          totalServicios += cantidadVentanas * metrosPorVentana * BASE_PRICES.RAIL;
        }
        
        // Instalación
        if (quote.hasInstallation) {
          const cantidadVentanas = Number(quote.cantidadVentanasInstalacion) || 1;
          totalServicios += cantidadVentanas * BASE_PRICES.INSTALLATION;
        }
        
        const totalGeneral = totalCortinas + totalServicios;
        
        console.log('Nuevo cálculo simplificado:', {
          id: quote.id,
          windowWidth,
          cantidadCortinas,
          totalPorCortina,
          totalCortinas,
          totalServicios,
          totalGeneral
        });
        
        return totalGeneral;
      },


      getQuoteTotal: (id) => {
      const { quotes, calculateTotal } = get();
      const quote = quotes.find(q => q.id === id);
      if (!quote) return 0;
      return calculateTotal(quote);
    },

      // NUEVO: Cálculo específico para servicios adicionales
      calculateServiciosAdicionales: (quote) => {
        const BASE_PRICES = get().getBasePrices();
        const windowWidth = Number(quote.customWidth) || 0;
        
        // Toma de medidas
        const costoTomaMedidas = quote.necesitaTM 
          ? (Number(quote.cantidadVentanas) || 1) * 
            (quote.ubicacionTM === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA : BASE_PRICES.MEASUREMENT_GBA)
          : 0;

        // Rieles
        const metrosPorVentana = Number(quote.metrosPorVentana) > 0 
          ? Number(quote.metrosPorVentana) 
          : windowWidth;
        const costoRieles = quote.necesitaRiel 
          ? (Number(quote.cantidadVentanasRiel) || 1) * metrosPorVentana * BASE_PRICES.RAIL
          : 0;

        // Instalación
        const costoInstalacion = quote.hasInstallation 
          ? (Number(quote.cantidadVentanasInstalacion) || 1) * BASE_PRICES.INSTALLATION
          : 0;

        return {
          tomaMedidas: {
            activo: quote.necesitaTM || false,
            cantidadVentanas: Number(quote.cantidadVentanas) || 0,
            ubicacion: quote.ubicacionTM || 'CABA',
            costo: costoTomaMedidas,
            calculo: quote.necesitaTM 
              ? `${Number(quote.cantidadVentanas) || 1} ventana(s) × $${(quote.ubicacionTM === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA : BASE_PRICES.MEASUREMENT_GBA).toLocaleString()}`
              : ''
          },
          rieles: {
            activo: quote.necesitaRiel || false,
            cantidadVentanas: Number(quote.cantidadVentanasRiel) || 0,
            metrosPorVentana: metrosPorVentana,
            costo: costoRieles,
            calculo: quote.necesitaRiel 
              ? `${Number(quote.cantidadVentanasRiel) || 1} ventana(s) × ${metrosPorVentana.toFixed(2)}m × $${BASE_PRICES.RAIL.toLocaleString()}`
              : ''
          },
          instalacion: {
            activo: quote.hasInstallation || false,
            cantidadVentanas: Number(quote.cantidadVentanasInstalacion) || 0,
            costo: costoInstalacion,
            calculo: quote.hasInstallation 
              ? `${Number(quote.cantidadVentanasInstalacion) || 1} ventana(s) × $${BASE_PRICES.INSTALLATION.toLocaleString()}`
              : ''
          },
          totalServicios: costoTomaMedidas + costoRieles + costoInstalacion
        };
      },

      // NUEVO: Cálculo específico para cortinas
      calculateCortinas: (quote) => {
        const PRECIO_POR_METRO = get().PRECIO_POR_METRO;
        const ADICIONAL_FIJO = get().ADICIONAL_FIJO;
        const windowWidth = Number(quote.customWidth) || 0;
        const cantidadCortinas = Number(quote.curtainQuantity) || 1;
        
         let totalPorCortina;

          if (quote.formulaPersonalizadaActiva) {
          const multiplicador = Number(quote.formulaMultiplicador) || 2;
          const precioPersonalizado = Number(quote.formulaPrecioPersonalizado) || PRECIO_POR_METRO;
          totalPorCortina = windowWidth * multiplicador * precioPersonalizado;
        } else {
          // NUEVA FÓRMULA ESTÁNDAR
          const base = windowWidth * 2 * PRECIO_POR_METRO;
          totalPorCortina = base + ADICIONAL_FIJO;
        }
  const totalCortinas = totalPorCortina * cantidadCortinas;

   return {
    totalPorCortina,
    totalCortinas,
    cantidadCortinas,
    windowWidth,
    precioPorMetro: PRECIO_POR_METRO,
    adicionalFijo: ADICIONAL_FIJO
  };
      },

      formatCurrency: (amount) => {
        return new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS'
        }).format(amount)
      },

      getCurtainTypeLabel: (type) => {
        const types = {
          'traditional': 'Tradicional',
          'roller': 'Roller',
          'roman': 'Romana',
          'blackout': 'Blackout'
        }
        return types[type] || type
      },

      getInstallationLabel: (hasInstallation) => {
        return hasInstallation ? 'Con instalación' : 'Sin instalación'
      },

      // Helper para obtener precios base desde variables de entorno
      getBasePrices: () => ({
        CONFECTION: Number(import.meta.env.VITE_CONFECTION_PRICE) || 5000,
        CONFECTION_EXTRA: Number(import.meta.env.VITE_CONFECTION_EXTRA_PRICE) || 7000,
        RAIL: Number(import.meta.env.VITE_RAIL_PRICE) || 15000,
        INSTALLATION: Number(import.meta.env.VITE_INSTALLATION_PRICE) || 25000,
        MEASUREMENT_CABA: Number(import.meta.env.VITE_MEASUREMENT_CABA_PRICE) || 20000,
        MEASUREMENT_GBA: Number(import.meta.env.VITE_MEASUREMENT_GBA_PRICE) || 30000,
      }),

      // Helper para precio de sistema roller
      getRollerSystemPrice: (systemType) => {
        const systems = {
          'SYSTEM_38MM': Number(import.meta.env.VITE_ROLLER_SYSTEM_38MM_PRICE) || 33000,
          'SYSTEM_45MM': Number(import.meta.env.VITE_ROLLER_SYSTEM_45MM_PRICE) || 46400,
        };
        return systems[systemType] || systems.SYSTEM_45MM;
      },

      // NUEVO: Actualizar servicios adicionales de una quote
      updateServiciosAdicionales: (quoteId, servicios) => {
        const { updateQuote } = get();
        updateQuote(quoteId, {
          necesitaTM: servicios.tomaMedidas?.activo || false,
          cantidadVentanas: servicios.tomaMedidas?.cantidadVentanas || 1,
          ubicacionTM: servicios.tomaMedidas?.ubicacion || 'CABA',
          necesitaRiel: servicios.rieles?.activo || false,
          cantidadVentanasRiel: servicios.rieles?.cantidadVentanas || 1,
          metrosPorVentana: servicios.rieles?.metrosPorVentana || 0,
          hasInstallation: servicios.instalacion?.activo || false,
          cantidadVentanasInstalacion: servicios.instalacion?.cantidadVentanas || 1
        });
      },

      // NUEVO: Actualizar cantidad de cortinas
      updateCantidadCortinas: (quoteId, cantidad) => {
        const { updateQuote } = get();
        updateQuote(quoteId, {
          curtainQuantity: cantidad
        });
      }

    }),
    {
      name: 'curtain-quotes-storage',
      getStorage: () => localStorage,
    }
  )
);