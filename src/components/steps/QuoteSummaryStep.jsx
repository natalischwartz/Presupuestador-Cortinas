import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator, Ruler, SwatchBook , Scissors, Settings, Wrench, DollarSign, Info } from "lucide-react";

// Precios base (idealmente estos vendrían de variables de entorno)
const BASE_PRICES = {
  CONFECTION: 11000, // Precio base por metro lineal de confección
  CONFECTION_EXTRA: 22000, // Precio para alturas > 2.70m
  RAIL: 19500, // Precio por metro de riel
  INSTALLATION: 25000, // Precio fijo de instalación
  MEASUREMENT_CABA: 20000, // Toma de medidas en CABA
  MEASUREMENT_GBA: 30000 // Toma de medidas fuera de CABA
};

export const QuoteSummaryStep = ({ data }) => {
  // 1. Obtener medidas de la cortina
  const getWindowHeight = () => {
    if (data.heightOption === 'custom' && data.customHeight) {
      return data.customHeight;
    }
  };

  const getWindowWidth = () => {
    if (data.customWidth) {
      return data.customWidth;
    }
  };

  const windowHeight = getWindowHeight();
  const windowWidth = getWindowWidth();
  
  // 2. Cálculo de tela necesaria
  const anchoConMultiplicadorDeCabezal = windowWidth * data.multiplier;
  // console.log(anchoConMultiplicadorDeCabezal);
  const altoConAgregados = windowHeight + 0.30 + 0.10; // + dobladillo + cabezal
  // console.log(altoConAgregados)

  // Verificar si el ancho de la tela cubre el alto necesario
  const anchoTelaCubreAlto = data.selectedFabric 
  ? data.fabricWidth >= altoConAgregados
  : false;
  console.log(anchoTelaCubreAlto);//boolean
  
  let metrosTelaNecesarios = 0;
  let panosNecesarios = 1;
  
  if (anchoTelaCubreAlto) {
    // Caso 1: El ancho de la tela cubre el alto
    metrosTelaNecesarios = Math.ceil(anchoConMultiplicadorDeCabezal);
  } else {
    // Caso 2: Necesitamos calcular paños
    panosNecesarios = Math.ceil(anchoConMultiplicadorDeCabezal / data.selectedFabric?.width);
    metrosTelaNecesarios = panosNecesarios * altoConAgregados;
  }

  // 3. Cálculo de costos
  // Precio de confección según altura
  const precioConfeccion = windowHeight > 2.70 ? BASE_PRICES.CONFECTION_EXTRA : BASE_PRICES.CONFECTION;
  
  // Costo de tela
  const costoTotalTela = metrosTelaNecesarios * data.selectedFabric?.price;
  
  // Costo de confección
  const costoConfeccion = anchoTelaCubreAlto 
    ? Math.ceil(anchoConMultiplicadorDeCabezal) * precioConfeccion
    : panosNecesarios * data.selectedFabric?.width * precioConfeccion;
  
  // Costo de riel (si no tiene instalación)
  const necesitaRiel = !data.hasInstallation && data.railNeeded;
  const metrosRiel = necesitaRiel ? Math.ceil(windowWidth * 1.1) : 0; // +10% para solapamiento
  const costoRiel = metrosRiel * BASE_PRICES.RAIL;
  
  // Costo de instalación
  const costoInstalacion = data.hasInstallation ? BASE_PRICES.INSTALLATION : 0;
  
  // Costo de toma de medidas
  const costoMedidas = data.ubicacion === 'CABA' 
    ? BASE_PRICES.MEASUREMENT_CABA 
    : BASE_PRICES.MEASUREMENT_GBA;

  // Total general
  const subtotal = costoTotalTela + costoConfeccion + costoRiel + costoInstalacion + costoMedidas;
  const total = subtotal;

  // Datos para mostrar en la UI
  const summaryItems = [
    {
      icon: Ruler,
      title: 'Medidas',
      details: [
        `Alto ventana: ${windowHeight.toFixed(2)}m`,
        `Ancho ventana: ${windowWidth.toFixed(2)}m`,
        `Multiplicador cabezal: x${data.multiplier}`,
        // `Ancho total cortina: ${anchoConMultiplicadorDeCabezal.toFixed(2)}m`,
        // `Alto total cortina: ${altoConAgregados.toFixed(2)}m`,
      ]
    },
    {
      icon: SwatchBook,
      title: 'Tela',
      details: [
        `Tipo: ${data.selectedFabric ? data.fabricName : 'No seleccionado'}`,
        `Ancho: ${data.selectedFabric? data.fabricWidth : "No seleccionado"}`,
        `Precio: $${data.selectedFabric? data.fabricPrice : "No seleccionado"}/m`,
        // `Metros necesarios: ${metrosTelaNecesarios.toFixed(2)}m`,
        // telaCubreAlto ? '✅ Corte optimizado' : `✂️ Paños necesarios: ${panosNecesarios}`
      ]
    },
    {
      icon: Scissors,
      title: 'Confección',
      details: [
        // `Precio: $${precioConfeccion}/m lineal`,
        `Técnica: ${anchoTelaCubreAlto ? 'Corte simple' : 'Confección por paños'}`,
        `Total confección: $${costoConfeccion.toLocaleString()}`
      ]
    }
  ];

  const costItems = [
    { 
      label: 'Tela', 
      amount: costoTotalTela, 
      icon: SwatchBook, 
      details: `${metrosTelaNecesarios.toFixed(2)}m x $${data.selectedFabric?.price}/m` 
    },
    { 
      label: 'Confección', 
      amount: costoConfeccion, 
      icon: Scissors,
      details: `${anchoTelaCubreAlto ? 'Corte simple' : `${panosNecesarios} paños`} x $${precioConfeccion}/m`
    },
    { 
      label: 'Riel', 
      amount: costoRiel, 
      icon: Settings, 
      included: necesitaRiel,
      details: necesitaRiel ? `${metrosRiel}m x $${BASE_PRICES.RAIL}/m` : 'No requiere'
    },
    { 
      label: 'Toma de medidas', 
      amount: costoMedidas, 
      icon: Ruler,
      details: `Incluye visita técnica ${data.ubicacion === 'CABA' ? 'en CABA' : 'fuera de CABA'}`
    },
    { 
      label: 'Instalación', 
      amount: costoInstalacion, 
      icon: Wrench, 
      included: data.hasInstallation,
      details: data.hasInstallation ? 'Incluye instalación profesional' : 'No requiere'
    },
  ].filter(item => item.included !== false);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Resumen del Presupuesto</h3>
        <p className="text-muted-foreground">
          Detalle completo de tu cotización
        </p>
      </div>

      {/* Resumen técnico */}
      <div className="grid md:grid-cols-3 gap-4">
        {summaryItems.map((item, index) => (
          <Card key={index} className="border-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <item.icon className="h-4 w-4 text-primary" />
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
        ))}
      </div>

      {/* Desglose de costos */}
      <Card className="shadow-elegant">
        <CardHeader className="bg-gradient-warm">
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-5 w-5" />
            Desglose de Costos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {costItems.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.details}</p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
                {index < costItems.length - 1 && <Separator />}
              </div>
            ))}
            
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

      {/* Notas importantes */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Info className="h-4 w-4 text-accent" />
              <h4 className="font-semibold text-sm">Notas importantes</h4>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>La toma de medidas requiere seña del 50% y tiene un costo de ${costoMedidas.toLocaleString()} {data.ubicacion === 'CABA' ? '(CABA)' : '(GBA)'}</span>
              </li>
              {necesitaRiel && (
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>El riel se calcula con un 10% adicional para solapamiento: {metrosRiel}m</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>La confección tiene {windowHeight > 2.70 ? 'costo adicional' : 'costo estándar'} por altura superior a 2.70m</span>
              </li>
              {data.hasInstallation && (
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>La instalación se coordina una vez que las cortinas estén listas</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Info className="h-4 w-4 text-success" />
              <h4 className="font-semibold text-sm">Garantías</h4>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Precios válidos por 30 días</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Garantía de 1 año en confección</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Tiempo de entrega estimado: 7-10 días hábiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Se aceptan todas las tarjetas de crédito</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA Final */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="p-6 text-center">
          <Calculator className="h-8 w-8 mx-auto mb-3 opacity-90" />
          <h3 className="text-xl font-bold mb-2">¡Cotización lista!</h3>
          <p className="text-sm opacity-90 mb-4">
            Total: <span className="text-2xl font-bold">${total.toLocaleString()}</span>
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button variant="outline" className="text-primary bg-white">
              Imprimir presupuesto
            </Button>
            <Button className="bg-white text-primary hover:bg-white/90">
              Confirmar pedido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};