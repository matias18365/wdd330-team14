import { setLocalStorage, getLocalStorage, updateCartCount } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = null;
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      console.error("Producto no encontrado");
      return;
    }

    this.renderProductDetails();

    // Initialize the count when the page loads
    updateCartCount();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    if (!this.product || !this.product.Id) {
      console.error("Producto inválido, no se agregó al carrito");
      return;
    }
    

    const cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
    updateCartCount(); //Number of Items in Backpag Icon (Cart)
  }

  renderProductDetails() {
    document.querySelector("#productName").textContent =
      this.product.Brand.Name;
    document.querySelector("#productNameWithoutBrand").textContent =
      this.product.NameWithoutBrand;
    document.querySelector("#productImage").src = this.product.Image;
    document.querySelector("#productImage").alt = this.product.Name;
    document.querySelector("#productFinalPrice").textContent =
      `$${this.product.FinalPrice}`;
    document.querySelector("#productColorName").textContent =
      this.product.Colors[0].ColorName;
    document.querySelector("#productDescriptionHtmlSimple").innerHTML =
      this.product.DescriptionHtmlSimple;
  }
}

