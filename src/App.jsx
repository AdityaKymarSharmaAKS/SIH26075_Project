import React, { useEffect, useMemo, useState } from "react";
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
  Upload,
  User,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import Login from "./login.jsx";
import Register from "./register.jsx";
import "./solo.css";
import "./executive.css";
import "./aurora.css";

const NAV = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "My Competencies", label: "My Competencies", icon: BarChart3 },
  { id: "Learning Path", label: "Learning Path", icon: TrendingUp },
  { id: "Assessments", label: "Assessments", icon: ClipboardList },
  { id: "My Documents", label: "My Documents", icon: FolderOpen },
  { id: "Certificates", label: "Certificates", icon: Award },
  { id: "Analytics", label: "Analytics", icon: BarChart3 },
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

const NOTIFICATIONS = {
  en: ["GIS for Statistics — 55% complete", "New assessment scheduled: Sampling Techniques Quiz", "2h ago", "1d ago"],
  hi: ["GIS for Statistics — 55% पूर्ण", "नया मूल्यांकन निर्धारित: सैंपलिंग तकनीक क्विज़", "2 घंटे पहले", "1 दिन पहले"],
  ta: ["GIS for Statistics — 55% நிறைவு", "புதிய மதிப்பீடு திட்டமிடப்பட்டது: மாதிரி எடுக்கும் நுட்பங்கள் வினாடி வினா", "2 மணி நேரத்திற்கு முன்", "1 நாளுக்கு முன்"],
  te: ["GIS for Statistics — 55% పూర్తి", "కొత్త అసెస్‌మెంట్ షెడ్యూల్ చేయబడింది: సాంప్లింగ్ టెక్నిక్స్ క్విజ్", "2 గంటల క్రితం", "1 రోజు క్రితం"],
};

function notificationsFor(lang) {
  const [progress, assessment, recent, yesterday] = NOTIFICATIONS[lang] || NOTIFICATIONS.en;
  return [{ id:"n1", title:progress, time:recent, color:"cyan" }, { id:"n2", title:assessment, time:yesterday, color:"amber" }];
}

const LOCALIZED_COPY = {
  en: { profilePhoto: "Profile picture", changePhoto: "Choose photo", removePhoto: "Remove", profileHint: "A photo and your display name appear across your workspace.", languageHint: "English · हिन्दी · தமிழ் · తెలుగు", appearanceHint: "Light / Dark" },
  hi: { profilePhoto: "प्रोफ़ाइल चित्र", changePhoto: "चित्र चुनें", removePhoto: "हटाएँ", profileHint: "आपका चित्र और प्रदर्शन नाम पूरे कार्यक्षेत्र में दिखाई देता है।", languageHint: "English · हिन्दी · தமிழ் · తెలుగు", appearanceHint: "लाइट / डार्क" },
  ta: { profilePhoto: "சுயவிவரப் படம்", changePhoto: "படத்தைத் தேர்ந்தெடுக்கவும்", removePhoto: "அகற்று", profileHint: "உங்கள் படம் மற்றும் காட்சிப் பெயர் பணியிடத்தில் தோன்றும்.", languageHint: "English · हिन्दी · தமிழ் · తెలుగు", appearanceHint: "லைட் / டார்க்" },
  te: { profilePhoto: "ప్రొఫైల్ చిత్రం", changePhoto: "చిత్రాన్ని ఎంచుకోండి", removePhoto: "తొలగించు", profileHint: "మీ చిత్రం మరియు ప్రదర్శన పేరు వర్క్‌స్పేస్ అంతటా కనిపిస్తాయి.", languageHint: "English · हिन्दी · தமிழ் · తెలుగు", appearanceHint: "లైట్ / డార్క్" },
};

