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
const loadingContainer = document.getElementById('loadingContainer');
const loadingBarFill = document.getElementById('loadingBarFill');
const loadingPercentage = document.getElementById('loadingPercentage');
const voidContainer = document.getElementById('voidContainer');
const voidBarFill = document.getElementById('voidBarFill');
const voidPercentage = document.getElementById('voidPercentage');
const sentimentIndicator = document.getElementById('sentimentIndicator');
const sentimentStatus = document.getElementById('sentimentStatus');
const sentimentConfidence = document.getElementById('sentimentConfidence');

// State Variables
let isWaitingForResponse = false;
let currentTransmissionIndex = 0;
let earthDistance = 0; // -5 to +10, where 0 is starting position, negative is farther, positive is closer
let isSignalOverloadMode = false;
let isLostSignalMode = false;
let isIntroMode = true;
let scrollingInterval;
let loadingProgress = 0; // 0 to 100, represents loading bar percentage
let hasShownLoadingBar = false;
let voidProgress = 0; // 0 to 100, represents void bar percentage
let hasShownVoidBar = false;

// Sentiment Analysis
let sentimentAnalyzer;
let currentSentiment = null;

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
    loadingProgress = 0;
    hasShownLoadingBar = false;
    voidProgress = 0;
    hasShownVoidBar = false;
    
    // Clear sentiment effects
    clearSentimentEffects();
    currentSentiment = null;
    
    // Clear any intervals
    if (scrollingInterval) {
        clearInterval(scrollingInterval);
        scrollingInterval = null;
    }
    
    // Reset earth appearance
    updateEarthDistance();
    
    // Hide and reset loading bar
    hideLoadingBar();
    loadingBarFill.style.width = '0%';
    loadingPercentage.textContent = '0%';
    loadingBarFill.style.background = 'linear-gradient(90deg, #66b3ff 0%, #99ccff 50%, #ffffff 100%)';
    loadingBarFill.style.boxShadow = '0 0 8px rgba(102, 179, 255, 0.6)';
    
    // Hide and reset void bar
    hideVoidBar();
    voidBarFill.style.width = '0%';
    voidPercentage.textContent = '0%';
    voidBarFill.style.background = 'linear-gradient(90deg, #ff6666 0%, #ff9999 50%, #ffcccc 100%)';
    voidBarFill.style.boxShadow = '0 0 8px rgba(255, 102, 102, 0.6)';
    
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
    
    // Hide HUD top elements and both progress bars
    hudTop.style.display = 'none';
    hideLoadingBar();
    hideVoidBar();
    
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
    
    // Hide HUD top elements and both progress bars
    hudTop.style.display = 'none';
    hideLoadingBar();
    hideVoidBar();
    
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
        const fullText = `does anybody else ${titles[titleIndex]}`;
        line.textContent = fullText;
        
        // Apply sentiment analysis to each line
        if (sentimentAnalyzer) {
            const sentiment = sentimentAnalyzer.analyze(fullText);
            const emotionColor = sentimentAnalyzer.getEmotionColor(sentiment.emotion);
            
            // Apply color based on sentiment - no glow effects
            line.style.color = emotionColor;
            line.style.textShadow = '';
        }
        
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

// Loading Bar Functions
function showLoadingBar() {
    if (!hasShownLoadingBar) {
        loadingContainer.style.display = 'block';
        hasShownLoadingBar = true;
    }
}

