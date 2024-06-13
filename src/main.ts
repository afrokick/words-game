import './app.css';
import App from './App.svelte';

const app = new App({
  target: document.getElementById('app')!,
});

export default app;

const updateFontSize = () => {
  const min = 0.6;
  const max = 1;
  const fontSize = Math.min(Math.max(window.innerHeight / 1080, min), max);
  document.documentElement.style.fontSize = fontSize + 'px';
};

window.addEventListener('resize', updateFontSize);

updateFontSize();