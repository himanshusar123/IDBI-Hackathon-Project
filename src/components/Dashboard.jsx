import React from 'react';

export default function Dashboard({ data, onViewChange }) {
  // Extract summary statistics
  const totalWealth = data.portfolio.reduce((sum, item) => sum + item.value, 0);
  const totalSavings = data.savings;
  const debt = data.debt;

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // Spending categories values
  const spendingTotal = data.spending.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="glass-card summary-card">
          <div className="summary-icon" style={{ background: 'var(--primary-gradient)' }}>
            <i className="fa-solid fa-wallet"></i>
          </div>
          <div className="summary-info">
            <h3>Net Portfolio Value</h3>
            <p>{formatCurrency(totalWealth)}</p>
          </div>
        </div>

        <div className="glass-card summary-card">
          <div className="summary-icon" style={{ background: 'var(--success-gradient)' }}>
            <i className="fa-solid fa-piggy-bank"></i>
          </div>
          <div className="summary-info">
            <h3>Monthly Savings Rate</h3>
            <p>{formatCurrency(totalSavings)} <span style={{ fontSize: '12px', color: 'var(--color-emerald)' }}>/ mo</span></p>
          </div>
        </div>

        <div className="glass-card summary-card">
          <div className="summary-icon" style={{ background: 'var(--accent-gradient)' }}>
            <i className="fa-solid fa-credit-card"></i>
          </div>
          <div className="summary-info">
            <h3>Active Credit Debt</h3>
            <p>{formatCurrency(debt)}</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Allocation Section */}
      <div className="charts-grid">
        {/* Left Column: Spending Habits & Portfolio Allocation */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', margin: 0 }}>Asset Allocation & Spending Habits</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Live Analytics</span>
          </div>

          <div className="two-column-layout" style={{ gap: '20px' }}>
            {/* Asset Allocation SVG Donut */}
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Current Portfolio</h3>
              <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 16px auto' }}>
                <svg width="140" height="140" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                  {/* Outer circle track */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  
                  {/* Stocks - 60% (dasharray: 60 40, offset: 0) */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-cyan)" strokeWidth="4" strokeDasharray="60 40" strokeDashoffset="0" />
                  
                  {/* Bonds - 25% (dasharray: 25 75, offset: -60) */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-purple)" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-60" />
                  
                  {/* Real Estate - 10% (dasharray: 10 90, offset: -85) */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-pink)" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="-85" />
                  
                  {/* Cash/Crypto - 5% (dasharray: 5 95, offset: -95) */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-amber)" strokeWidth="4" strokeDasharray="5 95" strokeDashoffset="-95" />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit' }}>{data.riskProfile.toUpperCase()}</span>
                  <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Risk Model</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-cyan)' }}></span>
                  <span>Equities (60%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-purple)' }}></span>
                  <span>Fixed Income (25%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-pink)' }}></span>
                  <span>Real Estate (10%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-amber)' }}></span>
                  <span>Alternatives (5%)</span>
                </div>
              </div>
            </div>

            {/* Spending Habits SVG Custom Bar Chart */}
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Monthly Outflows ({formatCurrency(spendingTotal)})</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.spending.map((item, idx) => {
                  const percent = Math.round((item.amount / spendingTotal) * 100);
                  const colors = ['var(--color-cyan)', 'var(--color-purple)', 'var(--color-pink)', 'var(--color-amber)'];
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: '500' }}>{item.category}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(item.amount)} ({percent}%)</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', borderRadius: '3px', background: colors[idx % colors.length] }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Aura Portal */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '1px solid var(--border-highlight)' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--primary-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '32px', color: 'white', marginBottom: '20px', boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)' }}>
            <i className="fa-solid fa-ghost"></i>
          </div>
          <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>Meet Aura, Your AI Advisor</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', maxWidth: '240px', lineHeight: '1.5' }}>
            Aura analyzes your spending patterns, risk tolerance, and goals in real time to provide personalized wealth advice.
          </p>
          <button className="btn-primary" onClick={() => onViewChange('chat')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-comments"></i> Talk with Aura
          </button>
        </div>
      </div>

      {/* Advisory & Insights Section */}
      <div className="glass-card" style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-lightbulb" style={{ color: 'var(--color-amber)' }}></i> AI Generated Actionable Insights
        </h2>
        <div className="insights-list">
          <div className="insight-item">
            <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--color-cyan)' }}></i>
            <div className="insight-content">
              <h4>Dining Out Spending Spike</h4>
              <p>You spent <strong>18% more</strong> on Dining Out this month compared to your 3-month average. Redirecting $150/mo of this toward your "Retirement" fund could add over <strong>$42,000</strong> to your net worth in 20 years based on your Balanced portfolio profile.</p>
            </div>
          </div>
          <div className="insight-item warning">
            <i className="fa-solid fa-scale-unbalanced" style={{ color: 'var(--color-amber)' }}></i>
            <div className="insight-content">
              <h4>Portfolio Allocation Drift Detected</h4>
              <p>Due to recent market changes, your Equities holding has drifted to <strong>64%</strong> (target: 60%). We recommend running a portfolio rebalancing operation to secure gains and reduce overall volatility.</p>
            </div>
          </div>
          <div className="insight-item success">
            <i className="fa-solid fa-bullseye" style={{ color: 'var(--color-emerald)' }}></i>
            <div className="insight-content">
              <h4>Goal Progress Accelerating</h4>
              <p>Your Emergency Fund is at <strong>85%</strong> of its target. With your current savings rate of $800/mo, you will achieve this goal <strong>18 days ahead</strong> of schedule. Aura recommends setting up your next auto-allocation rules.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings & Recent Transactions Section */}
      <div className="glass-card">
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Current Asset Breakdown</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Asset Class</th>
                <th>Holding Entity</th>
                <th>Target Alloc.</th>
                <th>Actual Alloc.</th>
                <th>Current Value</th>
                <th>Change (YoY)</th>
              </tr>
            </thead>
            <tbody>
              {data.portfolio.map((item, idx) => {
                const colors = ['var(--color-cyan)', 'var(--color-purple)', 'var(--color-pink)', 'var(--color-amber)'];
                return (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[idx % colors.length] }}></span>
                        <strong>{item.assetClass}</strong>
                      </div>
                    </td>
                    <td>{item.entity}</td>
                    <td>{item.target}%</td>
                    <td>{item.actual}%</td>
                    <td>{formatCurrency(item.value)}</td>
                    <td style={{ color: 'var(--color-emerald)', fontWeight: '600' }}>
                      <i className="fa-solid fa-arrow-trend-up" style={{ marginRight: '6px' }}></i>+{item.growth}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
