import { StackElement, ErrorMsg, SuccessMsg } from "../interfaces";
import errorMsg from "../errors";
import { numericValues, comparableTypes } from "../constants";
import arithmetic from "../arithmetic";

// for COMPARE instruction
const compare = (x: number | string, y: number | string): string => {
  if (x < y) return "-1";

  if (x === y) return "0";

  if (x > y) return "1";
};

const instructions = {
  ABS: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack[pos].type === "int") {
      return {
        result: "success",
        instruction: "ABS",
        args: 0,
        element: {
          type: "nat",
          value: Math.abs(parseInt(stack[pos].value)).toString(),
          instruction: "ABS"
        }
      };
    } else {
      return errorMsg("WRONG_TYPE", ["int", stack[pos].type], "ABS");
    }
  },
  ARITHM: (stack: StackElement[], pos = 0, val): SuccessMsg | ErrorMsg => {
    // verifies that the two elements on top of the stack are numeric values
    if (
      numericValues.includes(stack[pos].type) &&
      numericValues.includes(stack[pos + 1].type)
    ) {
      // makes calculations
      return arithmetic[val](stack[pos], stack[pos + 1]);
    } else {
      return errorMsg(
        "VALUE_MUST_BE_NUMBER",
        numericValues.includes(stack[pos].type)
          ? stack[pos + 1].type
          : stack[pos].type,
        val
      );
    }
  },
  BALANCE: (): SuccessMsg => {
    return {
      result: "success",
      instruction: "BALANCE",
      args: 0,
      element: {
        type: "mutez",
        value: (
          Math.floor(Math.random() * (100000000 - 1000000 + 1)) + 1000000
        ).toString(),
        instruction: "BALANCE"
      }
    };
  },
  CAR: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    // checks if pair is on top of the stack
    if (stack[pos].type === "pair") {
      // creates the new element to add to the stack
      return {
        result: "success",
        instruction: "CAR",
        args: 0,
        element: {
          type: stack[pos].elements[0].type,
          value: stack[pos].elements[0].value,
          instruction: "CAR"
        }
      };
    } else {
      return errorMsg("WRONG_TYPE", ["pair", stack[pos + 1].type], "CAR");
    }
  },
  CDR: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    // checks if pair is on top of the stack
    if (stack[pos].type === "pair") {
      // creates the new element to add to the stack
      return {
        result: "success",
        instruction: "CDR",
        args: 0,
        element: {
          type: stack[pos].elements[1].type,
          value: stack[pos].elements[1].value,
          instruction: "CDR"
        }
      };
    } else {
      return errorMsg("WRONG_TYPE", ["pair", stack[pos + 1].type], "CDR");
    }
  },
  CONS: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    // there must be a list at position 2
    if (stack[pos + 1].type === "list") {
      // element above list must be of correct type
      if (stack[pos].type === stack[pos + 1].param[0]) {
        return {
          result: "success",
          instruction: "CONS",
          args: 0,
          // returns the updated list
          element: {
            ...stack[pos + 1],
            elements: [stack[pos], ...stack[pos + 1].elements]
          }
        };
      } else {
        return errorMsg(
          "WRONG_TYPE",
          [stack[pos + 1].param[0], stack[pos].type],
          "CONS"
        );
      }
    } else {
      return errorMsg("NO_LIST", stack[pos + 1].type, "CONS");
    }
  },
  COMPARE: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    // must have 1 pair or 2 non-pair elements in the stack
    if (stack[pos].type === "pair" || stack.length >= 2) {
      // extract values in pair if present
      let el1 = undefined;
      let el2 = undefined;
      if (stack[pos].type === "pair") {
        el1 = {
          value: stack[pos].elements[0].value,
          type: stack[pos].param[0]
        };
        el2 = {
          value: stack[pos].elements[1].value,
          type: stack[pos].param[1]
        };
      } else {
        el1 = { value: stack[pos].value, type: stack[pos].type };
        el2 = { value: stack[pos + 1].value, type: stack[pos + 1].type };
      }
      // COMPARE only works with int, nat, string, pair, timestamp, mutez, bytes, key_hash
      if (
        comparableTypes.includes(el1.type) &&
        comparableTypes.includes(el2.type)
      ) {
        // if types are comparable
        // INT & NAT
        if (
          (el1.type === "int" && el2.type === "int") ||
          (el1.type === "nat" && el2.type === "nat") ||
          (el1.type === "mutez" && el2.type === "mutez") ||
          (el1.type === "timestamp" && el2.type === "timestamp")
        ) {
          const x = parseInt(el1.value);
          const y = parseInt(el2.value);
          const result = compare(x, y);
          return {
            result: "success",
            instruction: "COMPARE",
            args: 0,
            element: {
              type: "int",
              instruction: "COMPARE",
              value: result
            }
          };
        }
        // STRINGS & BYTES & KEY_HASH
        else if (
          (el1.type === "string" && el2.type === "string") ||
          (el1.type === "bytes" && el2.type === "bytes") ||
          (el1.type === "key_hash" && el2.type === "key_hash")
        ) {
          const x = el1.value;
          const y = el2.value;
          const result = compare(x, y);
          return {
            result: "success",
            instruction: "COMPARE",
            args: 0,
            element: {
              type: "int",
              instruction: "COMPARE",
              value: result
            }
          };
        } else {
          return errorMsg(
            "INVALID_COMPARISON",
            [el1.type, el2.type],
            "COMPARE"
          );
        }
      } else {
        return errorMsg(
          "NOT_COMPARABLE_TYPES",
          [el1.type, el2.type],
          "COMPARE"
        );
      }
    } else {
      return errorMsg("STACK_NOT_DEEP_ENOUGH", [1, 2], "COMPARE");
    }
  },
  CONCAT: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack[pos].type === "string" && stack[pos + 1].type === "string") {
      const left: string = stack[pos].value;
      const right: string = stack[pos + 1].value;
      const result: string = left + right;

      return {
        result: "success",
        instruction: "CONCAT",
        args: 0,
        element: {
          type: "string",
          instruction: "CONCAT",
          value: result
        }
      };
    } else {
      return errorMsg(
        "WRONG_TYPE",
        ["string & string", `${stack[pos].type} & ${stack[pos + 1].type}`],
        "CONCAT"
      );
    }
  },
  DROP: (): SuccessMsg => {
    return {
      result: "success",
      instruction: "DROP",
      args: 0
    };
  },
  DUP: (stack: StackElement[], pos = 0): SuccessMsg => {
    return {
      result: "success",
      instruction: "DUP",
      args: 0,
      element: { ...stack[pos] }
    };
  },
  EQ: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack[pos].type === "int") {
      return {
        result: "success",
        instruction: "EQ",
        args: 0,
        element: {
          type: "bool",
          value: parseInt(stack[pos].value) === 0 ? "true" : "false",
          instruction: "EQ"
        }
      };
    } else {
      return errorMsg("WRONG_TYPE", ["int", stack[pos].type], "EQ");
    }
  },
  FAILWITH: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack.length > 0) {
      return {
        result: "success",
        instruction: "FAILWITH",
        args: 0,
        element: {
          type: "failwith",
          value: "FAILWITH",
          instruction: "FAILWITH"
        }
      };
    } else {
      return errorMsg("STACK_NOT_DEEP_ENOUGH", [0, 1], "FAILWITH");
    }
  },
  GE: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack[pos].type === "int") {
      return {
        result: "success",
        instruction: "GT",
        args: 0,
        element: {
          type: "bool",
          value: parseInt(stack[pos].value) >= 0 ? "true" : "false",
          instruction: "GT"
        }
      };
    } else {
      return errorMsg("WRONG_TYPE", ["int", stack[pos].type], "GE");
    }
  },
  GT: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack[pos].type === "int") {
      return {
        result: "success",
        instruction: "GT",
        args: 0,
        element: {
          type: "bool",
          value: parseInt(stack[pos].value) > 0 ? "true" : "false",
          instruction: "GT"
        }
      };
    } else {
      return errorMsg("WRONG_TYPE", ["int", stack[pos].type], "GT");
    }
  },
  IF: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    return errorMsg("UNKNOWN_ERROR", "IF", "IF");
  },
  INT: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack[pos].type === "nat") {
      return {
        result: "success",
        instruction: "INT",
        args: 0,
        element: {
          type: "int",
          value: stack[pos].value,
          instruction: "INT"
        }
      };
    } else {
      return errorMsg("WRONG_TYPE", ["nat", stack[pos].type], "INT");
    }
  },
  LE: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack[pos].type === "int") {
      return {
        result: "success",
        instruction: "LT",
        args: 0,
        element: {
          type: "bool",
          value: parseInt(stack[pos].value) <= 0 ? "true" : "false",
          instruction: "LT"
        }
      };
    } else {
      return errorMsg("WRONG_TYPE", ["int", stack[pos].type], "LE");
    }
  },
  LT: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack[pos].type === "int") {
      return {
        result: "success",
        instruction: "LT",
        args: 0,
        element: {
          type: "bool",
          value: parseInt(stack[pos].value) < 0 ? "true" : "false",
          instruction: "LT"
        }
      };
    } else {
      return errorMsg("WRONG_TYPE", ["int", stack[pos].type], "LT");
    }
  },
  NEQ: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack[pos].type === "int") {
      return {
        result: "success",
        instruction: "NEQ",
        args: 0,
        element: {
          type: "bool",
          value: parseInt(stack[pos].value) !== 0 ? "true" : "false",
          instruction: "NEQ"
        }
      };
    } else {
      return errorMsg("WRONG_TYPE", ["int", stack[pos].type], "NEQ");
    }
  },
  NIL: (val): SuccessMsg => {
    return {
      result: "success",
      instruction: "NIL",
      args: 1,
      element: {
        type: "list",
        value: val,
        instruction: "NIL",
        elements: [],
        param: [val]
      }
    };
  },
  NOW: (): SuccessMsg => {
    return {
      result: "success",
      instruction: "NOW",
      args: 0,
      element: {
        type: "timestamp",
        value: Math.round(Date.now() / 1000).toString(),
        instruction: "NOW"
      }
    };
  },
  PAIR: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    if (stack.length >= 2) {
      const leftElement: StackElement = stack[pos];
      const rightElement: StackElement = stack[pos + 1];
      const pair: StackElement = {
        type: "pair",
        value: `(Pair ${leftElement.type} ${rightElement.type})`,
        instruction: "PAIR",
        elements: [leftElement, rightElement],
        param: [leftElement.type, rightElement.type]
      };
      return {
        result: "success",
        instruction: "PAIR",
        args: 0,
        element: pair
      };
    } else {
      return errorMsg("STACK_NOT_DEEP_ENOUGH", [stack.length, 2], "PAIR");
    }
  },
  PUSH: (data): SuccessMsg | ErrorMsg => {
    const { kind, type, value, param } = data;
    if (kind === "simple") {
      // FOR SIMPLE TYPES
      if (numericValues.includes(type) && isNaN(value)) {
        return errorMsg("VALUE_MUST_BE_NUMBER", value, "PUSH");
      } else if (
        type === "string" &&
        (value[0] !== `"` || value[value.length - 1] !== `"`)
      ) {
        return errorMsg("INCORRECT_STRING", null, "PUSH");
      } else if (type === "bool" && value !== "True" && value !== "False") {
        return errorMsg(
          "WRONG_ARG",
          ["boolean", isNaN(value) ? "string" : "number"],
          "PUSH"
        );
      } else {
        let _value = value;
        if (type === "string") {
          // removes double-quotes before storing the string
          _value = value.replace(/"/g, "");
        }

        return {
          result: "success",
          instruction: "PUSH",
          value: _value,
          args: 2,
          element: {
            type,
            value: _value,
            instruction: "PUSH"
          }
        };
      }
    } else if (kind === "complex") {
      // FOR COMPLEX TYPES
      // PUSH (option nat) (Some 3)
      // TYPE OPTION
      if (type === "option") {
        // the value is going to be "(Some value)" or "(None)"
        if (value === "(None)") {
          return {
            result: "success",
            instruction: "PUSH",
            value,
            args: 2,
            element: {
              type: "option",
              value,
              instruction: "PUSH",
              param: [param]
            }
          };
        } else if (value.match(/\(Some\s(.+)\)/)) {
          const _value = value.match(/\(Some\s(.+)\)/)[1];
          // checks if value is of the specified type
          if (isNaN(_value) && numericValues.includes(param)) {
            return errorMsg("WRONG_TYPE", [param, "string"], "PUSH");
          } else if (!isNaN(_value) && !numericValues.includes(param)) {
            return errorMsg("WRONG_TYPE", [param, "number"], "PUSH");
          } else {
            return {
              result: "success",
              instruction: "PUSH",
              value: _value,
              args: 2,
              element: {
                type: "option",
                value: _value,
                instruction: "PUSH",
                param: [param]
              }
            };
          }
        } else {
          return errorMsg("UNEXPECTED_ARG", value, "PUSH");
        }
      } else {
        return errorMsg("UNKNOWN_ERROR", null, "PUSH");
      }
    }
  },
  SENDER: (): SuccessMsg => {
    return {
      result: "success",
      instruction: "SENDER",
      args: 0,
      element: {
        type: "address",
        value: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        instruction: "SENDER"
      }
    };
  },
  SIZE: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    // SIZE only works with strings, lists, sets, maps, bytes
    if (["string", "list", "set", "map", "bytes"].includes(stack[pos].type)) {
      // calculates size
      let size;
      if (stack[pos].type === "string" || stack[pos].type === "bytes") {
        size = stack[pos].value.length;
      } else if (stack[pos].type === "list") {
        size = stack[pos].elements.length;
      }
      // TODO: ADD CODE FOR SET AND MAP
      return {
        result: "success",
        instruction: "SIZE",
        args: 0,
        element: {
          type: "nat",
          value: size,
          instruction: "SIZE"
        }
      };
    } else {
      return errorMsg("SIZE_ERROR", stack[pos].type, "SIZE");
    }
  },
  SOME: (stack: StackElement[], pos = 0): SuccessMsg | ErrorMsg => {
    return {
      result: "success",
      instruction: "SOME",
      args: 0,
      element: {
        type: "option",
        value: stack[pos].value,
        instruction: "SOME",
        param: [stack[pos].type]
      }
    };
  },
  SWAP: (): SuccessMsg => {
    return {
      result: "success",
      instruction: "SWAP",
      args: 0
    };
  },
  UNIT: (): SuccessMsg => {
    return {
      result: "success",
      instruction: "UNIT",
      args: 0,
      element: {
        type: "unit",
        value: "Unit",
        instruction: "UNIT"
      }
    };
  }
};

export default instructions;
