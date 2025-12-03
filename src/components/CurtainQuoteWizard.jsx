//importaciones
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calculator, ChevronLeft, ChevronRight, Home, Save } from "lucide-react";
import { CurtainTypeStep } from "./steps/CurtainTypeStep"; //Componente personalizado para el primer paso.
import { InstallationTypeStep } from "./steps/InstallationTypeStep";
import { MeasurementsStep } from "./steps/MeasurementsStep";
import { FabricSelectionStep } from "./steps/FabricSelectionStep";
import { HeaderStyleStep } from "./steps/HeaderStyleStep";
import { QuoteSummaryStep } from "./steps/QuoteSummaryStep";
import { useQuoteStore } from "@/store/quoteStore";

//pasos de la ui
const STEPS = [
  { id: "curtain-type", title: "Tipo de Cortina", component: CurtainTypeStep },
  { id: "installation", title: "Instalación", component: InstallationTypeStep },
  { id: "measurements", title: "Medidas", component: MeasurementsStep },
  { id: "fabric", title: "Tela", component: FabricSelectionStep },
  { id: "header", title: "Cabezal", component: HeaderStyleStep },
  { id: "summary", title: "Presupuesto", component: QuoteSummaryStep },
];

export const CurtainQuoteWizard = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // Usar el store de Zustand
  const { 
    addQuote, 
    updateQuote, 
    setCurrentQuote, 
    clearCurrentQuote,
    calculateTotal
  } = useQuoteStore();

  const [currentStep, setCurrentStep] = useState(0); //Valor inicial: 0 (primer paso del array)

  // Check if we're editing an existing quote
  const editingQuote = location.state && location.state.data;

  //muestra la estructura de datos que se recolectaría en el proceso.
  const [data, setData] = useState({
    customerInfo: {
      name: "",
      phone: "",
    },
    // windows: [],
    totalPrice: 0,
    totalServicios:0,
    curtainType: null, //
    hasInstallation: null, //
    heightOption: null, //
    widthOption: null, //
    customHeight: undefined, //
    customWidth: undefined, //
    selectedFabric: "", //
    fabricWidth: 0, //
    fabricName: "", //
    fabricPrice: 0, //
    headerStyle: "", //
    headerType: undefined, //
    multiplier: 2, //
    necesitaTM: null, //
    ubicationTM: "CABA", //
    necesitaRiel: null, //
    metrosRiel: 0, //
    cantidadVentanas: 1,
    cantidadVentanasRiel: 0,
    rollerSystemType:undefined,
    rollerSystemPrice: undefined
  });

  // Cargar datos de la quote que estamos editando
  useEffect(() => {
    if (editingQuote) {
      setData(editingQuote);
      setCurrentQuote(editingQuote);
    } else {
      clearCurrentQuote();
    }
  }, [editingQuote, setCurrentQuote, clearCurrentQuote]);

  // Determinar qué pasos mostrar según el tipo de cortina
  const getFilteredSteps = () => {
    if (data.curtainType === "roller") {
      // Para roller: Tipo -> Medidas -> Tela -> Presupuesto
      return STEPS.filter(
        (step) =>
          step.id === "curtain-type" ||
          step.id === "measurements" ||
          step.id === "fabric" ||
          step.id === "summary"
      );
    }
    return STEPS;
  };

  const filteredSteps = getFilteredSteps();

  const progress = ((currentStep + 1) / filteredSteps.length) * 100;
  const CurrentStepComponent = filteredSteps[currentStep].component;

  const canProceed = () => {
    // Usamos el ID del paso actual en lugar del índice numérico
    // ya que los índices pueden cambiar con los pasos filtrados
    const currentStepId = filteredSteps[currentStep].id;

    switch (currentStepId) {
      case "curtain-type":
        return data.curtainType !== null;
      case "installation":
        return data.hasInstallation !== null;
      case "measurements":
        return (
          data.heightOption &&
          data.widthOption &&
          (data.customHeight !== undefined || data.heightOption !== "custom") &&
          (data.customWidth !== undefined || data.widthOption !== "custom")
        );
      case "fabric":
        return data.selectedFabric;
      case "header":
        return data.headerStyle;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < filteredSteps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (dataUser) => {
    setData((prev) => ({ ...prev, ...dataUser }));
  };

  const handleSaveQuote = () => {
    if (editingQuote) {
      console.log("EDITANDO ->", data)
      updateQuote(editingQuote.id, data);
    } else {
      // Para nuevos presupuestos, calcula el total usando el metodo de la store
      const totalCalculado = calculateTotal({
        ...data,
        curtainQuantity: data.curtainQuantity || 1,
        customWidth: Number(data.customWidth) || 0,
        customHeight: Number(data.customHeight) || 0,
        fabricPrice: data.fabricPrice || 0,
        multiplier: data.multiplier || 2
      });

      const dataConTotal = {
        ...data,
        totalPrice: totalCalculado,
        curtainQuantity: data.curtainQuantity || 1
      };

      console.log("AGREGANDO con total calculado ->", dataConTotal)
      addQuote(dataConTotal);
    }
    navigate("/home-page");
  };

  const handleBackToCRUD = () => {
    navigate("/home-page");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-elegant">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Presupuestador de Cortinas
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Calculá el presupuesto de tus cortinas paso a paso
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Paso {currentStep + 1} de {filteredSteps.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}% completado
              </span>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between text-xs gap-1 text-muted-foreground">
              {filteredSteps.map((step, index) => (
                <span
                  key={step.id}
                  className={`${
                    index <= currentStep ? "text-primary font-medium" : ""
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="shadow-elegant">
          <CardHeader className="bg-gradient-warm">
            <CardTitle className="text-2xl text-center">
              {filteredSteps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <CurrentStepComponent data={data} updateData={updateData} />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft
              className="h-4 w-4"
              onClick={currentStep === 0 ? handleBackToCRUD : handlePrevious}
            />
            Anterior
          </Button>

           {currentStep < filteredSteps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-gradient-warm text-input"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                // onClick={handleNewQuote}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Nueva Cotización
              </Button>
              
              <Button
                onClick={handleSaveQuote}
                className="flex items-center gap-2 bg-gradient-warm"
              >
                <Save className="h-4 w-4" />
                {editingQuote ? 'Actualizar' : 'Guardar Presupuesto'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};