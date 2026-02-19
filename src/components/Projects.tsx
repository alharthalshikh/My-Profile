import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

export default function Projects() {
    const { data } = useData();
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [animating, setAnimating] = useState(false);
    const projects = data.projects || [];
    const showNav = projects.length > 1;
    const project = projects[current];

    if (projects.length === 0 || !project) return null;

    const goTo = (index: number, dir: 'next' | 'prev' = 'next') => {
        if (animating) return;
        setAnimating(true);
        setDirection(dir);
        setTimeout(() => {
            setCurrent(index);
            setTimeout(() => setAnimating(false), 500);
        }, 50);
    };

    const next = () => goTo((current + 1) % projects.length, 'next');
    const prev = () => goTo((current - 1 + projects.length) % projects.length, 'prev');

    useEffect(() => {
        if (!showNav || isPaused) return;
        const timer = setInterval(next, 3000);
        return () => clearInterval(timer);
    }, [showNav, isPaused, projects.length, current]);

    return (
        <section id="projects" style={{ background: 'var(--bg-secondary)', padding: 'clamp(60px, 10vw, 120px) 0', overflow: 'hidden' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

                {/* Section Badge */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-on-scroll reveal-up">
                    <span style={{
                        display: 'inline-block', padding: '10px 32px', borderRadius: '9999px',
                        fontSize: '1.1rem', fontWeight: 800, background: 'var(--bg-card)',
                        color: 'var(--primary)', border: '2.5px solid var(--primary)',
                        boxShadow: '0 8px 24px var(--primary-glow)',
                    }}>
                        🚀 أعمالي ومشاريعي
                    </span>
                    <div style={{ width: '60px', height: '4px', borderRadius: '9999px', background: 'var(--gradient-primary)', margin: '20px auto 0' }} />
                </div>

                {/* Project Showcase */}
                <div
                    className="animate-on-scroll reveal-up"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        key={project.id}
                        className={animating ? (direction === 'next' ? 'proj-enter-next' : 'proj-enter-prev') : ''}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            background: 'var(--bg-card)',
                            border: '2px solid var(--border-color)',
                            borderRadius: '2rem',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                            transition: 'box-shadow 0.4s',
                        }}
                    >
                        {/* Project Image — Full Width Hero */}
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            minHeight: '260px',
                            maxHeight: '420px',
                            overflow: 'hidden',
                            background: 'var(--primary-subtle)',
                        }}>
                            {project.image ? (
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    style={{
                                        width: '100%', height: '100%', objectFit: 'cover',
                                        display: 'block', transition: 'transform 0.6s ease',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                            ) : (
                                <div style={{
                                    width: '100%', height: '100%', minHeight: '320px',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    background: 'var(--gradient-primary)', color: 'white',
                                }}>
                                    <span style={{ fontSize: '5rem', marginBottom: '16px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>🚀</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.5px' }}>{project.title}</span>
                                </div>
                            )}

                            {/* Project Number Badge */}
                            <div style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                                color: 'white', padding: '8px 18px', borderRadius: '9999px',
                                fontSize: '0.9rem', fontWeight: 800,
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}>
                                {current + 1} / {projects.length}
                            </div>

                            {/* Gradient Overlay for text readability */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                height: '120px',
                                background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 100%)',
                                pointerEvents: 'none',
                            }} />
                        </div>

                        {/* Project Info */}
                        <div style={{
                            padding: 'clamp(16px, 4vw, 32px) clamp(16px, 4vw, 40px) clamp(20px, 4vw, 40px)',
                            textAlign: 'right',
                            minHeight: 'clamp(180px, 30vw, 260px)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Title Row */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                flexWrap: 'wrap', gap: '12px', marginBottom: '16px',
                            }}>
                                <h3 style={{
                                    fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900,
                                    color: 'var(--text-primary)', lineHeight: 1.3,
                                    flex: '1 1 auto', textAlign: 'right',
                                }}>
                                    {project.title}
                                </h3>

                                {/* Visit Button */}
                                {project.link && project.link !== '#' && (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            padding: '12px 28px', borderRadius: '0.875rem',
                                            background: 'var(--gradient-primary)', color: 'white',
                                            textDecoration: 'none', fontWeight: 800, fontSize: '1rem',
                                            boxShadow: '0 6px 20px var(--primary-glow)',
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            flexShrink: 0,
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px var(--primary-glow)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px var(--primary-glow)'; }}
                                    >
                                        <span>🔗</span>
                                        <span>زيارة المشروع</span>
                                    </a>
                                )}
                            </div>

                            {/* Divider */}
                            <div style={{ height: '3px', borderRadius: '99px', background: 'var(--gradient-primary)', opacity: 0.2, marginBottom: '20px' }} />

                            {/* Description */}
                            <p style={{
                                fontSize: '1.15rem', fontWeight: 500,
                                color: 'var(--text-secondary)', lineHeight: 2,
                                maxWidth: '700px',
                                flex: 1
                            }}>
                                {project.description}
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    {showNav && (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '20px', marginTop: '40px',
                        }}>
                            <NavBtn onClick={prev}>‹</NavBtn>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {projects.map((_, i) => (
                                    <button key={i} onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                                        style={{
                                            width: i === current ? '36px' : '12px',
                                            height: '12px', borderRadius: '99px', border: 'none',
                                            background: i === current ? 'var(--primary)' : 'var(--border-strong)',
                                            cursor: 'pointer', transition: 'all 0.4s ease',
                                            padding: 0, boxShadow: i === current ? '0 2px 10px var(--primary-glow)' : 'none',
                                        }}
                                    />
                                ))}
                            </div>

                            <NavBtn onClick={next}>›</NavBtn>
                        </div>
                    )}
                </div>

            </div>

            {/* CSS Animations */}
            <style>{`
                .proj-overlay:hover { opacity: 1 !important; }

                @keyframes projEnterNext {
                    from { opacity: 0; transform: translateX(-60px) scale(0.97); }
                    to   { opacity: 1; transform: translateX(0) scale(1); }
                }
                @keyframes projEnterPrev {
                    from { opacity: 0; transform: translateX(60px) scale(0.97); }
                    to   { opacity: 1; transform: translateX(0) scale(1); }
                }
                .proj-enter-next {
                    animation: projEnterNext 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .proj-enter-prev {
                    animation: projEnterPrev 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                #projects img {
                    transition: transform 0.6s ease;
                }
            `}</style>
        </section>
    );
}

function NavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '50px', height: '50px', borderRadius: '50%',
                border: '2px solid var(--border-color)',
                background: 'var(--bg-card)', color: 'var(--primary)',
                fontSize: '1.4rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >{children}</button>
    );
}
