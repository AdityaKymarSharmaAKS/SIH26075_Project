import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  ClipboardList,
  FileText,
  Award,
  Settings,
  Bell,
  ChevronDown,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Lock,
  Lightbulb,
  Menu,
  Download,
  ShieldCheck,
  CalendarDays,
  Search,
  Star,
  Clock,
  Target,
  BookOpen,
  ChevronRight,
  Trophy,
  Zap,
  GraduationCap,
  MapPin,
  Sparkles,
  RefreshCw,
} from "lucide-react";

/* ------------------------------------------------------------------
   DATA LAYER
   All dashboard content lives in a single JSON-shaped object below.
   In a real deployment this would be the parsed body of a file like
   `dashboard-data.json`, fetched from an API or window.storage.
   Keeping it as one exported constant makes it trivial to swap for
   an actual fetch('/data/dashboard-data.json').then(r => r.json()).
------------------------------------------------------------------- */
const DASHBOARD_JSON = `
{
  "user": {
    "name": "Aditya",
    "role": "Statistical Investigator"
  },
  "stats": [
    { "id": "score", "label": "Overall Competency Score", "value": 72, "max": 100, "suffix": "/100", "note": "Good progress! Keep it up.", "type": "progress", "color": "blue" },
    { "id": "gaps", "label": "Critical Skill Gaps", "value": 2, "note": "Skills need immediate attention", "type": "icon", "icon": "alert", "color": "red" },
    { "id": "learning", "label": "Learning Progress", "value": 65, "suffix": "%", "note": "On track", "type": "progress-icon", "icon": "trend", "color": "green" },
    { "id": "assessments", "label": "Assessments Completed", "value": 8, "note": "of 15 recommended", "type": "icon", "icon": "clipboard", "color": "purple" }
  ],
  "competencies": [
    { "name": "Statistical Methods", "score": 4.2, "max": 5, "icon": "bars", "level": "strong" },
    { "name": "Data Quality", "score": 3.8, "max": 5, "icon": "shield", "level": "strong" },
    { "name": "Python", "score": 2.6, "max": 5, "icon": "python", "level": "moderate" },
    { "name": "GIS", "score": 1.8, "max": 5, "icon": "gis", "level": "weak" },
    { "name": "Machine Learning", "score": 1.5, "max": 5, "icon": "ml", "level": "weak" }
  ],
  "legend": [
    { "label": "Strong (>=3.5)", "level": "strong" },
    { "label": "Moderate (2.0 - 3.4)", "level": "moderate" },
    { "label": "Weak (<2.0)", "level": "weak" }
  ],
  "learningPath": [
    { "step": 1, "title": "GIS Fundamentals", "status": "Completed", "state": "done" },
    { "step": 2, "title": "GIS for Statistics", "status": "In Progress", "state": "active" },
    { "step": 3, "title": "Spatial Analysis Techniques", "status": "Not Started", "state": "locked" },
    { "step": 4, "title": "Assessment & Certification", "status": "Not Started", "state": "locked" }
  ],
  "upcomingAssessments": [
    { "day": "18", "month": "MAY", "title": "Sampling Techniques Quiz", "time": "10:00 AM - 10:45 AM", "color": "blue" },
    { "day": "22", "month": "MAY", "title": "Data Quality Assessment", "time": "02:00 PM - 02:45 PM", "color": "amber" },
    { "day": "26", "month": "MAY", "title": "Python Basics Test", "time": "11:00 AM - 11:45 AM", "color": "green" }
  ],
  "recommendation": {
    "heading": "Recommended for You",
    "message": "Based on your skill gaps, we recommend completing the next module in your path.",
    "cta": "Continue Learning",
    "why": {
      "title": "Why this recommendation?",
      "body": "Your diagnostic assessment shows a high skill gap in GIS which is critical for your role. Completing this module will improve your competency and performance."
    }
  },
  "nav": [
    { "label": "Dashboard", "icon": "dashboard" },
    { "label": "My Competencies", "icon": "competencies" },
    { "label": "Learning Path", "icon": "path" },
    { "label": "Assessments", "icon": "assessments" },
    { "label": "My Documents", "icon": "documents" },
    { "label": "Certificates", "icon": "certificates" },
    { "label": "Settings", "icon": "settings" }
  ]
}
`;

const data = JSON.parse(DASHBOARD_JSON);

/* ------------------------------------------------------------------
   CERTIFICATES PAGE DATA
   Same idea as DASHBOARD_JSON: a JSON-shaped constant, parsed once,
   that drives the Certificates page. Swap for a real fetch() to a
   `certificates-data.json` file with no other code changes.
------------------------------------------------------------------- */
const CERTIFICATES_JSON = `
{
  "summary": [
    { "id": "earned", "label": "Certificates Earned", "value": 3, "note": "Out of 8 available paths", "color": "green", "icon": "award" },
    { "id": "inprogress", "label": "In Progress", "value": 1, "note": "GIS for Statistics track", "color": "blue", "icon": "clock" },
    { "id": "expiring", "label": "Expiring Soon", "value": 1, "note": "Renew within 30 days", "color": "amber", "icon": "alert" }
  ],
  "certificates": [
    {
      "title": "Statistical Methods Fundamentals",
      "issuer": "StatSkill AI Academy",
      "issued": "12 Jan 2026",
      "expires": "12 Jan 2028",
      "credentialId": "SSA-SM-2026-0417",
      "status": "active",
      "color": "green",
      "icon": "bars"
    },
    {
      "title": "Data Quality Assurance",
      "issuer": "StatSkill AI Academy",
      "issued": "03 Mar 2026",
      "expires": "03 Mar 2028",
      "credentialId": "SSA-DQ-2026-0892",
      "status": "active",
      "color": "green",
      "icon": "shield"
    },
    {
      "title": "GIS Fundamentals",
      "issuer": "StatSkill AI Academy",
      "issued": "28 Apr 2026",
      "expires": "28 Apr 2027",
      "credentialId": "SSA-GIS-2026-1350",
      "status": "expiring",
      "color": "amber",
      "icon": "gis"
    },
    {
      "title": "GIS for Statistics",
      "issuer": "StatSkill AI Academy",
      "issued": null,
      "expires": null,
      "credentialId": null,
      "status": "in-progress",
      "progress": 55,
      "color": "blue",
      "icon": "trend"
    },
    {
      "title": "Python for Data Analysis",
      "issuer": "StatSkill AI Academy",
      "issued": null,
      "expires": null,
      "credentialId": null,
      "status": "locked",
      "color": "gray",
      "icon": "python"
    },
    {
      "title": "Machine Learning in Official Statistics",
      "issuer": "StatSkill AI Academy",
      "issued": null,
      "expires": null,
      "credentialId": null,
      "status": "locked",
      "color": "gray",
      "icon": "ml"
    }
  ]
}
`;

const certData = JSON.parse(CERTIFICATES_JSON);

