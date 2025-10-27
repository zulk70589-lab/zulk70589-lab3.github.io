/* ====== Data Demo: Kursus Teknologi Digital & Inovasi ====== */
const demoCourse = {
  id: "TD101",
  title: "Teknologi Digital & Inovasi",
  sks: 2,
  lecturer: "Dr. Siti Rahma",
  description: "Kursus mengenalkan konsep teknologi digital, inovasi, dan dampaknya bagi masyarakat.",
  cpms: [
    { id: "CPMK1", text: "Menjelaskan konsep dasar teknologi digital dan komponennya." },
    { id: "CPMK2", text: "Mengidentifikasi contoh penerapan teknologi di berbagai bidang." },
    { id: "CPMK3", text: "Menganalisis dampak sosial ekonomi dari teknologi modern (AI, IoT)." }
  ],
  weeks: [
    {
      week: 1,
      title: "Pengenalan Teknologi Digital",
      objectives: [
        "Menjelaskan pengertian teknologi digital.",
        "Menyebutkan 3 komponen utama sistem digital (hardware, software, jaringan).",
        "Memberi contoh penerapan teknologi digital di kehidupan sehari-hari."
      ],
      indicators: ["IND1","IND2"],
      materials: [
        { type: "video", title: "Apa itu Teknologi Digital?", url: "https://www.youtube.com/embed/8toHNjY0k-o" },
        { type: "pdf", title: "Ringkasan: Teknologi Digital (PDF)", url: "pdfs/teknologi_intro.pdf" }
      ],
      quiz: {
        questions: [
          { q: "Apa contoh perangkat keras (hardware)?", choices: ["Laptop","Website","Algoritma"], a: 0 },
          { q: "Benar/Salah: 'Internet adalah bagian dari jaringan'?", choices: ["Benar","Salah"], a: 0 }
        ]
      }
    },
    {
      week: 2,
      title: "Inovasi & Transformasi Digital",
      objectives: [
        "Menjelaskan konsep inovasi teknologi.",
        "Memberi contoh transformasi digital pada industri (mis. e-commerce)."
      ],
      indicators: ["IND2"],
      materials: [
        { type: "video", title: "Transformasi Digital di Industri", url: "https://www.youtube.com/embed/3s7s5pGg7EY" },
        { type: "pdf", title: "Contoh Kasus Transformasi Digital", url: "pdfs/transformasi.pdf" }
      ],
      quiz: null
    },
    {
      week: 3,
      title: "Internet of Things (IoT) & Aplikasinya",
      objectives: [
        "Menjelaskan konsep IoT.",
        "Menganalisis contoh penggunaan IoT di smart home dan smart city."
      ],
      indicators: ["IND2","IND3"],
      materials: [
        { type: "video", title: "IoT untuk Pemula", url: "https://www.youtube.com/embed/0JPW0E8n0WQ" }
      ],
      quiz: null
    },
    {
      week: 4,
      title: "Kecerdasan Buatan (AI) & Etika",
      objectives: [
        "Menjelaskan contoh AI di kehidupan sehari-hari.",
        "Menganalisis dampak sosial dan isu etika penggunaan AI."
      ],
      indicators: ["IND3"],
      materials: [
        { type: "video", title: "Apa itu AI?", url: "https://www.youtube.com/embed/2ePf9rue1Ao" }
      ],
      quiz: null
    }
  ],
  assignments: [
    { id: "T1", title: "Analisis Kasus: Transformasi Digital", due: "2025-11-05", status: "open", score: null },
    { id: "T2", title: "Refleksi Dampak AI (Esai)", due: "2025-11-12", status: "open", score: null }
  ]
};

/* ====== localStorage wrapper ====== */
const storage = {
  get(key, def) { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

/* ====== App State ====== */
let user = storage.get('lms_user', { name: "Mahasiswa", email: "user@example.com" });
let submissions = storage.get('lms_submissions', {});
let quizResults = storage.get('lms_quiz', {});
let threads = storage.get('lms_threads', []);

/* ====== Init ====== */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('welcome').textContent = `Halo, ${user.name}`;
  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-email').textContent = user.email;

  setupNav();
  renderDashboard();
  renderAllCourses();
  renderAssignments();
  renderForum();
  renderGrades();

  document.getElementById('edit-profile').addEventListener('click', editProfile);
});

