import { loadHeaderFooter, removeAlerts } from "./utils.mjs";
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

  // Remove any existing alerts
  removeAlerts();

  // Check form validity
  const isValid = form.checkValidity();
  form.reportValidity();

  if (!isValid) {
    return;
  }

  try {
    const response = await checkout.checkout(form);
    console.log("Order submitted successfully:", response);
    // Clear the cart after successful order
    localStorage.removeItem("so-cart");
    // Redirect to success page
    window.location.href = "/checkout/success.html";
  } catch (error) {
    console.error("Error submitting order:", error);
    // Error alerts are handled in CheckoutProcess.checkout
  }
});
