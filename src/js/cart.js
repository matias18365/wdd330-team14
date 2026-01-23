import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");
  const cartFooter = document.querySelector(".cart-totals");

  // Handle empty cart
  if (cartItems.length === 0) {
    productList.innerHTML = "<p>Your cart is empty.</p>";
    if (cartFooter) {
      cartFooter.style.display = "none";
    }
  } else {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productList.innerHTML = htmlItems.join("");
    if (cartFooter) {
      cartFooter.style.display = "block";
    }
    updateSubtotal(cartItems);
  }
}

function cartItemTemplate(item) {
  const price = item.FinalPrice ?? item.Price;

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${price.toFixed(2)}</p>
    </li>
  `;
}

function calculateCartSubtotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const price = item.FinalPrice ?? item.Price;
    return total + price;
  }, 0);
}

function updateSubtotal(cartItems) {
  const subtotalElement = document.querySelector("#cartSubtotal");
  if (!subtotalElement) return;

  const subtotal = calculateCartSubtotal(cartItems);
  subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
}

renderCartContents();
