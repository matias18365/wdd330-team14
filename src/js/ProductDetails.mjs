import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product
    this.product = await this.dataSource.findProductById(this.productId);
    // render the product details HTML
    this.renderProductDetails();
    // add listener to the Add to Cart button
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    let cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }

  renderProductDetails() {
    document.querySelector("#productName").textContent =
      this.product.Brand.Name;
    document.querySelector("#productNameWithoutBrand").textContent =
      this.product.NameWithoutBrand;

    const imgEl = document.querySelector("#productImage");
    const img = this.product.Images || {};
    const small = img.PrimarySmall;
    const medium = img.PrimaryMedium;
    const large = img.PrimaryLarge;
    const fallbackSrc = large || medium || this.product.Image;

    imgEl.src = fallbackSrc;
    imgEl.alt = this.product.Name;
    if (small && medium && large) {
      imgEl.srcset = `${small} 80w, ${medium} 160w, ${large} 320w`;
      imgEl.sizes = "(max-width: 600px) 100vw, 500px";
    } else {
      imgEl.removeAttribute("srcset");
      imgEl.removeAttribute("sizes");
    }

    document.querySelector("#productFinalPrice").textContent =
      "$" + this.product.FinalPrice;
    document.querySelector("#productColorName").textContent =
      this.product.Colors[0].ColorName;
    document.querySelector("#productDescriptionHtmlSimple").innerHTML =
      this.product.DescriptionHtmlSimple;
    document.querySelector("#addToCart").dataset.id = this.product.Id;
  }
}
