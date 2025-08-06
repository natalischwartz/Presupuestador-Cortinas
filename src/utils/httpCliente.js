const API = "http://localhost:3000"

export const getProducts = async () => {
  try {
    const response = await fetch(API, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(response)
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Propaga el error para manejo externo
  }
}

