const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js", // Entry point for your React app
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/", // Required for React Router (if used)
    
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Transpile JavaScript and JSX files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
    },
      {
        test: /\.css$/, // Process CSS files
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Use your HTML file as a template
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true, // Enable Hot Module Replacement
    port: 3000, // Dev server runs on port 3000
    proxy: [
        {
          context: ["/api"],
          target: "http://localhost:80",
          changeOrigin: true,
        },
        {
          context: ["/static"],
          target: "http://localhost:80",
          changeOrigin: true,
        }
      ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  mode: "development",
};
