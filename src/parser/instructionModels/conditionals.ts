import errorMsg from "../errors";
import parser from "../parser";
import { ErrorMsg, SuccessMsg, StackElement } from "../interfaces";
import { splitInstructions, updateStack } from "../../utils/utils";

interface parameter {
  instruction: string;
  condition: string;
  details: string | null;
  ifTrue: string;
  ifFalse: string;
  stack: StackElement[];
}

const conditionals = async ({
  instruction,
  condition,
  details,
  ifTrue,
  ifFalse,
  stack
}: parameter): Promise<(ErrorMsg | SuccessMsg)[]> => {
  // PUSH (option int) (None)
  // IF_NONE {PUSH int 6; PUSH int 7 ; ADD} { PUSH string "Sorry!" ; FAILWITH }

  if (condition === "IF") {
    // IF condition
    if (details === null) {
      // simple IF condition
      // checks if there is an element of type bool on top of the stack
      const topOfStack: StackElement = stack[0];
      stack.shift();
      if (topOfStack.type === "bool") {
        // evaluates the condition
        let results: (ErrorMsg | SuccessMsg)[] = [
          {
            result: "success",
            instruction: "IF",
            args: 2,
            stackState: stack
          }
        ];
        if (topOfStack.value === "true") {
          // if TRUE
          const str =
            ifTrue.trim()[ifTrue.trim().length - 1] === ";"
              ? ifTrue
              : ifTrue + ";";
          splitInstructions(str).forEach(async instruction => {
            const result = await parser({ instruction, stack });
            // if an element is returned
            if (result[0].result === "success") {
              stack.push(result[0].element);
            }
            results.push(result[0]);
          });
        } else {
          // if FALSE
          const str =
            ifFalse.trim()[ifFalse.trim().length - 1] === ";"
              ? ifFalse
              : ifFalse + ";";
          const instructions = splitInstructions(str);
          for (let i = 0; i < instructions.length; i++) {
            const result = await parser({
              instruction: instructions[i],
              stack
            });
            // if an element is returned
            if (result[0].result === "success" && result[0].element) {
              //stack = [result[0].element, ...stack];
              stack = [...updateStack(stack, result[0])];
            }
            results.push(result[0]);
          }
        }
        return results;
      } else {
        return [errorMsg("WRONG_TYPE", ["bool", topOfStack.type], instruction)];
      }
    } else if (details === "SOME" || details === "NONE") {
      // optional value
      // checks if element on top of the stack is an optional
      if (stack[0].type === "option") {
        const tempStack: StackElement[] = [...stack];
        tempStack.shift();
        let elements = [];
        let innerInstructions: string[];

        if (details === "NONE") {
          if (stack[0].value === "(None)") {
            innerInstructions = ifTrue.trim().split(";");
          } else {
            innerInstructions = ifFalse.trim().split(";");
          }
        } else if (details === "SOME") {
          if (stack[0].value === "(None)") {
            innerInstructions = ifFalse.trim().split(";");
          } else {
            innerInstructions = ifTrue.trim().split(";");
          }
        }

        for (let instruction of innerInstructions) {
          const result: (ErrorMsg | SuccessMsg)[] = await parser({
            instruction,
            stack: tempStack
          });
          if (
            result.length === 1 &&
            result[0].result === "success" &&
            result[0].hasOwnProperty("element")
          ) {
            // adds element in temporary stack
            tempStack.push(result[0].element);
          } else {
            if (
              result.length === 1 &&
              result[0].result === "success" &&
              result[0].instruction === "DROP"
            ) {
              // removes element from temporary stack
              tempStack.shift();
            }
          }

          elements.push(result);
        }
        // adds an additional element to drop the option value
        const drop: SuccessMsg = {
          result: "success",
          instruction: "DROP",
          args: 0
        };

        return [drop, ...elements.flat()];
      } else {
        return [errorMsg("WRONG_TYPE", ["option", stack[0].type], instruction)];
      }
    } else {
      return [errorMsg("UNKNOWN_ERROR", null, instruction)];
    }
  } else if (condition === "ASSERT") {
    // ASSERT condition
  } else {
    return [errorMsg("UNKNOWN_ERROR", null, instruction)];
  }
};

export default conditionals;
