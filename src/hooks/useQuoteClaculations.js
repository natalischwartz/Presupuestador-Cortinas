// hooks/useQuoteCalculations.js
import { useQuoteStore } from '../store/quoteStore';

export const useQuoteCalculations = () => {
  const { calculateCortina, calculateServicios, getCompleteCalculation, normalizeQuoteData } = useQuoteStore();

  const getCalculationsForPresupuesto = (presupuesto) => {
    const normalizedData = normalizeQuoteData(presupuesto);
    const completeCalculation = getCompleteCalculation(normalizedData);
    
    return {
      ...completeCalculation,
      normalizedData
    };
  };

  return {
    getCalculationsForPresupuesto,
    calculateCortina,
    calculateServicios,
    normalizeQuoteData
  };
};