// ============================================================
// db.js — Client-side database using localStorage
// Simulates a real DB with tables: users, sessions, attendance, badges
// ============================================================

const DB = {

  // ── INIT ──────────────────────────────────────────────────
  init() {
    if (!localStorage.getItem('db_initialized')) {
      this._seed();
      localStorage.setItem('db_initialized', 'true');
    }
  },

  reset() {
    localStorage.removeItem('db_initialized');
    ['users','sessions','attendance','badges','notifications','classes'].forEach(t => localStorage.removeItem('db_' + t));
    this.init();
  },

  // ── LOW-LEVEL ─────────────────────────────────────────────
  _get(table) {
    try { return JSON.parse(localStorage.getItem('db_' + table)) || []; }
    catch { return []; }
  },

  _set(table, data) {
    localStorage.setItem('db_' + table, JSON.stringify(data));
  },

  _nextId(table) {
    const rows = this._get(table);
    return rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1;
  },

  // ── SEED DATA ─────────────────────────────────────────────
  _seed() {
    // CLASSES
    this._set('classes', [
      { id: 1, classId: 'CS101',   name: 'Algorithms',        subject: 'Computer Science', teacherId: 2, schedule: 'Mon/Wed 9:00am',  room: 'Lab A',   students: [4,5,7,9,11,12], createdAt: '2026-01-05' },
      { id: 2, classId: 'MATH201', name: 'Calculus',          subject: 'Mathematics',      teacherId: 2, schedule: 'Tue/Thu 11:00am', room: 'Room 201', students: [4,6,8,10,13],   createdAt: '2026-01-05' },
      { id: 3, classId: 'PHY301',  name: 'Physics',           subject: 'Science',          teacherId: 3, schedule: 'Mon/Fri 2:00pm',  room: 'Lab B',   students: [5,8,9,12,13],   createdAt: '2026-01-05' },
      { id: 4, classId: 'ENG101',  name: 'English Literature',subject: 'English',          teacherId: 3, schedule: 'Wed/Fri 10:00am', room: 'Room 105', students: [6,7,10,11],     createdAt: '2026-01-05' },
    ]);
    // USERS
    this._set('users', [
      // Admins
      { id: 1, name: 'Dr. Admin',       email: 'admin@school.edu',   password: 'admin123',   role: 'admin',   avatar: '🛡️', createdAt: '2026-01-01' },
      // Teachers
      { id: 2, name: 'Prof. Sarah Kim',  email: 'sarah@school.edu',   password: 'teacher123', role: 'teacher', avatar: '👩‍🏫', classes: ['CS101','MATH201'], createdAt: '2026-01-05' },
      { id: 3, name: 'Mr. David Osei',   email: 'david@school.edu',   password: 'teacher123', role: 'teacher', avatar: '👨‍🏫', classes: ['PHY301','ENG101'], createdAt: '2026-01-05' },
      // Students
      { id: 4,  name: 'Aisha Patel',     email: 'aisha@school.edu',   password: 'student123', role: 'student', avatar: '👩‍💻', points: 4850, streak: 21, classes: ['CS101','MATH201'], createdAt: '2026-01-10' },
      { id: 5,  name: 'Marcus Chen',     email: 'marcus@school.edu',  password: 'student123', role: 'student', avatar: '👨‍🎓', points: 4620, streak: 18, classes: ['CS101','PHY301'], createdAt: '2026-01-10' },
      { id: 6,  name: 'Sofia Rodriguez', email: 'sofia@school.edu',   password: 'student123', role: 'student', avatar: '👩‍🎓', points: 4390, streak: 15, classes: ['MATH201','ENG101'], createdAt: '2026-01-10' },
      { id: 7,  name: 'James Okafor',    email: 'james@school.edu',   password: 'student123', role: 'student', avatar: '👨‍💻', points: 4100, streak: 12, classes: ['CS101','ENG101'], createdAt: '2026-01-10' },
      { id: 8,  name: 'Priya Sharma',    email: 'priya@school.edu',   password: 'student123', role: 'student', avatar: '👩‍🔬', points: 3980, streak: 10, classes: ['PHY301','MATH201'], createdAt: '2026-01-10' },
      { id: 9,  name: 'Liam Thompson',   email: 'liam@school.edu',    password: 'student123', role: 'student', avatar: '👨‍🔬', points: 3750, streak: 8,  classes: ['CS101','PHY301'], createdAt: '2026-01-10' },
      { id: 10, name: 'Zara Ahmed',      email: 'zara@school.edu',    password: 'student123', role: 'student', avatar: '👩‍🏫', points: 3520, streak: 7,  classes: ['ENG101','MATH201'], createdAt: '2026-01-10' },
      { id: 11, name: 'Noah Williams',   email: 'noah@school.edu',    password: 'student123', role: 'student', avatar: '👨‍🏫', points: 3280, streak: 5,  classes: ['CS101','ENG101'], createdAt: '2026-01-10' },
      { id: 12, name: 'Emma Johnson',    email: 'emma@school.edu',    password: 'student123', role: 'student', avatar: '👩‍💼', points: 3050, streak: 4,  classes: ['PHY301','CS101'], createdAt: '2026-01-10' },
      { id: 13, name: 'Ethan Brown',     email: 'ethan@school.edu',   password: 'student123', role: 'student', avatar: '👨‍💼', points: 2890, streak: 3,  classes: ['MATH201','PHY301'], createdAt: '2026-01-10' },
    ]);

    // CLASS SESSIONS (codes teachers generate)
    this._set('sessions', [
      { id: 1, classId: 'CS101',   className: 'Algorithms',  teacherId: 2, code: 'CS101-XK9',   date: '2026-03-23', active: true,  quizQuestion: 'What is the time complexity of Binary Search?', quizOptions: ['O(n)','O(n²)','O(log n)','O(1)'], quizAnswer: 2 },
      { id: 2, classId: 'MATH201', className: 'Calculus',    teacherId: 2, code: 'MATH201-AB3',  date: '2026-03-23', active: true,  quizQuestion: 'What is the derivative of x²?', quizOptions: ['x','2x','x²','2'], quizAnswer: 1 },
      { id: 3, classId: 'PHY301',  className: 'Physics',     teacherId: 3, code: 'PHY301-ZZ7',   date: '2026-03-22', active: false, quizQuestion: "Newton's 2nd law: F = ?", quizOptions: ['ma','mv','mg','m/a'], quizAnswer: 0 },
      { id: 4, classId: 'ENG101',  className: 'English',     teacherId: 3, code: 'ENG101-QR2',   date: '2026-03-21', active: false, quizQuestion: 'A metaphor directly compares two things without using:', quizOptions: ['adjectives','like or as','verbs','nouns'], quizAnswer: 1 },
    ]);

    // ATTENDANCE RECORDS
    this._set('attendance', [
      { id: 1,  studentId: 4,  sessionId: 1, classId: 'CS101',   date: '2026-03-23', status: 'Present', points: 50, quizCorrect: true },
      { id: 2,  studentId: 5,  sessionId: 1, classId: 'CS101',   date: '2026-03-23', status: 'Present', points: 50, quizCorrect: true },
      { id: 3,  studentId: 7,  sessionId: 1, classId: 'CS101',   date: '2026-03-23', status: 'Late',    points: 25, quizCorrect: false },
      { id: 4,  studentId: 11, sessionId: 1, classId: 'CS101',   date: '2026-03-23', status: 'Absent',  points: 0,  quizCorrect: false },
      { id: 5,  studentId: 4,  sessionId: 2, classId: 'MATH201', date: '2026-03-23', status: 'Present', points: 50, quizCorrect: true },
      { id: 6,  studentId: 6,  sessionId: 2, classId: 'MATH201', date: '2026-03-23', status: 'Present', points: 50, quizCorrect: true },
      { id: 7,  studentId: 8,  sessionId: 2, classId: 'MATH201', date: '2026-03-22', status: 'Present', points: 50, quizCorrect: true },
      { id: 8,  studentId: 6,  sessionId: 4, classId: 'ENG101',  date: '2026-03-21', status: 'Late',    points: 25, quizCorrect: false },
      { id: 9,  studentId: 12, sessionId: 3, classId: 'PHY301',  date: '2026-03-22', status: 'Present', points: 50, quizCorrect: true },
      { id: 10, studentId: 13, sessionId: 2, classId: 'MATH201', date: '2026-03-22', status: 'Absent',  points: 0,  quizCorrect: false },
    ]);

    // BADGES
    this._set('badges', [
      { id: 1, studentId: 4, badge: '🏆', name: 'Champion',         earnedAt: '2026-03-01' },
      { id: 2, studentId: 4, badge: '⚡', name: 'Speed Star',        earnedAt: '2026-02-15' },
      { id: 3, studentId: 4, badge: '🔥', name: 'On Fire',           earnedAt: '2026-02-01' },
      { id: 4, studentId: 4, badge: '🎯', name: 'Bullseye',          earnedAt: '2026-01-20' },
      { id: 5, studentId: 4, badge: '💡', name: 'Bright Mind',       earnedAt: '2026-01-15' },
      { id: 6, studentId: 4, badge: '⭐', name: 'Rising Star',       earnedAt: '2026-01-10' },
      { id: 7, studentId: 5, badge: '⚡', name: 'Speed Star',        earnedAt: '2026-02-10' },
      { id: 8, studentId: 5, badge: '🔥', name: 'On Fire',           earnedAt: '2026-02-05' },
      { id: 9, studentId: 6, badge: '🎯', name: 'Bullseye',          earnedAt: '2026-02-20' },
    ]);

    // NOTIFICATIONS
    this._set('notifications', [
      { id: 1, userId: 4, message: 'You earned the Champion badge! 🏆', read: false, createdAt: '2026-03-01' },
      { id: 2, userId: 4, message: 'Your streak is now 21 days! 🔥',    read: false, createdAt: '2026-03-23' },
      { id: 3, userId: 11, message: 'Reminder: Your attendance in CS101 is below 75%.', read: false, createdAt: '2026-03-22' },
    ]);
  },

  // ── AUTH ──────────────────────────────────────────────────
  login(email, password) {
    const users = this._get('users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return null;
    const session = { userId: user.id, role: user.role, name: user.name, avatar: user.avatar, loginAt: Date.now() };
    localStorage.setItem('auth_session', JSON.stringify(session));
    return session;
  },

  logout() {
    localStorage.removeItem('auth_session');
  },

  currentUser() {
    try { return JSON.parse(localStorage.getItem('auth_session')); }
    catch { return null; }
  },

  getUserById(id) {
    return this._get('users').find(u => u.id === id) || null;
  },

  // ── USERS ─────────────────────────────────────────────────
  getStudents() {
    return this._get('users').filter(u => u.role === 'student');
  },

  getTeachers() {
    return this._get('users').filter(u => u.role === 'teacher');
  },

  updateUser(id, updates) {
    const users = this._get('users');
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    users[idx] = { ...users[idx], ...updates };
    this._set('users', users);
    return users[idx];
  },

  // ── SESSIONS (class codes) ────────────────────────────────
  getSessions() { return this._get('sessions'); },

  getSessionByCode(code) {
    return this._get('sessions').find(s => s.code === code.toUpperCase()) || null;
  },

  getSessionsByTeacher(teacherId) {
    return this._get('sessions').filter(s => s.teacherId === teacherId);
  },

  createSession(data) {
    const sessions = this._get('sessions');
    const newSession = { id: this._nextId('sessions'), ...data, createdAt: new Date().toISOString() };
    sessions.push(newSession);
    this._set('sessions', sessions);
    return newSession;
  },

  toggleSession(id, active) {
    const sessions = this._get('sessions');
    const idx = sessions.findIndex(s => s.id === id);
    if (idx === -1) return false;
    sessions[idx].active = active;
    this._set('sessions', sessions);
    return true;
  },

  // ── ATTENDANCE ────────────────────────────────────────────
  getAttendance() { return this._get('attendance'); },

  getAttendanceByStudent(studentId) {
    return this._get('attendance').filter(a => a.studentId === studentId);
  },

  getAttendanceByClass(classId) {
    const records = this._get('attendance').filter(a => a.classId === classId);
    const users = this._get('users');
    return records.map(r => ({
      ...r,
      studentName: users.find(u => u.id === r.studentId)?.name || 'Unknown',
      studentAvatar: users.find(u => u.id === r.studentId)?.avatar || '👤',
    }));
  },

  markAttendance(studentId, sessionId, classId, status, quizCorrect) {
    const records = this._get('attendance');
    // Prevent duplicate
    if (records.find(r => r.studentId === studentId && r.sessionId === sessionId)) {
      return { error: 'Already checked in for this session.' };
    }
    const pts = status === 'Present' ? 50 : status === 'Late' ? 25 : 0;
    const bonus = quizCorrect ? 10 : 0;
    const record = {
      id: this._nextId('attendance'),
      studentId, sessionId, classId,
      date: new Date().toISOString().split('T')[0],
      status, points: pts + bonus, quizCorrect,
    };
    records.push(record);
    this._set('attendance', records);
    // Update student points & streak
    const user = this.getUserById(studentId);
    if (user) {
      this.updateUser(studentId, {
        points: (user.points || 0) + pts + bonus,
        streak: (user.streak || 0) + 1,
      });
    }
    return record;
  },

  getAttendanceRate(studentId, classId) {
    const sessions = this._get('sessions').filter(s => !classId || s.classId === classId);
    if (!sessions.length) return 0;
    const records = this._get('attendance').filter(a =>
      a.studentId === studentId && (!classId || a.classId === classId) && a.status === 'Present'
    );
    return Math.round((records.length / sessions.length) * 100);
  },

  // ── BADGES ────────────────────────────────────────────────
  getBadgesByStudent(studentId) {
    return this._get('badges').filter(b => b.studentId === studentId);
  },

  awardBadge(studentId, badge, name) {
    const badges = this._get('badges');
    if (badges.find(b => b.studentId === studentId && b.name === name)) return null;
    const newBadge = { id: this._nextId('badges'), studentId, badge, name, earnedAt: new Date().toISOString().split('T')[0] };
    badges.push(newBadge);
    this._set('badges', badges);
    return newBadge;
  },

  // ── LEADERBOARD ───────────────────────────────────────────
  getLeaderboard(classId) {
    const students = this.getStudents();
    const badges = this._get('badges');
    return students
      .map(s => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        points: s.points || 0,
        streak: s.streak || 0,
        badges: badges.filter(b => b.studentId === s.id).map(b => b.badge),
      }))
      .sort((a, b) => b.points - a.points)
      .map((s, i) => ({ ...s, rank: i + 1 }));
  },

  // ── NOTIFICATIONS ─────────────────────────────────────────
  getNotifications(userId) {
    return this._get('notifications').filter(n => n.userId === userId);
  },

  addNotification(userId, message) {
    const notifs = this._get('notifications');
    notifs.push({ id: this._nextId('notifications'), userId, message, read: false, createdAt: new Date().toISOString() });
    this._set('notifications', notifs);
  },

  markNotificationsRead(userId) {
    const notifs = this._get('notifications').map(n => n.userId === userId ? { ...n, read: true } : n);
    this._set('notifications', notifs);
  },

  // ── CLASSES ───────────────────────────────────────────────
  getClasses() { return this._get('classes'); },

  getClassById(id) {
    return this._get('classes').find(c => c.id === id) || null;
  },

  getClassByClassId(classId) {
    return this._get('classes').find(c => c.classId === classId) || null;
  },

  getClassesByTeacher(teacherId) {
    return this._get('classes').filter(c => c.teacherId === teacherId);
  },

  createClass(data) {
    const classes = this._get('classes');
    // Prevent duplicate classId
    if (classes.find(c => c.classId === data.classId)) return { error: 'Class ID already exists.' };
    const newClass = {
      id: this._nextId('classes'),
      ...data,
      students: data.students || [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    classes.push(newClass);
    this._set('classes', classes);
    return newClass;
  },

  updateClass(id, updates) {
    const classes = this._get('classes');
    const idx = classes.findIndex(c => c.id === id);
    if (idx === -1) return false;
    classes[idx] = { ...classes[idx], ...updates };
    this._set('classes', classes);
    return classes[idx];
  },

  deleteClass(id) {
    const classes = this._get('classes').filter(c => c.id !== id);
    this._set('classes', classes);
  },

  assignTeacherToClass(classId, teacherId) {
    const classes = this._get('classes');
    const idx = classes.findIndex(c => c.classId === classId);
    if (idx === -1) return false;
    classes[idx].teacherId = teacherId;
    this._set('classes', classes);
    // Also update teacher's classes array
    const teacher = this.getUserById(teacherId);
    if (teacher) {
      const tc = teacher.classes || [];
      if (!tc.includes(classId)) {
        this.updateUser(teacherId, { classes: [...tc, classId] });
      }
    }
    return true;
  },

  // ── ANALYTICS ─────────────────────────────────────────────
  getClassStats(classId) {
    const records = this._get('attendance').filter(a => !classId || a.classId === classId);
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const late = records.filter(r => r.status === 'Late').length;
    return { total, present, absent, late, rate: total ? Math.round((present / total) * 100) : 0 };
  },
};

// Auto-init on load
DB.init();
