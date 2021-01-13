export const toSnakeCase = (inputString: string) => {
  return inputString
    .split("")
    .map((character) => {
      if (character === character.toUpperCase()) {
        return "_" + character.toLowerCase();
      } else {
        return character;
      }
    })
    .join("");
};
