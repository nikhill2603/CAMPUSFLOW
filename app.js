// ─── STATE ──────────────────────────────────────────────────
let state = {
  currentUser: null,
  requests: [],
  hods: [],
  editingHodId: null,
  pendingFiles: [], // Files attached during new request form
  selectedLoginType: 'student',
  selectedEmpRole: null,
  calMonth: new Date().getMonth(),
  calYear: new Date().getFullYear(),
  hodFilter: 'All',
  hodSectionFilter: 'All Sections',
};

// ─── SEED DATA ──────────────────────────────────────────────
// ─── MASTER SECTION LIST ─────────────────────────────────────
// Single source of truth. Edit here to update every dropdown + filter.
const SECTIONS = [
  'CE-1', 'CE-2',
  'ME-1', 'ME-2',
  'AIML-12', 'AIML-13', 'AIML-14', 'AIML-15', 'AIML-16', 'AIML-17',
  'AIML-18', 'AIML-19', 'AIML-20', 'AIML-21', 'AIML-22',
];

/** Populate a <select> from the master SECTIONS list.
 *  @param {string} id        - element id
 *  @param {boolean} blank    - include a blank "Select section…" placeholder
 *  @param {boolean} allOpt  - include an "All Sections" option (for filter dropdowns)
 */
function populateSectionSelect(id, blank = true, allOpt = false) {
  const el = document.getElementById(id);
  if (!el) return;
  let opts = '';
  if (allOpt) opts += '<option value="">All Sections</option>';
  else if (blank) opts += '<option value="">Select section…</option>';
  opts += SECTIONS.map(s => `<option value="${s}">${s}</option>`).join('');
  el.innerHTML = opts;
}

