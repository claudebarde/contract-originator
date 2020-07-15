<script>
  import { MichelsonMap } from "@taquito/taquito";
  import { fly, fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import store from "../../store.js";

  export let Tezos;

  const dispatch = createEventDispatcher();
  let loading = false;
  let originated = false;

  let defaultStorage;

  const originateContract = async () => {
    loading = true;
    let storage = {};
    defaultStorage = defaultStorage.replace(/\s+/g, "");
    const mapRegex = "\\{([a-zA-Z0-9]+:[a-zA-Z0-9]+;?)+\\}";
    if (
      Object.keys($store.storageStructure).length === 1 &&
      !Object.keys($store.storageStructure)[0] !== "map"
    ) {
      // big map
      const regex = new RegExp(mapRegex, "g");
      if (defaultStorage.match(regex)) {
        let tempStorage = {};
        defaultStorage
          .slice(1)
          .slice(0, -1)
          .split(";")
          .forEach(el => {
            const keyValue = el.split(":");
            tempStorage[keyValue[0]] = keyValue[1];
          });

        storage = MichelsonMap.fromLiteral(tempStorage);
        console.log(storage, Tezos);

        try {
          const op = await Tezos.wallet
            .originate({
              code: JSON.parse($store.encodedMichelson),
              storage
            })
            .send();
          console.log("Operation:", op);
          const contract = await op.contract();
          console.log("Success!", contract);
          originated = contract.address;
        } catch (error) {
          console.log(error);
          originated = false;
        } finally {
          loading = false;
        }
      }
    } else if (
      Object.keys($store.storageStructure).length === 1 &&
      Object.keys($store.storageStructure)[0] !== "map"
    ) {
      // map
    }
  };
</script>

<style>
  textarea {
    height: 100px;
    width: 70%;
    padding: 10px;
    border: solid 1px lightgrey;
    border-radius: 5px;
  }
</style>

<div class="modal is-active">
  <div class="modal-background" transition:fade={{ duration: 300 }} />
  <div class="modal-card" transition:fly={{ duration: 500, y: -500 }}>
    <header class="modal-card-head">
      <p class="modal-card-title">Originate this contract?</p>
      {#if !loading}
        <button
          class="delete"
          aria-label="close"
          on:click={() => dispatch('close')} />
      {/if}
    </header>
    <section class="modal-card-body">
      {#if originated}
        <div>Contract successfully originated!</div>
        <div>
          Contract address:
          {#if $store.network === 'mainnet' || $store.network === 'carthagenet'}
            <a
              href={`https://better-call.dev/${$store.network}/${originated}/operations`}
              target="_blank"
              rel="noopener noreferrer">
              {originated}
            </a>
          {:else}
            <a
              href={`https://old.better-call.dev/sandbox/${originated}/operations`}
              target="_blank"
              rel="noopener noreferrer">
              {originated}
            </a>
          {/if}
        </div>
      {:else}
        <div>
          You are about to originate a new contract with the following options:
        </div>
        <br />
        <br />
        <div>Network: {$store.network}</div>
        <div>Wallet Address: {$store.userAddress}</div>
        <br />
        <div>
          <p>Storage structure:</p>
          <p>{JSON.stringify($store.storageStructure)}</p>
        </div>
        <textarea bind:value={defaultStorage} />
      {/if}
    </section>
    <footer class="modal-card-foot">
      <button
        class="button is-success"
        class:loading
        on:click={originateContract}>
        Originate
      </button>
      {#if !loading}
        <button class="button" on:click={() => dispatch('close')}>
          Cancel
        </button>
      {/if}
    </footer>
  </div>
</div>
