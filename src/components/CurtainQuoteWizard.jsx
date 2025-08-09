//importaciones
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calculator, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { CurtainTypeStep } from "./steps/CurtainTypeStep"; //Componente personalizado para el primer paso.
import { InstallationTypeStep } from "./steps/InstallationTypeStep";
import { MeasurementsStep } from "./steps/MeasurementsStep";
import { FabricSelectionStep } from "./steps/FabricSelectionStep";
import { HeaderStyleStep } from "./steps/HeaderStyleStep";
import { QuoteSummaryStep } from "./steps/QuoteSummaryStep";

//pasos de la ui
const STEPS = [
    { id: 'curtain-type', title: 'Tipo de Cortina', component: CurtainTypeStep},
    { id: 'installation', title: 'Instalación', component:InstallationTypeStep },
    { id: 'measurements', title: 'Medidas', component: MeasurementsStep},
    { id: 'fabric', title: 'Tela', component: FabricSelectionStep },
    { id: 'header', title: 'Cabezal', component: HeaderStyleStep },
    { id: 'summary', title: 'Presupuesto', component:QuoteSummaryStep  },
  ];


  export const CurtainQuoteWizard = () =>{

    const [currentStep,setCurrentStep] = useState(0) //Valor inicial: 0 (primer paso del array)


    //muestra la estructura de datos que se recolectaría en el proceso.
    const [data, setData] = useState({
      curtainType: null,
      hasInstallation: null,
      heightOption: null,
      widthOption: null,
      customHeight: undefined,
      customWidth: undefined,
      selectedFabric: '',
      fabricWidth: 0,
      fabricName:"",
      fabricPrice:0,
      headerStyle: '',
      multiplier: 2,
      necesitaTM: null,
      cantidadVentanas: 1,
      ubicationTM: "CABA",
      necesitaRiel: null,
      metrosRiel: 0
    });


    const progress = ((currentStep + 1) / STEPS.length) * 100;
    const CurrentStepComponent = STEPS[currentStep].component;

    const canProceed = () => {
      switch (currentStep) {
        case 0: return data.curtainType !== null;
        case 1: return data.hasInstallation !== null;
        case 2: 
         return data.heightOption && data.widthOption && 
         (data.customHeight !== undefined || data.heightOption !== 'custom') && 
         (data.customWidth !== undefined || data.widthOption !== 'custom');
        case 3: return data.selectedFabric;
        case 4: return data.headerStyle;
        default: return true;
      }
    };

    const handleNext = () => {
      if (currentStep < STEPS.length - 1 && canProceed()) {
        setCurrentStep(currentStep + 1);
      }
    };


    const handlePrevious = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };


    const updateData = (dataUser) => {
      setData(prev => ({ ...prev, ...dataUser }));
    };

    return(
        <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-elegant">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Presupuestador de Cortinas</h1>
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
                Paso {currentStep + 1} de {STEPS.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}% completado
              </span>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {STEPS.map((step, index) => (
                <span
                  key={step.id}
                  className={`${
                    index <= currentStep ? 'text-primary font-medium' : ''
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
              {STEPS[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <CurrentStepComponent
              data={data}
              updateData={updateData}
            />
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
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-gradient-primary"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(0);
                setData({
                  curtainType: null,
                  hasInstallation: null,
                  heightOption: '',
                  widthOption: '',
                  selectedFabric: '',
                  fabricWidth: 0,
                  headerStyle: '',
                  multiplier: 2,
                });
              }}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Nueva Cotización
            </Button>
          )}
        </div>
      </div>
    </div>
    )
  }