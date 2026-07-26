import React, { useState, useEffect } from 'react'
import '../style/loading.scss'

const LOADING_STEPS = [
  { id: 1, text: 'Parsing resume & profile details...', icon: '📄' },
  { id: 2, text: 'Analyzing target job requirements...', icon: '🎯' },
  { id: 3, text: 'Evaluating skill gaps & domain match score...', icon: '📊' },
  { id: 4, text: 'Formulating tailored technical & behavioral questions...', icon: '💡' },
  { id: 5, text: 'Synthesizing personalized 7-day preparation roadmap...', icon: '🚀' }
]

const TIPS = [
  "💡 Pro-Tip: Structure behavioral answers using the STAR method (Situation, Task, Action, Result).",
  "🧠 AI Insight: Highlighting quantified metrics in project descriptions boosts match scores.",
  "⚡ Pro-Tip: Prepare 2-3 deep questions about tech architecture to ask your interviewers.",
  "🎯 AI Insight: Customized prep plans focus on closing critical skill gaps first for high impact."
]

const LoadingScreen = ({ message = "Loading your interview plan..." }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(12)
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    // Smooth progress bar advancement
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 94) {
          const inc = Math.floor(Math.random() * 6 + 3)
          return prev + inc > 94 ? 94 : prev + inc
        }
        return prev
      })
    }, 700)

    // Step progression
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev))
    }, 2600)

    // Rotate tips
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length)
    }, 4500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearInterval(tipInterval)
    }
  }, [])

  return (
    <main className="ai-loading-container">
      <div className="ai-loading-card">
        {/* Animated AI Core / Orb */}
        <div className="ai-orb-wrapper">
          <div className="ai-orb-ring ring-1"></div>
          <div className="ai-orb-ring ring-2"></div>
          <div className="ai-orb-ring ring-3"></div>
          <div className="ai-orb-core">
            <svg className="ai-sparkle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Title Header */}
        <h2 className="ai-loading-title">Synthesizing Your Custom Interview Strategy</h2>
        <p className="ai-loading-subtitle">Our AI model is extracting key skills and aligning them with target role requirements...</p>

        {/* Progress Bar & Counter */}
        <div className="ai-progress-section">
          <div className="ai-progress-header">
            <span>Overall Progress</span>
            <span className="ai-progress-percent">{progress}%</span>
          </div>
          <div className="ai-progress-track">
            <div className="ai-progress-fill" style={{ width: `${progress}%` }}>
              <div className="ai-progress-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Step Progress List */}
        <div className="ai-steps-list">
          {LOADING_STEPS.map((step, idx) => {
            const isDone = idx < currentStep
            const isActive = idx === currentStep
            return (
              <div 
                key={step.id} 
                className={`ai-step-item ${isDone ? 'step--done' : ''} ${isActive ? 'step--active' : ''}`}
              >
                <div className="step-icon-box">
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : isActive ? (
                    <div className="active-spinner"></div>
                  ) : (
                    <span className="step-number">{step.id}</span>
                  )}
                </div>
                <span className="step-text">{step.text}</span>
              </div>
            )
          })}
        </div>

        {/* Pro Tip Carousel Box */}
        <div className="ai-tip-box">
          <div className="tip-content" key={tipIndex}>
            {TIPS[tipIndex]}
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoadingScreen
