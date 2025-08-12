const API = import.meta.env.VITE_API_URL;

export const getProducts = async () => {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const dataProducts = await response.json();
    return dataProducts; // ← ahora sí retorna los datos
  } catch (error) {
    console.error(error);
    return null; // o podrías lanzar el error si preferís manejarlo desde afuera
  }
};

