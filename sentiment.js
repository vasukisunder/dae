/**
 * Lightweight Client-Side Sentiment Analysis
 * Designed for analyzing "does anybody else" statements
 */

class SentimentAnalyzer {
    constructor() {
        // Positive emotion words with weights
        this.positiveWords = {
            'love': 3, 'happy': 3, 'joy': 3, 'excited': 3, 'amazing': 3, 'wonderful': 3,
            'great': 2, 'good': 2, 'nice': 2, 'pleasant': 2, 'enjoy': 2, 'satisfied': 2,
            'like': 1, 'fun': 2, 'laugh': 2, 'smile': 2, 'appreciate': 2, 'grateful': 2,
            'relieved': 2, 'comfortable': 1, 'content': 2, 'pleased': 2, 'thrilled': 3,
            'delighted': 3, 'euphoric': 4, 'elated': 3, 'cheerful': 2, 'optimistic': 2,
            'hopeful': 2, 'confident': 2, 'peaceful': 2, 'calm': 1, 'relaxed': 1,
            'beautiful': 2, 'perfect': 3, 'best': 3, 'better': 1, 'awesome': 3,
            'fantastic': 3, 'incredible': 3, 'outstanding': 3, 'excellent': 3,
            'blessed': 2, 'lucky': 2, 'warm': 1, 'cozy': 2, 'safe': 1
        };

        // Negative emotion words with weights
        this.negativeWords = {
            'hate': -3, 'angry': -3, 'mad': -3, 'furious': -4, 'rage': -4, 'livid': -4,
            'sad': -2, 'depressed': -3, 'miserable': -3, 'awful': -3, 'terrible': -3,
            'horrible': -3, 'bad': -2, 'worse': -2, 'worst': -3, 'disgusting': -3,
            'annoyed': -2, 'irritated': -2, 'frustrated': -2, 'upset': -2, 'worried': -2,
            'anxious': -2, 'stressed': -2, 'overwhelmed': -2, 'exhausted': -2, 'tired': -1,
            'hurt': -2, 'pain': -2, 'sick': -2, 'uncomfortable': -1, 'awkward': -1,
            'embarrassed': -2, 'ashamed': -2, 'guilty': -2, 'regret': -2, 'disappointed': -2,
            'lonely': -2, 'isolated': -2, 'rejected': -2, 'ignored': -2, 'abandoned': -3,
            'confused': -1, 'lost': -2, 'helpless': -2, 'hopeless': -3, 'desperate': -3,
            'scared': -2, 'afraid': -2, 'terrified': -3, 'nervous': -1, 'panicked': -3,
            'disgusted': -3, 'repulsed': -3, 'disturbed': -2, 'bothered': -1, 'annoying': -2,
            'impossible': -2, 'difficult': -1, 'hard': -1, 'struggle': -2, 'fail': -2,
            'wrong': -1, 'broken': -2, 'damaged': -2, 'ruined': -3, 'destroyed': -3
        };

        // Emotional intensity words that amplify sentiment
        this.intensifiers = {
            'extremely': 2, 'very': 1.5, 'really': 1.5, 'so': 1.3, 'totally': 1.8,
            'absolutely': 2, 'completely': 1.8, 'incredibly': 1.8, 'super': 1.5,
            'quite': 1.2, 'rather': 1.1, 'pretty': 1.1, 'fairly': 1.1,
            'uncontrollably': 2, 'intensely': 1.8, 'deeply': 1.5, 'seriously': 1.4
        };

        // Words that reduce intensity
        this.diminishers = {
            'slightly': 0.5, 'somewhat': 0.6, 'kind of': 0.7, 'sort of': 0.7,
            'a bit': 0.6, 'a little': 0.6, 'barely': 0.4, 'hardly': 0.4,
            'mildly': 0.6, 'kinda': 0.7, 'just': 0.8
        };

        // Specific patterns common in "does anybody else" statements
        this.patterns = {
            // Vulnerability/sharing patterns (slightly positive - seeking connection)
            'feel like': 0.1, 'wonder if': 0.1, 'think that': 0.1, 'notice': 0.1,
            'experience': 0.1, 'get the feeling': 0.1, 'have trouble': -0.5,
            'struggle with': -1, 'worry about': -1, 'freak out': -1.5,
            'get anxious': -1, 'get nervous': -1, 'get scared': -1.5,
            'get excited': 1, 'get happy': 1.5, 'feel better': 1,
            'feel worse': -1, 'feel weird': -0.5, 'feel strange': -0.5,
            'feel uncomfortable': -1, 'feel awkward': -1, 'feel embarrassed': -1.5,
            'feel guilty': -1.5, 'feel sad': -1.5, 'feel lonely': -2,
            'feel overwhelmed': -1.5, 'feel stressed': -1.5, 'feel tired': -0.8,
            'feel confused': -0.8, 'feel lost': -1.2, 'feel trapped': -2,
            'feel stuck': -1.5, 'feel hopeless': -2.5, 'feel helpless': -2,
            'feel grateful': 1.5, 'feel blessed': 1.5, 'feel lucky': 1.2,
            'feel proud': 1.5, 'feel confident': 1.2, 'feel peaceful': 1.2,
            'feel content': 1, 'feel satisfied': 1.2, 'feel relieved': 1.5,
            'absolutely love': 2.5, 'really enjoy': 1.8, 'totally hate': -2.5,
            'really hate': -2, 'kinda hate': -1.2, 'sorta like': 0.8,
            'really like': 1.5, 'absolutely hate': -2.8, 'completely love': 2.8,
            
            // Additional "does anybody else" specific patterns
            'miss': -1, 'can\'t catch a break': -1.5, 'constantly': -0.3,
            'distressed': -1.5, 'seems to not': -0.5, 'hard time': -0.8,
            'lowkey hope': 0.2, 'want to experience': 0.5, 'can they be': -0.3,
            'emotionally non-intelligent': -1, 'become naked': -0.5, 'dreams': 0.1,
            'out in public': -0.2, 'anymore': -0.5, 'get paranoid': -1.5,
            'get restless': -0.8, 'regret': -1.2, 'just absolutely love': 2,
            'absolutely dread': -2, 'think constantly': -0.8, 'can\'t': -0.5,
            'hate when': -1.2, 'annoying': -1, 'get upset': -1, 'cry': -1.5,
            'tear up': -1, 'violence': -2, 'violent': -2, 'death': -2,
            'dying': -2, 'killed': -2.5, 'murder': -2.5, 'anxiety': -1.5,
            'depression': -2, 'panic': -2, 'terror': -2.5, 'nightmare': -2,
            'ache': -0.8, 'pain': -1.5, 'hurt': -1.5, 'suffering': -2,
            'struggle': -1.2, 'difficult': -0.8, 'impossible': -1.5,
            'can\'t afford': -1.2, 'broke': -1, 'poor': -1, 'rich': 0.5,
            'blessed': 1.5, 'lucky': 1, 'grateful': 1.5, 'thankful': 1.5,
            'appreciate': 1, 'adore': 2, 'cherish': 1.8, 'treasure': 1.5,
            'beautiful': 1.5, 'gorgeous': 2, 'stunning': 2, 'ugly': -1.5,
            'hideous': -2, 'disgusting': -2, 'gross': -1.5, 'nasty': -1.5,
            'amazing': 2, 'incredible': 2, 'fantastic': 2, 'wonderful': 2,
            'terrible': -2, 'horrible': -2, 'awful': -2, 'dreadful': -2,
            
            // More subtle emotional indicators
            'weird': -0.4, 'strange': -0.4, 'odd': -0.3, 'bizarre': -0.6,
            'uncomfortable': -0.8, 'awkward': -0.8, 'embarrassed': -1,
            'shy': -0.6, 'insecure': -1, 'self-conscious': -0.8,
            'bored': -0.5, 'tired': -0.4, 'exhausted': -1, 'drained': -1,
            'overwhelmed': -1.2, 'stressed': -1, 'pressure': -0.8,
            'disappointed': -1, 'let down': -1, 'frustrated': -1,
            'annoyed': -0.8, 'irritated': -0.8, 'bothered': -0.6,
            'confused': -0.6, 'lost': -0.8, 'stuck': -0.8, 'trapped': -1.2,
            'alone': -1, 'isolated': -1.2, 'disconnected': -0.8,
            'rejected': -1.5, 'ignored': -1, 'forgotten': -1,
            'worried': -1, 'concerned': -0.6, 'nervous': -0.8,
            'scared': -1.2, 'afraid': -1.2, 'fearful': -1,
            'hopeless': -2, 'helpless': -1.8, 'powerless': -1.5,
            'guilty': -1.2, 'ashamed': -1.5, 'regretful': -1,
            'jealous': -1, 'envious': -0.8, 'resentful': -1.2,
            'angry': -1.5, 'mad': -1.2, 'furious': -2, 'livid': -2.2,
            'disgusted': -1.8, 'repulsed': -1.8, 'sick': -1,
            
            // Positive subtle indicators  
            'comfortable': 0.6, 'relaxed': 0.8, 'calm': 0.6, 'peaceful': 1,
            'content': 0.8, 'satisfied': 1, 'fulfilled': 1.2,
            'confident': 1, 'secure': 0.8, 'safe': 0.6,
            'hopeful': 1, 'optimistic': 1.2, 'positive': 0.8,
            'excited': 1.5, 'enthusiastic': 1.5, 'eager': 1,
            'proud': 1.2, 'accomplished': 1.2, 'successful': 1,
            'relieved': 1, 'free': 0.8, 'liberated': 1,
            'connected': 0.8, 'understood': 0.8, 'accepted': 1,
            'supported': 1, 'loved': 1.8, 'cared for': 1.2,
            'inspired': 1.2, 'motivated': 1, 'energized': 1,
            'curious': 0.4, 'interested': 0.6, 'fascinated': 0.8,
            'amused': 0.8, 'entertained': 0.6, 'fun': 1,
            
            // Existential concerns
            'don\'t exist': -1.5, 'feel like they don\'t exist': -1.8,
            'not exist': -1.2, 'existence': -0.3, 'exist': -0.2
        };
    }

