// ==========================================
// 1. Firebase Imports & Config
// ==========================================
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsmDMYh3h_x66URxC55YaMUTW6tXP8G2Q",
  authDomain: "wasm-portfolio.firebaseapp.com",
  projectId: "wasm-portfolio",
  storageBucket: "wasm-portfolio.firebasestorage.app",
  messagingSenderId: "26049970214",
  appId: "1:26049970214:web:05a9b80b186bdb64c526e7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 2. Localization (Translations) 🌍
// ==========================================
const translations = {
    ar: {
        nav_slogan: "وسم.. كودٌ يُرى",
        nav_home: "الرئيسية",
        nav_about: "من نحن",
        nav_services: "خدماتنا",
        nav_portfolio: "أعمالنا",
        nav_contact: "تواصل معنا",
        btn_start: "ابدأ الآن",
        hero_line1: "نبرمج رؤيتك،",
        hero_line2: "نصمم واقعك الرقمي",
        hero_desc: "حلول برمجية وتصاميم مخصصة تُبنى من الصفر، بلا قوالب جاهزة.",
        hero_highlight: "جودة وكفاءة لا تُضاهى.",
        btn_hero_start: "ابدأ مشروعك الآن",
        btn_hero_about: "تعرف علينا",
        about_label: "من نحن",
        about_head_1: "نحن",
        about_head_2: "مهندسو الأثر الرقمي",
        about_desc_1: "لسنا مجرد فريق من المستقلين، بل نحن بيت رقمي متكامل مخصص لصناعة كود عالي الجودة وتجارب مستخدم فريدة تُبرز علامتك التجارية.",
        about_desc_2: "نؤمن بأن كل مشروع يستحق حلاً مخصصاً. لا نستخدم القوالب الجاهزة، بل نبني كل سطر برمجي من الصفر ليناسب احتياجاتك الفريدة.",
        stat_projects: "مشروع منجز",
        stat_clients: "عميل سعيد",
        stat_code: "كود أصلي",
        services_label: "خدماتنا",
        services_head_1: "ماذا",
        services_head_2: "نقدم؟",
        srv_ui_title: "تصميم تجربة المستخدم",
        srv_ui_desc: "واجهات احترافية تجمع بين الجمال والسهولة، مصممة لتعزيز تفاعل المستخدمين مع منتجك.",
        srv_popular: "الأكثر طلباً",
        srv_dev_title: "تطوير الويب والتطبيقات",
        srv_dev_desc: "أنظمة قوية، سريعة، وآمنة مبنية خصيصاً لك باستخدام أحدث التقنيات وأفضل الممارسات.",
        srv_ecom_title: "حلول التجارة الإلكترونية",
        srv_ecom_desc: "متاجر متكاملة مصممة لزيادة مبيعاتك مع تجربة شراء سلسة وآمنة لعملائك.",
        feat_label: "المميزات",
        feat_head_1: "لماذا",
        feat_head_2: "نحن؟",
        feat_desc: "نجمع بين الخبرة التقنية والإبداع لنقدم لك حلولاً استثنائية تتجاوز توقعاتك.",
        feat_1_title: "كود أصلي ونظيف",
        feat_1_desc: "نكتب كل سطر برمجي بعناية فائقة، مما يضمن أداءً عالياً.",
        feat_2_title: "تصميم فريد غير مكرر",
        feat_2_desc: "كل مشروع يحصل على هوية بصرية فريدة تعكس شخصية علامتك التجارية.",
        feat_3_title: "فريق متخصص",
        feat_3_desc: "خبراء في مختلف المجالات التقنية يعملون معاً لتحقيق نتائج استثنائية.",
        portfolio_label: "معرض الأعمال",
        portfolio_head_1: "بعض من",
        portfolio_head_2: "أعمالنا",
        contact_label: "تواصل معنا",
        contact_head_1: "لنبدأ",
        contact_head_2: "الرحلة",
        contact_desc: "أخبرنا عن مشروعك وسنتواصل معك خلال 24 ساعة.",
        form_name: "الاسم الكامل",
        form_email: "البريد الإلكتروني",
        form_message: "تفاصيل المشروع",
        btn_send: "إرسال الرسالة",
        contact_email_label: "البريد الإلكتروني",
        contact_phone_label: "الهاتف",
        quick_response: "استجابة سريعة",
        quick_response_desc: "نرد على جميع الاستفسارات خلال 24 ساعة عمل كحد أقصى.",
        footer_slogan: "وسم.. كودٌ يُرى",
        footer_rights: "© 2024 Wasm. جميع الحقوق محفوظة.",
        back_to_top: "العودة للأعلى",
        loading_projects: "جاري تحميل الأعمال...",
        name_placeholder: "محمد أحمد",
        email_placeholder: "example@email.com",
        message_placeholder: "أخبرنا عن فكرة مشروعك...",
        
        // Alerts
        alert_sending: "جاري الإرسال...",
        alert_success_title: "تم الإرسال بنجاح!",
        alert_success_text: "وصلتنا رسالتك وسنتواصل معك قريباً.",
        alert_error_title: "عذراً!",
        alert_error_text: "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.",
        alert_btn_ok: "ممتاز"
    },
    en: {
        nav_slogan: "Wasm.. Code that is seen",
        nav_home: "Home",
        nav_about: "About",
        nav_services: "Services",
        nav_portfolio: "Portfolio",
        nav_contact: "Contact",
        btn_start: "Start Now",
        hero_line1: "We Code Your Vision,",
        hero_line2: "Design Your Digital Reality",
        hero_desc: "Custom software solutions and designs built from scratch, no templates. Unmatched quality and efficiency.",
        hero_highlight: "Quality you can trust.",
        btn_hero_start: "Start Your Project",
        btn_hero_about: "Learn About Us",
        about_label: "About Us",
        about_head_1: "We Are",
        about_head_2: "Digital Impact Engineers",
        about_desc_1: "We are not just freelancers; we are a complete digital house dedicated to crafting high-quality code and unique user experiences that elevate your brand.",
        about_desc_2: "We believe every project deserves a custom solution. We don't use ready-made templates; we build every line of code from scratch to fit your unique needs.",
        stat_projects: "Projects Done",
        stat_clients: "Happy Clients",
        stat_code: "Original Code",
        services_label: "Our Services",
        services_head_1: "What We",
        services_head_2: "Offer?",
        srv_ui_title: "UI/UX Design",
        srv_ui_desc: "Professional interfaces combining beauty and usability, designed to enhance user interaction with your product.",
        srv_popular: "Most Popular",
        srv_dev_title: "Web & App Development",
        srv_dev_desc: "Robust, fast, and secure systems built specifically for you using the latest technologies and best practices.",
        srv_ecom_title: "E-commerce Solutions",
        srv_ecom_desc: "Integrated stores designed to increase your sales with a seamless and secure shopping experience for your customers.",
        feat_label: "Features",
        feat_head_1: "Why",
        feat_head_2: "Us?",
        feat_desc: "We combine technical expertise and creativity to deliver exceptional solutions that exceed your expectations.",
        feat_1_title: "Clean & Original Code",
        feat_1_desc: "We write every line of code with extreme care, ensuring high performance.",
        feat_2_title: "Unique Design",
        feat_2_desc: "Every project gets a unique visual identity that reflects your brand personality.",
        feat_3_title: "Specialized Team",
        feat_3_desc: "Experts in various technical fields working together to achieve exceptional results.",
        portfolio_label: "Portfolio",
        portfolio_head_1: "Some of",
        portfolio_head_2: "Our Work",
        contact_label: "Contact Us",
        contact_head_1: "Start The",
        contact_head_2: "Journey",
        contact_desc: "Tell us about your project and we will contact you within 24 hours.",
        form_name: "Full Name",
        form_email: "Email Address",
        form_message: "Project Details",
        btn_send: "Send Message",
        contact_email_label: "Email",
        contact_phone_label: "Phone",
        quick_response: "Quick Response",
        quick_response_desc: "We reply to all inquiries within 24 business hours max.",
        footer_slogan: "Wasm.. Code that is seen",
        footer_rights: "© 2024 Wasm. All rights reserved.",
        back_to_top: "Back to Top",
        loading_projects: "Loading Projects...",
        name_placeholder: "John Doe",
        email_placeholder: "example@email.com",
        message_placeholder: "Tell us about your project idea...",

        // Alerts
        alert_sending: "Sending...",
        alert_success_title: "Sent Successfully!",
        alert_success_text: "We received your message and will contact you soon.",
        alert_error_title: "Sorry!",
        alert_error_text: "An error occurred while sending, please try again later.",
        alert_btn_ok: "Great"
    }
};

