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

function cartImageAttrs(item) {
  const img = item.Images || {};
  const small = img.PrimarySmall;
  const medium = img.PrimaryMedium;
  const large = img.PrimaryLarge;
  const fallbackSrc = medium || large || item.Image;

  if (small && medium && large) {
    return `src="${medium}" srcset="${small} 80w, ${medium} 160w, ${large} 320w" sizes="(max-width: 480px) 80px, 120px"`;
  }
  return `src="${fallbackSrc}"`;
}

function cartItemTemplate(item) {
  const imgAttrs = cartImageAttrs(item);

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      ${imgAttrs}
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
