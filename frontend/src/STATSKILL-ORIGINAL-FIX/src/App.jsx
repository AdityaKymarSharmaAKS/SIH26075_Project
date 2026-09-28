import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Download,
  FileCheck2,
  FileText,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Menu,
  Moon,
  PlayCircle,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  User,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import Login from "./login.jsx";
import Register from "./register.jsx";
import "./App.css";

const NAV = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "My Competencies", label: "My Competencies", icon: BarChart3 },
  { id: "Learning Path", label: "Learning Path", icon: TrendingUp },
  { id: "Assessments", label: "Assessments", icon: ClipboardList },
  { id: "My Documents", label: "My Documents", icon: FolderOpen },
  { id: "Certificates", label: "Certificates", icon: Award },
  { id: "Settings", label: "Settings", icon: Settings },
];

const COMPETENCIES = [
  { name: "Statistical Methods", score: 4.2, level: "Strong", trend: "Improving", icon: BarChart3, color: "green", desc: "Core statistical analysis, inference, regression and time-series methods." },
  { name: "Data Quality", score: 3.8, level: "Strong", trend: "Stable", icon: ShieldCheck, color: "blue", desc: "Validation, error detection, audit and data-quality assurance." },
  { name: "Python", score: 2.6, level: "Moderate", trend: "Improving", icon: FileText, color: "amber", desc: "Python for data analysis, automation and statistical workflows." },
  { name: "GIS", score: 1.8, level: "Weak", trend: "Improving", icon: Target, color: "red", desc: "Spatial datasets, GIS tools and geographic statistical analysis." },
  { name: "Machine Learning", score: 1.5, level: "Weak", trend: "Stable", icon: Zap, color: "purple", desc: "Predictive modelling and pattern recognition for official statistics." },
];

const MODULES = [
  { step: 1, title: "GIS Fundamentals", status: "Completed", state: "done", progress: 100, duration: "8 hrs", lessons: "6 / 6" },
  { step: 2, title: "GIS for Statistics", status: "In Progress", state: "active", progress: 55, duration: "10 hrs", lessons: "4 / 8" },
  { step: 3, title: "Spatial Analysis Techniques", status: "Locked", state: "locked", progress: 0, duration: "8 hrs", lessons: "0 / 7" },
  { step: 4, title: "Assessment & Certification", status: "Locked", state: "locked", progress: 0, duration: "6 hrs", lessons: "0 / 3" },
];

const ASSESSMENTS = [
  { title: "Sampling Techniques Quiz", date: "18 MAY", time: "10:00 AM – 10:45 AM", color: "blue" },
  { title: "Data Quality Assessment 2", date: "22 MAY", time: "02:00 PM – 02:45 PM", color: "amber" },
  { title: "Python Basics Test 2", date: "26 MAY", time: "11:00 AM – 11:45 AM", color: "green" },
];

const DOCUMENTS = [
  ["DOC-001", "Statistical Methods – Study Notes.pdf", "Learning Materials", "2.4 MB"],
  ["DOC-002", "Data Quality Framework – MoSPI Guidelines.pdf", "Learning Materials", "1.8 MB"],
  ["DOC-003", "GIS Fundamentals – Assessment Report.pdf", "Assessments", "0.9 MB"],
  ["DOC-004", "Python Pandas Cheatsheet.pdf", "Learning Materials", "0.5 MB"],
  ["DOC-005", "Statistical Methods Fundamentals – Certificate.pdf", "Certificates", "0.3 MB"],
  ["DOC-006", "Q1 2026 Competency Progress Report.pdf", "Reports", "1.2 MB"],
];

const CERTIFICATES = [
  { title: "Statistical Methods Fundamentals", issuer: "StatSkill AI Academy", issued: "12 Jan 2026", expires: "12 Jan 2028", status: "Active", color: "green" },
  { title: "Data Quality Assurance", issuer: "StatSkill AI Academy", issued: "03 Mar 2026", expires: "03 Mar 2028", status: "Active", color: "blue" },
  { title: "GIS Fundamentals", issuer: "StatSkill AI Academy", issued: "28 Apr 2026", expires: "28 Apr 2027", status: "Expiring Soon", color: "amber" },
  { title: "GIS for Statistics", issuer: "StatSkill AI Academy", issued: "—", expires: "—", status: "In Progress", color: "blue", progress: 55 },
];

