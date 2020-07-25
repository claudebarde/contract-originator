<script>
  export let title, stackTraces, tracePos;
</script>

<h3 class="title is-5">{title}</h3>
<table class="table is-narrow is-striped is-fullwidth">
  <thead>
    <tr>
      <th>Pos</th>
      <th>Element</th>
    </tr>
  </thead>
  <tbody>
    {#each stackTraces[stackTraces.length - tracePos].stackState as element, index}
      <tr>
        <td>{index}</td>
        <td>{element.type} {element.value}</td>
      </tr>
    {/each}
  </tbody>
</table>
