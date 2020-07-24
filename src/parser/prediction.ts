import { instructionSyntax } from "./constants";

const prediction = async (
  instruction: string
): Promise<{ opcode: string; info: string } | null> => {
  // must be at least 2 characters for prediction to be triggered
  if (instruction.length >= 2) {
    // checks if instruction exists
    let opcode, syntax;
    if (instructionSyntax.hasOwnProperty(instruction)) {
      opcode = instruction;
      syntax = instructionSyntax[instruction];
    } else {
      // finds instructions that start with the provided string
      const predictions: string[] = Object.keys(instructionSyntax).filter(
        opcode => opcode.slice(0, instruction.length) === instruction
      );
      if (predictions.length > 0) {
        opcode = predictions[0];
        syntax = instructionSyntax[predictions[0]];
      } else {
        return null;
      }
    }
    // builds prediction text
    if (syntax.nbOfArgs === 0) {
      return {
        opcode,
        info: ""
      };
    } else {
      return {
        opcode,
        info: syntax.arguments.join(" ")
      };
    }
  } else {
    return null;
  }
};

export default prediction;
