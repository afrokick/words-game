import './app.css';
import App from './App.svelte';
import { GameEventBus } from './lib/gameEventBus';
import { MultiSessions } from './lib/multiSessions';

const app = new App({
  target: document.getElementById('app')!,
});

export default app;

const updateFontSize = () => {
  const min = 0.4;
  const max = 1;
  const fontSize = Math.min(Math.max(window.innerHeight / 1136, min), max);
  document.documentElement.style.fontSize = fontSize + 'px';
};

window.addEventListener('resize', updateFontSize);

updateFontSize();

MultiSessions.init();

// subscribe for visibilitychange
// Depending on browser add the correct visibiltychange event and store the name of the hidden attribute
// in _hiddenAttr.
if (typeof document !== 'undefined') {
  let _hiddenAttr = '';

  const onVisibilityChanged = () => {
    const hidden = !!document[_hiddenAttr as 'hidden'];

    GameEventBus.tabVisibilityChanged.emit(!hidden);
  };

  if (document.hidden !== undefined) {
    _hiddenAttr = 'hidden';
    document.addEventListener('visibilitychange', onVisibilityChanged, false);
  }
  //@ts-ignore
  else if (document.mozHidden !== undefined) {
    _hiddenAttr = 'mozHidden';
    document.addEventListener('mozvisibilitychange', onVisibilityChanged, false);
  }
  //@ts-ignore
  else if (document.msHidden !== undefined) {
    _hiddenAttr = 'msHidden';
    document.addEventListener('msvisibilitychange', onVisibilityChanged, false);
  }
  //@ts-ignore
  else if (document.webkitHidden !== undefined) {
    _hiddenAttr = 'webkitHidden';
    document.addEventListener('webkitvisibilitychange', onVisibilityChanged, false);
  }

  window.addEventListener('focus', () => {
    onVisibilityChanged();
  }, false);
}
