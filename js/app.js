// ============================================================
// app.js — Shared utilities, auth, and nav
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Load DB first (db.js must be included before app.js on pages that need it)
  if (typeof DB !== 'undefined') {
    DB.init();
    setupAuthNav();
  }

  // Active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target))
        navLinks.classList.remove('open');
    });
  }

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
      const target = bar.dataset.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = target; }, 100);
    });
  }, 200);

  if (typeof initPage === 'function') initPage();
});

// ── AUTH NAV ──────────────────────────────────────────────
function setupAuthNav() {
  const user = DB.currentUser();
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  // Remove old auth links if any
  navLinks.querySelectorAll('.auth-link').forEach(el => el.remove());

  if (user) {
    // Notification count
    const notifs = DB.getNotifications(user.userId).filter(n => !n.read);
    const notifBadge = notifs.length ? `<span style="background:var(--secondary);color:#fff;border-radius:50%;width:16px;height:16px;font-size:0.65rem;display:inline-flex;align-items:center;justify-content:center;margin-left:4px;">${notifs.length}</span>` : '';

    // User chip
    const chip = document.createElement('div');
    chip.className = 'auth-link';
    chip.style.cssText = 'display:flex;align-items:center;gap:0.5rem;padding:0.35rem 0.85rem;background:rgba(108,99,255,0.15);border-radius:50px;font-size:0.85rem;cursor:pointer;position:relative;';
    chip.innerHTML = `<span>${user.avatar}</span><span style="font-weight:600;">${user.name.split(' ')[0]}</span>${notifBadge}`;
    chip.title = 'Click to logout';
    chip.addEventListener('click', () => {
      if (confirm('Log out of AttendTrack?')) { DB.logout(); window.location.href = 'login.html'; }
    });
    navLinks.appendChild(chip);

    // Show admin link only for admins
    if (user.role === 'admin') {
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.textContent = '🛡️ Admin';
      adminLink.className = 'auth-link';
      navLinks.insertBefore(adminLink, chip);
    }
  } else {
    const loginLink = document.createElement('a');
    loginLink.href = 'login.html';
    loginLink.textContent = '🔑 Login';
    loginLink.className = 'auth-link btn btn-primary btn-sm';
    loginLink.style.cssText = 'padding:0.4rem 1rem;border-radius:50px;';
    navLinks.appendChild(loginLink);
  }
}

// ── AUTH GUARD ────────────────────────────────────────────
// Call this at the top of page scripts that require login
function requireAuth(allowedRoles) {
  if (typeof DB === 'undefined') return null;
  const user = DB.currentUser();
  if (!user) { window.location.href = 'login.html'; return null; }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    showToast('🚫', 'Access denied for your role.');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return null;
  }
  return user;
}

// ── TOAST ─────────────────────────────────────────────────
function showToast(icon, message, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="font-size:1.3rem">${icon}</span><span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── COUNTER ANIMATION ─────────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  if (!el) return;
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

// ── MOCK DATA (fallback for pages without DB) ─────────────
const mockStudents = [
  { rank: 1, name: 'Aisha Patel',     avatar: '👩‍💻', points: 4850, badges: ['🏆','⚡','🔥','🎯'], streak: 21 },
  { rank: 2, name: 'Marcus Chen',     avatar: '👨‍🎓', points: 4620, badges: ['⚡','🔥','🎯'],       streak: 18 },
  { rank: 3, name: 'Sofia Rodriguez', avatar: '👩‍🎓', points: 4390, badges: ['🔥','🎯','💡'],       streak: 15 },
  { rank: 4, name: 'James Okafor',    avatar: '👨‍💻', points: 4100, badges: ['🎯','💡'],            streak: 12 },
  { rank: 5, name: 'Priya Sharma',    avatar: '👩‍🔬', points: 3980, badges: ['💡','⭐'],            streak: 10 },
  { rank: 6, name: 'Liam Thompson',   avatar: '👨‍🔬', points: 3750, badges: ['⭐'],                 streak: 8  },
  { rank: 7, name: 'Zara Ahmed',      avatar: '👩‍🏫', points: 3520, badges: ['⭐'],                 streak: 7  },
  { rank: 8, name: 'Noah Williams',   avatar: '👨‍🏫', points: 3280, badges: [],                    streak: 5  },
  { rank: 9, name: 'Emma Johnson',    avatar: '👩‍💼', points: 3050, badges: [],                    streak: 4  },
  { rank: 10,name: 'Ethan Brown',     avatar: '👨‍💼', points: 2890, badges: [],                    streak: 3  },
];

const mockAttendance = [
  { class: 'CS101',   student: 'Aisha Patel',     date: '2026-03-23', status: 'Present', points: 50 },
  { class: 'MATH201', student: 'Marcus Chen',     date: '2026-03-23', status: 'Present', points: 50 },
  { class: 'PHY301',  student: 'Sofia Rodriguez', date: '2026-03-22', status: 'Absent',  points: 0  },
  { class: 'CS101',   student: 'James Okafor',    date: '2026-03-22', status: 'Present', points: 50 },
  { class: 'ENG101',  student: 'Priya Sharma',    date: '2026-03-21', status: 'Late',    points: 25 },
  { class: 'MATH201', student: 'Liam Thompson',   date: '2026-03-21', status: 'Present', points: 50 },
  { class: 'PHY301',  student: 'Zara Ahmed',      date: '2026-03-20', status: 'Present', points: 50 },
  { class: 'CS101',   student: 'Noah Williams',   date: '2026-03-20', status: 'Absent',  points: 0  },
];
