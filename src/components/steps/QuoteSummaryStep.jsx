import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DollarSign, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PresupuestoPDF } from "./PresupuestoPDF";
import { useState, useEffect } from "react";

// Precio por metro (puedes hacerlo variable desde environment si quieres)
const PRECIO_POR_METRO = 65000;

export const QuoteSummaryStep = ({ data, updateData }) => {
  const [cantidadCortinas, setCantidadCortinas] = useState(data.curtainQuantity || 1);

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

  // Calcular total por cortina
  const calcularTotalPorCortina = () => {
    if (!windowWidth) return 0;
    return windowWidth * 2 * PRECIO_POR_METRO;
  };

  // Calcular total general
  const calcularTotalGeneral = () => {
    return calcularTotalPorCortina() * cantidadCortinas;
  };

  const totalPorCortina = calcularTotalPorCortina();
  const totalGeneral = calcularTotalGeneral();

  // Actualizar data cuando cambia la cantidad
  useEffect(() => {
    updateData({
      curtainQuantity: cantidadCortinas,
      totalPrice: totalGeneral
    });
  }, [cantidadCortinas, totalGeneral]);

  // Handler para cambiar la cantidad
  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setCantidadCortinas(value);
    }
  };

  // Handler para incrementar
  const handleIncrement = () => {
    setCantidadCortinas(prev => prev + 1);
  };

  // Handler para decrementar
  const handleDecrement = () => {
    if (cantidadCortinas > 1) {
      setCantidadCortinas(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Resumen de tu Cotización</h3>
        <p className="text-muted-foreground">
          Detalle simplificado de tu pedido
        </p>
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
               {/* Información del cliente */}
            {data.customerInfo && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">Información de contacto:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">Nombre:</p>
                    <p className="font-medium">{data.customerInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono:</p>
                    <p className="font-medium">{data.customerInfo.phone}</p>
                  </div>
                </div>
              </div>
            )}
              <h4 className="font-semibold text-lg mb-3">Detalles principales:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Cantidad de cortinas:</p>
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
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Tipo de cortina:</p>
                  <p className="font-medium text-lg capitalize">
                    {data.curtainType || "tradicional"}
                  </p>
                </div>
              </div>
            </div>

            {/* Medidas */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-3">Medidas:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {windowWidth.toFixed(2)}m × 2 × ${PRECIO_POR_METRO.toLocaleString()}
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
                      = ${totalGeneral.toLocaleString()}
                    </span>
                  </div>
                  
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

            {/* Información adicional si existe */}
            {data.selectedFabric && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">Tela seleccionada:</h4>
                <p className="font-medium">{data.fabricName}</p>
              </div>
            )}

           
          </div>
        </CardContent>
      </Card>

      {/* Botón para descargar PDF */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="p-6 text-center">
          <DollarSign className="h-8 w-8 mx-auto mb-3 opacity-90" />
          <p className="text-sm opacity-90 mb-2">
            {cantidadCortinas} cortina{cantidadCortinas > 1 ? 's' : ''} × ${totalPorCortina.toLocaleString()}
          </p>
          <p className="text-sm opacity-90 mb-4">
            Total final:{" "}
            <span className="text-2xl font-bold">
              ${totalGeneral.toLocaleString()}
            </span>
          </p>

          <PDFDownloadLink
            document={
              <PresupuestoPDF 
                data={[data]} 
                precioPorMetro={PRECIO_POR_METRO} 
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
    </div>
  );
};