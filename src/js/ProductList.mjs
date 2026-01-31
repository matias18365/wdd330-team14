import { renderListWithTemplate } from './utils.mjs';

/**
 * Build responsive img attributes from product Images (PrimarySmall 80w, PrimaryMedium 160w, PrimaryLarge 320w).
 * Falls back to single src when only Image or only PrimaryMedium exists.
 */
function productImageAttrs(product) {
  const img = product.Images || {};
  const small = img.PrimarySmall;
  const medium = img.PrimaryMedium;
  const large = img.PrimaryLarge;
  const fallbackSrc = medium || large || product.Image;

  if (small && medium && large) {
    return `src="${medium}" srcset="${small} 80w, ${medium} 160w, ${large} 320w" sizes="(max-width: 480px) 50vw, 150px"`;
  }
  return `src="${fallbackSrc}"`;
}

function productCardTemplate(product) {
  const imgAttrs = productImageAttrs(product);
  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img ${imgAttrs} alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}
