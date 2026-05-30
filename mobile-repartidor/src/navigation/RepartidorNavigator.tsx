import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardRepartidor from '../screens/repartidor/DashboardRepartidor';
import MisRutas from '../screens/repartidor/MisRutas';
import PerfilRepartidor from '../screens/repartidor/PerfilRepartidor';
import DetalleEnvio from '../screens/repartidor/DetalleEnvio';
import ActualizarEstado from '../screens/repartidor/ActualizarEstado';
import EvidenciaEntrega from '../screens/repartidor/EvidenciaEntrega';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator para envíos
const EnviosStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardRepartidor" component={DashboardRepartidor} />
      <Stack.Screen name="DetalleEnvio" component={DetalleEnvio} />
      <Stack.Screen name="ActualizarEstado" component={ActualizarEstado} />
      <Stack.Screen name="EvidenciaEntrega" component={EvidenciaEntrega} />
    </Stack.Navigator>
  );
};

const RepartidorNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Rutas') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#11519c',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={EnviosStack} />
      <Tab.Screen name="Rutas" component={MisRutas} />
      <Tab.Screen name="Perfil" component={PerfilRepartidor} />
    </Tab.Navigator>
  );
};

export default RepartidorNavigator;