import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { BotonesFormulario, Campo, formStyles } from '../components/Formulario';
import MensajeError from '../components/MensajeError';
import { crearProducto } from '../services/productoService';
import { avisar, confirmar } from '../utils/confirmar';

interface Props {
  onGuardado: () => void;
  onCancelar: () => void;
}

// Registrar producto. Se puede indicar con cuánto stock arranca (si se deja vacío, inicia en 0).
export default function NuevoProductoScreen({ onGuardado, onCancelar }: Props) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [unidad, setUnidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [stockInicial, setStockInicial] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validar(): string | null {
    if (!nombre.trim()) return 'El nombre es obligatorio';
    if (!categoria.trim()) return 'La categoría es obligatoria';
    if (!unidad.trim()) return 'La unidad de medida es obligatoria';
    const valor = Number(precio.replace(',', '.'));
    if (!precio.trim() || Number.isNaN(valor) || valor <= 0) return 'El precio debe ser un número mayor a 0';
    if (stockInicial.trim()) {
      const stock = Number(stockInicial);
      if (!Number.isInteger(stock) || stock < 0) return 'El stock inicial debe ser un número entero de 0 en adelante';
    }
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
      const producto = await crearProducto({
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        unidad_medida: unidad.trim(),
        precio_unitario: Number(precio.replace(',', '.')),
        stock_inicial: stockInicial.trim() ? Number(stockInicial) : 0,
      });
      avisar(
        'Producto registrado',
        `El producto se creó con ${producto.stock_actual} ${producto.unidad_medida} en stock.`,
      );
      onGuardado();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={formStyles.container}>
      <View style={formStyles.tarjeta}>
        <Campo
          label="Nombre"
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej. Vidrio templado 6 mm"
          icono="cube-outline"
        />
        <Campo
          label="Categoría"
          value={categoria}
          onChangeText={setCategoria}
          placeholder="Ej. Vidrio"
          icono="pricetag-outline"
        />
        <Campo
          label="Unidad de medida"
          value={unidad}
          onChangeText={setUnidad}
          placeholder="Ej. m2, unidad, metro"
          icono="resize-outline"
        />
        <Campo
          label="Precio unitario"
          value={precio}
          onChangeText={setPrecio}
          placeholder="Ej. 85000"
          keyboardType="decimal-pad"
          icono="cash-outline"
        />
        <Campo
          label="Stock inicial (opcional)"
          value={stockInicial}
          onChangeText={setStockInicial}
          placeholder="Cantidad que ya tienes, ej. 20"
          keyboardType="number-pad"
          icono="layers-outline"
        />
      </View>

      {error && <MensajeError mensaje={error} />}

      <BotonesFormulario guardando={guardando} onGuardar={onGuardar} onCancelar={onCancelar} />
    </ScrollView>
  );
}