/* ====== NAV ====== */
function setupNav() {
  const links = document.querySelectorAll('.nav a');
  const pages = document.querySelectorAll('.page');
  const title = document.getElementById('page-title');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      pages.forEach(p => p.classList.remove('active'));
      const target = document.querySelector(link.getAttribute('href'));
      target.classList.add('active');
      title.textContent = link.textContent.replace(/[^a-zA-Z0-9 \u00C0-\u017F]/g, '').trim();
    });
  });

  document.getElementById('backToCourses').addEventListener('click', () => {
    document.querySelectorAll('.nav a')[1].click(); // Courses
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    alert('Demo: aksi logout tidak aktif.');
  });
}

/* ====== RENDER DASHBOARD ====== */
function renderDashboard() {
  const courseList = document.getElementById('course-list');
  courseList.innerHTML = '';
  document.getElementById('card-courses').textContent = 1;

  const openAssign = demoCourse.assignments.filter(a => a.status === 'open').length;
  document.getElementById('card-assignments').textContent = openAssign;

  // single course card
  const card = document.createElement('div');
  card.className = 'course-card';
  card.innerHTML = `
    <h3>${demoCourse.title}</h3>
    <p>${demoCourse.sks} SKS • Dosen: ${demoCourse.lecturer}</p>
    <div class="course-meta">
      <div style="min-width:150px;">
        <div style="font-size:.85rem;color:#666">Progress Kursus</div>
        <div class="progress-wrap"><div class="progress-bar" id="progress-${demoCourse.id}">0%</div></div>
      </div>
      <div style="margin-left:auto;">
        <button class="btn" id="open-course">Buka Kursus</button>
      </div>
    </div>
  `;
  courseList.appendChild(card);
  document.getElementById('open-course').addEventListener('click', () => openCourse(demoCourse.id));
  updateProgress();
}

/* ====== RENDER COURSES PAGE ====== */
function renderAllCourses() {
  const all = document.getElementById('all-courses');
  all.innerHTML = '';
  const c = document.createElement('div');
  c.className = 'course-card';
  c.innerHTML = `<h3>${demoCourse.title}</h3><p>${demoCourse.sks} SKS • ${demoCourse.lecturer}</p>
    <p>${demoCourse.weeks.length} Pertemuan</p>
    <p style="color:#666;margin:6px 0">${demoCourse.description}</p>
    <button class="btn" id="open-course-2">Lihat Kursus</button>`;
  all.appendChild(c);
  document.getElementById('open-course-2').addEventListener('click', () => {
    document.querySelectorAll('.nav a')[1].click();
    openCourse(demoCourse.id);
  });
}

/* ====== OPEN COURSE DETAIL ====== */
function openCourse(courseId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('course-detail').classList.add('active');
  document.getElementById('page-title').textContent = 'Kursus - ' + demoCourse.title;
  renderCourseDetail(demoCourse);
}

function renderCourseDetail(course) {
  const wrap = document.getElementById('course-content');
  wrap.innerHTML = `
    <div class="course-card">
      <h2>${course.title}</h2>
      <p><strong>Kode:</strong> ${course.id} • <strong>SKS:</strong> ${course.sks} • <strong>Dosen:</strong> ${course.lecturer}</p>
      <p style="color:#555;margin-top:6px">${course.description}</p>

      <h3>Tujuan Pembelajaran (CPMK)</h3>
      <ul id="cpmk-list"></ul>

      <h3>Indikator Pencapaian</h3>
      <ul id="indicator-list"></ul>

      <h3>Pertemuan & Materi</h3>
      <div id="weeks-list"></div>

      <h3>Tugas</h3>
      <div id="course-assignments"></div>
    </div>
  `;

  // CPMK
  const cpmkList = document.getElementById('cpmk-list');
  course.cpms.forEach(c => {
    const li = document.createElement('li'); li.textContent = `${c.id} — ${c.text}`; cpmkList.appendChild(li);
  });

  // indicators (aggregate)
  const indicators = new Set();
  course.weeks.forEach(w => (w.indicators || []).forEach(i => indicators.add(i)));
  const indList = document.getElementById('indicator-list');
  if (indicators.size === 0) indList.innerHTML = '<li>- (Belum ditentukan)</li>';
  else indicators.forEach(i => { const li = document.createElement('li'); li.textContent = i; indList.appendChild(li); });

  // weeks & materials
  const weeksWrap = document.getElementById('weeks-list');
  weeksWrap.innerHTML = '';
  course.weeks.forEach(w => {
    const el = document.createElement('div');
    el.className = 'material';
    // build objectives list
    const objHtml = (w.objectives && w.objectives.length) ? `<ul>${w.objectives.map(o => `<li>${o}</li>`).join('')}</ul>` : '<em>-</em>';
    // build materials html (videos + pdf)
    let matHtml = '';
    (w.materials || []).forEach(m => {
      if (m.type === 'video') {
        matHtml += `<div style="margin-bottom:10px;"><div style="font-weight:600;margin-bottom:6px">${m.title}</div>
                    <div class="video-wrap"><iframe src="${m.url}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div></div>`;
      } else if (m.type === 'pdf') {
        matHtml += `<div style="margin-bottom:8px;"><a href="${m.url}" target="_blank">${m.title}</a></div>`;
      }
    });

    // quiz button if exists
    const quizBtn = w.quiz ? `<button class="btn" data-week="${w.week}" data-action="open-quiz">Kerjakan Kuis</button>` : '';

    el.innerHTML = `<strong>Pertemuan ${w.week} — ${w.title}</strong>
      <p style="color:#555;margin-top:6px;">Tujuan Pembelajaran:</p>${objHtml}
      <div style="margin-top:8px;">${matHtml}</div>
      <div style="margin-top:8px;">${quizBtn}</div>`;

    weeksWrap.appendChild(el);
  });

  // assignments
  const assignWrap = document.getElementById('course-assignments');
  assignWrap.innerHTML = '';
  course.assignments.forEach(a => {
    const div = document.createElement('div');
    div.style.marginBottom = '10px';
    const submitted = submissions[a.id];
    div.innerHTML = `<div style="display:flex;align-items:center;gap:12px;background:#fff;padding:10px;border-radius:8px;">
      <div style="flex:1;">
        <strong>${a.title}</strong> • Deadline: ${a.due} • Status: <em>${submitted ? 'Terkumpul' : 'Belum'}</em>
      </div>
      <div>
        ${submitted ? `<button class="btn" data-id="${a.id}" data-action="view-sub">Lihat</button>` : `<input type="file" id="file-${a.id}" /><button class="btn" data-id="${a.id}" data-action="upload">Kirim</button>`}
      </div></div>`;
    assignWrap.appendChild(div);
  });

  // event handlers
  assignWrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (action === 'upload') {
        const input = document.getElementById('file-' + id);
        if (!input.files || input.files.length === 0) { alert('Pilih file untuk diunggah (simulasi).'); return; }
        submissions[id] = { fileName: input.files[0].name, date: new Date().toISOString() };
        storage.set('lms_submissions', submissions);
        alert('Berhasil mengunggah (simulasi): ' + input.files[0].name);
        renderCourseDetail(course); updateProgress(); renderAssignments(); renderGrades();
      } else if (action === 'view-sub') {
        alert('Terkumpul: ' + JSON.stringify(submissions[id]));
      }
    });
  });

  // quiz buttons
  document.querySelectorAll('[data-action="open-quiz"]').forEach(b => {
    b.addEventListener('click', (e) => {
      const wk = b.dataset.week;
      const w = course.weeks.find(x => x.week == wk);
      if (!w.quiz) { alert('Tidak ada kuis untuk pertemuan ini.'); return; }
      openQuiz(course.id, w.week, w.quiz);
    });
  });

  updateProgressBar(course.id);
}

/* ====== QUIZ (Sederhana, auto-grade) ====== */
function openQuiz(courseId, week, quiz) {
  let score = 0, total = quiz.questions.length;
  for (let i=0;i<quiz.questions.length;i++) {
    const q = quiz.questions[i];
    const ans = prompt(`Kuis Pertemuan ${week}:\n${q.q}\nPilihan: ${q.choices.join(' / ')}`);
    if (ans === null) return; // cancel
    const selectedIndex = q.choices.findIndex(c => c.toLowerCase() === ans.toLowerCase());
    if (selectedIndex === q.a) score++;
  }
  const percent = Math.round((score/total)*100);
  quizResults[`${courseId}_w${week}`] = { score, total, percent, date: new Date().toISOString() };
  storage.set('lms_quiz', quizResults);
  alert(`Anda mendapatkan ${score}/${total} (${percent}%)`);
  updateProgress(); updateProgressBar(courseId); renderGrades();
}

/* ====== ASSIGNMENTS PAGE ====== */
function renderAssignments() {
  const wrap = document.getElementById('assignment-list');
  wrap.innerHTML = '';
  demoCourse.assignments.forEach(a => {
    const div = document.createElement('div');
    const sub = submissions[a.id];
    div.innerHTML = `<div style="background:#fff;padding:12px;border-radius:8px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
      <div><strong>${a.title}</strong><div style="color:#666;font-size:.9rem">Deadline: ${a.due}</div></div>
      <div>
        ${sub ? `<span style="color:green;margin-right:8px;">Terkumpul</span><button class="btn-flat" data-id="${a.id}" data-action="view">Lihat</button>` : `<input type="file" id="assign-file-${a.id}" /><button class="btn" data-id="${a.id}" data-action="upload">Kirim</button>`}
      </div>
    </div>`;
    wrap.appendChild(div);
  });

  wrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action, id = btn.dataset.id;
      if (action === 'upload') {
        const input = document.getElementById('assign-file-' + id);
        if (!input.files || input.files.length === 0) { alert('Pilih file untuk diunggah (simulasi).'); return; }
        submissions[id] = { fileName: input.files[0].name, date: new Date().toISOString() };
        storage.set('lms_submissions', submissions);
        alert('Berhasil mengunggah (simulasi).');
        renderAssignments(); renderCourseDetail(demoCourse); updateProgress(); renderGrades();
      } else if (action === 'view') {
        alert(JSON.stringify(submissions[id]));
      }
    });
  });
}

/* ====== FORUM ====== */
function renderForum() {
  const threadsWrap = document.getElementById('threads');
  threadsWrap.innerHTML = '';
  threads.forEach((t, i) => {
    const d = document.createElement('div');
    d.style.background = '#f8fbff'; d.style.padding = '10px'; d.style.borderRadius = '8px'; d.style.marginBottom = '8px';
    d.innerHTML = `<strong>${t.title}</strong><div style="color:#555;margin-top:6px">${t.content}</div><div style="font-size:.85rem;color:#888;margin-top:6px">oleh ${t.author} • ${new Date(t.date).toLocaleString()}</div>`;
    threadsWrap.appendChild(d);
  });

  document.getElementById('post-thread').addEventListener('click', () => {
    const val = document.getElementById('thread-input').value.trim();
    if (!val) return alert('Tulis pesan dahulu.');
    threads.unshift({ title: val.split('\n')[0], content: val, author: user.name, date: new Date().toISOString() });
    storage.set('lms_threads', threads);
    document.getElementById('thread-input').value = '';
    renderForum();
  });
}

/* ====== GRADES ====== */
function renderGrades() {
  const wrap = document.getElementById('grades-area');
  wrap.innerHTML = '';
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>Item</th><th>Jenis</th><th>Hasil</th></tr></thead><tbody></tbody>`;
  const tbody = table.querySelector('tbody');

  // quizzes
  Object.keys(quizResults).forEach(k => {
    const r = quizResults[k];
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>Kuis ${k}</td><td>Kuis</td><td>${r.score}/${r.total} (${r.percent}%)</td>`;
    tbody.appendChild(tr);
  });

  // assignments
  demoCourse.assignments.forEach(a => {
    const sub = submissions[a.id];
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${a.title}</td><td>Tugas</td><td>${sub ? 'Terkumpul' : 'Belum'}</td>`;
    tbody.appendChild(tr);
  });

  wrap.appendChild(table);
}

/* ====== PROGRESS ====== */
function updateProgress() {
  const totalQuiz = demoCourse.weeks.reduce((acc,w)=> acc + (w.quiz ? 1 : 0), 0);
  const scoredQuiz = Object.keys(quizResults).filter(k => k.startsWith(demoCourse.id)).length;
  const quizPercent = totalQuiz === 0 ? 0 : Math.round((scoredQuiz/totalQuiz)*100);

  const totalAssign = demoCourse.assignments.length;
  const subAssign = demoCourse.assignments.filter(a => submissions[a.id]).length;
  const assignPercent = totalAssign === 0 ? 0 : Math.round((subAssign/totalAssign)*100);

  const global = Math.round((quizPercent + assignPercent)/2);
  document.getElementById('global-progress').textContent = global;
  storage.set('lms_progress', { quizPercent, assignPercent, global });
}

function updateProgressBar(courseId) {
  const bar = document.getElementById('progress-' + courseId);
  if (!bar) return;
  const p = storage.get('lms_progress', { global:0 }).global || 0;
  bar.style.width = p + '%';
  bar.textContent = p + '%';
}

/* ====== EDIT PROFILE (simple) ====== */
function editProfile() {
  const name = prompt('Nama:', user.name);
  if (!name) return;
  const email = prompt('Email:', user.email || '');
  user.name = name;
  user.email = email;
  storage.set('lms_user', user);
  document.getElementById('welcome').textContent = `Halo, ${user.name}`;
  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-email').textContent = user.email;
}

/* ====== INITIAL ====== */
updateProgress(); renderGrades(); updateProgressBar(demoCourse.id);
