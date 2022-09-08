import { ipcRenderer } from 'electron'


window.onOpenUrl = (callback) => ipcRenderer.on('open-url', callback)


