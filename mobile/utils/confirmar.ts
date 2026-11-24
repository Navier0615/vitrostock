import { Alert, Platform } from 'react-native';

// Alert.alert con botones no funciona en web, así que allí se usa window.confirm.
export function confirmar(titulo: string, mensaje: string, onAceptar: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensaje}`)) onAceptar();
    return;
  }
  Alert.alert(titulo, mensaje, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Aceptar', onPress: onAceptar },
  ]);
}

export function avisar(titulo: string, mensaje: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensaje}`);
    return;
  }
  Alert.alert(titulo, mensaje);
}
