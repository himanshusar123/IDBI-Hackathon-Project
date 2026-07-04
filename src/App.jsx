import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AuraChat from './components/AuraChat';
import RiskProfiler from './components/RiskProfiler';
import PortfolioRebalancer from './components/PortfolioRebalancer';
import Goals from './components/Goals';

const INITIAL_DATA = {
  savings: 800,
  debt: 4200,
  riskProfile: 'balanced',
  spending: [
    { category: 'Housing & Rent', amount: 1800 },
    { category: 'Food & Dining', amount: 950 },
    { category: 'Utilities & Bills', amount: 350 },
    { category: 'Shopping & Leisure', amount: 500 }
  ],
  portfolio: [
    { assetClass: 'Equities', entity: 'Vanguard Total Stock Index (VTSAX)', value: 228480, actual: 64, target: 60, growth: 12.4 },
    { assetClass: 'Fixed Income', entity: 'Fidelity U.S. Bond Index (FXNAX)', value: 75180, actual: 21, target: 25, growth: 4.1 },
    { assetClass: 'Real Estate', entity: 'Schwab US REIT ETF (SCHH)', value: 39380, actual: 11, target: 10, growth: 6.8 },
    { assetClass: 'Alternatives (Cash/Crypto)', entity: 'USDC Yield / Cash Account', value: 14960, actual: 4, target: 5, growth: 5.2 }
  ],
  goals: [
    { id: 1, name: 'Retirement Fund', target: 1000000, current: 305000, targetDate: '2045-12-31', icon: 'fa-umbrella-beach', status: 'On track' },
    { id: 2, name: 'Emergency Reserve', target: 20000, current: 17000, targetDate: '2027-06-30', icon: 'fa-shield-halved', status: '85% completed' },
    { id: 3, name: 'Dream Home Downpayment', target: 100000, current: 36000, targetDate: '2030-05-15', icon: 'fa-house-chimney', status: 'Under-funded' }
  ]
};

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMode, setIsMobileMode] = useState(false); // Sidebar dashboard vs Simulated mobile frame

  // Add a new goal
  const handleAddGoal = (newGoal) => {
    setData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  };

  // Update risk profile & adjust portfolio targets
  const handleRiskUpdate = (newProfile) => {
    let targets = [];
    if (newProfile === 'conservative') {
      targets = [20, 60, 10, 10]; // Equities, Fixed Income, Real Estate, Cash/Alts
    } else if (newProfile === 'aggressive') {
      targets = [80, 10, 5, 5];
    } else {
      targets = [60, 25, 10, 5]; // Balanced
    }

    const updatedPortfolio = data.portfolio.map((item, idx) => ({
      ...item,
      target: targets[idx]
    }));

    setData(prev => ({
      ...prev,
      riskProfile: newProfile,
      portfolio: updatedPortfolio
    }));
  };

  // Simulate portfolio rebalancing completed
  const handleRebalanceComplete = () => {
    // Set actuals exactly equal to targets and adjust values accordingly
    const totalValue = data.portfolio.reduce((sum, item) => sum + item.value, 0);
    const updatedPortfolio = data.portfolio.map(item => ({
      ...item,
      actual: item.target,
      value: (item.target / 100) * totalValue
    }));

    setData(prev => ({
      ...prev,
      portfolio: updatedPortfolio
    }));
  };

  const getMenuIcon = (view) => {
    switch (view) {
      case 'dashboard': return 'fa-solid fa-chart-line';
      case 'chat': return 'fa-solid fa-ghost';
      case 'risk': return 'fa-solid fa-shield-halved';
      case 'rebalance': return 'fa-solid fa-scale-balanced';
      case 'goals': return 'fa-solid fa-bullseye';
      default: return 'fa-solid fa-circle';
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Wealth Dashboard';
      case 'chat': return 'Aura Advisory Chat';
      case 'risk': return 'Risk Profile Assessment';
      case 'rebalance': return 'Portfolio Rebalancer';
      case 'goals': return 'Financial Goal Tracker';
      default: return 'Aura Platform';
    }
  };

  const renderViewContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard data={data} onViewChange={setActiveView} />;
      case 'chat':
        return <AuraChat data={data} onViewChange={setActiveView} />;
      case 'risk':
        return <RiskProfiler currentProfile={data.riskProfile} onProfileUpdate={handleRiskUpdate} />;
      case 'rebalance':
        return <PortfolioRebalancer data={data} onRebalanceComplete={handleRebalanceComplete} />;
      case 'goals':
        return <Goals data={data} onAddGoal={handleAddGoal} />;
      default:
        return <Dashboard data={data} onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar - Hidden in simulated phone mode */}
      {!isMobileMode && (
        <aside className="sidebar">
          <div className="logo-container">
            <div className="logo-icon">
              <i className="fa-solid fa-ghost"></i>
            </div>
            <span className="logo-text">AURA</span>
          </div>

          <ul className="menu-list">
            {['dashboard', 'chat', 'risk', 'rebalance', 'goals'].map((view) => (
              <li key={view}>
                <a
                  className={`menu-item ${activeView === view ? 'active' : ''}`}
                  onClick={() => setActiveView(view)}
                >
                  <i className={getMenuIcon(view)}></i>
                  <span>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="user-profile-summary">
            <div className="user-avatar">HS</div>
            <div className="user-info">
              <h4>Himanshu Sardana</h4>
              <p>Wealth Account</p>
            </div>
          </div>
        </aside>
      )}

      {/* Main Container */}
      <main className="main-content" style={{ padding: isMobileMode ? '10px' : '40px' }}>
        {/* Top Control Panel */}
        <div className="page-header">
          {!isMobileMode && (
            <div className="page-title">
              <h1>{getViewTitle()}</h1>
              <p>Personalized AI wealth management & strategic advisory</p>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="mode-toggle" style={{ marginLeft: 'auto' }}>
            <button
              className={`mode-btn ${!isMobileMode ? 'active' : ''}`}
              onClick={() => setIsMobileMode(false)}
            >
              <i className="fa-solid fa-desktop"></i> Desktop View
            </button>
            <button
              className={`mode-btn ${isMobileMode ? 'active' : ''}`}
              onClick={() => setIsMobileMode(true)}
            >
              <i className="fa-solid fa-mobile-screen-button"></i> Mobile Simulator
            </button>
          </div>
        </div>

        {/* View Presentation */}
        {!isMobileMode ? (
          // Full Screen Desktop Dashboard layout
          <div style={{ animation: 'fadeInBubble 0.3s ease' }}>
            {renderViewContent()}
          </div>
        ) : (
          // Simulated iPhone Screen Frame
          <div className="phone-mockup-wrapper">
            <div className="phone-mockup">
              <div className="phone-notch"></div>
              
              <div className="phone-screen">
                {/* Mobile Page Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '18px', margin: 0, fontFamily: 'Outfit' }}>{getViewTitle()}</h2>
                  <div style={{ fontSize: '12px', opacity: 0.6 }}>9:41 AM</div>
                </div>

                {/* Render Core App inside Screen */}
                <div style={{ animation: 'fadeInBubble 0.3s ease', height: '100%' }}>
                  {renderViewContent()}
                </div>
              </div>

              {/* iPhone simulated tab navbar */}
              <nav className="phone-navbar">
                <div className={`phone-nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>
                  <i className="fa-solid fa-house"></i>
                  <span>Home</span>
                </div>
                <div className={`phone-nav-item ${activeView === 'goals' ? 'active' : ''}`} onClick={() => setActiveView('goals')}>
                  <i className="fa-solid fa-bullseye"></i>
                  <span>Goals</span>
                </div>
                
                {/* Aura quick button center */}
                <div className={`phone-nav-item phone-nav-avatar ${activeView === 'chat' ? 'active' : ''}`} onClick={() => setActiveView('chat')}>
                  <i className="fa-solid fa-ghost"></i>
                </div>

                <div className={`phone-nav-item ${activeView === 'rebalance' ? 'active' : ''}`} onClick={() => setActiveView('rebalance')}>
                  <i className="fa-solid fa-scale-balanced"></i>
                  <span>Rebalance</span>
                </div>
                <div className={`phone-nav-item ${activeView === 'risk' ? 'active' : ''}`} onClick={() => setActiveView('risk')}>
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>Risk</span>
                </div>
              </nav>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
