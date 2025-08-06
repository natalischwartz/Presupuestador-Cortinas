import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shirt, Info } from "lucide-react";
import { getProducts } from "@/utils/httpCliente";
import { useEffect } from "react";

//esto viene de una base de datos
const fabrics = [
  { id: 'blackout', name: 'Blackout', width: 3.0, price: 1200, description: 'Bloquea completamente la luz' },
  { id: 'voile', name: 'Voile', width: 3.2, price: 800, description: 'Tela translúcida y elegante' },
  { id: 'gasa', name: 'Gasa', width: 2.8, price: 650, description: 'Ligera y con caída natural' },
  { id: 'lino', name: 'Lino', width: 2.7, price: 950, description: 'Natural y resistente' },
  { id: 'algodon', name: 'Algodón', width: 1.5, price: 750, description: 'Clásico y versátil' },
  { id: 'jacquard', name: 'Jacquard', width: 1.4, price: 1400, description: 'Con textura y diseños' },
];

export const FabricSelectionStep = ({ data, updateData }) => {

    const handleFabricSelect = (fabric) => {
    updateData({
      selectedFabric: fabric.id,
      fabricWidth: fabric.width
    });
  };

   useEffect(()=>{
      getProducts()

   },)

    return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Seleccioná el tipo de tela</h3>
        <p className="text-muted-foreground">
          Cada tela tiene características y precios diferentes
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fabrics.map((fabric) => {
          const isSelected = data.selectedFabric === fabric.id;
          
          return (
            <Card
              key={fabric.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-soft ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => handleFabricSelect(fabric)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}>
                    <Shirt className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">{fabric.name}</h4>
                      {isSelected && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {fabric.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {fabric.width}m ancho
                      </Badge>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        ${fabric.price}/m
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {data.selectedFabric && (
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent-foreground mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Optimización automática</h4>
                <p className="text-xs text-muted-foreground">
                  Si el alto de tu ventana es menor a 2.60m y el ancho de la tela es mayor, 
                  usaremos el ancho de la tela como alto para optimizar el corte y reducir desperdicios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
