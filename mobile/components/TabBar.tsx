import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacio, radio } from '../theme';
import { NombreIcono } from '../types/icono';

export interface Tab<T extends string> {
  key: T;
  label: string;
  icono: NombreIcono;
  iconoActivo: NombreIcono;
}

interface Props<T extends string> {
  tabs: Tab<T>[];
  activa: T;
  onCambiar: (key: T) => void;
  // Espacio de la barra de navegación del sistema (botones o gestos) para no quedar debajo de ella.
  margenInferior?: number;
}

// Barra inferior para cambiar entre módulos de la app.
export default function TabBar<T extends string>({ tabs, activa, onCambiar, margenInferior = 0 }: Props<T>) {
  return (
    <View style={[styles.barra, { paddingBottom: margenInferior + espacio.sm }]}>
      {tabs.map((tab) => {
        const seleccionada = tab.key === activa;
        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => onCambiar(tab.key)}>
            <View style={[styles.pastilla, seleccionada && styles.pastillaActiva]}>
              <Ionicons
                name={seleccionada ? tab.iconoActivo : tab.icono}
                size={22}
                color={seleccionada ? colores.primario : colores.textoTenue}
              />
            </View>
            <Text style={[styles.texto, seleccionada && styles.textoActivo]} numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: colores.superficie,
    paddingTop: espacio.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.borde,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  pastilla: {
    width: 52,
    height: 30,
    borderRadius: radio.completo,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  pastillaActiva: {
    backgroundColor: colores.primarioSuave,
  },
  texto: {
    fontSize: 11,
    color: colores.textoTenue,
    fontWeight: '500',
  },
  textoActivo: {
    color: colores.primario,
    fontWeight: '700',
  },
});
