import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { crearProducto } from '../services/productoService';
import { avisar, confirmar } from '../utils/confirmar';

interface Props {
  onGuardado: () => void;
  onCancelar: () => void;
}

// Registrar producto. El stock inicia en 0 (lo define el backend).
export default function NuevoProductoScreen({ onGuardado, onCancelar }: Props) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [unidad, setUnidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validar(): string | null {
    if (!nombre.trim()) return 'El nombre es obligatorio';
    if (!categoria.trim()) return 'La categoría es obligatoria';
    if (!unidad.trim()) return 'La unidad de medida es obligatoria';
    const valor = Number(precio.replace(',', '.'));
    if (!precio.trim() || Number.isNaN(valor) || valor <= 0) return 'El precio debe ser un número mayor a 0';
    return null;
  }

  function onGuardar() {
    const mensaje = validar();
    setError(mensaje);
    if (mensaje) return;

    confirmar('Registrar producto', `¿Registrar "${nombre.trim()}"?`, guardar);
  }

  async function guardar() {
    setGuardando(true);
    try {
      await crearProducto({
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        unidad_medida: unidad.trim(),
        precio_unitario: Number(precio.replace(',', '.')),
      });
      avisar('Producto registrado', 'El producto se creó con stock 0.');
      onGuardado();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Campo label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Ej. Vidrio templado 6 mm" />
      <Campo label="Categoría" value={categoria} onChangeText={setCategoria} placeholder="Ej. Vidrio" />
      <Campo label="Unidad de medida" value={unidad} onChangeText={setUnidad} placeholder="Ej. m2, unidad, metro" />
      <Campo
        label="Precio unitario"
        value={precio}
        onChangeText={setPrecio}
        placeholder="Ej. 85000"
        keyboardType="decimal-pad"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.botones}>
        <Pressable style={[styles.boton, styles.cancelar]} onPress={onCancelar} disabled={guardando}>
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </Pressable>
        <Pressable style={[styles.boton, styles.guardar]} onPress={onGuardar} disabled={guardando}>
          {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoGuardar}>Guardar</Text>}
        </Pressable>
      </View>
    </ScrollView>
  );
}

interface CampoProps {
  label: string;
  value: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad';
}

function Campo({ label, keyboardType = 'default', ...props }: CampoProps) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} keyboardType={keyboardType} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
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
  error: {
    color: '#B00020',
    marginBottom: 12,
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
