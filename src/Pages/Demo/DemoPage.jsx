// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import {
//   FiPlayCircle, FiChevronLeft, FiChevronRight,
//   FiAlertCircle, FiGrid, FiVideo
// } from 'react-icons/fi';
// import logo from "../../../public/logo.png";

// /* ─────────────────────────────────────────────────────────────
//    STYLES  (injected once, no extra CSS file needed)
// ───────────────────────────────────────────────────────────── */
// const STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   html, body, #root {
//     height: 100%;
//     overflow: hidden;          /* no page scroll */
//     background: #060608;
//     font-family: 'Inter', sans-serif;
//     color: #fff;
//   }

//   /* ── demo shell ── */
//   .demo-shell {
//     display: flex;
//     flex-direction: column;
//     height: 100dvh;            /* dynamic viewport height */
//     overflow: hidden;
//   }

//   /* ── top bar ── */
//   .demo-topbar {
//     flex-shrink: 0;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 10px 20px;
//     background: rgba(6,6,8,.92);
//     border-bottom: 1px solid rgba(255,255,255,.06);
//     backdrop-filter: blur(12px);
//     z-index: 10;
//   }
//   .demo-topbar img { height: 32px; object-fit: contain; }
//   .demo-badge {
//     font-size: 10px;
//     font-weight: 700;
//     letter-spacing: .12em;
//     text-transform: uppercase;
//     padding: 4px 12px;
//     border-radius: 20px;
//     background: rgba(220,38,38,.15);
//     border: 1px solid rgba(220,38,38,.35);
//     color: #f87171;
//   }
//   .demo-count-pill {
//     font-size: 11px;
//     font-weight: 600;
//     color: #9ca3af;
//     background: rgba(255,255,255,.05);
//     border: 1px solid rgba(255,255,255,.08);
//     padding: 4px 12px;
//     border-radius: 20px;
//     display: flex; align-items: center; gap: 6px;
//   }
//   .demo-count-pill svg { color: #ef4444; }

//   /* ── body grid ── */
//   .demo-body {
//     flex: 1;
//     display: grid;
//     grid-template-columns: 1fr 260px;
//     grid-template-rows: 1fr;
//     gap: 0;
//     overflow: hidden;
//     min-height: 0;
//   }

//   /* ── player panel ── */
//   .demo-player-panel {
//     display: flex;
//     flex-direction: column;
//     padding: 16px 16px 16px 20px;
//     gap: 12px;
//     overflow: hidden;
//     min-width: 0;
//   }

//   /* intro text */
//   .demo-intro {
//     flex-shrink: 0;
//   }
//   .demo-intro h1 {
//     font-size: clamp(16px, 2.2vw, 22px);
//     font-weight: 800;
//     line-height: 1.2;
//     background: linear-gradient(135deg, #fff 40%, #9ca3af);
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//   }
//   .demo-intro p {
//     font-size: 12px;
//     color: #6b7280;
//     margin-top: 4px;
//   }
//   .demo-intro span { color: #e5e7eb; font-weight: 600; }

//   /* video wrapper */
//   .demo-video-wrap {
//     flex: 1;
//     position: relative;
//     background: #000;
//     border-radius: 16px;
//     overflow: hidden;
//     border: 1px solid rgba(255,255,255,.07);
//     box-shadow: 0 20px 60px rgba(0,0,0,.7);
//     min-height: 0;
//   }
//   .demo-video-wrap iframe {
//     position: absolute;
//     inset: 0;
//     width: 100%;
//     height: 100%;
//     border: 0;
//   }
//   .demo-video-glow {
//     position: absolute;
//     inset: -1px;
//     border-radius: 16px;
//     pointer-events: none;
//     box-shadow: inset 0 0 0 1px rgba(220,38,38,.2);
//   }

//   /* video meta */
//   .demo-video-meta {
//     flex-shrink: 0;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 12px;
//   }
//   .demo-meta-left { min-width: 0; }
//   .demo-meta-left h2 {
//     font-size: clamp(13px, 1.6vw, 17px);
//     font-weight: 700;
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }
//   .demo-cat-tag {
//     display: inline-flex;
//     align-items: center;
//     gap: 4px;
//     font-size: 10px;
//     font-weight: 700;
//     letter-spacing: .1em;
//     text-transform: uppercase;
//     color: #f87171;
//     background: rgba(239,68,68,.1);
//     border: 1px solid rgba(239,68,68,.2);
//     padding: 2px 8px;
//     border-radius: 4px;
//     margin-top: 4px;
//   }

//   /* nav arrows */
//   .demo-nav-btns { display: flex; gap: 8px; flex-shrink: 0; }
//   .demo-nav-btn {
//     width: 38px; height: 38px;
//     display: flex; align-items: center; justify-content: center;
//     border-radius: 50%;
//     background: rgba(255,255,255,.06);
//     border: 1px solid rgba(255,255,255,.1);
//     color: #fff;
//     cursor: pointer;
//     transition: all .2s;
//   }
//   .demo-nav-btn:hover:not(:disabled) {
//     background: #ef4444;
//     border-color: #ef4444;
//     box-shadow: 0 0 16px rgba(239,68,68,.4);
//   }
//   .demo-nav-btn:disabled { opacity: .3; cursor: default; }

