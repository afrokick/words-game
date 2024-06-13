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
  }

  .symbol {
    text-transform: uppercase;
    font-size: 35rem;
    line-height: 1.1;
    font-weight: 700;
    margin: auto;
  }
</style>
