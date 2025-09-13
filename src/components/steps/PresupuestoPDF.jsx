import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';



// Precios base (deben coincidir con los de QuoteSummaryStep)
const BASE_PRICES = {
  CONFECTION: Number(import.meta.env.VITE_CONFECTION_PRICE),
  CONFECTION_EXTRA: Number(import.meta.env.VITE_CONFECTION_EXTRA_PRICE),
  RAIL: Number(import.meta.env.VITE_RAIL_PRICE),
  INSTALLATION: Number(import.meta.env.VITE_INSTALLATION_PRICE),
  MEASUREMENT_CABA: Number(import.meta.env.VITE_MEASUREMENT_CABA_PRICE),
  MEASUREMENT_GBA: Number(import.meta.env.VITE_MEASUREMENT_GBA_PRICE),
  ROLLER_SYSTEMS: Number(import.meta.env.VITE_ROLLER_SYSTEM_PRICE || 46400), // Precio por metro del sistema roller
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#7f8c8d',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '30%',
    border: '1 solid #e0e0e0',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  cardText: {
    fontSize: 10,
    marginBottom: 4,
    color: '#5d6d7e',
  },
  costSection: {
    border: '1 solid #e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
  },
  costHeader: {
    backgroundColor: '#9966cc',
    padding: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    color:"#fafafa"
  },
  costHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fafafa',
  },
  costContent: {
    padding: 10,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottom: '1 solid #ecf0f1',
  },
  costLabel: {
    fontSize: 12,
    color: '#2c3e50',
  },
   costDetails: {
    fontSize: 10,
    color: '#7f8c8d',
    fontStyle: 'italic',
    alignSelf:'start'
  },
  costAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTop: '2 solid #34495e',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9966cc'
,
  },
  contactSection: {
    border: '1 solid #e0e0e0',
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    width: '20%',
  },
  contactValue: {
    fontSize: 12,
    color: '#2c3e50',
    width: '75%',
    borderBottom: '1 solid #bdc3c7',
    paddingBottom: 4,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  infoCard: {
    width: '48%',
    border: '1 solid #e0e0e0',
    borderRadius: 8,
    padding: 8,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  infoText: {
    fontSize: 10,
    marginBottom: 3,
    color: '#5d6d7e',
  },
  includeCard: {
    backgroundColor: '#e8f5e8',
    borderColor: '#9966cc',
  },
  importantCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#9966cc',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
    alignSelf: 'start',
  }
});

  // Función auxiliar para formatear medidas
function formatMeasurement(value) {
  if (typeof value !== "number" || isNaN(value)) return "--";
  return value.toFixed(2);
}

// Para redondear al múltiplo de 0.5 más cercano (hacia arriba)
function roundToHalf(value) {
  return Math.ceil(value * 2) / 2;
}

