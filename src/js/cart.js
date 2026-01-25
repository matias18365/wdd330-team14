import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productList = document.querySelector(".product-list");
  const cartFooter = document.querySelector(".cart-footer");

  // Check if cartItems exists and is an array with items
  if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productList.innerHTML = htmlItems.join("");
    // Calculate and display total
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  } else {
    // Display message when cart is empty
    productList.innerHTML = "<p>Your cart is empty.</p>";
    cartFooter.classList.add("hide");
  }
}

function cartItemTemplate(item) {
  // Handle both old (Image) and new (Images.PrimaryMedium) data structures
  const imageSrc = item.Images ? item.Images.PrimaryMedium : item.Image;

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imageSrc}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
