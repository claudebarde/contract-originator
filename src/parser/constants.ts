import { ErrorMsg, GeneralSyntax } from "./interfaces";

/*
 ** CONSTANTS
 */

export const numericValues: string[] = ["int", "nat", "mutez", "timestamp"];

export const comparableTypes: string[] = [
  "int",
  "nat",
  "string",
  "pair",
  "timestamp",
  "mutez",
  "bytes",
  "key_hash"
];

export const simpleTypes: string[] = [
  "key",
  "unit",
  "signature",
  "operation",
  "contract",
  "or",
  "lambda",
  "chain_id",
  "int",
  "nat",
  "string",
  "bytes",
  "mutez",
  "bool",
  "key_hash",
  "timestamp",
  "address"
];

export const complexTypes: string[] = [
  "list",
  "set",
  "map",
  "big_map",
  "pair",
  "option"
];

export const existingInstructions: string[] = [
  "DROP",
  "DUP",
  "SWAP",
  "DIG",
  "DUG",
  "PUSH",
  "SOME",
  "NONE",
  "UNIT",
  "IF_NONE",
  "PAIR",
  "CAR",
  "CDR",
  "LEFT",
  "RIGHT",
  "IF_LEFT",
  "NIL",
  "CONS",
  "IF_CONS",
  "SIZE",
  "EMPTY_SET",
  "EMPTY_MAP",
  "EMPTY_BIG_MAP",
  "MAP",
  "ITER",
  "MEM",
  "GET",
  "UPDATE",
  "IF",
  "LOOP",
  "LOOP_LEFT",
  "LAMBDA",
  "EXEC",
  "DIP",
  "FAILWITH",
  "CAST",
  "RENAME",
  "CONCAT",
  "SLICE",
  "PACK",
  "UNPACK",
  "ADD",
  "SUB",
  "MUL",
  "EDIV",
  "ABS",
  "ISNAT",
  "INT",
  "NEG",
  "LSL",
  "LSR",
  "OR",
  "AND",
  "XOR",
  "NOT",
  "COMPARE",
  "EQ",
  "NEQ",
  "LT",
  "GT",
  "LE",
  "GE",
  "SELF",
  "CONTRACT",
  "TRANSFER_TOKENS",
  "SET_DELEGATE",
  "CREATE_ACCOUNT",
  "CREATE_CONTRACT",
  "IMPLICIT_ACCOUNT",
  "NOW",
  "AMOUNT",
  "BALANCE",
  "CHECK_SIGNATURE",
  "BLAKE2B",
  "SHA256",
  "SHA512",
  "HASH_KEY",
  "STEPS_TO_QUOTA",
  "SOURCE",
  "SENDER",
  "ADDRESS",
  "CHAIN_ID"
];

export const instructionSyntax: GeneralSyntax = {
  ABS: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 1
  },
  ADD: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 2,
    consumeEl: 2
  },
  BALANCE: {
    emptyStack: true,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 0,
    consumeEl: 0
  },
  CAR: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 1
  },
  CONS: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 2,
    consumeEl: 2
  },
  CDR: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 1
  },
  COMPARE: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 2
  },
  CONCAT: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 2,
    consumeEl: 2
  },
  DROP: {
    emptyStack: false,
    nbOfArgs: 1,
    argType: "number",
    argCanBe0: true,
    arguments: ["number"],
    minStackDepth: 1,
    consumeEl: 1
  },
  DUP: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 0
  },
  EDIV: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 2,
    consumeEl: 2
  },
  EQ: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 2
  },
  FAILWITH: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 0
  },
  GE: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 2
  },
  GT: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 2
  },
  INT: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 1
  },
  LE: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 2
  },
  LT: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 2
  },
  MUL: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 2,
    consumeEl: 2
  },
  NEQ: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 2
  },
  NIL: {
    emptyStack: true,
    nbOfArgs: 1,
    argType: "string",
    argCanBe0: false,
    arguments: ["type"],
    minStackDepth: 0,
    consumeEl: 0
  },
  NOW: {
    emptyStack: true,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 0,
    consumeEl: 0
  },
  PAIR: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 2,
    consumeEl: 2
  },
  PUSH: {
    emptyStack: true,
    nbOfArgs: 2,
    argCanBe0: false,
    arguments: ["type", "value"],
    minStackDepth: 0,
    consumeEl: 0
  },
  SENDER: {
    emptyStack: true,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 0,
    consumeEl: 0
  },
  SIZE: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 1
  },
  SOME: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 1,
    consumeEl: 1
  },
  SUB: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 2,
    consumeEl: 2
  },
  SWAP: {
    emptyStack: false,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 2,
    consumeEl: 0
  },
  UNIT: {
    emptyStack: true,
    nbOfArgs: 0,
    arguments: null,
    minStackDepth: 0,
    consumeEl: 0
  }
};
