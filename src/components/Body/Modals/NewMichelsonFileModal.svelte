<script>
  import { fly, fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import store from "../../../store";

  const dispatch = createEventDispatcher();

  let fileName = "";

  const createNewFile = () => {
    if (fileName && window.localStorage) {
      const files = window.localStorage.getItem("michelson-files");
      let michFiles;
      if (files) {
        // if files are already present
        michFiles = JSON.parse(files);
        michFiles[fileName] = "";
      } else {
        // if it is the first file
        michFiles = { [fileName]: "" };
      }
      // updates local storage
      window.localStorage.setItem("michelson-files", JSON.stringify(michFiles));
      // updates store
      store.updateMichelsonFiles([
        ...$store.michelsonFiles.map(file => ({ ...file, active: false })),
        { name: fileName, code: "", open: true, active: true }
      ]);
      store.changeActiveFile(fileName);
      dispatch("close");
    }
  };
</script>

<div class="modal is-active">
  <div class="modal-background" transition:fade={{ duration: 300 }} />
  <div class="modal-content" transition:fly={{ duration: 500, y: -500 }}>
    <div class="box">
      <h3 class="title is-5">Create a new Michelson file</h3>
      <h5 class="subtitle is-6">
        The
        <em>.tz</em>
        extension will be automatically added
      </h5>
      <div class="columns is-vcentered">
        <div class="column is-one-fifth">Name:</div>
        <div class="column is-three-fifths">
          <input
            type="text"
            class="input"
            value={fileName}
            on:input={event => {
              const val = event.target.value;
              fileName = val.replace(/\s+/g, '_').replace(/-+/g, '_');
            }} />
        </div>
        <div class="column is-one-fifth">
          <button
            class="button is-success"
            on:click={createNewFile}
            disabled={!fileName || !window.localStorage}>
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
  <button
    class="modal-close is-large"
    aria-label="close"
    on:click={() => dispatch('close')} />
</div>