const DICTIONARY = {
  en: {
    dashboard: "Dashboard",
    competencies: "My Competencies",
    path: "Learning Path",
    assessments: "Assessments",
    documents: "My Documents",
    certificates: "Certificates",
    settings: "Settings",
    hello: "Hello",
    online: "SYSTEM ONLINE",
    command: "SYSTEM COMMAND CENTER",
    role: "Statistical Investigator",
    competency: "Overall Competency",
    gaps: "Critical Skill Gaps",
    learning: "Learning Progress",
    completed: "Assessments Completed",
    strong: "Strong",
    moderate: "Moderate",
    weak: "Weak",
    continue: "Continue Learning",
    viewAll: "View All",
    upcoming: "Upcoming Assessments",
    recommendation: "Recommended for You",
    insight: "AI Insight",
    profile: "Profile Settings",
    language: "Language",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    save: "Save Changes",
    displayName: "Display Name",
    department: "Department",
    signOut: "Sign Out",
    search: "Search",
    completedModules: "Modules Completed",
    hours: "Hours Completed",
    completion: "Estimated Completion",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    competencies: "मेरी दक्षताएँ",
    path: "लर्निंग पाथ",
    assessments: "मूल्यांकन",
    documents: "मेरे दस्तावेज़",
    certificates: "प्रमाणपत्र",
    settings: "सेटिंग्स",
    hello: "नमस्ते",
    online: "सिस्टम ऑनलाइन",
    command: "सिस्टम कमांड सेंटर",
    role: "सांख्यिकी अन्वेषक",
    competency: "कुल दक्षता",
    gaps: "महत्वपूर्ण कौशल अंतर",
    learning: "लर्निंग प्रगति",
    completed: "पूर्ण मूल्यांकन",
    strong: "मज़बूत",
    moderate: "मध्यम",
    weak: "कमज़ोर",
    continue: "सीखना जारी रखें",
    viewAll: "सभी देखें",
    upcoming: "आगामी मूल्यांकन",
    recommendation: "आपके लिए अनुशंसित",
    insight: "AI अंतर्दृष्टि",
    profile: "प्रोफ़ाइल सेटिंग्स",
    language: "भाषा",
    theme: "थीम",
    dark: "डार्क",
    light: "लाइट",
    save: "बदलाव सहेजें",
    displayName: "डिस्प्ले नाम",
    department: "विभाग",
    signOut: "साइन आउट",
    search: "खोजें",
    completedModules: "पूर्ण मॉड्यूल",
    hours: "पूर्ण घंटे",
    completion: "अनुमानित पूर्णता",
  },
};

function tr(lang, key) {
  return DICTIONARY[lang]?.[key] || DICTIONARY.en[key] || key;
}

function safeUser() {
  try {
    return JSON.parse(localStorage.getItem("statSkillUser") || "null");
  } catch {
    return null;
  }
}

function SystemCard({ children, className = "" }) {
  return <section className={`system-card ${className}`}>{children}</section>;
}

function Progress({ value, color = "cyan" }) {
  const width = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="progress">
      <span className={`progress-fill ${color} p-${width}`} />
    </div>
  );
}

