import React, { useState } from 'react';

export default function Goals({ data, onAddGoal }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [analyzingGoalId, setAnalyzingGoalId] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!goalName || !goalTarget || !goalCurrent || !goalDate) return;
    
    const newGoal = {
      id: Date.now(),
      name: goalName,
      target: parseFloat(goalTarget),
      current: parseFloat(goalCurrent),
      targetDate: goalDate,
      icon: 'fa-bullseye',
      status: 'On track'
    };

    onAddGoal(newGoal);
    
    // Reset form
    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('');
    setGoalDate('');
    setShowAddForm(false);
  };

  const runAiAnalysis = async (goal) => {
    setAnalyzingGoalId(goal.id);
    setAiAnalysis('');
    
    const API_KEY = 'AIzaSyBrkvnPliE7oM4izocBM58Pas3iiXhFyWg';
    const userSavings = data.savings;
    const yearsRemaining = Math.max(1, Math.round((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 365.25)));

    const prompt = `You are Aura, an AI Wealth Advisor. Make a feasibility assessment for this goal:
- Goal Name: ${goal.name}
- Target Amount: $${goal.target.toLocaleString()}
- Current Saved: $${goal.current.toLocaleString()}
- Target Date: ${goal.targetDate} (${yearsRemaining} years remaining)
- User Current Monthly Savings Rate: $${userSavings.toLocaleString()} / month
- User Active Risk Profile: ${data.riskProfile.toUpperCase()} (approx 6.5% expected annual compound growth)

Calculate if they will reach this goal on time with current savings. If not, suggest specific adjustments (e.g. increase monthly savings by X, extend target date by Y years, or adjust risk profile). Keep your analysis concise (2-3 sentences), warm, and encouraging.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      });

      const json = await response.json();
      const reply = json.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to run feasibility check. Please try again.";
      setAiAnalysis(reply);
    } catch (e) {
      console.error(e);
      setAiAnalysis("Network error running goal feasibility check.");
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', margin: '0 0 4px 0' }}>Financial Goals & Feasibility</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
            Create long-term wealth targets and let Aura analyze if they are achievable.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Create Goal
        </button>
      </div>

      {/* Add New Goal Form */}
      {showAddForm && (
        <form onSubmit={handleCreateGoal} className="glass-card" style={{ marginBottom: '24px', animation: 'fadeInBubble 0.3s ease' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Configure New Goal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Goal Name</label>
              <input type="text" className="chat-input" placeholder="e.g. Vacation, Child Education" style={{ width: '100%', boxSizing: 'border-box' }} value={goalName} onChange={e => setGoalName(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Target Date</label>
              <input type="date" className="chat-input" style={{ width: '100%', boxSizing: 'border-box' }} value={goalDate} onChange={e => setGoalDate(e.target.value)} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Target Amount ($)</label>
              <input type="number" className="chat-input" placeholder="e.g. 50000" style={{ width: '100%', boxSizing: 'border-box' }} value={goalTarget} onChange={e => setGoalTarget(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Initial Deposit / Current Saved ($)</label>
              <input type="number" className="chat-input" placeholder="e.g. 5000" style={{ width: '100%', boxSizing: 'border-box' }} value={goalCurrent} onChange={e => setGoalCurrent(e.target.value)} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      )}

      {/* Goal Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {data.goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <div className="goal-title">
                  <i className={`fa-solid ${goal.icon || 'fa-bullseye'}`}></i>
                  <div>
                    <h3 style={{ fontSize: '16px', margin: 0 }}>{goal.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Target Date: {goal.targetDate}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{percent}% Saved</div>
                  <span className="goal-target">{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</span>
                </div>
              </div>

              <div className="goal-progress-container">
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: `${percent}%` }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: goal.status === 'On track' ? 'var(--color-emerald)' : 'var(--color-cyan)',
                  background: goal.status === 'On track' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {goal.status}
                </span>

                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => runAiAnalysis(goal)}>
                  <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '6px' }}></i> Analyze Feasibility
                </button>
              </div>

              {/* AI Feasibility Assessment Result */}
              {analyzingGoalId === goal.id && (
                <div style={{
                  marginTop: '16px',
                  background: 'rgba(6, 182, 212, 0.05)',
                  border: '1px solid var(--border-highlight)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  fontSize: '12px',
                  animation: 'fadeInBubble 0.2s ease',
                  lineHeight: '1.5'
                }}>
                  <strong style={{ color: 'var(--color-cyan)', display: 'block', marginBottom: '4px' }}>
                    <i className="fa-solid fa-ghost" style={{ marginRight: '6px' }}></i> Aura Goal Analysis
                  </strong>
                  {aiAnalysis ? (
                    <span>{aiAnalysis}</span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', border: '2px solid rgba(6, 182, 212, 0.1)', borderTopColor: 'var(--color-cyan)', borderRadius: '50%', animation: 'rotateRing 1s linear infinite' }}></div>
                      <span>Analyzing savings pace vs compounding interest...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
