<script>
  import { Parser } from "@taquito/michel-codec";
  import { Schema } from "@taquito/michelson-encoder";
  import ConnectWallet from "../Wallets/ConnectWallet.svelte";
  import SelectNetwork from "./SelectNetwork.svelte";
  import OriginateModal from "./OriginateModal.svelte";
  import store from "../../store";

  let rawMichelson = `
storage (set string) ;
parameter (map string string) ;
code {
    CAR ;
    EMPTY_SET string ;
    SWAP ;
    ITER { CAR ; PUSH bool True ; SWAP ; UPDATE } ;
    NIL operation ;
    PAIR ;
}`;
  let michelsonOutput = "";
  let originateModal = false;

  const encode = () => {
    const parser = new Parser();
    const parsedMichelson = JSON.stringify(parser.parseScript(rawMichelson));
    store.updateEncodedMichelson(parsedMichelson);
    michelsonOutput = parsedMichelson;

    const schema = new Schema(parser.parseScript(rawMichelson)[0]);
    console.log(contractToken);
  };
</script>

<style>
  .container {
    height: 80vh !important;
  }

  .michelson-column {
    height: 100%;
  }

  #michelson-editor,
  #michelson-output {
    height: 80%;
    width: 100%;
  }

  textarea {
    padding: 10px;
    border: solid 1px lightgrey;
    border-radius: 5px;
  }
</style>

<div class="hero-body">
  <div class="container">
    <div class="columns">
      <div class="column is-full">
        <div class="buttons is-centered">
          <button class="button is-link" on:click={encode}>Encode</button>
          <SelectNetwork />
          {#if $store.network && $store.userAddress}
            <button class="button is-primary">Connected!</button>
          {:else}
            <ConnectWallet />
          {/if}
          <button
            class="button is-warning"
            on:click={() => (originateModal = !originateModal)}
            disabled={!$store.network || !$store.userAddress || !$store.encodedMichelson}>
            Originate
          </button>
        </div>
      </div>
    </div>
    <div class="columns michelson-column">
      <div class="column is-half michelson-column">
        <h2 class="title is-5">Michelson Editor</h2>
        <textarea id="michelson-editor" bind:value={rawMichelson} />
      </div>
      <div class="column is-half michelson-column">
        <h2 class="title is-5">Michelson Output</h2>
        <textarea id="michelson-output" bind:value={michelsonOutput} />
      </div>
    </div>
  </div>
</div>
{#if originateModal}
  <OriginateModal on:close={() => (originateModal = false)} />
{/if}
