import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SwatchBook, Info } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";


export const FabricSelectionStep = ({ data, updateData }) => {

    const handleFabricSelect = (fabric) => {
    updateData({
      selectedFabric: fabric._id,
      fabricWidth: fabric.width,
      fabricName: fabric.name,
      fabricPrice : fabric.price
    });
  };
  const [cargando, setCargando] = useState(true);

  const [products, setDataProducts] = useState([])
  

  useEffect(() => {

    setCargando(true)

    fetch("http://localhost:3000")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setDataProducts(data);
        setCargando(false) 
      });
  }, []);

  if(cargando){
    return <ClipLoader className=" flex justify-center"/>
}


  // console.log("esto es lo que me devuelve data " , data)
    return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Seleccioná el tipo de tela</h3>
        <p className="text-muted-foreground">
          Cada tela tiene características y precios diferentes
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((fabric) => {
          const isSelected = data.selectedFabric === fabric._id;
          
          return (
            <Card
              key={fabric._id}
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
                    <SwatchBook className="h-4 w-4" />
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
                        {fabric.width}
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
