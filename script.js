// DOM Elements
const cyclingTextElement = document.getElementById('cyclingText');
const stars = document.getElementById('stars');
const transmissionStatus = document.querySelector('.transmission-status');
const systemStatus = document.querySelector('.system-status');
const buttons = document.querySelector('.transmission-buttons');
const buttonsContainer = document.querySelector('.buttons-container');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const earth = document.getElementById('earth');
const signalOverload = document.getElementById('signalOverload');
const scrollingContainer = document.getElementById('scrollingContainer');
const hudTop = document.querySelector('.hud-top');
const introContainer = document.getElementById('introContainer');
const scannerStatus = document.getElementById('scannerStatus');
const signalDetection = document.getElementById('signalDetection');
const investigateBtn = document.getElementById('investigateBtn');
const lostSignal = document.getElementById('lostSignal');
const startOverBtn = document.getElementById('startOverBtn');

// State Variables
let isWaitingForResponse = false;
let currentTransmissionIndex = 0;
let earthDistance = 0; // -5 to +10, where 0 is starting position, negative is farther, positive is closer
let isSignalOverloadMode = false;
let isLostSignalMode = false;
let isIntroMode = true;
let scrollingInterval;

// Create Starfield
function createStars() {
    const numStars = 200;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Scatter stars with margins: 5% from edges, 15% from bottom
        star.style.left = (5 + Math.random() * 90) + '%'; // 5% to 95%
        star.style.top = (5 + Math.random() * 80) + '%';  // 5% to 85%
        
        // Create varied star sizes
        const sizeVariation = Math.random();
        let size;
        if (sizeVariation < 0.1) {
            size = Math.random() * 2 + 2; // Big stars (4-6px)
        } else if (sizeVariation < 0.3) {
            size = Math.random() * 1.5 + 1; // Medium stars (2.5-4px)
        } else {
            size = Math.random() * 1.5 + 0.5; // Small stars (0.5-2px)
        }
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Vary animation delays
        star.style.animationDelay = Math.random() * 120 + 's';
        
        // Add variation in brightness
        const brightness = Math.random();
        if (brightness < 0.2) {
            star.style.opacity = '0.5';
        } else if (brightness < 0.8) {
            star.style.opacity = '0.8';
        } else {
            star.style.opacity = '1';
        }
        
        stars.appendChild(star);
    }
}

// Intro Sequence Functions
function startIntroSequence() {
    // Hide main game elements
    document.querySelector('.container').style.display = 'none';
    buttonsContainer.style.display = 'none';
    hudTop.style.display = 'none';
    
    // Show intro elements
    introContainer.style.display = 'block';
    
    // After 3 seconds, show signal detection
    setTimeout(() => {
        signalDetection.style.display = 'block';
        
        // After 2 more seconds, show investigate button
        setTimeout(() => {
            investigateBtn.style.display = 'block';
        }, 2000);
    }, 3000);
}

function startMainGame() {
    isIntroMode = false;
    
    // Hide intro elements
    introContainer.style.display = 'none';
    
    // Show main game elements
    document.querySelector('.container').style.display = 'flex';
    hudTop.style.display = 'flex';
    
    // Make sure buttons container is ready to be shown when needed
    buttonsContainer.style.display = 'none'; // Hidden until transmission completes
    
    // Start the first transmission cycle
    startTransmissionCycle();
}

// Restart Functionality
function restartExperience() {
    // Reset all state variables
    isWaitingForResponse = false;
    currentTransmissionIndex = 0;
    earthDistance = 0;
    isSignalOverloadMode = false;
    isLostSignalMode = false;
    isIntroMode = true;
    
    // Clear any intervals
    if (scrollingInterval) {
        clearInterval(scrollingInterval);
        scrollingInterval = null;
    }
    
    // Reset earth appearance
    updateEarthDistance();
    
    // Clear signal overload content
    scrollingContainer.innerHTML = '';
    
    // Clear lost signal content
    lostSignal.innerHTML = '';
    
    // Hide all mode-specific elements
    signalOverload.style.display = 'none';
    lostSignal.style.display = 'none';
    startOverBtn.style.display = 'none';
    
    // Show normal elements (will be hidden again by intro)
    document.querySelector('.static-text').style.display = 'inline';
    cyclingTextElement.style.display = 'inline';
    document.querySelector('.cursor').style.display = 'inline';
    
    // Restart intro sequence
    startIntroSequence();
}

