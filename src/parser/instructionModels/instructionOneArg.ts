import {
  InstructionSyntax,
  ErrorMsg,
  SuccessMsg,
  StackElement
} from "../interfaces";
import {
  existingInstructions,
  instructionSyntax,
  simpleTypes
} from "../constants";
import errorMsg from "../errors";
import instructions from "./instructions";

const instructionOneArg = ({
  opcode,
  stack,
  value
}: {
  opcode: string;
  stack: StackElement[];
  value: any[];
}): (ErrorMsg | SuccessMsg)[] => {
  // instruction with single parameter
  const syntax: InstructionSyntax = instructionSyntax[opcode];
  // checks if opcode exists
  if (existingInstructions.includes(opcode)) {
    if (syntax.nbOfArgs === 0) {
      // if opcode expects no argument
      return [errorMsg("UNEXPECTED_ARG", value, `${opcode} ${value}`)];
    } else if (syntax.nbOfArgs === 2) {
      // if opcode expects 2 arguments
      return [
        errorMsg("NOT_ENOUGH_ARGS", [syntax.nbOfArgs, 1], `${opcode} ${value}`)
      ];
    } else if (value.length === 1) {
      const val = value[0];
      if (isNaN(val) && syntax.argType && syntax.argType === "number") {
        // if opcode is associated with a numeric argument
        return [
          errorMsg("WRONG_ARG", ["number", "string"], `${opcode} ${value}`)
        ];
      } else if (!isNaN(val) && syntax.argType && syntax.argType === "string") {
        // if opcode is associated with an alphabetical argument
        return [
          errorMsg("WRONG_ARG", ["string", "number"], `${opcode} ${value}`)
        ];
      } else if (!isNaN(val) && syntax.argType === "number") {
        // for opcodes with numeric arguments
        // for values like `DROP` or `DIP`, checks that the stack is deep enough
        if (["DROP"].includes(opcode) && stack.length >= val) {
          // hardcoded error
          // DROP 0 is a no-op
          if (opcode === "DROP" && parseInt(val) === 0) {
            return [
              {
                result: "error",
                msg: "DROP 0 is a no-op",
                id: "NO_OP",
                value: "NO_OP",
                instruction: "DROP 0"
              }
            ];
          }
          return [
            {
              result: "success",
              instruction: opcode,
              value: val,
              args: 1
            }
          ];
        } else {
          return [
            errorMsg(
              "STACK_NOT_DEEP_ENOUGH",
              [stack.length, val],
              `${opcode} ${value}`
            )
          ];
        }
      } else {
        if (simpleTypes.includes(val)) {
          // if type is an existing type or if opcode expects numerical value
          if (instructions.hasOwnProperty(opcode)) {
            if (opcode === "NIL") {
              // sends type as val
              return [instructions[opcode](val)];
            } else {
              return instructions[opcode](stack, 0);
            }
          } else {
            return [
              errorMsg("UNAVAILABLE_OPCODE", opcode, `${opcode} ${value}`)
            ];
          }
        } else {
          return [errorMsg("UNKNOWN_TYPE", val, `${opcode} ${value}`)];
        }
      }
    } else if (value.length === 2) {
      if (syntax.argType === "number") {
        // if opcode is associated with a numeric argument
        return [
          errorMsg("WRONG_ARG", ["number", "string"], `${opcode} ${value}`)
        ];
      } else {
        return [
          {
            result: "success",
            instruction: opcode,
            args: 1
          }
        ];
      }
    } else {
      return [errorMsg("UNKNOWN_ERROR", null, `${opcode} ${value}`)];
    }
  } else {
    return [errorMsg("INVALID_OPCODE", opcode, `${opcode} ${value}`)];
  }
};

export default instructionOneArg;
