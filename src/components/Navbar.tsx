import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const { isDark, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const sections = ['home', 'about', 'skills', 'projects', 'contact'];
            for (const id of sections.reverse()) {
                const el = document.getElementById(id);
                if (el && window.scrollY >= el.offsetTop - 150) {
                    setActiveSection(id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { id: 'home', label: 'الرئيسية' },
        { id: 'about', label: 'عني' },
        { id: 'skills', label: 'المهارات' },
        { id: 'projects', label: 'المشاريع' },
        { id: 'contact', label: 'تواصل معي' },
    ];

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileOpen(false);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 backdrop-blur-xl ${scrolled
                    ? 'py-2 border-b shadow-md'
                    : 'py-4 border-b border-transparent'
                    }`}
                style={{
                    backgroundColor: 'var(--bg-navbar)',
                    borderColor: scrolled ? 'var(--border-color)' : 'transparent',
                }}
            >
                <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-between">
                    {/* Logo - Hidden on mobile, visible on desktop */}
                    <a
                        href="#home"
                        onClick={(e) => { e.preventDefault(); scrollTo('home'); }}
                        className="hidden md:block text-3xl font-black text-gradient pr-16 lg:pr-24"
                    >
                        الملف الشخصي
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-4">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollTo(link.id)}
                                className={`px-6 py-3 rounded-xl font-bold text-[1.1rem] transition-all duration-300 relative group ${activeSection === link.id
                                    ? 'text-primary'
                                    : 'hover:text-primary'
                                    }`}
                                style={{ color: activeSection === link.id ? '#088395' : 'var(--text-secondary)' }}
                            >
                                {link.label}
                                <span
                                    className={`absolute bottom-1 right-6 left-6 h-0.5 bg-gradient-to-l from-primary to-primary-light rounded transition-all duration-300 ${activeSection === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme toggle - Hidden on mobile navbar, moved to menu */}
                        <button
                            onClick={toggleTheme}
                            className="hidden md:flex w-[42px] h-[42px] rounded-full items-center justify-center text-lg transition-all duration-300 hover:scale-110"
                            style={{
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-secondary)',
                            }}
                            title="تبديل الثيم"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>

                        {/* Mobile burger */}
                        <button
                            className="md:hidden flex flex-col gap-[5px] p-1 z-[110]"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            <span
                                className={`block w-6 h-0.5 rounded transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
                                    }`}
                                style={{ background: 'var(--text-primary)' }}
                            />
                            <span
                                className={`block w-6 h-0.5 rounded transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''
                                    }`}
                                style={{ background: 'var(--text-primary)' }}
                            />
                            <span
                                className={`block w-6 h-0.5 rounded transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
                                    }`}
                                style={{ background: 'var(--text-primary)' }}
                            />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-[99] flex flex-col items-center justify-center gap-8 transition-all duration-500 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                style={{ background: 'var(--bg-primary)' }}
            >
                {navLinks.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => scrollTo(link.id)}
                        className="text-2xl font-bold transition-colors duration-300 hover:text-primary"
                        style={{ color: activeSection === link.id ? '#088395' : 'var(--text-primary)' }}
                    >
                        {link.label}
                    </button>
                ))}

                {/* Theme toggle added inside mobile menu */}
                <button
                    onClick={() => { toggleTheme(); }}
                    className="mt-4 px-8 py-3 rounded-2xl flex items-center gap-3 font-bold text-lg"
                    style={{
                        background: 'var(--bg-card)',
                        border: '2px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    <span>تبديل الوضع</span>
                    <span className="text-2xl">{isDark ? '☀️' : '🌙'}</span>
                </button>
            </div>
        </>
    );
}
