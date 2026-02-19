import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function LikeButton() {
    const { incrementClients } = useData();
    const [liked, setLiked] = useState(false);
    const [hasAlreadyLiked, setHasAlreadyLiked] = useState(() => localStorage.getItem('user_has_liked') === 'true');
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
    const [showThanks, setShowThanks] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        // Prevent spam or multiple likes
        if (showThanks || hasAlreadyLiked) return;

        incrementClients();
        setLiked(true);
        setHasAlreadyLiked(true);
        setShowThanks(true);
        localStorage.setItem('user_has_liked', 'true');

        // Generate particles at click location
        const newParticles = Array.from({ length: 12 }).map((_, i) => ({
            id: Date.now() + i,
            x: e.clientX + (Math.random() * 40 - 20),
            y: e.clientY + (Math.random() * 40 - 20),
            emoji: ['❤️', '✨', '💖', '⭐', '🔥'][Math.floor(Math.random() * 5)]
        }));

        setParticles(prev => [...prev, ...newParticles]);

        // Cleanup
        setTimeout(() => {
            setShowThanks(false);
            setLiked(false);
        }, 3000);

        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1500);
    };

    if (hasAlreadyLiked && !showThanks) return null;

    return (
        <>
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '16px',
                zIndex: 999,
            }}>
                <button
                    onClick={handleClick}
                    className={liked ? 'animate-bounce' : ''}
                    style={{
                        width: 'clamp(50px, 12vw, 70px)',
                        height: 'clamp(50px, 12vw, 70px)',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        color: 'white',
                        fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 25px var(--primary-glow)',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                >
                    <span style={{ filter: liked ? 'drop-shadow(0 0 10px white)' : 'none' }}>👍</span>

                    {/* Tooltip — only on wider screens */}
                    <div style={{
                        position: 'absolute',
                        right: '75px',
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        padding: '8px 14px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        border: '1px solid var(--border-color)',
                        pointerEvents: 'none',
                        opacity: showThanks || window.innerWidth < 500 ? 0 : 0.9,
                        transition: 'opacity 0.3s',
                    }}>
                        هل أعجبتك الصفحة؟ ✨
                    </div>
                </button>
            </div>

            {/* Particles */}
            {particles.map(p => (
                <div key={p.id} className="particle" style={{ left: p.x, top: p.y }}>
                    {p.emoji}
                </div>
            ))}

            {/* Thank You Message */}
            {showThanks && (
                <div className="thank-you-msg">
                    شكرأً لك على إعجابك ودعمك! ❤️🎉
                </div>
            )}
        </>
    );
}
