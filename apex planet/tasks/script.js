/**
 * Quiz Master - Advanced JavaScript Learning Project
 * 
 * This application demonstrates:
 * - API integration with error handling
 * - DOM manipulation and event handling
 * - State management without frameworks
 * - Responsive design implementation
 * - Modern JavaScript features (async/await, destructuring, etc.)
 */

// Application state management
class QuizApp {
  constructor() {
    // Initialize application state
    this.state = {
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      isLoading: false,
      isCompleted: false,
      hasStarted: false,
      selectedAnswer: null,
      showResult: false,
      settings: {
        difficulty: 'medium',
        category: '',
        amount: 10
      }
    };

    // Bind methods to maintain context
    this.init = this.init.bind(this);
    this.startQuiz = this.startQuiz.bind(this);
    this.handleAnswerSelect = this.handleAnswerSelect.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.restartQuiz = this.restartQuiz.bind(this);

    // Initialize the application
    this.init();
  }

  /**
   * Initialize the application
   * Sets up event listeners and loads initial data
   */
  async init() {
    console.log('🚀 Initializing Quiz Master application...');
    
    // Load categories from API
    await this.loadCategories();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Show welcome screen
    this.showScreen('welcome-screen');
  }

  /**
   * Set up all event listeners for the application
   * Demonstrates modern event handling patterns
   */
  setupEventListeners() {
    // Start quiz button
    document.getElementById('start-quiz-btn').addEventListener('click', this.startQuiz);
    
    // Restart quiz button
    document.getElementById('restart-quiz-btn').addEventListener('click', this.restartQuiz);
    
    // Next question button
    document.getElementById('next-question-btn').addEventListener('click', this.nextQuestion);
    
    // Settings change listeners
    document.getElementById('difficulty').addEventListener('change', (e) => {
      this.state.settings.difficulty = e.target.value;
    });
    
    document.getElementById('category').addEventListener('change', (e) => {
      this.state.settings.category = e.target.value;
    });
    
    document.getElementById('amount').addEventListener('change', (e) => {
      this.state.settings.amount = parseInt(e.target.value);
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !this.state.isLoading) {
        const activeScreen = document.querySelector('.screen.active').id;
        
        if (activeScreen === 'welcome-screen') {
          this.startQuiz();
        } else if (activeScreen === 'quiz-screen' && this.state.showResult) {
          this.nextQuestion();
        } else if (activeScreen === 'results-screen') {
          this.restartQuiz();
        }
      }
    });
  }

  /**
   * Load available categories from the API
   * Demonstrates API integration and error handling
   */
  async loadCategories() {
    try {
      console.log('📚 Loading quiz categories...');
      
      const response = await fetch('https://opentdb.com/api_category.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const categorySelect = document.getElementById('category');
      
      // Clear existing options (except "Any Category")
      categorySelect.innerHTML = '<option value="">Any Category</option>';
      
      // Add categories to select dropdown
      data.trivia_categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
      
      console.log(`✅ Loaded ${data.trivia_categories.length} categories`);
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      // Categories are optional, so we continue without them
    }
  }

  /**
   * Start a new quiz by fetching questions from API
   * Demonstrates async/await and comprehensive error handling
   */
  async startQuiz() {
    console.log('🎯 Starting new quiz...');
    
    // Update state and show loading
    this.state.isLoading = true;
    this.showScreen('loading-screen');
    
    try {
      // Build API URL with user settings
      const { difficulty, category, amount } = this.state.settings;
      const params = new URLSearchParams({
        amount: amount.toString(),
        difficulty,
        type: 'multiple'
      });
      
      if (category) {
        params.append('category', category);
      }
      
      const apiUrl = `https://opentdb.com/api.php?${params}`;
      console.log('🌐 Fetching questions from:', apiUrl);
      
      // Fetch questions from Open Trivia Database
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check API response code
      if (data.response_code !== 0) {
        throw new Error('Failed to fetch questions from trivia API');
      }
      
      // Process questions (decode HTML entities, shuffle answers)
      this.state.questions = this.processQuestions(data.results);
      this.state.currentQuestionIndex = 0;
      this.state.score = 0;
      this.state.isLoading = false;
      this.state.hasStarted = true;
      this.state.isCompleted = false;
      this.state.selectedAnswer = null;
      this.state.showResult = false;
      
      console.log(`✅ Loaded ${this.state.questions.length} questions`);
      
      // Show quiz screen and display first question
      this.showScreen('quiz-screen');
      this.displayCurrentQuestion();
      
    } catch (error) {
      console.error('❌ Error starting quiz:', error);
      this.state.isLoading = false;
      this.showScreen('welcome-screen');
      this.showError('Failed to load quiz questions. Please check your internet connection and try again.');
    }
  }

  /**
   * Process raw API questions into usable format
   * Demonstrates data transformation and array manipulation
   * @param {Array} rawQuestions - Questions from API
   * @returns {Array} Processed questions
   */
  processQuestions(rawQuestions) {
    return rawQuestions.map((question, index) => {
      // Decode HTML entities (API returns encoded text)
      const decodedQuestion = this.decodeHtmlEntities(question.question);
      const decodedCorrectAnswer = this.decodeHtmlEntities(question.correct_answer);
      const decodedIncorrectAnswers = question.incorrect_answers.map(answer => 
        this.decodeHtmlEntities(answer)
      );

      // Combine and shuffle all answers
      const allAnswers = [decodedCorrectAnswer, ...decodedIncorrectAnswers];
      const shuffledAnswers = this.shuffleArray(allAnswers);

      return {
        id: index + 1,
        category: question.category,
        difficulty: question.difficulty,
        question: decodedQuestion,
        correctAnswer: decodedCorrectAnswer,
        incorrectAnswers: decodedIncorrectAnswers,
        answers: shuffledAnswers,
        selectedAnswer: null,
        isCorrect: null
      };
    });
  }

  /**
   * Decode HTML entities in strings
   * @param {string} text - Text with HTML entities
   * @returns {string} Decoded text
   */
  decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} New shuffled array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Display the current question
   * Demonstrates DOM manipulation and dynamic content generation
   */
  displayCurrentQuestion() {
    const question = this.state.questions[this.state.currentQuestionIndex];
    
    if (!question) {
      console.error('❌ No question to display');
      return;
    }

    console.log(`📝 Displaying question ${this.state.currentQuestionIndex + 1}`);

    // Update progress
    this.updateProgress();
    
    // Update question content
    document.getElementById('question-category').textContent = question.category;
    document.getElementById('question-text').textContent = question.question;
    
    // Generate answer buttons
    this.generateAnswerButtons(question);
    
    // Hide result explanation and next button
    document.getElementById('result-explanation').classList.add('hidden');
    document.getElementById('next-question-btn').classList.add('hidden');
    
    // Reset state
    this.state.selectedAnswer = null;
    this.state.showResult = false;
  }

  /**
   * Generate answer buttons dynamically
   * @param {Object} question - Current question object
   */
  generateAnswerButtons(question) {
    const container = document.getElementById('answers-container');
    container.innerHTML = ''; // Clear existing buttons
    
    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.className = 'answer-button';
      button.onclick = () => this.handleAnswerSelect(answer);
      
      button.innerHTML = `
        <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
        <span class="answer-text">${answer}</span>
      `;
      
      container.appendChild(button);
    });
  }

  /**
   * Handle answer selection
   * Implements scoring logic and visual feedback
   * @param {string} selectedAnswer - The selected answer
   */
  handleAnswerSelect(selectedAnswer) {
    if (this.state.selectedAnswer) return; // Prevent multiple selections
    
    console.log(`🎯 Answer selected: ${selectedAnswer}`);
    
    const question = this.state.questions[this.state.currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    // Update question state
    question.selectedAnswer = selectedAnswer;
    question.isCorrect = isCorrect;
    
    // Update score
    if (isCorrect) {
      this.state.score++;
      console.log(`✅ Correct! Score: ${this.state.score}`);
    } else {
      console.log(`❌ Incorrect. Correct answer: ${question.correctAnswer}`);
    }
    
    // Update state
    this.state.selectedAnswer = selectedAnswer;
    
    // Update UI immediately
    this.updateAnswerButtons(selectedAnswer, question.correctAnswer);
    this.updateScore();
    
    // Show result after short delay for better UX
    setTimeout(() => {
      this.state.showResult = true;
      this.showResultExplanation(question);
      document.getElementById('next-question-btn').classList.remove('hidden');
    }, 500);
  }

  /**
   * Update answer button styles based on selection
   * @param {string} selectedAnswer - User's selected answer
   * @param {string} correctAnswer - The correct answer
   */
  updateAnswerButtons(selectedAnswer, correctAnswer) {
    const buttons = document.querySelectorAll('.answer-button');
    
    buttons.forEach(button => {
      const answerText = button.querySelector('.answer-text').textContent;
      
      // Disable all buttons
      button.classList.add('disabled');
      button.onclick = null;
      
      // Apply appropriate styling
      if (answerText === selectedAnswer) {
        button.classList.add('selected');
        if (answerText === correctAnswer) {
          button.classList.add('correct');
        } else {
          button.classList.add('incorrect');
        }
      } else if (answerText === correctAnswer) {
        button.classList.add('correct');
      }
    });
  }

  /**
   * Show result explanation
   * @param {Object} question - Current question object
   */
  showResultExplanation(question) {
    const explanationDiv = document.getElementById('result-explanation');
    const correctAnswerText = document.getElementById('correct-answer-text');
    const userAnswerText = document.getElementById('user-answer-text');
    
    correctAnswerText.innerHTML = `<strong>Correct Answer:</strong> ${question.correctAnswer}`;
    
    if (question.selectedAnswer !== question.correctAnswer) {
      userAnswerText.innerHTML = `<strong>Your Answer:</strong> ${question.selectedAnswer}`;
      userAnswerText.style.color = 'var(--error-red)';
    } else {
      userAnswerText.innerHTML = '';
    }
    
    explanationDiv.classList.remove('hidden');
  }

  /**
   * Move to next question or complete quiz
   * Handles quiz progression logic
   */
  nextQuestion() {
    const nextIndex = this.state.currentQuestionIndex + 1;
    
    if (nextIndex >= this.state.questions.length) {
      // Quiz completed
      console.log('🏁 Quiz completed!');
      this.completeQuiz();
    } else {
      // Move to next question
      console.log(`➡️ Moving to question ${nextIndex + 1}`);
      this.state.currentQuestionIndex = nextIndex;
      this.displayCurrentQuestion();
    }
  }

  /**
   * Complete the quiz and show results
   * Demonstrates data analysis and visualization
   */
  completeQuiz() {
    this.state.isCompleted = true;
    this.showScreen('results-screen');
    
    // Calculate statistics
    const stats = this.calculateStats();
    
    // Display results with animation
    this.displayResults(stats);
  }

  /**
   * Calculate quiz performance statistics
   * @returns {Object} Statistics object
   */
  calculateStats() {
    const totalQuestions = this.state.questions.length;
    const correctAnswers = this.state.score;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      percentage,
      difficulty: this.state.settings.difficulty
    };
  }

  /**
   * Display quiz results with animations
   * @param {Object} stats - Quiz statistics
   */
  displayResults(stats) {
    console.log('📊 Displaying results:', stats);
    
    // Update score display
    document.getElementById('percentage-score').textContent = `${stats.percentage}%`;
    document.getElementById('fraction-score').textContent = `${stats.correctAnswers}/${stats.totalQuestions}`;
    
    // Update statistics
    document.getElementById('correct-count').textContent = stats.correctAnswers;
    document.getElementById('incorrect-count').textContent = stats.incorrectAnswers;
    document.getElementById('difficulty-stat').textContent = 
      stats.difficulty.charAt(0).toUpperCase() + stats.difficulty.slice(1);
    
    // Animate score circle
    this.animateScoreCircle(stats.percentage);
    
    // Show performance message
    this.showPerformanceMessage(stats.percentage);
  }

  /**
   * Animate the circular progress indicator
   * @param {number} percentage - Score percentage
   */
  animateScoreCircle(percentage) {
    const circle = document.getElementById('score-progress');
    const circumference = 2 * Math.PI * 40; // radius = 40
    const offset = circumference - (percentage / 100) * circumference;
    
    // Animate the circle
    setTimeout(() => {
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = offset;
      circle.style.transition = 'stroke-dashoffset 1s ease-out';
    }, 100);
  }

  /**
   * Show performance message based on score
   * @param {number} percentage - Score percentage
   */
  showPerformanceMessage(percentage) {
    const messageDiv = document.getElementById('performance-message');
    let message, className;
    
    if (percentage >= 90) {
      message = "Outstanding! You're a trivia master! 🏆";
      className = 'excellent';
    } else if (percentage >= 80) {
      message = "Excellent work! You really know your stuff! 🌟";
      className = 'excellent';
    } else if (percentage >= 70) {
      message = "Great job! You did really well! 👏";
      className = 'good';
    } else if (percentage >= 60) {
      message = "Good effort! Keep practicing! 👍";
      className = 'good';
    } else if (percentage >= 50) {
      message = "Not bad! Room for improvement! 💪";
      className = 'needs-improvement';
    } else {
      message = "Keep learning and try again! Practice makes perfect! 📚";
      className = 'needs-improvement';
    }
    
    messageDiv.textContent = message;
    messageDiv.className = `performance-message ${className}`;
  }

  /**
   * Update progress bar and counters
   */
  updateProgress() {
    const current = this.state.currentQuestionIndex + 1;
    const total = this.state.questions.length;
    const percentage = (current / total) * 100;
    
    // Update progress bar
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    
    // Update counters
    document.getElementById('question-counter').textContent = `Question ${current} of ${total}`;
    document.getElementById('difficulty-display').textContent = 
      this.state.settings.difficulty.charAt(0).toUpperCase() + this.state.settings.difficulty.slice(1);
  }

  /**
   * Update score display
   */
  updateScore() {
    document.getElementById('current-score').textContent = this.state.score;
    document.getElementById('total-questions').textContent = this.state.questions.length;
  }

  /**
   * Restart the quiz
   * Resets all state to initial values
   */
  restartQuiz() {
    console.log('🔄 Restarting quiz...');
    
    // Reset state
    this.state = {
      ...this.state,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      isCompleted: false,
      hasStarted: false,
      selectedAnswer: null,
      showResult: false
    };
    
    // Show welcome screen
    this.showScreen('welcome-screen');
  }

  /**
   * Show specific screen and hide others
   * @param {string} screenId - ID of screen to show
   */
  showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
  }

  /**
   * Show error message to user
   * @param {string} message - Error message to display
   */
  showError(message) {
    // Simple alert for now - could be enhanced with custom modal
    alert(message);
  }
}

