/**
 * ==========================================
 * STRANGER THINGS - SCROLL CINEMATIC WEBSITE
 * JavaScript Controller
 * ==========================================
 * 
 * Features:
 * - Scroll-based reveals with IntersectionObserver
 * - Hero fade-out on scroll
 * - Alphabet wall message spelling
 * - Horizontal glitch slices
 * - Particle system
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    messages: ['RUN', 'HIDE', 'IT IS HERE'],
    timing: {
        letterDelay: 350,
        messagePause: 1200,
        particleSpawnRate: 500
    },
    particles: {
        count: 20,
        minDuration: 12,
        maxDuration: 20
    }
};

// ==================== DOM ELEMENTS ====================
const DOM = {
    // Hero
    heroSection: document.getElementById('heroSection'),
    logoWrapper: document.getElementById('logoWrapper'),
    logoGlow: document.getElementById('logoGlow'),
    scrollPrompt: document.getElementById('scrollPrompt'),
    glitchSlices: document.getElementById('glitchSlices'),

    // Sections
    aboutSection: document.getElementById('aboutSection'),
    charactersSection: document.getElementById('charactersSection'),
    alphabetSection: document.getElementById('alphabetSection'),
    upsideDownSection: document.getElementById('upsideDownSection'),
    portalSection: document.getElementById('portalSection'),
    endingSection: document.getElementById('endingSection'),

    // Alphabet
    alphabetWall: document.getElementById('alphabetWall'),
    messageDisplay: document.getElementById('messageDisplay'),

    // Portal
    portalCrack: document.getElementById('portalCrack'),
    portalGlow: document.getElementById('portalGlow'),

    // Ending
    credits: document.getElementById('credits'),

    // Overlays
    scanlines: document.getElementById('scanlines'),
    staticNoise: document.getElementById('staticNoise'),

    // UI
    scrollProgress: document.getElementById('scrollProgress'),
    toggleBtn: document.getElementById('toggleBtn'),
    particlesContainer: document.getElementById('particlesContainer')
};

// ==================== STATE ====================
const state = {
    isUpsideDown: false,
    alphabetTriggered: false,
    portalOpened: false,
    creditsShown: false,
    letterElements: [],
    glitchSliceInterval: null
};

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔴 Stranger Things Website Loaded');

    // Setup components
    createAlphabetWall();
    createParticles();
    createGlitchSlices();

    // Setup scroll handling
    setupScrollProgress();
    setupHeroScroll();
    setupIntersectionObservers();

    // Setup UI
    setupToggle();
});

// ==================== GLITCH SLICES ====================

/**
 * Create horizontal glitch slice elements
 */
function createGlitchSlices() {
    const container = DOM.glitchSlices;
    const sliceCount = 8;

    for (let i = 0; i < sliceCount; i++) {
        const slice = document.createElement('div');
        slice.className = 'glitch-slice';
        slice.style.top = `${10 + (i * 10)}%`;
        slice.style.animationDelay = `${i * 0.1}s`;
        container.appendChild(slice);
    }

    // Randomly trigger glitch slices
    setInterval(triggerGlitchSlices, 3000);
}

/**
 * Trigger random glitch slices
 */
function triggerGlitchSlices() {
    const slices = DOM.glitchSlices.querySelectorAll('.glitch-slice');

    slices.forEach((slice, i) => {
        if (Math.random() > 0.5) {
            slice.style.opacity = '0.4';
            slice.style.height = `${2 + Math.random() * 4}px`;
            slice.style.transform = `translateX(${(Math.random() - 0.5) * 10}px)`;

            setTimeout(() => {
                slice.style.opacity = '0';
                slice.style.transform = 'translateX(0)';
            }, 100 + Math.random() * 150);
        }
    });
}

// ==================== SCROLL PROGRESS ====================

function setupScrollProgress() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = (scrollTop / docHeight) * 100;
        DOM.scrollProgress.style.width = `${percent}%`;
    }, { passive: true });
}

// ==================== HERO SCROLL BEHAVIOR ====================

/**
 * Setup hero fade-out on scroll
 */
function setupHeroScroll() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;
        const scrollPercent = Math.min(scrollY / (heroHeight * 0.5), 1);

        // Fade out logo and glow
        DOM.logoWrapper.style.opacity = 1 - scrollPercent;
        DOM.logoGlow.style.opacity = (1 - scrollPercent) * 0.6;

        // Fade out scroll prompt faster
        DOM.scrollPrompt.style.opacity = Math.max(0, 1 - (scrollPercent * 2));

    }, { passive: true });
}

// ==================== INTERSECTION OBSERVERS ====================

