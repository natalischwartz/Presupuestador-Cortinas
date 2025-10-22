import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const PRECIO_POR_METRO = Number(import.meta.env.VITE_PRECIO_POR_METRO);
const PRECIO_POR_METRO_ROLLER = Number(import.meta.env.VITE_PRECIO_POR_METRO_ROLLER);
const ADICIONAL_FIJO = Number(import.meta.env.VITE_ADICIONAL_FIJO);

const BASE_PRICES = {
  CONFECTION: Number(import.meta.env.VITE_CONFECTION_PRICE),
  CONFECTION_EXTRA: Number(import.meta.env.VITE_CONFECTION_EXTRA_PRICE),
  RAIL: Number(import.meta.env.VITE_RAIL_PRICE), 
  INSTALLATION: Number(import.meta.env.VITE_PRICE_INSTALLATION), 
  MEASUREMENT_CABA: Number(import.meta.env.VITE_PRICE_MEASUREMENT_CABA),
  MEASUREMENT_GBA: Number(import.meta.env.VITE_PRICE_MEASUREMENT_GBA), 
};

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
  return value.toLocaleString();
}

// Función auxiliar para formatear medidas
function formatMeasurement(value) {
  if (typeof value !== 'number' || isNaN(value)) return '0.00';
  return value.toFixed(2);
}


// Lógica de cálculo de servicio
const calcularCostoServicio = (tipo, presupuesto) => {
  const { necesitaTM, cantidadVentanas, ubicacionTM, necesitaRiel, cantidadVentanasRiel, metrosPorVentana, hasInstallation, cantidadVentanasInstalacion, customWidth } = presupuesto;
  console.log("cantidadVentanasRiel --->", cantidadVentanasRiel)

  let result = 0;

  if (tipo === "tomaMedidas" & necesitaTM){
      const precioTM = ubicacionTM === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA : BASE_PRICES.MEASUREMENT_GBA;
      result = (cantidadVentanas || 1) * precioTM;
      return result;
  }

  if (tipo === "rieles" & necesitaRiel) {
      const metros = (metrosPorVentana > 0 ? metrosPorVentana : parseFloat(customWidth || 0)) || 0;
      result = (cantidadVentanasRiel || 1) * metros * BASE_PRICES.RAIL;
      return result;
  }

  if (tipo === "instalacion" && hasInstallation) {
      result = (cantidadVentanasInstalacion || 1) * BASE_PRICES.INSTALLATION;
      return result;
  }

  return result;
};

// Lógica de cálculo de cortina (replicando QuoteSummaryStep)
const calcularTotalPorCortina = (presupuesto) => {
  const { customWidth, curtainType, formulaPersonalizadaActiva, formulaValorPersonalizado, formulaPrecioPersonalizado, adicionalFijo, formulaMultiplicador } = presupuesto;
  const windowWidth = parseFloat(customWidth) || 0;
  const precioMetro = formulaPrecioPersonalizado || PRECIO_POR_METRO;
  const adicFijo = adicionalFijo || ADICIONAL_FIJO;
  
  if (!windowWidth) return 0;

  if (formulaPersonalizadaActiva) {
    const valorPersonalizado = formulaValorPersonalizado || (windowWidth * (formulaMultiplicador || 2));
    return valorPersonalizado * precioMetro + adicFijo;
  } 
  
  if (curtainType === 'roller') {
    // FORMULA ROLLER : (sistema + tela) * 2 + adicional fijo (Roller usa su propio precio por metro)
    const precioRoller = PRECIO_POR_METRO_ROLLER;
    const windowHeight = parseFloat(presupuesto.customHeight) || 0;
    const sistema = windowWidth * precioRoller;
    const tela = windowWidth * windowHeight * precioRoller;
    return (sistema + tela) * 2 + ADICIONAL_FIJO;
  }
  
  // FÓRMULA TRADICIONAL: Valor × Precio + Adicional Fijo (se usa 2 * windowWidth si no hay valor personalizado)
  const valor = formulaValorPersonalizado || (windowWidth * 2);
  return valor * PRECIO_POR_METRO + ADICIONAL_FIJO;
};