const DICTIONARY = {
  en:{
    dashboard:"Dashboard",competencies:"My Competencies",path:"Learning Path",assessments:"Assessments",
    documents:"My Documents",certificates:"Certificates",analytics:"Analytics",settings:"Settings",
    hello:"Hello",online:"SYSTEM ONLINE",command:"SYSTEM COMMAND CENTER",role:"Statistical Investigator",
    competency:"Overall Competency",gaps:"Critical Skill Gaps",learning:"Learning Progress",completed:"Assessments Completed",
    strong:"Strong",moderate:"Moderate",weak:"Weak",continue:"Continue Learning",viewAll:"View All",
    upcoming:"Upcoming Assessments",recommendation:"Recommended for You",insight:"AI Insight",profile:"Profile Settings",
    language:"Language",theme:"Theme",dark:"Dark",light:"Light",save:"Save Changes",displayName:"Display Name",
    department:"Department",signOut:"Sign Out",search:"Search",completedModules:"Modules Completed",hours:"Hours Completed",
    completion:"Estimated Completion",solo:"Solo System",executive:"Executive",aurora:"Aurora",
    gapAssessment:"Competency Gap Assessment",priority:"Priority Recommendations",
    player:"Player Status",rank:"Rank",level:"Level",xp:"XP",strength:"Strength",dataQuality:"Data Quality",gis:"GIS",ml:"ML",
    activeModule:"Active Module",trajectory:"Competency trajectory is positive",openAnalysis:"Open Analysis",
    completeGis:"Complete GIS for Statistics",systemOnline:"System Online",trainingPipeline:"Training Pipeline",
    schedule:"Schedule",matrix:"Competency Matrix",skillMatrix:"Skill Matrix",currentReadiness:"Current Readiness",
    assessmentControl:"Assessment Control",documentVault:"Document Vault",credentialLedger:"Credential Ledger",
    totalDocuments:"Total Documents",shared:"Shared",addedThisMonth:"Added This Month",certificatesEarned:"Certificates Earned",
    inProgress:"In Progress",expiringSoon:"Expiring Soon",verifyCredential:"Verify Credential",continueTrack:"Continue Track",
    appearance:"Appearance",switchAppearance:"Switch between dashboard modes.",nextCheckpoints:"Next Checkpoints",
    upcomingQueue:"Upcoming Queue",openDetails:"Open Details",activeTrack:"Active Track",lessons:"lessons",
    reviewModule:"Review Module",continueModule:"Continue Module",locked:"Locked",modulesCompleted:"Modules Completed",
    graphical:"Graphical Representation",visualSummary:"Visual summary of your competency, assessment and learning data.",
    competencyScores:"Competency Scores",assessmentHistory:"Assessment History",learningMix:"Learning Effort by Domain",
    score:"Score",hoursLabel:"Hours",noData:"No data available",
    competencyEngine:"Competency Engine",dataVisuals:"Data Visuals",systemConfiguration:"System Configuration",
    visualSystem:"Visual System",securityStatus:"Security Status",demoEnvironment:"Local Demo Environment",
    connectProduction:"Connect the production authentication and API layer before deployment.",email:"Email",
    notifications:"Notifications",noNotifications:"No new notifications",help:"Help",live:"Live"
  },
  hi:{
    dashboard:"डैशबोर्ड",competencies:"मेरी दक्षताएँ",path:"लर्निंग पाथ",assessments:"मूल्यांकन",
    documents:"मेरे दस्तावेज़",certificates:"प्रमाणपत्र",analytics:"विश्लेषण",settings:"सेटिंग्स",
    hello:"नमस्ते",online:"सिस्टम ऑनलाइन",command:"सिस्टम कमांड सेंटर",role:"सांख्यिकी अन्वेषक",
    competency:"कुल दक्षता",gaps:"महत्वपूर्ण कौशल अंतर",learning:"लर्निंग प्रगति",completed:"पूर्ण मूल्यांकन",
    strong:"मज़बूत",moderate:"मध्यम",weak:"कमज़ोर",continue:"सीखना जारी रखें",viewAll:"सभी देखें",
    upcoming:"आगामी मूल्यांकन",recommendation:"आपके लिए अनुशंसित",insight:"AI अंतर्दृष्टि",profile:"प्रोफ़ाइल सेटिंग्स",
    language:"भाषा",theme:"थीम",dark:"डार्क",light:"लाइट",save:"बदलाव सहेजें",displayName:"डिस्प्ले नाम",
    department:"विभाग",signOut:"साइन आउट",search:"खोजें",completedModules:"पूर्ण मॉड्यूल",hours:"पूर्ण घंटे",
    completion:"अनुमानित पूर्णता",solo:"सोलो सिस्टम",executive:"एग्जीक्यूटिव",aurora:"ऑरोरा",
    gapAssessment:"दक्षता अंतर मूल्यांकन",priority:"प्राथमिक अनुशंसाएँ",
    player:"प्लेयर स्थिति",rank:"रैंक",level:"स्तर",xp:"XP",strength:"मज़बूती",dataQuality:"डेटा गुणवत्ता",gis:"GIS",ml:"ML",
    activeModule:"सक्रिय मॉड्यूल",trajectory:"दक्षता की प्रगति सकारात्मक है",openAnalysis:"विश्लेषण खोलें",
    completeGis:"GIS for Statistics पूरा करें",systemOnline:"सिस्टम ऑनलाइन",trainingPipeline:"प्रशिक्षण पाइपलाइन",
    schedule:"समय-सारणी",matrix:"दक्षता मैट्रिक्स",skillMatrix:"कौशल मैट्रिक्स",currentReadiness:"वर्तमान तैयारी",
    assessmentControl:"मूल्यांकन नियंत्रण",documentVault:"दस्तावेज़ वॉल्ट",credentialLedger:"प्रमाणपत्र रिकॉर्ड",
    totalDocuments:"कुल दस्तावेज़",shared:"साझा",addedThisMonth:"इस माह जोड़े गए",certificatesEarned:"अर्जित प्रमाणपत्र",
    inProgress:"प्रगति में",expiringSoon:"जल्द समाप्त",verifyCredential:"प्रमाणपत्र सत्यापित करें",continueTrack:"ट्रैक जारी रखें",
    appearance:"दिखावट",switchAppearance:"डैशबोर्ड मोड बदलें।",nextCheckpoints:"अगले चरण",
    upcomingQueue:"आगामी कतार",openDetails:"विवरण खोलें",activeTrack:"सक्रिय ट्रैक",lessons:"पाठ",
    reviewModule:"मॉड्यूल देखें",continueModule:"मॉड्यूल जारी रखें",locked:"लॉक्ड",modulesCompleted:"पूर्ण मॉड्यूल",
    graphical:"ग्राफ़िकल प्रतिनिधित्व",visualSummary:"आपकी दक्षता, मूल्यांकन और लर्निंग डेटा का दृश्य सारांश।",
    competencyScores:"दक्षता स्कोर",assessmentHistory:"मूल्यांकन इतिहास",learningMix:"डोमेन के अनुसार लर्निंग प्रयास",
    score:"स्कोर",hoursLabel:"घंटे",noData:"डेटा उपलब्ध नहीं",
    competencyEngine:"दक्षता इंजन",dataVisuals:"डेटा विज़ुअल्स",systemConfiguration:"सिस्टम कॉन्फ़िगरेशन",
    visualSystem:"विज़ुअल सिस्टम",securityStatus:"सुरक्षा स्थिति",demoEnvironment:"लोकल डेमो एनवायरनमेंट",
    connectProduction:"डिप्लॉय करने से पहले प्रोडक्शन ऑथेंटिकेशन और API लेयर से कनेक्ट करें।",email:"ईमेल",
    notifications:"सूचनाएँ",noNotifications:"कोई नई सूचना नहीं",help:"सहायता",live:"लाइव"
  },
  ta:{
    dashboard:"டாஷ்போர்டு",competencies:"என் திறன்கள்",path:"கற்றல் பாதை",assessments:"மதிப்பீடுகள்",
    documents:"என் ஆவணங்கள்",certificates:"சான்றிதழ்கள்",analytics:"பகுப்பாய்வு",settings:"அமைப்புகள்",
    hello:"வணக்கம்",online:"சிஸ்டம் ஆன்லைன்",command:"சிஸ்டம் கட்டளை மையம்",role:"புள்ளியியல் ஆய்வாளர்",
    competency:"மொத்த திறன்",gaps:"முக்கிய திறன் இடைவெளிகள்",learning:"கற்றல் முன்னேற்றம்",completed:"முடிக்கப்பட்ட மதிப்பீடுகள்",
    strong:"வலுவான",moderate:"மிதமான",weak:"பலவீனமான",continue:"கற்றலைத் தொடரவும்",viewAll:"அனைத்தையும் காண்க",
    upcoming:"வரவிருக்கும் மதிப்பீடுகள்",recommendation:"உங்களுக்கான பரிந்துரைகள்",insight:"AI நுண்ணறிவு",profile:"சுயவிவர அமைப்புகள்",
    language:"மொழி",theme:"தீம்",dark:"டார்க்",light:"லைட்",save:"மாற்றங்களைச் சேமிக்கவும்",displayName:"காட்சிப் பெயர்",
    department:"துறை",signOut:"வெளியேறு",search:"தேடல்",completedModules:"முடிக்கப்பட்ட தொகுதிகள்",hours:"முடிக்கப்பட்ட மணிநேரங்கள்",
    completion:"மதிப்பிடப்பட்ட நிறைவு",solo:"சோலோ சிஸ்டம்",executive:"எக்ஸிக்யூட்டிவ்",aurora:"ஆரோரா",
    gapAssessment:"திறன் இடைவெளி மதிப்பீடு",priority:"முன்னுரிமை பரிந்துரைகள்",
    player:"பிளேயர் நிலை",rank:"தரம்",level:"நிலை",xp:"XP",strength:"வலிமை",dataQuality:"தரவு தரம்",gis:"GIS",ml:"ML",
    activeModule:"செயலில் உள்ள தொகுதி",trajectory:"திறன் முன்னேற்றம் நேர்மறையாக உள்ளது",openAnalysis:"பகுப்பாய்வைத் திறக்கவும்",
    completeGis:"GIS for Statistics ஐ முடிக்கவும்",systemOnline:"சிஸ்டம் ஆன்லைன்",trainingPipeline:"பயிற்சி பைப்லைன்",
    schedule:"அட்டவணை",matrix:"திறன் மேட்ரிக்ஸ்",skillMatrix:"திறன் மேட்ரிக்ஸ்",currentReadiness:"தற்போதைய தயார்நிலை",
    assessmentControl:"மதிப்பீட்டு கட்டுப்பாடு",documentVault:"ஆவண களஞ்சியம்",credentialLedger:"சான்றிதழ் பதிவு",
    totalDocuments:"மொத்த ஆவணங்கள்",shared:"பகிரப்பட்டது",addedThisMonth:"இந்த மாதம் சேர்க்கப்பட்டது",certificatesEarned:"பெற்ற சான்றிதழ்கள்",
    inProgress:"முன்னேற்றத்தில்",expiringSoon:"விரைவில் காலாவதியாகும்",verifyCredential:"சான்றைச் சரிபார்க்கவும்",continueTrack:"டிராக்கைத் தொடரவும்",
    appearance:"தோற்றம்",switchAppearance:"டாஷ்போர்டு முறைகளை மாற்றவும்.",nextCheckpoints:"அடுத்த கட்டங்கள்",
    upcomingQueue:"வரவிருக்கும் வரிசை",openDetails:"விவரங்களைத் திறக்கவும்",activeTrack:"செயலில் உள்ள டிராக்",lessons:"பாடங்கள்",
    reviewModule:"மாட்யூலைப் பார்க்கவும்",continueModule:"மாட்யூலைத் தொடரவும்",locked:"பூட்டப்பட்டது",modulesCompleted:"முடிக்கப்பட்ட மாட்யூல்கள்",
    graphical:"வரைகலை பிரதிநிதித்துவம்",visualSummary:"உங்கள் திறன், மதிப்பீடு மற்றும் கற்றல் தரவின் காட்சி சுருக்கம்.",
    competencyScores:"திறன் மதிப்பெண்கள்",assessmentHistory:"மதிப்பீட்டு வரலாறு",learningMix:"டொமைன் அடிப்படையிலான கற்றல் முயற்சி",
    score:"மதிப்பெண்",hoursLabel:"மணிநேரம்",noData:"தரவு இல்லை",
    competencyEngine:"திறன் இயந்திரம்",dataVisuals:"தரவு காட்சிகள்",systemConfiguration:"சிஸ்டம் கட்டமைப்பு",
    visualSystem:"காட்சி அமைப்பு",securityStatus:"பாதுகாப்பு நிலை",demoEnvironment:"லோக்கல் டெமோ சூழல்",
    connectProduction:"டிப்ளாய் செய்வதற்கு முன் தயாரிப்பு அங்கீகாரம் மற்றும் API லேயருடன் இணைக்கவும்.",email:"மின்னஞ்சல்",
    notifications:"அறிவிப்புகள்",noNotifications:"புதிய அறிவிப்புகள் இல்லை",help:"உதவி",live:"நேரலை"
  },
  te:{
    dashboard:"డాష్‌బోర్డ్",competencies:"నా సామర్థ్యాలు",path:"లెర్నింగ్ పాత్",assessments:"అసెస్‌మెంట్లు",
    documents:"నా పత్రాలు",certificates:"సర్టిఫికెట్లు",analytics:"విశ్లేషణ",settings:"సెట్టింగ్స్",
    hello:"నమస్కారం",online:"సిస్టమ్ ఆన్‌లైన్",command:"సిస్టమ్ కమాండ్ సెంటర్",role:"గణాంక పరిశోధకుడు",
    competency:"మొత్తం సామర్థ్యం",gaps:"కీలక నైపుణ్య లోపాలు",learning:"లెర్నింగ్ పురోగతి",completed:"పూర్తయిన అసెస్‌మెంట్లు",
    strong:"బలమైన",moderate:"మోస్తరు",weak:"బలహీనమైన",continue:"లెర్నింగ్ కొనసాగించండి",viewAll:"అన్నీ చూడండి",
    upcoming:"రాబోయే అసెస్‌మెంట్లు",recommendation:"మీ కోసం సిఫార్సులు",insight:"AI అంతర్దృష్టి",profile:"ప్రొఫైల్ సెట్టింగ్స్",
    language:"భాష",theme:"థీమ్",dark:"డార్క్",light:"లైట్",save:"మార్పులను సేవ్ చేయండి",displayName:"డిస్ప్లే పేరు",
    department:"విభాగం",signOut:"సైన్ అవుట్",search:"శోధన",completedModules:"పూర్తయిన మాడ్యూల్స్",hours:"పూర్తయిన గంటలు",
    completion:"అంచనా పూర్తి",solo:"సోలో సిస్టమ్",executive:"ఎగ్జిక్యూటివ్",aurora:"ఆరోరా",
    gapAssessment:"సామర్థ్య లోపాల అంచనా",priority:"ప్రాధాన్య సిఫార్సులు",
    player:"ప్లేయర్ స్థితి",rank:"ర్యాంక్",level:"స్థాయి",xp:"XP",strength:"బలం",dataQuality:"డేటా నాణ్యత",gis:"GIS",ml:"ML",
    activeModule:"యాక్టివ్ మాడ్యూల్",trajectory:"సామర్థ్య పురోగతి సానుకూలంగా ఉంది",openAnalysis:"విశ్లేషణ తెరవండి",
    completeGis:"GIS for Statistics పూర్తి చేయండి",systemOnline:"సిస్టమ్ ఆన్‌లైన్",trainingPipeline:"శిక్షణ పైప్‌లైన్",
    schedule:"షెడ్యూల్",matrix:"సామర్థ్య మ్యాట్రిక్స్",skillMatrix:"నైపుణ్య మ్యాట్రిక్స్",currentReadiness:"ప్రస్తుత సిద్ధత",
    assessmentControl:"అసెస్‌మెంట్ నియంత్రణ",documentVault:"డాక్యుమెంట్ వాల్ట్",credentialLedger:"సర్టిఫికేట్ రికార్డు",
    totalDocuments:"మొత్తం పత్రాలు",shared:"షేర్ చేసినవి",addedThisMonth:"ఈ నెల చేర్చినవి",certificatesEarned:"పొందిన సర్టిఫికెట్లు",
    inProgress:"పురోగతిలో",expiringSoon:"త్వరలో గడువు ముగుస్తుంది",verifyCredential:"క్రెడెన్షియల్ ధృవీకరించండి",continueTrack:"ట్రాక్ కొనసాగించండి",
    appearance:"రూపకల్పన",switchAppearance:"డాష్‌బోర్డ్ మోడ్‌లను మార్చండి.",nextCheckpoints:"తదుపరి దశలు",
    upcomingQueue:"రాబోయే క్యూ",openDetails:"వివరాలు తెరవండి",activeTrack:"యాక్టివ్ ట్రాక్",lessons:"పాఠాలు",
    reviewModule:"మాడ్యూల్ చూడండి",continueModule:"మాడ్యూల్ కొనసాగించండి",locked:"లాక్ చేయబడింది",modulesCompleted:"పూర్తయిన మాడ్యూల్స్",
    graphical:"గ్రాఫికల్ ప్రాతినిధ్యం",visualSummary:"మీ సామర్థ్యం, అసెస్‌మెంట్ మరియు లెర్నింగ్ డేటా యొక్క దృశ్య సారాంశం.",
    competencyScores:"సామర్థ్య స్కోర్లు",assessmentHistory:"అసెస్‌మెంట్ చరిత్ర",learningMix:"డొమైన్ వారీ లెర్నింగ్ ప్రయత్నం",
    score:"స్కోర్",hoursLabel:"గంటలు",noData:"డేటా అందుబాటులో లేదు",
    competencyEngine:"కాంపిటెన్సీ ఇంజిన్",dataVisuals:"డేటా విజువల్స్",systemConfiguration:"సిస్టమ్ కాన్ఫిగరేషన్",
    visualSystem:"విజువల్ సిస్టమ్",securityStatus:"సెక్యూరిటీ స్థితి",demoEnvironment:"లోకల్ డెమో ఎన్విరాన్‌మెంట్",
    connectProduction:"డిప్లాయ్ చేయడానికి ముందు ప్రొడక్షన్ అథెంటికేషన్ మరియు API లేయర్‌ను కనెక్ట్ చేయండి.",email:"ఇమెయిల్",
    notifications:"నోటిఫికేషన్‌లు",noNotifications:"కొత్త నోటిఫికేషన్‌లు లేవు",help:"సహాయం",live:"లైవ్"
  }
};

