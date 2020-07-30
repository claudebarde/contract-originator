<script>
  import logo from "../../../public/images/under-construction-80.png";
</script>

<style>
  .brand {
    font-weight: bold;
    font-size: 1.5rem;
    font-family: Monaco;
  }

  .logo {
    height: 50px;
  }
</style>

<div class="hero-head">
  <header class="navbar">
    <div class="container">
      <div id="navbarMenuHeroC" class="navbar-menu">
        <div class="navbar-start">
          <img src={logo} alt="under construction" class="logo" />
          <a href="/" class="brand navbar-item">Michelson Editor</a>
        </div>
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable">
            <a href="#/" class="navbar-link">Actions</a>

            <div class="navbar-dropdown">
              <a href="#/" class="dropdown-item">Typecheck</a>
              <a href="#/" class="dropdown-item">Encode</a>
            </div>
          </div>
          <a
            href="https://www.github.com/claudebarde"
            target="_blank"
            rel="noopener noreferrer"
            class="navbar-item">
            <span class="icon">
              <i class="fab fa-github" />
            </span>
            <span>Github</span>
          </a>
        </div>
      </div>
    </div>
  </header>
</div>
