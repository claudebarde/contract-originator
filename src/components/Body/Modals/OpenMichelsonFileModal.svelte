<script>
  import { fly, fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import store from "../../../store";

  const dispatch = createEventDispatcher();

  const openFile = fileToOpen => {
    // sets file to "open" in store
    const michelsonFiles = $store.michelsonFiles.map(file => {
      if (file.name === fileToOpen.name) {
        return { ...file, open: true, active: true };
      } else {
        return { ...file, active: false };
      }
    });
    // updates store
    store.updateMichelsonFiles(michelsonFiles);
    store.changeActiveFile(fileToOpen.name);
    // loads code
    $store.editor.setValue(fileToOpen.code);

    dispatch("close");
  };
</script>

<style>
  .menu-list li {
    cursor: pointer;
  }
</style>

<div class="modal is-active">
  <div class="modal-background" transition:fade={{ duration: 300 }} />
  <div class="modal-content" transition:fly={{ duration: 500, y: -500 }}>
    <div class="box">
      <h3 class="title is-5">Open a Michelson file</h3>
      <h5 class="subtitle is-6">Please select one of the files below</h5>
      <div class="menu" style="margin-left:20px">
        {#if $store.michelsonFiles.length > 0 && $store.michelsonFiles.filter(file => file.open === false).length === 0}
          <p>All your files are already open!</p>
        {:else}
          <p class="menu-label">Saved Files</p>
          <ul class="menu-list">
            {#each $store.michelsonFiles as file}
              {#if !file.open}
                <li on:click|preventDefault={() => openFile(file)}>
                  <a href="#/">
                    <i class="far fa-file-code" />
                    <span>{file.name}.tz</span>
                  </a>
                </li>
              {/if}
            {:else}
              <li>No saved file yet!</li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
  <button
    class="modal-close is-large"
    aria-label="close"
    on:click={() => dispatch('close')} />
</div>
