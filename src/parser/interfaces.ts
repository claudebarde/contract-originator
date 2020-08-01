/*
 ** INTERFACES
 */

export interface StackElement {
  type: string;
  value: string;
  instruction: string;
  elements?: StackElement[]; // for types like list, map, etc., contains actual elements
  param?: string[]; // for types like list, map, etc., contains elements type
}

export interface InstructionSyntax {
  emptyStack: boolean;
  nbOfArgs: number;
  arguments: string[] | null;
  minStackDepth: number;
  consumeEl: number;
  argCanBe0?: boolean;
  argType?: string;
}

export interface GeneralSyntax {
  [key: string]: InstructionSyntax;
}

export interface ErrorMsg {
  result: "error";
  msg: string;
  id: string;
  value: string;
  instruction: string;
  stackState?: StackElement[];
}

export interface SuccessMsg {
  result: "success";
  instruction: string;
  args: number;
  value?: number; // for removing instruction, may be element position or amount of elements
  element?: StackElement; // element to be added to the stack
  stackState?: StackElement[];
}

export interface ArithmeticFuncArg {
  left: StackElement;
  right: StackElement;
  type: string;
  result: string;
  element: StackElement;
}