/* ------------------------------------------------------------------
   MY COMPETENCIES PAGE DATA  (competencies-data.json)
------------------------------------------------------------------- */
const COMPETENCIES_JSON = `
{
  "summary": [
    { "id": "assessed",  "label": "Skills Assessed",   "value": 5,    "color": "blue",   "icon": "bars"  },
    { "id": "strong",    "label": "Strong Skills",      "value": 2,    "color": "green",  "icon": "check" },
    { "id": "improve",   "label": "Need Improvement",   "value": 3,    "color": "amber",  "icon": "zap"   },
    { "id": "avg",       "label": "Average Score",      "value": "2.8","color": "purple", "icon": "star"  }
  ],
  "competencies": [
    {
      "name": "Statistical Methods", "score": 4.2, "max": 5, "level": "strong", "icon": "bars",
      "description": "Core statistical analysis techniques for official data collection and reporting.",
      "lastAssessed": "10 May 2026",
      "subSkills": [
        { "name": "Descriptive Statistics",  "score": 90 },
        { "name": "Hypothesis Testing",      "score": 82 },
        { "name": "Regression Analysis",     "score": 78 },
        { "name": "Time Series Analysis",    "score": 88 }
      ],
      "resources": ["Advanced Statistical Methods – Module 4", "Practice: Regression Case Studies"]
    },
    {
      "name": "Data Quality", "score": 3.8, "max": 5, "level": "strong", "icon": "shield",
      "description": "Ensuring accuracy, consistency and reliability of statistical datasets.",
      "lastAssessed": "08 May 2026",
      "subSkills": [
        { "name": "Data Validation",         "score": 85 },
        { "name": "Error Detection",         "score": 74 },
        { "name": "Imputation Techniques",   "score": 70 },
        { "name": "Audit & Review",          "score": 80 }
      ],
      "resources": ["Data Quality Assurance – Module 3", "Workshop: Outlier Detection"]
    },
    {
      "name": "Python", "score": 2.6, "max": 5, "level": "moderate", "icon": "python",
      "description": "Python programming for data analysis, automation and statistical reporting.",
      "lastAssessed": "05 May 2026",
      "subSkills": [
        { "name": "Data Manipulation (pandas)",    "score": 60 },
        { "name": "Visualisation (matplotlib)",    "score": 55 },
        { "name": "Scripting & Automation",        "score": 50 },
        { "name": "Statistical Libraries",         "score": 45 }
      ],
      "resources": ["Python Basics Test – 26 May", "Python for Data Analysis – Module 2"]
    },
    {
      "name": "GIS", "score": 1.8, "max": 5, "level": "weak", "icon": "gis",
      "description": "Geographic Information Systems for spatial data analysis in official statistics.",
      "lastAssessed": "02 May 2026",
      "subSkills": [
        { "name": "Map Projections",         "score": 40 },
        { "name": "Spatial Joins",           "score": 30 },
        { "name": "GIS Tools (QGIS)",        "score": 35 },
        { "name": "Choropleth Mapping",      "score": 38 }
      ],
      "resources": ["GIS for Statistics – In Progress", "Spatial Analysis Techniques – Next"]
    },
    {
      "name": "Machine Learning", "score": 1.5, "max": 5, "level": "weak", "icon": "ml",
      "description": "Applying ML models for predictive analytics and pattern recognition in statistics.",
      "lastAssessed": "01 May 2026",
      "subSkills": [
        { "name": "Supervised Learning",     "score": 32 },
        { "name": "Model Evaluation",        "score": 28 },
        { "name": "Feature Engineering",     "score": 25 },
        { "name": "ML Frameworks",           "score": 30 }
      ],
      "resources": ["Machine Learning in Official Statistics – Locked", "Prerequisite: Complete Python track"]
    }
  ]
}
`;
const competenciesData = JSON.parse(COMPETENCIES_JSON);

/* ------------------------------------------------------------------
   LEARNING PATH PAGE DATA  (learning-path-data.json)
------------------------------------------------------------------- */
const LEARNING_PATH_JSON = `
{
  "summary": [
    { "id": "completed",  "label": "Modules Completed", "value": 1,         "color": "green",  "icon": "check"    },
    { "id": "inprogress", "label": "In Progress",        "value": 1,         "color": "blue",   "icon": "play"     },
    { "id": "hours",      "label": "Hours Completed",    "value": "12",      "color": "purple", "icon": "clock"    },
    { "id": "eta",        "label": "Est. Completion",    "value": "Aug 2026","color": "amber",  "icon": "calendar" }
  ],
  "track": {
    "title": "GIS & Spatial Statistics Track",
    "totalModules": 4,
    "completedModules": 1,
    "totalHours": 32,
    "completedHours": 12
  },
  "modules": [
    {
      "step": 1, "title": "GIS Fundamentals",
      "description": "Introduction to Geographic Information Systems – coordinate systems, map projections, and working with spatial datasets in an official statistics context.",
      "state": "done", "status": "Completed",
      "duration": "8 hrs", "lessons": 6, "completedLessons": 6, "score": 88,
      "completedOn": "28 Apr 2026", "color": "green",
      "topics": ["Coordinate Systems","Map Projections","Spatial Data Formats","QGIS Basics","Data Import/Export","Assessment"]
    },
    {
      "step": 2, "title": "GIS for Statistics",
      "description": "Using GIS tools to prepare and analyse spatial statistical data, integrate census boundaries and produce publication-ready maps.",
      "state": "active", "status": "In Progress",
      "duration": "10 hrs", "lessons": 8, "completedLessons": 4, "progress": 55, "color": "blue",
      "topics": ["Boundary Files","Statistical Overlays","Choropleth Maps","Spatial Joins","Error Checking","Case Study","Visualisation","Assessment"]
    },
    {
      "step": 3, "title": "Spatial Analysis Techniques",
      "description": "Advanced spatial analysis including clustering, interpolation, network analysis and integration with Python-based GIS workflows.",
      "state": "locked", "status": "Not Started",
      "duration": "8 hrs", "lessons": 7, "color": "gray",
      "topics": ["Cluster Analysis","Interpolation","Network Analysis","Hotspot Mapping","Python + GIS","Case Study","Assessment"]
    },
    {
      "step": 4, "title": "Assessment & Certification",
      "description": "Comprehensive assessment covering all three GIS modules, followed by the official StatSkill GIS Certificate examination.",
      "state": "locked", "status": "Not Started",
      "duration": "6 hrs", "lessons": 3, "color": "gray",
      "topics": ["Revision","Practical Exam","Certificate Assessment"]
    }
  ]
}
`;
const lpData = JSON.parse(LEARNING_PATH_JSON);

