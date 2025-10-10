module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      // React Native preset with jsxImportSource for nativewind
      ['module:@react-native/babel-preset', { jsxImportSource: 'nativewind' }],
      // NativeWind's babel preset (needed)
      'nativewind/babel',
    ],
    plugins: [
      // other plugins you need...
      // react-native-reanimated plugin MUST be last if you use Reanimated:
      'react-native-reanimated/plugin',
    ],
  };
};
