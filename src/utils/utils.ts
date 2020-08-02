import { existingInstructions } from "../parser/constants";

export const splitInstructions = (code: string): string[] => {
  const regex = new RegExp(
    `(${existingInstructions.join("|")})(\\s*;|(.*);)`,
    "g"
  );

  return [
    ...code
      .trim()
      .replace(/\r?\n|\r/g, "")
      .replace(/\s+/g, " ")
      .matchAll(regex)
  ].map(result => result[0].trim().slice(0, -1).trim());

  /*return code
    .trim()
    .replace(/\r?\n|\r/g, "")
    .split(";")
    .filter(el => el)
    .map(instr => instr.trim().replace(/\s+/g, " "));*/
};
