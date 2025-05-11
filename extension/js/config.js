// Configuration settings for the extension

// API URL - Edit this to match your backend API URL
window.API_URL = "http://localhost:3000/api";

// Default values
window.DEFAULT_VALUES = {
  attendanceTimeout: 60000, // 1 minute in milliseconds
  refreshInterval: 30000, // 30 seconds in milliseconds
  maxRetries: 3, // Maximum number of retries for API calls
};

// Initialize extension configuration
function initConfig() {
  // Try to get saved configuration from storage
  chrome.storage.local.get(["extensionConfig"], (result) => {
    if (result.extensionConfig) {
      // Merge saved config with default values
      window.API_URL = result.extensionConfig.apiUrl || window.API_URL;

      Object.keys(window.DEFAULT_VALUES).forEach((key) => {
        window.DEFAULT_VALUES[key] =
          result.extensionConfig[key] || window.DEFAULT_VALUES[key];
      });
    }

    console.log("Extension config initialized", {
      API_URL: window.API_URL,
      DEFAULT_VALUES: window.DEFAULT_VALUES,
    });
  });
}

// Save extension configuration
function saveConfig(config) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ extensionConfig: config }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        // Update current configuration
        if (config.apiUrl) window.API_URL = config.apiUrl;

        Object.keys(window.DEFAULT_VALUES).forEach((key) => {
          if (config[key]) window.DEFAULT_VALUES[key] = config[key];
        });

        resolve();
      }
    });
  });
}

// Initialize configuration when the script loads
initConfig();

// Make functions available globally
window.saveConfig = saveConfig;
