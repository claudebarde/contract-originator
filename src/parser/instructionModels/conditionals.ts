import errorMsg from "../errors";
import parser from "../parser";
import { ErrorMsg, SuccessMsg, StackElement } from "../interfaces";

const conditionals = async ({
  instruction,
  condition,
  details,
  ifTrue,
  ifFalse,
  stack
}): Promise<(ErrorMsg | SuccessMsg)[]> => {
  // PUSH (option int) (None)
  // IF_NONE {PUSH int 6; PUSH int 7 ; ADD} { PUSH string "Sorry!" ; FAILWITH }

  if (condition === "IF") {
    // IF condition
    if (details === "SOME" || details === "NONE") {
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
        return [errorMsg("WRONG_TYPE", ["option", stack[0].type])];
      }
    } else {
      return [errorMsg("UNKNOWN_ERROR", null)];
    }
  } else if (condition === "ASSERT") {
    // ASSERT condition
  } else {
    return [errorMsg("UNKNOWN_ERROR", null)];
  }
};

export default conditionals;
