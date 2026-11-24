import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface Tab<T extends string> {
  key: T;
  label: string;
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
    <View style={[styles.barra, { paddingBottom: margenInferior }]}>
      {tabs.map((tab) => {
        const seleccionada = tab.key === activa;
        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => onCambiar(tab.key)}>
            <Text style={[styles.texto, seleccionada && styles.textoActivo]} numberOfLines={1}>
              {tab.label}
            </Text>
            <View style={[styles.indicador, seleccionada && styles.indicadorActivo]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
  },
  texto: {
    fontSize: 12,
    color: '#777',
  },
  textoActivo: {
    color: '#1F3A5F',
    fontWeight: '700',
  },
  indicador: {
    height: 3,
    width: '60%',
    marginTop: 10,
    borderRadius: 2,
  },
  indicadorActivo: {
    backgroundColor: '#1F3A5F',
  },
});
