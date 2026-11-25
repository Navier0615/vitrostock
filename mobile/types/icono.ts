import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Nombre válido de un icono de Ionicons (incluido en Expo Go a través de @expo/vector-icons).
export type NombreIcono = ComponentProps<typeof Ionicons>['name'];
