import React, { useState, useEffect } from "react";
import { Zap, Eye, Rocket, Search, MapPin, Check, Music, Mic, DollarSign, Star, TrendingUp, Users, Mail, Clipboard, User } from "lucide-react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;700;900&display=swap');

  .meca-root {
    --primary: #c8f064;
    --accent: #a855f7;
    --bg: #080808;
    --card: #0f0f0f;
    --border: rgba(255,255,255,0.08);
    --muted: #888;
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }
  .meca-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .meca-root a { text-decoration: none; color: inherit; }

  .fade-in { animation: fadeIn 0.8s ease both; }
  .fade-in-2 { animation: fadeIn 0.8s 0.2s ease both; }
  .fade-in-3 { animation: fadeIn 0.8s 0.4s ease both; }
  .fade-in-4 { animation: fadeIn 0.8s 0.6s ease both; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .float { animation: floatStudio 5s ease-in-out infinite; }
  .float-2 { animation: floatArtist 6s 1s ease-in-out infinite; }
  @keyframes floatStudio { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-8px) rotate(-4deg)} }
  @keyframes floatArtist { 0%,100%{transform:translateY(0) rotate(5deg)} 50%{transform:translateY(-8px) rotate(4deg)} }
  .float-center { animation: floatC 4s ease-in-out infinite; }
  @keyframes floatC { 0%,100%{transform:translate(-50%,-50%)} 50%{transform:translate(-50%,-46%)} }

  .wrap { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

  /* NAV */
  .meca-nav {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 60;
    background: rgba(8,8,8,0.7); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 1rem 0;
  }
  .meca-nav .inner { display:flex; align-items:center; justify-content:space-between; }
  .nav-logo { display:flex; align-items:center; gap:0.5rem; }
  .nav-logo-text { font-weight:900; font-size:20px; letter-spacing:-0.02em; }
  .nav-links { display:flex; gap:2rem; }
  .nav-links a { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); transition:color 0.2s; }
  .nav-links a:hover { color:var(--primary); }
  .lang-toggle { display:flex; background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .lang-btn { padding:0.4rem 0.75rem; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.2s; border:none; }
  .lang-btn.active { background:var(--primary); color:#000; }
  .lang-btn:not(.active) { background:transparent; color:var(--muted); }

  /* HERO */
  .hero {
    min-height: 90vh;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    align-items: start;
    gap: 3rem;
    padding: 8rem 0 5rem;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .hero-glow { position:absolute; top:10%; right:-10%; width:500px; height:500px; background:radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%); pointer-events:none; z-index:0; }
  .hero-eyebrow { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--primary); margin-bottom:1.25rem; }
  .hero-title { font-family:'DM Serif Display',serif; font-size:clamp(3rem,5.5vw,5.25rem); line-height:1.05; margin-bottom:1.5rem; font-weight:400; }
  .hero-title em { font-style:italic; color:var(--accent); }
  .hero-sub { font-size:20px; color:var(--muted); max-width:520px; line-height:1.75; margin-bottom:2.5rem; }
  .waiting-form { display:flex; gap:0.5rem; max-width:440px; flex-wrap:wrap; }
  .waiting-input { flex:1; min-width:200px; padding:0.95rem 1.1rem; font-family:'DM Sans',sans-serif; font-size:16px; border:1px solid var(--border); border-radius:8px; background:rgba(255,255,255,0.04); color:#fff; outline:none; transition:border-color 0.2s; }
  .waiting-input:focus { border-color:var(--primary); }
  .waiting-input::placeholder { color:var(--muted); }
  .waiting-btn { padding:0.95rem 1.6rem; background:var(--primary); color:#000; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; border:none; border-radius:8px; cursor:pointer; white-space:nowrap; transition:all 0.2s; }
  .waiting-btn:hover { background:#d4f576; transform:translateY(-1px); }
  .waiting-btn.done { background:var(--accent); color:#fff; }
  .form-micro { font-size:14px; color:var(--muted); margin-top:0.6rem; }
  .success-msg { font-size:15px; color:var(--primary); font-weight:600; margin-top:0.75rem; display:none; }
  .success-msg.show { display:block; }

  /* HERO VISUAL */
  .hero-visual { position:relative; height:560px; border-radius:24px; border:1px solid var(--border); background:#050505; overflow:hidden; }
  .hero-visual-glow { position:absolute; inset:0; background:radial-gradient(circle at 50% 50%,rgba(168,85,247,0.08),transparent 70%); }
  .hv-blob1 { position:absolute; top:2rem; right:2rem; width:120px; height:120px; background:var(--primary); opacity:0.15; filter:blur(50px); border-radius:50%; }
  .hv-blob2 { position:absolute; bottom:2rem; left:2rem; width:150px; height:150px; background:var(--accent); opacity:0.15; filter:blur(60px); border-radius:50%; }

  /* FLOATING CARDS */
  .fc-studio { position:absolute; top:6%; left:12px; width:220px; transform:rotate(-5deg); z-index:10; }
  .fc-artist { position:absolute; top:11%; right:12px; width:205px; transform:rotate(5deg); z-index:10; }
  .fc-gig { position:absolute; top:58%; left:50%; transform:translate(-50%,-50%); width:270px; z-index:20; }
  .card-dark { background:#111; border-radius:16px; border:1px solid #333; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.5); }
  .card-img { height:90px; background:#1a1a1a; overflow:hidden; position:relative; }
  .card-img img { width:100%; height:100%; object-fit:cover; opacity:0.8; }
  .card-badge { position:absolute; top:6px; right:6px; background:#f59e0b; color:#000; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; }
  .card-price { position:absolute; bottom:6px; left:6px; background:var(--accent); color:#fff; font-size:10px; font-weight:700; padding:2px 8px; border-radius:4px; }
  .card-body { padding:12px; }
  .card-title { font-weight:700; color:#fff; font-size:13px; }
  .card-sub { font-size:10px; color:var(--muted); margin-bottom:8px; }
  .card-tags { display:flex; gap:4px; flex-wrap:wrap; }
  .card-tag { font-size:9px; border:1px solid #333; color:#aaa; padding:2px 6px; border-radius:4px; }

  .gig-header { background:#1a1a1a; padding:10px 14px; border-bottom:1px solid #222; display:flex; justify-content:space-between; align-items:center; }
  .gig-dot { width:8px; height:8px; background:#ef4444; border-radius:50%; animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .gig-match { font-size:10px; font-weight:700; background:rgba(59,130,246,0.2); color:#60a5fa; padding:2px 8px; border-radius:4px; }
  .gig-body { padding:14px; }
  .gig-row { display:flex; gap:10px; margin-bottom:12px; }
  .gig-thumb { width:44px; height:44px; border-radius:8px; background:#1a1a1a; overflow:hidden; flex-shrink:0; }
  .gig-thumb-placeholder { width:100%; height:100%; background:linear-gradient(135deg,#222,#333); }
  .gig-name { font-weight:700; color:#fff; font-size:13px; line-height:1.3; }
  .gig-band { font-size:11px; color:var(--accent); }
  .gig-meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
  .gig-price { font-size:12px; font-weight:700; color:var(--primary); }
  .gig-loc { font-size:11px; color:var(--muted); }
  .gig-btn { width:100%; background:#fff; color:#000; font-weight:700; font-size:12px; padding:10px; border-radius:10px; border:none; cursor:pointer; }

  .artist-body { padding:14px; text-align:center; }
  .artist-avatar { width:52px; height:52px; border-radius:50%; border:2px solid var(--primary); margin:0 auto 8px; overflow:hidden; background:#222; }
  .artist-avatar-ph { width:100%; height:100%; background:linear-gradient(135deg,#333,#444); }
  .artist-name { font-weight:700; color:#fff; font-size:13px; }
  .artist-role { font-size:11px; color:var(--accent); margin-bottom:10px; }
  .artist-stats { display:flex; justify-content:space-around; border-top:1px solid #222; padding-top:10px; margin-bottom:10px; }
  .artist-stat-val { font-weight:700; font-size:13px; color:#fff; }
  .artist-stat-val.green { color:var(--primary); }
  .artist-stat-lbl { font-size:9px; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em; }
  .artist-jam-btn { width:100%; background:var(--accent); color:#fff; font-size:10px; font-weight:700; padding:8px; border-radius:8px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px; }

  /* STATS */
  .stats-row { display:grid; grid-template-columns:repeat(3,1fr); border-bottom:1px solid var(--border); }
  .stat-cell { padding:2rem 0; }
  .stat-cell:not(:last-child) { border-right:1px solid var(--border); padding-right:2rem; }
  .stat-cell:not(:first-child) { padding-left:2rem; }
  .stat-num { font-family:'DM Serif Display',serif; font-size:3rem; color:#fff; line-height:1; margin-bottom:0.4rem; }
  .stat-lbl { font-size:14px; color:var(--muted); line-height:1.4; }

  /* SECTIONS */
  .section { padding:4rem 0; border-bottom:1px solid var(--border); }
  .section-eyebrow { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--primary); margin-bottom:1rem; }
  .section-eyebrow.purple { color:var(--accent); }
  .section-title { font-family:'DM Serif Display',serif; font-size:clamp(2.5rem,4.5vw,4rem); line-height:1.05; margin-bottom:1rem; font-weight:400; }

  /* VISION */
  .vision-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:2.5rem; }
  .vision-card { background:var(--card); border:1px solid var(--border); padding:2.5rem; border-radius:24px; transition:all 0.3s; }
  .vision-card:hover { border-color:var(--accent); transform:translateY(-4px); }
  .vision-icon { width:36px; height:36px; color:var(--primary); margin-bottom:1.5rem; }
  .vision-h { font-size:22px; font-weight:700; color:#fff; margin-bottom:0.75rem; }
  .vision-p { font-size:17px; color:var(--muted); line-height:1.7; }

  /* HOW IT WORKS */
  .how-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; margin-top:3rem; }
  .how-col-title { display:flex; align-items:center; gap:1rem; margin-bottom:2.5rem; }
  .how-icon-wrap { padding:0.75rem; border-radius:14px; }
  .how-icon-wrap.green { background:rgba(200,240,100,0.1); }
  .how-icon-wrap.purple { background:rgba(168,85,247,0.1); }
  .how-col-h { font-size:22px; font-weight:700; color:#fff; }
  .steps { display:flex; flex-direction:column; gap:2.5rem; position:relative; }
  .steps::before { content:''; position:absolute; left:18px; top:4px; bottom:4px; width:2px; background:linear-gradient(to bottom,var(--primary),transparent); }
  .step-row { display:flex; gap:1rem; align-items:flex-start; position:relative; }
  .step-num { width:38px; height:38px; border-radius:50%; border:2px solid var(--primary); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:900; color:var(--primary); flex-shrink:0; background:#080808; z-index:1; transition:transform 0.2s; }
  .step-row:hover .step-num { transform:scale(1.1); }
  .steps.purple::before { background:linear-gradient(to bottom,var(--accent),transparent); }
  .steps.purple .step-num { border-color:var(--accent); color:var(--accent); }
  .step-h { font-size:19px; font-weight:700; color:#fff; margin-bottom:0.4rem; }
  .step-p { font-size:16px; color:var(--muted); line-height:1.65; }

  /* AUDIENCES */
  .audience-cards { display:flex; flex-direction:column; gap:1.5rem; margin-top:3rem; }
  .audience-card { background:linear-gradient(135deg,#111,#060606); border:1px solid var(--border); padding:3rem 3rem 3rem 3.5rem; border-radius:28px; position:relative; overflow:hidden; transition:border-color 0.3s; }
  .audience-card:hover { border-color:rgba(200,240,100,0.3); }
  .audience-stripe { position:absolute; top:0; left:0; width:4px; height:100%; }
  .audience-stripe.green { background:var(--primary); }
  .audience-stripe.purple { background:var(--accent); }
  .audience-eyebrow { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--primary); margin-bottom:0.75rem; }
  .audience-eyebrow.purple { color:var(--accent); }
  .audience-h { font-size:2.25rem; font-weight:700; color:#fff; margin-bottom:0.5rem; }
  .audience-sub { font-size:18px; color:var(--muted); margin-bottom:1.5rem; }
  .audience-list { display:flex; flex-direction:column; gap:0.75rem; }
  .audience-item { font-size:17px; color:var(--muted); padding-left:1.5rem; position:relative; line-height:1.6; }
  .audience-item::before { content:'→'; position:absolute; left:0; color:var(--primary); font-weight:700; }
  .audience-item.purple::before { color:var(--accent); }
  .audience-item strong { color:#fff; }

  /* INTERSTITIAL */
  .interstitial { padding:5rem 0; text-align:center; }
  .interstitial h2 { font-family:'DM Serif Display',serif; font-size:clamp(2.5rem,5.5vw,4.5rem); line-height:1.1; font-weight:400; }

  /* MOCKUPS */
  .mockups-wrap { padding:3rem 0 4rem; position:relative; }
  .mockups-glow { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; height:400px; background:var(--accent); opacity:0.06; filter:blur(100px); border-radius:50%; pointer-events:none; }
  .mockups-row { display:flex; justify-content:center; gap:3rem; flex-wrap:wrap; }
  .mockup-phone { width:300px; background:var(--card); border-radius:28px; border:1px solid #333; overflow:hidden; box-shadow:0 30px 60px rgba(0,0,0,0.6); }
  .mockup-phone.tilt-l { transform:rotate(-4deg); }
  .mockup-phone.tilt-r { transform:rotate(4deg); }
  .mockup-header { padding:1rem; border-bottom:1px solid #222; }
  .mockup-search { background:#1a1a1a; border-radius:999px; padding:0.5rem 1rem; display:flex; align-items:center; gap:0.5rem; color:var(--muted); font-size:13px; margin-bottom:0.75rem; }
  .mockup-tabs { display:flex; gap:0.5rem; overflow-x:auto; }
  .mockup-tab { padding:0.35rem 0.75rem; border-radius:999px; font-size:11px; font-weight:700; white-space:nowrap; }
  .mockup-tab.active { background:#fff; color:#000; }
  .mockup-tab:not(.active) { background:#1a1a1a; color:var(--muted); }
  .mockup-body { padding:1rem; }
  .mockup-card { background:#161616; border-radius:16px; border:1px solid #222; padding:1rem; }

  /* SCREENSHOT PLACEHOLDER */
  .screenshot-placeholder { width:100%; aspect-ratio:9/16; background:linear-gradient(135deg,#111 0%,#1a1a1a 50%,#111 100%); border-radius:16px; border:1px dashed #333; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem; color:#444; }
  .screenshot-placeholder span { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; text-align:center; max-width:140px; line-height:1.4; }
  .screenshot-icon { width:32px; height:32px; opacity:0.4; }

  /* SCREEN WRAPPERS */
  .custom-screen {
    height: 520px;
    background: #070707;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    scrollbar-width: none;
  }
  .custom-screen::-webkit-scrollbar {
    display: none;
  }

  /* FIXED BOTTOM NAVIGATION BAR */
  .custom-bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 52px;
    background: #0d0d0d;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 4px;
    z-index: 40;
  }
  .custom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    color: #4b5563; /* grey */
    font-size: 8px;
    font-weight: 700;
    cursor: pointer;
    flex: 1;
  }
  .custom-nav-item.active {
    color: #ffffff;
  }
  .custom-nav-badge {
    position: relative;
  }
  .custom-nav-badge::after {
    content: '';
    position: absolute;
    top: -1px;
    right: -2px;
    width: 5px;
    height: 5px;
    background: #ef4444;
    border-radius: 50%;
  }

  /* DISCOVER FEED SCREEN STYLES */
  .disc-top-bar {
    position: sticky;
    top: 0;
    background: #000;
    padding: 8px 8px 4px;
    z-index: 30;
    border-bottom: 1px solid rgba(255,255,255,0.02);
  }
  .disc-search-input {
    background: #121212;
    border-radius: 999px;
    padding: 4px 10px;
    color: #888;
    font-size: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .disc-header-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .disc-tab-btn {
    font-size: 10px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 999px;
    color: #6b7280;
    cursor: pointer;
    background: transparent;
  }
  .disc-tab-btn.active {
    background: #1d4ed8; /* Blue pill */
    color: #fff;
  }
  .disc-top-lightning {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #f59e0b;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    font-weight: 900;
    font-size: 11px;
  }
  .disc-filter-row {
    padding: 4px 8px;
    display: flex;
    background: #000;
  }
  .disc-filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #111;
    border: 1px solid #222;
    border-radius: 6px;
    padding: 3px 6px;
    color: #bbb;
    font-size: 9px;
    font-weight: 700;
  }
  .disc-scroll-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px 8px 60px; /* offset bottom nav */
  }
  .disc-card {
    background: #0e0e0e;
    border: 1px solid #1a1a1a;
    border-radius: 14px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
  }
  .disc-card-header {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .disc-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #333;
  }
  .disc-user-info {
    display: flex;
    flex-direction: column;
  }
  .disc-name-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .disc-name {
    font-weight: 800;
    font-size: 12px;
    color: #fff;
  }
  .disc-badge-vocals {
    background: #ea580c; /* Orange Vocals */
    color: #fff;
    font-size: 7.5px;
    font-weight: 800;
    padding: 1px 4px;
    border-radius: 3px;
    text-transform: uppercase;
  }
  .disc-badge-guitar {
    background: #ca8a04; /* Yellow guitar */
    color: #fff;
    font-size: 7.5px;
    font-weight: 800;
    padding: 1px 4px;
    border-radius: 3px;
    text-transform: uppercase;
  }
  .disc-label-expert {
    font-size: 8px;
    color: #888;
    font-weight: 600;
  }
  .disc-tags-row {
    display: flex;
    gap: 4px;
    margin-top: 1px;
  }
  .disc-tag-blue {
    background: rgba(30,58,138,0.4);
    border: 1px solid rgba(59,130,246,0.2);
    color: #93c5fd;
    font-size: 8px;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
  }
  .disc-loc-row {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 9px;
    color: #9ca3af;
  }
  .disc-photos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  .disc-photo-wrapper {
    position: relative;
    width: 100%;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
  }
  .disc-photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .disc-photo-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    padding: 3px 4px;
    font-size: 7.5px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .disc-jam-btn-bar {
    background: #18181b;
    color: #f4f4f5;
    font-weight: 850;
    font-size: 8.5px;
    padding: 5px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border: 1px solid rgba(255,255,255,0.03);
  }

  /* BOARD FEED SCREEN STYLES (Screenshot 1 replica) */
  .board-v2-header-container {
    position: sticky;
    top: 0;
    background: #000;
    z-index: 30;
    border-bottom: 1px solid #141414;
  }
  .board-v2-tabs {
    display: flex;
    justify-content: space-around;
    padding-top: 6px;
  }
  .board-v2-tab {
    font-size: 10px;
    font-weight: 800;
    color: #6b7280;
    padding-bottom: 4px;
    position: relative;
    cursor: pointer;
  }
  .board-v2-tab.active {
    color: #fff;
  }
  .board-v2-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #fff;
  }
  .board-v2-tab-dot {
    width: 4px;
    height: 4px;
    background: #ef4444;
    border-radius: 50%;
    display: inline-block;
    vertical-align: top;
    margin-left: 2px;
  }
  .board-v2-switcher {
    display: flex;
    background: #111111;
    border-radius: 8px;
    padding: 2px;
    margin: 6px 6px 4px;
  }
  .board-v2-switch-btn {
    flex: 1;
    font-size: 9.5px;
    font-weight: 850;
    padding: 5px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #ef4444;
  }
  .board-v2-switch-btn.active {
    background: #ea580c; /* reddish orange background */
    color: #fff;
  }
  .board-v2-switch-btn.inactive {
    background: transparent;
    color: #6b7280;
  }
  .board-v2-filter-row {
    padding: 0 6px 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .board-v2-filter-group {
    display: flex;
    gap: 4px;
  }
  .board-v2-pill {
    padding: 2px 6px;
    border-radius: 999px;
    font-size: 8.5px;
    font-weight: 800;
    color: #6b7280;
    background: transparent;
  }
  .board-v2-pill.active {
    border: 1px solid #ca8a04;
    color: #fff;
  }
  .board-v2-loc-btn {
    border: 1px solid #1f1f1f;
    border-radius: 6px;
    padding: 2px 5px;
    background: transparent;
    color: #aaa;
    font-size: 8.5px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .board-v2-card-reqs {
    background: #070707;
    border-radius: 6px;
    border: 1px solid #141414;
    padding: 5px 6px;
  }
  .board-v2-card-reqs-lbl {
    font-size: 7.5px;
    font-weight: 800;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 2px;
  }
  .board-v2-card-reqs-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .board-v2-card-req-item {
    font-size: 8.5px;
    color: #ccc;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
  }
  .board-v2-card-req-item span {
    color: #ef4444;
    font-weight: 950;
  }
  .board-v2-logo-p {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 950;
    color: #1d4ed8; /* Blue 'M' logo */
    border: 1px solid #ddd;
    flex-shrink: 0;
  }
  .board-v2-card-header-col {
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .board-v2-card-p {
    background: #101010;
    border: 1px solid #1d1d1d;
    border-radius: 12px;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .board-v2-card-title-p {
    color: #fff;
    font-weight: 800;
    font-size: 11px;
    line-height: 1.25;
  }
  .board-v2-card-sub-p {
    font-size: 8.5px;
    font-weight: 800;
    color: #f97316;
  }
  .board-v2-card-tags {
    display: flex;
    gap: 3px;
    flex-wrap: wrap;
  }
  .board-v2-card-tag {
    background: #050505;
    border: 1px solid #1a1a1a;
    color: #9cb3c9;
    font-size: 8px;
    font-weight: 700;
    padding: 1px 3px;
    border-radius: 3px;
  }
  .board-v2-card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8px;
    margin-top: 1px;
  }
  .board-v2-meta-p-price {
    color: #c8f064; /* light green primary */
    font-weight: 800;
  }
  .board-v2-meta-p-loc {
    color: #9ca3af;
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .board-v2-meta-p-expired {
    color: #f87171;
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .board-v2-card-actions {
    display: flex;
    gap: 4px;
    margin-top: 2px;
  }
  .board-v2-card-btn-grey {
    flex: 1;
    background: #18181b;
    border: 1px solid #27272a;
    color: #d4d4d8;
    font-weight: 850;
    font-size: 8px;
    padding: 4px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
  }
  .board-v2-card-btn-white {
    flex: 1;
    background: #fff;
    color: #000;
    font-weight: 850;
    font-size: 8px;
    padding: 4px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
  }
  .board-v2-card-btn-outline {
    flex: 1;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    font-weight: 850;
    font-size: 8px;
    padding: 4px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
  }
  .board-v2-floating-create {
    position: absolute;
    bottom: 60px;
    right: 8px;
    background: #000;
    border: 1.5px solid rgba(255,255,255,0.18);
    border-radius: 999px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 3px;
    color: #fff;
    font-size: 8.5px;
    font-weight: 800;
    box-shadow: 0 4px 12px rgba(0,0,0,0.6);
    z-index: 35;
  }

  /* COMPETITION */
  .comp-table { width:100%; border-collapse:collapse; border:1px solid rgba(255,255,255,0.05); border-radius:16px; overflow:hidden; margin-top:2rem; }
  .comp-table thead tr { background:rgba(255,255,255,0.02); }
  .comp-table th { padding:1.25rem 1.5rem; text-align:left; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; color:var(--accent); border-bottom:1px solid rgba(255,255,255,0.05); }
  .comp-table td { padding:1.25rem 1.5rem; font-size:15px; border-bottom:1px solid rgba(255,255,255,0.04); }
  .comp-table tbody tr:last-child td { border-bottom:none; }
  .comp-table tbody tr:hover { background:rgba(255,255,255,0.02); }
  .comp-meca { font-weight:700; color:var(--primary); }
  .comp-other { color:var(--muted); }
  .comp-feat { font-weight:700; color:#aaa; }

  /* MARKET */
  .market-grid { display:grid; grid-template-columns:2fr 1fr; grid-template-rows:1fr 1fr; gap:1rem; height:520px; margin-top:3rem; }
  .market-main { grid-row:span 2; background:linear-gradient(135deg,#111,#060606); border:1px solid rgba(255,255,255,0.05); border-radius:28px; padding:2.5rem; display:flex; flex-direction:column; justify-content:space-between; transition:border-color 0.3s; }
  .market-main:hover { border-color:rgba(168,85,247,0.3); }
  .market-big-num { font-family:'DM Serif Display',serif; font-size:7rem; color:var(--accent); line-height:1; margin-bottom:1rem; }
  .market-main-h { font-size:1.75rem; font-weight:700; color:#fff; margin-bottom:0.75rem; }
  .market-main-p { font-size:17px; color:var(--muted); line-height:1.7; }
  .market-pills { display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:1.5rem; }
  .market-pill { padding:0.35rem 1rem; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.05); border-radius:999px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#666; }
  .market-sub { background:#0a0a0a; border:1px solid rgba(255,255,255,0.05); border-radius:28px; padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.3s; }
  .market-sub:hover { background:#111; }
  .market-sub-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:0.75rem; }
  .market-sub-icon.green { background:rgba(200,240,100,0.1); color:var(--primary); }
  .market-sub-icon.purple { background:rgba(168,85,247,0.1); color:var(--accent); }
  .market-sub-eyebrow { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:0.5rem; }
  .market-sub-eyebrow.green { color:var(--primary); }
  .market-sub-eyebrow.purple { color:var(--accent); }
  .market-sub-h { font-size:17px; font-weight:700; color:#fff; margin-bottom:0.4rem; line-height:1.3; }
  .market-sub-p { font-size:14px; color:var(--muted); line-height:1.6; }

  /* STUDIO IMAGE */
  .studio-img-wrap { margin:3rem 0; border-radius:28px; overflow:hidden; border:1px solid var(--border); height:320px; position:relative; }
  .studio-img-wrap img { width:100%; height:100%; object-fit:cover; opacity:0.55; transition:transform 0.6s; }
  .studio-img-wrap:hover img { transform:scale(1.03); }
  .studio-badge { position:absolute; bottom:1.5rem; right:1.5rem; background:var(--bg); border:1px solid var(--primary); color:var(--primary); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; padding:0.4rem 1rem; border-radius:8px; }

  /* BOTTOM CTA */
  .bottom-cta { padding:4rem 0 5rem; }
  .bottom-cta-inner { background:var(--accent); border-radius:40px; padding:4rem 3rem; text-align:center; position:relative; overflow:hidden; }
  .bottom-cta-glow { position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(circle,rgba(200,240,100,0.15) 0%,transparent 50%); pointer-events:none; }
  .bottom-cta-h { font-family:'DM Serif Display',serif; font-size:clamp(2.5rem,4.5vw,4rem); margin-bottom:1rem; position:relative; z-index:1; font-weight:400; }
  .bottom-cta-p { font-size:18px; opacity:0.9; margin-bottom:2.5rem; position:relative; z-index:1; max-width:520px; margin-left:auto; margin-right:auto; }
  .bottom-form { display:flex; gap:0.5rem; max-width:420px; margin:0 auto 1.5rem; flex-wrap:wrap; position:relative; z-index:1; }
  .bottom-input { flex:1; min-width:200px; padding:0.95rem 1.1rem; font-size:16px; border:none; border-radius:8px; background:rgba(0,0,0,0.3); color:#fff; outline:none; }
  .bottom-input::placeholder { color:rgba(255,255,255,0.5); }
  .bottom-btn { padding:0.95rem 1.6rem; background:#000; color:#fff; font-size:15px; font-weight:700; border:none; border-radius:8px; cursor:pointer; white-space:nowrap; transition:all 0.2s; }
  .bottom-btn:hover { background:#111; transform:translateY(-1px); }
  .bottom-btn.done { background:var(--primary); color:#000; }
  .bottom-micro { font-size:14px; opacity:0.7; position:relative; z-index:1; }
  .bottom-success { font-size:15px; font-weight:600; color:var(--primary); margin-top:0.5rem; display:none; position:relative; z-index:1; }
  .bottom-success.show { display:block; }
  .cta-email { display:inline-block; margin-top:2rem; font-weight:700; font-size:17px; border-bottom:2px solid var(--primary); padding-bottom:2px; position:relative; z-index:1; color:#fff; }

  /* STICKY */
  .sticky-bar { position:fixed; bottom:1.25rem; left:50%; transform:translateX(-50%); background:rgba(8,8,8,0.85); backdrop-filter:blur(16px); border:1px solid var(--accent); border-radius:999px; padding:0.75rem 1.25rem; display:flex; align-items:center; gap:1rem; z-index:50; box-shadow:0 20px 40px rgba(0,0,0,0.4); }
  .sticky-label { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--primary); white-space:nowrap; }
  .sticky-form { display:flex; gap:0.5rem; }
  .sticky-input { padding:0.55rem 0.85rem; font-size:13px; border:1px solid var(--border); border-radius:999px; background:rgba(255,255,255,0.05); color:#fff; outline:none; width:180px; }
  .sticky-input::placeholder { color:var(--muted); }
  .sticky-btn { padding:0.55rem 1.1rem; background:var(--primary); color:#000; font-size:13px; font-weight:700; border:none; border-radius:999px; cursor:pointer; white-space:nowrap; transition:all 0.2s; }
  .sticky-btn:hover { background:#d4f576; }
  .sticky-btn.done { background:var(--accent); color:#fff; }

  /* FOOTER NAV */
  .footer-bar { padding:1.5rem 0; display:flex; justify-content:space-between; align-items:center; }
  .footer-logo { font-family:'DM Serif Display',serif; font-size:20px; }
  .footer-tag { font-size:14px; color:var(--muted); }

  @media (max-width:768px) {
    .hero { grid-template-columns:1fr; padding:7rem 0 3rem; }
    .hero-visual { display:none; }
    .stats-row { grid-template-columns:1fr; }
    .stat-cell { border-right:none !important; padding-left:0 !important; padding-right:0 !important; border-bottom:1px solid var(--border); }
    .stat-cell:last-child { border-bottom:none; }
    .vision-grid { grid-template-columns:1fr; }
    .how-grid { grid-template-columns:1fr; gap:2.5rem; }
    .market-grid { grid-template-columns:1fr; height:auto; }
    .market-main { grid-row:span 1; }
    .market-big-num { font-size:4rem; }
    .mockups-row { flex-direction:column; align-items:center; }
    .mockup-phone { transform:none !important; }
    .nav-links { display:none; }
    .sticky-label { display:none; }
    .sticky-input { width:140px; }
    .bottom-cta-inner { padding:2.5rem 1.5rem; }
  }

  /* EXTENDED WAITLIST */
  .wl-card {
    background: rgba(15,15,15,0.6);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    width: 100%;
    max-width: 440px;
    margin: 1rem auto 0;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    text-align: left;
    position: relative;
    overflow: hidden;
  }
  .wl-field-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    text-align: left;
  }
  .wl-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #aaa;
  }
  .wl-select {
    padding: 0.85rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: rgba(0,0,0,0.5);
    color: #fff;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23888888' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    width: 100%;
  }
  .wl-select:focus {
    border-color: var(--primary);
  }
  
  /* VIP TICKET */
  .vip-ticket {
    background: linear-gradient(135deg, #111111 0%, #070707 100%);
    border: 2px solid var(--primary);
    border-radius: 18px;
    padding: 1.75rem;
    position: relative;
    box-shadow: 0 15px 35px rgba(200,240,100,0.1);
    color: #fff;
    margin: 1rem auto 0;
    max-width: 440px;
    overflow: hidden;
    animation: ticketGlow 4s infinite alternate;
  }
  @keyframes ticketGlow {
    0% { box-shadow: 0 5px 20px rgba(200,240,100,0.05); border-color: var(--primary); }
    100% { box-shadow: 0 15px 35px rgba(168,85,247,0.15); border-color: var(--accent); }
  }
  .ticket-notch-l, .ticket-notch-r {
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    background: #080808;
    border-radius: 50%;
    z-index: 5;
  }
  .ticket-notch-l { left: -11px; border-right: 2px solid var(--primary); }
  .ticket-notch-r { right: -11px; border-left: 2px solid var(--primary); }
  
  .ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed rgba(255,255,255,0.12);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
  .ticket-logo {
    font-weight: 900;
    font-size: 16px;
    letter-spacing: 0.1em;
    color: #fff;
  }
  .ticket-badge {
    background: var(--primary);
    color: #000;
    font-size: 9px;
    font-weight: 900;
    padding: 2px 8px;
    border-radius: 100px;
  }
  .ticket-spot-label {
    text-align: center;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
  }
  .ticket-spot-num {
    text-align: center;
    font-family: 'DM Serif Display', serif;
    font-size: 3.5rem;
    line-height: 1.1;
    color: #fff;
    margin: 0.25rem 0 0.5rem;
  }
  .ticket-info-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 0.5rem;
  }
  .ticket-info-lbl { color: var(--muted); }
  .ticket-info-val { font-weight: 700; color: #fff; }
  
  .ticket-share-box {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.75rem;
    margin-top: 1rem;
    text-align: left;
  }
  .ticket-share-link {
    font-size: 11px;
    color: var(--primary);
    word-break: break-all;
    font-family: monospace;
    background: rgba(0,0,0,0.3);
    padding: 4px 6px;
    border-radius: 4px;
    display: block;
    margin-top: 4px;
  }
  .ticket-action-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
    margin-top: 0.75rem;
  }
  .ticket-action-btn.primary {
    background: var(--primary);
    color: #000;
  }
  .ticket-action-btn.primary:hover {
    background: #d4f576;
  }
  .ticket-action-btn.outline {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--muted);
  }
  .ticket-action-btn.outline:hover {
    color: #fff;
    border-color: #555;
  }
  
  .activity-feed {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    text-align: left;
  }
  .activity-item {
    font-size: 11px;
    color: #777;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .activity-dot {
    width: 4px;
    height: 4px;
    background: var(--primary);
    border-radius: 50%;
  }

  /* HERO REDIRECT MODULE */
  .hero-priority-container {
    background: rgba(15,15,15,0.6);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
    max-width: 420px;
    margin-top: 1.5rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .hero-priority-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--primary);
  }
  .hero-priority-dot {
    animation: heropulse 2s infinite;
    display: inline-block;
  }
  @keyframes heropulse {
    0% { opacity: 0.4; transform: scale(0.9); }
    50% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 0.4; transform: scale(0.9); }
  }
  .hero-priority-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--primary);
    color: #000;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
  .hero-priority-btn:hover {
    background: #d4f576;
    transform: translateY(-1px);
  }
}
`;

const translations = {
  pt: {
    eyebrow: "A plataforma profissional da música",
    h1a: "Músicos sem palco.",
    h1b: "Estúdios com salas vazias.",
    h1c: "Já não tem de ser assim.",
    sub: "Liga músicos, estúdios e venues — com descoberta por localização e disponibilidade real. Não por grupos de Facebook nem por contactos que já conheces.",
    placeholder: "O teu email",
    cta: "Quero entrar →",
    done: "✓ Estás na lista",
    micro: "Só te contactamos quando abrirmos. Sem spam.",
    success: "✓ Perfeito. Serás dos primeiros a saber.",
    stat1n: "18K+", stat1l: "músicos profissionais só em Lisboa",
    stat2n: "124", stat2l: "estúdios de gravação em Lisboa",
    stat3n: "113+", stat3l: "venues de música ao vivo",
    visionEye: "Propósito", visionTitle: "Visão & Missão",
    v1h: "A Nossa Visão", v1p: "Tornar-se a plataforma de referência global onde estúdios, venues e talento se encontram de forma orgânica e profissional.",
    v2h: "A Nossa Missão", v2p: "Empoderar músicos independentes através de ferramentas de descoberta, colaboração sem fricção e capacidades de reserva integradas.",
    howEye: "Processo", howTitle: "Como Funciona", howSub: "Fluxos simplificados para que te possas focar no que importa: a música.",
    howArtists: "Para Artistas", howBiz: "Para Negócios",
    a1t: "Cria o teu Perfil", a1p: "Define instrumentos, géneros e raio de atuação. Se tens uma Banda, cria um perfil coletivo.",
    a2t: "Descoberta", a2p: "Entra no Flash Mode para encontrar o músico ideal ou para ficares no radar de promotores e estúdios locais.",
    a3t: "Garante Concertos", a3p: "Candidata-te a gigs no The Board, fecha tours ou recebe convites diretos para sessões profissionais.",
    b1t: "Lista o teu Espaço", b1p: "Define tarifas, horários e equipamentos. Torna o teu estúdio ou venue visível para milhares de artistas.",
    b2t: "Gestão de Booking", b2p: "Centraliza candidaturas. Filtra artistas por género, nível técnico e disponibilidade.",
    b3t: "Otimiza a Agenda", b3p: "Preenche slots vazios com promoções direcionadas e elimina as horas ociosas no teu calendário.",
    audEye: "Públicos-Alvo", audTitle: "O Teu Ecossistema",
    aud1eye: "Para Quem Cria", aud1h: "Músicos & Artistas", aud1sub: "A MECA é o espaço onde talento encontra oportunidades.",
    aud1i1: "Exposição Direta:", aud1i1d: "Alcança fãs e profissionais e coloca a tua performance à frente de quem decide.",
    aud1i2: "O Match Perfeito:", aud1i2d: "Recruta o integrante ideal ou junta-te a novos projetos, com filtros de nível técnico.",
    aud1i3: "Controlo Total:", aud1i3d: "Garante ensaios, sessões de gravação e concertos instantaneamente. Sem chamadas, sem demoras.",
    aud2eye: "Para Quem Providencia", aud2h: "Estúdios & Venues", aud2sub: "Maximiza a rentabilidade do teu espaço e profissionaliza o teu booking.",
    aud2i1: "Rentabilidade Inteligente:", aud2i1d: "Acaba com o tempo ocioso. Usa o Board para converter slots vazios em faturação imediata.",
    aud2i2: "Curadoria Simplificada:", aud2i2d: "Diz adeus ao caos das DMs. Centraliza candidaturas e fecha o teu cartaz com segurança.",
    aud2i3: "Radar de Talento:", aud2i3d: "Sê o primeiro a descobrir artistas que estão a mover a cena local.",
    intTitle: "A MECA é a casa das ", intA1: "colaborações", intMid: ", dos ", intA2: "palcos", intMid2: " e das ", intA3: "novas possibilidades", intEnd: ".",
    mockTab1: "Artistas", mockTab2: "Bandas", mockTab3: "Estúdios",
    mockSearch: "Procura um baixista, vocalista...",
    mockSS1: "Coloca aqui a tua screenshot do Flash Mode",
    mockSS2: "Coloca aqui a tua screenshot do Board",
    compEye: "Panorama Competitivo", compTitle: "Diferenciação MECA",
    compF: "Funcionalidade", compMECA: "MECA", compV: "Vampr", compB: "BandMix",
    cf1: "Swipe Discovery (Flash Mode)", cf2: "Booking de Estúdio/Ensaios", cf3: "Gigs & Live Performance", cf4: "Match Score Engine", cf5: "Perfis de Negócio (Estúdio/Venue)",
    mktEye: "Mercado", mktTitle: "Escala Global",
    mktSub: "O mercado musical está a mudar. A MECA posiciona-se no centro desta transformação.",
    mktBigN: "100+", mktBigH: "Hub de Lisboa", mktBigP: "Lisboa consolida-se como capital criativa. Com mais de 100 espaços ativos, 75% da receita musical em Portugal provém do ecossistema ao vivo.",
    mktP1: "+15% Crescimento YoY", mktP2: "Cluster Marvila/Beato",
    mkt1eye: "Estúdios", mkt1h: "Maximize a ocupação.", mkt1p: "Converte slots vazios em faturação. O Board liga o teu calendário diretamente a músicos prontos a reservar.",
    mkt2eye: "Venues", mkt2h: "Simplifica a curadoria.", mkt2p: "Centraliza candidaturas de bandas e mantém a programação sempre ativa com a nossa rede local.",
    studioBadge: "INFRAESTRUTURA VERIFICADA",
    bottomH: "Entra na lista de espera.", bottomP: "A MECA lança em Lisboa em breve. Os primeiros a entrar têm acesso antecipado e condições especiais de founding member.",
    bottomMicro: "Só te contactamos quando abrirmos. Sem spam.",
    bottomSuccess: "✓ Estás na lista. Até breve.",
    stickyLabel: "Lançamento em breve",
    navVision: "Visão", navHow: "Como Funciona", navAud: "Vantagens",
    footerTag: "Connect. Play. Get Paid.",
    gigTitle: "Guitarrista Procurado para Digressão",
    gigBand: "The Night Owls",
    gigApply: "Rever e Candidatar",
    gigMatch: "98% COMPATÍVEL",
    gigReq1: "Equipamento profissional",
    gigReq2: "Experiência em digressão",
    gigReq3: "Audição em vídeo necessária",
    followers: "Seguidores", reliable: "Confiável", jamReq: "PEDIDO DE JAM",
    waitlistName: "Qual é o teu nome?",
    waitlistRole: "Como descreves o teu perfil?",
    waitlistSelectRole: "Escolhe uma opção...",
    waitlistSpecialty: "Género / Instrumento / Especialidade",
    waitlistSpecialtyPlaceholder: "ex: Guitarrista, Produtor, Estúdio...",
    ticketTitle: "MECA ACCESS PASS",
    ticketQueueMsg: "A tua posição de acesso antecipado",
    ticketBoostMsg: "⚡ Sobe posições partilhando o teu ticket com outros músicos!",
    ticketRefLink: "O teu link de convite único:",
    ticketCopied: "Link copiado! ⚡",
    ticketCopyBtn: "Copiar Link",
    ticketResetBtn: "Registar outro email",
    joinedActivity: "juntou-se à fila há uns momentos",
    roleMusician: "Músico / Artista",
    roleBand: "Representante de Banda",
    roleStudio: "Estúdio de Gravação",
    roleVenue: "Venue / Promotor de Concertos",
    roleProducer: "Produtor / Som",
  },
  en: {
    eyebrow: "The professional music platform",
    h1a: "Musicians without a stage.",
    h1b: "Studios with empty rooms.",
    h1c: "It doesn't have to be this way.",
    sub: "Connecting musicians, studios and venues — through location and real-time availability. Not Facebook groups or word of mouth.",
    placeholder: "Your email",
    cta: "Join the list →",
    done: "✓ You're in",
    micro: "We'll only reach out when we launch. No spam.",
    success: "✓ Perfect. You'll be among the first to know.",
    stat1n: "18K+", stat1l: "professional musicians in Lisbon alone",
    stat2n: "124", stat2l: "recording studios in Lisbon",
    stat3n: "113+", stat3l: "live music venues",
    visionEye: "Purpose", visionTitle: "Vision & Mission",
    v1h: "Our Vision", v1p: "To become the global reference platform where studios, venues and talent meet organically and professionally.",
    v2h: "Our Mission", v2p: "Empower independent musicians through powerful discovery tools, frictionless collaboration, and integrated booking capabilities.",
    howEye: "Process", howTitle: "How It Works", howSub: "Simplified flows so you can focus on what matters: the music.",
    howArtists: "For Artists", howBiz: "For Businesses",
    a1t: "Create your Profile", a1p: "Set your instruments, genres and radius. If you have a Band, create a collective profile.",
    a2t: "Discovery", a2p: "Enter Flash Mode to find the ideal musician or to get on the radar of local promoters and studios.",
    a3t: "Secure Gigs", a3p: "Apply to gigs on The Board, close tours or receive direct invitations for professional sessions.",
    b1t: "List your Space", b1p: "Set rates, schedules and equipment. Make your studio or venue visible to thousands of artists.",
    b2t: "Booking Management", b2p: "Centralise applications. Filter artists by genre, technical level and availability.",
    b3t: "Optimise Schedule", b3p: "Fill empty slots with targeted promotions and eliminate idle hours from your calendar.",
    audEye: "Target Audiences", audTitle: "Your Ecosystem",
    aud1eye: "For Creators", aud1h: "Musicians & Artists", aud1sub: "MECA is the space where talent meets opportunity.",
    aud1i1: "Direct Exposure:", aud1i1d: "Reach fans and professionals and put your performance in front of decision-makers.",
    aud1i2: "The Perfect Match:", aud1i2d: "Recruit the ideal member or join new projects, with technical level filters.",
    aud1i3: "Total Control:", aud1i3d: "Secure rehearsals, recording sessions and concerts instantly. No calls, no delays.",
    aud2eye: "For Providers", aud2h: "Studios & Venues", aud2sub: "Maximise your space profitability and professionalise your booking.",
    aud2i1: "Smart Profitability:", aud2i1d: "End idle time. Use The Board to convert empty slots into immediate revenue.",
    aud2i2: "Simplified Curation:", aud2i2d: "Say goodbye to DM chaos. Centralise applications and close your lineup with confidence.",
    aud2i3: "Talent Radar:", aud2i3d: "Be the first to discover artists moving the local scene.",
    intTitle: "MECA is the home of ", intA1: "collaborations", intMiddle: ", ", intA2: "stages", intMid2: " and ", intA3: "new possibilities", intEnd: ".",
    mockTab1: "Artists", mockTab2: "Bands", mockTab3: "Studios",
    mockSearch: "Search for a bassist, vocalist...",
    mockSS1: "Place your Flash Mode screenshot here",
    mockSS2: "Place your Board screenshot here",
    compEye: "Competitive Landscape", compTitle: "MECA Differentiation",
    compF: "Feature", compMECA: "MECA", compV: "Vampr", compB: "BandMix",
    cf1: "Swipe Discovery (Flash Mode)", cf2: "Studio/Rehearsal Booking", cf3: "Gigs & Live Performance", cf4: "Match Score Engine", cf5: "Business Profiles (Studio/Venue)",
    mktEye: "Market", mktTitle: "Global Scale",
    mktSub: "The music market is changing. MECA positions itself at the centre of this transformation.",
    mktBigN: "100+", mktBigH: "Lisbon Music Hub", mktBigP: "Lisbon is consolidating as a creative capital. With 100+ active spaces, 75% of music revenue in Portugal flows through the live ecosystem.",
    mktP1: "+15% YoY Growth", mktP2: "Marvila/Beato Cluster",
    mkt1eye: "Studios", mkt1h: "Maximise occupancy.", mkt1p: "Convert empty slots into revenue. The Board connects your calendar directly to musicians ready to book.",
    mkt2eye: "Venues", mkt2h: "Simplify curation.", mkt2p: "Centralise band applications and keep your programming always active with our local network.",
    studioBadge: "VERIFIED INFRASTRUCTURE",
    bottomH: "Join the waiting list.", bottomP: "MECA launches in Lisbon soon. The first to join get early access and special founding member conditions.",
    bottomMicro: "We'll only reach out when we launch. No spam.",
    bottomSuccess: "✓ You're on the list. See you soon.",
    stickyLabel: "Launching soon",
    navVision: "Vision", navHow: "How It Works", navAud: "Benefits",
    footerTag: "Connect. Play. Get Paid.",
    gigTitle: "Lead Guitarist Needed for Tour",
    gigBand: "The Night Owls",
    gigApply: "Review & Apply",
    gigMatch: "98% MATCH",
    gigReq1: "Professional equipment",
    gigReq2: "Touring experience",
    gigReq3: "Video audition required",
    followers: "Followers", reliable: "Reliable", jamReq: "JAM REQUEST",
    waitlistName: "What is your name?",
    waitlistRole: "How do you define your profile?",
    waitlistSelectRole: "Choose an option...",
    waitlistSpecialty: "Genre / Instrument / Specialty",
    waitlistSpecialtyPlaceholder: "e.g.: Guitarist, Producer, Rehearsal Studio...",
    ticketTitle: "MECA ACCESS PASS",
    ticketQueueMsg: "Your early access position",
    ticketBoostMsg: "⚡ Move up in line by sharing your ticket with other musicians!",
    ticketRefLink: "Your unique invite link:",
    ticketCopied: "Link copied! ⚡",
    ticketCopyBtn: "Copy Link",
    ticketResetBtn: "Register another email",
    joinedActivity: "joined the line moments ago",
    roleMusician: "Musician / Artist",
    roleBand: "Band Representative",
    roleStudio: "Recording Studio",
    roleVenue: "Live Music Venue / Promoter",
    roleProducer: "Producer / Sound Engineer",
  }
};

const t = (lang: "pt" | "en", key: string): string => {
  const strings: Record<string, string> = translations[lang] || translations["en"];
  return strings[key] || key;
};

interface WaitingFormProps {
  id?: string;
  msgId?: string;
  lang: "pt" | "en";
  dark?: boolean;
}

function convertRoleToLabel(role: string, lang: "pt" | "en"): string {
  switch (role) {
    case "roleMusician": return t(lang, "roleMusician");
    case "roleBand": return t(lang, "roleBand");
    case "roleStudio": return t(lang, "roleStudio");
    case "roleVenue": return t(lang, "roleVenue");
    case "roleProducer": return t(lang, "roleProducer");
    default: return role;
  }
}

function WaitingForm({ lang, dark }: WaitingFormProps) {
  const [ticket, setTicket] = useState<{
    name: string;
    email: string;
    role: string;
    specialty: string;
    queueNum: number;
    referrals: number;
  } | null>(() => {
    try {
      const cached = localStorage.getItem("meca_waitlist_ticket");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [copied, setCopied] = useState(false);

  // Sync state between any waitlist forms on the page
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const cached = localStorage.getItem("meca_waitlist_ticket");
        if (cached) {
          setTicket(JSON.parse(cached));
        } else {
          setTicket(null);
        }
      } catch {
        setTicket(null);
      }
    };
    window.addEventListener("meca_waitlist_update", handleUpdate);
    return () => window.removeEventListener("meca_waitlist_update", handleUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const baseNum = 2482;
    const offset = Math.floor(Math.random() * 9) + 1;
    const finalQueue = baseNum + offset;

    const newTicket = {
      name: name || "Artist",
      email,
      role: role || "roleMusician",
      specialty: specialty || "Geral",
      queueNum: finalQueue,
      referrals: 0
    };

    try {
      localStorage.setItem("meca_waitlist_ticket", JSON.stringify(newTicket));
      setTicket(newTicket);
      window.dispatchEvent(new Event("meca_waitlist_update"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    if (!ticket) return;
    const refUrl = `${window.location.origin}/?ref=${ticket.queueNum}`;
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    try {
      localStorage.removeItem("meca_waitlist_ticket");
      setTicket(null);
      setName("");
      setEmail("");
      setRole("");
      setSpecialty("");
      window.dispatchEvent(new Event("meca_waitlist_update"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBoost = () => {
    if (!ticket) return;
    const updated = {
      ...ticket,
      queueNum: Math.max(1, ticket.queueNum - 48),
      referrals: ticket.referrals + 1
    };
    try {
      localStorage.setItem("meca_waitlist_ticket", JSON.stringify(updated));
      setTicket(updated);
      window.dispatchEvent(new Event("meca_waitlist_update"));
    } catch {}
  };

  const recentActivities = lang === "pt" ? [
    { name: "Bruno", spec: "Guitarrista", info: "registo nacional validado" },
    { name: "Rita Costa", spec: "Vocalista", info: "posição #2481 adquirida" },
    { name: "Catarina", spec: "Estúdio de Ensaios", info: "infraestrutura verificada" }
  ] : [
    { name: "Bruno", spec: "Guitarist", info: "profile certified" },
    { name: "Rita Costa", spec: "Vocalist", info: "secured spot #2481" },
    { name: "Catarina", spec: "Rehearsal Space", info: "studio validated" }
  ];

  if (ticket) {
    return (
      <div className="vip-ticket fade-in mx-auto">
        <div className="ticket-notch-l" />
        <div className="ticket-notch-r" />
        
        <div className="ticket-header">
          <span className="ticket-logo">MECA VIP PASS</span>
          <span className="ticket-badge">FOUNDING MEMBER</span>
        </div>

        <div className="ticket-spot-label">{t(lang, "ticketQueueMsg")}</div>
        <div className="ticket-spot-num">#{ticket.queueNum}</div>

        <div style={{ marginTop: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>
          <div className="ticket-info-item">
            <span className="ticket-info-lbl">{lang === 'pt' ? 'Nome' : 'Name'}</span>
            <span className="ticket-info-val">{ticket.name}</span>
          </div>
          <div className="ticket-info-item">
            <span className="ticket-info-lbl">{lang === 'pt' ? 'Função' : 'Role'}</span>
            <span className="ticket-info-val">{convertRoleToLabel(ticket.role, lang)}</span>
          </div>
          <div className="ticket-info-item">
            <span className="ticket-info-lbl">{lang === 'pt' ? 'Especialidade' : 'Specialty'}</span>
            <span className="ticket-info-val">{ticket.specialty}</span>
          </div>
          <div className="ticket-info-item">
            <span className="ticket-info-lbl">Email</span>
            <span className="ticket-info-val" style={{ fontSize: '11px', opacity: 0.8 }}>{ticket.email}</span>
          </div>
        </div>

        <div className="ticket-share-box text-center">
          <span className="wl-label" style={{ display: 'block', marginBottom: '4px', fontSize: '10px' }}>{t(lang, "ticketRefLink")}</span>
          <span className="ticket-share-link">
            {window.location.origin}/?ref={ticket.queueNum}
          </span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
            <button className="ticket-action-btn primary" style={{ margin: 0, padding: '0.5rem 1rem' }} onClick={handleCopyLink}>
              {copied ? t(lang, "ticketCopied") : t(lang, "ticketCopyBtn")}
            </button>
            <button className="ticket-action-btn outline" style={{ margin: 0, padding: '0.5rem 1rem' }} onClick={handleBoost}>
              ⚡ Boost (+48 spots)
            </button>
          </div>
        </div>

        <div className="activity-feed">
          <span className="wl-label" style={{ fontSize: '9px', opacity: 0.5, display: 'block', marginBottom: '6px' }}>
            {lang === 'pt' ? 'ACTIVIDADE EM LISBOA' : 'LISBON ACTIVITY'}
          </span>
          {recentActivities.map((act, idx) => (
            <div className="activity-item" key={idx}>
              <div className="activity-dot" />
              <span>
                <strong>{act.name}</strong> ({act.spec}) — {act.info}
              </span>
            </div>
          ))}
        </div>

        <button className="ticket-action-btn outline" style={{ marginTop: '1.5rem', fontSize: '11px' }} onClick={handleReset}>
          {t(lang, "ticketResetBtn")}
        </button>
      </div>
    );
  }

  return (
    <div className="wl-card fade-in mx-auto">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
        <div style={{ padding: '6px', background: 'rgba(200,240,100,0.1)', borderRadius: '6px' }}>
          <Zap style={{ width: 16, height: 16, color: 'var(--primary)' }} />
        </div>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
            {lang === 'pt' ? 'Acesso Prioritário' : 'Priority Access'}
          </h4>
          <p style={{ fontSize: '11px', color: 'var(--muted)' }}>
            {lang === 'pt' ? 'Garante o teu passe de fundador da MECA' : 'Secure your MECA founding member pass'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="wl-field-group">
          <label className="wl-label">{t(lang, "waitlistName")}</label>
          <input
            className="waiting-input"
            style={{ width: '100%' }}
            type="text"
            placeholder={lang === 'pt' ? "ex: Pedro Silva" : "e.g.: Peter Smith"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="wl-field-group">
          <label className="wl-label">Email</label>
          <input
            className="waiting-input"
            style={{ width: '100%' }}
            type="email"
            placeholder={t(lang, "placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="wl-field-group">
          <label className="wl-label">{t(lang, "waitlistRole")}</label>
          <select className="wl-select" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">{t(lang, "waitlistSelectRole")}</option>
            <option value="roleMusician">{t(lang, "roleMusician")}</option>
            <option value="roleBand">{t(lang, "roleBand")}</option>
            <option value="roleStudio">{t(lang, "roleStudio")}</option>
            <option value="roleVenue">{t(lang, "roleVenue")}</option>
            <option value="roleProducer">{t(lang, "roleProducer")}</option>
          </select>
        </div>

        <div className="wl-field-group">
          <label className="wl-label">{t(lang, "waitlistSpecialty")}</label>
          <input
            className="waiting-input"
            style={{ width: '100%' }}
            type="text"
            placeholder={t(lang, "waitlistSpecialtyPlaceholder")}
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
          />
        </div>

        <button className="waiting-btn" style={{ width: '100%', marginTop: '0.5rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }} type="submit">
          {t(lang, "cta")}
        </button>
      </form>

      <p className="form-micro" style={{ marginTop: '0.75rem', textAlign: 'center', opacity: 0.6 }}>
        {t(lang, "micro")}
      </p>
    </div>
  );
}

interface StickyBarProps {
  lang: "pt" | "en";
}

function StickyBar({ lang }: StickyBarProps) {
  const [done, setDone] = useState(() => {
    try {
      return localStorage.getItem("meca_waitlist_ticket") !== null;
    } catch {
      return false;
    }
  });
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setDone(localStorage.getItem("meca_waitlist_ticket") !== null);
      } catch {
        setDone(false);
      }
    };
    window.addEventListener("meca_waitlist_update", handleUpdate);
    return () => window.removeEventListener("meca_waitlist_update", handleUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const baseNum = 2482;
    const offset = Math.floor(Math.random() * 9) + 1;
    const finalQueue = baseNum + offset;

    const newTicket = {
      name: lang === 'pt' ? "Fundador" : "Founder",
      email,
      role: "roleMusician",
      specialty: lang === 'pt' ? "Acesso Rápido" : "Quick Access",
      queueNum: finalQueue,
      referrals: 0
    };

    try {
      localStorage.setItem("meca_waitlist_ticket", JSON.stringify(newTicket));
      setDone(true);
      window.dispatchEvent(new Event("meca_waitlist_update"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="sticky-bar">
      <span className="sticky-label">{t(lang, "stickyLabel")}</span>
      <form className="sticky-form" onSubmit={handleSubmit}>
        <input 
          className="sticky-input" 
          type="email" 
          placeholder={t(lang, "placeholder")} 
          required 
          disabled={done} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={`sticky-btn${done ? ' done' : ''}`} type="submit" disabled={done}>
          {done ? "✓" : t(lang, "cta")}
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const s = (key: string) => t(lang, key);

  const handleScrollToBottom = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("waiting-list-bottom");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const compRows = [
    { f: s("cf1"), m: "✓ Flash Mode", v: "Limitado", b: "Não" },
    { f: s("cf2"), m: "✓ Nativo", v: "Não", b: "Não" },
    { f: s("cf3"), m: "✓ The Board", v: "Baixo", b: "Parcial" },
    { f: s("cf4"), m: "✓ Match Score", v: "Não", b: "Não" },
    { f: s("cf5"), m: "✓ Completo", v: "Não", b: "Não" },
  ];

  return (
    <div className="meca-root">
      <style>{style}</style>

      {/* NAV */}
      <nav className="meca-nav">
        <div className="wrap inner">
          <div className="nav-logo">
            <span className="nav-logo-text">MECA</span>
          </div>
          <div className="nav-links">
            <a href="#vision">{s("navVision")}</a>
            <a href="#how">{s("navHow")}</a>
            <a href="#audiences">{s("navAud")}</a>
          </div>
          <div className="lang-toggle">
            <button className={`lang-btn${lang === 'pt' ? ' active' : ''}`} onClick={() => setLang("pt")}>PT</button>
            <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>
      </nav>

      <div className="wrap">

        {/* HERO */}
        <header className="hero">
          <div className="hero-glow" />
          <div className="fade-in">
            <p className="hero-eyebrow">{s("eyebrow")}</p>
            <h1 className="hero-title">
              {s("h1a")}<br />
              <em>{s("h1b")}</em><br />
              {s("h1c")}
            </h1>
            <p className="hero-sub">{s("sub")}</p>
            <div className="hero-priority-container">
              <div className="hero-priority-header">
                <span className="hero-priority-dot">●</span>
                <span>{lang === "pt" ? "Acesso Prioritário" : "Priority Access"}</span>
              </div>
              <button onClick={handleScrollToBottom} className="hero-priority-btn">
                {lang === "pt" ? "Garante o teu Passe de Fundador" : "Secure Your Founding Member Pass"} →
              </button>
            </div>
          </div>
          <div className="hero-visual fade-in-3">
            <div className="hero-visual-glow" />
            <div className="hv-blob1" />
            <div className="hv-blob2" />
            {/* Studio card */}
            <div className="fc-studio float">
              <div className="card-dark">
                <div className="card-img">
                  <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80" alt="Studio" referrerPolicy="no-referrer" />
                  <div className="card-badge"><Star style={{ width: 8, height: 8, display: 'inline', verticalAlign: 'middle' }} /> 4.8</div>
                  <div className="card-price">€25/hr</div>
                </div>
                <div className="card-body">
                  <div className="card-title">SoundBox Studios</div>
                  <div className="card-sub">Lisboa, Mouraria</div>
                  <div className="card-tags">
                    <span className="card-tag">Pro Gear</span>
                    <span className="card-tag">Lounge</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Artist card (reused Discovery card structure for consistent pairing) */}
            <div className="fc-artist float-2">
              <div className="disc-card" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div className="disc-card-header">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Ana Ferreira Profile" className="disc-avatar" referrerPolicy="no-referrer" />
                  <div className="disc-user-info">
                    <div className="disc-name-row">
                      <span className="disc-name">Ana Ferreira</span>
                      <span className="disc-badge-vocals">Vocals</span>
                    </div>
                    <div className="disc-tags-row">
                      <span className="disc-tag-blue">Indie</span>
                      <span className="disc-tag-blue">Pop</span>
                    </div>
                    <div className="disc-loc-row" style={{ marginTop: 2 }}>
                      <MapPin style={{ width: 8, height: 8 }} />
                      <span>Porto</span>
                    </div>
                  </div>
                </div>

                {/* Photos list horizontal */}
                <div className="disc-photos-grid">
                  <div className="disc-photo-wrapper">
                    <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&q=80" alt="Live session" className="disc-photo-img" referrerPolicy="no-referrer" />
                    <div className="disc-photo-overlay">Photo 1</div>
                  </div>
                  <div className="disc-photo-wrapper">
                    <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&q=80" alt="Live performance" className="disc-photo-img" referrerPolicy="no-referrer" />
                    <div className="disc-photo-overlay">Photo 2</div>
                  </div>
                  <div className="disc-photo-wrapper">
                    <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80" alt="Glow onstage" className="disc-photo-img" referrerPolicy="no-referrer" />
                    <div className="disc-photo-overlay">Photo 3</div>
                  </div>
                </div>

                {/* Button */}
                <div className="disc-jam-btn-bar">
                  <Zap style={{ width: 10, height: 10, fill: '#fff', color: '#fff' }} />
                  <span>Let's Jam</span>
                </div>
              </div>
            </div>
            {/* Gig card */}
            <div className="fc-gig float-center">
              <div className="card-dark">
                <div className="gig-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="gig-dot" /><span style={{ fontWeight: 700, fontSize: 13 }}>The Board</span></div>
                  <span className="gig-match">{s("gigMatch")}</span>
                </div>
                <div className="gig-body">
                  <div className="gig-row">
                    <div className="gig-thumb"><img src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=100&q=80" alt="The Night Owls" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                    <div>
                      <div className="gig-name">{s("gigTitle")}</div>
                      <div className="gig-band">{s("gigBand")}</div>
                    </div>
                  </div>
                  <div className="gig-meta">
                    <div className="gig-price"><DollarSign style={{ width: 12, height: 12, display: 'inline' }} /> 200€/gig</div>
                    <div className="gig-loc"><MapPin style={{ width: 12, height: 12, display: 'inline' }} /> Lisboa</div>
                  </div>
                  <button className="gig-btn">{s("gigApply")}</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-cell"><div className="stat-num">{s("stat1n")}</div><div className="stat-lbl">{s("stat1l")}</div></div>
          <div className="stat-cell"><div className="stat-num">{s("stat2n")}</div><div className="stat-lbl">{s("stat2l")}</div></div>
          <div className="stat-cell"><div className="stat-num">{s("stat3n")}</div><div className="stat-lbl">{s("stat3l")}</div></div>
        </div>

        {/* VISION */}
        <section className="section" id="vision">
          <p className="section-eyebrow">{s("visionEye")}</p>
          <h2 className="section-title">{s("visionTitle")}</h2>
          <div className="vision-grid">
            <div className="vision-card">
              <Eye className="vision-icon" />
              <div className="vision-h">{s("v1h")}</div>
              <div className="vision-p">{s("v1p")}</div>
            </div>
            <div className="vision-card">
              <Rocket className="vision-icon" />
              <div className="vision-h">{s("v2h")}</div>
              <div className="vision-p">{s("v2p")}</div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" id="how">
          <p className="section-eyebrow">{s("howEye")}</p>
          <h2 className="section-title">{s("howTitle")}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: '0.5rem' }}>{s("howSub")}</p>
          <div className="how-grid">
            <div>
              <div className="how-col-title">
                <div className="how-icon-wrap green"><Mic style={{ width: 22, height: 22, color: 'var(--primary)' }} /></div>
                <div className="how-col-h">{s("howArtists")}</div>
              </div>
              <div className="steps">
                {[[s("a1t"), s("a1p")], [s("a2t"), s("a2p")], [s("a3t"), s("a3p")]].map(([h, p], i) => (
                  <div className="step-row" key={i}>
                    <div className="step-num">0{i + 1}</div>
                    <div><div className="step-h">{h}</div><div className="step-p">{p}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="how-col-title">
                <div className="how-icon-wrap purple"><Music style={{ width: 22, height: 22, color: 'var(--accent)' }} /></div>
                <div className="how-col-h">{s("howBiz")}</div>
              </div>
              <div className="steps purple">
                {[[s("b1t"), s("b1p")], [s("b2t"), s("b2p")], [s("b3t"), s("b3p")]].map(([h, p], i) => (
                  <div className="step-row" key={i}>
                    <div className="step-num">0{i + 1}</div>
                    <div><div className="step-h">{h}</div><div className="step-p">{p}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AUDIENCES */}
        <section className="section" id="audiences">
          <p className="section-eyebrow purple">{s("audEye")}</p>
          <h2 className="section-title">{s("audTitle")}</h2>
          <div className="audience-cards">
            <div className="audience-card">
              <div className="audience-stripe purple" />
              <p className="audience-eyebrow">{s("aud1eye")}</p>
              <h3 className="audience-h">{s("aud1h")}</h3>
              <p className="audience-sub">{s("aud1sub")}</p>
              <ul className="audience-list">
                <li className="audience-item"><strong>{s("aud1i1")}</strong> {s("aud1i1d")}</li>
                <li className="audience-item"><strong>{s("aud1i2")}</strong> {s("aud1i2d")}</li>
                <li className="audience-item"><strong>{s("aud1i3")}</strong> {s("aud1i3d")}</li>
              </ul>
            </div>
            <div className="audience-card">
              <div className="audience-stripe green" />
              <p className="audience-eyebrow purple">{s("aud2eye")}</p>
              <h3 className="audience-h">{s("aud2h")}</h3>
              <p className="audience-sub">{s("aud2sub")}</p>
              <ul className="audience-list">
                <li className="audience-item purple"><strong>{s("aud2i1")}</strong> {s("aud2i1d")}</li>
                <li className="audience-item purple"><strong>{s("aud2i2")}</strong> {s("aud2i2d")}</li>
                <li className="audience-item purple"><strong>{s("aud2i3")}</strong> {s("aud2i3d")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* INTERSTITIAL */}
        <div className="interstitial">
          <h2>
            {s("intTitle")}<span style={{ color: 'var(--primary)' }}>{s("intA1")}</span>{lang === 'pt' ? s("intMid") : s("intMiddle")}<span style={{ color: 'var(--accent)' }}>{s("intA2")}</span>{s("intMid2")}<span style={{ color: '#fff' }}>{s("intA3")}</span>{s("intEnd")}
          </h2>
        </div>

        {/* MOCKUPS — SCREENSHOT PLACEHOLDERS */}
        <div className="mockups-wrap">
          <div className="mockups-glow" />
          <div className="mockups-row">
            {/* LIFT SIDE PHONE - DISCOVER (ARTISTS FEED SCREENSHOT) */}
            <div className="mockup-phone tilt-l" style={{ padding: 0 }}>
              <div className="custom-screen">
                {/* Simulated Top Bar of Discover Screen */}
                <div className="disc-top-bar">
                  <div className="disc-search-input">
                    <Search style={{ width: 10, height: 10, opacity: 0.6 }} />
                    <span>Search for a bassist, vocalist...</span>
                  </div>
                  <div className="disc-header-row">
                    <span className="disc-tab-btn active">Artists</span>
                    <span className="disc-tab-btn">Bands</span>
                    <span className="disc-tab-btn">Studios</span>
                    <span className="disc-tab-btn">Venues</span>
                    <div className="disc-top-lightning">
                      <Zap style={{ width: 10, height: 10, fill: '#000' }} />
                    </div>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="disc-filter-row">
                  <div className="disc-filter-btn">
                    <TrendingUp style={{ width: 10, height: 10 }} />
                    <span>Filters</span>
                    <span style={{ fontSize: 7 }}>▼</span>
                  </div>
                </div>

                {/* List Container with feeds */}
                <div className="disc-scroll-container">
                  {/* Card 1: Ana Ferreira */}
                  <div className="disc-card">
                    <div className="disc-card-header">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Ana Ferreira Profile" className="disc-avatar" referrerPolicy="no-referrer" />
                      <div className="disc-user-info">
                        <div className="disc-name-row">
                          <span className="disc-name">Ana Ferreira</span>
                          <span className="disc-badge-vocals">Vocals</span>
                        </div>
                        <div className="disc-tags-row">
                          <span className="disc-tag-blue">Indie</span>
                          <span className="disc-tag-blue">Pop</span>
                        </div>
                        <div className="disc-loc-row" style={{ marginTop: 2 }}>
                          <MapPin style={{ width: 8, height: 8 }} />
                          <span>Porto</span>
                        </div>
                      </div>
                    </div>

                    {/* Photos list horizontal */}
                    <div className="disc-photos-grid">
                      <div className="disc-photo-wrapper">
                        <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&q=80" alt="Live session" className="disc-photo-img" referrerPolicy="no-referrer" />
                        <div className="disc-photo-overlay">Photo 1</div>
                      </div>
                      <div className="disc-photo-wrapper">
                        <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&q=80" alt="Live performance" className="disc-photo-img" referrerPolicy="no-referrer" />
                        <div className="disc-photo-overlay">Photo 2</div>
                      </div>
                      <div className="disc-photo-wrapper">
                        <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80" alt="Glow onstage" className="disc-photo-img" referrerPolicy="no-referrer" />
                        <div className="disc-photo-overlay">Photo 3</div>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="disc-jam-btn-bar">
                      <Zap style={{ width: 10, height: 10, fill: '#fff', color: '#fff' }} />
                      <span>Let's Jam</span>
                    </div>
                  </div>

                  {/* Card 2: Carlos Ruiz */}
                  <div className="disc-card">
                    <div className="disc-card-header">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Carlos Ruiz Profile" className="disc-avatar" referrerPolicy="no-referrer" />
                      <div className="disc-user-info">
                        <div className="disc-name-row">
                          <span className="disc-name">Carlos Ruiz</span>
                          <span className="disc-badge-guitar">Guitar</span>
                        </div>
                        <div className="disc-tags-row">
                          <span className="disc-tag-blue">Rock</span>
                          <span className="disc-tag-blue">Blues</span>
                        </div>
                        <div className="disc-loc-row" style={{ marginTop: 2 }}>
                          <MapPin style={{ width: 8, height: 8 }} />
                          <span>Lisbon</span>
                        </div>
                      </div>
                    </div>

                    {/* Photos list horizontal */}
                    <div className="disc-photos-grid">
                      <div className="disc-photo-wrapper">
                        <img src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=150&q=80" alt="Guitar on stage" className="disc-photo-img" referrerPolicy="no-referrer" />
                        <div className="disc-photo-overlay">Photo 1</div>
                      </div>
                      <div className="disc-photo-wrapper">
                        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&q=80" alt="Live stage setup" className="disc-photo-img" referrerPolicy="no-referrer" />
                        <div className="disc-photo-overlay">Photo 2</div>
                      </div>
                      <div className="disc-photo-wrapper">
                        <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&q=80" alt="Backstage vibe" className="disc-photo-img" referrerPolicy="no-referrer" />
                        <div className="disc-photo-overlay">Photo 3</div>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="disc-jam-btn-bar">
                      <Zap style={{ width: 10, height: 10, fill: '#fff', color: '#fff' }} />
                      <span>Let's Jam</span>
                    </div>
                  </div>

                  {/* Card 3 (partly scrolled): João Martins */}
                  <div className="disc-card" style={{ opacity: 0.6 }}>
                    <div className="disc-card-header">
                      <div className="disc-avatar" style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', justify: 'center', color: '#fff', fontWeight: 'bold', fontSize: 13 }}>JM</div>
                      <div className="disc-user-info">
                        <div className="disc-name-row">
                          <span className="disc-name">João Martins</span>
                        </div>
                        <div className="disc-tags-row">
                          <span className="disc-tag-blue">Piano</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* App Bottom navbar */}
                <div className="custom-bottom-nav">
                  <div className="custom-nav-item active">
                    <Search style={{ width: 14, height: 14 }} />
                    <span>Discover</span>
                  </div>
                  <div className="custom-nav-item">
                    <Star style={{ width: 14, height: 14 }} />
                    <span>Saved</span>
                  </div>
                  <div className="custom-nav-item custom-nav-badge">
                    <Mail style={{ width: 14, height: 14 }} />
                    <span>Messages</span>
                  </div>
                  <div className="custom-nav-item">
                    <Clipboard style={{ width: 14, height: 14 }} />
                    <span>Board</span>
                  </div>
                  <div className="custom-nav-item">
                    <User style={{ width: 14, height: 14 }} />
                    <span>Profile</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE PHONE - BOARD (OPPORTUNITIES / POSTS SCREENSHOT) */}
            <div className="mockup-phone tilt-r" style={{ padding: 0 }}>
              <div className="custom-screen">
                {/* Header Container */}
                <div className="board-v2-header-container">
                  <div className="mockup-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px 6px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ fontWeight: 900, fontSize: 13, fontStyle: 'italic', letterSpacing: '0.04em', color: '#fff' }}>The Board <span style={{ background: '#c8f064', color: '#000', fontSize: 7, padding: '1px 4px', borderRadius: 3, fontStyle: 'normal', fontWeight: 900, verticalAlign: 'middle', marginLeft: 4 }}>BETA</span></span>
                    <div style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%' }} />
                  </div>
                  <div className="board-v2-tabs">
                    <span className="board-v2-tab active">Marketplace</span>
                    <span className="board-v2-tab">Posts Manager <span className="board-v2-tab-dot" /></span>
                  </div>

                  {/* Switcher Opportunities / Community */}
                  <div className="board-v2-switcher">
                    <div className="board-v2-switch-btn active">
                      <span>💼 Opportunities</span>
                    </div>
                    <div className="board-v2-switch-btn inactive">
                      <span>👥 Community</span>
                    </div>
                  </div>

                  {/* Subfilters */}
                  <div className="board-v2-filter-row">
                    <div className="board-v2-filter-group">
                      <span className="board-v2-pill active">All</span>
                      <span className="board-v2-pill">Gigs</span>
                      <span className="board-v2-pill">Talent</span>
                    </div>
                    <div className="board-v2-loc-btn">
                      <MapPin style={{ width: 8, height: 8 }} />
                      <span>Location</span>
                      <span style={{ fontSize: 6 }}>▶</span>
                    </div>
                  </div>
                </div>

                {/* Opportunities scroll list */}
                <div className="disc-scroll-container">
                  {/* Card 1: reggae night */}
                  <div className="board-v2-card-p">
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div className="board-v2-logo-p">M</div>
                      <div className="board-v2-card-header-col">
                        <span className="board-v2-card-title-p">reggae night</span>
                        <span className="board-v2-card-sub-p">ALK</span>
                        <div className="board-v2-card-tags">
                          <span className="board-v2-card-tag">Reggae</span>
                          <span className="board-v2-card-tag">Dancehall</span>
                        </div>
                      </div>
                    </div>

                    <div className="board-v2-card-meta">
                      <span className="board-v2-meta-p-price">EUR 500</span>
                      <span className="board-v2-meta-p-loc">
                        <MapPin style={{ width: 8, height: 8 }} /> Lisbon, Portugal
                      </span>
                    </div>

                    {/* Requirements box */}
                    <div className="board-v2-card-reqs">
                      <div className="board-v2-card-reqs-lbl">Requirements</div>
                      <div className="board-v2-card-reqs-list">
                        <div className="board-v2-card-req-item">
                          <span>✓</span> Open slots: 3
                        </div>
                        <div className="board-v2-card-req-item">
                          <span>✓</span> Frequency: Uma vez
                        </div>
                      </div>
                    </div>

                    {/* Applied / Share Buttons */}
                    <div className="board-v2-card-actions">
                      <div className="board-v2-card-btn-grey">
                        <span>✓ Applied</span>
                      </div>
                      <div className="board-v2-card-btn-outline">
                        <span>➦ Share</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: PsyNight */}
                  <div className="board-v2-card-p">
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div className="board-v2-logo-p">M</div>
                      <div className="board-v2-card-header-col">
                        <span className="board-v2-card-title-p">PsyNight</span>
                        <span className="board-v2-card-sub-p">ALK</span>
                        <div className="board-v2-card-tags">
                          <span className="board-v2-card-tag">Psychedelic Rock</span>
                        </div>
                      </div>
                    </div>

                    <div className="board-v2-card-meta">
                      <span className="board-v2-meta-p-price">EUR 350</span>
                      <span className="board-v2-meta-p-loc">
                        <MapPin style={{ width: 8, height: 8 }} /> Lisbon, Portugal
                      </span>
                    </div>

                    {/* Requirements box */}
                    <div className="board-v2-card-reqs">
                      <div className="board-v2-card-reqs-lbl">Requirements</div>
                      <div className="board-v2-card-reqs-list">
                        <div className="board-v2-card-req-item">
                          <span>✓</span> Open slots: 3
                        </div>
                        <div className="board-v2-card-req-item">
                          <span>✓</span> Frequency: Uma vez
                        </div>
                      </div>
                    </div>

                    {/* Apply / Share Buttons */}
                    <div className="board-v2-card-actions">
                      <div className="board-v2-card-btn-white">
                        <span>Apply ▶</span>
                      </div>
                      <div className="board-v2-card-btn-outline">
                        <span>➦ Share</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Create Post FAB button absolute */}
                <div className="board-v2-floating-create">
                  <span style={{ fontSize: 11, fontWeight: 'bold' }}>+</span>
                  <span>Create Post</span>
                </div>

                {/* App Bottom navbar */}
                <div className="custom-bottom-nav">
                  <div className="custom-nav-item">
                    <Search style={{ width: 14, height: 14 }} />
                    <span>Discover</span>
                  </div>
                  <div className="custom-nav-item">
                    <Star style={{ width: 14, height: 14 }} />
                    <span>Saved</span>
                  </div>
                  <div className="custom-nav-item custom-nav-badge">
                    <Mail style={{ width: 14, height: 14 }} />
                    <span>Messages</span>
                  </div>
                  <div className="custom-nav-item active">
                    <Clipboard style={{ width: 14, height: 14 }} />
                    <span>Board</span>
                  </div>
                  <div className="custom-nav-item">
                    <User style={{ width: 14, height: 14 }} />
                    <span>Profile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPETITION */}
        <section className="section">
          <p className="section-eyebrow purple">{s("compEye")}</p>
          <h2 className="section-title">{s("compTitle")}</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="comp-table">
              <thead>
                <tr>
                  <th>{s("compF")}</th>
                  <th>{s("compMECA")}</th>
                  <th>{s("compV")}</th>
                  <th>{s("compB")}</th>
                </tr>
              </thead>
              <tbody>
                {compRows.map((r, i) => (
                  <tr key={i}>
                    <td className="comp-feat">{r.f}</td>
                    <td className="comp-meca">{r.m}</td>
                    <td className="comp-other">{r.v}</td>
                    <td className="comp-other">{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* STUDIO IMAGE */}
        <div className="studio-img-wrap">
          <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" alt="Recording studio" referrerPolicy="no-referrer" />
          <div className="studio-badge">{s("studioBadge")}</div>
        </div>

        {/* MARKET */}
        <section className="section">
          <p className="section-eyebrow purple">{s("mktEye")}</p>
          <h2 className="section-title">{s("mktTitle")}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 500 }}>{s("mktSub")}</p>
          <div className="market-grid">
            <div className="market-main">
              <div>
                <div className="market-big-num">{s("mktBigN")}</div>
                <div className="market-main-h">{s("mktBigH")}</div>
                <div className="market-main-p">{s("mktBigP")}</div>
                <div className="market-pills">
                  <span className="market-pill">{s("mktP1")}</span>
                  <span className="market-pill">{s("mktP2")}</span>
                </div>
              </div>
            </div>
            <div className="market-sub">
              <div>
                <div className="market-sub-icon green"><TrendingUp style={{ width: 18, height: 18 }} /></div>
                <div className="market-sub-eyebrow green">{s("mkt1eye")}</div>
                <div className="market-sub-h">{s("mkt1h")}</div>
                <div className="market-sub-p">{s("mkt1p")}</div>
              </div>
            </div>
            <div className="market-sub">
              <div>
                <div className="market-sub-icon purple"><Users style={{ width: 18, height: 18 }} /></div>
                <div className="market-sub-eyebrow purple">{s("mkt2eye")}</div>
                <div className="market-sub-h">{s("mkt2h")}</div>
                <div className="market-sub-p">{s("mkt2p")}</div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <div className="bottom-cta" id="waiting-list-bottom">
          <div className="bottom-cta-inner">
            <div className="bottom-cta-glow" />
            <h2 className="bottom-cta-h">{s("bottomH")}</h2>
            <p className="bottom-cta-p">{s("bottomP")}</p>
            <WaitingForm lang={lang} dark={true} />
            <a href="mailto:info@meca-app.com" className="cta-email">info@meca-app.com</a>
          </div>
        </div>

        <div className="footer-bar">
          <span className="footer-logo">MECA</span>
          <span className="footer-tag">{s("footerTag")}</span>
        </div>

      </div>

      <StickyBar lang={lang} />
    </div>
  );
}
