const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
    const jsonResponse = await res.json();
    if (!res.ok) {
      // Throw a custom error object with name and message properties
      throw { name: 'ServicesError', message: jsonResponse };
    }

    return jsonResponse;
}

export default class ExternalServices {
  constructor() {}

  async getData(category) {
    const response = await fetch(`/json/${category}.json`); 
    const data = await convertToJson(response);
    return data; 
  }

async findProductById(id) {
  const category = "tents"; 
  const products = await this.getData(category);
  
  return products.find((item) => item.Id === id);
}

  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    const response = await fetch(`${baseURL}checkout/`, options);
    return await convertToJson(response);
  }
}