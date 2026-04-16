
const pool = require("../db/db");

const getServices = async (category, search) => {
  let queryText = 'SELECT * FROM services WHERE 1=1';
  let params = [];
  if (category && category !== 'all') { params.push(category); queryText += ` AND category = $${params.length}`; }
  if (search) { params.push(`%${search}%`); queryText += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`; }
  const result = await pool.query(queryText, params);
  return result.rows;
};

const getServiceById = async (id) => {
  const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
  return result.rows[0];
};

const createService = async (title, category, original_price, discount_price, discount_tag, description, image, category_id = null) => {
  const result = await pool.query(
    'INSERT INTO services (title, category, original_price, discount_price, discount_tag, description, image, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [title, category, original_price, discount_price, discount_tag, description, image, category_id]
  );
  return result.rows[0];
};

const deleteService = async (id) => {
  await pool.query('DELETE FROM services WHERE id = $1', [id]);
};

const updateService = async (id, { title, category, original_price, discount_price, discount_tag, description, image }) => {
  const result = await pool.query(
    `UPDATE services SET
      title = COALESCE($1, title),
      category = COALESCE($2, category),
      original_price = COALESCE($3, original_price),
      discount_price = COALESCE($4, discount_price),
      discount_tag = COALESCE($5, discount_tag),
      description = COALESCE($6, description),
      image = COALESCE($7, image)
     WHERE id = $8 RETURNING *`,
    [title, category, original_price, discount_price, discount_tag, description, image, id]
  );
  return result.rows[0];
};

module.exports = { getServices, getServiceById, createService, deleteService, updateService };