    /**
     * Analyzes the sentiment of a given text
     * Returns an object with score, magnitude, and emotional category
     */
    analyze(text) {
        if (!text || typeof text !== 'string') {
            return { score: 0, magnitude: 0, emotion: 'neutral', confidence: 0 };
        }

        const words = this.tokenize(text.toLowerCase());
        let score = 0;
        let magnitude = 0;
        let wordCount = 0;
        let sentimentWords = [];

        // Check for specific patterns first
        for (const [pattern, patternScore] of Object.entries(this.patterns)) {
            if (text.toLowerCase().includes(pattern)) {
                score += patternScore;
                magnitude += Math.abs(patternScore);
                sentimentWords.push({ word: pattern, score: patternScore, type: 'pattern' });
            }
        }

        // Analyze individual words
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            let wordScore = 0;
            let multiplier = 1;

            // Check for intensifiers/diminishers before this word
            if (i > 0) {
                const prevWord = words[i - 1];
                if (this.intensifiers[prevWord]) {
                    multiplier = this.intensifiers[prevWord];
                } else if (this.diminishers[prevWord]) {
                    multiplier = this.diminishers[prevWord];
                }
            }

            // Check sentiment words
            if (this.positiveWords[word]) {
                wordScore = this.positiveWords[word] * multiplier;
                sentimentWords.push({ word, score: wordScore, type: 'positive' });
            } else if (this.negativeWords[word]) {
                wordScore = this.negativeWords[word] * multiplier;
                sentimentWords.push({ word, score: wordScore, type: 'negative' });
            }

            if (wordScore !== 0) {
                score += wordScore;
                magnitude += Math.abs(wordScore);
                wordCount++;
            }
        }