export const PresupuestoPDF = ({ 
  data,
}) => {
  
   // Asegurarnos de que data sea un array
  // const presupuestos = Array.isArray(data) ? data : [data];

  // console.log("presupuestos", presupuestos)

  if (!data) return null;
  // Preparar datos de los presupuestos, calculando todo internamente
  const presupuestosCalculados = data.map((presupuesto, index) => {
    
    const cantidadCortinas = Number(presupuesto.curtainQuantity) || 1;
    
    // 1. CÁLCULO DE CORTINAS
    const totalPorCortina = calcularTotalPorCortina(presupuesto);
    const totalCortinas = totalPorCortina * cantidadCortinas;
    
    // 2. CÁLCULO DE SERVICIOS
    const costoTomaMedidas = calcularCostoServicio('tomaMedidas', presupuesto);
    const costoRieles = calcularCostoServicio('rieles', presupuesto);
    const costoInstalacion = calcularCostoServicio('instalacion', presupuesto);
    const totalServicios = costoTomaMedidas + costoRieles + costoInstalacion;
    console.log({
      costoTomaMedidas,
      costoRieles,
      costoInstalacion
    })
    
    // 3. GENERACIÓN DE CÁLCULO DETALLE
    const getServiceCalculationDetail = (tipo) => {
      const { necesitaTM, cantidadVentanas, ubicacionTM, necesitaRiel, cantidadVentanasRiel, metrosPorVentana, hasInstallation, cantidadVentanasInstalacion, customWidth } = presupuesto;
      switch (tipo) {
        case 'tomaMedidas':
          if (!necesitaTM) return null;
          const precioTM = ubicacionTM === 'CABA' ? BASE_PRICES.MEASUREMENT_CABA : BASE_PRICES.MEASUREMENT_GBA;
          return `${cantidadVentanas || 1} ventana(s) × $${formatNumber(precioTM)}/${ubicacionTM}`;
        case 'rieles':
          if (!necesitaRiel) return null;
          const metros = (metrosPorVentana > 0 ? metrosPorVentana : parseFloat(customWidth || 0)) || 0;
          return `${cantidadVentanasRiel || 1} ventana(s) × ${formatMeasurement(metros)}m × $${formatNumber(BASE_PRICES.RAIL)}`;
        case 'instalacion':
          if (!hasInstallation) return null;
          return `${cantidadVentanasInstalacion || 1} ventana(s) × $${formatNumber(BASE_PRICES.INSTALLATION)}`;
        default:
          return null;
      }
    };
    
    const result = {
      ...presupuesto,
      index: index + 1,
      servicios: {
        tomaMedidas: costoTomaMedidas,
        rieles: costoRieles,
        instalacion: costoInstalacion,
        total: totalServicios,
        detalle: {
          tomaMedidas: getServiceCalculationDetail('tomaMedidas'),
          rieles: getServiceCalculationDetail('rieles'),
          instalacion: getServiceCalculationDetail('instalacion')
        }
      },
      cortinas: {
        totalPorCortina,
        totalCortinas,
        cantidadCortinas,
        windowWidth: Number.parseFloat(presupuesto.customWidth) || 0,
        windowHeight: Number.parseFloat(presupuesto.customHeight) || 0,
        // Info adicional
        usandoFormulaPersonalizada: presupuesto.formulaPersonalizadaActiva || false,
        precioPorMetro: presupuesto.formulaPersonalizadaActiva ? (presupuesto.formulaPrecioPersonalizado || PRECIO_POR_METRO) : PRECIO_POR_METRO,
        adicionalFijo: presupuesto.adicionalFijo || ADICIONAL_FIJO
      },
      totalIndividual: totalCortinas + totalServicios
    };

    console.log("Result getServiceCalculationDetail:", result);
    return result;
  });

  

  // Calcular totales generales
  const totalGeneralCortinas = presupuestosCalculados.reduce((sum, p) => sum + p.cortinas.totalCortinas, 0);
  const totalGeneralServicios = presupuestosCalculados.reduce((sum, p) => sum + p.servicios.total, 0);
  const totalGeneral = totalGeneralCortinas + totalGeneralServicios;

  // Calcular totales por tipo de servicio
  const totalTomaMedidas = presupuestosCalculados.reduce((sum, p) => sum + p.servicios.tomaMedidas, 0);
  const totalRieles = presupuestosCalculados.reduce((sum, p) => sum + p.servicios.rieles, 0);
  const totalInstalacion = presupuestosCalculados.reduce((sum, p) => sum + p.servicios.instalacion, 0);

  // Determinar si algún servicio fue solicitado (para la tarjeta de servicios incluidos)
  const tomaMedidasSolicitado = presupuestosCalculados.some(p => p.necesitaTM);
  const rielesSolicitado = presupuestosCalculados.some(p => p.necesitaRiel);
  const instalacionSolicitado = presupuestosCalculados.some(p => p.hasInstallation);

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
            Presupuesto
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
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{customerInfo?.email || "No proporcionado"}</Text>
            </View>
          </View>

          {/* Tabla de Presupuestos - Cortinas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Detalle de Cortinas
            </Text>
            
            <View style={styles.tableContainer}>
              {/* Encabezado de la tabla */}
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Cant.</Text>
                <Text style={styles.tableHeaderText}>Tipo</Text>
                <Text style={styles.tableHeaderText}>Medidas</Text>
                <Text style={styles.tableHeaderText}>Tela</Text>
                <Text style={styles.tableHeaderText}>Total</Text>
              </View>

              {/* Filas de la tabla */}
              {presupuestosCalculados.map((presupuesto, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {presupuesto.cortinas.cantidadCortinas}
                  </Text>
                  <Text style={styles.tableCell}>
                    {presupuesto.curtainType ? 
                      presupuesto.curtainType.charAt(0).toUpperCase() + presupuesto.curtainType.slice(1) : 
                      "Tradicional"
                    }
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatMeasurement(presupuesto.cortinas.windowWidth)}m x {formatMeasurement(presupuesto.cortinas.windowHeight)}m
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
                <Text style={[styles.tableCellBold, {flex: 4, textAlign: 'right'}]}>
                  Subtotal Cortinas:
                </Text>
                <Text style={[styles.tableCellBold, {color: '#3E6553'}]}>
                  ${formatNumber(totalGeneralCortinas)}
                </Text>
              </View>
            </View>
          </View>

          {/* Sección de Servicios Adicionales */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
              Servicios y Accesorios
      </Text>

      {totalGeneralServicios > 0 && (
      // Mostrar servicios con costo
      <View style={styles.serviceCalculationCard}>
        <Text style={styles.calculationDetailTitle}>
          Detalle de Costos Adicionales
        </Text>
        
        {presupuestosCalculados.map((p, index) => p.servicios.total > 0 && (
          <View key={`serv-det-${index}`}>
            <Text style={[styles.label, {marginTop: 5, marginBottom: 5, color: '#2c3e50'}]}>
              Presupuesto {index + 1} ({p.curtainType.charAt(0).toUpperCase() + p.curtainType.slice(1)}):
            </Text>
            {p.servicios.tomaMedidas > 0 && (
              <View style={styles.calculationRow}>
                <Text style={styles.calculationDetail}>• Toma de Medidas ({p.servicios.detalle.tomaMedidas}):</Text>
                <Text style={styles.calculationDetail}>
                  ${formatNumber(p.servicios.tomaMedidas)}
                </Text>
              </View>
            )}
            {p.servicios.rieles > 0 && (
              <View style={styles.calculationRow}>
                <Text style={styles.calculationDetail}>• Rieles ({p.servicios.detalle.rieles}):</Text>
                <Text style={styles.calculationDetail}>
                  ${formatNumber(p.servicios.rieles)}
                </Text>
              </View>
            )}
            {p.servicios.instalacion > 0 && (
              <View style={styles.calculationRow}>
                <Text style={styles.calculationDetail}>• Instalación ({p.servicios.detalle.instalacion}):</Text>
                <Text style={styles.calculationDetail}>
                  ${formatNumber(p.servicios.instalacion)}
                </Text>
              </View>
            )}
          </View>
        ))}
          <View style={[styles.totalRow, {borderTop: '1 solid #ccc', marginTop: 10, paddingTop: 8}]}>
          <Text style={styles.totalLabel}>TOTAL SERVICIOS:</Text>
          <Text style={styles.totalAmount}>${formatNumber(totalGeneralServicios)}</Text>
        </View>
      </View>
      )}

{/* 2. Bloque de Servicios Incluidos (SIEMPRE aparece) */}
<View style={styles.includedServicesCard}>
    <Text style={styles.includedServiceTitle}>
        ✓ Servicios Incluidos / Sin Costo
    </Text>
    
    <View style={styles.row}>
        <Text style={[styles.label, {color: '#3E6553', flex: 2}]}>• Toma de medidas:</Text>
        <Text style={[styles.includedServiceText, {flex: 1}]}>
            {/* Muestra "Solicitado, pero costo $0" solo si fue solicitado y su costo fue cero */}
            {tomaMedidasSolicitado && totalTomaMedidas === 0 ? 'Solicitado, pero costo $0' : 'Sin cargo'}
        </Text>
    </View>

    <View style={styles.row}>
        <Text style={[styles.label, {color: '#3E6553', flex: 2}]}>• Colocación/Instalación:</Text>
        <Text style={[styles.includedServiceText, {flex: 1}]}>
            {/* Muestra "Solicitado, pero costo $0" solo si fue solicitado y su costo fue cero */}
            {instalacionSolicitado && totalInstalacion === 0 ? 'Solicitado, pero costo $0' : 'Sin cargo'}
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
                  <Text style={styles.calculationDetail}>Servicios Adicionales:</Text>
                  <Text style={styles.calculationDetail}>
                    + ${formatNumber(totalGeneralServicios)}
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
          <View style={[styles.card, {marginTop: 6}]}>
            <Text style={[styles.sectionTitle, {marginBottom: 5}]}>Información Importante</Text>
            <Text style={styles.noteText}>• Precios válidos por 30 días</Text>
            <Text style={styles.noteText}>• Para comenzar el trabajo se requiere seña del 50%</Text>
            <Text style={styles.noteText}>• Tiempo de entrega estimado: 10-20 días hábiles</Text>
            <Text style={styles.noteText}>• Garantía de 1 año en confección</Text>
            <Text style={styles.noteText}>• Formas de pago: Efectivo, transferencia, Mercado Pago, Homebanking</Text>
          </View>

          <View style={{marginTop: 10, borderTop: '1 solid #e0e0e0', paddingTop: 10}}>
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