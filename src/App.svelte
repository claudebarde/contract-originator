<script>
  import Navbar from "./components/Navbar/Navbar.svelte";
  import Body from "./components/Body/Body.svelte";
  import taquitoPic from "../public/images/taquito.png";
</script>

<style>
  .hero {
    background-color: #ebf8ff;
  }

  .footer-pic {
    height: 30px;
    float: right;
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>

<section class="hero is-fullheight">
  <!-- Hero head: will stick at the top -->
  <Navbar />

  <!-- Hero content: will be in the middle -->
  <Body />

  <!-- Hero footer: will stick at the bottom -->
  <div class="hero-foot">
    <img src={taquitoPic} alt="Built with Taquito" class="footer-pic" />
  </div>
</section>
