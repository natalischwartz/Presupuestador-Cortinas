

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const PRECIO_POR_METRO = 65000;

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
    marginBottom: 20,
    color: '#7f8c8d',
  },
  section: {
    marginBottom: 15,
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
    marginBottom: 15,
  },
  calculationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
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
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  servicesSection: {
    marginTop: 15,
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
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    alignSelf: 'center',
  },
  noteSection: {
    backgroundColor: '#e3f2fd',
    border: '1 solid #90caf9',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },
  noteText: {
    fontSize: 10,
    color: '#1565c0',
    lineHeight: 1.4,
  },
  // Nuevos estilos para la tabla horizontal
  tableContainer: {
    border: '1 solid #e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
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

// Función para calcular totales de un presupuesto individual
function calcularPresupuestoIndividual(presupuesto, precioPorMetro = PRECIO_POR_METRO) {
  const getWindowHeight = () => {
    if (presupuesto?.customHeight) {
      return parseFloat(presupuesto.customHeight);
    }
    return 0;
  };

  const getWindowWidth = () => {
    if (presupuesto?.customWidth) {
      return parseFloat(presupuesto.customWidth);
    }
    return 0;
  };

  const windowHeight = getWindowHeight();
  const windowWidth = getWindowWidth();
  const cantidadCortinas = presupuesto?.curtainQuantity || 1;

  const totalPorCortina = windowWidth * 2 * precioPorMetro;
  const totalPresupuesto = totalPorCortina * cantidadCortinas;

  return {
    windowHeight,
    windowWidth,
    cantidadCortinas,
    totalPorCortina,
    totalPresupuesto,
    fabricName: presupuesto?.fabricName,
    curtainType: presupuesto?.curtainType,
    selectedFabric: presupuesto?.selectedFabric
  };
}

export const PresupuestoPDF = ({ 
  data = [], // Ahora recibe un array de presupuestos
  precioPorMetro = PRECIO_POR_METRO 
}) => {
  // Asegurarnos de que data sea un array
  const presupuestos = Array.isArray(data) ? data : [data];
  
  // Calcular cada presupuesto individual
  const presupuestosCalculados = presupuestos.map((presupuesto, index) => ({
    ...calcularPresupuestoIndividual(presupuesto, precioPorMetro),
    index: index + 1,
    customerInfo: presupuesto.customerInfo // Mantener info de contacto del primer presupuesto
  }));

  // Calcular total general
  const totalGeneral = presupuestosCalculados.reduce((sum, presupuesto) => 
    sum + presupuesto.totalPresupuesto, 0
  );

  // Usar la información de contacto del primer presupuesto
  const customerInfo = presupuestosCalculados[0]?.customerInfo || {};

  // Calcular servicios adicionales (tomados del primer presupuesto)
  const servicios = [
    {
      label: 'Toma de medidas',
      incluido: presupuestos[0]?.necesitaTM || false,
      detalles: presupuestos[0]?.necesitaTM ? 
        `${presupuestos[0].cantidadVentanas || 1} ventana(s) en ${presupuestos[0].ubicacionTM || 'CABA'}` : 
        'No solicitado'
    },
    {
      label: 'Rieles',
      incluido: presupuestos[0]?.necesitaRiel || false,
      detalles: presupuestos[0]?.necesitaRiel ? 
        `${presupuestos[0].cantidadVentanasRiel || 1} ventana(s)` : 
        'No solicitado'
    },
    {
      label: 'Instalación',
      incluido: presupuestos[0]?.hasInstallation || false,
      detalles: presupuestos[0]?.hasInstallation ? 
        'Incluye instalación profesional' : 
        'No requiere'
    }
  ];

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
            {presupuestosCalculados.length > 1 ? 'Resumen de Cotizaciones' : 'Resumen de Cotización'}
          </Text>
          <Text style={styles.subtitle}>
            {presupuestosCalculados.length > 1 
              ? `Detalle de ${presupuestosCalculados.length} presupuestos` 
              : 'Detalle simplificado de tu pedido'
            }
          </Text>

          {/* Información de Contacto */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Información de Contacto</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{customerInfo?.name || "No proporcionado"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{customerInfo?.phone || "No proporcionado"}</Text>
            </View>
          </View>

          {/* Tabla de Presupuestos - Forma Horizontal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {presupuestosCalculados.length > 1 ? 'Detalles de los Presupuestos' : 'Tu Pedido'}
            </Text>
            
            <View style={styles.tableContainer}>
              {/* Encabezado de la tabla */}
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Cantidad</Text>
                <Text style={styles.tableHeaderText}>Tipo</Text>
                <Text style={styles.tableHeaderText}>Medidas</Text>
                <Text style={styles.tableHeaderText}>Tela</Text>
                <Text style={styles.tableHeaderText}>Subtotal</Text>
              </View>

              {/* Filas de la tabla */}
              {presupuestosCalculados.map((presupuesto, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {presupuesto.cantidadCortinas} cortina{presupuesto.cantidadCortinas > 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.tableCell}>
                    {presupuesto.curtainType ? 
                      presupuesto.curtainType.charAt(0).toUpperCase() + presupuesto.curtainType.slice(1) : 
                      "Tradicional"
                    }
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatMeasurement(presupuesto.windowWidth)}m × {formatMeasurement(presupuesto.windowHeight)}m
                  </Text>
                  <Text style={styles.tableCell}>
                    {presupuesto.selectedFabric && presupuesto.fabricName ? 
                      presupuesto.fabricName : 'No seleccionada'
                    }
                  </Text>
                  <Text style={styles.tableCellBold}>
                    ${formatNumber(presupuesto.totalPresupuesto)}
                  </Text>
                </View>
              ))}

              {/* Pie de tabla con total general */}
              {presupuestosCalculados.length > 1 && (
                <View style={styles.tableFooter}>
                  <Text style={[styles.tableCellBold, {flex: 4, textAlign: 'right'}]}>
                    Total General:
                  </Text>
                  <Text style={[styles.tableCellBold, {color: '#3E6553'}]}>
                    ${formatNumber(totalGeneral)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Cálculo del Total General (solo para un presupuesto) */}
          {presupuestosCalculados.length === 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cálculo del Total</Text>
              
              <View style={styles.calculationCard}>
                
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>TOTAL GENERAL:</Text>
                  <Text style={styles.totalAmount}>${formatNumber(totalGeneral)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Servicios Adicionales */}
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Servicios Adicionales</Text>
            
            <View style={styles.card}>
              {servicios.map((servicio, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Text style={styles.serviceLabel}>{servicio.label}</Text>
                  <Text style={styles.serviceStatus}>{servicio.detalles}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Nota Explicativa */}
          <View style={styles.noteSection}>
            <Text style={styles.noteText}>
              <Text style={{fontWeight: 'bold'}}>Nota sobre el cálculo: </Text>
              El total se calcula multiplicando el ancho de la ventana por 2 (para el fruncido necesario) 
              y por nuestro precio estándar de ${precioPorMetro.toLocaleString()} por metro lineal.
            </Text>
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