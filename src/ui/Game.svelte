<script lang="ts">
  import PossibleSymbol from "./PossibleSymbol.svelte";
  import SmallSymbolCell from "./SmallSymbolCell.svelte";
  import SymbolCell from "./SymbolCell.svelte";
  import { onEvent } from "../lib/hooks";
  import { GlobalStore } from "../lib/store";

  let store = GlobalStore;

  $: lvl = store.persistedState.currentLvl;
  $: words = store.persistedState.words;
  $: pickedSymbolsIndicies = store.pickedSymbolsIndicies;
  $: symbols = store.symbols;

  $: lvlText = `Уровень ${lvl}`;

  onEvent("charPicked", () => (store = GlobalStore));
  onEvent("wordFound", () => (store = GlobalStore));
  onEvent("wordFailed", () => (store = GlobalStore));
  onEvent("wordExisted", () => (store = GlobalStore));
</script>

<div class="game" on:mouseup={() => store.finishInput()}>
  <p class="lvl">{lvlText}</p>
  <div class="words">
    {#each words as wordInfo, i (i)}
      <div class="word">
        {#each wordInfo.word as symbol}
          <SymbolCell {symbol} hidden={!wordInfo.finished} />
        {/each}
      </div>
    {/each}
  </div>

  <div class="picked-symbols">
    {#each pickedSymbolsIndicies as symbolIndex, i (i)}
      <SmallSymbolCell symbol={symbols[symbolIndex].char} />
    {/each}
  </div>

  <div class="circle">
    <div class="inner-circle"></div>
    {#each symbols as symbol, i (i)}
      <PossibleSymbol
        index={i}
        symbol={symbol.char}
        x={symbol.x}
        y={symbol.y}
        picked={pickedSymbolsIndicies.includes(i)}
      />
    {/each}
  </div>
</div>

<style>
  .game {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lvl {
    font-size: 30rem;
    line-height: 35rem;
    font-weight: 700;
    padding: 0;
    margin: 0;
    margin-top: 27rem;
    color: var(--words-white-text-color);
  }

  .words {
    margin-top: 57rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6rem;
  }

  .picked-symbols {
    height: 100rem;
    display: flex;
    gap: 3rem;
    margin-top: 19rem;
  }

  .word {
    display: flex;
    gap: 6rem;
  }

  .circle {
    --circle-color: #3e4a68;
    --circle-size: 294rem;
    --ring-width: 20rem;

    margin-top: 40rem;
    position: relative;
    width: var(--circle-size);
    height: var(--circle-size);
    border-radius: 50%;
    background-color: var(--circle-color);
  }

  .inner-circle {
    position: absolute;
    width: calc(var(--circle-size) - var(--ring-width) * 2);
    height: calc(var(--circle-size) - var(--ring-width) * 2);
    left: var(--ring-width);
    top: var(--ring-width);

    border-radius: 50%;
    background-color: var(--words-bg-color);
  }
</style>
