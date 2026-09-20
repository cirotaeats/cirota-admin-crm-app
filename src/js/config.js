/**
 * Cirota Admin/CRM App Configuration
 */
export const CONFIG = {
  USE_MOCKS: false,                        // Set to false when connecting to deployed backend
  BASE_URL: 'https://cirota-backend-production.up.railway.app/api',  // Backend API URL (override for deployed Railway URL)

  STORAGE_KEYS: {
    ADMIN_TOKEN: 'cirota_admin_token',
    ADMIN_USER:  'cirota_admin_user',
  }
};
