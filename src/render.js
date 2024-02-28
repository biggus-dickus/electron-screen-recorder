const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')
const srcBtn = document.getElementById('srcBtn')
const themeBtn = document.getElementById('toggleBtn')

if (startBtn) {
    startBtn.onclick = async () => {
        await window.screenRecorder.start()
        startBtn.disabled = true
        stopBtn.disabled = false
        srcBtn.disabled = true
        startBtn.innerText = 'Recording…'
    }
}

if (stopBtn) {
    stopBtn.onclick = async () => {
        await window.screenRecorder.stop()
        startBtn.innerText = 'Start recording'
        startBtn.disabled = false
        stopBtn.disabled = true
        srcBtn.disabled = false
    }
}

if (srcBtn) {
    srcBtn.onclick = async () => {
        await window.screenRecorder.getVideoSources()
        startBtn.disabled = false
    }
}

if (themeBtn) {
    themeBtn.onclick = async () => {
        const isDarkMode = await window.darkMode.toggle()
        themeBtn.innerText = isDarkMode ? 'Dark' : 'Light'
    }
}
