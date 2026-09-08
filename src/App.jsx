import Login from "./Login.jsx";
import Register from "./register";
import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, BarChart3, TrendingUp, ClipboardList, FileText,
  Award, Settings, Bell, ChevronDown, HelpCircle, AlertCircle,
  CheckCircle2, PlayCircle, Lock, Lightbulb, Menu, Download,
  ShieldCheck, CalendarDays, Search, Star, Clock, BookOpen,
  ChevronRight, Trophy, Zap, GraduationCap, MapPin, RefreshCw,
  Brain, Sparkles, Key, Eye, EyeOff, ArrowUp, ArrowDown, Minus,
  AlertTriangle, Save, Database, Activity,
  Upload, FolderOpen, Filter, User, Globe, Moon, Sun,
  BellOff, Palette, Share2, MoreVertical, Folder, Percent,
  FileCheck, FilePlus, Pencil, ToggleLeft, ToggleRight,
  ClipboardCheck, Timer, BarChart2, XCircle
} from "lucide-react";

/* ================================================================
   KARMAYOGI RAW DATA  — iGOT Karmayogi API response format
   This JSON is what the platform receives from the Karmayogi API.
   Edit here or fetch live via the Karmayogi API key in Settings.
   Claude AI reads this and computes all scores shown in the UI.
================================================================ */
const DEFAULT_KARMAYOGI_JSON = {
  user: {
    id: "MOS-2024-0847",
    name: "",
    role: "Statistical Investigator",
    department: "MoSPI",
    joiningDate: "2024-03-15",
    projectId: "SIH26101"
  },
  courseCompletions: [
    { courseId:"SM-001", title:"Introduction to Statistical Methods",  score:88, completedOn:"2026-01-15", durationHrs:12, domain:"statisticalMethods" },
    { courseId:"SM-002", title:"Advanced Regression Techniques",        score:79, completedOn:"2026-02-20", durationHrs:8,  domain:"statisticalMethods" },
    { courseId:"SM-003", title:"Time Series Analysis",                  score:85, completedOn:"2026-03-01", durationHrs:6,  domain:"statisticalMethods" },
    { courseId:"DQ-001", title:"Data Quality Fundamentals",             score:85, completedOn:"2026-01-28", durationHrs:6,  domain:"dataQuality" },
    { courseId:"DQ-002", title:"Data Validation & Auditing",            score:75, completedOn:"2026-03-05", durationHrs:5,  domain:"dataQuality" },
    { courseId:"GIS-001",title:"GIS Fundamentals",                      score:88, completedOn:"2026-04-28", durationHrs:8,  domain:"gis" },
    { courseId:"PY-001", title:"Python Basics",                         score:62, completedOn:"2026-03-12", durationHrs:10, domain:"python" },
    { courseId:"PY-002", title:"Pandas for Data Analysis",              score:55, completedOn:"2026-04-01", durationHrs:8,  domain:"python" }
  ],
  assessmentScores: [
    { id:"ASS-001", title:"Statistical Methods Quiz 1",   score:78, date:"2026-01-20", domain:"statisticalMethods" },
    { id:"ASS-002", title:"Statistical Methods Quiz 2",   score:84, date:"2026-02-25", domain:"statisticalMethods" },
    { id:"ASS-003", title:"Data Quality Assessment",      score:80, date:"2026-03-10", domain:"dataQuality" },
    { id:"ASS-004", title:"GIS Fundamentals Assessment",  score:88, date:"2026-04-30", domain:"gis" },
    { id:"ASS-005", title:"Python Basics Test",           score:60, date:"2026-03-15", domain:"python" }
  ],
  upcomingAssessments: [
    { id:"ASS-006", title:"Sampling Techniques Quiz",    date:"2026-05-18", time:"10:00 AM - 10:45 AM", color:"blue" },
    { id:"ASS-007", title:"Data Quality Assessment 2",   date:"2026-05-22", time:"02:00 PM - 02:45 PM", color:"amber" },
    { id:"ASS-008", title:"Python Basics Test 2",        date:"2026-05-26", time:"11:00 AM - 11:45 AM", color:"green" }
  ],
  learningHoursPerDomain: {
    statisticalMethods:32, dataQuality:18, python:24, gis:20, machineLearning:4
  },
  selfAssessmentRatings: {
    statisticalMethods: { descriptiveStats:4, hypothesisTesting:4, regression:3, timeSeries:4 },
    dataQuality:        { validation:4, errorDetection:3, imputation:3, audit:4 },
    python:             { pandas:3, visualisation:2, scripting:2, statisticalLibs:2 },
    gis:                { mapProjections:2, spatialJoins:1, qgisTools:2, choropleth:2 },
    machineLearning:    { supervisedLearning:1, modelEvaluation:1, featureEngineering:1, mlFrameworks:1 }
  },
  currentLearningPath: {
    trackName:"GIS & Spatial Statistics Track",
    totalModules:4, completedModules:1,
    activeModule:"GIS for Statistics", activeModuleProgress:55
  }
};

/* ================================================================
   STATIC DATA
================================================================ */
const CERTIFICATES_DATA = {
  summary: [
    { id:"earned",     label:"Certificates Earned", value:3, color:"green",  icon:"award"    },
    { id:"inprogress", label:"In Progress",          value:1, color:"blue",   icon:"clock"    },
    { id:"expiring",   label:"Expiring Soon",        value:1, color:"amber",  icon:"alert"    }
  ],
  certificates: [
    { title:"Statistical Methods Fundamentals", issuer:"StatSkill AI Academy", issued:"12 Jan 2026", expires:"12 Jan 2028", credentialId:"SSA-SM-2026-0417",  status:"active",      icon:"bars"   },
    { title:"Data Quality Assurance",            issuer:"StatSkill AI Academy", issued:"03 Mar 2026", expires:"03 Mar 2028", credentialId:"SSA-DQ-2026-0892",  status:"active",      icon:"shield" },
    { title:"GIS Fundamentals",                  issuer:"StatSkill AI Academy", issued:"28 Apr 2026", expires:"28 Apr 2027", credentialId:"SSA-GIS-2026-1350", status:"expiring",    icon:"gis"    },
    { title:"GIS for Statistics",                issuer:"StatSkill AI Academy", issued:null,          expires:null,          credentialId:null,                 status:"in-progress", progress:55, icon:"trend" },
    { title:"Python for Data Analysis",          issuer:"StatSkill AI Academy", issued:null,          expires:null,          credentialId:null,                 status:"locked",      icon:"python" },
    { title:"ML in Official Statistics",         issuer:"StatSkill AI Academy", issued:null,          expires:null,          credentialId:null,                 status:"locked",      icon:"ml"     }
  ]
};

const LP_DATA = {
  track: { title:"GIS & Spatial Statistics Track", totalModules:4, completedModules:1, totalHours:32, completedHours:12 },
  modules: [
    { step:1, title:"GIS Fundamentals",            description:"Introduction to GIS – coordinate systems, map projections, and spatial datasets for official statistics.",                                                              state:"done",   status:"Completed",   duration:"8 hrs",  lessons:6, completedLessons:6, score:88, completedOn:"28 Apr 2026", topics:["Coordinate Systems","Map Projections","Spatial Data Formats","QGIS Basics","Data Import/Export","Assessment"] },
    { step:2, title:"GIS for Statistics",           description:"Using GIS tools to prepare spatial statistical data, integrate census boundaries and produce publication-ready maps.",                                                  state:"active", status:"In Progress", duration:"10 hrs", lessons:8, completedLessons:4, progress:55,                 topics:["Boundary Files","Statistical Overlays","Choropleth Maps","Spatial Joins","Error Checking","Case Study","Visualisation","Assessment"] },
    { step:3, title:"Spatial Analysis Techniques",  description:"Advanced spatial analysis including clustering, interpolation, and integration with Python-based GIS workflows.",                                                       state:"locked", status:"Not Started", duration:"8 hrs",  lessons:7,                                              topics:["Cluster Analysis","Interpolation","Network Analysis","Hotspot Mapping","Python + GIS","Case Study","Assessment"] },
    { step:4, title:"Assessment & Certification",   description:"Comprehensive assessment covering all GIS modules, followed by the official StatSkill GIS Certificate examination.",                                                    state:"locked", status:"Not Started", duration:"6 hrs",  lessons:3,                                              topics:["Revision","Practical Exam","Certificate Assessment"] }
  ]
};

const NAV_ITEMS = [
  { label:"Dashboard",       icon:"dashboard"    },
  { label:"My Competencies", icon:"competencies" },
  { label:"Learning Path",   icon:"path"         },
  { label:"Assessments",     icon:"assessments"  },
  { label:"My Documents",    icon:"documents"    },
  { label:"Certificates",    icon:"certificates" },
  { label:"Settings",        icon:"settings"     }
];

/* ================================================================
   DOCUMENTS DATA
================================================================ */
const DOCUMENTS_DATA = {
  summary: [
    { id:"total",  label:"Total Documents", value:12, color:"blue",   icon:"folder"  },
    { id:"shared", label:"Shared",           value:3,  color:"purple", icon:"share"   },
    { id:"recent", label:"Added This Month", value:4,  color:"green",  icon:"new"     }
  ],
  categories: ["All","Learning Materials","Assessments","Certificates","Reports"],
  documents: [
    { id:"DOC-001", name:"Statistical Methods – Study Notes.pdf",        type:"pdf",  category:"Learning Materials", size:"2.4 MB", uploadedOn:"12 Jan 2026", sharedWith:2, tag:"SM"  },
    { id:"DOC-002", name:"Data Quality Framework – MoSPI Guidelines.pdf",type:"pdf",  category:"Learning Materials", size:"1.8 MB", uploadedOn:"15 Jan 2026", sharedWith:0, tag:"DQ"  },
    { id:"DOC-003", name:"GIS Fundamentals – Assessment Report.pdf",      type:"pdf",  category:"Assessments",        size:"0.9 MB", uploadedOn:"30 Apr 2026", sharedWith:1, tag:"GIS" },
    { id:"DOC-004", name:"Python Pandas Cheatsheet.pdf",                  type:"pdf",  category:"Learning Materials", size:"0.5 MB", uploadedOn:"08 Mar 2026", sharedWith:3, tag:"PY"  },
    { id:"DOC-005", name:"Statistical Methods Fundamentals – Certificate.pdf", type:"cert", category:"Certificates", size:"0.3 MB", uploadedOn:"13 Jan 2026", sharedWith:0, tag:"SM"  },
    { id:"DOC-006", name:"Q1 2026 Competency Progress Report.pdf",        type:"pdf",  category:"Reports",            size:"1.2 MB", uploadedOn:"01 Apr 2026", sharedWith:4, tag:"RPT" },
    { id:"DOC-007", name:"GIS for Statistics – Lesson Notes.docx",        type:"docx", category:"Learning Materials", size:"0.8 MB", uploadedOn:"10 May 2026", sharedWith:0, tag:"GIS" },
    { id:"DOC-008", name:"Data Quality Assurance – Certificate.pdf",      type:"cert", category:"Certificates",       size:"0.3 MB", uploadedOn:"04 Mar 2026", sharedWith:0, tag:"DQ"  },
    { id:"DOC-009", name:"Sampling Techniques – Practice Questions.docx", type:"docx", category:"Assessments",        size:"0.6 MB", uploadedOn:"14 May 2026", sharedWith:1, tag:"SM"  },
    { id:"DOC-010", name:"MoSPI Capacity Building Plan 2026.xlsx",        type:"xlsx", category:"Reports",            size:"1.5 MB", uploadedOn:"20 Mar 2026", sharedWith:2, tag:"RPT" },
    { id:"DOC-011", name:"Python Basics Test – Score Sheet.pdf",          type:"pdf",  category:"Assessments",        size:"0.4 MB", uploadedOn:"16 Mar 2026", sharedWith:0, tag:"PY"  },
    { id:"DOC-012", name:"GIS Fundamentals Certificate.pdf",              type:"cert", category:"Certificates",       size:"0.3 MB", uploadedOn:"29 Apr 2026", sharedWith:0, tag:"GIS" }
  ]
};