function updateLoadingBar() {
    // Calculate loading progress based on earthDistance
    // earthDistance ranges from -5 to +10, loading bar should be 0-100%
    // When earthDistance reaches +10, loading should be 100% (signal overload)
    const normalizedDistance = Math.max(0, earthDistance); // Only positive values count toward loading
    loadingProgress = Math.min(100, (normalizedDistance / 10) * 100);
    
    // Update the visual elements
    loadingBarFill.style.width = loadingProgress + '%';
    loadingPercentage.textContent = Math.round(loadingProgress) + '%';
    
    // Change color as it gets closer to full
    if (loadingProgress >= 80) {
        loadingBarFill.style.background = 'linear-gradient(90deg, #ff6666 0%, #ff9999 50%, #ffffff 100%)';
        loadingBarFill.style.boxShadow = '0 0 12px rgba(255, 102, 102, 0.8)';
    } else if (loadingProgress >= 50) {
        loadingBarFill.style.background = 'linear-gradient(90deg, #ffcc66 0%, #ffdd99 50%, #ffffff 100%)';
        loadingBarFill.style.boxShadow = '0 0 10px rgba(255, 204, 102, 0.7)';
    } else {
        loadingBarFill.style.background = 'linear-gradient(90deg, #66b3ff 0%, #99ccff 50%, #ffffff 100%)';
        loadingBarFill.style.boxShadow = '0 0 8px rgba(102, 179, 255, 0.6)';
    }
}

function hideLoadingBar() {
    loadingContainer.style.display = 'none';
}

// Void Bar Functions
function showVoidBar() {
    if (!hasShownVoidBar) {
        voidContainer.style.display = 'block';
        hasShownVoidBar = true;
    }
}

function updateVoidBar() {
    // Calculate void progress based on negative earthDistance
    // earthDistance ranges from 0 to -5, void bar should be 0-100%
    // When earthDistance reaches -5, void should be 100% (lost signal)
    const normalizedDistance = Math.max(0, -earthDistance); // Only negative values count toward void
    voidProgress = Math.min(100, (normalizedDistance / 5) * 100);
    
    // Update the visual elements
    voidBarFill.style.width = voidProgress + '%';
    voidPercentage.textContent = Math.round(voidProgress) + '%';
    
    // Change color intensity as it gets closer to full
    if (voidProgress >= 80) {
        voidBarFill.style.background = 'linear-gradient(90deg, #cc0000 0%, #ff3333 50%, #ff6666 100%)';
        voidBarFill.style.boxShadow = '0 0 12px rgba(204, 0, 0, 0.8)';
    } else if (voidProgress >= 50) {
        voidBarFill.style.background = 'linear-gradient(90deg, #ff3333 0%, #ff6666 50%, #ff9999 100%)';
        voidBarFill.style.boxShadow = '0 0 10px rgba(255, 51, 51, 0.7)';
    } else {
        voidBarFill.style.background = 'linear-gradient(90deg, #ff6666 0%, #ff9999 50%, #ffcccc 100%)';
        voidBarFill.style.boxShadow = '0 0 8px rgba(255, 102, 102, 0.6)';
    }
}

function hideVoidBar() {
    voidContainer.style.display = 'none';
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
    
    // Analyze sentiment of the text
    if (sentimentAnalyzer) {
        currentSentiment = sentimentAnalyzer.analyze(`does anybody else ${text}`);
        console.log('Analyzing text:', `does anybody else ${text}`);
        console.log('Sentiment result:', currentSentiment);
    }
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            
            // Apply sentiment effects as text appears (for gradual reveal)
            if (currentSentiment && i > text.length * 0.3) {
                applySentimentEffects(currentSentiment);
            }
        } else {
            clearInterval(timer);
            
            // Apply full sentiment effects when typing is complete
            if (currentSentiment) {
                applySentimentEffects(currentSentiment);
            }
            
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
    
    // Clear previous sentiment effects
    clearSentimentEffects();
    currentSentiment = null;
    
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
        // Show loading bar after first yes response
        if (earthDistance === 1) {
            showLoadingBar();
            // Hide void bar if it was showing
            if (hasShownVoidBar) {
                hideVoidBar();
            }
        }
    } else if (response === 'no') {
        earthDistance = Math.max(earthDistance - 1, -5); // Move farther from earth (min -5)
        // Show void bar after first no response that goes negative
        if (earthDistance === -1) {
            showVoidBar();
            // Hide loading bar if it was showing
            if (hasShownLoadingBar) {
                hideLoadingBar();
            }
        }
    }
    
    // Update earth appearance and appropriate progress bar
    updateEarthDistance();
    
    // Update the appropriate bar based on earthDistance
    if (earthDistance > 0 && hasShownLoadingBar) {
        // Show loading bar for positive earthDistance
        if (hasShownVoidBar) {
            hideVoidBar();
            showLoadingBar();
        }
        updateLoadingBar();
    } else if (earthDistance < 0 && hasShownVoidBar) {
        // Show void bar for negative earthDistance
        if (hasShownLoadingBar) {
            hideLoadingBar();
            showVoidBar();
        }
        updateVoidBar();
    } else if (earthDistance === 0) {
        // At neutral position, hide both bars
        if (hasShownLoadingBar) {
            hideLoadingBar();
        }
        if (hasShownVoidBar) {
            hideVoidBar();
        }
    }
    
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
    console.log('User response:', response, '| Earth distance:', earthDistance, '| Loading progress:', Math.round(loadingProgress) + '%', '| Void progress:', Math.round(voidProgress) + '%');
    
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

