import { useEffect, useRef, useState } from 'react';
import { useData } from '../context/DataContext';

export default function Skills() {
    const { data } = useData();
    const sectionRef = useRef<HTMLElement>(null);
    const animated = useRef(false);

    // Responsive visible count
    const [visibleCount, setVisibleCount] = useState(3);
    const [startIndex, setStartIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const updateCount = () => {
            setVisibleCount(window.innerWidth < 768 ? 1 : 3);
        };
        updateCount();
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);

    const categories = data.skillCategories || [];
    const maxStart = Math.max(0, categories.length - visibleCount);
    const showNav = categories.length > visibleCount;

    const visibleCategories = categories.slice(startIndex, startIndex + visibleCount);

    const goTo = (index: number) => {
        setStartIndex(Math.max(0, Math.min(index, maxStart)));
    };

    const next = () => {
        if (startIndex >= maxStart) {
            goTo(0); // loop back to beginning
        } else {
            goTo(startIndex + 1);
        }
    };

    const prev = () => {
        if (startIndex <= 0) {
            goTo(maxStart); // loop to end
        } else {
            goTo(startIndex - 1);
        }
    };

    useEffect(() => {
        if (!showNav || isPaused) return;
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [showNav, isPaused, startIndex, maxStart]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animated.current) {
                    animated.current = true;
                    triggerBars();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (animated.current) {
            triggerBars();
        }
    }, [startIndex]);

    const triggerBars = () => {
        setTimeout(() => {
            document.querySelectorAll('.skill-fill-bar').forEach((el) => {
                const target = el.getAttribute('data-level') || '0';
                (el as HTMLElement).style.width = `${target}%`;
            });
        }, 100);
    };

    // Dot indicators: one per possible position
    const totalPositions = maxStart + 1;

    return (
        <section
            id="skills"
            ref={sectionRef as React.RefObject<HTMLElement>}
            style={{ background: 'var(--bg-primary)', padding: '120px 0' }}
        >
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

                {/* Section Badge */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-on-scroll reveal-up">
                    <span style={{
                        display: 'inline-block', padding: '10px 32px', borderRadius: '9999px',
                        fontSize: '1.1rem', fontWeight: 800, background: 'var(--bg-card)',
                        color: 'var(--primary)', border: '2.5px solid var(--primary)',
                        boxShadow: '0 8px 24px var(--primary-glow)',
                    }}>
                        🛠️ مهاراتي وأدواتي
                    </span>
                </div>

                {/* Skills Grid */}
                <div
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    style={{ overflow: 'hidden', position: 'relative' }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
                            gap: '25px',
                        }}
                    >
                        {visibleCategories.map((category, i) => (
                            <div key={`${startIndex}-${category.id}`} style={{
                                background: 'var(--bg-card)',
                                border: '2px solid var(--border-color)',
                                borderRadius: '1.5rem', padding: '30px',
                                position: 'relative', overflow: 'hidden',
                                transition: 'border-color 0.3s, transform 0.3s',
                                animation: `skillFadeIn 0.4s ease-out ${i * 60}ms both`,
                                minHeight: '420px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-primary)' }} />
                                <h3 style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    fontSize: '1.25rem', fontWeight: 800,
                                    color: 'var(--text-primary)', marginBottom: '25px',
                                    justifyContent: 'flex-end',
                                }}>
                                    {category.title}
                                    <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                                    {category.skills.map((skill, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{skill.level}%</span>
                                                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{skill.name}</span>
                                            </div>
                                            <div style={{ height: '8px', borderRadius: '99px', background: 'var(--primary-subtle)', overflow: 'hidden' }}>
                                                <div
                                                    className="skill-fill-bar"
                                                    data-level={skill.level}
                                                    style={{
                                                        width: '0%', height: '100%', borderRadius: '99px',
                                                        background: 'var(--gradient-primary)',
                                                        transition: 'width 1.5s cubic-bezier(0.1, 0.5, 0.2, 1)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation */}
                    {showNav && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <button onClick={prev} style={navBtnStyle}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                                >‹</button>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {Array.from({ length: totalPositions }).map((_, i) => (
                                        <div key={i} onClick={() => goTo(i)} style={{
                                            width: i === startIndex ? '30px' : '10px', height: '10px',
                                            borderRadius: '99px', background: i === startIndex ? 'var(--primary)' : 'var(--border-strong)',
                                            cursor: 'pointer', transition: '0.3s'
                                        }} />
                                    ))}
                                </div>
                                <button onClick={next} style={navBtnStyle}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                                >›</button>
                            </div>
                            <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>
                                {startIndex + 1}–{Math.min(startIndex + visibleCount, categories.length)} / {categories.length}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes skillFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </section>
    );
}

const navBtnStyle: React.CSSProperties = {
    width: '48px', height: '48px', borderRadius: '50%', border: '2.5px solid var(--border-color)',
    background: 'var(--bg-card)', color: 'var(--primary)', fontSize: '1.3rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
};
