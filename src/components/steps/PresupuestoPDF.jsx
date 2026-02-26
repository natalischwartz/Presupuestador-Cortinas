// PresupuestoPDF.jsx - Versión Corregida para Múltiples Presupuestos
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Constantes y utilidades (se mantienen igual)
const VENDEDOR_EMAIL = "schwartznatali@gmail.com";
const VENDEDOR_TELEFONO = "+54 9 11 6162-2602";

const safeToFixed = (value, fallback = 0) => {
  if (value == null) return fallback.toFixed(2);
  const num = Number(value);
  return (isNaN(num) ? fallback : num).toFixed(2);
};

function obtenerFechaFormateada() {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${dia}/${mes}/${año}`;
}

function formatNumber(value) {
  if (typeof value !== "number" || isNaN(value)) return "0";
  return value.toLocaleString("es-AR");
}

function formatMeasurement(value) {
  if (typeof value !== "number" || isNaN(value)) return "0.00";
  return value.toFixed(2);
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 15,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
    color: "#7f8c8d",
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 4,
  },
  card: {
    border: "1 solid #e0e0e0",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: "#7f8c8d",
    fontWeight: "bold",
  },
  value: {
    fontSize: 12,
    color: "#2c3e50",
    fontWeight: "normal",
  },
  calculationCard: {
    backgroundColor: "#e8f5e8",
    borderColor: "#3E6553",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  calculationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  calculationDetail: {
    fontSize: 11,
    color: "#5d6d7e",
    fontStyle: "italic",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTop: "2 solid #34495e",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3E6553",
  },
  contactSection: {
    border: "1 solid #e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  servicesSection: {
    marginTop: 10,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottom: "1 solid #ecf0f1",
  },
  serviceLabel: {
    fontSize: 12,
    color: "#2c3e50",
  },
  serviceStatus: {
    fontSize: 12,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  serviceAmount: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  logo: {
   width: 140,    // Aumentamos el tamaño (antes era 90)
    height: 140,   // Aumentamos el tamaño
    objectFit: 'contain', // Asegura que no se deforme
  },
  noteSection: {
    backgroundColor: "#e3f2fd",
    border: "1 solid #90caf9",
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  noteText: {
    fontSize: 10,
    color: "#1565c0",
    lineHeight: 1.4,
  },
  tableContainer: {
    border: "1 solid #e0e0e0",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3E6553",
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottom: "1 solid #e0e0e0",
    alignItems: "center",
    minHeight: 80,
  },
  tableCell: {
    fontSize: 9,
    color: "#2c3e50",
    flex: 1,
    textAlign: "center",
  },
  // Contenedor para celdas que llevan Foto + Texto
  tableCellCombined: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  tableCellBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
    textAlign: "center",
  },
  tableFooter: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  serviceCard: {
    border: "1 solid #e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  serviceActive: {
    fontSize: 10,
    color: "#3E6553",
    fontWeight: "bold",
  },
  servicesSummaryTable: {
    border: "1 solid #e0e0e0",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
  },
  servicesSummaryRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1 solid #e0e0e0",
  },
  servicesSummaryCell: {
    fontSize: 10,
    color: "#2c3e50",
    flex: 1,
    textAlign: "center",
  },
  servicesSummaryCellBold: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
    textAlign: "center",
  },
  includedServicesCard: {
    border: "1 solid #3E6553",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f8f0",
  },
  includedServiceText: {
    fontSize: 11,
    color: "#3E6553",
    fontStyle: "italic",
  },
  includedServiceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#3E6553",
    textAlign: "center",
  },
  vendedorContact: {
    // Nuevo estilo para tu contacto
    fontSize: 10,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 15,
  },
  serviceCalculationCard: {
    backgroundColor: "#f8f9fa",
    borderColor: "#e0e0e0",
    border: "1 solid #e0e0e0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  calculationDetailTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
  },
  tableImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    objectFit: "cover",
    marginBottom: 2,
  },
  // Estilo para el nombre debajo de la foto
  imageLabel: {
    fontSize: 7,
    textAlign: "center",
    color: "#2c3e50",
    maxWidth: 65,
  },
  headerImage: {
    width: 40,
    height: 40,
    marginTop: 4,
    borderRadius: 4,
    objectFit: "cover",
  },
  tableCellImage: {
    width: 40,
    height: 40,
    marginTop: 4,
    borderRadius: 4,
    objectFit: "cover",
  },
});

export const PresupuestoPDF = ({
  data, // Puede ser un objeto o un array
  calculations, // Puede ser un objeto o un array
  multiple = false,
}) => {
  // 1. CONVERTIR datos a arrays para procesar uniformemente
  const presupuestos = Array.isArray(data) ? data : [data];
  const calculos = Array.isArray(calculations) ? calculations : [calculations];

  // DEBUG DETALLADO

  // 2. VALIDACIÓN BÁSICA
  if (!presupuestos || presupuestos.length === 0) {
    return null;
  }
  // console.log("=== DEBUG PDF ===");
  console.log("1. Presupuestos recibidos:", presupuestos.length);
  console.log("2. Cálculos recibidos:", calculos.length);
  console.log("3. Primer presupuesto:", presupuestos[0]);
  console.log("4. Primer cálculo:", calculos[0]);
  console.log("5. totalCortinas en cálculo:", calculos[0]?.totalCortinas);
  console.log("6. totalPorCortina en cálculo:", calculos[0]?.totalPorCortina);
  console.log("7. cantidadCortinas en cálculo:", calculos[0]?.cantidadCortinas);
  console.log("8. totalGeneral en cálculo:", calculos[0]?.totalGeneral);
  // console.log("=== FIN DEBUG ===");

  // 3. CÁLCULO DE TOTALES GENERALES
  // Usamos los cálculos que YA VIENEN DEL STORE (calculations)
  let totalGeneralCortinas = 0;
  let totalGeneralServicios = 0;
  let totalGeneral = 0;

  // Variables para servicios
  let totalTomaMedidas = 0;
  let totalRieles = 0;
  let totalInstalacion = 0;

  const presupuestosCalculados = presupuestos.map((presupuesto, index) => {
    const calc = calculos[index] || {};

    const totalCortinas = calc.totalCortinas || 0;
    const totalServicios = calc.totalServicios || 0;
    const total = calc.totalGeneral || totalCortinas + totalServicios;

    // Acumular para total general
    totalGeneralCortinas += totalCortinas;
    totalGeneralServicios += totalServicios;
    totalGeneral += total;

    // Acumular servicios individuales
    totalTomaMedidas += calc.tomaMedidas?.costo || 0;
    totalRieles += calc.rieles?.costo || 0;
    totalInstalacion += calc.instalacion?.costo || 0;

    return {
      ...presupuesto,
      cortinas: {
        cantidadCortinas:
          calc.cantidadCortinas || presupuesto.curtainQuantity || 1,
        windowWidth:
          calc.windowWidth || Number.parseFloat(presupuesto.customWidth) || 0,
        windowHeight:
          calc.windowHeight || Number.parseFloat(presupuesto.customHeight) || 0,
        totalCortinas: totalCortinas,
        totalPorCortina: calc.totalPorCortina || 0,
        calculoDetalle: calc.calculoDetalle || "",
      },
      servicios: {
        total: totalServicios,
        tomaMedidas: calc.tomaMedidas?.costo || 0,
        rieles: calc.rieles?.costo || 0,
        instalacion: calc.instalacion?.costo || 0,
        detalle: {
          tomaMedidas:
            calc.tomaMedidas?.calculo ||
            `${calc.tomaMedidas?.cantidadVentanas || presupuesto.cantidadVentanas || 1} ventana(s)`,
          rieles:
            calc.rieles?.calculo ||
            `${calc.rieles?.cantidadVentanas || presupuesto.cantidadVentanasRiel || 1} ventana(s) × ${calc.rieles?.metrosPorVentana || presupuesto.metrosPorVentana || (calc.windowWidth || 1.4).toFixed(2)} m`,
          instalacion:
            calc.instalacion?.calculo ||
            `${calc.instalacion?.cantidadVentanas || presupuesto.cantidadVentanasInstalacion || 1} ventana(s)`,
        },
      },
    };
  });

  // 4. OBTENER INFORMACIÓN DEL CLIENTE (del primer presupuesto para el encabezado)
  const customerInfo = presupuestos[0]?.customerInfo || {};

  // Determinar si algún servicio fue solicitado (para la tarjeta de servicios incluidos)
  const tomaMedidasSolicitado = presupuestosCalculados.some(
    (p) => p.necesitaTM,
  );
  const rielesSolicitado = presupuestosCalculados.some((p) => p.necesitaRiel);
  const instalacionSolicitado = presupuestosCalculados.some(
    (p) => p.hasInstallation,
  );

  console.log("totales calculados", {
    totalGeneralCortinas,
    totalGeneralServicios,
    totalGeneral,
    totalTomaMedidas,
    totalRieles,
    totalInstalacion,
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {/* Header */}
          <Image
            style={styles.logo}
            src="/Imagenes/estilo-cortina-flyer-sfdo.png"
          />
          <Text style={styles.subtitle}>{obtenerFechaFormateada()}</Text>
          <Text style={styles.header}>Presupuesto</Text>

          {/* Información de Contacto */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Información de Contacto</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>
                {customerInfo?.name || "No proporcionado"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>
                {customerInfo?.phone || "No proporcionado"}
              </Text>
            </View>
          </View>

          {/* Tabla de Presupuestos - Cortinas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalle de Cortinas</Text>

            <View style={styles.tableContainer}>
              {/* Encabezado: 6 Columnas */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 0.4 }]}>
                  Cant.
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>
                  Tipo
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>
                  Cabezal
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Medidas
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>
                  Tela
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>
                  Total
                </Text>
              </View>

              {/* Filas */}
              {presupuestosCalculados.map((presupuesto, index) => (
                <View key={index} wrap={false} style={styles.tableRow}>
                  {/* 1. Cantidad */}
                  <Text style={[styles.tableCell, { flex: 0.4 }]}>
                    {presupuesto.cortinas.cantidadCortinas}
                  </Text>

                  {/* 2. Tipo (Tradicional o Roller) */}
                  <Text
                    style={[
                      styles.tableCell,
                      { flex: 0.8, textTransform: "capitalize" },
                    ]}
                  >
                    {presupuesto.curtainType}
                  </Text>

                  {/* 3. Cabezal (Foto + Nombre) */}
                  <View style={[styles.tableCellCombined, { flex: 1.2 }]}>
                    {presupuesto.curtainType !== "roller" ? (
                      <>
                        {presupuesto.headerImage && (
                          <Image
                            src={presupuesto.headerImage}
                            style={styles.tableImage}
                          />
                        )}
                        <Text style={styles.imageLabel}>
                          {presupuesto.headerName || "Estándar"}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.tableCell}>---</Text>
                    )}
                  </View>

                  {/* 4. Medidas */}
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {formatMeasurement(presupuesto.cortinas.windowWidth)}m x{" "}
                    {formatMeasurement(presupuesto.cortinas.windowHeight)}m
                  </Text>

                  {/* 5. Tela (Foto + Nombre) */}
                  <View style={[styles.tableCellCombined, { flex: 1.2 }]}>
                    {presupuesto.fabricImage && (
                      <Image
                        src={presupuesto.fabricImage}
                        style={styles.tableImage}
                      />
                    )}
                    <Text style={styles.imageLabel}>
                      {presupuesto.fabricName}
                    </Text>
                  </View>

                  {/* 6. Total */}
                  <Text style={[styles.tableCellBold, { flex: 0.8 }]}>
                    ${formatNumber(presupuesto.cortinas.totalCortinas)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Sección de Servicios Adicionales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Servicios y Accesorios</Text>

            {totalGeneralServicios > 0 && (
              // Mostrar servicios con costo
              <View style={styles.serviceCalculationCard}>
                <Text style={styles.calculationDetailTitle}>
                  Detalle de Costos Adicionales
                </Text>

                {presupuestosCalculados.map(
                  (p, index) =>
                    p.servicios.total > 0 && (
                      <View key={`serv-det-${index}`}>
                        {/* <Text style={[styles.label, {marginTop: 5, marginBottom: 5, color: '#2c3e50'}]}>
              Presupuesto {index + 1} ({p.curtainType.charAt(0).toUpperCase() + p.curtainType.slice(1)}):
            </Text> */}
                        {p.servicios.tomaMedidas > 0 && (
                          <View style={styles.calculationRow}>
                            <Text style={styles.calculationDetail}>
                              • Toma de Medidas (
                              {p.servicios.detalle.tomaMedidas}):
                            </Text>
                            <Text style={styles.calculationDetail}>
                              ${formatNumber(p.servicios.tomaMedidas)}
                            </Text>
                          </View>
                        )}
                        {p.servicios.rieles > 0 && (
                          <View style={styles.calculationRow}>
                            <Text style={styles.calculationDetail}>
                              • Rieles ({p.servicios.detalle.rieles}):
                            </Text>
                            <Text style={styles.calculationDetail}>
                              ${formatNumber(p.servicios.rieles)}
                            </Text>
                          </View>
                        )}
                        {p.servicios.instalacion > 0 && (
                          <View style={styles.calculationRow}>
                            <Text style={styles.calculationDetail}>
                              • Instalación ({p.servicios.detalle.instalacion}):
                            </Text>
                            <Text style={styles.calculationDetail}>
                              ${formatNumber(p.servicios.instalacion)}
                            </Text>
                          </View>
                        )}
                      </View>
                    ),
                )}
                <View
                  style={[
                    styles.totalRow,
                    { borderTop: "1 solid #ccc", marginTop: 10, paddingTop: 8 },
                  ]}
                >
                  <Text style={styles.totalLabel}>TOTAL SERVICIOS:</Text>
                  <Text style={styles.totalAmount}>
                    ${formatNumber(totalGeneralServicios)}
                  </Text>
                </View>
              </View>
            )}

            {/* 2. Bloque de Servicios Incluidos (SIEMPRE aparece) */}
            <View style={styles.includedServicesCard}>
              <Text style={styles.includedServiceTitle}>
                ✓ Servicios Incluidos / Sin Costo
              </Text>

              <View style={styles.row}>
                <Text style={[styles.label, { color: "#3E6553", flex: 2 }]}>
                  • Toma de medidas:
                </Text>
                <Text style={[styles.includedServiceText, { flex: 1 }]}>
                  {/* Muestra "Solicitado, pero costo $0" solo si fue solicitado y su costo fue cero */}
                  {tomaMedidasSolicitado && totalTomaMedidas === 0
                    ? "Solicitado, pero costo $0"
                    : "Sin cargo"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.label, { color: "#3E6553", flex: 2 }]}>
                  • Colocación/Instalación:
                </Text>
                <Text style={[styles.includedServiceText, { flex: 1 }]}>
                  {/* Muestra "Solicitado, pero costo $0" solo si fue solicitado y su costo fue cero */}
                  {instalacionSolicitado && totalInstalacion === 0
                    ? "Solicitado, pero costo $0"
                    : "Sin cargo"}
                </Text>
              </View>

              {/* Si quieres incluir los rieles aquí como "No solicitado" */}
              {/* <View style={styles.row}>
        <Text style={[styles.label, {color: '#3E6553', flex: 2}]}>• Rieles:</Text>
        <Text style={[styles.includedServiceText, {flex: 1}]}>
            {rielesSolicitado && totalRieles === 0 ? 'Solicitado, pero costo $0' : 'No solicitado'}
        </Text>
    </View> */}
            </View>
            {/* 👆 FIN DEL BLOQUE DE INCLUIDOS */}
          </View>

          {/* Resumen Final */}
          <View style={styles.section}>
            <View style={styles.calculationCard}>
              <View style={styles.calculationRow}>
                <Text style={styles.calculationDetail}>Subtotal Cortinas:</Text>
                <Text style={styles.calculationDetail}>
                  ${formatNumber(totalGeneralCortinas)}
                </Text>
              </View>

              {totalGeneralServicios > 0 && (
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationDetail}>
                    Servicios Adicionales:
                  </Text>
                  <Text style={styles.calculationDetail}>
                    + ${formatNumber(totalGeneralServicios)}
                  </Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL GENERAL:</Text>
                <Text style={styles.totalAmount}>
                  ${formatNumber(totalGeneral)}
                </Text>
              </View>
            </View>
          </View>

          {/* Información Importante */}
          <View style={[styles.card, { marginTop: 6 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>
              Información Importante
            </Text>
            {/* <Text style={styles.noteText}>• Precios válidos por 30 días</Text> */}
            <Text style={styles.noteText}>
              • Para comenzar el trabajo se requiere seña del 50%
            </Text>
            <Text style={styles.noteText}>
              • Tiempo de entrega estimado: 10-20 días hábiles
            </Text>
            <Text style={styles.noteText}>
              • Garantía de 1 año en confección
            </Text>

            <Text style={styles.noteText}>
              • Formas de pago: Efectivo, transferencia, Mercado Pago
            </Text>
          </View>

          {/* CONTACTO VENDEDOR */}
          <View
            style={{
              marginTop: 10,
              borderTop: "1 solid #e0e0e0",
              paddingTop: 10,
            }}
          >
            <Text style={styles.vendedorContact}>
              Contacto: {VENDEDOR_EMAIL} | Teléfono: {VENDEDOR_TELEFONO}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PresupuestoPDF;
