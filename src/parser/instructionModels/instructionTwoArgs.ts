import {
  InstructionSyntax,
  ErrorMsg,
  SuccessMsg,
  StackElement
} from "../interfaces";
import { existingInstructions, instructionSyntax } from "../constants";
import errorMsg from "../errors";
import instructions from "./instructions";

const instructionTwoArgs = ({
  opcode,
  type,
  value,
  stack,
  kind,
  param
}: {
  opcode: string;
  type: string;
  value: any;
  stack: StackElement[];
  kind: string;
  param: string | null;
}): (ErrorMsg | SuccessMsg)[] => {
  // instruction with single parameter
  //console.log(instructionWith3Elements);
  const syntax: InstructionSyntax = instructionSyntax[opcode];
  // checks if opcode exists
  if (existingInstructions.includes(opcode)) {
    // checks if opcode works on an empty stack
    if (syntax.emptyStack) {
      // checks if arguments are correctly formatted for opcode
      if (opcode === "PUSH") {
        return [instructions[opcode]({ kind, type, value, param })];
      } else {
        return [
          {
            result: "success",
            instruction: opcode,
            value,
            args: 2
          }
        ];
      }
    } else {
      return [errorMsg("EMPTY_STACK", opcode)];
    }
  } else {
    return [errorMsg("INVALID_OPCODE", opcode)];
  }
};

export default instructionTwoArgs;
