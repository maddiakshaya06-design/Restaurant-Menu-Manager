const express = require("express");
const supabase = require("../supabase");
const {validateMenuItem} = require("../utils/validation");
const router = express.Router();
const validId = value => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
function dbError(res, error) {
  console.error("Database operation failed:", {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    status: error.status,
    cause: error.cause?.message,
    causeCode: error.cause?.code
  });

  return res.status(500).json({
    success: false,
    message: "The database operation failed. Check server configuration."
  });
}
router.get("/", async (req, res) => {
  try {
    let query = supabase.from("menu_items").select("*").order("created_at", {ascending:false});
    if (typeof req.query.q === "string" && req.query.q.trim()) query = query.ilike("name", `%${req.query.q.trim()}%`);
    if (typeof req.query.category === "string" && req.query.category) query = query.eq("category", req.query.category);
    if (req.query.availability === "available") query = query.eq("is_available", true);
    else if (req.query.availability === "unavailable") query = query.eq("is_available", false);
    const {data, error} = await query;
    if (error) return dbError(res, error);
    res.json({success:true, data});
  } catch (error) { return dbError(res, error); }
});
router.get("/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({success:false, message:"Invalid menu item ID."});
  try {
    const {data, error} = await supabase.from("menu_items").select("*").eq("id", req.params.id).maybeSingle();
    if (error) return dbError(res, error);
    if (!data) return res.status(404).json({success:false, message:"Menu item not found."});
    res.json({success:true, data});
  } catch (error) { return dbError(res, error); }
});
router.post("/", async (req, res) => {
  const {errors, data} = validateMenuItem(req.body);
  if (errors.length) return res.status(400).json({success:false, message:"Please correct the form errors.", errors});
  try {
    const {data:item, error} = await supabase.from("menu_items").insert(data).select("*").single();
    if (error) return dbError(res, error);
    res.status(201).json({success:true, message:"Menu item created successfully.", data:item});
  } catch (error) { return dbError(res, error); }
});
router.put("/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({success:false, message:"Invalid menu item ID."});
  const {errors, data} = validateMenuItem(req.body);
  if (errors.length) return res.status(400).json({success:false, message:"Please correct the form errors.", errors});
  try {
    const {data:item, error} = await supabase.from("menu_items").update(data).eq("id", req.params.id).select("*").maybeSingle();
    if (error) return dbError(res, error);
    if (!item) return res.status(404).json({success:false, message:"Menu item not found."});
    res.json({success:true, message:"Menu item updated successfully.", data:item});
  } catch (error) { return dbError(res, error); }
});
router.delete("/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({success:false, message:"Invalid menu item ID."});
  try {
    const {data:item, error} = await supabase.from("menu_items").delete().eq("id", req.params.id).select("id").maybeSingle();
    if (error) return dbError(res, error);
    if (!item) return res.status(404).json({success:false, message:"Menu item not found."});
    res.json({success:true, message:"Menu item deleted successfully."});
  } catch (error) { return dbError(res, error); }
});
module.exports = router;
