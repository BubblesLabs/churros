<script lang="ts">
  import { location } from "svelte-spa-router";
  import DashboardIcon from "../Icons/DashboardIcon.svelte";
  import AccountsIcon from "../Icons/AccountsIcon.svelte";
  import CubeIcon from "../Icons/CubeIcon.svelte";
  import TransactionsIcon from "../Icons/TransactionsIcon.svelte";
  import SettingsIcon from "../Icons/SettingsIcon.svelte";
  import ContractIcon from "../Icons/ContractIcon.svelte";
</script>

<style lang="scss">
  @import "../../styles/settings.scss";

  header {
    background-color: $black;
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    a {
      color: inherit;
      text-decoration: none;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;

      &.selected-route {
        color: $orange;
      }
    }

    .logo {
      background-color: $yellow;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      border-radius: 50%;
      border: solid 4px $dark-orange;

      img {
        width: 42px;
        height: 42px;
      }
    }
  }
</style>

<header>
  <div class="logo">
    <img src="img/churros-icon-black.png" alt="logo" />
  </div>
  <div>
    <a href="#/" class:selected-route={$location === "/"}>
      <DashboardIcon
        color={$location === "/" ? "#f39750" : "white"}
        width={28}
        height={28}
      />
      Dashboard
    </a>
  </div>
  <div>
    <a href="#/accounts" class:selected-route={$location.includes("/accounts")}>
      <AccountsIcon
        color={$location.includes("/accounts") ? "#f39750" : "white"}
        width={28}
        height={28}
      />
      Accounts
    </a>
  </div>
  <div>
    <a href="#/blocks" class:selected-route={$location.includes("/blocks")}>
      <CubeIcon
        color={$location.includes("/blocks") ? "#f39750" : "white"}
        width={28}
        height={28}
      />
      Blocks
    </a>
  </div>
  <div>
    <a
      href="#/transactions"
      class:selected-route={$location.includes("/transactions")}
    >
      <TransactionsIcon
        color={$location.includes("/transactions") ? "#f39750" : "white"}
        width={28}
        height={28}
      />
      Transactions
    </a>
  </div>
  <div>
    <a
      href="#/contracts"
      class:selected-route={$location.includes("/contracts")}
    >
      <ContractIcon
        color={$location.includes("/contracts") ? "#f39750" : "white"}
        width={28}
        height={28}
      />
      Contracts
    </a>
  </div>
  <div>
    <a href="#/settings" class:selected-route={$location === "/settings"}>
      <SettingsIcon
        color={$location === "/settings" ? "#f39750" : "white"}
        width={28}
        height={28}
      />
      Settings
    </a>
  </div>
</header>