//   /* ── sidebar ── */
//   .demo-sidebar {
//     display: flex;
//     flex-direction: column;
//     border-left: 1px solid rgba(255,255,255,.06);
//     background: rgba(8,8,12,.6);
//     overflow: hidden;
//   }
//   .demo-sidebar-header {
//     flex-shrink: 0;
//     padding: 14px 16px 10px;
//     font-size: 11px;
//     font-weight: 700;
//     letter-spacing: .08em;
//     text-transform: uppercase;
//     color: #6b7280;
//     border-bottom: 1px solid rgba(255,255,255,.05);
//     display: flex; align-items: center; gap: 8px;
//   }
//   .demo-sidebar-header svg { color: #ef4444; }

//   /* playlist scroll */
//   .demo-playlist {
//     flex: 1;
//     overflow-y: auto;
//     overflow-x: hidden;
//     padding: 8px;
//     scrollbar-width: thin;
//     scrollbar-color: rgba(239,68,68,.3) transparent;
//   }
//   .demo-playlist::-webkit-scrollbar { width: 3px; }
//   .demo-playlist::-webkit-scrollbar-track { background: transparent; }
//   .demo-playlist::-webkit-scrollbar-thumb { background: rgba(239,68,68,.3); border-radius: 10px; }

//   /* playlist item */
//   .demo-plist-item {
//     display: flex;
//     gap: 10px;
//     padding: 8px;
//     border-radius: 10px;
//     cursor: pointer;
//     transition: all .18s;
//     border: 1px solid transparent;
//     margin-bottom: 4px;
//     position: relative;
//   }
//   .demo-plist-item:hover { background: rgba(255,255,255,.04); }
//   .demo-plist-item.active {
//     background: rgba(239,68,68,.08);
//     border-color: rgba(239,68,68,.25);
//   }
//   .demo-plist-thumb {
//     width: 80px;
//     height: 52px;
//     border-radius: 7px;
//     overflow: hidden;
//     flex-shrink: 0;
//     background: #111;
//     position: relative;
//   }
//   .demo-plist-thumb img {
//     width: 100%; height: 100%;
//     object-fit: cover;
//     transition: transform .3s;
//   }
//   .demo-plist-item:hover .demo-plist-thumb img,
//   .demo-plist-item.active .demo-plist-thumb img { transform: scale(1.06); }
//   .demo-plist-play {
//     position: absolute;
//     inset: 0;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background: rgba(0,0,0,.4);
//     transition: opacity .2s;
//   }
//   .demo-plist-play svg { color: #fff; width: 20px; height: 20px; }
//   .demo-plist-item.active .demo-plist-play { background: rgba(239,68,68,.35); }
//   .demo-plist-info { flex: 1; min-width: 0; }
//   .demo-plist-info h5 {
//     font-size: 11px;
//     font-weight: 600;
//     line-height: 1.35;
//     display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//     color: #e5e7eb;
//     transition: color .2s;
//   }
//   .demo-plist-item.active .demo-plist-info h5 { color: #fca5a5; }
//   .demo-plist-info span {
//     font-size: 9px;
//     color: #6b7280;
//     margin-top: 3px;
//     display: block;
//   }
//   .demo-plist-num {
//     position: absolute;
//     top: 6px; left: 6px;
//     width: 18px; height: 18px;
//     border-radius: 50%;
//     background: rgba(0,0,0,.75);
//     font-size: 9px;
//     font-weight: 700;
//     display: flex; align-items: center; justify-content: center;
//     color: #9ca3af;
//   }
//   .demo-plist-item.active .demo-plist-num { background: #ef4444; color: #fff; }

//   /* pagination dots */
//   .demo-pagination {
//     flex-shrink: 0;
//     padding: 10px 16px;
//     border-top: 1px solid rgba(255,255,255,.05);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 6px;
//   }
//   .demo-dot {
//     width: 6px; height: 6px;
//     border-radius: 50%;
//     background: rgba(255,255,255,.15);
//     cursor: pointer;
//     transition: all .2s;
//     border: none;
//   }
//   .demo-dot.active { background: #ef4444; width: 18px; border-radius: 3px; }
//   .demo-dot:hover:not(.active) { background: rgba(255,255,255,.35); }

//   /* ── MOBILE layout (≤ 767px) ── */
//   @media (max-width: 767px) {
//     html, body, #root { overflow: hidden; }

//     .demo-shell { height: 100dvh; display: flex; flex-direction: column; overflow: hidden; }
//     .demo-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

//     .demo-topbar { padding: 12px 14px 8px; justify-content: center; position: relative; border-bottom: none; background: transparent; display: flex; flex-direction: column; gap: 8px; align-items: center; flex-shrink: 0;}
//     .demo-topbar img { height: 28px; }
//     .demo-badge { position: static; transform: none; font-size: 10px; padding: 4px 16px; border: none; background: rgba(220,38,38,.15); color: #f87171; }
//     .demo-count-pill { display: none; }