/**
 * Utility Functions
 * These demonstrate common JavaScript patterns and best practices
 */

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Check if device is mobile based on screen width
 * @returns {boolean} True if mobile device
 */
function isMobile() {
  return window.innerWidth <= 767;
}

/**
 * Check if device is tablet based on screen width
 * @returns {boolean} True if tablet device
 */
function isTablet() {
  return window.innerWidth >= 768 && window.innerWidth <= 1023;
}

/**
 * Check if device is desktop based on screen width
 * @returns {boolean} True if desktop device
 */
function isDesktop() {
  return window.innerWidth >= 1024;
}

/**
 * Add smooth scroll behavior to element
 * @param {HTMLElement} element - Element to scroll to
 */
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}

/**
 * Local Storage Helper Functions
 * Demonstrate client-side data persistence
 */
const Storage = {
  /**
   * Save quiz settings to localStorage
   * @param {Object} settings - Settings object to save
   */
  saveSettings(settings) {
    try {
      localStorage.setItem('quizSettings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Could not save settings to localStorage:', error);
    }
  },

  /**
   * Load quiz settings from localStorage
   * @returns {Object|null} Saved settings or null
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('quizSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Could not load settings from localStorage:', error);
      return null;
    }
  },

  /**
   * Save high score to localStorage
   * @param {number} score - Score to save
   * @param {number} total - Total questions
   */
  saveHighScore(score, total) {
    try {
      const percentage = Math.round((score / total) * 100);
      const currentHigh = this.getHighScore();
      
      if (percentage > currentHigh) {
        localStorage.setItem('quizHighScore', percentage.toString());
        return true; // New high score
      }
      return false;
    } catch (error) {
      console.warn('Could not save high score:', error);
      return false;
    }
  },

  /**
   * Get high score from localStorage
   * @returns {number} High score percentage
   */
  getHighScore() {
    try {
      const saved = localStorage.getItem('quizHighScore');
      return saved ? parseInt(saved) : 0;
    } catch (error) {
      console.warn('Could not load high score:', error);
      return 0;
    }
  }
};

