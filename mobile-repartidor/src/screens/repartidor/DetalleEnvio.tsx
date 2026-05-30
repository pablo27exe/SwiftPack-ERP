import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const DetalleEnvio: React.FC = ({ route, navigation }: any) => {
  const { envio } = route.params;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return '#f59e0b';
      case 'en_transito': return '#3b82f6';
      case 'entregado': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_transito': return 'En tránsito';
      case 'entregado': return 'Entregado';
      default: return estado;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.guia}>{envio.numero_guia}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(envio.estado) }]}>
          <Text style={styles.estadoText}>{getEstadoTexto(envio.estado)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ruta</Text>
        <View style={styles.rutaContainer}>
          <View style={styles.rutaPunto}>
            <Text style={styles.rutaLabel}>Origen</Text>
            <Text style={styles.rutaValor}>{envio.origen}</Text>
          </View>
          <View style={styles.rutaLinea} />
          <View style={styles.rutaPunto}>
            <Text style={styles.rutaLabel}>Destino</Text>
            <Text style={styles.rutaValor}>{envio.destino}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles del paquete</Text>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Peso:</Text>
          <Text style={styles.detalleValor}>{envio.peso} kg</Text>
        </View>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Tipo de servicio:</Text>
          <Text style={styles.detalleValor}>{envio.tipo_servicio}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Remitente</Text>
        <Text style={styles.nombre}>{envio.remitente_nombre}</Text>
        <Text style={styles.direccion}>{envio.remitente_direccion}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destinatario</Text>
        <Text style={styles.nombre}>{envio.destinatario_nombre}</Text>
        <Text style={styles.direccion}>{envio.destinatario_direccion}</Text>
      </View>

      {envio.estado !== 'entregado' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ActualizarEstado', { envio })}
        >
          <Text style={styles.buttonText}>Actualizar estado</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  guia: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11519c',
    fontFamily: 'monospace',
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 12,
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f1c2e',
    marginBottom: 12,
  },
  rutaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rutaPunto: {
    flex: 1,
  },
  rutaLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  rutaValor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f1c2e',
  },
  rutaLinea: {
    width: 40,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  detalleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detalleLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detalleValor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f1c2e',
  },
  nombre: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f1c2e',
    marginBottom: 4,
  },
  direccion: {
    fontSize: 13,
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#ef5a07',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetalleEnvio;