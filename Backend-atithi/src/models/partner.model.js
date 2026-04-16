const pool = require("../db/db");

const createPartner = async (partnerData) => {
  const { name, phone, partner_docs, profession, experience, current_location, status, work_status } = partnerData;
  const result = await pool.query(
    `INSERT INTO partners (name, phone, partner_docs, profession, experience, current_location, status, work_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      name,
      phone || null,
      JSON.stringify(partner_docs || {}),
      profession || null,
      experience || null,
      current_location || null,
      status || 'Off duty',
      work_status || 'idle'
    ]
  );
  return result.rows[0];
};

const getPartners = async () => {
  const result = await pool.query(
    "SELECT id, name, phone, profession, experience, partner_docs, current_location, status, work_status, joined_at FROM partners ORDER BY joined_at DESC"
  );
  return { data: result.rows, total: result.rowCount };
};

const updatePartnerDocs = async (id, partner_docs) => {
  const result = await pool.query(
    'UPDATE partners SET partner_docs = $1 WHERE id = $2 RETURNING *',
    [JSON.stringify(partner_docs), id]
  );
  return result.rows[0];
};

const deletePartner = async (id) => {
  await pool.query("DELETE FROM partners WHERE id = $1", [id]);
};

module.exports = { createPartner, getPartners, updatePartnerDocs, deletePartner };