import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espacio, tipografia } from '../theme';
import { NombreIcono } from '../types/icono';

interface Props {
  icono: NombreIcono;
  titulo: string;
  mensaje?: string;
}

// Se muestra cuando una lista no tiene elementos.
export default function EstadoVacio({ icono, titulo, mensaje }: Props) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.circulo}>
        <Ionicons name={icono} size={36} color={colores.primario} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      {mensaje && <Text style={styles.mensaje}>{mensaje}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    paddingVertical: espacio.xxl,
    paddingHorizontal: espacio.xl,
  },
  circulo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacio.lg,
  },
  titulo: {
    ...tipografia.subtitulo,
    textAlign: 'center',
  },
  mensaje: {
    ...tipografia.secundario,
    textAlign: 'center',
    marginTop: espacio.xs,
  },
});