/* ================================================================
   ASSESSMENTS DATA
================================================================ */
const ASSESSMENTS_DATA = {
  completed: [
    { id:"ASS-001", title:"Statistical Methods Quiz 1",  domain:"Statistical Methods", date:"20 Jan 2026", duration:"40 min", score:78,  total:100, status:"passed", color:"green"  },
    { id:"ASS-002", title:"Statistical Methods Quiz 2",  domain:"Statistical Methods", date:"25 Feb 2026", duration:"40 min", score:84,  total:100, status:"passed", color:"green"  },
    { id:"ASS-003", title:"Data Quality Assessment",     domain:"Data Quality",        date:"10 Mar 2026", duration:"45 min", score:80,  total:100, status:"passed", color:"green"  },
    { id:"ASS-004", title:"GIS Fundamentals Assessment", domain:"GIS",                 date:"30 Apr 2026", duration:"50 min", score:88,  total:100, status:"passed", color:"green"  },
    { id:"ASS-005", title:"Python Basics Test",          domain:"Python",              date:"15 Mar 2026", duration:"35 min", score:60,  total:100, status:"passed", color:"amber"  }
  ],
  upcoming: [
    { id:"ASS-006", title:"Sampling Techniques Quiz",   domain:"Statistical Methods", date:"2026-05-18", time:"10:00 AM – 10:45 AM", duration:"45 min", color:"blue"   },
    { id:"ASS-007", title:"Data Quality Assessment 2",  domain:"Data Quality",        date:"2026-05-22", time:"02:00 PM – 02:45 PM", duration:"45 min", color:"amber"  },
    { id:"ASS-008", title:"Python Basics Test 2",       domain:"Python",              date:"2026-05-26", time:"11:00 AM – 11:45 AM", duration:"35 min", color:"green"  }
  ]
};

/* ================================================================
   ICON / COLOR MAPS
================================================================ */
const navIconMap = {
  dashboard:LayoutDashboard, competencies:BarChart3, path:TrendingUp,
  assessments:ClipboardList, documents:FileText, certificates:Award, settings:Settings
};
const compIconMap = { bars:BarChart3, shield:Award, python:FileText, gis:TrendingUp, ml:ClipboardList, trend:TrendingUp };
const compIconStyle = {
  bars:   { bg:"#DCFCE7", fg:"#16A34A" },
  shield: { bg:"#DBEAFE", fg:"#2563EB" },
  python: { bg:"#FEF3C7", fg:"#D97706" },
  gis:    { bg:"#FEE2E2", fg:"#DC2626" },
  ml:     { bg:"#F3E8FF", fg:"#9333EA" },
  trend:  { bg:"#DBEAFE", fg:"#2563EB" }
};
const levelColor = { strong:"#16A34A", moderate:"#F59E0B", weak:"#EF4444" };
const colorMap = {
  blue:   { text:"#2563EB", bg:"#DBEAFE" },
  green:  { text:"#16A34A", bg:"#DCFCE7" },
  amber:  { text:"#D97706", bg:"#FEF3C7" },
  red:    { text:"#DC2626", bg:"#FEE2E2" },
  purple: { text:"#9333EA", bg:"#F3E8FF" },
  gray:   { text:"#6B7280", bg:"#F3F4F6" }
};

