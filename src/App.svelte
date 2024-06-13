<script lang="ts">
  import { onMount } from "svelte";
  import Game from "./ui/Game.svelte";
  import Win from "./ui/Win.svelte";
  import { GlobalStore, UIStates } from "./lib/store";
  import { onEvent } from "./lib/hooks";
  import MultiSessionsPopup from "./ui/MultiSessionsPopup.svelte";

  let store = GlobalStore;
  let uiState = store.uiState;

  let sessionExpired = false;

  onMount(() => {
    if (uiState !== UIStates.loading) return;

    store.launchGame();
  });

  onEvent("uiStateChanged", (newState) => (uiState = newState));
  onEvent("sessionExpired", () => (sessionExpired = true));
  onEvent("sessionUpdated", () => (sessionExpired = false));
</script>

<main>
  {#if uiState === UIStates.playing}
    <Game />
  {:else if uiState === UIStates.win}
    <Win />
  {/if}

  {#if sessionExpired}
    <MultiSessionsPopup />
  {/if}
</main>

<style>
  main {
    position: relative;
    height: 100%;
  }
</style>
