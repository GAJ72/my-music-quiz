import React, { useState, useEffect } from 'react';
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
  
  // UI and user state - START WITH SELECTION
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
    hiphop: {
      name: "Hip-Hop & R&B",
      icon: "🎤",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.2)", 
      borderColor: "rgba(139, 92, 246, 0.3)",
      description: "Rap, hip-hop, and R&B hits"
    }
  };

  // Question database with Hip-Hop category added
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
          question: "Which producer is known for creating more #1 hits than anyone except Paul McCartney?",
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
          question: "Which producer is known for creating more #1 hits than anyone except Paul McCartney?",
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
  };;

  const [leaderboard, setLeaderboard] = useState([
    { player_name: "MusicMaster", score: 10, percentage: 100, difficulty: "hard", category: "rock" },
    { player_name: "RockFan92", score: 6, percentage: 80, difficulty: "medium", category: "rock" },
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
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, showResult]);

  // Helper functions
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const match = v.match(/\d{4,16}/g);
    const cardMatch = match && match[0] || '';
    const parts = [];
    for (let i = 0, len = cardMatch.length; i < len; i += 4) {
      parts.push(cardMatch.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };
  
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleTimeExpired = () => {
    const q = currentQuestions[currentQuestion];
    setUserAnswers([...userAnswers, { 
      question: q.question, 
      selected: 'Time Expired', 
      correct: q.correct,
      isCorrect: false,
      explanation: q.explanation
    }]);
    setShowResult(true);
    setIsTimerActive(false);
  };

  const buyExtraTime = () => {
    if (credits > 0) {
      setCredits(credits - 1);
      setTimeLeft(timeLeft + 10);
    }
  };

  const buyCredits = (packageId) => {
    const pkg = creditPackages.find(p => p.id === packageId);
    if (!pkg) return;
    
    setSelectedPackage(pkg);
    setView('payment');
  };

  const processPayment = async (packageData) => {
    setPaymentLoading(true);
    setPaymentError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (Math.random() > 0.1) {
        const newCreditTotal = credits + packageData.credits;
        setCredits(newCreditTotal);
        
        if (currentUser) {
          const updatedUser = { ...currentUser, credits: newCreditTotal };
          setCurrentUser(updatedUser);
        }
        
        alert(`🎉 Payment successful! Added ${packageData.credits} credits to your account.`);
        setView('selection');
        setSelectedPackage(null);
        return true;
      } else {
        throw new Error('Your card was declined. Please try a different payment method.');
      }
    } catch (error) {
      setPaymentError(error.message);
      return false;
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!cardNumber || !expiry || !cvc || !cardName) {
      setPaymentError('Please fill in all payment details');
      return;
    }
    
    await processPayment(selectedPackage);
  };

  const createUser = (name) => {
    if (!name || !name.trim()) return;
    const user = { name: name.trim(), credits: 3, bestScore: 0 };
    setCurrentUser(user);
    setPlayerName(name.trim());
    setView('selection');
  };

  const addToLeaderboard = (name, finalScore) => {
    const difficultyInfo = difficulties[selectedDifficulty];
    const adjustedScore = Math.round(finalScore * difficultyInfo.pointsMultiplier);
    const percentage = Math.round((finalScore / currentQuestions.length) * 100);
    const entry = { 
      player_name: name, 
      score: adjustedScore, 
      percentage,
      difficulty: selectedDifficulty,
      category: selectedCategory
    };
    setLeaderboard([...leaderboard, entry]
      .sort((a, b) => b.score - a.score || b.percentage - a.percentage)
      .slice(0, 10));
  };

  const handleSubmitAnswer = () => {
    setIsTimerActive(false);
    const q = currentQuestions[currentQuestion];
    const isCorrect = selectedAnswer === q.correct;
    
    if (isCorrect) setScore(score + 1);
    
    setUserAnswers([...userAnswers, { 
      question: q.question, 
      selected: selectedAnswer, 
      correct: q.correct,
      isCorrect,
      explanation: q.explanation
    }]);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
      const difficultyInfo = difficulties[selectedDifficulty];
      setTimeLeft(difficultyInfo.timer);
      setIsTimerActive(true);
    } else {
      setQuizComplete(true);
      setIsTimerActive(false);
      if (currentUser) {
        const difficultyInfo = difficulties[selectedDifficulty];
        const adjustedScore = Math.round(score * difficultyInfo.pointsMultiplier);
        if (adjustedScore > currentUser.bestScore) {
          addToLeaderboard(currentUser.name, score);
        }
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer('');
    setShowResult(false);
    setQuizComplete(false);
    setUserAnswers([]);
    setTimeLeft(10);
    setIsTimerActive(false);
    setSelectedDifficulty('');
    setSelectedCategory('');
    setCurrentQuestions([]);
    setView('selection');
  };

  const startQuiz = () => {
    if (!selectedDifficulty || !selectedCategory) return;
    
    const questions = generateQuestions(selectedCategory, selectedDifficulty);
    setCurrentQuestions(questions);
    const difficultyInfo = difficulties[selectedDifficulty];
    setTimeLeft(difficultyInfo.timer);
    setView('quiz');
  };

  const startTimer = () => {
    setIsTimerActive(true);
    const difficultyInfo = difficulties[selectedDifficulty];
    setTimeLeft(difficultyInfo.timer);
  };

  // Common styles
  const buttonStyle = {
    border: 'none',
    borderRadius: '9999px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '1.5rem',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const gradientBg = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4c1d95 0%, #1e40af 50%, #3730a3 100%)',
    padding: '1rem'
  };

  console.log('Current view:', view); // Debug log

  // SELECTION SCREEN - FIRST CHECK
  if (view === 'selection') {
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Music style={{ width: '3rem', height: '3rem', color: '#fbbf24' }} />
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                Daily Music Quiz
              </h1>
            </div>
            <p style={{ fontSize: '1.25rem', color: '#bfdbfe', marginBottom: '2rem' }}>
              Choose your difficulty and category to start your musical journey
            </p>
            {currentUser && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.3)'
              }}>
                <Users style={{ width: '1.25rem', height: '1.25rem', color: '#c084fc' }} />
                <span style={{ color: 'white', fontWeight: '600' }}>Welcome back, {currentUser.name}!</span>
                <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Coins style={{ width: '1rem', height: '1rem', color: '#fbbf24' }} />
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{credits}</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Difficulty Selection */}
            <div style={{ ...cardStyle, padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>
                Choose Difficulty
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(difficulties).map(([key, diff]) => {
                  const Icon = diff.icon;
                  const isSelected = selectedDifficulty === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDifficulty(key)}
                      style={{
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        border: `2px solid ${isSelected ? diff.color : 'rgba(255, 255, 255, 0.2)'}`,
                        background: isSelected ? diff.bgColor : 'rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <Icon style={{ width: '2rem', height: '2rem', color: diff.color }} />
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                            {diff.name}
                          </h3>
                          <p style={{ color: diff.color, fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                            {diff.pointsMultiplier}x Points
                          </p>
                        </div>
                      </div>
                      <p style={{ color: '#bfdbfe', fontSize: '0.875rem', margin: 0 }}>
                        {diff.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Selection */}
            <div style={{ ...cardStyle, padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>
                Choose Category
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(categories).map(([key, cat]) => {
                  const isSelected = selectedCategory === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      style={{
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        border: `2px solid ${isSelected ? cat.color : 'rgba(255, 255, 255, 0.2)'}`,
                        background: isSelected ? cat.bgColor : 'rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                            {cat.name}
                          </h3>
                        </div>
                      </div>
                      <p style={{ color: '#bfdbfe', fontSize: '0.875rem', margin: 0 }}>
                        {cat.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Start Quiz Button */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={startQuiz}
              disabled={!selectedDifficulty || !selectedCategory}
              style={{
                ...buttonStyle,
                background: (selectedDifficulty && selectedCategory)
                  ? 'linear-gradient(135deg, #059669, #2563eb)'
                  : '#6b7280',
                color: (selectedDifficulty && selectedCategory) ? 'white' : '#9ca3af',
                cursor: (selectedDifficulty && selectedCategory) ? 'pointer' : 'not-allowed',
                padding: '1rem 3rem',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                margin: '0 auto'
              }}
            >
              <Play style={{ width: '1.5rem', height: '1.5rem' }} />
              Start Quiz
            </button>
            
            {selectedDifficulty && selectedCategory && (
              <p style={{ color: '#bfdbfe', marginTop: '1rem', fontSize: '0.875rem' }}>
                You'll face 5 questions • {difficulties[selectedDifficulty].timer}s per question • {difficulties[selectedDifficulty].pointsMultiplier}x score multiplier
              </p>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            {!currentUser && (
              <button 
                onClick={() => setView('nameEntry')} 
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#93c5fd',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Create Profile
              </button>
            )}
            <button 
              onClick={() => setView('leaderboard')} 
              style={{
                background: 'transparent',
                border: 'none',
                color: '#93c5fd',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              View Leaderboard
            </button>
            <button 
              onClick={() => setView('store')} 
              style={{
                background: 'transparent',
                border: 'none',
                color: '#93c5fd',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Credit Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Name Entry View
  if (view === 'nameEntry') {
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <div style={{ ...cardStyle, padding: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Trophy style={{ width: '4rem', height: '4rem', color: '#fbbf24', margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                Quiz Complete!
              </h2>
              <p style={{ fontSize: '1.25rem', color: '#bfdbfe', marginBottom: '1.5rem' }}>
                {score === currentQuestions.length ? "Perfect! 🎵" : 
                 score >= Math.round(currentQuestions.length * 0.8) ? "Excellent! 🎸" : 
                 score >= Math.round(currentQuestions.length * 0.6) ? "Good job! 🎤" : 
                 score >= Math.round(currentQuestions.length * 0.4) ? "Not bad! 🎧" : "Keep practicing! 🎼"}
              </p>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                  {Math.round(score * (difficulties[selectedDifficulty]?.pointsMultiplier || 1))} pts
                </div>
                <div style={{ color: '#bfdbfe', marginBottom: '0.5rem' }}>
                  {score} / {currentQuestions.length} Correct ({Math.round((score / currentQuestions.length) * 100)}%)
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px',
                    background: difficulties[selectedDifficulty]?.bgColor,
                    color: difficulties[selectedDifficulty]?.color
                  }}>
                    {difficulties[selectedDifficulty]?.name} ({difficulties[selectedDifficulty]?.pointsMultiplier}x)
                  </span>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px',
                    background: categories[selectedCategory]?.bgColor,
                    color: categories[selectedCategory]?.color
                  }}>
                    {categories[selectedCategory]?.icon} {categories[selectedCategory]?.name}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'left', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem', maxHeight: '16rem', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>Review Your Answers:</h3>
                {userAnswers.map((answer, index) => (
                  <div key={index} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: index < userAnswers.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none' }}>
                    <p style={{ color: 'white', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Q{index + 1}: {answer.question}
                    </p>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      marginBottom: '0.25rem',
                      color: answer.isCorrect ? '#86efac' : '#fca5a5'
                    }}>
                      Your answer: {answer.selected} {answer.isCorrect ? '✓' : '✗'}
                    </p>
                    {!answer.isCorrect && (
                      <p style={{ color: '#86efac', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        Correct: {answer.correct}
                      </p>
                    )}
                    <p style={{ color: '#bfdbfe', fontSize: '0.75rem', fontStyle: 'italic' }}>
                      {answer.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {!currentUser && (
                  <button
                    onClick={() => {
                      if (playerName.trim()) {
                        addToLeaderboard(playerName, score);
                      }
                      setView('nameEntry');
                    }}
                    style={{
                      ...buttonStyle,
                      background: 'linear-gradient(135deg, #059669, #2563eb)',
                      color: 'white',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem'
                    }}
                  >
                    Add to Leaderboard
                  </button>
                )}
                
                <button
                  onClick={() => setView('leaderboard')}
                  style={{
                    ...buttonStyle,
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    fontSize: '1rem'
                  }}
                >
                  View Leaderboard
                </button>

                <button
                  onClick={resetQuiz}
                  style={{
                    ...buttonStyle,
                    background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                    color: 'white',
                    padding: '0.5rem 1.5rem',
                    fontSize: '1rem'
                  }}
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Quiz Screen - only render if we have questions loaded
  if (view === 'quiz' && currentQuestions.length > 0) {
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Music style={{ width: '2rem', height: '2rem', color: '#fbbf24' }} />
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                Daily Music Quiz
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar style={{ width: '1rem', height: '1rem' }} />
                <span style={{ color: '#bfdbfe' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              {currentUser ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(139, 92, 246, 0.2)'
                }}>
                  <Users style={{ width: '1rem', height: '1rem' }} />
                  <span style={{ color: 'white' }}>{currentUser.name}</span>
                </div>
              ) : (
                <button 
                  onClick={() => setView('nameEntry')} 
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#bfdbfe',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Create Profile
                </button>
              )}
              <button 
                onClick={() => setView('leaderboard')} 
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#bfdbfe',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Leaderboard
              </button>
            </div>
          </div>

          {/* Quiz Card */}
          <div style={{ ...cardStyle, padding: '2rem' }}>
            {/* Progress and Timer */}
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - redirect to selection if no valid view
  return (
    <div style={gradientBg}>
      <div style={{ maxWidth: '32rem', margin: '0 auto', textAlign: 'center', paddingTop: '2rem' }}>
        <div style={{ ...cardStyle, padding: '2rem' }}>
          <Music style={{ width: '4rem', height: '4rem', color: '#fbbf24', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
            Welcome to Daily Music Quiz!
          </h2>
          <p style={{ color: '#bfdbfe', marginBottom: '2rem' }}>
            Current view: {view} | Debug info for troubleshooting
          </p>
          <button
            onClick={() => setView('selection')}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: 'white',
              padding: '0.75rem 2rem',
              fontSize: '1rem'
            }}
          >
            Go to Selection Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyMusicQuiz;
          <div style={{ ...cardStyle, padding: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Users style={{ width: '4rem', height: '4rem', color: '#3b82f6', margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                Enter Your Name
              </h2>
              <p style={{ color: '#bfdbfe', marginBottom: '1.5rem' }}>
                Create your profile to save progress
              </p>
              
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createUser(playerName)}
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1.5rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => createUser(playerName)}
                  disabled={!playerName.trim()}
                  style={{
                    ...buttonStyle,
                    padding: '0.75rem 2rem',
                    background: playerName.trim()
                      ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                      : '#6b7280',
                    color: playerName.trim() ? 'white' : '#9ca3af',
                    cursor: playerName.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '1rem'
                  }}
                >
                  Create Profile
                </button>
                
                <button
                  onClick={() => setView('selection')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#93c5fd',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Continue to menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Form View
  if (view === 'payment' && selectedPackage) {
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <div style={{ ...cardStyle, padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <CreditCard style={{ width: '4rem', height: '4rem', color: '#10b981', margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                Complete Purchase
              </h2>
              
              <div style={{ ...cardStyle, padding: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  {selectedPackage.name}
                </h3>
                <p style={{ color: '#10b981', fontSize: '1.125rem', margin: '0.25rem 0' }}>
                  {selectedPackage.credits} Credits
                </p>
                <p style={{ fontSize: '0.875rem', color: '#d1d5db', margin: '0.5rem 0' }}>
                  {selectedPackage.description}
                </p>
                {selectedPackage.savings && (
                  <p style={{ color: '#fcd34d', fontSize: '0.875rem', fontWeight: '600', margin: '0.5rem 0' }}>
                    {selectedPackage.savings}
                  </p>
                )}
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: '0.5rem 0 0' }}>
                  £{selectedPackage.price}
                </p>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock style={{ width: '1.25rem', height: '1.25rem' }} />
                  Secure Payment Details
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Smith"
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        background: 'white', 
                        borderRadius: '0.5rem', 
                        border: '0',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        background: 'white', 
                        borderRadius: '0.5rem', 
                        border: '0',
                        fontFamily: 'monospace',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem', 
                          background: 'white', 
                          borderRadius: '0.5rem', 
                          border: '0',
                          fontFamily: 'monospace',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem', 
                          background: 'white', 
                          borderRadius: '0.5rem', 
                          border: '0',
                          fontFamily: 'monospace',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '0.75rem', padding: '1rem' }}>
                <h4 style={{ color: '#93c5fd', fontWeight: '600', marginBottom: '0.5rem' }}>💳 Test Mode - Use These Cards:</h4>
                <div style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>
                  <p style={{ margin: '0.25rem 0' }}>✅ Success: <span style={{ fontFamily: 'monospace' }}>4242 4242 4242 4242</span></p>
                  <p style={{ margin: '0.25rem 0' }}>❌ Decline: <span style={{ fontFamily: 'monospace' }}>4000 0000 0000 0002</span></p>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Use any future expiry date and any CVC</p>
                </div>
              </div>

              {paymentError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '1rem', borderRadius: '0.75rem' }}>
                  <p style={{ fontWeight: '600', margin: '0 0 0.25rem 0' }}>Payment Failed</p>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>{paymentError}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={paymentLoading}
                  style={{
                    ...buttonStyle,
                    flex: 1,
                    padding: '1rem 1.5rem',
                    background: paymentLoading 
                      ? '#6b7280'
                      : 'linear-gradient(135deg, #059669, #2563eb)',
                    color: paymentLoading ? '#9ca3af' : 'white',
                    cursor: paymentLoading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  {paymentLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '1.25rem', 
                        height: '1.25rem', 
                        border: '2px solid #9ca3af', 
                        borderTop: '2px solid transparent', 
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Processing...
                    </span>
                  ) : (
                    `Pay £${selectedPackage.price}`
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setView('selection');
                    setSelectedPackage(null);
                    setPaymentError(null);
                  }}
                  disabled={paymentLoading}
                  style={{
                    ...buttonStyle,
                    padding: '1rem 1.5rem',
                    background: 'transparent',
                    color: '#93c5fd',
                    fontSize: '1rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                <Lock style={{ width: '1rem', height: '1rem' }} />
                Secured by 256-bit SSL encryption
              </p>
              <p style={{ margin: '0.25rem 0' }}>🔒 Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Credit Store View
  if (view === 'store') {
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <div style={{ ...cardStyle, padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Coins style={{ width: '4rem', height: '4rem', color: '#fbbf24', margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                Credit Store
              </h2>
              <p style={{ color: '#bfdbfe' }}>Buy credits to extend your quiz time</p>
              {currentUser && (
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#93c5fd' }}>
                  Welcome back, <span style={{ color: '#a855f7', fontWeight: '600' }}>{currentUser.name}</span>!<br/>
                  Current Balance: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{credits} credits</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {creditPackages.map((pack) => (
                <div 
                  key={pack.id} 
                  style={{
                    position: 'relative',
                    background: `linear-gradient(135deg, rgba(${pack.color === 'green' ? '34, 197, 94' : pack.color === 'purple' ? '168, 85, 247' : '245, 158, 11'}, 0.2), rgba(${pack.color === 'green' ? '22, 163, 74' : pack.color === 'purple' ? '147, 51, 234' : '217, 119, 6'}, 0.2))`,
                    border: `1px solid rgba(${pack.color === 'green' ? '34, 197, 94' : pack.color === 'purple' ? '168, 85, 247' : '245, 158, 11'}, 0.3)`,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    ...(pack.popular ? { 
                      boxShadow: '0 0 0 2px rgba(245, 158, 11, 0.5)' 
                    } : {})
                  }}
                >
                  {pack.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-0.75rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#fbbf24',
                      color: 'black',
                      padding: '0.25rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}>
                      ⭐ MOST POPULAR
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                        {pack.name}
                      </h3>
                      <p style={{ 
                        color: pack.color === 'green' ? '#86efac' : pack.color === 'purple' ? '#c084fc' : '#fcd34d', 
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        marginBottom: '0.25rem' 
                      }}>
                        {pack.credits} Credits
                      </p>
                      <p style={{ color: '#bfdbfe', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        {pack.description}
                      </p>
                      <p style={{ color: '#d1d5db', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        Each credit = +10 seconds
                      </p>
                      {pack.savings && (
                        <p style={{ color: '#fcd34d', fontSize: '0.875rem', fontWeight: '600' }}>
                          {pack.savings}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
                        £{pack.price}
                      </div>
                      <button
                        onClick={() => buyCredits(pack.id)}
                        style={{
                          ...buttonStyle,
                          background: `linear-gradient(135deg, ${pack.color === 'green' ? '#059669, #047857' : pack.color === 'purple' ? '#7c3aed, #6d28d9' : '#d97706, #b45309'})`,
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '1rem'
                        }}
                      >
                        <CreditCard style={{ width: '1.25rem', height: '1.25rem' }} />
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Lock style={{ width: '1rem', height: '1rem' }} />
                <span>Secure payments powered by Stripe</span>
              </div>
              <p style={{ margin: '0.25rem 0' }}>🔒 Your payment information is encrypted and secure</p>
              <p style={{ margin: '0.25rem 0' }}>💳 Supports all major credit cards</p>
            </div>

            <button 
              onClick={() => setView('selection')} 
              style={{
                background: 'transparent',
                border: 'none',
                color: '#93c5fd',
                textDecoration: 'underline',
                cursor: 'pointer',
                display: 'block',
                margin: '0 auto',
                fontSize: '1rem'
              }}
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Leaderboard View
  if (view === 'leaderboard') {
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <div style={{ ...cardStyle, padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Crown style={{ width: '4rem', height: '4rem', color: '#fbbf24', margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>Leaderboard</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {leaderboard.map((entry, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: i === 0 ? 'rgba(245, 158, 11, 0.2)' :
                            i === 1 ? 'rgba(156, 163, 175, 0.2)' :
                            i === 2 ? 'rgba(217, 119, 6, 0.2)' :
                            'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${i === 0 ? 'rgba(245, 158, 11, 0.3)' :
                                     i === 1 ? 'rgba(156, 163, 175, 0.3)' :
                                     i === 2 ? 'rgba(217, 119, 6, 0.3)' :
                                     'rgba(255, 255, 255, 0.2)'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      background: i === 0 ? '#fbbf24' :
                                 i === 1 ? '#9ca3af' :
                                 i === 2 ? '#d97706' :
                                 'rgba(255, 255, 255, 0.2)',
                      color: i <= 2 ? (i === 1 ? 'black' : 'white') : 'white'
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <span style={{ color: 'white', fontWeight: '600' }}>{entry.player_name}</span>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.125rem 0.5rem', 
                          borderRadius: '9999px',
                          background: difficulties[entry.difficulty]?.bgColor || 'rgba(255, 255, 255, 0.1)',
                          color: difficulties[entry.difficulty]?.color || '#bfdbfe'
                        }}>
                          {difficulties[entry.difficulty]?.name || entry.difficulty}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.125rem 0.5rem', 
                          borderRadius: '9999px',
                          background: categories[entry.category]?.bgColor || 'rgba(255, 255, 255, 0.1)',
                          color: categories[entry.category]?.color || '#bfdbfe'
                        }}>
                          {categories[entry.category]?.icon} {categories[entry.category]?.name || entry.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'white', fontWeight: 'bold' }}>{entry.score} pts</div>
                    <div style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>{entry.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setView('selection')}
              style={{
                ...buttonStyle,
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                color: 'white',
                padding: '0.75rem 2rem',
                display: 'block',
                margin: '0 auto',
                fontSize: '1rem'
              }}
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Complete Screen
  if (quizComplete) {
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: '32rem', margin: '0 auto' }}></div>