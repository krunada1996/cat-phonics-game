document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    const startGameBtn = document.getElementById('start-game-btn');
    const scoreDisplay = document.getElementById('current-score');
    const levelDisplay = document.getElementById('current-level');
    const wordDisplay = document.getElementById('word-display');
    const wordImage = document.getElementById('word-image');
    const optionsContainer = document.getElementById('options-container');
    const feedbackMessage = document.getElementById('feedback-message');
    const audioPlayer = document.getElementById('audio-player');
    const cattyCharacter = document.getElementById('catty-character');
    const enemyCharacter = document.getElementById('enemy-character');

    const quizQuestionsContainer = document.getElementById('quiz-questions');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const finalScoreDisplay = document.getElementById('final-score');
    const masteryMessage = document.getElementById('mastery-message');
    const catRank = document.getElementById('cat-rank');
    const restartGameBtn = document.getElementById('restart-game-btn');

    // --- Game State Variables ---
    let currentScore = 0;
    let currentLevelIndex = 0; // 0 for 'a', 1 for 'e', etc.
    let currentWordIndex = 0;
    let correctAnswersCount = 0; // For final mastery
    let totalWordsAttempted = 0;

    const vowels = ['a', 'e', 'i', 'o', 'u'];

    // --- Game Data (คำศัพท์, เสียง, รูปภาพ) ---
    // เพื่อให้โค้ดไม่ยาวเกินไป ผมจะใส่คำศัพท์ไม่กี่คำต่อสระนะครับ
    // ในเกมจริงควรมีอย่างน้อย 10-15 คำต่อสระ
    const gameData = {
        'a': [
            { word: 'cat', missing: 'a', meaning: 'แมว', image: 'https://via.placeholder.com/100/A000A0/FFFFFF?text=CAT' },
            { word: 'hat', missing: 'a', meaning: 'หมวก', image: 'https://via.placeholder.com/100/A000A0/FFFFFF?text=HAT' },
            { word: 'fan', missing: 'a', meaning: 'พัดลม', image: 'https://via.placeholder.com/100/A000A0/FFFFFF?text=FAN' },
            { word: 'bag', missing: 'a', meaning: 'กระเป๋า', image: 'https://via.placeholder.com/100/A000A0/FFFFFF?text=BAG' },
            { word: 'map', missing: 'a', meaning: 'แผนที่', image: 'https://via.placeholder.com/100/A000A0/FFFFFF?text=MAP' }
        ],
        'e': [
            { word: 'pen', missing: 'e', meaning: 'ปากกา', image: 'https://via.placeholder.com/100/00A0A0/FFFFFF?text=PEN' },
            { word: 'bed', missing: 'e', meaning: 'เตียง', image: 'https://via.placeholder.com/100/00A0A0/FFFFFF?text=BED' },
            { word: 'leg', missing: 'e', meaning: 'ขา', image: 'https://via.placeholder.com/100/00A0A0/FFFFFF?text=LEG' },
            { word: 'net', missing: 'e', meaning: 'ตาข่าย', image: 'https://via.placeholder.com/100/00A0A0/FFFFFF?text=NET' },
            { word: 'hen', missing: 'e', meaning: 'แม่ไก่', image: 'https://via.placeholder.com/100/00A0A0/FFFFFF?text=HEN' }
        ],
        'i': [
            { word: 'pin', missing: 'i', meaning: 'เข็ม', image: 'https://via.placeholder.com/100/A0A000/FFFFFF?text=PIN' },
            { word: 'sit', missing: 'i', meaning: 'นั่ง', image: 'https://via.placeholder.com/100/A0A000/FFFFFF?text=SIT' },
            { word: 'pig', missing: 'i', meaning: 'หมู', image: 'https://via.placeholder.com/100/A0A000/FFFFFF?text=PIG' },
            { word: 'zip', missing: 'i', meaning: 'ซิป', image: 'https://via.placeholder.com/100/A0A000/FFFFFF?text=ZIP' },
            { word: 'kit', missing: 'i', meaning: 'ชุดอุปกรณ์', image: 'https://via.placeholder.com/100/A0A000/FFFFFF?text=KIT' }
        ],
        'o': [
            { word: 'top', missing: 'o', meaning: 'ลูกข่าง', image: 'https://via.placeholder.com/100/00A0A0/FFFFFF?text=TOP' },
            { word: 'dog', missing: 'o', meaning: 'หมา', image: 'https://via.placeholder.com/100/00A0A0/FFFFFF?text=DOG' },
            { word: 'box', missing: 'o', meaning: 'กล่อง', image: 'https://via.placeholder.com/100/00A0A0/FFFFFF?text=BOX' },
            { word: 'fox', missing: 'o', meaning: 'สุนัขจิ้งจอก', image: 'https://via.placeholder.com/100/00A0A0/FFFFFF?text=FOX' },
            { word: 'pot', missing: 'o', meaning: 'หม้อ', image: 'https://via.placeholder.com/100/00A0A0/FFFFFF?text=POT' }
        ],
        'u': [
            { word: 'bug', missing: 'u', meaning: 'แมลง', image: 'https://via.placeholder.com/100/A0A0A0/FFFFFF?text=BUG' },
            { word: 'sun', missing: 'u', meaning: 'พระอาทิตย์', image: 'https://via.placeholder.com/100/A0A0A0/FFFFFF?text=SUN' },
            { word: 'cup', missing: 'u', meaning: 'ถ้วย', image: 'https://via.placeholder.com/100/A0A0A0/FFFFFF?text=CUP' },
            { word: 'run', missing: 'u', meaning: 'วิ่ง', image: 'https://via.placeholder.com/100/A0A0A0/FFFFFF?text=RUN' },
            { word: 'bus', missing: 'u', meaning: 'รถบัส', image: 'https://via.placeholder.com/100/A0A0A0/FFFFFF?text=BUS' }
        ]
    };

    // --- Helper Functions ---
    function showScreen(screen) {
        document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    function playAudio(src) {
        audioPlayer.src = src;
        audioPlayer.play();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generateOptions(correctVowel) {
        let options = [correctVowel];
        const otherVowels = vowels.filter(v => v !== correctVowel);
        shuffleArray(otherVowels);
        options.push(otherVowels[0], otherVowels[1]); // Add 2 random incorrect vowels
        shuffleArray(options); // Shuffle the options
        return options;
    }

    function resetGame() {
        currentScore = 0;
        currentLevelIndex = 0;
        currentWordIndex = 0;
        correctAnswersCount = 0;
        totalWordsAttempted = 0;
        scoreDisplay.textContent = currentScore;
    }

    // --- Game Logic ---
    function loadLevel() {
        const currentVowel = vowels[currentLevelIndex];
        levelDisplay.textContent = currentVowel.toUpperCase();
        currentWordIndex = 0;
        loadWord();
    }

    function loadWord() {
        feedbackMessage.textContent = '';
        const currentVowel = vowels[currentLevelIndex];
        const levelWords = gameData[currentVowel];

        if (currentWordIndex >= levelWords.length) {
            // Level completed
            if (currentLevelIndex < vowels.length - 1) {
                currentLevelIndex++;
                alert(`ยอดเยี่ยม! คุณผ่านด่านสระเสียงสั้น '${currentVowel.toUpperCase()}' แล้ว!`);
                loadLevel();
            } else {
                // All main levels completed, go to quiz
                alert('คุณเอาชนะอสูรลอง-วีได้แล้ว! ถึงเวลาทดสอบความรู้สุดท้าย!');
                generateQuiz();
                showScreen(quizScreen);
            }
            return;
        }

        const wordData = levelWords[currentWordIndex];
        const displayedWord = wordData.word.replace(wordData.missing, '_');
        wordDisplay.textContent = displayedWord;
        wordImage.src = wordData.image;
        wordImage.alt = wordData.meaning;

        // Play the sound of the full word
        // Note: For actual game, you'd need pre-recorded audio files
        // For now, we'll simulate by announcing the full word.
        playAudio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${wordData.word}`);

        optionsContainer.innerHTML = ''; // Clear previous options
        const options = generateOptions(wordData.missing);
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.textContent = option.toUpperCase();
            btn.dataset.vowel = option;
            btn.addEventListener('click', () => handleOptionClick(option, wordData));
            optionsContainer.appendChild(btn);
        });
    }

    function handleOptionClick(selectedVowel, wordData) {
        totalWordsAttempted++;
        if (selectedVowel === wordData.missing) {
            currentScore += 50;
            correctAnswersCount++;
            feedbackMessage.textContent = 'ถูกต้อง! ยอดเยี่ยมมาก!';
            feedbackMessage.style.color = '#4CAF50';
            scoreDisplay.textContent = currentScore;
            cattyCharacter.classList.add('catty-attack');
            enemyCharacter.classList.add('enemy-hit');
            playAudio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${wordData.word}`); // Replay correct word
        } else {
            feedbackMessage.textContent = `ผิด! คำที่ถูกต้องคือ "${wordData.word}" (${wordData.meaning})`;
            feedbackMessage.style.color = '#F44336';
            // Play incorrect sound then correct sound
            // For now, just play correct sound after a delay
            setTimeout(() => {
                playAudio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${wordData.word}`);
            }, 1000);
        }

        setTimeout(() => {
            cattyCharacter.classList.remove('catty-attack');
            enemyCharacter.classList.remove('enemy-hit');
            currentWordIndex++;
            loadWord();
        }, 1500); // Delay before loading next word
    }

    // --- Quiz Logic ---
    function generateQuiz() {
        quizQuestionsContainer.innerHTML = ''; // Clear previous quiz
        const allWords = Object.values(gameData).flat(); // Get all words from all levels
        shuffleArray(allWords);
        const quizWords = allWords.slice(0, 10); // Select 10 random words for quiz

        quizWords.forEach((wordData, index) => {
            const quizItem = document.createElement('div');
            quizItem.classList.add('quiz-item');

            let questionHTML = '';
            // Example quiz types:
            // 1. Listen and choose meaning
            // 2. See picture and fill vowel
            // 3. See word and choose picture

            // For simplicity, let's do a "Listen and choose meaning" type quiz
            questionHTML += `<p>ข้อที่ ${index + 1}. ฟังคำศัพท์แล้วเลือกความหมายที่ถูกต้อง:</p>`;
            questionHTML += `<button class="play-quiz-audio" data-word="${wordData.word}">▶️ ฟัง</button>`;
            questionHTML += `<div class="quiz-options">`;

            // Generate 3 random meanings including the correct one
            let meaningOptions = [wordData.meaning];
            const otherMeanings = allWords
                .filter(w => w.meaning !== wordData.meaning)
                .map(w => w.meaning);
            shuffleArray(otherMeanings);
            meaningOptions.push(otherMeanings[0], otherMeanings[1]);
            shuffleArray(meaningOptions);

            meaningOptions.forEach(m => {
                questionHTML += `
                    <label>
                        <input type="radio" name="quiz-${index}" value="${m}" data-correct="${m === wordData.meaning}">
                        ${m}
                    </label>
                `;
            });
            questionHTML += `</div>`;
            quizItem.innerHTML = questionHTML;
            quizQuestionsContainer.appendChild(quizItem);
        });

        // Add event listeners for quiz audio buttons
        document.querySelectorAll('.play-quiz-audio').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const wordToPlay = event.target.dataset.word;
                playAudio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${wordToPlay}`);
            });
        });
    }

    submitQuizBtn.addEventListener('click', () => {
        let quizScore = 0;
        const quizItems = quizQuestionsContainer.querySelectorAll('.quiz-item');
        quizItems.forEach((item, index) => {
            const selectedOption = item.querySelector(`input[name="quiz-${index}"]:checked`);
            if (selectedOption && selectedOption.dataset.correct === 'true') {
                quizScore += 100;
            }
        });
        currentScore += quizScore;
        showResultScreen();
    });

    // --- Result Screen Logic ---
    function showResultScreen() {
        showScreen(resultScreen);
        finalScoreDisplay.textContent = currentScore;
        masteryMessage.textContent = `คุณสะกดคำศัพท์สระเสียงสั้นได้ถูกต้อง ${correctAnswersCount}/${totalWordsAttempted} คำ!`;

        let rank = '';
        if (currentScore >= 2000) {
            rank = 'Cat Phonics Master! (สุดยอดปรมาจารย์)';
        } else if (currentScore >= 1000) {
            rank = 'Brave Cat Warrior! (นักรบแมวผู้กล้าหาญ)';
        } else if (currentScore >= 500) {
            rank = 'Phonics Apprentice (แมวฝึกหัด)';
        } else {
            rank = 'Newborn Kitten (ลูกแมวเหมียว)';
        }
        catRank.textContent = rank;
    }

    // --- Event Listeners ---
    startGameBtn.addEventListener('click', () => {
        showScreen(gameScreen);
        resetGame();
        loadLevel();
    });

    restartGameBtn.addEventListener('click', () => {
        showScreen(startScreen); // Go back to start screen
        resetGame();
    });
});