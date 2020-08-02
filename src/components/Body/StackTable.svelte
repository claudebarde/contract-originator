<script>
  export let title, stackTraces, tracePos;

  const format = el => {
    return el;
  };
</script>

<h3 class="title is-5">{title}</h3>
<table class="table is-narrow is-striped is-fullwidth">
  <thead>
    <tr>
      <th>Pos</th>
      <th>Type</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    {#each stackTraces[stackTraces.length - tracePos].stackState as trace, index}
      {#if trace.type === 'list'}
        <tr>
          <td>{index}</td>
          <td>({trace.type} {trace.value})</td>
          <td>
            {#each trace.elements as element}
              <span>{element.type}</span>
              &nbsp;
            {:else}[]{/each}
          </td>
        </tr>
      {:else if trace.type === 'pair'}
        <tr>
          <td>{index}</td>
          <td>(pair {trace.param[0]} {trace.param[1]})</td>
          <td>(Pair {trace.elements[0].value} {trace.elements[1].value})</td>
        </tr>
      {:else}
        <tr>
          <td>{index}</td>
          <td>{trace.type}</td>
          <td>{trace.value}</td>
        </tr>
      {/if}
    {:else}
      <tr>
        <td colspan="3">Empty stack</td>
      </tr>
    {/each}
  </tbody>
</table>
