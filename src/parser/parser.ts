import { existingInstructions, simpleTypes, complexTypes } from "./constants";
import instructionNoArgs from "./instructionModels/instructionNoArg";
import instructionOneArg from "./instructionModels/instructionOneArg";
import instructionTwoArgs from "./instructionModels/instructionTwoArgs";
import conditionals from "./instructionModels/conditionals";
import { ErrorMsg, SuccessMsg, StackElement } from "./interfaces";
import errorMsg from "./errors";

// REGEX TO DETECT OPCODE + SIMPLE TYPE
const opcode2ElsSimpleType = `^(${existingInstructions.join(
  "|"
)})\\s+([a-z0-9]+)$`;
// REGEX TO DETECT OPCODE + COMPLEX TYPE
const opcode2ElsComplexType = `^(${existingInstructions.join(
  "|"
)})\\s+\\((${complexTypes.join("|")})\\s(${simpleTypes.join("|")})\\)$`;
// REGEX TO DETECT OPCODE + SIMPLE TYPE + VALUE
const opcode3ElsSimpleType = `^(${existingInstructions.join(
  "|"
)})\\s+(${simpleTypes.join("|")})\\s(.+)$`;
// REGEX TO DETECT OPCODE + COMPLEX TYPE + VALUE
const opcode3ElsComplexType = `^(${existingInstructions.join(
  "|"
)})\\s+\\((${complexTypes.join("|")})\\s(${simpleTypes.join("|")})\\)\\s+(.+)$`;
// REGEX TO DETECT CONDITIONAL WITH IF OR ASSERT
const opcodeConditional = `^(IF|ASSERT)_?([A-Z]+)\\s*\\{\\s*(.*)\\s*\\}\\s*\\{\\s*(.*)\\s*\\}`;

export default async ({
  instruction,
  stack
}: {
  instruction: string;
  stack: StackElement[];
}): Promise<(ErrorMsg | SuccessMsg)[]> => {
  // splits instruction to find different elements
  instruction = instruction.trim().replace(/ +/g, " ");
  // returns function if no instruction provided
  if (!instruction) return [errorMsg("NO_INSTRUCTION", null)];

  /*
   ** CHECKS FOR NO PARAMETER
   */
  if (instruction.split(" ").length === 1) {
    // instruction with no parameter
    return instructionNoArgs({
      instruction,
      stack
    });
  }
  /*
   ** CHECKS FOR 1 PARAMETER WITH SIMPLE TYPES
   */
  let regex = new RegExp(opcode2ElsSimpleType, "");
  const instructionWith2Elements = instruction.match(regex);
  if (instructionWith2Elements) {
    return instructionOneArg({
      opcode: instructionWith2Elements[1],
      stack,
      value: [instructionWith2Elements[2]]
    });
  }
  /*
   ** CHECKS FOR 1 PARAMETER WITH COMPLEX TYPES
   */
  regex = new RegExp(opcode2ElsComplexType, "");
  const complexType2Els = instruction.match(regex);
  if (complexType2Els) {
    return instructionOneArg({
      opcode: complexType2Els[1],
      stack,
      value: [complexType2Els[2], complexType2Els[3]]
    });
  }
  /*
   ** CHECKS FOR 2 PARAMETERS WITH SIMPLE TYPES
   */
  regex = new RegExp(opcode3ElsSimpleType, "");
  const instructionWith3Elements = instruction.match(regex);
  if (instructionWith3Elements) {
    return instructionTwoArgs({
      opcode: instructionWith3Elements[1],
      type: instructionWith3Elements[2],
      value: instructionWith3Elements[3],
      stack,
      kind: "simple",
      param: null
    });
  }
  /*
   ** CHECKS FOR 1 PARAMETER WITH COMPLEX TYPES
   */
  //regex = new RegExp(opcode3ElsComplexType, "");
  //const complexType3Els = instruction.match(regex);

  /*
   ** CHECKS FOR 2 PARAMETERS WITH COMPLEX TYPES
   */
  regex = new RegExp(opcode3ElsComplexType, "");
  const complexType3Els = instruction.match(regex);
  if (complexType3Els) {
    return instructionTwoArgs({
      opcode: complexType3Els[1],
      type: complexType3Els[2],
      value: complexType3Els[4],
      param: complexType3Els[3],
      stack,
      kind: "complex"
    });
  }

  /*
   ** CHECKS FOR CONDITIONAL
   */
  regex = new RegExp(opcodeConditional);
  const conditional = instruction.match(regex);
  if (conditional) {
    const instructions: (ErrorMsg | SuccessMsg)[] = await conditionals({
      instruction: conditional[0],
      condition: conditional[1],
      details: conditional[2],
      ifTrue: conditional[3],
      ifFalse: conditional[4],
      stack
    });

    return instructions;
  }

  return [errorMsg("UNKNOWN_ERROR", null)];
};
