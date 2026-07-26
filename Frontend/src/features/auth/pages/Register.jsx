import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {
    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ showPassword, setShowPassword ] = useState(false)
    const [ errorMsg, setErrorMsg ] = useState("")

    const { loading, handleRegister } = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!username || !email || !password) {
            setErrorMsg("All fields are required.")
            return
        }
        setErrorMsg("")
        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            setErrorMsg("Registration failed. Email or username might already be in use.")
        }
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div className="auth-loading-spinner">
                    <div className="spinner"></div>
                    <p>Setting up your student account...</p>
                </div>
            </main>
        )
    }

    return (
        <main className="auth-page">
            {/* Ambient Background Aura Lights */}
            <div className="auth-aura aura-1"></div>
            <div className="auth-aura aura-2"></div>

            <div className="auth-card">
                {/* Left Hero Side */}
                <div className="auth-hero">
                    <div className="brand-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L15 8.5L22 10L17 15L18.5 22L12 18.5L5.5 22L7 15L2 10L9 8.5L12 2Z" fill="url(#hero-grad-2)" />
                            <defs>
                                <linearGradient id="hero-grad-2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="0.5" stopColor="#a855f7" />
                                    <stop offset="1" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span>PrepAI Student Portal</span>
                    </div>

                    <h2>Start Your <span className="highlight">AI-Powered</span> Preparation</h2>
                    <p>Join thousands of students and developers using PrepAI to generate customized 7-day interview roadmaps, technical Q&A, and ATS-optimized resumes.</p>

                    <div className="hero-stats">
                        <div className="stat-pill">
                            <span className="stat-icon">🎓</span>
                            <span>Tailored for Computer Science & SDEs</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-icon">✨</span>
                            <span>Free Instant Analysis</span>
                        </div>
                    </div>
                </div>

                {/* Right Form Side */}
                <div className="auth-form-side">
                    <div className="form-header">
                        <h1>Create Free Account</h1>
                        <p>Get instant access to AI strategy generation</p>
                    </div>

                    {errorMsg && (
                        <div className="auth-error-banner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Full Name or Username</label>
                            <div className="input-field-wrapper">
                                <span className="field-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </span>
                                <input
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                        if (errorMsg) setErrorMsg("")
                                    }}
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Alex Rivers"
                                    value={username}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-field-wrapper">
                                <span className="field-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                </span>
                                <input
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errorMsg) setErrorMsg("")
                                    }}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="student@university.edu"
                                    value={email}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-field-wrapper">
                                <span className="field-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </span>
                                <input
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (errorMsg) setErrorMsg("")
                                    }}
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Choose a strong password"
                                    value={password}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button className="auth-submit-btn" type="submit">
                            <span>Create My Student Account</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Register