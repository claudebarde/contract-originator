<script>
  import { fly, fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<div class="modal is-active">
  <div class="modal-background" transition:fade={{ duration: 300 }} />
  <div class="modal-content" transition:fly={{ duration: 500, y: -500 }}>
    <div class="box">
      <h3 class="title is-5">Create a new Michelson file</h3>
      <div class="columns is-vcentered">
        <div class="column is-one-fifth">Name:</div>
        <div class="column is-three-fifths">
          <input type="text" class="input" />
        </div>
        <div class="column is-one-fifth">
          <button class="button is-success">Create</button>
        </div>
      </div>
    </div>
  </div>
  <button
    class="modal-close is-large"
    aria-label="close"
    on:click={() => dispatch('close')} />
</div>
