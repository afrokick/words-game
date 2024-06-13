<script lang="ts">
  import { onMount } from "svelte";
  import { onEvent } from "../lib/hooks";
  import { GlobalStore } from "../lib/store";
  import { wait } from "../lib/utils";

  export let symbol: string;
  export let x: number;
  export let y: number;
  export let index: number;
  export let picked: boolean;

  const onMouseDown = () => {
    GlobalStore.pickSymbol(index);
  };

  const onMouseUp = () => {
    GlobalStore.finishInput();
  };

  const onMouseOver = () => {
    if (GlobalStore.isPossibleToSelect(index)) {
      GlobalStore.pickSymbol(index);
    }
  };

  let existed = false;
  let playingAnim: "scaling" | "shaking" | "" = "";

  async function startAnim(anim: typeof playingAnim, duration = 100) {
    playingAnim = anim;
    await wait(duration);
    playingAnim = "";
  }

  onEvent("wordFound", () => {
    picked && startAnim("scaling");
  });

  onEvent("wordFailed", () => {
    picked && startAnim("shaking");
  });

  onEvent("wordExisted", async () => {
    if (!picked) return;

    existed = true;
    await startAnim("scaling", 300);
    existed = false;
  });

  onMount(async () => {
    await wait(100 * index);
    await startAnim("scaling");
  });
</script>

<div
  class="container"
  style="transform:translate(calc(-50% + {x}rem), calc(-50% + {-y}rem))"
>
  <div
    class="possible-symbol"
    class:picked
    class:existed
    class:playScalingAnim={playingAnim === "scaling"}
    class:playShakingAnim={playingAnim === "shaking"}
    on:mousedown={onMouseDown}
    on:mouseover={onMouseOver}
    on:mouseup={onMouseUp}
  >
    <span class="symbol">{symbol}</span>
  </div>
</div>

<style>
  .container {
    position: absolute;
    width: 90rem;
    height: 90rem;
  }

  @keyframes scalingKeyFrames {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes shakingKeyFrames {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-10%);
    }

    75% {
      transform: translateX(10%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .possible-symbol {
    --shadow-size: 3rem;
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--words-white-cell-color);
    color: var(--words-gray-text-color);
    box-shadow: 0 var(--shadow-size) 0 var(--words-white-shadow);
  }

  .possible-symbol.picked {
    background-color: var(--words-pink-color);
    color: var(--words-white-text-color);
    box-shadow: 0 var(--shadow-size) 0 var(--words-pink-shadow);
  }

  .possible-symbol.existed {
    background-color: var(--words-orange-color);
    color: var(--words-white-text-color);
    box-shadow: 0 var(--shadow-size) 0 var(--words-orange-shadow);
  }

  .playScalingAnim {
    animation: scalingKeyFrames 0.2s ease-in-out;
  }

  .playShakingAnim {
    animation: shakingKeyFrames 0.2s ease-in-out;
  }

  .symbol {
    text-transform: uppercase;
    font-size: 42rem;
    line-height: 1.1;
    font-weight: 700;
    margin: auto;
  }
</style>
