const Chunk = require("./chunk");
const {defaultMappings, BOLD, ITALIC, UNDERLINE, COLOR, REVERSE, RESET} = require("./constants");

/**
 * Parse parses the text as an IRC line and returns a list of Chunk objects
 * that can be used to present the formatted data.
 * 
 * @param {string} str The input string.
 * @param {{[ch:string]: number}} extraMappigns Optionally add extra mappings, e.g. `{"*": BOLD}`
 */
 function parse(str, extraMappigns = null) {
  const chunks = [new Chunk(null, {})];
  const mappings = (extraMappigns != null) ? Object.assign({}, defaultMappings, extraMappigns) : defaultMappings;
  
  const chars = [...str];

  for (let i = 0; i < chars.length; ++i) {
    const ch = chars[i];
    const current = chunks[chunks.length - 1];
    const mapping = mappings[ch] || null;

    switch (mapping) {
      case BOLD: {
        chunks.push(new Chunk(current, {bold: !current.bold}));
        break;
      }
      case ITALIC: {
        chunks.push(new Chunk(current, {italic: !current.italic}));
        break;
      }
      case UNDERLINE: {
        chunks.push(new Chunk(current, {underline: !current.underline}));
        break;
      }
      case REVERSE: {
        chunks.push(new Chunk(current, {fg: current.bg || 0, bg: current.fg || 1}));
        break;
      }
      case RESET: {
        chunks.push(new Chunk(null, {}));
        break;
      }
      case COLOR: {
        const {results, length, ok} = parseColors(chars.slice(i + 1));
        if (!ok) {
          if (current.fg !== null || current.bg !== null) {
            chunks.push(new Chunk(current, {fg: null, bg: null}));
          } else {
            current.text += ch;
          }

          break;
        }

        if (results.length >= 2) {
          chunks.push(new Chunk(current, {fg: results[0], bg: results[1]}));
        } else {
          chunks.push(new Chunk(current, {fg: results[0]}));
        }

        i += (length - 1);

        break;
      }

      default: {
        current.text += ch;
        break;
      }
    }
  }

  return chunks.filter(c => c.text.length > 0);
}

/**
 * Parse a color string.
 * 
 * @param {string[]} slice The string slice starting with the stuff.
 */
function parseColors(slice) {
  let foundComma = false;
  let current = 0;
  const results = [];

  for (let i = 0; i < slice.length; ++i) {
    const ch = slice[i];

    if (ch >= '0' && ch <= '9') {
      current *= 10;
      current += parseInt(ch);
    } else if (ch === ',') {
      if (i === 0) {
        return {ok: false};
      }

      if (foundComma) {
        results.push(current);
        return {results, length: i + 1, ok: true}
      } else {
        foundComma = true;
        results.push(current);
        current = 0;
      }
    } else {
      if (i == 0) {
        return {ok: false};
      }

      results.push(current);
      return {results, length: i + 1, ok: true}
    }
  }

  return {ok: false};
}

module.exports = parse;
