# IRC Caret Notation

This is a module for parsing the IRC text formatting syntax into structures you can use to render it in your engine of choice. I have made a similar library in the past, but it has a different API that I did not want to completely break compatibility with.

Versions 1.0.2 through 1.0.5 is just fixing audit warnings for dev dependencies. That makes zero diffence for dependents.

```javascript
const {parse} = require("irc-caret-notation");

const chunks = parse("This is a \x02bold statement\x02.");

console.log(chunks);
/*
[ Chunk {
    bold: false,
    italic: false,
    underline: false,
    fg: null,
    bg: null,
    text: 'This is a ' },
  Chunk {
    bold: true,
    italic: false,
    underline: false,
    fg: null,
    bg: null,
    text: 'bold statement' },
  Chunk {
    bold: false,
    italic: false,
    underline: false,
    fg: null,
    bg: null,
    text: '.' } ]
*/
```

The chunks has a few helper methods for HTML-based rendering: methods to generate CSS classes and html-safe text with leading/trailing spaces turned into `&nbsp;`.
