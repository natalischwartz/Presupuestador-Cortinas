//importaciones
//zustand: Librería de gestión de estado para React

import { create } from "zustand";
//persist: Middleware que guarda el estado automáticamente en localStorage
import { persist } from 'zustand/middleware';

//Creación del Store

export const useQuoteStore = create(
    persist( //Envuelve el store para persistir datos
         (set, get) => ({
      // Estado y acciones aquí

      //Estado inicial
    quotes: [],           // Array de todos los presupuestos
    currentQuote: null,   // Cotización actualmente seleccionada
    isLoading: false,// Estado de carga
    selectedQuotes: [], // Array de IDs de quotes seleccionadas

    //Acciones (Actions)

    //Añadir presupuesto
    addQuote: (newQuote) => set((state) => ({
    quotes: [...state.quotes, { 
    ...newQuote, 
    id: Date.now().toString(),      // ID único basado en timestamp
    createdAt: new Date(),          // Fecha de creación
    updatedAt: new Date()           // Fecha de actualización
        }]
    })),


    //Actualizar presupuesto
    updateQuote: (id, updatedQuote) => set((state) => ({
    quotes: state.quotes.map(quote => 
    quote.id === id ? { 
      ...quote, 
      ...updatedQuote, 
      updatedAt: new Date()         // Actualiza fecha de modificación
    } : quote
    )
    })),

    //Eliminar presupuesto
    deleteQuote: (id) => set((state) => ({
    quotes: state.quotes.filter(quote => quote.id !== id),
    selectedQuotes: state.selectedQuotes.filter(quoteId => quoteId !== id)
    })),

    // Nuevas actions para selección múltiple
    toggleQuoteSelection: (quoteId) => set((state) => ({
        selectedQuotes: state.selectedQuotes.includes(quoteId)
          ? state.selectedQuotes.filter(id => id !== quoteId)
          : [...state.selectedQuotes, quoteId]
      })),

      clearSelectedQuotes: () => set({ selectedQuotes: [] }),

       selectAllQuotes: () => set((state) => ({
        selectedQuotes: state.quotes.map(quote => quote.id)
      })),


    //Gestión de Cotización Actual
    setCurrentQuote: (quote) => set({ currentQuote: quote }),
    clearCurrentQuote: () => set({ currentQuote: null }),

    //Estado de Carga
    setLoading: (loading) => set({ isLoading: loading }),

    //Selectores y Helpers.
    //Obtener Cotización por ID

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

    //Selector para obtener una quote específica  
    getQuoteById: (id) => {
    const { quotes } = get()  // Usa get() para acceder al estado actual
    return quotes.find(quote => quote.id === id)
    },

    //Cálculo de Total

     calculateTotal: (quote) => {
      if (!quote) return 0;
      
      // Obtener precios base usando el helper
      const BASE_PRICES = get().getBasePrices();
      const curtainType = quote.curtainType || 'traditional';
      const width = Number(quote.customWidth) || 140;
      const height = Number(quote.customHeight) || 220;
      const fabricPrice = Number(quote.fabricPrice) || 0;
      const multiplier = Number(quote.multiplier) || 2;
      const fabricWidth = Number(quote.fabricWidth) || 3;
      
      // Para sistema roller
      const ROLLER_SYSTEM_PRICE = 46400; // Sistema 45mm por defecto

      let total = 0;

      if (curtainType === 'roller') {
        // LÓGICA PARA CORTINAS ROLLER
        const metrosTelaNecesarios = Math.ceil(height * width * 10) / 10; // Redondear hacia arriba a 1 decimal
        const costoTotalTela = metrosTelaNecesarios * fabricPrice;
        
        const rollerSystemPrice = quote.rollerSystemPrice || ROLLER_SYSTEM_PRICE;
        const costoSistemaRoller = width * rollerSystemPrice;
        
        // Toma de medidas
        const costoTotalTM = quote.necesitaTM 
          ? (quote.cantidadVentanas || 1) * 
            (quote.ubicacionTM === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA : BASE_PRICES.MEASUREMENT_GBA)
          : 0;
        
        // Instalación
        const costoInstalacion = quote.hasInstallation ? BASE_PRICES.INSTALLATION : 0;
        
        total = costoTotalTela + costoSistemaRoller + costoTotalTM + costoInstalacion;
        
      } else {
        // LÓGICA PARA CORTINAS TRADICIONALES
        
        // 1. Cálculo de metros de tela
        const anchoConMultiplicador = width * multiplier;
        const altoConAgregados = (height + 0.2 + 0.1); // + dobladillo + cabezal
        
        const anchoTelaCubreAlto = fabricWidth >= altoConAgregados;
        
        let metrosTelaNecesarios = 0;
        if (anchoTelaCubreAlto) {
          metrosTelaNecesarios = Math.ceil(anchoConMultiplicador * 2) / 2; // Redondear al 0.5 más cercano
        } else {
          const panosNecesarios = Math.ceil(anchoConMultiplicador / fabricWidth);
          metrosTelaNecesarios = panosNecesarios * altoConAgregados;
        }
        
        // Usar metros manuales si están configurados
        if (quote.useManualMetersTela && quote.manualMetersTela > 0) {
          metrosTelaNecesarios = Number(quote.manualMetersTela);
        }
        
        // Costo de tela
        const costoTotalTela = metrosTelaNecesarios * fabricPrice;
        
        // 2. Cálculo de confección
        const precioConfeccion = height > 2.7 ? BASE_PRICES.CONFECTION_EXTRA : BASE_PRICES.CONFECTION;
        
        let metrosConfeccionUsar = metrosTelaNecesarios;
        if (quote.useManualMetersConfeccion && quote.manualMetersConfeccion > 0) {
          metrosConfeccionUsar = Number(quote.manualMetersConfeccion);
        }
        
        let costoConfeccion = 0;
        if (quote.useManualMetersConfeccion) {
          // Cuando es manual, siempre cálculo simple
          costoConfeccion = metrosConfeccionUsar * precioConfeccion;
        } else {
          costoConfeccion = anchoTelaCubreAlto 
            ? metrosConfeccionUsar * precioConfeccion
            : Math.ceil(anchoConMultiplicador / fabricWidth) * fabricWidth * precioConfeccion;
        }
        
        // 3. Rieles
        let costoRiel = 0;
        if (quote.necesitaRiel) {
          const metrosPorVentana = Math.ceil(width / 0.2) * 0.2;
          const metrosRiel = (quote.cantidadVentanasRiel || 1) * metrosPorVentana;
          costoRiel = metrosRiel * BASE_PRICES.RAIL;
        }
        
        // 4. Toma de medidas
        const costoTotalTM = quote.necesitaTM 
          ? (quote.cantidadVentanas || 1) * 
            (quote.ubicacionTM === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA : BASE_PRICES.MEASUREMENT_GBA)
          : 0;
        
        // 5. Instalación
        const costoInstalacion = quote.hasInstallation ? BASE_PRICES.INSTALLATION : 0;
        
        total = costoTotalTela + costoConfeccion + costoRiel + costoTotalTM + costoInstalacion;
      }
      
      console.log('Cálculo total para quote:', {
        id: quote.id,
        type: curtainType,
        width,
        height,
        fabricPrice,
        totalCalculated: total
      });
      
      return total;
    },

    //Formateo de Moneda
    formatCurrency: (amount) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount)
    },

    //Helpers de Texto

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
  RAIL: Number(import.meta.env.VITE_RAIL_PRICE) || 5000,
  INSTALLATION: Number(import.meta.env.VITE_INSTALLATION_PRICE) || 15000,
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



    //Persistencia
    //Los datos se guardan automáticamente en:LocalStorage: curtain-quotes-storage.Se recuperan automáticamente al recargar la página

    }),
     {
      name: 'curtain-quotes-storage',//Clave bajo la cual se guarda en localStorage
      getStorage: () => localStorage,//Especifica usar localStorage
    }
))