import DB from './store'
import { BrowserWindow, ipcMain } from 'electron'
import { flashing } from './tray'


const initMessageCenter = (win: BrowserWindow) => {
  let close
  ipcMain.on('examine-message', () => {
    if (!(win.isFocused() && win.isVisible())) {
      if (!close) {
        close = flashing()
      }
    }

    if (DB.get('notification')) {
      win.show()
      win.focus()
    }
  })

  win.on('focus', () => {
    close && close()
    close = null
  })
}

export default initMessageCenter