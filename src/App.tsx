import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import LikeButton from './components/LikeButton';
import ScrollToTop from './components/ScrollToTop';

import { useData } from './context/DataContext';

export default function App() {
  const { loading, data } = useData();
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. Check login status & Set up Scroll Animations
  useEffect(() => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const init = async () => {
      const { supabase } = await import('./lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user.email === adminEmail) {
        setIsAdmin(true);
      }
    };
    init();

    // Listen for custom "open-admin-login" event from Footer
    const handleOpenLogin = () => setShowLogin(true);
    window.addEventListener('open-admin-login', handleOpenLogin);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Re-query and observe whenever data changes or component mounts
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, data]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const { supabase } = await import('./lib/supabase');
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError('بيانات الدخول غير صحيحة');
      } else {
        setIsAdmin(true);
        setShowLogin(false);
        setShowPanel(true);
        setEmail('');
        setPassword('');
        showToast('أهلاً بك يا مدير الموقع');
      }
    } catch (err) {
      setLoginError('حدث خطأ أثناء الاتصال');
    }
  };

  const handleLogout = async () => {
    const { supabase } = await import('./lib/supabase');
    await supabase.auth.signOut();
    setIsAdmin(false);
    setShowPanel(false);
    showToast('تم تسجيل الخروج بنجاح');
  };

  const handleAdminBtnClick = () => {
    if (isAdmin) {
      setShowPanel(!showPanel);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      {/* Preloader */}
      <div className={`preloader ${!loading ? 'fade-out' : ''}`}>
        <div className="loader-logo">
          الملف الشخصي
          <div className="loader-spinner" />
        </div>
      </div>

      <Navbar />
      <main style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.8s ease' }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />

      {/* Floating Interactive Elements */}
      <LikeButton />
      <ScrollToTop />

      {/* Admin Toggle Button - Only visible if logged in and IS the authorized admin */}
      {isAdmin && (
        <div className="fixed bottom-8 left-8 z-[90] flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-[50px] h-[50px] rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
            title="تسجيل الخروج"
          >
            🚪
          </button>
          <button
            onClick={handleAdminBtnClick}
            className="w-[50px] h-[50px] rounded-full text-white text-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #e68a00, #f5a623)',
              boxShadow: '0 6px 20px rgba(230,138,0,0.3)',
            }}
            title="لوحة التحكم"
          >
            📝
          </button>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', animation: 'scale-in 0.3s ease' }}
        >
          <div
            className="rounded-2xl p-10 max-w-[400px] w-[90%] text-center relative border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <button
              onClick={() => { setShowLogin(false); setLoginError(''); setPassword(''); setEmail(''); }}
              className="absolute top-4 left-4 transition-colors hover:text-primary"
              style={{ color: 'var(--text-muted)' }}
            >
              ✕
            </button>

            <div
              className="w-[70px] h-[70px] rounded-full mx-auto mb-6 flex items-center justify-center text-3xl"
              style={{ background: 'var(--primary-subtle)', color: '#088395' }}
            >
              🔐
            </div>

            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              دخول المدير
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              أدخل البريد وكلمة السر (Supabase)
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="w-full px-4 py-3 rounded-xl border outline-none text-right mb-3 focus:border-primary"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                placeholder="كلمة المرور"
                className="w-full px-4 py-3 rounded-xl border outline-none text-right mb-4 focus:border-primary"
                style={{ background: 'var(--bg-primary)', borderColor: loginError ? '#dc3545' : 'var(--border-color)', color: 'var(--text-primary)' }}
              />
              {loginError && (
                <p className="text-sm mb-3" style={{ color: '#dc3545' }}>{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-semibold text-lg bg-primary"
                style={{ background: 'var(--gradient-primary)' }}
              >
                🚪 دخول
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showPanel && isAdmin && (
        <>
          <div
            className="fixed inset-0 z-[140]"
            style={{ background: 'rgba(0,0,0,0.3)' }}
            onClick={() => setShowPanel(false)}
          />
          <AdminPanel onClose={() => setShowPanel(false)} onToast={showToast} />
        </>
      )}

      {/* Toast */}
      <div className={`toast-notification ${toast ? 'show' : ''}`}>
        ✅ {toast}
      </div>
    </>
  );
}
