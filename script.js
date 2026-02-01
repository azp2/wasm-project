// Default configuration
const defaultConfig = {
  hero_title: 'نبرمج رؤيتك، نصمم واقعك الرقمي',
  hero_subtitle: 'حلول برمجية وتصاميم مخصصة تُبنى من الصفر، بلا قوالب جاهزة. جودة وكفاءة لا تُضاهى.',
  about_title: 'نحن وسم.. مهندسو الأثر الرقمي',
  contact_email: 'info@wasm.tech',
  background_color: '#050A1F',
  accent_color: '#2E00E6',
  secondary_color: '#00C7F4',
  text_color: '#FFFFFF',
  surface_color: '#0A1628'
};

// Initialize Element SDK
if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange: async (config) => {
      // Update hero title
      const heroTitle = document.getElementById('hero-title');
      if (heroTitle) {
        const titleParts = (config.hero_title || defaultConfig.hero_title).split('،');
        heroTitle.innerHTML = `
          <span class="bg-gradient-to-l from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent text-glow-turquoise">
            ${titleParts[0]}${titleParts.length > 1 ? '،' : ''}
          </span>
          <br>
          <span class="text-white">${titleParts[1] || ''}</span>
        `;
      }

      // Update hero subtitle
      const heroSubtitle = document.getElementById('hero-subtitle');
      if (heroSubtitle) {
        const subtitleText = config.hero_subtitle || defaultConfig.hero_subtitle;
        heroSubtitle.innerHTML = `
          ${subtitleText.split('.')[0]}.
          <br class="hidden md:block">
          <span class="text-cyan-400">${subtitleText.split('.')[1] || ''}</span>
        `;
      }

      // Update about title
      const aboutTitle = document.getElementById('about-title');
      if (aboutTitle) {
        const title = config.about_title || defaultConfig.about_title;
        aboutTitle.innerHTML = `
          نحن <span class="bg-gradient-to-l from-cyan-400 to-blue-500 bg-clip-text text-transparent">وسم</span>..
          <br>مهندسو الأثر الرقمي
        `;
      }

      // Update contact email
      const contactEmail = document.getElementById('contact-email');
      if (contactEmail) {
        contactEmail.textContent = config.contact_email || defaultConfig.contact_email;
      }

      // Update colors
      const bgColor = config.background_color || defaultConfig.background_color;
      const accentColor = config.accent_color || defaultConfig.accent_color;
      const secondaryColor = config.secondary_color || defaultConfig.secondary_color;
      const textColor = config.text_color || defaultConfig.text_color;
      const surfaceColor = config.surface_color || defaultConfig.surface_color;

      document.documentElement.style.setProperty('--bg-primary', bgColor);
      document.documentElement.style.setProperty('--accent-blue', accentColor);
      document.documentElement.style.setProperty('--accent-turquoise', secondaryColor);
      document.documentElement.style.setProperty('--text-white', textColor);
    },
    mapToCapabilities: (config) => ({
      recolorables: [
        {
          get: () => config.background_color || defaultConfig.background_color,
          set: (value) => window.elementSdk.setConfig({ background_color: value })
        },
        {
          get: () => config.surface_color || defaultConfig.surface_color,
          set: (value) => window.elementSdk.setConfig({ surface_color: value })
        },
        {
          get: () => config.text_color || defaultConfig.text_color,
          set: (value) => window.elementSdk.setConfig({ text_color: value })
        },
        {
          get: () => config.accent_color || defaultConfig.accent_color,
          set: (value) => window.elementSdk.setConfig({ accent_color: value })
        },
        {
          get: () => config.secondary_color || defaultConfig.secondary_color,
          set: (value) => window.elementSdk.setConfig({ secondary_color: value })
        }
      ],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined
    }),
    mapToEditPanelValues: (config) => new Map([
      ['hero_title', config.hero_title || defaultConfig.hero_title],
      ['hero_subtitle', config.hero_subtitle || defaultConfig.hero_subtitle],
      ['about_title', config.about_title || defaultConfig.about_title],
      ['contact_email', config.contact_email || defaultConfig.contact_email]
    ])
  });
}

// Form submission handler (UPDATED FOR FORMSPREE)
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = this;
  const submitBtn = document.getElementById('submit-btn');
  const successMessage = document.getElementById('success-message');
  
  // 1. إظهار حالة التحميل وحفظ النص الأصلي
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>جاري الإرسال...</span>
  `;

  // 2. إعداد البيانات للإرسال
  const formData = new FormData(form);

  try {
    // 🔴 هام: استبدل YOUR_FORM_ID بالرمز الخاص بك من Formspree
    const response = await fetch("https://formspree.io/f/xnjzvqrk", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    // 3. التحقق من نجاح الإرسال
    if (response.ok) {
      // إخفاء النموذج وإظهار رسالة النجاح
      form.style.display = 'none';
      successMessage.classList.remove('hidden');
      form.reset(); // تفريغ الخانات
    } else {
      // في حال وجود خطأ من السيرفر
      alert("عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  } catch (error) {
    // في حال وجود خطأ في الاتصال بالإنترنت
    alert("تأكد من اتصالك بالإنترنت وحاول مرة أخرى.");
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    nav.style.background = 'rgba(5, 10, 31, 0.98)';
    nav.style.boxShadow = '0 4px 30px rgba(0, 199, 244, 0.1)';
  } else {
    nav.style.background = 'rgba(5, 10, 31, 0.9)';
    nav.style.boxShadow = 'none';
  }
  
  lastScroll = currentScroll;
});