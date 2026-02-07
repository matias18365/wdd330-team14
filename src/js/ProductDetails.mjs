import { setLocalStorage, getLocalStorage, updateCartCount } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = null;
    this.dataSource = dataSource;
    this.selectedColor = null;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      console.error("Producto no encontrado");
      return;
    }

    this.selectedColor = this.product.Colors[0].ColorName;

    this.renderBreadcrumb();
    this.renderProductDetails();
    this.renderColorSwatches();

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

    const productToAdd = { ...this.product, SelectedColor: this.selectedColor };

    const cart = getLocalStorage("so-cart") || [];
    cart.push(productToAdd);
    setLocalStorage("so-cart", cart);
    updateCartCount();
  }

  renderBreadcrumb() {
    const breadcrumb = document.querySelector(".breadcrumb");
    if (!breadcrumb) return;

    breadcrumb.textContent = this.product.Category;
    breadcrumb.classList.remove("hidden");
  }

  renderProductDetails() {
    document.querySelector("#productName").textContent = this.product.Brand.Name;
    document.querySelector("#productNameWithoutBrand").textContent = this.product.NameWithoutBrand;
    document.querySelector("#productImage").src = this.product.Image;
    document.querySelector("#productImage").alt = this.product.Name;
    document.querySelector("#productFinalPrice").textContent = `$${this.product.FinalPrice}`;
    document.querySelector("#productColorName").textContent = this.product.Colors[0].ColorName;
    document.querySelector("#productDescriptionHtmlSimple").innerHTML = this.product.DescriptionHtmlSimple;
  }

  renderColorSwatches() {
    const colorContainer = document.querySelector(".product-colors");
    if (!colorContainer) return;

    colorContainer.innerHTML = '<p class="product__color">Colors:</p><ul class="color-list"></ul>';
    const listElement = colorContainer.querySelector(".color-list");

    this.product.Colors.forEach((color, index) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      
      img.src = color.ColorSwatchSrc;
      img.alt = color.ColorName;
      img.title = color.ColorName;
      img.classList.add("color-swatch");
      
      if (index === 0) img.classList.add("selected");

      img.addEventListener("click", (e) => {
        document.querySelectorAll(".color-swatch").forEach(sw => sw.classList.remove("selected"));
        e.target.classList.add("selected");
        this.selectedColor = color.ColorName;
        document.querySelector("#productColorName").textContent = color.ColorName;
      });

      li.appendChild(img);
      listElement.appendChild(li);
    });
  }
}