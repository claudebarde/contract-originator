import parser from "./parser";
import { SuccessMsg, ErrorMsg, StackElement } from "./interfaces";
import { instructionSyntax } from "./constants";
import { splitInstructions, updateStack } from "../utils/utils";

export default async (
  michelson: string,
  initParameter: string,
  initStorage: string
): Promise<{ result: (SuccessMsg | ErrorMsg)[]; endOfExecution: boolean }> => {
  if (!initParameter || !initStorage)
    return {
      result: [
        {
          result: "error",
          msg: "No parameter or storage provided",
          id: "0",
          value: "ERROR",
          instruction: "NULL"
        }
      ],
      endOfExecution: false
    };
  // initializes empty stack
  let stack: StackElement[] = [];
  // separates storage, parameter and code
  let storage: string;
  let parameter: string;
  let code: string;

  const matchStorage = michelson.match(/storage(.*);/);
  if (matchStorage) {
    storage = matchStorage[1].trim();
  }
  const matchParameter = michelson.match(/parameter(.*);/);
  if (matchParameter) {
    parameter = matchParameter[1].trim();
  }
  const matchCode = michelson.match(/code\s*\{(.*)\}/s);
  if (matchCode) {
    code = matchCode[1].trim();
  }

  let resultStack: (SuccessMsg | ErrorMsg)[] = [];
  // separates instructions
  const instructions: string[] = splitInstructions(code);
  // formats init parameter and storage
  let [initParameterType, initParameterValue] = initParameter.split(" ");
  let [initStorageType, initStorageValue] = initStorage.split(" ");
  // initial parameter/storage pair pushed to stack
  const leftElement: StackElement = {
    type: initParameterType,
    value: initParameterValue,
    instruction: "INIT"
  };
  const rightElement: StackElement = {
    type: initStorageType,
    value: initStorageValue,
    instruction: "INIT"
  };
  const initialPair: StackElement = {
    type: "pair",
    value: `(Pair ${leftElement.type} ${rightElement.type})`,
    instruction: "INIT",
    elements: [leftElement, rightElement],
    param: [leftElement.type, rightElement.type]
  };
  stack.push(initialPair);

  for (let i = 0; i < instructions.length; i++) {
    // parses each instruction until completion or error
    const parsedInstr: (SuccessMsg | ErrorMsg)[] = await parser({
      instruction: instructions[i],
      stack
    });
    // loops through results
    for (let k = 0; k < parsedInstr.length; k++) {
      if (parsedInstr[k].result === "error") {
        resultStack.push({ ...parsedInstr[k], stackState: stack });
        break;
      } else {
        const success = parsedInstr[k] as SuccessMsg;
        // checks if element(s) must be removed from the stack
        stack = [...updateStack(stack, success)];
        // pushes result
        resultStack.push({ ...success, stackState: [...stack] });
      }
    }
  }

  // verifies if end of execution
  let endOfExecution: boolean;
  if (resultStack.length <= 2) {
    // the contract cannot stop executing after 2 instructions
    endOfExecution = false;
  } else if (resultStack.filter(el => el.result === "error").length > 0) {
    // cannot be end of execution if contract doesn't typecheck
    endOfExecution = false;
  } else {
    const lastEl = resultStack[resultStack.length - 1] as SuccessMsg;
    // verifies if last element is a pair
    if (!lastEl.hasOwnProperty("element") || lastEl.element.type !== "pair") {
      endOfExecution = false;
    } else {
      // verifies if last element contains a list of operation and the storage
      if (
        lastEl.element.param.length === 2 &&
        lastEl.element.param[0] === "list" &&
        lastEl.element.elements[0].value === "operation" &&
        lastEl.element.param[1] === initStorageType
      ) {
        // verifies if the stack is made of a single pair
        if (
          lastEl.stackState.length === 1 &&
          lastEl.stackState[0].type === "pair" &&
          lastEl.stackState[0].elements[0].type === "list" &&
          lastEl.stackState[0].elements[0].value === "operation" &&
          lastEl.stackState[0].elements[1].type === initStorageType
        ) {
          endOfExecution = true;
        } else {
          endOfExecution = false;
        }
      } else {
        endOfExecution = false;
      }
    }
  }

  return { result: resultStack, endOfExecution };
};