function tr(lang, key) {
  return DICTIONARY[lang]?.[key] || DICTIONARY.en[key] || key;
}

function copy(lang, key) {
  return LOCALIZED_COPY[lang]?.[key] || LOCALIZED_COPY.en[key] || key;
}

function safeUser() {
  try {
    return JSON.parse(localStorage.getItem("statSkillUser") || "null");
  } catch {
    return null;
  }
}


/* ================================================================
   COMPETENCY ENGINE
   Multi-signal prototype analytics. Benchmark values are configurable
   and should be replaced by the authoritative MoSPI/iGOT catalogue
   once that backend mapping is approved.
================================================================ */
const KARMAYOGI_DATA = {
  assessments: [
    {domain:"statisticalMethods",score:78,title:"Statistical Methods Quiz 1"},
    {domain:"statisticalMethods",score:84,title:"Statistical Methods Quiz 2"},
    {domain:"dataQuality",score:80,title:"Data Quality Assessment"},
    {domain:"gis",score:88,title:"GIS Fundamentals Assessment"},
    {domain:"python",score:60,title:"Python Basics Test"}
  ],
  courses: [
    {domain:"statisticalMethods",score:88,hours:12},
    {domain:"statisticalMethods",score:79,hours:8},
    {domain:"statisticalMethods",score:85,hours:6},
    {domain:"dataQuality",score:85,hours:6},
    {domain:"dataQuality",score:75,hours:5},
    {domain:"gis",score:88,hours:8},
    {domain:"python",score:62,hours:10},
    {domain:"python",score:55,hours:8}
  ],
  selfAssessment:{
    statisticalMethods:[4,4,3,4],
    dataQuality:[4,3,3,4],
    python:[3,2,2,2],
    gis:[2,1,2,2],
    machineLearning:[1,1,1,1]
  },
  learningHours:{statisticalMethods:32,dataQuality:18,python:24,gis:20,machineLearning:4}
};

