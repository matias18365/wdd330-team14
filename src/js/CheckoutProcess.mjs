import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// takes a form element and returns an object where the key is the "name" of the form input.
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.externalServices = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total dollar amount of the items in the cart, and the number of items.
    if (this.list.length > 0) {
      this.itemTotal = this.list.reduce(
        (sum, item) => sum + item.FinalPrice,
        0
      );
    } else {
      this.itemTotal = 0;
    }
    // Display the subtotal
    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotal) {
      subtotal.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    // calculate the tax (6%) and shipping amounts ($10 for first item + $2 for each additional item)
    this.tax = this.itemTotal * 0.06;

    // Shipping: $10 for first item + $2 for each additional item
    const itemCount = this.list.length;
    if (itemCount > 0) {
      this.shipping = 10 + (itemCount - 1) * 2;
    } else {
      this.shipping = 0;
    }

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #orderTotal`
    );

    if (tax) tax.textContent = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.textContent = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    // get the form element data and convert to JSON
    const formData = formDataToJSON(form);

    // build the order object
    const order = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    try {
      // call the checkout method in the ExternalServices module
      const response = await this.externalServices.checkout(order);
      return response;
    } catch (err) {
      // Handle errors from the server
      if (err.name === "servicesError") {
        // Display error messages from the server
        const messages = err.message;
        if (typeof messages === "object" && messages.message) {
          // Single error message
          alertMessage(messages.message);
        } else if (Array.isArray(messages)) {
          // Multiple error messages
          messages.forEach((msg) => alertMessage(msg, false));
          window.scrollTo(0, 0);
        } else {
          alertMessage("An error occurred during checkout.");
        }
      } else {
        alertMessage("An error occurred during checkout.");
      }
      throw err; // Re-throw to let the calling code know it failed
    }
  }
}
