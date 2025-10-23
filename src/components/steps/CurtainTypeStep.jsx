import { Waves, RotateCcw } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export const CurtainTypeStep = ({ data, updateData }) => {
  const options = [
    {
      id: "traditional",
      title: "Cortinas Tradicionales - 1 sola tela",
      description:
        "Cortinas con frunce, pliegues y diferentes estilos de cabezal",
      icon: Waves,
      available: true,
    },
    {
      id: "roller",
      title: "Cortinas Roller",
      description: "Sistema enrollable con mecanismo de cadena",
      icon: RotateCcw,
      available: true,
    },
    // ver doble cortinado
    {
      id: "doble-cortinado",
      title: "Doble cortinado",
      description: "Eleccion 2 telas para doble cortinado",
      icon: RotateCcw,
      available: false, //no disponible
    },
  ];

  return (
    <div className="space-y-6">
      <div className="customer-info-step mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Información de Contacto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre completo
            </label>
            <input
              type="text"
              id="customerName"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={data.customerInfo?.name || ''}
              onChange={(e) =>
                updateData({
                  customerInfo: {
                    ...data.customerInfo,
                    name: e.target.value,
                  },
                })
              }
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="customerPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Teléfono
            </label>
            <input
              type="tel"
              id="customerPhone"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={data.customerInfo?.phone || '' }
              onChange={(e) =>
                updateData({
                  customerInfo: {
                    ...data.customerInfo,
                    phone: e.target.value,
                  },
                })
              }
              required
              placeholder="Ej: +54 9 112 123 4567"
            />
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          Seleccioná el tipo de cortina
        </h3>
        <p className="text-muted-foreground">
          Elegí entre nuestras opciones disponibles para comenzar tu presupuesto
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {options.map((option) => {
          const Icon = option.icon;
          //lo que el usuario selecciona
          const isSelected = data.curtainType === option.id;

          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-elegant ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              } ${!option.available ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() =>
                option.available && updateData({ curtainType: option.id })
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      isSelected
                        ? "bg-primary text-input"
                        : "bg-secondary"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold">{option.title}</h4>
                      {!option.available && (
                        <Badge variant="secondary">Próximamente</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {option.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="text-primary">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* {!options.find((opt) => opt.available && opt.id === data.curtainType) &&
        data.curtainType === "roller" && (
          <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
            <p className="text-warning-foreground">
              Las cortinas roller estarán disponibles próximamente. Por ahora
              podés cotizar cortinas tradicionales.
            </p>
          </div>
        )} */}
    </div>
  );
};