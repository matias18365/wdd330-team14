import { renderListWithTemplate, updateCartCount } from "./utils.mjs";

function productCardTemplate(product) {
  // 1. Verificación de imagen con el formato de la API
  const imageUrl = product.Images?.PrimaryLarge || "/images/no-image-available.png";

  return `
    <li class="product-card">
      <a href="../product_pages/index.html?product=${product.Id}">
        <img src="${imageUrl}" alt="${product.Name}">
        <h2 class="card__brand">${product.Brand.Name}</h2>
        <h3 class="card__name">${product.NameWithoutBrand}</h3>
        <p class="product-card__price">$${product.FinalPrice || product.ListPrice}</p>
      </a>
      <button
        class="quick-view"
        data-id="${product.Id}"
        type="button"
      >
        Quick View
      </button>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // 2. Pedimos los datos a la API usando la categoría
    if (this.category) {
      const products = await this.dataSource.getData(this.category);
      
      console.log("Productos recibidos de la API:", products);

      // 3. Filtrado para mostrar solo productos relevantes
      const filteredList = products.filter(p => p.Id !== '989CG' && p.Id !== '880RR');
      
      this.renderList(filteredList);

      // 4. Actualizar el contador del carrito al cargar la lista
      updateCartCount();
    }
  }

  renderList(list) {
    this.listElement.innerHTML = "";
    
    if (Array.isArray(list) && list.length > 0) {
      renderListWithTemplate(
        productCardTemplate,
        this.listElement,
        list
      );
    } else {
      this.listElement.innerHTML = "<p>No products found in this category.</p>";
    }
  }
}