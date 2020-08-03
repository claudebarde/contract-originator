export default (code: string): string => {
  return code.replace(/UNPAIR/g, "DUP ; CDR ; SWAP ; CAR");
};
