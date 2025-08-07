import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves } from "lucide-react";

const railStyles = [
  { id: 'straight', name: 'Cabezal recto', multiplier: 2, description: 'Estilo clásico y minimalista' },
  { id: 'pinch-1', name: 'Pellizco 1', multiplier: 2, description: 'Pliegue simple y elegante' },
  { id: 'pinch-2', name: 'Pellizco 2', multiplier: 2, description: 'Pliegue doble tradicional' },
  { id: 'pinch-3', name: 'Pellizco 3', multiplier: 3, description: 'Pliegue triple sofisticado' },
  { id: 'flat-pleat', name: 'Tabla chata', multiplier: 2, description: 'Pliegues planos uniformes' },
  { id: 'inverted-pleat', name: 'Tabla encontrada', multiplier: 2, description: 'Pliegues invertidos' },
  { id: 'pleated', name: 'Plisado', multiplier: 3, description: 'Pliegues múltiples y densos' },
  { id: 'wave', name: 'Fruncido ondeado', multiplier: 2, description: 'Ondas suaves y naturales' },
];

const rodStyles = [
  { id: 'normal-tabs', name: 'Presillas normales', multiplier: 1.2, description: 'Presillas visibles tradicionales' },
  { id: 'rod-pocket', name: 'Jareta para barral', multiplier: 1.2, description: 'Bolsillo para pasar el barral' },
  { id: 'hidden-tabs', name: 'Presillas ocultas', multiplier: 1.2, description: 'Presillas discretas en la parte trasera' },
];

export const HeaderStyleStep = ({ data, updateData }) => {
  // Determinar qué estilos mostrar basado en si hay riel o barral
  const availableStyles = data.hasInstallation ? [...railStyles, ...rodStyles] : railStyles;

  const handleStyleSelect = (styleId) => {
    const style = availableStyles.find(s => s.id === styleId);
    if (style) {
      updateData({
        headerStyle: styleId,
        multiplier: style.multiplier
      });
    }
  };

  const isStyleSelected = (styleId) => {
    return data.headerStyle === styleId;
  };

  console.log("esto es lo que me devuelve data " , data)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Elegí el estilo de cabezal</h3>
        <p className="text-muted-foreground">
          El tipo de cabezal determina el multiplicador de tela necesaria
        </p>
      </div>

      {/* Style Selection */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Estilos disponibles</h4>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableStyles.map((style) => {
            const isSelected = isStyleSelected(style.id);
            
            return (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-soft ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => handleStyleSelect(style.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    }`}>
                      <Waves className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-sm">{style.name}</h5>
                        {isSelected && (
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {style.description}
                      </p>
                      
                      <Badge variant="outline" className="text-xs">
                        x{style.multiplier} multiplicador
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {data.headerStyle && (
        <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
          <p className="text-success-foreground text-sm">
            Estilo seleccionado: <strong>{
              availableStyles.find(s => s.id === data.headerStyle)?.name
            }</strong> - Multiplicador: <strong>x{data.multiplier}</strong>
          </p>
        </div>
      )}
    </div>
  );
};