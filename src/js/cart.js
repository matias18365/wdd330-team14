import { getLocalStorage, setLocalStorage ,updateCartCount} from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  if (cartItems.length === 0) {
    productList.innerHTML = "<p>El carrito está vacío</p>";
    return;
  }

  productList.innerHTML = cartItems
    .map((item) => cartItemTemplate(item))
    .join("");

  addRemoveListeners();
}

function cartItemTemplate(item) {
  return `
  <li class="cart-card divider">
    <span class="remove-item" data-id="${item.Id}">X</span>

    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>

    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>

    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll(".remove-item");

  removeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeItemFromCart(id);
    });
  });
}

function removeItemFromCart(id) {
  let cart = getLocalStorage("so-cart") || [];

  cart = cart.filter((item) => item.Id !== id);

  setLocalStorage("so-cart", cart);
  renderCartContents();
}

renderCartContents();

updateCartCount();
