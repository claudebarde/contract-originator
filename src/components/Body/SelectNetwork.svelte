<script>
  import store from "../../store";

  let customNetwork = "";
</script>

<div class="dropdown is-hoverable">
  <div class="dropdown-trigger">
    <button
      class="button is-info"
      aria-haspopup="true"
      aria-controls="select-network">
      <span>
        {#if !$store.network}
          Select a network
        {:else if $store.network === 'mainnet'}
          To Mainnet
        {:else if $store.network === 'carthagenet'}
          To Carthagenet
        {:else}To Custom{/if}
      </span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true" />
      </span>
    </button>
  </div>
  <div class="dropdown-menu" id="select-network" role="menu">
    <div class="dropdown-content">
      <a
        href="/"
        class="dropdown-item"
        on:click|preventDefault={() => store.updateNetwork('mainnet')}>
        Mainnet
      </a>
      <a
        href="/"
        class="dropdown-item"
        on:click|preventDefault={() => store.updateNetwork('carthagenet')}>
        Carthagenet
      </a>
      <a
        href="/"
        class="dropdown-item"
        on:click|preventDefault={() => store.updateNetwork('http:localhost:8732')}>
        Truffle default
      </a>
      <div class="dropdown-item">
        <input
          type="text"
          class="input is-small"
          bind:value={customNetwork}
          placeholder="Custom network"
          on:keyup={event => {
            if (event.which == 13 || event.keyCode == 13) {
              store.updateNetwork(customNetwork);
              customNetwork = '';
            }
          }} />
      </div>
    </div>
  </div>
</div>
