import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import api from '../../services/api';

interface Ruta {
  id: number;
  fecha: string;
  envios: Array<{
    id: number;
    numero_guia: string;
    destino: string;
    estado: string;
  }>;
}

const MisRutas: React.FC = ({ navigation }: any) => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cargarRutas = async () => {
    try {
      const response = await api.get('/api/repartidor/rutas');
      setRutas(response.data);
    } catch (error) {
      console.error('Error cargando rutas:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarRutas();
    setRefreshing(false);
  };

  useEffect(() => {
    cargarRutas();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mis rutas</Text>
        <Text style={styles.subtitle}>Rutas asignadas para hoy</Text>
      </View>

      {rutas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay rutas asignadas</Text>
        </View>
      ) : (
        rutas.map((ruta) => (
          <View key={ruta.id} style={styles.rutaCard}>
            <View style={styles.rutaHeader}>
              <Text style={styles.rutaFecha}>{ruta.fecha}</Text>
              <Text style={styles.rutaCantidad}>{ruta.envios.length} envíos</Text>
            </View>
            {ruta.envios.map((envio) => (
              <TouchableOpacity
                key={envio.id}
                style={styles.envioItem}
                onPress={() => navigation.navigate('DetalleEnvio', { envio })}
              >
                <Text style={styles.envioGuia}>{envio.numero_guia}</Text>
                <Text style={styles.envioDestino}>{envio.destino}</Text>
                <View style={[
                  styles.estadoDot,
                  envio.estado === 'entregado' && styles.estadoEntregado,
                  envio.estado === 'en_transito' && styles.estadoTransito,
                ]} />
              </TouchableOpacity>
            ))}
          </View>
        ))
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
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f1c2e',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  rutaCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  rutaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  rutaFecha: {
    fontSize: 14,
    fontWeight: '600',
    color: '#11519c',
  },
  rutaCantidad: {
    fontSize: 12,
    color: '#6b7280',
  },
  envioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  envioGuia: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#0f1c2e',
  },
  envioDestino: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
    marginLeft: 12,
  },
  estadoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
  },
  estadoEntregado: {
    backgroundColor: '#10b981',
  },
  estadoTransito: {
    backgroundColor: '#3b82f6',
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    marginHorizontal: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default MisRutas;