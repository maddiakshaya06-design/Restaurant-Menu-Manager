const CATEGORIES = ["Starters", "Main Course", "Desserts", "Beverages", "Snacks", "Other"];
function validateMenuItem(body) {
  const errors = [];
  if (!body || typeof body !== "object" || Array.isArray(body)) return {errors:["A valid JSON object is required."]};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const category = typeof body.category === "string" ? body.category : "";
  const price = body.price;
  if (!name || name.length > 100) errors.push("Name is required and must be at most 100 characters.");
  if (description.length > 500) errors.push("Description must be at most 500 characters.");
  if (!CATEGORIES.includes(category)) errors.push("Choose a valid category.");
  if (price === "" || price === null || price === undefined || !Number.isFinite(Number(price)) || Number(price) < 0 || Number(price) > 1000000) errors.push("Price must be between 0 and 1,000,000.");
  if (body.is_available !== undefined && typeof body.is_available !== "boolean") errors.push("Availability must be true or false.");
  return {errors, data:{name, description, category, price:Number(price), is_available:body.is_available === undefined ? true : body.is_available}};
}
module.exports = {CATEGORIES, validateMenuItem};
