    // Carousel functionality
    let currentSlide = 0;
    const totalSlides = 5;

    function initializeCarousel() {
      const navContainer = document.getElementById('carousel-nav');
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(i);
        navContainer.appendChild(dot);
      }
      
      // Auto-advance carousel
      setInterval(() => {
        changeSlide(1);
      }, 5000);
    }

    function updateCarousel() {
      const slides = document.getElementById('slides');
      const dots = document.querySelectorAll('.nav-dot');
      
      slides.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }

    function changeSlide(direction) {
      currentSlide += direction;
      if (currentSlide >= totalSlides) currentSlide = 0;
      if (currentSlide < 0) currentSlide = totalSlides - 1;
      updateCarousel();
    }

    function goToSlide(index) {
      currentSlide = index;
      updateCarousel();
    }

    // Quiz functionality
    const quizQuestions = [
      {
        question: "Which country is home to Machu Picchu?",
        options: ["Brazil", "Peru", "Chile", "Argentina"],
        correct: 1
      },
      {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: 2
      },
      {
        question: "Which city is known as the 'Pearl of the Orient'?",
        options: ["Bangkok", "Hong Kong", "Singapore", "Manila"],
        correct: 1
      },
      {
        question: "In which country would you find the ancient city of Petra?",
        options: ["Egypt", "Jordan", "Israel", "Lebanon"],
        correct: 1
      },
      {
        question: "Which European city is famous for its canals and gondolas?",
        options: ["Amsterdam", "Venice", "Bruges", "Stockholm"],
        correct: 1
      },
      {
        question: "What is the highest mountain in Africa?",
        options: ["Mount Kenya", "Mount Kilimanjaro", "Mount Elgon", "Ras Dashen"],
        correct: 1
      },
      {
        question: "Which country has the most time zones?",
        options: ["USA", "Russia", "China", "Canada"],
        correct: 1
      },
      {
        question: "The Great Barrier Reef is located off the coast of which country?",
        options: ["New Zealand", "Philippines", "Australia", "Indonesia"],
        correct: 2
      }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let answered = false;

    function loadQuestion() {
      if (currentQuestionIndex >= quizQuestions.length) {
        showFinalScore();
        return;
      }

      const question = quizQuestions[currentQuestionIndex];
      document.getElementById('quiz-question').textContent = question.question;
      
      const optionsContainer = document.getElementById('quiz-options');
      optionsContainer.innerHTML = '';
      
      question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionDiv);
      });
      
      document.getElementById('next-btn').style.display = 'none';
      answered = false;
      updateScore();
    }

    function selectOption(selectedIndex) {
      if (answered) return;
      
      answered = true;
      const question = quizQuestions[currentQuestionIndex];
      const options = document.querySelectorAll('.option');
      
      options.forEach((option, index) => {
        if (index === question.correct) {
          option.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
          option.classList.add('wrong');
        }
        option.style.pointerEvents = 'none';
      });
      
      if (selectedIndex === question.correct) {
        score++;
      }
      
      document.getElementById('next-btn').style.display = 'block';
      updateScore();
    }

    function nextQuestion() {
      currentQuestionIndex++;
      loadQuestion();
    }

    function updateScore() {
      document.getElementById('score').textContent = `Score: ${score}/${currentQuestionIndex + (answered ? 1 : 0)}`;
    }

    function showFinalScore() {
      const percentage = Math.round((score / quizQuestions.length) * 100);
      let message = '';
      
      if (percentage >= 80) {
        message = "🏆 Amazing! You're a true travel expert!";
      } else if (percentage >= 60) {
        message = "✈️ Great job! You know your way around the world!";
      } else if (percentage >= 40) {
        message = "🗺️ Not bad! Keep exploring to learn more!";
      } else {
        message = "🌍 Time to start planning your next adventure!";
      }
      
      document.getElementById('quiz-question').innerHTML = `
        <h3>Quiz Complete!</h3>
        <p>Final Score: ${score}/${quizQuestions.length} (${percentage}%)</p>
        <p>${message}</p>
      `;
      document.getElementById('quiz-options').innerHTML = '';
      document.getElementById('next-btn').innerHTML = 'Restart Quiz';
      document.getElementById('next-btn').style.display = 'block';
      document.getElementById('next-btn').onclick = restartQuiz;
    }

    function restartQuiz() {
      currentQuestionIndex = 0;
      score = 0;
      document.getElementById('next-btn').onclick = nextQuestion;
      document.getElementById('next-btn').innerHTML = 'Next Question';
      loadQuestion();
    }

    // Travel quotes
    const travelQuotes = [
      "The world is a book, and those who do not travel read only one page. - Saint Augustine",
      "Travel is the only thing you buy that makes you richer. - Unknown",
      "Not all those who wander are lost. - J.R.R. Tolkien",
      "Adventure is worthwhile in itself. - Amelia Earhart",
      "To travel is to live. - Hans Christian Andersen",
      "The journey not the arrival matters. - T.S. Eliot",
      "Travel far enough, you meet yourself. - David Mitchell",
      "Life is short and the world is wide. - Simon Raven",
      "Travel makes one modest. You see what a tiny place you occupy in the world. - Gustave Flaubert",
      "A journey is best measured in friends, rather than miles. - Tim Cahill"
    ];

    function fetchQuote() {
      const randomQuote = travelQuotes[Math.floor(Math.random() * travelQuotes.length)];
      const resultDiv = document.getElementById('api-result');
      
      resultDiv.style.opacity = '0';
      setTimeout(() => {
        resultDiv.innerHTML = `<strong>💭 Travel Wisdom:</strong><br><br>"${randomQuote}"`;
        resultDiv.style.opacity = '1';
      }, 200);
    }

    // Initialize everything when page loads
    document.addEventListener('DOMContentLoaded', function() {
      initializeCarousel();
      loadQuestion();
    });