const ENGINE_DEFINITIONS = [
  {key:"statisticalMethods",name:"Statistical Methods",icon:BarChart3,benchmark:3.5,weight:1.15,
   description:"Inference, sampling, regression and time-series analysis.",
   subSkills:["Descriptive Statistics","Hypothesis Testing","Regression Analysis","Time Series Analysis"]},
  {key:"dataQuality",name:"Data Quality",icon:ShieldCheck,benchmark:3.5,weight:1.05,
   description:"Validation, error detection, review and quality assurance.",
   subSkills:["Data Validation","Error Detection","Imputation","Audit & Review"]},
  {key:"python",name:"Python",icon:FileText,benchmark:3,weight:1,
   description:"Python for data analysis, automation and statistical workflows.",
   subSkills:["pandas","Visualisation","Automation","Statistical Libraries"]},
  {key:"gis",name:"GIS & Spatial Statistics",icon:Target,benchmark:3,weight:1,
   description:"Spatial datasets, mapping, GIS tools and geographic analysis.",
   subSkills:["Map Projections","Spatial Joins","GIS Tools","Choropleth Mapping"]},
  {key:"machineLearning",name:"Machine Learning",icon:Zap,benchmark:3,weight:.95,
   description:"Predictive modelling, evaluation and feature engineering.",
   subSkills:["Supervised Learning","Model Evaluation","Feature Engineering","ML Frameworks"]}
];

const average = values => {
  const n = values.map(Number).filter(Number.isFinite);
  return n.length ? n.reduce((a,b)=>a+b,0)/n.length : 0;
};

function runCompetencyEngine(data=KARMAYOGI_DATA){
  const competencies = ENGINE_DEFINITIONS.map(def=>{
    const assessments = data.assessments.filter(x=>x.domain===def.key);
    const courses = data.courses.filter(x=>x.domain===def.key);
    const quiz = average(assessments.map(x=>x.score))/20;
    const course = average(courses.map(x=>x.score))/20;
    const self = average(data.selfAssessment[def.key] || []);
    const hours = Number(data.learningHours[def.key] || 0);
    const effort = Math.min(5,hours/8);

    const score = Math.max(0,Math.min(5,quiz*.50+course*.25+self*.15+effort*.10));
    const level = score>=3.5 ? "Strong" : score>=2 ? "Moderate" : "Weak";
    const gap = Math.max(0,def.benchmark-score);

    let trend="Stable";
    if(assessments.length>1){
      const delta=Number(assessments[assessments.length-1].score)-Number(assessments[0].score);
      trend=delta>=5 ? "Improving" : delta<=-5 ? "Declining" : "Stable";
    }

    return {
      ...def,
      score:Number(score.toFixed(2)),
      level,trend,
      gap:Number(gap.toFixed(2)),
      gapPercent:Math.round(gap/def.benchmark*100),
      evidence:{
        quizAverage:Math.round(average(assessments.map(x=>x.score))),
        courseAverage:Math.round(average(courses.map(x=>x.score))),
        selfAssessment:Math.round(self*20),
        learningHours:hours
      },
      subSkills:def.subSkills.map((name,i)=>({
        name,score:Math.round(Number((data.selfAssessment[def.key]||[])[i]||0)*20)
      }))
    };
  });

  const totalWeight=competencies.reduce((s,c)=>s+c.weight,0);
  const weighted=competencies.reduce((s,c)=>s+c.score*c.weight,0)/totalWeight;
  const quizAverage=Math.round(average(data.assessments.map(x=>x.score)));
  const totalHours=Object.values(data.learningHours).reduce((s,h)=>s+Number(h||0),0);

  const overallScore=Math.round(Math.min(100,Math.max(0,
    weighted*20*.82+quizAverage*.12+Math.min(totalHours,100)*.06
  )));

  const topGaps=[...competencies].sort((a,b)=>b.gap-a.gap).slice(0,3);
  const recommendations=topGaps.map(c=>({
    gis:"Complete GIS for Statistics and practise spatial joins and choropleth mapping.",
    machineLearning:"Strengthen Python foundations before moving into model evaluation and ML.",
    python:"Build pandas, visualisation and automation skills through practical datasets.",
    dataQuality:"Practise validation, error detection and statistical audit workflows.",
    statisticalMethods:"Target sampling, regression and time-series exercises for greater analytical depth."
  }[c.key])).filter(Boolean);

  return {
    overallScore,
    criticalGaps:competencies.filter(c=>c.level==="Weak").length,
    moderateGaps:competencies.filter(c=>c.level==="Moderate").length,
    strongSkills:competencies.filter(c=>c.level==="Strong").length,
    assessmentAverage:quizAverage,
    learningHours:totalHours,
    competencies,topGaps,recommendations,
    methodology:"50% assessments · 25% courses · 15% self-assessment · 10% learning effort"
  };
}

