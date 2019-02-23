const assert = require("assert");
const fs = require("fs");
const markjson = require("../lib/markjson.js");

describe("json", function() {
  let json;

  before(function() {
    let md = fs.readFileSync(__dirname + "/loremipsum.md", "utf8");
    json = markjson(md);
  });

  it("should not be empty", function() {
    assert.ok(json != null && json != undefined && json != {});
  });

  describe("Lorem Ipsum", function() {
    let loremIpsum;
    before(function() {
      loremIpsum = json["Lorem Ipsum"];
    });

    it("should have a title", () => {
      assert.equal(loremIpsum.title, "Lorem Ipsum");
    });

    it("should have a description", () => {
      assert.equal(
        loremIpsum.description,
        "ultrices posuere cubilia Curae; Proin pulvinar pretium"
      );
    });

    it("should have a generator", () => {
      assert.equal(loremIpsum.generator, "https://www.lipsum.com");
    });

    describe("A", function() {
      let A;
      before(function() {
        A = loremIpsum.A;
      });

      it("should have content", function() {
        assert.equal(typeof A.content, "string");
      });

      describe("content", function() {
        let start = "Lorem ipsum dolor sit amet";
        it("should start with '" + start + "'", function() {
          assert.ok(A.content.startsWith(start));
        });

        let included = "Integer accumsan dui non luctus accumsan.";
        it("should include '" + included + "'", function() {
          assert.ok(A.content.includes(included, 5));
        });

        it("should maintain spacing between paragraphs", function() {
          assert.ok(A.content.includes("\n\n" + included, 5));
        });
      });

      describe("A1", function() {
        let A1;

        before(function() {
          A1 = A.A1;
        });

        it("should have content", () => {
          assert.equal(typeof A1.content, "string");
        });

        it("should have a with", () => {
          assert.equal(A1.with, "some meta data");
        });

        it("should have an author", () => {
          assert.equal(A1.author, "me");
        });

        describe("A1A", function() {
          let A1A;

          before(function() {
            A1A = A1.A1A;
          });

          it("should have content", () => {
            assert.equal(typeof A1A.content, "string");
          });

          it("should have a level", () => {
            assert.strictEqual(A1A.level, 2);
          });

          it("should have a subject", () => {
            assert.equal(A1A.subject, "Object of Objects");
          });

          it("should have a description", () => {
            assert.equal(A1A.description, "It's dark down here.");
          });
        });
      });

      it("should have A2 content", () => {
        assert.equal(typeof A.A2.content, "string");
      });
    });

    describe("B", function() {
      it("should have content", () => {
        assert.equal(typeof loremIpsum.B.content, "string");
      });
    });
  });

  describe("Lorem Ipsum II", function() {
    it("should have content", function() {
      assert.equal(typeof json["Lorem Ipsum II"].content, "string");
    });
  });
});
