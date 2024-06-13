<script lang="ts">
  import { onMount } from "svelte";
  import Game from "./ui/Game.svelte";
  import Win from "./ui/Win.svelte";
  import { GlobalStore, UIStates } from "./lib/store";
  import { onEvent } from "./lib/hooks";

  let store = GlobalStore;
  let uiState = store.uiState;

  onMount(() => {
    if (uiState !== UIStates.loading) return;

    store.launchGame();
  });

  onEvent("uiStateChanged", (newState) => (uiState = newState));
</script>

<main>
  {#if uiState === UIStates.playing}
    <Game />
  {:else if uiState === UIStates.win}
    <Win />
  {/if}
</main>

<style>
  main {
    height: 100%;
  }
</style>
