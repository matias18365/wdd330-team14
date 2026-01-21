import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function handleRemoveClick(event) {
  if (!event.target.classList.contains("remove-item")) return;

  const li = event.target.closest("li");
  if (!li) return;

  const productId = li.dataset.id;
  if (!productId) return;

  let cartItems = getLocalStorage("so-cart") || [];

  const index = cartItems.findIndex(item => item.Id === productId);
  if (index > -1) {
    cartItems.splice(index, 1); 
  }

  setLocalStorage("so-cart", cartItems);

  if (typeof window.renderCartContents === "function") {
    window.renderCartContents();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.querySelector(".product-list");
  if (!productList) return;

  productList.addEventListener("click", handleRemoveClick);
});
