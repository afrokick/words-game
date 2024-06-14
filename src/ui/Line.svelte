<script lang="ts">
  import { onEvent } from "../lib/hooks";
  import { GlobalStore } from "../lib/store";

  let store = GlobalStore;

  onEvent("charPicked", () => (store = GlobalStore));
  onEvent("wordFound", () => (store = GlobalStore));
  onEvent("wordFailed", () => (store = GlobalStore));
  onEvent("wordExisted", () => (store = GlobalStore));
  onEvent("uiStateChanged", () => (store = GlobalStore));
  onEvent("windowResized", () => (store = GlobalStore));
  onEvent("relativePointerChanged", () => (store = GlobalStore));
  onEvent("lineChanged", () => (store = GlobalStore));

  $: windowPoints = [
    ...store.getWindowLinePoints(),
    ...(store.relativePointerPosition
      ? [
          store.getWindowPoint(
            store.relativePointerPosition.x,
            store.relativePointerPosition.y
          ),
        ]
      : []),
  ];
  $: svgPoints = windowPoints
    .map((p) => {
      return `${p.x},${p.y}`;
    })
    .join(" ");
</script>

<svg
  class="line"
  height="100%"
  width="100%"
  viewBox={`0 0 ${store.windowSize.x} ${store.windowSize.y}`}
>
  {#if svgPoints.length > 1}
    <polyline points={svgPoints} />
  {/if}
</svg>

<style>
  .line {
    pointer-events: none;
    position: absolute;
    inset: 0;
  }

  polyline {
    fill: none;
    stroke: var(--words-line-color);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 24rem;
  }
</style>
