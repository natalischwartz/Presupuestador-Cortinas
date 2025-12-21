import { number } from "zod";
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
      PRECIO_POR_METRO_ROLLER: Number(import.meta.env.VITE_PRECIO_METRO_ROLLER) || 35000,
      ADICIONAL_FIJO: Number(import.meta.env.VITE_ADICIONAL_FIJO) || 20000,


       // NUEVO: Función única para normalizar datos
      normalizeQuoteData: (quoteData) => {
        const data = { ...quoteData };
        
        // Campos numéricos que siempre deben ser números
        const numericFields = [
          'customWidth', 'customHeight', 'curtainQuantity',
          'cantidadVentanas', 'cantidadVentanasRiel',
          'cantidadVentanasInstalacion', 'metrosPorVentana',
          'multiplier', 'formulaValorPersonalizado',
          'formulaPrecioPersonalizado', 'adicionalFijo',
          'fabricPrice', 'rollerSystemPrice'
        ];

        numericFields.forEach(field => {
          if (data[field] !== undefined && data[field] !== null) {
            data[field] = Number(data[field]) || 0;
          }
        });

        // Valores por defecto
        data.curtainQuantity = data.curtainQuantity || 1;
        data.multiplier = data.multiplier || 2;
        data.formulaPrecioPersonalizado = data.formulaPrecioPersonalizado || get().PRECIO_POR_METRO;
        data.adicionalFijo = data.adicionalFijo || get().ADICIONAL_FIJO;

        // IMPORTANTE: Solo asignar valores por defecto si NO hay fórmula personalizada activa
          if (data.formulaPersonalizadaActiva) {
            // Si hay fórmula personalizada activa, respetar los valores editados
            data.formulaPrecioPersonalizado = data.formulaPrecioPersonalizado || get().PRECIO_POR_METRO;
            data.adicionalFijo = data.adicionalFijo || get().ADICIONAL_FIJO;
            
            // Solo calcular valor automático si realmente es 0 o no existe
            // y si el usuario no desactivó la fórmula personalizada
            if (data.formulaPersonalizadaActiva) {
               // NO sobrescribir si es string vacío (permite borrado temporal)
              const valorActual = data.formulaValorPersonalizado;
              const esValorVacio = valorActual === '' || valorActual === null || valorActual === undefined;
              const esCero = Number(valorActual) === 0;
  
            if (esValorVacio || esCero) {
              data.formulaValorPersonalizado = (data.customWidth || 0) * (data.multiplier || 2);
            }
            }
          } else {
            // Si NO hay fórmula personalizada activa, usar valores por defecto
            data.formulaPrecioPersonalizado = get().PRECIO_POR_METRO;
            data.adicionalFijo = get().ADICIONAL_FIJO;
            
            // Para fórmula estándar, siempre calcular automáticamente
            data.formulaValorPersonalizado = (data.customWidth || 0) * (data.multiplier || 2);
          }

        return data;
      },

      // NUEVO: Función para cálculos de cortinas (reutilizable)
      calculateCortina: (quoteData) => {
        const normalizedData = get().normalizeQuoteData(quoteData);
        const {
          curtainType,
          formulaPersonalizadaActiva,
          customWidth,
          customHeight,
          formulaValorPersonalizado,
          formulaPrecioPersonalizado,
          adicionalFijo,
          curtainQuantity
        } = normalizedData;

        const ancho = Number(customWidth) || 0;
        const alto = Number(customHeight) || 0;
        const cantidad = curtainQuantity || 1;

        let totalPorCortina = 0;
        let calculoDetalle = "";

        if (formulaPersonalizadaActiva) {
          // FÓRMULA PERSONALIZADA
          const valor = formulaValorPersonalizado;
          const precio = formulaPrecioPersonalizado;
          totalPorCortina = valor * precio + adicionalFijo;
          calculoDetalle = `${valor} × $${precio.toLocaleString()} + $${adicionalFijo.toLocaleString()}`;
        
        } else if (curtainType === 'roller') {
          // LÓGICA ROLLER
          const sistema = ancho * get().PRECIO_POR_METRO_ROLLER;
          const tela = ancho * alto * get().PRECIO_POR_METRO_ROLLER;
          totalPorCortina = (sistema + tela) * 2 + adicionalFijo;
          calculoDetalle = `((${ancho.toFixed(2)}m × $${get().PRECIO_POR_METRO_ROLLER.toLocaleString()}) + (${ancho.toFixed(2)}m × ${alto.toFixed(2)}m × $${get().PRECIO_POR_METRO_ROLLER.toLocaleString()})) × 2 + $${adicionalFijo.toLocaleString()}`;
        
        } else {
          // FÓRMULA ESTÁNDAR
          const valor = formulaValorPersonalizado || (ancho * 2);
          totalPorCortina = valor * get().PRECIO_POR_METRO + adicionalFijo;
          calculoDetalle = `${valor.toFixed(2)} × $${get().PRECIO_POR_METRO.toLocaleString()} + $${adicionalFijo.toLocaleString()}`;
        }
         const totalCortinas = totalPorCortina * cantidad;


         return {
          totalPorCortina,
          totalCortinas,
          cantidadCortinas: cantidad,
          windowWidth: ancho,
          windowHeight: alto,
          calculoDetalle
        };
      },

      calculateValorPersonalizado: (ancho, multiplicador = 2) => {
      return (Number(ancho) || 0) * (Number(multiplicador) || 2);
    },


       // NUEVO: Función para cálculos de servicios (reutilizable)
      calculateServicios: (quoteData) => {
        const normalizedData = get().normalizeQuoteData(quoteData);
        const BASE_PRICES = get().getBasePrices();
        const windowWidth = Number(normalizedData.customWidth) || 0;

        // Toma de medidas
        const costoTomaMedidas = normalizedData.necesitaTM 
          ? (normalizedData.cantidadVentanas || 1) * 
            (normalizedData.ubicacionTM === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA : BASE_PRICES.MEASUREMENT_GBA)
          : 0;

        // Rieles
        const metrosPorVentana = normalizedData.metrosPorVentana > 0 
          ? normalizedData.metrosPorVentana 
          : windowWidth;
        const costoRieles = normalizedData.necesitaRiel 
          ? (normalizedData.cantidadVentanasRiel || 1) * metrosPorVentana * BASE_PRICES.RAIL
          : 0;

        // Instalación
        const costoInstalacion = normalizedData.hasInstallation 
          ? (normalizedData.cantidadVentanasInstalacion || 1) * BASE_PRICES.INSTALLATION
          : 0;

        const totalServicios = costoTomaMedidas + costoRieles + costoInstalacion;

        return {
          tomaMedidas: {
            activo: normalizedData.necesitaTM || false,
            cantidadVentanas: normalizedData.cantidadVentanas || 0,
            ubicacion: normalizedData.ubicacionTM || 'CABA',
            costo: costoTomaMedidas,
            calculo: normalizedData.necesitaTM 
              ? `${normalizedData.cantidadVentanas} ventana(s) × $${(normalizedData.ubicacionTM === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA : BASE_PRICES.MEASUREMENT_GBA).toLocaleString()}`
              : ''
          },
          rieles: {
            activo: normalizedData.necesitaRiel || false,
            cantidadVentanas: normalizedData.cantidadVentanasRiel || 0,
            metrosPorVentana: metrosPorVentana,
            costo: costoRieles,
            calculo: normalizedData.necesitaRiel 
              ? `${normalizedData.cantidadVentanasRiel} ventana(s) × ${metrosPorVentana.toFixed(2)}m × $${BASE_PRICES.RAIL.toLocaleString()}`
              : ''
          },
          instalacion: {
            activo: normalizedData.hasInstallation || false,
            cantidadVentanas: normalizedData.cantidadVentanasInstalacion || 0,
            costo: costoInstalacion,
            calculo: normalizedData.hasInstallation 
              ? `${normalizedData.cantidadVentanasInstalacion} ventana(s) × $${BASE_PRICES.INSTALLATION.toLocaleString()}`
              : ''
          },
          totalServicios
        };
      },


      addQuote: (newQuote) => set((state) => {
        const normalizedData = get().normalizeQuoteData(newQuote);
        const total = get().calculateTotal(normalizedData);
        
        return {
          quotes: [...state.quotes, { 
            ...normalizedData,
            totalPrice: total,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          }]
        }
      }),

      updateQuote: (id, updatedQuote) => set((state) => {
        const normalizedData = get().normalizeQuoteData(updatedQuote);
        const total = get().calculateTotal(normalizedData);
        
        return {
          quotes: state.quotes.map(quote => 
            quote.id === id ? { 
              ...quote, 
              ...normalizedData,
              totalPrice: total,
              updatedAt: new Date()
            } : quote
          )
        }
      }),


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
        
        // console.log('Quotes seleccionadas:', {
        //   totalQuotes: quotes.length,
        //   selectedIds: selectedQuotes,
        //   selectedQuotes: selected.length
        // });
        
        return selected;
      },

      getQuoteById: (id) => {
        const { quotes } = get()
        return quotes.find(quote => quote.id === id)
      },

     calculateTotal: (quoteData) => {
        const normalizedData = get().normalizeQuoteData(quoteData);
        
        // Calcular cortinas
        const { totalCortinas } = get().calculateCortina(normalizedData);
        
        // Calcular servicios
        const { totalServicios } = get().calculateServicios(normalizedData);
        
        return totalCortinas + totalServicios;
      },


       // NUEVO: Función para obtener todos los cálculos de una vez
      getCompleteCalculation: (quoteData) => {
        const normalizedData = get().normalizeQuoteData(quoteData);
        const cortinas = get().calculateCortina(normalizedData);
        const servicios = get().calculateServicios(normalizedData);
        const totalGeneral = cortinas.totalCortinas + servicios.totalServicios;

        return {
          ...cortinas,
          ...servicios,
          totalGeneral,
          quoteData: normalizedData
        };
      },

      getQuoteTotal: (id) => {
      const { quotes, calculateTotal } = get();
      const quote = quotes.find(q => q.id === id);
      if (!quote) return 0;
      return calculateTotal(quote);
    },


      getBasePrices: () => ({
        CONFECTION: Number(import.meta.env.VITE_CONFECTION_PRICE) || 5000,
        CONFECTION_EXTRA: Number(import.meta.env.VITE_CONFECTION_EXTRA_PRICE) || 7000,
        RAIL: Number(import.meta.env.VITE_RAIL_PRICE) || 15000,
        INSTALLATION: Number(import.meta.env.VITE_INSTALLATION_PRICE) || 25000,
        MEASUREMENT_CABA: Number(import.meta.env.VITE_MEASUREMENT_CABA_PRICE) || 20000,
        MEASUREMENT_GBA: Number(import.meta.env.VITE_MEASUREMENT_GBA_PRICE) || 30000,
      }),



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


      // Helper para precio de sistema roller
      getRollerSystemPrice: (systemType) => {
        const systems = {
          'SYSTEM_38MM': Number(import.meta.env.VITE_ROLLER_SYSTEM_38MM_PRICE) || 35000,
          'SYSTEM_45MM': Number(import.meta.env.VITE_ROLLER_SYSTEM_45MM_PRICE) || 50000,
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