// Lost Signal Mode Functions
function activateLostSignal() {
    isLostSignalMode = true;
    
    // Hide normal text elements
    document.querySelector('.static-text').style.display = 'none';
    cyclingTextElement.style.display = 'none';
    document.querySelector('.cursor').style.display = 'none';
    buttonsContainer.style.display = 'none';
    
    // Hide HUD top elements
    hudTop.style.display = 'none';
    
    // Show lost signal interface
    lostSignal.style.display = 'block';
    
    // Show start over button after 5 seconds
    setTimeout(() => {
        startOverBtn.style.display = 'block';
    }, 5000);
    
    // Start lost signal message sequence
    startLostSignalSequence();
}

function startLostSignalSequence() {
    const messages = [
        "NO SIGNAL DETECTED",
        "YOU ARE NOW OUTSIDE THE RANGE OF HUMAN COMMUNICATION",
        "...",
        "IT'S QUIET OUT HERE"
    ];
    
    let messageIndex = 0;
    
    function showNextMessage() {
        if (messageIndex < messages.length) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'lost-signal-message';
            messageDiv.textContent = messages[messageIndex];
            
            lostSignal.appendChild(messageDiv);
            
            messageIndex++;
            
            // Show next message after 3 seconds
            setTimeout(showNextMessage, 3000);
        }
    }
    
    // Start the sequence
    showNextMessage();
}

// Signal Overload Mode Functions
function activateSignalOverload() {
    isSignalOverloadMode = true;
    
    // Hide normal text elements
    document.querySelector('.static-text').style.display = 'none';
    cyclingTextElement.style.display = 'none';
    document.querySelector('.cursor').style.display = 'none';
    buttonsContainer.style.display = 'none';
    
    // Hide HUD top elements
    hudTop.style.display = 'none';
    
    // Show signal overload interface
    signalOverload.style.display = 'block';
    
    // Show start over button after 5 seconds
    setTimeout(() => {
        startOverBtn.style.display = 'block';
    }, 5000);
    
    // Start continuous scrolling text
    startScrollingText();
}

function startScrollingText() {
    let titleIndex = 0;
    
    function addScrollingLine() {
        if (!isSignalOverloadMode) return;
        
        const line = document.createElement('div');
        line.className = 'scrolling-text';
        line.textContent = `does anybody else ${titles[titleIndex]}`;
        
        scrollingContainer.appendChild(line);
        
        // Remove old lines to prevent memory issues (keep more lines since we have full height)
        if (scrollingContainer.children.length > 20) {
            scrollingContainer.removeChild(scrollingContainer.firstChild);
        }
        
        titleIndex = (titleIndex + 1) % titles.length;
    }
    
    // Add lines at moderate intervals for readability
    scrollingInterval = setInterval(addScrollingLine, 1200); // New line every 1.2 seconds
    addScrollingLine(); // Add first line immediately
}

// Earth Distance Functions
function updateEarthDistance() {
    const earthContainer = earth.parentElement;
    
    // Remove all existing distance classes from container
    earthContainer.classList.remove(
        'earth-level--5', 'earth-level--4', 'earth-level--3', 'earth-level--2', 'earth-level--1',
        'earth-level-1', 'earth-level-2', 'earth-level-3', 'earth-level-4', 'earth-level-5',
        'earth-level-6', 'earth-level-7', 'earth-level-8', 'earth-level-9', 'earth-level-10'
    );
    
    // Apply appropriate class based on distance level
    if (earthDistance !== 0) {
        const className = earthDistance > 0 ? `earth-level-${earthDistance}` : `earth-level-${earthDistance}`;
        earthContainer.classList.add(className);
    }
    // earthDistance 0 uses the default starting position and size
}