// ─── SEED DATA ──────────────────────────────────────────────
const seedRequests = [
  { id: 'r1',  studentName: 'Arjun Mehta',       rollNumber: '21CS001',  eventName: 'National Hackathon 2025',         eventType: 'Hackathon',    startDate: '2025-06-12', endDate: '2025-06-14', description: 'Participating in national level hackathon organized by IIIT Hyderabad. Will be working on AI/ML problem statement.',                             section: 'AIML-14', status: 'approved', isViewed: true,  period: 'Full Day — All Periods',       venue: 'IIIT Hyderabad',            createdAt: new Date(Date.now() - 86400000*9).toISOString(),  files: [{ name: 'invitation_letter.pdf', size: 245000, type: 'application/pdf', dataUrl: null }], remark: 'Approved. Best of luck at the hackathon!' },
  { id: 'r2',  studentName: 'Priya Sharma',       rollNumber: '21IT018',  eventName: 'IEEE Tech Symposium',             eventType: 'Seminar',      startDate: '2025-06-20', endDate: '2025-06-20', description: 'Presenting research paper on ML applications in healthcare. Paper accepted by IEEE conference.',                                              section: 'AIML-16', status: 'pending',  isViewed: true,  period: 'P3 — 9:50 AM – 10:40 AM',     venue: 'NMIMS Mumbai',              createdAt: new Date(Date.now() - 86400000*8).toISOString(),  files: [{ name: 'paper_acceptance.pdf', size: 120000, type: 'application/pdf', dataUrl: null }, { name: 'abstract.docx', size: 68000, type: 'application/docx', dataUrl: null }], remark: '' },
  { id: 'r3',  studentName: 'Rohit Kumar',         rollNumber: '21ECE042', eventName: 'Inter-College Football Tournament', eventType: 'Sports Meet',  startDate: '2025-06-18', endDate: '2025-06-19', description: 'Inter-college football tournament representing the college. Selected as striker for the college team.',                                       section: 'CE-1',    status: 'pending',  isViewed: false, period: 'Full Day — All Periods',       venue: 'Sports Ground, Sector-8',   createdAt: new Date(Date.now() - 86400000*7).toISOString(),  files: [], remark: '' },
  { id: 'r4',  studentName: 'Sneha Patel',         rollNumber: '21CS027',  eventName: 'Annual Cultural Night',           eventType: 'Cultural Fest', startDate: '2025-06-25', endDate: '2025-06-25', description: 'Dance performance at annual cultural fest. Selected through college auditions for Bharatanatyam category.',                                   section: 'AIML-13', status: 'rejected', isViewed: true,  period: 'P6 — 1:10 PM – 2:00 PM',     venue: 'Main Auditorium',           createdAt: new Date(Date.now() - 86400000*6).toISOString(),  files: [], remark: 'Please resubmit with faculty coordinator signature.' },
  { id: 'r5',  studentName: 'Vikram Singh',         rollNumber: '21ME009',  eventName: 'Field Visit – ISRO',              eventType: 'Field Trip',   startDate: '2025-07-01', endDate: '2025-07-02', description: 'Educational field trip to ISRO facility arranged by department head for hands-on exposure to aerospace engineering.',                         section: 'ME-1',    status: 'approved', isViewed: true,  period: 'Full Day — All Periods',       venue: 'ISRO, Bangalore',           createdAt: new Date(Date.now() - 86400000*5).toISOString(),  files: [{ name: 'isro_permit.jpg', size: 380000, type: 'image/jpeg', dataUrl: null }], remark: 'Approved. Mandatory attendance noted.' },
  { id: 'r6',  studentName: 'Ananya Reddy',         rollNumber: '22AIML031',eventName: 'Smart India Hackathon – Internal', eventType: 'Hackathon',    startDate: '2025-07-05', endDate: '2025-07-05', description: 'College-level internal round of Smart India Hackathon. Team of 6 students presenting an IoT-based smart farming solution.',                   section: 'AIML-12', status: 'pending',  isViewed: false, period: 'P1 — 8:10 AM – 9:00 AM',     venue: 'Innovation Lab, Block-C',   createdAt: new Date(Date.now() - 86400000*5).toISOString(),  files: [{ name: 'team_registration.pdf', size: 195000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r7',  studentName: 'Karthik Nair',          rollNumber: '22ME022',  eventName: 'National Robotics Championship',   eventType: 'Competition',  startDate: '2025-07-08', endDate: '2025-07-10', description: 'Competing at national level robotics championship in the autonomous navigation category. Bot designed and built in campus lab.',                section: 'ME-2',    status: 'pending',  isViewed: false, period: 'Full Day — All Periods',       venue: 'IIT Bombay, Powai',         createdAt: new Date(Date.now() - 86400000*4).toISOString(),  files: [{ name: 'registration_confirmation.pdf', size: 210000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r8',  studentName: 'Divya Krishnamurthy',  rollNumber: '22CS055',  eventName: 'TED Talk – Youth Edition',         eventType: 'Seminar',      startDate: '2025-07-12', endDate: '2025-07-12', description: 'Selected as a speaker for TED Talk Youth Edition to present on "AI Ethics in Modern Society". 15-minute slot confirmed.',                      section: 'AIML-15', status: 'approved', isViewed: true,  period: 'P4 — 10:40 AM – 11:30 AM',   venue: 'City Convention Centre',    createdAt: new Date(Date.now() - 86400000*4).toISOString(),  files: [], remark: 'Approved. Please share the recording afterwards.' },
  { id: 'r9',  studentName: 'Siddharth Rao',        rollNumber: '22CE008',  eventName: 'NSS Camp – Rural Outreach',        eventType: 'Community Service', startDate: '2025-07-15', endDate: '2025-07-17', description: 'NSS 3-day rural outreach camp. Activities include health check-up camps, tree plantation and digital literacy workshops.',              section: 'CE-2',    status: 'pending',  isViewed: false, period: 'Full Day — All Periods',       venue: 'Rampur Village, Dist. Nalgonda', createdAt: new Date(Date.now() - 86400000*3).toISOString(), files: [{ name: 'nss_camp_schedule.pdf', size: 155000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r10', studentName: 'Meera Joshi',           rollNumber: '22AIML066',eventName: 'Data Science Conclave 2025',        eventType: 'Conference',   startDate: '2025-07-18', endDate: '2025-07-19', description: 'Attending 2-day data science conclave as delegate. Will represent college in panel discussion on generative AI.',                            section: 'AIML-17', status: 'pending',  isViewed: true,  period: 'Full Day — All Periods',       venue: 'Hyderabad International Convention Centre', createdAt: new Date(Date.now() - 86400000*3).toISOString(), files: [{ name: 'delegate_pass.jpg', size: 270000, type: 'image/jpeg', dataUrl: null }], remark: '' },
  { id: 'r11', studentName: 'Nikhil Verma',          rollNumber: '22ME039',  eventName: 'CAD Design Workshop',              eventType: 'Workshop',     startDate: '2025-07-20', endDate: '2025-07-20', description: 'Full-day workshop on advanced CAD modelling using SolidWorks. Certification provided upon completion.',                                       section: 'ME-1',    status: 'approved', isViewed: true,  period: 'Full Day — All Periods',       venue: 'Tech Park, HITEC City',     createdAt: new Date(Date.now() - 86400000*2).toISOString(),  files: [], remark: 'Approved. Bring college ID for entry.' },
  { id: 'r12', studentName: 'Tanvi Kulkarni',        rollNumber: '22AIML078',eventName: 'Google Developer Fest 2025',        eventType: 'Tech Fest',    startDate: '2025-07-22', endDate: '2025-07-22', description: 'Attending Google Developer Festival as a registered delegate. Session on Flutter, Firebase and Android development.',                       section: 'AIML-18', status: 'pending',  isViewed: false, period: 'Full Day — All Periods',       venue: 'Google Office, Hyderabad',  createdAt: new Date(Date.now() - 86400000*2).toISOString(),  files: [{ name: 'gdg_registration.pdf', size: 180000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r13', studentName: 'Aditya Bose',           rollNumber: '22CS014',  eventName: 'State Level Quiz Championship',    eventType: 'Competition',  startDate: '2025-07-24', endDate: '2025-07-24', description: 'Representing college at state-level general knowledge and science quiz hosted by Osmania University.',                                        section: 'AIML-19', status: 'rejected', isViewed: true,  period: 'P5 — 11:30 AM – 12:20 PM',   venue: 'Osmania University',        createdAt: new Date(Date.now() - 86400000*2).toISOString(),  files: [], remark: 'Clash with internal exam on same date. Resubmit after reschedule.' },
  { id: 'r14', studentName: 'Lakshmi Prasad',        rollNumber: '22CE019',  eventName: 'Bridge Design Workshop',           eventType: 'Workshop',     startDate: '2025-07-26', endDate: '2025-07-27', description: 'Two-day civil engineering workshop on bridge load analysis and design using STAAD.Pro software.',                                            section: 'CE-1',    status: 'pending',  isViewed: false, period: 'Full Day — All Periods',       venue: 'NIT Warangal',              createdAt: new Date(Date.now() - 86400000).toISOString(),    files: [{ name: 'workshop_brochure.pdf', size: 320000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r15', studentName: 'Ravi Teja Goud',        rollNumber: '22AIML092',eventName: 'Cybersecurity CTF – HackTheBox',   eventType: 'Competition',  startDate: '2025-07-28', endDate: '2025-07-28', description: 'Participating in Capture the Flag competition in cybersecurity domain. Online-proctored event with offline coordination hub at campus.',    section: 'AIML-20', status: 'pending',  isViewed: false, period: 'P2 — 9:00 AM – 9:50 AM',     venue: 'Computer Lab-3, Block-A',   createdAt: new Date(Date.now() - 86400000).toISOString(),    files: [], remark: '' },
  { id: 'r16', studentName: 'Harini Subramaniam',    rollNumber: '22ME047',  eventName: 'IIT Madras – Shaastra Techfest',   eventType: 'Tech Fest',    startDate: '2025-07-30', endDate: '2025-08-01', description: 'Attending Shaastra techfest at IIT Madras. Participating in paper presentation and product innovation events.',                              section: 'ME-2',    status: 'pending',  isViewed: true,  period: 'Full Day — All Periods',       venue: 'IIT Madras, Chennai',       createdAt: new Date(Date.now() - 86400000).toISOString(),    files: [{ name: 'event_registration.pdf', size: 195000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r17', studentName: 'Yashwanth Reddy',       rollNumber: '22AIML103',eventName: 'AWS Cloud Practitioner Bootcamp',  eventType: 'Workshop',     startDate: '2025-08-02', endDate: '2025-08-03', description: '2-day intensive bootcamp for AWS Cloud Practitioner certification. Partially sponsored by college placement cell.',                         section: 'AIML-21', status: 'approved', isViewed: true,  period: 'Full Day — All Periods',       venue: 'AWS Training Center, Gachibowli', createdAt: new Date(Date.now() - 3600000*12).toISOString(), files: [{ name: 'aws_confirmation.pdf', size: 145000, type: 'application/pdf', dataUrl: null }], remark: 'Approved. Coordinate with placement cell for reimbursement.' },
  { id: 'r18', studentName: 'Pooja Iyer',            rollNumber: '22CE033',  eventName: 'Environmental Awareness March',    eventType: 'Community Service', startDate: '2025-08-05', endDate: '2025-08-05', description: 'Participating in city-wide environmental awareness rally organized by Green Earth NGO. College team of 20 students.',               section: 'CE-2',    status: 'pending',  isViewed: false, period: 'P1 — 8:10 AM – 9:00 AM',     venue: 'Tank Bund, Hyderabad',      createdAt: new Date(Date.now() - 3600000*10).toISOString(), files: [], remark: '' },
  { id: 'r19', studentName: 'Akash Gupta',           rollNumber: '22AIML115',eventName: 'Microsoft Imagine Cup – Regional', eventType: 'Competition',  startDate: '2025-08-07', endDate: '2025-08-08', description: 'Team of 4 students competing in Microsoft Imagine Cup regional finals. Solution: AI-powered crop disease detection app for farmers.',       section: 'AIML-22', status: 'pending',  isViewed: false, period: 'Full Day — All Periods',       venue: 'Microsoft Office, Cyber Tower', createdAt: new Date(Date.now() - 3600000*8).toISOString(),  files: [{ name: 'imagine_cup_invite.pdf', size: 275000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r20', studentName: 'Swathi Narayanan',      rollNumber: '22AIML048',eventName: 'Internship Reporting – Day 1',     eventType: 'Internship',   startDate: '2025-08-10', endDate: '2025-08-10', description: 'First day of approved summer internship at Infosys Hyderabad. Joining formalities and orientation.',                                         section: 'AIML-13', status: 'approved', isViewed: true,  period: 'Full Day — All Periods',       venue: 'Infosys SEZ, Pocharam',     createdAt: new Date(Date.now() - 3600000*6).toISOString(),  files: [{ name: 'offer_letter.pdf', size: 310000, type: 'application/pdf', dataUrl: null }], remark: 'Approved. Update attendance register on return.' },
  { id: 'r21', studentName: 'Bharath Chandrasekhar', rollNumber: '22ME058',  eventName: 'SAE BAJA India – Design Event',   eventType: 'Competition',  startDate: '2025-08-12', endDate: '2025-08-14', description: 'SAE BAJA all-terrain vehicle design event. College team has cleared online qualifying round and advanced to physical design evaluation.',      section: 'ME-1',    status: 'pending',  isViewed: false, period: 'Full Day — All Periods',       venue: 'NATRAX Track, Pithampur, MP', createdAt: new Date(Date.now() - 3600000*5).toISOString(),  files: [{ name: 'baja_qualifier_result.pdf', size: 185000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r22', studentName: 'Sravya Konduri',        rollNumber: '22AIML127',eventName: 'Python for Data Science – NPTEL',  eventType: 'Workshop',     startDate: '2025-08-15', endDate: '2025-08-15', description: 'Offline exam for NPTEL Python for Data Science certification. Centre allotted by IIT Madras.',                                               section: 'AIML-14', status: 'pending',  isViewed: true,  period: 'P4 — 10:40 AM – 11:30 AM',   venue: 'JNTU-H, Kukatpally',        createdAt: new Date(Date.now() - 3600000*4).toISOString(),  files: [{ name: 'nptel_admit_card.jpg', size: 220000, type: 'image/jpeg', dataUrl: null }], remark: '' },
  { id: 'r23', studentName: 'Vishal Menon',          rollNumber: '22CE061',  eventName: 'Concrete Mix Design Seminar',      eventType: 'Seminar',      startDate: '2025-08-17', endDate: '2025-08-17', description: 'Industry seminar on high-performance concrete mix design and modern construction materials conducted by L&T.',                                section: 'CE-1',    status: 'rejected', isViewed: true,  period: 'P6 — 1:10 PM – 2:00 PM',     venue: 'L&T Head Office, Madhapur', createdAt: new Date(Date.now() - 3600000*3).toISOString(),  files: [], remark: 'Attendance record shows shortage. Please clear shortage before applying.' },
  { id: 'r24', studentName: 'Nithyasri Pillai',      rollNumber: '22AIML139',eventName: 'AI Expo 2025 – Startup Showcase',  eventType: 'Exhibition',   startDate: '2025-08-19', endDate: '2025-08-20', description: 'Showcasing college startup idea at AI Expo. Selected out of 400+ applicants for the student innovation showcase at Hitex.',                   section: 'AIML-15', status: 'pending',  isViewed: false, period: 'Full Day — All Periods',       venue: 'Hitex Exhibition Centre',   createdAt: new Date(Date.now() - 3600000*2).toISOString(),  files: [{ name: 'expo_confirmation.pdf', size: 165000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r25', studentName: 'Charan Tej',            rollNumber: '22ME074',  eventName: 'Welding & Fabrication Training',   eventType: 'Workshop',     startDate: '2025-08-21', endDate: '2025-08-22', description: '2-day certified training programme in MIG & TIG welding at MSME Technology Centre. Certification valid for placements.',                     section: 'ME-2',    status: 'pending',  isViewed: false, period: 'Full Day — All Periods',       venue: 'MSME Technology Centre, Balanagar', createdAt: new Date(Date.now() - 3600000*2).toISOString(), files: [{ name: 'msme_enrollment.pdf', size: 140000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r26', studentName: 'Srujana Yadav',         rollNumber: '22AIML150',eventName: 'National NCC Camp',                eventType: 'Community Service', startDate: '2025-08-25', endDate: '2025-08-30', description: 'Selected for National NCC Camp at Delhi Cantonment. 6-day camp with parade, adventure activities and national integration sessions.', section: 'AIML-16', status: 'approved', isViewed: true,  period: 'Full Day — All Periods',       venue: 'Delhi Cantonment',          createdAt: new Date(Date.now() - 3600000).toISOString(),    files: [{ name: 'ncc_selection_letter.pdf', size: 260000, type: 'application/pdf', dataUrl: null }], remark: 'Approved. Duty leave granted. Report to ANO before departure.' },
  { id: 'r27', studentName: 'Manoj Eshwar',          rollNumber: '22CE082',  eventName: 'AutoCAD Certification Exam',       eventType: 'Exam',         startDate: '2025-08-28', endDate: '2025-08-28', description: 'Autodesk AutoCAD professional certification exam. Exam centre allocated at Autodesk authorized testing centre.',                             section: 'CE-2',    status: 'pending',  isViewed: false, period: 'P5 — 11:30 AM – 12:20 PM',   venue: 'Autodesk Test Centre, Ameerpet', createdAt: new Date(Date.now() - 1800000*3).toISOString(),  files: [{ name: 'autocad_exam_voucher.pdf', size: 175000, type: 'application/pdf', dataUrl: null }], remark: '' },
  { id: 'r28', studentName: 'Keerthana Suresh',      rollNumber: '22AIML162',eventName: 'Flipkart Grid Campus Hackathon',   eventType: 'Hackathon',    startDate: '2025-08-30', endDate: '2025-08-31', description: 'Team selected to participate in Flipkart Grid 6.0 campus hackathon. Focus area: supply chain optimization using ML.',                       section: 'AIML-17', status: 'pending',  isViewed: false, period: 'Full Day — All Periods',       venue: 'Campus Coding Hub, Block-B', createdAt: new Date(Date.now() - 1800000*2).toISOString(), files: [], remark: '' },
  { id: 'r29', studentName: 'Venkata Ramana',        rollNumber: '22AIML174',eventName: 'IEEE Signal Processing Workshop',   eventType: 'Workshop',     startDate: '2025-09-02', endDate: '2025-09-02', description: 'One-day workshop on digital signal processing and MATLAB simulation organized by IEEE Student Branch.',                                       section: 'AIML-20', status: 'pending',  isViewed: false, period: 'P2 — 9:00 AM – 9:50 AM',     venue: 'ECE Seminar Hall, Block-D', createdAt: new Date(Date.now() - 900000*3).toISOString(),    files: [], remark: '' },
  { id: 'r30', studentName: 'Deepthi Ramesh',        rollNumber: '22AIML188',eventName: 'Internship Extension – TCS iON',   eventType: 'Internship',   startDate: '2025-09-05', endDate: '2025-09-10', description: 'Extension of summer internship at TCS iON Digital Learning Hub. Additional week approved by industry mentor for project completion.',      section: 'AIML-21', status: 'pending',  isViewed: true,  period: 'Full Day — All Periods',       venue: 'TCS iON, Deccan Park, Hyderabad', createdAt: new Date(Date.now() - 900000).toISOString(),    files: [{ name: 'tcs_extension_letter.pdf', size: 230000, type: 'application/pdf', dataUrl: null }], remark: '' },
];
const seedHods = [
  { id: 'HOD001', name: 'Dr. B. Jyothi', department: 'Computer Science', sections: [] },
  { id: 'HOD002', name: 'Dr. P. Satish', department: 'Information Technology', sections: [] },
  { id: 'HOD003', name: 'Prof. Anand Kumar', department: 'Electronics & Communication', sections: [] },
];

// Load from localStorage or use seed data
const SEED_VERSION = 'v2'; // bump this whenever seed data changes
function loadState() {
  try {
    const saved = localStorage.getItem('campusflow_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If seed version doesn't match, wipe old data and load fresh seed
      if (parsed.seedVersion !== SEED_VERSION) {
        localStorage.removeItem('campusflow_state');
        state.requests = seedRequests;
        state.hods = seedHods;
      } else {
        state.requests = parsed.requests || seedRequests;
        state.hods = parsed.hods || seedHods;
      }
    } else {
      state.requests = seedRequests;
      state.hods = seedHods;
    }
  } catch(e) {
    state.requests = seedRequests;
    state.hods = seedHods;
  }
}
function saveState() {
  try {
    localStorage.setItem('campusflow_state', JSON.stringify({ seedVersion: SEED_VERSION, requests: state.requests, hods: state.hods }));
  } catch(e) {}
}
loadState();

// ─── NAV CONFIG ─────────────────────────────────────────────
const navConfig = {
  student: [
    { icon: '📊', label: 'Dashboard', page: 'page-student-dashboard' },
    { icon: '➕', label: 'New Request', page: 'page-student-new' },
    { icon: '📅', label: 'Calendar', page: 'page-student-calendar' },
    { icon: '👤', label: 'My Profile', page: 'page-student-profile' },
  ],
  employee: [
    // Employee sees ONLY approved requests — no request creation
    { icon: '✅', label: 'Approved Requests', page: 'page-faculty-dashboard' },
  ],
  hod: [
    { icon: '📋', label: 'All Requests', page: 'page-hod-dashboard' },
    { icon: '📅', label: 'Calendar', page: 'page-hod-calendar' },
    { icon: '👤', label: 'My Profile', page: 'page-hod-profile' },
  ],
  faculty: [
    { icon: '✅', label: 'Approved Requests', page: 'page-faculty-dashboard' },
  ],
  admin: [
    { icon: '👩‍💼', label: 'HOD Management', page: 'page-admin-hods' },
    { icon: '📂', label: 'All Requests', page: 'page-admin-requests' },
  ]
};
const roleLabels = { student: 'Student', hod: 'HOD', faculty: 'Faculty', admin: 'Admin', employee: 'Employee' };
const roleIcons  = { student: '👨‍🎓', hod: '👩‍💼', faculty: '👨‍🏫', admin: '👨‍💻', employee: '👨‍💼' };

// ─── DEMO ACCOUNTS ──────────────────────────────────────────
const demoAccounts = {
  'student@campus.edu':  { password: 'student123',  role: 'student',  name: 'Arjun Mehta',    type: 'student' },
  'employee@campus.edu': { password: 'employee123', role: 'employee', name: 'Prof. Nandini Rao', type: 'employee' },
  'hod@campus.edu':      { password: 'hod123',      role: 'hod',      name: 'Dr. B. Jyothi', type: 'employee' },
  'admin@campus.edu':    { password: 'admin123',    role: 'admin',    name: 'Admin User',      type: 'employee' },
};

// ─── THEME ──────────────────────────────────────────────────
let isDark = true;
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const icon = isDark ? '🌙' : '☀️';
  const label = isDark ? 'Dark Mode' : 'Light Mode';
  const gBtn = document.getElementById('global-theme-toggle');
  if (gBtn) gBtn.textContent = isDark ? '🌙' : '☀️';
  const sIcon = document.getElementById('sidebar-theme-icon');
  const sLabel = document.getElementById('sidebar-theme-label');
  if (sIcon) sIcon.textContent = icon;
  if (sLabel) sLabel.textContent = label;
}

// ─── LOGIN UI ────────────────────────────────────────────────
function selectLoginType(type) {
  state.selectedLoginType = type;
  state.selectedEmpRole = null;
  document.getElementById('tab-student').classList.toggle('active', type === 'student');
  document.getElementById('tab-employee').classList.toggle('active', type === 'employee');
  const empSel = document.getElementById('emp-role-selector');
  empSel.classList.toggle('visible', type === 'employee');
  document.querySelectorAll('.emp-role-option').forEach(o => o.classList.remove('active'));
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-alert').classList.remove('show');
  renderDemoAccounts();
}
function selectEmpRole(role) {
  state.selectedEmpRole = role;
  document.querySelectorAll('.emp-role-option').forEach(o => o.classList.remove('active'));
  document.getElementById('emprole-' + role).classList.add('active');
  renderDemoAccounts();
  // Auto-fill matching demo
  const map = { employee: 'employee@campus.edu', hod: 'hod@campus.edu', admin: 'admin@campus.edu' };
  if (map[role]) fillAccount(map[role], demoAccounts[map[role]].password);
}
function renderDemoAccounts() {
  const list = document.getElementById('demo-accounts-list');
  if (state.selectedLoginType === 'student') {
    list.innerHTML = `
      <div class="login-account-row" onclick="fillAccount('student@campus.edu','student123')">
        <div class="account-info">
          <div class="account-dot" style="background:var(--blue)"></div>
          <div class="account-email">student@campus.edu</div>
        </div>
        <span class="account-role-tag tag-student">Student</span>
      </div>`;
  } else {
    list.innerHTML = `
      <div class="login-account-row" onclick="fillAccount('employee@campus.edu','employee123');selectEmpRole('employee')">
        <div class="account-info">
          <div class="account-dot" style="background:var(--green)"></div>
          <div class="account-email">employee@campus.edu</div>
        </div>
        <span class="account-role-tag tag-employee">Employee</span>
      </div>
      <div class="login-account-row" onclick="fillAccount('hod@campus.edu','hod123');selectEmpRole('hod')">
        <div class="account-info">
          <div class="account-dot" style="background:var(--yellow)"></div>
          <div class="account-email">hod@campus.edu</div>
        </div>
        <span class="account-role-tag tag-hod">HOD</span>
      </div>
      <div class="login-account-row" onclick="fillAccount('admin@campus.edu','admin123');selectEmpRole('admin')">
        <div class="account-info">
          <div class="account-dot" style="background:var(--accent2)"></div>
          <div class="account-email">admin@campus.edu</div>
        </div>
        <span class="account-role-tag tag-admin">Admin</span>
      </div>`;
  }
}
renderDemoAccounts();

function fillAccount(email, password) {
  document.getElementById('login-email').value = email;
  document.getElementById('login-password').value = password;
  document.querySelectorAll('.login-account-row').forEach(r => r.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  document.getElementById('login-alert').classList.remove('show');
}

// ─── LOGIN ───────────────────────────────────────────────────
function doLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const alertEl = document.getElementById('login-alert');
  const alertMsg = document.getElementById('login-alert-msg');
  const btn = document.getElementById('login-btn');
  const btnText = document.getElementById('login-btn-text');
  alertEl.classList.remove('show');

  if (!email || !password) {
    alertMsg.textContent = '⚠ Please enter your email and password.';
    alertEl.classList.add('show'); return;
  }

  // Validate against selected type
  const account = demoAccounts[email];
  if (!account || account.password !== password) {
    alertMsg.textContent = '✕ Invalid email or password.';
    alertEl.classList.add('show'); return;
  }
  if (account.type !== state.selectedLoginType) {
    alertMsg.textContent = `⚠ This account is a ${account.type === 'student' ? 'Student' : 'Employee/Faculty'} account. Please select the correct login type.`;
    alertEl.classList.add('show'); return;
  }

  // Loading state
  btn.disabled = true;
  btnText.innerHTML = `<span class="spinner"></span> Signing in…`;

  setTimeout(() => {
    state.currentUser = { role: account.role, name: account.name, email };
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    document.getElementById('global-theme-toggle').style.display = 'none';
    btn.disabled = false;
    btnText.textContent = 'Sign In →';
    initApp();
  }, 900);
}

function doLogout() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  document.getElementById('global-theme-toggle').style.display = 'flex';
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.querySelectorAll('.login-account-row').forEach(r => r.classList.remove('selected'));
  document.getElementById('login-alert').classList.remove('show');
  state.pendingFiles = [];
  renderDemoAccounts();
}

// ─── APP INIT ────────────────────────────────────────────────
function initApp() {
  const { role, name } = state.currentUser;
  // Load profile name from localStorage if available (student only)
  let displayName = name;
  if (role === 'student') {
    try {
      const saved = JSON.parse(localStorage.getItem('studentProfile') || 'null');
      if (saved && saved.name) displayName = saved.name;
    } catch(e) {}
  }
  document.getElementById('sb-avatar').textContent = displayName.charAt(0).toUpperCase();
  document.getElementById('sb-name').textContent = displayName;
  document.getElementById('sb-role').textContent = roleIcons[role] + ' ' + roleLabels[role];
  buildNav();

  // ── Populate all section dropdowns from master list ──────────
  populateSectionSelect('f-section', true, false);
  populateSectionSelect('edit-section', true, false);
  populateSectionSelect('prof-section', true, false);
  populateSectionSelect('hod-adv-section', false, true);
  const firstPage = navConfig[role][0].page;
  showPage(firstPage);
}

function buildNav() {
  const nav = document.getElementById('sidebar-nav');
  const role = state.currentUser.role;
  const items = navConfig[role];
  nav.innerHTML = `<div class="nav-section-label">Menu</div>` +
    items.map(item =>
      `<div class="nav-item" data-page="${item.page}" onclick="showPage('${item.page}')">
        <span class="nav-icon">${item.icon}</span>${item.label}
      </div>`
    ).join('');
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === pageId);
  });
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
  renderPage(pageId);
}

function renderPage(pageId) {
  if (pageId === 'page-student-dashboard') renderStudentDashboard();
  else if (pageId === 'page-student-new') { updateDeadlineBanner(); initFormDates(); autofillStudentForm(); }
  else if (pageId === 'page-student-profile') renderStudentProfile();
  else if (pageId === 'page-hod-dashboard') renderHodDashboard();
  else if (pageId === 'page-hod-profile') renderHodProfile();
  else if (pageId === 'page-faculty-dashboard') renderFacultyDashboard();
  else if (pageId === 'page-admin-hods') renderAdminHods();
  else if (pageId === 'page-admin-requests') renderAdminRequests();
  else if (pageId === 'page-student-calendar') renderCalendar('calendar-container', 'student');
  else if (pageId === 'page-hod-calendar') renderCalendar('hod-calendar-container', 'hod');
}

// ─── FILE HANDLING ───────────────────────────────────────────
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('file-drop-zone').classList.add('drag-over');
}
function handleDragLeave(e) {
  document.getElementById('file-drop-zone').classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('file-drop-zone').classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files);
  addFiles(files);
}
function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  addFiles(files);
}
function addFiles(files) {
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) { toast(`${file.name} exceeds 5MB limit`, 'error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      state.pendingFiles.push({ name: file.name, size: file.size, type: file.type, dataUrl: e.target.result });
      renderFileList();
    };
    reader.readAsDataURL(file);
  });
}
function removeFile(index) {
  state.pendingFiles.splice(index, 1);
  renderFileList();
}
function renderFileList() {
  const list = document.getElementById('f-file-list');
  if (!list) return;
  if (!state.pendingFiles.length) { list.innerHTML = ''; return; }
  list.innerHTML = state.pendingFiles.map((f, i) => `
    <div class="file-item">
      <span class="file-item-icon">${fileIcon(f.type)}</span>
      <span class="file-item-name">${f.name}</span>
      <span class="file-item-size">${formatSize(f.size)}</span>
      <button class="file-item-remove" onclick="removeFile(${i})" title="Remove">×</button>
    </div>
  `).join('');
}
function fileIcon(type) {
  if (type.includes('pdf')) return '📄';
  if (type.includes('image')) return '🖼';
  if (type.includes('word') || type.includes('doc')) return '📝';
  if (type.includes('sheet') || type.includes('excel') || type.includes('xlsx')) return '📊';
  return '📎';
}
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}
function downloadFile(fileObj) {
  if (!fileObj.dataUrl) { toast('File preview not available for seed data', 'info'); return; }
  const a = document.createElement('a');
  a.href = fileObj.dataUrl;
  a.download = fileObj.name;
  a.click();
}

// ─── STUDENT / EMPLOYEE DASHBOARD ───────────────────────────
function renderStudentDashboard() {
  const name = state.currentUser.name;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('student-greeting').textContent = `${greet}, ${name}!`;

  const myReqs = state.requests.filter(r => r.studentName === name);
  const displayReqs = myReqs.length ? myReqs : state.requests;

  const approved = displayReqs.filter(r => r.status === 'approved').length;
  const pending  = displayReqs.filter(r => r.status === 'pending').length;
  const rejected = displayReqs.filter(r => r.status === 'rejected').length;

  document.getElementById('student-stats').innerHTML = `
    <div class="stat-card purple"><div class="stat-val">${displayReqs.length}</div><div class="stat-label">Total Requests</div></div>
    <div class="stat-card green"><div class="stat-val">${approved}</div><div class="stat-label">Approved</div></div>
    <div class="stat-card yellow"><div class="stat-val">${pending}</div><div class="stat-label">Pending</div></div>
    <div class="stat-card red"><div class="stat-val">${rejected}</div><div class="stat-label">Rejected</div></div>
  `;

  const list = document.getElementById('student-requests-list');

  // Loading skeleton
  list.innerHTML = skeletonCards(3);
  setTimeout(() => {
    if (!displayReqs.length) {
      list.innerHTML = emptyState('No requests yet', '📭', "You haven't submitted any permission requests.", `<button class="btn btn-primary" onclick="showPage('page-student-new')">＋ Create Your First Request</button>`);
      return;
    }
    list.innerHTML = displayReqs.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt))
      .map(r => studentRequestCard(r)).join('');
  }, 600);
}

function studentRequestCard(r) {
  const canEdit = r.status === 'pending' && !r.isViewed;
  const viewedBadge = r.isViewed ? `<span class="badge badge-viewed">👀 Viewed by HOD</span>` : '';
  const filesBadge = r.files && r.files.length ? `<span class="badge badge-file" onclick="event.stopPropagation();openReqDetail('${r.id}')">📎 ${r.files.length} file${r.files.length>1?'s':''}</span>` : '';
  const remarkHtml = r.remark ? `<div style="margin:8px 0;padding:8px 12px;background:var(--surface2);border-left:3px solid var(--yellow);border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-size:12.5px;color:var(--text2);">💬 <strong style="color:var(--yellow)">HOD Remark:</strong> ${r.remark}</div>` : '';
  return `
    <div class="request-card" onclick="openReqDetail('${r.id}')">
      <div class="request-card-top">
        <div>
          <div class="request-name">${r.eventName}</div>
          <div class="request-meta">${r.eventType} &bull; ${r.startDate}${r.endDate !== r.startDate ? ' → '+r.endDate : ''}${r.period ? ' &bull; ' + r.period : ''}</div>
        </div>
        <span class="badge badge-${r.status}">${statusDot(r.status)} ${capitalize(r.status)}</span>
      </div>
      ${r.description ? `<div class="request-desc">${r.description.substring(0,120)}${r.description.length>120?'…':''}</div>` : ''}
      ${remarkHtml}
      <div class="request-bottom">
        <div class="request-badges">
          <span class="badge badge-section">📌 ${r.section}</span>
          ${filesBadge}
          ${viewedBadge}
        </div>
        <div class="request-actions" onclick="event.stopPropagation()">
          ${canEdit ? `
            <button class="btn btn-outline btn-sm" onclick="openEditModal('${r.id}')">✏️ Edit</button>
            <button class="btn btn-red btn-sm" onclick="deleteRequest('${r.id}')">🗑</button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// ─── DATE HELPERS ────────────────────────────────────────────
function getTodayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function getTomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function initFormDates() {
  const now = new Date();
  const isPast9PM = now.getHours() >= 21;
  const tomorrowStr = getTomorrowStr();

  // Set the "start date" default to tomorrow
  const startEl = document.getElementById('f-start-date');
  if (startEl) {
    startEl.value = tomorrowStr;
    // If after 9PM, min date is day-after-tomorrow
    if (isPast9PM) {
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      const das = dayAfter.getFullYear() + '-' + String(dayAfter.getMonth()+1).padStart(2,'0') + '-' + String(dayAfter.getDate()).padStart(2,'0');
      startEl.min = das;
      startEl.value = das;
    } else {
      startEl.min = tomorrowStr;
    }
  }
  const endEl = document.getElementById('f-end-date');
  if (endEl) {
    endEl.value = startEl ? startEl.value : tomorrowStr;
    endEl.min = startEl ? startEl.value : tomorrowStr;
  }
  updateDeadlineBanner();
}
function validateDates() {
  const start = document.getElementById('f-start-date')?.value;
  const endEl = document.getElementById('f-end-date');
  if (endEl && start) {
    endEl.min = start;
    if (endEl.value && endEl.value < start) endEl.value = start;
  }
  updateDeadlineBanner();
}
function updateDeadlineBanner() {
  const banner = document.getElementById('new-req-deadline-banner');
  const msg = document.getElementById('new-req-deadline-msg');
  if (!banner) return;
  const now = new Date();
  const isPast9PM = now.getHours() >= 21;
  if (isPast9PM) {
    banner.style.display = 'flex';
    if (msg) msg.textContent = 'Requests for tomorrow are closed after 9:00 PM. Please select a date from the day after tomorrow onwards.';
  } else {
    banner.style.display = 'none';
  }
}

function submitRequest() {
  const alertEl = document.getElementById('new-req-alert');
  const alertMsg = document.getElementById('new-req-alert-msg');
  const btn = document.getElementById('submit-req-btn');
  const btnText = document.getElementById('submit-req-text');
  alertEl.classList.remove('show');

  const now = new Date();
  const isPast9PM = now.getHours() >= 21;
  const tomorrowStr = getTomorrowStr();

  const name   = v('f-event-name');
  const type   = v('f-event-type');
  const start  = v('f-start-date');
  const end    = v('f-end-date');
  // section and roll are always sourced from locked profile fields
  const sectionEl = document.getElementById('f-section');
  const section= (sectionEl ? sectionEl.value.trim() : '') || v('f-section');
  const desc   = v('f-desc');
  const rollEl2 = document.getElementById('f-roll');
  const roll   = rollEl2 ? rollEl2.value.trim() : '';
  const period = getSelectedPeriodValue();
  const venue  = v('f-venue');

  // All fields mandatory
  if (!name || !type || !start || !end || !section || !desc || !roll || !venue) {
    alertMsg.textContent = '⚠ Please fill in all required fields before submitting.';
    alertEl.classList.remove('alert-warning'); alertEl.classList.add('alert-error');
    alertEl.classList.add('show'); return;
  }

  // Period validation
  if (!period) {
    alertMsg.textContent = '⚠ Please select at least one period when using Custom — Multiple Periods.';
    alertEl.classList.remove('alert-warning'); alertEl.classList.add('alert-error');
    alertEl.classList.add('show'); return;
  }
  if (period === '') {
    alertMsg.textContent = '⚠ Please select a period / time slot.';
    alertEl.classList.remove('alert-warning'); alertEl.classList.add('alert-error');
    alertEl.classList.add('show'); return;
  }

  // 9 PM restriction: if after 9 PM, next-day requests are blocked
  if (isPast9PM && start <= tomorrowStr) {
    alertMsg.textContent = '👉 Requests for the next day are closed after 9:00 PM. Please select a future date.';
    alertEl.classList.remove('alert-warning'); alertEl.classList.add('alert-error');
    alertEl.classList.add('show'); return;
  }

  // End date must be >= start date
  if (end < start) {
    alertMsg.textContent = '⚠ End date cannot be before start date.';
    alertEl.classList.remove('alert-warning'); alertEl.classList.add('alert-error');
    alertEl.classList.add('show'); return;
  }

  btn.disabled = true;
  btnText.innerHTML = `<span class="spinner"></span> Submitting…`;

  setTimeout(() => {
    const req = {
      id: 'r' + Date.now(),
      studentName: state.currentUser.name,
      rollNumber: roll,
      eventName: name, eventType: type, startDate: start, endDate: end,
      period, venue,
      description: desc, section, status: 'pending', isViewed: false,
      createdAt: now.toISOString(),
      files: [...state.pendingFiles],
      remark: ''
    };
    state.requests.unshift(req);
    saveState();
    ['f-event-name','f-event-type','f-start-date','f-end-date','f-desc','f-period','f-venue'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    autofillStudentForm(); // re-lock roll + section after clear
    // Reset multi-period checkboxes
    document.querySelectorAll('#period-checkboxes input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      const label = cb.closest('.period-checkbox-item');
      if (label) label.classList.remove('checked');
    });
    const multiSection = document.getElementById('multi-period-section');
    if (multiSection) multiSection.classList.remove('visible');
    state.pendingFiles = [];
    renderFileList();
    btn.disabled = false;
    btnText.textContent = 'Submit Request →';
    showSubmitSuccessAnimation();
    setTimeout(() => showPage('page-student-dashboard'), 2400);
  }, 1200);
}

// ─── HOD DASHBOARD (ENHANCED) ────────────────────────────────
// HOD-only state — no impact on student/faculty/admin
const hodEnhState = {
  searchQuery: '',
  advSection: '',
  advType: '',
  advDateFrom: '',
  advDateTo: '',
  selectedIds: new Set(),
  activeSection: 'All',
  insightsOpen: false,
  advFiltersOpen: false,
  focusedCardId: null,
};

function renderHodDashboard() {
  const reqs = state.requests;
  const approved = reqs.filter(r=>r.status==='approved').length;
  const pending  = reqs.filter(r=>r.status==='pending').length;
  const rejected = reqs.filter(r=>r.status==='rejected').length;

  // Compute sections that have at least one request (HOD's active sections)
  const activeSections = [...new Set(reqs.map(r => r.section).filter(Boolean))].sort();
  const sectionsCount = activeSections.length;
  // Build a compact breakdown string: "CE-1 (3), AIML-14 (2)…"
  const sectionBreakdown = activeSections.map(s => {
    const total = reqs.filter(r => r.section === s).length;
    const pend  = reqs.filter(r => r.section === s && r.status === 'pending').length;
    return { s, total, pend };
  });

  document.getElementById('hod-stats').innerHTML = `
    <div class="stat-card blue"><div class="stat-val">${reqs.length}</div><div class="stat-label">Total Requests</div></div>
    <div class="stat-card yellow"><div class="stat-val">${pending}</div><div class="stat-label">Awaiting Review</div></div>
    <div class="stat-card green"><div class="stat-val">${approved}</div><div class="stat-label">Approved</div></div>
    <div class="stat-card red"><div class="stat-val">${rejected}</div><div class="stat-label">Rejected</div></div>
    <div class="stat-card purple" id="hod-sections-stat" style="cursor:pointer;grid-column:1/-1;" onclick="toggleHodSectionsPanel()">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div>
          <div class="stat-val" style="font-size:28px;">${sectionsCount}</div>
          <div class="stat-label">Sections Under Control &nbsp;<span id="hod-sect-toggle-icon" style="font-size:11px;opacity:0.7;">▼ expand</span></div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:60%;">
          ${activeSections.slice(0,6).map(s => `<span style="background:rgba(108,99,255,0.18);border:1px solid rgba(108,99,255,0.3);border-radius:100px;padding:3px 10px;font-size:11px;font-weight:600;color:var(--accent2);">${s}</span>`).join('')}
          ${activeSections.length > 6 ? `<span style="background:var(--surface2);border:1px solid var(--border);border-radius:100px;padding:3px 10px;font-size:11px;color:var(--text3);">+${activeSections.length-6} more</span>` : ''}
        </div>
      </div>
      <div id="hod-sections-breakdown" style="display:none;margin-top:10px;border-top:1px solid var(--border);padding-top:10px;">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:var(--text3);margin-bottom:10px;">Section Breakdown</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;">
          ${sectionBreakdown.map(({s, total, pend}) => `
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;cursor:pointer;" onclick="event.stopPropagation();hodSetSection('${s}')">
              <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px;">${s}</div>
              <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                <span style="font-size:11px;color:var(--text2);">${total} request${total!==1?'s':''}</span>
                ${pend > 0 ? `<span style="background:var(--yellow-bg);color:var(--yellow);font-size:10px;font-weight:600;padding:1px 7px;border-radius:100px;border:1px solid rgba(234,179,8,0.25);">${pend} pending</span>` : `<span style="background:var(--green-bg);color:var(--green);font-size:10px;font-weight:600;padding:1px 7px;border-radius:100px;border:1px solid rgba(34,197,94,0.25);">clear</span>`}
              </div>
            </div>`).join('')}
        </div>
        ${activeSections.length === 0 ? '<div style="color:var(--text3);font-size:13px;">No requests received yet.</div>' : ''}
      </div>
    </div>
  `;

  // Notification badge
  const notifBadge = document.getElementById('hod-notif-badge');
  const notifLabel = document.getElementById('hod-notif-label');
  if (notifBadge) { notifBadge.textContent = pending; notifBadge.className = 'hod-notif-badge' + (pending===0?' zero':''); }
  if (notifLabel) notifLabel.textContent = `${pending} pending`;

  // Status filter bar (inside toolbar)
  const filterBar = document.getElementById('hod-filter-bar');
  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];
  if (filterBar) filterBar.innerHTML = `<span style="font-size:12px;color:var(--text2);margin-right:2px;">Status:</span>` +
    statuses.map(s =>
      `<div class="filter-chip ${s === state.hodFilter ? 'active' : ''}" onclick="setHodFilter('${s}')">${s}</div>`
    ).join('');

  // Section tabs
  const allSects = ['All', ...new Set(reqs.map(r=>r.section).filter(Boolean))].sort();
  const sectionTabsEl = document.getElementById('hod-section-tabs');
  if (sectionTabsEl) {
    sectionTabsEl.innerHTML = allSects.map(s => {
      const count = s === 'All' ? reqs.filter(r=>r.status==='pending').length : reqs.filter(r=>r.section===s&&r.status==='pending').length;
      return `<div class="hod-section-tab ${hodEnhState.activeSection===s?'active':''}" onclick="hodSetSection('${s}')">
        ${s} <span class="tab-badge">${count}</span>
      </div>`;
    }).join('');
  }

  // Section filter bar (hidden, kept for compatibility)
  const sectionBar = document.getElementById('hod-section-filter-bar');
  if (sectionBar) {
    const allSections = ['All Sections', ...new Set(reqs.map(r => r.section).filter(Boolean))].sort();
    sectionBar.innerHTML = allSections.map(s =>
      `<div class="filter-chip ${s === state.hodSectionFilter ? 'active' : ''}" onclick="setHodSectionFilter('${s}')">${s}</div>`
    ).join('');
  }

  // Sync adv filter dropdowns
  const advSectEl = document.getElementById('hod-adv-section');
  const advTypeEl = document.getElementById('hod-adv-type');
  const advFromEl = document.getElementById('hod-adv-date-from');
  const advToEl   = document.getElementById('hod-adv-date-to');
  if (advSectEl) advSectEl.value = hodEnhState.advSection;
  if (advTypeEl) advTypeEl.value = hodEnhState.advType;
  if (advFromEl) advFromEl.value = hodEnhState.advDateFrom;
  if (advToEl)   advToEl.value   = hodEnhState.advDateTo;

  hodRenderInsights();
  hodRenderList();
}

function hodRenderList() {
  const reqs = state.requests;
  const listEl = document.getElementById('hod-requests-list');
  listEl.innerHTML = skeletonCards(3);

  setTimeout(() => {
    const today = new Date();
    let filtered = reqs;

    // Status filter
    if (state.hodFilter !== 'All') filtered = filtered.filter(r => r.status === state.hodFilter.toLowerCase());
    // Section tab
    if (hodEnhState.activeSection !== 'All') filtered = filtered.filter(r => r.section === hodEnhState.activeSection);
    // Adv section
    if (hodEnhState.advSection) filtered = filtered.filter(r => r.section === hodEnhState.advSection);
    // Adv type
    if (hodEnhState.advType) filtered = filtered.filter(r => r.eventType === hodEnhState.advType);
    // Adv date range
    if (hodEnhState.advDateFrom) filtered = filtered.filter(r => r.startDate >= hodEnhState.advDateFrom);
    if (hodEnhState.advDateTo) filtered = filtered.filter(r => r.startDate <= hodEnhState.advDateTo);
    // Search
    const q = hodEnhState.searchQuery.trim().toLowerCase();
    if (q) filtered = filtered.filter(r =>
      (r.rollNumber||'').toLowerCase().includes(q) ||
      (r.studentName||'').toLowerCase().includes(q) ||
      (r.eventName||'').toLowerCase().includes(q)
    );

    // Smart sort: Urgent (pending + event in ≤2 days) → Pending → Approved/Rejected (recent)
    const sorted = [...filtered].sort((a, b) => {
      const getScore = r => {
        if (r.status !== 'pending') return 0;
        const daysToEvent = Math.ceil((new Date(r.startDate) - today) / 86400000);
        if (daysToEvent >= 0 && daysToEvent <= 2) return 3;
        return 1;
      };
      const diff = getScore(b) - getScore(a);
      if (diff !== 0) return diff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Group: Urgent → Pending → Older
    const urgent = [], pending = [], rest = [];
    sorted.forEach(r => {
      const daysToEvent = Math.ceil((new Date(r.startDate) - today) / 86400000);
      if (r.status === 'pending' && daysToEvent >= 0 && daysToEvent <= 2) urgent.push(r);
      else if (r.status === 'pending') pending.push(r);
      else rest.push(r);
    });

    let html = '';
    if (urgent.length) html += `<div class="date-group-label" style="color:var(--red);">🚨 Urgent — Event within 2 days</div>` + urgent.map(r => hodRequestCard(r, true)).join('');
    if (pending.length) html += `<div class="date-group-label">⏳ Pending Review</div>` + pending.map(r => hodRequestCard(r, false)).join('');
    if (rest.length) html += `<div class="date-group-label">📁 Reviewed</div>` + rest.map(r => hodRequestCard(r, false)).join('');
    if (!html) html = emptyState('No requests found', '📭', 'No requests match your current filter.', '');

    listEl.innerHTML = html;

    // Result count + bulk controls
    const countEl = document.getElementById('hod-result-count');
    if (countEl) countEl.innerHTML = `Showing <strong>${sorted.length}</strong> of <strong>${reqs.length}</strong> requests`;

    const hasAnyPending = sorted.some(r => r.status === 'pending');
    const selectBtn = document.getElementById('hod-select-all-btn');
    const kbdHint = document.getElementById('hod-kbd-hint');
    if (selectBtn) selectBtn.style.display = hasAnyPending ? '' : 'none';
    if (kbdHint) kbdHint.style.display = hasAnyPending ? 'flex' : 'none';

    hodUpdateBulkBar();
  }, 400);
}

function setHodFilter(f) {
  state.hodFilter = f;
  hodEnhState.selectedIds.clear();
  renderHodDashboard();
}
function setHodSectionFilter(s) {
  state.hodSectionFilter = s;
  renderHodDashboard();
}

function toggleHodSectionsPanel() {
  const panel = document.getElementById('hod-sections-breakdown');
  const icon  = document.getElementById('hod-sect-toggle-icon');
  if (!panel) return;
  const open = panel.style.display === 'block';
  panel.style.display = open ? 'none' : 'block';
  if (icon) icon.textContent = open ? '▼ expand' : '▲ collapse';
}
function hodSetSection(s) {
  hodEnhState.activeSection = s;
  hodEnhState.selectedIds.clear();
  renderHodDashboard();
}

function hodApplyAdvFilters() {
  hodEnhState.searchQuery = document.getElementById('hod-search-input')?.value || '';
  hodEnhState.advSection  = document.getElementById('hod-adv-section')?.value || '';
  hodEnhState.advType     = document.getElementById('hod-adv-type')?.value || '';
  hodEnhState.advDateFrom = document.getElementById('hod-adv-date-from')?.value || '';
  hodEnhState.advDateTo   = document.getElementById('hod-adv-date-to')?.value || '';
  hodEnhState.selectedIds.clear();
  hodRenderList();
}

function hodClearAdvFilters() {
  hodEnhState.advSection = hodEnhState.advType = hodEnhState.advDateFrom = hodEnhState.advDateTo = hodEnhState.searchQuery = '';
  ['hod-adv-section','hod-adv-type','hod-adv-date-from','hod-adv-date-to','hod-search-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  hodRenderList();
}

function hodToggleInsights() {
  hodEnhState.insightsOpen = !hodEnhState.insightsOpen;
  const panel = document.getElementById('hod-insights-panel');
  const btn = document.getElementById('hod-insights-btn');
  if (panel) panel.classList.toggle('open', hodEnhState.insightsOpen);
  if (btn) btn.classList.toggle('active', hodEnhState.insightsOpen);
  if (hodEnhState.insightsOpen) hodRenderInsights();
}

function hodToggleAdvFilters() {
  hodEnhState.advFiltersOpen = !hodEnhState.advFiltersOpen;
  const panel = document.getElementById('hod-adv-filters');
  const btn = document.getElementById('hod-adv-btn');
  if (panel) panel.classList.toggle('open', hodEnhState.advFiltersOpen);
  if (btn) btn.classList.toggle('active', hodEnhState.advFiltersOpen);
}

function hodRefresh() {
  renderHodDashboard();
  toast('Dashboard refreshed', 'info');
}

function hodRenderInsights() {
  if (!hodEnhState.insightsOpen) return;
  const reqs = state.requests;

  // Section breakdown
  const sectCounts = {};
  reqs.forEach(r => { sectCounts[r.section] = (sectCounts[r.section]||0) + 1; });
  const maxSect = Math.max(...Object.values(sectCounts), 1);
  const sectHtml = Object.entries(sectCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([s,c]) =>
    `<div class="hod-bar-row">
      <div class="hod-bar-label">${s}</div>
      <div class="hod-bar-track"><div class="hod-bar-fill" style="width:${Math.round(c/maxSect*100)}%"></div></div>
      <div class="hod-bar-count">${c}</div>
    </div>`
  ).join('');

  // Approval vs rejection
  const approved = reqs.filter(r=>r.status==='approved').length;
  const rejected = reqs.filter(r=>r.status==='rejected').length;
  const pendingC  = reqs.filter(r=>r.status==='pending').length;
  const maxAR = Math.max(approved, rejected, pendingC, 1);
  const approvalHtml = `
    <div class="hod-bar-row"><div class="hod-bar-label">Approved</div><div class="hod-bar-track"><div class="hod-bar-fill green" style="width:${Math.round(approved/maxAR*100)}%"></div></div><div class="hod-bar-count">${approved}</div></div>
    <div class="hod-bar-row"><div class="hod-bar-label">Rejected</div><div class="hod-bar-track"><div class="hod-bar-fill red" style="width:${Math.round(rejected/maxAR*100)}%"></div></div><div class="hod-bar-count">${rejected}</div></div>
    <div class="hod-bar-row"><div class="hod-bar-label">Pending</div><div class="hod-bar-track"><div class="hod-bar-fill yellow" style="width:${Math.round(pendingC/maxAR*100)}%"></div></div><div class="hod-bar-count">${pendingC}</div></div>
  `;

  // Monthly trends
  const monthlyCounts = {};
  reqs.forEach(r => {
    const d = new Date(r.createdAt);
    const key = d.toLocaleString('default',{month:'short',year:'2-digit'});
    monthlyCounts[key] = (monthlyCounts[key]||0)+1;
  });
  const monthKeys = Object.keys(monthlyCounts).slice(-5);
  const maxM = Math.max(...monthKeys.map(k=>monthlyCounts[k]),1);
  const monthlyHtml = monthKeys.map(k =>
    `<div class="hod-bar-row">
      <div class="hod-bar-label">${k}</div>
      <div class="hod-bar-track"><div class="hod-bar-fill" style="width:${Math.round(monthlyCounts[k]/maxM*100)}%"></div></div>
      <div class="hod-bar-count">${monthlyCounts[k]}</div>
    </div>`
  ).join('');

  const si = document.getElementById('hod-insight-sections');
  const ai = document.getElementById('hod-insight-approvals');
  const mi = document.getElementById('hod-insight-monthly');
  if (si) si.innerHTML = sectHtml || '<div style="color:var(--text3);font-size:12px;">No data</div>';
  if (ai) ai.innerHTML = approvalHtml;
  if (mi) mi.innerHTML = monthlyHtml || '<div style="color:var(--text3);font-size:12px;">No data</div>';
}

// ── Bulk Actions ──
function hodToggleBulk(id, checked) {
  if (checked) hodEnhState.selectedIds.add(id);
  else hodEnhState.selectedIds.delete(id);
  hodUpdateBulkBar();
}

function hodToggleSelectAll() {
  const cards = document.querySelectorAll('.hod-card-checkbox');
  const allChecked = [...cards].every(cb => cb.checked);
  cards.forEach(cb => {
    cb.checked = !allChecked;
    const id = cb.dataset.id;
    if (!allChecked) hodEnhState.selectedIds.add(id);
    else hodEnhState.selectedIds.delete(id);
  });
  hodUpdateBulkBar();
}

function hodUpdateBulkBar() {
  const n = hodEnhState.selectedIds.size;
  const badge = document.getElementById('hod-bulk-count-badge');
  const appBtn = document.getElementById('hod-bulk-approve-btn');
  const rejBtn = document.getElementById('hod-bulk-reject-btn');
  const selBtn = document.getElementById('hod-select-all-btn');
  if (badge) { badge.textContent = `${n} selected`; badge.classList.toggle('visible', n>0); }
  if (appBtn) appBtn.style.display = n>0 ? '' : 'none';
  if (rejBtn) rejBtn.style.display = n>0 ? '' : 'none';
}

function hodBulkAction(action) {
  if (!hodEnhState.selectedIds.size) return;
  hodEnhState.selectedIds.forEach(id => {
    const req = state.requests.find(r => r.id === id);
    if (req && req.status === 'pending') { req.status = action; req.isViewed = true; }
  });
  saveState();
  hodEnhState.selectedIds.clear();
  toast(`${action === 'approved' ? '✅ Approved' : '❌ Rejected'} ${hodEnhState.selectedIds.size || 'selected'} requests`, action === 'approved' ? 'success' : 'error');
  renderHodDashboard();
}

// ── Export to Excel (CSV) ──
function hodExportExcel() {
  const reqs = state.requests;
  const rows = [['Roll Number','Student Name','Event Name','Type','Section','Start Date','End Date','Period','Status','Submitted']];
  reqs.forEach(r => rows.push([
    r.rollNumber||'', r.studentName, r.eventName, r.eventType,
    r.section, r.startDate, r.endDate, r.period||'',
    r.status, new Date(r.createdAt).toLocaleDateString()
  ]));
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = `campusflow_requests_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  toast('📥 Exported to CSV', 'success');
}

// ── Student Quick Profile ──
function openHodStudentProfile(studentName) {
  const reqs = state.requests.filter(r => r.studentName === studentName);
  if (!reqs.length) return;
  const sample = reqs[0];
  const approved = reqs.filter(r=>r.status==='approved').length;
  const rejected = reqs.filter(r=>r.status==='rejected').length;
  const pending = reqs.filter(r=>r.status==='pending').length;

  document.getElementById('hpAvatar').textContent = studentName.charAt(0).toUpperCase();
  document.getElementById('hpName').textContent = studentName;
  document.getElementById('hpRoll').textContent = `Roll: ${sample.rollNumber || 'N/A'}`;
  document.getElementById('hpSect').textContent = `Section: ${sample.section}`;
  document.getElementById('hpTotal').textContent = reqs.length;
  document.getElementById('hpApproved').textContent = approved;
  document.getElementById('hpRejected').textContent = rejected;
  document.getElementById('hpPending').textContent = pending;

  const hist = [...reqs].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,8);
  document.getElementById('hpHistory').innerHTML = hist.map(r => `
    <div class="hod-profile-hist-item">
      <span class="badge badge-${r.status}" style="font-size:10px;">${capitalize(r.status)}</span>
      <span style="flex:1;color:var(--text);">${r.eventName}</span>
      <span style="color:var(--text3);font-size:11px;">${r.startDate}</span>
    </div>
  `).join('');

  document.getElementById('hod-profile-modal-overlay').classList.add('open');
}

function closeHodProfile() {
  document.getElementById('hod-profile-modal-overlay').classList.remove('open');
}

function hodRequestCard(r, isUrgent) {
  const isPending = r.status === 'pending';
  const hasFiles = r.files && r.files.length > 0;
  const filesBadge = hasFiles ? `<span class="badge badge-file">📎 ${r.files.length} file${r.files.length>1?'s':''}</span>` : '';

  const today = new Date();
  const daysToEvent = Math.ceil((new Date(r.startDate) - today) / 86400000);
  const isToday = daysToEvent === 0 || daysToEvent === 1;

  const urgencyBadge = isUrgent
    ? `<span class="hod-urgent-badge">🚨 Urgent</span>`
    : isToday && isPending ? `<span class="hod-urgent-today-badge">⚡ Soon</span>` : '';

  const cardBorderClass = isUrgent ? 'hod-card-urgent' : (isToday && isPending ? 'hod-card-today-event' : '');

  // Roll number badge with hover preview
  const hoverTip = `<div class="hod-hover-tip">
    <strong>${r.studentName}</strong><br>
    Section: ${r.section}<br>
    Submitted: ${new Date(r.createdAt).toLocaleDateString()}<br>
    ${r.period ? 'Period: '+r.period : ''}
  </div>`;

  return `
    <div class="request-card ${cardBorderClass}" data-card-id="${r.id}" tabindex="0"
      onkeydown="hodCardKeydown(event,'${r.id}')"
      onmouseenter="hodEnhState.focusedCardId='${r.id}'"
    >
      <div class="hod-card-cb-wrap">
        ${isPending ? `<input type="checkbox" class="hod-card-checkbox" data-id="${r.id}" onclick="event.stopPropagation();hodToggleBulk('${r.id}',this.checked)" title="Select for bulk action" />` : `<div style="width:16px;flex-shrink:0;"></div>`}
        <div style="flex:1;min-width:0;">
          <!-- PRIMARY ROW: Roll No first, then Event Name -->
          <div class="hod-card-primary-row">
            <div class="hod-roll-badge-wrap">
              <div class="hod-roll-badge">
                <span class="hod-roll-badge-prefix">#</span>${r.rollNumber || 'N/A'}
              </div>
              ${hoverTip}
            </div>
            <div class="hod-card-event-name">${r.eventName}</div>
            ${urgencyBadge}
            <span class="badge badge-${r.status}" style="margin-left:auto;">${statusDot(r.status)} ${capitalize(r.status)}</span>
          </div>

          <!-- Student name + type -->
          <div class="hod-card-student-row">
            <button class="hod-toolbar-btn" style="padding:2px 8px;font-size:11px;border-radius:100px;" onclick="event.stopPropagation();openHodStudentProfile('${r.studentName}')">👤 ${r.studentName}</button>
            &nbsp;·&nbsp; ${r.eventType} &nbsp;·&nbsp; 📌 ${r.section}
          </div>

          ${r.description ? `<div class="request-desc">${r.description.substring(0,110)}${r.description.length>110?'…':''}</div>` : ''}
          ${r.remark ? `<div style="padding:5px 10px;background:var(--surface2);border-left:3px solid var(--yellow);border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-size:11.5px;color:var(--text2);margin:5px 0;">💬 ${r.remark}</div>` : ''}
          <div class="request-bottom">
            <div class="request-badges">
              <span class="badge badge-type">🗂 ${r.eventType}</span>
              <span class="request-dates">📅 ${r.startDate}${r.endDate !== r.startDate ? ' → '+r.endDate : ''}</span>
              ${filesBadge}
              ${r.isViewed ? `<span class="badge badge-viewed" style="font-size:10.5px;">👀 Viewed</span>` : ''}
            </div>
            <div class="request-actions">
              <button class="hod-view-btn" onclick="openReqDetail('${r.id}', 'hod')">📋 View</button>
              ${isPending ? `
                <button class="btn btn-green btn-sm" onclick="hodApproveWithRemark('${r.id}')">✓ Approve</button>
                <button class="btn btn-red btn-sm" onclick="hodRejectWithRemark('${r.id}')">✕ Reject</button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Keyboard shortcuts for HOD cards ──
function hodCardKeydown(e, id) {
  const req = state.requests.find(r=>r.id===id);
  if (!req || req.status !== 'pending') return;
  if (e.key === 'a' || e.key === 'A') { e.preventDefault(); hodApproveWithRemark(id); }
  if (e.key === 'r' || e.key === 'R') { e.preventDefault(); hodRejectWithRemark(id); }
  if (e.key === 'v' || e.key === 'V') { e.preventDefault(); openReqDetail(id, 'hod'); }
}

function hodAction(id, action, remark = '') {
  const req = state.requests.find(r => r.id === id);
  if (!req) return;
  req.status = action;
  req.isViewed = true;
  if (remark) req.remark = remark;
  saveState();
  showNotification(`Request ${action === 'approved' ? '✅ Approved' : '❌ Rejected'} successfully.`, action === 'approved' ? 'success' : 'error');
  renderHodDashboard();
}

function openRemarkModal(id, action) {
  // Use the detail modal approach - open detail with focus on remark
  openReqDetail(id, 'hod');
  // Scroll to bottom of modal after open
  setTimeout(() => {
    const modal = document.querySelector('#req-detail-modal .modal');
    if (modal) modal.scrollTop = modal.scrollHeight;
  }, 100);
}

function hodRejectWithRemark(id) {
  openRemarkModal(id, 'rejected');
}
function hodApproveWithRemark(id) {
  openRemarkModal(id, 'approved');
}

// ─── REQUEST DETAIL MODAL ────────────────────────────────────
function openReqDetail(id, context = 'student') {
  const req = state.requests.find(r => r.id === id);
  if (!req) return;
  req.isViewed = true;
  saveState();

  // ── Build files section: HOD gets thumbnail auto-previews; others get simple list ──
  let filesHtml = '';
  if (req.files && req.files.length) {
    if (context === 'hod') {
      filesHtml = req.files.map((f, i) => {
        const hasData = !!f.dataUrl;
        const isImage = hasData && f.type && f.type.startsWith('image/');
        const isPdf   = hasData && f.type === 'application/pdf';

        let thumbContent = '';
        if (isImage) {
          thumbContent = `<img src="${f.dataUrl}" alt="${f.name}" />
            <div class="hod-file-thumb-expand">🔍</div>`;
        } else if (isPdf) {
          thumbContent = `<iframe src="${f.dataUrl}" title="${f.name}"></iframe>
            <div class="hod-file-thumb-expand">🔍</div>`;
        } else {
          thumbContent = `<span class="hod-file-thumb-icon">${fileIcon(f.type)}</span>`;
        }

        const canExpand = isImage || isPdf;
        const thumbClick = canExpand
          ? `onclick="openHodLightbox(state.requests.find(r=>r.id==='${req.id}').files[${i}])"`
          : '';

        return `
        <div class="hod-file-preview-row">
          <div class="hod-file-thumb" ${thumbClick} title="${canExpand ? 'Click to expand' : f.name}">
            ${thumbContent}
          </div>
          <div class="hod-file-info">
            <div class="hod-file-info-name">${f.name}</div>
            <div class="hod-file-info-meta">${fileIcon(f.type)} ${formatSize(f.size)}${!hasData ? ' · Seed data — no preview' : ''}</div>
            <div class="hod-file-info-actions">
              ${canExpand ? `<button class="hod-view-btn" style="font-size:11.5px;padding:4px 10px;" onclick="openHodLightbox(state.requests.find(r=>r.id==='${req.id}').files[${i}])">🔍 Expand</button>` : ''}
              ${hasData ? `<button class="file-download-btn" onclick="downloadFile(state.requests.find(r=>r.id==='${req.id}').files[${i}])">↓ Download</button>` : `<span style="font-size:11px;color:var(--text3);">No download for demo data</span>`}
            </div>
          </div>
        </div>`;
      }).join('');
    } else {
      filesHtml = req.files.map((f, i) => {
        const canPreview = f.dataUrl && (f.type && (f.type.startsWith('image/') || f.type === 'application/pdf'));
        const previewId = `file-preview-${req.id}-${i}`;
        return `
        <div class="file-item">
          <span class="file-item-icon">${fileIcon(f.type)}</span>
          <span class="file-item-name">${f.name}</span>
          <span class="file-item-size">${formatSize(f.size)}</span>
          ${canPreview ? `<button class="file-view-btn" onclick="previewFile(state.requests.find(r=>r.id==='${req.id}').files[${i}], '${previewId}')">👁 View</button>` : ''}
          <button class="file-download-btn" onclick="downloadFile(state.requests.find(r=>r.id==='${req.id}').files[${i}])">↓ Download</button>
        </div>
        <div id="${previewId}"></div>`;
      }).join('');
    }
  } else {
    filesHtml = `<div style="color:var(--text3);font-size:13px;padding:8px 0;">No files attached to this request.</div>`;
  }

  const remarkSection = req.remark ? `
    <div class="req-detail-section">
      <div class="req-detail-section-title">💬 HOD Remark</div>
      <div class="req-detail-desc" style="border-left:3px solid var(--yellow);">${req.remark}</div>
    </div>` : '';

  document.getElementById('req-detail-title').textContent = `📋 ${req.eventName}`;
  document.getElementById('req-detail-body').innerHTML = `
    <div class="req-detail-section">
      <div class="req-detail-section-title">Applicant Information</div>
      <div class="req-detail-grid">
        <div class="req-detail-item">
          <div class="req-detail-label">Name</div>
          <div class="req-detail-value">${req.studentName}</div>
        </div>
        <div class="req-detail-item">
          <div class="req-detail-label">Roll Number</div>
          <div class="req-detail-value">${req.rollNumber || 'N/A'}</div>
        </div>
        <div class="req-detail-item">
          <div class="req-detail-label">Section</div>
          <div class="req-detail-value">${req.section}</div>
        </div>
        <div class="req-detail-item">
          <div class="req-detail-label">Status</div>
          <div class="req-detail-value"><span class="badge badge-${req.status}">${statusDot(req.status)} ${capitalize(req.status)}</span></div>
        </div>
      </div>
    </div>
    <div class="req-detail-section">
      <div class="req-detail-section-title">Event Details</div>
      <div class="req-detail-grid">
        <div class="req-detail-item">
          <div class="req-detail-label">Event Type</div>
          <div class="req-detail-value">${req.eventType}</div>
        </div>
        <div class="req-detail-item">
          <div class="req-detail-label">Dates</div>
          <div class="req-detail-value">${req.startDate}${req.endDate !== req.startDate ? ' → ' + req.endDate : ''}</div>
        </div>
        ${req.period ? `<div class="req-detail-item">
          <div class="req-detail-label">Period / Time Slot</div>
          <div class="req-detail-value">${req.period}</div>
        </div>` : ''}
        ${req.venue ? `<div class="req-detail-item">
          <div class="req-detail-label">Venue</div>
          <div class="req-detail-value">${req.venue}</div>
        </div>` : ''}
        <div class="req-detail-item">
          <div class="req-detail-label">Submitted</div>
          <div class="req-detail-value">${new Date(req.createdAt).toLocaleString()}</div>
        </div>
        <div class="req-detail-item">
          <div class="req-detail-label">Viewed by HOD</div>
          <div class="req-detail-value">${req.isViewed ? '✅ Yes' : '⏳ Not yet'}</div>
        </div>
      </div>
    </div>
    ${req.description ? `
    <div class="req-detail-section">
      <div class="req-detail-section-title">Description</div>
      <div class="req-detail-desc">${req.description}</div>
    </div>` : ''}
    ${remarkSection}
    <div class="req-detail-section">
      <div class="req-detail-section-title">Attached Files (${req.files ? req.files.length : 0})${context === 'hod' && req.files && req.files.length ? ' — <span style="font-size:11px;font-weight:400;color:var(--text3);">Click thumbnail to expand</span>' : ''}</div>
      <div class="${context === 'hod' ? 'hod-files-preview-section' : 'file-list'}">${filesHtml}</div>
    </div>
    ${context === 'hod' && req.status === 'pending' ? `
    <div class="req-detail-section">
      <div class="req-detail-section-title">Add Remark (Optional)</div>
      <textarea id="hod-remark-input" class="form-textarea" placeholder="Add a remark or reason (optional)…" style="min-height:70px;"></textarea>
    </div>` : ''}
  `;

  const actions = document.getElementById('req-detail-actions');
  if (context === 'hod' && req.status === 'pending') {
    actions.innerHTML = `
      <button class="btn btn-outline" onclick="closeReqDetail()">Close</button>
      <button class="btn btn-red" onclick="hodActionFromDetail('${req.id}','rejected')">✕ Reject</button>
      <button class="btn btn-green" onclick="hodActionFromDetail('${req.id}','approved')">✓ Approve</button>
    `;
  } else {
    actions.innerHTML = `<button class="btn btn-outline" onclick="closeReqDetail()">Close</button>`;
  }

  document.getElementById('req-detail-modal').classList.add('open');
  if (context === 'hod') { setTimeout(() => renderHodDashboard(), 50); }
}
function hodActionFromDetail(id, action) {
  const remark = document.getElementById('hod-remark-input')?.value?.trim() || '';
  hodAction(id, action, remark);
  closeReqDetail();
}
function closeReqDetail() { document.getElementById('req-detail-modal').classList.remove('open'); }

// ─── HOD FILE LIGHTBOX ────────────────────────────────────────
function openHodLightbox(fileObj) {
  if (!fileObj || !fileObj.dataUrl) return;
  const lb = document.getElementById('hod-file-lightbox');
  const title = document.getElementById('hod-lightbox-title');
  const body = document.getElementById('hod-lightbox-body');
  if (!lb) return;

  title.textContent = fileObj.name;
  body.innerHTML = '';

  if (fileObj.type && fileObj.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = fileObj.dataUrl;
    img.alt = fileObj.name;
    body.appendChild(img);
  } else if (fileObj.type === 'application/pdf') {
    const iframe = document.createElement('iframe');
    iframe.src = fileObj.dataUrl;
    iframe.title = fileObj.name;
    body.appendChild(iframe);
  }

  lb.classList.add('open');
}

function closeHodLightbox(e) {
  // Only close if clicking the dark backdrop (not inner content)
  if (e && e.target !== document.getElementById('hod-file-lightbox')) return;
  document.getElementById('hod-file-lightbox').classList.remove('open');
}

function closeHodLightboxBtn() {
  document.getElementById('hod-file-lightbox').classList.remove('open');
}

// ─── FACULTY / EMPLOYEE ───────────────────────────────────────
let facultyFilter = 'All';
function renderFacultyDashboard() {
  const approved = state.requests.filter(r => r.status === 'approved');
  const sections = ['All', ...new Set(approved.map(r => r.section))];

  const filterBar = document.getElementById('faculty-filter-bar');
  filterBar.innerHTML = `<span style="font-size:13px;color:var(--text2);margin-right:4px;">Section:</span>` +
    sections.map(s =>
      `<div class="filter-chip ${s === facultyFilter ? 'active' : ''}" onclick="setFacultyFilter('${s}')">${s}</div>`
    ).join('');

  const filtered = facultyFilter === 'All' ? approved : approved.filter(r => r.section === facultyFilter);
  const list = document.getElementById('faculty-requests-list');

  list.innerHTML = skeletonCards(2);
  setTimeout(() => {
    if (!filtered.length) {
      list.innerHTML = emptyState('No approved requests', '✅', 'No attendance permissions have been approved yet.', '');
      return;
    }
    const sorted = filtered.sort((a,b) => {
      // Sort by roll number (primary), then name
      const ra = (a.rollNumber || '').toString().toLowerCase();
      const rb = (b.rollNumber || '').toString().toLowerCase();
      if (ra < rb) return -1;
      if (ra > rb) return 1;
      return 0;
    });
    list.innerHTML = `
      <div class="faculty-table-wrap">
        <table class="faculty-table">
          <thead>
            <tr>
              <th class="sno-col">#</th>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Event Name</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map((r, i) => `
              <tr>
                <td class="sno-col">${i + 1}</td>
                <td><span class="roll-cell">${r.rollNumber || 'N/A'}</span></td>
                <td style="font-weight:500;">${r.studentName}</td>
                <td style="color:var(--text2);">${r.eventName}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="faculty-table-count">✅ ${sorted.length} approved request${sorted.length !== 1 ? 's' : ''}</div>
      </div>
    `;
  }, 400);
}
function setFacultyFilter(s) { facultyFilter = s; renderFacultyDashboard(); }

// ─── ADMIN ────────────────────────────────────────────────────
function renderAdminHods() {
  document.getElementById('admin-hod-stats').innerHTML = `
    <div class="stat-card purple"><div class="stat-val">${state.hods.length}</div><div class="stat-label">Total HODs</div></div>
    <div class="stat-card blue"><div class="stat-val">${[...new Set(state.hods.map(h=>h.department))].length}</div><div class="stat-label">Departments</div></div>
  `;
  const container = document.getElementById('hod-grid-container');
  if (!state.hods.length) {
    container.innerHTML = emptyState('No HODs added yet', '👩‍💼', 'Add Head of Department profiles to get started.', `<button class="btn btn-primary" onclick="openHodModal()">➕ Add First HOD</button>`);
    return;
  }
  container.innerHTML = `<div class="hod-grid">` +
    state.hods.map(h => `
      <div class="hod-card">
        <div class="hod-avatar">${h.name.charAt(0)}</div>
        <div class="hod-name">${h.name}</div>
        <div class="hod-dept">🏛 ${h.department}</div>
        <div class="hod-id">ID: ${h.id}</div>
        <div class="hod-actions">
          <button class="btn btn-outline btn-sm" onclick="openHodModal('${h.id}')">✏️ Edit</button>
          <button class="btn btn-red btn-sm" onclick="deleteHod('${h.id}')">🗑</button>
        </div>
      </div>
    `).join('') + `</div>`;
}

function renderAdminRequests() {
  const tbody = document.getElementById('admin-requests-tbody');
  if (!state.requests.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text3);">No requests found</td></tr>`;
    return;
  }
  tbody.innerHTML = state.requests.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).map(r => `
    <tr style="cursor:pointer" onclick="openReqDetail('${r.id}','hod')">
      <td><strong style="color:var(--text)">${r.studentName}</strong> ${r.rollNumber ? `<br><span style="font-size:11px;color:var(--text3)">${r.rollNumber}</span>` : ''}</td>
      <td><strong style="color:var(--text)">${r.eventName}</strong></td>
      <td><span class="badge badge-type">${r.eventType}</span></td>
      <td><span class="badge badge-section">${r.section}</span></td>
      <td style="font-size:12px;">${r.startDate}${r.endDate !== r.startDate ? '→'+r.endDate : ''}</td>
      <td><span class="badge badge-${r.status}">${statusDot(r.status)} ${capitalize(r.status)}</span></td>
      <td>${r.files && r.files.length ? `<span class="badge badge-file">📎 ${r.files.length}</span>` : '<span style="color:var(--text3)">—</span>'}</td>
      <td>${r.isViewed ? '👀 Yes' : '<span style="color:var(--text3)">No</span>'}</td>
    </tr>
  `).join('');
}

function openHodModal(id) {
  state.editingHodId = id || null;
  document.getElementById('hod-modal-alert').classList.remove('show');
  if (id) {
    const hod = state.hods.find(h => h.id === id);
    if (!hod) return;
    document.getElementById('hod-modal-title').textContent = '✏️ Edit HOD';
    document.getElementById('hod-name').value = hod.name;
    document.getElementById('hod-id-input').value = hod.id;
    document.getElementById('hod-dept').value = hod.department;
  } else {
    document.getElementById('hod-modal-title').textContent = '➕ Add New HOD';
    document.getElementById('hod-name').value = '';
    document.getElementById('hod-id-input').value = '';
    document.getElementById('hod-dept').value = '';
  }
  document.getElementById('hod-modal').classList.add('open');
}
function closeHodModal() { document.getElementById('hod-modal').classList.remove('open'); }

function saveHod() {
  const name = v('hod-name'), id = v('hod-id-input'), dept = v('hod-dept');
  const alertEl = document.getElementById('hod-modal-alert');
  const btn = document.getElementById('save-hod-btn');
  const btnText = document.getElementById('save-hod-text');
  if (!name || !id || !dept) { alertEl.classList.add('show'); return; }
  alertEl.classList.remove('show');
  btn.disabled = true;
  btnText.innerHTML = `<span class="spinner spinner-dark"></span> Saving…`;
  setTimeout(() => {
    if (state.editingHodId) {
      const hod = state.hods.find(h => h.id === state.editingHodId);
      if (hod) { hod.name = name; hod.id = id; hod.department = dept; }
      toast('HOD updated!', 'success');
    } else {
      if (state.hods.find(h => h.id === id)) {
        alertEl.textContent = 'HOD ID already exists.';
        alertEl.classList.add('show');
        btn.disabled = false;
        btnText.textContent = 'Save HOD';
        return;
      }
      state.hods.push({ id, name, department: dept });
      toast('HOD added!', 'success');
    }
    saveState();
    btn.disabled = false;
    btnText.textContent = 'Save HOD';
    closeHodModal();
    renderAdminHods();
  }, 800);
}

function deleteHod(id) {
  if (!confirm('Are you sure you want to remove this HOD?')) return;
  state.hods = state.hods.filter(h => h.id !== id);
  saveState();
  toast('HOD removed.', 'info');
  renderAdminHods();
}

// ─── EDIT REQUEST ─────────────────────────────────────────────
function openEditModal(id) {
  const r = state.requests.find(r => r.id === id);
  if (!r) return;
  document.getElementById('edit-req-id').value = id;
  document.getElementById('edit-event-name').value = r.eventName;
  document.getElementById('edit-event-type').value = r.eventType;
  document.getElementById('edit-section').value = r.section;
  document.getElementById('edit-start-date').value = r.startDate;
  document.getElementById('edit-end-date').value = r.endDate;
  document.getElementById('edit-desc').value = r.description;
  document.getElementById('edit-period').value = r.period || '';
  document.getElementById('edit-venue').value = r.venue || '';
  document.getElementById('edit-req-modal').classList.add('open');
}
function closeEditModal() { document.getElementById('edit-req-modal').classList.remove('open'); }
function saveEdit() {
  const id = v('edit-req-id');
  const r = state.requests.find(r => r.id === id);
  if (!r) return;
  r.eventName = v('edit-event-name');
  r.eventType = v('edit-event-type');
  r.section = v('edit-section');
  r.startDate = v('edit-start-date');
  r.endDate = v('edit-end-date');
  r.description = v('edit-desc');
  r.period = v('edit-period');
  r.venue = v('edit-venue');
  saveState();
  closeEditModal();
  toast('Request updated!', 'success');
  renderStudentDashboard();
}

function deleteRequest(id) {
  if (!confirm('Delete this request?')) return;
  state.requests = state.requests.filter(r => r.id !== id);
  saveState();
  toast('Request deleted.', 'info');
  renderStudentDashboard();
}

// ─── CALENDAR VIEW ────────────────────────────────────────────
function renderCalendar(containerId, role) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const year = state.calYear, month = state.calMonth;
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const today = new Date();

  // Group requests by date
  const reqByDate = {};
  state.requests.forEach(r => {
    const start = r.startDate, end = r.endDate;
    let cur = new Date(start);
    const endD = new Date(end);
    while (cur <= endD) {
      const key = cur.toISOString().split('T')[0];
      if (!reqByDate[key]) reqByDate[key] = [];
      reqByDate[key].push(r);
      cur.setDate(cur.getDate() + 1);
    }
  });

  let daysHtml = dayNames.map(d => `<div class="calendar-day-header">${d}</div>`).join('');

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    daysHtml += `<div class="calendar-day other-month"><div class="cal-day-num">${prevDays - i}</div></div>`;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayReqs = reqByDate[dateStr] || [];
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

    // HOD Calendar Enhancements: overlap + absentee count
    let hodCalExtra = '';
    let overlapClass = '';
    if (role === 'hod') {
      const approvedReqs = dayReqs.filter(r => r.status === 'approved');
      const absenteeCount = approvedReqs.length;
      // Overlap: multiple pending requests on the same day
      const pendingReqs = dayReqs.filter(r => r.status === 'pending');
      const hasOverlap = pendingReqs.length > 1;
      if (hasOverlap) {
        hodCalExtra += `<div class="cal-overlap-badge">⚠ ${pendingReqs.length} overlap</div>`;
        overlapClass = 'has-overlap';
      }
      if (absenteeCount > 0) {
        hodCalExtra += `<div class="cal-absentee-count">👤 ${absenteeCount} absent</div>`;
      }
    }

    const eventsHtml = hodCalExtra + dayReqs.slice(0, 2).map(r =>
      `<div class="cal-event-dot ${r.status}" title="${r.eventName}">${r.eventName.substring(0,10)}…</div>`
    ).join('') + (dayReqs.length > 2 ? `<div style="font-size:10px;color:var(--text3);padding:1px 5px;">+${dayReqs.length-2} more</div>` : '');

    daysHtml += `<div class="calendar-day ${isToday ? 'today' : ''} ${overlapClass}" onclick="selectCalDay('${dateStr}', '${containerId}')">
      <div class="cal-day-num">${d}</div>
      <div class="cal-events">${eventsHtml}</div>
    </div>`;
  }

  // Next month fill
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  for (let d = 1; d <= totalCells - firstDay - daysInMonth; d++) {
    daysHtml += `<div class="calendar-day other-month"><div class="cal-day-num">${d}</div></div>`;
  }

  container.innerHTML = `
    <div class="calendar-wrap">
      <div class="calendar-header">
        <div class="calendar-title">${monthNames[month]} ${year}</div>
        <div class="calendar-nav">
          <button class="calendar-nav-btn" onclick="changeCalMonth(-1,'${containerId}','${role}')">‹</button>
          <button class="calendar-nav-btn" onclick="changeCalMonth(0,'${containerId}','${role}')">Today</button>
          <button class="calendar-nav-btn" onclick="changeCalMonth(1,'${containerId}','${role}')">›</button>
        </div>
      </div>
      <div class="calendar-grid">${daysHtml}</div>
      <div class="calendar-selected-events" id="${containerId}-events">
        <div style="color:var(--text3);font-size:13px;">Click a date to see requests for that day.</div>
      </div>
    </div>
  `;
}

function changeCalMonth(dir, containerId, role) {
  if (dir === 0) {
    state.calMonth = new Date().getMonth();
    state.calYear = new Date().getFullYear();
  } else {
    state.calMonth += dir;
    if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
    if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
  }
  renderCalendar(containerId, role);
}

function selectCalDay(dateStr, containerId) {
  const eventsEl = document.getElementById(containerId + '-events');
  const dayReqs = state.requests.filter(r => {
    const start = new Date(r.startDate), end = new Date(r.endDate), d = new Date(dateStr);
    return d >= start && d <= end;
  });
  if (!dayReqs.length) {
    eventsEl.innerHTML = `<div class="calendar-sel-title">${dateStr}</div><div style="color:var(--text3);font-size:13px;">No requests on this date.</div>`;
    return;
  }
  eventsEl.innerHTML = `<div class="calendar-sel-title">${dateStr} — ${dayReqs.length} request${dayReqs.length>1?'s':''}</div>` +
    dayReqs.map(r => `
      <div class="request-card" style="margin-bottom:8px;" onclick="openReqDetail('${r.id}')">
        <div class="request-card-top">
          <div>
            <div class="request-name" style="font-size:14px;">${r.eventName}</div>
            <div class="request-meta">👤 ${r.studentName} &bull; ${r.section}</div>
          </div>
          <span class="badge badge-${r.status}">${statusDot(r.status)} ${capitalize(r.status)}</span>
        </div>
      </div>
    `).join('');
}

// ─── SUCCESS ANIMATION ────────────────────────────────────────
function showSubmitSuccessAnimation() {
  const overlay = document.getElementById('submit-success-overlay');
  const card = document.getElementById('success-card');
  if (!overlay) return;

  // Remove old confetti
  card.querySelectorAll('.confetti-piece').forEach(c => c.remove());

  // Spawn confetti
  const colors = ['#6c63ff','#22c55e','#eab308','#3b82f6','#a594ff','#f472b6'];
  for (let i = 0; i < 28; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      background:${colors[i % colors.length]};
      left:${40 + Math.random()*20}%;
      top:${30 + Math.random()*20}%;
      --tx:${(Math.random()-0.5)*260}px;
      --ty:${-(80 + Math.random()*160)}px;
      --rot:${Math.random()*720}deg;
      animation-delay:${Math.random()*0.3}s;
      animation-duration:${0.9 + Math.random()*0.6}s;
      border-radius:${Math.random()>0.5?'50%':'2px'};
    `;
    card.appendChild(el);
  }

  overlay.classList.add('show');
  setTimeout(() => {
    overlay.classList.remove('show');
  }, 2300);
}

// ─── HOD PROFILE PAGE ────────────────────────────────────────
function renderHodProfile() {
  // Find the HOD record matching the logged-in user
  const currentName = state.currentUser.name;
  let hodRecord = state.hods.find(h =>
    h.name.toLowerCase().replace(/\s/g,'') === currentName.toLowerCase().replace(/\s/g,'')
  ) || state.hods[0] || { id: 'HOD001', name: currentName, department: '—', sections: [], phone: '' };

  // Merge with any saved local profile data
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('hodProfile_' + hodRecord.id) || '{}'); } catch(e) {}
  const merged = { ...hodRecord, ...saved };
  // Ensure sections is always an array
  if (!Array.isArray(merged.sections)) merged.sections = [];

  // --- Hero ---
  const avatarEl = document.getElementById('hod-prof-avatar');
  const nameDisp = document.getElementById('hod-prof-name-display');
  const deptDisp = document.getElementById('hod-prof-dept-display');
  const idDisp   = document.getElementById('hod-prof-id-display');
  const cntDisp  = document.getElementById('hod-prof-section-count-display');
  if (avatarEl) avatarEl.textContent = (merged.name || '?').charAt(0).toUpperCase();
  if (nameDisp) nameDisp.textContent = merged.name || '—';
  if (deptDisp) deptDisp.textContent = merged.department || '—';
  if (idDisp)   idDisp.textContent   = merged.id || '—';
  if (cntDisp)  cntDisp.textContent  = merged.sections.length;

  // --- Form fields ---
  const nameInp  = document.getElementById('hod-prof-name');
  const idInp    = document.getElementById('hod-prof-id');
  const deptInp  = document.getElementById('hod-prof-dept');
  const emailInp = document.getElementById('hod-prof-email');
  const phoneInp = document.getElementById('hod-prof-phone');
  if (nameInp)  nameInp.value  = merged.name || '';
  if (idInp)    idInp.value    = merged.id   || '';
  if (deptInp)  deptInp.value  = merged.department || '';
  if (emailInp) emailInp.value = state.currentUser.email || '';
  if (phoneInp) phoneInp.value = merged.phone || '';

  // --- Sections toggle grid ---
  const grid = document.getElementById('hod-prof-sections-grid');
  if (grid) {
    grid.innerHTML = SECTIONS.map(s => {
      const on = merged.sections.includes(s);
      return `<button class="hod-section-toggle-btn ${on ? 'on' : ''}" id="hstoggle-${s}" onclick="hodProfToggleSection('${s}')">${s}</button>`;
    }).join('');
  }

  hodProfUpdateUI(merged.sections);

  // Hide messages
  ['hod-prof-save-msg','hod-prof-err-msg'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });

  // Store current record id for saving
  window._hodProfCurrentId = merged.id;
  window._hodProfSections  = [...merged.sections];
}

function hodProfToggleSection(s) {
  if (!window._hodProfSections) window._hodProfSections = [];
  const idx = window._hodProfSections.indexOf(s);
  if (idx === -1) window._hodProfSections.push(s);
  else window._hodProfSections.splice(idx, 1);
  const btn = document.getElementById('hstoggle-' + s);
  if (btn) btn.classList.toggle('on', window._hodProfSections.includes(s));
  hodProfUpdateUI(window._hodProfSections);
}

function hodProfSelectAll() {
  window._hodProfSections = [...SECTIONS];
  SECTIONS.forEach(s => {
    const btn = document.getElementById('hstoggle-' + s);
    if (btn) btn.classList.add('on');
  });
  hodProfUpdateUI(window._hodProfSections);
}

function hodProfClearAll() {
  window._hodProfSections = [];
  SECTIONS.forEach(s => {
    const btn = document.getElementById('hstoggle-' + s);
    if (btn) btn.classList.remove('on');
  });
  hodProfUpdateUI([]);
}

function hodProfUpdateUI(sections) {
  const cntEl = document.getElementById('hod-prof-selected-count');
  if (cntEl) cntEl.textContent = sections.length;

  const chipsEl = document.getElementById('hod-prof-chips-preview');
  if (chipsEl) {
    if (!sections.length) {
      chipsEl.innerHTML = `<span style="font-size:12.5px;color:var(--text3);">No sections selected yet.</span>`;
    } else {
      chipsEl.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:7px;">` +
        sections.map(s => `
          <span class="hod-section-chip selected">
            ${s}
            <button class="hod-section-chip-remove" onclick="hodProfToggleSection('${s}')" title="Remove">×</button>
          </span>`).join('') +
        `</div>`;
    }
  }
}

function saveHodProfile() {
  const name  = document.getElementById('hod-prof-name')?.value?.trim();
  const dept  = document.getElementById('hod-prof-dept')?.value?.trim();
  const phone = document.getElementById('hod-prof-phone')?.value?.trim();
  const sections = window._hodProfSections || [];

  const saveMsg = document.getElementById('hod-prof-save-msg');
  const errMsg  = document.getElementById('hod-prof-err-msg');

  if (!name) {
    if (errMsg) { errMsg.style.display = 'flex'; setTimeout(() => errMsg.style.display = 'none', 3000); }
    return;
  }

  const btn  = document.getElementById('hod-prof-save-text');
  if (btn) btn.innerHTML = `<span class="spinner spinner-dark"></span> Saving…`;

  setTimeout(() => {
    const id = window._hodProfCurrentId;

    // Update in state.hods
    const hodRec = state.hods.find(h => h.id === id);
    if (hodRec) {
      hodRec.name       = name;
      hodRec.department = dept || hodRec.department;
      hodRec.sections   = sections;
      hodRec.phone      = phone;
    }
    saveState();

    // Also persist to localStorage keyed by HOD id
    const localData = { name, department: dept, phone, sections, id };
    localStorage.setItem('hodProfile_' + id, JSON.stringify(localData));

    // Update sidebar
    document.getElementById('sb-name').textContent = name;
    document.getElementById('sb-avatar').textContent = name.charAt(0).toUpperCase();
    state.currentUser.name = name;

    if (btn) btn.textContent = '💾 Save Profile';

    // Refresh hero
    renderHodProfile();

    if (saveMsg) { saveMsg.style.display = 'flex'; setTimeout(() => saveMsg.style.display = 'none', 3000); }
    toast('Profile updated successfully! ✅', 'success');
  }, 700);
}


function v(id) { return document.getElementById(id)?.value?.trim() || ''; }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function statusDot(s) { return s === 'approved' ? '●' : s === 'rejected' ? '●' : '◉'; }

function emptyState(title, icon, desc, actionHtml) {
  return `<div class="empty-state">
    <span class="empty-state-icon">${icon}</span>
    <div class="empty-state-title">${title}</div>
    <div class="empty-state-desc">${desc || 'Nothing to show here yet.'}</div>
    ${actionHtml ? `<div class="empty-state-action">${actionHtml}</div>` : ''}
  </div>`;
}

function skeletonCards(count) {
  return Array.from({length: count}, () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-line medium"></div>
      <div class="skeleton skeleton-line short" style="margin-bottom:14px;"></div>
      <div class="skeleton skeleton-line full"></div>
      <div class="skeleton skeleton-line short" style="margin-top:10px;"></div>
    </div>
  `).join('');
}

function toast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}


// ─── LOGIN PARTICLES ──────────────────────────────────────────
(function initLoginParticles() {
  const container = document.getElementById('login-particles');
  if (!container) return;
  const colors = ['rgba(108,99,255,', 'rgba(165,148,255,', 'rgba(34,197,94,', 'rgba(59,130,246,'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 4 + Math.random() * 8;
    const opacity = 0.1 + Math.random() * 0.2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = (5 + Math.random() * 90) + '%';
    p.style.setProperty('--op', opacity);
    p.style.setProperty('--dur', (7 + Math.random() * 8) + 's');
    p.style.setProperty('--delay', (Math.random() * 6) + 's');
    p.style.background = color + opacity + ')';
    container.appendChild(p);
  }
})();

// ─── FEATURE 3: NOTIFICATION SYSTEM (alias for toast) ─────────────────
function showNotification(message, type = 'info') {
  toast(message, type);
}

// ─── FEATURE 1: STUDENT PROFILE ───────────────────────────────────────
function renderStudentProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem('studentProfile') || 'null');
    if (saved) {
      const nameEl = document.getElementById('prof-name');
      const rollEl = document.getElementById('prof-roll');
      const genderEl = document.getElementById('prof-gender');
      const sectionEl = document.getElementById('prof-section');
      if (nameEl) nameEl.value = saved.name || '';
      if (rollEl) {
        rollEl.value = saved.roll || '';
        // Make roll number read-only after first save
        rollEl.readOnly = !!saved.roll;
        rollEl.style.opacity = saved.roll ? '0.7' : '1';
        rollEl.title = saved.roll ? 'Roll number cannot be changed after first save' : '';
      }
      if (genderEl) genderEl.value = saved.gender || '';
      if (sectionEl) sectionEl.value = saved.section || '';
      updateProfileDisplay(saved);
    } else {
      // Pre-fill name from logged-in user
      const nameEl = document.getElementById('prof-name');
      if (nameEl && state.currentUser) nameEl.value = state.currentUser.name || '';
      const rollEl = document.getElementById('prof-roll');
      if (rollEl) { rollEl.readOnly = false; rollEl.style.opacity = '1'; }
      updateProfileDisplay(null);
    }
  } catch(e) {}
}

function updateProfileDisplay(profile) {
  const avatarEl = document.getElementById('profile-avatar-large');
  const nameEl = document.getElementById('profile-display-name');
  const rollEl = document.getElementById('profile-display-roll');
  if (!avatarEl) return;
  const name = (profile && profile.name) || (state.currentUser && state.currentUser.name) || 'You';
  const roll = (profile && profile.roll) || '';
  avatarEl.textContent = name.charAt(0).toUpperCase();
  if (nameEl) nameEl.textContent = name;
  if (rollEl) rollEl.textContent = roll ? `Roll: ${roll}` : 'Roll Number not set';
}

function saveStudentProfile() {
  const name = document.getElementById('prof-name')?.value?.trim();
  const roll = document.getElementById('prof-roll')?.value?.trim();
  const gender = document.getElementById('prof-gender')?.value;
  const section = document.getElementById('prof-section')?.value;

  if (!name || !roll || !section) {
    showNotification('Please fill in Name, Roll Number, and Section.', 'error');
    return;
  }

  const existing = JSON.parse(localStorage.getItem('studentProfile') || 'null');
  const profile = {
    name,
    roll: (existing && existing.roll) ? existing.roll : roll, // Keep existing roll if set
    gender,
    section
  };
  localStorage.setItem('studentProfile', JSON.stringify(profile));

  // Make roll read-only after save
  const rollEl = document.getElementById('prof-roll');
  if (rollEl) { rollEl.readOnly = true; rollEl.style.opacity = '0.7'; rollEl.value = profile.roll; }

  // Update sidebar name
  document.getElementById('sb-name').textContent = name;
  document.getElementById('sb-avatar').textContent = name.charAt(0).toUpperCase();

  updateProfileDisplay(profile);

  // Show save confirmation
  const msg = document.getElementById('profile-save-msg');
  if (msg) { msg.style.display = 'inline-flex'; setTimeout(() => { msg.style.display = 'none'; }, 3000); }

  showNotification('Profile saved successfully! ✅', 'success');
}

// ─── FEATURE 2: SMART AUTOFILL ────────────────────────────────────────
function autofillStudentForm() {
  try {
    const saved = JSON.parse(localStorage.getItem('studentProfile') || 'null');
    const rollEl       = document.getElementById('f-roll');
    const sectionEl    = document.getElementById('f-section');
    const banner       = document.getElementById('profile-incomplete-banner');
    const submitBtn    = document.getElementById('submit-req-btn');
    const hintMsg      = document.getElementById('f-roll-hint-msg');

    const profileComplete = saved && saved.roll && saved.name && saved.section;

    if (profileComplete) {
      // Fill and lock roll + section
      if (rollEl)    { rollEl.value = saved.roll; }
      if (sectionEl) { sectionEl.value = saved.section; sectionEl.disabled = true; sectionEl.style.opacity = '0.7'; sectionEl.style.cursor = 'not-allowed'; }
      if (banner)    { banner.style.display = 'none'; }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; submitBtn.style.cursor = ''; }
      if (hintMsg)   { hintMsg.textContent = 'Auto-filled from your profile. Cannot be changed here.'; }
    } else {
      // Profile missing — block the form
      if (rollEl)    { rollEl.value = ''; rollEl.placeholder = 'Set in My Profile first'; }
      if (sectionEl) { sectionEl.value = ''; sectionEl.disabled = true; sectionEl.style.opacity = '0.5'; }
      if (banner)    { banner.style.display = 'flex'; }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.45'; submitBtn.style.cursor = 'not-allowed'; }
      if (hintMsg)   { hintMsg.textContent = 'Please complete your profile first (Name, Roll Number, Section).'; }
    }
  } catch(e) {}
}

// ─── FEATURE 6: MULTI-PERIOD SELECTION ───────────────────────────────
function handlePeriodChange() {
  const periodSel = document.getElementById('f-period');
  const multiSection = document.getElementById('multi-period-section');
  if (!periodSel || !multiSection) return;

  if (periodSel.value === 'Custom — Multiple Periods') {
    multiSection.classList.add('visible');
  } else {
    multiSection.classList.remove('visible');
    // Reset all checkboxes when switching away
    document.querySelectorAll('#period-checkboxes input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      const label = cb.closest('.period-checkbox-item');
      if (label) label.classList.remove('checked');
    });
  }
}

function updatePeriodCheckboxStyle(checkbox) {
  const label = checkbox.closest('.period-checkbox-item');
  if (label) label.classList.toggle('checked', checkbox.checked);
}

function getSelectedPeriodValue() {
  const periodSel = document.getElementById('f-period');
  if (!periodSel) return '';

  if (periodSel.value === 'Custom — Multiple Periods') {
    const checked = Array.from(
      document.querySelectorAll('#period-checkboxes input[type="checkbox"]:checked')
    ).map(cb => cb.value);
    return checked.length > 0 ? checked.join(', ') : null; // null = validation failed
  }
  return periodSel.value;
}

// ─── FEATURE 4: FILE PREVIEW ──────────────────────────────────────────
function previewFile(fileObj, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !fileObj || !fileObj.dataUrl) return;

  if (container.dataset.previewFor === fileObj.name) {
    // Toggle off
    container.innerHTML = '';
    container.dataset.previewFor = '';
    return;
  }

  container.dataset.previewFor = fileObj.name;

  if (fileObj.type && fileObj.type.startsWith('image/')) {
    container.innerHTML = `<div class="file-preview-container"><img src="${fileObj.dataUrl}" alt="${fileObj.name}" /></div>`;
  } else if (fileObj.type === 'application/pdf') {
    container.innerHTML = `<div class="file-preview-container"><iframe src="${fileObj.dataUrl}" title="${fileObj.name}"></iframe></div>`;
  } else {
    container.innerHTML = `<div style="padding:10px;font-size:13px;color:var(--text3);">Preview not available for this file type. Use the download button.</div>`;
  }
}

// Close modals on overlay click
document.getElementById('hod-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeHodModal(); });
document.getElementById('edit-req-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeEditModal(); });
document.getElementById('req-detail-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeReqDetail(); });

// Escape key closes lightbox
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const lb = document.getElementById('hod-file-lightbox');
    if (lb && lb.classList.contains('open')) closeHodLightboxBtn();
  }
});

// ─── MOBILE SYSTEM ────────────────────────────────────────────
(function() {
  const BP = 640; // must match CSS breakpoint

  const MOB_PAGES = {
    student:  [
      { icon:'📊', label:'Home',     page:'page-student-dashboard' },
      { icon:'➕', label:'New',      page:'page-student-new' },
      { icon:'📅', label:'Calendar', page:'page-student-calendar' },
      { icon:'👤', label:'Profile',  page:'page-student-profile' },
    ],
    hod: [
      { icon:'📋', label:'Requests', page:'page-hod-dashboard' },
      { icon:'📅', label:'Calendar', page:'page-hod-calendar' },
      { icon:'👤', label:'Profile',  page:'page-hod-profile' },
    ],
    employee: [{ icon:'✅', label:'Approved', page:'page-faculty-dashboard' }],
    faculty:  [{ icon:'✅', label:'Approved', page:'page-faculty-dashboard' }],
    admin:    [
      { icon:'👩‍💼', label:'HODs',    page:'page-admin-hods' },
      { icon:'📂', label:'Requests', page:'page-admin-requests' },
    ],
  };

  const PAGE_TITLES = {
    'page-student-dashboard': 'Dashboard',
    'page-student-new':       'New Request',
    'page-student-calendar':  'Calendar',
    'page-student-profile':   'My Profile',
    'page-hod-dashboard':     'HOD Requests',
    'page-hod-calendar':      'Calendar',
    'page-hod-profile':       'My Profile',
    'page-faculty-dashboard': 'Approved Requests',
    'page-admin-hods':        'HOD Management',
    'page-admin-requests':    'All Requests',
  };

  function isMob() { return window.innerWidth <= BP; }

  /* ── Drawer ── */
  window.mobOpenDrawer = function() {
    document.getElementById('sidebar').classList.add('mob-open');
    document.getElementById('mob-backdrop').classList.add('mob-open');
    document.body.style.overflow = 'hidden';
  };
  window.mobCloseDrawer = function() {
    document.getElementById('sidebar').classList.remove('mob-open');
    document.getElementById('mob-backdrop').classList.remove('mob-open');
    document.body.style.overflow = '';
  };

  /* ── Build bottom nav ── */
  function buildNav() {
    const bar = document.getElementById('mob-bottom-nav');
    if (!bar) return;
    const role = state.currentUser?.role;
    const items = MOB_PAGES[role] || [];
    bar.innerHTML = items.map(it => `
      <button class="mob-nav-btn" data-page="${it.page}"
        onclick="showPage('${it.page}')">
        <span class="mn-icon">${it.icon}</span>
        <span>${it.label}</span>
      </button>`).join('');
    refreshNav();
  }

  /* ── Highlight active tab ── */
  function refreshNav() {
    const active = document.querySelector('.page.active')?.id;
    document.querySelectorAll('.mob-nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.page === active);
    });
    // update topbar title
    const titleEl = document.getElementById('mob-topbar-title');
    if (titleEl) titleEl.textContent = PAGE_TITLES[active] || 'CampusFlow';
    // sync theme button icon
    const thBtn = document.getElementById('mob-theme-btn');
    if (thBtn) thBtn.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '☀️' : '🌙';
  }

  /* ── Show/hide mobile chrome ── */
  function applyMobMode() {
    const mob = isMob();
    const topbar = document.getElementById('mob-topbar');
    if (topbar) topbar.style.display = mob ? 'flex' : 'none';
    // bottom nav visibility handled by CSS display:none/>640 / flex at <=640
  }

  /* ── Patch showPage ── */
  const _origShow = window.showPage;
  window.showPage = function(pageId) {
    _origShow(pageId);
    refreshNav();
    if (isMob()) mobCloseDrawer();
  };

  /* ── Patch initApp ── */
  const _origInit = window.initApp;
  window.initApp = function() {
    _origInit();
    buildNav();
    applyMobMode();
    refreshNav();
  };

  /* ── Patch doLogout ── */
  const _origLogout = window.doLogout;
  window.doLogout = function() {
    _origLogout();
    const bar = document.getElementById('mob-bottom-nav');
    if (bar) bar.innerHTML = '';
    const topbar = document.getElementById('mob-topbar');
    if (topbar) topbar.style.display = 'none';
  };

  /* ── Patch toggleTheme to sync button ── */
  const _origTheme = window.toggleTheme;
  window.toggleTheme = function() {
    _origTheme();
    const thBtn = document.getElementById('mob-theme-btn');
    if (thBtn) thBtn.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '☀️' : '🌙';
  };

  /* ── Close drawer on nav-item click ── */
  document.addEventListener('click', e => {
    if (isMob() && e.target.closest('.nav-item')) mobCloseDrawer();
  });

  /* ── Resize handler ── */
  window.addEventListener('resize', applyMobMode);

  applyMobMode();
})();
