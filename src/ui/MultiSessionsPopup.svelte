<script lang="ts">
  import { MultiSessions } from "../lib/multiSessions";
  import { GlobalStore } from "../lib/store";

  $: titleText = `Две вкладки
с игрой?`;
  $: messageText = `Похоже, игра открыта в 
нескольких вкладках браузера.
Чтобы продолжить играть в
этой вкладке, обновите
страницу.`;
  $: refreshBtnText = `Обновить`;

  let pressed = false;

  const onRefreshClicked = async () => {
    if (pressed) return;
    pressed = true;

    await MultiSessions.startSession();
    await GlobalStore.launchGame();
  };
</script>

<div class="popup">
  <div class="popup-body">
    <div class="popup-bg"></div>
    <img class="popup-ribbon" src="./popup_ribbon.png" alt="" />
    <div class="popup-content">
      <div class="title">{titleText}</div>
      <div class="message">{messageText}</div>
      <button class="refresh-btn" disabled={pressed} on:click={onRefreshClicked}
        >{refreshBtnText}</button
      >
      <button class="close-btn" disabled={pressed} on:click={onRefreshClicked}
        ><img src="./close_icon.png" alt="" /></button
      >
    </div>
  </div>
</div>

<style>
  @keyframes popupInKeyFrames {
    0% {
      transform: translate(-50%, -50%) scale(0);
    }
    90% {
      transform: translate(-50%, -50%) scale(1.05);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  .popup {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000000b3;
  }

  .popup-bg {
    background-color: #fff;
    border-radius: 40rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .popup-ribbon {
    top: -19rem;
    position: absolute;
    width: 384rem;
    height: 113rem;
  }

  .popup-body {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 530rem;
    height: 428rem;

    animation: popupInKeyFrames 0.4s ease-in-out;
  }

  .popup-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .title {
    font-size: 40rem;
    line-height: 36rem;
    font-weight: 700;
    max-width: 11ch;
    text-align: center;
    margin-top: -12rem;
    color: var(--words-white-text-color);
  }

  .message {
    font-size: 32rem;
    line-height: 38rem;
    font-weight: 700;
    text-align: center;
    margin-top: 64rem;
    color: var(--words-gray-text-color);
  }

  button {
    --shadow-size: 4rem;
    background-color: var(--words-green-color);
    font-size: 40rem;
    line-height: 37rem;
    font-weight: 700;
    padding: 27rem 60rem 34rem 60rem;
    margin: 0;
    color: var(--words-white-text-color);
    border: none;
    border-radius: 60rem;
    box-shadow: 0 var(--shadow-size) 0 var(--words-green-shadow);
    margin-top: 24rem;
  }

  .close-btn {
    position: absolute;
    right: 24rem;
    top: 12rem;
    width: 26rem;
    height: 26rem;
    padding: 0;
    margin: 0;
    box-shadow: none;
    background: none;
  }

  .close-btn img {
    width: 100%;
    height: 100%;
  }
</style>
