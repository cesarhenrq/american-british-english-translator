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

  translateWithHighlight(text, locale) {
    if (locale === "american-to-british") {
      return this.americanToBritishWithHighlight(text);
    } else if (locale === "british-to-american") {
      return this.britishToAmericanWithHighlight(text);
    } else {
      return text;
    }
  }

  americanToBritish(text) {
    let translated = text;

    translated = translated.replace(/([1-9]|1[0-2]):[0-5][0-9]/g, (match) => {
      return match.replace(":", ".");
    });

    const titleRegex = new RegExp(
      Object.keys(americanToBritishTitles)
        .map((title) => title.replace(".", "\\."))
        .join("|"),
      "gi"
    );

    translated = translated.replace(titleRegex, (match) => {
      const britishTitle = americanToBritishTitles[match.toLowerCase()];
      return this.matchCase(match, britishTitle);
    });

    Object.entries(americanToBritishSpelling).forEach(([am, br]) => {
      const regex = new RegExp(`\\b${am}\\b`, "gi");
      translated = translated.replace(regex, (match) => {
        return this.matchCase(match, br);
      });
    });

    Object.entries(americanOnly).forEach(([am, br]) => {
      const regex = new RegExp(`\\b${am}\\b`, "gi");
      translated = translated.replace(regex, (match) => {
        return this.matchCase(match, br);
      });
    });

    return translated;
  }

  britishToAmerican(text) {
    let translated = text;

    translated = translated.replace(/([1-9]|1[0-2])\.[0-5][0-9]/g, (match) => {
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
      translated = translated.replace(regex, (match) => {
        return this.matchCase(match, am);
      });
    });

    Object.entries(britishToAmericanSpelling).forEach(([br, am]) => {
      const regex = new RegExp(`\\b${br}\\b`, "gi");
      translated = translated.replace(regex, (match) => {
        return this.matchCase(match, am);
      });
    });

    Object.entries(britishOnly).forEach(([br, am]) => {
      const regex = new RegExp(`\\b${br}\\b`, "gi");
      translated = translated.replace(regex, (match) => {
        return this.matchCase(match, am);
      });
    });

    return translated;
  }

  americanToBritishWithHighlight(text) {
    let translated = text;
    let hasTranslation = false;

    translated = translated.replace(/([1-9]|1[0-2]):[0-5][0-9]/g, (match) => {
      hasTranslation = true;
      return `<span class="highlight">${match.replace(":", ".")}</span>`;
    });

    const titleRegex = new RegExp(
      Object.keys(americanToBritishTitles)
        .map((title) => title.replace(".", "\\."))
        .join("|"),
      "gi"
    );

    translated = translated.replace(titleRegex, (match) => {
      hasTranslation = true;
      const britishTitle = americanToBritishTitles[match.toLowerCase()];
      return `<span class="highlight">${this.matchCase(
        match,
        britishTitle
      )}</span>`;
    });

    Object.entries(americanToBritishSpelling).forEach(([am, br]) => {
      const regex = new RegExp(`\\b${am}\\b`, "gi");
      translated = translated.replace(regex, (match) => {
        hasTranslation = true;
        return `<span class="highlight">${this.matchCase(match, br)}</span>`;
      });
    });

    Object.entries(americanOnly).forEach(([am, br]) => {
      const regex = new RegExp(`\\b${am}\\b`, "gi");
      translated = translated.replace(regex, (match) => {
        hasTranslation = true;
        return `<span class="highlight">${this.matchCase(match, br)}</span>`;
      });
    });

    return hasTranslation ? translated : "Everything looks good to me!";
  }

  britishToAmericanWithHighlight(text) {
    let translated = text;
    let hasTranslation = false;

    translated = translated.replace(/([1-9]|1[0-2])\.[0-5][0-9]/g, (match) => {
      hasTranslation = true;
      return `<span class="highlight">${match.replace(".", ":")}</span>`;
    });

    const britishToAmericanSpelling = Object.fromEntries(
      Object.entries(americanToBritishSpelling).map(([am, br]) => [br, am])
    );

    const britishToAmericanTitles = Object.fromEntries(
      Object.entries(americanToBritishTitles).map(([am, br]) => [br, am])
    );

    Object.entries(britishToAmericanTitles).forEach(([br, am]) => {
      const regex = new RegExp(`\\b${br}\\b`, "gi");
      translated = translated.replace(regex, (match) => {
        hasTranslation = true;
        return `<span class="highlight">${this.matchCase(match, am)}</span>`;
      });
    });

    Object.entries(britishToAmericanSpelling).forEach(([br, am]) => {
      const regex = new RegExp(`\\b${br}\\b`, "gi");
      translated = translated.replace(regex, (match) => {
        hasTranslation = true;
        return `<span class="highlight">${this.matchCase(match, am)}</span>`;
      });
    });

    Object.entries(britishOnly).forEach(([br, am]) => {
      const regex = new RegExp(`\\b${br}\\b`, "gi");
      translated = translated.replace(regex, (match) => {
        hasTranslation = true;
        return `<span class="highlight">${this.matchCase(match, am)}</span>`;
      });
    });

    return hasTranslation ? translated : "Everything looks good to me!";
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
