const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: {
        'postcss-preset-env': {},
        cssnano: {},
        autoprefixer: { ...autoprefixer({ grid: true }) }
    }
};
