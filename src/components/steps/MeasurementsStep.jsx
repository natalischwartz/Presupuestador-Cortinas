import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Ruler, ArrowUpDown, ArrowLeftRight } from "lucide-react";

export const MeasurementsStep = ({ data, updateData }) => {

  const heightOptions = data.hasInstallation
    ? [
        {
          id: "rod-to-floor",
          label: "Altura desde el taparrollos instalado hasta el largo final deseado de la cortina",
        },
        {
          id: "ceiling-to-floor",
          label: "Del techo hasta donde se quiere que llegue la cortina",
        },
        { id: "custom", label: "Altura personalizada" },
      ]
    :  [
        {
          id: "rod-to-floor",
          label:
            "Medir desde el riel o barral hasta el punto deseado donde finalizará la cortina",
        },
      ]



  const widthOptions = data.hasInstallation
    ? [
        { id: "window-plus", label: "Marco de ventana + 10 cm a cada lado" },
        { id: "wall-to-wall", label: "De pared a pared" },
      ]
    : [
        {
          id: "rail-width",
          label: "Longitud total del sistema de riel/barral, medida entre los extremos",
        },
      ]

  //cambia la opcion de altura
  const handleHeightChange = (optionId) => {
    updateData({
      heightOption: optionId,
      customHeight: undefined, // Siempre reseteamos a undefined sin importar la opción
    });
  };

  // Nueva función para manejar cambio de opción de ancho
  const handleWidthChange = (optionId) => {
    updateData({
      widthOption: optionId,
      customWidth: undefined, // Siempre reseteamos a undefined al cambiar opción
    });
  };

  const handleCustomHeightChange = (value) => {
    updateData({ customHeight: value });
  };

  const handleCustomWidthChange = (value) => {
    updateData({ customWidth: value });
  };

  //  console.log("esto es lo que me devuelve data " , data)

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Ingresá las medidas</h3>
        <p className="text-muted-foreground">
          Necesitamos las medidas exactas para calcular la cantidad de tela
        </p>
      </div>

      {/* Height Section */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowUpDown className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-lg font-semibold">Alto de la cortina</h4>
          </div>

          <div className="space-y-3">
            {heightOptions.map((option) => (
              <div key={option.id}>
                <label
                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                    data.heightOption === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="height"
                    value={option.id}
                    checked={data.heightOption === option.id}
                    onChange={() => handleHeightChange(option.id)}
                    className="sr-only"
                  />

                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      data.heightOption === option.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {data.heightOption === option.id && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </label>

                {/* Mostrar input para TODAS las opciones cuando estén seleccionadas */}
                {data.heightOption === option.id && (
                  <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                    <Label
                      htmlFor={`height-input-${option.id}`}
                      className="text-sm font-medium"
                    >
                      {option.id === "custom"
                        ? "Altura personalizada (metros)"
                        : `${option.label} (metros)`}
                    </Label>
                    <Input
                      id={`height-input-${option.id}`}
                      type="text"
                      value={data.customHeight ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Permite números con punto o coma decimal
                        if (
                          value === "" ||
                          /^[0-9]*([.,][0-9]{0,2})?$/.test(value)
                        ) {
                          // Reemplaza comas por puntos para consistencia
                          const normalizedValue = value.replace(",", ".");
                          handleCustomHeightChange(normalizedValue);
                        }
                      }}
                      className="mt-2"
                      placeholder="Ej: 3,00 o 3.00"
                      // min="0"
                      // step="0.01"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Width Section */}
      <Card className="border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <ArrowLeftRight className="h-5 w-5 text-accent-foreground" />
            </div>
            <h4 className="text-lg font-semibold">Ancho de la cortina</h4>
          </div>

          <div className="space-y-3">
            {widthOptions.map((option) => (
              <div key={option.id}>
                <label
                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                    data.widthOption === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="width"
                    value={option.id}
                    checked={data.widthOption === option.id}
                    onChange={() => handleWidthChange(option.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      data.widthOption === option.id
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground"
                    }`}
                  >
                    {data.widthOption === option.id && (
                      <div className="w-2 h-2 bg-accent-foreground rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </label>

                {/* Input para todas las opciones cuando están seleccionadas */}
                {data.widthOption === option.id && (
                  <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                    <Label
                      htmlFor={`width-input-${option.id}`}
                      className="text-sm font-medium"
                    >
                      {option.id === "wall-to-wall"
                        ? "Distancia pared a pared (m)"
                        : option.id === "rail-width"
                        ? "Medida del riel/barral (m)"
                        : `Ingrese ancho para ${option.label} (m)`}
                    </Label>
                    <Input
                      id={`width-input-${option.id}`}
                      type="text"
                      value={data.customWidth ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          /^[0-9]*([.,][0-9]{0,2})?$/.test(value)
                        ) {
                          const normalizedValue = value.replace(",", ".");
                          handleCustomWidthChange(normalizedValue);
                        }
                      }}
                      className="mt-2"
                      placeholder="Ej: 2.00"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {data.heightOption &&
        data.widthOption &&
        data.customHeight &&
        data.customWidth && (
          <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
            <Ruler className="h-5 w-5 text-success mx-auto mb-2" />
            <p className="text-success-foreground text-sm">
              Medidas registradas correctamente. Podés continuar al siguiente
              paso.
            </p>
          </div>
        )}
    </div>
  );
};
