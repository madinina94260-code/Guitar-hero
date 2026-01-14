const audio = document.getElementById('game-audio');
const startBtn = document.getElementById('start-btn');
const scoreEl = document.getElementById('score');
const comboEl = document.getElementById('combo');
const fretboard = document.getElementById('fretboard');
const lines = [
    document.getElementById('line-0'),
    document.getElementById('line-1'),
    document.getElementById('line-2'),
    document.getElementById('line-3')
];

const keysMap = { d: 0, f: 1, j: 2, k: 3 };
const heldKeys = { d: false, f: false, j: false, k: false };

let score = 0;
let combo = 0;
let activeNotes = [];
let isRecording = false;
let recordedData = [];
let currentLevel = [];

// --- CONFIGURATION ---
const NOTE_TRAVEL_TIME = 0.8; 
const HIT_WINDOW = 0.12;      
const HIT_Y = 520;
const SPAWN_Y = -40;

// --- TA BEATMAP ---
const RAW_BEATMAP = [{"time":3.244,"line":1},{"time":3.577,"line":0},{"time":3.867,"line":1},{"time":4.216,"line":1},{"time":4.908,"line":1},{"time":6.35,"line":2},{"time":6.422,"line":2},{"time":6.5,"line":2},{"time":6.864,"line":2},{"time":7.234,"line":1},{"time":8.291,"line":1},{"time":8.649,"line":1},{"time":9.025,"line":0},{"time":9.337,"line":1},{"time":9.669,"line":2},{"time":10.007,"line":3},{"time":10.337,"line":0},{"time":10.655,"line":2},{"time":11.014,"line":1},{"time":11.353,"line":3},{"time":11.717,"line":2},{"time":12.051,"line":0},{"time":12.434,"line":3},{"time":12.765,"line":1},{"time":13.102,"line":2},{"time":13.418,"line":0},{"time":13.782,"line":3},{"time":14.091,"line":1},{"time":14.462,"line":2},{"time":14.804,"line":0},{"time":15.168,"line":3},{"time":15.478,"line":1},{"time":15.811,"line":2},{"time":16.138,"line":0},{"time":16.525,"line":3},{"time":16.855,"line":1},{"time":17.198,"line":2},{"time":17.532,"line":0},{"time":17.914,"line":3},{"time":18.246,"line":1},{"time":18.581,"line":2},{"time":18.901,"line":0},{"time":19.27,"line":3},{"time":19.622,"line":1},{"time":19.953,"line":2},{"time":20.307,"line":0},{"time":20.629,"line":3},{"time":20.984,"line":1},{"time":21.346,"line":2},{"time":21.688,"line":0},{"time":22.047,"line":3},{"time":22.342,"line":0},{"time":22.672,"line":2},{"time":23.021,"line":0},{"time":23.357,"line":3},{"time":23.691,"line":1},{"time":24.031,"line":2},{"time":24.382,"line":0},{"time":24.759,"line":3},{"time":25.12,"line":3},{"time":25.45,"line":0},{"time":25.793,"line":2},{"time":26.119,"line":1},{"time":26.465,"line":3},{"time":26.803,"line":2},{"time":26.874,"line":3},{"time":27.18,"line":0},{"time":27.514,"line":2},{"time":27.847,"line":3},{"time":27.862,"line":1},{"time":27.87,"line":2},{"time":28.203,"line":1},{"time":28.738,"line":3},{"time":28.956,"line":0},{"time":29.247,"line":2},{"time":29.55,"line":1},{"time":29.873,"line":0},{"time":29.896,"line":3},{"time":30.258,"line":1},{"time":30.288,"line":2},{"time":30.583,"line":0},{"time":30.614,"line":3},{"time":30.953,"line":1},{"time":30.977,"line":2},{"time":31.319,"line":0},{"time":31.331,"line":3},{"time":31.694,"line":3},{"time":32.01,"line":0},{"time":32.36,"line":2},{"time":32.659,"line":1},{"time":33.025,"line":0},{"time":33.053,"line":3},{"time":33.342,"line":1},{"time":33.361,"line":2},{"time":33.716,"line":3},{"time":34.041,"line":2},{"time":34.381,"line":3},{"time":34.739,"line":2},{"time":35.07,"line":0},{"time":35.412,"line":3},{"time":35.737,"line":1},{"time":36.124,"line":2},{"time":36.474,"line":0},{"time":36.794,"line":3},{"time":37.104,"line":1},{"time":37.431,"line":0},{"time":37.478,"line":3},{"time":37.799,"line":1},{"time":37.839,"line":2},{"time":38.129,"line":0},{"time":38.152,"line":3},{"time":38.472,"line":1},{"time":38.518,"line":2},{"time":38.829,"line":3},{"time":39.184,"line":2},{"time":39.436,"line":2},{"time":39.824,"line":3},{"time":40.351,"line":3},{"time":40.376,"line":3},{"time":40.41,"line":3},{"time":40.505,"line":1},{"time":41.041,"line":1},{"time":41.075,"line":1},{"time":41.099,"line":1},{"time":41.132,"line":1},{"time":41.281,"line":2},{"time":41.793,"line":2},{"time":41.832,"line":2},{"time":41.87,"line":2},{"time":41.958,"line":0},{"time":42.48,"line":0},{"time":42.512,"line":0},{"time":42.602,"line":3},{"time":43.14,"line":3},{"time":43.162,"line":3},{"time":43.199,"line":3},{"time":43.285,"line":0},{"time":43.642,"line":2},{"time":43.977,"line":0},{"time":44.128,"line":3},{"time":44.317,"line":0},{"time":44.497,"line":2},{"time":44.671,"line":0},{"time":44.843,"line":3},{"time":45.012,"line":1},{"time":45.171,"line":2},{"time":45.342,"line":0},{"time":45.699,"line":3},{"time":46.045,"line":3},{"time":46.196,"line":0},{"time":46.363,"line":2},{"time":46.525,"line":0},{"time":46.698,"line":3},{"time":47.058,"line":1},{"time":47.395,"line":0},{"time":47.543,"line":2},{"time":47.714,"line":0},{"time":47.848,"line":3},{"time":48.041,"line":1},{"time":48.398,"line":0},{"time":48.8,"line":2},{"time":48.989,"line":2},{"time":49.188,"line":3},{"time":49.469,"line":1},{"time":49.619,"line":3},{"time":49.731,"line":0},{"time":49.792,"line":2},{"time":49.886,"line":1},{"time":49.979,"line":3},{"time":50.094,"line":0},{"time":50.155,"line":2},{"time":50.267,"line":1},{"time":50.342,"line":3},{"time":50.461,"line":0},{"time":50.517,"line":2},{"time":50.632,"line":1},{"time":50.723,"line":3},{"time":50.816,"line":0},{"time":50.871,"line":2},{"time":51.178,"line":1},{"time":51.563,"line":3},{"time":51.64,"line":0},{"time":51.838,"line":2},{"time":51.989,"line":1},{"time":52.171,"line":3},{"time":52.506,"line":0},{"time":52.856,"line":1},{"time":53.216,"line":0},{"time":53.557,"line":1},{"time":53.607,"line":2},{"time":53.903,"line":0},{"time":53.925,"line":3},{"time":54.247,"line":1},{"time":54.273,"line":2},{"time":54.569,"line":0},{"time":54.606,"line":3},{"time":54.934,"line":1},{"time":54.96,"line":2},{"time":55.275,"line":1},{"time":55.297,"line":2},{"time":55.641,"line":1},{"time":55.665,"line":2},{"time":55.963,"line":0},{"time":55.996,"line":3},{"time":56.299,"line":1},{"time":56.329,"line":2},{"time":56.631,"line":0},{"time":56.676,"line":3},{"time":56.972,"line":1},{"time":57.018,"line":2},{"time":57.306,"line":0},{"time":57.337,"line":3},{"time":57.653,"line":1},{"time":57.684,"line":2},{"time":58.007,"line":3},{"time":58.377,"line":2},{"time":58.725,"line":0},{"time":59.07,"line":3},{"time":59.403,"line":1},{"time":59.766,"line":2},{"time":60.084,"line":0},{"time":60.421,"line":3},{"time":60.776,"line":0},{"time":61.168,"line":2},{"time":61.486,"line":1},{"time":61.832,"line":3},{"time":62.193,"line":0},{"time":62.507,"line":2},{"time":62.847,"line":1},{"time":63.141,"line":0},{"time":63.183,"line":3},{"time":63.496,"line":1},{"time":63.518,"line":2},{"time":63.846,"line":0},{"time":63.854,"line":3},{"time":64.181,"line":1},{"time":64.217,"line":2},{"time":64.513,"line":0},{"time":64.568,"line":3},{"time":64.89,"line":1},{"time":64.905,"line":2},{"time":65.229,"line":0},{"time":65.241,"line":3},{"time":65.553,"line":1},{"time":65.589,"line":2},{"time":65.947,"line":3},{"time":66.288,"line":2},{"time":66.643,"line":3},{"time":66.963,"line":2},{"time":67.3,"line":0},{"time":67.621,"line":3},{"time":68.008,"line":2}];