//     .demo-intro { text-align: center; margin: 4px 0 12px; flex-shrink: 0; }
//     .demo-intro h1 { font-size: 20px; font-weight: 900; }
//     .demo-intro p { font-size: 11px; margin-top: 4px; color: #9ca3af; }

//     .demo-player-panel {
//       flex: 1;
//       padding: 0 12px;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       min-height: 0;
//     }

//     /* main video - perfectly contained */
//     .demo-video-wrap {
//       flex: 1;
//       width: 100%;
//       min-height: 0;
//       max-width: 400px;
//       position: relative;
//       border-radius: 16px;
//       box-shadow: 0 10px 25px rgba(0,0,0,.5);
//       margin-bottom: 12px;
//       overflow: hidden;
//     }

//     /* hide these on mobile */
//     .demo-video-meta { display: none; }
//     .demo-sidebar-header { display: none; }
//     .demo-plist-info { display: none; }
//     .demo-plist-num { display: none; }

//     /* bottom sidebar container */
//     .demo-sidebar {
//       flex-shrink: 0;
//       border: none;
//       background: transparent;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       padding-bottom: 16px;
//     }

//     /* circular thumbs strip */
//     .demo-playlist {
//       display: flex;
//       flex-direction: row;
//       flex-wrap: nowrap;
//       overflow-x: auto;
//       overflow-y: hidden;
//       padding: 8px 16px;
//       gap: 12px;
//       scrollbar-width: none;
//       width: 100%;
//       justify-content: center;
//     }
//     .demo-playlist::-webkit-scrollbar { display: none; }

//     /* circle item */
//     .demo-plist-item {
//       flex-shrink: 0;
//       width: 52px;
//       height: 52px;
//       padding: 0;
//       margin: 0;
//       border-radius: 50%;
//       border: 2px solid transparent;
//       background: transparent;
//     }
//     .demo-plist-item.active {
//       border-color: #ef4444;
//       background: transparent;
//       box-shadow: 0 0 12px rgba(239,68,68,.4);
//       transform: scale(1.1);
//     }
//     .demo-plist-item:hover { background: transparent; }

//     .demo-plist-thumb { width: 100%; height: 100%; border-radius: 50%; }
//     .demo-plist-thumb img { border-radius: 50%; object-fit: cover; }
//     .demo-plist-play { display: none; }

//     .demo-pagination { padding: 4px 12px 0px; border: none; }
//   }

//   /* ── TABLET ── */
//   @media (min-width: 768px) and (max-width: 1023px) {
//     .demo-body { grid-template-columns: 1fr 220px; }
//     .demo-plist-thumb { width: 68px; height: 44px; }
//   }

//   /* ── Loading / Error ── */
//   .demo-loader {
//     height: 100dvh;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background: #060608;
//   }
//   .demo-spinner {
//     width: 48px; height: 48px;
//     border: 3px solid rgba(239,68,68,.2);
//     border-top-color: #ef4444;
//     border-radius: 50%;
//     animation: spin .7s linear infinite;
//   }
//   @keyframes spin { to { transform: rotate(360deg); } }

//   .demo-error {
//     height: 100dvh;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     background: #060608;
//     gap: 16px;
//     text-align: center;
//     padding: 24px;
//   }
//   .demo-error-icon {
//     width: 64px; height: 64px;
//     background: rgba(239,68,68,.1);
//     border-radius: 50%;
//     display: flex; align-items: center; justify-content: center;
//     color: #ef4444;
//   }
//   .demo-error h2 { font-size: 22px; font-weight: 800; }
//   .demo-error p { font-size: 14px; color: #6b7280; max-width: 320px; }

//   /* pulse animation for live badge */
//   @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
//   .pulse { animation: pulse 1.5s ease-in-out infinite; }

//   /* fade-in for video switch */
//   @keyframes fadeIn { from{opacity:0} to{opacity:1} }
//   .video-fade { animation: fadeIn .35s ease; }
// `;

// /* ─────────────────────────────────────────────────────────────
//    COMPONENT
// ───────────────────────────────────────────────────────────── */
// export default function DemoPage() {
//   const { linkId } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeIdx, setActiveIdx] = useState(0);
//   const [videoKey, setVideoKey] = useState(0);
//   const playlistRef = useRef(null);

//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const togglePlay = useCallback(() => {
//     if (videoRef.current) {
//       if (videoRef.current.paused) {
//         videoRef.current.play().catch(e => console.log('Autoplay blocked:', e));
//       } else {
//         videoRef.current.pause();
//       }
//     }
//   }, []);

//   /* inject styles once */
//   useEffect(() => {
//     const el = document.createElement('style');
//     el.id = 'demo-page-styles';
//     el.textContent = STYLES;
//     document.head.appendChild(el);
//     return () => el.remove();
//   }, []);

//   /* fetch demo data */
//   useEffect(() => {
//     const fetchDemo = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/demo/${linkId}`);
//         setData(res.data.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Demo link not found or expired');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDemo();
//   }, [linkId]);

//   const videos = data?.videoIds || [];
//   const activeVideo = videos[activeIdx] || null;

