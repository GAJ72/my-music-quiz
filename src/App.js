 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#bfdbfe' }}>
             <span>Question {currentQuestion + 1} of {currentQuestions.length}</span>
             <span>Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Coins style={{ width: '1.25rem', height: '1.25rem', color: '#fbbf24' }} />
               <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{credits}</span>
             </div>
             
             <div style={{
               display: 'flex',
               alignItems: 'center',
               gap: '0.5rem',
               padding: '0.25rem 0.75rem',
               borderRadius: '9999px',
               background: timeLeft <= 3 ? 'rgba(239, 68, 68, 0.2)' : 
                          timeLeft <= 5 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
               color: timeLeft <= 3 ? '#fca5a5' : 
                      timeLeft <= 5 ? '#fcd34d' : '#86efac'
             }}>
               <Clock style={{ width: '1rem', height: '1rem' }} />
               <span style={{ fontWeight: 'bold' }}>{timeLeft}s</span>
             </div>
             
             {(timeLeft <= 5 && credits > 0 && !showResult) && (
               <button
                 onClick={buyExtraTime}
                 style={{
                   background: 'linear-gradient(135deg, #d97706, #ea580c)',
                   color: 'white',
                   fontSize: '0.75rem',
                   fontWeight: 'bold',
                   padding: '0.25rem 0.75rem',
                   borderRadius: '9999px',
                   border: 'none',
                   cursor: 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '0.25rem'
                 }}
               >
                 <Plus style={{ width: '0.75rem', height: '0.75rem' }} />
                 +10s
               </button>
             )}
             
             <button
               onClick={() => setView('store')}
               style={{
                 background: 'linear-gradient(135deg, #059669, #10b981)',
                 color: 'white',
                 fontSize: '0.75rem',
                 fontWeight: 'bold',
                 padding: '0.25rem 0.75rem',
                 borderRadius: '9999px',
                 border: 'none',
                 cursor: 'pointer'
               }}
             >
               Buy
             </button>
           </div>
         </div>

         {/* Quiz Info Banner */}
         <div style={{
           display: 'flex',
           justifyContent: 'center',
           gap: '1rem',
           marginBottom: '1.5rem',
           fontSize: '0.875rem'
         }}>
           <span style={{ 
             padding: '0.5rem 1rem', 
             borderRadius: '9999px',
             background: difficulties[selectedDifficulty]?.bgColor,
             color: difficulties[selectedDifficulty]?.color,
             fontWeight: '600'
           }}>
             {difficulties[selectedDifficulty]?.name} • {difficulties[selectedDifficulty]?.pointsMultiplier}x Points
           </span>
           <span style={{ 
             padding: '0.5rem 1rem', 
             borderRadius: '9999px',
             background: categories[selectedCategory]?.bgColor,
             color: categories[selectedCategory]?.color,
             fontWeight: '600'
           }}>
             {categories[selectedCategory]?.icon} {categories[selectedCategory]?.name}
           </span>
         </div>

         {/* Progress Bar */}
         <div style={{ 
           width: '100%', 
           background: 'rgba(255, 255, 255, 0.2)', 
           borderRadius: '9999px', 
           height: '0.75rem', 
           marginBottom: '2rem' 
         }}>
           <div style={{
             background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
             height: '0.75rem',
             borderRadius: '9999px',
             width: `${((currentQuestion + (showResult ? 1 : 0)) / currentQuestions.length) * 100}%`,
             transition: 'all 0.5s ease'
           }} />
         </div>

         {/* Question */}
         <div style={{ marginBottom: '2rem' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
             {currentQuestions[currentQuestion]?.question}
           </h2>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {currentQuestions[currentQuestion]?.options.map((option, i) => (
               <button
                 key={i}
                 onClick={() => setSelectedAnswer(option)}
                 disabled={showResult}
                 style={{
                   width: '100%',
                   textAlign: 'left',
                   padding: '1rem',
                   borderRadius: '0.75rem',
                   border: '2px solid',
                   borderColor: showResult
                     ? option === currentQuestions[currentQuestion].correct
                       ? '#10b981'
                       : option === selectedAnswer && option !== currentQuestions[currentQuestion].correct
                       ? '#ef4444'
                       : 'rgba(255, 255, 255, 0.2)'
                     : selectedAnswer === option
                     ? '#8b5cf6'
                     : 'rgba(255, 255, 255, 0.2)',
                   background: showResult
                     ? option === currentQuestions[currentQuestion].correct
                       ? 'rgba(16, 185, 129, 0.3)'
                       : option === selectedAnswer && option !== currentQuestions[currentQuestion].correct
                       ? 'rgba(239, 68, 68, 0.3)'
                       : 'rgba(255, 255, 255, 0.1)'
                     : selectedAnswer === option
                     ? 'rgba(139, 92, 246, 0.3)'
                     : 'rgba(255, 255, 255, 0.1)',
                   color: '#ffffff',
                   cursor: showResult ? 'default' : 'pointer',
                   transition: 'all 0.3s ease',
                   fontSize: '1rem'
                 }}
                 onMouseOver={(e) => {
                   if (!showResult && selectedAnswer !== option) {
                     e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                     e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                   }
                 }}
                 onMouseOut={(e) => {
                   if (!showResult && selectedAnswer !== option) {
                     e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                     e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                   }
                 }}
               >
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <span>{option}</span>
                   {showResult && option === currentQuestions[currentQuestion].correct && (
                     <span style={{ color: '#10b981' }}>✓</span>
                   )}
                   {showResult && option === selectedAnswer && option !== currentQuestions[currentQuestion].correct && (
                     <span style={{ color: '#ef4444' }}>✗</span>
                   )}
                 </div>
               </button>
             ))}
           </div>
         </div>

         {/* Explanation */}
         {showResult && (
           <div style={{
             marginBottom: '1.5rem',
             padding: '1rem',
             background: 'rgba(255, 255, 255, 0.1)',
             borderRadius: '0.75rem',
             border: '1px solid rgba(255, 255, 255, 0.2)'
           }}>
             <p style={{ color: '#bfdbfe', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
               {currentQuestions[currentQuestion]?.explanation}
             </p>
           </div>
         )}

         {/* Action Button */}
         <div style={{ textAlign: 'center' }}>
           {currentQuestion === 0 && !isTimerActive && !showResult ? (
             <button
               onClick={startTimer}
               style={{
                 ...buttonStyle,
                 background: 'linear-gradient(135deg, #059669, #2563eb)',
                 color: 'white',
                 padding: '0.75rem 2rem',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.5rem',
                 margin: '0 auto',
                 fontSize: '1rem'
               }}
             >
               <Play style={{ width: '1.25rem', height: '1.25rem' }} />
               Start Quiz
             </button>
           ) : !showResult ? (
             timeLeft === 0 ? (
               <button
                 onClick={handleSubmitAnswer}
                 style={{
                   ...buttonStyle,
                   background: 'linear-gradient(135deg, #dc2626, #ea580c)',
                   color: 'white',
                   padding: '0.75rem 2rem',
                   fontSize: '1rem'
                 }}
               >
                 Continue
               </button>
             ) : (
               <button
                 onClick={handleSubmitAnswer}
                 disabled={!selectedAnswer}
                 style={{
                   ...buttonStyle,
                   padding: '0.75rem 2rem',
                   cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                   background: selectedAnswer
                     ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                     : '#6b7280',
                   color: selectedAnswer ? 'white' : '#9ca3af',
                   fontSize: '1rem'
                 }}
               >
                 Submit Answer
               </button>
             )
           ) : (
             <button
               onClick={handleNextQuestion}
               style={{
                 ...buttonStyle,
                 background: 'linear-gradient(135deg, #059669, #2563eb)',
                 color: 'white',
                 padding: '0.75rem 2rem',
                 fontSize: '1rem'
               }}
             >
               {currentQuestion < currentQuestions.length - 1 ? 'Next Question' : 'View Results'}
             </button>
           )}
         </div>import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Trophy, Calendar, Music, Crown, Users, Clock, Coins, Plus, CreditCard, Lock, Star, Zap, Brain } from 'lucide-react';

const DailyMusicQuiz = () => {
  // Core quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  
  // New state for difficulty and category
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState([]);
  
  // Timer and credits
  const [timeLeft, setTimeLeft] = useState(10);
  const [credits, setCredits] = useState(3);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // UI and user state
  const [view, setView] = useState('selection');
  const [playerName, setPlayerName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Payment state
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Difficulty levels with different timer values and scoring
  const difficulties = {
    easy: {
      name: "Easy",
      icon: Star,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.2)",
      borderColor: "rgba(16, 185, 129, 0.3)",
      timer: 15,
      pointsMultiplier: 1,
      description: "Perfect for beginners • 15 seconds per question"
    },
    medium: {
      name: "Medium", 
      icon: Zap,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.2)",
      borderColor: "rgba(245, 158, 11, 0.3)",
      timer: 10,
      pointsMultiplier: 1.5,
      description: "For music enthusiasts • 10 seconds per question"
    },
    hard: {
      name: "Hard",
      icon: Brain,
      color: "#ef4444", 
      bgColor: "rgba(239, 68, 68, 0.2)",
      borderColor: "rgba(239, 68, 68, 0.3)",
      timer: 7,
      pointsMultiplier: 2,
      description: "Expert level challenge • 7 seconds per question"
    }
  };

  // Categories with themed questions
  const categories = {
    rock: {
      name: "Rock & Metal",
      icon: "🎸",
      color: "#dc2626",
      bgColor: "rgba(220, 38, 38, 0.2)",
      borderColor: "rgba(220, 38, 38, 0.3)",
      description: "Classic rock, metal, and alternative"
    },
    pop: {
      name: "Pop & Charts",
      icon: "⭐",
      color: "#ec4899", 
      bgColor: "rgba(236, 72, 153, 0.2)",
      borderColor: "rgba(236, 72, 153, 0.3)",
      description: "Chart toppers and pop classics"
    },
    hiphop: {
      name: "Hip-Hop & R&B",
      icon: "🎤",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.2)", 
      borderColor: "rgba(139, 92, 246, 0.3)",
      description: "Rap, hip-hop, and R&B hits"
    },
    classical: {
      name: "Classical & Jazz", 
      icon: "🎼",
      color: "#059669",
      bgColor: "rgba(5, 150, 105, 0.2)",
      borderColor: "rgba(5, 150, 105, 0.3)",
      description: "Classical masterpieces and jazz standards"
    },
    mixed: {
      name: "Mixed Genres",
      icon: "🎵", 
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.2)",
      borderColor: "rgba(59, 130, 246, 0.3)", 
      description: "A bit of everything"
    }
  };

  // Question database organized by category and difficulty
  const questionDatabase = {
    rock: {
      easy: [
        {
          question: "Which band released the album 'Abbey Road'?",
          options: ['The Rolling Stones', 'The Beatles', 'Led Zeppelin', 'Pink Floyd'],
          correct: 'The Beatles',
          explanation: "Abbey Road was The Beatles' final studio album, released in 1969."
        },
        {
          question: "Who is the lead singer of Queen?",
          options: ['David Bowie', 'Freddie Mercury', 'Mick Jagger', 'Robert Plant'],
          correct: 'Freddie Mercury',
          explanation: "Freddie Mercury was Queen's iconic lead vocalist and frontman."
        },
        {
          question: "Which band performed 'Stairway to Heaven'?",
          options: ['Deep Purple', 'Black Sabbath', 'Led Zeppelin', 'Pink Floyd'],
          correct: 'Led Zeppelin',
          explanation: "'Stairway to Heaven' is Led Zeppelin's most famous song from 1971."
        },
        {
          question: "How many strings does a standard guitar have?",
          options: ['4', '5', '6', '7'],
          correct: '6',
          explanation: "A standard guitar has 6 strings, tuned E-A-D-G-B-E."
        },
        {
          question: "Which instrument is Keith Moon famous for playing?",
          options: ['Guitar', 'Bass', 'Drums', 'Keyboard'],
          correct: 'Drums',
          explanation: "Keith Moon was the explosive drummer for The Who."
        }
      ],
      medium: [
        {
          question: "What year was 'Dark Side of the Moon' by Pink Floyd released?",
          options: ['1971', '1973', '1975', '1977'],
          correct: '1973',
          explanation: "Pink Floyd's 'Dark Side of the Moon' was released in 1973 and spent 14 years on the Billboard 200."
        },
        {
          question: "Which guitarist is known as 'Slowhand'?",
          options: ['Jimmy Page', 'Eric Clapton', 'Jeff Beck', 'Keith Richards'],
          correct: 'Eric Clapton',
          explanation: "Eric Clapton earned the nickname 'Slowhand' early in his career."
        },
        {
          question: "What does 'AC/DC' stand for?",
          options: ['Alternating Current/Direct Current', 'Australian Club/Disco Club', 'After Christ/During Christ', 'Nothing specific'],
          correct: 'Alternating Current/Direct Current',
          explanation: "AC/DC is named after the electrical term, seen on a sewing machine by the band's sister."
        },
        {
          question: "Which Black Sabbath song is considered the first heavy metal song?",
          options: ['Iron Man', 'Paranoid', 'Black Sabbath', 'War Pigs'],
          correct: 'Black Sabbath',
          explanation: "The song 'Black Sabbath' from 1970 is often cited as the first true heavy metal song."
        },
        {
          question: "Who replaced Syd Barrett in Pink Floyd?",
          options: ['Roger Waters', 'Nick Mason', 'David Gilmour', 'Richard Wright'],
          correct: 'David Gilmour',
          explanation: "David Gilmour joined Pink Floyd in 1968, initially alongside Syd Barrett before Barrett left."
        }
      ],
      hard: [
        {
          question: "What was the original name of Led Zeppelin?",
          options: ['The New Yardbirds', 'Zeppelin', 'The Heavy Metal Kids', 'Band of Joy'],
          correct: 'The New Yardbirds',
          explanation: "Led Zeppelin was originally called The New Yardbirds before changing their name in 1968."
        },
        {
          question: "Which album features the song 'Shine On You Crazy Diamond'?",
          options: ['The Wall', 'Animals', 'Wish You Were Here', 'Meddle'],
          correct: 'Wish You Were Here',
          explanation: "'Shine On You Crazy Diamond' is a tribute to Syd Barrett on Pink Floyd's 1975 album 'Wish You Were Here'."
        },
        {
          question: "What tuning does Tony Iommi primarily use?",
          options: ['Standard E', 'Drop D', 'C# Standard', 'Open G'],
          correct: 'C# Standard',
          explanation: "Tony Iommi often used C# standard tuning due to his fingertip injury, creating Black Sabbath's heavy sound."
        },
        {
          question: "Which producer worked on both 'Led Zeppelin IV' and 'Physical Graffiti'?",
          options: ['George Martin', 'Andy Johns', 'Jimmy Page', 'Glyn Johns'],
          correct: 'Andy Johns',
          explanation: "Andy Johns engineered and co-produced several Led Zeppelin albums including IV and Physical Graffiti."
        },
        {
          question: "What was the last song John Bonham recorded with Led Zeppelin?",
          options: ['Kashmir', 'In the Evening', 'All My Love', "I'm Gonna Crawl"],
          correct: "I'm Gonna Crawl",
          explanation: "'I'm Gonna Crawl' from 'In Through the Out Door' was the last song Bonham recorded before his death."
        }
      ]
    },
    pop: {
      easy: [
        {
          question: "Who performed the hit song 'Billie Jean'?",
          options: ['Prince', 'Michael Jackson', 'Stevie Wonder', 'James Brown'],
          correct: 'Michael Jackson',
          explanation: "'Billie Jean' was one of Michael Jackson's biggest hits from 'Thriller'."
        },
        {
          question: "Which artist sang 'Like a Prayer'?",
          options: ['Whitney Houston', 'Madonna', 'Cyndi Lauper', 'Janet Jackson'],
          correct: 'Madonna',
          explanation: "'Like a Prayer' was Madonna's 1989 hit that sparked controversy and acclaim."
        },
        {
          question: "What year was 'Thriller' released?",
          options: ['1980', '1982', '1984', '1986'],
          correct: '1982',
          explanation: "Michael Jackson's 'Thriller' was released in 1982 and became the best-selling album of all time."
        },
        {
          question: "Who sang 'I Will Always Love You'?",
          options: ['Mariah Carey', 'Celine Dion', 'Whitney Houston', 'Tina Turner'],
          correct: 'Whitney Houston',
          explanation: "Whitney Houston's version of 'I Will Always Love You' was a massive hit from 'The Bodyguard' soundtrack."
        },
        {
          question: "Which boy band sang 'I Want It That Way'?",
          options: ['NSYNC', 'Backstreet Boys', 'Boyz II Men', '98 Degrees'],
          correct: 'Backstreet Boys',
          explanation: "'I Want It That Way' was the Backstreet Boys' biggest hit from 1999."
        }
      ],
      medium: [
        {
          question: "What was Britney Spears' debut single?",
          options: ['Sometimes', '...Baby One More Time', 'You Drive Me Crazy', 'Born to Make You Happy'],
          correct: '...Baby One More Time',
          explanation: "'...Baby One More Time' launched Britney Spears' career in 1998."
        },
        {
          question: "Which Adele album features 'Rolling in the Deep'?",
          options: ['19', '21', '25', '30'],
          correct: '21',
          explanation: "'Rolling in the Deep' was the lead single from Adele's album '21' released in 2011."
        },
        {
          question: "Who wrote 'I Will Always Love You' originally?",
          options: ['Whitney Houston', 'Dolly Parton', 'Diane Warren', 'Carole King'],
          correct: 'Dolly Parton',
          explanation: "Dolly Parton wrote and originally recorded 'I Will Always Love You' in 1973."
        },
        {
          question: "What was Taylor Swift's first country album?",
          options: ['Fearless', 'Taylor Swift', 'Speak Now', 'Red'],
          correct: 'Taylor Swift',
          explanation: "Taylor Swift's self-titled debut album was released in 2006 as a country album."
        },
        {
          question: "Which artist has won the most Grammy Awards?",
          options: ['Michael Jackson', 'Beyoncé', 'Alison Krauss', 'Quincy Jones'],
          correct: 'Beyoncé',
          explanation: "Beyoncé holds the record for most Grammy wins by any artist with 32 awards."
        }
      ],
      hard: [
        {
          question: "What was the first music video played on MTV?",
          options: ['Video Killed the Radio Star', 'Girls on Film', 'You Better Run', 'She\'s So High'],
          correct: 'Video Killed the Radio Star',
          explanation: "'Video Killed the Radio Star' by The Buggles was MTV's first music video on August 1, 1981."
        },
        {
          question: "Which producer is known as the 'fifth Beatle' for his work on pop hits?",
          options: ['Phil Spector', 'George Martin', 'Quincy Jones', 'Max Martin'],
          correct: 'Max Martin',
          explanation: "Max Martin has produced more #1 hits than anyone except Paul McCartney, earning him pop producer legend status."
        },
        {
          question: "What sample does 'Good 4 U' by Olivia Rodrigo interpolate?",
          options: ['Misery Business', 'That\'s What You Get', 'Crushcrushcrush', 'Still Into You'],
          correct: 'Misery Business',
          explanation: "'Good 4 U' interpolates the melody from Paramore's 'Misery Business'."
        },
        {
          question: "Which artist was the first to have a #1 hit in six consecutive decades?",
          options: ['Elton John', 'Paul McCartney', 'Barbra Streisand', 'Tony Bennett'],
          correct: 'Tony Bennett',
          explanation: "Tony Bennett achieved #1 hits from the 1950s through the 2010s, spanning six decades."
        },
        {
          question: "What was the last Beatles song to reach #1 in the US?",
          options: ['Let It Be', 'The Long and Winding Road', 'Get Back', 'Come Together'],
          correct: 'The Long and Winding Road',
          explanation: "'The Long and Winding Road' was The Beatles' final #1 hit in the US in 1970."
        }
      ]
    },
    hiphop: {
      easy: [
        {
          question: "Who is known as the 'King of Pop'?",
          options: ['Prince', 'Michael Jackson', 'Stevie Wonder', 'James Brown'],
          correct: 'Michael Jackson',
          explanation: "Michael Jackson earned the title 'King of Pop' through his massive global influence."
        },
        {
          question: "Which rapper released the album 'The Marshall Mathers LP'?",
          options: ['Jay-Z', 'Nas', 'Eminem', '50 Cent'],
          correct: 'Eminem',
          explanation: "'The Marshall Mathers LP' is one of Eminem's most successful albums from 2000."
        },
        {
          question: "What does 'DJ' stand for?",
          options: ['Disk Jockey', 'Dance Judge', 'Digital Jammer', 'Drum Jazz'],
          correct: 'Disk Jockey',
          explanation: "DJ stands for Disk Jockey, someone who plays recorded music for an audience."
        },
        {
          question: "Which city is considered the birthplace of hip-hop?",
          options: ['Los Angeles', 'Chicago', 'New York', 'Detroit'],
          correct: 'New York',
          explanation: "Hip-hop originated in the Bronx, New York in the 1970s."
        },
        {
          question: "Who sang 'Crazy in Love'?",
          options: ['Whitney Houston', 'Alicia Keys', 'Beyoncé', 'Janet Jackson'],
          correct: 'Beyoncé',
          explanation: "'Crazy in Love' featuring Jay-Z was Beyoncé's debut solo single in 2003."
        }
      ],
      medium: [
        {
          question: "What was Tupac's real name?",
          options: ['Tupac Amaru Shakur', 'Lesane Parish Crooks', 'Both A and B', 'Neither A nor B'],
          correct: 'Both A and B',
          explanation: "Tupac was born Lesane Parish Crooks but later renamed Tupac Amaru Shakur."
        },
        {
          question: "Which producer is behind the beats for 'Still D.R.E.'?",
          options: ['Dr. Dre', 'Scott Storch', 'Mel-Man', 'Focus...'],
          correct: 'Scott Storch',
          explanation: "Scott Storch co-produced 'Still D.R.E.' with Dr. Dre, playing the iconic piano melody."
        },
        {
          question: "What was the first rap song to hit #1 on the Billboard Hot 100?",
          options: ['Rapture', 'The Message', 'Rapper\'s Delight', 'Planet Rock'],
          correct: 'Rapture',
          explanation: "Blondie's 'Rapture' featuring a rap section was the first rap-influenced song to hit #1 in 1981."
        },
        {
          question: "Which album features the song 'Juicy' by The Notorious B.I.G.?",
          options: ['Life After Death', 'Ready to Die', 'Born Again', 'Duets'],
          correct: 'Ready to Die',
          explanation: "'Juicy' was the lead single from Biggie's debut album 'Ready to Die' in 1994."
        },
        {
          question: "What does 'N.W.A' stand for?",
          options: ['New Wave Association', 'Niggaz Wit Attitudes', 'New World Artists', 'North West Alliance'],
          correct: 'Niggaz Wit Attitudes',
          explanation: "N.W.A stood for 'Niggaz Wit Attitudes', the influential rap group from Compton."
        }
      ],
      hard: [
        {
          question: "Which sample is used in 'Through the Wire' by Kanye West?",
          options: ['Through the Fire', 'Through the Rain', 'Through the Wire', 'Through the Night'],
          correct: 'Through the Fire',
          explanation: "Kanye West sampled Chaka Khan's 'Through the Fire' for his debut single 'Through the Wire'."
        },
        {
          question: "What was the first hip-hop album to win a Grammy for Album of the Year?",
          options: ['The Miseducation of Lauryn Hill', 'Eminem Show', 'OutKast Speakerboxxx', 'None yet'],
          correct: 'The Miseducation of Lauryn Hill',
          explanation: "Lauryn Hill's album was the first hip-hop album to win the Grammy for Album of the Year in 1999."
        },
        {
          question: "Which rapper founded Roc-A-Fella Records?",
          options: ['Jay-Z alone', 'Dame Dash alone', 'Jay-Z and Dame Dash', 'Jay-Z, Dame Dash, and Kareem Burke'],
          correct: 'Jay-Z, Dame Dash, and Kareem Burke',
          explanation: "Roc-A-Fella Records was co-founded by Jay-Z, Dame Dash, and Kareem 'Biggs' Burke in 1995."
        },
        {
          question: "What was the last song recorded by Tupac before his death?",
          options: ['Hit \'Em Up', 'All Eyez on Me', 'Hail Mary', 'Better Dayz'],
          correct: 'Better Dayz',
          explanation: "'Better Dayz' was among the last songs Tupac recorded in the studio before his death in 1996."
        },
        {
          question: "Which MF DOOM album is considered his magnum opus?",
          options: ['Operation: Doomsday', 'Madvillainy', 'Mm.. Food', 'Born Like This'],
          correct: 'Madvillainy',
          explanation: "'Madvillainy' with Madlib is widely considered MF DOOM's masterpiece and most influential work."
        }
      ]
    },
    classical: {
      easy: [
        {
          question: "Who composed 'The Four Seasons'?",
          options: ['Bach', 'Mozart', 'Vivaldi', 'Beethoven'],
          correct: 'Vivaldi',
          explanation: "Antonio Vivaldi composed 'The Four Seasons' around 1720."
        },
        {
          question: "How many movements does a typical symphony have?",
          options: ['2', '3', '4', '5'],
          correct: '4',
          explanation: "A classical symphony typically has four movements in fast-slow-dance-fast structure."
        },
        {
          question: "Which instrument family does the violin belong to?",
          options: ['Brass', 'Woodwind', 'Percussion', 'String'],
          correct: 'String',
          explanation: "The violin is a string instrument played with a bow."
        },
        {
          question: "Who wrote 'Für Elise'?",
          options: ['Mozart', 'Beethoven', 'Chopin', 'Bach'],
          correct: 'Beethoven',
          explanation: "Ludwig van Beethoven composed 'Für Elise' around 1810."
        },
        {
          question: "What is the lowest male singing voice called?",
          options: ['Tenor', 'Baritone', 'Bass', 'Alto'],
          correct: 'Bass',
          explanation: "Bass is the lowest male singing voice in classical music."
        }
      ],
      medium: [
        {
          question: "Which composer wrote 'The Magic Flute'?",
          options: ['Haydn', 'Mozart', 'Schubert', 'Weber'],
          correct: 'Mozart',
          explanation: "'The Magic Flute' (Die Zauberflöte) was Mozart's final opera, completed in 1791."
        },
        {
          question: "What key is Beethoven's 9th Symphony in?",
          options: ['C major', 'D major', 'D minor', 'E flat major'],
          correct: 'D minor',
          explanation: "Beethoven's 9th Symphony is in D minor, though it ends triumphantly in D major."
        },
        {
          question: "Which period comes after the Baroque period in classical music?",
          options: ['Romantic', 'Classical', 'Modern', 'Renaissance'],
          correct: 'Classical',
          explanation: "The Classical period (1750-1820) followed the Baroque period in music history."
        },
        {
          question: "Who composed 'Rhapsody in Blue'?",
          options: ['Duke Ellington', 'George Gershwin', 'Aaron Copland', 'Leonard Bernstein'],
          correct: 'George Gershwin',
          explanation: "George Gershwin composed 'Rhapsody in Blue' in 1924, blending classical and jazz elements."
        },
        {
          question: "What instrument did Miles Davis primarily play?",
          options: ['Saxophone', 'Trumpet', 'Piano', 'Trombone'],
          correct: 'Trumpet',
          explanation: "Miles Davis was a legendary jazz trumpeter and bandleader."
        }
      ],
      hard: [
        {
          question: "Which Bach work is known as 'The Art of Fugue'?",
          options: ['BWV 1080', 'BWV 988', 'BWV 846-893', 'BWV 1001-1006'],
          correct: 'BWV 1080',
          explanation: "'Die Kunst der Fuge' (BWV 1080) is Bach's final masterwork exploring counterpoint."
        },
        {
          question: "What unusual scoring does Schubert's 'Trout Quintet' have?",
          options: ['Piano, violin, viola, cello, bass', 'Piano, violin, viola, cello, clarinet', 'Piano, 2 violins, viola, cello', 'Piano, violin, viola, cello, horn'],
          correct: 'Piano, violin, viola, cello, bass',
          explanation: "The 'Trout Quintet' unusually includes double bass instead of a second violin."
        },
        {
          question: "Which Stravinsky ballet caused a riot at its 1913 premiere?",
          options: ['The Firebird', 'Petrushka', 'The Rite of Spring', 'Pulcinella'],
          correct: 'The Rite of Spring',
          explanation: "'The Rite of Spring' caused a riot in Paris due to its revolutionary rhythms and harmonies."
        },
        {
          question: "What compositional technique is Berg's 'Wozzeck' famous for using?",
          options: ['Serialism', 'Minimalism', 'Aleatoric music', 'Twelve-tone technique'],
          correct: 'Twelve-tone technique',
          explanation: "Berg's 'Wozzeck' was one of the first operas to use Schoenberg's twelve-tone technique."
        },
        {
          question: "Which jazz pianist composed 'Round Midnight'?",
          options: ['Bill Evans', 'Thelonious Monk', 'Oscar Peterson', 'Herbie Hancock'],
          correct: 'Thelonious Monk',
          explanation: "'Round Midnight' is one of Thelonious Monk's most famous compositions from 1944."
        }
      ]
    },
    mixed: [
      {
        question: "Which band released the album 'Abbey Road'?",
        options: ['The Rolling Stones', 'The Beatles', 'Led Zeppelin', 'Pink Floyd'],
        correct: 'The Beatles',
        explanation: "Abbey Road was The Beatles' final studio album, released in 1969."
      },
      {
        question: "Complete these lyrics: 'Is this the real life? Is this just fantasy? Caught in a landslide...'",
        options: ['No escape from reality', 'Lost in a dream', 'Falling from the sky', 'Time keeps slipping away'],
        correct: 'No escape from reality',
        explanation: "These are the opening lines from Queen's 'Bohemian Rhapsody'."
      },
      {
        question: "Who performed the hit song 'Billie Jean'?",
        options: ['Prince', 'Michael Jackson', 'Stevie Wonder', 'James Brown'],
        correct: 'Michael Jackson',
        explanation: "'Billie Jean' was one of Michael Jackson's biggest hits from 'Thriller'."
      },
      {
        question: "How many strings does a standard guitar have?",
        options: ['4', '5', '6', '7'],
        correct: '6',
        explanation: "A standard guitar has 6 strings, tuned E-A-D-G-B-E."
      },
      {
        question: "In which decade was 'Hotel California' released?",
        options: ['1960s', '1970s', '1980s', '1990s'],
        correct: '1970s',
        explanation: "'Hotel California' was released in 1976."
      }
    ]
  };

  const [leaderboard, setLeaderboard] = useState([
    { player_name: "MusicMaster", score: 5, percentage: 100, difficulty: "hard", category: "rock" },
    { player_name: "RockFan92", score: 4, percentage: 80, difficulty: "medium", category: "rock" },
    { player_name: "JazzLover", score: 4, percentage: 80, difficulty: "easy", category: "classical" },
  ]);

  const creditPackages = [
    { 
      id: 'starter',
      name: "Starter Pack", 
      credits: 50, 
      price: 0.99, 
      color: "green",
      popular: false,
      description: "Perfect for casual players"
    },
    { 
      id: 'pro',
      name: "Pro Pack", 
      credits: 150, 
      price: 1.99, 
      color: "purple",
      popular: true,
      description: "Great value for regular players",
      savings: "33% savings vs Starter"
    },
    { 
      id: 'ultimate',
      name: "Ultimate Pack", 
      credits: 500, 
      price: 4.99, 
      color: "yellow",
      popular: false,
      description: "Best value for quiz masters",
      savings: "50% savings vs Starter"
    }
  ];

  // Generate questions based on selected difficulty and category
  const generateQuestions = (category, difficulty) => {
    if (category === 'mixed') {
      // For mixed category, combine questions from all categories at the selected difficulty
      const allQuestions = [];
      Object.keys(questionDatabase).forEach(cat => {
        if (cat !== 'mixed' && questionDatabase[cat][difficulty]) {
          allQuestions.push(...questionDatabase[cat][difficulty]);
        }
      });
      // Shuffle and take 5 random questions
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
    }
    
    return questionDatabase[category]?.[difficulty] || questionDatabase.mixed;
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeExpired();
    }