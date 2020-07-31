<script>
  import store from "../../store";
  import NewMichelsonFileModal from "./Modals/NewMichelsonFileModal.svelte";
  import OpenMichelsonFileModal from "./Modals/OpenMichelsonFileModal.svelte";

  let newMichelsonFile = false;
  let openMichelsonFile = false;

  const setAsActive = fileName => {
    // set file as active
    store.changeActiveFile(fileName);
    const michelsonFiles = $store.michelsonFiles.map(file => {
      if (file.name === fileName) {
        return { ...file, active: true };
      } else {
        return { ...file, active: false };
      }
    });
    store.updateMichelsonFiles(michelsonFiles);
    // updates editor
    $store.editor.setValue(
      $store.michelsonFiles.filter(file => file.name === fileName)[0].code
    );
  };
</script>

<style>
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
</style>

<div>
  <ul class="files-list">
    {#each $store.michelsonFiles as file}
      {#if file.open}
        <li
          class="is-size-7"
          class:active-file={file.active}
          on:click={() => setAsActive(file.name)}>
          <i class="far fa-file-code" />
          <span>{file.name}.tz</span>
        </li>
      {/if}
    {/each}
    <li class="is-size-7" on:click={() => (newMichelsonFile = true)}>
      <i class="far fa-plus-square" />
      <span>New</span>
    </li>
    <li class="is-size-7" on:click={() => (openMichelsonFile = true)}>
      <i class="far fa-folder-open" />
      <span>Open</span>
    </li>
  </ul>
</div>
{#if newMichelsonFile}
  <NewMichelsonFileModal on:close={() => (newMichelsonFile = false)} />
{/if}
{#if openMichelsonFile}
  <OpenMichelsonFileModal on:close={() => (openMichelsonFile = false)} />
{/if}
