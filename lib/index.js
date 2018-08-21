const { ConcatSource } = require("webpack-sources");

class CallDllPlugin {
  addCallExpression(module, compilation) {
    const { mainTemplate } = compilation;
    const originSource = module.source;
    module.source = () => {
      const modules = module.dependencies
        .filter(dep => dep.constructor.name === "SingleEntryDependency")
        .map(dep => dep.module);

      let lastModule;
      for (let i = modules.length - 1; i >= 0; i--) {
        if (modules[i].constructor.name === "NormalModule") {
          lastModule = modules[i];
          break;
        }
      }
      if (!lastModule) {
        return originSource();
      }
      const newSource = new ConcatSource();
      newSource.add(originSource());
      newSource.add(
        mainTemplate.asString([
          "\n",
          "/* Added by CallDllPlugin */",
          `${mainTemplate.requireFn}(${JSON.stringify(lastModule.id)});`
        ])
      );
      return newSource;
    };
  }
  apply(compiler) {
    compiler.plugin("compilation", compilation => {
      if (compilation.compiler !== compiler) return;
      compilation.plugin("build-module", module => {
        if (
          module.type === "dll entry" &&
          module.constructor.name === "DllModule"
        ) {
          this.addCallExpression(module, compilation);
        }
      });
    });
  }
}

module.exports = CallDllPlugin;
