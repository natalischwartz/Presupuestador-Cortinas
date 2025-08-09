import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Wrench } from "lucide-react";




export const InstallationTypeStep = ({ data, updateData }) => {
  const options = [
    {
      id: false,
      title: "Con sistema ya instalado",
      description: "Ya tenés riel o barral instalado",
      icon: CheckCircle,
      details: "Mediremos desde el riel/barral existente",
    },
    {
      id: true,
      title: "Sin sistema instalado",
      description: "Necesitás instalación completa/ ver instructivo",
      icon: Wrench,
      details: "Incluye riel, soportes e instalación",
    },
  ];


  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          ¿Tenés riel o barral instalado?
        </h3>
        <p className="text-muted-foreground">
          Esto nos ayuda a calcular las medidas y costos correctamente
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = data.hasInstallation === option.id;

          return (
            <Card
              key={option.id.toString()}
              className={`cursor-pointer transition-all duration-300 hover:shadow-elegant ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => updateData({ hasInstallation: option.id })}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">
                      {option.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      {option.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {option.details}
                    </Badge>
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

      {data.hasInstallation !== null && (
        <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
          <p className="text-accent-foreground text-sm">
            {data.hasInstallation
              ? "Incluiremos el costo de riel, soportes e instalación en tu presupuesto"
              : "Solo calcularemos tela, confección y mano de obra"}
          </p>
         
        </div>
      )
      }
    </div>
  );
};

 