import { ErrorMsg } from "./interfaces";

export default (error: string, val: any, instruction: string): ErrorMsg => {
  switch (error) {
    case "NO_INSTRUCTION":
      return {
        result: "error",
        msg: `No instruction provided`,
        id: error,
        value: val,
        instruction
      };
    case "NOT_ENOUGH_ARGS":
      return {
        result: "error",
        msg: `Not enough arguments provided, expected ${val[0]}, got ${val[1]}`,
        id: error,
        value: val,
        instruction
      };
    case "INVALID_OPCODE":
      return {
        result: "error",
        msg: `The ${val} instruction does not exist`,
        id: error,
        value: val,
        instruction
      };
    case "UNAVAILABLE_OPCODE":
      return {
        result: "error",
        msg: `The ${val} instruction is not available yet`,
        id: error,
        value: val,
        instruction
      };
    case "EMPTY_STACK":
      return {
        result: "error",
        msg: `${val} doesn't work with an empty stack`,
        id: error,
        value: val,
        instruction
      };
    case "UNEXPECTED_ARG":
      return {
        result: "error",
        msg: `Unexpected argument: "${val}"`,
        id: error,
        value: val,
        instruction
      };
    case "WRONG_TYPE":
      return {
        result: "error",
        msg: `Wrong type, expected "${val[0]}", got "${val[1]}"`,
        id: error,
        value: val,
        instruction
      };
    case "WRONG_ARG":
      return {
        result: "error",
        msg: `Wrong argument, expected "${val[0]}", got "${val[1]}"`,
        id: error,
        value: val,
        instruction
      };
    case "UNKNOWN_TYPE":
      return {
        result: "error",
        msg: `Unknown type: "${val}"`,
        id: error,
        value: val,
        instruction
      };
    case "STACK_NOT_DEEP_ENOUGH":
      return {
        result: "error",
        msg: `Stack is not deep enough, expected ${val[1]} elements, only ${val[0]} element(s) present`,
        id: error,
        value: val,
        instruction
      };
    case "VALUE_MUST_BE_NUMBER":
      return {
        result: "error",
        msg: `Expected numeric value, got "${val}"`,
        id: error,
        value: val,
        instruction
      };
    case "INCORRECT_STRING":
      return {
        result: "error",
        msg: `Strings must be between double-quotes`,
        id: error,
        value: val,
        instruction
      };
    case "NO_LIST":
      return {
        result: "error",
        msg: `Expected list, got "${val}"`,
        id: error,
        value: val,
        instruction
      };
    case "SIZE_ERROR":
      return {
        result: "error",
        msg: `Expected "string", "list", "set", "map" or "bytes", got "${val}"`,
        id: error,
        value: val,
        instruction
      };
    case "UNKNOWN_ERROR":
      return {
        result: "error",
        msg: `An unknown error has occurred`,
        id: error,
        value: val,
        instruction
      };
    case "TWO_TIMESTAMPS_ADDITION":
      return {
        result: "error",
        msg: `Cannot add two timestamps`,
        id: error,
        value: val,
        instruction
      };
    case "MUTEZ_ADDITION":
      return {
        result: "error",
        msg: `Cannot add mutez with other types`,
        id: error,
        value: val,
        instruction
      };
    case "TIMESTAMP_INT_ADDITION":
      return {
        result: "error",
        msg: `Only int can be added to timestamp`,
        id: error,
        value: val,
        instruction
      };
    case "INT_TIMESTAMP_SUBTRACTION":
      return {
        result: "error",
        msg: `Only timestamp and int can be subtracted from timestamp`,
        id: error,
        value: val,
        instruction
      };
    case "MUTEZ_SUBTRACTION":
      return {
        result: "error",
        msg: `Only mutez can be subtracted from mutez`,
        id: error,
        value: val,
        instruction
      };
    case "RESULT_TYPE_ERROR":
      return {
        result: "error",
        msg: `Unable to infer result type`,
        id: error,
        value: val,
        instruction
      };
    case "INVALID_MULTIPLICATION":
      return {
        result: "error",
        msg: `These 2 types cannot be multiplied together: "${val[0]}" & "${val[1]}"`,
        id: error,
        value: val,
        instruction
      };
    case "INVALID_DIVISION":
      return {
        result: "error",
        msg: `These 2 types cannot be used together: "${val[0]}" & "${val[1]}"`,
        id: error,
        value: val,
        instruction
      };
    case "NOT_COMPARABLE_TYPES":
      return {
        result: "error",
        msg: `Expected comparable types, got "${val[0]}" & "${val[1]}"`,
        id: error,
        value: val,
        instruction
      };
    case "INVALID_COMPARISON":
      return {
        result: "error",
        msg: `"${val[0]}" & "${val[1]}" are not comparable together`,
        id: error,
        value: val,
        instruction
      };
  }
};
