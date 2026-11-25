import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espacio, radio, tarjeta, tipografia } from '../theme';
import { NombreIcono } from '../types/icono';

interface Props {
  icono: NombreIcono;
  etiqueta: string;
  valor: string;
  color?: string;
  fondoIcono?: string;
}

// Tarjeta con un dato destacado, como el total pendiente por pagar o por cobrar.
export default function TarjetaResumen({
  icono,
  etiqueta,
  valor,
  color = colores.primario,
  fondoIcono = colores.primarioSuave,
}: Props) {
  return (
    <View style={styles.tarjeta}>
      <View style={[styles.icono, { backgroundColor: fondoIcono }]}>
        <Ionicons name={icono} size={22} color={color} />
      </View>
      <View style={styles.info}>
        <Text style={tipografia.etiqueta}>{etiqueta}</Text>
        <Text style={[styles.valor, { color }]}>{valor}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    ...tarjeta,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.md,
    marginBottom: espacio.md,
  },
  icono: {
    width: 44,
    height: 44,
    borderRadius: radio.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  valor: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
});