/* Production boundary:
   iGOT/Karmayogi authentication, tokens and API calls belong on the
   backend. The frontend should receive a normalized minimum-necessary
   payload and pass it through runCompetencyEngine(). */
async function loadKarmayogiData(){
  return KARMAYOGI_DATA;
}

function SystemCard({ children, className = "" }) {
  return <section className={`system-card ${className || "bare-card"}`}>{children}</section>;
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
          <div className="system-label">{tr(lang, "player")} / 01</div>
          <div className="player-layout">
            <div className="avatar-xl">{(user.name || "A")[0]}</div>
            <div className="player-info">
              <div className="player-name">{user.name || "Aditya"}</div>
              <div className="player-role">{user.role || tr(lang, "role")}</div>
              <div className="rank-line"><span>{tr(lang, "rank").toUpperCase()}</span><strong>A</strong><span>{tr(lang, "level").toUpperCase()}</span><strong>72</strong></div>
              <div className="xp-row"><span>{tr(lang, "xp")}</span><Progress value={72} color="cyan" /><strong>72%</strong></div>
            </div>
          </div>
          <div className="metric-strip">
            <div><span>{tr(lang, "strength").toUpperCase()}</span><strong>4.2</strong></div>
            <div><span>{tr(lang, "dataQuality").toUpperCase()}</span><strong>3.8</strong></div>
            <div><span>{tr(lang, "gis")}</span><strong>1.8</strong></div>
            <div><span>{tr(lang, "ml")}</span><strong>1.5</strong></div>
          </div>
        </SystemCard>

        <SystemCard className="recommendation-card">
          <div className="system-label">{tr(lang, "recommendation")}</div>
          <div className="recommendation-title"><Sparkles size={18} /> Complete GIS for Statistics</div>
          <p>Your strongest opportunity is closing the GIS competency gap. Continue the active module to raise spatial-analysis readiness.</p>
          <div className="recommendation-box">
            <div><span>{tr(lang, "activeModule").toUpperCase()}</span><strong>GIS for Statistics</strong></div>
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
          <div className="card-header"><div><div className="system-label">{tr(lang, "matrix").toUpperCase()}</div><h2>{tr(lang, "competencies")}</h2></div><button className="ghost-btn" onClick={() => onNavigate("My Competencies")}>{tr(lang, "viewAll")} <ChevronRight size={14} /></button></div>
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
          <div className="card-header"><div><div className="system-label">{tr(lang, "trainingPipeline").toUpperCase()}</div><h2>{tr(lang, "path")}</h2></div><button className="ghost-btn" onClick={() => onNavigate("Learning Path")}>{tr(lang, "viewAll")} <ChevronRight size={14} /></button></div>
          <div className="timeline">
            {MODULES.map((m) => <div className="timeline-row" key={m.step}>
              <div className={`timeline-node ${m.state}`}>{m.state === "done" ? <Check size={13} /> : m.state === "locked" ? <Lock size={12} /> : m.step}</div>
              <div className="grow"><strong>{m.title}</strong><span>{m.status} · {m.duration}</span></div>
              {m.state !== "locked" && <div className="mini-progress"><Progress value={m.progress} color={m.state === "done" ? "green" : "cyan"} /></div>}
            </div>)}
          </div>
        </SystemCard>

        <SystemCard>
          <div className="card-header"><div><div className="system-label">{tr(lang, "schedule").toUpperCase()}</div><h2>{tr(lang, "upcoming")}</h2></div><CalendarDays size={17} /></div>
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
        <div className="grow"><div className="system-label">{tr(lang, "insight")}</div><h2>{tr(lang, "trajectory")}</h2><p>Strong performance in Statistical Methods and Data Quality gives a solid foundation. The fastest score improvement should come from finishing GIS for Statistics and strengthening Python.</p></div>
        <button className="secondary-btn" onClick={() => onNavigate("My Competencies")}>{tr(lang, "openAnalysis")} <ChevronRight size={14} /></button>
      </SystemCard>
    </div>
  );
}