let currentLang = localStorage.getItem('lang') || 'ar';

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Update Direction & Font
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Update Button Text
    const langBtn = document.getElementById('lang-toggle');
    if(langBtn) langBtn.innerText = lang === 'ar' ? 'EN' : 'عربي';

    // Update Text Content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // Update Placeholders
    document.querySelectorAll('[data-placeholder]').forEach(el => {
        const key = el.getAttribute('data-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

// Event Listener for Language Toggle
const langToggleBtn = document.getElementById('lang-toggle');
if(langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        updateLanguage(newLang);
    });
}

// Initial Load
updateLanguage(currentLang);


// ==========================================
// 3. Theme & UI Logic
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const body = document.body;
let isDarkMode = true;

if (localStorage.getItem('theme') === 'light') {
    isDarkMode = false;
    body.classList.add('light-mode');
    toggleIcons();
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
        toggleIcons();
    });
}

function toggleIcons() {
    if (isDarkMode) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

// ==========================================
// 4. Portfolio Logic (Dynamic)
// ==========================================
async function loadProjects() {
    const container = document.getElementById('portfolio-container');
    
    // Loading State with Translation Support
    const loadingText = translations[currentLang].loading_projects;
    container.innerHTML = `
        <div style="grid-column: span 2; text-align: center; padding: 40px; color: gray;">
          <span class="animate-pulse">${loadingText}</span>
        </div>
    `;
    
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        container.innerHTML = ''; 
        let projects = [];
        querySnapshot.forEach((doc) => { projects.push(doc.data()); });
        
        if (projects.length === 0) {
            container.innerHTML = '<p style="text-align: center; grid-column: span 2; padding: 20px; color: #6b7280;">No projects yet.</p>';
            return;
        }
        
        projects.forEach((project) => {
            const imageSrc = project.image || 'https://placehold.co/400x300/0A1628/00C7F4?text=Project';
            container.innerHTML += `
            <div class="portfolio-card card-glass rounded-2xl overflow-hidden group">
              <div class="portfolio-image-wrapper bg-gray-900 overflow-hidden">
                <img src="${imageSrc}" alt="${project.title}" class="transition-transform duration-500 group-hover:scale-110">
                <div class="portfolio-overlay absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-0 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <span class="text-cyan-400 text-sm font-medium">${project.category || 'Project'}</span>
                    <h4 class="text-xl font-bold text-white">${project.title}</h4>
                  </div>
                </div>
              </div>
              <div class="portfolio-content">
                <div>
                    <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                    <p class="text-gray-400 text-sm line-clamp-3">${project.description || ''}</p>
                </div>
                <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-700/30">
                    ${project.tech_stack ? project.tech_stack.map(tech => 
                        `<span class="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">${tech}</span>`
                    ).join('') : ''}
                </div>
              </div>
            </div>
            `;
        });

    } catch (error) {
        console.error("Error:", error);
    }
}
document.addEventListener('DOMContentLoaded', loadProjects);

