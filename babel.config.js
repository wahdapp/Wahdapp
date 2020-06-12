module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            assets: './assets',
            components: './components',
            constants: './constants',
            firebaseDB: './firebase',
            helpers: './helpers',
            reducers: './reducers',
            screens: './screens',
            actions: './actions',
            services: './services'
          },
        },
      ],
    ],
  };
};
