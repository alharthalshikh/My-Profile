import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Contact() {
    const { data } = useData();
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError(false);
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const contactInfo = (form.elements.namedItem('email') as HTMLInputElement).value;
        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

        try {
            const { db } = await import('../lib/firebase');
            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

            // 1. Save directly to Firebase Firestore
            await addDoc(collection(db, 'contact_messages'), {
                name,
                contact_info: contactInfo,
                message,
                created_at: serverTimestamp()
            });

            // 2. Background Email (Trying to send to your email)
            const apiKey = import.meta.env.VITE_RESEND_API_KEY;
            if (apiKey) {
                fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        from: 'onboarding@resend.dev',
                        to: 'alharth465117@gmail.com',
                        subject: `رسالة جديدة من: ${name}`,
                        html: `<p><strong>الاسم:</strong> ${name}</p>
                               <p><strong>التواصل:</strong> ${contactInfo}</p>
                               <p><strong>الرسالة:</strong></p>
                               <p>${message}</p>`
                    })
                }).catch(() => {
                    // Fail silently if browser blocks it, we still have it in DB
                });
            }

            setSubmitted(true);
            form.reset();
            setTimeout(() => setSubmitted(false), 8000);
        } catch (err) {
            console.error('Submission error:', err);
            setError(true);
        } finally {
            setSending(false);
        }
    };

    const defaultMsg = encodeURIComponent('أهلاً الحارث، أريد التواصل معك بخصوص مشروع.');

    const contactCards = [
        {
            show: !!data.contact.email,
            href: `mailto:${data.contact.email}?subject=${encodeURIComponent('تواصل بخصوص مشروع')}&body=${defaultMsg}`,
            icon: '📧',
            label: 'البريد الإلكتروني',
            value: data.contact.email,
            color: 'var(--bg-card)',
            textColor: 'var(--text-primary)'
        },
        {
            show: !!data.contact.whatsapp,
            href: `https://wa.me/${data.contact.whatsapp}?text=${defaultMsg}`,
            icon: '📞',
            label: 'تواصل عبر واتساب',
            value: '',
            color: '#07a35d',
            textColor: 'white',
            glow: 'rgba(7,163,93,0.4)',
            target: '_blank'
        },
        {
            show: !!data.contact.whatsappGroup,
            href: data.contact.whatsappGroup,
            icon: '💬',
            label: 'انضم لمجموعة واتساب',
            value: '',
            color: '#00897B',
            textColor: 'white',
            glow: 'rgba(0,137,123,0.4)',
            target: '_blank'
        },
        {
            show: !!data.contact.facebook,
            href: `https://m.me/${(data.contact.facebook || '').split('/').pop()}`,
            icon: '🔵',
            label: 'راسلنا على فيسبوك',
            value: '',
            color: '#1877F2',
            textColor: 'white',
            glow: 'rgba(24,119,242,0.4)',
            target: '_blank'
        },
        {
            show: !!data.contact.instagram,
            href: `https://ig.me/m/${(data.contact.instagram || '').split('/').pop()}`,
            icon: '📸',
            label: 'راسلنا على انستجرام',
            value: '',
            color: '#E1306C',
            textColor: 'white',
            glow: 'rgba(225,48,108,0.4)',
            target: '_blank'
        },
        {
            show: !!data.contact.youtube,
            href: data.contact.youtube,
            icon: '🎬',
            label: 'اشترك في قناتنا',
            value: '',
            color: '#FF0000',
            textColor: 'white',
            glow: 'rgba(255,0,0,0.4)',
            target: '_blank'
        },
        {
            show: !!data.contact.snapchat,
            href: data.contact.snapchat,
            icon: '👻',
            label: 'تابعنا على سناب شات',
            value: '',
            color: '#FFFC00',
            textColor: '#000',
            glow: 'rgba(255,252,0,0.3)',
            target: '_blank'
        },
        {
            show: !!data.contact.twitter,
            href: data.contact.twitter,
            icon: '🐦',
            label: 'تواصل عبر تويتر (X)',
            value: '',
            color: '#000000',
            textColor: 'white',
            glow: 'rgba(255,255,255,0.15)',
            target: '_blank'
        },
        {
            show: !!data.contact.github,
            href: data.contact.github,
            icon: '🐙',
            label: 'تابعنا على GitHub',
            value: '',
            color: '#333',
            textColor: 'white',
            glow: 'rgba(51,51,51,0.4)',
            target: '_blank'
        },
        {
            show: !!data.contact.linkedin,
            href: data.contact.linkedin,
            icon: '💼',
            label: 'الملف المهني LinkedIn',
            value: '',
            color: '#0077B5',
            textColor: 'white',
            glow: 'rgba(0,119,181,0.4)',
            target: '_blank'
        },
    ];

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 18px',
        borderRadius: '0.875rem',
        border: '2px solid var(--border-color)',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontSize: '1.05rem',
        fontFamily: 'Tajawal, sans-serif',
        fontWeight: 500,
        outline: 'none',
        transition: 'border-color 0.3s',
        textAlign: 'right',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '1rem',
        fontWeight: 800,
        color: 'var(--text-primary)',
        marginBottom: '8px',
        textAlign: 'right',
    };

    return (
        <section
            id="contact"
            style={{ background: 'var(--bg-primary)', padding: 'clamp(60px, 10vw, 120px) 0' }}
        >
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

                {/* Section Badge */}
                <div style={{ textAlign: 'center', marginBottom: '72px' }} className="animate-on-scroll reveal-up">
                    <span style={{
                        display: 'inline-block',
                        padding: '10px 32px',
                        borderRadius: '9999px',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        background: 'var(--bg-card)',
                        color: 'var(--primary)',
                        border: '2px solid var(--primary)',
                        boxShadow: '0 8px 24px var(--primary-glow)',
                    }}>
                        📩 تواصل معي
                    </span>
                    <div style={{
                        width: '60px', height: '4px', borderRadius: '9999px',
                        background: 'var(--gradient-primary)',
                        margin: '20px auto 0',
                    }} />
                </div>

                {/* Two column grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                        gap: '48px',
                        alignItems: 'start',
                    }}
                >
                    {/* Info Side */}
                    <div className="animate-on-scroll reveal-right" style={{ textAlign: 'right' }}>
                        <h3 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
                            لنحول <span style={{ color: 'var(--primary)' }}>أفكارك</span> إلى واقع
                        </h3>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 2, fontWeight: 500, marginBottom: '40px' }}>
                            أنا جاهز للعمل على مشروعك القادم. تواصل معي عبر أي قناة تناسبك.
                        </p>

                        {/* Contact Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {contactCards.filter(c => c.show).map((card, i) => (
                                <a key={i} href={card.href || '#'} target={card.target || '_self'}
                                    rel={card.target ? 'noopener noreferrer' : undefined}
                                    className={`animate-on-scroll reveal-up delay-${(i + 1) * 100}`}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
                                        padding: '16px 24px', borderRadius: '1.25rem',
                                        background: card.color,
                                        border: card.color === 'var(--bg-card)' ? '2px solid var(--border-color)' : 'none',
                                        color: card.textColor,
                                        textDecoration: 'none',
                                        transition: 'all 0.3s, transform 0.3s, opacity 0.8s, filter 0.8s',
                                        boxShadow: card.glow ? `0 8px 20px ${card.glow}` : 'none',
                                        fontWeight: 850,
                                        fontSize: '1.1rem',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        if (card.glow) e.currentTarget.style.boxShadow = `0 12px 28px ${card.glow}`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        if (card.glow) e.currentTarget.style.boxShadow = `0 8px 20px ${card.glow}`;
                                    }}
                                >
                                    <span>{card.label}</span>
                                    <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                                    {card.value && <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 600, marginRight: 'auto' }}>{card.value}</div>}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Form Side */}
                    <form onSubmit={handleSubmit} className="animate-on-scroll reveal-left delay-400" style={{
                        background: 'var(--bg-card)',
                        border: '2px solid var(--border-color)',
                        borderRadius: '1.5rem',
                        padding: 'clamp(20px, 5vw, 40px) clamp(16px, 4vw, 32px)',
                    }}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>الاسم الكامل</label>
                            <input name="name" type="text" required placeholder="مثال: الحارث عبدالرحمن"
                                style={inputStyle}
                                onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                                onBlur={e => (e.target.style.borderColor = 'var(--border-color)')}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>البريد الإلكتروني</label>
                            <input name="email" type="email" required placeholder="yourname@example.com"
                                style={inputStyle}
                                onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                                onBlur={e => (e.target.style.borderColor = 'var(--border-color)')}
                            />
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <label style={labelStyle}>تفاصيل الرسالة</label>
                            <textarea name="message" required rows={5} placeholder="اكتب رسالتك هنا بالتفصيل..."
                                style={{ ...inputStyle, resize: 'vertical' }}
                                onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                                onBlur={e => (e.target.style.borderColor = 'var(--border-color)')}
                            />
                        </div>
                        <button type="submit" disabled={sending} style={{
                            width: '100%', padding: '16px',
                            borderRadius: '0.875rem', border: 'none',
                            background: sending ? 'var(--text-muted)' : 'var(--gradient-primary)', color: 'white',
                            fontSize: '1.1rem', fontWeight: 800,
                            fontFamily: 'Tajawal, sans-serif', cursor: sending ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            boxShadow: sending ? 'none' : '0 8px 24px var(--primary-glow)',
                            opacity: sending ? 0.7 : 1,
                        }}
                            onMouseEnter={e => !sending && (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={e => !sending && (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            {sending ? '⏳ جاري الإرسال...' : '🚀 إرسال الرسالة'}
                        </button>
                        {submitted && (
                            <div style={{
                                marginTop: '20px', padding: '16px', borderRadius: '0.875rem',
                                background: 'rgba(7,163,93,0.1)', border: '1px solid #07a35d',
                                color: '#07a35d', fontWeight: 800, textAlign: 'center',
                                animation: 'scale-in 0.3s ease',
                            }}>
                                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>✅ تم استلام رسالتك بنجاح</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>سأقوم بالرد عليك في أقرب وقت ممكن.</div>
                            </div>
                        )}
                        {error && (
                            <div style={{
                                marginTop: '20px', padding: '16px', borderRadius: '0.875rem',
                                background: 'rgba(220,53,69,0.1)', border: '1px solid #dc3545',
                                color: '#dc3545', fontWeight: 800, textAlign: 'center',
                            }}>
                                ❌ حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً أو مراسلتي عبر واتساب مباشرة.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