function Pill({ children, tone = "neutral" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function PageHeading({ kicker, title, subtitle, actions }) {
  return (
    <div className="page-heading system-card">
      <div>
        <div className="kicker">{kicker}</div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  );
}

function StatCard({ label, value, suffix, meta, color = "cyan", icon: Icon }) {
  return (
    <SystemCard className={`stat-card ${color}`}>
      <div className="stat-card-top">
        <span>{label}</span>
        <span className="stat-icon"><Icon size={18} /></span>
      </div>
      <div className="stat-value">{value}<small>{suffix}</small></div>
      <div className="stat-meta">{meta}</div>
      <Progress value={typeof value === "number" ? value : 0} color={color} />
    </SystemCard>
  );
}

function DashboardPage({ user, lang, onNavigate }) {
  return (
    <div className="stack">
      <PageHeading
        kicker={tr(lang, "command")}
        title={`${tr(lang, "hello")}, ${user.name || "Investigator"}.`}
        subtitle={`${tr(lang, "role")} · ${user.department || "MoSPI"} · SIH26101`}
        actions={<Pill tone="online"><Activity size={12} /> {tr(lang, "online")}</Pill>}
      />

      <div className="stats-grid">
        <StatCard label={tr(lang, "competency")} value={72} suffix="/100" meta="Strong trajectory" color="cyan" icon={Target} />
        <StatCard label={tr(lang, "gaps")} value={2} meta="GIS · ML need attention" color="red" icon={AlertTriangle} />
        <StatCard label={tr(lang, "learning")} value={65} suffix="%" meta="On track" color="green" icon={TrendingUp} />
        <StatCard label={tr(lang, "completed")} value={8} suffix="/15" meta="Recommended assessments" color="purple" icon={ClipboardCheck} />
      </div>

      <div className="hero-grid">
        <SystemCard className="player-card">
          <div className="system-label">PLAYER STATUS / 01</div>
          <div className="player-layout">
            <div className="avatar-xl">{(user.name || "A")[0]}</div>
            <div className="player-info">
              <div className="player-name">{user.name || "Aditya"}</div>
              <div className="player-role">{user.role || tr(lang, "role")}</div>
              <div className="rank-line"><span>RANK</span><strong>A</strong><span>LEVEL</span><strong>72</strong></div>
              <div className="xp-row"><span>XP</span><Progress value={72} color="cyan" /><strong>72%</strong></div>
            </div>
          </div>
          <div className="metric-strip">
            <div><span>STRENGTH</span><strong>4.2</strong></div>
            <div><span>DATA QUALITY</span><strong>3.8</strong></div>
            <div><span>GIS</span><strong>1.8</strong></div>
            <div><span>ML</span><strong>1.5</strong></div>
          </div>
        </SystemCard>

        <SystemCard className="recommendation-card">
          <div className="system-label">{tr(lang, "recommendation")}</div>
          <div className="recommendation-title"><Sparkles size={18} /> Complete GIS for Statistics</div>
          <p>Your strongest opportunity is closing the GIS competency gap. Continue the active module to raise spatial-analysis readiness.</p>
          <div className="recommendation-box">
            <div><span>ACTIVE MODULE</span><strong>GIS for Statistics</strong></div>
            <Progress value={55} color="cyan" />
            <span className="progress-label">55% complete</span>
          </div>
          <button className="primary-btn" onClick={() => onNavigate("Learning Path")}>
            {tr(lang, "continue")} <ChevronRight size={16} />
          </button>
        </SystemCard>
      </div>

      <div className="three-grid">
        <SystemCard>
          <div className="card-header"><div><div className="system-label">COMPETENCY MATRIX</div><h2>{tr(lang, "competencies")}</h2></div><button className="ghost-btn" onClick={() => onNavigate("My Competencies")}>{tr(lang, "viewAll")} <ChevronRight size={14} /></button></div>
          <div className="compact-list">
            {COMPETENCIES.map((item) => {
              const Icon = item.icon;
              return <div className="compact-row" key={item.name}>
                <div className={`mini-icon ${item.color}`}><Icon size={15} /></div>
                <div className="grow"><strong>{item.name}</strong><Progress value={item.score * 20} color={item.color} /></div>
                <strong className={`score ${item.color}`}>{item.score.toFixed(1)}</strong>
              </div>;
            })}
          </div>
        </SystemCard>

        <SystemCard>
          <div className="card-header"><div><div className="system-label">TRAINING PIPELINE</div><h2>{tr(lang, "path")}</h2></div><button className="ghost-btn" onClick={() => onNavigate("Learning Path")}>{tr(lang, "viewAll")} <ChevronRight size={14} /></button></div>
          <div className="timeline">
            {MODULES.map((m) => <div className="timeline-row" key={m.step}>
              <div className={`timeline-node ${m.state}`}>{m.state === "done" ? <Check size={13} /> : m.state === "locked" ? <Lock size={12} /> : m.step}</div>
              <div className="grow"><strong>{m.title}</strong><span>{m.status} · {m.duration}</span></div>
              {m.state !== "locked" && <div className="mini-progress"><Progress value={m.progress} color={m.state === "done" ? "green" : "cyan"} /></div>}
            </div>)}
          </div>
        </SystemCard>

        <SystemCard>
          <div className="card-header"><div><div className="system-label">SCHEDULE</div><h2>{tr(lang, "upcoming")}</h2></div><CalendarDays size={17} /></div>
          <div className="assessment-list">
            {ASSESSMENTS.map((a) => <div className={`assessment ${a.color}`} key={a.title}>
              <div className="assessment-date">{a.date}</div>
              <div className="grow"><strong>{a.title}</strong><span>{a.time}</span></div>
            </div>)}
          </div>
        </SystemCard>
      </div>

      <SystemCard className="insight-card">
        <div className="insight-icon"><Sparkles size={22} /></div>
        <div className="grow"><div className="system-label">{tr(lang, "insight")}</div><h2>Competency trajectory is positive</h2><p>Strong performance in Statistical Methods and Data Quality gives a solid foundation. The fastest score improvement should come from finishing GIS for Statistics and strengthening Python.</p></div>
        <button className="secondary-btn" onClick={() => onNavigate("My Competencies")}>Open Analysis <ChevronRight size={14} /></button>
      </SystemCard>
    </div>
  );
}

function CompetenciesPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => COMPETENCIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="stack">
      <PageHeading kicker="COMPETENCY ENGINE" title="My Competencies" subtitle="Detailed view of assessed skill domains and current readiness." actions={<div className="search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search competencies" /></div>} />
      <div className="summary-grid">
        <SystemCard className="summary-card"><span>SKILLS ASSESSED</span><strong>5</strong></SystemCard>
        <SystemCard className="summary-card"><span>STRONG SKILLS</span><strong className="green">2</strong></SystemCard>
        <SystemCard className="summary-card"><span>NEED IMPROVEMENT</span><strong className="amber">3</strong></SystemCard>
        <SystemCard className="summary-card"><span>AVERAGE SCORE</span><strong className="cyan">2.8 / 5</strong></SystemCard>
      </div>
      <SystemCard>
        <div className="card-header"><div><div className="system-label">SKILL MATRIX</div><h2>Current readiness</h2></div><Pill>5 domains</Pill></div>
        <div className="detail-list">
          {filtered.map((item) => {
            const Icon = item.icon;
            const open = selected === item.name;
            return <div className={`detail-row ${open ? "open" : ""}`} key={item.name}>
              <button className="detail-trigger" onClick={() => setSelected(open ? null : item.name)}>
                <div className={`mini-icon ${item.color}`}><Icon size={16} /></div>
                <div className="grow"><strong>{item.name}</strong><span>{item.desc}</span><Progress value={item.score * 20} color={item.color} /></div>
                <div className="detail-score"><strong>{item.score.toFixed(1)}</strong><Pill tone={item.level.toLowerCase()}>{item.level}</Pill></div>
                <ChevronDown size={15} className={open ? "rotate" : ""} />
              </button>
              {open && <div className="detail-body"><div><span>Trend</span><strong>{item.trend}</strong></div><div><span>Last assessment</span><strong>10 May 2026</strong></div><div><span>Priority</span><strong>{item.level === "Weak" ? "High" : "Normal"}</strong></div></div>}
            </div>;
          })}
        </div>
      </SystemCard>
    </div>
  );
}

