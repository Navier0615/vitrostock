import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacio, radio } from '../theme';

export interface OpcionFiltro<T> {
  label: string;
  valor?: T;
}

interface Props<T> {
  opciones: OpcionFiltro<T>[];
  valor?: T;
  onCambiar: (valor?: T) => void;
}

// Control segmentado para filtrar listas (ej. Pendientes / Pagadas / Todas).
export default function Filtros<T>({ opciones, valor, onCambiar }: Props<T>) {
  return (
    <View style={styles.contenedor}>
      {opciones.map((o) => {
        const activo = o.valor === valor;
        return (
          <Pressable
            key={o.label}
            onPress={() => onCambiar(o.valor)}
            style={[styles.opcion, activo && styles.opcionActiva]}
          >
            <Text style={[styles.texto, activo && styles.textoActivo]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    backgroundColor: colores.neutroSuave,
    borderRadius: radio.md,
    padding: 3,
    marginBottom: espacio.md,
  },
  opcion: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: espacio.sm,
    borderRadius: radio.sm + 1,
  },
  opcionActiva: {
    backgroundColor: colores.superficie,
    shadowColor: '#0F1E33',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  texto: {
    fontSize: 14,
    color: colores.textoSecundario,
    fontWeight: '500',
  },
  textoActivo: {
    color: colores.primario,
    fontWeight: '700',
  },
});
