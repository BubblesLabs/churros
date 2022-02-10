<script lang="ts">
  import DashboardIcon from "../Icons/DashboardIcon.svelte";
  import AccountsIcon from "../Icons/AccountsIcon.svelte";
  import CubeIcon from "../Icons/CubeIcon.svelte";
  import TransactionsIcon from "../Icons/TransactionsIcon.svelte";
  import SettingsIcon from "../Icons/SettingsIcon.svelte";
</script>

<style lang="scss">
  @import "../../styles/settings.scss";

  header {
    background-color: $header-bg-color;
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
    }
  }
</style>

<header>
  <div>
    <a href="#/">
      <DashboardIcon color="white" width={28} height={28} />
      Dashboard
    </a>
  </div>
  <div>
    <a href="#/accounts">
      <AccountsIcon color="white" width={28} height={28} />
      Accounts
    </a>
  </div>
  <div>
    <a href="#/blocks">
      <CubeIcon color="white" width={28} height={28} />
      Blocks
    </a>
  </div>
  <div>
    <a href="#/transactions">
      <TransactionsIcon color="white" width={28} height={28} />
      Transactions
    </a>
  </div>
  <div>
    <a href="#/settings">
      <SettingsIcon color="white" width={28} height={28} />
      Settings
    </a>
  </div>
</header>
