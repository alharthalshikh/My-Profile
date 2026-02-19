import { useState, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import type { SkillCategory, Project } from '../types';
import Cropper from 'react-easy-crop';

type TabKey = 'personal' | 'about' | 'skills' | 'projects' | 'contact' | 'messages' | 'settings';

interface Props {
    onClose: () => void;
    onToast: (msg: string) => void;
}

export default function AdminPanel({ onClose, onToast }: Props) {
    const { data, updateData, resetData, exportData, importData } = useData();
    const [activeTab, setActiveTab] = useState<TabKey>('personal');

    const [name, setName] = useState(data.name);
    const [title, setTitle] = useState(data.title);
    const [heroDesc, setHeroDesc] = useState(data.heroDesc);
    const [avatar, setAvatar] = useState(data.avatar);
    const [aboutText, setAboutText] = useState(data.aboutText);
    const [cvLink, setCvLink] = useState(data.cvLink);
    const [experience, setExperience] = useState(data.experience);
    const [clients, setClients] = useState(data.clients);
    const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(data.skillCategories);
    const [projects, setProjects] = useState<Project[]>(data.projects);
    const [email, setEmail] = useState(data.contact.email);
    const [whatsapp, setWhatsapp] = useState(data.contact.whatsapp);
    const [whatsappGroup, setWhatsappGroup] = useState(data.contact.whatsappGroup);
    const [facebook, setFacebook] = useState(data.contact.facebook);
    const [instagram, setInstagram] = useState(data.contact.instagram);
    const [youtube, setYoutube] = useState(data.contact.youtube);
    const [snapchat, setSnapchat] = useState(data.contact.snapchat);
    const [github, setGithub] = useState(data.contact.github);
    const [linkedin, setLinkedin] = useState(data.contact.linkedin);
    const [twitter, setTwitter] = useState(data.contact.twitter);
    const [extraTitles, setExtraTitles] = useState<string[]>(data.extraTitles || []);
    const [newPassword, setNewPassword] = useState('');
    const [dbMessages, setDbMessages] = useState<any[]>([]);
    const [msgsLoading, setMsgsLoading] = useState(false);

    // Image Cropping State
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [cropSetter, setCropSetter] = useState<((val: string) => void) | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(1);
    const [cropShape, setCropShape] = useState<'rect' | 'round'>('round');

    // Sync local state when global data changes
    useEffect(() => {
        setName(data.name);
        setTitle(data.title);
        setHeroDesc(data.heroDesc);
        setAvatar(data.avatar);
        setAboutText(data.aboutText);
        setCvLink(data.cvLink);
        setExperience(data.experience);
        setClients(data.clients);
        setSkillCategories(data.skillCategories);
        setProjects(data.projects);
        setEmail(data.contact.email);
        setWhatsapp(data.contact.whatsapp);
        setWhatsappGroup(data.contact.whatsappGroup);
        setFacebook(data.contact.facebook);
        setInstagram(data.contact.instagram);
        setYoutube(data.contact.youtube);
        setSnapchat(data.contact.snapchat);
        setGithub(data.contact.github);
        setLinkedin(data.contact.linkedin);
        setTwitter(data.contact.twitter);
        setExtraTitles(data.extraTitles || []);
    }, [data]);

    const fetchDbMessages = async () => {
        setMsgsLoading(true);
        try {
            const { supabase } = await import('../lib/supabase');
            const { data: msgs, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setDbMessages(msgs || []);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setMsgsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'messages') fetchDbMessages();
    }, [activeTab]);

    const deleteMessage = async (id: string) => {
        if (!confirm('هل تريد حذف هذه الرسالة؟')) return;
        try {
            const { supabase } = await import('../lib/supabase');
            const { error } = await supabase.from('contact_messages').delete().eq('id', id);
            if (error) throw error;
            setDbMessages(prev => prev.filter(m => m.id !== id));
            onToast('تم حذف الرسالة');
        } catch (err) {
            onToast('حدث خطأ أثناء الحذف');
        }
    };

    const tabs: { key: TabKey; label: string; icon: string }[] = [
        { key: 'personal', label: 'شخصي', icon: '👤' },
        { key: 'about', label: 'عني', icon: 'ℹ️' },
        { key: 'skills', label: 'المهارات', icon: '💻' },
        { key: 'projects', label: 'المشاريع', icon: '🚀' },
        { key: 'contact', label: 'التواصل', icon: '📧' },
        { key: 'messages', label: 'الرسائل', icon: '💬' },
        { key: 'settings', label: 'الإعدادات', icon: '⚙️' },
    ];

    const savePersonal = () => { updateData({ name, title, heroDesc, avatar, extraTitles }); onToast('تم حفظ المعلومات الشخصية'); };
    const saveAbout = () => { updateData({ aboutText, cvLink, experience, clients }); onToast('تم حفظ معلومات "عني"'); };
    const saveSkills = () => { updateData({ skillCategories }); onToast('تم حفظ المهارات'); };
    const saveProjects = () => { updateData({ projects }); onToast('تم حفظ المشاريع'); };
    const saveContact = () => { updateData({ contact: { email, whatsapp, whatsappGroup, facebook, instagram, youtube, snapchat, github, linkedin, twitter } }); onToast('تم حفظ بيانات التواصل'); };
    const savePassword = () => {
        if (newPassword.length >= 4) { updateData({ adminPassword: newPassword }); setNewPassword(''); onToast('تم تغيير كلمة المرور'); }
    };

    const onCropComplete = useCallback((_area: any, pixels: any) => { setCroppedAreaPixels(pixels); }, []);

    const createCroppedImage = async () => {
        if (!imageToCrop || !croppedAreaPixels) return;
        try {
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.src = imageToCrop;
            await new Promise((res) => (img.onload = res));
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;
            ctx.drawImage(img, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height);
            const base64Image = canvas.toDataURL('image/jpeg');
            if (cropSetter) cropSetter(base64Image);
            onToast('تم اختيار الصورة واقتصاصها بنجاح');
            setImageToCrop(null);
        } catch (e) { console.error(e); onToast('حدث خطأ أثناء معالجة الصورة'); }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, isRound: boolean = false) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result as string);
                setCropSetter(() => setter);
                setCropShape(isRound ? 'round' : 'rect');
                setAspectRatio(isRound ? 1 : 16 / 9);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExport = () => {
        const blob = new Blob([exportData()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'profile-data.json'; a.click();
        URL.revokeObjectURL(url); onToast('تم تصدير البيانات');
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = () => { importData(reader.result as string) ? (onToast('تم الاستيراد بنجاح'), window.location.reload()) : onToast('خطأ في الملف'); };
        reader.readAsText(file);
    };

    const handleReset = () => { if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) { resetData(); onToast('تم الحذف'); window.location.reload(); } };

    const addSkill = (catId: string, skillName: string, level: number) => {
        const updated = skillCategories.map(cat => cat.id === catId ? { ...cat, skills: [...cat.skills, { name: skillName, level: Math.min(100, Math.max(0, level || 50)) }] } : cat);
        setSkillCategories(updated); updateData({ skillCategories: updated });
    };

    const removeSkill = (catId: string, idx: number) => {
        const updated = skillCategories.map(cat => cat.id === catId ? { ...cat, skills: cat.skills.filter((_, i) => i !== idx) } : cat);
        setSkillCategories(updated); updateData({ skillCategories: updated });
    };

    const addCategory = () => {
        const updated = [...skillCategories, { id: Date.now().toString(), title: 'فئة جديدة', icon: '📌', skills: [] }];
        setSkillCategories(updated); updateData({ skillCategories: updated });
    };

    const removeCategory = (catId: string) => {
        const updated = skillCategories.filter(cat => cat.id !== catId);
        setSkillCategories(updated); updateData({ skillCategories: updated });
    };

    const updateCategory = (catId: string, field: 'title' | 'icon', value: string) => {
        const updated = skillCategories.map(cat => cat.id === catId ? { ...cat, [field]: value } : cat);
        setSkillCategories(updated); updateData({ skillCategories: updated });
    };

    const addProject = () => {
        const updated = [...projects, { id: Date.now().toString(), title: 'مشروع جديد', description: '', image: '', link: '' }];
        setProjects(updated); updateData({ projects: updated });
    };

    const updateProject = (id: string, field: keyof Project, value: string) => setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
    const removeProject = (id: string) => {
        const updated = projects.filter(p => p.id !== id);
        setProjects(updated); updateData({ projects: updated });
    };

    /* ── Styles ── */
    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 16px', border: '2px solid var(--border-color)', borderRadius: '0.875rem',
        background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Tajawal, sans-serif', fontSize: '1rem',
        outline: 'none', textAlign: 'right', transition: 'border-color 0.3s',
    };
    const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '8px', textAlign: 'right' };
    const sectionCard: React.CSSProperties = { background: 'var(--bg-primary)', border: '2px solid var(--border-color)', borderRadius: '1rem', padding: '20px', marginBottom: '20px' };
    const saveBtn: React.CSSProperties = {
        width: '100%', padding: '14px', border: 'none', borderRadius: '0.875rem', background: 'var(--gradient-primary)', color: 'white',
        fontSize: '1rem', fontWeight: 800, fontFamily: 'Tajawal, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        boxShadow: '0 6px 16px var(--primary-glow)', transition: 'transform 0.3s',
    };
    const uploadBtnCard: React.CSSProperties = {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
        padding: '24px', border: '2px dashed var(--border-color)', borderRadius: '1rem',
        cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 700, transition: 'all 0.3s',
        background: 'rgba(255,255,255,0.02)', margin: '16px 0'
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: '440px', maxWidth: '96vw',
            zIndex: 150, display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)',
            borderLeft: '2px solid var(--border-color)', boxShadow: '8px 0 40px rgba(0,0,0,0.25)', animation: 'slide-up 0.3s ease',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '2px solid var(--border-color)', flexShrink: 0 }}>
                <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--border-color)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                <h2 style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.2rem', gap: '8px', display: 'flex', alignItems: 'center' }}>لوحة التحكم ⚙️</h2>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '16px 20px', borderBottom: '2px solid var(--border-color)', flexShrink: 0 }}>
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                        padding: '8px 16px', borderRadius: '9999px', border: '2px solid', cursor: 'pointer',
                        fontFamily: 'Tajawal, sans-serif', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'all 0.25s',
                        ...(activeTab === tab.key ? { background: 'var(--gradient-primary)', borderColor: 'transparent', color: 'white' } : { background: 'transparent', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }),
                    }}>
                        <span>{tab.icon}</span>{tab.label}
                    </button>
                ))}
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
                {activeTab === 'personal' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div><label style={labelStyle}>الاسم الكامل</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} /></div>
                        <div><label style={labelStyle}>المسمى الوظيفي الرئيسي</label><input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} /></div>

                        <div style={sectionCard}>
                            <label style={labelStyle}>🎭 مسميات وظيفية إضافية</label>
                            {extraTitles.map((t, i) => (
                                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', background: 'var(--bg-secondary)', padding: '6px', borderRadius: '8px' }}>
                                    <button onClick={() => setExtraTitles(extraTitles.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                                    <input style={{ ...inputStyle, border: 'none', background: 'transparent' }} value={t} onChange={e => setExtraTitles(extraTitles.map((v, idx) => idx === i ? e.target.value : v))} onBlur={() => updateData({ extraTitles })} />
                                </div>
                            ))}
                            <button onClick={() => setExtraTitles([...extraTitles, ''])} style={{ width: '100%', padding: '8px', border: '2px dashed var(--primary)', borderRadius: '8px', background: 'transparent', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}>➕ إضافة مسمى</button>
                        </div>

                        <div><label style={labelStyle}>الوصف التعريفي</label><textarea style={inputStyle} value={heroDesc} onChange={e => setHeroDesc(e.target.value)} rows={3} /></div>

                        <div>
                            <label style={labelStyle}>الصورة الشخصية</label>
                            <input style={inputStyle} value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="رابط الصورة المباشر" />
                            <div style={uploadBtnCard} onClick={() => document.getElementById('hero-upload')?.click()}>
                                <span style={{ fontSize: '2rem' }}>�</span>
                                <span>رفع واقتصاص صورة شخصية</span>
                                <input id="hero-upload" type="file" hidden accept="image/*" onChange={e => handleImageUpload(e, setAvatar, true)} />
                            </div>
                            {avatar && <img src={avatar} style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto', display: 'block', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 0 20px var(--primary-glow)' }} />}
                        </div>
                        <button style={saveBtn} onClick={savePersonal}>💾 حفظ المعلومات الشخصية</button>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div><label style={labelStyle}>نبذة تعريفية</label><textarea style={inputStyle} value={aboutText} onChange={e => setAboutText(e.target.value)} rows={5} /></div>
                        <div><label style={labelStyle}>رابط السيرة الذاتية (CV)</label><input style={inputStyle} value={cvLink} onChange={e => setCvLink(e.target.value)} placeholder="https://..." /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={sectionCard}>
                                <label style={labelStyle}>⭐ سنوات الخبرة</label>
                                <input type="number" style={{ ...inputStyle, textAlign: 'center' }} value={experience} onChange={e => setExperience(+e.target.value)} />
                            </div>
                            <div style={sectionCard}>
                                <label style={labelStyle}>👥 العملاء</label>
                                <input type="number" style={{ ...inputStyle, textAlign: 'center' }} value={clients} onChange={e => setClients(+e.target.value)} />
                            </div>
                        </div>
                        <button style={saveBtn} onClick={saveAbout}>💾 حفظ بيانات "عني"</button>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {skillCategories.map(cat => (
                            <div key={cat.id} style={sectionCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <button onClick={() => removeCategory(cat.id)} style={{ color: '#dc3545', background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer' }}>🗑️ حذف الفئة</button>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input style={{ ...inputStyle, width: '120px' }} value={cat.title} onChange={e => updateCategory(cat.id, 'title', e.target.value)} />
                                        <input style={{ ...inputStyle, width: '50px', textAlign: 'center' }} value={cat.icon} onChange={e => updateCategory(cat.id, 'icon', e.target.value)} />
                                    </div>
                                </div>
                                {cat.skills.map((s, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '10px', marginBottom: '8px', border: '1px solid var(--border-color)' }}>
                                        <button onClick={() => removeSkill(cat.id, i)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800 }}>{s.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>{s.level}%</div>
                                        </div>
                                    </div>
                                ))}
                                <SkillAdder catId={cat.id} onAdd={addSkill} />
                            </div>
                        ))}
                        <button onClick={addCategory} style={{ width: '100%', padding: '12px', border: '2.5px dashed var(--primary)', borderRadius: '12px', background: 'transparent', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}>➕ إضافة فئة تجارية جديدة</button>
                        <button style={saveBtn} onClick={saveSkills}>💾 حفظ المهارات</button>
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {projects.map((p, idx) => (
                            <div key={p.id} style={sectionCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <button onClick={() => removeProject(p.id)} style={{ color: '#dc3545', background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer' }}>🗑️ حذف</button>
                                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>مشروع #{idx + 1}</span>
                                </div>
                                <input style={{ ...inputStyle, marginBottom: '8px' }} value={p.title} onChange={e => updateProject(p.id, 'title', e.target.value)} placeholder="اسم المشروع" />
                                <textarea style={{ ...inputStyle, marginBottom: '8px' }} value={p.description} onChange={e => updateProject(p.id, 'description', e.target.value)} placeholder="وصف المشروع" rows={2} />
                                <input style={{ ...inputStyle, marginBottom: '8px' }} value={p.image} onChange={e => updateProject(p.id, 'image', e.target.value)} placeholder="رابط صورة المشروع" />
                                <div style={uploadBtnCard} onClick={() => document.getElementById(`p-${p.id}`)?.click()}>
                                    🖼️ رفع صورة للمشروع (16:9)
                                    <input id={`p-${p.id}`} type="file" hidden accept="image/*" onChange={e => handleImageUpload(e, v => updateProject(p.id, 'image', v), false)} />
                                </div>
                                {p.image && <img src={p.image} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '10px', marginTop: '10px', border: '2px solid var(--border-color)' }} />}
                                <input style={{ ...inputStyle, marginTop: '8px' }} value={p.link} onChange={e => updateProject(p.id, 'link', e.target.value)} placeholder="رابط المعاينة" />
                            </div>
                        ))}
                        <button onClick={addProject} style={{ width: '100%', padding: '12px', border: '2px dashed var(--border-color)', borderRadius: '12px', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 800, cursor: 'pointer' }}>➕ إضافة مشروع جديد</button>
                        <button style={saveBtn} onClick={saveProjects}>💾 حفظ المشاريع</button>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: '📧 البريد الإلكتروني', val: email, set: setEmail, type: 'email' },
                            { label: '💬 واتساب', val: whatsapp, set: setWhatsapp, type: 'text' },
                            { label: '👥 مجموعة واتساب', val: whatsappGroup, set: setWhatsappGroup, type: 'url' },
                            { label: '🔵 فيسبوك', val: facebook, set: setFacebook, type: 'url' },
                            { label: '📸 انستجرام', val: instagram, set: setInstagram, type: 'url' },
                            { label: '🎬 يوتيوب', val: youtube, set: setYoutube, type: 'url' },
                            { label: '👻 سناب شات', val: snapchat, set: setSnapchat, type: 'url' },
                            { label: '🐙 GitHub', val: github, set: setGithub, type: 'url' },
                            { label: '💼 LinkedIn', val: linkedin, set: setLinkedin, type: 'url' },
                            { label: '🐦 Twitter / X', val: twitter, set: setTwitter, type: 'url' },
                        ].map((f) => (
                            <div key={f.label}>
                                <label style={labelStyle}>{f.label}</label>
                                <input style={inputStyle} type={f.type} value={f.val || ''} onChange={e => f.set(e.target.value)} />
                            </div>
                        ))}
                        <button style={saveBtn} onClick={saveContact}>💾 حفظ بيانات التواصل</button>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {msgsLoading ? <p style={{ textAlign: 'center' }}>جاري التحميل...</p> : dbMessages.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5 }}>لا توجد رسائل</p> : dbMessages.map(m => (
                            <div key={m.id} style={sectionCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.6, marginBottom: '8px' }}>
                                    <button onClick={() => deleteMessage(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                                    <span>{new Date(m.created_at).toLocaleString('ar-SA')}</span>
                                </div>
                                <div style={{ fontWeight: 850, color: 'var(--primary)', marginBottom: '4px' }}>{m.name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>{m.contact_info}</div>
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{m.message}</div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={sectionCard}>
                            <label style={labelStyle}>🔑 تغيير كلمة مرور المسؤول</label>
                            <input style={inputStyle} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="4 أحرف على الأقل" />
                            <button style={{ ...saveBtn, marginTop: '12px' }} onClick={savePassword}>تحديث كلمة المرور</button>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleExport} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid var(--border-color)', background: 'transparent', cursor: 'pointer', fontWeight: 800 }}>📥 تصدير البيانات</button>
                            <label style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid var(--border-color)', background: 'transparent', cursor: 'pointer', fontWeight: 800, textAlign: 'center' }}>
                                📤 استيراد
                                <input type="file" accept=".json" hidden onChange={handleImport} />
                            </label>
                        </div>
                        <button onClick={handleReset} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'rgba(220,53,69,0.1)', color: '#dc3545', fontWeight: 900, cursor: 'pointer' }}>🗑️ حذف جميع البيانات نهائياً</button>
                    </div>
                )}
            </div>

            {/* Cropper Modal */}
            {imageToCrop && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.96)',
                    zIndex: 3000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '450px', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                        <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={aspectRatio} cropShape={cropShape} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                    </div>
                    <div style={{ marginTop: '24px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                            <span style={{ fontWeight: 800 }}>التحجيم:</span>
                            <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={e => setZoom(+e.target.value)} style={{ flex: 1, accentColor: 'var(--primary)' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ ...saveBtn, flex: 2 }} onClick={createCroppedImage}>✨ اعتماد الصورة</button>
                            <button onClick={() => setImageToCrop(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontWeight: 800, cursor: 'pointer' }}>إلغاء</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SkillAdder({ catId, onAdd }: { catId: string; onAdd: (catId: string, name: string, level: number) => void }) {
    const [name, setName] = useState('');
    const [level, setLevel] = useState(50);
    return (
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'center' }}>
            <button onClick={() => { if (name) { onAdd(catId, name, level); setName(''); setLevel(50); } }} style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--gradient-primary)', color: 'white', border: 'none', fontWeight: 900, cursor: 'pointer' }}>➕</button>
            <input placeholder="اسم المهارة" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', textAlign: 'right' }} value={name} onChange={e => setName(e.target.value)} />
            <input type="number" style={{ width: '60px', padding: '10px', borderRadius: '10px', border: '2px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', textAlign: 'center' }} value={level} onChange={e => setLevel(+e.target.value)} />
        </div>
    );
}
