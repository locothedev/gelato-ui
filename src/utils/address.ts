/**
 * Formats an address by showing first 6 and last 4 characters
 * @param address - The address to format
 * @returns Formatted address string
 */
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Truncates an address for display
 * @param address - The address to truncate
 * @returns Truncated address string
 */
export function truncateAddress(address: string): string {
  if (!address) return "";
  if (address.length > 13) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  return address;
}
