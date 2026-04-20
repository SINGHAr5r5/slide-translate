import { useState, useCallback, useEffect, useRef } from "react";

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

function buildXml(xml, transByIdx, lang) {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const pNodes = Array.from(doc.getElementsByTagNameNS(NS, "p"));
  pNodes.forEach((p, idx) => {
    const tr = transByIdx[idx];
    if (!tr) return;
    const tNodes = Array.from(p.getElementsByTagNameNS(NS, "t"));
    if (!tNodes.length) return;
    tNodes[0].textContent = tr;
    for (let i = 1; i < tNodes.length; i++) tNodes[i].textContent = "";
  });
  ["rPr","defRPr","endParaRPr"].forEach(tag => {
    Array.from(doc.getElementsByTagNameNS(NS, tag)).forEach(el => {
      Array.from(el.getElementsByTagNameNS(NS, "latin")).forEach(n => n.setAttribute("typeface", lang.pptxLatin));
      const ea = Array.from(el.getElementsByTagNameNS(NS, "ea"));
      if (ea.length) ea.forEach(n => n.setAttribute("typeface", lang.pptxEA));
      if (lang.rtl) Array.from(el.getElementsByTagNameNS(NS, "cs")).forEach(n => n.setAttribute("typeface", lang.pptxLatin));
    });
  });
  let out = new XMLSerializer().serializeToString(doc);
  if (!out.startsWith("<?xml")) out = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` + out;
  return out;
}

function loadFirebase(cfg, cb) {
  if (window._fbLoaded) { cb(); return; }
  const load = (src, next) => { const s = document.createElement("script"); s.src = src; s.onload = next; document.head.appendChild(s); };
  load("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js", () => {
    load("https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js", () => {
      window.firebase.initializeApp(cfg); window._fbLoaded = true; cb();
    });
  });
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
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
  const zipRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    if (window.JSZip) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!lang) return;
    const id = `gf-${lang.code}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id; link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${lang.gfont}&display=swap`;
    document.head.appendChild(link);
  }, [lang]);

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

  const handleFile = async (f) => {
    if (!ready) return alert("กำลังโหลด library...");
    if (!f?.name?.endsWith(".pptx")) return alert("กรุณาเลือกไฟล์ .pptx เท่านั้น");
    setBusy(true);
    setProgress({ pct: 30, msg: "กำลังอ่านไฟล์..." });
    try {
      const parsed = await parsePptx(f);
      setFile(f); setSlides(parsed); setActiveSlide(0);
      if (fbEnabled && fbCfg.apiKey) {
        setProgress({ pct: 70, msg: "กำลังอัปโหลดไป Firebase..." });
        loadFirebase(fbCfg, async () => {
          try {
            const ref = window.firebase.storage().ref(`originals/${Date.now()}_${f.name}`);
            await ref.put(f);
            setFbUploadUrl(await ref.getDownloadURL());
          } catch (e) { console.warn(e); }
        });
      }
      setStep(1);
    } catch (e) { alert("Error: " + e.message); }
    finally { setBusy(false); setProgress({ pct: 0, msg: "" }); }
  };

  const doTranslate = async () => {
    if (!lang || !slides.length) return;
    setBusy(true); setStep(2);
    const BATCH = 3; const results = [];
    try {
      for (let i = 0; i < slides.length; i += BATCH) {
        const batch = slides.slice(i, i + BATCH);
        setProgress({ pct: Math.round((i / slides.length) * 90), msg: `แปลสไลด์ ${i+1}–${Math.min(i+BATCH, slides.length)} จาก ${slides.length}...` });
        const input = batch.map(s => ({ slideNum: s.num, paragraphs: s.paras }));
        const res = await callClaude(input, lang);
        results.push(...res);
      }
      setTranslated(results); setProgress({ pct: 100, msg: "เสร็จ!" }); setActiveSlide(0); setStep(3);
    } catch (e) { alert("Error: " + e.message); setStep(1); }
    finally { setBusy(false); }
  };

  const callClaude = async (batchData, lang) => {
    const prompt = `Translate these PowerPoint slide texts to ${lang.eng} (${lang.name}). Return ONLY valid JSON array. No markdown.

Input:
${JSON.stringify(batchData)}

Return same JSON structure with translated "text" values.`;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, messages: [{ role: "user", content: prompt }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const raw = data.content[0].text.trim().replace(/^```json\n?|^```\n?|```\n?$/gm, "");
    return JSON.parse(raw);
  };

  const downloadPptx = async () => {
    if (!zipRef.current || !lang) return;
    setBusy(true);
    try {
      const zip = zipRef.current;
      const tMap = {};
      translated.forEach(s => { tMap[s.slideNum] = {}; s.paragraphs.forEach(p => { tMap[s.slideNum][p.idx] = p.text; }); });
      for (const slide of slides) { zip.file(slide.path, buildXml(slide.xml, tMap[slide.num] || {}, lang)); }
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      if (fbEnabled && fbCfg.apiKey) {
        loadFirebase(fbCfg, async () => {
          try {
            const fbFile = new File([blob], `[${lang.code}] ${file.name}`, { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
            const ref = window.firebase.storage().ref(`translated/${Date.now()}_${fbFile.name}`);
            await ref.put(fbFile); setFbResultUrl(await ref.getDownloadURL());
          } catch (e) { console.warn(e); }
        });
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `[${lang.code}] ${file.name}`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) { alert("Error: " + e.message); }
    finally { setBusy(false); }
  };

  const onDrop = useCallback((e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }, [ready, fbEnabled, fbCfg]);
  const filtered = langQ ? LANGS.filter(l => l.name.toLowerCase().includes(langQ.toLowerCase()) || l.eng.toLowerCase().includes(langQ.toLowerCase())) : LANGS;
  const curOrig = slides[activeSlide];
  const curTrans = translated.find(t => t.slideNum === curOrig?.num);
  const STEPS = ["อัปโหลด","เลือกภาษา","กำลังแปล","ผลลัพธ์"];

  const c = {
    app: { minHeight:"100vh", background:"#070711", color:"#dde1f0", fontFamily:"'Plus Jakarta Sans', sans-serif", display:"flex", flexDirection:"column" },
    hdr: { background:"rgba(8,8,20,0.96)", borderBottom:"1px solid #1a1a35", padding:"0 24px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(16px)" },
    logo: { display:"flex", alignItems:"center", gap:10, fontWeight:700, fontSize:17, color:"#fff" },
    dot: { width:9, height:9, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#a855f7)", flexShrink:0 },
    main: { flex:1, maxWidth:1100, width:"100%", margin:"0 auto", padding:"28px 20px" },
    stepper: { display:"flex", alignItems:"center", marginBottom:36 },
    sItem: (a,d) => ({ display:"flex", alignItems:"center", gap:7, padding:"7px 14px", borderRadius:100, fontSize:12.5, fontWeight:600, color:d?"#6366f1":a?"#fff":"#44446a", background:a?"rgba(99,102,241,0.15)":"transparent", border:a?"1px solid rgba(99,102,241,0.4)":"1px solid transparent", whiteSpace:"nowrap" }),
    sNum: (a,d) => ({ width:20, height:20, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, background:d?"#6366f1":a?"rgba(99,102,241,0.8)":"#1a1a35", color:"#fff", flexShrink:0 }),
    sLine: { flex:1, height:1, background:"#1a1a35", maxWidth:32, margin:"0 4px" },
    card: { background:"#0d0d1d", border:"1px solid #1a1a35", borderRadius:16, padding:24 },
    drop: (d) => ({ border:`2px dashed ${d?"#6366f1":"#222240"}`, borderRadius:16, padding:"56px 32px", display:"flex", flexDirection:"column", alignItems:"center", gap:14, cursor:"pointer", transition:"all 0.2s", background:d?"rgba(99,102,241,0.06)":"transparent", textAlign:"center" }),
    btn: (dis) => ({ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", borderRadius:10, padding:"11px 24px", fontSize:13.5, fontWeight:700, cursor:dis?"not-allowed":"pointer", opacity:dis?0.5:1, display:"flex", alignItems:"center", gap:8 }),
    btnO: { background:"transparent", color:"#6366f1", border:"1px solid #6366f1", borderRadius:10, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer" },
    btnS: { background:"rgba(99,102,241,0.12)", color:"#8b8bff", border:"1px solid rgba(99,102,241,0.25)", borderRadius:8, padding:"6px 13px", fontSize:12, fontWeight:600, cursor:"pointer" },
    inp: { width:"100%", background:"#090917", border:"1px solid #222245", borderRadius:10, padding:"10px 13px", fontSize:13.5, color:"#dde1f0", outline:"none", boxSizing:"border-box" },
    tag: (c) => ({ display:"inline-block", padding:"3px 9px", borderRadius:100, fontSize:11, fontWeight:600, background:c==="g"?"rgba(16,185,129,0.12)":c==="b"?"rgba(99,102,241,0.12)":"rgba(168,85,247,0.12)", color:c==="g"?"#10b981":c==="b"?"#8b8bff":"#c084fc" }),
    prog: { background:"#181830", borderRadius:100, height:6, overflow:"hidden" },
    progB: (p) => ({ height:"100%", width:`${p}%`, background:"linear-gradient(90deg,#6366f1,#a855f7)", transition:"width 0.4s", borderRadius:100 }),
    lCard: (s) => ({ border:`1px solid ${s?"#6366f1":"#1c1c38"}`, borderRadius:11, padding:"11px 13px", cursor:"pointer", display:"flex", alignItems:"center", gap:9, background:s?"rgba(99,102,241,0.1)":"#0d0d1d", transition:"all 0.15s" }),
    sTab: (a) => ({ padding:"7px 13px", fontSize:12.5, fontWeight:600, cursor:"pointer", borderRadius:7, color:a?"#fff":"#555580", background:a?"rgba(99,102,241,0.2)":"transparent", border:a?"1px solid rgba(99,102,241,0.35)":"1px solid transparent", whiteSpace:"nowrap", transition:"all 0.2s" }),
    grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 },
    tBlock: (f,r) => ({ fontFamily:`'${f}', sans-serif`, direction:r?"rtl":"ltr", textAlign:r?"right":"left", lineHeight:1.9, fontSize:14.5, color:"#dde1f0" }),
  };

  return (
    <div style={c.app}>
      {/* Header */}
      <header style={c.hdr}>
        <div style={c.logo}>
          <div style={c.dot}/>
          <span>SlideTranslate</span>
          <span style={{ fontSize:11, color:"#444468", fontWeight:400, marginLeft:2 }}>AI PowerPoint Translator</span>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {step===3 && <span style={c.tag("g")}>✓ แปลแล้ว {slides.length} สไลด์</span>}
          <button style={c.btnS} onClick={()=>setShowFb(!showFb)}>⚙️ Firebase {fbEnabled?"🟢":"⚪"}</button>
        </div>
      </header>

      {/* Firebase Panel */}
      {showFb && (
        <div style={{ background:"#08081a", borderBottom:"1px solid #1a1a35", padding:"18px 24px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>Firebase Storage Config</div>
                <div style={{ fontSize:11.5, color:"#555580" }}>เพื่อบันทึกไฟล์ต้นฉบับ & ผลการแปลไว้บน Firebase (ไม่บังคับ)</div>
              </div>
              <label style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", fontSize:13, fontWeight:600 }}>
                <input type="checkbox" checked={fbEnabled} onChange={e=>setFbEnabled(e.target.checked)} style={{ width:15, height:15 }}/>
                เปิดใช้ Firebase
              </label>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {[["apiKey","API Key"],["authDomain","Auth Domain"],["projectId","Project ID"],["storageBucket","Storage Bucket"],["messagingSenderId","Sender ID"],["appId","App ID"]].map(([k,l])=>(
                <div key={k}>
                  <div style={{ fontSize:11, fontWeight:600, color:"#555580", marginBottom:5, letterSpacing:0.4 }}>{l}</div>
                  <input style={c.inp} placeholder={k} value={fbCfg[k]} onChange={e=>setFbCfg(p=>({...p,[k]:e.target.value}))} disabled={!fbEnabled}/>
                </div>
              ))}
            </div>
            {fbUploadUrl && <div style={{ marginTop:10, fontSize:12, color:"#10b981" }}>✓ ต้นฉบับ: <a href={fbUploadUrl} target="_blank" style={{ color:"#6366f1" }}>Firebase Storage</a></div>}
            {fbResultUrl && <div style={{ marginTop:4, fontSize:12, color:"#10b981" }}>✓ แปลแล้ว: <a href={fbResultUrl} target="_blank" style={{ color:"#6366f1" }}>Firebase Storage</a></div>}
          </div>
        </div>
      )}

      <main style={c.main}>
        {/* Stepper */}
        <div style={c.stepper}>
          {STEPS.map((label,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center" }}>
              <div style={c.sItem(step===i, step>i)}>
                <div style={c.sNum(step===i, step>i)}>{step>i?"✓":i+1}</div>
                {label}
              </div>
              {i<STEPS.length-1 && <div style={c.sLine}/>}
            </div>
          ))}
        </div>

        {/* STEP 0: Upload */}
        {step===0 && (
          <div style={c.card}>
            <div style={c.drop(drag)} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>document.getElementById("fi").click()}>
              <div style={{ fontSize:52 }}>📊</div>
              <div style={{ fontSize:19, fontWeight:700, color:"#fff" }}>วางไฟล์ .pptx ที่นี่</div>
              <div style={{ fontSize:13, color:"#555580" }}>หรือคลิกเพื่อเลือกไฟล์จากเครื่อง</div>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap", justifyContent:"center", marginTop:6 }}>
                {["🇹🇭 ไทย","🇨🇳 中文","🇯🇵 日本語","🇱🇦 ລາວ","🇸🇦 العربية","+ 30 ภาษา"].map(t=>(
                  <span key={t} style={c.tag("b")}>{t}</span>
                ))}
              </div>
              {busy && <div style={{ width:"100%", maxWidth:280, marginTop:10 }}>
                <div style={c.prog}><div style={c.progB(progress.pct)}/></div>
                <div style={{ fontSize:11.5, color:"#555580", textAlign:"center", marginTop:5 }}>{progress.msg}</div>
              </div>}
            </div>
            <input id="fi" type="file" accept=".pptx" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
            <div style={{ marginTop:18, padding:14, background:"rgba(99,102,241,0.05)", borderRadius:11, border:"1px solid rgba(99,102,241,0.15)", fontSize:12.5, color:"#7070a0", lineHeight:1.75 }}>
              <strong style={{ color:"#9090cc" }}>💡 Font เปลี่ยนอัตโนมัติ 2 ระดับ:</strong><br/>
              <strong style={{ color:"#8b8bff" }}>Web Preview</strong> → โหลด Google Fonts ตามภาษา (Sarabun / Noto Sans SC / Noto Sans Lao ฯลฯ)<br/>
              <strong style={{ color:"#8b8bff" }}>ไฟล์ PPTX</strong> → แก้ XML font declaration ให้ตรงกับ OS font มาตรฐาน (TH Sarabun New / Microsoft YaHei / DokChampa ฯลฯ)
            </div>
          </div>
        )}

        {/* STEP 1: Language */}
        {step===1 && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, gap:12, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:20, fontWeight:700, color:"#fff", marginBottom:5 }}>เลือกภาษาที่ต้องการแปล</div>
                <div style={{ fontSize:12.5, color:"#555580" }}>📊 {file?.name} · {slides.length} สไลด์ · {slides.reduce((a,s)=>a+s.paras.length,0)} ข้อความ</div>
              </div>
              <button style={c.btnO} onClick={lang?doTranslate:undefined} disabled={!lang}>แปลทันที →</button>
            </div>
            <input style={{ ...c.inp, marginBottom:14 }} placeholder="🔍 ค้นหาภาษา เช่น Thai, ไทย, 中文..." value={langQ} onChange={e=>setLangQ(e.target.value)}/>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(172px,1fr))", gap:9, maxHeight:380, overflowY:"auto" }}>
              {filtered.map(l=>(
                <div key={l.code} style={c.lCard(lang?.code===l.code)} onClick={()=>setLang(l)}>
                  <span style={{ fontSize:20 }}>{l.flag}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:13.5, color:lang?.code===l.code?"#fff":"#b0b0d0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.name}</div>
                    <div style={{ fontSize:11, color:"#555580", marginTop:1 }}>{l.eng}</div>
                  </div>
                  {lang?.code===l.code && <span style={{ marginLeft:"auto", color:"#6366f1", flexShrink:0 }}>✓</span>}
                </div>
              ))}
            </div>
            {lang && (
              <div style={{ marginTop:20, padding:14, background:"rgba(99,102,241,0.08)", borderRadius:12, border:"1px solid rgba(99,102,241,0.2)", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                <span style={{ fontSize:28 }}>{lang.flag}</span>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ fontWeight:700, color:"#fff", fontSize:15 }}>แปลเป็น {lang.name}</div>
                  <div style={{ fontSize:11.5, color:"#7070a0", marginTop:4 }}>Web: <strong style={{ color:"#8b8bff" }}>{lang.webFont}</strong> · PPTX: <strong style={{ color:"#8b8bff" }}>{lang.pptxLatin}</strong>{lang.rtl?" · RTL ⟵":""}</div>
                </div>
                <button style={c.btn(false)} onClick={doTranslate}>🚀 เริ่มแปล {slides.length} สไลด์</button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Translating */}
        {step===2 && (
          <div style={{ ...c.card, textAlign:"center", padding:"56px 28px" }}>
            <div style={{ fontSize:44, marginBottom:18 }}>✨</div>
            <div style={{ fontSize:20, fontWeight:700, color:"#fff", marginBottom:7 }}>AI กำลังแปลด้วย Claude...</div>
            <div style={{ fontSize:13, color:"#555580", marginBottom:28 }}>{progress.msg}</div>
            <div style={{ maxWidth:380, margin:"0 auto 24px" }}>
              <div style={c.prog}><div style={c.progB(progress.pct)}/></div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:7, fontSize:11.5, color:"#555580" }}>
                <span>0%</span><span style={{ color:"#a0a0ff", fontWeight:600 }}>{progress.pct}%</span><span>100%</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
              {slides.map((s,i)=>(
                <div key={i} style={{ padding:"5px 11px", borderRadius:7, fontSize:12, fontWeight:600, background:translated.some(t=>t.slideNum===s.num)?"rgba(16,185,129,0.12)":"rgba(20,20,50,0.8)", color:translated.some(t=>t.slideNum===s.num)?"#10b981":"#444468", border:`1px solid ${translated.some(t=>t.slideNum===s.num)?"rgba(16,185,129,0.3)":"#1e1e3a"}` }}>
                  Slide {s.num}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Result */}
        {step===3 && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontSize:19, fontWeight:700, color:"#fff" }}>{lang?.flag} แปลเป็น {lang?.name} สำเร็จ!</div>
                <div style={{ fontSize:12.5, color:"#555580", marginTop:4 }}>{slides.length} สไลด์ · Web Font: {lang?.webFont} · PPTX Font: {lang?.pptxLatin}</div>
              </div>
              <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
                <button style={c.btnS} onClick={()=>{setStep(1);setTranslated([]);}}>← ภาษาใหม่</button>
                <button style={c.btnS} onClick={()=>{setStep(0);setFile(null);setSlides([]);setTranslated([]);setLang(null);}}>อัปโหลดใหม่</button>
                <button style={c.btn(busy)} onClick={downloadPptx} disabled={busy}>{busy?"⏳ กำลังสร้าง...":"⬇️ ดาวน์โหลด PPTX"}</button>
              </div>
            </div>

            <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
              {slides.map((s,i)=>(
                <button key={i} style={c.sTab(activeSlide===i)} onClick={()=>setActiveSlide(i)}>Slide {s.num}</button>
              ))}
            </div>

            <div style={c.grid2}>
              <div style={c.card}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <span style={c.tag("b")}>📄 ต้นฉบับ</span>
                  <span style={{ fontSize:11.5, color:"#555580" }}>{curOrig?.paras.length} ข้อความ</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {curOrig?.paras.map((p,i)=>(
                    <div key={i} style={{ padding:"9px 13px", background:"#07071a", borderRadius:9, border:"1px solid #1a1a35", fontSize:13.5, lineHeight:1.75, color:"#b0b0cc" }}>{p.text}</div>
                  ))}
                </div>
              </div>
              <div style={c.card}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <span style={c.tag("g")}>✓ {lang?.flag} แปลแล้ว</span>
                  <span style={{ fontSize:11.5, color:"#555580", fontFamily:`'${lang?.webFont}', sans-serif` }}>{lang?.webFont}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {curTrans?.paragraphs.map((p,i)=>(
                    <div key={i} style={{ padding:"9px 13px", background:"rgba(99,102,241,0.05)", borderRadius:9, border:"1px solid rgba(99,102,241,0.18)", ...c.tBlock(lang?.webFont, lang?.rtl) }}>{p.text}</div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop:18, padding:14, background:"rgba(168,85,247,0.05)", borderRadius:11, border:"1px solid rgba(168,85,247,0.18)", fontSize:12.5, display:"flex", gap:24, flexWrap:"wrap", color:"#a080cc" }}>
              <div>🌐 <strong>Web Font:</strong> {lang?.webFont}</div>
              <div>📂 <strong>PPTX Font:</strong> {lang?.pptxLatin}</div>
              {lang?.rtl && <div>⟵ <strong>Direction:</strong> RTL</div>}
              <div>📊 <strong>สไลด์:</strong> {slides.length} slides</div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop:"1px solid #111130", padding:"14px 24px", textAlign:"center", fontSize:12, color:"#333360", display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
        <span>SlideTranslate · Claude AI</span>
        <span>{LANGS.length} ภาษาทั่วโลก</span>
        <span>Font เปลี่ยนทั้ง Web & PPTX</span>
      </footer>
    </div>
  );
}