function setupIntersectionObservers() {
    // Reveal observer for elements
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all reveal elements
    document.querySelectorAll('.story-line, .feature-card, .character-item, .section-title, .warning-text').forEach(el => {
        revealObserver.observe(el);
    });

    // Section observer for special triggers
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    handleSectionEnter(entry.target);
                } else {
                    handleSectionLeave(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    // Observe sections
    [DOM.alphabetSection, DOM.upsideDownSection, DOM.portalSection, DOM.endingSection].forEach(section => {
        if (section) sectionObserver.observe(section);
    });
}

/**
 * Handle section enter
 */
function handleSectionEnter(section) {
    const id = section.id;

    switch (id) {
        case 'alphabetSection':
            if (!state.alphabetTriggered) {
                state.alphabetTriggered = true;
                startAlphabetAnimation();
            }
            break;

        case 'upsideDownSection':
            section.querySelector('.glitch-text')?.classList.add('active');
            break;

        case 'portalSection':
            if (!state.portalOpened) {
                state.portalOpened = true;
                openPortal();
            }
            break;

        case 'endingSection':
            if (!state.creditsShown) {
                state.creditsShown = true;
                showCredits();
            }
            break;
    }
}

/**
 * Handle section leave
 */
function handleSectionLeave(section) {
    const id = section.id;

    if (id === 'upsideDownSection') {
        section.querySelector('.glitch-text')?.classList.remove('active');
    }
}

// ==================== PARTICLES ====================

function createParticles() {
    const { count, minDuration, maxDuration } = CONFIG.particles;

    for (let i = 0; i < count; i++) {
        createParticle(i * 200);
    }

    setInterval(() => createParticle(0), CONFIG.timing.particleSpawnRate);
}

function createParticle(delay) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const left = Math.random() * 100;
    const duration = CONFIG.particles.minDuration + Math.random() *
        (CONFIG.particles.maxDuration - CONFIG.particles.minDuration);
    const size = 2 + Math.random() * 3;

    particle.style.cssText = `
        left: ${left}%;
        bottom: -10px;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}ms;
    `;

    DOM.particlesContainer.appendChild(particle);

    setTimeout(() => particle.remove(), (duration * 1000) + delay + 500);
}

// ==================== ALPHABET WALL ====================

function createAlphabetWall() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    state.letterElements = [];

    alphabet.split('').forEach(letter => {
        const container = document.createElement('div');
        container.className = 'letter-container';
        container.dataset.letter = letter;

        const bulb = document.createElement('div');
        bulb.className = 'letter-bulb';

        const char = document.createElement('span');
        char.className = 'letter-char';
        char.textContent = letter;

        container.appendChild(bulb);
        container.appendChild(char);
        DOM.alphabetWall.appendChild(container);

        state.letterElements.push({ letter, container, bulb, char });
    });
}

function lightUp(letter) {
    const data = state.letterElements.find(l => l.letter === letter.toUpperCase());
    if (data) {
        data.container.classList.add('active');
        data.bulb.classList.add('lit');
    }
}

function turnOff(letter) {
    const data = state.letterElements.find(l => l.letter === letter.toUpperCase());
    if (data) {
        data.container.classList.remove('active');
        data.bulb.classList.remove('lit');
    }
}

function turnOffAll() {
    state.letterElements.forEach(d => {
        d.container.classList.remove('active');
        d.bulb.classList.remove('lit');
    });
}

function randomFlicker() {
    const count = 2 + Math.floor(Math.random() * 3);
    const letters = [...state.letterElements].sort(() => Math.random() - 0.5).slice(0, count);

    letters.forEach(d => {
        d.bulb.classList.add('lit');
        setTimeout(() => d.bulb.classList.remove('lit'), 80 + Math.random() * 120);
    });
}

async function spellMessage(msg) {
    DOM.messageDisplay.textContent = '';
    turnOffAll();

    let display = '';

    for (const char of msg) {
        if (char === ' ') {
            display += ' ';
            DOM.messageDisplay.textContent = display;
            await sleep(CONFIG.timing.letterDelay);
            continue;
        }

        lightUp(char);
        display += char;
        DOM.messageDisplay.textContent = display;

        if (Math.random() > 0.6) randomFlicker();

        await sleep(CONFIG.timing.letterDelay);
        setTimeout(() => turnOff(char), CONFIG.timing.letterDelay * 2);
    }

    await sleep(CONFIG.timing.messagePause);
}

async function startAlphabetAnimation() {
    console.log('🔤 Alphabet animation started');

    // Initial flickers
    for (let i = 0; i < 5; i++) {
        randomFlicker();
        await sleep(200);
    }

    // Spell messages
    for (const msg of CONFIG.messages) {
        await spellMessage(msg);
        await sleep(300);
    }

    // Final flickers
    for (let i = 0; i < 3; i++) {
        randomFlicker();
        await sleep(150);
    }

    turnOffAll();
    DOM.messageDisplay.textContent = '';
}

// ==================== PORTAL ====================

function openPortal() {
    console.log('🕳️ Portal opening');
    DOM.portalGlow.classList.add('active');
    setTimeout(() => DOM.portalCrack.classList.add('opening'), 300);
}

// ==================== CREDITS ====================

function showCredits() {
    console.log('🎬 Showing credits');
    DOM.staticNoise.classList.add('active');
    setTimeout(() => DOM.credits.classList.add('visible'), 400);
}

// ==================== TOGGLE ====================

function setupToggle() {
    DOM.toggleBtn.addEventListener('click', () => {
        state.isUpsideDown = !state.isUpsideDown;
        document.body.classList.toggle('upside-down', state.isUpsideDown);
        console.log(state.isUpsideDown ? '🙃 Upside Down' : '😊 Normal');
    });

    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 'u') {
            DOM.toggleBtn.click();
        }
    });
}

// ==================== UTILITIES ====================

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// Debug
window.strangerThings = { state, CONFIG, spellMessage, lightUp, turnOff };
console.log('💡 Debug: window.strangerThings');
