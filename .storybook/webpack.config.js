const path = require('path');

module.exports = async ({ config, mode }) => {
  config.resolve = {
    ...config.resolve,
    extensions: [
      ...config.resolve.extensions,
      ".js",
      ".jsx"
    ],
    modules: [
      "../node_modules",
      "../src/_scss",
      "../src",
      ...config.resolve.modules,
    ]
  }
  config.module.rules.push(
    ...[
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.js$|jsx$/,
        loader: "babel-loader",
        include: path.resolve(__dirname, '../src/js'),
      },
    ]
  );
  return config;
};
