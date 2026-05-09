import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

export default function Projects() {
    const { data } = useData();
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const projects = data.projects || [];
    const showNav = projects.length > 1;
    const project = projects[current];

    const goTo = (index: number, dir: 'next' | 'prev' = 'next') => {
        if (animating || index === current) return;
        setAnimating(true);
        setDirection(dir);
        setTimeout(() => {
            setCurrent(index);
            setTimeout(() => setAnimating(false), 600);
        }, 50);
    };

    const next = () => goTo((current + 1) % projects.length, 'next');
    const prev = () => goTo((current - 1 + projects.length) % projects.length, 'prev');

    useEffect(() => {
        if (!showNav || isPaused || projects.length === 0) return;
        const timer = setInterval(next, 4500);
        return () => clearInterval(timer);
    }, [showNav, isPaused, projects.length, current]);

    if (projects.length === 0 || !project) return null;

    return (
        <section id="projects" className="projects-section">
            <div className="projects-container">

                {/* Section Header */}
                <div className="projects-header animate-on-scroll reveal-up">
                    <div className="projects-badge">
                        <span className="badge-icon">🚀</span>
                        <span>أعمالي ومشاريعي</span>
                    </div>
                    <p className="projects-subtitle">مجموعة من المشاريع التي عملت عليها بشغف وإبداع</p>
                    <div className="header-line" />
                </div>

                {/* Project Card */}
                <div
                    className="project-showcase animate-on-scroll reveal-up"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        key={project.id}
                        className={`project-card ${animating ? (direction === 'next' ? 'card-enter-next' : 'card-enter-prev') : 'card-visible'}`}
                    >
                        {/* Image Side */}
                        <div className="project-image-wrapper">
                            {project.image ? (
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="project-image"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="project-image-placeholder">
                                    <span className="placeholder-icon">🚀</span>
                                    <span className="placeholder-text">{project.title}</span>
                                </div>
                            )}

                            {/* Counter Badge */}
                            <div className="project-counter">
                                <span className="counter-current">{String(current + 1).padStart(2, '0')}</span>
                                <span className="counter-sep">/</span>
                                <span className="counter-total">{String(projects.length).padStart(2, '0')}</span>
                            </div>

                            {/* Image Overlay */}
                            <div className="project-image-overlay" />
                        </div>

                        {/* Info Side */}
                        <div className="project-info">
                            <div className="project-info-inner">
                                {/* Title */}
                                <h3 className="project-title">{project.title}</h3>

                                {/* Decorative Line */}
                                <div className="project-divider">
                                    <div className="divider-dot" />
                                    <div className="divider-line" />
                                    <div className="divider-dot" />
                                </div>

                                {/* Description */}
                                <p className="project-description">{project.description}</p>

                                {/* Link Button */}
                                {project.link && project.link !== '#' && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-link-btn"
                                    >
                                        <span className="link-btn-text">زيارة المشروع</span>
                                        <span className="link-btn-arrow">←</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    {showNav && (
                        <div className="project-nav">
                            <button className="nav-arrow nav-arrow-prev" onClick={prev} aria-label="السابق">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>

                            <div className="nav-dots">
                                {projects.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`nav-dot ${i === current ? 'nav-dot-active' : ''}`}
                                        onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                                        aria-label={`مشروع ${i + 1}`}
                                    >
                                        {i === current && <span className="dot-progress" />}
                                    </button>
                                ))}
                            </div>

                            <button className="nav-arrow nav-arrow-next" onClick={next} aria-label="التالي">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Styles */}
            <style>{`
                .projects-section {
                    background: var(--bg-secondary);
                    padding: clamp(60px, 10vw, 120px) 0;
                    overflow: hidden;
                    position: relative;
                }

                .projects-container {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                /* ===== Header ===== */
                .projects-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .projects-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 32px;
                    border-radius: 9999px;
                    font-size: 1.1rem;
                    font-weight: 800;
                    background: var(--bg-card);
                    color: var(--primary);
                    border: 2px solid var(--primary);
                    box-shadow: 0 8px 32px var(--primary-glow);
                }

                .badge-icon {
                    font-size: 1.3rem;
                    animation: badgeFloat 2s ease-in-out infinite;
                }

                @keyframes badgeFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }

                .projects-subtitle {
                    color: var(--text-muted);
                    font-size: 1rem;
                    margin-top: 16px;
                    font-weight: 500;
                }

                .header-line {
                    width: 60px;
                    height: 4px;
                    border-radius: 9999px;
                    background: var(--gradient-primary);
                    margin: 20px auto 0;
                }

                /* ===== Project Card ===== */
                .project-showcase {
                    perspective: 1200px;
                }

                .project-card {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    background: var(--bg-card);
                    border: 1.5px solid var(--border-color);
                    border-radius: 1.5rem;
                    overflow: hidden;
                    box-shadow:
                        0 4px 6px rgba(0,0,0,0.04),
                        0 20px 60px rgba(0,0,0,0.08);
                    transition: box-shadow 0.5s ease, transform 0.5s ease;
                }

                .project-card:hover {
                    box-shadow:
                        0 8px 16px rgba(0,0,0,0.06),
                        0 30px 80px rgba(0,0,0,0.12);
                    transform: translateY(-4px);
                }

                /* ===== Image ===== */
                .project-image-wrapper {
                    position: relative;
                    min-height: 320px;
                    overflow: hidden;
                    background: var(--primary-subtle);
                }

                .project-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .project-card:hover .project-image {
                    transform: scale(1.06);
                }

                .project-image-placeholder {
                    width: 100%;
                    height: 100%;
                    min-height: 320px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: var(--gradient-primary);
                    color: white;
                    gap: 16px;
                }

                .placeholder-icon {
                    font-size: 4rem;
                    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
                    animation: badgeFloat 3s ease-in-out infinite;
                }

                .placeholder-text {
                    font-size: 1.4rem;
                    font-weight: 800;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }

                .project-counter {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: rgba(0,0,0,0.45);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 9999px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    border: 1px solid rgba(255,255,255,0.15);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    z-index: 2;
                }

                .counter-current {
                    color: var(--primary);
                    font-weight: 900;
                    font-size: 1rem;
                }

                .counter-sep {
                    opacity: 0.4;
                    margin: 0 2px;
                }

                .counter-total {
                    opacity: 0.7;
                }

                .project-image-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 80px;
                    background: linear-gradient(to top, var(--bg-card) 0%, transparent 100%);
                    pointer-events: none;
                    display: none;
                }

                /* ===== Info ===== */
                .project-info {
                    display: flex;
                    align-items: center;
                    padding: clamp(24px, 4vw, 48px);
                }

                .project-info-inner {
                    width: 100%;
                    text-align: right;
                }

                .project-title {
                    font-size: clamp(1.4rem, 2.8vw, 2rem);
                    font-weight: 900;
                    color: var(--text-primary);
                    line-height: 1.4;
                    margin: 0 0 20px 0;
                }

                .project-divider {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 20px;
                    direction: ltr;
                }

                .divider-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--primary);
                    flex-shrink: 0;
                }

                .divider-line {
                    flex: 1;
                    height: 2px;
                    background: linear-gradient(90deg, var(--primary), transparent);
                    border-radius: 9999px;
                    opacity: 0.3;
                }

                .project-description {
                    font-size: 1.05rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    line-height: 2;
                    margin: 0 0 28px 0;
                }

                .project-link-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 32px;
                    border-radius: 0.875rem;
                    background: var(--gradient-primary);
                    color: white;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 1rem;
                    box-shadow: 0 6px 24px var(--primary-glow);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                }

                .project-link-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .project-link-btn:hover::before {
                    opacity: 1;
                }

                .project-link-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 36px var(--primary-glow);
                }

                .link-btn-arrow {
                    transition: transform 0.3s;
                    font-size: 1.2rem;
                }

                .project-link-btn:hover .link-btn-arrow {
                    transform: translateX(-4px);
                }

                /* ===== Navigation ===== */
                .project-nav {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 36px;
                }

                .nav-arrow {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    border: 2px solid var(--border-color);
                    background: var(--bg-card);
                    color: var(--primary);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
                    padding: 0;
                }

                .nav-arrow:hover {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    transform: scale(1.12);
                    box-shadow: 0 6px 24px var(--primary-glow);
                }

                .nav-dots {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .nav-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 9999px;
                    border: none;
                    background: var(--border-strong);
                    cursor: pointer;
                    padding: 0;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                }

                .nav-dot-active {
                    width: 40px;
                    background: var(--primary);
                    box-shadow: 0 2px 12px var(--primary-glow);
                }

                .dot-progress {
                    position: absolute;
                    inset: 0;
                    background: rgba(255,255,255,0.3);
                    border-radius: inherit;
                    animation: dotFill 4.5s linear forwards;
                }

                @keyframes dotFill {
                    from { transform: scaleX(0); transform-origin: right; }
                    to   { transform: scaleX(1); transform-origin: right; }
                }

                /* ===== Animations ===== */
                .card-visible {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }

                @keyframes cardEnterNext {
                    from { opacity: 0; transform: translateX(-50px) scale(0.97); }
                    to   { opacity: 1; transform: translateX(0) scale(1); }
                }

                @keyframes cardEnterPrev {
                    from { opacity: 0; transform: translateX(50px) scale(0.97); }
                    to   { opacity: 1; transform: translateX(0) scale(1); }
                }

                .card-enter-next {
                    animation: cardEnterNext 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .card-enter-prev {
                    animation: cardEnterPrev 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                /* ===== Responsive: Mobile ===== */
                @media (max-width: 768px) {
                    .project-card {
                        grid-template-columns: 1fr;
                        border-radius: 1.25rem;
                    }

                    .project-image-wrapper {
                        min-height: 220px;
                        max-height: 280px;
                    }

                    .project-image-overlay {
                        display: block;
                    }

                    .project-info {
                        padding: 20px 24px 28px;
                    }

                    .project-title {
                        font-size: 1.35rem;
                        margin-bottom: 14px;
                    }

                    .project-description {
                        font-size: 0.95rem;
                        line-height: 1.85;
                        margin-bottom: 22px;
                    }

                    .project-link-btn {
                        width: 100%;
                        justify-content: center;
                        padding: 14px 24px;
                    }

                    .nav-arrow {
                        width: 42px;
                        height: 42px;
                    }

                    .projects-header {
                        margin-bottom: 40px;
                    }

                    .project-nav {
                        margin-top: 28px;
                    }
                }

                /* ===== Responsive: Large Screens ===== */
                @media (min-width: 769px) {
                    .project-image-wrapper {
                        min-height: 380px;
                    }
                }

                /* ===== Image Hover ===== */
                #projects img {
                    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </section>
    );
}