// Función para obtener fecha formateada
function obtenerFechaFormateada() {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${dia}/${mes}/${año}`;
}

export const PresupuestoPDF = ({ data }) => {
  const isRoller = data.curtainType === "roller";

  // 1. Obtener medidas de la cortina
  const getWindowHeight = () => {
    if (data.customHeight) {
      return parseFloat(data.customHeight);
    }
    return 0;
  };

  const getWindowWidth = () => {
    if (data.customWidth) {
      return parseFloat(data.customWidth);
    }
    return 0;
  };

  const windowHeight = getWindowHeight();
  const windowWidth = getWindowWidth();

  // Declarar todas las variables
  let costoConfeccion = 0;
  let costoRiel = 0;
  let costoTotalTM = 0;
  let costoTotalTela = 0;
  let metrosTelaNecesarios = 0;
  let panosNecesarios = 1;
  let costoSistemaRoller = 0;
  let costoInstalacion = 0;
  let anchoTelaCubreAlto = false;
  let anchoNumerico = 0;
  let metrosRiel = 0;

  if (isRoller) {
    // CÁLCULOS PARA CORTINAS ROLLER
    metrosTelaNecesarios = windowHeight * windowWidth;
    costoTotalTela = metrosTelaNecesarios * data.fabricPrice;
    costoSistemaRoller = windowWidth * BASE_PRICES.ROLLER_SYSTEMS;
    costoInstalacion = data.hasInstallation ? BASE_PRICES.INSTALLATION : 0;
    costoTotalTM = data.necesitaTM
      ? (data.cantidadVentanas || 1) *
        (data.ubicacionTM === "CABA"
          ? BASE_PRICES.MEASUREMENT_CABA
          : BASE_PRICES.MEASUREMENT_GBA)
      : 0;
  } else {
    // CÁLCULOS PARA CORTINAS TRADICIONALES
    const anchoConMultiplicadorDeCabezal = windowWidth * data.multiplier;
    const altoConAgregados = (windowHeight + 0.2 + 0.1).toFixed(2);

    anchoNumerico = parseFloat(data.fabricWidth);
    anchoTelaCubreAlto = data.selectedFabric
      ? anchoNumerico >= altoConAgregados
      : false;

    if (anchoTelaCubreAlto) {
      metrosTelaNecesarios = roundToHalf(anchoConMultiplicadorDeCabezal);
    } else {
      panosNecesarios = Math.ceil(anchoConMultiplicadorDeCabezal / anchoNumerico);
      metrosTelaNecesarios = panosNecesarios * altoConAgregados;
    }

    const precioConfeccion = windowHeight > 2.7
      ? BASE_PRICES.CONFECTION_EXTRA
      : BASE_PRICES.CONFECTION;

    costoTotalTela = metrosTelaNecesarios * data.fabricPrice;
    costoConfeccion = anchoTelaCubreAlto
      ? metrosTelaNecesarios * precioConfeccion
      : Math.ceil(panosNecesarios * anchoNumerico) * precioConfeccion;

    const calcularMetrosRiel = () => {
      if (!data.necesitaRiel || !windowWidth) return 0;
      const metrosPorVentana = Math.ceil(windowWidth / 0.2) * 0.2;
      return (data.cantidadVentanasRiel || 1) * metrosPorVentana;
    };

    metrosRiel = calcularMetrosRiel();
    costoRiel = metrosRiel * BASE_PRICES.RAIL;
    costoInstalacion = data.hasInstallation ? BASE_PRICES.INSTALLATION : 0;
    costoTotalTM = data.necesitaTM
      ? (data.cantidadVentanas || 1) *
        (data.ubicacionTM === "CABA"
          ? BASE_PRICES.MEASUREMENT_CABA
          : BASE_PRICES.MEASUREMENT_GBA)
      : 0;
  }

  // Total general
  const subtotal = isRoller
    ? costoTotalTela + costoSistemaRoller + costoTotalTM + costoInstalacion
    : costoTotalTela + costoConfeccion + costoRiel + costoTotalTM + costoInstalacion;

  const total = subtotal;

  // Cost items según tipo de cortina
  const costItems = isRoller
    ? [
        {
          label: "Tela",
          amount: costoTotalTela,
          details: `${metrosTelaNecesarios.toFixed(2)}m² x $${data.fabricPrice}/m²`,
        },
        {
          label: "Sistema roller",
          amount: costoSistemaRoller,
          details: `${formatMeasurement(windowWidth)}m x $${BASE_PRICES.ROLLER_SYSTEMS}/m`,
        },
        {
          label: "Toma de medidas",
          amount: costoTotalTM,
          included: data.necesitaTM,
          details: data.necesitaTM
            ? `${data.cantidadVentanas} ventana(s) en ${data.ubicacionTM}`
            : "No solicitado",
        },
        {
          label: "Instalación",
          amount: costoInstalacion,
          included: data.hasInstallation,
          details: data.hasInstallation
            ? "Incluye instalación profesional"
            : "No requiere",
        },
      ]
    : [
        {
          label: "Tela",
          amount: costoTotalTela,
          details: `${metrosTelaNecesarios.toFixed(2)}m x $${data.fabricPrice}/m`,
        },
        {
          label: "Confección",
          amount: costoConfeccion,
          details: `${anchoTelaCubreAlto ? "Corte simple" : `${panosNecesarios} paños`}`,
        },
        {
          label: "Toma de medidas",
          amount: costoTotalTM,
          included: data.necesitaTM,
          details: data.necesitaTM
            ? `${data.cantidadVentanas} ventana(s) en ${data.ubicacionTM}`
            : "No solicitado",
        },
        {
          label: "Rieles",
          amount: costoRiel,
          included: data.necesitaRiel,
          details: data.necesitaRiel
            ? `${metrosRiel.toFixed(2)}m (${data.cantidadVentanasRiel} ventana(s))`
            : "No solicitado",
        },
        {
          label: "Instalación",
          amount: costoInstalacion,
          included: data.hasInstallation,
          details: data.hasInstallation
            ? "Incluye instalación profesional"
            : "No requiere",
        },
      ];


  return(
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={"https://res.cloudinary.com/dzkzrdbfu/image/upload/v1757778772/estilo-cortina2_s4wamc.jpg"} style={styles.logo}/>
        <Text style={styles.subtitle}>
            {obtenerFechaFormateada()}
        </Text>
        {/* Header */}
        <Text style={styles.header}>Resumen del Presupuesto</Text>
        <Text style={styles.subtitle}>Aquí tenés el detalle completo de tu cotización</Text>

         {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Información de Contacto</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Nombre</Text>
            <Text style={styles.contactValue}>{data.customerInfo?.name || "No proporcionado"}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Teléfono</Text>
            <Text style={styles.contactValue}>{data.customerInfo?.phone || "No proporcionado"}</Text>
          </View>
        </View>


        {/* Summary Cards */}
          <View style={styles.cardContainer}>
            {/* Card de Medidas (común a ambos tipos) */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Medidas</Text>
            <Text style={styles.cardText}>Alto ventana: {formatMeasurement(windowHeight)}m</Text>
            <Text style={styles.cardText}>Ancho ventana: {formatMeasurement(windowWidth)}m</Text>
             {!isRoller && (
              <Text style={styles.cardText}>Multiplicador: x{data.multiplier}</Text>
            )}
             {isRoller && (
              <Text style={styles.cardText}>Metros cuadrados: {(windowHeight * windowWidth).toFixed(2)}m²</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tela</Text>
            <Text style={styles.cardText}>Nombre:{data.selectedFabric ? data.fabricName : "No seleccionado"}</Text>
            {!isRoller && (
              <Text style={styles.cardText}>Ancho: {data.fabricWidth || "No seleccionado"}</Text>
            )}
            <Text style={styles.cardText}>Precio: ${data.fabricPrice || "No seleccionado"}{isRoller ? "/m²" : "/m"}</Text>
          </View>

          <View style={styles.card}>
            {isRoller ? (
              <>
                <Text style={styles.cardTitle}>Sistema Roller</Text>
                <Text style={styles.cardText}>Ancho: {formatMeasurement(windowWidth)}m</Text>
                <Text style={styles.cardText}>Precio: ${BASE_PRICES.ROLLER_SYSTEMS}/m</Text>
                <Text style={styles.cardText}>Total: ${costoSistemaRoller.toLocaleString()}</Text>
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>Confección</Text>
                <Text style={styles.cardText}>Técnica: {anchoTelaCubreAlto ? "Corte simple" : `${panosNecesarios} paños`}</Text>
                <Text style={styles.cardText}>Total: ${costoConfeccion.toLocaleString()}</Text>
                <Text style={styles.cardText}>Cabezal: {data.headerStyle || "--"}</Text>
              </>
            )}
          </View>
        </View>

        {/* Cost Breakdown */}
        <View style={styles.costSection}>
          <View style={styles.costHeader}>
            <Text style={styles.costHeader}>$ Desglose de Costos</Text>
          </View>
          <View style={styles.costContent}>
            {costItems.map((item, index) => (
              <View key={index} style={styles.costItem}>
                <Text style={styles.costLabel}>{item.label}</Text>
                <Text style={styles.costDetails}>{item.details}</Text>
                <Text style={styles.costAmount}>${item.amount.toLocaleString()}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Info Sections */}
        <View style={styles.infoSection}>
          <View style={[styles.infoCard, styles.includeCard]}>
            <Text style={styles.infoTitle}> Más Información</Text>
            <Text style={styles.infoText}>• La toma de medidas se realiza previa seña de cortinas</Text>
            <Text style={styles.infoText}>• La instalación se coordina una vez que las cortinas estén listas</Text>
             {!data.hasInstallation && <Text style={styles.infoText}>• Riel y soportes</Text>}
          </View>

          <View style={[styles.infoCard, styles.importantCard]}>
            <Text style={styles.infoTitle}> Importante</Text>
            <Text style={styles.infoText}>• Precios válidos por 30 días</Text>
            <Text style={styles.infoText}>• Para comenzar el trabajo se requiere seña del 50%</Text>
            <Text style={styles.infoText}>• Formas de pago: Efectivo, transferencia, Homebanking,Mercado Pago, cuenta DNI, Modo</Text>
            <Text style={styles.infoText}>• Tiempo de entrega estimado: 10-20 días hábiles</Text>
            <Text style={styles.infoText}>• Garantía de 1 año</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PresupuestoPDF;