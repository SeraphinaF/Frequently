const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add support for .cjs files
defaultConfig.resolver.sourceExts.push('cjs');

// ✅ Disable unstable package exports for Expo Go compatibility
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
