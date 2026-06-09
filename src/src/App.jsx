import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://wwzpgpvmwblhtccceqeq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3enBncHZtd2JsaHRjY2NlcWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDg3MDAsImV4cCI6MjA5NjU4NDcwMH0.hh3FwhE0UuMrDsryPTR7ITXTCd58d7mQL4uoEIN6ZiQ";

const BURGUNDY = "#3a1519";
const GOLD = "#c9a96e";
const GOLD_L = "#e2c896";
const SAND = "#D8CCBE";
const SAND_L = "#ede6dc";
const SAND_W = "#c8bba9";
const CEMENT = "#B8B1AA";
const ROSE = "#B98E8A";
const OLIVE = "#7B8153";
const ESPRESSO = "#5A4032";
const CREAM = "#f5efe6";
const RED = "#c97070";

const CATS = [
  { id: "vip", label: "VIP Creator", color: GOLD, textColor: BURGUNDY,
    rows: [
      { n: "Kari Medina", h: "@imkarimedina" },
      { n: "Holy Hippy", h: "@holyhippy" },
      { n: "Monet McMichael", h: "@monetmcmichael" },
      { n: "Magz Le Chic", h: "@magz_lechic" },
      { n: "Alexis Belon", h: "@alexisbelon" },
      { n: "Young Is Blessed", h: "@youngisblessed" },
      { n: "Brooke", h: "@brooke_bogle" },
      { n: "Sasha", h: "@curatedbysasha" },
      { n: "Jules", h: "@ter_jules_" },
      { n: "Daniela", h: "@abcdaniela" },
      { n: "Silvia", h: "@thegroomingspaw" },
      { n: "Chane", h: "@chane_ashea" },
    ]
  },
  { id: "life", label: "Lifestyle", color: ROSE, textColor: BURGUNDY,
    rows: [
      { n: "Sherly Tavarez", h: "@sherlytavarez" },
      { n: "Sherli Garcia", h: "@sherligarcia" },
      { n: "Naimah Terry", h: "@naimahterry" },
      { n: "Gaby Santana", h: "@thegabysantana" },
      { n: "Jasmine Ruiz", h: "@thejasmineruiz" },
      { n: "Brittystylez", h: "@brittystylez" },
      { n: "Maria Ospina", h: "@realestatemaria.ospina" },
      { n: "Nicole Whittaker", h: "@nicolewhittakerr" },
      { n: "Liz Llapa", h: "@lizllapa" },
      { n: "Maleni Cruz", h: "@malenicruz" },
    ]
  },
  { id: "well", label: "Wellness", color: OLIVE, textColor: CREAM,
    rows: [
      { n: "Samantha", h: "@so_manti" },
      { n: "Brooke", h: "@fit.with.brooke" },
      { n: "Sasha Sano", h: "@sasha.sano" },
      { n: "Steph", h: "@stephislive" },
      { n: "Tina La Latina", h: "@tinalalalatina" },
      { n: "Radha Martinez", h: "@theofficialradha" },
    ]
  },
  { id: "beau", label: "Beauty", color: CEMENT, textColor: BURGUNDY,
    rows: [
      { n: "Zaneyy Nails", h: "@zaneyynails" },
      { n: "Skincare Guru", h: "@skincare_guru" },
      { n: "Camara Unique", h: "@camaraaunique" },
      { n: "Black Rose NYC", h: "@iamblackrosenyc" },
      { n: "Uhhhleeuhh", h: "@uhhhleeuhh" },
      { n: "Chrissy GX", h: "@chrissygx33" },
      { n: "Andree Cabal", h: "@andreecabal__" },
    ]
  },
  { id: "male", label: "Male Creator", color: ESPRESSO, textColor: SAND_L,
    rows: [
      { n: "Chris Garces", h: "@thechrisgarces" },
      { n: "Alexander Calle", h: "@alexandercallejr" },
      { n: "Dominick Caro", h: "@dominickcaro_" },
      { n: "Kimmy Sumony", h: "@kimmysumony" },
      { n: "Chicklet HF", h: "@chicklet.hf" },
    ]
  },
  { id: "comm", label: "Community Partner", color: SAND_W, textColor: ESPRESSO,
    rows: [
      { n: "Carla Barla Cakes", h: "@carlabarlacakes", notes: "Vendor/Community" },
    ]
  },
];

