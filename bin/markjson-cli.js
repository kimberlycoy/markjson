#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const minimist = require("minimist");
const markjson = require("../lib/markjson");

function parseInput(args) {
  let argv = minimist(args || process.argv.slice(2), {
    boolean: ["c", "o", "f"],
    alias: {
      format: "f",
      output: "o",
      concat: "c"
    }
  });

  if (argv.f === true) argv.format = 2;
  return argv;
}

function getJson(filename) {
  let md = fs.readFileSync(filename, "utf8");
  let json = markjson(md);
  return json;
}

function formatJson({ json, argv }) {
  return JSON.stringify(json, null, argv.format);
}

function outputJson({ json, argv, filename }) {
  if (argv.output) {
    try {
      let f = __dirname + "/" + path.basename(filename) + ".json";
      fs.writeFileSync(f, json);
    } catch (e) {
      console.error(e.message);
    }
  } else {
    console.log(json);
  }
}

function main(args) {
  let argv = parseInput(args);
  let all = {};
  argv._.forEach(function(filename) {
    try {
      let json = getJson(filename);
      if (argv.concat) {
        Object.assign(all, json);
      } else {
        json = formatJson({ json: json, argv: argv });
        outputJson({ json: json, argv: argv, filename: filename });
      }
    } catch (e) {
      console.error(e.message);
    }
  });

  if (argv.concat) {
    all = formatJson({ json: all, argv: argv });
    outputJson({ json: all, argv: argv, filename: "output" });
  }
}

if (module.parent) {
  module.exports = main;
} else {
  main();
}
