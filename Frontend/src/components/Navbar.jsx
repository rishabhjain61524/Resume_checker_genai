import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import './navbar.scss'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <header className="app-navbar">
            <div className="navbar-container">
                {/* Brand Logo */}
                <Link to="/" className="brand-logo">
                    <div className="brand-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15 8.5L22 10L17 15L18.5 22L12 18.5L5.5 22L7 15L2 10L9 8.5L12 2Z" fill="url(#brand-grad)" />
                            <defs>
                                <linearGradient id="brand-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="0.5" stopColor="#a855f7" />
                                    <stop offset="1" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="brand-name">Prep<span className="brand-accent">AI</span></span>
                    <span className="brand-tag">Student Edition</span>
                </Link>

                {/* Status Badge */}
                <div className="status-badge">
                    <span className="status-dot"></span>
                    <span>AI Model Engine Ready</span>
                </div>

                {/* Right Profile Actions */}
                {user ? (
                    <div className="user-profile-menu">
                        <div className="user-info">
                            <span className="user-avatar">{user.username ? user.username.charAt(0).toUpperCase() : 'S'}</span>
                            <span className="user-name">{user.username || user.email || 'Candidate'}</span>
                        </div>
                        <button onClick={onLogout} className="logout-btn" title="Sign Out">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="auth-nav-links">
                        <Link to="/login" className="nav-login-link">Login</Link>
                        <Link to="/register" className="nav-register-btn">Get Started</Link>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar
