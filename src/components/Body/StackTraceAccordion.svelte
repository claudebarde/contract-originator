<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import doc from "../../parser/res_michelson.json";

  export let stackTraces, initParameter, initStorage;

  const dispatch = createEventDispatcher();
  let activeElement = undefined;

  $: if (stackTraces) {
    activeElement = undefined;
  }
</script>

<style>
  .stackTrace {
    height: 80%;
    width: 100%;
    padding: 10px;
    border: solid 1px lightgrey;
    border-radius: 5px;
    background-color: white;
    overflow: auto;
  }

  /* Style the buttons that are used to open and close the accordion panel */
  .accordion {
    cursor: pointer;
    padding: 10px;
    width: 100%;
    text-align: left;
    border: none;
    outline: none;
    transition: 0.4s;
    color: white;
  }

  /* Style the accordion panel. Note: hidden by default */
  .accordion-panel {
    padding: 20px;
    background-color: white;
    overflow: hidden;
    font-size: 0.8rem;
  }

  .accordion:after {
    content: "\02795"; /* Unicode character for "plus" sign (+) */
    font-size: 13px;
    color: white;
    float: right;
    margin-left: 5px;
  }

  .active:after {
    content: "\2796"; /* Unicode character for "minus" sign (-) */
    color: white;
  }
</style>

<h2 class="title is-5">Michelson Typecheck</h2>
<div class="stackTrace">
  <div class="columns">
    <div class="column is-half">
      <input
        type="text"
        class="input is-small"
        placeholder="Init parameter"
        value={initParameter}
        on:change={event => dispatch('updateParameter', event.target.value)} />
    </div>
    <div class="column is-half">
      <input
        type="text"
        class="input is-small"
        placeholder="Init storage"
        value={initStorage}
        on:change={event => dispatch('updateStorage', event.target.value)} />
    </div>
  </div>
  {#each stackTraces as trace, index}
    <button
      class="accordion"
      class:active={activeElement === index}
      class:has-background-success={trace.result === 'success'}
      class:has-background-danger={trace.result === 'error'}
      on:click={() => {
        if (activeElement !== index) {
          activeElement = index;
        } else {
          activeElement = undefined;
        }
      }}>
      {#if trace.result === 'success'}
        {index + 1} - Instruction {trace.instruction}
      {:else}Error{/if}
    </button>
    {#if activeElement === index}
      <div class="accordion-panel" transition:slide>
        {#if trace.result === 'success'}
          {#if doc.instructions.filter(instr => instr.op === trace.instruction).length === 1}
            <p>
              {doc.instructions.filter(instr => instr.op === trace.instruction)[0].documentation_short || 'No documentation'}
            </p>
            <br />
          {/if}
          <div>
            Resulting Stack State
            <table class="table is-bordered is-narrow is-striped">
              <tbody>
                {#each trace.stackState as element}
                  <tr>
                    <td>{element.type} {element.value}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {:else}
          <p>{trace.msg}</p>
        {/if}
      </div>
    {/if}
  {:else}
    <p>No stack trace available</p>
  {/each}
</div>
