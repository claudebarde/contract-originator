<script>
  import { Parser } from "@taquito/michel-codec";
  import * as encoder from "@taquito/michelson-encoder";
  import { Tezos } from "@taquito/taquito";
  import ConnectWallet from "../Wallets/ConnectWallet.svelte";
  import SelectNetwork from "./SelectNetwork.svelte";
  import OriginateModal from "./OriginateModal.svelte";
  import store from "../../store";

  let rawMichelson = `
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
  let michelsonOutput = "";
  let originateModal = false;

  const encode = () => {
    try {
      const parser = new Parser();
      const parsedMichelson = JSON.stringify(parser.parseScript(rawMichelson));
      store.updateEncodedMichelson(parsedMichelson);
      michelsonOutput = parsedMichelson;
      // generates storage structure
      const storage = parser
        .parseScript(rawMichelson)
        .find(el => el.prim === "storage").args[0];
      const schema = new encoder.Schema(storage);
      const storageStructure = schema.ExtractSchema();
      console.log(storageStructure);
      store.updateStorageStructure(storageStructure);
    } catch (error) {
      console.log(error);
    }
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
  <OriginateModal {Tezos} on:close={() => (originateModal = false)} />
{/if}
