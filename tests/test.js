const util = require("util");
const path = require("path");
const vm = require("vm");
const fs = require("fs");

test("should call Dll immediately", () => {
  return util
    .promisify(fs.readFile)(
      path.resolve(__dirname, "./dist/main.bundle.js"),
      "utf8"
    )
    .then(bundle => {
      const sandbox = {
        window: {}
      };
      expect(sandbox.common).toBeUndefined();
      expect(sandbox.window.installed).toBeUndefined();
      vm.runInNewContext(bundle, sandbox);
      expect(sandbox.common).toBeDefined();
      expect(sandbox.window.installed).toBeDefined();
      expect(sandbox.window.installed).toEqual(["entrypoint"]);
    });
});
