import { StackElement, ErrorMsg, SuccessMsg } from "./interfaces";
import errorMsg from "./errors";

const arithmetic = {
  ADD: (term1: StackElement, term2: StackElement): ErrorMsg | SuccessMsg => {
    // returns error if the two elements are timestamps
    if (term1.type === "timestamp" && term2.type === "timestamp") {
      return errorMsg("TWO_TIMESTAMPS_ADDITION", null);
    }
    // returns error if adding mutez with other type
    if (
      (term1.type === "mutez" && term2.type !== "mutez") ||
      (term1.type !== "mutez" && term2.type === "mutez")
    ) {
      return errorMsg("MUTEZ_ADDITION", null);
    }
    // returns error if trying to add other than int to timestamp
    if (
      (term1.type === "timestamp" && term2.type !== "int") ||
      (term1.type !== "int" && term2.type === "timestamp")
    ) {
      return errorMsg("TIMESTAMP_INT_ADDITION", null);
    }
    // calculates result
    const firstVal = parseInt(term1.value);
    const secondVal = parseInt(term2.value);
    const result = firstVal + secondVal;
    // finds result type
    let resultType;
    const firstType = term1.type;
    const secondType = term2.type;
    if (firstType === secondType) {
      // same type
      resultType = firstType;
    } else if (
      (firstType === "timestamp" && secondType === "int") ||
      (firstType === "int" && secondType === "timestamp")
    ) {
      resultType = "timestamp";
    } else if (
      (firstType === "nat" && secondType === "int") ||
      (firstType === "int" && secondType === "nat")
    ) {
      resultType = "int";
    }

    return {
      result: "success",
      instruction: "ADD",
      args: 0,
      element: {
        type: resultType,
        value: result.toString(),
        instruction: "ADD"
      }
    };
  },
  SUB: (left: StackElement, right: StackElement): ErrorMsg | SuccessMsg => {
    // returns error if trying to subtract other than int or timestamp to timestamp
    if (
      left.type === "timestamp" &&
      right.type !== "int" &&
      right.type !== "timestamp"
    ) {
      return errorMsg("INT_TIMESTAMP_SUBTRACTION", null);
    }
    // returns error if subtracting other types from mutez
    if (
      (left.type === "mutez" && right.type !== "mutez") ||
      (left.type !== "mutez" && right.type === "mutez")
    ) {
      return errorMsg("MUTEZ_SUBTRACTION", null);
    }
    // finds result type
    let resultType;
    if (
      (left.type === "int" || left.type === "nat") &&
      (right.type === "int" || right.type === "nat")
    ) {
      resultType = "int";
    } else if (left.type === "timestamp" && right.type === "timestamp") {
      resultType = "int";
    } else if (left.type === "timestamp" && right.type === "int") {
      resultType = "int";
    } else if (left.type === "mutez" && right.type === "mutez") {
      resultType = "mutez";
    } else {
      return errorMsg("RESULT_TYPE_ERROR", null);
    }
    // calculates difference
    const difference = parseInt(left.value) - parseInt(right.value);

    return {
      result: "success",
      instruction: "SUB",
      args: 0,
      element: {
        type: resultType,
        value: difference.toString(),
        instruction: "SUB"
      }
    };
  },
  MUL: (left: StackElement, right: StackElement): ErrorMsg | SuccessMsg => {
    // multiplication is possible only with int <=> nat and nat <=> mutez
    if (
      (left.type === "int" || left.type === "nat") &&
      (right.type === "int" || right.type === "nat")
    ) {
      const result = (parseInt(left.value) * parseInt(right.value)).toString();

      return {
        result: "success",
        instruction: "MUL",
        args: 0,
        element: {
          type: "int",
          value: result,
          instruction: "MUL"
        }
      };
    } else if (
      (left.type === "mutez" || left.type === "nat") &&
      (right.type === "mutez" || right.type === "nat")
    ) {
      const result = (parseInt(left.value) * parseInt(right.value)).toString();

      return {
        result: "success",
        instruction: "MUL",
        args: 0,
        element: {
          type: "mutez",
          value: result,
          instruction: "MUL"
        }
      };
    } else {
      return errorMsg("INVALID_MULTIPLICATION", [left.type, right.type]);
    }
  },
  EDIV: (left: StackElement, right: StackElement): ErrorMsg | SuccessMsg => {
    // multiplication is possible only with int <=> nat and nat <=> mutez
    if (
      (left.type === "int" || left.type === "nat") &&
      (right.type === "int" || right.type === "nat")
    ) {
      // if multiplication by zero
      if (parseInt(left.value) === 0 || parseInt(right.value) === 0) {
        return {
          result: "success",
          instruction: "EDIV",
          args: 0,
          element: {
            type: "option",
            value: "(None)",
            instruction: "EDIV",
            param: ["int"]
          }
        };
      } else {
        const quotient = Math.floor(
          parseInt(left.value) / parseInt(right.value)
        ).toString();
        const remainder = (
          parseInt(left.value) % parseInt(right.value)
        ).toString();
        // builds element for the quotient
        const quotientEl: StackElement = {
          type: "int",
          value: quotient,
          instruction: "EDIV"
        };
        // builds element for the remainder
        const remainderEl: StackElement = {
          type: "nat",
          value: remainder,
          instruction: "EDIV"
        };
        // builds pair element for quotient and remainder
        const pair: StackElement = {
          type: "pair",
          value: "",
          instruction: "EDIV",
          elements: [quotientEl, remainderEl],
          param: ["int", "nat"]
        };
        const optional: StackElement = {
          type: "option",
          value: `(Pair int ${quotient} nat ${remainder})`,
          instruction: "EDIV",
          elements: [pair],
          param: ["pair"]
        };
        return {
          result: "success",
          instruction: "EDIV",
          args: 0,
          element: optional
        };
      }
    } else if (
      (left.type === "mutez" || left.type === "nat") &&
      (right.type === "mutez" || right.type === "nat")
    ) {
      // if multiplication by zero
      if (parseInt(left.value) === 0 || parseInt(right.value) === 0) {
        return {
          result: "success",
          instruction: "EDIV",
          args: 0,
          element: {
            type: "option",
            value: "(None)",
            instruction: "EDIV"
          }
        };
      } else {
        const quotient = Math.floor(
          parseInt(left.value) / parseInt(right.value)
        ).toString();
        const remainder = (
          parseInt(left.value) % parseInt(right.value)
        ).toString();
        // builds element for the quotient
        const quotientEl: StackElement = {
          type: "mutez",
          value: quotient,
          instruction: "EDIV"
        };
        // builds element for the remainder
        const remainderEl: StackElement = {
          type: "mutez",
          value: remainder,
          instruction: "EDIV"
        };
        // builds pair element for quotient and remainder
        const pair: StackElement = {
          type: "pair",
          value: "",
          instruction: "EDIV",
          elements: [quotientEl, remainderEl],
          param: ["mutez", "mutez"]
        };
        return {
          result: "success",
          instruction: "EDIV",
          args: 0,
          element: {
            type: "(option (pair mutez mutez))",
            value: `(Some (Pair ${quotient} ${remainder}))`,
            instruction: "EDIV",
            elements: [pair],
            param: ["pair"]
          }
        };
      }
    } else {
      return errorMsg("INVALID_DIVISION", [left.type, right.type]);
    }
  }
};

export default arithmetic;
