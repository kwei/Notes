const showdown = require("showdown");

export function markdownConverter(file) {
  const converter = new showdown.Converter();
  return converter.makeHtml(file);
}
