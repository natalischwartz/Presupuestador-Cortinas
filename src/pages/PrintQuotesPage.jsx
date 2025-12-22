import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { QuoteSummaryStep } from "@/components/steps/QuoteSummaryStep";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PresupuestoPDF } from "@/components/steps/PresupuestoPDF";
import { useQuoteStore } from "@/store/quoteStore";

const PrintQuotesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quotes = location.state?.quotes || [];
  const {getCompleteCalculation,calculateCortina,calculateServicios} = useQuoteStore();

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

  // Preparar datos para el PDF
  const preparePDFData = () => {
    console.log("preprando datos para PDF con", quotes.length,"quotes")
    const data = quotes.map(quote=>({
      ...quote,
      customWidth:quote.customWidth,
      customHeight:quote.customHeight,
      curtainQuantity:quote.curtainQuantity || 1,
      curtainType:quote.curtainType,
      formulaPersonalizadaActiva:quote.formulaPersonalizadaActiva,
      formulaValorPersonalizado:quote.formulaValorPersonalizado,
      formulaPrecioPersonalizado:quote.formulaPrecioPersonalizado,
      adicionalFijo:quote.adicionalFijo,
      necesitaTM:quote.necesitaTM,
      cantidadVentanas:quote.cantidadVentanas,
      ubicacionTM:quote.ubicacionTM,
      ncesesitaRiel:quote.ncesesitaRiel,
      cantidadVentanasRiel:quote.cantidadVentanasRiel,
      metrosPorVentana:quote.metrosPorVentana,
      hasInstallation:quote.hasInstallation,
      cantidadVentanasInstalacion:quote.cantidadVentanasInstalacion,
      customerInfo:quote.customerInfo,
      selectedFabric:quote.selectedFabric,
      fabricName:quote.fabricName

    }))

    const calculations = quotes.map(quote =>{
      try {
        const calc =getCompleteCalculation(quote)
        return calc
      } catch (error) {
        console.error("error calculando quote")
        
      }
    })

    return{
      data,
      calculations,
      multiple:quotes.length >1
    }


  };

  const pdfData = preparePDFData();

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
              className="flex items-center gap-2 bg-gradient-warm"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            
            {/* PDF para múltiples quotes */}
            <PDFDownloadLink
              document={<PresupuestoPDF {...preparePDFData()} />}
              fileName={`presupuesto-${Date.now()}.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="default"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  <Download className="h-4 w-4" />
                  {loading ? "Generando..." : "Descargar PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
        
        <div className="space-y-6">
          {quotes.map((quote, index) => {
            const calculations=getCompleteCalculation(quote);
            return(
               <Card key={quote.id} className="shadow-elegant print:shadow-none print:border-0">
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
            )
          })}
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
                      const calculations = getCompleteCalculation(quote);
                      return total + (calculations?.totalGeneral ||0);
                    },0)
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