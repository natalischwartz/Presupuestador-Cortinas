import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SwatchBook, Info } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";



export const FabricSelectionStep = ({ data, updateData }) => {


   const rollerFabrics = [
    {
      _id: "roller-screen",
      name: "Roller Screen",
      description: "Tela traslúcida que permite el paso de luz natural mientras brinda privacidad",
      width: "2.50m",
      price: Number(import.meta.env.VITE_ROLLER_SCREEN_PRICE),
      image: {
        secure_url: "/Imagenes/colores-roller-sunscreen.jpg" // Ruta a tu imagen
      }
    },
    {
      _id: "roller-blackout",
      name: "Roller Blackout",
      description: "Tela opaca que bloquea completamente la luz exterior, ideal para dormitorios",
      width: "2.50m",
      price:  Number(import.meta.env.VITE_ROLLER_BLACKOUT_PRICE),
      image: {
        secure_url: "Imagenes/colores-blackout-roller.jpg" // Ruta a tu imagen
      }
    }
  ];

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

    //Solo hacer fetch si son cortinas tradicionales
    if (data.curtainType !== 'roller'){
      setCargando(true)

    fetch(import.meta.env.VITE_API_URL)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setDataProducts(data);
        setCargando(false) 
      });
    }else{
        // Para roller, no necesitamos cargar desde la API
      setCargando(false);
    }
  }, [data.curtainType]);

   // Determinar qué telas mostrar
  const fabricsToShow = data.curtainType === 'roller' ? rollerFabrics : products;


if (cargando && data.curtainType !== 'roller') {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={40} color="#3E6553" />
      </div>
    );
  }

  // console.log("esto es lo que me devuelve data " , data)
    return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">{data.curtainType === 'roller' ? 'Seleccioná el tipo de tela roller' : 'Seleccioná el tipo de tela'}</h3>
        <p className="text-muted-foreground">
          Cada tela tiene características y precios diferentes
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fabricsToShow.map((fabric) => {
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
                    <div className="w-40 h-40 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        {fabric.image?.secure_url?(
                      <img src={fabric.image.secure_url} 
                      alt={fabric.name}
                      className="w-full h-full object-cover" />

                    ):
                      <div className="text-muted-foreground text-sm">
                        Imagen no disponible
                      </div>
                  }
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
                {data.curtainType === 'roller' 
                    ? 'Las telas roller están especialmente diseñadas para sistemas de enrollado, con tratamientos anti-UV y mayor resistencia.'
                    : 'Si el alto de tu ventana es menor a 2.60m y el ancho de la tela es mayor, usaremos el ancho de la tela como alto para optimizar el corte y reducir desperdicios.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
