const path = require("path");
const glob = require("glob");
const { merge } = require("webpack-merge");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const common = require("./webpack.common");

const PATHS = {
  src: path.join(__dirname, "src"),
};

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.min.css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      safelist: {
        standard: [
          /^collapsing/,
          /^show$/,
          /^showing$/,
          /^hiding$/,
          /^(modal|offcanvas)-backdrop$/,
        ],
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  output: {
    filename: "main.min.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
});