const COLS = ["Invited", "Pending", "Confirmed", "Email", "Agreement", "Declined"];

const PRIORITY = [
  "@monetmcmichael","@magz_lechic","@imkarimedina","@holyhippy",
  "@alexisbelon","@youngisblessed","@sherlytavarez","@naimahterry",
  "@sherligarcia","@so_manti","@fit.with.brooke","@thegabysantana",
  "@thejasmineruiz","@zaneyynails","@theofficialradha"
];

const STATUS_KEY = [
  { label: "Invited = DM Sent", color: CEMENT },
  { label: "Pending = Awaiting Response", color: ROSE },
  { label: "Confirmed = Agreed to Attend", color: OLIVE },
  { label: "Email = Email Received", color: GOLD },
  { label: "Agreement = Creator Invitation Sent", color: SAND },
  { label: "Declined = Did Not Accept", color: RED },
];

const SB_HEADERS = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Prefer": "return=representation",
};

async function sbGet(key) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/tracker?key=eq.${encodeURIComponent(key)}&select=value`,
    { headers: SB_HEADERS }
  );
  const data = await res.json();
  return data?.[0]?.value ?? null;
}

async function sbUpsert(key, value) {
  await fetch(`${SUPABASE_URL}/rest/v1/tracker`, {
    method: "POST",
    headers: { ...SB_HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key, value }),
  });
}

const POLL_MS = 4000;

function Divider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, margin:"24px 0" }}>
      <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,rgba(201,169,110,.28),transparent)" }} />
      <div style={{ width:5, height:5, background:GOLD, transform:"rotate(45deg)", opacity:.5 }} />
      <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,rgba(201,169,110,.28),transparent)" }} />
    </div>
  );
}

function Label({ children }) {
  return (
    <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.4em", textTransform:"uppercase", color:GOLD, opacity:.85, marginBottom:13, fontFamily:"sans-serif" }}>
      {children}
    </div>
  );
}

function CheckBox({ checked, onChange, declined }) {
  return (
    <div onClick={onChange} style={{
      display:"inline-flex", alignItems:"center", justifyContent:"center",
      width:16, height:16, cursor:"pointer", borderRadius:2, userSelect:"none",
      border: checked ? `1px solid ${declined ? RED : GOLD}` : "1px solid rgba(201,169,110,0.28)",
      background: checked ? (declined ? "rgba(201,80,80,0.18)" : "rgba(201,169,110,0.14)") : "transparent",
      fontSize:10, color: declined ? RED : GOLD, lineHeight:1, transition:"all .15s",
    }}>
      {checked ? (declined ? "✕" : "✓") : ""}
    </div>
  );
}

export default function App() {
  const [checks, setChecks]       = useState({});
  const [confirmed, setConfirmed] = useState("");
  const [publicTix, setPublicTix] = useState("");
  const [notes, setNotes]         = useState("");
  const [status, setStatus]       = useState("loading");
  const notesTimer = useRef(null);
  const pollTimer  = useRef(null);
  const lastPush   = useRef(0);

  useEffect(() => {
    loadAll();
    return () => { clearTimeout(notesTimer.current); clearInterval(pollTimer.current); };
  }, []);

  async function loadAll() {
    try {
      const [c, n, conf, pub] = await Promise.all([
        sbGet("checks"), sbGet("notes"), sbGet("confirmed"), sbGet("publicTixVal"),
      ]);
      if (c)    setChecks(JSON.parse(c));
      if (n)    setNotes(n);
      if (conf) setConfirmed(conf);
      if (pub)  setPublicTix(pub);
      setStatus("ok");
      startPolling();
    } catch(e) {
      setStatus("error");
    }
  }

  function startPolling() {
    pollTimer.current = setInterval(async () => {
      if (Date.now() - lastPush.current < POLL_MS) return;
      try {
        const [c, n, conf, pub] = await Promise.all([
          sbGet("checks"), sbGet("notes"), sbGet("confirmed"), sbGet("publicTixVal"),
        ]);
        if (c) setChecks(prev => { const next = JSON.parse(c); return JSON.stringify(prev) === JSON.stringify(next) ? prev : next; });
        if (n !== null)    setNotes(n);
        if (conf !== null) setConfirmed(conf);
        if (pub !== null)  setPublicTix(pub);
      } catch(e) {}
    }, POLL_MS);
  }

  const toggle = async (catId, ri, ci) => {
    const k = `${catId}_${ri}_${ci}`;
    const next = { ...checks, [k]: !checks[k] };
    setChecks(next);
    lastPush.current = Date.now();
    await sbUpsert("checks", JSON.stringify(next));
  };

  const handleConfirmed = async (v) => {
    setConfirmed(v);
    lastPush.current = Date.now();
    await sbUpsert("confirmed", v);
  };

  const handlePublic = async (v) => {
    setPublicTix(v);
    lastPush.current = Date.now();
    await sbUpsert("publicTixVal", v);
  };

  const handleNotes = (v) => {
    setNotes(v);
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(async () => {
      lastPush.current = Date.now();
      await sbUpsert("notes", v);
    }, 800);
  };

  return (
    <div style={{ background:BURGUNDY, minHeight:"100vh", fontFamily:"Georgia, serif", color:SAND, padding:"48px 36px 80px" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>

        <div style={{ position:"fixed", top:16, right:20, zIndex:999 }}>
          <div style={{
            fontSize:8, fontFamily:"sans-serif", letterSpacing:"0.2em", textTransform:"uppercase",
            padding:"5px 12px", borderRadius:20,
            background: status==="ok" ? "rgba(123,129,83,0.3)" : status==="error" ? "rgba(201,112,112,0.3)" : "rgba(201,169,110,0.15)",
            border: `1px solid ${status==="ok" ? "rgba(123,129,83,0.5)" : status==="error" ? "rgba(201,112,112,0.5)" : "rgba(201,169,110,0.3)"}`,
            color: status==="ok" ? OLIVE : status==="error" ? RED : GOLD,
          }}>
            {status==="loading" ? "⟳ Connecting..." : status==="ok" ? "● Live Sync On" : "✕ Sync Error"}
          </div>
        </div>

        <div style={{ textAlign:"center", marginBottom:44 }}>
          <div style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:GOLD, opacity:.8, marginBottom:14, fontFamily:"sans-serif" }}>Edition 01 · Master Document</div>
          <div style={{ fontSize:46, fontWeight:300, letterSpacing:"0.08em", color:SAND_L, lineHeight:1 }}>
            <em style={{ fontStyle:"italic", color:GOLD_L }}>Disco</em> &amp; Diaspora
          </div>
          <div style={{ fontSize:16, fontStyle:"italic", color:SAND_W, letterSpacing:"0.1em", margin:"8px 0 6px" }}>Master Guest + Creator Tracker</div>
          <div style={{ fontSize:10, letterSpacing:"0.26em", textTransform:"uppercase", color:CEMENT, opacity:.6, fontFamily:"sans-serif" }}>June 28, 2026 · The Ashford · Jersey City, NJ</div>
        </div>

        <Divider />

        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(201,169,110,.14)", borderRadius:4, padding:"18px 24px", marginBottom:28 }}>
          <Label>Status Key</Label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"7px 20px" }}>
            {STATUS_KEY.map(s => (
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, color:SAND_W, fontFamily:"sans-serif" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:s.color, flexShrink:0 }} />
                {s.label}
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <Label>Event Capacity</Label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:32 }}>
          {[
            { label:"Total Capacity", val:"25", sub:"Max Guests", editable:false },
            { label:"Influencer Tickets", val:"15", sub:"Allocated", editable:false },
            { label:"Confirmed", val:confirmed, sub:"/ 15", editable:true, onChange:handleConfirmed },
            { label:"Public Tickets", val:publicTix, sub:"Released", editable:true, onChange:handlePublic },
          ].map(c => (
            <div key={c.label} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(201,169,110,.14)", borderRadius:4, padding:"16px 12px", textAlign:"center" }}>
              <div style={{ fontSize:8, letterSpacing:"0.26em", textTransform:"uppercase", color:CEMENT, opacity:.6, marginBottom:9, fontFamily:"sans-serif" }}>{c.label}</div>
              {c.editable
                ? <input value={c.val} onChange={e => c.onChange(e.target.value)} placeholder="—" style={{ background:"transparent", border:"none", borderBottom:"1px solid rgba(201,169,110,.22)", fontSize:28, fontWeight:300, color:GOLD_L, textAlign:"center", outline:"none", width:65, fontFamily:"Georgia,serif" }} />
                : <div style={{ fontSize:28, fontWeight:300, color:GOLD_L }}>{c.val}</div>
              }
              <div style={{ fontSize:9, color:CEMENT, opacity:.4, marginTop:3, fontFamily:"sans-serif" }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <Divider />

        <Label>Creator Tracker</Label>
        {CATS.map(cat => (
          <div key={cat.id} style={{ marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0 10px" }}>
              <div style={{ fontSize:8, fontWeight:600, letterSpacing:"0.3em", textTransform:"uppercase", background:cat.color, color:cat.textColor, padding:"4px 11px", borderRadius:2, flexShrink:0, fontFamily:"sans-serif" }}>{cat.label}</div>
              <div style={{ flex:1, height:1, background:"rgba(201,169,110,.1)" }} />
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  {["Name","Handle",...COLS,"Notes"].map(h => (
                    <th key={h} style={{ fontSize:8, fontWeight:600, letterSpacing:"0.26em", textTransform:"uppercase", color:GOLD, opacity:.58, padding:"0 0 9px", textAlign:["Name","Handle","Notes"].includes(h)?"left":"center", borderBottom:"1px solid rgba(201,169,110,.14)", fontFamily:"sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cat.rows.map((r, ri) => (
                  <tr key={ri} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                    <td style={{ fontSize:14, fontWeight:500, color:SAND_L, padding:"9px 8px 9px 0", whiteSpace:"nowrap" }}>{r.n}</td>
                    <td style={{ fontSize:10, color:CEMENT, opacity:.58, paddingRight:12, whiteSpace:"nowrap", fontFamily:"sans-serif" }}>{r.h}</td>
                    {COLS.map((_, ci) => (
                      <td key={ci} style={{ textAlign:"center", padding:"9px 5px" }}>
                        <CheckBox checked={!!checks[`${cat.id}_${ri}_${ci}`]} onChange={() => toggle(cat.id, ri, ci)} declined={ci===COLS.length-1} />
                      </td>
                    ))}
                    <td style={{ fontSize:10, color:ROSE, fontStyle:"italic", opacity:.72, fontFamily:"sans-serif" }}>{r.notes||""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <Divider />

        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(201,169,110,.14)", borderRadius:4, padding:"24px 28px", marginBottom:32 }}>
          <Label>Priority Invite Order</Label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"5px 20px" }}>
            {PRIORITY.map((h, i) => (
              <div key={h} style={{ display:"flex", alignItems:"center", gap:9, padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                <span style={{ fontSize:13, color:GOLD, opacity:.42, minWidth:18 }}>{String(i+1).padStart(2,"0")}</span>
                <span style={{ fontSize:11, color:SAND_W, fontFamily:"sans-serif" }}>{h}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(201,169,110,.14)", borderRadius:4, padding:"24px 28px", marginBottom:32 }}>
          <Label>Notes</Label>
          <textarea value={notes} onChange={e => handleNotes(e.target.value)} placeholder="Add notes here — outreach updates, follow-ups, reminders..."
            style={{ width:"100%", minHeight:140, background:"transparent", border:"none", borderBottom:"1px solid rgba(201,169,110,.18)", color:SAND, fontFamily:"Georgia,serif", fontSize:14, lineHeight:1.7, outline:"none", resize:"vertical", padding:"4px 0" }} />
        </div>

        <div style={{ textAlign:"center", marginTop:40, paddingTop:20, borderTop:"1px solid rgba(201,169,110,.1)" }}>
          <div style={{ fontSize:9, letterSpacing:"0.26em", textTransform:"uppercase", color:CEMENT, opacity:.28, fontFamily:"sans-serif" }}>The Sunday Club · thesundayclubpr.com · Confidential</div>
        </div>

      </div>
    </div>
  );
}