/**
 * Performance Monitoring
 * Demonstrates performance measurement techniques
 */
const Performance = {
  startTime: null,
  
  /**
   * Start performance measurement
   */
  start() {
    this.startTime = performance.now();
  },
  
  /**
   * End performance measurement and log result
   * @param {string} operation - Name of operation being measured
   */
  end(operation) {
    if (this.startTime) {
      const duration = performance.now() - this.startTime;
      console.log(`⏱️ ${operation} took ${duration.toFixed(2)}ms`);
      this.startTime = null;
    }
  }
};

/**
 * Responsive Design Helper
 * Demonstrates responsive behavior management
 */
const ResponsiveHelper = {
  /**
   * Initialize responsive behavior
   */
  init() {
    // Listen for window resize events
    window.addEventListener('resize', debounce(this.handleResize.bind(this), 250));
    
    // Initial setup
    this.handleResize();
  },

  /**
   * Handle window resize events
   */
  handleResize() {
    const width = window.innerWidth;
    
    // Update CSS custom properties based on screen size
    document.documentElement.style.setProperty('--screen-width', `${width}px`);
    
    // Log current breakpoint for debugging
    if (isMobile()) {
      console.log('📱 Mobile view active');
    } else if (isTablet()) {
      console.log('📱 Tablet view active');
    } else {
      console.log('🖥️ Desktop view active');
    }
  }
};

