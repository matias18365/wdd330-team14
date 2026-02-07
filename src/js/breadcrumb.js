export function renderBreadcrumb({ category, count = null }) {
  const breadcrumb = document.getElementById("breadcrumb");
  if (!breadcrumb) return;

  if (!category) {
    breadcrumb.classList.add("hidden");
    return;
  }

  breadcrumb.classList.remove("hidden");

  if (count !== null) {
    breadcrumb.textContent = `${category} → (${count} items)`;
    return;
  }

  breadcrumb.textContent = category;
}
