import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


const VENDEDOR_EMAIL = "schwartznatali@gmail.com"; 
const VENDEDOR_TELEFONO = "+54 9 11 6162-2602";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 15,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    color: '#7f8c8d',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
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
    width: 70,
    height: 70,
    marginBottom: 8,
    alignSelf: 'start',
  },
  noteSection: {
    backgroundColor: '#e3f2fd',
    border: '1 solid #90caf9',
    borderRadius: 8,
    padding: 8,
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
  includedServicesCard: {
    border: '1 solid #3E6553',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f8f0',
  },
  includedServiceText: {
    fontSize: 11,
    color: '#3E6553',
    fontStyle: 'italic',
  },
  includedServiceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3E6553',
    textAlign: 'center',
  },
  vendedorContact: { // Nuevo estilo para tu contacto
    fontSize: 10,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 15,
  },
  serviceCalculationCard: { 
    backgroundColor: '#f8f9fa',
    borderColor: '#e0e0e0',
    border: '1 solid #e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  calculationDetailTitle: { 
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
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
  return value.toLocaleString('es-AR');
}

// Función auxiliar para formatear medidas
function formatMeasurement(value) {
  if (typeof value !== 'number' || isNaN(value)) return '0.00';
  return value.toFixed(2);
}


export const PresupuestoPDF = ({ 
   data,
  calculations,
  cantidadCortinas,
  windowWidth,
  windowHeight,
  PRECIO_POR_METRO,
  ADICIONAL_FIJO,
  PRECIO_POR_METRO_ROLLER
}) => {

  if (!data || !calculations) return null;

  // Extraer datos del objeto calculations
  const {
    totalPorCortina,
    totalCortinas,
    totalServicios,
    totalGeneral,
    tomaMedidas,
    rieles,
    instalacion,
    calculoDetalle
  } = calculations;

  // Extraer información del cliente
  const customerInfo = data.customerInfo || {};
  

  return (
    <Document>
    <Page size="A4" style={styles.page}>
        <View>
          {/* Header */}
          <Text style={styles.subtitle}>{obtenerFechaFormateada()}</Text>
          <Text style={styles.header}>Presupuesto de Cortinas</Text>

          {/* Información de Contacto */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Información de Contacto</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{customerInfo.name || "No proporcionado"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{customerInfo.phone || "No proporcionado"}</Text>
            </View>
          </View>

          {/* Detalle de la Cortina */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalle de la Cortina</Text>
            
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Cant.</Text>
                <Text style={styles.tableHeaderText}>Tipo</Text>
                <Text style={styles.tableHeaderText}>Medidas</Text>
                <Text style={styles.tableHeaderText}>Tela</Text>
                <Text style={styles.tableHeaderText}>Total</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {cantidadCortinas}
                </Text>
                <Text style={styles.tableCell}>
                  {data.curtainType ? 
                    data.curtainType.charAt(0).toUpperCase() + data.curtainType.slice(1) : 
                    "Tradicional"
                  }
                </Text>
                <Text style={styles.tableCell}>
                  {formatMeasurement(windowWidth)}m x {formatMeasurement(windowHeight)}m
                </Text>
                <Text style={styles.tableCell}>
                  {data.fabricName || 'No seleccionada'}
                </Text>
                <Text style={styles.tableCellBold}>
                  ${formatNumber(totalCortinas)}
                </Text>
              </View>

              {/* Fórmula utilizada */}
              <View style={[styles.tableRow, { backgroundColor: '#f9f9f9' }]}>
                <Text style={[styles.tableCell, { fontSize: 9, textAlign: 'left', flex: 5 }]}>
                  Fórmula: {data.formulaPersonalizadaActiva
                    ? `Valor (${(data.formulaValorPersonalizado || (windowWidth * 2)).toFixed(2)}) × $${formatNumber(data.formulaPrecioPersonalizado || PRECIO_POR_METRO)} + $${formatNumber(data.adicionalFijo || ADICIONAL_FIJO)}`
                    : data.curtainType === 'roller'
                      ? `(${windowWidth.toFixed(2)}m × $${PRECIO_POR_METRO_ROLLER} + ${windowWidth.toFixed(2)}m × ${windowHeight.toFixed(2)}m × $${PRECIO_POR_METRO_ROLLER}) × 2 + $${ADICIONAL_FIJO}`
                      : `Valor (${(windowWidth * 2).toFixed(2)}) × $${PRECIO_POR_METRO} + $${ADICIONAL_FIJO}`
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* Servicios Adicionales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Servicios Adicionales</Text>

            {/* Servicios con costo */}
            {totalServicios > 0 && (
              <View style={styles.serviceCalculationCard}>
                <Text style={styles.calculationDetailTitle}>Servicios con Costo Adicional</Text>
                
                {costoTomaMedidas > 0 && (
                  <View style={styles.calculationRow}>
                    <Text style={styles.calculationDetail}>
                      • Toma de Medidas: {tomaMedidas.cantidadVentanas || 1} ventana(s) × 
                      ${formatNumber(data.ubicacionTM === 'CABA' ? 2000 : 3000)}/{data.ubicacionTM || 'CABA'}
                    </Text>
                    <Text style={styles.calculationDetail}>
                      ${formatNumber(costoTomaMedidas)}
                    </Text>
                  </View>
                )}

                {costoRieles > 0 && (
                  <View style={styles.calculationRow}>
                    <Text style={styles.calculationDetail}>
                      • Rieles: {data.cantidadVentanasRiel || 1} ventana(s) × 
                      {data.metrosPorVentana || windowWidth.toFixed(2)}m × ${formatNumber(1000)}
                    </Text>
                    <Text style={styles.calculationDetail}>
                      ${formatNumber(costoRieles)}
                    </Text>
                  </View>
                )}

                {costoInstalacion > 0 && (
                  <View style={styles.calculationRow}>
                    <Text style={styles.calculationDetail}>
                      • Instalación: {data.cantidadVentanasInstalacion || 1} ventana(s) × ${formatNumber(3000)}
                    </Text>
                    <Text style={styles.calculationDetail}>
                      ${formatNumber(costoInstalacion)}
                    </Text>
                  </View>
                )}

                <View style={[styles.totalRow, { borderTop: '1 solid #ccc', marginTop: 10, paddingTop: 8 }]}>
                  <Text style={styles.totalLabel}>TOTAL SERVICIOS:</Text>
                  <Text style={styles.totalAmount}>${formatNumber(totalServicios)}</Text>
                </View>
              </View>
            )}

            {/* Servicios incluidos/sin costo */}
            <View style={styles.includedServicesCard}>
              <Text style={styles.includedServiceTitle}>
                ✓ Servicios Incluidos / Sin Costo
              </Text>
              
              <View style={styles.row}>
                <Text style={[styles.label, { color: '#3E6553', flex: 2 }]}>
                  • Diseño y asesoramiento:
                </Text>
                <Text style={[styles.includedServiceText, { flex: 1 }]}>
                  Sin cargo
                </Text>
              </View>
              
              <View style={styles.row}>
                <Text style={[styles.label, { color: '#3E6553', flex: 2 }]}>
                  • Garantía de confección:
                </Text>
                <Text style={[styles.includedServiceText, { flex: 1 }]}>
                  1 año
                </Text>
              </View>
            </View>
          </View>

          {/* Resumen Final */}
          <View style={styles.section}>
            <View style={styles.calculationCard}>
              <View style={styles.calculationRow}>
                <Text style={styles.calculationDetail}>
                  {cantidadCortinas} cortina{cantidadCortinas > 1 ? 's' : ''} × ${formatNumber(totalPorCortina)}:
                </Text>
                <Text style={styles.calculationDetail}>
                  ${formatNumber(totalCortinas)}
                </Text>
              </View>
              
              {totalServicios > 0 && (
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationDetail}>Servicios Adicionales:</Text>
                  <Text style={styles.calculationDetail}>
                    + ${formatNumber(totalServicios)}
                  </Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL GENERAL:</Text>
                <Text style={styles.totalAmount}>${formatNumber(totalGeneral)}</Text>
              </View>
            </View>
          </View>

          {/* Información Importante */}
          <View style={[styles.card, { marginTop: 6 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Información Importante</Text>
            <Text style={styles.noteText}>• Precios válidos por 30 días</Text>
            <Text style={styles.noteText}>• Para comenzar el trabajo se requiere seña del 50%</Text>
            <Text style={styles.noteText}>• Tiempo de entrega estimado: 10-20 días hábiles</Text>
            <Text style={styles.noteText}>• Garantía de 1 año en confección</Text>
            <Text style={styles.noteText}>• Formas de pago: Efectivo, transferencia, Mercado Pago</Text>
          </View>

          {/* Información del vendedor */}
          <View style={{ marginTop: 10, borderTop: '1 solid #e0e0e0', paddingTop: 10 }}>
            <Text style={styles.vendedorContact}>
              Contacto: schwartznatali@gmail.com | Teléfono: +54 9 11 6162-2602
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PresupuestoPDF;