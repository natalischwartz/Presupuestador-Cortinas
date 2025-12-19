import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DollarSign, Download, Ruler, Settings, Wrench, Calculator, Edit } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PresupuestoPDF } from "./PresupuestoPDF";
import { useQuoteStore } from "@/store/quoteStore"; // Importa el store


export const QuoteSummaryStep = ({ data, updateData, isPrintMode = false }) => {

    // Usa el store de Zustand
  const {  updateQuote, 
    calculateTotal,
    getCompleteCalculation,
    normalizeQuoteData,
    PRECIO_POR_METRO,
    PRECIO_POR_METRO_ROLLER,
    ADICIONAL_FIJO,
    formatCurrency,
  getBasePrices } = useQuoteStore();

  const BASE_PRICES = getBasePrices();

  // Estado local simplificado
  const [localData, setLocalData] = useState(() => {
    const baseData = { ...data };
    if (!isPrintMode) {
      // Normalizar datos iniciales
      const normalized = normalizeQuoteData(baseData);
      return normalized;
    }
    return baseData;
  });

   // Estado para fórmula personalizada (solo UI)
  const [formulaEditMode, setFormulaEditMode] = useState(false);


   const calcularValorAutomatico = () =>{
    const ancho = Number(localData.customWidth) || 0;
    const multiplicador = Number(localData.multiplier) || 2;
    return ancho * multiplicador;
  }


  // Calcular todo usando el store
  const calculations = getCompleteCalculation(localData);

   const {
    totalPorCortina,
    totalCortinas,
    cantidadCortinas,
    totalServicios,
    totalGeneral,
    tomaMedidas,
    rieles,
    instalacion,
    calculoDetalle,
    windowWidth,
    windowHeight
  } = calculations;

  //debug verificamos cambios en datos 

  useEffect(()=>{
    console.log('localData actualizado:',{
      formulaValorPersonalizado:localData.formulaValorPersonalizado,
      formulaPrecioPersonalizado: localData.formulaPrecioPersonalizado,
      adicionalFijo: localData.adicionalFijo,
      formulaPersonalizadaActiva:localData.formulaPersonalizadaActiva
    });
  },[localData]
)

  // Actualizar store cuando cambian los datos
  useEffect(() => {
    if (!isPrintMode && localData.id) {
      const timer = setTimeout(() => {
        const normalized = normalizeQuoteData(localData);
        const total = calculateTotal(normalized);
        
        updateQuote(localData.id, {
          ...normalized,
          totalPrice: total
        });

        // Actualizar componente padre si es necesario
        if (updateData) {
          updateData(normalized);
        }
      }, 300); // Debounce para evitar demasiadas actualizaciones

      return () => clearTimeout(timer);
    }
  }, [localData, isPrintMode]);

 

  const handleValorPersonalizadoChange = (value) => {
  if (isPrintMode) return;
  const numValue = Number(value) || 0;
  
  // ✅ Actualiza MULTIPLES campos
  const updates = {
    formulaValorPersonalizado: numValue,
    formulaPersonalizadaActiva: true  // ¡ESTO ES LO NUEVO!
  };
  
  setLocalData(prev => ({ ...prev, ...updates }));
  
  // También pasar al padre
  if (updateData) {
    updateData(updates);
  }
};

const handlePrecioPersonalizadoChange = (value) => {
  if (isPrintMode) return;
  const numValue = Number(value) || PRECIO_POR_METRO;
  
  // ✅ Actualiza MULTIPLES campos
  const updates = {
    formulaPrecioPersonalizado: numValue,
    formulaPersonalizadaActiva: true  // ¡ESTO ES LO NUEVO!
  };
  
  setLocalData(prev => ({ ...prev, ...updates }));
  
  // También pasar al padre
  if (updateData) {
    updateData(updates);
  }
};

   const handleToggleFormula = () => {
    if (isPrintMode) return;
    const nuevoEstado = !localData.formulaPersonalizadaActiva;
    console.log("cambiando formula a:", nuevoEstado ? "personalizada" :"estandar")
    setLocalData(prev => ({
      ...prev,
      formulaPersonalizadaActiva:nuevoEstado
    }));
  };

  // Handlers para servicios
  const handleToggleService = (service) => {
    if (isPrintMode) return;
    const nuevoValor = !localData[service];
  console.log(`🔄 Toggle ${service}:`, {
    actual: localData[service],
    nuevo: nuevoValor
  });
  const updatedData = {
    ...localData,
    [service]: nuevoValor
  };
  
  setLocalData(updatedData);
  
  // ✅ IMPORTANTE: Actualizar al padre
  if (updateData) {
    updateData({ [service]: nuevoValor });
  }
  };

   const handleServiceQuantityChange = (service, value) => {
    if (isPrintMode) return;
    const numValue = Math.max(1,Number(value) || 1);
    console.log(`🔄 Cambio cantidad ${service}:`, {
    actual: localData[service],
    nuevo: numValue
  });
   const updatedData = {
    ...localData,
    [service]: numValue
  };
  
  setLocalData(updatedData);
  
  // ✅ IMPORTANTE: Actualizar al padre
  if (updateData) {
    updateData({ [service]: numValue });
  }
  };

  const handleUbicacionChange = (ubicacion) => {
    if (isPrintMode) return;
    setLocalData(prev => ({
      ...prev,
      ubicacionTM: ubicacion
    }));
  };

   const handleMetrosChange = (value) => {
    if (isPrintMode) return;
    setLocalData(prev => ({
      ...prev,
      metrosPorVentana: Number(value) || 0
    }));
  };


// Handlers corregidos para cantidad de cortinas
const handleIncrement = () => {
  if (isPrintMode) return;
  const newQuantity = (localData.curtainQuantity || 1) + 1;
  
  setLocalData(prev => ({
    ...prev,
    curtainQuantity: newQuantity
  }));
  
  // ✅ CRÍTICO: Actualizar también al padre
  if (updateData) {
    updateData({ curtainQuantity: newQuantity });
  }
};

const handleDecrement = () => {
  if (isPrintMode) return;
  const newQuantity = Math.max(1, (localData.curtainQuantity || 1) - 1);
  
  setLocalData(prev => ({
    ...prev,
    curtainQuantity: newQuantity
  }));
  
  // ✅ CRÍTICO: Actualizar también al padre
  if (updateData) {
    updateData({ curtainQuantity: newQuantity });
  }
};

const handleCantidadInputChange = (e) =>{
  if(isPrintMode) return;
  const value = Number(e.target.value) || 1;

   // Actualizar estado local
  const updatedData = {
    ...localData,
    curtainQuantity: Math.max(1, value)
  };

   setLocalData(updatedData);

   // ✅ CRÍTICO: Actualizar también al padre
  if (updateData) {
    updateData({ curtainQuantity: Math.max(1, value) });
  }


}
//Handlers para fórmula (modo edicion)
 const handleEditarFormula = () => {
    if (isPrintMode) return;
    setFormulaEditMode(true)
};


  const handleGuardarFormula = () => {
    if (isPrintMode) return;
    setFormulaEditMode(false);
  };

  const handleCancelarEdicion = () => {
  if (isPrintMode) return;
  //restaurar valore0s originales
  setLocalData(prev =>({
    ...prev,
    formulaValorPersonalizado: data.formulaValorPersonalizado  || (windowWidth*2),
    formulaPrecioPersonalizado: data.formulaPrecioPersonalizado  || PRECIO_POR_METRO,
    adicionalFijo: data.adicionalFijo  || ADICIONAL_FIJO
  }) )
    
  }; 

 


const costoTomaMedidas = tomaMedidas?.costo  || 0;
const costoRieles = rieles?.costo  || 0;
const costoInstalacion = instalacion?.costo  || 0;

//obtener el valor a mostrar en el form
const mostrarValorPersonalizado = localData.formulaValorPersonalizado || calcularValorAutomatico();



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
                        onChange={handleCantidadInputChange}
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
                    {localData.curtainType || "tradicional"}
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

              {localData.selectedFabric && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Tela seleccionada:</p>
                  <p className="font-medium">{localData.fabricName}</p>
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
                  variant={localData.formulaPersonalizadaActiva  ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleFormula}
                >
                  {localData.formulaPersonalizadaActiva  ? "Personalizada" : "Estándar"}
                </Button>
              </div>

              {localData.formulaPersonalizadaActiva  ? (
                <div className="space-y-3">
                  {/* BOTONES DE EDITAR/GUARDAR */}
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Fórmula personalizada:
                    </Label>
                    {!formulaEditMode ? (
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

                  {/* CAMPOS EDITABLES CUANDO ESTÁ EN MODO EDICIÓN */}
                  {formulaEditMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="valor-personalizado" className="text-sm font-medium">
                          Valor:
                        </Label>
                        <Input
                          id="valor-personalizado"
                          type="number"
                          inputMode="decimal"
                          step="0.1"
                          min="0.1"
                          value={mostrarValorPersonalizado}
                          onChange={(e) => handleValorPersonalizadoChange(e.target.value)}
                          className="mt-1"
                           onWheel={(e) => e.target.blur()} // Evita scroll cambie valor
                        />
                      </div>
                      <div>
                        <Label htmlFor="precio-personalizado" className="text-sm font-medium">
                          Precio por metro:
                        </Label>
                        <Input
                          id="precio-personalizado"
                          type="number"
                          inputMode="numeric"
                          min="1"
                          value={localData.formulaPrecioPersonalizado}
                          onChange={(e) => handlePrecioPersonalizadoChange(e.target.value)}
                          className="mt-1"
                           onWheel={(e) => e.target.blur()}
                        />
                      </div>
                       <div>
                        <Label htmlFor="adicional-fijo" className="text-sm font-medium">
                          Adicional fijo:
                        </Label>
                        <Input
                          id="adicional-fijo"
                          type="number"
                          inputMode="numeric"
                          min="1"
                          value={localData.adicionalFijo}
                          onChange={(e) => setLocalData(prev => ({
                        ...prev,
                        adicionalFijo: Number(e.target.value) || ADICIONAL_FIJO
                      }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ) : (
                    // VISUALIZACIÓN CUANDO NO ESTÁ EDITANDO
                    <div className="text-sm text-purple-700">
                      <p>Fórmula actual: <strong>valor x precio + adicional fijo</strong></p>
                      <p className="text-xs mt-1">
                        <strong>Valor:</strong>{localData.formulaValorPersonalizado?.toFixed(2) || calcularValorAutomatico().toFixed(2)}|
                        <strong>Pecio</strong>{formatCurrency(localData.formulaPrecioPersonalizado)} |
                        <strong>Adicional</strong> {formatCurrency(localData.adicionalFijo)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // VISUALIZACIÓN CUANDO NO ESTÁ ACTIVA LA FÓRMULA PERSONALIZADA
                <div className="text-sm text-purple-700">
                  <p>Usando fórmula {localData.curtainType === 'roller' ? 'Roller' : 'tradicional'}:</p>
                  <p className="font-bold mt-1">
                    {localData.curtainType === 'roller' ? (
                      <span>
                        (Ancho × {formatCurrency(PRECIO_POR_METRO_ROLLER)} + Ancho × Alto × {formatCurrency(PRECIO_POR_METRO_ROLLER)}) *2 + {formatCurrency(ADICIONAL_FIJO)}
                      </span>
                    ) : (
                      <span>
                        Valor x {formatCurrency(PRECIO_POR_METRO)} + {formatCurrency(ADICIONAL_FIJO)}
                      </span>
                    )}
                  </p>
                  <div className="text-xs mt-2 text-purple-600">
                    {localData.curtainType === 'roller' ? (
                      <div>
                        <p><strong>Donde:</strong></p>
                        <p>• Sistema = Ancho × {formatCurrency(PRECIO_POR_METRO_ROLLER)}</p>
                        <p>• Tela = Ancho × Alto × {formatCurrency(PRECIO_POR_METRO_ROLLER)}</p>
                        <p>• (Sistema + Tela) × 2 + Adicional fijo = {formatCurrency(ADICIONAL_FIJO)}</p>

                      </div>
                    ) : (
                        <div>
                        <p><strong>Donde:</strong></p>
                        <p>• Valor = Ancho × 2 o ({(windowWidth * 2).toFixed(2)})</p>
                        <p>• Precio por metro = {formatCurrency(PRECIO_POR_METRO)}</p>
                        <p>• Adicional fijo = {formatCurrency(ADICIONAL_FIJO)}</p>
                      </div>
                    )}
                  </div>
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
                      variant={localData.necesitaTM ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleService('necesitaTM')}
                    >
                       {localData.necesitaTM ? "Activado" : "Activar"}
                    </Button>
                  )}
                </div>

                {localData.necesitaTM && (
                  <div className="space-y-3 mt-3">
                    <div>
                      <Label htmlFor="tm-cantidad" className="text-sm font-medium">
                        Cantidad de ventanas:
                      </Label>
                      {isPrintMode ? (
                        <p className="font-medium">{localData.cantidadVentanas}</p>
                      ) : (
                        <Input
                          id="tm-cantidad"
                          type="number"
                          min="1"
                          value={localData.cantidadVentanas || 1}
                          onChange={(e) => handleServiceQuantityChange('cantidadVentanas', e.target.value)}
                          className="mt-1"
                        />
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium block mb-2">
                        Ubicación:
                      </Label>
                      {isPrintMode ? (
                        <p className="font-medium">{localData.ubicacionTM}</p>
                      ) : (
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={localData.ubicacionTM === 'CABA'}
                              onChange={() => handleUbicacionChange('CABA')}
                              className="mr-2"
                            />
                            CABA ({formatCurrency(BASE_PRICES.MEASUREMENT_CABA)})
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={localData.ubicacionTM === 'GBA'}
                              onChange={() => handleUbicacionChange('GBA')}
                              className="mr-2"
                            />
                            GBA ({formatCurrency(BASE_PRICES.MEASUREMENT_GBA)})
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-blue-700">
                      Costo: {tomaMedidas.cantidadVentanas} ventana(s) × 
                      {formatCurrency(localData.ubicacionTM === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA:
                        BASE_PRICES.MEASUREMENT_GBA
                      )} = 
                      <span className="font-bold"> {formatCurrency(costoTomaMedidas)}</span>
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
                      variant={localData.necesitaRiel ? "default" : "outline"}
                      size="sm"
                      onClick={()=> handleToggleService('necesitaRiel')}
                    >
                      {localData.necesitaRiel ? "Activado" : "Activar"}
                    </Button>
                  )}
                </div>

                {localData.necesitaRiel && (
                  <div className="space-y-3 mt-3">
                    <div>
                      <Label htmlFor="rieles-cantidad" className="text-sm font-medium">
                        Cantidad de ventanas:
                      </Label>
                      {isPrintMode ? (
                        <p className="font-medium">{localData.cantidadVentanasRiel}</p>
                      ) : (
                        <Input
                          id="rieles-cantidad"
                          type="number"
                          min="1"
                          value={localData.cantidadVentanasRiel  || 1}
                          onChange={(e)=> handleServiceQuantityChange('cantidadVentanasRiel', e.target.value)}
                          className="mt-1"
                        />
                      )}
                    </div>

                    <div>
                      <Label htmlFor="rieles-metros" className="text-sm font-medium">
                        Metros por ventana:
                      </Label>
                      {isPrintMode ? (
                        <p className="font-medium">{localData.metrosPorVentana || windowWidth.toFixed(2)} m</p>
                      ) : (
                        <Input
                          id="rieles-metros"
                          type="number"
                          step="0.1"
                          min="0"
                          value={localData.metrosPorVentana  || ''}
                          onChange={(e)=>handleMetrosChange(e.target.value)}
                          className="mt-1"
                          placeholder={`Ancho actual: ${windowWidth.toFixed(2)}m`}
                        />
                      )}
                    </div>

                    <div className="text-sm text-green-700">
                      Costo: {localData.cantidadVentanasRiel  || 1} ventana(s) × {localData.metrosPorVentana || windowWidth.toFixed(2)}m × 
                      {formatCurrency(BASE_PRICES.RAIL)} = 
                      <span className="font-bold"> {formatCurrency(costoRieles)}</span>
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
                      variant={localData.hasInstallation ? "default" : "outline"}
                      size="sm"
                      onClick={()=> handleToggleService('hasInstallation')}
                    >
                      {localData.hasInstallation ? "Activado" : "Activar"}
                    </Button>
                  )}
                </div>

                {localData.hasInstallation && (
                  <div className="space-y-3 mt-3">
                    <div>
                      <Label htmlFor="instalacion-cantidad" className="text-sm font-medium">
                        Cantidad de ventanas:
                      </Label>
                      {isPrintMode ? (
                        <p className="font-medium">{localData.cantidadVentanasInstalacion}</p>
                      ) : (
                        <Input
                          id="instalacion-cantidad"
                          type="number"
                          min="1"
                          value={localData.cantidadVentanasInstalacion  || 1}
                          onChange={(e)=> handleServiceQuantityChange('cantidadVentanasInstalacion', e.target.value)}
                          className="mt-1"
                        />
                      )}
                    </div>

                    <div className="text-sm text-orange-700">
                      Costo: {localData.cantidadVentanasInstalacion  || 1} ventana(s) × 
                      {formatCurrency(BASE_PRICES.INSTALLATION)} = 
                      <span className="font-bold"> {formatCurrency(costoInstalacion)}</span>
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
        {localData.formulaPersonalizadaActiva
            ? `Valor (${(localData.formulaValorPersonalizado  || calcularValorAutomatico()).toFixed(2)}) × ${formatCurrency(localData.formulaPrecioPersonalizado)} + ${formatCurrency(localData.adicionalFijo)}`
            : localData.curtainType === 'roller'
              ? `(${windowWidth.toFixed(2)}m × ${formatCurrency(PRECIO_POR_METRO_ROLLER)} + ${windowWidth.toFixed(2)}m × ${windowHeight.toFixed(2)}m × ${formatCurrency(PRECIO_POR_METRO_ROLLER)}) × 2 + ${formatCurrency(ADICIONAL_FIJO)}` 
              : `Valor (${(windowWidth*2).toFixed(2)}) × ${formatCurrency(PRECIO_POR_METRO)} + ${formatCurrency(ADICIONAL_FIJO)}`
          }
      </span>
    </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total por cortina:</span>
                    <span className="font-medium">
                     {cantidadCortinas} cortina(s) × {formatCurrency(totalPorCortina)}
                    </span>
                  </div>
                </div>

                {/* Cálculo general */}
                <div className="border-t pt-2 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Cálculo general:</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {cantidadCortinas} cortina{cantidadCortinas > 1 ? 's' : ''} × {formatCurrency(totalPorCortina)}
                    </span>
                    <span className="font-medium">
                      = {formatCurrency(totalCortinas)}
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
                            <span className="font-medium">+ {formatCurrency(costoTomaMedidas)}</span>
                          </div>
                        )}

                        {costoRieles > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Rieles:</span>
                            <span className="font-medium">+ {formatCurrency(costoRieles)}</span>
                          </div>
                        )}

                        {costoInstalacion > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Instalación:</span>
                            <span className="font-medium">+ {formatCurrency(costoInstalacion)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm font-bold mt-2">
                          <span>Total servicios:</span>
                          <span>+ {formatCurrency(totalServicios)}</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total general:</span>
                      <span className="text-primary text-xl">
                        {formatCurrency(totalGeneral)}
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
                {formatCurrency(totalGeneral)}
              </span>
            </p>

            <PDFDownloadLink
              document={
                <PresupuestoPDF 
                  data={localData} 
                  calculations = {calculations}
                  precioPorMetro={localData.formulaPersonalizadaActiva ? localData.formulaPrecioPersonalizado : PRECIO_POR_METRO}
                  adicionalFijo={localData.adicionalFijo}
                  cantidadCortinas={cantidadCortinas}
                  windowWidth={windowWidth}
                  windowHeight={windowHeight}
                  PRECIO_POR_METRO={PRECIO_POR_METRO} // Pasar la constante
                  ADICIONAL_FIJO={ADICIONAL_FIJO} // Pasar la constante
                  PRECIO_POR_METRO_ROLLER={PRECIO_POR_METRO_ROLLER}
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