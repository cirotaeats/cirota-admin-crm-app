/**
 * Cirota Admin/CRM App Configuration
 */
export const CONFIG = {
  USE_MOCKS: true,                        // Set to false when connecting to deployed backend
  BASE_URL: 'http://localhost:3000/api',  // Backend API URL (override for deployed Railway URL)

  STORAGE_KEYS: {
    ADMIN_TOKEN: 'cirota_admin_token',
    ADMIN_USER:  'cirota_admin_user',
  }
};
