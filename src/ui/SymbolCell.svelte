<script lang="ts">
  export let symbol: string;
  export let hidden: boolean;
</script>

<div class="symbol-cell" class:hidden>
  <span class="symbol">{symbol}</span>
</div>

<style>
  .symbol-cell {
    width: 72rem;
    height: 72rem;
    border-radius: 20rem;
    display: flex;
    background-color: var(--words-green-color);
    padding-bottom: 6rem;
  }

  .symbol-cell.hidden {
    background-color: var(--words-white-cell-color);
  }

  .symbol-cell.hidden > * {
    display: none;
  }

  .symbol {
    text-transform: uppercase;
    font-size: 42rem;
    line-height: 1.1;
    font-weight: 700;
    margin: auto;
    color: var(--words-white-text-color);
  }
</style>