// ==========================================
// 5. Contact Form Logic
// ==========================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('project').value;

        // use Translation for Button Loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = translations[currentLang].alert_sending;

        try {
            await addDoc(collection(db, "messages"), {
                name: name,
                email: email,
                message: message,
                createdAt: serverTimestamp(),
                status: 'new'
            });

            Swal.fire({
                title: translations[currentLang].alert_success_title,
                text: translations[currentLang].alert_success_text,
                icon: 'success',
                background: isDarkMode ? '#0A1628' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#111827',
                confirmButtonColor: '#00C7F4',
                confirmButtonText: translations[currentLang].alert_btn_ok
            });
            contactForm.reset();
            
        } catch (error) {
            Swal.fire({
                title: translations[currentLang].alert_error_title,
                text: translations[currentLang].alert_error_text,
                icon: 'error',
                background: isDarkMode ? '#0A1628' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#111827'
            });
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// ==========================================
// 6. Navbar Scroll
// ==========================================
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 100) {
    nav.style.background = isDarkMode ? 'rgba(5, 10, 31, 0.98)' : 'rgba(255, 255, 255, 0.95)';
    nav.style.boxShadow = '0 4px 30px rgba(0, 199, 244, 0.1)';
  } else {
    nav.style.background = isDarkMode ? 'rgba(5, 10, 31, 0.9)' : 'rgba(255, 255, 255, 0.8)';
    nav.style.boxShadow = 'none';
  }
});