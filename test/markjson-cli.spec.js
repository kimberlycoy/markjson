const assert = require("assert");
const fs = require("fs");
const shell = require("shelljs");
const markjson = require("../bin/markjson-cli.js");

function stdout(fn) {
  let write = process.stdout.write;
  let output = "";
  process.stdout.write = chunk => (output += chunk);
  fn.apply(fn);
  process.stdout.write = write;
  return output;
}

describe("cli", function() {
  describe("stdout", function() {
    it("should parce one.md", function() {
      let expected = '{"one":{"content":"This is one."}}\n';
      let actual = stdout(() => markjson([__dirname + "/one.md"]));
      assert.equal(actual, expected);
    });

    it("should format one.md", function() {
      let expected = '{\n  "one": {\n    "content": "This is one."\n  }\n}\n';
      let actual = stdout(() => markjson([__dirname + "/one.md", "-f"]));
      assert.equal(actual, expected);
    });

    it("should concat one.md & two.md", function() {
      let expected =
        '{"one":{"content":"This is one."},"two":{"content":"This is two"}}\n';
      let actual = stdout(() =>
        markjson([__dirname + "/one.md", __dirname + "/two.md", "-c"])
      );
      assert.equal(actual, expected);
    });
  });

  describe("--output", function() {
    function unlink(hideLog) {
      shell.rm("-rf", "/tmp/markjson-cli.spec");
    }

    before(function() {
      unlink(true);
      stdout(() => {
        shell.mkdir("/tmp/markjson-cli.spec");
        shell.pushd("/tmp/markjson-cli.spec");
      });
    });

    after(function() {
      stdout(() => {
        shell.popd();
        unlink();
      });
    });

    it("should create one.md.json", function() {
      let expected = process.cwd() + "/one.md.json";
      let cmd = [__dirname + "/one.md", "-o"];
      markjson(cmd);
      assert.ok(
        fs.existsSync(expected),
        "\nmarkjson(" + cmd + ")\nShould create: " + expected
      );
    });

    it("should create output.md.json", function() {
      let expected = process.cwd() + "/output.md.json";
      let cmd = [__dirname + "/one.md", __dirname + "/two.md", "-co"];
      markjson(cmd);
      assert.ok(
        fs.existsSync(expected),
        "\nmarkjson(" + cmd + ")\nShould create: " + expected
      );
    });
  });
});
