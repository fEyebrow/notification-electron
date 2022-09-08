import Store from 'electron-store'
import { ipcMain, BrowserWindow } from 'electron'

const DB = new Store();
export default DB
// const COOKIES_KEY = 'COOKIES'

// function listenCookies(win: BrowserWindow) {
//   let isCookiesChanged = false;
//   win.webContents.session.cookies.on('changed', () => {
//       //检测cookies变动事件，标记cookies发生变化
//       isCookiesChanged = true;
//   });

//   setInterval(() => {
//     if (!isCookiesChanged) {
//         return;
//     }
//     win.webContents.session.cookies.get({})
//       .then((cookies) => {
//           store.set(COOKIES_KEY, cookies);
//       })
//       .catch((error) => {
//         console.error(error)
//       })
//       .finally(() => {
//           isCookiesChanged = false;
//       })
//   }, 500);
// }

// function recoverCookies(win: BrowserWindow) {
//   const cookies = store.get(COOKIES_KEY) as Electron.Cookie[];
//   if (cookies) {
//     cookies.forEach((cookie: any) => {
//       win.webContents.session.cookies.set(cookie)
//         .catch((error) => {
//           console.error(error)
//         })
//     })
//   }
// }