/**
 * Application Initialization
 * This runs when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Quiz Master application starting...');
  
  // Start performance measurement
  Performance.start();
  
  // Initialize responsive helper
  ResponsiveHelper.init();
  
  // Load saved settings
  const savedSettings = Storage.loadSettings();
  if (savedSettings) {
    console.log('💾 Loading saved settings');
    document.getElementById('difficulty').value = savedSettings.difficulty || 'medium';
    document.getElementById('category').value = savedSettings.category || '';
    document.getElementById('amount').value = savedSettings.amount || 10;
  }
  
  // Initialize main application
  window.quizApp = new QuizApp();
  
  // End performance measurement
  Performance.end('Application initialization');
  
  console.log('✅ Quiz Master ready!');
});

/**
 * Service Worker Registration (Progressive Web App support)
 * Demonstrates modern web app capabilities
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Note: Service worker file would need to be created separately
    // This is just a demonstration of the registration pattern
    console.log('🔧 Service Worker support detected');
  });
}

/**
 * Error Handling
 * Global error handler for unhandled errors
 */
window.addEventListener('error', (event) => {
  console.error('💥 Global error caught:', event.error);
  
  // In a production app, you might send this to an error tracking service
  // For learning purposes, we'll just log it
});

/**
 * Network Status Monitoring
 * Demonstrates online/offline detection
 */
