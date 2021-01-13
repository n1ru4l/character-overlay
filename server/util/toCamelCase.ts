export const toCamelCase = (str: string): string => {
  let newString = "";
  let lastEditedIndex;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === " " || str[i] === "-" || str[i] === "_") {
      newString += str[i + 1].toUpperCase();
      lastEditedIndex = i + 1;
    } else if (lastEditedIndex !== i) newString += str[i].toLowerCase();
  }
  return newString;
};
