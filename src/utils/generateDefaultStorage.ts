interface Storage {
  [property: string]: any;
}

const simpleTypes: string[] = [
  "address",
  "bool",
  "nat",
  "int",
  "string",
  "timestamp"
];
let defaultStorage: Storage = {};

export const storageFromSchema = (schema: Storage) => {
  console.log(schema);
  const schemaKeys: string[] = Object.keys(schema);
  if (schemaKeys.length === 1 && schemaKeys[0] === "map") {
    // storage is a map
    console.log("is map");
  } else if (
    schemaKeys.length === 1 &&
    schemaKeys.filter(key => !simpleTypes.includes(key)).length === 0
  ) {
    // storage is a big map
    console.log("is big map");
  } else {
    // complex storage
    console.log("is complex");
  }
};
