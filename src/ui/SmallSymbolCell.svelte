<script lang="ts">
  export let symbol: string;
</script>

<div class="symbol-cell">
  <span class="symbol">{symbol}</span>
</div>

<style>
  .symbol-cell {
    width: 42rem;
    height: 42rem;
    border-radius: 15rem;
    background-color: var(--words-white-cell-color);
    display: flex;
    padding-bottom: 6rem;
  }

  .symbol {
    text-transform: uppercase;
    font-size: 30rem;
    line-height: 1;
    font-weight: 700;
    margin: auto;
    color: var(--words-gray-text-color);
  }
</style>