        // More sensitive normalization - less penalty for longer text
        const normalizedScore = wordCount > 0 ? score / Math.pow(words.length, 0.3) : 0;
        const confidence = Math.min(magnitude / (words.length * 0.5 + 1), 1);

        // Determine emotional category and intensity
        const emotion = this.categorizeEmotion(normalizedScore, magnitude, sentimentWords);

        return {
            score: normalizedScore,
            magnitude: magnitude,
            emotion: emotion,
            confidence: confidence,
            details: {
                wordCount: wordCount,
                totalWords: words.length,
                sentimentWords: sentimentWords
            }
        };
    }

    /**
     * Tokenizes text into words, handling contractions and punctuation
     */
    tokenize(text) {
        return text
            .replace(/[^\w\s']/g, ' ')  // Remove punctuation except apostrophes
            .replace(/\s+/g, ' ')       // Normalize whitespace
            .trim()
            .split(' ')
            .filter(word => word.length > 0);
    }

    /**
     * Categorizes emotion based on score, magnitude, and specific words
     */
    categorizeEmotion(score, magnitude, sentimentWords) {
        // Much more sensitive thresholds
        const threshold = 0.05;  // Reduced from 0.1
        const strongThreshold = 0.15;  // Reduced from 0.3
        const magnitudeThreshold = 0.2;  // Reduced from default

        // Check for specific emotional patterns with more keywords
        const hasAnxiety = sentimentWords.some(w => 
            ['anxious', 'nervous', 'worried', 'panic', 'overwhelmed', 'stressed', 'get nervous', 'get anxious', 'freak out', 'get scared', 'uncomfortable', 'awkward'].includes(w.word));
        const hasSadness = sentimentWords.some(w => 
            ['sad', 'depressed', 'lonely', 'hopeless', 'hurt', 'miss', 'cry', 'tear up', 'feel sad', 'feel lonely', 'feel lost', 'distressed'].includes(w.word));
        const hasAnger = sentimentWords.some(w => 
            ['angry', 'hate', 'furious', 'mad', 'rage', 'frustrated', 'annoying', 'get upset', 'really hate', 'totally hate', 'absolutely hate'].includes(w.word));
        const hasJoy = sentimentWords.some(w => 
            ['happy', 'joy', 'excited', 'love', 'thrilled', 'delighted', 'absolutely love', 'really enjoy', 'feel better', 'relieved'].includes(w.word));
        const hasFear = sentimentWords.some(w => 
            ['scared', 'afraid', 'terrified', 'fear', 'get scared', 'frightened'].includes(w.word));
        const hasDiscomfort = sentimentWords.some(w => 
            ['weird', 'strange', 'uncomfortable', 'awkward', 'embarrassed', 'feel weird', 'feel strange', 'feel awkward'].includes(w.word));
        const hasStruggle = sentimentWords.some(w => 
            ['struggle', 'difficult', 'hard time', 'have trouble', 'can\'t', 'impossible', 'struggle with'].includes(w.word));

        // More sensitive detection - check magnitude OR specific patterns
        if (magnitude < magnitudeThreshold && sentimentWords.length === 0) {
            return 'neutral';
        }

        // Positive emotions
        if (score > strongThreshold) {
            if (hasJoy) return 'joy';
            return 'positive';
        } else if (score > threshold || (score > 0 && sentimentWords.length > 0)) {
            if (hasJoy) return 'joy';
            return 'mildly-positive';
        }
        
        // Negative emotions
        else if (score < -strongThreshold) {
            if (hasAnger) return 'anger';
            if (hasSadness) return 'sadness';
            if (hasFear) return 'fear';
            if (hasAnxiety) return 'anxiety';
            return 'negative';
        } else if (score < -threshold || (score < 0 && sentimentWords.length > 0)) {
            if (hasAnxiety || hasDiscomfort) return 'anxiety';
            if (hasSadness) return 'melancholy';
            if (hasStruggle) return 'mildly-negative';
            if (hasAnger) return 'mildly-negative';
            return 'mildly-negative';
        }

        // Check for specific emotional indicators even with neutral score
        if (hasAnxiety || hasDiscomfort) return 'anxiety';
        if (hasSadness) return 'melancholy';
        if (hasStruggle) return 'mildly-negative';
        if (hasJoy) return 'mildly-positive';

        return 'neutral';
    }

    /**
     * Get color mapping for emotions (for visual indicators)
     */
    getEmotionColor(emotion) {
        const colors = {
            'joy': '#FFD700',           // Gold
            'positive': '#66FF66',      // Light Green
            'mildly-positive': '#99FF99', // Pale Green
            'neutral': '#CCCCCC',       // Light Gray
            'mildly-negative': '#FFB366', // Pale Orange
            'anxiety': '#FF9966',       // Orange
            'melancholy': '#6699FF',    // Soft Blue
            'sadness': '#4169E1',       // Royal Blue
            'anger': '#FF6666',         // Light Red
            'fear': '#9966FF',          // Purple
            'negative': '#FF4444'       // Red
        };
        return colors[emotion] || colors['neutral'];
    }

    /**
     * Get intensity level for visual effects
     */
    getIntensity(magnitude) {
        if (magnitude > 2) return 'high';
        if (magnitude > 1) return 'medium';
        if (magnitude > 0.3) return 'low';
        return 'minimal';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SentimentAnalyzer;
} else if (typeof window !== 'undefined') {
    window.SentimentAnalyzer = SentimentAnalyzer;
}
