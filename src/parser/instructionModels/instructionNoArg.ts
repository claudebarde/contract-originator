import { existingInstructions, instructionSyntax } from "../constants";
import {
  InstructionSyntax,
  ErrorMsg,
  SuccessMsg,
  StackElement
} from "../interfaces";
import errorMsg from "../errors";
import instructions from "./instructions";

const arithmeticOps = ["ADD", "SUB", "MUL", "EDIV"];

const instructionNoArgs = ({
  instruction,
  stack
}: {
  instruction: string;
  stack: StackElement[];
}): (ErrorMsg | SuccessMsg)[] => {
  // checks if the instruction exists
  if (existingInstructions.includes(instruction)) {
    const syntax: InstructionSyntax = instructionSyntax[instruction];
    // if opcode was not found
    if (!syntax) return [errorMsg("INVALID_OPCODE", instruction, instruction)];

    if (!syntax.emptyStack && stack.length === 0) {
      // if instruction doesn't work with an empty stack
      return [errorMsg("EMPTY_STACK", instruction, instruction)];
    } else if (syntax.nbOfArgs !== 0 && syntax.argCanBe0 === false) {
      // if instruction can accept 0 arg or 1 number (like `DROP` and `DROP 2`)
      return [errorMsg("NOT_ENOUGH_ARGS", [syntax.nbOfArgs, 0], instruction)];
    } else if (stack.length < syntax.minStackDepth) {
      // verifies that there are enough elements in the stack
      return [
        errorMsg(
          "STACK_NOT_DEEP_ENOUGH",
          [stack.length, syntax.minStackDepth],
          instruction
        )
      ];
    } else {
      if (
        instructions.hasOwnProperty(instruction) ||
        arithmeticOps.includes(instruction)
      ) {
        if (syntax.emptyStack) {
          // these instructions don't need the stack
          return [instructions[instruction]()];
        } else if (arithmeticOps.includes(instruction)) {
          // if arithmetic operation
          return [instructions.ARITHM(stack, 0, instruction)];
        } else {
          return [instructions[instruction](stack, 0)];
        }
      } else {
        return [errorMsg("UNAVAILABLE_OPCODE", instruction, instruction)];
      }
    }
  } else {
    return [errorMsg("INVALID_OPCODE", instruction, instruction)];
  }
};

export default instructionNoArgs;
