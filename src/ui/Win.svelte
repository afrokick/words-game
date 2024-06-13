<script lang="ts">
  import { GlobalStore } from "../lib/store";
  import { wait } from "../lib/utils";

  let store = GlobalStore;

  $: lvl = store.persistedState.currentLvl;

  $: lvlMessage = `Уровень ${lvl} пройден`;
  $: noticeMessage = `Изумительно`;
  $: nextBtnText = `Уровень ${lvl + 1}`;

  let pressed = false;

  const onNextLvlClicked = async () => {
    if (pressed) return;
    pressed = true;
    await wait(300);
    await store.goToNextLvl();
  };
</script>

<div class="win">
  <p class="lvl-message">{lvlMessage}</p>
  <p class="notice-message">{noticeMessage}</p>
  <button
    class="next-lvl-btn"
    class:playScalingDownAnim={pressed}
    disabled={pressed}
    on:click={onNextLvlClicked}>{nextBtnText}</button
  >
</div>

<style>
  @keyframes scalingDownKeyFrames {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    10% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(0.4);
      opacity: 0.5;
    }
  }

  .playScalingDownAnim {
    animation: scalingDownKeyFrames 0.4s ease-in-out;
  }

  .win {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lvl-message {
    font-size: 37rem;
    line-height: 34rem;
    font-weight: 700;
    padding: 0;
    margin: 0;
    margin-top: 257rem;
    color: var(--words-white-text-color);
  }

  .notice-message {
    font-size: 53rem;
    line-height: 49rem;
    font-weight: 700;
    padding: 0;
    margin: 0;
    margin-top: 20rem;
    color: var(--words-white-text-color);
  }

  button {
    --shadow-size: 4rem;
    background-color: var(--words-green-color);
    margin-top: 347rem;
    font-size: 40rem;
    line-height: 37rem;
    font-weight: 700;
    padding: 27rem 60rem 34rem 60rem;
    margin: 0;
    color: var(--words-white-text-color);
    border: none;
    border-radius: 60rem;
    box-shadow: 0 var(--shadow-size) 0 var(--words-green-shadow);

    margin-top: 351rem;
  }
</style>
