/**
 * Formats an order ID in Dhoond's canonical format:
 *   DHD-DD.MM-####
 * Example: order id=8, created 2026-04-16 → "DHD-16.04-0008"
 *
 * @param {number|string} id         - The numeric order/payment id
 * @param {string|Date}   createdAt  - ISO date string or Date object from the record
 * @returns {string}
 */
export const formatOrderId = (id, createdAt) => {
  const date = createdAt ? new Date(createdAt) : new Date();
  const day   = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const seq   = String(id).padStart(4, '0');
  return `DHD-${day}.${month}-${seq}`;
};
