// ==========================================
// 1. Configuration & Theme Setup
// ==========================================

// إعدادات الوضع الداكن (الافتراضي)
const darkConfig = {
  background_color: '#050A1F',
  surface_color: '#0A1628',
  text_color: '#FFFFFF',
  accent_color: '#2E00E6',
  secondary_color: '#00C7F4'
};

// إعدادات الوضع الفاتح
const lightConfig = {
  background_color: '#F3F4F6', // رمادي فاتح جداً للخلفية
  surface_color: '#FFFFFF',    // أبيض للكروت
  text_color: '#111827',       // كحلي غامق للنصوص
  accent_color: '#2E00E6',
  secondary_color: '#0099BD'   // سيان أغمق قليلاً للتباين
};

// النصوص الثابتة
const textConfig = {
  hero_title: 'نبرمج رؤيتك، نصمم واقعك الرقمي',
  hero_subtitle: 'حلول برمجية وتصاميم مخصصة تُبنى من الصفر، بلا قوالب جاهزة. جودة وكفاءة لا تُضاهى.',
  about_title: 'نحن وسم.. مهندسو الأثر الرقمي',
  contact_email: 'info@wasm.tech'
};

// دمج الإعدادات
let currentConfig = { ...textConfig, ...darkConfig };

// متغير لتتبع حالة الثيم
let isDarkMode = true; 

// تعريف عناصر DOM الخاصة بالثيم
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const body = document.body;

// دالة تطبيق الثيم
function applyTheme(isDark) {
  isDarkMode = isDark;
  const colors = isDark ? darkConfig : lightConfig;
  
  // تحديث متغيرات CSS
  document.documentElement.style.setProperty('--bg-primary', colors.background_color);
  document.documentElement.style.setProperty('--surface-color', colors.surface_color);
  document.documentElement.style.setProperty('--text-white', colors.text_color);
  document.documentElement.style.setProperty('--accent-blue', colors.accent_color);
  document.documentElement.style.setProperty('--accent-turquoise', colors.secondary_color);

  // تحديث الكلاسات والأيقونات
  if (isDark) {
    body.classList.remove('light-mode');
    if(sunIcon && moonIcon) {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    }
  } else {
    body.classList.add('light-mode');
    if(sunIcon && moonIcon) {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }

  // تحديث SDK إذا وجد
  if (window.elementSdk) {
    window.elementSdk.setConfig(colors);
  }
}

// التحقق من الذاكرة عند التحميل
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  applyTheme(false);
} else {
  applyTheme(true);
}

// تفعيل زر التبديل
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const newStatus = !isDarkMode;
    applyTheme(newStatus);
    localStorage.setItem('theme', newStatus ? 'dark' : 'light');
  });
}

// ==========================================
// 2. Element SDK Initialization
// ==========================================
if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig: currentConfig,
    onConfigChange: async (config) => {
      // Update hero title
      const heroTitle = document.getElementById('hero-title');
      if (heroTitle) {
        const titleParts = (config.hero_title || textConfig.hero_title).split('،');
        heroTitle.innerHTML = `
          <span class="bg-gradient-to-l from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent text-glow-turquoise">
            ${titleParts[0]}${titleParts.length > 1 ? '،' : ''}
          </span>
          <br>
          <span class="${isDarkMode ? 'text-white' : 'text-gray-900'}">${titleParts[1] || ''}</span>
        `;
      }

      // Update hero subtitle
      const heroSubtitle = document.getElementById('hero-subtitle');
      if (heroSubtitle) {
        const subtitleText = config.hero_subtitle || textConfig.hero_subtitle;
        heroSubtitle.innerHTML = `
          ${subtitleText.split('.')[0]}.
          <br class="hidden md:block">
          <span class="text-cyan-400">${subtitleText.split('.')[1] || ''}</span>
        `;
      }

      // Update about title
      const aboutTitle = document.getElementById('about-title');
      if (aboutTitle) {
        const title = config.about_title || textConfig.about_title;
        aboutTitle.innerHTML = `
          نحن <span class="bg-gradient-to-l from-cyan-400 to-blue-500 bg-clip-text text-transparent">وسم</span>..
          <br>مهندسو الأثر الرقمي
        `;
      }

      // Update contact email
      const contactEmail = document.getElementById('contact-email');
      if (contactEmail) {
        contactEmail.textContent = config.contact_email || textConfig.contact_email;
      }
    },
    // (باقي إعدادات SDK للتحرير - اختيارية)
    mapToCapabilities: (config) => ({ recolorables: [], borderables: [] }),
    mapToEditPanelValues: (config) => new Map()
  });
}

// ==========================================
// 3. Form Submission Handler (SweetAlert2)
// ==========================================
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = this;
  const submitBtn = document.getElementById('submit-btn');
  const originalBtnText = submitBtn.innerHTML;
  
  // Loading State
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>جاري الإرسال...</span>
  `;

  const formData = new FormData(form);

  try {
    // 🔴 رابط الفورم الخاص بك
    const response = await fetch("https://formspree.io/f/xnjzvqrk", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // ✅ نجاح (يتغير لونه حسب الثيم)
      Swal.fire({
        title: 'تم الإرسال بنجاح!',
        text: 'شكراً لتواصلك معنا، سنرد عليك في أقرب وقت.',
        icon: 'success',
        background: isDarkMode ? '#0A1628' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#111827',
        confirmButtonText: 'تم',
        confirmButtonColor: '#00C7F4',
        backdrop: isDarkMode ? `rgba(5, 10, 31, 0.8)` : `rgba(0, 0, 0, 0.4)`
      });
      
      form.reset();
      
    } else {
      // ❌ خطأ
      Swal.fire({
        title: 'عذراً!',
        text: 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.',
        icon: 'error',
        background: isDarkMode ? '#0A1628' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#111827',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#2E00E6'
      });
    }
  } catch (error) {
    // ⚠️ شبكة
    Swal.fire({
      title: 'تنبيه',
      text: 'يرجى التأكد من اتصالك بالإنترنت.',
      icon: 'warning',
      background: isDarkMode ? '#0A1628' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#111827',
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#2E00E6'
    });
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
});

// ==========================================
// 4. Smooth Scroll & Navbar
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Navbar Scroll Effect (يتغير حسب الثيم)
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    // إذا نزلنا، الخلفية تصبح صلبة (حسب الثيم)
    nav.style.background = isDarkMode ? 'rgba(5, 10, 31, 0.98)' : 'rgba(255, 255, 255, 0.95)';
    nav.style.boxShadow = '0 4px 30px rgba(0, 199, 244, 0.1)';
  } else {
    // في الأعلى، الخلفية شفافة
    nav.style.background = isDarkMode ? 'rgba(5, 10, 31, 0.9)' : 'rgba(255, 255, 255, 0.8)';
    nav.style.boxShadow = 'none';
  }
});