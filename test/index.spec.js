const assert = require("assert");
const fs = require("fs");
const markjson = require("../index.js");

describe("index", function() {
  let json;
  let rootKey = "Lorem Ipsum";

  before(function() {
    let md = fs.readFileSync(__dirname + "/loremipsum.md", "utf8");
    json = markjson(md);
  });

  it("should not be empty", function() {
    assert.ok(json != null && json != undefined && json != {});
  });

  it("should have root key", function() {
    assert.equal(Object.keys(json)[0], rootKey);
  });

  it("should have A content", () => {
    assert.equal(typeof json[rootKey].A.content, "string");
  });

  it("should have A1 content", () => {
    assert.equal(typeof json[rootKey].A.A1.content, "string");
  });

  it("should have A1.with", () => {
    assert.equal(json[rootKey].A.A1.with, "some meta data");
  });

  it("should have A1.author", () => {
    assert.equal(json[rootKey].A.A1.author, "me");
  });

  it("should have A1A content", () => {
    assert.equal(typeof json[rootKey].A.A1.A1A.content, "string");
  });

  it("should have A1A.level", () => {
    assert.strictEqual(json[rootKey].A.A1.A1A.level, 2);
  });

  it("should have A1A.subject", () => {
    assert.equal(json[rootKey].A.A1.A1A.subject, "Object of Objects");
  });

  it("should have A1A.description", () => {
    assert.equal(json[rootKey].A.A1.A1A.description, "It's dark down here.");
  });

  it("should have A2 content", () => {
    assert.equal(typeof json[rootKey].A.A2.content, "string");
  });

  it("should have B content", () => {
    assert.equal(typeof json[rootKey].B.content, "string");
  });

  it("should have root.title", () => {
    assert.equal(json[rootKey].title, rootKey);
  });

  it("should have root.description", () => {
    assert.equal(
      json[rootKey].description,
      "ultrices posuere cubilia Curae; Proin pulvinar pretium"
    );
  });

  it("should have root.generator", () => {
    assert.equal(json[rootKey].generator, "https://www.lipsum.com");
  });
});
