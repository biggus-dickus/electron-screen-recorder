import { desktopCapturer, dialog, Menu } from 'electron'
import mime from 'mime-types'
import { writeFile } from 'node:fs'

export async function getVideoSources(windowInstance) {
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    })

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map((source) => ({
            label: source.name,
            click: () => windowInstance.webContents.send('SET_SOURCE', source)
        })
    ))

    videoOptionsMenu.popup()
}

export async function saveRecording(evt, videoBuffer, mimeType) {
    const d = new Date()

    const date = [
        d.getFullYear(),
        (d.getMonth() + 1).toString().padStart(2, '0'),
        d.getDate().toString().padStart(2, '0'),
    ].join('-')

    const time = [
        d.getHours().toString().padStart(2, '0'),
        d.getMinutes().toString().padStart(2, '0'),
        d.getSeconds().toString().padStart(2, '0'),
    ].join(':')

    const ext = mime.extension(mimeType)

    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save',
        defaultPath: `capture_${date}_${time}.${ext || 'mp4'}`,
    })

    if (filePath) {
        writeFile(filePath, videoBuffer, () => console.info(`Video saved to ${filePath}`))
    }
}
