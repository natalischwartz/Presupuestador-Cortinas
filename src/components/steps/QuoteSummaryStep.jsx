import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DollarSign, Download, Ruler, Settings, Wrench, Calculator, Edit } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PresupuestoPDF } from "./PresupuestoPDF";
import { useQuoteStore } from "@/store/quoteStore"; // Importa el store

// Precios base desde variables de entorno
const PRECIO_POR_METRO = Number(import.meta.env.VITE_PRECIO_POR_METRO) || 60000;
const ADICIONAL_FIJO = Number(import.meta.env.VITE_ADICIONAL_FIJO) || 15000;
const BASE_PRICES = {
  CONFECTION: Number(import.meta.env.VITE_CONFECTION_PRICE),
  CONFECTION_EXTRA: Number(import.meta.env.VITE_CONFECTION_EXTRA_PRICE),
  RAIL: Number(import.meta.env.VITE_RAIL_PRICE),
  INSTALLATION: Number(import.meta.env.VITE_INSTALLATION_PRICE),
  MEASUREMENT_CABA: Number(import.meta.env.VITE_MEASUREMENT_CABA_PRICE),
  MEASUREMENT_GBA: Number(import.meta.env.VITE_MEASUREMENT_GBA_PRICE),
};

export const QuoteSummaryStep = ({ data, updateData, isPrintMode = false }) => {

    // Usa el store de Zustand
  const { updateQuote, calculateTotal } = useQuoteStore();

  const [cantidadCortinas, setCantidadCortinas] = useState(
    isPrintMode ? data.curtainQuantity : data.curtainQuantity || 1
  );
  
  // Estados para servicios manuales
  const [tomaMedidas, setTomaMedidas] = useState({
    activo: isPrintMode ? data.necesitaTM : data.necesitaTM || false,
    cantidadVentanas: isPrintMode ? data.cantidadVentanas : data.cantidadVentanas || 1,
    ubicacion: isPrintMode ? data.ubicacionTM : data.ubicacionTM || 'CABA'
  });

  const [rieles, setRieles] = useState({
    activo: isPrintMode ? data.necesitaRiel : data.necesitaRiel || false,
    cantidadVentanas: isPrintMode ? data.cantidadVentanasRiel : data.cantidadVentanasRiel || 1,
    metrosPorVentana: isPrintMode ? data.metrosPorVentana : data.metrosPorVentana || 0
  });

  const [instalacion, setInstalacion] = useState({
    activo: isPrintMode ? data.hasInstallation : data.hasInstallation || false,
    cantidadVentanas: isPrintMode ? data.cantidadVentanasInstalacion : data.cantidadVentanasInstalacion || 1
  });

  // Estado para la fórmula personalizada
  const [formulaPersonalizada, setFormulaPersonalizada] = useState({
    activa: data.formulaPersonalizadaActiva || false,
    multiplicador: data.formulaMultiplicador || 2,
    precioPersonalizado: data.formulaPrecioPersonalizado || PRECIO_POR_METRO,
    adicionalFijo: data.adicionalFijo || ADICIONAL_FIJO,
    editando: false
  });

  // Obtener medidas
  const getWindowHeight = () => {
    if (data.customHeight) {
      return parseFloat(data.customHeight);
    }
    return 0;
  };

  const getWindowWidth = () => {
    if (data.customWidth) {
      return parseFloat(data.customWidth);
    }
    return 0;
  };

  const windowHeight = getWindowHeight();
  const windowWidth = getWindowWidth();

  // Calcular total por cortina - con fórmula personalizada o estándar
  const calcularTotalPorCortina = () => {
    if (!windowWidth) return 0;
    
    if (formulaPersonalizada.activa) {
      // Usar fórmula personalizada
      return windowWidth * formulaPersonalizada.multiplicador * formulaPersonalizada.precioPersonalizado + formulaPersonalizada.adicionalFijo;
    } else {
       // Usar el mismo PRECIO_POR_METRO que el store para consistencia
    const store = useQuoteStore.getState();
    return (windowWidth * 2 * store.PRECIO_POR_METRO) + store.ADICIONAL_FIJO;
    }
  };

  // Calcular costos de servicios
  const calcularCostoTomaMedidas = () => {
    if (!tomaMedidas.activo) return 0;
    const precioTM = tomaMedidas.ubicacion === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA : BASE_PRICES.MEASUREMENT_GBA;
    return tomaMedidas.cantidadVentanas * precioTM;
  };

  const calcularCostoRieles = () => {
    if (!rieles.activo) return 0;
    const metros = rieles.metrosPorVentana > 0 ? rieles.metrosPorVentana : windowWidth;
    return rieles.cantidadVentanas * metros * BASE_PRICES.RAIL;
  };

  const calcularCostoInstalacion = () => {
    if (!instalacion.activo) return 0;
    return instalacion.cantidadVentanas * BASE_PRICES.INSTALLATION;
  };

  // Calcular totales
  const totalPorCortina = calcularTotalPorCortina();
  const costoTomaMedidas = calcularCostoTomaMedidas();
  const costoRieles = calcularCostoRieles();
  const costoInstalacion = calcularCostoInstalacion();
  const totalCortinas = totalPorCortina * cantidadCortinas;
  const totalServicios = costoTomaMedidas + costoRieles + costoInstalacion;
 
  // Usar la función calculateTotal del store para el cálculo final
const totalGeneral = useQuoteStore(state => {
  if (!data.id) return 0;
  
  const quote = state.quotes.find(q => q.id === data.id);
  if (!quote) return 0;
  
  return state.calculateTotal({
    ...quote,
    curtainQuantity: cantidadCortinas,
    necesitaTM: tomaMedidas.activo,
    cantidadVentanas: tomaMedidas.cantidadVentanas,
    ubicacionTM: tomaMedidas.ubicacion,
    necesitaRiel: rieles.activo,
    cantidadVentanasRiel: rieles.cantidadVentanas,
    metrosPorVentana: rieles.metrosPorVentana,
    hasInstallation: instalacion.activo,
    cantidadVentanasInstalacion: instalacion.cantidadVentanas,
    formulaPersonalizadaActiva: formulaPersonalizada.activa,
    formulaMultiplicador: formulaPersonalizada.multiplicador,
    formulaPrecioPersonalizado: formulaPersonalizada.precioPersonalizado,
    adicionalFijo: formulaPersonalizada.adicionalFijo
  });
});


   // Función para actualizar el store de Zustand
 const actualizarStore = useCallback(() => {
  if (!isPrintMode && data.id) {
    const store = useQuoteStore.getState();
    
    const datosActualizados = {
      curtainQuantity: cantidadCortinas,
      // NO incluir totalPrice aquí - dejar que el store lo calcule
      necesitaTM: tomaMedidas.activo,
      cantidadVentanas: tomaMedidas.cantidadVentanas,
      ubicacionTM: tomaMedidas.ubicacion,
      necesitaRiel: rieles.activo,
      cantidadVentanasRiel: rieles.cantidadVentanas,
      metrosPorVentana: rieles.metrosPorVentana,
      hasInstallation: instalacion.activo,
      cantidadVentanasInstalacion: instalacion.cantidadVentanas,
      formulaPersonalizadaActiva: formulaPersonalizada.activa,
      formulaMultiplicador: formulaPersonalizada.multiplicador,
      formulaPrecioPersonalizado: formulaPersonalizada.precioPersonalizado,
      adicionalFijo: formulaPersonalizada.adicionalFijo,
      // Campos básicos importantes
      customWidth: data.customWidth,
      customHeight: data.customHeight,
      curtainType: data.curtainType
    };
    
    console.log('🔄 Actualizando store con:', datosActualizados);
    
    // Actualizar en el store de Zustand
    store.updateQuote(data.id, datosActualizados);
    
    // Calcular el total usando la función del store para logging
    const quoteActualizada = { ...datosActualizados, id: data.id };
    const totalCalculado = store.calculateTotal(quoteActualizada);
    console.log('💰 Total calculado por store:', totalCalculado);
    
    // También llamar a updateData si es necesario para el componente padre
    if (updateData) {
      updateData(datosActualizados);
    }
  }
}, [
  data.id, isPrintMode, cantidadCortinas, tomaMedidas,
  rieles, instalacion, formulaPersonalizada, updateData,
  data.customWidth, data.customHeight, data.curtainType
]);

    // Actualizar store cuando cambien los datos
  useEffect(() => {
    actualizarStore();
  }, [cantidadCortinas, tomaMedidas, rieles, instalacion, formulaPersonalizada, totalGeneral, windowWidth, // Agregar esta dependencia
  data.id ]);

  // Estructura de servicios para el PDF
  const serviciosAdicionales = {
    tomaMedidas: {
      activo: tomaMedidas.activo,
      cantidadVentanas: tomaMedidas.cantidadVentanas,
      ubicacion: tomaMedidas.ubicacion,
      costo: costoTomaMedidas,
      calculo: tomaMedidas.activo ? 
        `${tomaMedidas.cantidadVentanas} ventana(s) × $${(tomaMedidas.ubicacion === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA : BASE_PRICES.MEASUREMENT_GBA).toLocaleString()}` :
        ''
    },
    rieles: {
      activo: rieles.activo,
      cantidadVentanas: rieles.cantidadVentanas,
      metrosPorVentana: rieles.metrosPorVentana > 0 ? rieles.metrosPorVentana : windowWidth,
      costo: costoRieles,
      calculo: rieles.activo ? 
        `${rieles.cantidadVentanas} ventana(s) × ${(rieles.metrosPorVentana > 0 ? rieles.metrosPorVentana : windowWidth).toFixed(2)}m × $${BASE_PRICES.RAIL.toLocaleString()}` :
        ''
    },
    instalacion: {
      activo: instalacion.activo,
      cantidadVentanas: instalacion.cantidadVentanas,
      costo: costoInstalacion,
      calculo: instalacion.activo ? 
        `${instalacion.cantidadVentanas} ventana(s) × $${BASE_PRICES.INSTALLATION.toLocaleString()}` :
        ''
    }
  };

  // Actualizar datos
  useEffect(() => {
    if (!isPrintMode) {
      updateData({
        curtainQuantity: cantidadCortinas,
        totalPrice: totalGeneral,
        necesitaTM: tomaMedidas.activo,
        cantidadVentanas: tomaMedidas.cantidadVentanas,
        ubicacionTM: tomaMedidas.ubicacion,
        necesitaRiel: rieles.activo,
        cantidadVentanasRiel: rieles.cantidadVentanas,
        metrosPorVentana: rieles.metrosPorVentana,
        hasInstallation: instalacion.activo,
        cantidadVentanasInstalacion: instalacion.cantidadVentanas,
        costoTomaMedidas: costoTomaMedidas,
        costoRieles: costoRieles,
        costoInstalacion: costoInstalacion,
        totalServicios: totalServicios,
        formulaPersonalizadaActiva: formulaPersonalizada.activa,
        formulaMultiplicador: formulaPersonalizada.multiplicador,
        formulaPrecioPersonalizado: formulaPersonalizada.precioPersonalizado
      });
    }
  }, [cantidadCortinas, tomaMedidas, rieles, instalacion, formulaPersonalizada, totalGeneral, isPrintMode]);

  // Handlers para fórmula personalizada
  const handleToggleFormulaPersonalizada = () => {
    if (isPrintMode) return;
    setFormulaPersonalizada(prev => ({
      ...prev,
      activa: !prev.activa
    }));
  };

  const handleMultiplicadorChange = (e) => {
  if (isPrintMode) return;
  
  const value = e.target.value;
  
  // Permitir campo vacío temporalmente
  if (value === '') {
    setFormulaPersonalizada(prev => ({
      ...prev,
      multiplicador: '' // valor vacío temporal
    }));
    return;
  }
  
  const numericValue = parseFloat(value);
  if (numericValue > 0) {
    setFormulaPersonalizada(prev => ({
      ...prev,
      multiplicador: numericValue
    }));
  }
};

  const handlePrecioPersonalizadoChange = (e) => {
  if (isPrintMode) return;
  
  const value = e.target.value;
  
  // Permitir campo vacío temporalmente
  if (value === '') {
    setFormulaPersonalizada(prev => ({
      ...prev,
      precioPersonalizado: '' // valor vacío temporal
    }));
    return;
  }
  
  const numericValue = parseFloat(value);
  if (numericValue > 0) {
    setFormulaPersonalizada(prev => ({
      ...prev,
      precioPersonalizado: numericValue
    }));
  }
};

  const handleEditarFormula = () => {
    if (isPrintMode) return;
    setFormulaPersonalizada(prev => ({
      ...prev,
      editando: true
    }));
  };

  const handleGuardarFormula = () => {
    if (isPrintMode) return;
    setFormulaPersonalizada(prev => ({
      ...prev,
      editando: false
    }));
  };

  const handleCancelarEdicion = () => {
    if (isPrintMode) return;
    setFormulaPersonalizada(prev => ({
      ...prev,
      editando: false,
      multiplicador: data.formulaMultiplicador || 2,
      precioPersonalizado: data.formulaPrecioPersonalizado || PRECIO_POR_METRO
    }));
  };

  // Handlers para toma de medidas
const handleTomaMedidasToggle = () => {
  if (isPrintMode) return;
  setTomaMedidas(prev => ({
    ...prev,
    activo: !prev.activo
  }));
};

const handleTomaMedidasCantidadChange = (e) => {
  if (isPrintMode) return;
  const value = parseInt(e.target.value);
  if (value > 0) {
    setTomaMedidas(prev => ({
      ...prev,
      cantidadVentanas: value
    }));
  }
};

const handleTomaMedidasUbicacionChange = (ubicacion) => {
  if (isPrintMode) return;
  setTomaMedidas(prev => ({
    ...prev,
    ubicacion
  }));
};

// Handlers para rieles
const handleRielesToggle = () => {
  if (isPrintMode) return;
  setRieles(prev => ({
    ...prev,
    activo: !prev.activo
  }));
};

const handleRielesCantidadChange = (e) => {
  if (isPrintMode) return;
  const value = parseInt(e.target.value);
  if (value > 0) {
    setRieles(prev => ({
      ...prev,
      cantidadVentanas: value
    }));
  }
};

const handleRielesMetrosChange = (e) => {
  if (isPrintMode) return;
  const value = parseFloat(e.target.value);
  if (value >= 0) {
    setRieles(prev => ({
      ...prev,
      metrosPorVentana: value
    }));
  }
};

// Handlers para instalación
const handleInstalacionToggle = () => {
  if (isPrintMode) return;
  setInstalacion(prev => ({
    ...prev,
    activo: !prev.activo
  }));
};

const handleInstalacionCantidadChange = (e) => {
  if (isPrintMode) return;
  const value = parseInt(e.target.value);
  if (value > 0) {
    setInstalacion(prev => ({
      ...prev,
      cantidadVentanas: value
    }));
  }
};

  // Handlers para cantidad de cortinas
  const handleCantidadChange = (e) => {
    if (isPrintMode) return;
    const value = parseInt(e.target.value);
    if (value > 0) {
      setCantidadCortinas(value);
    }
  };

  const handleIncrement = () => {
    if (isPrintMode) return;
    setCantidadCortinas(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (isPrintMode) return;
    if (cantidadCortinas > 1) {
      setCantidadCortinas(prev => prev - 1);
    }
  };

  // ... (los demás handlers para servicios se mantienen igual)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">
          {isPrintMode ? "Resumen para Imprimir" : "Resumen de tu Cotización"}
        </h3>
        <p className="text-muted-foreground">
          {isPrintMode 
            ? "Vista previa del presupuesto seleccionado" 
            : "Detalle simplificado de tu pedido - Los cambios se guardan automáticamente"
          }
        </p>
        {isPrintMode && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mt-4">
            <strong>Modo visualización:</strong> Los campos no son editables en esta vista.
          </div>
        )}
      </div>

      {/* Resumen simplificado */}
      <Card className="shadow-elegant">
        <CardHeader className="bg-gradient-warm">
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-5 w-5" />
            Resumen del Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Información básica */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-3">Detalles principales:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Cantidad de cortinas:</p>
                  {isPrintMode ? (
                    <p className="font-medium text-lg">
                      {cantidadCortinas} cortina{cantidadCortinas > 1 ? 's' : ''}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDecrement}
                        disabled={cantidadCortinas <= 1}
                        className="h-8 w-8 p-0"
                      >
                        -
                      </Button>
                      
                      <Input
                        type="number"
                        min="1"
                        value={cantidadCortinas}
                        onChange={handleCantidadChange}
                        className="w-20 text-center"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleIncrement}
                        className="h-8 w-8 p-0"
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Tipo de cortina:</p>
                  <p className="font-medium text-lg capitalize">
                    {data.curtainType || "tradicional"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-600">Ancho de ventana:</p>
                  <p className="font-medium text-lg">
                    {windowWidth.toFixed(2)} m
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Alto de ventana:</p>
                  <p className="font-medium text-lg">
                    {windowHeight.toFixed(2)} m
                  </p>
                </div>
              </div>

              {data.selectedFabric && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Tela seleccionada:</p>
                  <p className="font-medium">{data.fabricName}</p>
                </div>
              )}
            </div>

            {/* Configuración de Fórmula */}
            {!isPrintMode && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-purple-600" />
                    <h4 className="font-semibold">Configuración de Fórmula</h4>
                  </div>
                  <Button
                    variant={formulaPersonalizada.activa ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleFormulaPersonalizada}
                  >
                    {formulaPersonalizada.activa ? "Personalizada" : "Estándar"}
                  </Button>
                </div>

                {formulaPersonalizada.activa && (
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Fórmula personalizada:
                      </Label>
                      {!formulaPersonalizada.editando ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditarFormula}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleGuardarFormula}
                            className="h-6 px-2 text-green-600"
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelarEdicion}
                            className="h-6 px-2 text-red-600"
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>

                    {formulaPersonalizada.editando ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="multiplicador" className="text-sm font-medium">
                            Multiplicador:
                          </Label>
                          <Input
                            id="multiplicador"
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={formulaPersonalizada.multiplicador}
                            onChange={handleMultiplicadorChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="precio-personalizado" className="text-sm font-medium">
                            Precio por metro:
                          </Label>
                          <Input
                            id="precio-personalizado"
                            type="number"
                            min="1"
                            value={formulaPersonalizada.precioPersonalizado}
                            onChange={handlePrecioPersonalizadoChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-purple-700">
                        <p>Fórmula actual: <strong>Ancho × {formulaPersonalizada.multiplicador} × ${formulaPersonalizada.precioPersonalizado.toLocaleString()} + $ {ADICIONAL_FIJO.toLocaleString()}</strong></p>
                        <p className="text-xs mt-1">
                          Fórmula estándar: Ancho × 2 × ${PRECIO_POR_METRO.toLocaleString()} + ${ADICIONAL_FIJO.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!formulaPersonalizada.activa && (
                  <div className="text-sm text-purple-700">
                    <p>Usando fórmula estándar: <strong>Ancho × 2 × ${PRECIO_POR_METRO.toLocaleString()} + ${ADICIONAL_FIJO.toLocaleString()}</strong></p>
                  </div>
                )}
              </div>
            )}

            {/* Servicios Adicionales */}
            <div className="space-y-4">
              {/* Toma de Medidas */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold">Toma de Medidas</h4>
                  </div>
                  {!isPrintMode && (
                    <Button
                      variant={tomaMedidas.activo ? "default" : "outline"}
                      size="sm"
                      onClick={handleTomaMedidasToggle}
                    >
                      {tomaMedidas.activo ? "Activado" : "Activar"}
                    </Button>
                  )}
                </div>

                {tomaMedidas.activo && (
                  <div className="space-y-3 mt-3">
                    <div>
                      <Label htmlFor="tm-cantidad" className="text-sm font-medium">
                        Cantidad de ventanas:
                      </Label>
                      {isPrintMode ? (
                        <p className="font-medium">{tomaMedidas.cantidadVentanas}</p>
                      ) : (
                        <Input
                          id="tm-cantidad"
                          type="number"
                          min="1"
                          value={tomaMedidas.cantidadVentanas}
                          onChange={handleTomaMedidasCantidadChange}
                          className="mt-1"
                        />
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium block mb-2">
                        Ubicación:
                      </Label>
                      {isPrintMode ? (
                        <p className="font-medium">{tomaMedidas.ubicacion}</p>
                      ) : (
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={tomaMedidas.ubicacion === 'CABA'}
                              onChange={() => handleTomaMedidasUbicacionChange('CABA')}
                              className="mr-2"
                            />
                            CABA (${BASE_PRICES.MEASUREMENT_CABA.toLocaleString()})
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={tomaMedidas.ubicacion === 'GBA'}
                              onChange={() => handleTomaMedidasUbicacionChange('GBA')}
                              className="mr-2"
                            />
                            GBA (${BASE_PRICES.MEASUREMENT_GBA.toLocaleString()})
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-blue-700">
                      Costo: {tomaMedidas.cantidadVentanas} ventana(s) × 
                      ${tomaMedidas.ubicacion === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA.toLocaleString() : BASE_PRICES.MEASUREMENT_GBA.toLocaleString()} = 
                      <span className="font-bold"> ${costoTomaMedidas.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Rieles */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold">Rieles</h4>
                  </div>
                  {!isPrintMode && (
                    <Button
                      variant={rieles.activo ? "default" : "outline"}
                      size="sm"
                      onClick={handleRielesToggle}
                    >
                      {rieles.activo ? "Activado" : "Activar"}
                    </Button>
                  )}
                </div>

                {rieles.activo && (
                  <div className="space-y-3 mt-3">
                    <div>
                      <Label htmlFor="rieles-cantidad" className="text-sm font-medium">
                        Cantidad de ventanas:
                      </Label>
                      {isPrintMode ? (
                        <p className="font-medium">{rieles.cantidadVentanas}</p>
                      ) : (
                        <Input
                          id="rieles-cantidad"
                          type="number"
                          min="1"
                          value={rieles.cantidadVentanas}
                          onChange={handleRielesCantidadChange}
                          className="mt-1"
                        />
                      )}
                    </div>

                    <div>
                      <Label htmlFor="rieles-metros" className="text-sm font-medium">
                        Metros por ventana:
                      </Label>
                      {isPrintMode ? (
                        <p className="font-medium">{rieles.metrosPorVentana || windowWidth.toFixed(2)} m</p>
                      ) : (
                        <Input
                          id="rieles-metros"
                          type="number"
                          step="0.1"
                          min="0"
                          value={rieles.metrosPorVentana}
                          onChange={handleRielesMetrosChange}
                          className="mt-1"
                          placeholder={`Ancho actual: ${windowWidth.toFixed(2)}m`}
                        />
                      )}
                    </div>

                    <div className="text-sm text-green-700">
                      Costo: {rieles.cantidadVentanas} ventana(s) × {rieles.metrosPorVentana || windowWidth.toFixed(2)}m × 
                      ${BASE_PRICES.RAIL.toLocaleString()} = 
                      <span className="font-bold"> ${costoRieles.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Instalación */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-orange-600" />
                    <h4 className="font-semibold">Instalación</h4>
                  </div>
                  {!isPrintMode && (
                    <Button
                      variant={instalacion.activo ? "default" : "outline"}
                      size="sm"
                      onClick={handleInstalacionToggle}
                    >
                      {instalacion.activo ? "Activado" : "Activar"}
                    </Button>
                  )}
                </div>

                {instalacion.activo && (
                  <div className="space-y-3 mt-3">
                    <div>
                      <Label htmlFor="instalacion-cantidad" className="text-sm font-medium">
                        Cantidad de ventanas:
                      </Label>
                      {isPrintMode ? (
                        <p className="font-medium">{instalacion.cantidadVentanas}</p>
                      ) : (
                        <Input
                          id="instalacion-cantidad"
                          type="number"
                          min="1"
                          value={instalacion.cantidadVentanas}
                          onChange={handleInstalacionCantidadChange}
                          className="mt-1"
                        />
                      )}
                    </div>

                    <div className="text-sm text-orange-700">
                      Costo: {instalacion.cantidadVentanas} ventana(s) × 
                      ${BASE_PRICES.INSTALLATION.toLocaleString()} = 
                      <span className="font-bold"> ${costoInstalacion.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cálculo del total */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-3">Cálculo del total:</h4>
              
              <div className="space-y-3">
                {/* Cálculo por cortina */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Precio por cortina:</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Fórmula:</span>
                    <span className="font-medium">
                      {formulaPersonalizada.activa 
                        ? `${windowWidth.toFixed(2)}m × ${formulaPersonalizada.multiplicador} × $${formulaPersonalizada.precioPersonalizado.toLocaleString()} + ${ADICIONAL_FIJO.toLocaleString()}`
                        : `${windowWidth.toFixed(2)}m × 2 × $${PRECIO_POR_METRO.toLocaleString()} + ${ADICIONAL_FIJO.toLocaleString()}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total por cortina:</span>
                    <span className="font-medium">
                      ${totalPorCortina.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Cálculo general */}
                <div className="border-t pt-2 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Cálculo general:</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {cantidadCortinas} cortina{cantidadCortinas > 1 ? 's' : ''} × ${totalPorCortina.toLocaleString()}
                    </span>
                    <span className="font-medium">
                      = ${totalCortinas.toLocaleString()}
                    </span>
                  </div>

                  {/* Servicios adicionales */}
                  {totalServicios > 0 && (
                    <>
                      <div className="border-t pt-2 mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Servicios adicionales:</p>
                        {costoTomaMedidas > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Toma de medidas:</span>
                            <span className="font-medium">+ ${costoTomaMedidas.toLocaleString()}</span>
                          </div>
                        )}

                        {costoRieles > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Rieles:</span>
                            <span className="font-medium">+ ${costoRieles.toLocaleString()}</span>
                          </div>
                        )}

                        {costoInstalacion > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Instalación:</span>
                            <span className="font-medium">+ ${costoInstalacion.toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm font-bold mt-2">
                          <span>Total servicios:</span>
                          <span>+ ${totalServicios.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total general:</span>
                      <span className="text-primary text-xl">
                        ${totalGeneral.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón para descargar PDF - Solo mostrar si no está en modo impresión */}
      {!isPrintMode && (
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-3 opacity-90" />
            <p className="text-sm opacity-90 mb-4">
              Total final:{" "}
              <span className="text-2xl font-bold">
                ${totalGeneral.toLocaleString()}
              </span>
            </p>

            <PDFDownloadLink
              document={
                <PresupuestoPDF 
                  data={data} 
                  total={totalGeneral}
                  totalPorCortina={totalPorCortina}
                  totalServicios={totalServicios}
                  serviciosAdicionales={serviciosAdicionales}
                  precioPorMetro={formulaPersonalizada.activa ? formulaPersonalizada.precioPersonalizado : PRECIO_POR_METRO}
                  adicionalFijo={ADICIONAL_FIJO} // ← Nueva prop
                  formulaPersonalizada={formulaPersonalizada}
                  // Agregar estas props para consistencia
                  cantidadCortinas={cantidadCortinas}
                  windowWidth={windowWidth}
                  windowHeight={windowHeight}
                  PRECIO_POR_METRO={PRECIO_POR_METRO} // Pasar la constante
                  ADICIONAL_FIJO={ADICIONAL_FIJO} // Pasar la constante
                />
              }
              fileName={`presupuesto-cortinas-${Date.now()}.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? "Generando PDF..." : "Descargar Presupuesto"}
                </Button>
              )}
            </PDFDownloadLink>
          </CardContent>
        </Card>
      )}
    </div>
  );
};