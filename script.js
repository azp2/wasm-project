// ==========================================
// 1. Firebase Imports & Config
// ==========================================
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// 🔴 إعدادات فايربيس الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyAsmDMYh3h_x66URxC55YaMUTW6tXP8G2Q",
  authDomain: "wasm-portfolio.firebaseapp.com",
  projectId: "wasm-portfolio",
  storageBucket: "wasm-portfolio.firebasestorage.app",
  messagingSenderId: "26049970214",
  appId: "1:26049970214:web:05a9b80b186bdb64c526e7"
};

// تهيئة فايربيس
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 2. Theme & UI Logic
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const body = document.body;
let isDarkMode = true;

// التحقق من الذاكرة
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
// 3. جلب المشاريع (Portfolio)
// ==========================================
async function loadProjects() {
    const container = document.getElementById('portfolio-container');
    
    // مؤشر التحميل
    container.innerHTML = `
        <div style="grid-column: span 2; text-align: center; padding: 40px; color: gray;">
          <span class="animate-pulse">جاري تحميل المعرض...</span>
        </div>
    `;
    
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        
        container.innerHTML = ''; // تنظيف الحاوية

        let projects = [];
        querySnapshot.forEach((doc) => {
            projects.push(doc.data());
        });
        
        if (projects.length === 0) {
            container.innerHTML = '<p style="text-align: center; grid-column: span 2; padding: 20px; color: #6b7280;">لا توجد مشاريع مضافة حالياً.</p>';
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
                    <span class="text-cyan-400 text-sm font-medium">${project.category || 'مشروع'}</span>
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
        container.innerHTML = '<p class="text-center col-span-2 text-red-400">حدث خطأ في الاتصال بقاعدة البيانات.</p>';
    }
}
// استدعاء دالة التحميل عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadProjects);


// =======================================================
// 4. ✅ حفظ الإيميلات في قاعدة البيانات (Contact Form)
// =======================================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // منع تحديث الصفحة
        
        const submitBtn = document.getElementById('submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        
        // جلب البيانات من الحقول
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('project').value;

        // تغيير حالة الزر للتحميل
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            جاري الإرسال...
        `;

        try {
            // إضافة البيانات إلى مجموعة "messages" في فايربيس
            await addDoc(collection(db, "messages"), {
                name: name,
                email: email,
                message: message,
                createdAt: serverTimestamp(), // توقيت السيرفر لترتيب الرسائل
                status: 'new' // حالة مبدئية للرسالة
            });

            // ✅ رسالة نجاح
            Swal.fire({
                title: 'تم الإرسال بنجاح!',
                text: 'وصلتنا رسالتك وسنتواصل معك قريباً.',
                icon: 'success',
                background: isDarkMode ? '#0A1628' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#111827',
                confirmButtonColor: '#00C7F4',
                confirmButtonText: 'ممتاز'
            });
            
            // تفريغ الحقول
            contactForm.reset();
            
        } catch (error) {
            console.error("Error adding message: ", error);
            // ❌ رسالة خطأ
            Swal.fire({
                title: 'عذراً!',
                text: 'حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.',
                icon: 'error',
                background: isDarkMode ? '#0A1628' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#111827'
            });
        } finally {
            // إعادة الزر لحالته الطبيعية
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// ==========================================
// 5. Navbar Scroll Effect
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