/* ------------------------------------------------------------------
   RAW ACTIVITY FEED  (karmayogi-activity.json)
   This is what actually drives the Dashboard / My Competencies
   scores. It stands in for the payload the iGOT Karmayogi API would
   push for this learner (assessment attempts, quiz history, module
   completion, time spent). Swap the JSON.parse below for a real
   `await fetch(KARMAYOGI_API_ENDPOINT).then(r => r.json())` and
   nothing else in this file needs to change — the AI scoring engine
   and every component downstream just consume whatever comes back.
------------------------------------------------------------------- */
const RAW_KARMAYOGI_JSON = `
{
  "source": "iGOT Karmayogi (simulated feed)",
  "learner": { "id": "MOSPI-SI-0417", "name": "Aditya", "role": "Statistical Investigator" },
  "totalAssessmentsCompleted": 8,
  "totalAssessmentsRecommended": 15,
  "skillActivity": [
    {
      "skill": "Statistical Methods",
      "modulesCompleted": 4, "modulesTotal": 4, "timeSpentHrs": 22,
      "assessmentAttempts": [
        { "topic": "Descriptive Statistics", "scorePct": 90, "date": "2026-04-18" },
        { "topic": "Hypothesis Testing", "scorePct": 82, "date": "2026-04-30" },
        { "topic": "Regression Analysis", "scorePct": 78, "date": "2026-05-06" },
        { "topic": "Time Series Analysis", "scorePct": 88, "date": "2026-05-10" }
      ]
    },
    {
      "skill": "Data Quality",
      "modulesCompleted": 3, "modulesTotal": 4, "timeSpentHrs": 16,
      "assessmentAttempts": [
        { "topic": "Data Validation", "scorePct": 85, "date": "2026-04-20" },
        { "topic": "Error Detection", "scorePct": 74, "date": "2026-04-28" },
        { "topic": "Imputation Techniques", "scorePct": 70, "date": "2026-05-04" },
        { "topic": "Audit & Review", "scorePct": 80, "date": "2026-05-08" }
      ]
    },
    {
      "skill": "Python",
      "modulesCompleted": 1, "modulesTotal": 4, "timeSpentHrs": 9,
      "assessmentAttempts": [
        { "topic": "Data Manipulation (pandas)", "scorePct": 60, "date": "2026-04-25" },
        { "topic": "Visualisation (matplotlib)", "scorePct": 55, "date": "2026-05-01" },
        { "topic": "Scripting & Automation", "scorePct": 50, "date": "2026-05-05" },
        { "topic": "Statistical Libraries", "scorePct": 45, "date": "2026-05-05" }
      ]
    },
    {
      "skill": "GIS",
      "modulesCompleted": 1, "modulesTotal": 4, "timeSpentHrs": 12,
      "assessmentAttempts": [
        { "topic": "Map Projections", "scorePct": 40, "date": "2026-04-22" },
        { "topic": "Spatial Joins", "scorePct": 30, "date": "2026-04-29" },
        { "topic": "GIS Tools (QGIS)", "scorePct": 35, "date": "2026-05-02" },
        { "topic": "Choropleth Mapping", "scorePct": 38, "date": "2026-05-02" }
      ]
    },
    {
      "skill": "Machine Learning",
      "modulesCompleted": 0, "modulesTotal": 4, "timeSpentHrs": 5,
      "assessmentAttempts": [
        { "topic": "Supervised Learning", "scorePct": 32, "date": "2026-04-15" },
        { "topic": "Model Evaluation", "scorePct": 28, "date": "2026-04-21" },
        { "topic": "Feature Engineering", "scorePct": 25, "date": "2026-04-27" },
        { "topic": "ML Frameworks", "scorePct": 30, "date": "2026-05-01" }
      ]
    }
  ]
}
`;
const karmayogiActivity = JSON.parse(RAW_KARMAYOGI_JSON);

/* ------------------------------------------------------------------
   AI SCORING ENGINE
   Instead of the Dashboard / My Competencies numbers being fixed
   values sitting in a JSON blob, they are computed by an actual AI
   call against the raw activity feed above. This is the "AI enabled
   ... identifies competency gaps" part of SIH26101 — not a decorative
   number, an inference the model makes from the learner's real data.
------------------------------------------------------------------- */
function buildScoringPrompt(rawActivity) {
  return `You are the competency-scoring engine behind an AI-enabled learning platform built for SIH26101 (MoSPI), which identifies competency gaps for officers in India's Official Statistical System and integrates with the iGOT Karmayogi ecosystem.

You are given one learner's raw activity feed pulled from Karmayogi: assessment attempts per skill, module completion, and time spent. Analyse it and score them.

Raw activity feed:
${JSON.stringify(rawActivity, null, 2)}

For each of these five skills — Statistical Methods, Data Quality, Python, GIS, Machine Learning — compute:
- "score": 0-5 scale (one decimal), weighted toward recent assessment attempts and module completion ratio.
- "level": "strong" if score >= 3.5, "moderate" if 2.0-3.4, "weak" if below 2.0.
- "subSkills": reuse the topic names from that skill's assessmentAttempts, each with a 0-100 "score" (their scorePct, lightly smoothed).

Also compute, across all five skills:
- "overallScore": 0-100 weighted overall competency score.
- "criticalGaps": count of skills with level "weak".
- "learningProgressPct": 0-100 overall module-completion percentage.
- "assessmentsCompleted" / "assessmentsRecommended": copy straight from the feed's totals.
- "recommendation": a "message" (one encouraging sentence pointing at the weakest skill) and a "why" (one to two sentences citing the actual numbers that justify it).

Respond with ONLY raw JSON, no markdown fences, no prose before or after, matching exactly this shape:
{
  "stats": { "overallScore": number, "criticalGaps": number, "learningProgressPct": number, "assessmentsCompleted": number, "assessmentsRecommended": number },
  "competencies": [ { "name": string, "score": number, "level": string, "subSkills": [ { "name": string, "score": number } ] } ],
  "recommendation": { "message": string, "why": string }
}`;
}

async function requestAIScoring(rawActivity) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: buildScoringPrompt(rawActivity) }],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI scoring request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const text = (payload.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed || !Array.isArray(parsed.competencies) || !parsed.stats) {
    throw new Error("AI scoring response was missing expected fields");
  }
  return parsed;
}

// Merge AI-computed score/level/subSkills onto the static skill metadata
// (icon, description, resources, lastAssessed) — only the numbers move.
function mergeCompetencies(baseList, aiList) {
  if (!Array.isArray(aiList)) return baseList;
  return baseList.map((base) => {
    const match = aiList.find((a) => a && a.name === base.name);
    if (!match) return base;
    return {
      ...base,
      score: typeof match.score === "number" ? match.score : base.score,
      level: match.level || base.level,
      subSkills:
        Array.isArray(match.subSkills) && match.subSkills.length
          ? match.subSkills
          : base.subSkills,
    };
  });
}

// The My Competencies summary tiles (Skills Assessed / Strong / Need
// Improvement / Average Score) are derived live from whatever the AI
// just scored, instead of being separately hardcoded numbers.
function computeCompetencySummary(competencies) {
  const strong = competencies.filter((c) => c.level === "strong").length;
  const improve = competencies.length - strong;
  const avg = competencies.length
    ? (competencies.reduce((sum, c) => sum + c.score, 0) / competencies.length).toFixed(1)
    : "0.0";
  return [
    { id: "assessed", label: "Skills Assessed", value: competencies.length, color: "blue", icon: "bars" },
    { id: "strong", label: "Strong Skills", value: strong, color: "green", icon: "check" },
    { id: "improve", label: "Need Improvement", value: improve, color: "amber", icon: "zap" },
    { id: "avg", label: "Average Score", value: avg, color: "purple", icon: "star" },
  ];
}

