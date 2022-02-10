<script lang="ts">
  import Header from "./components/Header/Header.svelte";
  import StatsHeader from "./components/StatsHeader/StatsHeader.svelte";
  import Dashboard from "./components/Dashboard/Dashboard.svelte";
  import Footer from "./components/Footer/Footer.svelte";
</script>

<style type="scss">
  main {
    height: 100%;
    display: grid;
    grid-template-rows: 8% 6% 84% 2%;
  }
</style>

<main>
  <Header />
  <StatsHeader />
  <Dashboard />
  <Footer />
</main>
