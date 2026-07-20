import {
  Paintbrush,
  Bolt,
  Droplets,
  Snowflake,
  WashingMachine,
  Refrigerator,
  LayoutGrid,
  Wrench,
} from 'lucide-react';

// Single source of truth — add a new category's icon here.
const CATEGORY_ICONS = {
  All: LayoutGrid,
  Painting: Paintbrush,
  'AC Service': Snowflake,
  'RO Service': Droplets,
  Electrician: Bolt,
  'Washing Machine Repair': WashingMachine,
  'Refrigerator Repair': Refrigerator,
};

/** Default fallback icon when a category isn't mapped */
const FALLBACK_ICON = Wrench;

/**
 * Returns the Lucide icon element for a given category.
 * Always returns an icon (falls back to Wrench).
 */
export const getCategoryIcon = (category, size = 14) => {
  const Icon = CATEGORY_ICONS[category] || FALLBACK_ICON;
  return <Icon size={size} aria-hidden="true" />;
};
