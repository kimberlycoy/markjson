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

  isListItemStart() {
    return this.type === "list_item_start";
  }

  isText() {
    return this.type === "text";
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

  addListItemStart() {
    this.list = true;
    let headingObj = this.json[this.heading];
    if (!headingObj.list) headingObj.list = [];
  }

  addText(text) {
    let headingObj = this.json[this.heading];
    if (headingObj.list) headingObj.list.push(text);
  }

  addHeading(text) {
    this.heading = text;
    this.json[this.heading] = {};
  }

  addParagraph(text) {
    let headingObj = this.json[this.heading];
    headingObj.content
      ? (headingObj.content += "\n\n" + text)
      : (headingObj.content = text);
  }

  addCode(element) {
    let lines = element.text.split("\n");
    lines.forEach(line => {
      let bits = line.split(":");
      let value = "";

      for (let i = 1; i < bits.length; i++) value += ":" + bits[i];
      value = value.substring(1).trim();

      if (!Number.isNaN(Number(value))) {
        value = Number(value);
      } else if (value.startsWith("[")) {
        try {
          value = JSON.parse(value);
        } catch (e) {}
      }

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
      current.addParagraph(element.text);
    } else if (element.isCode()) {
      current.addCode(element);
    } else if (element.isListItemStart()) {
      current.addListItemStart();
    } else if (element.isText()) {
      current.addText(element.text);
    }
  });

  return json;
};
