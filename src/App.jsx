import { useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip';
import {Toaster as Sonner} from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";


import { Watermark } from './components/Watermark';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import CreateWindowPage from './pages/CreateWindowPage';
import QuotationPage from './pages/QuotationPage';
import PrintQuotesPage from './pages/PrintQuotesPage';


const queryClient = new QueryClient();/*Crea un "cliente" que gestiona el caché y la lógica de las consultas.*/


function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Toaster /> */}
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} /> {/*LoginPage*/}
          <Route path='home-page' element={
             <ProtectedRoute>
              <HomePage />{/* home con abm src/pages/HomePage */}
          </ProtectedRoute>
          }/>
          <Route path="/cargar-cortina" element={<CreateWindowPage />} /> {/* pagina src/pages/CreateWindowPage */}
           <Route path="/imprimir-presupuestos" element={<PrintQuotesPage />} />
          <Route path="/presupuesto" element={<QuotationPage />} /> {/* pagina src/pages/QuotationPage */}
        </Routes>
         <Watermark />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  )
}

export default App