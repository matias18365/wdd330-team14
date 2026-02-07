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
      console.error("Product not found");
      return;
    }

    this.renderBreadcrumb();

    this.renderProductDetails();

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
    const cartItem = cart.find((item) => item.Id === this.product.Id);

    if (cartItem) {
      // If the item is in the cart, increase the quantity
      cartItem.qty = (cartItem.qty || 1) + 1;
    } else {
      // Otherwise add the item to the cart with a quantity of 1
      cart.push({
        ...this.product,
        qty: 1,
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
