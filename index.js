const marked = require("marked");

class Element {
  constructor(e) {
    Object.assign(this, e);
  }

  isHeading() {
    return this.type === "heading";
  }

  isParagraph() {
    return this.type === "paragraph";
  }

  isCode() {
    return this.type === "code";
  }
}

class Current {
  constructor() {
    this.json = {};
  }

  static create({ parent, depth } = { depth: 0 }) {
    let current = new Current();
    current.parent = parent || { json: {} };
    current.depth = depth;
    current.json = current.parent.heading
      ? current.parent.json[current.parent.heading]
      : current.parent.json;

    return current;
  }

  addHeading(text) {
    this.heading = text;
    this.json[this.heading] = {};
  }

  addContent(text) {
    this.json[this.heading].content = text;
  }

  addCode(element) {
    let lines = element.text.split("\n");
    lines.forEach(line => {
      let bits = line.split(":");
      let value = "";

      for (let i = 1; i < bits.length; i++) value += ":" + bits[i];
      value = value.substring(1).trim();

      if (!Number.isNaN(Number(value))) value = Number(value);

      this.json[this.heading][bits[0].trim()] = value;
    });
  }
}

module.exports = md => {
  let elements = marked.lexer(md);

  let current = Current.create();
  let json = current.json;

  elements.forEach(function(e) {
    let element = new Element(e);

    if (element.isHeading()) {
      if (element.depth > current.depth) {
        current = Current.create({
          parent: current,
          depth: element.depth
        });
      } else if (element.depth < current.depth) {
        current = current.parent;
      }

      current.addHeading(element.text);
    } else if (element.isParagraph()) {
      current.addContent(element.text);
    } else if (element.isCode()) {
      current.addCode(element);
    }
  });

  return json;
};