// --- GÉNÉRATEUR DE SON MISS AMÉLIORÉ ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playMissSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // On utilise deux oscillateurs pour un son plus riche et fort
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Oscillateur 1 : Grincement aigu
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.3);

    // Oscillateur 2 : Impact grave (donne du "corps" au son)
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(80, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.3);

    // Volume Boosté (0.4 au lieu de 0.15)
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.3);
    osc2.stop(audioCtx.currentTime + 0.3);
}

// --- SYSTÈME VISUEL ---
function createParticles(lineIndex, isSuccess) {
    const parent = lines[lineIndex];
    const color = isSuccess ? '#fff000' : '#ff0000';
    const particleCount = isSuccess ? 12 : 8;

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.top = HIT_Y + 'px';
        p.style.left = '50%';
        const size = isSuccess ? (Math.random() * 12 + 6) : (Math.random() * 10 + 6);
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.backgroundColor = color;
        p.style.borderRadius = '50%';
        p.style.pointerEvents = 'none';
        p.style.zIndex = '100';
        p.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        parent.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const velocity = isSuccess ? (Math.random() * 180 + 70) : (Math.random() * 100 + 40);
        const destinationX = Math.cos(angle) * velocity;
        const destinationY = Math.sin(angle) * velocity;

        const anim = p.animate([
            { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 1 },
            { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(0)`, opacity: 0 }
        ], {
            duration: isSuccess ? 600 : 800,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });

        anim.onfinish = () => p.remove();
    }
}

function triggerMissEffect() {
    fretboard.classList.add('miss-flash', 'shake-heavy');
    playMissSound(); 

    setTimeout(() => {
        fretboard.classList.remove('miss-flash', 'shake-heavy');
    }, 200);
}

// --- LOGIQUE DE NETTOYAGE ---
function cleanBeatmap(data) {
    if (data.length === 0) return [];
    data.sort((a, b) => a.time - b.time);
    let cleaned = [data[0]];
    for (let i = 1; i < data.length; i++) {
        let current = data[i];
        let last = cleaned[cleaned.length - 1];
        if (current.time - last.time < 0.05) current.time = last.time;
        cleaned.push(current);
    }
    return cleaned;
}

function updateAudioStatus() {
    if (isRecording) { audio.volume = 1.0; return; }
    audio.volume = (combo === 0 && audio.currentTime > 0.5) ? 0.3 : 1.0;
}

// --- INPUTS CLAVIER ---
window.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (!(key in keysMap)) return;
    if (heldKeys[key]) return;

    heldKeys[key] = true;
    const lineIndex = keysMap[key];
    visualKeyFeedback(key, true);

    if (isRecording) {
        recordedData.push({ time: Number(audio.currentTime.toFixed(3)), line: lineIndex, startTime: audio.currentTime });
    } else {
        tryHit(lineIndex);
    }

    if (key === 'r') { isRecording = true; recordedData = []; startNewGame(true); }
    if (key === 's' && isRecording) {
        isRecording = false; audio.pause();
        console.log("JSON Nettoyé :", JSON.stringify(cleanBeatmap(recordedData)));
    }
});

window.addEventListener('keyup', e => {
    const key = e.key.toLowerCase();
    if (!(key in keysMap)) return;
    heldKeys[key] = false;
    visualKeyFeedback(key, false);

    if (isRecording) {
        let lastNote = recordedData.findLast(n => n.line === keysMap[key]);
        if (lastNote && !lastNote.duration) {
            let duration = audio.currentTime - lastNote.startTime;
            if (duration > 0.2) lastNote.duration = Number(duration.toFixed(3));
            delete lastNote.startTime;
        }
    }
});

// --- INPUTS TACTILES (MOBILE) ---
lines.forEach((lineEl, lineIndex) => {
    // Correspondance entre l'index de ligne et la touche
    const keyForLine = Object.keys(keysMap).find(k => keysMap[k] === lineIndex);
    
    lineEl.addEventListener('touchstart', e => {
        e.preventDefault();
        if (heldKeys[keyForLine]) return;
        
        heldKeys[keyForLine] = true;
        visualKeyFeedback(keyForLine, true);
        
        if (isRecording) {
            recordedData.push({ time: Number(audio.currentTime.toFixed(3)), line: lineIndex, startTime: audio.currentTime });
        } else {
            tryHit(lineIndex);
        }
    }, { passive: false });
    
    lineEl.addEventListener('touchend', e => {
        e.preventDefault();
        heldKeys[keyForLine] = false;
        visualKeyFeedback(keyForLine, false);
        
        if (isRecording) {
            let lastNote = recordedData.findLast(n => n.line === lineIndex);
            if (lastNote && !lastNote.duration) {
                let duration = audio.currentTime - lastNote.startTime;
                if (duration > 0.2) lastNote.duration = Number(duration.toFixed(3));
                delete lastNote.startTime;
            }
        }
    }, { passive: false });
});

function visualKeyFeedback(key, active) {
    const keyEl = document.querySelector(`.key[data-key="${key}"]`);
    if (active) keyEl.classList.add('active');
    else keyEl.classList.remove('active');
}

// --- BOUCLE DE JEU ---
function gameLoop() {
    if (audio.paused) return;
    const now = audio.currentTime;

    if (!isRecording) {
        while (currentLevel.length && currentLevel[0].time - NOTE_TRAVEL_TIME <= now) {
            spawnNote(currentLevel.shift());
        }
        updateAudioStatus();
    }

    activeNotes = activeNotes.filter(note => {
        const noteTime = parseFloat(note.dataset.time);
        const duration = parseFloat(note.dataset.duration || 0);
        const delta = noteTime - now;
        const progress = 1 - (delta / NOTE_TRAVEL_TIME);
        const y = SPAWN_Y + progress * (HIT_Y - SPAWN_Y);
        note.style.top = y + 'px';

        if (note.dataset.isHeld === "true") {
            const lineKey = Object.keys(keysMap).find(key => keysMap[key] == note.dataset.line);
            if (heldKeys[lineKey]) {
                score += 0.5;
                scoreEl.textContent = Math.floor(score);
                if (Math.random() > 0.6) createParticles(note.dataset.line, true);
            } else {
                note.dataset.isHeld = "false";
                note.style.opacity = "0.5";
                resetCombo(note.dataset.line); 
            }
        }

        if (now > noteTime + duration + 0.1) {
            if (note.dataset.hit !== "true") resetCombo(note.dataset.line);
            note.remove();
            return false;
        }

        return true;
    });

    requestAnimationFrame(gameLoop);
}

function spawnNote(noteData) {
    const note = document.createElement('div');
    note.className = 'note';
    note.dataset.time = noteData.time;
    note.dataset.line = noteData.line;
    note.dataset.duration = noteData.duration || 0;
    if (noteData.duration > 0) {
        const body = document.createElement('div');
        body.className = 'note-body';
        body.style.height = (noteData.duration / NOTE_TRAVEL_TIME) * (HIT_Y - SPAWN_Y) + 'px';
        note.appendChild(body);
    }
    lines[noteData.line].appendChild(note);
    activeNotes.push(note);
}

function tryHit(line) {
    const now = audio.currentTime;
    let hitSomething = false;
    for (let note of activeNotes) {
        if (parseInt(note.dataset.line) !== line || note.dataset.hit === "true") continue;
        const noteTime = parseFloat(note.dataset.time);
        if (Math.abs(noteTime - now) <= HIT_WINDOW) {
            note.dataset.hit = "true";
            createParticles(line, true); 
            if (parseFloat(note.dataset.duration) > 0) {
                note.dataset.isHeld = "true";
                note.style.background = "#00ffcc";
            } else {
                note.remove();
                activeNotes = activeNotes.filter(n => n !== note);
            }
            updateScore();
            hitSomething = true;
            break;
        }
    }
    if (!hitSomething && !isRecording) resetCombo(line);
}

function updateScore() {
    combo++;
    score += 10;
    scoreEl.textContent = Math.floor(score);
    comboEl.textContent = combo;
    fretboard.classList.add('shake');
    setTimeout(() => fretboard.classList.remove('shake'), 50);
}

function resetCombo(lineIndex) {
    createParticles(lineIndex, false); 
    triggerMissEffect(); 
    combo = 0;
    comboEl.textContent = 0;
}

function startNewGame(empty = false) {
    score = 0; combo = 0;
    scoreEl.textContent = "0"; comboEl.textContent = "0";
    activeNotes.forEach(n => n.remove());
    activeNotes = [];
    currentLevel = empty ? [] : cleanBeatmap(JSON.parse(JSON.stringify(RAW_BEATMAP)));
    startBtn.style.display = 'none';
    audio.currentTime = 0;
    audio.play();
    requestAnimationFrame(gameLoop);
}

startBtn.addEventListener('click', () => startNewGame(false));