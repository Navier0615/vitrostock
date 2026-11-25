// URL base del backend de VitroStock.
// Se puede cambiar sin tocar código creando mobile/.env con EXPO_PUBLIC_API_URL.
// En un celular físico "localhost" no sirve: usar la IP del PC, ej. http://192.168.1.10:3000/api/v1
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