/* ================================================================
   AI ANALYSIS — calls Claude API to compute scores from raw data
================================================================ */
async function analyzeWithClaude(rawData) {
  const prompt = `You are the AI scoring engine for StatSkill AI (SIH26101 — MoSPI, India).
Analyze this iGOT Karmayogi raw learning data for a statistical investigator and compute competency scores holistically (consider assessment scores, course grades, learning hours, and self-assessment ratings together — do NOT just average).

RAW KARMAYOGI DATA:
${JSON.stringify(rawData, null, 2)}

Return ONLY valid JSON — no markdown, no backticks, no explanation:
{
  "generatedAt": "<ISO timestamp>",
  "overallScore": <integer 0–100>,
  "criticalGaps": <integer — count of weak competencies>,
  "learningProgress": <integer 0–100 — % of overall path done>,
  "assessmentsCompleted": <integer>,
  "assessmentsTotal": 15,
  "overallInsight": "<2–3 sentences: holistic AI narrative about progress, strengths, and trajectory for this MoSPI investigator>",
  "topRecommendations": ["<rec 1>","<rec 2>","<rec 3>"],
  "competencies": [
    {
      "name": "Statistical Methods",
      "score": <float 0.0–5.0>,
      "max": 5,
      "level": "<strong|moderate|weak>",
      "icon": "bars",
      "trend": "<improving|stable|declining>",
      "aiInsight": "<1–2 sentences: specific AI insight about this domain>",
      "subSkills": [
        { "name": "Descriptive Statistics", "score": <0–100> },
        { "name": "Hypothesis Testing",     "score": <0–100> },
        { "name": "Regression Analysis",    "score": <0–100> },
        { "name": "Time Series Analysis",   "score": <0–100> }
      ]
    },
    {
      "name": "Data Quality",
      "score": <float 0.0–5.0>,
      "max": 5,
      "level": "<strong|moderate|weak>",
      "icon": "shield",
      "trend": "<improving|stable|declining>",
      "aiInsight": "<1–2 sentences>",
      "subSkills": [
        { "name": "Data Validation",       "score": <0–100> },
        { "name": "Error Detection",       "score": <0–100> },
        { "name": "Imputation Techniques", "score": <0–100> },
        { "name": "Audit & Review",        "score": <0–100> }
      ]
    },
    {
      "name": "Python",
      "score": <float 0.0–5.0>,
      "max": 5,
      "level": "<strong|moderate|weak>",
      "icon": "python",
      "trend": "<improving|stable|declining>",
      "aiInsight": "<1–2 sentences>",
      "subSkills": [
        { "name": "Data Manipulation (pandas)",   "score": <0–100> },
        { "name": "Visualisation (matplotlib)",   "score": <0–100> },
        { "name": "Scripting & Automation",       "score": <0–100> },
        { "name": "Statistical Libraries",        "score": <0–100> }
      ]
    },
    {
      "name": "GIS",
      "score": <float 0.0–5.0>,
      "max": 5,
      "level": "<strong|moderate|weak>",
      "icon": "gis",
      "trend": "<improving|stable|declining>",
      "aiInsight": "<1–2 sentences>",
      "subSkills": [
        { "name": "Map Projections",    "score": <0–100> },
        { "name": "Spatial Joins",      "score": <0–100> },
        { "name": "GIS Tools (QGIS)",   "score": <0–100> },
        { "name": "Choropleth Mapping", "score": <0–100> }
      ]
    },
    {
      "name": "Machine Learning",
      "score": <float 0.0–5.0>,
      "max": 5,
      "level": "<strong|moderate|weak>",
      "icon": "ml",
      "trend": "<improving|stable|declining>",
      "aiInsight": "<1–2 sentences>",
      "subSkills": [
        { "name": "Supervised Learning",    "score": <0–100> },
        { "name": "Model Evaluation",       "score": <0–100> },
        { "name": "Feature Engineering",    "score": <0–100> },
        { "name": "ML Frameworks",          "score": <0–100> }
      ]
    }
  ]
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  const text = data.content.map(b => b.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

/* ================================================================
   UTILITY COMPONENTS
================================================================ */
function ProgressBar({ value, max=100, color="#2563EB", track="#E5E7EB", height=8 }) {
  const pct = Math.min(100, (value/max)*100);
  return (
    <div style={{ background:track, borderRadius:999, height, width:"100%", overflow:"hidden" }}>
      <div style={{ background:color, width:`${pct}%`, height:"100%", borderRadius:999, transition:"width 0.6s ease" }} />
    </div>
  );
}

function Skeleton({ w="100%", h=16, radius=8, style={} }) {
  return (
    <div style={{ width:w, height:h, borderRadius:radius, background:"linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite", ...style }} />
  );
}

function AIBadge({ at }) {
  if (!at) return null;
  const t = new Date(at);
  const fmt = isNaN(t) ? "" : t.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#7C3AED", background:"#F5F3FF", borderRadius:6, padding:"3px 8px" }}>
      <Sparkles size={11} /> AI · {fmt}
    </div>
  );
}

function TrendIcon({ trend }) {
  if (trend === "improving")  return <ArrowUp   size={13} color="#16A34A" />;
  if (trend === "declining")  return <ArrowDown size={13} color="#DC2626" />;
  return <Minus size={13} color="#9CA3AF" />;
}

function Panel({ title, action, badge, children }) {
  return (
    <div style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:14, padding:20, boxShadow:"0 1px 2px rgba(16,24,40,0.04)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, gap:8, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ fontSize:15.5, fontWeight:700 }}>{title}</div>
          {badge}
        </div>
        {action && <a href="#" style={{ fontSize:12.5, color:"#2563EB", fontWeight:600, textDecoration:"none" }}>{action}</a>}
      </div>
      {children}
    </div>
  );
}

/* ================================================================
   DASHBOARD PAGE
================================================================ */
function StatCard({ label, value, suffix, note, color, icon, trend, aiNote, loading }) {
  const c = colorMap[color] || colorMap.blue;
  const IconEl = { alert:AlertCircle, trend:TrendingUp, clipboard:ClipboardList, award:Award, brain:Brain }[icon] || Activity;
  return (
    <div style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:14, padding:"18px 20px", boxShadow:"0 1px 2px rgba(16,24,40,0.04)", display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ fontSize:13, color:"#4B5563", fontWeight:500 }}>{label}</div>
      {loading ? (
        <><Skeleton h={34} w="60%" /><Skeleton h={8} /><Skeleton h={12} w="70%" /></>
      ) : (
        <>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
              <span style={{ fontSize:30, fontWeight:800, color:c.text, lineHeight:1 }}>{value}</span>
              {suffix && <span style={{ fontSize:14, color:"#6B7280", fontWeight:500 }}>{suffix}</span>}
              {trend && <TrendIcon trend={trend} />}
            </div>
            <div style={{ width:42, height:42, borderRadius:999, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <IconEl size={19} color={c.text} />
            </div>
          </div>
          {color==="blue" && <ProgressBar value={Number(value)||0} max={100} color={c.text} />}
          <div style={{ fontSize:12, color:"#6B7280" }}>{note}</div>
          {aiNote && <div style={{ fontSize:11.5, color:"#7C3AED", fontStyle:"italic", borderTop:"1px solid #F3F4F6", paddingTop:6, marginTop:2, lineHeight:1.5 }}><Sparkles size={10} style={{ marginRight:3, verticalAlign:"middle" }} />{aiNote}</div>}
        </>
      )}
    </div>
  );
}

function UpcomingAssessmentRow({ item }) {
  const c = colorMap[item.color] || colorMap.blue;
  const d = new Date(item.date);
  const day = isNaN(d) ? "?" : d.getDate();
  const mon = isNaN(d) ? "" : d.toLocaleString("default",{month:"short"}).toUpperCase();
  return (
    <div style={{ display:"flex", gap:14, alignItems:"center", background:c.bg, borderRadius:12, padding:"12px 14px", opacity:0.9 }}>
      <div style={{ textAlign:"center", width:44, flexShrink:0 }}>
        <div style={{ fontSize:20, fontWeight:800, color:c.text, lineHeight:1 }}>{day}</div>
        <div style={{ fontSize:10.5, color:c.text, fontWeight:700, letterSpacing:0.5 }}>{mon}</div>
      </div>
      <div>
        <div style={{ fontSize:13.5, fontWeight:700, color:"#1F2937" }}>{item.title}</div>
        <div style={{ fontSize:12.5, color:"#6B7280", marginTop:1 }}>{item.time}</div>
      </div>
    </div>
  );
}

function CompetencyMiniRow({ item, loading }) {
  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0" }}>
      <Skeleton w={36} h={36} radius={10} />
      <div style={{ flex:1 }}><Skeleton h={12} w="50%" style={{ marginBottom:6 }} /><Skeleton h={6} /></div>
      <Skeleton w={50} h={14} />
    </div>
  );
  const Icon = compIconMap[item.icon] || BarChart3;
  const is = compIconStyle[item.icon] || compIconStyle.bars;
  const lc = levelColor[item.level];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0" }}>
      <div style={{ width:36, height:36, borderRadius:10, background:is.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={16} color={is.fg} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:13.5, fontWeight:600, color:"#1F2937" }}>{item.name}</span>
          <span style={{ display:"flex", alignItems:"center", gap:3 }}><TrendIcon trend={item.trend} /></span>
        </div>
        <ProgressBar value={item.score} max={item.max} color={lc} height={6} />
      </div>
      <div style={{ fontSize:13.5, fontWeight:700, color:lc, width:56, textAlign:"right" }}>
        {item.score?.toFixed(1)}<span style={{ fontSize:11, color:"#9CA3AF" }}>/{item.max}</span>
      </div>
    </div>
  );
}

function LearningStepMini({ step, isLast }) {
  const sc = { done:"#16A34A", active:"#2563EB", locked:"#9CA3AF" }[step.state];
  const sb = { done:"#DCFCE7", active:"#DBEAFE", locked:"#F3F4F6" }[step.state];
  const circle = step.state==="done"
    ? <div style={{ width:30,height:30,borderRadius:999,background:"#16A34A",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><CheckCircle2 size={17} color="#fff" /></div>
    : step.state==="active"
      ? <div style={{ width:30,height:30,borderRadius:999,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff",fontWeight:800,fontSize:13 }}>{step.step}</div>
      : <div style={{ width:30,height:30,borderRadius:999,background:"#E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#9CA3AF",fontWeight:700,fontSize:13 }}>{step.step}</div>;
  return (
    <div style={{ display:"flex", gap:12 }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        {circle}
        {!isLast && <div style={{ width:2, flex:1, background:"#E5E7EB", minHeight:24 }} />}
      </div>
      <div style={{ flex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", paddingBottom:16 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:"#1F2937" }}>{step.title}</div>
          <div style={{ fontSize:12.5, color:sc, fontWeight:500, marginTop:2 }}>{step.status}</div>
        </div>
        <div style={{ width:32,height:32,borderRadius:9,background:sb,display:"flex",alignItems:"center",justifyContent:"center" }}>
          {step.state==="done"   && <CheckCircle2 size={16} color="#16A34A" />}
          {step.state==="active" && <PlayCircle   size={16} color="#2563EB" />}
          {step.state==="locked" && <Lock         size={14} color="#9CA3AF" />}
        </div>
      </div>
    </div>
  );
}

function DashboardHome({ aiResult, loading, rawData, onReanalyze }) {
  const comp = aiResult?.competencies || [];
  const upcoming = rawData?.upcomingAssessments || [];
  const lp = LP_DATA;

  const statCards = [
    { label:"Overall Competency Score", value:aiResult?.overallScore??"-",    suffix:aiResult?"/100":null, note:"AI-computed from your Karmayogi data", color:"blue",   icon:"brain",     trend:aiResult?"improving":null, aiNote:null },
    { label:"Critical Skill Gaps",      value:aiResult?.criticalGaps??"-",    suffix:null,                note:"Skills needing immediate attention",    color:"red",    icon:"alert",     trend:null,    aiNote:null },
    { label:"Learning Progress",        value:aiResult?.learningProgress??"-",suffix:aiResult?"%":null,   note:"Overall path completion",               color:"green",  icon:"trend",     trend:null,    aiNote:null },
    { label:"Assessments Completed",    value:aiResult?.assessmentsCompleted??"-", suffix:aiResult?`/${aiResult?.assessmentsTotal||15}`:null, note:"Recommended assessments", color:"purple", icon:"clipboard", trend:null, aiNote:null }
  ];

  return (
    <>
      {/* AI Overall insight */}
      {(loading || aiResult?.overallInsight) && (
        <div style={{ background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)", border:"1px solid #C7D2FE", borderRadius:14, padding:16, marginBottom:18, display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ width:36,height:36,borderRadius:10,background:"#6366F1",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <Brain size={18} color="#fff" />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:13.5, fontWeight:700, color:"#3730A3" }}>AI Performance Insight — SIH26101</span>
              {!loading && <AIBadge at={aiResult?.generatedAt} />}
            </div>
            {loading
              ? <><Skeleton h={14} style={{ marginBottom:6 }} /><Skeleton h={14} w="80%" /></>
              : <p style={{ fontSize:13, color:"#4338CA", margin:0, lineHeight:1.65 }}>{aiResult?.overallInsight}</p>
            }
          </div>
          <button onClick={onReanalyze} disabled={loading} title="Re-analyze with AI"
            style={{ border:"none", background:"#6366F1", color:"#fff", borderRadius:8, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:loading?"not-allowed":"pointer", flexShrink:0 }}>
            <RefreshCw size={15} style={{ animation:loading?"spin 1s linear infinite":"none" }} />
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, marginBottom:20 }}>
        {statCards.map(c => <StatCard key={c.label} {...c} loading={loading} />)}
      </div>

      {/* Three-col */}
      <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1.1fr 1fr", gap:16, marginBottom:20, alignItems:"start" }} className="three-col">
        {/* Competencies */}
        <Panel title="My Competencies" action="View All" badge={!loading && aiResult && <AIBadge at={aiResult.generatedAt} />}>
          <div>
            {loading
              ? [1,2,3,4,5].map(i=><CompetencyMiniRow key={i} loading />)
              : comp.map(c=><CompetencyMiniRow key={c.name} item={c} />)
            }
          </div>
          {!loading && (
            <div style={{ display:"flex", gap:14, marginTop:10, paddingTop:12, borderTop:"1px solid #F1F2F4", flexWrap:"wrap" }}>
              {[["strong","#16A34A","Strong (≥3.5)"],["moderate","#F59E0B","Moderate (2.0–3.4)"],["weak","#EF4444","Weak (<2.0)"]].map(([k,col,lbl])=>(
                <span key={k} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11.5, color:"#6B7280" }}>
                  <span style={{ width:8,height:8,borderRadius:999,background:col,display:"inline-block" }} />{lbl}
                </span>
              ))}
            </div>
          )}
        </Panel>

        {/* Learning path */}
        <Panel title="My Learning Path" action="View Full Path">
          {lp.modules.map((m,i)=><LearningStepMini key={m.step} step={m} isLast={i===lp.modules.length-1} />)}
        </Panel>

        {/* Upcoming assessments */}
        <Panel title="Upcoming Assessments" action="View All">
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {upcoming.map(a=><UpcomingAssessmentRow key={a.id} item={a} />)}
          </div>
          <div style={{ marginTop:14, textAlign:"right" }}>
            <a href="#" style={{ fontSize:13, color:"#2563EB", fontWeight:600, textDecoration:"none" }}>View Calendar →</a>
          </div>
        </Panel>
      </div>

      {/* Recommendation */}
      {(loading || aiResult?.topRecommendations) && (
        <div style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:14, padding:24, display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }} className="reco-grid">
          <div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>Recommended for You</div>
            {loading
              ? [1,2,3].map(i=><Skeleton key={i} h={14} style={{ marginBottom:10 }} />)
              : (aiResult?.topRecommendations||[]).map((r,i)=>(
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"flex-start" }}>
                    <div style={{ width:22,height:22,borderRadius:6,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,fontWeight:700,color:"#2563EB" }}>{i+1}</div>
                    <p style={{ fontSize:13.5, color:"#374151", margin:0, lineHeight:1.5 }}>{r}</p>
                  </div>
                ))
            }
          </div>
          <div style={{ background:"#EFF6FF", borderRadius:12, padding:18, display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#1D4ED8", marginBottom:6 }}>Why this recommendation?</div>
              {loading
                ? <><Skeleton h={13} style={{ marginBottom:6 }} /><Skeleton h={13} w="80%" /></>
                : <p style={{ fontSize:13, color:"#374151", margin:0, lineHeight:1.6 }}>Your diagnostic assessment shows a high skill gap in GIS which is critical for your MoSPI role. Completing the active module will directly improve your spatial competency score.</p>
              }
            </div>
            <div style={{ width:40,height:40,borderRadius:999,background:"#DBEAFE",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <Lightbulb size={20} color="#2563EB" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================================================================
   MY COMPETENCIES PAGE
================================================================ */
function CompetencyDetailCard({ item, isExpanded, onToggle, loading }) {
  if (loading) return (
    <div style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:14, padding:18 }}>
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        <Skeleton w={42} h={42} radius={10} />
        <div style={{ flex:1 }}><Skeleton h={15} w="40%" style={{ marginBottom:8 }} /><Skeleton h={8} /></div>
        <Skeleton w={60} h={22} radius={999} />
      </div>
    </div>
  );

  const Icon = compIconMap[item.icon] || BarChart3;
  const is = compIconStyle[item.icon] || compIconStyle.bars;
  const lc = levelColor[item.level];
  const lbl = { strong:"Strong", moderate:"Moderate", weak:"Weak" }[item.level];
  const lbg = { strong:"#DCFCE7", moderate:"#FEF3C7", weak:"#FEE2E2" }[item.level];

  return (
    <div style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:14, boxShadow:"0 1px 2px rgba(16,24,40,0.04)", overflow:"hidden" }}>
      <div style={{ padding:"18px 20px", display:"flex", gap:14, alignItems:"flex-start", cursor:"pointer" }} onClick={onToggle}>
        <div style={{ width:44,height:44,borderRadius:11,background:is.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <Icon size={20} color={is.fg} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#1F2937" }}>{item.name}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:11,fontWeight:700,color:lc,background:lbg,borderRadius:999,padding:"3px 10px" }}>{lbl}</span>
              <TrendIcon trend={item.trend} />
              <span style={{ fontSize:17,fontWeight:800,color:lc }}>{item.score?.toFixed(1)}<span style={{ fontSize:12,fontWeight:500,color:"#9CA3AF" }}>/{item.max}</span></span>
              <ChevronRight size={16} color="#9CA3AF" style={{ transform:isExpanded?"rotate(90deg)":"none", transition:"transform 0.2s" }} />
            </div>
          </div>
          <div style={{ marginTop:8 }}><ProgressBar value={item.score} max={item.max} color={lc} height={7} /></div>
          {item.aiInsight && (
            <div style={{ marginTop:8, fontSize:12, color:"#7C3AED", fontStyle:"italic", display:"flex", gap:5, alignItems:"flex-start" }}>
              <Sparkles size={11} style={{ flexShrink:0, marginTop:1 }} />{item.aiInsight}
            </div>
          )}
        </div>
      </div>
      {isExpanded && (
        <div style={{ padding:"0 20px 20px", borderTop:"1px solid #F1F2F4" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#1F2937", margin:"14px 0 10px" }}>Sub-skill Breakdown (AI-analyzed)</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:18 }}>
            {(item.subSkills||[]).map(s=>(
              <div key={s.name} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:13,color:"#4B5563",width:200,flexShrink:0 }}>{s.name}</div>
                <div style={{ flex:1 }}><ProgressBar value={s.score} max={100} color={lc} height={6} /></div>
                <div style={{ fontSize:13,fontWeight:700,color:lc,width:36,textAlign:"right" }}>{s.score}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MyCompetenciesPage({ aiResult, loading, onReanalyze }) {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter]   = useState("All");
  const filters = ["All","Strong","Moderate","Weak"];
  const comp = aiResult?.competencies || [];
  const filtered = filter==="All" ? comp : comp.filter(c=>c.level===filter.toLowerCase());

  return (
    <>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, gap:12, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:19, fontWeight:700 }}>My Competencies</div>
          <div style={{ fontSize:13, color:"#6B7280", marginTop:2 }}>
            AI-computed skill scores from your iGOT Karmayogi data — SIH26101 · MoSPI
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {!loading && aiResult && <AIBadge at={aiResult.generatedAt} />}
          <button onClick={onReanalyze} disabled={loading}
            style={{ display:"flex",alignItems:"center",gap:6,background:"#6366F1",color:"#fff",border:"none",borderRadius:9,padding:"8px 14px",fontSize:13,fontWeight:600,cursor:loading?"not-allowed":"pointer" }}>
            <RefreshCw size={14} style={{ animation:loading?"spin 1s linear infinite":"none" }} />
            {loading?"Analyzing...":"Re-analyze"}
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:20 }}>
        {[
          { label:"Skills Assessed",    value:5,                        color:"blue"   },
          { label:"Strong Skills",      value:comp.filter(c=>c.level==="strong").length,   color:"green"  },
          { label:"Need Improvement",   value:comp.filter(c=>c.level!=="strong").length,   color:"amber"  },
          { label:"Avg Score",          value:comp.length ? (comp.reduce((a,c)=>a+c.score,0)/comp.length).toFixed(1) : "-", suffix:"/5", color:"purple" }
        ].map(s=>(
          <div key={s.label} style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:14, padding:"16px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:22, fontWeight:700, color:(colorMap[s.color]||colorMap.blue).text }}>
                {loading ? <Skeleton h={22} w={40} /> : <>{s.value}{s.suffix&&<span style={{ fontSize:13,fontWeight:500,color:"#9CA3AF" }}>{s.suffix}</span>}</>}
              </div>
              <div style={{ fontSize:12.5, color:"#4B5563", marginTop:2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {filters.map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 16px",borderRadius:8,border:"1px solid",borderColor:filter===f?"#6366F1":"#E5E7EB",background:filter===f?"#EEF2FF":"#fff",color:filter===f?"#6366F1":"#6B7280",fontSize:13,fontWeight:600,cursor:"pointer" }}>{f}</button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {loading
          ? [1,2,3,4,5].map(i=><CompetencyDetailCard key={i} loading />)
          : filtered.map(item=>(
              <CompetencyDetailCard key={item.name} item={item}
                isExpanded={expanded===item.name}
                onToggle={()=>setExpanded(expanded===item.name?null:item.name)} />
            ))
        }
      </div>
    </>
  );
}

/* ================================================================
   LEARNING PATH PAGE
================================================================ */
function ModuleCard({ mod, isLast }) {
  const sc = { done:"#16A34A", active:"#2563EB", locked:"#9CA3AF" }[mod.state];
  const sb = { done:"#DCFCE7", active:"#DBEAFE", locked:"#F3F4F6" }[mod.state];

  const circle = mod.state==="done"
    ? <div style={{ width:36,height:36,borderRadius:999,background:"#16A34A",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><CheckCircle2 size={20} color="#fff" /></div>
    : mod.state==="active"
      ? <div style={{ width:36,height:36,borderRadius:999,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:800,color:"#fff",fontSize:15 }}>{mod.step}</div>
      : <div style={{ width:36,height:36,borderRadius:999,background:"#E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:700,color:"#9CA3AF",fontSize:15 }}>{mod.step}</div>;

  return (
    <div style={{ display:"flex", gap:16 }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:4 }}>
        {circle}
        {!isLast && <div style={{ width:2,flex:1,background:"#E5E7EB",marginTop:6,minHeight:40 }} />}
      </div>
      <div style={{ flex:1, marginBottom:isLast?0:20, background:mod.state==="locked"?"#FAFAFA":"#fff", border:"1px solid #EEF0F3", borderRadius:14, padding:18, boxShadow:"0 1px 2px rgba(16,24,40,0.04)", opacity:mod.state==="locked"?0.8:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap", marginBottom:10 }}>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:15.5, fontWeight:700, color:"#1F2937" }}>{mod.title}</div>
            <div style={{ display:"flex", gap:14, marginTop:6, flexWrap:"wrap" }}>
              <span style={{ fontSize:12.5, color:"#6B7280", display:"flex", alignItems:"center", gap:4 }}><Clock size={12} /> {mod.duration}</span>
              <span style={{ fontSize:12.5, color:"#6B7280", display:"flex", alignItems:"center", gap:4 }}><BookOpen size={12} /> {mod.lessons} lessons</span>
              {mod.completedOn && <span style={{ fontSize:12.5,color:"#6B7280",display:"flex",alignItems:"center",gap:4 }}><CalendarDays size={12} /> {mod.completedOn}</span>}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
            <span style={{ fontSize:11.5,fontWeight:700,color:sc,background:sb,borderRadius:999,padding:"4px 12px",whiteSpace:"nowrap" }}>
              {{ done:"Completed", active:"In Progress", locked:"Not Started" }[mod.state]}
            </span>
            {mod.score && <span style={{ fontSize:13,fontWeight:700,color:"#16A34A" }}><Trophy size={13} style={{ verticalAlign:"middle",marginRight:3 }} />Score: {mod.score}%</span>}
          </div>
        </div>
        <p style={{ fontSize:13.5, color:"#4B5563", margin:"0 0 12px", lineHeight:1.6 }}>{mod.description}</p>
        {mod.state==="active" && (
          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:12.5,color:"#6B7280" }}>{mod.completedLessons} of {mod.lessons} lessons</span>
              <span style={{ fontSize:12.5,fontWeight:700,color:"#2563EB" }}>{mod.progress}%</span>
            </div>
            <ProgressBar value={mod.progress} max={100} color="#2563EB" height={8} />
          </div>
        )}
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
          {mod.topics.map((t,i)=>(
            <span key={t} style={{ fontSize:11.5,padding:"3px 10px",borderRadius:6,
              background: i<(mod.completedLessons||0)?"#DCFCE7":mod.state==="locked"?"#F3F4F6":"#EFF6FF",
              color: i<(mod.completedLessons||0)?"#16A34A":mod.state==="locked"?"#9CA3AF":"#2563EB", fontWeight:500 }}>{t}</span>
          ))}
        </div>
        {mod.state==="done"   && <button style={{ display:"flex",alignItems:"center",gap:6,background:"#F3F4F6",color:"#374151",border:"none",borderRadius:9,padding:"9px 16px",fontSize:13,fontWeight:600,cursor:"pointer" }}><Download size={14} /> Download Certificate</button>}
        {mod.state==="active" && <button style={{ display:"flex",alignItems:"center",gap:6,background:"#2563EB",color:"#fff",border:"none",borderRadius:9,padding:"9px 16px",fontSize:13,fontWeight:600,cursor:"pointer" }}><PlayCircle size={14} /> Continue Learning</button>}
        {mod.state==="locked" && <button disabled style={{ display:"flex",alignItems:"center",gap:6,background:"#F3F4F6",color:"#9CA3AF",border:"none",borderRadius:9,padding:"9px 16px",fontSize:13,fontWeight:600,cursor:"not-allowed" }}><Lock size={14} /> Locked</button>}
      </div>
    </div>
  );
}

function LearningPathPage() {
  const t = LP_DATA.track;
  const pct = Math.round((t.completedHours/t.totalHours)*100);
  return (
    <>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:19, fontWeight:700 }}>Learning Path</div>
        <div style={{ fontSize:13, color:"#6B7280", marginTop:2 }}>Your GIS & Spatial Statistics track — SIH26101 · MoSPI</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:20 }}>
        {[
          { label:"Completed", value:"1", color:"green" }, { label:"In Progress", value:"1", color:"blue" },
          { label:"Hours Done", value:`${t.completedHours} hrs`, color:"purple" }, { label:"Est. Completion", value:"Aug 2026", color:"amber" }
        ].map(s=>(
          <div key={s.label} style={{ background:"#fff",border:"1px solid #EEF0F3",borderRadius:14,padding:"16px 18px" }}>
            <div style={{ fontSize:20,fontWeight:700,color:(colorMap[s.color]||colorMap.blue).text }}>{s.value}</div>
            <div style={{ fontSize:12.5,color:"#4B5563",marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"linear-gradient(135deg,#1D4ED8,#3B82F6)", borderRadius:14, padding:22, marginBottom:22, color:"#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
              <MapPin size={16} color="#BAE6FD" />
              <span style={{ fontSize:11.5,color:"#BAE6FD",fontWeight:700,letterSpacing:0.5 }}>ACTIVE TRACK</span>
            </div>
            <div style={{ fontSize:17,fontWeight:800 }}>{t.title}</div>
            <div style={{ fontSize:13,color:"#BFDBFE",marginTop:4 }}>{t.completedModules} of {t.totalModules} modules · {t.completedHours} of {t.totalHours} hrs</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:28,fontWeight:800 }}>{pct}%</div>
            <div style={{ fontSize:12,color:"#BFDBFE" }}>Overall Progress</div>
          </div>
        </div>
        <div style={{ marginTop:14 }}><ProgressBar value={pct} max={100} color="#BAE6FD" track="rgba(255,255,255,0.2)" height={8} /></div>
      </div>
      <div>
        {LP_DATA.modules.map((m,i)=><ModuleCard key={m.step} mod={m} isLast={i===LP_DATA.modules.length-1} />)}
      </div>
    </>
  );
}

/* ================================================================
   CERTIFICATES PAGE
================================================================ */
const certStatusStyle = {
  active:       { label:"Active",       text:"#16A34A", bg:"#DCFCE7" },
  expiring:     { label:"Expiring Soon",text:"#D97706", bg:"#FEF3C7" },
  "in-progress":{ label:"In Progress",  text:"#2563EB", bg:"#DBEAFE" },
  locked:       { label:"Not Started",  text:"#9CA3AF", bg:"#F3F4F6" }
};

function CertificateCard({ cert }) {
  const Icon = compIconMap[cert.icon] || Award;
  const is = compIconStyle[cert.icon] || { bg:"#F3F4F6",fg:"#9CA3AF" };
  const status = certStatusStyle[cert.status];
  return (
    <div style={{ background:"#fff",border:"1px solid #EEF0F3",borderRadius:14,padding:20,boxShadow:"0 1px 2px rgba(16,24,40,0.04)",display:"flex",flexDirection:"column",gap:14,opacity:cert.status==="locked"?0.7:1 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
        <div style={{ display:"flex",gap:12,alignItems:"center",minWidth:0 }}>
          <div style={{ width:42,height:42,borderRadius:10,background:is.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <Icon size={19} color={is.fg} />
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:14.5,fontWeight:700,color:"#1F2937" }}>{cert.title}</div>
            <div style={{ fontSize:12.5,color:"#6B7280",marginTop:1 }}>{cert.issuer}</div>
          </div>
        </div>
        <span style={{ fontSize:11,fontWeight:700,color:status.text,background:status.bg,borderRadius:999,padding:"4px 10px",whiteSpace:"nowrap",flexShrink:0 }}>{status.label}</span>
      </div>
      {cert.status==="in-progress" && <div><ProgressBar value={cert.progress} max={100} color="#2563EB" height={7} /><div style={{ fontSize:12,color:"#6B7280",marginTop:6 }}>{cert.progress}% complete</div></div>}
      {(cert.status==="active"||cert.status==="expiring") && (
        <div style={{ display:"flex",flexDirection:"column",gap:6,fontSize:12.5,color:"#4B5563" }}>
          {[["Issued",cert.issued],["Expires",cert.expires],["Credential ID",cert.credentialId]].map(([k,v])=>(
            <div key={k} style={{ display:"flex",justifyContent:"space-between" }}>
              <span>{k}</span>
              <span style={{ fontWeight:600,color:k==="Expires"&&cert.status==="expiring"?"#D97706":"#1F2937" }}>{v}</span>
            </div>
          ))}
        </div>
      )}
      {cert.status==="locked" && <div style={{ fontSize:12.5,color:"#9CA3AF" }}>Complete prerequisite modules to unlock this certificate.</div>}
      <div style={{ display:"flex",gap:8 }}>
        {(cert.status==="active"||cert.status==="expiring") && (<><button style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#2563EB",color:"#fff",border:"none",borderRadius:9,padding:"9px 12px",fontSize:13,fontWeight:600,cursor:"pointer" }}><Download size={14} />Download</button><button style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#F3F4F6",color:"#374151",border:"none",borderRadius:9,padding:"9px 12px",fontSize:13,fontWeight:600,cursor:"pointer" }}><ShieldCheck size={14} />Verify</button></>)}
        {cert.status==="in-progress" && <button style={{ flex:1,background:"#2563EB",color:"#fff",border:"none",borderRadius:9,padding:"9px 12px",fontSize:13,fontWeight:600,cursor:"pointer" }}>Continue Track</button>}
        {cert.status==="locked" && <button disabled style={{ flex:1,background:"#F3F4F6",color:"#9CA3AF",border:"none",borderRadius:9,padding:"9px 12px",fontSize:13,fontWeight:600,cursor:"not-allowed" }}>Locked</button>}
      </div>
    </div>
  );
}

function CertificatesPage() {
  return (
    <>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,gap:12,flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:19,fontWeight:700 }}>Certificates</div>
          <div style={{ fontSize:13,color:"#6B7280",marginTop:2 }}>Your earned credentials on the StatSkill AI platform — SIH26101</div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,background:"#fff",border:"1px solid #E5E7EB",borderRadius:9,padding:"8px 12px",minWidth:220 }}>
          <Search size={15} color="#9CA3AF" /><input placeholder="Search certificates..." style={{ border:"none",outline:"none",fontSize:13,flex:1,color:"#374151" }} />
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginBottom:20 }}>
        {CERTIFICATES_DATA.summary.map(s=>(
          <div key={s.id} style={{ background:"#fff",border:"1px solid #EEF0F3",borderRadius:14,padding:"18px 20px",display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:(colorMap[s.color]||colorMap.blue).bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              {s.icon==="award"?<Award size={20} color={(colorMap[s.color]||colorMap.blue).text} />:s.icon==="clock"?<Clock size={20} color={(colorMap[s.color]||colorMap.blue).text} />:<AlertCircle size={20} color={(colorMap[s.color]||colorMap.blue).text} />}
            </div>
            <div>
              <div style={{ fontSize:22,fontWeight:700,color:(colorMap[s.color]||colorMap.blue).text }}>{s.value}</div>
              <div style={{ fontSize:13,fontWeight:600,color:"#1F2937",marginTop:2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16 }}>
        {CERTIFICATES_DATA.certificates.map(c=><CertificateCard key={c.title} cert={c} />)}
      </div>
    </>
  );
}

/* ================================================================
   MY DOCUMENTS PAGE
================================================================ */
const docTypeStyle = {
  pdf:  { bg:"#FEE2E2", fg:"#DC2626", label:"PDF"  },
  docx: { bg:"#DBEAFE", fg:"#2563EB", label:"DOCX" },
  xlsx: { bg:"#DCFCE7", fg:"#16A34A", label:"XLSX" },
  cert: { bg:"#F5F3FF", fg:"#7C3AED", label:"CERT" }
};
const tagColor = {
  SM:"#DBEAFE",  DQ:"#DCFCE7", GIS:"#FEE2E2",
  PY:"#FEF3C7",  RPT:"#F3E8FF", ML:"#F0FDF4"
};
const tagText  = {
  SM:"#2563EB",  DQ:"#16A34A", GIS:"#DC2626",
  PY:"#D97706",  RPT:"#9333EA", ML:"#059669"
};

function DocumentRow({ doc, onPreview }) {
  const dt = docTypeStyle[doc.type] || docTypeStyle.pdf;
  return (
    <div style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:12, padding:"14px 18px",
        display:"flex", alignItems:"center", gap:14, boxShadow:"0 1px 2px rgba(16,24,40,0.03)" }}>
      <div style={{ width:42, height:42, borderRadius:10, background:dt.bg,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <FileText size={20} color={dt.fg} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:600, color:"#1F2937", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doc.name}</div>
        <div style={{ display:"flex", gap:8, marginTop:5, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontSize:11, fontWeight:700, color:dt.fg, background:dt.bg, borderRadius:4, padding:"2px 7px" }}>{dt.label}</span>
          <span style={{ fontSize:11, fontWeight:600, color:tagText[doc.tag]||"#6B7280", background:tagColor[doc.tag]||"#F3F4F6", borderRadius:4, padding:"2px 7px" }}>{doc.tag}</span>
          <span style={{ fontSize:11.5, color:"#9CA3AF" }}>{doc.size}</span>
          <span style={{ fontSize:11.5, color:"#9CA3AF" }}>·</span>
          <span style={{ fontSize:11.5, color:"#9CA3AF" }}>{doc.uploadedOn}</span>
          {doc.sharedWith > 0 && (
            <span style={{ fontSize:11.5, color:"#6366F1", display:"flex", alignItems:"center", gap:3 }}>
              <Share2 size={10} />{doc.sharedWith} shared
            </span>
          )}
        </div>
      </div>
      <div style={{ display:"flex", gap:6, flexShrink:0 }}>
        <button style={{ display:"flex",alignItems:"center",gap:5,background:"#F3F4F6",color:"#374151",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12.5,fontWeight:600,cursor:"pointer" }}>
          <Download size={13} />
        </button>
        <button style={{ display:"flex",alignItems:"center",gap:5,background:"#F3F4F6",color:"#374151",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12.5,fontWeight:600,cursor:"pointer" }}>
          <Share2 size={13} />
        </button>
      </div>
    </div>
  );
}

function MyDocumentsPage() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [uploading, setUploading] = useState(false);

  const filtered = DOCUMENTS_DATA.documents.filter(d => {
    const matchCat  = category === "All" || d.category === category;
    const matchSrch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  function simulateUpload() {
    setUploading(true);
    setTimeout(() => setUploading(false), 2000);
  }

  return (
    <>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, gap:12, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:19, fontWeight:700 }}>My Documents</div>
          <div style={{ fontSize:13, color:"#6B7280", marginTop:2 }}>Learning materials, assessment reports and certificates — SIH26101</div>
        </div>
        <button onClick={simulateUpload} disabled={uploading}
          style={{ display:"flex",alignItems:"center",gap:7,background:"#2563EB",color:"#fff",border:"none",borderRadius:9,padding:"10px 18px",fontSize:13.5,fontWeight:600,cursor:uploading?"not-allowed":"pointer" }}>
          <Upload size={15} style={{ animation:uploading?"spin 1s linear infinite":"none" }} />
          {uploading ? "Uploading…" : "Upload Document"}
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:20 }}>
        {DOCUMENTS_DATA.summary.map(s => {
          const c = colorMap[s.color] || colorMap.blue;
          const Ic = s.icon==="folder" ? FolderOpen : s.icon==="share" ? Share2 : FilePlus;
          return (
            <div key={s.id} style={{ background:"#fff",border:"1px solid #EEF0F3",borderRadius:14,padding:"16px 18px",display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:40,height:40,borderRadius:10,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <Ic size={18} color={c.text} />
              </div>
              <div>
                <div style={{ fontSize:22,fontWeight:700,color:c.text }}>{s.value}</div>
                <div style={{ fontSize:12.5,color:"#4B5563",marginTop:1 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + filter */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,background:"#fff",border:"1px solid #E5E7EB",borderRadius:9,padding:"9px 14px",flex:1,minWidth:200 }}>
          <Search size={15} color="#9CA3AF" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search documents…"
            style={{ border:"none",outline:"none",fontSize:13,flex:1,color:"#374151" }} />
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {DOCUMENTS_DATA.categories.map(cat => (
            <button key={cat} onClick={()=>setCategory(cat)}
              style={{ padding:"8px 14px",borderRadius:8,border:"1px solid",borderColor:category===cat?"#2563EB":"#E5E7EB",background:category===cat?"#EFF6FF":"#fff",color:category===cat?"#2563EB":"#6B7280",fontSize:12.5,fontWeight:600,cursor:"pointer" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ fontSize:13, color:"#6B7280", marginBottom:10 }}>
        {filtered.length} document{filtered.length!==1?"s":""}
        {category!=="All" && ` in ${category}`}
        {search && ` matching "${search}"`}
      </div>

      {/* List */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.length === 0
          ? <div style={{ textAlign:"center",padding:"48px 0",color:"#9CA3AF" }}>
              <FolderOpen size={44} color="#D1D5DB" style={{ marginBottom:10 }} />
              <div style={{ fontWeight:600 }}>No documents found</div>
              <div style={{ fontSize:13,marginTop:4 }}>Try a different filter or upload a new document</div>
            </div>
          : filtered.map(doc => <DocumentRow key={doc.id} doc={doc} />)
        }
      </div>
    </>
  );
}

/* ================================================================
   ASSESSMENTS PAGE
================================================================ */
function ScoreBar({ score, max=100 }) {
  const pct = (score/max)*100;
  const col = pct>=80?"#16A34A":pct>=60?"#F59E0B":"#EF4444";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ flex:1 }}><ProgressBar value={score} max={max} color={col} height={7} /></div>
      <span style={{ fontSize:14, fontWeight:700, color:col, width:40, textAlign:"right" }}>{score}%</span>
    </div>
  );
}

function CompletedAssessmentCard({ item }) {
  const sc = item.score >= 80 ? "#16A34A" : item.score >= 60 ? "#D97706" : "#DC2626";
  const sb = item.score >= 80 ? "#DCFCE7" : item.score >= 60 ? "#FEF3C7" : "#FEE2E2";
  const grade = item.score >= 90 ? "A" : item.score >= 80 ? "B" : item.score >= 70 ? "C" : item.score >= 60 ? "D" : "F";

  return (
    <div style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:14, padding:18,
        boxShadow:"0 1px 2px rgba(16,24,40,0.04)", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:14.5, fontWeight:700, color:"#1F2937" }}>{item.title}</div>
          <div style={{ display:"flex", gap:10, marginTop:5, flexWrap:"wrap" }}>
            <span style={{ fontSize:12, color:"#6B7280", display:"flex", alignItems:"center", gap:3 }}><BarChart2 size={11} />{item.domain}</span>
            <span style={{ fontSize:12, color:"#6B7280", display:"flex", alignItems:"center", gap:3 }}><CalendarDays size={11} />{item.date}</span>
            <span style={{ fontSize:12, color:"#6B7280", display:"flex", alignItems:"center", gap:3 }}><Timer size={11} />{item.duration}</span>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
          <div style={{ width:44, height:44, borderRadius:999, background:sb, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:sc }}>{grade}</div>
          <span style={{ fontSize:10.5, color:sc, fontWeight:700 }}>Grade</span>
        </div>
      </div>
      <ScoreBar score={item.score} max={item.total} />
      <div style={{ display:"flex", gap:8 }}>
        <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, background:"#F3F4F6", color:"#374151", border:"none", borderRadius:9, padding:"8px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>
          <FileCheck size={13} /> View Report
        </button>
        <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, background:"#EFF6FF", color:"#2563EB", border:"none", borderRadius:9, padding:"8px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>
          <RefreshCw size={13} /> Retake
        </button>
      </div>
    </div>
  );
}

function UpcomingAssessmentCard({ item }) {
  const c = colorMap[item.color] || colorMap.blue;
  const d = new Date(item.date);
  const day = isNaN(d) ? "?" : d.getDate();
  const mon = isNaN(d) ? "" : d.toLocaleString("default",{month:"short"}).toUpperCase();
  const daysLeft = isNaN(d) ? 0 : Math.max(0, Math.ceil((d - new Date()) / 86400000));

  return (
    <div style={{ background:"#fff", border:`1.5px solid ${c.bg}`, borderRadius:14, padding:18,
        boxShadow:"0 1px 2px rgba(16,24,40,0.04)", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
        <div style={{ width:52, height:52, borderRadius:12, background:c.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <div style={{ fontSize:20, fontWeight:800, color:c.text, lineHeight:1.1 }}>{day}</div>
          <div style={{ fontSize:10, fontWeight:700, color:c.text, letterSpacing:0.5 }}>{mon}</div>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14.5, fontWeight:700, color:"#1F2937" }}>{item.title}</div>
          <div style={{ display:"flex", gap:10, marginTop:5, flexWrap:"wrap" }}>
            <span style={{ fontSize:12, color:"#6B7280", display:"flex", alignItems:"center", gap:3 }}><BarChart2 size={11} />{item.domain}</span>
            <span style={{ fontSize:12, color:"#6B7280", display:"flex", alignItems:"center", gap:3 }}><Clock size={11} />{item.time}</span>
            <span style={{ fontSize:12, color:"#6B7280", display:"flex", alignItems:"center", gap:3 }}><Timer size={11} />{item.duration}</span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontSize:12.5, fontWeight:600, color:c.text, background:c.bg, borderRadius:8, padding:"5px 10px" }}>
          {daysLeft === 0 ? "Today!" : daysLeft === 1 ? "Tomorrow" : `${daysLeft} days away`}
        </div>
        <button style={{ display:"flex",alignItems:"center",gap:6,background:c.text,color:"#fff",border:"none",borderRadius:9,padding:"8px 16px",fontSize:12.5,fontWeight:600,cursor:"pointer" }}>
          <ClipboardCheck size={13} /> Prepare
        </button>
      </div>
    </div>
  );
}

function AssessmentsPage() {
  const [tab, setTab] = useState("All");
  const tabs = ["All","Upcoming","Completed"];
  const avg = Math.round(ASSESSMENTS_DATA.completed.reduce((a,c)=>a+c.score,0)/ASSESSMENTS_DATA.completed.length);
  const best = Math.max(...ASSESSMENTS_DATA.completed.map(c=>c.score));

  return (
    <>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, gap:12, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:19, fontWeight:700 }}>Assessments</div>
          <div style={{ fontSize:13, color:"#6B7280", marginTop:2 }}>Track your quiz scores and upcoming tests — SIH26101 · MoSPI</div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:20 }}>
        {[
          { label:"Completed",  value:ASSESSMENTS_DATA.completed.length, color:"green",  Icon:ClipboardCheck },
          { label:"Upcoming",   value:ASSESSMENTS_DATA.upcoming.length,  color:"blue",   Icon:CalendarDays   },
          { label:"Avg Score",  value:`${avg}%`,                         color:"amber",  Icon:Percent        },
          { label:"Best Score", value:`${best}%`,                        color:"purple", Icon:Trophy         }
        ].map(s => {
          const c = colorMap[s.color] || colorMap.blue;
          return (
            <div key={s.label} style={{ background:"#fff",border:"1px solid #EEF0F3",borderRadius:14,padding:"16px 18px",display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:40,height:40,borderRadius:10,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <s.Icon size={18} color={c.text} />
              </div>
              <div>
                <div style={{ fontSize:22,fontWeight:700,color:c.text }}>{s.value}</div>
                <div style={{ fontSize:12.5,color:"#4B5563",marginTop:1 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score bar chart */}
      <div style={{ background:"#fff",border:"1px solid #EEF0F3",borderRadius:14,padding:20,marginBottom:20 }}>
        <div style={{ fontSize:14.5,fontWeight:700,marginBottom:16 }}>Score History</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:100 }}>
          {ASSESSMENTS_DATA.completed.map(a => {
            const h = Math.max(20,(a.score/100)*88);
            const col = a.score>=80?"#16A34A":a.score>=60?"#F59E0B":"#EF4444";
            return (
              <div key={a.id} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ fontSize:11,fontWeight:700,color:col }}>{a.score}%</div>
                <div style={{ width:"100%",height:h,background:col,borderRadius:"6px 6px 0 0",opacity:0.85 }} />
                <div style={{ fontSize:9,color:"#9CA3AF",textAlign:"center",lineHeight:1.2 }}>
                  {a.title.split(" ").slice(0,2).join(" ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {tabs.map(t => (
          <button key={t} onClick={()=>setTab(t)}
            style={{ padding:"7px 18px",borderRadius:8,border:"1px solid",borderColor:tab===t?"#2563EB":"#E5E7EB",background:tab===t?"#EFF6FF":"#fff",color:tab===t?"#2563EB":"#6B7280",fontSize:13,fontWeight:600,cursor:"pointer" }}>
            {t}
            {t==="Upcoming"  && <span style={{ marginLeft:6,fontSize:10.5,background:"#DBEAFE",color:"#2563EB",borderRadius:999,padding:"1px 6px",fontWeight:700 }}>{ASSESSMENTS_DATA.upcoming.length}</span>}
            {t==="Completed" && <span style={{ marginLeft:6,fontSize:10.5,background:"#DCFCE7",color:"#16A34A",borderRadius:999,padding:"1px 6px",fontWeight:700 }}>{ASSESSMENTS_DATA.completed.length}</span>}
          </button>
        ))}
      </div>

      {/* Lists */}
      {(tab==="All"||tab==="Upcoming") && (
        <>
          <div style={{ fontSize:14,fontWeight:700,color:"#1F2937",marginBottom:10 }}>
            Upcoming Assessments
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginBottom:20 }}>
            {ASSESSMENTS_DATA.upcoming.map(a=><UpcomingAssessmentCard key={a.id} item={a} />)}
          </div>
        </>
      )}
      {(tab==="All"||tab==="Completed") && (
        <>
          <div style={{ fontSize:14,fontWeight:700,color:"#1F2937",marginBottom:10 }}>
            Completed Assessments
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12 }}>
            {ASSESSMENTS_DATA.completed.map(a=><CompletedAssessmentCard key={a.id} item={a} />)}
          </div>
        </>
      )}
    </>
  );
}

/* ================================================================
   SETTINGS PAGE
================================================================ */
function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} style={{ border:"none",background:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center" }}>
      {on
        ? <ToggleRight size={30} color="#2563EB" />
        : <ToggleLeft  size={30} color="#D1D5DB" />}
    </button>
  );
}

function SettingsSection({ icon, iconBg, iconColor, title, subtitle, children }) {
  return (
    <div style={{ background:"#fff",border:"1px solid #EEF0F3",borderRadius:14,padding:22,marginBottom:16 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
        <div style={{ width:36,height:36,borderRadius:9,background:iconBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          {React.cloneElement(icon, { size:17, color:iconColor })}
        </div>
        <div>
          <div style={{ fontSize:15,fontWeight:700 }}>{title}</div>
          {subtitle && <div style={{ fontSize:12.5,color:"#6B7280" }}>{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function SettingsRow({ label, sublabel, children }) {
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,paddingBottom:14,marginBottom:14,borderBottom:"1px solid #F3F4F6" }}>
      <div>
        <div style={{ fontSize:13.5,fontWeight:600,color:"#1F2937" }}>{label}</div>
        {sublabel && <div style={{ fontSize:12,color:"#9CA3AF",marginTop:2 }}>{sublabel}</div>}
      </div>
      {children}
    </div>
  );
}

function SettingsField({ value, onChange, placeholder }) {
  return (
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ border:"1px solid #E5E7EB",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#1F2937",outline:"none",width:220,background:"#FAFAFA" }} />
  );
}

function SettingsPage({ karmayogiKey, onKeyChange, rawData, onDataChange, onSync, syncing }) {
  const [showKey, setShowKey] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(rawData, null, 2));
  const [jsonError, setJsonError] = useState(null);

  // Profile state
  const u = rawData?.user || {};
  const [profileName,  setProfileName]  = useState(u.name       || "");
  const [profileRole,  setProfileRole]  = useState(u.role       || "Statistical Investigator");
  const [profileDept,  setProfileDept]  = useState(u.department || "MoSPI");
  const [profileEmail, setProfileEmail] = useState(u.email      || "");
  const [profileSaved, setProfileSaved] = useState(false);

  // Notifications
  const [notifEmail,    setNotifEmail]    = useState(true);
  const [notifAssess,   setNotifAssess]   = useState(true);
  const [notifWeekly,   setNotifWeekly]   = useState(true);
  const [notifAI,       setNotifAI]       = useState(true);
  const [notifCert,     setNotifCert]     = useState(false);

  // Appearance
  const [theme,    setTheme]    = useState("Light");
  const [language, setLanguage] = useState("English");
  const [fontSize, setFontSize] = useState("Medium");

  // Privacy
  const [profileVisible, setProfileVisible] = useState(true);
  const [shareProgress,  setShareProgress]  = useState(true);
  const [dataAI,         setDataAI]         = useState(true);

  // Platform
  const [timezone,   setTimezone]   = useState("Asia/Kolkata (IST)");
  const [dateFormat, setDateFormat] = useState("DD MMM YYYY");
  const [defaultPage,setDefaultPage] = useState("Dashboard");

  function applyJson() {
    try { onDataChange(JSON.parse(jsonText)); setJsonError(null); }
    catch { setJsonError("Invalid JSON — please check the format."); }
  }

  function saveProfile() {
    setProfileSaved(true);
    setTimeout(()=>setProfileSaved(false), 2200);
  }

  return (
    <>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:19,fontWeight:700 }}>Settings</div>
        <div style={{ fontSize:13,color:"#6B7280",marginTop:2 }}>Manage your profile, preferences and platform configuration — SIH26101 · MoSPI</div>
      </div>

      {/* ── PROFILE ─────────────────────────────────────────────── */}
      <SettingsSection icon={<User />} iconBg="#EFF6FF" iconColor="#2563EB" title="Profile" subtitle="Your personal details and role information">
        <SettingsRow label="Full Name" sublabel="As registered on iGOT Karmayogi">
          <SettingsField value={profileName} onChange={setProfileName} placeholder="Full name" />
        </SettingsRow>
        <SettingsRow label="Role / Designation" sublabel="Your current position at MoSPI">
          <SettingsField value={profileRole} onChange={setProfileRole} placeholder="Role" />
        </SettingsRow>
        <SettingsRow label="Department" sublabel="Ministry or department code">
          <SettingsField value={profileDept} onChange={setProfileDept} placeholder="Department" />
        </SettingsRow>
        <SettingsRow label="Official Email" sublabel="Used for assessment notifications">
          <SettingsField value={profileEmail} onChange={setProfileEmail} placeholder="email@gov.in" />
        </SettingsRow>
        <div style={{ display:"flex",justifyContent:"flex-end",marginTop:4 }}>
          <button onClick={saveProfile}
            style={{ display:"flex",alignItems:"center",gap:6,background:profileSaved?"#16A34A":"#2563EB",color:"#fff",border:"none",borderRadius:9,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",transition:"background 0.2s" }}>
            {profileSaved ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save Profile</>}
          </button>
        </div>
      </SettingsSection>

      {/* ── NOTIFICATIONS ───────────────────────────────────────── */}
      <SettingsSection icon={<Bell />} iconBg="#FEF3C7" iconColor="#D97706" title="Notifications" subtitle="Control how and when you receive alerts">
        <SettingsRow label="Email Notifications" sublabel="Receive updates via your official email"><Toggle on={notifEmail} onToggle={()=>setNotifEmail(v=>!v)} /></SettingsRow>
        <SettingsRow label="Assessment Reminders" sublabel="Get reminded 24 hrs before an assessment"><Toggle on={notifAssess} onToggle={()=>setNotifAssess(v=>!v)} /></SettingsRow>
        <SettingsRow label="Weekly Progress Report" sublabel="AI-generated summary every Monday"><Toggle on={notifWeekly} onToggle={()=>setNotifWeekly(v=>!v)} /></SettingsRow>
        <SettingsRow label="AI Insights Alerts" sublabel="Notify when AI detects a new skill gap"><Toggle on={notifAI} onToggle={()=>setNotifAI(v=>!v)} /></SettingsRow>
        <SettingsRow label="Certificate Expiry Alerts" sublabel="Alert 30 days before a cert expires" style={{ borderBottom:"none",marginBottom:0,paddingBottom:0 }}><Toggle on={notifCert} onToggle={()=>setNotifCert(v=>!v)} /></SettingsRow>
      </SettingsSection>

      {/* ── APPEARANCE ──────────────────────────────────────────── */}
      <SettingsSection icon={<Palette />} iconBg="#F5F3FF" iconColor="#7C3AED" title="Appearance" subtitle="Customise how the platform looks and feels">
        <SettingsRow label="Theme" sublabel="Light, dark or follow system setting">
          <div style={{ display:"flex",gap:6 }}>
            {["Light","Dark","System"].map(t=>(
              <button key={t} onClick={()=>setTheme(t)}
                style={{ padding:"7px 12px",borderRadius:8,border:"1px solid",borderColor:theme===t?"#7C3AED":"#E5E7EB",background:theme===t?"#F5F3FF":"#fff",color:theme===t?"#7C3AED":"#6B7280",fontSize:12.5,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                {t==="Light"?<Sun size={13}/>:t==="Dark"?<Moon size={13}/>:<Globe size={13}/>}{t}
              </button>
            ))}
          </div>
        </SettingsRow>
        <SettingsRow label="Language" sublabel="Platform display language">
          <select value={language} onChange={e=>setLanguage(e.target.value)}
            style={{ border:"1px solid #E5E7EB",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#1F2937",outline:"none",background:"#FAFAFA" }}>
            {["English","Hindi","Tamil","Bengali","Gujarati","Marathi"].map(l=><option key={l}>{l}</option>)}
          </select>
        </SettingsRow>
        <SettingsRow label="Text Size" sublabel="Adjust the overall font size">
          <div style={{ display:"flex",gap:6 }}>
            {["Small","Medium","Large"].map(s=>(
              <button key={s} onClick={()=>setFontSize(s)}
                style={{ padding:"7px 12px",borderRadius:8,border:"1px solid",borderColor:fontSize===s?"#7C3AED":"#E5E7EB",background:fontSize===s?"#F5F3FF":"#fff",color:fontSize===s?"#7C3AED":"#6B7280",fontSize:12.5,fontWeight:600,cursor:"pointer" }}>
                {s}
              </button>
            ))}
          </div>
        </SettingsRow>
      </SettingsSection>

      {/* ── PRIVACY ─────────────────────────────────────────────── */}
      <SettingsSection icon={<ShieldCheck />} iconBg="#DCFCE7" iconColor="#16A34A" title="Privacy & Data" subtitle="Control your data visibility and AI usage permissions">
        <SettingsRow label="Profile Visibility" sublabel="Allow your department to view your competency profile"><Toggle on={profileVisible} onToggle={()=>setProfileVisible(v=>!v)} /></SettingsRow>
        <SettingsRow label="Share Progress with Department" sublabel="Include your scores in department-level reports"><Toggle on={shareProgress} onToggle={()=>setShareProgress(v=>!v)} /></SettingsRow>
        <SettingsRow label="Use Data for AI Analysis" sublabel="Allow Claude AI to analyse your Karmayogi data for scoring"><Toggle on={dataAI} onToggle={()=>setDataAI(v=>!v)} /></SettingsRow>
      </SettingsSection>

      {/* ── PLATFORM ────────────────────────────────────────────── */}
      <SettingsSection icon={<Globe />} iconBg="#FEE2E2" iconColor="#DC2626" title="Platform Preferences" subtitle="Time, date and default page settings">
        <SettingsRow label="Time Zone">
          <select value={timezone} onChange={e=>setTimezone(e.target.value)}
            style={{ border:"1px solid #E5E7EB",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#1F2937",outline:"none",background:"#FAFAFA" }}>
            {["Asia/Kolkata (IST)","Asia/Dubai (GST)","UTC","Asia/Singapore (SGT)"].map(t=><option key={t}>{t}</option>)}
          </select>
        </SettingsRow>
        <SettingsRow label="Date Format">
          <div style={{ display:"flex",gap:6 }}>
            {["DD MMM YYYY","DD/MM/YYYY","MM-DD-YYYY"].map(f=>(
              <button key={f} onClick={()=>setDateFormat(f)}
                style={{ padding:"7px 10px",borderRadius:8,border:"1px solid",borderColor:dateFormat===f?"#DC2626":"#E5E7EB",background:dateFormat===f?"#FEE2E2":"#fff",color:dateFormat===f?"#DC2626":"#6B7280",fontSize:11.5,fontWeight:600,cursor:"pointer" }}>
                {f}
              </button>
            ))}
          </div>
        </SettingsRow>
        <SettingsRow label="Default Landing Page" sublabel="Page shown after login">
          <select value={defaultPage} onChange={e=>setDefaultPage(e.target.value)}
            style={{ border:"1px solid #E5E7EB",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#1F2937",outline:"none",background:"#FAFAFA" }}>
            {["Dashboard","My Competencies","Learning Path","Assessments"].map(p=><option key={p}>{p}</option>)}
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* ── INTEGRATION ─────────────────────────────────────────── */}
      <div style={{ display:"flex",alignItems:"center",gap:10,margin:"24px 0 14px" }}>
        <div style={{ fontSize:14,fontWeight:700,color:"#374151" }}>Karmayogi Integration</div>
        <div style={{ flex:1,height:1,background:"#E5E7EB" }} />
      </div>

      {/* API Key — untouched */}
      <div style={{ background:"#fff",border:"1px solid #EEF0F3",borderRadius:14,padding:22,marginBottom:18 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
          <div style={{ width:36,height:36,borderRadius:9,background:"#EEF2FF",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Key size={17} color="#6366F1" />
          </div>
          <div>
            <div style={{ fontSize:15,fontWeight:700 }}>iGOT Karmayogi API Key</div>
            <div style={{ fontSize:12.5,color:"#6B7280" }}>Used to fetch live learning data from the Karmayogi platform</div>
          </div>
        </div>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <div style={{ flex:1,display:"flex",alignItems:"center",gap:8,border:"1px solid #E5E7EB",borderRadius:9,padding:"10px 14px",background:"#FAFAFA" }}>
            <input
              type={showKey?"text":"password"}
              value={karmayogiKey}
              onChange={e=>onKeyChange(e.target.value)}
              placeholder="Paste your iGOT Karmayogi API key here..."
              style={{ flex:1,border:"none",outline:"none",fontSize:13.5,background:"transparent",color:"#1F2937",fontFamily:"monospace" }}
            />
            <button onClick={()=>setShowKey(v=>!v)} style={{ border:"none",background:"none",cursor:"pointer",color:"#9CA3AF",display:"flex",alignItems:"center" }}>
              {showKey?<EyeOff size={16} />:<Eye size={16} />}
            </button>
          </div>
          <button onClick={onSync} disabled={syncing||!karmayogiKey}
            style={{ display:"flex",alignItems:"center",gap:6,background:karmayogiKey?"#6366F1":"#E5E7EB",color:karmayogiKey?"#fff":"#9CA3AF",border:"none",borderRadius:9,padding:"11px 18px",fontSize:13.5,fontWeight:600,cursor:karmayogiKey&&!syncing?"pointer":"not-allowed",whiteSpace:"nowrap" }}>
            <RefreshCw size={14} style={{ animation:syncing?"spin 1s linear infinite":"none" }} />
            {syncing?"Syncing...":"Sync from Karmayogi"}
          </button>
        </div>
        <div style={{ marginTop:10,fontSize:12,color:"#9CA3AF",display:"flex",alignItems:"center",gap:5 }}>
          <AlertTriangle size={11} />Keep your API key private — never share it publicly.
        </div>
      </div>

      {/* JSON Data Editor */}
      <div style={{ background:"#fff",border:"1px solid #EEF0F3",borderRadius:14,padding:22 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,gap:12,flexWrap:"wrap" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:9,background:"#DCFCE7",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Database size={17} color="#16A34A" />
            </div>
            <div>
              <div style={{ fontSize:15,fontWeight:700 }}>Karmayogi Raw Data (JSON)</div>
              <div style={{ fontSize:12.5,color:"#6B7280" }}>Edit directly to simulate different learner states — AI re-analyzes automatically</div>
            </div>
          </div>
          <button onClick={applyJson} style={{ display:"flex",alignItems:"center",gap:6,background:"#16A34A",color:"#fff",border:"none",borderRadius:9,padding:"9px 16px",fontSize:13,fontWeight:600,cursor:"pointer" }}>
            <Save size={14} /> Apply & Re-analyze
          </button>
        </div>
        {jsonError && <div style={{ background:"#FEE2E2",border:"1px solid #FCA5A5",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#DC2626",marginBottom:12 }}>{jsonError}</div>}
        <textarea
          value={jsonText}
          onChange={e=>setJsonText(e.target.value)}
          spellCheck={false}
          style={{ width:"100%",height:360,border:"1px solid #E5E7EB",borderRadius:9,padding:14,fontSize:12.5,fontFamily:"'JetBrains Mono','Fira Code','Courier New',monospace",resize:"vertical",outline:"none",color:"#1F2937",background:"#F9FAFB",boxSizing:"border-box",lineHeight:1.6 }}
        />
      </div>
    </>
  );
}

/* ================================================================
   SIDEBAR
================================================================ */
function SidebarContent({ activePage, onNavigate }) {
  return (
    <>
      <div style={{ display:"flex",alignItems:"center",gap:10,padding:"0 8px 24px" }}>
        <div style={{ width:36,height:36,borderRadius:9,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <BarChart3 size={18} color="#2563EB" />
        </div>
        <div>
          <div style={{ fontWeight:800,fontSize:15,lineHeight:1.1 }}>StatSkill AI</div>
          <div style={{ fontSize:10,color:"#9CA3AF",lineHeight:1.3 }}>SIH26101 · MoSPI<br/>AI-Powered Learning</div>
        </div>
      </div>
      <nav style={{ display:"flex",flexDirection:"column",gap:2 }}>
        {NAV_ITEMS.map(item=>{
          const Icon = navIconMap[item.icon];
          const active = item.label===activePage;
          return (
            <a key={item.label} href="#" onClick={e=>{e.preventDefault();onNavigate(item.label);}}
              style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:9,textDecoration:"none",fontSize:14,fontWeight:active?700:500,color:active?"#2563EB":"#4B5563",background:active?"#EFF6FF":"transparent",cursor:"pointer" }}>
              <Icon size={18} />{item.label}
            </a>
          );
        })}
      </nav>
    </>
  );
}

/* ================================================================
   MAIN APP
================================================================ */
export default function StatSkillDashboard() {
  const [activePage, setActivePage]     = useState("Dashboard");
  const [navOpen, setNavOpen]           = useState(false);
  const [loaded, setLoaded]             = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [aiResult, setAiResult]         = useState(null);
  const [aiLoading, setAiLoading]       = useState(false);
  const [aiError, setAiError]           = useState(null);
  const [rawData, setRawData]           = useState(DEFAULT_KARMAYOGI_JSON);
  const [karmayogiKey, setKarmayogiKey] = useState("");
  const [syncing, setSyncing]           = useState(false);

  const runAnalysis = useCallback(async (data) => {
    setAiLoading(true); setAiError(null);
    try {
      const result = await analyzeWithClaude(data);
      setAiResult(result);
    } catch(e) {
      setAiError("AI analysis failed — " + e.message);
    } finally { setAiLoading(false); }
  }, []);

  // Auto-analyze on load
  useEffect(() => {
    setLoaded(true);
    runAnalysis(rawData);
  }, []);

  // Re-analyze when data changes (e.g., via Settings editor)
  const handleDataChange = (newData) => {
    setRawData(newData);
    runAnalysis(newData);
  };

  // Simulate Karmayogi API sync
  const handleSync = async () => {
    setSyncing(true);
    await new Promise(r=>setTimeout(r,1800)); // simulate network call
    setSyncing(false);
    runAnalysis(rawData); // Re-analyze with (same) data — in production: fetch + update rawData first
  };

  const user = rawData?.user || {};

  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register
          onRegister={(data) => {
            const registeredUser = {
              name: data.name.trim(),
              email: data.email.trim(),
              password: data.password,
              role: rawData?.user?.role || "Statistical Investigator",
              department: rawData?.user?.department || "MoSPI",
              joiningDate: rawData?.user?.joiningDate || "",
              projectId: rawData?.user?.projectId || "SIH26101",
            };

            localStorage.setItem("statSkillUser", JSON.stringify(registeredUser));

            setRawData(prev => ({
              ...prev,
              user: {
                ...prev.user,
                ...registeredUser,
              },
            }));

            alert("Account created successfully!");
            setShowRegister(false);
          }}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        onLogin={({ email, password }) => {
          const savedUser = JSON.parse(localStorage.getItem("statSkillUser") || "null");

          if (!savedUser) {
            alert("No account found. Please create an account first.");
            return;
          }

          if (
            savedUser.email.toLowerCase() !== email.trim().toLowerCase() ||
            savedUser.password !== password
          ) {
            alert("Invalid email or password.");
            return;
          }

          setRawData(prev => ({
            ...prev,
            user: {
              ...prev.user,
              name: savedUser.name,
              email: savedUser.email,
            },
          }));
          setIsLoggedIn(true);
        }}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background:"#F7F8FA", minHeight:"100vh", display:"flex", color:"#111827", opacity:loaded?1:0, transition:"opacity 0.3s" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .sidebar { position:fixed;top:0;bottom:0;left:0;z-index:50;transform:translateX(-100%);transition:transform 0.25s ease;display:flex;flex-direction:column;padding:22px 16px;width:240px;box-sizing:border-box;background:#fff;border-right:1px solid #EEF0F3; }
        .sidebar.open { transform:translateX(0); }
        .overlay { position:fixed;inset:0;background:rgba(15,23,42,0.4);z-index:40;opacity:0;pointer-events:none;transition:opacity 0.2s ease; }
        .overlay.open { opacity:1;pointer-events:auto; }
        @media(min-width:860px){ .sidebar{transform:translateX(0)!important;} .overlay{display:none!important;} .main{margin-left:240px;width:calc(100% - 240px);box-sizing:border-box;} .nav-btn{display:none!important;} }
        @media(max-width:899px){ .three-col{grid-template-columns:1fr!important;} .reco-grid{grid-template-columns:1fr!important;} }
      `}</style>

      <aside className={`sidebar ${navOpen?"open":""}`}>
        <SidebarContent activePage={activePage} onNavigate={label=>{setActivePage(label);setNavOpen(false);}} />
      </aside>
      <div className={`overlay ${navOpen?"open":""}`} onClick={()=>setNavOpen(false)} />

      <div className="main" style={{ flex:1, minWidth:0 }}>
        {/* HEADER */}
        <header style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px",background:"#fff",borderBottom:"1px solid #EEF0F3",position:"sticky",top:0,zIndex:10 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <button className="nav-btn" onClick={()=>setNavOpen(v=>!v)} style={{ border:"none",background:"#F3F4F6",borderRadius:8,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
              <Menu size={18} color="#374151" />
            </button>
            <div>
              <div style={{ fontSize:16,fontWeight:700 }}>Hello, {user.name||"Investigator"}! 👋</div>
              <div style={{ fontSize:12.5,color:"#6B7280" }}>{user.role||"Statistical Investigator"} · {user.department||"MoSPI"}</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            {aiLoading && <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:12.5,color:"#6366F1",background:"#F5F3FF",borderRadius:8,padding:"6px 12px" }}><Brain size={13} style={{ animation:"spin 1s linear infinite" }} />AI Analyzing...</div>}
            {aiError  && <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#DC2626",background:"#FEE2E2",borderRadius:8,padding:"6px 10px" }}><AlertTriangle size={12} />Analysis failed</div>}
            <div style={{ position:"relative" }}>
              <Bell size={20} color="#4B5563" />
              <span style={{ position:"absolute",top:-6,right:-6,background:"#EF4444",color:"#fff",fontSize:10,fontWeight:700,borderRadius:999,width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center" }}>2</span>
            </div>
            <div style={{ width:34,height:34,borderRadius:999,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14 }}>
              {(user.name||"A")[0]}
            </div>
            <ChevronDown size={16} color="#6B7280" />
          </div>
        </header>

        {/* PAGE ROUTER */}
        <main style={{ padding:24, maxWidth:1280, margin:"0 auto" }}>
          {activePage==="Dashboard"       && <DashboardHome aiResult={aiResult} loading={aiLoading} rawData={rawData} onReanalyze={()=>runAnalysis(rawData)} />}
          {activePage==="My Competencies" && <MyCompetenciesPage aiResult={aiResult} loading={aiLoading} onReanalyze={()=>runAnalysis(rawData)} />}
          {activePage==="Learning Path"   && <LearningPathPage />}
          {activePage==="Assessments"     && <AssessmentsPage />}
          {activePage==="My Documents"    && <MyDocumentsPage />}
          {activePage==="Certificates"    && <CertificatesPage />}
          {activePage==="Settings"        && <SettingsPage karmayogiKey={karmayogiKey} onKeyChange={setKarmayogiKey} rawData={rawData} onDataChange={handleDataChange} onSync={handleSync} syncing={syncing} />}
          {!["Dashboard","My Competencies","Learning Path","Assessments","My Documents","Certificates","Settings"].includes(activePage) && (
            <div style={{ textAlign:"center",paddingTop:80,color:"#9CA3AF" }}>
              <GraduationCap size={48} color="#D1D5DB" style={{ marginBottom:12 }} />
              <div style={{ fontSize:16,fontWeight:600 }}>{activePage}</div>
              <div style={{ fontSize:13,marginTop:6 }}>This page is coming soon.</div>
            </div>
          )}
        </main>
      </div>

      {/* HELP */}
      <div style={{ position:"fixed",bottom:20,left:20,background:"#fff",border:"1px solid #EEF0F3",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 4px 12px rgba(16,24,40,0.08)",zIndex:30 }}>
        <div style={{ width:32,height:32,borderRadius:999,background:"#DBEAFE",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <HelpCircle size={16} color="#2563EB" />
        </div>
        <div>
          <div style={{ fontSize:13,fontWeight:700 }}>Need Help?</div>
          <div style={{ fontSize:11.5,color:"#6B7280" }}>Ask our AI Assistant</div>
        </div>
      </div>
    </div>
  );
}