function LearningPage() {
  return <div className="stack">
    <PageHeading kicker="TRAINING PIPELINE" title="Learning Path" subtitle="GIS & Spatial Statistics Track" />
    <SystemCard className="track-banner">
      <div><div className="system-label">ACTIVE TRACK</div><h2>GIS & Spatial Statistics Track</h2><p>1 of 4 modules completed · 12 / 32 hours completed</p></div>
      <div className="track-ring">38%</div>
    </SystemCard>
    <div className="module-grid">
      {MODULES.map((m) => <SystemCard key={m.step} className={`module-card ${m.state}`}>
        <div className="module-top"><span className="module-number">0{m.step}</span><Pill tone={m.state === "done" ? "strong" : m.state === "active" ? "active" : "locked"}>{m.status}</Pill></div>
        <h2>{m.title}</h2><p>Structured module with practical lessons, domain exercises and assessment checkpoints.</p>
        <div className="module-meta"><span>{m.duration}</span><span>{m.lessons} lessons</span></div>
        <Progress value={m.progress} color={m.state === "done" ? "green" : "cyan"} />
        <button className={m.state === "locked" ? "secondary-btn disabled" : "primary-btn"} disabled={m.state === "locked"}>{m.state === "locked" ? <Lock size={14} /> : <PlayCircle size={14} />}{m.state === "done" ? "Review Module" : m.state === "active" ? "Continue Module" : "Locked"}</button>
      </SystemCard>)}
    </div>
  </div>;
}