//   const goTo = useCallback((idx) => {
//     if (idx < 0 || idx >= videos.length) return;
//     setActiveIdx(idx);
//     setVideoKey(k => k + 1);
//     // scroll sidebar item into view
//     if (playlistRef.current) {
//       const items = playlistRef.current.querySelectorAll('.demo-plist-item');
//       if (items[idx]) {
//         items[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
//       }
//     }
//   }, [videos.length]);

//   /* keyboard navigation */
//   useEffect(() => {
//     const handler = (e) => {
//       if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(activeIdx + 1);
//       if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(activeIdx - 1);
//     };
//     window.addEventListener('keydown', handler);
//     return () => window.removeEventListener('keydown', handler);
//   }, [activeIdx, goTo]);

//   /* ── States ── */
//   if (loading) {
//     return (
//       <div className="demo-loader">
//         <div className="demo-spinner" />
//       </div>
//     );
//   }

//   if (error || !data) {
//     return (
//       <div className="demo-error">
//         <div className="demo-error-icon">
//           <FiAlertCircle style={{ width: 32, height: 32 }} />
//         </div>
//         <h2>Link Unavailable</h2>
//         <p>{error || 'This demo link has expired or does not exist.'}</p>
//       </div>
//     );
//   }

//   /* pagination dots — show max 8, rest collapsed */
//   const MAX_DOTS = 8;
//   const showDots = videos.length <= MAX_DOTS ? videos.length : MAX_DOTS;

//   return (
//     <div className="demo-shell">

//       {/* ── TOP BAR ── */}
//       <header className="demo-topbar">
//         <img src={logo} alt="Techency" />
//         <span className="demo-badge">
//           <span className="pulse" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#ef4444', marginRight: 6 }} />
//           Client Presentation
//         </span>
//         <span className="demo-count-pill">
//           <FiVideo style={{ width: 12, height: 12 }} />
//           {activeIdx + 1} / {videos.length}
//         </span>
//       </header>

//       {/* ── BODY ── */}
//       <div className="demo-body">

//         {/* ── PLAYER PANEL ── */}
//         <div className="demo-player-panel">

//           {/* Intro */}
//           <div className="demo-intro">
//             <h1>Curated Video Portfolio</h1>
//             <p>
//               Prepared specially for you by{' '}
//               <span>{data.createdBy?.name || 'our team'}</span>.
//               Please review the selected videos below.
//             </p>
//           </div>

//           {/* Video Layer */}
//           {activeVideo && (
//             <div className="demo-video-wrap video-fade group relative bg-black rounded-2xl overflow-hidden shadow-2xl" key={videoKey}>

//               {/* LAYER 0: HTML5 Video Stream */}
//               <video
//                 ref={videoRef}
//                 src={`http://localhost:5000/api/videos/stream/${activeVideo.drive_file_id}`}
//                 autoPlay={isPlaying}
//                 controls={false} // Hidden native controls so we use custom ones
//                 playsInline
//                 className="absolute inset-0 w-full h-full object-contain z-0"
//                 onPlay={() => setIsPlaying(true)}
//                 onPause={() => setIsPlaying(false)}
//                 onEnded={() => setIsPlaying(false)}
//                 onTimeUpdate={() => {
//                   if (videoRef.current) {
//                     const bar = document.getElementById('custom-progress-bar');
//                     if (bar) {
//                       const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
//                       bar.style.width = `${p || 0}%`;
//                     }
//                   }
//                 }}
//               />
//               <div className="demo-video-glow" />

//               {/* LAYER 10: Click Shield (Toggles Play/Pause) */}
//               <div 
//                 className="absolute inset-0 z-10 bg-transparent cursor-pointer"
//                 onClick={togglePlay}
//                 title={isPlaying ? "Tap to pause" : "Tap to play"}
//               />

//               {/* LAYER 20: Persistent Custom UI */}
//               <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300">

//                 {/* Central Play/Pause Toggle */}
//                 <button 
//                   onClick={togglePlay}
//                   className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full backdrop-blur-md border border-white/30 transition-all transform hover:scale-105 pointer-events-auto ${
//                     isPlaying 
//                       ? 'bg-black/20 hover:bg-black/40 opacity-0 group-hover:opacity-100' 
//                       : 'bg-black/40 hover:bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
//                   }`}
//                 >
//                   {!isPlaying ? (
//                     <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M8 5v14l11-7z" />
//                     </svg>
//                   ) : (
//                     <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
//                     </svg>
//                   )}
//                 </button>

//                 {/* Persistent Bottom Control Bar */}
//                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2 pointer-events-auto">
//                   <div className="flex justify-between text-white text-sm font-medium tracking-wide drop-shadow-lg">
//                     <span>{activeVideo.title || 'Project Showcase'}</span>
//                   </div>

