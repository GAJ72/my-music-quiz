import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Trophy, Calendar, Music, Crown, Users, Clock, Coins, Plus, CreditCard, Lock } from 'lucide-react';

const DailyMusicQuiz = () => {
  // Core quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  
  // Timer and credits
  const [timeLeft, setTimeLeft] = useState(10);
  const [credits, setCredits] = useState(3);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // UI and user state
  const [view, setView] = useState('quiz');
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

  // Quiz questions
  const questions = [
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
  },
  // 🆕 NEW QUESTIONS START HERE
  {
    question: "Which instrument is Freddie Mercury famous for playing?",
    options: ['Guitar', 'Piano', 'Drums', 'Bass'],
    correct: 'Piano',
    explanation: "Freddie Mercury was an accomplished pianist and often performed on piano during Queen concerts."
  },
  {
    question: "What does 'BPM' stand for in music?",
    options: ['Bass Per Minute', 'Beats Per Minute', 'Band Performance Mode', 'Basic Pop Music'],
    correct: 'Beats Per Minute',
    explanation: "BPM measures the tempo or speed of music in beats per minute."
  },
  {
    question: "Which city is considered the birthplace of jazz?",
    options: ['Chicago', 'New York', 'New Orleans', 'Memphis'],
    correct: 'New Orleans',
    explanation: "New Orleans is widely recognized as the birthplace of jazz music in the early 20th century."
  },
  {
    question: "Who composed 'The Four Seasons'?",
    options: ['Mozart', 'Bach', 'Vivaldi', 'Beethoven'],
    correct: 'Vivaldi',
    explanation: "Antonio Vivaldi composed 'The Four Seasons' concertos in 1723."
  },
  {
    question: "Which band sang 'Stairway to Heaven'?",
    options: ['Pink Floyd', 'Led Zeppelin', 'Deep Purple', 'Black Sabbath'],
    correct: 'Led Zeppelin',
    explanation: "Led Zeppelin's 'Stairway to Heaven' is often considered one of the greatest rock songs of all time."
  }
];

  const [leaderboard, setLeaderboard] = useState([
    { player_name: "MusicMaster", score: 10, percentage: 100 },
    { player_name: "RockFan92", score: 8, percentage: 80 },
    { player_name: "JazzLover", score: 7, percentage: 70 },
    { player_name: "PopQueen", score: 6, percentage: 60 },
    { player_name: "ClassicRocker", score: 5, percentage: 50 },
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
    const q = questions[currentQuestion];
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
        setView('quiz');
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
    setView('quiz');
  };

  const addToLeaderboard = (name, finalScore) => {
    const percentage = Math.round((finalScore / questions.length) * 100);
    const entry = { player_name: name, score: finalScore, percentage };
    setLeaderboard([...leaderboard, entry]
      .sort((a, b) => b.score - a.score || b.percentage - a.percentage)
      .slice(0, 10));
  };

  const handleSubmitAnswer = () => {
    setIsTimerActive(false);
    const q = questions[currentQuestion];
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
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
      setTimeLeft(10);
      setIsTimerActive(true);
    } else {
      setQuizComplete(true);
      setIsTimerActive(false);
      if (currentUser && score > currentUser.bestScore) {
        addToLeaderboard(currentUser.name, score);
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
    setView('quiz');
  };

  const startTimer = () => {
    setIsTimerActive(true);
    setTimeLeft(10);
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
                    setView('store');
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

  // Name Entry View
  if (view === 'nameEntry') {
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
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
                  onClick={() => setView('quiz')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#93c5fd',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Play as guest
                </button>
              </div>
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
              onClick={() => setView('quiz')} 
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
              Back to Quiz
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
                   <span style={{ color: 'white', fontWeight: '600' }}>{entry.player_name}</span>
                 </div>
                 // In the leaderboard map function
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>{entry.score}/{questions.length}</div>
                  <div style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>{entry.percentage}%</div>
                </div>
               </div>
             ))}
           </div>

           <button
             onClick={() => setView('quiz')}
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
             Back to Quiz
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
       <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
         <div style={{ ...cardStyle, padding: '2rem' }}>
           <div style={{ textAlign: 'center' }}>
             <Trophy style={{ width: '4rem', height: '4rem', color: '#fbbf24', margin: '0 auto 1rem' }} />
             <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
               Quiz Complete!
             </h2>
             <p style={{ fontSize: '1.25rem', color: '#bfdbfe', marginBottom: '1.5rem' }}>
               {score === questions.length ? "Perfect! 🎵" : 
                score >= 4 ? "Excellent! 🎸" : 
                score >= 3 ? "Good job! 🎤" : "Keep practicing! 🎧"}
             </p>
             
             <div style={{
               background: 'rgba(255, 255, 255, 0.2)',
               borderRadius: '1rem',
               padding: '1.5rem',
               marginBottom: '1.5rem'
             }}>
               <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                 {score} / {questions.length}
               </div>
               <div style={{ color: '#bfdbfe' }}>
                 {Math.round((score / questions.length) * 100)}% Correct
               </div>
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
                 Try Again
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }

 // Main Quiz Screen
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
             <span>Question {currentQuestion + 1} of {questions.length}</span>
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
             width: `${((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100}%`,
             transition: 'all 0.5s ease'
           }} />
         </div>

         {/* Question */}
         <div style={{ marginBottom: '2rem' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
             {questions[currentQuestion].question}
           </h2>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {questions[currentQuestion].options.map((option, i) => (
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
                     ? option === questions[currentQuestion].correct
                       ? '#10b981'
                       : option === selectedAnswer && option !== questions[currentQuestion].correct
                       ? '#ef4444'
                       : 'rgba(255, 255, 255, 0.2)'
                     : selectedAnswer === option
                     ? '#8b5cf6'
                     : 'rgba(255, 255, 255, 0.2)',
                   background: showResult
                     ? option === questions[currentQuestion].correct
                       ? 'rgba(16, 185, 129, 0.3)'
                       : option === selectedAnswer && option !== questions[currentQuestion].correct
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
                   {showResult && option === questions[currentQuestion].correct && (
                     <span style={{ color: '#10b981' }}>✓</span>
                   )}
                   {showResult && option === selectedAnswer && option !== questions[currentQuestion].correct && (
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
               {questions[currentQuestion].explanation}
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
               {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
             </button>
           )}
         </div>
       </div>
     </div>
   </div>
 );
};

export default DailyMusicQuiz;