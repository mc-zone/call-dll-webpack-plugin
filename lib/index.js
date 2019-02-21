const { ConcatSource } = require("webpack-sources");
const asString = require("webpack/lib/Template").asString;

class CallDllPlugin {
  constructor({ callModuleId, callModuleName } = {}) {
    this.callModuleId = callModuleId || null;
    this.callModuleName = callModuleName || null;
  }
  addCallExpression(entryModule, compilation) {
    const { mainTemplate } = compilation;
    const originSource = entryModule.source;
    entryModule.source = () => {
      const modules = entryModule.dependencies
        .filter(dep => dep.constructor.name === "SingleEntryDependency")
        .map(dep => dep.module);
      let callModuleId = this.callModuleId;
      let callModuleName = this.callModuleName;
      if (callModuleId === null) {
        for (let i = modules.length - 1; i >= 0; i--) {
          const m = modules[i];
          // call last one as default
          if (
            m.constructor.name === "NormalModule" &&
            (callModuleName === null || callModuleName === m.rawRequest)
          ) {
            callModuleId = m.id;
            break;
          }
        }
      }
      if (callModuleId === null) {
        return originSource();
      }
      const newSource = new ConcatSource();
      newSource.add(originSource());
      newSource.add(
        asString([
          "\n",
          "/* Added by CallDllPlugin */",
          `${mainTemplate.requireFn}(${JSON.stringify(callModuleId)});`
        ])
      );
      return newSource;
    };
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("CallDllWebpackPlugin", compilation => {
      if (compilation.compiler !== compiler) return;
      compilation.hooks.buildModule.tap("CallDllWebpackPlugin", module => {
        debugger;
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
