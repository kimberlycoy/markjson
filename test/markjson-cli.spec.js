const assert = require("assert");
const fs = require("fs");
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
