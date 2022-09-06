import path from 'path'
import { BrowserWindow } from 'electron'


const initProtocol = (app, windowWrapper: { value: BrowserWindow } ) => {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('wscn-notification', process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient('wscn-notification')
  }



  const gotTheLock = app.requestSingleInstanceLock()
  if (gotTheLock) {
    app.on('second-instance', (e, argv) => {

      if (windowWrapper.value) {
        if (windowWrapper.value.isMinimized()) windowWrapper.value.restore()
        windowWrapper.value.focus()
        sendMessage(argv.slice(1), windowWrapper.value)
      }
    })
  } else {
    app.quit()
    return
  }

  app.on('will-finish-launching', function() {
    // Protocol handler for osx
    app.on('open-url', function(event, url) {
      event.preventDefault()
      sendMessage(url, windowWrapper)
    })
  })
}

export function sendMessage(s, win) {
  if (win.value && win.value.webContents) {
    win.value.webContents.send('open-url', s)
  }
}

export default initProtocol