//                   {/* Real Custom Progress Bar tied to onTimeUpdate */}
//                   <div 
//                     className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer"
//                     onClick={(e) => {
//                       if (videoRef.current) {
//                         const rect = e.currentTarget.getBoundingClientRect();
//                         const clickX = e.clientX - rect.left;
//                         const newTime = (clickX / rect.width) * videoRef.current.duration;
//                         videoRef.current.currentTime = newTime;
//                       }
//                     }}
//                   >
//                      <div id="custom-progress-bar" className="h-full bg-red-500 w-0 rounded-full transition-all duration-75"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Meta + Nav */}
//           {activeVideo && (
//             <div className="demo-video-meta">
//               <div className="demo-meta-left">
//                 <h2>{activeVideo.title}</h2>
//                 <div>
//                   <span className="demo-cat-tag">
//                     <FiGrid style={{ width: 9, height: 9 }} />
//                     {activeVideo.category}
//                     {activeVideo.subcategory && ` · ${activeVideo.subcategory}`}
//                   </span>
//                 </div>
//               </div>
//               <div className="demo-nav-btns">
//                 <button
//                   className="demo-nav-btn"
//                   onClick={() => goTo(activeIdx - 1)}
//                   disabled={activeIdx === 0}
//                   title="Previous (←)"
//                 >
//                   <FiChevronLeft />
//                 </button>
//                 <button
//                   className="demo-nav-btn"
//                   onClick={() => goTo(activeIdx + 1)}
//                   disabled={activeIdx === videos.length - 1}
//                   title="Next (→)"
//                 >
//                   <FiChevronRight />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── SIDEBAR PLAYLIST ── */}
//         <aside className="demo-sidebar">
//           <div className="demo-sidebar-header">
//             <FiVideo />
//             Playlist
//           </div>

//           <div className="demo-playlist" ref={playlistRef}>
//             {videos.map((video, idx) => {
//               const isActive = idx === activeIdx;
//               return (
//                 <div
//                   key={video._id}
//                   className={`demo-plist-item${isActive ? ' active' : ''}`}
//                   onClick={() => goTo(idx)}
//                   role="button"
//                   tabIndex={0}
//                   onKeyDown={e => e.key === 'Enter' && goTo(idx)}
//                 >
//                   <div className="demo-plist-thumb">
//                     {video.thumbnail_url
//                       ? <img src={video.thumbnail_url} alt={video.title} loading="lazy" />
//                       : <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                         <FiVideo style={{ color: '#374151', width: 18, height: 18 }} />
//                       </div>
//                     }
//                     <div className="demo-plist-play">
//                       <FiPlayCircle />
//                     </div>
//                     <span className="demo-plist-num">{idx + 1}</span>
//                   </div>
//                   <div className="demo-plist-info">
//                     <h5>{video.title}</h5>
//                     <span>{video.category}{video.subcategory ? ` · ${video.subcategory}` : ''}</span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Pagination dots */}
//           {videos.length > 1 && (
//             <div className="demo-pagination">
//               {Array.from({ length: showDots }).map((_, i) => {
//                 const targetIdx = videos.length <= MAX_DOTS
//                   ? i
//                   : Math.round((i / (MAX_DOTS - 1)) * (videos.length - 1));
//                 const isActive = videos.length <= MAX_DOTS
//                   ? activeIdx === i
//                   : Math.round((activeIdx / (videos.length - 1)) * (MAX_DOTS - 1)) === i;
//                 return (
//                   <button
//                     key={i}
//                     className={`demo-dot${isActive ? ' active' : ''}`}
//                     onClick={() => goTo(targetIdx)}
//                     title={`Video ${targetIdx + 1}`}
//                   />
//                 );
//               })}
//             </div>
//           )}
//         </aside>
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FiPlayCircle, FiChevronLeft, FiChevronRight,
  FiAlertCircle, FiGrid, FiVideo
} from 'react-icons/fi';
import logo from "../../../public/logo.png";

