import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useQuoteStore } from "@/store/quoteStore";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
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
    marginBottom: 15,
    color: '#7f8c8d',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
  },
  card: {
    border: '1 solid #e0e0e0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: 'normal',
  },
  calculationCard: {
    backgroundColor: '#e8f5e8',
    borderColor: '#3E6553',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  calculationDetail: {
    fontSize: 11,
    color: '#5d6d7e',
    fontStyle: 'italic',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
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
    color: '#3E6553',
  },
  contactSection: {
    border: '1 solid #e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  servicesSection: {
    marginTop: 10,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottom: '1 solid #ecf0f1',
  },
  serviceLabel: {
    fontSize: 12,
    color: '#2c3e50',
  },
  serviceStatus: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  serviceAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    alignSelf: 'start',
  },
  noteSection: {
    backgroundColor: '#e3f2fd',
    border: '1 solid #90caf9',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  noteText: {
    fontSize: 10,
    color: '#1565c0',
    lineHeight: 1.4,
  },
  tableContainer: {
    border: '1 solid #e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3E6553',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1 solid #e0e0e0',
  },
  tableCell: {
    fontSize: 11,
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  tableCellBold: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  serviceCard: {
    border: '1 solid #e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  serviceActive: {
    fontSize: 10,
    color: '#3E6553',
    fontWeight: 'bold',
  },
  servicesSummaryTable: {
    border: '1 solid #e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  servicesSummaryRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #e0e0e0',
  },
  servicesSummaryCell: {
    fontSize: 10,
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  servicesSummaryCellBold: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
});

// Función para obtener fecha formateada
function obtenerFechaFormateada() {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${dia}/${mes}/${año}`;
}

// Función auxiliar para formatear números de forma segura
function formatNumber(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString();
}

// Función auxiliar para formatear medidas
function formatMeasurement(value) {
  if (typeof value !== 'number' || isNaN(value)) return '0.00';
  return value.toFixed(2);
}

export const PresupuestoPDF = ({ 
  data = [],
  total = 0,
  totalPorCortina = 0,
  totalServicios = 0,
  serviciosAdicionales = {},
  precioPorMetro = 60000,
   adicionalFijo = 15000,  // Nueva prop
  formulaPersonalizada = {},
  // Nuevas props para consistencia
  cantidadCortinas = 1,
  windowWidth = 0,
  windowHeight = 0,
  PRECIO_POR_METRO = 60000,
  ADICIONAL_FIJO = 15000
}) => {
  // Asegurarnos de que data sea un array
  const presupuestos = Array.isArray(data) ? data : [data];
  const store = useQuoteStore.getState();
  
  // Preparar datos de los presupuestos
  const presupuestosCalculados = presupuestos.map((presupuesto, index) => {
   // Determinar si usar fórmula personalizada
    const usarFormulaPersonalizada = formulaPersonalizada?.activa || presupuesto.formulaPersonalizadaActiva;
    const multiplicador = usarFormulaPersonalizada 
      ? (formulaPersonalizada?.multiplicador || presupuesto.formulaMultiplicador || 2)
      : 2;
    const precioPorMetroActual = usarFormulaPersonalizada
      ? (formulaPersonalizada?.precioPersonalizado || presupuesto.formulaPrecioPersonalizado || precioPorMetro)
      : precioPorMetro;

       // Calcular cortinas con la fórmula correcta
    const windowWidth = Number(presupuesto.customWidth) || 0;
    const cantidadCortinas = Number(presupuesto.curtainQuantity) || 1;
   
     let totalPorCortina;
    if (usarFormulaPersonalizada) {
      totalPorCortina = windowWidth * multiplicador * precioPorMetroActual + adicionalFijo;
    } else {
      // NUEVA FÓRMULA ESTÁNDAR
      const base = windowWidth * 2 * precioPorMetroActual;
      totalPorCortina = base + adicionalFijo;
    }

     const totalCortinas = totalPorCortina * cantidadCortinas;

    // Usar los servicios ya calculados que vienen en el presupuesto
    const servicios = {
      tomaMedidas: presupuesto.costoTomaMedidas || 0,
      rieles: presupuesto.costoRieles || 0,
      instalacion: presupuesto.costoInstalacion || 0,
      total: presupuesto.totalServicios || 0
    };

    return {
      ...presupuesto,
      index: index + 1,
      servicios,
      cortinas: {
        totalPorCortina,
        totalCortinas,
        cantidadCortinas,
        windowWidth,
        windowHeight: Number(presupuesto.customHeight) || 0,
        // Información adicional para debugging
        usandoFormulaPersonalizada: usarFormulaPersonalizada,
        multiplicador: multiplicador,
        precioPorMetro: precioPorMetroActual
      },
      totalIndividual: totalCortinas + servicios.total
    };

  });

  // Calcular totales generales usando los datos ya calculados
  const totalGeneralCortinas = presupuestosCalculados.reduce((sum, p) => sum + p.cortinas.totalCortinas, 0);
  const totalGeneralServicios = presupuestosCalculados.reduce((sum, p) => sum + p.servicios.total, 0);
  const totalGeneral = totalGeneralCortinas + totalGeneralServicios;

  // Calcular totales por tipo de servicio usando los datos ya calculados
  const totalTomaMedidas = presupuestosCalculados.reduce((sum, p) => sum + p.servicios.tomaMedidas, 0);
  const totalRieles = presupuestosCalculados.reduce((sum, p) => sum + p.servicios.rieles, 0);
  const totalInstalacion = presupuestosCalculados.reduce((sum, p) => sum + p.servicios.instalacion, 0);

  // Usar la información de contacto del primer presupuesto
  const customerInfo = presupuestosCalculados[0]?.customerInfo || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {/* Header */}
          <Image 
            src={"https://res.cloudinary.com/dzkzrdbfu/image/upload/v1760998764/estilo-cortina2_r7exhd.jpg"} 
            style={styles.logo}
          />
          <Text style={styles.subtitle}>{obtenerFechaFormateada()}</Text>
          <Text style={styles.header}>
            {presupuestosCalculados.length > 1 ? 'Presupuesto' : 'Presupuesto'}
          </Text>
          {/* <Text style={styles.subtitle}>
            Detalle de presupuesto
          </Text> */}

          {/* Información de Contacto */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Información de Contacto</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{customerInfo?.name || "No proporcionado"}</Text>
            </View>
            {/* <View style={styles.row}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{customerInfo?.phone || "No proporcionado"}</Text>
            </View> */}
          </View>

          {/* Tabla de Presupuestos - Cortinas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Detalle del presupuesto
            </Text>
            
            <View style={styles.tableContainer}>
              {/* Encabezado de la tabla */}
              <View style={styles.tableHeader}>
                {/* <Text style={styles.tableHeaderText}>#</Text> */}
                <Text style={styles.tableHeaderText}>Cantidad</Text>
                <Text style={styles.tableHeaderText}>Tipo</Text>
                <Text style={styles.tableHeaderText}>Medidas</Text>
                <Text style={styles.tableHeaderText}>Tela</Text>
                <Text style={styles.tableHeaderText}>Subtotal</Text>
              </View>

              {/* Filas de la tabla */}
              {presupuestosCalculados.map((presupuesto, index) => (
                <View key={index} style={styles.tableRow}>
                  {/* <Text style={styles.tableCell}>{presupuesto.index}</Text> */}
                  <Text style={styles.tableCell}>
                    {presupuesto.cortinas.cantidadCortinas} cortina{presupuesto.cortinas.cantidadCortinas > 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.tableCell}>
                    {presupuesto.curtainType ? 
                      presupuesto.curtainType.charAt(0).toUpperCase() + presupuesto.curtainType.slice(1) : 
                      "Tradicional"
                    }
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatMeasurement(presupuesto.cortinas.windowWidth)}m × {formatMeasurement(presupuesto.cortinas.windowHeight)}m
                  </Text>
                  <Text style={styles.tableCell}>
                    {presupuesto.selectedFabric && presupuesto.fabricName ? 
                      presupuesto.fabricName : 'No seleccionada'
                    }
                  </Text>
                  <Text style={styles.tableCellBold}>
                    ${formatNumber(presupuesto.cortinas.totalCortinas)}
                  </Text>
                </View>
              ))}

              {/* Pie de tabla con subtotal cortinas */}
              <View style={styles.tableFooter}>
                <Text style={[styles.tableCellBold, {flex: 5, textAlign: 'right'}]}>
                  Subtotal Cortinas:
                </Text>
                <Text style={[styles.tableCellBold, {color: '#3E6553'}]}>
                  ${formatNumber(totalGeneralCortinas)}
                </Text>
              </View>
            </View>
          </View>

          {/* Tabla Resumen de Servicios por Presupuesto */}
          {totalGeneralServicios > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Servicios Adicionales</Text>
              
              <View style={styles.servicesSummaryTable}>
                {/* Encabezado de la tabla */}
                <View style={styles.tableHeader}>
                  {/* <Text style={styles.tableHeaderText}>#</Text> */}
                  <Text style={styles.tableHeaderText}>Toma de Medidas</Text>
                  <Text style={styles.tableHeaderText}>Rieles</Text>
                  <Text style={styles.tableHeaderText}>Instalación</Text>
                  <Text style={styles.tableHeaderText}>Total Servicios</Text>
                </View>

                {/* Filas de la tabla - Mostrar solo presupuestos que tengan servicios */}
                {presupuestosCalculados
                  .filter(presupuesto => presupuesto.servicios.total > 0)
                  .map((presupuesto, index) => (
                    <View key={index} style={styles.servicesSummaryRow}>
                      {/* <Text style={styles.servicesSummaryCell}>{presupuesto.index}</Text> */}
                      <Text style={styles.servicesSummaryCell}>
                        ${formatNumber(presupuesto.servicios.tomaMedidas)}
                      </Text>
                      <Text style={styles.servicesSummaryCell}>
                        ${formatNumber(presupuesto.servicios.rieles)}
                      </Text>
                      <Text style={styles.servicesSummaryCell}>
                        ${formatNumber(presupuesto.servicios.instalacion)}
                      </Text>
                      <Text style={styles.servicesSummaryCellBold}>
                        ${formatNumber(presupuesto.servicios.total)}
                      </Text>
                    </View>
                  ))
                }

                {/* Totales de servicios */}
                {(totalTomaMedidas > 0 || totalRieles > 0 || totalInstalacion > 0) && (
                  <View style={styles.tableFooter}>
                    <Text style={[styles.servicesSummaryCellBold, {flex: 1, textAlign: 'center'}]}>
                      TOTALES:
                    </Text>
                    <Text style={styles.servicesSummaryCellBold}>
                      ${formatNumber(totalTomaMedidas)}
                    </Text>
                    <Text style={styles.servicesSummaryCellBold}>
                      ${formatNumber(totalRieles)}
                    </Text>
                    <Text style={styles.servicesSummaryCellBold}>
                      ${formatNumber(totalInstalacion)}
                    </Text>
                    <Text style={[styles.servicesSummaryCellBold, {color: '#3E6553'}]}>
                      ${formatNumber(totalGeneralServicios)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

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
                <>
                  <View style={styles.calculationRow}>
                    <Text style={styles.calculationDetail}>Servicios Adicionales:</Text>
                    <Text style={styles.calculationDetail}>
                      + ${formatNumber(totalGeneralServicios)}
                    </Text>
                  </View>
                  
                  {/* Desglose de servicios */}
                  {/* {totalTomaMedidas > 0 && (
                    <View style={styles.calculationRow}>
                      <Text style={[styles.calculationDetail, {marginLeft: 10}]}>• Toma de medidas:</Text>
                      <Text style={styles.calculationDetail}>
                        ${formatNumber(totalTomaMedidas)}
                      </Text>
                    </View>
                  )} */}
{/*                   
                  {totalRieles > 0 && (
                    <View style={styles.calculationRow}>
                      <Text style={[styles.calculationDetail, {marginLeft: 10}]}>• Rieles:</Text>
                      <Text style={styles.calculationDetail}>
                        ${formatNumber(totalRieles)}
                      </Text>
                    </View>
                  )} */}
                  
                  {/* {totalInstalacion > 0 && (
                    <View style={styles.calculationRow}>
                      <Text style={[styles.calculationDetail, {marginLeft: 10}]}>• Instalación:</Text>
                      <Text style={styles.calculationDetail}>
                        ${formatNumber(totalInstalacion)}
                      </Text>
                    </View>
                  )} */}
                </>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL GENERAL:</Text>
                <Text style={styles.totalAmount}>${formatNumber(totalGeneral)}</Text>
              </View>
            </View>
          </View>

          {/* Información Importante */}
          <View style={[styles.card, {marginTop: 15}]}>
            <Text style={[styles.sectionTitle, {marginBottom: 8}]}>Información Importante</Text>
            <Text style={styles.noteText}>• Precios válidos por 30 días</Text>
            <Text style={styles.noteText}>• Para comenzar el trabajo se requiere seña del 50%</Text>
            <Text style={styles.noteText}>• Tiempo de entrega estimado: 10-20 días hábiles</Text>
            <Text style={styles.noteText}>• Garantía de 1 año en confección</Text>
            <Text style={styles.noteText}>• Formas de pago: Efectivo, transferencia, Mercado Pago, Homebanking</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PresupuestoPDF;