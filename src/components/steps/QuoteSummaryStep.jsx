import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
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

const BASE_PRICES = {
  CONFECTION: Number(import.meta.env.VITE_CONFECTION_PRICE),
  CONFECTION_EXTRA: Number(import.meta.env.VITE_CONFECTION_EXTRA_PRICE),
  RAIL: Number(import.meta.env.VITE_RAIL_PRICE),
  INSTALLATION: Number(import.meta.env.VITE_INSTALLATION_PRICE),
  MEASUREMENT_CABA: Number(import.meta.env.VITE_MEASUREMENT_CABA_PRICE),
  MEASUREMENT_GBA: Number(import.meta.env.VITE_MEASUREMENT_GBA_PRICE),
};
// console.log(BASE_PRICES.CONFECTION)

export const QuoteSummaryStep = ({ data, updateData }) => {
  // 1. Obtener medidas de la cortina
  const getWindowHeight = () => {
    if (data.customHeight) {
      return parseFloat(data.customHeight);
    }
  };

  const getWindowWidth = () => {
    if (data.customWidth) {
      return parseFloat(data.customWidth);
    }
  };

  const windowHeight = getWindowHeight();
  const windowWidth = getWindowWidth();

  // Función auxiliar para formatear medidas
  function formatMeasurement(value) {
    if (typeof value !== "number" || isNaN(value)) return "--";
    return value.toFixed(2);
  }

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
    ? anchoNumerico > altoConAgregados
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

  /*************RIEL *****************/
  //Costo de riel. si el cliente quiere o no
  const calcularMetrosRiel = () => {
    if (!data.necesitaRiel || !windowWidth) return 0;

    // Calculamos metros necesarios (redondeando hacia arriba a múltiplos de 0.20m)
    const metrosPorVentana = Math.ceil(windowWidth / 0.2) * 0.2;
    return (data.cantidadVentanasRiel || 1) * metrosPorVentana;
  };

  const metrosRiel = calcularMetrosRiel();
  const costoRiel = metrosRiel * BASE_PRICES.RAIL;

  const rielOptions = [
    { id: "si-riel", label: "Sí, necesito rieles" },
    { id: "no-riel", label: "No necesito rieles" },
  ];

  // Handler para cambio de opción de rieles
  const handleRielChange = (optionId) => {
    updateData({
      necesitaRiel: optionId === "si-riel",
      cantidadVentanasRiel: optionId === "si-riel" ? 1 : undefined,
      metrosRiel: optionId === "si-riel" ? calcularMetrosRiel() : 0,
    });
  };

  // Handler para cambio de cantidad de ventanas
  const handleCantidadVentanasRielChange = (value) => {
    const cantidad = Number(value);
    updateData({
      cantidadVentanasRiel: cantidad,
      metrosRiel: calcularMetrosRiel(),
    });
  };

  // Costo de instalación
  const costoInstalacion = data.hasInstallation ? BASE_PRICES.INSTALLATION : 0;

  /*************TOMA DE MEDIDAS *****************/
  const tomaMedidasOptions = [
    { id: "si-tm", label: "Sí, necesito toma de medidas" },
    { id: "no-tm", label: "No necesito rectificar medidas" },
  ];

  const ubicationOptions = [
    { id: "CABA", label: "C.A.B.A", cost: 20000 },
    { id: "GBA", label: "G.B.A", cost: 30000 },
  ];

  const costoTotalTM = data.necesitaTM
    ? (data.cantidadVentanas || 1) *
      (data.ubicacionTM === "CABA"
        ? BASE_PRICES.MEASUREMENT_CABA
        : BASE_PRICES.MEASUREMENT_GBA)
    : 0;

  // Handlers para Toma de Medidas

  const handleTomaMedidasChange = (optionId) => {
    console.log(optionId);
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
    costoInstalacion +
    costoTotalTM;
  // costoTomaMedidas;
  const total = subtotal;

  // Datos para mostrar en la UI
  const summaryItems = [
    {
      icon: Ruler,
      title: "Medidas",
      details: [
        `Alto ventana: ${formatMeasurement(windowHeight)}m`,
        `Ancho ventana: ${formatMeasurement(windowWidth)}m`,
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
      label: "Toma de medidas",
      amount: costoTotalTM,
      icon: Ruler,
      included: data.necesitaTM,
      details: data.necesitaTM
        ? `${data.cantidadVentanas} ventana(s) en ${data.ubicacionTM}`
        : "No solicitado",
    },
    {
      label: "Rieles",
      amount: costoRiel,
      icon: Settings,
      included: data.necesitaRiel,
      details: data.necesitaRiel
        ? `${metrosRiel.toFixed(2)}m (${data.cantidadVentanasRiel} ventana(s))`
        : "No solicitado",
    },
    {
      label: "Instalación",
      amount: costoInstalacion,
      icon: Wrench,
      included: data.hasInstallation,
      details: data.hasInstallation
        ? "Incluye instalación profesional"
        : "No requiere",
      hasSwitch: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Resumen del Presupuesto</h3>
        <p className="text-muted-foreground">
          Detalle completo de tu cotización
        </p>
      </div>
      <div className="quote-summary space-y-6">
        <div className="customer-info-summary bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Información de Contacto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-medium text-gray-800">
                {data.customerInfo.name || "No proporcionado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="font-medium text-gray-800">
                {data.customerInfo.phone || "No proporcionado"}
              </p>
            </div>
          </div>
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
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        ${item.amount.toLocaleString()}
                      </span>
                      {item.hasSwitch && (
                        <Switch
                          checked={item.included}
                          onCheckedChange={(checked) =>
                            updateData({ hasInstallation: checked })
                          }
                        />
                      )}
                    </div>
                  </div>
                  {index < costItems.length - 1 && <Separator />}
                </div>
              ))}
              {/* Sección de Toma de Medidas */}
              <div className="py-2">
                <div className=" flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-medium">Toma de medidas</span>
                  </div>
                </div>
                <div className="space-y-3 ml-7">
                  {tomaMedidasOptions.map((option) => (
                    <div key={option.id}>
                      <label
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          data.necesitaTM === (option.id === "si-tm")
                            ? "border-primary bg-primary/5"
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
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            data.necesitaTM === (option.id === "si-tm")
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {data.necesitaTM === (option.id === "si-tm") && (
                            <div className="w-2 h-2 bg-primary-foreground rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                        <span className="text-sm">{option.label}</span>
                      </label>

                      {data.necesitaTM === true && option.id === "si-tm" && (
                        <div className="mt-2 p-3 bg-muted/30 rounded-lg space-y-3">
                          <div>
                            <Label
                              htmlFor="cantidad-ventanas"
                              className="text-sm font-medium block mb-1"
                            >
                              Cantidad de ventanas
                            </Label>
                            <Input
                              id="cantidad-ventanas"
                              type="number"
                              // value={data.cantidadVentanas || 1}
                              onChange={(e) =>
                                handleCantidadVentanasChange(e.target.value)
                              }
                              min="1"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium block mb-1">
                              Ubicación
                            </Label>
                            <div className="space-y-2">
                              {ubicationOptions.map((ubicacion) => (
                                <label
                                  key={ubicacion.id}
                                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                                    data.ubicacionTM === ubicacion.id
                                      ? "border-primary bg-primary/5"
                                      : "border-border"
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <input
                                      type="radio"
                                      name="ubicacionTM"
                                      checked={
                                        data.ubicacionTM === ubicacion.id
                                      }
                                      onChange={() =>
                                        handleUbicacionChange(ubicacion.id)
                                      }
                                      className="sr-only"
                                    />
                                    <div
                                      className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                        data.ubicacionTM === ubicacion.id
                                          ? "border-primary bg-primary"
                                          : "border-muted-foreground"
                                      }`}
                                    >
                                      {data.ubicacionTM === ubicacion.id && (
                                        <div className="w-2 h-2 bg-primary-foreground rounded-full mx-auto mt-0.5" />
                                      )}
                                    </div>
                                    <span>{ubicacion.label}</span>
                                  </div>
                                  <span className="font-medium">
                                    ${ubicacion.cost.toLocaleString()}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección de Riel */}
              <div className="py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-medium">Rieles</span>
                  </div>
                </div>

                <div className="space-y-3 ml-7">
                  {rielOptions.map((option) => (
                    <div key={option.id}>
                      <label
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          data.necesitaRiel === (option.id === "si-riel")
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="rieles"
                          checked={
                            data.necesitaRiel === (option.id === "si-riel")
                          }
                          onChange={() => handleRielChange(option.id)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            data.necesitaRiel === (option.id === "si-riel")
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {data.necesitaRiel === (option.id === "si-riel") && (
                            <div className="w-2 h-2 bg-primary-foreground rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                        <span className="text-sm">{option.label}</span>
                      </label>

                      {data.necesitaRiel === true &&
                        option.id === "si-riel" && (
                          <div className="mt-2 p-3 bg-muted/30 rounded-lg space-y-3">
                            <div>
                              <Label
                                htmlFor="cantidad-ventanas-riel"
                                className="text-sm font-medium block mb-1"
                              >
                                Cantidad de ventanas
                              </Label>
                              <Input
                                id="cantidad-ventanas-riel"
                                type="number"
                                // value={data.cantidadVentanasRiel || 1}
                                onChange={(e) =>
                                  handleCantidadVentanasRielChange(
                                    e.target.value
                                  )
                                }
                                min="1"
                                className="w-full"
                              />
                            </div>

                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>Metros necesarios: {metrosRiel.toFixed(2)}m</p>
                              <p>
                                (Ancho por ventana:{" "}
                                {(Math.ceil(windowWidth / 0.2) * 0.2).toFixed(
                                  2
                                )}
                                m)
                              </p>
                              <p>
                                Precio por metro: $
                                {BASE_PRICES.RAIL.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

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
                    La toma de medidas requiere seña del 50% y tiene un costo de
                    ${/* {costoMedidas.toLocaleString()}{" "} */}
                    {data.ubicacionTM === "CABA"
                      ? BASE_PRICES.MEASUREMENT_CABA
                      : BASE_PRICES.MEASUREMENT_GBA}
                  </span>
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
            <div className="grid grid-cols-1 mt-6">
              {/* <Button variant="outline" className="text-primary bg-white">
              Imprimir presupuesto
            </Button> */}
              <Button className="bg-white text-primary hover:bg-white/90">
                Confirmar pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
