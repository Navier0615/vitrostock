import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// Piezas reutilizables para los formularios de proveedores y cuentas por pagar.

interface CampoProps {
  label: string;
  value: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad' | 'phone-pad';
}

export function Campo({ label, keyboardType = 'default', ...props }: CampoProps) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} keyboardType={keyboardType} {...props} />
    </View>
  );
}

export function Etiqueta({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

interface BotonesProps {
  guardando: boolean;
  onGuardar: () => void;
  onCancelar: () => void;
}

export function BotonesFormulario({ guardando, onGuardar, onCancelar }: BotonesProps) {
  return (
    <View style={styles.botones}>
      <Pressable style={[styles.boton, styles.cancelar]} onPress={onCancelar} disabled={guardando}>
        <Text style={styles.textoCancelar}>Cancelar</Text>
      </Pressable>
      <Pressable style={[styles.boton, styles.guardar]} onPress={onGuardar} disabled={guardando}>
        {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoGuardar}>Guardar</Text>}
      </Pressable>
    </View>
  );
}

export const formStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
  error: {
    color: '#B00020',
    marginBottom: 12,
  },
});

const styles = StyleSheet.create({
  campo: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  botones: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  boton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelar: {
    backgroundColor: '#E9ECEF',
  },
  guardar: {
    backgroundColor: '#007AFF',
  },
  textoCancelar: {
    fontSize: 16,
    color: '#333',
  },
  textoGuardar: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
