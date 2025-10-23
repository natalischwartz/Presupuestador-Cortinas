import { useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Calculator,
  Download,
  CheckSquare,
} from "lucide-react";
import { useQuoteStore } from "@/store/quoteStore";

const HomePage = () => {
  const navigate = useNavigate();

  // Usar el store de Zustand
  const { 
    quotes, 
    deleteQuote, 
    formatCurrency, 
    calculateTotal,
    getCurtainTypeLabel,
    setCurrentQuote,
    selectedQuotes,
    toggleQuoteSelection,
    clearSelectedQuotes,
    selectAllQuotes,
    getSelectedQuotes
  } = useQuoteStore();

   const handleEditQuote = (quote) => {
    setCurrentQuote(quote);
    navigate("/cargar-cortina", { state: { data: quote } });
  };

  const handleDeleteQuote = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este presupuesto?")) {
      deleteQuote(id);
    }
  };

  const handlePrintSelected = () => {
    const selected = getSelectedQuotes();
    if (selected.length > 0) {
      navigate("/imprimir-presupuestos", { 
        state: { quotes: selected } 
      });
    }
  };

  const isAllSelected = selectedQuotes.length === quotes.length && quotes.length > 0;

 return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-primary mb-2">
                Presupuestos de Cortinas
              </h1>
              <p className="text-muted-foreground">
                Gestiona todos tus presupuestos de cortinas en un solo lugar
              </p>
            </div>
            <Button
              onClick={() => {
                useQuoteStore.getState().clearCurrentQuote();
                navigate("/cargar-cortina");
              }}
              className="bg-gradient-warm text-muted hover:opacity-90 shadow-elegant"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Cargar Cortina
            </Button>
          </div>
        </div>

         {/* Actions Bar para selección múltiple */}
        {selectedQuotes.length > 0 && (
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-semibold">
                  {selectedQuotes.length} presupuesto(s) seleccionado(s)
                </span>
                <Button
                  onClick={handlePrintSelected}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Imprimir seleccionados
                </Button>
                <Button
                  onClick={clearSelectedQuotes}
                  variant="ghost"
                  size="sm"
                >
                  Limpiar selección
                </Button>
              </div>
             <span className="text-sm text-muted-foreground">
              Total: {formatCurrency(
                selectedQuotes.reduce((sum, quoteId) => {
                  const quote = quotes.find(q => q.id === quoteId);
                  const quoteTotal = quote ? calculateTotal(quote) : 0;
                  return sum + quoteTotal;
                }, 0)
              )}
            </span>
            </CardContent>
          </Card>
        )}
        {/* Table */}
        <Card className="shadow-elegant">
          <CardHeader className="bg-gradient-warm">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Lista de Presupuestos
              </CardTitle>
              {quotes.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isAllSelected ? clearSelectedQuotes : selectAllQuotes}
                  className="flex items-center gap-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  {isAllSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {quotes.length === 0 ? (
              <div className="text-center py-12">
                <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  No hay presupuestos
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comienza creando tu primer presupuesto de cortinas
                </p>
                <Button
                  onClick={() => navigate("/cargar-cortina")}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Presupuesto
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={() => {
                          if (isAllSelected) {
                            clearSelectedQuotes();
                          } else {
                            selectAllQuotes();
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tela</TableHead>
                    <TableHead>Medidas</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id} className="border-border/30">
                      <TableCell>
                        <Checkbox className="text-input"
                          checked={selectedQuotes.includes(quote.id)}
                          onCheckedChange={() => toggleQuoteSelection(quote.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(quote.createdAt).toLocaleDateString("es-AR")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={quote.curtainType === 'traditional' ? 'default' : 'secondary'}>
                          {getCurtainTypeLabel(quote.curtainType || 'traditional')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                          {quote.customerInfo.name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {quote.fabricName || "No especificado"}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {quote.customWidth || 140} x{" "}
                          {quote.customHeight || 220} m
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(quote.totalPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditQuote(quote)}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuote(quote.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;