/* ─────────────────────────────────────────────────────────────
   STYLES  (Injected once)
───────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    overflow: hidden;
    background: #060608;
    font-family: 'Inter', sans-serif;
    color: #fff;
  }

  .demo-shell {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow: hidden;
  }

  .demo-topbar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background: rgba(6,6,8,.92);
    border-bottom: 1px solid rgba(255,255,255,.06);
    backdrop-filter: blur(12px);
    z-index: 10;
  }
  .demo-topbar img { height: 32px; object-fit: contain; }
  .demo-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(220,38,38,.15);
    border: 1px solid rgba(220,38,38,.35);
    color: #f87171;
  }
  .demo-count-pill {
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.08);
    padding: 4px 12px;
    border-radius: 20px;
    display: flex; align-items: center; gap: 6px;
  }
  .demo-count-pill svg { color: #ef4444; }

  .demo-body {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 260px;
    grid-template-rows: 1fr;
    gap: 0;
    overflow: hidden;
    min-height: 0;
  }

  .demo-player-panel {
    display: flex;
    flex-direction: column;
    padding: 16px 16px 16px 20px;
    gap: 12px;
    overflow: hidden;
    min-width: 0;
  }

  .demo-intro { flex-shrink: 0; }
  .demo-intro h1 {
    font-size: clamp(16px, 2.2vw, 22px);
    font-weight: 800;
    line-height: 1.2;
    background: linear-gradient(135deg, #fff 40%, #9ca3af);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .demo-intro p { font-size: 12px; color: #6b7280; margin-top: 4px; }
  .demo-intro span { color: #e5e7eb; font-weight: 600; }

  .demo-video-wrap {
    flex: 1;
    position: relative;
    background: #000;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.07);
    box-shadow: 0 20px 60px rgba(0,0,0,.7);
    min-height: 0;
  }
  .demo-video-glow {
    position: absolute;
    inset: -1px;
    border-radius: 16px;
    pointer-events: none;
    box-shadow: inset 0 0 0 1px rgba(220,38,38,.2);
    z-index: 5;
  }

  .demo-video-meta {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .demo-meta-left { min-width: 0; }
  .demo-meta-left h2 {
    font-size: clamp(13px, 1.6vw, 17px);
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .demo-cat-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: #f87171;
    background: rgba(239,68,68,.1);
    border: 1px solid rgba(239,68,68,.2);
    padding: 2px 8px;
    border-radius: 4px;
    margin-top: 4px;
  }

  .demo-nav-btns { display: flex; gap: 8px; flex-shrink: 0; }
  .demo-nav-btn {
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    color: #fff;
    cursor: pointer;
    transition: all .2s;
  }
  .demo-nav-btn:hover:not(:disabled) {
    background: #ef4444;
    border-color: #ef4444;
    box-shadow: 0 0 16px rgba(239,68,68,.4);
  }
  .demo-nav-btn:disabled { opacity: .3; cursor: default; }

  .demo-sidebar {
    display: flex;
    flex-direction: column;
    border-left: 1px solid rgba(255,255,255,.06);
    background: rgba(8,8,12,.6);
    overflow: hidden;
  }
  .demo-sidebar-header {
    flex-shrink: 0;
    padding: 14px 16px 10px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #6b7280;
    border-bottom: 1px solid rgba(255,255,255,.05);
    display: flex; align-items: center; gap: 8px;
  }
  .demo-sidebar-header svg { color: #ef4444; }

  .demo-playlist {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px;
    scrollbar-width: thin;
    scrollbar-color: rgba(239,68,68,.3) transparent;
  }
  .demo-playlist::-webkit-scrollbar { width: 3px; }
  .demo-playlist::-webkit-scrollbar-track { background: transparent; }
  .demo-playlist::-webkit-scrollbar-thumb { background: rgba(239,68,68,.3); border-radius: 10px; }

  .demo-plist-item {
    display: flex;
    gap: 10px;
    padding: 8px;
    border-radius: 10px;
    cursor: pointer;
    transition: all .18s;
    border: 1px solid transparent;
    margin-bottom: 4px;
    position: relative;
  }
  .demo-plist-item:hover { background: rgba(255,255,255,.04); }
  .demo-plist-item.active {
    background: rgba(239,68,68,.08);
    border-color: rgba(239,68,68,.25);
  }
  .demo-plist-thumb {
    width: 80px; height: 52px;
    border-radius: 7px;
    overflow: hidden;
    flex-shrink: 0;
    background: #111;
    position: relative;
  }
  .demo-plist-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
  .demo-plist-item:hover .demo-plist-thumb img,
  .demo-plist-item.active .demo-plist-thumb img { transform: scale(1.06); }
  .demo-plist-play {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,.4);
    transition: opacity .2s;
  }
  .demo-plist-play svg { color: #fff; width: 20px; height: 20px; }
  .demo-plist-item.active .demo-plist-play { background: rgba(239,68,68,.35); }
  .demo-plist-info { flex: 1; min-width: 0; }
  .demo-plist-info h5 {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: #e5e7eb;
    transition: color .2s;
  }
  .demo-plist-item.active .demo-plist-info h5 { color: #fca5a5; }
  .demo-plist-info span { font-size: 9px; color: #6b7280; margin-top: 3px; display: block; }
  .demo-plist-num {
    position: absolute;
    top: 6px; left: 6px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: rgba(0,0,0,.75);
    font-size: 9px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    color: #9ca3af;
  }
  .demo-plist-item.active .demo-plist-num { background: #ef4444; color: #fff; }

  .demo-pagination {
    flex-shrink: 0;
    padding: 10px 16px;
    border-top: 1px solid rgba(255,255,255,.05);
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .demo-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,.15);
    cursor: pointer;
    transition: all .2s;
    border: none;
  }
  .demo-dot.active { background: #ef4444; width: 18px; border-radius: 3px; }
  .demo-dot:hover:not(.active) { background: rgba(255,255,255,.35); }

  /* ── MOBILE layout (≤ 767px) ── */
  @media (max-width: 767px) {
    html, body, #root { overflow: hidden; }
    .demo-shell { height: 100dvh; display: flex; flex-direction: column; overflow: hidden; }
    .demo-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .demo-topbar { padding: 12px 14px 8px; justify-content: center; position: relative; border-bottom: none; background: transparent; display: flex; flex-direction: column; gap: 8px; align-items: center; flex-shrink: 0;}
    .demo-topbar img { height: 28px; }
    .demo-badge { position: static; transform: none; font-size: 10px; padding: 4px 16px; border: none; background: rgba(220,38,38,.15); color: #f87171; }
    .demo-count-pill { display: none; }
    .demo-intro { text-align: center; margin: 4px 0 12px; flex-shrink: 0; }
    .demo-intro h1 { font-size: 20px; font-weight: 900; }
    .demo-intro p { font-size: 11px; margin-top: 4px; color: #9ca3af; }
    .demo-player-panel { flex: 1; padding: 0 12px; display: flex; flex-direction: column; align-items: center; min-height: 0; }

    .demo-video-wrap {
      flex: 1;
      width: 100%;
      min-height: 0;
      max-width: 400px;
      position: relative;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,.5);
      margin-bottom: 12px;
      overflow: hidden;
    }

    .demo-video-meta { display: none; }
    .demo-sidebar-header { display: none; }
    .demo-plist-info { display: none; }
    .demo-plist-num { display: none; }

    .demo-sidebar { flex-shrink: 0; border: none; background: transparent; display: flex; flex-direction: column; align-items: center; padding-bottom: 16px; }
    .demo-playlist { display: flex; flex-direction: row; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; padding: 8px 16px; gap: 12px; scrollbar-width: none; width: 100%; justify-content: center; }
    .demo-playlist::-webkit-scrollbar { display: none; }
    .demo-plist-item { flex-shrink: 0; width: 52px; height: 52px; padding: 0; margin: 0; border-radius: 50%; border: 2px solid transparent; background: transparent; }
    .demo-plist-item.active { border-color: #ef4444; background: transparent; box-shadow: 0 0 12px rgba(239,68,68,.4); transform: scale(1.1); }
    .demo-plist-item:hover { background: transparent; }
    .demo-plist-thumb { width: 100%; height: 100%; border-radius: 50%; }
    .demo-plist-thumb img { border-radius: 50%; object-fit: cover; }
    .demo-plist-play { display: none; }
    .demo-pagination { padding: 4px 12px 0px; border: none; }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .demo-body { grid-template-columns: 1fr 220px; }
    .demo-plist-thumb { width: 68px; height: 44px; }
  }

  .demo-loader { height: 100dvh; display: flex; align-items: center; justify-content: center; background: #060608; }
  .demo-spinner { width: 48px; height: 48px; border: 3px solid rgba(239,68,68,.2); border-top-color: #ef4444; border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .demo-error { height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #060608; gap: 16px; text-align: center; padding: 24px; }
  .demo-error-icon { width: 64px; height: 64px; background: rgba(239,68,68,.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ef4444; }
  .demo-error h2 { font-size: 22px; font-weight: 800; }
  .demo-error p { font-size: 14px; color: #6b7280; max-width: 320px; }

  .pulse { animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .video-fade { animation: fadeIn .35s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
`;

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function DemoPage() {
  const { linkId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [videoKey, setVideoKey] = useState(0);
  const playlistRef = useRef(null);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // সম্পূর্ণ বাটন ও ক্লিক ট্র্যাকিং নিখুঁত করার প্লে/পজ হ্যান্ডলার
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log('Autoplay blocked or stream delayed:', e));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  /* Inject Styles */
  useEffect(() => {
    const el = document.createElement('style');
    el.id = 'demo-page-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  /* Fetch Data */
  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${baseUrl}/demo/${linkId}`);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Demo link not found or expired');
      } finally {
        setLoading(false);
      }
    };
    fetchDemo();
  }, [linkId]);

  const videos = data?.videoIds || [];
  const activeVideo = videos[activeIdx] || null;

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= videos.length) return;
    setActiveIdx(idx);
    setIsPlaying(false); // নতুন ভিডিওতে যাওয়ার সময় প্লে স্টেট রিসেট
    setVideoKey(k => k + 1);

    if (playlistRef.current) {
      const items = playlistRef.current.querySelectorAll('.demo-plist-item');
      if (items[idx]) {
        items[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }, [videos.length]);

  /* Keyboard Navigation */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(activeIdx + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(activeIdx - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIdx, goTo]);

  if (loading) {
    return (
      <div className="demo-loader">
        <div className="demo-spinner" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="demo-error">
        <div className="demo-error-icon">
          <FiAlertCircle style={{ width: 32, height: 32 }} />
        </div>
        <h2>Link Unavailable</h2>
        <p>{error || 'This demo link has expired or does not exist.'}</p>
      </div>
    );
  }

  const MAX_DOTS = 8;
  const showDots = videos.length <= MAX_DOTS ? videos.length : MAX_DOTS;

  return (
    <div className="demo-shell">
      {/* ── TOP BAR ── */}
      <header className="demo-topbar">
        <img src={logo} alt="Techency" />
        <span className="demo-badge">
          <span className="pulse" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#ef4444', marginRight: 6 }} />
          Client Presentation
        </span>
        <span className="demo-count-pill">
          <FiVideo style={{ width: 12, height: 12 }} />
          {activeIdx + 1} / {videos.length}
        </span>
      </header>

      {/* ── BODY GRID ── */}
      <div className="demo-body">
        {/* ── PLAYER PANEL ── */}
        <div className="demo-player-panel">
          {/* Intro */}
          <div className="demo-intro">
            <h1>Curated Video Portfolio</h1>
            <p>
              Prepared specially for you by{' '}
              <span>{data.createdBy?.name || 'our team'}</span>.
              Please review the selected videos below.
            </p>
          </div>

          {/* Video Layer Section */}
          {activeVideo && (
            <div className="demo-video-wrap video-fade group relative bg-black rounded-2xl overflow-hidden shadow-2xl" key={videoKey}>

              {/* LAYER 0: Pure HTML5 Streaming Video Node */}
              <video
                ref={videoRef}
                src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/videos/stream/${activeVideo.drive_file_id}`}
                autoPlay={isPlaying}
                controls={false} // কোনো ডিফল্ট বা গুগলের বাটন আসবে না
                playsInline // মোবাইলে জোর করে ফুলস্ক্রিন প্লেয়ার আসা ব্লক করবে
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-contain z-0"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    const bar = document.getElementById('custom-progress-bar');
                    if (bar) {
                      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                      bar.style.width = `${p || 0}%`;
                    }
                  }
                }}
              />
              <div className="demo-video-glow" />

              {/* LAYER 10: Click Shield (ভিডিওর ওপর ক্লিক করলে প্লে/পজ হবে) */}
              <div
                className="absolute inset-0 z-10 bg-transparent cursor-pointer"
                onClick={togglePlay}
              />

              {/* LAYER 20: Persistent Custom UI (১০০% কাস্টম থিম) */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">

                {/* Central Play/Pause Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // ক্লিকে যেন ডাবল ইভেন্ট না ট্র্রিগার হয়
                    togglePlay();
                  }}
                  className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full backdrop-blur-md border border-white/30 transition-all transform hover:scale-105 pointer-events-auto ${isPlaying
                      ? 'bg-black/20 hover:bg-black/40 opacity-0 group-hover:opacity-100'
                      : 'bg-black/40 hover:bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.5)] opacity-100'
                    }`}
                >
                  {!isPlaying ? (
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </button>

                {/* Bottom Progress and Info Panel */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2 pointer-events-auto">
                  <div className="flex justify-between text-white text-sm font-medium tracking-wide drop-shadow-lg">
                    <span>{activeVideo.title || 'Project Showcase'}</span>
                  </div>

                  {/* Custom Progress Bar Click to Seek Handler */}
                  <div
                    className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current && videoRef.current.duration) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const newTime = (clickX / rect.width) * videoRef.current.duration;
                        videoRef.current.currentTime = newTime;
                      }
                    }}
                  >
                    <div id="custom-progress-bar" className="h-full bg-red-500 w-0 rounded-full transition-all duration-75"></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Meta Data & Navigation Panel */}
          {activeVideo && (
            <div className="demo-video-meta">
              <div className="demo-meta-left">
                <h2>{activeVideo.title}</h2>
                <div>
                  <span className="demo-cat-tag">
                    <FiGrid style={{ width: 9, height: 9 }} />
                    {activeVideo.category}
                    {activeVideo.subcategory && ` · ${activeVideo.subcategory}`}
                  </span>
                </div>
              </div>
              <div className="demo-nav-btns">
                <button
                  className="demo-nav-btn"
                  onClick={() => goTo(activeIdx - 1)}
                  disabled={activeIdx === 0}
                  title="Previous (←)"
                >
                  <FiChevronLeft />
                </button>
                <button
                  className="demo-nav-btn"
                  onClick={() => goTo(activeIdx + 1)}
                  disabled={activeIdx === videos.length - 1}
                  title="Next (→)"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── SIDEBAR PLAYLIST ── */}
        <aside className="demo-sidebar">
          <div className="demo-sidebar-header">
            <FiVideo />
            Playlist
          </div>

          <div className="demo-playlist" ref={playlistRef}>
            {videos.map((video, idx) => {
              const isActive = idx === activeIdx;
              return (
                <div
                  key={video._id}
                  className={`demo-plist-item${isActive ? ' active' : ''}`}
                  onClick={() => goTo(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && goTo(idx)}
                >
                  <div className="demo-plist-thumb">
                    {video.thumbnail_url
                      ? <img src={video.thumbnail_url} alt={video.title} loading="lazy" />
                      : <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiVideo style={{ color: '#374151', width: 18, height: 18 }} />
                      </div>
                    }
                    <div className="demo-plist-play">
                      <FiPlayCircle />
                    </div>
                    <span className="demo-plist-num">{idx + 1}</span>
                  </div>
                  <div className="demo-plist-info">
                    <h5>{video.title}</h5>
                    <span>{video.category}{video.subcategory ? ` · ${video.subcategory}` : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination dots */}
          {videos.length > 1 && (
            <div className="demo-pagination">
              {Array.from({ length: showDots }).map((_, i) => {
                const targetIdx = videos.length <= MAX_DOTS
                  ? i
                  : Math.round((i / (MAX_DOTS - 1)) * (videos.length - 1));
                const isActive = videos.length <= MAX_DOTS
                  ? activeIdx === i
                  : Math.round((activeIdx / (videos.length - 1)) * (MAX_DOTS - 1)) === i;
                return (
                  <button
                    key={i}
                    className={`demo-dot${isActive ? ' active' : ''}`}
                    onClick={() => goTo(targetIdx)}
                    title={`Video ${targetIdx + 1}`}
                  />
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}