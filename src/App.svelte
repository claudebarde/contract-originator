<script>
  import Navbar from "./components/Navbar/Navbar.svelte";
  import Body from "./components/Body/Body.svelte";
</script>

<section class="hero is-fullheight">
  <!-- Hero head: will stick at the top -->
  <Navbar />

  <!-- Hero content: will be in the middle -->
  <Body />

  <!-- Hero footer: will stick at the bottom -->
  <div class="hero-foot">
    <nav class="tabs is-boxed is-fullwidth">
      <div class="container">
        <ul>
          <li class="is-active">
            <a>Overview</a>
          </li>
          <li>
            <a>Modifiers</a>
          </li>
          <li>
            <a>Grid</a>
          </li>
          <li>
            <a>Elements</a>
          </li>
          <li>
            <a>Components</a>
          </li>
          <li>
            <a>Layout</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</section>
