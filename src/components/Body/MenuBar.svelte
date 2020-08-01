<script>
  import { createEventDispatcher } from "svelte";
  import store from "../../store";

  const dispatch = createEventDispatcher();

  let openTemplatesDropdown = false;
  let openActionsDropdown = false;
  let openLinksDropdown = false;

  const additionCode = `parameter int ;
storage int ;
code {
    DUP ;
    CAR ;
    SWAP ;
    CDR ;
    ADD ;
    NIL operation ;
    PAIR
}`;

  const loadCode = async (param, isAddress) => {
    let code;
    if (isAddress) {
      const response = await fetch(param);
      code = await response.json();
    } else {
      code = param;
    }

    $store.editor.setValue(code);
  };

  const closeCurrentFile = () => {
    store.updateMichelsonFiles(
      $store.michelsonFiles.map(file => {
        if (file.name === $store.activeFile) {
          return { ...file, open: false, active: false };
        } else {
          return { ...file, active: false };
        }
      })
    );
    store.changeActiveFile(undefined);
    $store.editor.setValue("");
  };

  const deleteCurrentFile = () => {
    // deletes file from store
    const michelsonFiles = $store.michelsonFiles.filter(
      file => file.name !== $store.activeFile
    );
    if (michelsonFiles.length === $store.michelsonFiles.length - 1) {
      store.updateMichelsonFiles(michelsonFiles);
      $store.editor.setValue("");
      // deletes file from local storage
      if (window.localStorage) {
        const michFiles = JSON.parse(
          window.localStorage.getItem("michelson-files")
        );
        delete michFiles[$store.activeFile];
        window.localStorage.setItem(
          "michelson-files",
          JSON.stringify(michFiles)
        );
      }
      store.changeActiveFile(undefined);
    }
  };
</script>

<style>
  .menu-bar {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
</style>

<div class="menu-bar has-background-light">
  <div>
    <button class="button is-light">
      {#if $store.darkMode}
        <span
          class="icon is-small"
          on:click={() => {
            $store.editor.setOption('theme', 'eclipse');
            store.changeDarkMode(false);
          }}>
          <i class="far fa-sun" />
        </span>
      {:else}
        <span
          class="icon is-small"
          on:click={() => {
            $store.editor.setOption('theme', 'lucario');
            store.changeDarkMode(true);
          }}>
          <i class="far fa-moon" />
        </span>
      {/if}
    </button>
  </div>
  <div class="dropdown" class:is-active={openTemplatesDropdown}>
    <div class="dropdown-trigger">
      <button
        class="button is-light"
        aria-haspopup="true"
        aria-controls="dropdown-templates"
        on:click={() => {
          openTemplatesDropdown = !openTemplatesDropdown;
          openActionsDropdown = false;
          openLinksDropdown = false;
        }}>
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
        <a
          href="#/"
          class="dropdown-item"
          on:click|preventDefault={() => {
            loadCode(additionCode, false);
          }}>
          Addition
        </a>
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
          on:click|preventDefault={() => loadCode('https://api.better-call.dev/v1/contract/mainnet/KT1TUx83WuwtA2Ku1pi6A9AZqov7CZfYtLUS/code', true)}>
          miniTez
        </a>
        <a
          href="#/"
          class="dropdown-item"
          target="_blank"
          on:click|preventDefault={() => loadCode('https://api.better-call.dev/v1/contract/carthagenet/KT1QaxSfGtgn86Lnhtu8PrkApQLiFt2SMEfr/code', true)}>
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
        on:click={() => {
          openActionsDropdown = !openActionsDropdown;
          openTemplatesDropdown = false;
          openLinksDropdown = false;
        }}>
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
        <a
          href="#/"
          class="dropdown-item"
          on:click|preventDefault={() => dispatch('typecheck')}>
          Typecheck
        </a>
        <a href="#/" class="dropdown-item">Encode</a>
      </div>
    </div>
  </div>
  <div class="dropdown" class:is-active={openLinksDropdown}>
    <div class="dropdown-trigger">
      <button
        class="button is-light"
        aria-haspopup="true"
        aria-controls="dropdown-links"
        on:click={() => {
          openLinksDropdown = !openLinksDropdown;
          openTemplatesDropdown = false;
          openActionsDropdown = false;
        }}>
        <span>Links</span>
        {#if openLinksDropdown}
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
      id="dropdown-links"
      role="menu"
      on:click={() => (openLinksDropdown = false)}>
      <div class="dropdown-content">
        <a
          href="https://tezos.gitlab.io/whitedoc/michelson.html"
          class="dropdown-item"
          target="_blank"
          rel="noopener noreferrer">
          Official documentation
        </a>
        <a
          href="https://michelson.nomadic-labs.com/"
          class="dropdown-item"
          target="_blank"
          rel="noopener noreferrer">
          Nomadic Labs reference
        </a>
        <a
          href="https://try-michelson.com/"
          class="dropdown-item"
          target="_blank"
          rel="noopener noreferrer">
          Try michelson online
        </a>
      </div>
    </div>
  </div>
  <div>
    <button
      class="button is-light"
      on:click={() => store.updateLiveCoding(!$store.liveCoding)}
      title={`Live coding is ${$store.liveCoding ? 'on' : 'off'}`}>
      {#if !$store.liveCoding}
        <span class="icon is-medium">
          <span class="fa-stack">
            <i class="far fa-keyboard fa-lg fa-stack-1x" />
            <i
              class="fas fa-slash fa-lg fa-stack-1x"
              data-fa-transform="flip-v" />
          </span>
        </span>
      {:else}
        <span class="icon is-medium">
          <span class="fa-stack">
            <i class="far fa-keyboard fa-lg fa-stack-1x" />
          </span>
        </span>
      {/if}
    </button>
  </div>
  <div>
    <button
      class="button is-light"
      title="Erase the current code"
      on:click={() => dispatch('typecheck')}>
      <span class="icon is-small">
        <i class="fas fa-laptop-code" />
      </span>
    </button>
  </div>
  <div>
    <button
      class="button is-light"
      title="Erase the current code"
      on:click={() => $store.editor.setValue('')}>
      <span class="icon is-small">
        <i class="fas fa-eraser" />
      </span>
    </button>
  </div>
  {#if $store.activeFile}
    <div>
      <button
        class="button is-light"
        title="Close current file"
        on:click={closeCurrentFile}>
        <span class="icon is-small">
          <i class="far fa-window-close" />
        </span>
      </button>
    </div>
    <div>
      <button
        class="button is-light"
        title="Delete current file"
        on:click={deleteCurrentFile}>
        <span class="icon is-small">
          <i class="far fa-trash-alt" />
        </span>
      </button>
    </div>
  {/if}
</div>
