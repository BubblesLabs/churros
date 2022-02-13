<script lang="ts">
  export let selected: string;

  const capitalize = (str: string): string =>
    str[0].toUpperCase() + str.slice(1);
</script>

<div>
  {capitalize(selected)}
</div>
