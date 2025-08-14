import { useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip';
import {Toaster as Sonner} from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
/*Propósito: Manejar datos asíncronos (APIs, caché, sincronización).
Componentes clave:QueryClient:(Crea un "cliente" que gestiona el caché) y QueryClientProvider:
(Provee el cliente a toda la aplicaciónla lógica de las consultas)
En algun archivo se usara : import { useQuery } from '@tanstack/react-query';
*/
import { BrowserRouter, Routes, Route } from "react-router-dom";/*
Propósito: Manejar la navegación entre vistas (SPA - Single Page Application).Componentes clave::
BrowserRouter:Habilita el enrutamiento usando la API History del navegador.
Routes y Route: Definen las rutas y los componentes a renderizar.
en algun otro archivo usara : import { Link } from 'react-router-dom';
*/ 

/*Resumen:     React Query maneja los datos.
    React Router maneja las vistas.
    Juntas: Permiten apps con datos persistentes y navegación fluida.*/
import { Watermark } from './components/Watermark';
import Index from './pages/Index'


const queryClient = new QueryClient();/*Crea un "cliente" que gestiona el caché y la lógica de las consultas.*/


function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Toaster /> */}
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
         <Watermark />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  )
}

export default App
