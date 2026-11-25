import { Platform, TextStyle, ViewStyle } from 'react-native';

// Tema centralizado: todos los componentes toman de aquí colores, espaciado, bordes y tipografía.
// Si se quiere cambiar el aspecto de la app, basta con modificar este archivo.

export const colores = {
  primario: '#1E3A5F',
  primarioOscuro: '#142A47',
  primarioSuave: '#E8EEF7',
  acento: '#2F80ED',
  acentoSuave: '#E6F0FD',

  fondo: '#F3F5F9',
  superficie: '#FFFFFF',
  borde: '#E2E7EF',

  texto: '#1A2233',
  textoSecundario: '#5B6576',
  textoTenue: '#98A2B3',
  textoSobrePrimario: '#FFFFFF',
  textoSobrePrimarioTenue: '#AFC4E0',

  exito: '#16935A',
  exitoSuave: '#E3F5EC',
  advertencia: '#C97A06',
  advertenciaSuave: '#FDF2DF',
  peligro: '#D2393B',
  peligroSuave: '#FCEBEB',
  info: '#0E8FA8',
  infoSuave: '#E1F3F7',
  neutro: '#6B7280',
  neutroSuave: '#EEF0F3',
};

export const espacio = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radio = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  completo: 999,
};

export const tipografia = {
  tituloGrande: { fontSize: 24, fontWeight: '700', color: colores.texto } as TextStyle,
  titulo: { fontSize: 18, fontWeight: '700', color: colores.texto } as TextStyle,
  subtitulo: { fontSize: 16, fontWeight: '600', color: colores.texto } as TextStyle,
  cuerpo: { fontSize: 15, color: colores.texto } as TextStyle,
  secundario: { fontSize: 13, color: colores.textoSecundario } as TextStyle,
  etiqueta: {
    fontSize: 12,
    fontWeight: '600',
    color: colores.textoSecundario,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  } as TextStyle,
};

// Sombra suave para tarjetas; en Android se usa elevation y en iOS/web shadow*.
export const sombra: ViewStyle = Platform.select({
  android: { elevation: 2 },
  default: {
    shadowColor: '#0F1E33',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
}) as ViewStyle;

export const sombraFuerte: ViewStyle = Platform.select({
  android: { elevation: 6 },
  default: {
    shadowColor: '#0F1E33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
}) as ViewStyle;

// Estilo base de las tarjetas blancas que se repiten en todas las pantallas.
export const tarjeta: ViewStyle = {
  backgroundColor: colores.superficie,
  borderRadius: radio.lg,
  padding: espacio.lg,
  ...sombra,
};

// Productos con este stock o menos se marcan como "stock bajo" (solo es visual).
export const STOCK_BAJO = 5;