function AssessmentsPage() {
  return <div className="stack">
    <PageHeading kicker="ASSESSMENT CONTROL" title="Assessments" subtitle="Upcoming and completed competency checkpoints." />
    <div className="stats-grid three">
      <StatCard label="Completed" value={8} suffix="/15" meta="Recommended" color="green" icon={CheckCircle2} />
      <StatCard label="Average Score" value={78} suffix="%" meta="Across completed tests" color="cyan" icon={Target} />
      <StatCard label="Next Assessment" value="18" suffix=" MAY" meta="Sampling Techniques" color="purple" icon={CalendarDays} />
    </div>
    <SystemCard><div className="card-header"><div><div className="system-label">UPCOMING QUEUE</div><h2>Next checkpoints</h2></div></div><div className="assessment-list large">{ASSESSMENTS.map((a, i) => <div className={`assessment ${a.color}`} key={a.title}><div className="assessment-number">0{i + 1}</div><div className="grow"><strong>{a.title}</strong><span>{a.time} · 45 min</span></div><button className="secondary-btn">Open Details <ChevronRight size={14} /></button></div>)}</div></SystemCard>
  </div>;
}

function DocumentsPage() {
  const [query, setQuery] = useState("");
  const filtered = DOCUMENTS.filter(d => `${d[1]} ${d[2]}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="stack">
    <PageHeading kicker="DOCUMENT VAULT" title="My Documents" subtitle="Central workspace for learning materials, reports and certificates." actions={<div className="search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search documents" /></div>} />
    <div className="summary-grid three">
      <SystemCard className="summary-card"><span>TOTAL DOCUMENTS</span><strong>12</strong></SystemCard>
      <SystemCard className="summary-card"><span>SHARED</span><strong className="purple">3</strong></SystemCard>
      <SystemCard className="summary-card"><span>ADDED THIS MONTH</span><strong className="green">4</strong></SystemCard>
    </div>
    <SystemCard><div className="document-table"><div className="table-head"><span>Document</span><span>Category</span><span>Size</span><span>Action</span></div>{filtered.map(d => <div className="table-row" key={d[0]}><div className="doc-name"><div className="file-icon"><FileText size={16} /></div><div><strong>{d[1]}</strong><span>{d[0]}</span></div></div><span>{d[2]}</span><span>{d[3]}</span><button className="icon-btn" title="Download"><Download size={15} /></button></div>)}</div></SystemCard>
  </div>;
}

function CertificatesPage() {
  return <div className="stack">
    <PageHeading kicker="CREDENTIAL LEDGER" title="Certificates" subtitle="Track earned and in-progress credentials." />
    <div className="summary-grid three">
      <SystemCard className="summary-card"><span>CERTIFICATES EARNED</span><strong className="green">3</strong></SystemCard>
      <SystemCard className="summary-card"><span>IN PROGRESS</span><strong className="cyan">1</strong></SystemCard>
      <SystemCard className="summary-card"><span>EXPIRING SOON</span><strong className="amber">1</strong></SystemCard>
    </div>
    <div className="certificate-grid">
      {CERTIFICATES.map(c => <SystemCard className="certificate-card" key={c.title}>
        <div className="certificate-top"><div className={`mini-icon ${c.color}`}><Award size={17} /></div><Pill tone={c.color === "green" ? "strong" : c.color === "amber" ? "warning" : "active"}>{c.status}</Pill></div>
        <h2>{c.title}</h2><p>{c.issuer}</p>
        {c.progress ? <><Progress value={c.progress} color="cyan" /><div className="stat-meta">{c.progress}% complete</div></> : <div className="certificate-meta"><span>Issued<strong>{c.issued}</strong></span><span>Expires<strong>{c.expires}</strong></span></div>}
        <button className="secondary-btn"><ShieldCheck size={14} /> {c.progress ? "Continue Track" : "Verify Credential"}</button>
      </SystemCard>)}
    </div>
  </div>;
}

function SettingsPage({ user, darkMode, setDarkMode, lang, setLang }) {
  const [name, setName] = useState(user.name || "");
  const [saved, setSaved] = useState(false);
  const save = () => {
    const next = { ...user, name };
    localStorage.setItem("statSkillUser", JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  return <div className="stack">
    <PageHeading kicker="SYSTEM CONFIGURATION" title={tr(lang, "settings")} subtitle="Tune your profile, language and visual mode." />
    <div className="settings-grid">
      <SystemCard>
        <div className="system-label">PROFILE</div>
        <h2>{tr(lang, "profile")}</h2>
        <label className="field-label">{tr(lang, "displayName")}<input value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="field-label">Email<input value={user.email || ""} readOnly /></label>
        <label className="field-label">{tr(lang, "department")}<input value={user.department || "MoSPI"} readOnly /></label>
        <button className="primary-btn" onClick={save}><Save size={14} /> {tr(lang, "save")}</button>
        {saved && <div className="save-note"><CheckCircle2 size={14} /> Saved</div>}
      </SystemCard>
      <SystemCard>
        <div className="system-label">INTERFACE</div>
        <h2>Appearance</h2>
        <div className="setting-row"><div><strong>{tr(lang, "theme")}</strong><span>Switch between dashboard modes.</span></div><button className="theme-switch" onClick={() => setDarkMode(v => !v)}>{darkMode ? <Moon size={15} /> : <Sun size={15} />} {darkMode ? tr(lang, "dark") : tr(lang, "light")}</button></div>
        <div className="setting-row"><div><strong>{tr(lang, "language")}</strong><span>All core dashboard labels update.</span></div><div className="language-buttons"><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button><button className={lang === "hi" ? "active" : ""} onClick={() => setLang("hi")}>HI</button></div></div>
      </SystemCard>
    </div>
    <SystemCard className="security-card"><ShieldCheck size={22} /><div><div className="system-label">SECURITY STATUS</div><h2>Local demo environment</h2><p>This front-end stores the demo profile in browser localStorage. Connect your production authentication/API layer before deployment.</p></div></SystemCard>
  </div>;
}

function Sidebar({ active, setActive, open, setOpen, lang, user, onLogout }) {
  return <aside className={`sidebar ${open ? "open" : ""}`}>
    <div className="brand">
      <div className="brand-mark"><BarChart3 size={20} /></div>
      <div><strong>StatSkill AI</strong><span>SIH26101 · MoSPI</span></div>
    </div>
    <div className="sidebar-status"><span className="live-dot" /> {tr(lang, "online")}</div>
    <nav>{NAV.map(item => { const Icon = item.icon; return <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => { setActive(item.id); setOpen(false); }}><Icon size={17} /><span>{tr(lang, item.id === "Dashboard" ? "dashboard" : item.id === "My Competencies" ? "competencies" : item.id === "Learning Path" ? "path" : item.id === "Assessments" ? "assessments" : item.id === "My Documents" ? "documents" : item.id === "Certificates" ? "certificates" : "settings")}</span>{active === item.id && <ChevronRight size={13} />}</button>; })}</nav>
    <div className="sidebar-spacer" />
    <div className="sidebar-player">
      <div className="small-label">PLAYER</div><strong>{user.name || "Investigator"}</strong><span>{user.role || "Statistical Investigator"}</span><Progress value={72} color="cyan" /><div className="player-bottom"><span>LV. 72</span><span>RANK A</span></div>
    </div>
    <button className="logout-btn" onClick={onLogout}><X size={15} /> {tr(lang, "signOut")}</button>
  </aside>;
}

export default function App() {
  const [user, setUser] = useState(() => safeUser());
  const [loggedIn, setLoggedIn] = useState(() => Boolean(safeUser()?.email));
  const [register, setRegister] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("statSkillTheme") === "dark");
  const [lang, setLang] = useState(() => localStorage.getItem("statSkillLanguage") || "en");

  const handleLogin = ({ email, password }) => {
    const stored = safeUser();
    if (!stored) {
      alert("No account found. Please create an account first.");
      return;
    }
    if (stored.email?.toLowerCase() !== email.trim().toLowerCase() || stored.password !== password) {
      alert("Invalid email or password.");
      return;
    }
    setUser(stored);
    setLoggedIn(true);
  };

  const handleRegister = data => {
    const next = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role: "Statistical Investigator",
      department: "MoSPI",
      projectId: "SIH26101",
    };
    localStorage.setItem("statSkillUser", JSON.stringify(next));
    setUser(next);
    setLoggedIn(true);
    setRegister(false);
  };

  const setTheme = value => {
    setDarkMode(value);
    localStorage.setItem("statSkillTheme", value ? "dark" : "light");
  };

  const setLanguage = value => {
    setLang(value);
    localStorage.setItem("statSkillLanguage", value);
  };

  const logout = () => {
    setLoggedIn(false);
    setMenuOpen(false);
  };

  if (!loggedIn) {
    return register
      ? <Register onRegister={handleRegister} onBackToLogin={() => setRegister(false)} />
      : <Login onLogin={handleLogin} onRegister={() => setRegister(true)} />;
  }

  const content = {
    Dashboard: <DashboardPage user={user || {}} lang={lang} onNavigate={setActive} />,
    "My Competencies": <CompetenciesPage />,
    "Learning Path": <LearningPage />,
    Assessments: <AssessmentsPage />,
    "My Documents": <DocumentsPage />,
    Certificates: <CertificatesPage />,
    Settings: <SettingsPage user={user || {}} darkMode={darkMode} setDarkMode={setTheme} lang={lang} setLang={setLanguage} />,
  }[active] || null;

  return <div className={`app-shell ${darkMode ? "dark" : ""}`}>
    <Sidebar active={active} setActive={setActive} open={menuOpen} setOpen={setMenuOpen} lang={lang} user={user || {}} onLogout={logout} />
    {menuOpen && <button className="overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    <div className="main-area">
      <header className="topbar">
        <div className="topbar-left"><button className="menu-btn" onClick={() => setMenuOpen(v => !v)}><Menu size={18} /></button><div><div className="eyebrow">STATSKILL / {active.toUpperCase()}</div><strong>{tr(lang, active === "Dashboard" ? "dashboard" : active === "My Competencies" ? "competencies" : active === "Learning Path" ? "path" : active === "Assessments" ? "assessments" : active === "My Documents" ? "documents" : active === "Certificates" ? "certificates" : "settings")}</strong></div></div>
        <div className="topbar-actions">
          <div className="status-chip"><span className="live-dot" /> Live</div>
          <button className="icon-btn" title="Help"><HelpCircle size={16} /></button>
          <button className="icon-btn notification" title="Notifications"><Bell size={16} /><i>2</i></button>
          <button className="profile-chip" onClick={() => setActive("Settings")}><span>{(user?.name || "A")[0]}</span><strong>{user?.name || "Aditya"}</strong><ChevronDown size={13} /></button>
        </div>
      </header>
      <main>{content}</main>
    </div>
  </div>;
}
