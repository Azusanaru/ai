module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          '@mapbox': './node_modules/@mapbox',
          '^@rnmapbox/maps$': '@rnmapbox/maps/react-native-mapbox-gl'
        }
      }]
    ]
  };
}; 