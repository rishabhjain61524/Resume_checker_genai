import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import LoadingScreen from '../components/LoadingScreen.jsx'
import Navbar from '../../../components/Navbar.jsx'

const ROLE_PRESETS = [
    {
        id: 'frontend',
        label: '🚀 Frontend Engineer',
        text: `Frontend Engineer position requiring proficiency in React.js, TypeScript, state management (Redux/Zustand), CSS-in-JS/SCSS, performance optimization, web accessibility (WCAG), and responsive UI design.`
    },
    {
        id: 'fullstack',
        label: '💻 Fullstack Developer',
        text: `Fullstack Developer role requiring expertise in React, Node.js, Express.js, MongoDB/PostgreSQL, RESTful APIs, authentication (JWT/OAuth), and Docker containerization.`
    },
    {
        id: 'sde1',
        label: '⚡ SDE-1 (FAANG / Core)',
        text: `Software Development Engineer 1 requiring strong fundamentals in Data Structures, Algorithms, System Design, Object-Oriented Programming (Java/C++/Python), and scalable microservices.`
    },
    {
        id: 'aiml',
        label: '🤖 AI / ML Engineer',
        text: `AI/ML Engineer role requiring Python, PyTorch, LLMs, Prompt Engineering, Vector Databases (Pinecone/Chroma), RAG architecture, and deploying ML models to production APIs.`
    }
]

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)
    const [ dragActive, setDragActive ] = useState(false)
    const [ errorMsg, setErrorMsg ] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleFileSelect = (file) => {
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg("File size exceeds 5MB limit.")
            return
        }
        setErrorMsg("")
        setSelectedFile(file)
    }

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0])
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    const handleGenerateReport = async () => {
        if (!jobDescription.trim()) {
            setErrorMsg("Target Job Description is required.")
            return
        }
        if (!selectedFile && !selfDescription.trim()) {
            setErrorMsg("Please upload a Resume or enter a Quick Self-Description.")
            return
        }

        setErrorMsg("")
        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile: selectedFile
            })
            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (err) {
            console.error(err)
            setErrorMsg("Failed to generate interview strategy. Please try again.")
        }
    }

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className='home-page'>
            <Navbar />

            <div className='home-content-container'>
                {/* Page Hero Header */}
                <header className='page-header'>
                    <div className='hero-badge'>
                        <span className='sparkle-icon'>✨</span>
                        <span>AI-Powered Strategy Engine</span>
                    </div>
                    <h1>Create Your Custom <span className='highlight'>Interview Roadmap</span></h1>
                    <p>Let our AI analyze job requirements against your resume to construct technical questions, behavioral insights, and a 7-day preparation strategy.</p>
                </header>

                {/* Main Card */}
                <div className='interview-card'>
                    <div className='interview-card__body'>

                        {/* Left Panel - Job Description */}
                        <div className='panel panel--left'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </span>
                                <h2>Target Job Description</h2>
                                <span className='badge badge--required'>Required</span>
                            </div>

                            {/* One-Click Role Presets */}
                            <div className='role-presets'>
                                <span className='presets-label'>Quick Sample Roles:</span>
                                <div className='presets-chips'>
                                    {ROLE_PRESETS.map((preset) => (
                                        <button
                                            key={preset.id}
                                            type='button'
                                            className='preset-chip'
                                            onClick={() => {
                                                setJobDescription(preset.text)
                                                if (errorMsg) setErrorMsg("")
                                            }}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                onChange={(e) => {
                                    setJobDescription(e.target.value)
                                    if (errorMsg) setErrorMsg("")
                                }}
                                className='panel__textarea'
                                placeholder={`Paste the target job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                                maxLength={5000}
                                value={jobDescription}
                            />
                            <div className='char-counter-bar'>
                                <div 
                                    className='char-counter-fill' 
                                    style={{ width: `${Math.min(100, (jobDescription.length / 5000) * 100)}%` }}
                                ></div>
                                <span className='char-text'>{jobDescription.length} / 5000 chars</span>
                            </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className='panel-divider' />

                        {/* Right Panel - Profile */}
                        <div className='panel panel--right'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <h2>Candidate Profile</h2>
                            </div>

                            {/* Upload Resume */}
                            <div className='upload-section'>
                                <label className='section-label'>
                                    <span>Upload Resume (PDF/DOCX)</span>
                                    <span className='badge badge--best'>Best Results</span>
                                </label>

                                {selectedFile ? (
                                    <div className='file-attached-card'>
                                        <div className='file-attached-info'>
                                            <span className='file-icon'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            </span>
                                            <div className='file-meta'>
                                                <span className='file-name'>{selectedFile.name}</span>
                                                <span className='file-size'>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; {selectedFile.name.endsWith('.pdf') ? 'PDF Document' : 'DOCX Document'}</span>
                                            </div>
                                        </div>
                                        <button 
                                            type='button'
                                            className='remove-file-btn'
                                            onClick={() => {
                                                setSelectedFile(null)
                                                if (resumeInputRef.current) resumeInputRef.current.value = ""
                                            }}
                                            title='Remove file'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label 
                                        className={`dropzone ${dragActive ? 'dropzone--active' : ''}`}
                                        htmlFor='resume'
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <span className='dropzone__icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                        </span>
                                        <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                        <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                        <input 
                                            ref={resumeInputRef} 
                                            hidden 
                                            type='file' 
                                            id='resume' 
                                            name='resume' 
                                            accept='.pdf,.docx'
                                            onChange={handleFileInputChange}
                                        />
                                    </label>
                                )}
                            </div>

                            {/* OR Divider */}
                            <div className='or-divider'><span>OR</span></div>

                            {/* Quick Self-Description */}
                            <div className='self-description'>
                                <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                                <textarea
                                    onChange={(e) => {
                                        setSelfDescription(e.target.value)
                                        if (errorMsg) setErrorMsg("")
                                    }}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='panel__textarea panel__textarea--short'
                                    placeholder="Briefly describe your experience, key skills, projects, and tech stack if you don't have a resume handy..."
                                    value={selfDescription}
                                />
                            </div>

                            {/* Info Box */}
                            <div className='info-box'>
                                <span className='info-box__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#0f172a" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#0f172a" strokeWidth="2" /></svg>
                                </span>
                                <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                            </div>
                        </div>
                    </div>

                    {/* Validation Error Banner */}
                    {errorMsg && (
                        <div className='error-banner'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Card Footer */}
                    <div className='interview-card__footer'>
                        <span className='footer-info'>⚡ Gemini 3.0 Model &bull; ~25s Generation Time</span>
                        <button
                            onClick={handleGenerateReport}
                            className='generate-btn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                            <span>Generate My Strategy</span>
                        </button>
                    </div>
                </div>

                {/* Recent Reports Section */}
                {reports.length > 0 && (
                    <section className='recent-reports'>
                        <div className='recent-header'>
                            <h2>My Generated Plans</h2>
                            <span className='recent-count'>{reports.length} Plans</span>
                        </div>
                        <div className='reports-grid'>
                            {reports.map(report => (
                                <div 
                                    key={report._id} 
                                    className='report-card' 
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className='report-card__header'>
                                        <h3>{report.title || 'Target Position'}</h3>
                                        <span className={`match-badge ${report.matchScore >= 80 ? 'match--high' : report.matchScore >= 60 ? 'match--mid' : 'match--low'}`}>
                                            {report.matchScore}% Match
                                        </span>
                                    </div>
                                    <p className='report-date'>Created on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    <div className='report-card__action'>
                                        <span>View Dashboard</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Page Footer */}
                <footer className='page-footer'>
                    <span>&copy; {new Date().getFullYear()} PrepAI Student Edition</span>
                    <div className='footer-links'>
                        <a href='#'>Privacy Policy</a>
                        <a href='#'>Terms of Service</a>
                        <a href='#'>Help & Support</a>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Home