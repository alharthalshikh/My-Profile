import { useData } from '../context/DataContext';

export default function Footer() {
    const { data } = useData();

    const links = [
        { id: 'home', label: 'الرئيسية' },
        { id: 'about', label: 'عني' },
        { id: 'skills', label: 'المهارات' },
        { id: 'projects', label: 'المشاريع' },
        { id: 'contact', label: 'تواصل' },
    ];

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="animate-on-scroll reveal-up" style={{
            background: 'var(--bg-secondary)',
            borderTop: '2px solid var(--border-color)',
            padding: '60px 24px 32px',
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Main row */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap',
                    justifyContent: 'space-between', alignItems: 'center',
                    gap: '32px', marginBottom: '40px',
                }}>
                    {/* Brand */}
                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            fontSize: '1.8rem', fontWeight: 900,
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            marginBottom: '6px',
                        }}>
                            {data.name}
                        </div>
                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            نصنع تجارب رقمية تترك أثراً
                        </p>
                    </div>

                    {/* Nav links */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                        {links.map(link => (
                            <button key={link.id} onClick={() => scrollTo(link.id)} style={{
                                padding: '6px 14px', borderRadius: '9999px',
                                border: '1.5px solid var(--border-color)',
                                background: 'transparent', color: 'var(--text-secondary)',
                                fontSize: 'clamp(0.8rem, 2vw, 1rem)', fontWeight: 700,
                                fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
                                transition: 'border-color 0.3s, color 0.3s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '24px',
                    display: 'flex', flexWrap: 'wrap',
                    justifyContent: 'space-between', alignItems: 'center',
                    gap: '12px',
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
                        © {new Date().getFullYear()} {data.name}. جميع الحقوق محفوظة
                    </p>
                    <p
                        style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => {
                            const clicks = (window as any)._adminClicks || 0;
                            (window as any)._adminClicks = clicks + 1;
                            if (clicks + 1 >= 5) {
                                window.dispatchEvent(new CustomEvent('open-admin-login'));
                                (window as any)._adminClicks = 0;
                            }
                            // Reset after 3 seconds of no clicking
                            if ((window as any)._adminTimeout) clearTimeout((window as any)._adminTimeout);
                            (window as any)._adminTimeout = setTimeout(() => { (window as any)._adminClicks = 0; }, 3000);
                        }}
                    >
                        صُنع بـ <span style={{ color: '#ef4444' }}>❤️</span> وشغف
                    </p>
                </div>
            </div>
        </footer>
    );
}
