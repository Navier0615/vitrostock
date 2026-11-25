import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colores, espacio, radio, tarjeta } from '../theme';
import { NombreIcono } from '../types/icono';

// Piezas reutilizables para todos los formularios de la app.

interface CampoProps {
  label: string;
  value: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad' | 'number-pad' | 'phone-pad';
  icono?: NombreIcono;
  maxLength?: number;
}

export function Campo({ label, keyboardType = 'default', icono, ...props }: CampoProps) {
  // Se resalta el borde del campo mientras el usuario escribe en él.
  const [enfocado, setEnfocado] = useState(false);

  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.caja, enfocado && styles.cajaEnfocada]}>
        {icono && <Ionicons name={icono} size={18} color={enfocado ? colores.acento : colores.textoTenue} />}
        <TextInput
          style={styles.input}
          keyboardType={keyboardType}
          placeholderTextColor={colores.textoTenue}
          onFocus={() => setEnfocado(true)}
          onBlur={() => setEnfocado(false)}
          {...props}
        />
      </View>
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
      <Pressable
        style={({ pressed }) => [styles.boton, styles.mitad, styles.cancelar, pressed && styles.presionado]}
        onPress={onCancelar}
        disabled={guardando}
      >
        <Text style={styles.textoCancelar}>Cancelar</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.boton, styles.mitad, styles.guardar, pressed && styles.presionado]}
        onPress={onGuardar}
        disabled={guardando}
      >
        {guardando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.textoGuardar}>Guardar</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

// Botón principal de ancho completo (ej. "Registrar entrada").
interface BotonProps {
  texto: string;
  icono?: NombreIcono;
  cargando?: boolean;
  onPress: () => void;
}

export function BotonPrincipal({ texto, icono, cargando = false, onPress }: BotonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.boton, styles.guardar, pressed && styles.presionado]}
      onPress={onPress}
      disabled={cargando}
    >
      {cargando ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icono && <Ionicons name={icono} size={20} color="#fff" />}
          <Text style={styles.textoGuardar}>{texto}</Text>
        </>
      )}
    </Pressable>
  );
}

export const formStyles = StyleSheet.create({
  container: {
    padding: espacio.lg,
    paddingBottom: espacio.xxl,
  },
  // Tarjeta blanca que agrupa los campos del formulario.
  tarjeta: {
    ...tarjeta,
    marginBottom: espacio.lg,
  },
  error: {
    color: colores.peligro,
    marginBottom: espacio.md,
  },
});

const styles = StyleSheet.create({
  campo: {
    marginBottom: espacio.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
    marginBottom: espacio.sm - 2,
  },
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.sm,
    backgroundColor: colores.fondo,
    borderRadius: radio.md,
    borderWidth: 1.5,
    borderColor: colores.borde,
    paddingHorizontal: espacio.md,
  },
  cajaEnfocada: {
    borderColor: colores.acento,
    backgroundColor: colores.superficie,
  },
  input: {
    flex: 1,
    paddingVertical: espacio.md - 1,
    fontSize: 16,
    color: colores.texto,
  },
  botones: {
    flexDirection: 'row',
    gap: espacio.md,
  },
  boton: {
    flexDirection: 'row',
    gap: espacio.xs + 2,
    borderRadius: radio.md,
    paddingVertical: espacio.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mitad: {
    flex: 1,
  },
  cancelar: {
    backgroundColor: colores.superficie,
    borderWidth: 1.5,
    borderColor: colores.borde,
  },
  guardar: {
    backgroundColor: colores.acento,
  },
  presionado: {
    opacity: 0.8,
  },
  textoCancelar: {
    fontSize: 16,
    color: colores.textoSecundario,
    fontWeight: '600',
  },
  textoGuardar: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});