// Text Typing Function
function typeText(text, element, callback) {
    element.textContent = '';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            
            // Show buttons after typing completes
            setTimeout(() => {
                if (!isIntroMode && !isSignalOverloadMode && !isLostSignalMode) {
                    buttons.style.display = 'flex';
                    buttonsContainer.style.display = 'block';
                    isWaitingForResponse = true;
                }
                if (callback) callback();
            }, 500); // 0.5 second pause
        }
    }, 20); // 20ms delay between characters (faster typing)
}

// Transmission Cycle
function startTransmissionCycle() {
    if (isWaitingForResponse || isSignalOverloadMode || isLostSignalMode || isIntroMode) return;
    
    // Pick a random title from the array
    const randomIndex = Math.floor(Math.random() * titles.length);
    const newText = titles[randomIndex];
    
    // Phase 1: Show "INCOMING TRANSMISSION"
    transmissionStatus.textContent = 'incoming transmission';
    systemStatus.textContent = 'scanning...';
    cyclingTextElement.textContent = '';
    buttons.style.display = 'none';
    
    // Phase 2: After 1 second, show "SIGNAL RECEIVED" and start typing
    setTimeout(() => {
        if (isSignalOverloadMode) return; // Exit if overload mode was activated
        
        transmissionStatus.textContent = 'signal received';
        systemStatus.textContent = 'decoding...';
        
        // Start typing the message
        typeText(newText, cyclingTextElement, () => {
            if (isSignalOverloadMode) return; // Exit if overload mode was activated
            
            // Phase 3: Message is fully displayed, waiting for user response
            transmissionStatus.textContent = 'transmission complete';
            systemStatus.textContent = 'awaiting response';
        });
    }, 1000);
}

// Response Handler
function handleUserResponse(response) {
    if (!isWaitingForResponse) return;
    
    isWaitingForResponse = false;
    buttons.style.display = 'none';
    buttonsContainer.style.display = 'none';
    
    // Update earth distance based on response
    if (response === 'yes') {
        earthDistance = Math.min(earthDistance + 1, 10); // Move closer to earth (max +10)
    } else if (response === 'no') {
        earthDistance = Math.max(earthDistance - 1, -5); // Move farther from earth (min -5)
    }
    
    // Update earth appearance
    updateEarthDistance();
    
    // Check if we've reached maximum earth level
    if (earthDistance >= 10) {
        // Activate signal overload mode
        setTimeout(() => {
            activateSignalOverload();
        }, 1000);
        return;
    }
    
    // Check if we've reached minimum earth level (lost signal)
    if (earthDistance <= -5) {
        // Activate lost signal mode
        setTimeout(() => {
            activateLostSignal();
        }, 1000);
        return;
    }
    
    // Show response received
    transmissionStatus.textContent = 'response received';
    systemStatus.textContent = 'processing...';
    
    // Clear the message
    cyclingTextElement.textContent = '';
    
    // Log the response and current distance
    console.log('User response:', response, '| Earth distance:', earthDistance);
    
    // After 0.5 seconds, start the next transmission cycle
    setTimeout(() => {
        startTransmissionCycle();
    }, 500);
}

// Event Listeners
yesBtn.addEventListener('click', () => {
    handleUserResponse('yes');
});

noBtn.addEventListener('click', () => {
    handleUserResponse('no');
});

investigateBtn.addEventListener('click', () => {
    startMainGame();
});

startOverBtn.addEventListener('click', () => {
    restartExperience();
});

// Initialize
createStars();
updateEarthDistance(); // Set initial earth appearance

// Start intro sequence
startIntroSequence();
