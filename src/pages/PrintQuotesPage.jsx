import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { QuoteSummaryStep } from "@/components/steps/QuoteSummaryStep";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PresupuestoPDF } from "@/components/steps/PresupuestoPDF";

const PrintQuotesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quotes = location.state?.quotes || [];

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    window.print();
  };

  if (quotes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">No hay presupuestos seleccionados</h2>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Imprimir Presupuestos
            </h1>
            <p className="text-muted-foreground">
              {quotes.length} presupuesto(s) seleccionado(s)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-primary"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <PDFDownloadLink
              document={<PresupuestoPDF data={quotes} multiple />}
              fileName={`presupuestos-cortinas-${Date.now()}.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Download className="h-4 w-4" />
                  {loading ? "Generando..." : "PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
        <div className="space-y-6">
          {quotes.map((quote, index) => (
            <Card key={quote.id } className="shadow-elegant print:shadow-none print:border-0">
              <CardHeader className="bg-gradient-warm print:bg-white">
                <CardTitle className="flex items-center justify-between">
                  <span>Presupuesto #{index + 1}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(quote.createdAt).toLocaleDateString("es-AR")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <QuoteSummaryStep 
                  data={quote} 
                  updateData={() => {}} 
                  isPrintMode={true}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        {quotes.length > 1 && (
          <Card className="mt-6 bg-primary/5">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Total General</h3>
                <p className="text-3xl text-primary font-bold">
                  {new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS'
                  }).format(
                    quotes.reduce((total, quote) => {
                      const basePrice = quote.fabricPrice || 0;
                      const multiplier = quote.multiplier || 2;
                      const width = quote.customWidth || 140;
                      const height = quote.customHeight || 220;
                      return total + (basePrice * multiplier * (width / 100) * (height / 100));
                    }, 0)
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PrintQuotesPage;