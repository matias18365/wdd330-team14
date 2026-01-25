import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", "#order-summary");
checkout.init();

// Calculate order totals when zip code is entered
const zipInput = document.getElementById("zip");
zipInput.addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

// Also calculate on page load if there are items
checkout.calculateOrderTotal();

// Handle form submission
const form = document.getElementById("checkout-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const response = await checkout.checkout(form);
    console.log("Order submitted successfully:", response);
    alert("Order placed successfully!");
    // Clear the cart after successful order
    localStorage.removeItem("so-cart");
    // Redirect to home page
    window.location.href = "/";
  } catch (error) {
    console.error("Error submitting order:", error);
    alert("There was an error placing your order. Please try again.");
  }
});