function mergeDashboardStats(baseStats, aiStats) {
  if (!aiStats) return baseStats;
  return baseStats.map((s) => {
    if (s.id === "score" && typeof aiStats.overallScore === "number") {
      return { ...s, value: Math.round(aiStats.overallScore) };
    }
    if (s.id === "gaps" && typeof aiStats.criticalGaps === "number") {
      return {
        ...s,
        value: aiStats.criticalGaps,
        note: aiStats.criticalGaps > 0 ? "Skills need immediate attention" : "No critical gaps right now",
      };
    }
    if (s.id === "learning" && typeof aiStats.learningProgressPct === "number") {
      return { ...s, value: Math.round(aiStats.learningProgressPct) };
    }
    if (s.id === "assessments" && typeof aiStats.assessmentsCompleted === "number") {
      const recommended = aiStats.assessmentsRecommended || 15;
      return { ...s, value: aiStats.assessmentsCompleted, note: `of ${recommended} recommended` };
    }
    return s;
  });
}

/* ------------------------------------------------------------------
   ICON MAPS
------------------------------------------------------------------- */
const navIconMap = {
  dashboard: LayoutDashboard,
  competencies: BarChart3,
  path: TrendingUp,
  assessments: ClipboardList,
  documents: FileText,
  certificates: Award,
  settings: Settings,
};

const compIconMap = {
  bars: BarChart3,
  shield: Award,
  python: FileText,
  gis: TrendingUp,
  ml: ClipboardList,
};

const compIconStyle = {
  bars: { bg: "#DCFCE7", fg: "#16A34A" },
  shield: { bg: "#DBEAFE", fg: "#2563EB" },
  python: { bg: "#FEF3C7", fg: "#D97706" },
  gis: { bg: "#FEE2E2", fg: "#DC2626" },
  ml: { bg: "#F3E8FF", fg: "#9333EA" },
};

const levelColor = {
  strong: "#16A34A",
  moderate: "#F59E0B",
  weak: "#EF4444",
};

const dotColor = {
  blue: "#2563EB",
  amber: "#D97706",
  green: "#16A34A",
};

/* ------------------------------------------------------------------
   SMALL COMPONENTS
------------------------------------------------------------------- */
function ProgressBar({ value, max = 100, color = "#2563EB", track = "#E5E7EB", height = 8 }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ background: track, borderRadius: 999, height, width: "100%", overflow: "hidden" }}>
      <div
        style={{
          background: color,
          width: `${pct}%`,
          height: "100%",
          borderRadius: 999,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

function StatCard({ stat }) {
  const iconWrap = {
    width: 44,
    height: 44,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const colorMap = {
    blue: { text: "#2563EB", bg: "#DBEAFE" },
    red: { text: "#DC2626", bg: "#FEE2E2" },
    green: { text: "#16A34A", bg: "#DCFCE7" },
    purple: { text: "#9333EA", bg: "#F3E8FF" },
  };
  const c = colorMap[stat.color];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EEF0F3",
        borderRadius: 14,
        padding: "18px 20px",
        boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 13.5, color: "#4B5563", fontWeight: 500 }}>{stat.label}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: c.text, lineHeight: 1 }}>{stat.value}</span>
          {stat.suffix && (
            <span style={{ fontSize: 15, color: "#6B7280", fontWeight: 500 }}>{stat.suffix}</span>
          )}
        </div>
        {stat.type !== "progress" && (
          <div style={{ ...iconWrap, background: c.bg }}>
            {stat.icon === "alert" && <AlertCircle size={20} color={c.text} />}
            {stat.icon === "trend" && <TrendingUp size={20} color={c.text} />}
            {stat.icon === "clipboard" && <ClipboardList size={20} color={c.text} />}
          </div>
        )}
      </div>

      {(stat.type === "progress" || stat.type === "progress-icon") && (
        <ProgressBar value={stat.value} max={stat.max || 100} color={c.text} />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#6B7280" }}>
        {stat.type === "progress-icon" && (
          <span style={{ width: 6, height: 6, borderRadius: 999, background: c.text, display: "inline-block" }} />
        )}
        {stat.note}
      </div>
    </div>
  );
}

function CompetencyRow({ item }) {
  const Icon = compIconMap[item.icon] || BarChart3;
  const style = compIconStyle[item.icon];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0" }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: style.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={style.fg} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1F2937", marginBottom: 6 }}>{item.name}</div>
        <ProgressBar value={item.score} max={item.max} color={levelColor[item.level]} height={7} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: levelColor[item.level], width: 52, textAlign: "right" }}>
        {item.score.toFixed(1)} / {item.max}
      </div>
    </div>
  );
}

function LearningStep({ step, isLast }) {
  const iconWrap = {
    width: 32,
    height: 32,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: 13,
    fontWeight: 700,
  };

  let circle;
  if (step.state === "done") {
    circle = (
      <div style={{ ...iconWrap, background: "#16A34A", color: "#fff" }}>
        <CheckCircle2 size={18} />
      </div>
    );
  } else if (step.state === "active") {
    circle = <div style={{ ...iconWrap, background: "#2563EB", color: "#fff" }}>{step.step}</div>;
  } else {
    circle = <div style={{ ...iconWrap, background: "#E5E7EB", color: "#9CA3AF" }}>{step.step}</div>;
  }

  const statusColor = step.state === "done" ? "#16A34A" : step.state === "active" ? "#2563EB" : "#9CA3AF";
  const trailingIcon =
    step.state === "done" ? (
      <span style={{ fontSize: 20 }}>📘</span>
    ) : step.state === "active" ? (
      <PlayCircle size={22} color="#2563EB" />
    ) : (
      <Lock size={17} color="#9CA3AF" />
    );

  return (
    <div style={{ display: "flex", gap: 14, position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {circle}
        {!isLast && <div style={{ width: 2, flex: 1, background: "#E5E7EB", minHeight: 28 }} />}
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 20 }}>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1F2937" }}>{step.title}</div>
          <div style={{ fontSize: 13, color: statusColor, fontWeight: 500, marginTop: 2 }}>{step.status}</div>
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: step.state === "done" ? "#DCFCE7" : step.state === "active" ? "#DBEAFE" : "#F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {trailingIcon}
        </div>
      </div>
    </div>
  );
}

function AssessmentRow({ item }) {
  const bg = { blue: "#EFF6FF", amber: "#FFFBEB", green: "#F0FDF4" }[item.color];
  const dayColor = { blue: "#2563EB", amber: "#D97706", green: "#16A34A" }[item.color];
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        background: bg,
        borderRadius: 12,
        padding: "12px 14px",
      }}
    >
      <div style={{ textAlign: "center", width: 44, flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: dayColor, lineHeight: 1 }}>{item.day}</div>
        <div style={{ fontSize: 10.5, color: dayColor, fontWeight: 700, letterSpacing: 0.5 }}>{item.month}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937" }}>{item.title}</div>
        <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 1 }}>{item.time}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   CERTIFICATES PAGE COMPONENTS
