import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'

import { getVideoSources, saveRecording } from './handler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

ipcMain.handle('dark-mode:toggle', () => {
    nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
    return nativeTheme.shouldUseDarkColors
})

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    mainWindow.loadFile(path.join(__dirname, 'index.html'))
    !app.isPackaged && mainWindow.webContents.openDevTools()

    ipcMain.handle('screenRecorder:getVideoSources', () => getVideoSources(mainWindow))
    ipcMain.handle('screenRecorder:save', saveRecording)
}

(async function main() {
    await app.whenReady()
    createWindow()

    app.on('activate', () => {
        if (!BrowserWindow.getAllWindows().length) createWindow()
    })
})()

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
