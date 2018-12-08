const ipc = require('electron').ipcRenderer;
const titlebarCtrlBtnMin = document.querySelector(".titlebar-control__button--min");
const titlebarCtrlBtnMax = document.querySelector(".titlebar-control__button--max");
const titlebarCtrlBtnExit = document.querySelector(".titlebar-control__button--exit");

titlebarCtrlBtnMax.addEventListener('click', () => {
    console.log('hello vscode!');
    ipc.send('window-max');

});
titlebarCtrlBtnMin.addEventListener('click', () => {
    console.log('hello vscode!');
    ipc.send('window-min');

});
titlebarCtrlBtnExit.addEventListener('click', () => {
    configuration.volume=audio.volume;
    configuration.id=controller.id;
    configuration.currentTime=audio.currentTime;
    fs.writeFileSync("./resources/configuration.json", JSON.stringify(configuration));
    console.log('hello vscode!');
    ipc.send('window-close');
});