import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Envio {
  id: number;
  numero_guia: string;
  origen: string;
  destino: string;
  estado: string;
}

const DashboardRepartidor: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cargarEnvios = async () => {
    try {
      const response = await api.get('/api/envios/repartidor/envios');
      // Filtrar solo envíos asignados a este repartidor
      setEnvios(response.data);
    } catch (error) {
      console.error('Error cargando envíos:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarEnvios();
    setRefreshing(false);
  };

  useEffect(() => {
    cargarEnvios();
  }, []);

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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>¡Bienvenido, {user?.nombre}!</Text>
        <Text style={styles.subtitle}>Tus envíos asignados</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{envios.length}</Text>
          <Text style={styles.statLabel}>Total envíos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {envios.filter(e => e.estado === 'pendiente').length}
          </Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {envios.filter(e => e.estado === 'entregado').length}
          </Text>
          <Text style={styles.statLabel}>Entregados</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Envíos del día</Text>

      {envios.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes envíos asignados</Text>
        </View>
      ) : (
        envios.map((envio) => (
          <TouchableOpacity
            key={envio.id}
            style={styles.envioCard}
            onPress={() => navigation.navigate('DetalleEnvio', { envio })}
          >
            <View style={styles.envioHeader}>
              <Text style={styles.envioGuia}>{envio.numero_guia}</Text>
              <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(envio.estado) }]}>
                <Text style={styles.estadoText}>{getEstadoTexto(envio.estado)}</Text>
              </View>
            </View>
            <Text style={styles.envioRuta}>
              {envio.origen} → {envio.destino}
            </Text>
          </TouchableOpacity>
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
    backgroundColor: '#11519c',
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fd8106',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11519c',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f1c2e',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  envioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  envioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  envioGuia: {
    fontSize: 14,
    fontWeight: '600',
    color: '#11519c',
    fontFamily: 'monospace',
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  estadoText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  envioRuta: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default DashboardRepartidor;