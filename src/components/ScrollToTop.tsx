import { useState, useEffect } from 'react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-[100px] right-4 z-[999] w-[50px] h-[50px] rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl hover:scale-110 active:scale-95 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
            style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-color)',
                color: 'var(--color-primary, #088395)',
                cursor: 'pointer',
            }}
            title="الرجوع للأعلى"
        >
            {/* Elegant Arrow Icon */}
            <div className="relative">
                <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 15l7-7 7 7"
                    />
                </svg>
                {/* Subtle pulse ring */}
                <div className="absolute inset-0 w-full h-full rounded-full animate-ping opacity-20 bg-primary" />
            </div>

            {/* Background Glow on Hover */}
            <div className="absolute inset-0 rounded-2xl bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </button>
    );
}
