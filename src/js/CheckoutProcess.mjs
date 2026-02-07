import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { alertMessage } from "./utils.mjs";

const services = new ExternalServices();


function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: item.qty || 1,
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
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    const subtotalElement = document.querySelector(
      this.outputSelector + " #subtotal"
    );
    const numItemsElement = document.querySelector(
      this.outputSelector + " #num-items"
    );

    const amounts = this.list.map((item) => item.FinalPrice * item.qty);
    this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);

    numItemsElement.innerText = this.list.length;
    subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = (this.itemTotal * 0.06).toFixed(2);
    this.shipping = (10 + (this.list.length - 1) * 2).toFixed(2);

    this.orderTotal = (
      parseFloat(this.itemTotal) +
      parseFloat(this.tax) +
      parseFloat(this.shipping)
    ).toFixed(2);

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSubTotal();
    }

    calculateItemSubTotal() {
        const subtotalElement = document.querySelector(this.outputSelector + " #subtotal");
        const numItemsElement = document.querySelector(this.outputSelector + " #num-items");
        
        const amounts = this.list.map((item) => item.FinalPrice);
        this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);
        
        numItemsElement.innerText = this.list.length;
        subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        this.tax = (this.itemTotal * 0.06).toFixed(2);
        this.shipping = (10 + (this.list.length - 1) * 2).toFixed(2);
        
        this.orderTotal = (
        parseFloat(this.itemTotal) +
        parseFloat(this.tax) +
        parseFloat(this.shipping)
        ).toFixed(2);
        
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const shipping = document.querySelector(this.outputSelector + " #shipping");
        const tax = document.querySelector(this.outputSelector + " #tax");
        const orderTotal = document.querySelector(this.outputSelector + " #orderTotal");

        shipping.innerText = `$${this.shipping}`;
        tax.innerText = `$${this.tax}`;
        orderTotal.innerText = `$${this.orderTotal}`;
    }

  async checkout(form) {
    const formElement = document.querySelector("form[name='checkout']");
    const chk_status = formElement.checkValidity();
    formElement.reportValidity();

    if (chk_status) {
      const json = formDataToJSON(form);

      json.orderDate = new Date();
      json.orderTotal = this.orderTotal;
      json.tax = this.tax;
      json.shipping = this.shipping;
      json.items = packageItems(this.list);

      console.log("Payload enviado:", json);

      try {
        const res = await services.checkout(json);
        console.log("Respuesta exitosa:", res);
        setLocalStorage("so-cart", []);
        window.location.href = "/checkout/success.html";
      } catch (err) {
        console.error("Error en el checkout:", err);
        // Check if the error is a ServicesError and has a message
        if (err.name === "ServicesError" && err.message) {
          alertMessage(err.message);
        } else {
          alertMessage(
            "An error occurred during checkout. Please try again."
          );
        }
      }
    }
  }
}