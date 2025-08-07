import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Ruler, Shirt, Scissors, Settings, Wrench, DollarSign } from "lucide-react";

// Datos de precios (en una app real esto vendría de una base de datos)
const fabricPrices = {
  'blackout': { name: 'Blackout', pricePerMeter: 1200, width: 3.0 },
  'voile': { name: 'Voile', pricePerMeter: 800, width: 3.2 },
  'gasa': { name: 'Gasa', pricePerMeter: 650, width: 2.8 },
  'lino': { name: 'Lino', pricePerMeter: 950, width: 2.7 },
  'algodon': { name: 'Algodón', pricePerMeter: 750, width: 1.5 },
  'jacquard': { name: 'Jacquard', pricePerMeter: 1400, width: 1.4 },
};

const confectionPricePerMeter = 300; // Precio por metro lineal de confección
const railPricePerMeter = 450; // Precio por metro de riel
const installationPrice = 2500; // Precio fijo de instalación
const measurementPrice = 1000; // Precio de toma de medidas

export const QuoteSummaryStep = ({ data }) => {
  // Cálculos básicos
  const getWindowHeight = () => {
    if (data.heightOption === 'custom' && data.customHeight) {
      return data.customHeight;
    }
    // Altura estándar estimada según el tipo
    switch (data.heightOption) {
      case 'rod-to-floor': return 220;
      case 'ceiling-to-floor': return 250;
      default: return 220;
    }
  };

  const getWindowWidth = () => {
    if (data.customWidth) {
      return data.customWidth;
    }
    // Ancho estándar estimado
    switch (data.widthOption) {
      case 'window-plus': return 140; // Ventana + 20cm
      case 'wall-to-wall': return 200;
      case 'rail-width': return 180;
      default: return 140;
    }
  };

  const windowHeight = getWindowHeight();
  const windowWidth = getWindowWidth();
  const fabricData = fabricPrices[data.selectedFabric];
  
  // Cálculo de la cantidad de tela
  const fabricWidthNeeded = windowWidth * data.multiplier;
  const totalHeight = windowHeight + 15 + 25; // + cabezal + dobladillo
  
  // Optimización: si el alto es menor a 2.60m y el ancho de tela es mayor, usar ancho como alto
  const shouldOptimize = totalHeight <= 260 && fabricData?.width > 2.6;
  const fabricMetersNeeded = shouldOptimize ? 
    Math.ceil(fabricWidthNeeded / 100) : // Usar ancho de tela como alto
    Math.ceil((fabricWidthNeeded / 100) * (totalHeight / (fabricData?.width * 100 || 1)));

  // Cálculos de costos
  const fabricCost = fabricMetersNeeded * (fabricData?.pricePerMeter || 0);
  const confectionCost = fabricMetersNeeded * confectionPricePerMeter;
  
  // Riel (solo si no tiene instalación)
  const railMetersNeeded = data.hasInstallation ? 0 : Math.ceil(windowWidth / 20) * 20 / 100; // Múltiplos de 20cm
  const railCost = data.hasInstallation ? 0 : railMetersNeeded * railPricePerMeter;
  
  const measurementCost = measurementPrice; // Se cobra siempre con seña
  const finalInstallationCost = data.hasInstallation ? 0 : installationPrice;

  const subtotal = fabricCost + confectionCost + railCost + measurementCost + finalInstallationCost;
  const total = subtotal;

  const summaryItems = [
    {
      icon: Ruler,
      title: 'Medidas',
      details: [
        `Alto: ${windowHeight} cm`,
        `Ancho: ${windowWidth} cm`,
        `Alto total cortina: ${totalHeight} cm`,
      ]
    },
    {
      icon: Shirt,
      title: 'Tela',
      details: [
        `Tipo: ${fabricData?.name}`,
        `Ancho tela: ${fabricData?.width}m`,
        `Metros necesarios: ${fabricMetersNeeded}m`,
        shouldOptimize ? '✨ Corte optimizado' : ''
      ].filter(Boolean)
    },
    {
      icon: Scissors,
      title: 'Cabezal',
      details: [
        `Estilo: ${data.headerStyle}`,
        `Multiplicador: x${data.multiplier}`,
        `Ancho total: ${fabricWidthNeeded} cm`
      ]
    }
  ];

  const costItems = [
    { label: 'Tela', amount: fabricCost, icon: Shirt, included: true },
    { label: 'Confección', amount: confectionCost, icon: Scissors, included: true },
    { label: 'Riel', amount: railCost, icon: Settings, included: !data.hasInstallation },
    { label: 'Toma de medidas', amount: measurementCost, icon: Ruler, included: true },
    { label: 'Instalación', amount: finalInstallationCost, icon: Wrench, included: !data.hasInstallation },
  ].filter(item => item.included && item.amount > 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Resumen del Presupuesto</h3>
        <p className="text-muted-foreground">
          Aquí tenés el detalle completo de tu cotización
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {summaryItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="border-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                </div>
                <div className="space-y-1">
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cost Breakdown */}
      <Card className="shadow-elegant">
        <CardHeader className="bg-gradient-warm">
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-5 w-5" />
            Desglose de Costos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {costItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="font-semibold">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between py-2 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary text-xl">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-2">✅ Incluye</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Tela de primera calidad</li>
              <li>• Confección profesional</li>
              <li>• Toma de medidas a domicilio</li>
              {!data.hasInstallation && <li>• Riel y soportes</li>}
              {!data.hasInstallation && <li>• Instalación completa</li>}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-2">ℹ️ Importante</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Precios válidos por 30 días</li>
              <li>• Se requiere seña del 50%</li>
              <li>• Tiempo de entrega: 7-10 días</li>
              <li>• Garantía de 1 año</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Final CTA */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="p-6 text-center">
          <Calculator className="h-8 w-8 mx-auto mb-3 opacity-90" />
          <h3 className="text-xl font-bold mb-2">¡Tu presupuesto está listo!</h3>
          <p className="text-sm opacity-90 mb-4">
            Total: <span className="text-2xl font-bold">${total.toLocaleString()}</span>
          </p>
          <p className="text-xs opacity-75">
            Contactanos para confirmar tu pedido y coordinar la toma de medidas
          </p>
          <button type="button" onClick={()=>console.log(data)}>haz click</button>
        </CardContent>
      </Card>
    </div>
  );
};

