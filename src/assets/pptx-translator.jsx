import { useCallback, useEffect, useRef, useState } from "react";

// ── Inject viewport meta for proper mobile scaling ─────────────────
if (typeof document !== "undefined" && !document.querySelector('meta[name="viewport"]')) {
  const meta = document.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width, initial-scale=1, maximum-scale=1";
  document.head.appendChild(meta);
}

// ── Mobile breakpoint hook ─────────────────────────────────────────
function useIsMobile(bp = 640) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < bp);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < bp);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [bp]);
  return isMobile;
}

// ── Language registry ──────────────────────────────────────────────
const LANGS = [
  { code:"th",     name:"ไทย",           flag:"🇹🇭", eng:"Thai",                webFont:"Sarabun",              gfont:"Sarabun:wght@400;600;700",               pptxLatin:"TH Sarabun New",   pptxEA:"TH Sarabun New" },
  { code:"zh-CN",  name:"中文 (简体)",    flag:"🇨🇳", eng:"Chinese Simplified",   webFont:"Noto Sans SC",         gfont:"Noto+Sans+SC:wght@400;700",              pptxLatin:"Microsoft YaHei", pptxEA:"Microsoft YaHei" },
  { code:"zh-TW",  name:"中文 (繁體)",    flag:"🇹🇼", eng:"Chinese Traditional",  webFont:"Noto Sans TC",         gfont:"Noto+Sans+TC:wght@400;700",              pptxLatin:"Microsoft JhengHei",pptxEA:"Microsoft JhengHei" },
  { code:"zh-yue", name:"粵語",           flag:"🇭🇰", eng:"Cantonese",            webFont:"Noto Sans HK",         gfont:"Noto+Sans+HK:wght@400;700",              pptxLatin:"Microsoft YaHei", pptxEA:"Microsoft YaHei" },
  { code:"lo",     name:"ລາວ",           flag:"🇱🇦", eng:"Lao",                  webFont:"Noto Sans Lao",        gfont:"Noto+Sans+Lao:wght@400;700",             pptxLatin:"DokChampa",       pptxEA:"DokChampa" },
  { code:"ja",     name:"日本語",         flag:"🇯🇵", eng:"Japanese",             webFont:"Noto Sans JP",         gfont:"Noto+Sans+JP:wght@400;700",              pptxLatin:"MS Gothic",        pptxEA:"MS Gothic" },
  { code:"ko",     name:"한국어",         flag:"🇰🇷", eng:"Korean",               webFont:"Noto Sans KR",         gfont:"Noto+Sans+KR:wght@400;700",              pptxLatin:"Malgun Gothic",   pptxEA:"Malgun Gothic" },
  { code:"ar",     name:"العربية",        flag:"🇸🇦", eng:"Arabic",               webFont:"Noto Sans Arabic",     gfont:"Noto+Sans+Arabic:wght@400;700",          pptxLatin:"Arial",           pptxEA:"Arial",  rtl:true },
  { code:"hi",     name:"हिन्दी",         flag:"🇮🇳", eng:"Hindi",                webFont:"Noto Sans Devanagari", gfont:"Noto+Sans+Devanagari:wght@400;700",      pptxLatin:"Mangal",          pptxEA:"Mangal" },
  { code:"km",     name:"ខ្មែរ",          flag:"🇰🇭", eng:"Khmer",                webFont:"Noto Sans Khmer",      gfont:"Noto+Sans+Khmer:wght@400;700",           pptxLatin:"Khmer UI",        pptxEA:"Khmer UI" },
  { code:"my",     name:"မြန်မာ",         flag:"🇲🇲", eng:"Burmese",              webFont:"Noto Sans Myanmar",    gfont:"Noto+Sans+Myanmar:wght@400;700",         pptxLatin:"Myanmar Text",    pptxEA:"Myanmar Text" },
  { code:"en",     name:"English",        flag:"🇬🇧", eng:"English",              webFont:"Inter",                gfont:"Inter:wght@400;700",                     pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"fr",     name:"Français",       flag:"🇫🇷", eng:"French",               webFont:"Inter",                gfont:"Inter:wght@400;700",                     pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"de",     name:"Deutsch",        flag:"🇩🇪", eng:"German",               webFont:"Inter",                gfont:"Inter:wght@400;700",                     pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"es",     name:"Español",        flag:"🇪🇸", eng:"Spanish",              webFont:"Inter",                gfont:"Inter:wght@400;700",                     pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"ru",     name:"Русский",        flag:"🇷🇺", eng:"Russian",              webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"he",     name:"עברית",          flag:"🇮🇱", eng:"Hebrew",               webFont:"Noto Sans Hebrew",     gfont:"Noto+Sans+Hebrew:wght@400;700",          pptxLatin:"Arial Hebrew",    pptxEA:"Arial Hebrew", rtl:true },
  { code:"fa",     name:"فارسی",          flag:"🇮🇷", eng:"Persian",              webFont:"Noto Sans Arabic",     gfont:"Noto+Nastaliq+Urdu:wght@400;700",        pptxLatin:"Arial",           pptxEA:"Arial", rtl:true },
  { code:"ur",     name:"اردو",           flag:"🇵🇰", eng:"Urdu",                 webFont:"Noto Nastaliq Urdu",   gfont:"Noto+Nastaliq+Urdu:wght@400;700",        pptxLatin:"Arial",           pptxEA:"Arial", rtl:true },
  { code:"vi",     name:"Tiếng Việt",     flag:"🇻🇳", eng:"Vietnamese",           webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Arial",           pptxEA:"Arial" },
  { code:"id",     name:"Indonesia",      flag:"🇮🇩", eng:"Indonesian",           webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"ms",     name:"Melayu",         flag:"🇲🇾", eng:"Malay",                webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"pt",     name:"Português",      flag:"🇧🇷", eng:"Portuguese",           webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"it",     name:"Italiano",       flag:"🇮🇹", eng:"Italian",              webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"tr",     name:"Türkçe",         flag:"🇹🇷", eng:"Turkish",              webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"pl",     name:"Polski",         flag:"🇵🇱", eng:"Polish",               webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"uk",     name:"Українська",     flag:"🇺🇦", eng:"Ukrainian",            webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"nl",     name:"Nederlands",     flag:"🇳🇱", eng:"Dutch",                webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"sv",     name:"Svenska",        flag:"🇸🇪", eng:"Swedish",              webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
  { code:"bn",     name:"বাংলা",           flag:"🇧🇩", eng:"Bengali",              webFont:"Noto Sans Bengali",    gfont:"Noto+Sans+Bengali:wght@400;700",         pptxLatin:"Vrinda",          pptxEA:"Vrinda" },
  { code:"ta",     name:"தமிழ்",           flag:"🇱🇰", eng:"Tamil",                webFont:"Noto Sans Tamil",      gfont:"Noto+Sans+Tamil:wght@400;700",           pptxLatin:"Latha",           pptxEA:"Latha" },
  { code:"ne",     name:"नेपाली",          flag:"🇳🇵", eng:"Nepali",               webFont:"Noto Sans Devanagari", gfont:"Noto+Sans+Devanagari:wght@400;700",      pptxLatin:"Mangal",          pptxEA:"Mangal" },
  { code:"si",     name:"සිංහල",           flag:"🇱🇰", eng:"Sinhala",              webFont:"Noto Sans Sinhala",    gfont:"Noto+Sans+Sinhala:wght@400;700",         pptxLatin:"Iskoola Pota",    pptxEA:"Iskoola Pota" },
  { code:"sw",     name:"Kiswahili",      flag:"🇰🇪", eng:"Swahili",              webFont:"Noto Sans",            gfont:"Noto+Sans:wght@400;700",                 pptxLatin:"Calibri",         pptxEA:"Calibri" },
];

// ── Engine registry ────────────────────────────────────────────────
const ENGINES = [
  { id:"googletrans", name:"Google Translate", icon:"🔍", free:true,  placeholder:"",           hint:"ฟรี ไม่ต้องใส่ Key",                                                      url:null },
  { id:"mymemory",   name:"MyMemory",         icon:"🌐", free:true,  placeholder:"",           hint:"ฟรี ไม่ต้องใส่ Key",                                                      url:null },
  { id:"groq",       name:"Groq · Llama 3.3", icon:"⚡", free:false, placeholder:"gsk_...",    hint:"สมัครฟรี ไม่ต้องใส่บัตร — ใช้ Llama 3.3 70B",                            url:"https://console.groq.com/keys" },
  { id:"gemma4",     name:"Gemma 4 (27B)",    icon:"🔮", free:false, placeholder:"AIza...",    hint:"ใช้ Gemini API Key เดิม — Gemma 4 27B โมเดลใหม่จาก Google",              url:"https://aistudio.google.com/app/apikey" },
  { id:"claude",     name:"Claude (Sonnet)",  icon:"🤖", free:false, placeholder:"sk-ant-...", hint:"เข้าใจเว็บแล้วไปที่ Account → API Keys",                                  url:"https://console.anthropic.com/settings/keys" },
  { id:"openai",     name:"GPT-4o",           icon:"🧠", free:false, placeholder:"sk-...",     hint:"เข้าใจเว็บแล้วไปที่ Dashboard → API Keys",                               url:"https://platform.openai.com/api-keys" },
  { id:"gemini",     name:"Gemini Flash",     icon:"✨", free:false, placeholder:"AIza...",    hint:"สมัครฟรี มี free quota ใช้ได้เยอะ",                                        url:"https://aistudio.google.com/app/apikey" },
];

// ── Font options ────────────────────────────────────────────────────
const FONT_OPTIONS = [
  { label:"Inter",              web:"Inter",               pptx:"Inter",              group:"ทั่วไป" },
  { label:"Roboto",             web:"Roboto",              pptx:"Roboto",             group:"ทั่วไป" },
  { label:"Open Sans",          web:"Open Sans",           pptx:"Open Sans",          group:"ทั่วไป" },
  { label:"Poppins",            web:"Poppins",             pptx:"Poppins",            group:"ทั่วไป" },
  { label:"Montserrat",         web:"Montserrat",          pptx:"Montserrat",         group:"ทั่วไป" },
  { label:"Lato",               web:"Lato",                pptx:"Lato",               group:"ทั่วไป" },
  { label:"Noto Sans",          web:"Noto Sans",           pptx:"Noto Sans",          group:"ทั่วไป" },
  { label:"Sarabun",            web:"Sarabun",             pptx:"Sarabun",            group:"ไทย" },
  { label:"Kanit",              web:"Kanit",               pptx:"Kanit",              group:"ไทย" },
  { label:"Prompt",             web:"Prompt",              pptx:"Prompt",             group:"ไทย" },
  { label:"Mitr",               web:"Mitr",                pptx:"Mitr",               group:"ไทย" },
  { label:"Pridi",              web:"Pridi",               pptx:"Pridi",              group:"ไทย" },
  { label:"Noto Sans Thai",     web:"Noto Sans Thai",      pptx:"Noto Sans Thai",     group:"ไทย" },
  { label:"IBM Plex Sans Thai", web:"IBM Plex Sans Thai",  pptx:"IBM Plex Sans Thai", group:"ไทย" },
  { label:"Noto Sans JP",       web:"Noto Sans JP",        pptx:"Noto Sans CJK JP",   group:"日本語" },
  { label:"M PLUS 1p",          web:"M PLUS 1p",           pptx:"M PLUS 1p",          group:"日本語" },
  { label:"Noto Sans KR",       web:"Noto Sans KR",        pptx:"Noto Sans CJK KR",   group:"한국어" },
  { label:"Noto Sans SC",       web:"Noto Sans SC",        pptx:"Noto Sans CJK SC",   group:"中文" },
  { label:"Cairo",              web:"Cairo",               pptx:"Cairo",              group:"العربية" },
  { label:"Noto Sans Arabic",   web:"Noto Sans Arabic",    pptx:"Noto Sans Arabic",   group:"العربية" },
];

// ── Inline styles ──────────────────────────────────────────────────
const S = {
  app: { minHeight:"100vh", background:"#070711", color:"#dde1f0", fontFamily:"'Plus Jakarta Sans', sans-serif", display:"flex", flexDirection:"column", overflowX:"hidden" },
  header: { background:"rgba(10,10,25,0.95)", borderBottom:"1px solid #1a1a35", padding:"0 16px", minHeight:60, display:"flex", alignItems:"center", justifyContent:"space-between", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:100, flexWrap:"wrap", gap:8 },
  logo: { display:"flex", alignItems:"center", gap:10, fontWeight:700, fontSize:18, letterSpacing:-0.5, color:"#fff" },
  logoDot: { width:10, height:10, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#a855f7)" },
  main: { flex:1, maxWidth:1100, width:"100%", margin:"0 auto", padding:"20px 16px", boxSizing:"border-box" },
  stepper: { display:"flex", alignItems:"center", gap:0, marginBottom:28, overflowX:"auto", paddingBottom:4 },
  stepItem: (active, done) => ({ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:100, fontSize:13, fontWeight:600, color: done ? "#6366f1" : active ? "#fff" : "#4a4a7a", background: active ? "rgba(99,102,241,0.15)" : "transparent", border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent", transition:"all 0.3s" }),
  stepNum: (active, done) => ({ width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, background: done ? "#6366f1" : active ? "rgba(99,102,241,0.8)" : "#1e1e3a", color:"#fff", flexShrink:0 }),
  stepLine: { flex:1, height:1, background:"#1e1e3a", maxWidth:40 },
  card: { background:"#0e0e1e", border:"1px solid #1a1a35", borderRadius:16, padding:20 },
  uploadZone: (drag) => ({ border: `2px dashed ${drag?"#6366f1":"#2a2a50"}`, borderRadius:16, padding:"64px 32px", display:"flex", flexDirection:"column", alignItems:"center", gap:16, cursor:"pointer", transition:"all 0.2s", background: drag?"rgba(99,102,241,0.05)":"rgba(14,14,30,0.5)", textAlign:"center" }),
  btn: { background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", borderRadius:10, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8, transition:"opacity 0.2s" },
  btnOutline: { background:"transparent", color:"#6366f1", border:"1px solid #6366f1", borderRadius:10, padding:"11px 24px", fontSize:14, fontWeight:600, cursor:"pointer", transition:"all 0.2s" },
  btnSmall: { background:"rgba(99,102,241,0.15)", color:"#8b8bff", border:"1px solid rgba(99,102,241,0.3)", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer" },
  input: { width:"100%", background:"#0a0a1a", border:"1px solid #2a2a50", borderRadius:10, padding:"11px 14px", fontSize:14, color:"#dde1f0", outline:"none", boxSizing:"border-box" },
  tag: (c) => ({ display:"inline-block", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:600, background: c==="green"?"rgba(16,185,129,0.15)": c==="blue"?"rgba(99,102,241,0.15)":"rgba(168,85,247,0.15)", color: c==="green"?"#10b981": c==="blue"?"#8b8bff":"#c084fc" }),
  progress: { background:"#1a1a35", borderRadius:100, height:6, overflow:"hidden" },
  progressBar: (pct) => ({ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#6366f1,#a855f7)", transition:"width 0.5s", borderRadius:100 }),
  slideTab: (active) => ({ padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer", borderRadius:8, color: active?"#fff":"#6a6a9a", background: active?"rgba(99,102,241,0.2)":"transparent", border: active?"1px solid rgba(99,102,241,0.4)":"1px solid transparent", whiteSpace:"nowrap", transition:"all 0.2s" }),
  langCard: (sel) => ({ border:`1px solid ${sel?"#6366f1":"#1e1e3a"}`, borderRadius:12, padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, background: sel?"rgba(99,102,241,0.1)":"#0e0e1e", transition:"all 0.15s" }),
  fbField: { display:"flex", flexDirection:"column", gap:6, flex:1 },
  label: { fontSize:12, fontWeight:600, color:"#6a6a9a", letterSpacing:0.5 },
  grid2: (mobile) => ({ display:"grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 16 : 28 }),
  textBlock: (font, rtl) => ({ fontFamily:`'${font}', sans-serif`, direction: rtl?"rtl":"ltr", textAlign: rtl?"right":"left", lineHeight:1.8, fontSize:15, color:"#dde1f0" }),
};

// ── Language detector (Unicode script ranges) ──────────────────────
function detectLang(text) {
  if (!text || text.length < 5) return "en";
  const score = {};
  const add = (k) => { score[k] = (score[k] || 0) + 1; };
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x0E00 && cp <= 0x0E7F) add("th");
    else if (cp >= 0x4E00 && cp <= 0x9FFF) add("zh");
    else if ((cp >= 0x3040 && cp <= 0x309F) || (cp >= 0x30A0 && cp <= 0x30FF)) add("ja");
    else if (cp >= 0xAC00 && cp <= 0xD7AF) add("ko");
    else if (cp >= 0x0600 && cp <= 0x06FF) add("ar");
    else if (cp >= 0x0400 && cp <= 0x04FF) add("ru");
    else if (cp >= 0x0900 && cp <= 0x097F) add("hi");
    else if (cp >= 0x0E80 && cp <= 0x0EFF) add("lo");
    else if (cp >= 0x1780 && cp <= 0x17FF) add("km");
    else if (cp >= 0x1000 && cp <= 0x109F) add("my");
    else if (cp >= 0x0590 && cp <= 0x05FF) add("he");
    else if (cp >= 0x0980 && cp <= 0x09FF) add("bn");
  }
  const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0];
  if (!best || best[1] < text.replace(/\s/g, "").length * 0.1) return "en";
  return best[0];
}

// ── PPTX helpers ───────────────────────────────────────────────────
const NS = "http://schemas.openxmlformats.org/drawingml/2006/main";

function extractParas(xml) {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const result = [];
  Array.from(doc.getElementsByTagNameNS(NS, "p")).forEach((p, idx) => {
    const text = Array.from(p.getElementsByTagNameNS(NS, "t")).map(t => t.textContent).join("").trim();
    if (text) result.push({ idx, text });
  });
  return result;
}

function buildXml(xml, transByIdx, lang, fontOverride) {
  const doc = new DOMParser().parseFromString(xml, "text/xml");

  // Inject translations
  const pNodes = Array.from(doc.getElementsByTagNameNS(NS, "p"));
  pNodes.forEach((p, idx) => {
    const tr = transByIdx[idx];
    if (!tr) return;
    const tNodes = Array.from(p.getElementsByTagNameNS(NS, "t"));
    if (!tNodes.length) return;
    tNodes[0].textContent = tr;
    for (let i = 1; i < tNodes.length; i++) tNodes[i].textContent = "";
  });

  // Change fonts
  ["rPr", "defRPr", "endParaRPr"].forEach(tag => {
    Array.from(doc.getElementsByTagNameNS(NS, tag)).forEach(el => {
      Array.from(el.getElementsByTagNameNS(NS, "latin")).forEach(n => n.setAttribute("typeface", fontOverride || lang.pptxLatin));
      const eaArr = Array.from(el.getElementsByTagNameNS(NS, "ea"));
      if (eaArr.length) eaArr.forEach(n => n.setAttribute("typeface", lang.pptxEA));
      if (lang.rtl) {
        Array.from(el.getElementsByTagNameNS(NS, "cs")).forEach(n => n.setAttribute("typeface", fontOverride || lang.pptxLatin));
      }
    });
  });

  let out = new XMLSerializer().serializeToString(doc);
  if (!out.startsWith("<?xml")) out = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` + out;
  return out;
}

// ── Firebase helpers ───────────────────────────────────────────────
function loadFirebase(cfg, cb) {
  if (window._fbLoaded) { cb(); return; }
  const load = (src, onload) => { const s = document.createElement("script"); s.src = src; s.onload = onload; document.head.appendChild(s); };
  load("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js", () => {
    load("https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js", () => {
      window.firebase.initializeApp(cfg);
      window._fbLoaded = true;
      cb();
    });
  });
}

async function fbUpload(file, path) {
  const ref = window.firebase.storage().ref(path);
  await ref.put(file);
  return await ref.getDownloadURL();
}

// ── Main component ─────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);           // 0=upload 1=lang 2=translating 3=done
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [lang, setLang] = useState(null);
  const [translated, setTranslated] = useState([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ pct: 0, msg: "" });
  const [langQ, setLangQ] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [drag, setDrag] = useState(false);
  const [showFb, setShowFb] = useState(false);
  const [fbCfg, setFbCfg] = useState({ apiKey:"", authDomain:"", projectId:"", storageBucket:"", messagingSenderId:"", appId:"" });
  const [fbEnabled, setFbEnabled] = useState(false);
  const [fbUploadUrl, setFbUploadUrl] = useState(null);
  const [fbResultUrl, setFbResultUrl] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [skippedParas, setSkippedParas] = useState(new Set()); // Set of "slideNum-paraIdx" keys
  const [fileType, setFileType] = useState("pptx"); // "pptx"|"ppt"|"docx"|"xlsx"|"image"
  const [imageData, setImageData] = useState(null); // base64 for image preview
  const [engine, setEngine] = useState(() => { const e = localStorage.getItem("engine"); return e === "libre" ? "mymemory" : (e || "googletrans"); });
  const [claudeKey, setClaudeKey] = useState(() => localStorage.getItem("claude_api_key") || "");
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [groqKey,   setGroqKey]   = useState(() => localStorage.getItem("groq_api_key")   || "");
  const [srcLang, setSrcLang] = useState(() => localStorage.getItem("src_lang") || "en");
  const [showKey, setShowKey] = useState(false);
  const [customFont, setCustomFont] = useState(null); // null = use lang default
  const zipRef = useRef(null);
  const xlsxWbRef = useRef(null); // SheetJS workbook ref

  // Computed effective fonts (custom override or lang default)
  const effectiveWebFont  = customFont?.web  || lang?.webFont;
  const effectivePptxFont = customFont?.pptx || lang?.pptxLatin;

  // Load JSZip + CFB + SheetJS + Plus Jakarta Sans font
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);

    const loadScript = (src, onload) => {
      const s = document.createElement("script");
      s.src = src; s.onload = onload;
      document.head.appendChild(s);
    };

    if (window.JSZip && window.XLSX && window.CFB) { setReady(true); return; }
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", () => {
      loadScript("https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js", () => {
        // CFB must load LAST — xlsx bundles its own CFB internally and may overwrite window.CFB
        loadScript("https://cdn.jsdelivr.net/npm/cfb/dist/cfb.min.js", () => setReady(true));
      });
    });
  }, []);

  // Dynamically load selected custom font from Google Fonts
  useEffect(() => {
    if (!customFont) return;
    const id = `gfont-custom-${customFont.web.replace(/\s/g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(customFont.web)}:wght@400;600;700&display=swap`;
    document.head.appendChild(link);
  }, [customFont]);

  // Load Google Font when language selected
  useEffect(() => {
    if (!lang) return;
    const id = `gf-${lang.code}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${lang.gfont}&display=swap`;
    document.head.appendChild(link);
  }, [lang]);

  // ── Parse PPT (binary OLE format) ──
  const parsePpt = async (f) => {
    if (!window.CFB) throw new Error("กำลังโหลด library กรุณาลองใหม่");
    const ab = await f.arrayBuffer();
    const cfb = window.CFB.read(new Uint8Array(ab), { type: "array" });
    const entry = window.CFB.find(cfb, "PowerPoint Document");
    if (!entry) throw new Error("ไม่พบข้อมูล PowerPoint ในไฟล์นี้");

    const buf = entry.content;
    const slides = [];
    let currentTexts = null;
    let i = 0;

    while (i < buf.length - 8) {
      const recVer = buf[i] & 0x0F;
      const recType = buf[i + 2] | (buf[i + 3] << 8);
      const recLen = (buf[i + 4] | (buf[i + 5] << 8) | (buf[i + 6] << 16) | (buf[i + 7] << 24)) >>> 0;

      if (recLen > buf.length) { i++; continue; }

      if (recVer === 0xF && recType === 1006) {
        // SlideContainer — new slide
        if (currentTexts !== null && currentTexts.length > 0) slides.push(currentTexts);
        currentTexts = [];
        i += 8;
      } else if (recType === 4000 && recLen > 0) {
        // TextCharsAtom — UTF-16LE
        const text = new TextDecoder("utf-16le").decode(new Uint8Array(buf.slice(i + 8, i + 8 + recLen))).replace(/\r/g, "").trim();
        if (text && currentTexts !== null) currentTexts.push(text);
        i += 8 + recLen;
      } else if (recType === 4008 && recLen > 0) {
        // TextBytesAtom — Latin1
        let text = "";
        for (let j = 0; j < recLen; j++) text += String.fromCharCode(buf[i + 8 + j]);
        text = text.trim();
        if (text && currentTexts !== null) currentTexts.push(text);
        i += 8 + recLen;
      } else if (recVer === 0xF) {
        i += 8; // Enter other containers
      } else {
        i += 8 + recLen;
      }
    }

    if (currentTexts && currentTexts.length > 0) slides.push(currentTexts);
    if (slides.length === 0) throw new Error("ไม่พบข้อความในไฟล์ .ppt นี้");

    return slides.map((texts, idx) => ({
      num: idx + 1, path: null, xml: null,
      paras: texts.map((text, pidx) => ({ idx: pidx, text })),
    }));
  };

  // ── Parse DOCX ──
  const parseDocx = async (f) => {
    const ab = await f.arrayBuffer();
    const zip = await window.JSZip.loadAsync(ab);
    zipRef.current = zip;
    const xml = await zip.file("word/document.xml").async("string");
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const WNS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
    const paras = [];
    Array.from(doc.getElementsByTagNameNS(WNS, "p")).forEach((p, idx) => {
      const text = Array.from(p.getElementsByTagNameNS(WNS, "t")).map(t => t.textContent).join("").trim();
      if (text) paras.push({ idx, text });
    });
    return [{ num: 1, name: "Document", path: "word/document.xml", paras, xml }];
  };

  // ── Build translated DOCX XML ──
  const buildDocxXml = (xml, transByIdx, lang) => {
    const WNS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const pNodes = Array.from(doc.getElementsByTagNameNS(WNS, "p"));
    pNodes.forEach((p, idx) => {
      const tr = transByIdx[idx];
      if (!tr) return;
      const tNodes = Array.from(p.getElementsByTagNameNS(WNS, "t"));
      if (!tNodes.length) return;
      tNodes[0].textContent = tr;
      for (let i = 1; i < tNodes.length; i++) tNodes[i].textContent = "";
    });
    let out = new XMLSerializer().serializeToString(doc);
    if (!out.startsWith("<?xml")) out = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` + out;
    return out;
  };

  // ── Parse XLSX ──
  const parseXlsx = async (f) => {
    if (!window.XLSX) throw new Error("กำลังโหลด SheetJS...");
    const ab = await f.arrayBuffer();
    const wb = window.XLSX.read(ab, { type: "array" });
    xlsxWbRef.current = wb;
    return wb.SheetNames.map((name, idx) => {
      const sheet = wb.Sheets[name];
      const paras = [];
      Object.keys(sheet).forEach(addr => {
        if (addr.startsWith("!")) return;
        const cell = sheet[addr];
        if ((cell.t === "s" || cell.t === "str") && cell.v && String(cell.v).trim()) {
          paras.push({ idx: addr, text: String(cell.v) });
        }
      });
      return { num: idx + 1, name, path: name, paras, xml: null };
    }).filter(s => s.paras.length > 0);
  };


  const parsePptx = async (f) => {
    const ab = await f.arrayBuffer();
    const zip = await window.JSZip.loadAsync(ab);
    zipRef.current = zip;
    const names = Object.keys(zip.files)
      .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
      .sort((a, b) => parseInt(a.match(/(\d+)/)[1]) - parseInt(b.match(/(\d+)/)[1]));
    const result = [];
    for (const path of names) {
      const xml = await zip.file(path).async("string");
      const paras = extractParas(xml);
      const num = parseInt(path.match(/slide(\d+)/)[1]);
      result.push({ num, path, paras, xml });
    }
    return result;
  };

  // ── Handle file ──
  const handleFile = async (f) => {
    if (!ready) return alert("กำลังโหลด library...");
    const name = f?.name?.toLowerCase() || "";
    let ftype = "";
    if (name.endsWith(".pptx"))                             ftype = "pptx";
    else if (name.endsWith(".ppt"))                         ftype = "ppt";
    else if (name.endsWith(".docx"))                        ftype = "docx";
    else if (name.endsWith(".xlsx") || name.endsWith(".xls")) ftype = "xlsx";
    else if (/\.(jpe?g|png|webp|gif|bmp)$/.test(name))     ftype = "image";
    else return alert("รองรับ .pptx .ppt .docx .xlsx .jpg .png เท่านั้น");

    setBusy(true);
    setFileType(ftype);
    setImageData(null);
    setProgress({ pct: 20, msg: "กำลังอ่านไฟล์..." });
    try {
      let parsed;
      if (ftype === "pptx")       parsed = await parsePptx(f);
      else if (ftype === "ppt")   parsed = await parsePpt(f);
      else if (ftype === "docx")  parsed = await parseDocx(f);
      else if (ftype === "xlsx")  parsed = await parseXlsx(f);
      else {
        // Image: read as base64, no text extraction yet
        const b64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = e => res(e.target.result);
          r.onerror = rej;
          r.readAsDataURL(f);
        });
        setImageData(b64);
        setFile(f);
        setSlides([{ num: 1, name: "Image", path: null, paras: [], xml: null }]);
        setActiveSlide(0);
        setStep(1);
        setBusy(false);
        setProgress({ pct: 0, msg: "" });
        return;
      }
      setFile(f);
      setSlides(parsed);
      setActiveSlide(0);
      const sampleText = parsed.slice(0, 3).flatMap(s => s.paras.map(p => p.text)).join(" ");
      const detected = detectLang(sampleText);
      setSrcLang(detected);
      localStorage.setItem("src_lang", detected);
      setStep(1);
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    } finally {
      setBusy(false);
      setProgress({ pct: 0, msg: "" });
    }
  };

  // ── Translate ──
  const doTranslate = async () => {
    if (!lang) return;
    setBusy(true);
    setStep(2);

    // Special path for images: OCR + translate in one AI call
    if (fileType === "image") {
      try {
        setProgress({ pct: 30, msg: "อ่านรูปและแปลข้อความ..." });
        const { originals, translated: tList } = await callImageTranslate(imageData, lang);
        // Populate slides paras with OCR'd originals
        setSlides([{ num: 1, name: "Image", path: null, xml: null, paras: originals.map((t, i) => ({ idx: i, text: t })) }]);
        setTranslated([{ slideNum: 1, paragraphs: tList.map((t, i) => ({ idx: i, text: t })) }]);
        setProgress({ pct: 100, msg: "เสร็จ!" });
        setActiveSlide(0);
        setStep(3);
      } catch (e) {
        alert("เกิดข้อผิดพลาด: " + e.message);
        setStep(1);
      } finally { setBusy(false); }
      return;
    }

    if (!slides.length) { setBusy(false); return; }
    const BATCH = (engine === "mymemory" || engine === "googletrans") ? 10 : 5;
    const results = [];
    try {
      for (let i = 0; i < slides.length; i += BATCH) {
        const batch = slides.slice(i, i + BATCH);
        const pct = Math.round((i / slides.length) * 90);
        const unitLabel = fileType === "xlsx" ? "ชีต" : fileType === "docx" ? "ส่วน" : "สไลด์";
        setProgress({ pct, msg: `แปล${unitLabel} ${i + 1}–${Math.min(i + BATCH, slides.length)} จาก ${slides.length}...` });
        const input = batch.map(s => ({ slideNum: s.num, paragraphs: s.paras }));
        let res;
        if (engine === "mymemory")        res = await callMyMemory(input, lang);
        else if (engine === "googletrans") res = await callGoogleTrans(input, lang);
        else if (engine === "groq")        res = await callGroq(input, lang);
        else if (engine === "openai")      res = await callOpenAI(input, lang);
        else if (engine === "gemma4")      res = await callGemma4(input, lang);
        else if (engine === "gemini")      res = await callGemini(input, lang);
        else                               res = await callClaude(input, lang);
        results.push(...res);
      }
      setTranslated(results);
      setProgress({ pct: 100, msg: "เสร็จสิ้น!" });
      setActiveSlide(0);
      setStep(3);
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
      setStep(1);
    } finally {
      setBusy(false);
    }
  };

  // ── Shared AI prompt builder ──
  const buildAIPrompt = (batchData, lang) =>
    `You are a professional document translator. Translate text to ${lang.eng} (${lang.name}).
Rules: Return ONLY valid JSON (same structure), no markdown. Preserve numbers, symbols, URLs. Natural fluent translation.

Input: ${JSON.stringify(batchData)}`;

  // ── Image OCR + Translate ──
  const callImageTranslate = async (base64, lang) => {
    const prompt = `You are an OCR and translation expert. Look at this image, extract ALL visible text, then translate each text piece to ${lang.eng} (${lang.name}).
Return ONLY valid JSON: { "results": [{"original": "...", "translated": "..."}] }
No markdown. Preserve formatting symbols. If no text found, return { "results": [] }.`;

    if (engine === "openai" || (!openaiKey && geminiKey)) {
      // Use GPT-4o vision
      if (!openaiKey) throw new Error("กรุณาใส่ OpenAI API Key สำหรับการแปลรูป");
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
        body: JSON.stringify({ model: "gpt-4o", max_tokens: 4000, messages: [{ role: "user", content: [
          { type: "image_url", image_url: { url: base64 } },
          { type: "text", text: prompt }
        ]}]})
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const parsed = JSON.parse(data.choices[0].message.content.trim().replace(/^```json\n?|^```\n?|```\n?$/gm, ""));
      return { originals: parsed.results.map(r => r.original), translated: parsed.results.map(r => r.translated) };
    } else {
      // Use Gemini vision
      if (!geminiKey) throw new Error("สำหรับ Image ต้องใช้ GPT-4o หรือ Gemini กด 🔑 ใน header เพื่อใส่ Key ก่อน");
      const mimeType = base64.match(/data:(image\/[^;]+)/)?.[1] || "image/jpeg";
      const b64data = base64.split(",")[1];
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [
          { inlineData: { mimeType, data: b64data } },
          { text: prompt }
        ]}]})
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      const parsed = JSON.parse(data.candidates[0].content.parts[0].text.trim().replace(/^```json\n?|^```\n?|```\n?$/gm, ""));
      return { originals: parsed.results.map(r => r.original), translated: parsed.results.map(r => r.translated) };
    }
  };

  const callGroq = async (batchData, lang) => {
    if (!groqKey) throw new Error("กรุณาใส่ Groq API Key ก่อน (กด 🔑) — สมัครฟรีที่ groq.com");
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":`Bearer ${groqKey}` },
      body: JSON.stringify({ model:"llama-3.3-70b-versatile", max_tokens:4000, messages:[{ role:"user", content:buildAIPrompt(batchData, lang) }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return JSON.parse(data.choices[0].message.content.trim().replace(/^```json\n?|^```\n?|```\n?$/gm, ""));
  };

  const callClaude = async (batchData, lang) => {
    if (!claudeKey) throw new Error("กรุณาใส่ Claude API Key ก่อน (กด 🔑)");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type":"application/json", "x-api-key":claudeKey, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
      body: JSON.stringify({ model:"claude-sonnet-4-5-20251001", max_tokens:4000, messages:[{ role:"user", content:buildAIPrompt(batchData, lang) }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return JSON.parse(data.content[0].text.trim().replace(/^```json\n?|^```\n?|```\n?$/gm, ""));
  };

  const callOpenAI = async (batchData, lang) => {
    if (!openaiKey) throw new Error("กรุณาใส่ OpenAI API Key ก่อน (กด 🔑)");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":`Bearer ${openaiKey}` },
      body: JSON.stringify({ model:"gpt-4o-mini", max_tokens:4000, messages:[{ role:"user", content:buildAIPrompt(batchData, lang) }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return JSON.parse(data.choices[0].message.content.trim().replace(/^```json\n?|^```\n?|```\n?$/gm, ""));
  };

  const callGemini = async (batchData, lang) => {
    if (!geminiKey) throw new Error("กรุณาใส่ Gemini API Key ก่อน (กด 🔑)");
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ contents:[{ parts:[{ text:buildAIPrompt(batchData, lang) }] }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    return JSON.parse(data.candidates[0].content.parts[0].text.trim().replace(/^```json\n?|^```\n?|```\n?$/gm, ""));
  };

  const callGemma4 = async (batchData, lang) => {
    if (!geminiKey) throw new Error("กรุณาใส่ Gemini API Key ก่อน (กด 🔑) — Gemma 4 ใช้ Key เดียวกับ Gemini");
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-27b-it:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ contents:[{ parts:[{ text:buildAIPrompt(batchData, lang) }] }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    return JSON.parse(data.candidates[0].content.parts[0].text.trim().replace(/^```json\n?|^```\n?|```\n?$/gm, ""));
  };

  const callGoogleTrans = async (batchData, lang) => {
    const GT_MAP = { "zh-CN":"zh-CN", "zh-TW":"zh-TW", "zh-yue":"zh-TW" };
    const target = GT_MAP[lang.code] || lang.code;
    const src = srcLang === "zh" ? "zh-CN" : srcLang;
    const translateOne = async (p) => {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${src}&tl=${target}&dt=t&q=${encodeURIComponent(p.text)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Google Translate HTTP ${res.status}`);
      const data = await res.json();
      const translated = data[0]?.map(item => item?.[0] || "").join("") || p.text;
      return { idx: p.idx, text: translated };
    };
    return Promise.all(batchData.map(async (slideData) => ({
      slideNum: slideData.slideNum,
      paragraphs: await Promise.all(slideData.paragraphs.map(translateOne))
    })));
  };

  const callMyMemory = async (batchData, lang) => {
    const MM_MAP = { "zh-CN":"zh-CN", "zh-TW":"zh-TW", "zh-yue":"zh-CN" };
    const target = MM_MAP[lang.code] || lang.code;
    const translateOne = async (p) => {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(p.text)}&langpair=${srcLang}|${target}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
      const data = await res.json();
      if (data.responseStatus !== 200) throw new Error(data.responseDetails || "MyMemory error");
      return { idx: p.idx, text: data.responseData.translatedText };
    };
    return Promise.all(batchData.map(async (slideData) => ({
      slideNum: slideData.slideNum,
      paragraphs: await Promise.all(slideData.paragraphs.map(translateOne))
    })));
  };

  // ── Download file (routes by fileType) ──
  const downloadFile = async () => {
    if (!lang) return;
    setBusy(true);

    // Build original text map for skipped paras
    const origMap = {};
    slides.forEach(s => { origMap[s.num] = {}; s.paras.forEach(p => { origMap[s.num][p.idx] = p.text; }); });
    const resolveText = (slideNum, paraIdx, translatedText) => {
      const key = `${slideNum}-${paraIdx}`;
      return skippedParas.has(key) ? (origMap[slideNum]?.[paraIdx] ?? translatedText) : translatedText;
    };

    try {
      if (fileType === "docx") {
        const zip = zipRef.current;
        const tMap = {};
        translated.forEach(s => { tMap[s.slideNum] = {}; s.paragraphs.forEach(p => { tMap[s.slideNum][p.idx] = resolveText(s.slideNum, p.idx, p.text); }); });
        const newXml = buildDocxXml(slides[0].xml, tMap[1] || {}, lang);
        zip.file("word/document.xml", newXml);
        const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `[${lang.code}] ${file.name}`; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        return;
      }

      if (fileType === "xlsx") {
        const wb = xlsxWbRef.current;
        translated.forEach(s => {
          const sheetName = slides.find(sl => sl.num === s.slideNum)?.name;
          if (!sheetName || !wb.Sheets[sheetName]) return;
          s.paragraphs.forEach(p => {
            if (wb.Sheets[sheetName][p.idx]) wb.Sheets[sheetName][p.idx].v = resolveText(s.slideNum, p.idx, p.text);
          });
        });
        const out = window.XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `[${lang.code}] ${file.name.replace(/\.xls$/i, ".xlsx")}`; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        return;
      }

      if (fileType === "image") {
        // Download as plain text
        const lines = translated[0]?.paragraphs.map((p, i) => `${i + 1}. ${p.text}`) || [];
        const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `[${lang.code}] ${file.name}.txt`; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        return;
      }

      // PPTX / PPT
      if (fileType === "ppt") {
        if (!window.PptxGenJS) {
          await new Promise((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/npm/pptxgenjs/dist/pptxgen.bundle.js";
            s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
          });
        }
        const pptx = new window.PptxGenJS();
        const tMap = {};
        translated.forEach(s => { tMap[s.slideNum] = {}; s.paragraphs.forEach(p => { tMap[s.slideNum][p.idx] = resolveText(s.slideNum, p.idx, p.text); }); });
        for (const slide of slides) {
          const pSlide = pptx.addSlide();
          const textItems = slide.paras.map((p, i) => ({ text: (tMap[slide.num]?.[p.idx] ?? p.text), options: { breakLine: i < slide.paras.length - 1 } }));
          pSlide.addText(textItems, { x:0.3, y:0.3, w:"94%", h:"94%", fontSize:20, fontFace:effectivePptxFont, color:"000000", valign:"top", wrap:true, rtlMode:!!lang.rtl, line:{type:"none"}, fill:{type:"none"} });
        }
        await pptx.writeFile({ fileName: `[${lang.code}] ${file.name.replace(/\.ppt$/i, ".pptx")}` });
        return;
      }

      // PPTX
      const zip = zipRef.current;
      if (!zip) return;
      const tMap = {};
      translated.forEach(s => { tMap[s.slideNum] = {}; s.paragraphs.forEach(p => { tMap[s.slideNum][p.idx] = resolveText(s.slideNum, p.idx, p.text); }); });
      for (const slide of slides) {
        zip.file(slide.path, buildXml(slide.xml, tMap[slide.num] || {}, lang, effectivePptxFont));
      }
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `[${lang.code}] ${file.name}`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      alert("ดาวน์โหลดล้มเหลว: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  // ── Drag & Drop ──
  const onDragOver = (e) => { e.preventDefault(); setDrag(true); };
  const onDragLeave = () => setDrag(false);
  const onDrop = useCallback((e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }, [ready, fbEnabled, fbCfg]);

  // ── Filtered languages ──
  const filteredLangs = langQ
    ? LANGS.filter(l => l.name.toLowerCase().includes(langQ.toLowerCase()) || l.eng.toLowerCase().includes(langQ.toLowerCase()) || l.code.includes(langQ.toLowerCase()))
    : LANGS;

  // ── Slide data for result view ──
  const currentOriginal = slides[activeSlide];
  const currentTranslated = translated.find(t => t.slideNum === (currentOriginal?.num));

  const STEPS = ["อัปโหลดไฟล์", "เลือกภาษา", "กำลังแปล", "ผลลัพธ์"];

  // ── RENDER ──
  return (
    <div style={S.app}>
      {/* Header */}
      <header style={{ ...S.header, padding: isMobile ? "8px 16px" : "0 28px", height: isMobile ? "auto" : 60 }}>
        <div style={{ ...S.logo, fontSize: isMobile ? 15 : 18 }}>
          <div style={S.logoDot} />
          <span>SlideTranslate</span>
          {!isMobile && <span style={{ fontSize:11, color:"#4a4a7a", fontWeight:400, marginLeft:4 }}>AI PowerPoint Translator</span>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
          {step === 3 && !isMobile && <span style={S.tag("green")}>✓ แปลสำเร็จ {slides.length} สไลด์</span>}
          {/* Engine selector dropdown */}
          <select
            value={engine}
            onChange={e => { setEngine(e.target.value); localStorage.setItem("engine", e.target.value); setShowKey(false); }}
            style={{ ...S.input, width:"auto", padding: isMobile ? "5px 8px" : "6px 10px", fontSize: isMobile ? 11 : 12, cursor:"pointer", background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.4)", color:"#a5a5ff", borderRadius:8 }}
          >
            {ENGINES.map(eng => (
              <option key={eng.id} value={eng.id} style={{ background:"#0e0e1e", color:"#dde1f0" }}>
                {eng.icon} {eng.name}{eng.free ? " (ฟรี)" : ""}
              </option>
            ))}
          </select>
          {/* Key button — only for engines that need a key */}
          {!ENGINES.find(e => e.id === engine)?.free && (
            <button
              style={{ ...S.btnSmall, fontSize: isMobile ? 11 : 12, padding: isMobile ? "5px 10px" : "6px 12px", background: showKey ? "rgba(99,102,241,0.25)" : undefined, borderColor: showKey ? "rgba(99,102,241,0.6)" : undefined }}
              onClick={() => setShowKey(v => !v)}
            >
              🔑 {isMobile ? "Key" : "API Key"} {(engine==="claude"?claudeKey:engine==="openai"?openaiKey:engine==="groq"?groqKey:geminiKey) ? "●" : "○"}
            </button>
          )}
        </div>
      </header>

      {/* Unified API Key Panel */}
      {showKey && !ENGINES.find(e => e.id === engine)?.free && (() => {
        const eng    = ENGINES.find(e => e.id === engine);
        const keyVal = engine==="claude" ? claudeKey : engine==="openai" ? openaiKey : engine==="groq" ? groqKey : geminiKey;
        const setKey = (v) => {
          if (engine==="claude")       { setClaudeKey(v); localStorage.setItem("claude_api_key", v); }
          else if (engine==="openai") { setOpenaiKey(v); localStorage.setItem("openai_api_key", v); }
          else if (engine==="groq")   { setGroqKey(v);   localStorage.setItem("groq_api_key",   v); }
          else                        { setGeminiKey(v); localStorage.setItem("gemini_api_key", v); }
        };
        return (
          <div style={{ background:"#0a0a1e", borderBottom:"1px solid #1a1a35", padding: isMobile ? "12px 16px" : "16px 28px" }}>
            <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{eng.icon} {eng.name} — API Key</div>
                <div style={{ fontSize:12, color:"#6a6a9a", display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginTop:2 }}>
                  <span>{eng.hint}</span>
                  {eng.url && (
                    <a
                      href={eng.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color:"#8b8bff", fontWeight:700, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", background:"rgba(99,102,241,0.2)", borderRadius:6, border:"1px solid rgba(99,102,241,0.4)", fontSize:11, whiteSpace:"nowrap" }}
                    >
                      🔗 ไปขอ Key ฟรี
                    </a>
                  )}
                </div>
              </div>
              <input
                style={{ ...S.input, width:"100%", maxWidth: isMobile ? "100%" : 400, fontFamily:"monospace", fontSize:13 }}
                type="password"
                placeholder={eng.placeholder}
                value={keyVal}
                onChange={e => setKey(e.target.value)}
              />
              <button style={{ ...S.btnSmall, alignSelf: isMobile ? "flex-end" : "auto" }} onClick={() => setShowKey(false)}>ปิด</button>
            </div>
          </div>
        );
      })()}



      {/* Firebase Config Panel */}
      {showFb && (
        <div style={{ background:"#0a0a1e", borderBottom:"1px solid #1a1a35", padding:"20px 28px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Firebase Storage Configuration</div>
                <div style={{ fontSize:12, color:"#6a6a9a" }}>เพื่อบันทึกไฟล์ต้นฉบับและผลการแปลไว้บน Firebase Storage (ไม่จำเป็นก็ได้)</div>
              </div>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>
                <input type="checkbox" checked={fbEnabled} onChange={e => setFbEnabled(e.target.checked)} style={{ width:16, height:16 }} />
                เปิดใช้งาน Firebase
              </label>
            </div>
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap:12 }}>
              {[
                ["apiKey", "API Key"],
                ["authDomain", "Auth Domain"],
                ["projectId", "Project ID"],
                ["storageBucket", "Storage Bucket"],
                ["messagingSenderId", "Messaging Sender ID"],
                ["appId", "App ID"]
              ].map(([k, label]) => (
                <div key={k} style={S.fbField}>
                  <div style={S.label}>{label}</div>
                  <input
                    style={S.input}
                    placeholder={`your-${k}`}
                    value={fbCfg[k]}
                    onChange={e => setFbCfg(p => ({ ...p, [k]: e.target.value }))}
                    disabled={!fbEnabled}
                  />
                </div>
              ))}
            </div>
            {fbUploadUrl && (
              <div style={{ marginTop:12, fontSize:12, color:"#10b981" }}>
                ✓ ต้นฉบับอยู่บน Firebase: <a href={fbUploadUrl} target="_blank" style={{ color:"#6366f1" }}>ดูไฟล์</a>
              </div>
            )}
            {fbResultUrl && (
              <div style={{ marginTop:6, fontSize:12, color:"#10b981" }}>
                ✓ ผลการแปลอยู่บน Firebase: <a href={fbResultUrl} target="_blank" style={{ color:"#6366f1" }}>ดูไฟล์</a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main */}
      <main style={S.main}>
        {/* Stepper */}
        <div style={S.stepper}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
              <div style={{ ...S.stepItem(step === i, step > i), padding: isMobile ? "6px 10px" : "8px 16px", fontSize: isMobile ? 11 : 13 }}>
                <div style={S.stepNum(step === i, step > i)}>{step > i ? "✓" : i + 1}</div>
                {!isMobile || step === i ? label : null}
              </div>
              {i < STEPS.length - 1 && <div style={{ ...S.stepLine, maxWidth: isMobile ? 16 : 40 }} />}
            </div>
          ))}
        </div>

        {/* ── STEP 0: Upload ── */}
        {step === 0 && (
          <div style={S.card}>
            <div
              style={{ ...S.uploadZone(drag), padding: isMobile ? "36px 16px" : "64px 32px" }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <div style={{ fontSize: isMobile ? 44 : 56 }}>📄</div>
              <div style={{ fontSize: isMobile ? 17 : 20, fontWeight:700, color:"#fff" }}>{isMobile ? "แตะเพื่อเลือกไฟล์" : "วางไฟล์ที่นี่"}</div>
              <div style={{ fontSize: isMobile ? 12 : 14, color:"#6a6a9a" }}>รองรับ .pptx .ppt .docx .xlsx .jpg .png</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", marginTop:8 }}>
                {[["blue","📊 PowerPoint"],["purple","📝 Word"],["green","📗 Excel"],["blue","🖼️ Image"]].map(([c,t]) => (
                  <span key={t} style={S.tag(c)}>{t}</span>
                ))}
              </div>
              {busy && (
                <div style={{ width:"100%", maxWidth:300, marginTop:8 }}>
                  <div style={{ ...S.progress, marginBottom:6 }}><div style={S.progressBar(progress.pct)} /></div>
                  <div style={{ fontSize:12, color:"#6a6a9a" }}>{progress.msg}</div>
                </div>
              )}
            </div>
            <input id="fileInput" type="file" accept=".pptx,.ppt,.docx,.xlsx,.jpg,.jpeg,.png,.webp" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />

            <div style={{ marginTop:16, padding:14, background:"rgba(99,102,241,0.05)", borderRadius:12, border:"1px solid rgba(99,102,241,0.15)", fontSize: isMobile ? 12 : 13, color:"#8a8ac0", lineHeight:1.7 }}>
              <strong style={{ color:"#a5a5ff" }}>💡 หมายเหตุเรื่อง Font</strong><br />
              Web Preview → โหลด Google Fonts ตามภาษาโดยอัตโนมัติ<br />
              ไฟล์ PPTX ที่ดาวน์โหลด → เปลี่ยน font declaration ใน XML ให้ตรงกับภาษา
            </div>
          </div>
        )}

        {/* ── STEP 1: Language ── */}
        {step === 1 && (
          <div>
            <div style={{ display:"flex", flexDirection: isMobile ? "column" : "row", justifyContent:"space-between", alignItems: isMobile ? "stretch" : "flex-start", marginBottom:20, gap:12 }}>
              <div>
                <div style={{ fontSize: isMobile ? 18 : 22, fontWeight:700, color:"#fff", marginBottom:6 }}>เลือกภาษาที่ต้องการแปล</div>
                <div style={{ fontSize: isMobile ? 12 : 13, color:"#6a6a9a" }}>ไฟล์: <strong style={{ color:"#a5a5ff" }}>{file?.name}</strong> · {slides.length} สไลด์</div>
              </div>
              <button style={{ ...S.btnOutline, opacity: lang ? 1 : 0.4, alignSelf: isMobile ? "flex-start" : "auto" }} onClick={lang ? doTranslate : undefined}>
                แปลเลย →
              </button>
            </div>

            <input
              style={{ ...S.input, marginBottom:16 }}
              placeholder="🔍 ค้นหาภาษา เช่น Thai, 中文, ไทย..."
              value={langQ}
              onChange={e => setLangQ(e.target.value)}
            />

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:10 }}>
              {filteredLangs.map(l => (
                <div key={l.code} style={S.langCard(lang?.code === l.code)} onClick={() => setLang(l)}>
                  <span style={{ fontSize:22 }}>{l.flag}</span>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color: lang?.code === l.code ? "#fff" : "#c0c0e0" }}>{l.name}</div>
                    <div style={{ fontSize:11, color:"#6a6a9a", marginTop:2 }}>{l.eng}</div>
                  </div>
                  {lang?.code === l.code && <span style={{ marginLeft:"auto", color:"#6366f1", fontSize:16 }}>✓</span>}
                </div>
              ))}
            </div>

            {lang && (
              <div style={{ marginTop:24, padding:16, background:"rgba(99,102,241,0.08)", borderRadius:12, border:"1px solid rgba(99,102,241,0.2)", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                <span style={{ fontSize:32 }}>{lang.flag}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:"#fff" }}>แปลเป็น {lang.name} ({lang.eng})</div>
                  <div style={{ fontSize:12, color:"#6a6a9a", marginTop:4, fontFamily:`'${lang.webFont}', sans-serif` }}>
                    Web Font: {effectiveWebFont} · PPTX Font: {effectivePptxFont}{customFont ? " ✏️" : ""}
                    {lang.rtl ? " · ⟵ RTL" : ""}
                  </div>
                </div>
                {engine !== "claude" && (
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, color:"#6a6a9a" }}>ต้นฉบับ (ตรวจพบ):</span>
                    <select
                      style={{ ...S.input, width:"auto", padding:"6px 10px", fontSize:13 }}
                      value={srcLang}
                      onChange={e => { setSrcLang(e.target.value); localStorage.setItem("src_lang", e.target.value); }}
                    >
                      {[["en","English"],["th","Thai"],["zh","Chinese"],["ja","Japanese"],["ko","Korean"],["fr","French"],["de","German"],["es","Spanish"],["ru","Russian"],["ar","Arabic"],["vi","Vietnamese"],["id","Indonesian"],["pt","Portuguese"],["it","Italian"]].map(([code,name]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button style={S.btn} onClick={doTranslate}>แปลทันที →</button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Translating ── */}
        {step === 2 && (
          <div style={{ ...S.card, textAlign:"center", padding:"64px 32px" }}>
            <div style={{ fontSize:48, marginBottom:20 }}>✨</div>
            <div style={{ fontSize:22, fontWeight:700, color:"#fff", marginBottom:8 }}>กำลังแปลด้วย {ENGINES.find(e=>e.id===engine)?.icon} {ENGINES.find(e=>e.id===engine)?.name}...</div>
            <div style={{ fontSize:14, color:"#6a6a9a", marginBottom:32 }}>{progress.msg}</div>
            <div style={{ maxWidth:400, margin:"0 auto" }}>
              <div style={{ ...S.progress, height:10 }}>
                <div style={S.progressBar(progress.pct)} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12, color:"#6a6a9a" }}>
                <span>0%</span>
                <span>{progress.pct}%</span>
                <span>100%</span>
              </div>
            </div>
            <div style={{ marginTop:32, display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
              {slides.map((s, i) => (
                <div key={i} style={{ padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600, background: translated.some(t => t.slideNum === s.num) ? "rgba(16,185,129,0.15)" : "rgba(30,30,58,0.8)", color: translated.some(t => t.slideNum === s.num) ? "#10b981" : "#4a4a7a", border:`1px solid ${translated.some(t => t.slideNum === s.num) ? "rgba(16,185,129,0.3)" : "#1e1e3a"}` }}>
                  Slide {s.num}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Result ── */}
        {step === 3 && (
          <div>
            {/* Action bar */}
            <div style={{ display:"flex", flexDirection: isMobile ? "column" : "row", justifyContent:"space-between", alignItems: isMobile ? "stretch" : "center", marginBottom: isMobile ? 16 : 24, gap:12 }}>
              <div>
                <div style={{ fontSize: isMobile ? 17 : 20, fontWeight:700, color:"#fff" }}>
                  {lang?.flag} แปลเป็น {lang?.name} สำเร็จ!
                </div>
                <div style={{ fontSize:12, color:"#6a6a9a", marginTop:4 }}>
                  {fileType === "image" ? "🖼️ Image" : fileType === "docx" ? `📝 ${slides[0]?.paras.length} ย่อหน้า` : fileType === "xlsx" ? `📗 ${slides.length} ชีต` : `📊 ${slides.length} สไลด์`} · Font: {lang?.pptxLatin}
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button style={{ ...S.btnSmall, flex: isMobile ? 1 : undefined, textAlign:"center" }} onClick={() => { setStep(1); setTranslated([]); }}>← ภาษาใหม่</button>
                <button style={{ ...S.btnSmall, flex: isMobile ? 1 : undefined, textAlign:"center" }} onClick={() => { setStep(0); setFile(null); setSlides([]); setTranslated([]); setLang(null); }}>อัปโหลดใหม่</button>
                <button style={{ ...S.btn, opacity: busy ? 0.6 : 1, justifyContent:"center", width: isMobile ? "100%" : undefined }} onClick={downloadFile} disabled={busy}>
                  {busy ? "⏳ กำลังสร้าง..." : fileType === "image" ? "⬇️ บันทึกข้อความ .txt" : fileType === "docx" ? "⬇️ ดาวน์โหลด DOCX" : fileType === "xlsx" ? "⬇️ ดาวน์โหลด XLSX" : "⬇️ ดาวน์โหลด PPTX"}
                </button>
              </div>
            </div>

            {/* Image preview (only for image fileType) */}
            {fileType === "image" && imageData && (
              <div style={{ ...S.card, marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#8b8bff", marginBottom:10 }}>🖼️ ต้นฉบับ</div>
                <img src={imageData} alt="original" style={{ maxWidth:"100%", maxHeight:400, objectFit:"contain", borderRadius:10, border:"1px solid #1a1a35" }} />
              </div>
            )}

            {/* Slide/Sheet/Image tabs */}
            <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
              {slides.map((s, i) => (
                <button key={i} style={S.slideTab(activeSlide === i)} onClick={() => setActiveSlide(i)}>
                  {fileType === "xlsx" ? `📗 ${s.name}` : fileType === "image" ? "🖼️ Image" : `Slide ${s.num}`}
                </button>
              ))}
            </div>

            {/* Side-by-side view */}
            <div style={S.grid2(isMobile)}>
              {/* Original */}
              <div style={S.card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <span style={S.tag("blue")}>📄 ต้นฉบับ</span>
                  <span style={{ fontSize:12, color:"#6a6a9a" }}>{currentOriginal?.paras.length} ข้อความ</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {currentOriginal?.paras.map((p, i) => (
                    <div key={i} style={{ padding:"10px 14px", background:"#080814", borderRadius:10, border:"1px solid #1a1a35", fontSize:14, lineHeight:1.7, color:"#c0c0d8" }}>
                      {p.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Translated */}
              <div style={S.card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
                  <span style={S.tag("green")}>✏️ {lang?.flag} แปลแล้ว (แก้ไขได้)</span>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:11, color:"#6a6a9a" }}>🏷️ ฟอนต์:</span>
                    <select
                      value={customFont?.web || ""}
                      onChange={e => {
                        const val = e.target.value;
                        if (!val) { setCustomFont(null); return; }
                        const found = FONT_OPTIONS.find(f => f.web === val);
                        if (found) setCustomFont(found);
                      }}
                      style={{ background:"#0e0e1e", color:"#a5a5ff", border:"1px solid rgba(99,102,241,0.3)", borderRadius:7, padding:"4px 8px", fontSize:12, cursor:"pointer", fontFamily:`'${effectiveWebFont}', sans-serif`, maxWidth:180 }}
                    >
                      <option value="" style={{ background:"#0e0e1e" }}>⭐ {lang?.webFont} (ค่าเริ่มต้น)</option>
                      {Object.entries(FONT_OPTIONS.reduce((acc, f) => ({ ...acc, [f.group]: [...(acc[f.group]||[]), f] }), {})).map(([group, fonts]) => (
                        <optgroup key={group} label={group} style={{ background:"#0e0e1e" }}>
                          {fonts.map(f => <option key={f.web} value={f.web} style={{ background:"#0e0e1e", color:"#dde1f0" }}>{f.label}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    {customFont && (
                      <button onClick={() => setCustomFont(null)} title="รีเซ็ตเป็นค่าเริ่มต้น" style={{ background:"none", border:"none", color:"#6a6a9a", fontSize:14, cursor:"pointer", padding:"2px 4px", lineHeight:1 }}>×</button>
                    )}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {currentTranslated?.paragraphs.map((p, i) => {
                    const skipKey = `${currentOriginal?.num}-${p.idx}`;
                    const isSkipped = skippedParas.has(skipKey);
                    const originalText = currentOriginal?.paras[i]?.text || p.text;
                    return (
                      <div key={i} style={{ position:"relative" }}>
                        {/* Toggle button */}
                        <button
                          onClick={() => {
                            const next = new Set(skippedParas);
                            if (isSkipped) next.delete(skipKey); else next.add(skipKey);
                            setSkippedParas(next);
                          }}
                          title={isSkipped ? "คลิกเพื่อใช้คำแปล" : "คลิกเพื่อคงต้นฉบับ"}
                          style={{
                            position:"absolute", top:6, right:6, zIndex:2,
                            padding:"2px 8px", borderRadius:6, fontSize:10, fontWeight:700, cursor:"pointer", border:"none",
                            background: isSkipped ? "rgba(239,68,68,0.2)" : "rgba(99,102,241,0.2)",
                            color: isSkipped ? "#f87171" : "#8b8bff",
                          }}
                        >
                          {isSkipped ? "⛔ ต้นฉบับ" : "✅ แปล"}
                        </button>

                        {isSkipped ? (
                          /* Show original text (greyed out, non-editable) */
                          <div style={{
                            padding:"10px 14px", paddingRight:72,
                            background:"rgba(30,30,50,0.5)", borderRadius:10,
                            border:"1px solid rgba(100,100,130,0.25)",
                            fontSize:14, lineHeight:1.7, color:"#6a6a9a",
                            fontStyle:"italic", minHeight:44,
                          }}>
                            {originalText}
                          </div>
                        ) : (
                          /* Editable translated textarea */
                          <textarea
                            value={p.text}
                            rows={Math.max(2, Math.ceil(p.text.length / 60))}
                            onChange={e => {
                              const newText = e.target.value;
                              setTranslated(prev => prev.map(s =>
                                s.slideNum !== currentOriginal?.num ? s : {
                                  ...s,
                                  paragraphs: s.paragraphs.map((para, pi) =>
                                    pi === i ? { ...para, text: newText } : para
                                  )
                                }
                              ));
                            }}
                            style={{
                              ...S.textBlock(effectiveWebFont, lang?.rtl),
                              padding:"10px 14px", paddingRight:72,
                              background:"rgba(99,102,241,0.05)",
                              borderRadius:10,
                              border:"1px solid rgba(99,102,241,0.2)",
                              resize:"vertical", outline:"none",
                              width:"100%", boxSizing:"border-box",
                              fontFamily:`'${effectiveWebFont}', sans-serif`,
                              fontSize:14, lineHeight:1.7, color:"#dde1f0",
                              transition:"border-color 0.2s",
                            }}
                            onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                            onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Font info banner */}
            <div style={{ marginTop:20, padding:16, background:"rgba(168,85,247,0.05)", borderRadius:12, border:"1px solid rgba(168,85,247,0.2)", fontSize:13, display:"flex", gap:24, flexWrap:"wrap", color:"#c084fc" }}>
              <div><strong>🌐 Web Font:</strong> {lang?.webFont} (จาก Google Fonts)</div>
              <div><strong>📂 PPTX Font:</strong> {lang?.pptxLatin} (เปลี่ยนแล้วในไฟล์)</div>
              {lang?.rtl && <div><strong>⟵ ทิศทาง:</strong> Right-to-Left (RTL)</div>}
              <div><strong>📊 สไลด์ทั้งหมด:</strong> {slides.length} slides</div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid #1a1a35", padding: isMobile ? "12px 16px" : "16px 28px", display:"flex", justifyContent:"center", flexWrap:"wrap", gap: isMobile ? 8 : 24, fontSize:12, color:"#3a3a6a", textAlign:"center" }}>
        <span>SlideTranslate · Powered by Claude AI</span>
        {!isMobile && <span>รองรับ {LANGS.length} ภาษาทั่วโลก</span>}
        {!isMobile && <span>Font เปลี่ยนอัตโนมัติทั้ง Web & PPTX</span>}
      </footer>
    </div>
  );
}
