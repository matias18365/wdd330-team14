// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get a parameter from the URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(
    position,
    htmlStrings.join('')
  );
}

// ItemsAmountInCart Individual Task
export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const badge = document.querySelector(".item-count-badge");
  
  if (badge) {
    const count = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
    badge.textContent = count;
    
    // If count is 0 hide it. If more than 0 then show it
    badge.style.display = count > 0 ? "block" : "none";
  }
}

export async function loadHeaderFooter() {
  // Por ahora la dejamos vacía para que no de error.
  // En pasos futuros aquí cargaremos el header.html y footer.html.
  console.log("loadHeaderFooter ejecutado (esperando lógica futura)");
}

export function alertMessage(message, scroll = true) {
  // create element to hold the alert
  const alert = document.createElement("div");
  // add a class to style the alert
  alert.classList.add("alert");
  // set the contents. You should have a message and an X or something the user can click on to remove
  alert.innerHTML = `<p>${message}</p><span class="alert-close">X</span>`;

  // add a listener to the alert to see if they clicked on the X
  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("alert-close")) {
      // how can you tell if they clicked on the X or on something else?  hint: check out e.target.tagName or e.target.innerText
      const main = document.querySelector("main");
      main.removeChild(this);
    }
  });
  // add the alert to the top of main
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  // you may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) window.scrollTo(0, 0);
}
