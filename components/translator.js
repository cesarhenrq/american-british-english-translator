const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  translate(text, locale) {
    if (locale === "american-to-british") {
      return this.americanToBritish(text);
    } else if (locale === "british-to-american") {
      return this.britishToAmerican(text);
    } else {
      return text;
    }
  }

  americanToBritish(text) {
    let translated = text;

    translated = translated.replace(/[1-9]:[0-9]{2}/g, (match) => {
      return match.replace(":", ".");
    });

    const titleRegex = new RegExp(
      Object.keys(americanToBritishTitles)
        .map((title) => title.replace(".", "\\."))
        .join("|"),
      "gi"
    );

    translated = translated.replace(titleRegex, (match) => {
      return this.matchCase(
        match,
        americanToBritishTitles[match.toLowerCase()]
      );
    });

    Object.entries(americanToBritishSpelling).forEach(([am, br]) => {
      const regex = new RegExp(`\\b${am}\\b`, "gi");
      translated = translated.replace(regex, (match) =>
        this.matchCase(match, br)
      );
    });

    Object.entries(americanOnly).forEach(([am, br]) => {
      const regex = new RegExp(`\\b${am}\\b`, "gi");
      translated = translated.replace(regex, (match) =>
        this.matchCase(match, br)
      );
    });

    return translated;
  }

  britishToAmerican(text) {
    let translated = text;

    translated = translated.replace(/[1-9]\.[0-9]{2}/g, (match) => {
      return match.replace(".", ":");
    });

    const britishToAmericanSpelling = Object.fromEntries(
      Object.entries(americanToBritishSpelling).map(([am, br]) => [br, am])
    );

    const britishToAmericanTitles = Object.fromEntries(
      Object.entries(americanToBritishTitles).map(([am, br]) => [br, am])
    );

    Object.entries(britishToAmericanTitles).forEach(([br, am]) => {
      const regex = new RegExp(`\\b${br}\\b`, "gi");
      translated = translated.replace(regex, (match) =>
        this.matchCase(match, am)
      );
    });

    Object.entries(britishToAmericanSpelling).forEach(([br, am]) => {
      const regex = new RegExp(`\\b${br}\\b`, "gi");
      translated = translated.replace(regex, (match) =>
        this.matchCase(match, am)
      );
    });

    Object.entries(britishOnly).forEach(([br, am]) => {
      const regex = new RegExp(`\\b${br}\\b`, "gi");
      translated = translated.replace(regex, (match) =>
        this.matchCase(match, am)
      );
    });

    return translated;
  }

  matchCase(source, target) {
    if (source === source.toUpperCase()) {
      return target.toUpperCase();
    } else if (source[0] === source[0].toUpperCase()) {
      return target.charAt(0).toUpperCase() + target.slice(1);
    }
    return target;
  }
}

module.exports = Translator;
