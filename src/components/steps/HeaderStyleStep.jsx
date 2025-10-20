import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves, CheckCircle, Plus } from "lucide-react";

const railStyles = [
  {
    id: "straight",
    name: "Cabezal recto",
    multiplier: 2,
    description: "Estilo clásico y minimalista",
  },
  {
    id: "pinch-1",
    name: "Pellizco 1",
    multiplier: 1.5,
    description: "Pliegue simple y elegante",
  },
  {
    id: "pinch-2",
    name: "Pellizco 2",
    multiplier: 2,
    description: "Pliegue doble tradicional",
  },
  {
    id: "pinch-3",
    name: "Pellizco 3",
    multiplier: 3,
    description: "Pliegue triple sofisticado",
  },
  {
    id: "flat-pleat",
    name: "Tabla chata",
    multiplier: 2,
    description: "Pliegues planos uniformes",
  },
  {
    id: "inverted-pleat",
    name: "Tabla encontrada",
    multiplier: 2,
    description: "Pliegues invertidos",
  },
];

const rodStyles = [
  {
    id: "normal-tabs",
    name: "Presillas normales",
    multiplier: 1.2,
    description: "Presillas visibles tradicionales",
  },
  {
    id: "rod-pocket",
    name: "Jareta para barral",
    multiplier: 2,
    description: "Bolsillo para pasar el barral",
  },
  {
    id: "hidden-tabs",
    name: "Presillas ocultas",
    multiplier: 2,
    description: "Presillas discretas en la parte trasera",
  },
];

// console.log("railStyles:", railStyles);
// console.log("rodStyles:", rodStyles);

export const HeaderStyleStep = ({ data, updateData }) => {
  // Determinar qué estilos mostrar basado en si hay riel o barral
  const handleStyleSelect = (styleId) => {
    const allStyles = [...railStyles, ...rodStyles];
    const style = allStyles.find((s) => s.id === styleId);
    // console.log(style)
    if (style) {
      updateData({
        headerStyle: style.id,
        multiplier: style.multiplier,
        headerType: railStyles.some(s => s.id === styleId) ? 'rail' : 'rod',
      });
    }
  };

  const isStyleSelected = (styleId) => {
    return data.headerStyle === styleId;
  };

 // Obtener el estilo seleccionado para mostrar información
  const selectedStyle = [...railStyles, ...rodStyles].find(
    s => s.id === data.headerStyle
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          Elegí el estilo de cabezal
        </h3>
      </div>

      {/* Style Selection para riel */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Estilos disponibles para riel</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {railStyles.map((style) => (
            <StyleCard
              key={style.id}
              style={style}
              isSelected={isStyleSelected(style.id)}
              onSelect={handleStyleSelect}
            />
          ))}
        </div>
      </div>

      {/* Style Selection para barral - solo si tiene instalación */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">
            Estilos disponibles para barral
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rodStyles.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                isSelected={isStyleSelected(style.id)}
                onSelect={handleStyleSelect}
              />
            ))}
          </div>
        </div>
      
      {/* {console.log("Found style:", [...railStyles, ...rodStyles].find(s => s.id === data.headerStyle))} */}
      
   
     {data.headerStyle && selectedStyle && (
        <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
          <p className="text-success-foreground text-sm">
            Estilo seleccionado:{" "}
            <strong>{selectedStyle.name}</strong>{" "}
            - Multiplicador: <strong>x{selectedStyle.multiplier}</strong>
          </p>
        </div>
      )}
    </div>
  );
  
};



// Componente de tarjeta reutilizable
const StyleCard = ({ style, isSelected, onSelect }) => (
  <Card
    className={`cursor-pointer transition-all duration-300 hover:shadow-soft ${
      isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
    }`}
    onClick={() => onSelect(style.id)}
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