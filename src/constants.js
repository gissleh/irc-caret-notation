const [BOLD, ITALIC, UNDERLINE, REVERSE, RESET, COLOR] = [1, 2, 3, 4, 5, 6];

const B = "\x02";
const I = "\x1D";
const U = "\x1F";
const C = "\x03";
const R = "\x16";
const O = "\x0F";

const defaultMappings = {
  [B]: BOLD,
  [I]: ITALIC,
  [U]: UNDERLINE,
  [C]: COLOR,
  [R]: REVERSE,
  [O]: RESET,
};

module.exports = {
  BOLD, ITALIC, UNDERLINE, COLOR, REVERSE, RESET,
  B, I, U, C, R, O,
  defaultMappings,
};