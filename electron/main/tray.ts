import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron'
import { join } from 'path'
import { ROOT_PATH } from './index'
import DB from './store'

let tray
const createTray = (win: BrowserWindow) => {
  const image = nativeImage.createFromPath(join(ROOT_PATH.public, 'icons/icon.png')).resize({ width: 20, height: 20 })
  tray = new Tray(image)
  const options = app.getLoginItemSettings()
  const menu = Menu.buildFromTemplate([
        {
          click: () => {
            win.show()
          },
          label: '打开',
        },
        {
          click: () => {
            const checked = Boolean(DB.get('notification'))
            DB.set('notification', !checked)
          },
          label: '通知',
          type: 'checkbox',
          checked: Boolean(DB.get('notification')),
        },
        {
          click: () => {
            const options = app.getLoginItemSettings()
            app.setLoginItemSettings({
              openAtLogin: !options.openAtLogin,
            })
            menu.items[2].checked = !options.openAtLogin
          },
          label: '开机启动',
          checked: options.openAtLogin,
          type: 'checkbox'
        },
        {
          label: '退出',
          click: () => {
            win.destroy()
            app.quit()
          }
        }
      ])
  tray.setToolTip('华尔街见闻')
  tray.setContextMenu(menu)

  return tray
}

export const flashing = () => {
  let intervalId

  let count = 0
  const image = nativeImage.createFromPath(join(ROOT_PATH.public, 'icons/icon.png')).resize({ width: 20, height: 20 })
  const blankImage = nativeImage.createFromPath(join(ROOT_PATH.public, 'icons/blank.png')).resize({ width: 20, height: 20 })
  intervalId = setInterval(() => {

    if (count % 2 === 0) {
      tray.setImage(image)
    } else {
      tray.setImage(blankImage)
    }
    count++
  }, 500)

  return () => {
    clearInterval(intervalId)
    intervalId = null
    tray.setImage(image)
  }
}


export default createTray