import { existingInstructions, instructionSyntax } from "../parser/constants";
import { StackElement, SuccessMsg } from "../parser/interfaces";

export const splitInstructions = (code: string): string[] => {
  /*const regex = new RegExp(
    `(${existingInstructions.join("|")})(\\s*;|.*\\}|.*?;)`,
    "g"
  );*/
  const regex = new RegExp(`([A-Z_]+)(\\s*;|.*\\}|.*?;|.*$)`, "g");

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

export const updateStack = (
  stack: StackElement[],
  result: SuccessMsg
): StackElement[] => {
  const elsToConsume: number = instructionSyntax[result.instruction].consumeEl;
  for (let j = 0; j < elsToConsume; j++) {
    // removes elements
    stack.shift();
  }
  // if instruction adds element to the stack
  if (result.element) {
    stack = [result.element, ...stack];
  } else {
    // if instruction manipulates the stack
    if (result.instruction === "SWAP") {
      const el1 = stack[0];
      const el2 = stack[1];
      // pops first 2 elements of stack
      stack.shift();
      stack.shift();
      // switches elements and inserts them back in the stack
      stack = [el2, el1, ...stack];
    }
  }

  return stack;
};