------------------------------------------------------------------- */
const certSummaryColor = {
  green: { text: "#16A34A", bg: "#DCFCE7" },
  blue: { text: "#2563EB", bg: "#DBEAFE" },
  amber: { text: "#D97706", bg: "#FEF3C7" },
};

function CertSummaryCard({ item }) {
  const c = certSummaryColor[item.color];
  const IconEl = item.icon === "award" ? Award : item.icon === "clock" ? CalendarDays : AlertCircle;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EEF0F3",
        borderRadius: 14,
        padding: "18px 20px",
        boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          background: c.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <IconEl size={21} color={c.text} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: c.text, lineHeight: 1.1 }}>{item.value}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", marginTop: 2 }}>{item.label}</div>
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 1 }}>{item.note}</div>
      </div>
    </div>
  );
}

const certStatusStyle = {
  active: { label: "Active", text: "#16A34A", bg: "#DCFCE7" },
  expiring: { label: "Expiring Soon", text: "#D97706", bg: "#FEF3C7" },
  "in-progress": { label: "In Progress", text: "#2563EB", bg: "#DBEAFE" },
  locked: { label: "Not Started", text: "#9CA3AF", bg: "#F3F4F6" },
};

function CertificateCard({ cert }) {
  const Icon = compIconMap[cert.icon] || Award;
  const iconStyle = compIconStyle[cert.icon] || { bg: "#F3F4F6", fg: "#9CA3AF" };
  const status = certStatusStyle[cert.status];
  const isLocked = cert.status === "locked";

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EEF0F3",
        borderRadius: 14,
        padding: 20,
        boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        opacity: isLocked ? 0.7 : 1,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: iconStyle.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={19} color={iconStyle.fg} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1F2937" }}>{cert.title}</div>
            <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 1 }}>{cert.issuer}</div>
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: status.text,
            background: status.bg,
            borderRadius: 999,
            padding: "4px 10px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {status.label}
        </span>
      </div>

      {cert.status === "in-progress" && (
        <div>
          <ProgressBar value={cert.progress} max={100} color="#2563EB" height={7} />
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>{cert.progress}% complete</div>
        </div>
      )}

      {(cert.status === "active" || cert.status === "expiring") && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "#4B5563" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Issued</span>
            <span style={{ fontWeight: 600, color: "#1F2937" }}>{cert.issued}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Expires</span>
            <span style={{ fontWeight: 600, color: cert.status === "expiring" ? "#D97706" : "#1F2937" }}>
              {cert.expires}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Credential ID</span>
            <span style={{ fontWeight: 600, color: "#1F2937" }}>{cert.credentialId}</span>
          </div>
        </div>
      )}

      {cert.status === "locked" && (
        <div style={{ fontSize: 12.5, color: "#9CA3AF" }}>Complete the prerequisite modules to unlock this certificate.</div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {(cert.status === "active" || cert.status === "expiring") && (
          <>
            <button
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: 9,
                padding: "9px 12px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Download size={14} /> Download
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "#F3F4F6",
                color: "#374151",
                border: "none",
                borderRadius: 9,
                padding: "9px 12px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <ShieldCheck size={14} /> Verify
            </button>
          </>
        )}
        {cert.status === "in-progress" && (
          <button
            style={{
              flex: 1,
              background: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "9px 12px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Continue Track
          </button>
        )}
        {cert.status === "locked" && (
          <button
            disabled
            style={{
              flex: 1,
              background: "#F3F4F6",
              color: "#9CA3AF",
              border: "none",
              borderRadius: 9,
              padding: "9px 12px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "not-allowed",
            }}
          >
            Locked
          </button>
        )}
      </div>
    </div>
  );
}

function CertificatesPage() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 700 }}>Certificates</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
            Track and manage the credentials you've earned on your learning path.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 9,
            padding: "8px 12px",
            minWidth: 220,
          }}
        >
          <Search size={15} color="#9CA3AF" />
          <input
            placeholder="Search certificates..."
            style={{ border: "none", outline: "none", fontSize: 13, flex: 1, color: "#374151" }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {certData.summary.map((s) => (
          <CertSummaryCard key={s.id} item={s} />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {certData.certificates.map((c) => (
          <CertificateCard key={c.title} cert={c} />
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------
   MY COMPETENCIES PAGE
------------------------------------------------------------------- */
const compSummaryIconMap = {
  bars: BarChart3, check: CheckCircle2, zap: Zap, star: Star,
};
const compSummaryColorMap = {
  blue: { text: "#2563EB", bg: "#DBEAFE" },
  green: { text: "#16A34A", bg: "#DCFCE7" },
  amber: { text: "#D97706", bg: "#FEF3C7" },
  purple: { text: "#9333EA", bg: "#F3E8FF" },
};

function CompSummaryCard({ item }) {
  const c = compSummaryColorMap[item.color];
  const IconEl = compSummaryIconMap[item.icon] || BarChart3;
  return (
    <div style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:14, padding:"18px 20px",
        boxShadow:"0 1px 2px rgba(16,24,40,0.04)", display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ width:44, height:44, borderRadius:12, background:c.bg,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <IconEl size={20} color={c.text} />
      </div>
      <div>
        <div style={{ fontSize:22, fontWeight:700, color:c.text, lineHeight:1.1 }}>{item.value}</div>
        <div style={{ fontSize:13, fontWeight:600, color:"#1F2937", marginTop:2 }}>{item.label}</div>
      </div>
    </div>
  );
}

function CompetencyDetailCard({ item, isExpanded, onToggle }) {
  const Icon = compIconMap[item.icon] || BarChart3;
  const iconSt = compIconStyle[item.icon] || { bg:"#F3F4F6", fg:"#9CA3AF" };
  const lc = levelColor[item.level];
  const levelLabel = { strong:"Strong", moderate:"Moderate", weak:"Weak" }[item.level];
  const levelBg = { strong:"#DCFCE7", moderate:"#FEF3C7", weak:"#FEE2E2" }[item.level];

  return (
    <div style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:14,
        boxShadow:"0 1px 2px rgba(16,24,40,0.04)", overflow:"hidden" }}>
      {/* Header row */}
      <div style={{ padding:"18px 20px", display:"flex", gap:14, alignItems:"flex-start", cursor:"pointer" }}
        onClick={onToggle}>
        <div style={{ width:44, height:44, borderRadius:11, background:iconSt.bg,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon size={20} color={iconSt.fg} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#1F2937" }}>{item.name}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:11, fontWeight:700, color:lc, background:levelBg,
                  borderRadius:999, padding:"3px 10px" }}>{levelLabel}</span>
              <span style={{ fontSize:16, fontWeight:800, color:lc }}>{item.score.toFixed(1)}<span style={{ fontSize:12, fontWeight:500, color:"#9CA3AF" }}>/5</span></span>
              <ChevronRight size={16} color="#9CA3AF"
                style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition:"transform 0.2s" }} />
            </div>
          </div>
          <div style={{ marginTop:8 }}>
            <ProgressBar value={item.score} max={item.max} color={lc} height={7} />
          </div>
          <div style={{ fontSize:12, color:"#9CA3AF", marginTop:5 }}>Last assessed: {item.lastAssessed}</div>
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div style={{ padding:"0 20px 20px", borderTop:"1px solid #F1F2F4" }}>
          <p style={{ fontSize:13.5, color:"#4B5563", margin:"14px 0", lineHeight:1.6 }}>{item.description}</p>

          <div style={{ fontSize:13, fontWeight:700, color:"#1F2937", marginBottom:10 }}>Sub-skill Breakdown</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:18 }}>
            {item.subSkills.map(s => (
              <div key={s.name} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:13, color:"#4B5563", width:180, flexShrink:0 }}>{s.name}</div>
                <div style={{ flex:1 }}>
                  <ProgressBar value={s.score} max={100} color={lc} height={6} />
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:lc, width:36, textAlign:"right" }}>{s.score}%</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize:13, fontWeight:700, color:"#1F2937", marginBottom:8 }}>Recommended Resources</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {item.resources.map(r => (
              <div key={r} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#374151" }}>
                <BookOpen size={13} color="#2563EB" style={{ flexShrink:0 }} />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MyCompetenciesPage({ competencies, summary, aiStatus, aiUpdatedAt, onRefresh }) {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Strong", "Moderate", "Weak"];
  const filtered = filter === "All"
    ? competencies
    : competencies.filter(c => c.level === filter.toLowerCase());

  return (
    <>
      {/* Page header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, gap:12, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:19, fontWeight:700 }}>My Competencies</div>
          <div style={{ fontSize:13, color:"#6B7280", marginTop:2 }}>
            Detailed breakdown of your skill levels across all assessed domains — SIH26101.
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff",
            border:"1px solid #E5E7EB", borderRadius:9, padding:"8px 12px", minWidth:220 }}>
          <Search size={15} color="#9CA3AF" />
          <input placeholder="Search competencies..."
            style={{ border:"none", outline:"none", fontSize:13, flex:1, color:"#374151" }} />
        </div>
      </div>

      {/* AI STATUS */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <AIStatusBadge status={aiStatus} updatedAt={aiUpdatedAt} onRefresh={onRefresh} />
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, marginBottom:20 }}>
        {summary.map(s => <CompSummaryCard key={s.id} item={s} />)}
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"7px 16px", borderRadius:8, border:"1px solid",
            borderColor: filter===f ? "#2563EB" : "#E5E7EB",
            background: filter===f ? "#EFF6FF" : "#fff",
            color: filter===f ? "#2563EB" : "#6B7280",
            fontSize:13, fontWeight:600, cursor:"pointer"
          }}>{f}</button>
        ))}
      </div>

      {/* Competency cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(item => (
          <CompetencyDetailCard key={item.name} item={item}
            isExpanded={expanded === item.name}
            onToggle={() => setExpanded(expanded === item.name ? null : item.name)} />
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------
   LEARNING PATH PAGE
------------------------------------------------------------------- */
const lpSummaryColorMap = {
  green:  { text:"#16A34A", bg:"#DCFCE7" },
  blue:   { text:"#2563EB", bg:"#DBEAFE" },
  purple: { text:"#9333EA", bg:"#F3E8FF" },
  amber:  { text:"#D97706", bg:"#FEF3C7" },
};
const lpSummaryIconMap = {
  check: CheckCircle2, play: PlayCircle, clock: Clock, calendar: CalendarDays,
};

function LPSummaryCard({ item }) {
  const c = lpSummaryColorMap[item.color];
  const IconEl = lpSummaryIconMap[item.icon] || Clock;
  return (
    <div style={{ background:"#fff", border:"1px solid #EEF0F3", borderRadius:14, padding:"18px 20px",
        boxShadow:"0 1px 2px rgba(16,24,40,0.04)", display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ width:44, height:44, borderRadius:12, background:c.bg,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <IconEl size={20} color={c.text} />
      </div>
      <div>
        <div style={{ fontSize:20, fontWeight:700, color:c.text, lineHeight:1.1 }}>{item.value}</div>
        <div style={{ fontSize:13, fontWeight:600, color:"#1F2937", marginTop:2 }}>{item.label}</div>
      </div>
    </div>
  );
}

function ModuleCard({ mod, isLast }) {
  const stateColor = { done:"#16A34A", active:"#2563EB", locked:"#9CA3AF" };
  const stateBg   = { done:"#DCFCE7", active:"#DBEAFE", locked:"#F3F4F6" };
  const stateLabel= { done:"Completed", active:"In Progress", locked:"Not Started" };
  const sc = stateColor[mod.state];
  const sb = stateBg[mod.state];

  let stepCircle;
  if (mod.state === "done") {
    stepCircle = (
      <div style={{ width:36, height:36, borderRadius:999, background:"#16A34A",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <CheckCircle2 size={20} color="#fff" />
      </div>
    );
  } else if (mod.state === "active") {
    stepCircle = (
      <div style={{ width:36, height:36, borderRadius:999, background:"#2563EB",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          fontWeight:800, color:"#fff", fontSize:15 }}>{mod.step}</div>
    );
  } else {
    stepCircle = (
      <div style={{ width:36, height:36, borderRadius:999, background:"#E5E7EB",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          fontWeight:700, color:"#9CA3AF", fontSize:15 }}>{mod.step}</div>
    );
  }

  return (
    <div style={{ display:"flex", gap:16, position:"relative" }}>
      {/* Timeline column */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:4 }}>
        {stepCircle}
        {!isLast && <div style={{ width:2, flex:1, background:"#E5E7EB", marginTop:6, minHeight:40 }} />}
      </div>

      {/* Card */}
      <div style={{ flex:1, marginBottom: isLast ? 0 : 20,
          background: mod.state==="locked" ? "#FAFAFA" : "#fff",
          border:"1px solid #EEF0F3", borderRadius:14, padding:18,
          boxShadow:"0 1px 2px rgba(16,24,40,0.04)", opacity: mod.state==="locked" ? 0.8 : 1 }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap", marginBottom:10 }}>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:15.5, fontWeight:700, color:"#1F2937" }}>{mod.title}</div>
            <div style={{ display:"flex", gap:14, marginTop:6, flexWrap:"wrap" }}>
              <span style={{ fontSize:12.5, color:"#6B7280", display:"flex", alignItems:"center", gap:4 }}>
                <Clock size={12} /> {mod.duration}
              </span>
              <span style={{ fontSize:12.5, color:"#6B7280", display:"flex", alignItems:"center", gap:4 }}>
                <BookOpen size={12} /> {mod.lessons} lessons
              </span>
              {mod.completedOn && (
                <span style={{ fontSize:12.5, color:"#6B7280", display:"flex", alignItems:"center", gap:4 }}>
                  <CalendarDays size={12} /> Done {mod.completedOn}
                </span>
              )}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
            <span style={{ fontSize:11.5, fontWeight:700, color:sc, background:sb,
                borderRadius:999, padding:"4px 12px", whiteSpace:"nowrap" }}>{stateLabel[mod.state]}</span>
            {mod.score && (
              <span style={{ fontSize:13, fontWeight:700, color:"#16A34A" }}>
                <Trophy size={13} style={{ verticalAlign:"middle", marginRight:3 }} />Score: {mod.score}%
              </span>
            )}
          </div>
        </div>

        <p style={{ fontSize:13.5, color:"#4B5563", margin:"0 0 12px", lineHeight:1.6 }}>{mod.description}</p>

        {/* Progress bar for active */}
        {mod.state === "active" && (
          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:12.5, color:"#6B7280" }}>{mod.completedLessons} of {mod.lessons} lessons done</span>
              <span style={{ fontSize:12.5, fontWeight:700, color:"#2563EB" }}>{mod.progress}%</span>
            </div>
            <ProgressBar value={mod.progress} max={100} color="#2563EB" height={8} />
          </div>
        )}

        {/* Topics */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
          {mod.topics.map((t, i) => (
            <span key={t} style={{ fontSize:11.5, padding:"3px 10px", borderRadius:6,
                background: i < (mod.completedLessons||0) ? "#DCFCE7" : mod.state==="locked" ? "#F3F4F6" : "#EFF6FF",
                color: i < (mod.completedLessons||0) ? "#16A34A" : mod.state==="locked" ? "#9CA3AF" : "#2563EB",
                fontWeight:500 }}>{t}</span>
          ))}
        </div>

        {/* CTA */}
        {mod.state === "done" && (
          <button style={{ display:"flex", alignItems:"center", gap:6, background:"#F3F4F6",
              color:"#374151", border:"none", borderRadius:9, padding:"9px 16px",
              fontSize:13, fontWeight:600, cursor:"pointer" }}>
            <Download size={14} /> Download Certificate
          </button>
        )}
        {mod.state === "active" && (
          <button style={{ display:"flex", alignItems:"center", gap:6, background:"#2563EB",
              color:"#fff", border:"none", borderRadius:9, padding:"9px 16px",
              fontSize:13, fontWeight:600, cursor:"pointer" }}>
            <PlayCircle size={14} /> Continue Learning
          </button>
        )}
        {mod.state === "locked" && (
          <button disabled style={{ display:"flex", alignItems:"center", gap:6, background:"#F3F4F6",
              color:"#9CA3AF", border:"none", borderRadius:9, padding:"9px 16px",
              fontSize:13, fontWeight:600, cursor:"not-allowed" }}>
            <Lock size={14} /> Locked – Complete previous module
          </button>
        )}
      </div>
    </div>
  );
}

function LearningPathPage() {
  const track = lpData.track;
  const overallPct = Math.round((track.completedHours / track.totalHours) * 100);

  return (
    <>
      {/* Page header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, gap:12, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:19, fontWeight:700 }}>Learning Path</div>
          <div style={{ fontSize:13, color:"#6B7280", marginTop:2 }}>
            Track your progress through the {track.title} — SIH26101.
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, marginBottom:20 }}>
        {lpData.summary.map(s => <LPSummaryCard key={s.id} item={s} />)}
      </div>

      {/* Track overview banner */}
      <div style={{ background:"linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%)",
          borderRadius:14, padding:22, marginBottom:22, color:"#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <MapPin size={16} color="#BAE6FD" />
              <span style={{ fontSize:11.5, color:"#BAE6FD", fontWeight:600, letterSpacing:0.5 }}>ACTIVE TRACK</span>
            </div>
            <div style={{ fontSize:17, fontWeight:800 }}>{track.title}</div>
            <div style={{ fontSize:13, color:"#BFDBFE", marginTop:4 }}>
              {track.completedModules} of {track.totalModules} modules · {track.completedHours} of {track.totalHours} hrs completed
            </div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:28, fontWeight:800 }}>{overallPct}%</div>
            <div style={{ fontSize:12, color:"#BFDBFE" }}>Overall Progress</div>
          </div>
        </div>
        <div style={{ marginTop:14 }}>
          <ProgressBar value={overallPct} max={100} color="#BAE6FD" track="rgba(255,255,255,0.2)" height={8} />
        </div>
      </div>

      {/* Module timeline */}
      <div>
        {lpData.modules.map((mod, i) => (
          <ModuleCard key={mod.step} mod={mod} isLast={i === lpData.modules.length - 1} />
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------
   MAIN DASHBOARD
------------------------------------------------------------------- */
export default function StatSkillDashboard() {
  const [navOpen, setNavOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  // AI scoring state — this is what actually computes the Dashboard
  // and My Competencies numbers, instead of them being fixed values.
  const [aiResult, setAiResult] = useState(null); // { stats, competencies, recommendation }
  const [aiStatus, setAiStatus] = useState("idle"); // idle | loading | success | error
  const [aiUpdatedAt, setAiUpdatedAt] = useState(null);

  const runAIAnalysis = async () => {
    setAiStatus("loading");
    try {
      const result = await requestAIScoring(karmayogiActivity);
      setAiResult(result);
      setAiStatus("success");
      setAiUpdatedAt(new Date());
    } catch (err) {
      console.error("AI scoring failed, falling back to last known scores:", err);
      setAiStatus("error");
    }
  };

  // Simulate loading the JSON "file" once on mount, then kick off the
  // real AI analysis against the raw Karmayogi activity feed.
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    runAIAnalysis();
    return () => clearTimeout(t);
  }, []);

  // Merge AI output onto the static skill/stat metadata. Falls back to
  // the base JSON untouched while loading or if the AI call fails.
  const liveCompetencies = mergeCompetencies(competenciesData.competencies, aiResult?.competencies);
  const liveDashboardCompetencies = mergeCompetencies(data.competencies, aiResult?.competencies);
  const liveStats = mergeDashboardStats(data.stats, aiResult?.stats);
  const liveSummary = computeCompetencySummary(liveCompetencies);
  const liveRecommendation = aiResult?.recommendation
    ? {
        ...data.recommendation,
        message: aiResult.recommendation.message || data.recommendation.message,
        why: { ...data.recommendation.why, body: aiResult.recommendation.why || data.recommendation.why.body },
      }
    : data.recommendation;

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#F7F8FA",
        minHeight: "100vh",
        display: "flex",
        color: "#111827",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: 240,
          background: "#fff",
          borderRight: "1px solid #EEF0F3",
          flexDirection: "column",
          padding: "22px 16px",
        }}
        className={`sidebar ${navOpen ? "sidebar-open" : ""}`}
      >
        <SidebarContent
          activePage={activePage}
          onNavigate={(label) => {
            setActivePage(label);
            setNavOpen(false);
          }}
        />
      </aside>

      {/* MOBILE OVERLAY */}
      <div
        className={`overlay ${navOpen ? "overlay-open" : ""}`}
        onClick={() => setNavOpen(false)}
      />

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0 }} className="main-content">
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 28px",
            background: "#fff",
            borderBottom: "1px solid #EEF0F3",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => setNavOpen((v) => !v)}
              className="nav-toggle"
              style={{
                border: "none",
                background: "#F3F4F6",
                borderRadius: 8,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Toggle menu"
            >
              <Menu size={18} color="#374151" />
            </button>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>
                Hello, {data.user.name}! <span>👋</span>
              </div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>{data.user.role}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <Bell size={20} color="#4B5563" />
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#EF4444",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 999,
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                2
              </span>
            </div>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {data.user.name[0]}
            </div>
            <ChevronDown size={16} color="#6B7280" />
          </div>
        </header>

        <main style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>
          {activePage === "Certificates"    && <CertificatesPage />}
          {activePage === "My Competencies" && (
            <MyCompetenciesPage
              competencies={liveCompetencies}
              summary={liveSummary}
              aiStatus={aiStatus}
              aiUpdatedAt={aiUpdatedAt}
              onRefresh={runAIAnalysis}
            />
          )}
          {activePage === "Learning Path"   && <LearningPathPage />}
          {activePage === "Dashboard"       && (
            <DashboardHome
              stats={liveStats}
              competencies={liveDashboardCompetencies}
              recommendation={liveRecommendation}
              aiStatus={aiStatus}
              aiUpdatedAt={aiUpdatedAt}
              onRefresh={runAIAnalysis}
            />
          )}
          {!["Certificates","My Competencies","Learning Path","Dashboard"].includes(activePage) && (
            <div style={{ textAlign:"center", paddingTop:80, color:"#9CA3AF" }}>
              <GraduationCap size={48} color="#D1D5DB" style={{ marginBottom:12 }} />
              <div style={{ fontSize:16, fontWeight:600 }}>{activePage}</div>
              <div style={{ fontSize:13, marginTop:6 }}>This page is coming soon.</div>
            </div>
          )}
        </main>
      </div>

      {/* HELP BUBBLE */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          background: "#fff",
          border: "1px solid #EEF0F3",
          borderRadius: 14,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 4px 12px rgba(16,24,40,0.08)",
          zIndex: 30,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            background: "#DBEAFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <HelpCircle size={17} color="#2563EB" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Need Help?</div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Ask our AI Assistant</div>
        </div>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.25s ease;
          display: flex;
        }
        .sidebar.sidebar-open {
          transform: translateX(0);
        }
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          z-index: 40;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .overlay.overlay-open {
          opacity: 1;
          pointer-events: auto;
        }
        @media (min-width: 860px) {
          .sidebar { transform: translateX(0) !important; }
          .overlay { display: none !important; }
          .main-content { margin-left: 240px; }
          .nav-toggle { display: none !important; }
        }
        @media (max-width: 899px) {
          .three-col { grid-template-columns: 1fr !important; }
          .reco-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

function DashboardHome({ stats, competencies, recommendation, aiStatus, aiUpdatedAt, onRefresh }) {
  return (
    <>
      {/* AI STATUS */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <AIStatusBadge status={aiStatus} updatedAt={aiUpdatedAt} onRefresh={onRefresh} />
      </div>

      {/* STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {stats.map((s) => (
          <StatCard key={s.id} stat={s} />
        ))}
      </div>

      {/* THREE COLUMN SECTION */}
      <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1.1fr 1fr",
              gap: 16,
              marginBottom: 20,
              alignItems: "start",
            }}
            className="three-col"
          >
            {/* COMPETENCIES */}
            <Panel title="My Competencies" action="View All">
              <div>
                {competencies.map((c) => (
                  <CompetencyRow key={c.name} item={c} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10, paddingTop: 14, borderTop: "1px solid #F1F2F4", flexWrap: "wrap" }}>
                {data.legend.map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#6B7280" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: levelColor[l.level], display: "inline-block" }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </Panel>

            {/* LEARNING PATH */}
            <Panel title="My Learning Path" action="View Full Path">
              <div>
                {data.learningPath.map((s, i) => (
                  <LearningStep key={s.step} step={s} isLast={i === data.learningPath.length - 1} />
                ))}
              </div>
            </Panel>

            {/* UPCOMING ASSESSMENTS */}
            <Panel title="Upcoming Assessments" action="View All">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.upcomingAssessments.map((a) => (
                  <AssessmentRow key={a.title} item={a} />
                ))}
              </div>
              <div style={{ marginTop: 14, textAlign: "right" }}>
                <a href="#" style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>
                  View Calendar →
                </a>
              </div>
            </Panel>
          </div>

          {/* RECOMMENDATION */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #EEF0F3",
              borderRadius: 14,
              padding: 24,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              alignItems: "center",
            }}
            className="reco-grid"
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{recommendation.heading}</div>
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 12,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <PlayCircle size={34} color="#2563EB" />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: 14, color: "#374151", margin: 0, marginBottom: 14, lineHeight: 1.5 }}>
                    {recommendation.message}
                  </p>
                  <button
                    style={{
                      background: "#2563EB",
                      color: "#fff",
                      border: "none",
                      borderRadius: 9,
                      padding: "10px 20px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {recommendation.cta}
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#EFF6FF",
                borderRadius: 12,
                padding: 18,
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1D4ED8", marginBottom: 6 }}>
                  {recommendation.why.title}
                </div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{recommendation.why.body}</div>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: "#DBEAFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Lightbulb size={20} color="#2563EB" />
              </div>
            </div>
          </div>
    </>
  );
}

function SidebarContent({ activePage, onNavigate }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 24px" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: "#EFF6FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarChart3 size={18} color="#2563EB" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>StatSkill AI</div>
          <div style={{ fontSize: 10.5, color: "#9CA3AF", lineHeight: 1.2 }}>
            AI Powered Learning
            <br />
            for Official Statistics
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {data.nav.map((item) => {
          const Icon = navIconMap[item.icon];
          const isActive = item.label === activePage;
          return (
            <a
              key={item.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.label);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 9,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#2563EB" : "#4B5563",
                background: isActive ? "#EFF6FF" : "transparent",
                cursor: "pointer",
              }}
            >
              <Icon size={18} />
              {item.label}
            </a>
          );
        })}
      </nav>
    </>
  );
}

function AIStatusBadge({ status, updatedAt, onRefresh }) {
  const stateMap = {
    idle: { text: "Preparing AI analysis…", color: "#6B7280", bg: "#F3F4F6" },
    loading: { text: "AI is analysing Karmayogi activity…", color: "#2563EB", bg: "#EFF6FF" },
    success: {
      text: `AI-scored from live activity${updatedAt ? " · " + updatedAt.toLocaleTimeString() : ""}`,
      color: "#16A34A",
      bg: "#DCFCE7",
    },
    error: { text: "AI unavailable — showing last known scores", color: "#D97706", bg: "#FEF3C7" },
  };
  const s = stateMap[status] || stateMap.idle;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12.5,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        borderRadius: 999,
        padding: "6px 12px",
      }}
    >
      <Sparkles size={13} />
      <span>{s.text}</span>
      <button
        onClick={onRefresh}
        title="Recompute with AI"
        aria-label="Recompute with AI"
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: 0,
          color: s.color,
        }}
      >
        <RefreshCw size={13} className={status === "loading" ? "spin" : ""} />
      </button>
    </div>
  );
}

function Panel({ title, action, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EEF0F3",
        borderRadius: 14,
        padding: 20,
        boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700 }}>{title}</div>
        <a href="#" style={{ fontSize: 12.5, color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>
          {action}
        </a>
      </div>
      {children}
    </div>
  );
}
