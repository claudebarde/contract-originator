import parser from "./parser";
import { SuccessMsg, ErrorMsg, StackElement } from "./interfaces";
import { instructionSyntax } from "./constants";

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
  let matchMichelsonCode = michelson
    .trim()
    .replace(/##.*/g, "")
    .replace(/\r?\n|\r/g, "")
    .replace(/\s+/g, " ")
    .match(/storage(.*);parameter(.*);code\s*\{(.*)\}/);
  // if no match
  if (!matchMichelsonCode) {
    // checks if storage and parameter are not reversed
    matchMichelsonCode = michelson
      .replace(/\r?\n|\r/g, "")
      .replace(/\s+/g, " ")
      .match(/parameter(.*);storage(.*);code\s*\{(.*)\}/);

    if (!matchMichelsonCode)
      return {
        result: [
          {
            result: "error",
            msg: "Invalid Michelson contract",
            id: "0",
            value: "ERROR",
            instruction: "NULL"
          }
        ],
        endOfExecution: false
      };
  }

  let storage: string;
  let parameter: string;
  let code: string;
  if (matchMichelsonCode[0].slice(0, 7) === "storage") {
    storage = matchMichelsonCode[1].trim();
    parameter = matchMichelsonCode[2].trim();
    code = matchMichelsonCode[3];
  } else {
    parameter = matchMichelsonCode[1].trim();
    storage = matchMichelsonCode[2].trim();
    code = matchMichelsonCode[3];
  }

  let resultStack: (SuccessMsg | ErrorMsg)[] = [];
  // separates instructions
  const instructions: string[] = code
    .trim()
    .split(";")
    .filter(el => el)
    .map(instr => instr.trim());
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

    if (parsedInstr[0].result === "error") {
      resultStack.push({ ...parsedInstr[0], stackState: stack });
      break;
    } else {
      // checks if element(s) must be removed from the stack
      const elsToConsume: number =
        instructionSyntax[parsedInstr[0].instruction].consumeEl;
      for (let j = 0; j < elsToConsume; j++) {
        // removes elements
        stack.shift();
      }
      // if instruction adds element to the stack
      if (parsedInstr[0].element) {
        stack = [parsedInstr[0].element, ...stack];
      } else {
        // if instruction manipulates the stack
        if (parsedInstr[0].instruction === "SWAP") {
          const el1 = stack[0];
          const el2 = stack[1];
          // pops first 2 elements of stack
          stack.shift();
          stack.shift();
          // switches elements and inserts them back in the stack
          stack = [el2, el1, ...stack];
        }
      }
      // pushes result
      resultStack.push({ ...parsedInstr[0], stackState: [...stack] });
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
