import { createApp } from 'vue'
import { IpcRendererEvent } from 'electron'
import App from './App.vue'
import 'element-plus/dist/index.css'


declare global {
  interface Window {
    onOpenUrl: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void
  }
}

const app = createApp(App)

app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
