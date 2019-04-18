/**
 * A Chunk is a part of the message.
 */
class Chunk {
  /**
   * @param {Chunk?} prev 
   * @param {{bold?:boolean,italic?:boolean,underline?:boolean,fg?:number,bg?:number}} change 
   * @param {string} text 
   */
  constructor(prev, change, text = "") {
    this.bold = false;
    this.italic = false;
    this.underline = false;
    
    /** @type {number} */
    this.fg = null;
    /** @type {number} */
    this.bg = null;
    
    if (prev != null) {
      Object.assign(this, prev, change);
    } else {
      Object.assign(this, change);
    }

    this.text = text;
  }

  /**
   * Get an array with CSS classes.
   * 
   * @param {string} prefix 
   * @returns {string[]} The list of css classes to use in a span.
   */
  cssClasses(prefix = "") {
    const classes = [];
    if (this.bold) {
      classes.push(`${prefix}bold`)
    }
    if (this.italic) {
      classes.push(`${prefix}italic`)
    }
    if (this.underline) {
      classes.push(`${prefix}underline`)
    }
    if (this.fg != null) {
      classes.push(`${prefix}fg-${this.fg}`)
    }
    if (this.bg != null) {
      classes.push(`${prefix}bg-${this.bg}`)
    }

    return classes
  }

  /**
   * Converts the text into safe HTML and replaces leading and trailing spaces
   * with `&nbsp;`.
   */
  htmlText() {
    let text = this.text;

    text = this.text.replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");

    if (text.startsWith(" ")) {
      text = "&nbsp;" + text.slice(1);
    }
    if (text.endsWith(" ")) {
      text = text.slice(0, -1) + "&nbsp;";
    }
    
    return text;
  }
  
  /**
   * Generate a HTML span tag.
   * 
   * @param {string} cssPrefix The prefix for the css classes.
   */
  toSpan(cssPrefix = "") {
    return `<span class="${this.cssClasses(cssPrefix).join(" ")}">${this.htmlText()}</span>`;
  }
}

module.exports = Chunk;
