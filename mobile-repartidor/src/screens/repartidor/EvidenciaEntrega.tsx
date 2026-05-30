import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

const EvidenciaEntrega: React.FC = ({ route, navigation }: any) => {
  const { envioId } = route.params;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<any>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.takePictureAsync(options);
      setPhoto(data.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const uploadEvidence = async () => {
    if (!photo) {
      Alert.alert('Error', 'Debes tomar o seleccionar una foto');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('evidencia', {
        uri: photo,
        type: 'image/jpeg',
        name: `entrega_${envioId}.jpg`,
      } as any);

      await api.post(`/api/envios/${envioId}/evidencia`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      Alert.alert('Éxito', 'Evidencia guardada correctamente');
      navigation.navigate('DashboardRepartidor');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la evidencia');
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Solicitando permiso...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No hay acceso a la cámara</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evidencia de entrega</Text>
      <Text style={styles.subtitle}>Toma una foto del paquete entregado</Text>

      {photo ? (
        <Image source={{ uri: photo }} style={styles.preview} />
      ) : (
        <Camera
          style={styles.camera}
          type="back"
          ref={(ref) => setCameraRef(ref)}
        />
      )}

      <View style={styles.buttonRow}>
        {!photo ? (
          <>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOutline} onPress={pickImage}>
              <Text style={styles.buttonOutlineText}>Galería</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={uploadEvidence} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Subiendo...' : 'Confirmar entrega'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOutline} onPress={() => setPhoto(null)}>
              <Text style={styles.buttonOutlineText}>Volver a tomar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  camera: {
    flex: 1,
    borderRadius: 16,
    marginBottom: 20,
  },
  preview: {
    flex: 1,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#ef5a07',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#11519c',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutlineText: {
    color: '#11519c',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EvidenciaEntrega;