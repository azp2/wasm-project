// ==========================================
// admin.js - لوحة التحكم الشاملة
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 🔴🔴🔴 ضع إعدادات فايربيس هنا 🔴🔴🔴
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

// تخزين مؤقت للبيانات لسهولة الوصول إليها
let globalMessages = [];

// ==========================================
// 1. Dashboard & Logic
// ==========================================
async function loadDashboardData() {
    try {
        // --- المشاريع ---
        const projectsSnap = await getDocs(collection(db, "projects"));
        let totalProjects = 0, inProgressCount = 0, completedCount = 0;
        let activeProjectsHTML = '', allProjectsHTML = '';

        projectsSnap.forEach(doc => {
            const p = doc.data();
            const pid = doc.id;
            const status = p.status || 'in-progress';
            
            totalProjects++;
            if(status === 'in-progress') inProgressCount++;
            else if(status === 'completed') completedCount++;

            const statusBadge = status === 'completed' 
                ? `<span onclick="toggleProjectStatus('${pid}', '${status}')" class="status-badge status-completed">مكتمل</span>`
                : `<span onclick="toggleProjectStatus('${pid}', '${status}')" class="status-badge status-in-progress">قيد العمل</span>`;

            allProjectsHTML += `
                <tr class="hover:bg-gray-800/30 transition border-b border-gray-800/50">
                    <td class="p-4"><img src="${p.image}" class="w-10 h-10 rounded-lg object-cover bg-gray-800"></td>
                    <td class="p-4 font-bold text-white">${p.title}</td>
                    <td class="p-4 text-gray-400 text-xs">${p.category}</td>
                    <td class="p-4">${statusBadge}</td>
                    <td class="p-4">
                        <button onclick="deleteProject('${pid}')" class="text-red-500 hover:bg-red-500/10 p-2 rounded transition"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    </td>
                </tr>
            `;

            if(status === 'in-progress') {
                activeProjectsHTML += `<tr class="border-b border-gray-800/30 last:border-0"><td class="p-4 font-medium text-white">${p.title}</td><td class="p-4 text-xs text-gray-400">${p.category}</td><td class="p-4"><span class="text-yellow-400 text-xs font-bold">● جاري العمل</span></td></tr>`;
            }
        });

        document.getElementById('stat-total-projects').innerText = totalProjects;
        document.getElementById('stat-progress-projects').innerText = inProgressCount;
        document.getElementById('stat-completed-projects').innerText = completedCount;
        document.getElementById('dashboard-active-projects').innerHTML = activeProjectsHTML || '<tr><td colspan="3" class="p-4 text-center text-gray-500">لا توجد مشاريع قيد العمل</td></tr>';
        document.getElementById('projects-table-body').innerHTML = allProjectsHTML || '<tr><td colspan="5" class="p-8 text-center text-gray-500">لا توجد مشاريع.</td></tr>';

        // --- الرسائل ---
        const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const messagesSnap = await getDocs(messagesQuery);
        
        globalMessages = []; // تحديث المصفوفة العالمية
        let newMessagesCount = 0;

        messagesSnap.forEach(doc => {
            const m = doc.data();
            m.id = doc.id;
            globalMessages.push(m);
            if(!m.status || m.status === 'new') newMessagesCount++;
        });

        document.getElementById('stat-new-messages').innerText = newMessagesCount;
        renderAllMessages(globalMessages);

    } catch (error) {
        console.error("Error:", error);
    }
}

// دالة رسم جدول الرسائل
function renderAllMessages(messages) {
    const tableBody = document.getElementById('all-messages-table');
    tableBody.innerHTML = '';

    if (messages.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-gray-500">لا توجد رسائل حتى الآن.</td></tr>`;
        return;
    }

    messages.forEach(msg => {
        const date = msg.createdAt ? msg.createdAt.toDate().toLocaleDateString('ar-EG') : '-';
        // الحالة: إذا لم تكن موجودة نعتبرها "جديدة"
        const isNew = !msg.status || msg.status === 'new';
        const statusBadge = isNew 
            ? `<span class="px-2 py-1 rounded text-xs bg-red-500/10 text-red-400 border border-red-500/20">جديدة</span>` 
            : `<span class="px-2 py-1 rounded text-xs bg-green-500/10 text-green-400 border border-green-500/20">تمت</span>`;

        tableBody.innerHTML += `
            <tr class="hover:bg-gray-800/30 transition border-b border-gray-800/50 ${isNew ? 'bg-blue-900/10' : ''}">
                <td class="p-4 align-top font-bold text-white">${msg.name}</td>
                <td class="p-4 align-top text-gray-400 text-sm truncate max-w-xs">${msg.message}</td>
                <td class="p-4 align-top">${statusBadge}</td>
                <td class="p-4 align-top text-xs text-gray-500">${date}</td>
                <td class="p-4 align-top flex gap-2">
                    <button onclick="viewMessage('${msg.id}')" class="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white p-2 rounded transition" title="عرض التفاصيل">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="toggleMessageStatus('${msg.id}', '${msg.status || 'new'}')" class="bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white p-2 rounded transition" title="${isNew ? 'تحديد كمقروء' : 'تحديد كجديد'}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </button>
                    <button onclick="deleteMessage('${msg.id}')" class="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-2 rounded transition" title="حذف">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </td>
            </tr>
        `;
    });
}

// دالة فتح النافذة المنبثقة (View Modal)
window.viewMessage = (id) => {
    const msg = globalMessages.find(m => m.id === id);
    if (!msg) return;

    document.getElementById('modal-name').innerText = msg.name;
    document.getElementById('modal-email').innerText = msg.email;
    document.getElementById('modal-date').innerText = msg.createdAt ? msg.createdAt.toDate().toLocaleString('ar-EG') : '-';
    document.getElementById('modal-message').innerText = msg.message;
    
    // زر الحالة داخل المودال
    const isNew = !msg.status || msg.status === 'new';
    document.getElementById('modal-actions').innerHTML = `
        <button onclick="toggleMessageStatus('${id}', '${msg.status || 'new'}'); closeMessageModal()" class="px-4 py-2 rounded-lg text-white font-bold transition ${isNew ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}">
            ${isNew ? '✓ تحديد كمكتمل' : '↺ إعادة كجديد'}
        </button>
    `;

    document.getElementById('message-modal').classList.remove('hidden');
};

// دالة تغيير حالة الرسالة
window.toggleMessageStatus = async (id, currentStatus) => {
    const newStatus = (!currentStatus || currentStatus === 'new') ? 'done' : 'new';
    try {
        await updateDoc(doc(db, "messages", id), { status: newStatus });
        const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, background: '#0A1628', color: '#fff' });
        Toast.fire({ icon: 'success', title: newStatus === 'done' ? 'تمت معالجة الطلب' : 'تمت الإعادة لقائمة الانتظار' });
        loadDashboardData();
    } catch (error) {
        console.error(error);
    }
};

window.toggleProjectStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'in-progress' ? 'completed' : 'in-progress';
    try {
        await updateDoc(doc(db, "projects", id), { status: newStatus });
        loadDashboardData();
    } catch (error) { Swal.fire('خطأ', error.message, 'error'); }
};

window.deleteProject = async (id) => {
    const result = await Swal.fire({ title: 'حذف المشروع؟', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', background: '#0A1628', color: '#fff' });
    if (result.isConfirmed) {
        await deleteDoc(doc(db, "projects", id));
        loadDashboardData();
    }
};

window.deleteMessage = async (id) => {
    const result = await Swal.fire({ title: 'حذف الرسالة؟', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', background: '#0A1628', color: '#fff' });
    if (result.isConfirmed) {
        await deleteDoc(doc(db, "messages", id));
        loadDashboardData();
    }
};

window.refreshDashboard = loadDashboardData;

// ==========================================
// 2. Add Project Setup (إعدادات إضافة المشروع)
// ==========================================

// قائمة التقنيات
const techList = [
    "HTML", "CSS", "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "PHP", "Dart", "Go", "Ruby", "Swift", "Kotlin",
    "React", "Next.js", "Vue.js", "Angular", "Svelte", "jQuery",
    "Node.js", "Express.js", "NestJS", "Django", "Flask", "Laravel", "Spring Boot", "ASP.NET",
    "Flutter", "React Native", "SwiftUI", "Jetpack Compose", "Ionic",
    "Firebase", "MongoDB", "PostgreSQL", "MySQL", "Supabase", "Redis",
    "Tailwind CSS", "Bootstrap", "Material UI", "Sass",
    "Docker", "Kubernetes", "AWS", "Git", "Figma", "Adobe XD"
];

// 1. رسم المربعات (Render Checkboxes)
const techContainer = document.getElementById('tech-container');

if (techContainer) {
    techContainer.innerHTML = techList.map(tech => `
        <label class="cursor-pointer select-none relative group">
            <input type="checkbox" value="${tech}" class="tech-checkbox peer absolute opacity-0 w-0 h-0">
            <div class="tech-badge px-3 py-2 rounded-md border border-gray-600 text-gray-400 text-sm text-center transition-all duration-200 
                hover:border-cyan-400 hover:text-cyan-300
                peer-checked:bg-cyan-500/20 peer-checked:border-cyan-400 peer-checked:text-cyan-400 peer-checked:font-bold peer-checked:shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                ${tech}
            </div>
        </label>
    `).join('');
}

// 2. معالجة اختيار الصورة (تحويل لـ Base64)
const convertToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

// 3. معالجة إرسال النموذج (Submit Form)
const projectForm = document.getElementById('add-project-form');

if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-project-btn');
        const originalBtnText = submitBtn.innerHTML;
        const fileInput = document.getElementById('p-image-file');

        // التحقق من الصورة
        if (!fileInput.files[0]) {
            return Swal.fire({ icon: 'warning', title: 'تنبيه', text: 'يرجى اختيار صورة للمشروع', background: '#0A1628', color: '#fff' });
        }

        // ✅ إصلاح: جمع التقنيات المختارة بشكل صحيح
        // نبحث عن كل checkbox تم تحديده (checked) ونأخذ قيمته
        const selectedTechs = Array.from(document.querySelectorAll('.tech-checkbox:checked')).map(cb => cb.value);

        // التحقق من اختيار تقنية واحدة على الأقل
        if (selectedTechs.length === 0) {
            return Swal.fire({ icon: 'warning', title: 'تنبيه', text: 'يرجى اختيار تقنية واحدة على الأقل', background: '#0A1628', color: '#fff' });
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ جاري الرفع...';

        try {
            // تحويل الصورة
            const imageBase64 = await convertToBase64(fileInput.files[0]);
            
            // قراءة الحالة
            const statusElement = document.getElementById('p-status');
            const status = statusElement ? statusElement.value : 'in-progress';

            // إرسال البيانات لفايربيس
            await addDoc(collection(db, "projects"), {
                title: document.getElementById('p-title').value,
                category: document.getElementById('p-category').value,
                description: document.getElementById('p-description').value,
                image: imageBase64,
                tech_stack: selectedTechs, // المصفوفة التي جمعناها
                status: status,
                createdAt: serverTimestamp()
            });

            // نجاح
            Swal.fire({ icon: 'success', title: 'تمت الإضافة بنجاح!', background: '#0A1628', color: '#fff', confirmButtonColor: '#00C7F4' });
            
            // إعادة تعيين النموذج
            projectForm.reset();
            document.getElementById('image-preview').classList.add('hidden');
            document.getElementById('upload-placeholder').classList.remove('hidden');
            
            // إعادة تعيين التقنيات (إلغاء التحديد)
            // بما أننا نعتمد على CSS peer-checked، يكفي إلغاء تحديد الـ input
            document.querySelectorAll('.tech-checkbox').forEach(cb => cb.checked = false);
            
            // تحديث الداشبورد
            loadDashboardData();

        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'خطأ', text: error.message, background: '#0A1628', color: '#fff' });
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}
document.addEventListener('DOMContentLoaded', loadDashboardData);