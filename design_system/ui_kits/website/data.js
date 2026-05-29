/* MIKAGE ZENITH — transmission catalog (subset of MIKAGE_TRACK_CATALOG_DATABASE_V1.csv)

   STATUS → CTA (safe, never invented):
     live  : operator-confirmed live      → LISTEN NOW
     future: unreleased / not live yet     → PRE-SAVE
     uncertain: pending / unverified state → LINK

   TAGLINES: only T05 PORCELAIN ASCENSION carries canon-confirmed copy
   ("A white shell rises from the void." — verbatim from the live-site update spec).
   No other taglines are invented here; missing taglines render as UNCONFIRMED. */
window.MZ_DATA = {
  studio: "Mikage Zenith Studio",
  site: "mikagezenith.com",
  currentNo: "05",
  logoStatus: "UNCONFIRMED",        // no approved logo file — wordmark is draft direction
  wordmarkStatus: "DRAFT",
  tracks: [
    { no:"01", title:"THE LANDAUER PARADOX", lang:"EN", date:"21.05.2026", genre:"Electronic", sub:"Ambient",    status:"live",      line:null, link:"https://too.fm/b46pqy9" },
    { no:"02", title:"DIGITAL ASH",          lang:"EN", date:"22.05.2026", genre:"Electronic", sub:"Industrial", status:"live",      line:null, link:"https://too.fm/n47vjyb" },
    { no:"03", title:"THE BREACH",           lang:"EN", date:"23.05.2026", genre:"Electronic", sub:"Industrial", status:"live",      line:null, link:"https://too.fm/b1mpe0n" },
    { no:"04", title:"SINGULAR HEART",       lang:"EN", date:"24.05.2026", genre:"Electronic", sub:"Ambient",    status:"live",      line:null, link:"https://too.fm/dxbjxl" },
    { no:"05", title:"PORCELAIN ASCENSION",  lang:"EN", date:"25.05.2026", genre:"Rock",       sub:"Alternative",status:"live",      line:"A white shell rises from the void.", canon:true, link:"https://too.fm/ddq2yma" },
    { no:"06", title:"THE THEOREM",          lang:"EN", date:"26.05.2026", genre:"Electronic", sub:"Industrial", status:"live",      line:null, link:"https://too.fm/zbajdz2" },
    { no:"07", title:"THE ROOT ARCHITECT",   lang:"EN", date:"26.05.2026", genre:"Hip-Hop",    sub:"Electronic", status:"live",      line:null, link:"https://too.fm/kap5jm4" },
    { no:"08", title:"GLASS SKIN",           lang:"EN", date:"05.06.2026", genre:"Pop",        sub:"Indie Pop",  status:"future",    line:null, link:"https://too.fm/6ab5ny9" },
    { no:"09", title:"ガラスの肌",            lang:"JP", date:"05.06.2026", genre:"J-Pop",      sub:"Indie Pop",  status:"future",    line:null, link:"https://too.fm/aeabl88" },
    { no:"10", title:"SLOW ORBIT",           lang:"EN", date:"06.06.2026", genre:"R&B",        sub:"Dance",      status:"future",    line:null, link:"https://too.fm/o2wykod" },
    { no:"14", title:"SIGNAL THIEF",         lang:"EN", date:"19.06.2026", genre:"Pop",        sub:"Hip-Hop",    status:"future",    line:null, link:"https://too.fm/dxadgdn" },
    { no:"17", title:"黑雨信號",              lang:"ZH", date:"26.06.2026", genre:"Pop",        sub:"R&B",        status:"future",    line:null, link:"https://too.fm/oyey90b" },
    { no:"26", title:"白瓷夜行",              lang:"ZH", date:"12.07.2026", genre:"Pop",        sub:"Ambient",    status:"future",    line:null, link:"https://too.fm/e52vona" },
    { no:"30", title:"本当の名前",            lang:"JP", date:"24.07.2026", genre:"Pop",        sub:"J-Pop",      status:"uncertain", line:null, link:"#" }
  ]
};

/* Safe status → CTA mapping. Never mixes wording. */
window.MZ_CTA = function (track) {
  if (track.status === "live")      return { label: "Listen now", arrow: true,  primary: true,  dot: true };
  if (track.status === "uncertain") return { label: "Link",       arrow: false, primary: false, dot: false };
  return                                   { label: "Pre-save",   arrow: false, primary: false, dot: false };
};
