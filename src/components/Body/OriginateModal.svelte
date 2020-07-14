<script>
  import { fly, fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import store from "../../store.js";

  const dispatch = createEventDispatcher();

  const originateContract = () => {};
</script>

<div class="modal is-active">
  <div class="modal-background" transition:fade={{ duration: 300 }} />
  <div class="modal-card" transition:fly={{ duration: 500, y: -500 }}>
    <header class="modal-card-head">
      <p class="modal-card-title">Originate this contract?</p>
      <button
        class="delete"
        aria-label="close"
        on:click={() => dispatch('close')} />
    </header>
    <section class="modal-card-body">
      <div>
        You are about to originate a new contract with the following options:
      </div>
      <br />
      <br />
      <div>Network: {$store.network}</div>
      <div>Wallet Address: {$store.userAddress}</div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" on:click={originateContract}>
        Originate
      </button>
      <button class="button" on:click={() => dispatch('close')}>Cancel</button>
    </footer>
  </div>
</div>
