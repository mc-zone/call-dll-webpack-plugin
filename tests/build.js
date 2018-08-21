const path = require("path");
const webpack = require("webpack");
const CallDllPlugin = require("../");

const config = {
  entry: ["./other.js", "./entrypoint.js"],
  context: __dirname,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    library: "common"
  },
  plugins: [
    new CallDllPlugin(),
    new webpack.DllPlugin({
      context: __dirname,
      name: "common",
      path: path.join(__dirname, "manifest.json")
    }),
    new webpack.HashedModuleIdsPlugin()
  ]
};

webpack(config, (error, stats) => {
  if (error) {
    return console.error(error);
  }
  console.log(
    stats.toString({
      colors: true
    })
  );
});
