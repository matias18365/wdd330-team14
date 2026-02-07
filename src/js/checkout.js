import CheckoutProcess from "./CheckoutProcess.mjs";

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

document.querySelector("#zip").addEventListener("blur", myCheckout.calculateOrderTotal.bind(myCheckout));

document.forms["checkout"].addEventListener("submit", (e) => {
    e.preventDefault();
    myCheckout.checkout(e.target);
});