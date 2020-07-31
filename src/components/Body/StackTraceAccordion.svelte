<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import doc from "../../parser/res_michelson.json";
  import StackTable from "./StackTable.svelte";
  import store from "../../store";

  export let stackTraces,
    initParameter,
    initStorage,
    liveCoding,
    validationError;

  const dispatch = createEventDispatcher();
  let activeElement = undefined;
  let errorLineNumber = undefined;

  const checkEndOfExecution = (firstEl, lastEl) => {
    if (!firstEl || !lastEl) return false;

    if (
      lastEl.type === "pair" &&
      lastEl.elements.length === 2 &&
      lastEl.elements[0] &&
      lastEl.elements[1] &&
      firstEl.elements[1] &&
      lastEl.elements[0].type === "list" &&
      lastEl.elements[0].value === "operation" &&
      lastEl.elements[1].type === firstEl.elements[1].type
    ) {
      return true;
    } else {
      return false;
    }
  };

  $: if (stackTraces) {
    activeElement = undefined;

    if (
      stackTraces.filter(trace => trace.result !== "error").length > 0 &&
      stackTraces[stackTraces.length - 1].result == "error"
    ) {
      errorLineNumber =
        parseInt($store.codeStart) + parseInt(stackTraces.length) - 1;
      $store.editor.addLineClass(errorLineNumber, "background", "error-line");
    } else if (
      stackTraces.length > 0 &&
      stackTraces[stackTraces.length - 1].result === "success" &&
      errorLineNumber
    ) {
      $store.editor.eachLine(line => {
        $store.editor.removeLineClass(line, "background", "error-line");
      });
      errorLineNumber = undefined;
    }
  }
</script>

<style>
  .stackTrace {
    height: 100%;
    width: 100%;
    padding: 10px;
    border: solid 1px lightgrey;
    border-radius: 5px;
    background-color: white;
    overflow: hidden;
  }

  .instructions-accordion,
  .feedback {
    overflow: auto;
    height: 45%;
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

<div class="stackTrace">
  <div class="feedback">
    <div class="columns is-vcentered" style="width:99%">
      <div class="column is-6">
        <input
          type="text"
          class="input is-small"
          class:is-danger={validationError && validationError.param}
          placeholder="Init parameter"
          value={initParameter}
          on:change={event => dispatch('updateParameter', event.target.value)} />
      </div>
      <div class="column is-6">
        <input
          type="text"
          class="input is-small"
          class:is-danger={validationError && validationError.storage}
          placeholder="Init storage"
          value={initStorage}
          on:change={event => dispatch('updateStorage', event.target.value)} />
      </div>
    </div>
    {#if validationError}
      <div class="message is-danger is-small">
        <div class="message-body">
          {#if validationError.storage}
            <span>Storage: {validationError.storage}</span>
          {/if}
          {#if validationError.param}
            <span>Parameter: {validationError.param}</span>
          {/if}
        </div>
      </div>
    {/if}
    {#if liveCoding && stackTraces.length > 0 && stackTraces[stackTraces.length - 1].result !== 'error'}
      {#if stackTraces.length > 1}
        <div class="columns">
          <div class="column is-half">
            <StackTable
              title="Previous Stack State"
              tracePos="2"
              {stackTraces} />
          </div>
          <div class="column is-half">
            <StackTable title="New Stack State" tracePos="1" {stackTraces} />
          </div>
        </div>
      {:else}
        <StackTable title="Stack State" tracePos="1" {stackTraces} />
      {/if}
    {:else if liveCoding && stackTraces.length > 0 && stackTraces[stackTraces.length - 1].result === 'error' && stackTraces[stackTraces.length - 2]}
      <StackTable title="Previous Stack State" tracePos="2" {stackTraces} />
    {:else}
      <p>No stack information available</p>
    {/if}
    {#if stackTraces.filter(el => el.result === 'error').length > 0}
      <div class="message is-small is-danger">
        <div class="message-body">
          <p>Error: {stackTraces.filter(el => el.result === 'error')[0].msg}</p>
        </div>
      </div>
    {/if}
  </div>
  <hr />
  <div class="instructions-accordion">
    {#if stackTraces.length > 2 && checkEndOfExecution(stackTraces[0].element, stackTraces[stackTraces.length - 1].element)}
      <div>
        <p>End of execution</p>
        <p>Number of instructions: {stackTraces.length}</p>
      </div>
    {/if}
    {#each stackTraces as trace, index}
      <button
        class="accordion"
        class:active={activeElement === index}
        class:has-background-success={trace.result === 'success' && (index !== stackTraces.length - 1 || !checkEndOfExecution(stackTraces[0].element, trace.element))}
        class:has-background-danger={trace.result === 'error'}
        class:has-background-info={trace.result === 'success' && index === stackTraces.length - 1 && checkEndOfExecution(stackTraces[0].element, trace.element)}
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
</div>
