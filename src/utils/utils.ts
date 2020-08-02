import { existingInstructions } from "../parser/constants";

export const splitInstructions = (code: string): string[] => {
  const regex = new RegExp(
    `(${existingInstructions.join("|")})(\\s*;|.*\\}|.*?;)`,
    "g"
  );
  // (\\s*;|\\s+\\{.*\\}|.*?;)
  // (\\s*;|.*;|.*})

  return [
    ...code
      .trim()
      .replace(/\r?\n|\r/g, "")
      .replace(/\s+/g, " ")
      .matchAll(regex)
  ].map(result => {
    let instruction = result[0].trim();
    if (instruction.slice(-1) === ";") {
      return instruction.slice(0, -1).trim();
    } else {
      return instruction;
    }
  });
};
