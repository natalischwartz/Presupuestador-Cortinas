import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Calculator,
  Ruler,
  SwatchBook,
  Scissors,
  Settings,
  Wrench,
  DollarSign,
  Info,
} from "lucide-react";

// Precios base (idealmente estos vendrían de variables de entorno)
const BASE_PRICES = {
  CONFECTION: 11000, // Precio base por metro lineal de confección
  CONFECTION_EXTRA: 22000, // Precio para alturas > 2.70m
  RAIL: 19500, // Precio por metro de riel
  INSTALLATION: 25000, // Precio fijo de instalación
  MEASUREMENT_CABA: 20000, // Toma de medidas en CABA
  MEASUREMENT_GBA: 30000, // Toma de medidas fuera de CABA
};

export const QuoteSummaryStep = ({ data, updateData }) => {
  // 1. Obtener medidas de la cortina
  const getWindowHeight = () => {
    if (data.heightOption === "custom" && data.customHeight) {
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
  const altoConAgregados = windowHeight + 0.3 + 0.1; // + dobladillo + cabezal
  // console.log(altoConAgregados)

  // Verificar si el ancho de la tela cubre el alto necesario
  //hay que pasar el data.fabricWidth a solo numero asi compara

  const anchoNumerico = parseInt(data.fabricWidth); // Esto funciona porque parseInt lee hasta el primer caracter no numérico
  // console.log(anchoNumerico);//devuelve 3

  const anchoTelaCubreAlto = data.selectedFabric
    ? anchoNumerico >= altoConAgregados
    : false;
  console.log(anchoTelaCubreAlto); //boolean

  let metrosTelaNecesarios = 0;
  let panosNecesarios = 1;

  if (anchoTelaCubreAlto) {
    // Caso 1: El ancho de la tela cubre el alto
    metrosTelaNecesarios = Math.ceil(anchoConMultiplicadorDeCabezal);
    // console.log(metrosTelaNecesarios);
  } else {
    // Caso 2: Necesitamos calcular paños
    panosNecesarios = Math.ceil(anchoConMultiplicadorDeCabezal / anchoNumerico);
    metrosTelaNecesarios = panosNecesarios * altoConAgregados;
  }

  // 3. Cálculo de costos
  // Precio de confección según altura. estoque vaya en variables de entorno
  const precioConfeccion =
    windowHeight > 2.7 ? BASE_PRICES.CONFECTION_EXTRA : BASE_PRICES.CONFECTION;

  // Costo de tela
  const costoTotalTela = metrosTelaNecesarios * data.fabricPrice;
  // console.log(costoTotalTela);

  // Costo de confección
  const costoConfeccion = anchoTelaCubreAlto
    ? metrosTelaNecesarios * precioConfeccion
    : Math.ceil(panosNecesarios * anchoNumerico) * precioConfeccion;
  console.log(costoConfeccion);

  //Costo de riel. si el cliente quiere o no
  const necesitaRiel = !data.hasInstallation && data.railNeeded;
  const metrosRiel = necesitaRiel ? Math.ceil(windowWidth * 1.1) : 0; // +10% para solapamiento
  const costoRiel = metrosRiel * BASE_PRICES.RAIL;

  const rielOptions = [
    { id: "si-riel", label: "Sí, necesito riel/barral" },
    { id: "no-riel", label: "No, ya tengo el riel instalado" },
  ];

  // Costo de instalación
  const costoInstalacion = data.hasInstallation ? BASE_PRICES.INSTALLATION : 0;

  //Costo de toma de medidas. que el cliente lo pueda seleccionar
  // const costoTomaMedidas =
  //   data.ubicacion === "CABA"
  //     ? BASE_PRICES.MEASUREMENT_CABA
  //     : BASE_PRICES.MEASUREMENT_GBA;
  const tomaMedidasOptions = [
    { id: "si-tm", label: "Sí, necesito toma de medidas" },
    { id: "no-tm", label: "No, ya tengo las medidas" },
  ];

  // Handlers para Riel
  const handleRielChange = (optionId) => {
    updateData({
      necesitaRiel: optionId === "si-riel",
      metrosRiel: optionId === "si-riel" ? 0 : undefined,
    });
  };

  const handleMetrosRielChange = (value) => {
    updateData({ metrosRiel: Number(value) });
  };

  // Handlers para Toma de Medidas

  const handleTomaMedidasChange = (optionId) => {
    updateData({
      necesitaTM: optionId === "si-tm",
      cantidadVentanas: optionId === "si-tm" ? 1 : undefined,
      ubicacionTM: optionId === "si-tm" ? "CABA" : undefined,
    });
  };

  const handleCantidadVentanasChange = (value) => {
    updateData({ cantidadVentanas: Number(value) });
  };

  const handleUbicacionChange = (value) => {
    updateData({ ubicacionTM: value });
  };

  // Total general
  const subtotal =
    costoTotalTela +
    costoConfeccion +
    costoRiel +
    costoInstalacion 
    // costoTomaMedidas;
  const total = subtotal;

  // Datos para mostrar en la UI
  const summaryItems = [
    {
      icon: Ruler,
      title: "Medidas",
      details: [
        `Alto ventana: ${windowHeight}m`,
        `Ancho ventana: ${windowWidth}m`,
        `Multiplicador cabezal: x${data.multiplier}`,
        // `Ancho total cortina: ${anchoConMultiplicadorDeCabezal.toFixed(2)}m`,
        // `Alto total cortina: ${altoConAgregados.toFixed(2)}m`,
      ],
    },
    {
      icon: SwatchBook,
      title: "Tela",
      details: [
        `Tipo: ${data.selectedFabric ? data.fabricName : "No seleccionado"}`,
        `Ancho: ${data.selectedFabric ? data.fabricWidth : "No seleccionado"}`,
        `Precio: $${
          data.selectedFabric ? data.fabricPrice : "No seleccionado"
        }/m`,
        // `Metros necesarios: ${metrosTelaNecesarios.toFixed(2)}m`,
        // telaCubreAlto ? '✅ Corte optimizado' : `✂️ Paños necesarios: ${panosNecesarios}`
      ],
    },
    {
      icon: Scissors,
      title: "Confección",
      details: [
        // `Precio: $${precioConfeccion}/m lineal`,
        `Técnica: ${
          anchoTelaCubreAlto ? "Corte simple" : "Confección por paños"
        }`,
        `Total confección: $${costoConfeccion.toLocaleString()}`,
      ],
    },
  ];

  const costItems = [
    {
      label: "Tela",
      amount: costoTotalTela,
      icon: SwatchBook,
      details: `${metrosTelaNecesarios.toFixed(2)}m x $${data.fabricPrice}/m`,
    },
    {
      label: "Confección",
      amount: costoConfeccion,
      icon: Scissors,
      details: `${
        anchoTelaCubreAlto ? "Corte simple" : `${panosNecesarios} paños`
      }`,
    },
    {
      label: "Riel",
      amount: costoRiel,
      icon: Settings,
      included: necesitaRiel,
      details: necesitaRiel
        ? `${metrosRiel}m x $${BASE_PRICES.RAIL}/m`
        : "No requiere",
    },
    // {
    //   label: "Toma de medidas",
    //   amount: costoTomaMedidas,
    //   icon: Ruler,
    //   details: `Incluye visita técnica ${
    //     data.ubicacion === "CABA" ? "en CABA" : "fuera de CABA"
    //   }`,
    // },
    {
      label: "Instalación",
      amount: costoInstalacion,
      icon: Wrench,
      included: data.hasInstallation,
      details: data.hasInstallation
        ? "Incluye instalación profesional"
        : "No requiere",
    },
  ].filter((item) => item.included !== false);

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
                      <p className="text-xs text-muted-foreground">
                        {item.details}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
                {index < costItems.length - 1 && <Separator />}
              </div>
            ))}
              {/* Sección de Toma de Medidas */}
            {/* <Card className="border-secondary/20 mt-6">
              <CardContent className="p-6"> */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="text-sm">Toma de medidas</h4>
                </div>

                <div className="space-y-3">
                  {tomaMedidasOptions.map((option) => (
                    <div key={option.id}>
                      <label
                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                          data.necesitaTM === (option.id === "si-tm")
                            ? "border-secondary bg-secondary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="tomaMedidas"
                          checked={data.necesitaTM === (option.id === "si-tm")}
                          onChange={() => handleTomaMedidasChange(option.id)}
                          className="sr-only"
                        />
                        {/* Estilo del radio button */}
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            data.necesitaTM === (option.id === "si-tm")
                              ? "border-secondary bg-secondary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {data.necesitaTM === (option.id === "si-tm") && (
                            <div className="w-2 h-2 bg-secondary-foreground rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                        <span className="text-sm">{option.label}</span>
                      </label>

                      {data.necesitaTM === true && option.id === "si-tm" && (
                        <div className="mt-2 p-4 bg-muted/30 rounded-lg space-y-3">
                          <div>
                            <Label
                              htmlFor="cantidad-ventanas"
                              className="text-sm font-medium"
                            >
                              Cantidad de ventanas
                            </Label>
                            <Input
                              id="cantidad-ventanas"
                              type="number"
                              value={data.cantidadVentanas ?? 1}
                              onChange={(e) =>
                                handleCantidadVentanasChange(e.target.value)
                              }
                              min="1"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium block mb-2">
                              Ubicación
                            </Label>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => handleUbicacionChange("CABA")}
                                className={`px-3 py-1 text-sm rounded-md ${
                                  data.ubicacionTM === "CABA"
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                CABA ($20,000)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUbicacionChange("GBA")}
                                className={`px-3 py-1 text-sm rounded-md ${
                                  data.ubicacionTM === "GBA"
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                GBA ($30,000)
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              {/* </CardContent>
            </Card> */}
          

            {/* Sección de Riel */}
            <Card className="border-accent/20 mt-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Settings className="h-5 w-5 text-accent" />
                  </div>
                  <h4 className="text-lg font-semibold">Riel/Barral</h4>
                </div>

                <div className="space-y-3">
                  {rielOptions.map((option) => (
                    <div key={option.id}>
                      <label
                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                          data.necesitaRiel === (option.id === "si-riel")
                            ? "border-accent bg-accent/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="riel"
                          checked={
                            data.necesitaRiel === (option.id === "si-riel")
                          }
                          onChange={() => handleRielChange(option.id)}
                          className="sr-only"
                        />
                        {/* Estilo del radio button */}
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            data.necesitaRiel === (option.id === "si-riel")
                              ? "border-accent bg-accent"
                              : "border-muted-foreground"
                          }`}
                        >
                          {data.necesitaRiel === (option.id === "si-riel") && (
                            <div className="w-2 h-2 bg-accent-foreground rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                        <span className="text-sm">{option.label}</span>
                      </label>

                      {data.necesitaRiel === true &&
                        option.id === "si-riel" && (
                          <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                            <Label
                              htmlFor="metros-riel"
                              className="text-sm font-medium"
                            >
                              Metros de riel necesarios
                            </Label>
                            <Input
                              id="metros-riel"
                              type="number"
                              value={data.metrosRiel ?? ""}
                              onChange={(e) =>
                                handleMetrosRielChange(e.target.value)
                              }
                              min="0"
                              step="0.1"
                              className="mt-1"
                              placeholder="Ej: 3.5"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Precio por metro: $19,500
                            </p>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                <span>
                  La toma de medidas requiere seña del 50% y tiene un costo de $
                  {/* {costoMedidas.toLocaleString()}{" "} */}
                  {data.ubicacion === "CABA" ? "(CABA)" : "(GBA)"}
                </span>
              </li>
              {necesitaRiel && (
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    El riel se calcula con un 10% adicional para solapamiento:{" "}
                    {metrosRiel}m
                  </span>
                </li>
              )}
              <li className="flex items-start gap-2">
                {/* <span>•</span> */}
                {/* <span>La confección tiene {windowHeight > 2.70 ? 'costo adicional' : 'costo estándar'} por altura superior a 2.70m</span> */}
              </li>
              {data.hasInstallation && (
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    La instalación se coordina una vez que las cortinas estén
                    listas
                  </span>
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
                <span>Tiempo de entrega estimado: 10-20 días hábiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  Formas de pago: Efectivo, transferencia, Homebanking,Mercado
                  Pago, cuenta DNI, Modo
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA Final que lleve a un panel de administrador con el presupuesto */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="p-6 text-center">
          <Calculator className="h-8 w-8 mx-auto mb-3 opacity-90" />
          {/* <h3 className="text-xl font-bold mb-2">¡Cotización lista!</h3> */}
          <p className="text-sm opacity-90 mb-4">
            Total:{" "}
            <span className="text-2xl font-bold">
              ${total.toLocaleString()}
            </span>
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
