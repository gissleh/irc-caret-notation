var expect = require("chai").expect;

const {Chunk, parse, ITALIC} = require("./src")

describe("parse", function() {
  it("can do bold", function() {
    expect(parse("Hello, \x02World\x02!")).to.deep.equal([
      new Chunk(null, {}, "Hello, "),
      new Chunk(null, {bold: true}, "World"),
      new Chunk(null, {}, "!"),
    ])
  });

  it("can do nested formatting", function() {
    expect(parse("Hello, \x02W\x1Fo\x1Dr\x1Dl\x1Fd\x02!")).to.deep.equal([
      new Chunk(null, {}, "Hello, "),
      new Chunk(null, {bold: true}, "W"),
      new Chunk(null, {bold: true, underline: true}, "o"),
      new Chunk(null, {bold: true, underline: true, italic: true}, "r"),
      new Chunk(null, {bold: true, underline: true}, "l"),
      new Chunk(null, {bold: true}, "d"),
      new Chunk(null, {}, "!"),
    ])
  });

  it("resets basic formatting", function() {
    expect(parse("Hello, \x02W\x1Fo\x1Dr\x1Dl\x0Fd\x02!")).to.deep.equal([
      new Chunk(null, {}, "Hello, "),
      new Chunk(null, {bold: true}, "W"),
      new Chunk(null, {bold: true, underline: true}, "o"),
      new Chunk(null, {bold: true, underline: true, italic: true}, "r"),
      new Chunk(null, {bold: true, underline: true}, "l"),
      new Chunk(null, {}, "d"),
      new Chunk(null, {bold: true}, "!"),
    ])
  });

  it("filters out empty chunks", function() {
    expect(parse("Hello, \x02World\x02\x02!")).to.deep.equal([
      new Chunk(null, {}, "Hello, "),
      new Chunk(null, {bold: true}, "World"),
      new Chunk(null, {bold: true}, "!"),
    ])
  });

  it("applies color", function() {
    expect(parse("Hello, \x034World\x03!")).to.deep.equal([
      new Chunk(null, {}, "Hello, "),
      new Chunk(null, {fg: 4}, "World"),
      new Chunk(null, {}, "!"),
    ]);

    expect(parse("Hello, \x0306,8World\x03!")).to.deep.equal([
      new Chunk(null, {}, "Hello, "),
      new Chunk(null, {fg: 6, bg: 8}, "World"),
      new Chunk(null, {}, "!"),
    ]);

    expect(parse("Hello, \x036,8,9World\x03!")).to.deep.equal([
      new Chunk(null, {}, "Hello, "),
      new Chunk(null, {fg: 6, bg: 8}, ",9World"),
      new Chunk(null, {}, "!"),
    ]);

    expect(parse("Hello, \x03,8,9World\x03!")).to.deep.equal([
      new Chunk(null, {}, "Hello, \x03,8,9World\x03!"),
    ]);
  });

  it("handles custom mappings", function() {
    expect(parse("Hello, \x02World\x02*!*", {"*": ITALIC})).to.deep.equal([
      new Chunk(null, {}, "Hello, "),
      new Chunk(null, {bold: true}, "World"),
      new Chunk(null, {italic: true}, "!"),
    ])
  });

  it("reverses color", function() {
    expect(parse("Hello, \x034,8World\x16!\x03")).to.deep.equal([
      new Chunk(null, {}, "Hello, "),
      new Chunk(null, {fg: 4, bg: 8}, "World"),
      new Chunk(null, {fg: 8, bg: 4}, "!"),
    ]);
  });

  it("reverses no color to white on black", function() {
    expect(parse("Hello, \x16World!")).to.deep.equal([
      new Chunk(null, {}, "Hello, "),
      new Chunk(null, {fg: 0, bg: 1}, "World!"),
    ]);
  });
});

describe("Chunk", function() {
  it("generates css classes correctly", function() {
    expect((new Chunk(null, {bold: true}, "World")).cssClasses("test-")).to.deep.equal(["test-bold"]);
    expect((new Chunk(null, {italic: true}, "World")).cssClasses("test-")).to.deep.equal(["test-italic"]);
    expect((new Chunk(null, {underline: true}, "World")).cssClasses()).to.deep.equal(["underline"]);
    expect((new Chunk(null, {fg: 7, bg: 12}, "World")).cssClasses("test-")).to.deep.equal(["test-fg-7", "test-bg-12"]);
  });

  it("removes html", function() {
    const chunk = new Chunk(null, {}, "World");
    
    chunk.text = "Stuff ";
    expect(chunk.htmlText()).to.equal("Stuff&nbsp;");

    chunk.text = " Stuff<>";
    expect(chunk.htmlText()).to.equal("&nbsp;Stuff&lt;&gt;");
  });

  it("generates a span", function() {
    const chunk = new Chunk(null, {bold: true, italic: true}, " World<> ");

    expect(chunk.toSpan("test-")).to.equal(`<span class="test-bold test-italic">&nbsp;World&lt;&gt;&nbsp;</span>`)
    expect(chunk.toSpan()).to.equal(`<span class="bold italic">&nbsp;World&lt;&gt;&nbsp;</span>`)
  })
})