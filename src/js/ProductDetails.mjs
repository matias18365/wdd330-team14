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
      console.error("Product not found");
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
      console.error("Invalid product, not added to cart");
      return;
    }

    const cart = getLocalStorage("so-cart") || [];
    
    const cartItem = cart.find(
      (item) => item.Id === this.product.Id && item.SelectedColor === this.selectedColor
    );

    if (cartItem) {
      cartItem.qty = (cartItem.qty || 1) + 1;
    } else {
      cart.push({
        ...this.product,
        qty: 1,
        SelectedColor: this.selectedColor,
      });
    }

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
    const listElement = document.querySelector(".color-list");
    if (!listElement) return;

    listElement.innerHTML = "";

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
