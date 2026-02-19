export interface Skill {
    name: string;
    level: number;
}

export interface SkillCategory {
    id: string;
    title: string;
    icon: string;
    skills: Skill[];
}

export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
}

export interface ContactInfo {
    email: string;
    whatsapp: string;
    whatsappGroup: string;
    facebook: string;
    instagram: string;
    youtube: string;
    snapchat: string;
    github: string;
    linkedin: string;
    twitter: string;
}

export interface Message {
    id: string;
    name: string;
    contactInfo: string;
    message: string;
    date: string;
}

export interface ProfileData {
    name: string;
    title: string;
    heroDesc: string;
    avatar: string;
    aboutText: string;
    cvLink: string;
    experience: number;
    projectsCount: number;
    clients: number;
    skillCategories: SkillCategory[];
    projects: Project[];
    contact: ContactInfo;
    extraTitles: string[];
    adminPassword: string;
    receivedMessages: Message[];
}

export const defaultData: ProfileData = {
    name: 'الاسم الكامل',
    title: 'مهندس برمجيات',
    heroDesc: 'مطور شغوف بالتكنولوجيا ومستعد دائماً لمواجهة التحديات الجديدة وخلق حلول إبداعية',
    avatar: '',
    aboutText: 'أنا مطور متحمس للتكنولوجيا والتعلم المستمر. أعمل على تطوير حلول برمجية مبتكرة وأسعى دائماً لتوسيع معرفتي وتحسين مهاراتي لتحقيق أهدافي المهنية ومواجهة التحديات الجديدة.',
    cvLink: '',
    experience: 0,
    projectsCount: 0,
    clients: 0,
    skillCategories: [
        {
            id: 'programming',
            title: 'لغات البرمجة',
            icon: '💻',
            skills: [
                { name: 'JavaScript', level: 85 },
                { name: 'TypeScript', level: 80 },
                { name: 'Python', level: 70 },
            ],
        },
        {
            id: 'technologies',
            title: 'التقنيات والأدوات',
            icon: '🛠️',
            skills: [
                { name: 'React', level: 90 },
                { name: 'Tailwind CSS', level: 85 },
                { name: 'Git', level: 80 },
            ],
        },
        {
            id: 'soft',
            title: 'المهارات الشخصية',
            icon: '🧠',
            skills: [
                { name: 'القيادة', level: 85 },
                { name: 'التواصل', level: 90 },
                { name: 'حل المشكلات', level: 88 },
            ],
        },
    ],
    projects: [
        {
            id: '1',
            title: 'مشروع تجريبي',
            description: 'وصف قصير للمشروع يظهر هنا. يمكنك تعديله من لوحة التحكم.',
            image: '',
            link: '#',
        },
    ],
    contact: {
        email: '',
        whatsapp: '',
        whatsappGroup: '',
        facebook: '',
        instagram: '',
        youtube: '',
        snapchat: '',
        github: '',
        linkedin: '',
        twitter: '',
    },
    extraTitles: ['مطور ويب', 'مصمم واجهات'],
    adminPassword: 'admin123',
    receivedMessages: [],
};
