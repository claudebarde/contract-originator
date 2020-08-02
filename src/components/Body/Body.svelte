<script>
  import { onMount } from "svelte";
  import { Parser } from "@taquito/michel-codec";
  import * as encoder from "@taquito/michelson-encoder";
  import { Tezos } from "@taquito/taquito";
  import ConnectWallet from "../Wallets/ConnectWallet.svelte";
  import SelectNetwork from "./SelectNetwork.svelte";
  import OriginateModal from "./Modals/OriginateModal.svelte";
  import StackTraceAccordion from "./StackTraceAccordion.svelte";
  import store from "../../store";
  import { storageFromSchema } from "../../utils/generateDefaultStorage.ts";
  import validateParamStorage from "../../utils/validateParamStorage.ts";
  import typechecker from "../../parser/index.ts";
  import { create as CodeMirror } from "../../codemirror";
  import MenuBar from "./MenuBar.svelte";
  import FileMenu from "./FilesMenu.svelte";

  let rawMichelson = "";
  let michelsonOutput = "";
  let originateModal = false;
  let michelsonAction = "typecheck"; // typecheck | encode
  let stackTraces = [];
  let initParameter = "";
  let initStorage = "";
  let validationError = undefined;
  let errorLineNumber = undefined;

  const encode = () => {
    michelsonAction = "encode";
    try {
      const parser = new Parser();
      const parsedMichelson = JSON.stringify(
        parser.parseScript(rawMichelson),
        null,
        2
      );
      store.updateEncodedMichelson(parsedMichelson);
      michelsonOutput = parsedMichelson;
      // generates storage structure
      const storage = parser
        .parseScript(rawMichelson)
        .find(el => el.prim === "storage").args[0];
      const schema = new encoder.Schema(storage);
      const storageStructure = schema.ExtractSchema();
      store.updateStorageStructure(storageStructure);
      storageFromSchema(storageStructure);
    } catch (error) {
      console.log(error);
    }
  };

  const typecheck = async () => {
    if (
      !rawMichelson.includes("parameter") ||
      !rawMichelson.includes("storage") ||
      !rawMichelson.includes("code")
    )
      return;
    // typecheck Michelson
    michelsonAction = "typecheck";
    const validation = validateParamStorage(
      rawMichelson,
      initParameter,
      initStorage
    );
    if (validation.result) {
      validationError = undefined;
      // builds lines of code into an array
      /*let linesOfCode = [];
      $store.editor.eachLine(
        $store.codeStart,
        $store.editor.lastLine() + 1,
        line => {
          if (line.text.trim() === "}") {
            return;
          } else if (
            line.text.trim()[line.text.trim().length - 1] === "}" &&
            $store.editor.getLineNumber(line) === $store.editor.lastLine()
          ) {
            linesOfCode.push(
              line.text
                .replace(";", "")
                .trim()
                .slice(0, -1)
                .trim()
            );
          } else {
            linesOfCode.push(line.text.replace(";", "").trim());
          }
        }
      );
      // rearranges array to put IF argument in the same field
      let indicesToRemove = [];
      linesOfCode = linesOfCode.map((instruction, index) => {
        if (["IF"].includes(instruction) && index + 3 <= linesOfCode.length) {
          indicesToRemove.push(index + 1);
          indicesToRemove.push(index + 2);
          return `${instruction} ${linesOfCode[index + 1]} ${
            linesOfCode[index + 2]
          }`;
        }

        if (indicesToRemove.includes(index)) {
          return;
        } else {
          return instruction;
        }
      });
      console.log(linesOfCode);*/
      const typechecking = await typechecker(
        rawMichelson,
        initParameter,
        initStorage
      );
      stackTraces = [...typechecking.result];
      store.updateEndOfExecution(typechecking.endOfExecution);
    } else {
      stackTraces = [];
      validationError = validation.error;
    }
  };

  const highlightError = editor => {
    // removes current highlighted lines
    if (errorLineNumber) {
      editor.removeLineClass(errorLineNumber, "background", "error-line");
    }
    // highlights error
    errorLineNumber =
      parseInt($store.codeStart) + parseInt(stackTraces.length) - 1;
    // gets line content
    const errorLine = editor.getLine(errorLineNumber).trim();
    const errorString = stackTraces.filter(el => el.result === "error")[0]
      .instruction;
    const errorRegex = new RegExp(`\\b${errorString}\\b`);

    if (errorRegex.test(errorLine)) {
      editor.addLineClass(errorLineNumber, "background", "error-line");
    }
  };

  onMount(() => {
    // init code mirror
    const editor = CodeMirror().fromTextArea(
      document.getElementById("michelson-editor"),
      {
        lineNumbers: true,
        autoCloseBrackets: true,
        theme: "eclipse"
        //styleActiveLine: true
      }
    );
    editor.setSize("100%", "100%");
    /*editor.markText(
      { line: 0, ch: 0 },
      { line: 0, ch: editor.getLine(0).length },
      { css: "background-color: #fe3" }
    );*/
    editor.on("change", async event => {
      rawMichelson = editor.getValue();
      // finds line number where Michelson code starts
      let found = false;
      editor.eachLine(line => {
        const text = line.text.trim();
        if (
          text[text.length - 1] === ";" &&
          !text.includes("parameter") &&
          !text.includes("storage") &&
          !text.includes("code") &&
          !found
        ) {
          found = true;
          store.updateCodeStart(editor.getLineNumber(line));
        }
      });
      // typecheck code
      if ($store.liveCoding) {
        await typecheck();
      }
      // saves code in open file
      if ($store.activeFile) {
        // saves code in store
        const michelsonFiles = $store.michelsonFiles.map(file => {
          if (file.name === $store.activeFile) {
            return { ...file, code: rawMichelson };
          } else {
            return file;
          }
        });
        store.updateMichelsonFiles(michelsonFiles);
        // saves code in localStorage
        if (window.localStorage) {
          const filesList = JSON.parse(
            window.localStorage.getItem("michelson-files")
          );
          filesList[$store.activeFile] = rawMichelson;
          window.localStorage.setItem(
            "michelson-files",
            JSON.stringify(filesList)
          );
        }
      }
      // change background of line with error
      if (
        stackTraces.length > 0 &&
        stackTraces.filter(trace => trace.result === "error").length > 0
      ) {
        highlightError(editor);
      } else if (errorLineNumber) {
        // removes current highlighted lines
        editor.removeLineClass(errorLineNumber, "background", "error-line");
        /*editor.eachLine(line => {
          editor.removeLineClass(line, "background", "error-line");
        });*/
      }
    });

    store.updateEditor(editor);

    // checks for files in local storage
    if (window.localStorage) {
      const filesList = JSON.parse(
        window.localStorage.getItem("michelson-files")
      );

      if (filesList && Object.keys(filesList).length > 0) {
        let michelsonFiles = [];
        Object.keys(filesList).forEach(file => {
          michelsonFiles = [
            ...michelsonFiles,
            { name: file, code: filesList[file], open: false, active: false }
          ];
        });
        store.updateMichelsonFiles(michelsonFiles);
      }
    }
  });
