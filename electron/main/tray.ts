import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron'
import { join } from 'path'
import { ROOT_PATH } from './index'

const createTray = (win: BrowserWindow) => {
  const image = nativeImage.createFromPath(join(ROOT_PATH.public, 'icons/icon.png')).resize({ width: 20, height: 20 })
  let tray = new Tray(image)
  const menu = Menu.buildFromTemplate([
        {
          click: () => {
            win.show()
          },
          label: '打开',
        },
        {
          click: () => {

          },
          label: '通知',
        },
        {
          click: () => {

          },
          label: '开机启动',
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
export const flashing = (tray: Tray) => {
  let count = 0
  const image = nativeImage.createFromPath(join(ROOT_PATH.public, 'icons/icon.png')).resize({ width: 20, height: 20 })
  const blankImage = nativeImage.createFromPath(join(ROOT_PATH.public, 'icons/blank.png')).resize({ width: 20, height: 20 })
  let intervalId = setInterval(() => {

    if (count % 2 === 0) {
      tray.setImage(image)
    } else {
      tray.setImage(blankImage)
    }
    count++
  }, 500)
  return () => {
    clearInterval(intervalId)
  }
}


export default createTray