// Initialize sentiment analyzer
function initializeSentimentAnalyzer() {
    sentimentAnalyzer = new SentimentAnalyzer();
    console.log('Sentiment analyzer initialized');
}

// Apply sentiment-based visual effects
function applySentimentEffects(sentiment) {
    if (!sentiment) return;
    
    const emotionColor = sentimentAnalyzer.getEmotionColor(sentiment.emotion);
    const intensity = sentimentAnalyzer.getIntensity(sentiment.magnitude);
    
    // Update text color based on sentiment
    const cyclingText = document.querySelector('.cycling-text');
    if (cyclingText) {
        cyclingText.style.color = emotionColor;
        // Remove text glow effects - just keep the color
        cyclingText.style.textShadow = '';
    }
    
    // Update sentiment indicator in HUD
    if (sentimentIndicator && sentimentStatus && sentimentConfidence) {
        sentimentIndicator.style.display = 'block';
        sentimentStatus.textContent = sentiment.emotion;
        sentimentStatus.style.color = emotionColor;
        sentimentStatus.style.textShadow = `0 0 5px ${emotionColor}`;
        
        const confidencePercent = Math.round(sentiment.confidence * 100);
        sentimentConfidence.textContent = `${confidencePercent}%`;
    }
    
    // Update HUD elements subtly
    const transmissionStatus = document.querySelector('.transmission-status');
    const systemStatus = document.querySelector('.system-status');
    
    if (transmissionStatus && intensity !== 'minimal') {
        transmissionStatus.style.textShadow = `0 0 5px ${emotionColor}`;
    }
    
    if (systemStatus && intensity !== 'minimal') {
        systemStatus.style.textShadow = `0 0 5px ${emotionColor}`;
    }
    
    // Log sentiment for debugging
    console.log(`Sentiment: ${sentiment.emotion} (${sentiment.score.toFixed(2)}), Intensity: ${intensity}, Color: ${emotionColor}`);
}

// Clear sentiment effects
function clearSentimentEffects() {
    const cyclingText = document.querySelector('.cycling-text');
    if (cyclingText) {
        cyclingText.style.color = '#ffffff';
        cyclingText.style.textShadow = '';
    }
    
    const transmissionStatus = document.querySelector('.transmission-status');
    const systemStatus = document.querySelector('.system-status');
    
    if (transmissionStatus) {
        transmissionStatus.style.textShadow = '0 0 5px #66b3ff';
    }
    
    if (systemStatus) {
        systemStatus.style.textShadow = '0 0 5px #66b3ff';
    }
    
    // Hide sentiment indicator
    if (sentimentIndicator) {
        sentimentIndicator.style.display = 'none';
    }
}

// Initialize
initializeSentimentAnalyzer();
createStars();
updateEarthDistance(); // Set initial earth appearance

// Start intro sequence
startIntroSequence();
