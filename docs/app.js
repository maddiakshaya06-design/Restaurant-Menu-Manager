const API_URL = "/api/menu";
const tableBody = document.getElementById("menu-table-body");
const dialog = document.getElementById("item-dialog");
const form = document.getElementById("item-form");
const notice = document.getElementById("notice");
const fields = {
  id: document.getElementById("item-id"),
  name: document.getElementById("item-name"),
  description: document.getElementById("item-description"),
  category: document.getElementById("item-category"),
  price: document.getElementById("item-price"),
  available: document.getElementById("item-available")
};
let menuItems = [];
let noticeTimer;
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}
function money(value) {
  return new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(value));
}
async function request(url, options = {}) {
  const response = await fetch(url, {...options, headers:{
    ...(options.body ? {"Content-Type":"application/json"} : {}), ...options.headers
  }});
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = Array.isArray(result.errors) ? result.errors.join(" ") : result.message;
    throw new Error(detail || `Request failed (${response.status}).`);
  }
  return result;
}
function showNotice(message, isError = false) {
  clearTimeout(noticeTimer);
  notice.textContent = message;
  notice.classList.toggle("error", isError);
  notice.hidden = false;
  noticeTimer = setTimeout(() => { notice.hidden = true; }, 4500);
}
function updateStats(items) {
  document.getElementById("total-count").textContent = items.length;
  document.getElementById("available-count").textContent = items.filter(x => x.is_available).length;
  document.getElementById("unavailable-count").textContent = items.filter(x => !x.is_available).length;
  document.getElementById("category-count").textContent = new Set(items.map(x => x.category)).size;
}
function renderMenu(items) {
  if (!items.length) {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">No menu items found. Add a dish or change your filters.</td></tr>';
    document.getElementById("result-count").textContent = "0 menu items";
    updateStats(menuItems);
    return;
  }
  tableBody.innerHTML = items.map(item => `<tr>
    <td><div class="item-name">${escapeHtml(item.name)}</div><div class="item-description">${escapeHtml(item.description || "No description")}</div></td>
    <td><span class="category-tag">${escapeHtml(item.category)}</span></td>
    <td class="price">${money(item.price)}</td>
    <td><span class="status ${item.is_available ? "available" : "unavailable"}">${item.is_available ? "Available" : "Unavailable"}</span></td>
    <td><div class="action-group"><button class="action-button" data-action="edit" data-id="${escapeHtml(item.id)}">Edit</button><button class="action-button delete" data-action="delete" data-id="${escapeHtml(item.id)}">Delete</button></div></td>
  </tr>`).join("");
  document.getElementById("result-count").textContent = `${items.length} menu item${items.length === 1 ? "" : "s"}`;
  updateStats(menuItems);
}
async function loadMenu() {
  tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">Loading menu...</td></tr>';
  try {
    const params = new URLSearchParams();
    const search = document.getElementById("search-input").value.trim();
    const category = document.getElementById("category-filter").value;
    const availability = document.getElementById("availability-filter").value;
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (availability) params.set("availability", availability);
    const [filtered, all] = await Promise.all([
      request(`${API_URL}?${params}`), request(API_URL)
    ]);
    menuItems = all.data;
    renderMenu(filtered.data);
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">${escapeHtml(error.message)}<br><br>Check your backend server and Supabase configuration.</td></tr>`;
    document.getElementById("result-count").textContent = "Unable to load menu";
    showNotice(error.message, true);
  }
}
function openNewItemDialog() {
  form.reset(); fields.id.value = ""; fields.available.checked = true;
  document.getElementById("dialog-title").textContent = "Add menu item";
  document.getElementById("save-button").textContent = "Save item";
  document.getElementById("form-error").hidden = true;
  dialog.showModal(); fields.name.focus();
}
function openEditDialog(item) {
  form.reset(); fields.id.value = item.id; fields.name.value = item.name;
  fields.description.value = item.description || ""; fields.category.value = item.category;
  fields.price.value = item.price; fields.available.checked = item.is_available;
  document.getElementById("dialog-title").textContent = "Edit menu item";
  document.getElementById("save-button").textContent = "Save changes";
  document.getElementById("form-error").hidden = true;
  dialog.showModal(); fields.name.focus();
}
document.getElementById("add-button").addEventListener("click", openNewItemDialog);
document.getElementById("close-dialog").addEventListener("click", () => dialog.close());
document.getElementById("cancel-button").addEventListener("click", () => dialog.close());
document.getElementById("refresh-button").addEventListener("click", loadMenu);
let searchTimer;
document.getElementById("search-input").addEventListener("input", () => {
  clearTimeout(searchTimer); searchTimer = setTimeout(loadMenu, 250);
});
document.getElementById("category-filter").addEventListener("change", loadMenu);
document.getElementById("availability-filter").addEventListener("change", loadMenu);
form.addEventListener("submit", async event => {
  event.preventDefault();
  const saveButton = document.getElementById("save-button");
  const errorBox = document.getElementById("form-error");
  errorBox.hidden = true;
  const payload = {
    name: fields.name.value.trim(), description: fields.description.value.trim(),
    category: fields.category.value, price: Number(fields.price.value),
    is_available: fields.available.checked
  };
  if (!payload.name || !payload.category || fields.price.value === "") {
    errorBox.textContent = "Please fill in the name, category and price.";
    errorBox.hidden = false; return;
  }
  if (!Number.isFinite(payload.price) || payload.price < 0) {
    errorBox.textContent = "Enter a valid, non-negative price.";
    errorBox.hidden = false; return;
  }
  const id = fields.id.value;
  saveButton.disabled = true; saveButton.textContent = "Saving...";
  try {
    const result = await request(id ? `${API_URL}/${encodeURIComponent(id)}` : API_URL, {
      method: id ? "PUT" : "POST", body: JSON.stringify(payload)
    });
    dialog.close(); showNotice(result.message); await loadMenu();
  } catch (error) {
    errorBox.textContent = error.message; errorBox.hidden = false;
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = fields.id.value ? "Save changes" : "Save item";
  }
});
tableBody.addEventListener("click", async event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = menuItems.find(entry => entry.id === button.dataset.id);
  if (!item) return;
  if (button.dataset.action === "edit") { openEditDialog(item); return; }
  if (button.dataset.action === "delete") {
    if (!window.confirm(`Delete "${item.name}"? This action cannot be undone.`)) return;
    button.disabled = true;
    try {
      const result = await request(`${API_URL}/${encodeURIComponent(item.id)}`, {method:"DELETE"});
      showNotice(result.message); await loadMenu();
    } catch (error) { showNotice(error.message, true); button.disabled = false; }
  }
});
loadMenu();
