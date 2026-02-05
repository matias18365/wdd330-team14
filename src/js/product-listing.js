import ExternalServices from "./ExternalServices.mjs";
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const category = getParam('category');

const dataSource = new ExternalServices();

const listElement = document.querySelector('.product-list');

const myList = new ProductList(category, dataSource, listElement);

myList.init();

document.querySelector('#listing-title').textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;