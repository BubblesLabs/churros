<script lang="ts">
  import Router from "svelte-spa-router";
  import Dashboard from "./components/Dashboard/Dashboard.svelte";
  import Accounts from "./components/Accounts/Accounts.svelte";
  import Blocks from "./components/Blocks/Blocks.svelte";
  import Transactions from "./components/Transactions/Transactions.svelte";
  import Settings from "./components/Settings/Settings.svelte";
  import NotFound from "./NotFound.svelte";

  const routes = {
    "/": Dashboard,
    "/accounts": Accounts,
    "/blocks": Blocks,
    "/transactions": Transactions,
    "/settings": Settings,
    "*": NotFound
  };
</script>

<Router {routes} />
