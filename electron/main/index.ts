import { app, BrowserWindow, shell, IpcRendererEvent } from 'electron'
import { release } from 'os'
import { join } from 'path'
import createTray from './tray'
import initProtocol from './protocol'
import initMessageCenter from './message'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
let winWrapper = {
  value: null
}

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL as string
const indexHtml = join(ROOT_PATH.dist, 'index.html')


async function createWindow() {
  win = new BrowserWindow({
    title: '通知',
    // width: 1920,
    // height: 1080,
    // alwaysOnTop: true,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  winWrapper.value = win


  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }
  win.webContents.openDevTools()

  win.on('close', (e) => {
    if (!isAppQuitting) {
      e.preventDefault()
    }
    win.setSkipTaskbar(true)   // 取消任务栏显示
    win.hide();
  })



  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  return win
}

initProtocol(app, winWrapper)
app.setName('wallstreetcn')
app.whenReady().then(createWindow).then((win) => {
  createTray(win)
  initMessageCenter(win)
}).catch(console.error)



app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

let isAppQuitting = false
app.on('before-quit', () => {
  isAppQuitting = true;
})

declare global {
  interface Window {
    onOpenUrl: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void,
    onNewExamineMessage: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void,
  }
}