</script>

<style>
  .hero-body {
    flex-direction: column;
  }

  .michelson-columns {
    height: 70vh;
    width: 100%;
  }

  .michelson-column {
    height: 100%;
  }

  #michelson-output {
    height: 100%;
    width: 100%;
  }

  textarea {
    padding: 10px;
    border: solid 1px lightgrey;
    border-radius: 5px;
  }
</style>

<div class="hero-body">
  <!-- <div class="columns">
      <div class="column is-full">
        <div class="buttons is-centered">
          <button class="button is-light" on:click={typecheck}>
            Typecheck
          </button>
          <button class="button is-link" on:click={encode}>Encode</button>
          <SelectNetwork {Tezos} />
          {#if $store.network && $store.userAddress}
            <button class="button is-primary">Connected!</button>
          {:else}
            <ConnectWallet {Tezos} />
          {/if}
          <button
            class="button is-warning"
            on:click={() => (originateModal = !originateModal)}
            disabled={!$store.network || !$store.userAddress || !$store.encodedMichelson}>
            Originate
          </button>
        </div>
      </div>
    </div> -->
  <MenuBar on:typecheck={typecheck} />
  <div class="columns is-gapless michelson-columns">
    <div class="column is-half michelson-column">
      <textarea id="michelson-editor" bind:value={rawMichelson} />
      <FileMenu />
    </div>
    <div class="column is-half michelson-column">
      {#if michelsonAction === 'typecheck'}
        <StackTraceAccordion
          {stackTraces}
          {initParameter}
          {initStorage}
          {validationError}
          on:updateParameter={event => (initParameter = event.detail)}
          on:updateStorage={event => (initStorage = event.detail)} />
      {:else if michelsonAction === 'encode'}
        <textarea id="michelson-output" bind:value={michelsonOutput} />
      {/if}
    </div>
  </div>
</div>
{#if originateModal}
  <OriginateModal {Tezos} on:close={() => (originateModal = false)} />
{/if}
