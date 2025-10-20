import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SwatchBook, Info, Ruler } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Definir los sistemas roller disponibles
const ROLLER_SYSTEMS = {
  SYSTEM_38MM: {
    label: "Sistema Roller 38mm",
    price: Number(import.meta.env.VITE_ROLLER_SYSTEM_38MM_PRICE) || 33000,
    description: "Sistema estándar para cortinas livianas"
  },
  SYSTEM_45MM: {
    label: "Sistema Roller 45mm", 
    price: Number(import.meta.env.VITE_ROLLER_SYSTEM_45MM_PRICE) || 46400,
    description: "Sistema reforzado para cortinas pesadas"
  }
};

export const FabricSelectionStep = ({ data, updateData }) => {
  const [selectedRollerSystem, setSelectedRollerSystem] = useState(
    data.rollerSystemType || 'SYSTEM_45MM'
  );

  const rollerFabrics = [
    {
      _id: "roller-screen",
      name: "Roller Screen",
      description: "Tela traslúcida que permite el paso de luz natural mientras brinda privacidad",
      width: "2.50m",
      price: Number(import.meta.env.VITE_ROLLER_SCREEN_PRICE),
      image: {
        secure_url: "/Imagenes/colores-roller-sunscreen.jpg"
      }
    },
    {
      _id: "roller-blackout",
      name: "Roller Blackout",
      description: "Tela opaca que bloquea completamente la luz exterior, ideal para dormitorios",
      width: "2.50m",
      price: Number(import.meta.env.VITE_ROLLER_BLACKOUT_PRICE),
      image: {
        secure_url: "Imagenes/colores-blackout-roller.jpg"
      }
    }
  ];

  // Actualizar datos cuando cambia el sistema roller
  useEffect(() => {
    if (data.curtainType === "roller") {
      updateData({
        rollerSystemType: selectedRollerSystem,
        rollerSystemPrice: ROLLER_SYSTEMS[selectedRollerSystem].price
      });
    }
  }, [selectedRollerSystem, data.curtainType, updateData]);

  const handleFabricSelect = (fabric) => {
    updateData({
      selectedFabric: fabric._id,
      fabricWidth: fabric.width,
      fabricName: fabric.name,
      fabricPrice: fabric.price
    });
  };

  const [cargando, setCargando] = useState(true);
  const [products, setDataProducts] = useState([]);

  useEffect(() => {
    // Solo hacer fetch si son cortinas tradicionales
    if (data.curtainType !== 'roller') {
      setCargando(true);
      fetch(import.meta.env.VITE_API_URL)
        .then((res) => res.json())
        .then((data) => {
          setDataProducts(data);
          setCargando(false);
        });
    } else {
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          {data.curtainType === 'roller' ? 'Seleccioná el tipo de tela roller' : 'Seleccioná el tipo de tela'}
        </h3>
        <p className="text-muted-foreground">
          Cada tela tiene características y precios diferentes
        </p>
      </div>

      {/* Selector de Sistema Roller (solo para cortinas roller) */}
      {data.curtainType === 'roller' && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Ruler className="h-5 w-5 text-primary" />
              <Label className="text-lg font-semibold">Sistema Roller</Label>
            </div>
            
            <RadioGroup 
              value={selectedRollerSystem} 
              onValueChange={setSelectedRollerSystem}
              className="space-y-4"
            >
              {Object.entries(ROLLER_SYSTEMS).map(([key, system]) => (
                <div key={key} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{system.label}</p>
                        <p className="text-sm text-gray-600">{system.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-700">
                          ${system.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">por metro</p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Información adicional */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Recomendación:</strong> El sistema de 38mm es ideal para telas livianas como Screen, 
                mientras que el de 45mm ofrece mayor resistencia para telas pesadas como Blackout.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de Telas */}
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
                      {fabric.image?.secure_url ? (
                        <img 
                          src={fabric.image.secure_url} 
                          alt={fabric.name}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="text-muted-foreground text-sm">
                          Imagen no disponible
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

                    {/* Mostrar sistema roller seleccionado si aplica */}
                    {data.curtainType === 'roller' && isSelected && data.rollerSystemType && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {ROLLER_SYSTEMS[data.rollerSystemType]?.label}
                      </Badge>
                    )}
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
                    ? `Las telas roller están especialmente diseñadas para sistemas de enrollado. Sistema seleccionado: ${ROLLER_SYSTEMS[selectedRollerSystem]?.label} ($${ROLLER_SYSTEMS[selectedRollerSystem]?.price.toLocaleString()}/m)`
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