#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const minimist = require("minimist");
const markjson = require("../lib/markjson");

function parseInput(args) {
  let argv = minimist(args || process.argv.slice(2), {
    boolean: ["c", "o", "f", "h"],
    alias: {
      format: "f",
      output: "o",
      concat: "c",
      help: "h"
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

function writeJson({ json, argv, filename }) {
  if (argv.output) {
    try {
      let f = process.cwd() + "/" + path.basename(filename) + ".json";
      fs.writeFileSync(f, json);
      console.info("created", f);
    } catch (e) {
      console.error(e.message);
    }
  } else {
    console.log(json);
  }
}

function parse(argv) {
  console.log("argv:", argv);
  let all = {};
  argv._.forEach(function(filename) {
    try {
      let json = getJson(filename);
      if (argv.concat) {
        Object.assign(all, json);
      } else {
        json = formatJson({ json: json, argv: argv });
        writeJson({ json: json, argv: argv, filename: filename });
      }
    } catch (e) {
      console.error(e.message);
    }
  });

  if (argv.concat) {
    all = formatJson({ json: all, argv: argv });
    writeJson({ json: all, argv: argv, filename: "output.md" });
  }
}

function main(args) {
  let argv = parseInput(args);

  if (argv._.length === 0 || argv.help) {
    console.info(`
markjson [file.md...]

--help, -h       This message.
--format, -f     Format the json. Defaults to 2 spaces.
--concat, -c     Concat the json of each file into one object. 
--output, -o     Write the json to [filename.md].json. Or, 
                 output.md.json if multiple markdown files.
    `);
  } else {
    parse(argv);
  }
}

if (module.parent) {
  module.exports = main;
} else {
  main();
}