window.addEventListener('online', () => {
  console.log('🌐 Connection restored');
});

window.addEventListener('offline', () => {
  console.log('📡 Connection lost');
  alert('Internet connection lost. Some features may not work properly.');
});

/**
 * Keyboard Shortcuts
 * Demonstrates advanced event handling
 */
document.addEventListener('keydown', (event) => {
  // Space bar to start quiz (when on welcome screen)
  if (event.code === 'Space' && document.getElementById('welcome-screen').classList.contains('active')) {
    event.preventDefault();
    document.getElementById('start-quiz-btn').click();
  }
  
  // Number keys 1-4 to select answers (when quiz is active)
  if (event.code.startsWith('Digit') && document.getElementById('quiz-screen').classList.contains('active')) {
    const digit = parseInt(event.code.replace('Digit', ''));
    if (digit >= 1 && digit <= 4) {
      const buttons = document.querySelectorAll('.answer-button');
      if (buttons[digit - 1] && !buttons[digit - 1].classList.contains('disabled')) {
        buttons[digit - 1].click();
      }
    }
  }
});

/**
 * Touch and Gesture Support
 * Demonstrates mobile-friendly interactions
 */
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (event) => {
  touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', (event) => {
  touchEndY = event.changedTouches[0].screenY;
  handleSwipeGesture();
});

/**
 * Handle swipe gestures on mobile devices
 */
function handleSwipeGesture() {
  const swipeThreshold = 50;
  const swipeDistance = touchStartY - touchEndY;
  
  // Swipe up to go to next question (if available)
  if (swipeDistance > swipeThreshold) {
    const nextButton = document.getElementById('next-question-btn');
    if (nextButton && !nextButton.classList.contains('hidden')) {
      nextButton.click();
    }
  }
}

/**
 * Accessibility Enhancements
 * Demonstrates inclusive design practices
 */
const Accessibility = {
  /**
   * Announce text to screen readers
   * @param {string} text - Text to announce
   */
  announce(text) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = text;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Set focus to element with proper handling
   * @param {HTMLElement} element - Element to focus
   */
  setFocus(element) {
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

/**
 * Analytics and Tracking (Learning Example)
 * Demonstrates how to track user interactions
 */
const Analytics = {
  events: [],
  
  /**
   * Track user events
   * @param {string} eventName - Name of the event
   * @param {Object} data - Additional event data
   */
  track(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      data,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    };
    
    this.events.push(event);
    console.log('📈 Event tracked:', event);
    
    // In a real application, you would send this to an analytics service
  },
  
  /**
   * Get all tracked events
   * @returns {Array} Array of tracked events
   */
  getEvents() {
    return this.events;
  }
};

/**
 * Theme Management
 * Demonstrates dynamic theming capabilities
 */
const ThemeManager = {
  /**
   * Detect user's preferred color scheme
   * @returns {string} 'dark' or 'light'
   */
  getPreferredTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },

  /**
   * Apply theme to the application
   * @param {string} theme - Theme name ('dark' or 'light')
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    console.log(`🎨 Applied ${theme} theme`);
  },

  /**
   * Initialize theme management
   */
  init() {
    // Listen for theme preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.applyTheme(e.matches ? 'dark' : 'light');
      });
    }
    
    // Apply initial theme
    this.applyTheme(this.getPreferredTheme());
  }
};

// Initialize theme management when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
});