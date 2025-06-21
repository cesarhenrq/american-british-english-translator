const translateHandler = async () => {
  const textArea = document.getElementById("text-input");
  const localeArea = document.getElementById("locale-select");
  const errorArea = document.getElementById("error-msg");
  const translatedArea = document.getElementById("translated-sentence");

  errorArea.innerText = "";
  translatedArea.innerText = "";

  const data = await fetch("/api/translate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({ text: textArea.value, locale: localeArea.value }),
  });

  const parsed = await data.json();
  if (parsed.error) {
    errorArea.innerText = JSON.stringify(parsed);
    return;
  }

  const highlighted = highlight(parsed.text, parsed.translation);

  translatedArea.innerHTML = highlighted;
  return;
};

const highlight = (text, translation) => {
  const textArray = text.split(" ");
  const translationArray = translation.split(" ");
  const highlighted = translationArray.map((word, index) => {
    if (word !== textArray[index]) {
      return `<span class="highlight">${word}</span>`;
    }
    return word;
  });
  return highlighted.join(" ");
};

document
  .getElementById("translate-btn")
  .addEventListener("click", translateHandler);
