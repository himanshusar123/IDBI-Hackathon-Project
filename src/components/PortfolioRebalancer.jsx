import React, { useState } from 'react';

export default function PortfolioRebalancer({ data, onRebalanceComplete }) {
  const [rebalancing, setRebalancing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [trades, setTrades] = useState([]);

  // Calculate statistics
  const totalValue = data.portfolio.reduce((sum, item) => sum + item.value, 0);

  // Generate recommended trades to align actual with target
  const calculateTrades = () => {
    const tradeList = [];
    data.portfolio.forEach(item => {
      const currentVal = item.value;
      const targetVal = (item.target / 100) * totalValue;
      const difference = targetVal - currentVal;

      if (Math.abs(difference) > 100) { // Only trade if diff is > $100
        tradeList.push({
          assetClass: item.assetClass,
          entity: item.entity,
          type: difference > 0 ? 'BUY' : 'SELL',
          amount: Math.abs(difference),
          currentAlloc: item.actual,
          targetAlloc: item.target
        });
      }
    });
    return tradeList;
  };

  const currentTrades = calculateTrades();

  const handleRebalance = () => {
    setRebalancing(true);
    setTrades(currentTrades);
    
    // Simulate trade execution
    setTimeout(() => {
      setRebalancing(false);
      setShowSummary(true);
      onRebalanceComplete();
    }, 2500);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="glass-card" style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', margin: '0 0 4px 0' }}>Portfolio Drift & Rebalancing</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
            Align your actual holdings with your configured <strong>{data.riskProfile.toUpperCase()}</strong> risk target profile.
          </p>
        </div>
        <span style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid var(--border-highlight)', color: 'var(--color-cyan)', fontSize: '11px', padding: '6px 12px', borderRadius: '12px', fontWeight: '600' }}>
          Total Assets: {formatCurrency(totalValue)}
        </span>
      </div>

      {!showSummary ? (
        <div>
          {/* Allocations Comparison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '30px' }}>
            {data.portfolio.map((item, idx) => {
              const drift = (item.actual - item.target).toFixed(1);
              const driftColor = drift > 0 ? 'var(--color-rose)' : drift < 0 ? 'var(--color-cyan)' : 'var(--text-secondary)';
              const colors = ['var(--color-cyan)', 'var(--color-purple)', 'var(--color-pink)', 'var(--color-amber)'];
              
              return (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[idx % colors.length] }}></span>
                      <strong style={{ fontSize: '14px' }}>{item.assetClass}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({item.entity})</span>
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      <span style={{ marginRight: '14px' }}>Actual: <strong>{item.actual}%</strong> ({formatCurrency(item.value)})</span>
                      <span>Target: <strong>{item.target}%</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', position: 'relative' }}>
                      {/* Actual Allocation Bar */}
                      <div style={{ width: `${item.actual}%`, height: '100%', background: colors[idx % colors.length], borderRadius: '4px', position: 'absolute', opacity: '0.5' }}></div>
                      {/* Target Indicator dot */}
                      <div style={{ left: `${item.target}%`, width: '12px', height: '12px', background: '#ffffff', borderRadius: '50%', border: '2px solid var(--bg-dark-surface)', position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 5 }}></div>
                    </div>
                    <span style={{ width: '65px', textAlign: 'right', fontSize: '12px', color: driftColor, fontWeight: '600' }}>
                      {drift > 0 ? `+${drift}% Over` : drift < 0 ? `${drift}% Under` : 'Balanced'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Area */}
          {rebalancing ? (
            <div style={{ textAlign: 'center', padding: '20px 0', animation: 'fadeInBubble 0.2s ease' }}>
              <div style={{ width: '50px', height: '50px', border: '3px solid rgba(6, 182, 212, 0.1)', borderTopColor: 'var(--color-cyan)', borderRadius: '50%', animation: 'rotateRing 1s linear infinite', margin: '0 auto 16px auto' }}></div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>Executing Smart Trades...</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>Simulating brokerage APIs, buying/selling funds securely...</p>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {currentTrades.length > 0 ? (
                  <span>Aura recommends executing <strong>{currentTrades.length} trades</strong> to correct portfolio drift.</span>
                ) : (
                  <span style={{ color: 'var(--color-emerald)' }}><i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i> Your portfolio matches the target perfectly!</span>
                )}
              </div>
              <button
                className="btn-primary"
                onClick={handleRebalance}
                disabled={currentTrades.length === 0}
                style={{ opacity: currentTrades.length === 0 ? 0.5 : 1, cursor: currentTrades.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                <i className="fa-solid fa-scale-balanced" style={{ marginRight: '8px' }}></i> Auto-Rebalance Portfolio
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', animation: 'fadeInBubble 0.4s ease' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--success-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white', margin: '0 auto 16px auto', boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }}>
            <i className="fa-solid fa-circle-check"></i>
          </div>

          <h3 style={{ fontSize: '22px', marginBottom: '6px' }}>Portfolio Successfully Balanced</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
            Brokerage orders executed. All assets are now aligned to your target allocations.
          </p>

          {/* Executed Trades Log */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '16px', textAlign: 'left', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>Execution Log</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {trades.map((trade, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', alignItems: 'center' }}>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      width: '45px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '700',
                      textAlign: 'center',
                      marginRight: '10px',
                      background: trade.type === 'BUY' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      color: trade.type === 'BUY' ? 'var(--color-emerald)' : 'var(--color-rose)'
                    }}>
                      {trade.type}
                    </span>
                    <span><strong>{trade.assetClass}</strong> ({trade.entity})</span>
                  </div>
                  <strong>{formatCurrency(trade.amount)}</strong>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-secondary" onClick={() => setShowSummary(false)}>
            <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Back to Allocation View
          </button>
        </div>
      )}
    </div>
  );
}
