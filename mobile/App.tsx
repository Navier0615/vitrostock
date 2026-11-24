import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import TabBar, { Tab } from './components/TabBar';
import ClienteDetalleScreen from './screens/ClienteDetalleScreen';
import ClientesScreen from './screens/ClientesScreen';
import CuentasCobrarScreen from './screens/CuentasCobrarScreen';
import NuevaCuentaCobrarScreen from './screens/NuevaCuentaCobrarScreen';
import NuevoClienteScreen from './screens/NuevoClienteScreen';
import NuevoProductoScreen from './screens/NuevoProductoScreen';
import ProductoDetalleScreen from './screens/ProductoDetalleScreen';
import ProductosScreen from './screens/ProductosScreen';

// Navegación simple con estado (sin librerías extra): una pestaña activa y una pantalla dentro de ella.
type Modulo = 'productos' | 'clientes' | 'cuentasCobrar';

type Pantalla =
  | { nombre: 'productos' }
  | { nombre: 'nuevoProducto' }
  | { nombre: 'detalleProducto'; id: number }
  | { nombre: 'clientes' }
  | { nombre: 'nuevoCliente' }
  | { nombre: 'detalleCliente'; id: number }
  | { nombre: 'cuentasCobrar' }
  | { nombre: 'nuevaCuentaCobrar'; clienteId?: number; volverA: Pantalla };

const TABS: Tab<Modulo>[] = [
  { key: 'productos', label: 'Inventario' },
  { key: 'clientes', label: 'Clientes' },
  { key: 'cuentasCobrar', label: 'Por cobrar' },
];

const TITULOS: Record<Pantalla['nombre'], string> = {
  productos: 'Inventario',
  nuevoProducto: 'Nuevo producto',
  detalleProducto: 'Detalle del producto',
  clientes: 'Clientes',
  nuevoCliente: 'Nuevo cliente',
  detalleCliente: 'Detalle del cliente',
  cuentasCobrar: 'Cuentas por cobrar',
  nuevaCuentaCobrar: 'Nueva cuenta por cobrar',
};

export default function App() {
  const [modulo, setModulo] = useState<Modulo>('productos');
  const [pantalla, setPantalla] = useState<Pantalla>({ nombre: 'productos' });

  const inicioModulo = (m: Modulo): Pantalla => ({ nombre: m });
  const esInicio = pantalla.nombre === modulo;

  function cambiarModulo(m: Modulo) {
    setModulo(m);
    setPantalla(inicioModulo(m));
  }

  function volver() {
    setPantalla(pantalla.nombre === 'nuevaCuentaCobrar' ? pantalla.volverA : inicioModulo(modulo));
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        {!esInicio && (
          <Pressable onPress={volver} hitSlop={10}>
            <Text style={styles.volver}>‹ Volver</Text>
          </Pressable>
        )}
        <Text style={styles.titulo}>VitroStock · {TITULOS[pantalla.nombre]}</Text>
      </View>

      <View style={styles.contenido}>
        {pantalla.nombre === 'productos' && (
          <ProductosScreen
            onNuevo={() => setPantalla({ nombre: 'nuevoProducto' })}
            onVerDetalle={(id) => setPantalla({ nombre: 'detalleProducto', id })}
          />
        )}
        {pantalla.nombre === 'nuevoProducto' && <NuevoProductoScreen onGuardado={volver} onCancelar={volver} />}
        {pantalla.nombre === 'detalleProducto' && <ProductoDetalleScreen id={pantalla.id} />}

        {pantalla.nombre === 'clientes' && (
          <ClientesScreen
            onNuevo={() => setPantalla({ nombre: 'nuevoCliente' })}
            onVerDetalle={(id) => setPantalla({ nombre: 'detalleCliente', id })}
          />
        )}
        {pantalla.nombre === 'nuevoCliente' && <NuevoClienteScreen onGuardado={volver} onCancelar={volver} />}
        {pantalla.nombre === 'detalleCliente' && (
          <ClienteDetalleScreen
            id={pantalla.id}
            onNuevaCuenta={(clienteId) => setPantalla({ nombre: 'nuevaCuentaCobrar', clienteId, volverA: pantalla })}
          />
        )}

        {pantalla.nombre === 'cuentasCobrar' && (
          <CuentasCobrarScreen onNueva={() => setPantalla({ nombre: 'nuevaCuentaCobrar', volverA: pantalla })} />
        )}
        {pantalla.nombre === 'nuevaCuentaCobrar' && (
          <NuevaCuentaCobrarScreen clienteInicial={pantalla.clienteId} onGuardado={volver} onCancelar={volver} />
        )}
      </View>

      <TabBar tabs={TABS} activa={modulo} onCambiar={cambiarModulo} />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1F3A5F',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 14,
    backgroundColor: '#1F3A5F',
  },
  volver: {
    color: '#BFD7FF',
    fontSize: 16,
    marginBottom: 4,
  },
  titulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contenido: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
});
