const { contextBridge, ipcRenderer } = require('electron/renderer')

const VIDEO_SELECTOR = 'video'
let mediaRecorder // MediaRecorder instance to capture footage
const recordedChunks = []

contextBridge.exposeInMainWorld('screenRecorder', {
    start: () => mediaRecorder?.start(),
    stop: () => mediaRecorder?.stop(),
    getVideoSources: () => ipcRenderer.invoke('screenRecorder:getVideoSources'),
})

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
})

const handleStop = async () => {
    if (mediaRecorder) {
        const blob = new Blob(recordedChunks, {
            type: mediaRecorder.mimeType,
        })

        const buffer = Buffer.from(await blob.arrayBuffer())
        ipcRenderer.invoke('screenRecorder:save', buffer, mediaRecorder.mimeType)
    }
}

ipcRenderer.on('SET_SOURCE', async (event, captureSource) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: captureSource.id,
                }
            }
        })

        const infoEl = document.querySelector('#videoSrc')
        if (infoEl) {
            infoEl.hidden = false
            infoEl.textContent = `Source: ${captureSource.name}`
        }

        const video = document.querySelector(VIDEO_SELECTOR)
        video.srcObject = stream
        video.onloadedmetadata = () => video.play()

        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.ondataavailable = (e) => recordedChunks.push(e.data)
        mediaRecorder.onstop = handleStop
    } catch (err) {
        console.error(err)
        alert(err.message)
    }
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})
