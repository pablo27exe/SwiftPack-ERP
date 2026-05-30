import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import api from '../../services/api';

const ActualizarEstado: React.FC = ({ route, navigation }: any) => {
  const { envio } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState(envio.estado);

  const estados = [
    { valor: 'pendiente', label: 'Pendiente', color: '#f59e0b' },
    { valor: 'en_transito', label: 'En tránsito', color: '#3b82f6' },
    { valor: 'entregado', label: 'Entregado', color: '#10b981' },
  ];

  const handleActualizar = async () => {
    if (selectedEstado === envio.estado) {
      Alert.alert('Info', 'No has cambiado el estado');
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/api/envios/${envio.id}/estado`, { estado: selectedEstado });
      Alert.alert('Éxito', 'Estado actualizado correctamente');
      
      if (selectedEstado === 'entregado') {
        navigation.navigate('EvidenciaEntrega', { envioId: envio.id });
      } else {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar estado</Text>
      <Text style={styles.guia}>Guía: {envio.numero_guia}</Text>

      <View style={styles.estadosContainer}>
        {estados.map((estado) => (
          <TouchableOpacity
            key={estado.valor}
            style={[
              styles.estadoOption,
              selectedEstado === estado.valor && styles.estadoSelected,
              { borderColor: estado.color }
            ]}
            onPress={() => setSelectedEstado(estado.valor)}
          >
            <Text style={[
              styles.estadoLabel,
              selectedEstado === estado.valor && { color: estado.color }
            ]}>
              {estado.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleActualizar}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Actualizando...' : 'Confirmar cambio'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f1c2e',
    marginBottom: 8,
  },
  guia: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    fontFamily: 'monospace',
  },
  estadosContainer: {
    gap: 12,
  },
  estadoOption: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  estadoSelected: {
    backgroundColor: '#f0fdf4',
  },
  estadoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f1c2e',
  },
  button: {
    backgroundColor: '#ef5a07',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActualizarEstado;