import { getLocalStorage } from "./utils.mjs";

export function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  if(!productList) return;

  // Handle empty cart
  if (cartItems.length === 0) {
    productList.innerHTML =
      "<p>Your cart is empty.</p>";
    updateSubtotal([]);
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  updateSubtotal(cartItems);
}

function cartItemTemplate(item) {
  const price = item.FinalPrice ?? item.Price;

  return `
    <li class="cart-card divider" data-id="${item.Id}" style="position: relative;">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${price.toFixed(2)}</p>
      <span class="remove-item" 
      style="position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        color: red;
        font-weight: bold;
        font-size: 16px;">X</span>
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

window.renderCartContents = renderCartContents;

document.addEventListener("DOMContentLoaded", renderCartContents);

