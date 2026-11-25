import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BotonPrincipal, Campo } from '../components/Formulario';
import Insignia from '../components/Insignia';
import MensajeError from '../components/MensajeError';
import { obtenerProducto, registrarEntrada } from '../services/productoService';
import { colores, espacio, radio, STOCK_BAJO, tarjeta, tipografia } from '../theme';
import { NombreIcono } from '../types/icono';
import { Producto } from '../types/producto';
import { avisar, confirmar } from '../utils/confirmar';
import { formatearMoneda } from '../utils/formato';

interface Props {
  id: number;
}

// Detalle del producto y registro de entradas de stock (HU02).
export default function ProductoDetalleScreen({ id }: Props) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorEntrada, setErrorEntrada] = useState<string | null>(null);

  useEffect(() => {
    obtenerProducto(id)
      .then(setProducto)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <View style={styles.scroll}>
        <MensajeError mensaje={error} />
      </View>
    );
  if (!producto) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colores.primario} />;

  const precio = formatearMoneda(producto.precio_unitario);
  const sinStock = producto.stock_actual <= 0;
  const stockBajo = !sinStock && producto.stock_actual <= STOCK_BAJO;

  function onRegistrar() {
    if (!producto) return;
    const valor = Number(cantidad);
    if (!cantidad.trim() || !Number.isInteger(valor) || valor <= 0) {
      setErrorEntrada('La cantidad debe ser un número entero mayor a 0');
      return;
    }
    setErrorEntrada(null);
    confirmar('Registrar entrada', `¿Sumar ${valor} ${producto.unidad_medida} al stock de "${producto.nombre}"?`, () =>
      guardarEntrada(valor),
    );
  }

  async function guardarEntrada(valor: number) {
    setGuardando(true);
    try {
      const actualizado = await registrarEntrada(id, { cantidad: valor, motivo: motivo.trim() || undefined });
      setProducto(actualizado);
      setCantidad('');
      setMotivo('');
      avisar('Entrada registrada', `Ahora hay ${actualizado.stock_actual} ${actualizado.unidad_medida} en stock.`);
    } catch (e) {
      setErrorEntrada((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.tarjeta}>
        <View style={styles.cabecera}>
          <View style={styles.iconoProducto}>
            <Ionicons name="cube" size={28} color={colores.primario} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={tipografia.titulo}>{producto.nombre}</Text>
            <Text style={tipografia.secundario}>Código #{producto.id}</Text>
          </View>
        </View>

        <View style={styles.stockCaja}>
          <View>
            <Text style={tipografia.etiqueta}>Stock actual</Text>
            <Text style={styles.stockNumero}>
              {producto.stock_actual} <Text style={styles.stockUnidad}>{producto.unidad_medida}</Text>
            </Text>
          </View>
          {sinStock ? (
            <Insignia texto="Agotado" tipo="peligro" icono="close-circle" />
          ) : stockBajo ? (
            <Insignia texto="Stock bajo" tipo="advertencia" icono="warning" />
          ) : (
            <Insignia texto="Disponible" tipo="exito" icono="checkmark-circle" />
          )}
        </View>

        <Fila icono="pricetag-outline" label="Categoría" valor={producto.categoria} />
        <Fila icono="resize-outline" label="Unidad de medida" valor={producto.unidad_medida} />
        <Fila icono="cash-outline" label="Precio unitario" valor={precio} ultima />
      </View>

      <View style={styles.tarjeta}>
        <View style={styles.tituloSeccion}>
          <Ionicons name="add-circle" size={22} color={colores.exito} />
          <Text style={tipografia.titulo}>Registrar entrada de stock</Text>
        </View>
        <Text style={styles.ayuda}>Úsalo cuando llegue mercancía: la cantidad se suma al stock actual.</Text>

        <Campo
          label={`Cantidad (${producto.unidad_medida})`}
          value={cantidad}
          onChangeText={setCantidad}
          placeholder="Ej. 10"
          keyboardType="number-pad"
          icono="layers-outline"
        />
        <Campo
          label="Motivo (opcional)"
          value={motivo}
          onChangeText={setMotivo}
          placeholder="Ej. Compra a proveedor"
          maxLength={200}
          icono="document-text-outline"
        />

        {errorEntrada && <MensajeError mensaje={errorEntrada} />}

        <BotonPrincipal
          texto="Registrar entrada"
          icono="arrow-down-circle"
          cargando={guardando}
          onPress={onRegistrar}
        />
      </View>
    </ScrollView>
  );
}

interface FilaProps {
  icono: NombreIcono;
  label: string;
  valor: string;
  ultima?: boolean;
}

function Fila({ icono, label, valor, ultima = false }: FilaProps) {
  return (
    <View style={[styles.fila, ultima && { borderBottomWidth: 0 }]}>
      <Ionicons name={icono} size={18} color={colores.textoTenue} />
      <Text style={styles.filaLabel}>{label}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: espacio.lg,
    gap: espacio.lg,
  },
  tarjeta: {
    ...tarjeta,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.md,
    marginBottom: espacio.lg,
  },
  iconoProducto: {
    width: 56,
    height: 56,
    borderRadius: radio.lg,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockCaja: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colores.fondo,
    borderRadius: radio.md,
    padding: espacio.md + 2,
    marginBottom: espacio.sm,
  },
  stockNumero: {
    fontSize: 28,
    fontWeight: '800',
    color: colores.texto,
    marginTop: 2,
  },
  stockUnidad: {
    fontSize: 15,
    fontWeight: '500',
    color: colores.textoSecundario,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.sm + 2,
    paddingVertical: espacio.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
  },
  filaLabel: {
    flex: 1,
    color: colores.textoSecundario,
    fontSize: 15,
  },
  valor: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.texto,
  },
  tituloSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.sm,
  },
  ayuda: {
    ...tipografia.secundario,
    marginTop: espacio.xs,
    marginBottom: espacio.lg,
  },
});