function CompetenciesPage({ engine, lang }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => engine.competencies.filter(c => c.name.toLowerCase().includes(query.toLowerCase())), [engine.competencies, query]);
  return (
    <div className="stack">
      <PageHeading kicker={tr(lang, "competencyEngine").toUpperCase()} title={tr(lang, "competencies")} subtitle={tr(lang, "visualSummary")} actions={<div className="search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={tr(lang, "search")} /></div>} />
      <div className="summary-grid">
        <SystemCard className="summary-card"><span>{tr(lang,"competencies").toUpperCase()}</span><strong>{engine.competencies.length}</strong></SystemCard>
        <SystemCard className="summary-card"><span>{tr(lang,"strong").toUpperCase()}</span><strong className="green">{engine.strongSkills}</strong></SystemCard>
        <SystemCard className="summary-card"><span>{tr(lang,"gaps").toUpperCase()}</span><strong className="amber">{engine.criticalGaps + engine.moderateGaps}</strong></SystemCard>
        <SystemCard className="summary-card"><span>{tr(lang,"score").toUpperCase()}</span><strong className="cyan">{(engine.competencies.reduce((s,c)=>s+c.score,0)/engine.competencies.length).toFixed(1)} / 5</strong></SystemCard>
      </div>
      <SystemCard className="engine-competency-block">
        <div className="engine-panel-head">
          <div><div className="system-label">{tr(lang,"gapAssessment")}</div><h2>Benchmark comparison</h2><p>Multi-signal competency analysis across assessment, course, self-assessment and learning effort.</p></div>
          <div className="engine-score">{engine.overallScore}<span>/100</span></div>
        </div>
        <div className="engine-evidence-grid">
          {engine.competencies.map(item=><div className="engine-evidence" key={item.key}>
            <div className="engine-evidence-title"><strong>{item.name}</strong><Pill tone={item.level.toLowerCase()}>{item.level}</Pill></div>
            <Progress value={item.score*20} color="cyan" />
            <div className="engine-evidence-meta"><span>{item.score.toFixed(1)}/5</span><span>{item.gap ? `Gap ${item.gap.toFixed(1)}` : "Benchmark met"}</span><span>{item.trend}</span></div>
          </div>)}
        </div>
        <div className="recommendation-stack"><div className="system-label">{tr(lang,"priority")}</div>
          {engine.recommendations.map((r,i)=><div className="recommendation-line" key={r}><b>0{i+1}</b><span>{r}</span></div>)}
        </div>
      </SystemCard>
      <SystemCard>
        <div className="card-header"><div><div className="system-label">{tr(lang,"skillMatrix")}</div><h2>{tr(lang,"currentReadiness")}</h2></div><Pill>5 domains</Pill></div>
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

function LearningPage({ lang }) {
  return <div className="stack">
    <PageHeading kicker={tr(lang, "trainingPipeline").toUpperCase()} title={tr(lang,"path")} subtitle="GIS & Spatial Statistics Track" />
    <SystemCard className="track-banner">
      <div><div className="system-label">{tr(lang,"activeTrack").toUpperCase()}</div><h2>GIS & Spatial Statistics Track</h2><p>1 of 4 modules completed · 12 / 32 hours completed</p></div>
      <div className="track-ring">38%</div>
    </SystemCard>
    <div className="module-grid">
      {MODULES.map((m) => <SystemCard key={m.step} className={`module-card ${m.state}`}>
        <div className="module-top"><span className="module-number">0{m.step}</span><Pill tone={m.state === "done" ? "strong" : m.state === "active" ? "active" : "locked"}>{m.status === "Completed" ? tr(lang,"completed") : m.status === "In Progress" ? tr(lang,"inProgress") : tr(lang,"locked")}</Pill></div>
        <h2>{m.title}</h2><p>Structured module with practical lessons, domain exercises and assessment checkpoints.</p>
        <div className="module-meta"><span>{m.duration}</span><span>{m.lessons} {tr(lang,"lessons")}</span></div>
        <Progress value={m.progress} color={m.state === "done" ? "green" : "cyan"} />
        <button className={m.state === "locked" ? "secondary-btn disabled" : "primary-btn"} disabled={m.state === "locked"}>{m.state === "locked" ? <Lock size={14} /> : <PlayCircle size={14} />}{m.state === "done" ? tr(lang,"reviewModule") : m.state === "active" ? tr(lang,"continueModule") : tr(lang,"locked")}</button>
      </SystemCard>)}
    </div>
  </div>;
}

function AssessmentsPage({ lang }) {
  return <div className="stack">
    <PageHeading kicker={tr(lang,"assessmentControl").toUpperCase()} title={tr(lang,"assessments")} subtitle={tr(lang,"upcoming")} />
    <div className="stats-grid three">
      <StatCard label={tr(lang,"completed")} value={8} suffix="/15" meta="Recommended" color="green" icon={CheckCircle2} />
      <StatCard label={tr(lang,"score")} value={78} suffix="%" meta="Across completed tests" color="cyan" icon={Target} />
      <StatCard label="Next Assessment" value="18" suffix=" MAY" meta="Sampling Techniques" color="purple" icon={CalendarDays} />
    </div>
    <SystemCard><div className="card-header"><div><div className="system-label">{tr(lang,"upcomingQueue")}</div><h2>{tr(lang,"nextCheckpoints")}</h2></div></div><div className="assessment-list large">{ASSESSMENTS.map((a, i) => <div className={`assessment ${a.color}`} key={a.title}><div className="assessment-number">0{i + 1}</div><div className="grow"><strong>{a.title}</strong><span>{a.time} · 45 min</span></div><button className="secondary-btn">{tr(lang,"openDetails")} <ChevronRight size={14} /></button></div>)}</div></SystemCard>
  </div>;
}

function DocumentsPage({ lang }) {
  const [query, setQuery] = useState("");
  const filtered = DOCUMENTS.filter(d => `${d[1]} ${d[2]}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="stack">
    <PageHeading kicker={tr(lang,"documentVault").toUpperCase()} title={tr(lang,"documents")} subtitle={tr(lang,"visualSummary")} actions={<div className="search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={tr(lang,"search")} /></div>} />
    <div className="summary-grid three">
      <SystemCard className="summary-card"><span>{tr(lang,"totalDocuments").toUpperCase()}</span><strong>12</strong></SystemCard>
      <SystemCard className="summary-card"><span>{tr(lang,"shared").toUpperCase()}</span><strong className="purple">3</strong></SystemCard>
      <SystemCard className="summary-card"><span>{tr(lang,"addedThisMonth").toUpperCase()}</span><strong className="green">4</strong></SystemCard>
    </div>
    <SystemCard><div className="document-table"><div className="table-head"><span>{tr(lang,"documents")}</span><span>Category</span><span>Size</span><span>Action</span></div>{filtered.map(d => <div className="table-row" key={d[0]}><div className="doc-name"><div className="file-icon"><FileText size={16} /></div><div><strong>{d[1]}</strong><span>{d[0]}</span></div></div><span>{d[2]}</span><span>{d[3]}</span><button className="icon-btn" title="Download"><Download size={15} /></button></div>)}</div></SystemCard>
  </div>;
}

function CertificatesPage({ lang }) {
  return <div className="stack">
    <PageHeading kicker={tr(lang,"credentialLedger").toUpperCase()} title={tr(lang,"certificates")} subtitle={tr(lang,"visualSummary")} />
    <div className="summary-grid three">
      <SystemCard className="summary-card"><span>{tr(lang,"certificatesEarned").toUpperCase()}</span><strong className="green">3</strong></SystemCard>
      <SystemCard className="summary-card"><span>{tr(lang,"inProgress").toUpperCase()}</span><strong className="cyan">1</strong></SystemCard>
      <SystemCard className="summary-card"><span>{tr(lang,"expiringSoon").toUpperCase()}</span><strong className="amber">1</strong></SystemCard>
    </div>
    <div className="certificate-grid">
      {CERTIFICATES.map(c => <SystemCard className="certificate-card" key={c.title}>
        <div className="certificate-top"><div className={`mini-icon ${c.color}`}><Award size={17} /></div><Pill tone={c.color === "green" ? "strong" : c.color === "amber" ? "warning" : "active"}>{c.status}</Pill></div>
        <h2>{c.title}</h2><p>{c.issuer}</p>
        {c.progress ? <><Progress value={c.progress} color="cyan" /><div className="stat-meta">{c.progress}% complete</div></> : <div className="certificate-meta"><span>Issued<strong>{c.issued}</strong></span><span>Expires<strong>{c.expires}</strong></span></div>}
        <button className="secondary-btn"><ShieldCheck size={14} /> {c.progress ? tr(lang,"continueTrack") : tr(lang,"verifyCredential")}</button>
      </SystemCard>)}
    </div>
  </div>;
}


function AnalyticsPage({ engine, lang }) {
  const maxScore = 5;
  const hoursEntries = engine.competencies.map(c => ({
    name: c.name,
    hours: Number(engine.learningHours ? 0 : 0)
  }));
  const rawHours = KARMAYOGI_DATA.learningHours;
  const totalHours = Object.values(rawHours).reduce((sum, value) => sum + Number(value || 0), 0) || 1;
  const barColors = ["green","blue","amber","red","purple"];
  return (
    <div className="stack analytics-page">
      <PageHeading
        kicker={tr(lang, "dataVisuals").toUpperCase()}
        title={tr(lang,"graphical")}
        subtitle={tr(lang,"visualSummary")}
      />
      <div className="analytics-kpi-grid">
        <SystemCard><span>{tr(lang,"competency")}</span><strong>{engine.overallScore}<small>/100</small></strong></SystemCard>
        <SystemCard><span>{tr(lang,"score")}</span><strong>{engine.assessmentAverage}<small>%</small></strong></SystemCard>
        <SystemCard><span>{tr(lang,"hoursLabel")}</span><strong>{engine.learningHours}<small>h</small></strong></SystemCard>
      </div>
      <div className="analytics-grid">
        <SystemCard className="chart-card">
          <div className="card-header"><div><div className="system-label">01</div><h2>{tr(lang,"competencyScores")}</h2></div></div>
          <div className="vertical-bars">
            {engine.competencies.map((c,i)=>(
              <div className="vbar-item" key={c.key}>
                <div className="vbar-value">{c.score.toFixed(1)}</div>
                <div className="vbar-track"><div className={`vbar-fill ${barColors[i%barColors.length]}`} style={{height:`${(c.score/maxScore)*100}%`}} /></div>
                <span>{c.name.replace(" & Spatial Statistics","")}</span>
              </div>
            ))}
          </div>
        </SystemCard>

        <SystemCard className="chart-card">
          <div className="card-header"><div><div className="system-label">02</div><h2>{tr(lang,"assessmentHistory")}</h2></div></div>
          <div className="line-chart-wrap">
            <svg viewBox="0 0 640 260" className="line-chart" role="img" aria-label={tr(lang,"assessmentHistory")}>
              <line x1="45" y1="220" x2="620" y2="220" />
              <line x1="45" y1="170" x2="620" y2="170" />
              <line x1="45" y1="120" x2="620" y2="120" />
              <line x1="45" y1="70" x2="620" y2="70" />
              <polyline points="65,135 190,90 315,110 440,70 565,160" fill="none" stroke="currentColor" strokeWidth="4" />
              {[[65,135],[190,90],[315,110],[440,70],[565,160]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="6" />)}
              <text x="55" y="245">Q1</text><text x="180" y="245">Q2</text><text x="305" y="245">Q3</text><text x="430" y="245">Q4</text><text x="555" y="245">Q5</text>
            </svg>
          </div>
          <div className="chart-footnote">78% → 84% → 80% → 88% → 60%</div>
        </SystemCard>

        <SystemCard className="chart-card">
          <div className="card-header"><div><div className="system-label">03</div><h2>{tr(lang,"learningMix")}</h2></div></div>
          <div className="donut-layout">
            <div className="donut" aria-label={tr(lang,"learningMix")} />
            <div className="legend-list">
              {Object.entries(rawHours).map(([key,h],i)=>{
                const def = ENGINE_DEFINITIONS.find(d=>d.key===key);
                return <div className="legend-row" key={key}><span className={`legend-dot ${barColors[i%barColors.length]}`} /><div><strong>{def?.name || key}</strong><span>{h} {tr(lang,"hoursLabel")}</span></div><b>{Math.round((Number(h)/totalHours)*100)}%</b></div>
              })}
            </div>
          </div>
        </SystemCard>
      </div>
    </div>
  );
}

function SettingsPage({ user, lang, setLang, theme, setTheme, appearance, setAppearance, onSaveUser }) {
  const [name, setName] = useState(user.name || "");
  const [photo, setPhoto] = useState(user.photo || "");
  const [saved, setSaved] = useState(false);
  const save = () => {
    const next = { ...user, name: name.trim() || user.name, photo };
    localStorage.setItem("statSkillUser", JSON.stringify(next));
    onSaveUser(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  const updatePhoto = event => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };
  return <div className="stack">
    <PageHeading kicker={tr(lang, "systemConfiguration").toUpperCase()} title={tr(lang, "settings")} subtitle={tr(lang, "visualSummary")} />
    <div className="settings-grid">
      <SystemCard>
        <div className="system-label">{tr(lang, "profile").toUpperCase()}</div>
        <h2>{tr(lang, "profile")}</h2>
        <div className="profile-photo-editor">
          <div className="profile-photo-preview">{photo ? <img src={photo} alt="" /> : <span>{(name || user.name || "A")[0].toUpperCase()}</span>}</div>
          <div className="profile-photo-actions"><strong>{copy(lang, "profilePhoto")}</strong><span>{copy(lang, "profileHint")}</span><div><label className="photo-upload"><Upload size={13} /> {copy(lang, "changePhoto")}<input type="file" accept="image/*" onChange={updatePhoto} /></label>{photo && <button type="button" className="photo-remove" onClick={() => setPhoto("")}>{copy(lang, "removePhoto")}</button>}</div></div>
        </div>
        <label className="field-label">{tr(lang, "displayName")}<input value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="field-label">{tr(lang, "email")}<input value={user.email || ""} readOnly /></label>
        <label className="field-label">{tr(lang, "department")}<input value={user.department || "MoSPI"} readOnly /></label>
        <button className="primary-btn" onClick={save}><Save size={14} /> {tr(lang, "save")}</button>
        {saved && <div className="save-note"><CheckCircle2 size={14} /> {tr(lang, "save")}</div>}
      </SystemCard>
      <SystemCard className="theme-choice-card">
        <div className="system-label">{tr(lang, "visualSystem").toUpperCase()}</div>
        <h2>{tr(lang,"theme")}</h2>
        <div className="theme-options">
          <button type="button" className={`theme-option ${theme==="solo"?"active":""}`} onClick={()=>setTheme("solo")}><span className="theme-dot solo"/><span>{tr(lang,"solo")}</span></button>
          <button type="button" className={`theme-option ${theme==="executive"?"active":""}`} onClick={()=>setTheme("executive")}><span className="theme-dot executive"/><span>{tr(lang,"executive")}</span></button>
          <button type="button" className={`theme-option ${theme==="aurora"?"active":""}`} onClick={()=>setTheme("aurora")}><span className="theme-dot aurora"/><span>{tr(lang,"aurora")}</span></button>
        </div>
        <div className="setting-row"><div><strong>{tr(lang,"language")}</strong><span>{copy(lang, "languageHint")}</span></div>
          <div className="language-buttons">
            {[["en","EN"],["hi","हिं"],["ta","த"],["te","తె"]].map(([code,label])=><button type="button" key={code} className={lang===code?"active":""} onClick={()=>setLang(code)}>{label}</button>)}
          </div>
        </div>
        <div className="setting-row"><div><strong>{tr(lang,"appearance")}</strong><span>{copy(lang, "appearanceHint")}</span></div>
          <button type="button" className="theme-switch" onClick={()=>setAppearance(v=>v==="dark"?"light":"dark")}>
            {appearance==="dark"?<Sun size={15}/>:<Moon size={15}/>} {appearance==="dark"?tr(lang,"dark"):tr(lang,"light")}
          </button>
        </div>
      </SystemCard>
    </div>
    <SystemCard className="security-card"><ShieldCheck size={22} /><div><div className="system-label">{tr(lang, "securityStatus").toUpperCase()}</div><h2>{tr(lang, "demoEnvironment")}</h2><p>{tr(lang, "connectProduction")}</p></div></SystemCard>
  </div>;
}


function Sidebar({ active, setActive, open, setOpen, lang, user, onLogout }) {
  return <aside className={`sidebar ${open ? "open" : ""}`}>
    <div className="brand">
      <div className="brand-mark"><BarChart3 size={20} /></div>
      <div><strong>StatSkill AI</strong><span>SIH26101 · MoSPI</span></div>
    </div>
    <div className="sidebar-status"><span className="live-dot" /> {tr(lang, "online")}</div>
    <nav>{NAV.map(item => { const Icon = item.icon; return <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => { setActive(item.id); setOpen(false); }}><Icon size={17} /><span>{tr(lang, item.id === "Dashboard" ? "dashboard" : item.id === "My Competencies" ? "competencies" : item.id === "Learning Path" ? "path" : item.id === "Assessments" ? "assessments" : item.id === "My Documents" ? "documents" : item.id === "Certificates" ? "certificates" : item.id === "Analytics" ? "analytics" : "settings")}</span>{active === item.id && <ChevronRight size={13} />}</button>; })}</nav>
    <div className="sidebar-spacer" />
    <div className="sidebar-player">
      <div className="small-label">{tr(lang,"player").toUpperCase()}</div><strong>{user.name || "Investigator"}</strong><span>{user.role || "Statistical Investigator"}</span><Progress value={72} color="cyan" /><div className="player-bottom"><span>LV. 72</span><span>RANK A</span></div>
    </div>
    <button className="logout-btn" onClick={onLogout}><X size={15} /> {tr(lang, "signOut")}</button>
  </aside>;
}

export default function App() {
  const [engine, setEngine] = useState(() => runCompetencyEngine(KARMAYOGI_DATA));
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("statSkillVisualTheme");
    return stored === "executive" || stored === "aurora" || stored === "solo" ? stored : "solo";
  });
  const [appearance, setAppearance] = useState(() => localStorage.getItem("statSkillAppearance") === "light" ? "light" : "dark");
  const [lang, setLang] = useState(() => ["en","hi","ta","te"].includes(localStorage.getItem("statSkillLanguage")) ? localStorage.getItem("statSkillLanguage") : "en");
  const [user, setUser] = useState(() => safeUser());
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("statSkillSession") === "active");
  const [register, setRegister] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifications = notificationsFor(lang);

  useEffect(() => {
    let mounted = true;
    loadKarmayogiData().then(data => { if (mounted) setEngine(runCompetencyEngine(data)); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem("statSkillVisualTheme", theme);
    localStorage.setItem("statSkillAppearance", appearance);
    localStorage.setItem("statSkillLanguage", lang);
    document.documentElement.dataset.themeMode = theme;
    document.documentElement.dataset.appearanceMode = appearance;
    document.body.classList.remove("theme-solo","theme-executive","theme-aurora","appearance-dark","appearance-light");
    document.body.classList.add(`theme-${theme}`, `appearance-${appearance}`);
  }, [theme, appearance, lang]);

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
    localStorage.setItem("statSkillSession", "active");
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
    localStorage.removeItem("statSkillSession");
    // An account is created first; entering the workspace still requires login.
    setLoggedIn(false);
    setRegister(false);
  };

  const logout = () => {
    localStorage.removeItem("statSkillSession");
    setLoggedIn(false);
    setMenuOpen(false);
  };

  if (!loggedIn) {
    return register
      ? <Register onRegister={handleRegister} onBackToLogin={() => setRegister(false)} />
      : <Login onLogin={handleLogin} onRegister={() => setRegister(true)} />;
  }

  const labelKey = active === "Dashboard" ? "dashboard"
    : active === "My Competencies" ? "competencies"
    : active === "Learning Path" ? "path"
    : active === "Assessments" ? "assessments"
    : active === "My Documents" ? "documents"
    : active === "Certificates" ? "certificates"
    : active === "Analytics" ? "analytics"
    : "settings";

  const content = {
    Dashboard: <DashboardPage user={user || {}} lang={lang} onNavigate={setActive} />,
    "My Competencies": <CompetenciesPage engine={engine} lang={lang} />,
    "Learning Path": <LearningPage lang={lang} />,
    Assessments: <AssessmentsPage lang={lang} />,
    "My Documents": <DocumentsPage lang={lang} />,
    Certificates: <CertificatesPage lang={lang} />,
    Analytics: <AnalyticsPage engine={engine} lang={lang} />,
    Settings: <SettingsPage user={user || {}} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} appearance={appearance} setAppearance={setAppearance} onSaveUser={setUser} />,
  }[active] || null;

  return (
    <div className={`app-shell theme-${theme} appearance-${appearance}`}>
      <Sidebar active={active} setActive={setActive} open={menuOpen} setOpen={setMenuOpen} lang={lang} user={user || {}} onLogout={logout} />
      {menuOpen && <button className="overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setMenuOpen(v => !v)}><Menu size={18} /></button>
            <div><div className="eyebrow">STATSKILL / {tr(lang, labelKey).toUpperCase()}</div><strong>{tr(lang, labelKey)}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className="status-chip"><span className="live-dot" /> {tr(lang, "live")}</div>
            <button className="icon-btn" title={tr(lang, "help")}><HelpCircle size={16} /></button>
            <div className="notification-wrap">
              <button
                type="button"
                className="icon-btn notification"
                title={tr(lang, "notifications")}
                aria-expanded={notifOpen}
                aria-controls="notification-panel"
                onClick={() => setNotifOpen(v => !v)}
              >
                <Bell size={16} />
                {notifications.length > 0 && <i>{notifications.length}</i>}
              </button>
              {notifOpen && (
                <>
                  <button className="notification-scrim" aria-label="Close notifications" onClick={() => setNotifOpen(false)} />
                  <div id="notification-panel" className="notification-panel system-card" role="dialog" aria-label={tr(lang, "notifications")}>
                    <div className="system-label">{tr(lang, "notifications").toUpperCase()}</div>
                    {notifications.length === 0
                      ? <p className="notification-empty">{tr(lang, "noNotifications")}</p>
                      : <div className="notification-list">
                          {notifications.map(n => (
                            <div className="notification-item" key={n.id}>
                              <span className={`notification-dot ${n.color}`} />
                              <div><strong>{n.title}</strong><span>{n.time}</span></div>
                            </div>
                          ))}
                        </div>}
                  </div>
                </>
              )}
            </div>
            <button type="button" className="profile-chip" aria-label={tr(lang, "profile")} onClick={() => setActive("Settings")}><span>{user?.photo ? <img src={user.photo} alt="" /> : (user?.name || "A")[0]}</span><strong>{user?.name || "Aditya"}</strong><ChevronDown size={13} /></button>
          </div>
        </header>
        <main>{content}</main>
      </div>
    </div>
  );
}
