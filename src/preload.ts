// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import  { ipcRenderer, remote } from 'electron';
import delay from 'delay';

window.addEventListener("DOMContentLoaded", async () => {
  try {
    await delay(6 * 1000);
    ipcRenderer.send('ready');
  } catch (err) {
    console.log(err)
  } finally {
    await delay(500);
    remote.getCurrentWindow().show();
  }
});
