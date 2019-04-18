const Chunk = require("./chunk");
const {BOLD, ITALIC, UNDERLINE, COLOR, REVERSE, RESET, B, I, U, C, R, O} = require("./constants");
const parse = require("./parse");

module.exports = {
  BOLD, ITALIC, UNDERLINE, COLOR, REVERSE, RESET,
  B, I, U, C, R, O,
  Chunk,
  parse,
}