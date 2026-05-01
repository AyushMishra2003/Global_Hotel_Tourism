/**
 * Utility functions for generating SEO-friendly slugs for vendors
 */

/**
 * Converts a vendor name to a URL-friendly slug
 * @param vendorName The vendor name to convert
 * @param vendorId The vendor ID to append for uniqueness
 * @returns A URL-friendly slug
 */
export const generateVendorSlug = (vendorName: string, vendorId: number): string => {
  return vendorName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    + `-${vendorId}`;
};

/**
 * Extracts vendor ID from a slug
 * @param slug The slug to extract ID from
 * @returns The vendor ID or null if not found
 */
export const extractVendorIdFromSlug = (slug: string): number | null => {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Generates a vendor profile URL
 * @param vendorName The vendor name
 * @param vendorId The vendor ID
 * @returns The complete vendor profile URL
 */
export const getVendorProfileUrl = (vendorName: string, vendorId: number): string => {
  const slug = generateVendorSlug(vendorName, vendorId);
  return `/vendor/${slug}`;
};