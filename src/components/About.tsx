import { useData } from '../context/DataContext';

export default function About() {
    const { data } = useData();

    const avatarUrl = data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&size=400&background=088395&color=fff&font-size=0.35`;

    const stats = [
        { icon: '📂', number: data.projects.length, label: 'مشروع منجز' },
        { icon: '👥', number: data.clients, label: 'عميل راضي' },
        { icon: '⭐', number: data.experience, label: 'سنوات خبرة' },
    ];

    return (
        <section id="about" style={{ background: 'var(--bg-secondary)', padding: 'clamp(60px, 10vw, 120px) 0 clamp(60px, 10vw, 160px)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

                {/* Section Badge */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }} className="animate-on-scroll reveal-up">
                    <span style={{
                        display: 'inline-block',
                        padding: '10px 28px',
                        borderRadius: '9999px',
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        background: 'var(--bg-card)',
                        color: 'var(--primary)',
                        border: '2px solid var(--primary)',
                        boxShadow: '0 8px 24px var(--primary-glow)',
                    }}>
                        ⭐ تعرف علي
                    </span>
                </div>

                {/* Two-column layout → stacks on mobile */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                    gap: 'clamp(32px, 6vw, 80px)',
                    alignItems: 'center',
                }}>

                    {/* Image Side */}
                    <div className="animate-on-scroll reveal-right" style={{ position: 'relative', paddingBottom: '32px', paddingLeft: 'clamp(16px, 4vw, 32px)' }}>
                        <div style={{
                            position: 'absolute', top: '16px', left: '0',
                            width: '100%', height: '100%',
                            border: '3px solid var(--border-strong)',
                            borderRadius: '2.5rem',
                            zIndex: 0,
                        }} />
                        <div style={{
                            position: 'relative', zIndex: 1,
                            borderRadius: '2.5rem',
                            overflow: 'hidden',
                            border: '8px solid var(--bg-card)',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
                        }}>
                            <img src={avatarUrl} alt={data.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
                        </div>
                        {/* Experience Floating Badge */}
                        <div style={{
                            position: 'absolute', bottom: '0', right: '0',
                            background: 'var(--bg-card)',
                            border: '2px solid var(--primary)',
                            borderRadius: '1.5rem',
                            padding: '12px 20px',
                            textAlign: 'center',
                            boxShadow: '0 12px 32px var(--primary-glow)',
                            zIndex: 10,
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>+{data.experience}</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>سنة خبرة</div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="animate-on-scroll reveal-left" style={{ textAlign: 'right' }}>
                        <p style={{
                            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                            lineHeight: 2,
                            color: 'var(--text-muted)',
                            fontWeight: 500,
                            marginBottom: '36px',
                        }}>
                            {data.aboutText}
                        </p>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '12px', marginBottom: '32px' }}>
                            {stats.map((stat, i) => (
                                <div key={i} className={`animate-on-scroll reveal-up delay-${(i + 1) * 200}`} style={{
                                    background: 'var(--bg-card)',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: '1.25rem',
                                    padding: 'clamp(12px, 2vw, 20px) 8px',
                                    textAlign: 'center',
                                    transition: 'border-color 0.3s',
                                    cursor: 'default',
                                }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                                >
                                    <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', marginBottom: '6px' }}>{stat.icon}</div>
                                    <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 900, color: 'var(--primary)' }}>{stat.number}</div>
                                    <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* CV Button */}
                        {data.cvLink && (
                            <a href={data.cvLink} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                padding: '14px 32px', borderRadius: '1rem',
                                background: 'var(--gradient-primary)', color: 'white',
                                fontWeight: 800, fontSize: '1.05rem',
                                textDecoration: 'none',
                                boxShadow: '0 8px 24px var(--primary-glow)',
                                transition: 'transform 0.3s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                📥 تحميل السيرة الذاتية
                            </a>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
