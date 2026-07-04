import React, { useState } from 'react';

const QUESTIONS = [
  {
    id: 1,
    text: "What is your primary investment goal?",
    options: [
      { text: "Preserve capital and avoid losses", score: 1 },
      { text: "Generate steady income with low growth", score: 2 },
      { text: "Balance growth and safety (balanced returns)", score: 3 },
      { text: "Maximize long-term growth and capital appreciation", score: 4 }
    ]
  },
  {
    id: 2,
    text: "How long do you plan to keep your investments active before needing major withdrawals?",
    options: [
      { text: "Under 2 years (Short-term)", score: 1 },
      { text: "2 to 5 years (Medium-term)", score: 2 },
      { text: "5 to 10 years (Long-term)", score: 3 },
      { text: "Over 10 years (Very long-term)", score: 4 }
    ]
  },
  {
    id: 3,
    text: "If your portfolio dropped 20% in value due to a market correction, what would you do?",
    options: [
      { text: "Sell everything immediately to prevent further losses", score: 1 },
      { text: "Sell a portion and move to safer cash/bonds", score: 2 },
      { text: "Do nothing and wait for the market to recover", score: 3 },
      { text: "Buy more assets at a discounted price", score: 4 }
    ]
  },
  {
    id: 4,
    text: "Which portfolio scenario would you feel most comfortable with?",
    options: [
      { text: "Max Gain: +5%, Max Loss: 0% (Low risk)", score: 1 },
      { text: "Max Gain: +12%, Max Loss: -5% (Conservative growth)", score: 2 },
      { text: "Max Gain: +22%, Max Loss: -12% (Balanced growth)", score: 3 },
      { text: "Max Gain: +40%, Max Loss: -25% (High growth/Aggressive)", score: 4 }
    ]
  }
];

export default function RiskProfiler({ currentProfile, onProfileUpdate }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [calculatedProfile, setCalculatedProfile] = useState('');

  const handleOptionSelect = (score) => {
    const updatedAnswers = { ...answers, [currentQuestionIdx]: score };
    setAnswers(updatedAnswers);

    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate final score
      const totalScore = Object.values(updatedAnswers).reduce((sum, s) => sum + s, 0);
      let profile = 'balanced';
      if (totalScore <= 6) {
        profile = 'conservative';
      } else if (totalScore <= 11) {
        profile = 'balanced';
      } else {
        profile = 'aggressive';
      }
      setCalculatedProfile(profile);
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIdx(0);
    setAnswers({});
    setShowResult(false);
  };

  const confirmProfile = () => {
    onProfileUpdate(calculatedProfile);
    alert(`Your risk profile has been set to: ${calculatedProfile.toUpperCase()}`);
  };

  const getProfileDetails = (profile) => {
    switch (profile) {
      case 'conservative':
        return {
          title: "Conservative Profile",
          desc: "Prioritizes capital preservation and stable returns. Suitable for investors nearing retirement or with a low tolerance for volatility.",
          allocation: [
            { asset: "Equities", target: 20, color: 'var(--color-cyan)' },
            { asset: "Fixed Income", target: 60, color: 'var(--color-purple)' },
            { asset: "Real Estate", target: 10, color: 'var(--color-pink)' },
            { asset: "Cash / Alts", target: 10, color: 'var(--color-amber)' }
          ],
          stats: { returns: "4.5%", risk: "Low" }
        };
      case 'aggressive':
        return {
          title: "Aggressive Profile",
          desc: "Maximizes capital growth by investing heavily in volatile assets like equities and alternatives. Best for long-term investors with high risk tolerance.",
          allocation: [
            { asset: "Equities", target: 80, color: 'var(--color-cyan)' },
            { asset: "Fixed Income", target: 10, color: 'var(--color-purple)' },
            { asset: "Real Estate", target: 5, color: 'var(--color-pink)' },
            { asset: "Cash / Alts", target: 5, color: 'var(--color-amber)' }
          ],
          stats: { returns: "9.8%", risk: "High" }
        };
      case 'balanced':
      default:
        return {
          title: "Balanced / Moderate Profile",
          desc: "Maintains a balanced split between equity growth and fixed income safety. Fits investors seeking solid returns with moderate volatility.",
          allocation: [
            { asset: "Equities", target: 60, color: 'var(--color-cyan)' },
            { asset: "Fixed Income", target: 25, color: 'var(--color-purple)' },
            { asset: "Real Estate", target: 10, color: 'var(--color-pink)' },
            { asset: "Cash / Alts", target: 5, color: 'var(--color-amber)' }
          ],
          stats: { returns: "7.2%", risk: "Moderate" }
        };
    }
  };

  const details = getProfileDetails(showResult ? calculatedProfile : currentProfile);

  return (
    <div className="glass-card" style={{ maxWidth: '680px', margin: '0 auto' }}>
      {!showResult ? (
        <div className="survey-question">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-cyan)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Question {currentQuestionIdx + 1} of {QUESTIONS.length}
            </span>
            <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${((currentQuestionIdx + 1) / QUESTIONS.length) * 100}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '3px' }}></div>
            </div>
          </div>

          <h2 style={{ fontSize: '22px', marginBottom: '24px', lineHeight: '1.4' }}>
            {QUESTIONS[currentQuestionIdx].text}
          </h2>

          <div className="survey-options">
            {QUESTIONS[currentQuestionIdx].options.map((opt, idx) => (
              <div
                key={idx}
                className="survey-option-card"
                onClick={() => handleOptionSelect(opt.score)}
              >
                <div className="survey-option-circle"></div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{opt.text}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', animation: 'fadeInBubble 0.4s ease' }}>
          <div style={{ width: '70px', height: '70px', background: 'var(--success-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: 'white', margin: '0 auto 20px auto', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
            <i className="fa-solid fa-check"></i>
          </div>

          <h2 style={{ fontSize: '26px', marginBottom: '10px' }}>Profiling Complete</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Aura has analyzed your responses. Here is your recommended portfolio fit:
          </p>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '24px', textAlign: 'left', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '20px', margin: 0, color: 'var(--color-cyan)' }}>{details.title}</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid var(--border-highlight)', color: 'var(--color-cyan)', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                  Avg. Return: {details.stats.returns}
                </span>
                <span style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', color: 'var(--color-purple)', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                  Risk: {details.stats.risk}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
              {details.desc}
            </p>

            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '12px' }}>Recommended Target Allocation:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {details.allocation.map((item, idx) => (
                <div key={idx} className="rebalance-bar-container" style={{ marginBottom: 0 }}>
                  <div className="rebalance-bar-header">
                    <span style={{ fontWeight: '500' }}>{item.asset}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.target}%</span>
                  </div>
                  <div className="rebalance-bar-track" style={{ height: '8px' }}>
                    <div className="rebalance-bar-fill" style={{ width: `${item.target}%`, background: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn-secondary" onClick={handleReset}>
              <i className="fa-solid fa-rotate-right" style={{ marginRight: '8px' }}></i> Retake Quiz
            </button>
            <button className="btn-primary" onClick={confirmProfile}>
              <i className="fa-solid fa-floppy-disk" style={{ marginRight: '8px' }}></i> Apply Recommended Model
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
