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
  import generateDefaultStorage from "../../utils/generateDefaultStorage.ts";
  import validateParamStorage from "../../utils/validateParamStorage.ts";
  import typechecker from "../../parser/index.ts";
  import { create as CodeMirror } from "../../codemirror";
  import NewMichelsonFileModal from "./Modals/NewMichelsonFileModal.svelte";

  /*let rawMichelson = `
storage (big_map :ledger address nat) ;
parameter (pair (address %to) (nat %tokens)) ;
code {
    ## Checks if amount is equal to zero
    AMOUNT ;
    PUSH mutez 0 ;
    IFCMPNEQ
        { PUSH string "NOAMOUNTALLOWED" ; FAILWITH }
        {} ;
    UNPPAIIR ;
    DUP ;
    SENDER ;
    IFCMPEQ
        { PUSH string "FORBIDDENTRANFER" ; FAILWITH }
        {} ;
    ## Checks if source is in the ledger
    DIG 2 ;
    DUP ;
    SENDER ;
    MEM ;
    IF
        {
            ## Checks if source has enough balance
            DUP ;
            SENDER ;
            GET ;
            IF_NONE
                { PUSH string "ERROR" ; FAILWITH }
                {
                    DUP ;
                    DIP 4 { DUP } ;
                    DIG 4 ;
                    IFCMPGT { PUSH string "INSUFFICIENTBALANCE" ; FAILWITH } {} ;
                } ;
            ## Updates sender's balance
            DIP 3 { DUP } ;
            DIG 3 ;
            SWAP ;
            SUB ;
            ABS ;
            SOME ;
            SENDER ;
            UPDATE ;
            ## Updates recipient's balance
            DIP { DUP } ;
            SWAP ;
            DIP { DUP } ;
            MEM ;
            IF
                {
                    SWAP ;
                    DIP { DUP } ;
                    DUP ;
                    DIP { SWAP } ;
                    GET ;
                    IF_NONE
                        {
                            PUSH string "UNKNOWNBALANCE" ; FAILWITH ;
                        }
                        {
                            DIG 3 ;
                            ADD ;
                            SOME ;
                            SWAP ;
                            UPDATE ;
                        } ;
                }
                {
                    DUG 2 ;
                    DIP { SOME } ;
                    UPDATE ;
                } ;
            ## Ends execution
            NIL operation ;
            PAIR ;
        }
        { PUSH string "UNKNOWNSPENDER" ; FAILWITH } ;
}`;
  let rawMichelson = `parameter int ;
storage int ;
code {
    DUP ;
    CAR ;
    SWAP ;
    CDR ;
    ADD ;
    PUSH int 6;
    SWAP;
    SUB;
    NIL operation ;
    PAIR
}
`;*/
  let openTemplatesDropdown = false;
  let openActionsDropdown = false;
  let rawMichelson = "";
  let michelsonOutput = "";
  let originateModal = false;
  let michelsonAction = "typecheck"; // typecheck | encode
  let stackTraces = [];
  let initParameter = "";
  let initStorage = "";
  let liveCoding = true;
  let validationError = undefined;
  let michelsonFiles = [];
  let newMichelsonFile = false;

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
      generateDefaultStorage(storageStructure);
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
      stackTraces = [
        ...(await typechecker(rawMichelson, initParameter, initStorage))
      ];
    } else {
      stackTraces = [];
      validationError = validation.error;
    }
  };

  const loadCode = async address => {
    const response = await fetch(address);
    const code = await response.json();
    $store.editor.setValue(code);
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
    editor.on("change", event => {
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
      if (liveCoding) {
        typecheck();
      }
    });

    store.updateEditor(editor);

    // checks for files in local storage
    if (window.localStorage) {
      const filesList = JSON.parse(
        window.localStorage.getItem("michelson-files")
      );
      if (filesList && Object.keys(fileList).length > 0) {
        Object.keys(fileList).forEach(file => {
          michelsonFiles = [...michelsonFiles, file];
        });
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

  .files-list {
    list-style-position: inside;
  }
  .files-list li {
    display: inline-block;
    background-color: white;
    padding: 5px 10px;
    border: solid 1px #a0aec0;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    font-size: 0.8rem;
    cursor: pointer;
  }
  .active-file {
    font-style: italic;
    background-color: #edf2f7 !important;
  }

  .menu-bar {
    width: 100%;
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
  <div class="menu-bar has-background-light">
    <div class="dropdown" class:is-active={openTemplatesDropdown}>
      <div class="dropdown-trigger">
        <button
          class="button is-light"
          aria-haspopup="true"
          aria-controls="dropdown-templates"
          on:click={() => (openTemplatesDropdown = !openTemplatesDropdown)}>
          <span>Templates</span>
          <span class="icon is-small">
            {#if openTemplatesDropdown}
              <span class="icon is-small">
                <i class="fas fa-angle-up" aria-hidden="true" />
              </span>
            {:else}
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true" />
              </span>
            {/if}
          </span>
        </button>
      </div>
      <div
        class="dropdown-menu"
        id="dropdown-templates"
        role="menu"
        on:click={() => (openTemplatesDropdown = false)}>
        <div class="dropdown-content">
          <a href="#/" class="dropdown-item">Addition</a>
          <a href="#/" class="dropdown-item">Euclidian division</a>
          <a href="#/" class="dropdown-item">Strings concatenation</a>
          <hr class="dropdown-divider" />
          <a href="#/" class="dropdown-item">Lists</a>
          <a href="#/" class="dropdown-item">Maps</a>
          <hr class="dropdown-divider" />
          <a
            href="/"
            class="dropdown-item"
            target="_blank"
            on:click|preventDefault={() => loadCode('https://api.better-call.dev/v1/contract/mainnet/KT1TUx83WuwtA2Ku1pi6A9AZqov7CZfYtLUS/code')}>
            miniTez
          </a>
          <a
            href="#/"
            class="dropdown-item"
            target="_blank"
            on:click|preventDefault={() => loadCode('https://api.better-call.dev/v1/contract/carthagenet/KT1QaxSfGtgn86Lnhtu8PrkApQLiFt2SMEfr/code')}>
            Fa1.2 token
          </a>
        </div>
      </div>
    </div>
    <div class="dropdown" class:is-active={openActionsDropdown}>
      <div class="dropdown-trigger">
        <button
          class="button is-light"
          aria-haspopup="true"
          aria-controls="dropdown-actions"
          on:click={() => (openActionsDropdown = !openActionsDropdown)}>
          <span>Actions</span>
          {#if openActionsDropdown}
            <span class="icon is-small">
              <i class="fas fa-angle-up" aria-hidden="true" />
            </span>
          {:else}
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true" />
            </span>
          {/if}
        </button>
      </div>
      <div
        class="dropdown-menu"
        id="dropdown-actions"
        role="menu"
        on:click={() => (openActionsDropdown = false)}>
        <div class="dropdown-content">
          <a href="#/" class="dropdown-item">Typecheck</a>
          <a href="#/" class="dropdown-item">Encode</a>
        </div>
      </div>
    </div>
  </div>
  <div class="columns is-gapless michelson-columns">
    <div class="column is-half michelson-column">
      <textarea id="michelson-editor" bind:value={rawMichelson} />
      <div>
        <ul class="files-list">
          {#if $store.darkMode}
            <li
              class="is-size-7"
              on:click={() => {
                $store.editor.setOption('theme', 'eclipse');
                store.changeDarkMode(false);
              }}>
              <i class="far fa-sun" />
            </li>
          {:else}
            <li
              class="is-size-7"
              on:click={() => {
                $store.editor.setOption('theme', 'lucario');
                store.changeDarkMode(true);
              }}>
              <i class="far fa-moon" />
            </li>
          {/if}
          {#each michelsonFiles as file}
            <li class="is-size-7">
              <i class="far fa-file-code" />
              <span>{file.name}.tz</span>
            </li>
          {/each}
          <li class="is-size-7" on:click={() => (newMichelsonFile = true)}>
            <i class="far fa-plus-square" />
            <span>New</span>
          </li>
          <li class="is-size-7">
            <i class="far fa-folder-open" />
            <span>Open</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="column is-half michelson-column">
      {#if michelsonAction === 'typecheck'}
        <StackTraceAccordion
          {stackTraces}
          {initParameter}
          {initStorage}
          {liveCoding}
          {validationError}
          on:updateParameter={event => (initParameter = event.detail)}
          on:updateStorage={event => (initStorage = event.detail)}
          on:liveCoding={event => (liveCoding = event.detail)} />
      {:else if michelsonAction === 'encode'}
        <textarea id="michelson-output" bind:value={michelsonOutput} />
      {/if}
    </div>
  </div>
</div>
{#if originateModal}
  <OriginateModal {Tezos} on:close={() => (originateModal = false)} />
{/if}
{#if newMichelsonFile}
  <NewMichelsonFileModal on:close={() => (newMichelsonFile = false)} />
{/if}
