import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount } from "./utils.mjs";
import { renderBreadcrumb } from "./breadcrumb.js";

(async function () {
  const categoryName = "Tents";
  const dataSource = new ProductData("tents");
  const listElement = document.querySelector(".product-list");

  const productList = new ProductList("tents", dataSource, listElement);
  await productList.init();

  updateCartCount();

  const products = await dataSource.getData();
  renderBreadcrumb({
    category: categoryName,
    count: products.length
  });

  document.addEventListener("click", async (e) => {
    console.log("document clicked", e.target);

    const quickViewBtn = e.target.closest(".quick-view");
    if (!quickViewBtn) return;

    console.log("Quick view clicked", quickViewBtn.dataset.id);

    const id = quickViewBtn.dataset.id;
    const product = await dataSource.findProductById(id);

    document.getElementById("modalImage").src = product.Image;
    document.getElementById("modalTitle").textContent =
      `${product.Brand.Name} ${product.NameWithoutBrand}`;
    document.getElementById("modalPrice").textContent =
      `$${product.FinalPrice}`;
    document.getElementById("modalDescription").innerHTML =
      product.DescriptionHtmlSimple;

    document
      .getElementById("quickViewModal")
      .classList.remove("hidden");
  });

  document.getElementById("closeModal")?.addEventListener("click", () => {
    document
      .getElementById("quickViewModal")
      .classList.add("hidden");
  });
})();
