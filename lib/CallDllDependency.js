const NullDependency = require("webpack/lib/dependencies/NullDependency");

class CallDllDependency extends NullDependency {
  updateHash(hash) {
    super.updateHash(hash);
    //hash.update(this.name + "");
  }
}

CallDllDependency.Template = class CallDllDependencyTemplate {
  apply(dep, source) {
    debugger;
  }
};

module.exports = CallDllDependency;
