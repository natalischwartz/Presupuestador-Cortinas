import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shirt, Info } from "lucide-react";
import { getProducts } from "@/utils/httpCliente";
console.log(getProducts)
import { useEffect } from "react";

//esto viene de una base de datos
// const fabrics = [
//   { id: 'blackout', name: 'Blackout', width: 3.0, price: 1200, description: 'Bloquea completamente la luz' },
//   { id: 'voile', name: 'Voile', width: 3.2, price: 800, description: 'Tela translúcida y elegante' },
//   { id: 'gasa', name: 'Gasa', width: 2.8, price: 650, description: 'Ligera y con caída natural' },
//   { id: 'lino', name: 'Lino', width: 2.7, price: 950, description: 'Natural y resistente' },
//   { id: 'algodon', name: 'Algodón', width: 1.5, price: 750, description: 'Clásico y versátil' },
//   { id: 'jacquard', name: 'Jacquard', width: 1.4, price: 1400, description: 'Con textura y diseños' },
// ];

export const FabricSelectionStep = ({ quoteData, updateQuoteData }) => {


   useEffect(()=>{
      getProducts()

   },)
 return(
    <div></div>
 )
    };