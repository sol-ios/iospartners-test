/* ============================================================
   IOSsoft — world geometry engine
   - Continent polygons (lng,lat) → dotted land points
   - Hero: interactive rotating 3D dotted globe (drag + auto-spin)
   - Impact: flat equirectangular dotted map w/ glowing hubs + labels
   ============================================================ */
(function(){
'use strict';

/* ---- Continent outlines [lng,lat], coarse but recognizable ---- */
var LAND = {
  northAmerica: [[-159,71],[-156,71],[-141,70],[-128,70],[-114,72],[-100,71],[-94,69],[-90,73],[-83,73],[-78,69],[-77,63],[-82,61],[-72,60],[-64,61],[-56,52],[-67,50],[-65,45],[-70,42],[-74,40],[-75,36],[-81,31],[-80,26],[-81,25],[-84,30],[-90,29],[-94,29],[-97,28],[-97,22],[-95,18],[-91,18],[-88,21],[-87,16],[-83,9],[-77,8],[-79,14],[-86,16],[-92,15],[-105,20],[-113,28],[-117,32],[-122,37],[-124,43],[-124,48],[-131,53],[-138,58],[-148,60],[-153,59],[-162,59],[-166,66]],
  greenland: [[-46,60],[-52,65],[-55,69],[-60,73],[-58,77],[-50,80],[-38,83],[-25,81],[-19,77],[-21,72],[-29,69],[-38,66]],
  southAmerica: [[-80,9],[-76,9],[-71,11],[-62,10],[-52,5],[-50,0],[-44,-2],[-39,-4],[-35,-7],[-38,-13],[-39,-18],[-48,-25],[-54,-34],[-58,-39],[-63,-41],[-65,-45],[-69,-51],[-74,-53],[-72,-50],[-71,-45],[-73,-42],[-73,-37],[-71,-30],[-70,-23],[-71,-18],[-75,-14],[-78,-8],[-81,-5],[-81,-2],[-80,3],[-77,6]],
  africa: [[-16,15],[-17,21],[-12,27],[-6,31],[2,34],[10,37],[15,32],[20,32],[25,32],[31,31],[34,28],[36,22],[39,15],[43,11],[48,8],[51,11],[44,2],[41,-3],[40,-9],[36,-16],[33,-22],[28,-30],[24,-34],[20,-35],[17,-29],[14,-22],[13,-16],[12,-10],[9,-2],[9,4],[5,5],[-2,5],[-8,4],[-12,8]],
  europe: [[-10,37],[-10,44],[-2,44],[-2,49],[-5,50],[-1,52],[3,52],[8,54],[8,58],[12,60],[12,65],[18,69],[26,71],[30,66],[28,60],[24,58],[28,56],[22,55],[14,54],[12,50],[14,46],[20,46],[24,42],[26,41],[20,40],[14,42],[10,44],[3,43],[-3,40],[-9,40]],
  asia: [[28,41],[40,46],[48,47],[50,46],[48,41],[52,40],[55,42],[60,44],[62,40],[68,40],[74,38],[78,35],[80,30],[88,28],[92,28],[97,28],[98,24],[100,21],[106,21],[108,16],[109,11],[105,9],[103,12],[100,13],[99,8],[98,8],[97,16],[94,16],[90,22],[88,22],[83,18],[80,13],[77,8],[76,15],[72,20],[70,21],[67,24],[61,25],[57,25],[57,22],[54,17],[48,13],[44,12],[42,15],[39,21],[35,28],[36,36],[40,38],[36,42],[40,44],[48,42],[50,46],[54,52],[60,56],[68,56],[62,62],[68,68],[74,73],[90,75],[105,78],[115,74],[130,73],[142,73],[160,70],[170,68],[178,68],[170,60],[162,60],[155,57],[160,53],[156,51],[145,44],[140,46],[135,46],[132,43],[127,42],[122,39],[122,31],[120,25],[110,21],[108,21]],
  india: [[68,24],[72,20],[73,16],[76,9],[78,8],[80,13],[83,18],[88,22],[90,22],[88,26],[80,28],[74,24]],
  arabia: [[35,28],[39,21],[43,13],[48,13],[54,17],[57,22],[57,25],[51,25],[48,30],[43,30],[40,24],[36,28]],
  indonesia: [[95,5],[100,2],[104,-2],[106,-6],[112,-8],[118,-9],[125,-9],[131,-8],[141,-9],[141,-3],[134,-1],[128,1],[125,5],[120,0],[117,-3],[114,-3],[110,-3],[106,1],[100,5]],
  australia: [[114,-22],[114,-26],[116,-31],[118,-35],[124,-34],[130,-32],[135,-35],[138,-35],[141,-38],[146,-39],[150,-38],[153,-31],[153,-27],[148,-20],[143,-12],[141,-13],[137,-12],[132,-12],[129,-15],[125,-14],[122,-18],[118,-20]],
  japan: [[130,31],[132,34],[136,35],[140,36],[142,40],[141,43],[144,44],[140,41],[137,37],[133,34]],
  uk: [[-5,50],[-3,53],[-3,55],[-6,58],[-5,56],[-2,56],[0,53],[1,52],[-4,50]],
  madagascar: [[44,-16],[46,-16],[50,-15],[49,-20],[47,-25],[45,-23],[44,-20]],
  newZealand: [[167,-46],[170,-44],[173,-41],[175,-37],[178,-38],[174,-41],[172,-44]]
};

/* point-in-polygon (ray cast) */
function inPoly(lng,lat,poly){
  var inside=false, n=poly.length, j=n-1;
  for(var i=0;i<n;i++){
    var xi=poly[i][0], yi=poly[i][1], xj=poly[j][0], yj=poly[j][1];
    if(((yi>lat)!==(yj>lat)) && (lng < (xj-xi)*(lat-yi)/(yj-yi)+xi)) inside=!inside;
    j=i;
  }
  return inside;
}
function isLand(lng,lat){
  for(var k in LAND){ if(inPoly(lng,lat,LAND[k])) return true; }
  return false;
}

/* Build dotted land points on a lat/lng grid (equal-area-ish: skip by cos lat) */
function buildDots(step){
  var pts=[];
  for(var lat=-78; lat<=83; lat+=step){
    var lngStep = step / Math.max(0.18, Math.cos(lat*Math.PI/180));
    for(var lng=-180; lng<=180; lng+=lngStep){
      if(isLand(lng,lat)) pts.push([lng,lat]);
    }
  }
  return pts;
}

/* IOS presence hubs (real-ish coords) */
var HUBS = [
  {name:'Washington D.C.', lng:-77.0, lat:38.9},
  {name:'Bogotá',          lng:-74.1, lat:4.6},
  {name:'London',          lng:-0.1,  lat:51.5},
  {name:'Lisbon',          lng:-9.1,  lat:38.7},
  {name:'Nairobi',         lng:36.8,  lat:-1.3},
  {name:'Riyadh',          lng:46.7,  lat:24.7},
  {name:'New Delhi',       lng:77.2,  lat:28.6},
  {name:'Singapore',       lng:103.8, lat:1.35},
  {name:'Jakarta',         lng:106.8, lat:-6.2},
  {name:'Sydney',          lng:151.2, lat:-33.9}
];

var ACCENT = function(){ return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#82C44D'; };
function accentRGB(){ return getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '130,196,77'; }

/* Resilient render loop: immediate first paint + rAF, with a setInterval
   fallback for environments where rAF is throttled (hidden/background iframes).
   Pauses entirely when the canvas is scrolled off-screen or the tab is
   backgrounded — saved CPU/battery for animations nobody is looking at. */
function startLoop(draw, canvas){
  draw();                              // guaranteed first frame
  var visible=true;                    // in-viewport (IntersectionObserver)
  var active=(document.visibilityState!=='hidden'); // tab foregrounded
  var rafId=null, lastT=0;
  var MIN_DT=1000/50;                  // cap ~50fps — keeps CPU sane with several canvases animating
  function running(){ return visible && active; }
  function frame(ts){
    rafId=null;
    if(!running()) return;             // stop scheduling entirely while hidden/off-screen
    if(!lastT || ts-lastT>=MIN_DT){ lastT=ts; draw(); }
    rafId=requestAnimationFrame(frame);
  }
  function kick(){
    if(running() && rafId===null) rafId=requestAnimationFrame(frame);
  }
  kick();
  // lightweight fallback for environments where rAF is throttled/suspended
  // (e.g. hidden iframes) — only fires if the rAF loop isn't already running.
  setInterval(function(){ if(running() && rafId===null) draw(); }, 200);

  document.addEventListener('visibilitychange', function(){
    active=(document.visibilityState!=='hidden');
    if(running()){ draw(); kick(); }
  });
  if(canvas && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        visible=e.isIntersecting;
        if(running()){ draw(); kick(); }
      });
    }, {rootMargin:'150px'});
    io.observe(canvas);
  }
}

/* ============================================================
   3D GLOBE  (hero)
   ============================================================ */
function initGlobe(canvas){
  var ctx = canvas.getContext('2d');
  var dots = buildDots(3.2);
  var DPR = Math.min(window.devicePixelRatio||1, 2);
  var W, H, R, cx, cy;
  function resize(){
    var rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = W*DPR; canvas.height = H*DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
    cx = W/2; cy = H/2; R = Math.min(W,H)*0.46;
  }
  resize();
  window.addEventListener('resize', resize);

  var rotY = -1.2, rotX = 0.0;   // yaw, tilt — equator-level view
  var spin = 0.0016;
  var dragging=false, autoOK=true, lastX, lastY, vY=0;
  var gpts=[], hoverG=-1;
  var gtip=document.createElement('div');
  gtip.style.cssText='position:absolute;display:none;background:rgba(3,16,31,.94);border:1px solid rgba(130,196,77,.5);color:#eaf3fb;font-family:Montserrat,sans-serif;font-size:11px;font-weight:600;padding:8px 13px;border-radius:5px;pointer-events:none;z-index:20;white-space:nowrap;line-height:1.5;box-shadow:0 4px 20px rgba(0,0,0,.4)';
  var gwrap=canvas.parentElement;
  if(gwrap){ if(getComputedStyle(gwrap).position==='static') gwrap.style.position='relative'; gwrap.appendChild(gtip); }

  function project(lng,lat){
    var la = lat*Math.PI/180, lo = lng*Math.PI/180 + rotY;
    var x = Math.cos(la)*Math.sin(lo);
    var y = Math.sin(la);
    var z = Math.cos(la)*Math.cos(lo);
    // tilt around X
    var y2 = y*Math.cos(rotX) - z*Math.sin(rotX);
    var z2 = y*Math.sin(rotX) + z*Math.cos(rotX);
    return {x:cx + x*R, y:cy - y2*R, z:z2};
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    var rgb = accentRGB(), acc = ACCENT();
    // sphere atmosphere
    var grad = ctx.createRadialGradient(cx-R*0.3,cy-R*0.3,R*0.2, cx,cy,R*1.15);
    grad.addColorStop(0,'rgba('+rgb+',0.10)');
    grad.addColorStop(0.6,'rgba(24,95,165,0.10)');
    grad.addColorStop(1,'rgba(3,16,31,0)');
    ctx.fillStyle=grad;
    ctx.beginPath(); ctx.arc(cx,cy,R*1.12,0,Math.PI*2); ctx.fill();
    // limb
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.strokeStyle='rgba('+rgb+',0.18)'; ctx.lineWidth=1; ctx.stroke();

    // graticule (meridians + parallels)
    ctx.strokeStyle='rgba(140,175,210,0.07)'; ctx.lineWidth=1;
    for(var mer=-180; mer<180; mer+=30){
      ctx.beginPath(); var started=false;
      for(var la=-90; la<=90; la+=6){
        var p=project(mer,la); if(p.z<0){started=false;continue;}
        if(!started){ctx.moveTo(p.x,p.y);started=true;} else ctx.lineTo(p.x,p.y);
      }
      ctx.stroke();
    }
    for(var par=-60; par<=60; par+=30){
      ctx.beginPath(); var st2=false;
      for(var lo2=-180; lo2<=180; lo2+=6){
        var p2=project(lo2,par); if(p2.z<0){st2=false;continue;}
        if(!st2){ctx.moveTo(p2.x,p2.y);st2=true;} else ctx.lineTo(p2.x,p2.y);
      }
      ctx.stroke();
    }

    // land dots (only front hemisphere)
    for(var i=0;i<dots.length;i++){
      var p=project(dots[i][0],dots[i][1]);
      if(p.z<=0) continue;
      var depth = 0.35 + 0.65*p.z;        // fade toward limb
      var rad = 0.7 + 1.0*p.z;
      ctx.beginPath();
      ctx.fillStyle='rgba(150,185,220,'+(0.18+0.5*depth)+')';
      ctx.arc(p.x,p.y,rad,0,Math.PI*2); ctx.fill();
    }

    // project country dots (or HUBS fallback)
    var t = performance.now()*0.002;
    var pdata = window.__iosProjectData;
    var pCC   = window.__iosCC;
    if(pdata && pCC){
      gpts=[];
      var pkeys = Object.keys(pdata);
      for(var ci=0;ci<pkeys.length;ci++){
        var pname=pkeys[ci];
        var pcoord=pCC[pname]; if(!pcoord) continue;
        var pp=project(pcoord[1],pcoord[0]);
        if(pp.z<=0) continue;
        var pcnt=(pdata[pname]||[]).length;
        var af=window.__iosActiveFilter;
        var matches = !af || af==='All' || (pdata[pname]||[]).some(function(p){return p.area===af;});
        var dim = matches?1:0.16;
        var pr=Math.max(2.5,Math.min(7,2.5+Math.log(pcnt+1)*1.2))*pp.z;
        var ppulse=0.5+0.5*Math.sin(t*1.3+ci*0.37);
        var isAct=(pname===window.__iosActiveCountry);
        if(matches) gpts.push({x:pp.x,y:pp.y,r:pr,count:pcnt,country:pname});
        var isHovG=(pname===hoverG);
        if(isHovG){ ctx.beginPath(); ctx.strokeStyle=acc; ctx.lineWidth=1.2; ctx.globalAlpha=0.7; ctx.arc(pp.x,pp.y,pr+6,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1; }
        ctx.beginPath();
        ctx.fillStyle='rgba('+rgb+','+((isAct?0.22:0.07+0.06*ppulse)*dim)+')';
        ctx.arc(pp.x,pp.y,pr*2.5+3*ppulse,0,Math.PI*2); ctx.fill();
        ctx.beginPath();
        ctx.globalAlpha=dim;
        ctx.fillStyle=isAct?acc:'rgba('+rgb+',0.72)';
        ctx.shadowColor=acc; ctx.shadowBlur=(isAct?18:6)*dim;
        ctx.arc(pp.x,pp.y,pr,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
        ctx.globalAlpha=1;
      }
    } else {
      for(var h=0;h<HUBS.length;h++){
        var hp=project(HUBS[h].lng,HUBS[h].lat);
        if(hp.z<=0) continue;
        var pulse=0.5+0.5*Math.sin(t+h);
        ctx.beginPath();
        ctx.fillStyle='rgba('+rgb+','+(0.10+0.10*pulse)+')';
        ctx.arc(hp.x,hp.y,5+5*pulse,0,Math.PI*2); ctx.fill();
        ctx.beginPath();
        ctx.fillStyle=acc; ctx.shadowColor=acc; ctx.shadowBlur=10;
        ctx.arc(hp.x,hp.y,2.2+0.8*hp.z,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      }
    }

    // auto spin / inertia
    if(!dragging){
      rotY += (autoOK? spin : 0) + vY;
      vY *= 0.93;
      if(Math.abs(vY)<0.0001) vY=0;
    }
    // expose state for external click/hover (project-map.js)
    IOSWorld._lastGlobeState={rotY:rotY,rotX:rotX,cx:cx,cy:cy,R:R};
  }
  // expose land dots for modal flat map
  IOSWorld.landDots = dots;
  startLoop(draw, canvas);

  // drag to spin
  function down(e){ dragging=true; autoOK=false; lastX=(e.touches?e.touches[0].clientX:e.clientX); lastY=(e.touches?e.touches[0].clientY:e.clientY); }
  function move(e){
    if(!dragging) return;
    var x=(e.touches?e.touches[0].clientX:e.clientX), y=(e.touches?e.touches[0].clientY:e.clientY);
    var dx=(x-lastX), dy=(y-lastY);
    rotY += dx*0.006; vY = dx*0.006*0.25;
    rotX += dy*0.004; rotX=Math.max(-0.9,Math.min(0.9,rotX));
    lastX=x; lastY=y;
  }
  function up(){ dragging=false; setTimeout(function(){autoOK=true;}, 2500); }
  canvas.addEventListener('mousedown',down); window.addEventListener('mousemove',move); window.addEventListener('mouseup',up);
  canvas.addEventListener('touchstart',down,{passive:true}); window.addEventListener('touchmove',move,{passive:true}); window.addEventListener('touchend',up);

  // hover tooltip: country name + project count
  canvas.addEventListener('mousemove',function(e){
    if(dragging){ gtip.style.display='none'; hoverG=-1; return; }
    var r2=canvas.getBoundingClientRect(), mx=e.clientX-r2.left, my=e.clientY-r2.top;
    var best=null, bestD=Infinity;
    for(var i=0;i<gpts.length;i++){
      var g=gpts[i], dx=mx-g.x, dy=my-g.y, d2=dx*dx+dy*dy;
      var hit=g.r+10;
      if(d2<hit*hit && d2<bestD){ bestD=d2; best=g; }
    }
    if(best){
      hoverG=best.country;
      gtip.innerHTML='<b>'+best.country+'</b>&nbsp;<span style="font-weight:400;font-size:10px;color:rgba(207,224,239,0.72)">'+best.count+' project'+(best.count===1?'':'s')+'</span><div style="font-family:JetBrains Mono,monospace;font-size:9px;color:rgba(130,196,77,.55);margin-top:4px;letter-spacing:.06em">Click to explore \u2192</div>';
      gtip.style.display='block';
      var tw=gtip.offsetWidth||160;
      gtip.style.left=Math.max(4,Math.min(best.x+16,W-tw-4))+'px';
      gtip.style.top=Math.max(4,best.y-52)+'px';
    } else { hoverG=-1; gtip.style.display='none'; }
  });
  canvas.addEventListener('mouseleave',function(){ hoverG=-1; gtip.style.display='none'; });
}

/* ============================================================
   FLAT MAP  (impact section) — equirectangular dots + animated hubs
   ============================================================ */
function initFlatMap(canvas, opts){
  opts = opts||{};
  var ctx = canvas.getContext('2d');
  var dots = buildDots(2.6);
  var DPR = Math.min(window.devicePixelRatio||1, 2);
  var W,H, hoverHub=-1;
  var hubPts=[];
  function resize(){
    var rect=canvas.getBoundingClientRect();
    W=rect.width; H=rect.height;
    canvas.width=W*DPR; canvas.height=H*DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  resize(); window.addEventListener('resize', resize);

  function px(lng,lat){
    var padX=W*0.04, padY=H*0.06;
    return {
      x: padX + (lng+180)/360 * (W-2*padX),
      y: padY + (90-lat)/180 * (H-2*padY)
    };
  }

  function bezPt(t, x0,y0,cx,cy,x1,y1){
    var m=1-t;
    return {x:m*m*x0+2*m*t*cx+t*t*x1, y:m*m*y0+2*m*t*cy+t*t*y1};
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    var rgb=accentRGB(), acc=ACCENT();
    var now=performance.now()*0.001;

    /* — land dots — */
    for(var i=0;i<dots.length;i++){
      var p=px(dots[i][0],dots[i][1]);
      ctx.beginPath();
      ctx.fillStyle='rgba(70,100,135,0.28)';
      ctx.arc(p.x,p.y,1.1,0,Math.PI*2); ctx.fill();
    }

    /* — scan line (sweeps left→right every 7s) — */
    var scanT=(now%7)/7;
    var sx=scanT*W;
    var sg=ctx.createLinearGradient(sx-80,0,sx+6,0);
    sg.addColorStop(0,'rgba('+rgb+',0)');
    sg.addColorStop(0.75,'rgba('+rgb+',0.055)');
    sg.addColorStop(1,'rgba('+rgb+',0.20)');
    ctx.fillStyle=sg; ctx.fillRect(sx-80,0,86,H);
    ctx.beginPath(); ctx.strokeStyle='rgba('+rgb+',0.55)';
    ctx.lineWidth=0.8; ctx.moveTo(sx,0); ctx.lineTo(sx,H); ctx.stroke();

    /* — build hub screen positions — */
    hubPts=HUBS.map(function(h){ var p=px(h.lng,h.lat); return {x:p.x,y:p.y,name:h.name}; });

    /* — arcs + traveling particles — */
    for(var a=0;a<hubPts.length-1;a++){
      var s=hubPts[a], e=hubPts[a+1];
      var mcx=(s.x+e.x)/2, mcy=(s.y+e.y)/2 - Math.abs(e.x-s.x)*0.18 - 18;

      /* arc */
      ctx.beginPath();
      ctx.strokeStyle='rgba('+rgb+',0.15)';
      ctx.lineWidth=0.9;
      ctx.moveTo(s.x,s.y); ctx.quadraticCurveTo(mcx,mcy,e.x,e.y); ctx.stroke();

      /* particle 1 */
      var ph1=(now*0.28+a*0.37)%1;
      var pt1=bezPt(ph1,s.x,s.y,mcx,mcy,e.x,e.y);
      ctx.beginPath(); ctx.fillStyle=acc;
      ctx.shadowColor=acc; ctx.shadowBlur=9;
      ctx.arc(pt1.x,pt1.y,2.2,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;

      /* particle 2 (offset by 0.5) */
      var ph2=(ph1+0.5)%1;
      var pt2=bezPt(ph2,s.x,s.y,mcx,mcy,e.x,e.y);
      ctx.beginPath();
      ctx.fillStyle='rgba('+rgb+',0.45)';
      ctx.arc(pt2.x,pt2.y,1.4,0,Math.PI*2); ctx.fill();
    }

    /* — hubs — */
    for(var h=0;h<hubPts.length;h++){
      var hp=hubPts[h];
      var ph=0.5+0.5*Math.sin(now*1.5+h*0.8);
      var ph2=0.5+0.5*Math.sin(now*1.5+h*0.8+Math.PI);
      var isH=(h===hoverHub);

      /* expanding ring A */
      ctx.beginPath();
      ctx.strokeStyle='rgba('+rgb+','+(0.45-0.42*ph)+')';
      ctx.lineWidth=1;
      ctx.arc(hp.x,hp.y,8+18*ph,0,Math.PI*2); ctx.stroke();

      /* expanding ring B (staggered) */
      ctx.beginPath();
      ctx.strokeStyle='rgba('+rgb+','+(0.28-0.25*ph2)+')';
      ctx.lineWidth=0.7;
      ctx.arc(hp.x,hp.y,8+18*ph2,0,Math.PI*2); ctx.stroke();

      /* glow fill */
      ctx.beginPath();
      ctx.fillStyle='rgba('+rgb+','+(0.10+0.10*ph)+')';
      ctx.arc(hp.x,hp.y,isH?13:8,0,Math.PI*2); ctx.fill();

      /* core dot */
      ctx.beginPath();
      ctx.fillStyle=acc;
      ctx.shadowColor=acc; ctx.shadowBlur=isH?22:14;
      ctx.arc(hp.x,hp.y,isH?4.2:2.8,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;

      /* tooltip */
      if(isH){
        ctx.font='600 11px Montserrat,sans-serif';
        var tw=ctx.measureText(hp.name).width;
        var tx=hp.x+14, ty=hp.y-20;
        if(tx+tw+18>W) tx=hp.x-tw-22;
        ctx.fillStyle='rgba(3,16,31,0.90)';
        ctx.fillRect(tx,ty,tw+16,20);
        ctx.strokeStyle='rgba('+rgb+',0.55)';
        ctx.lineWidth=1; ctx.strokeRect(tx,ty,tw+16,20);
        ctx.fillStyle='#eaf3fb';
        ctx.fillText(hp.name,tx+8,ty+14);
      }
    }
  }
  startLoop(draw, canvas);

  canvas.addEventListener('mousemove',function(e){
    var r=canvas.getBoundingClientRect();
    var mx=e.clientX-r.left, my=e.clientY-r.top;
    hoverHub=-1;
    for(var h=0;h<hubPts.length;h++){
      var dx=mx-hubPts[h].x, dy=my-hubPts[h].y;
      if(dx*dx+dy*dy<280){ hoverHub=h; break; }
    }
  });
  canvas.addEventListener('mouseleave',function(){ hoverHub=-1; });
}

/* ============================================================
   PARTICLE NETWORK  (solutions section background)
   ============================================================ */
function initParticleNet(canvas){
  var ctx = canvas.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio||1, 2);
  var W, H;
  var particles = [];
  var CONNECT_DIST = 160;
  var COUNT = 72;

  function resize(){
    var rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = W*DPR; canvas.height = H*DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
    // rebuild particles on resize keeping positions proportional
    if(particles.length === 0) spawnAll();
  }

  function spawnAll(){
    particles = [];
    for(var i=0; i<COUNT; i++) particles.push(spawn());
  }

  function spawn(x, y){
    return {
      x: x != null ? x : Math.random()*W,
      y: y != null ? y : Math.random()*H,
      vx: (Math.random()-.5)*0.38,
      vy: (Math.random()-.5)*0.28,
      r: Math.random() < 0.18 ? 2.6 : 1.3,  // some bigger hub nodes
      hub: Math.random() < 0.18,
      phase: Math.random()*Math.PI*2
    };
  }

  resize();
  window.addEventListener('resize', function(){ var prev=particles; particles=[]; resize(); });

  // mouse: attracts nearby particles gently
  var mx=-9999, my=-9999;
  canvas.addEventListener('mousemove', function(e){
    var r=canvas.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top;
  });
  canvas.addEventListener('mouseleave', function(){ mx=-9999; my=-9999; });

  function draw(){
    ctx.clearRect(0,0,W,H);
    var rgb = accentRGB();
    var acc = ACCENT();
    var t = performance.now()*0.001;

    // update
    for(var i=0; i<particles.length; i++){
      var p=particles[i];
      // mouse attraction (soft)
      var mdx=mx-p.x, mdy=my-p.y, md2=mdx*mdx+mdy*mdy;
      if(md2 < 26000 && md2 > 1){
        var mf=0.012/Math.sqrt(md2);
        p.vx += mdx*mf; p.vy += mdy*mf;
      }
      // dampen velocity
      p.vx *= 0.995; p.vy *= 0.995;
      p.x += p.vx; p.y += p.vy;
      // wrap
      if(p.x<-10) p.x=W+10; if(p.x>W+10) p.x=-10;
      if(p.y<-10) p.y=H+10; if(p.y>H+10) p.y=-10;
    }

    // connections
    for(var i=0; i<particles.length; i++){
      for(var j=i+1; j<particles.length; j++){
        var a=particles[i], b=particles[j];
        var dx=a.x-b.x, dy=a.y-b.y;
        var d2=dx*dx+dy*dy;
        if(d2 > CONNECT_DIST*CONNECT_DIST) continue;
        var dist=Math.sqrt(d2);
        var alpha=(1-dist/CONNECT_DIST)*0.28;
        // highlight lines near mouse
        var lmx=(a.x+b.x)/2, lmy=(a.y+b.y)/2;
        var ld2=(lmx-mx)*(lmx-mx)+(lmy-my)*(lmy-my);
        if(ld2 < 14400) alpha = Math.min(0.7, alpha*3.5);
        ctx.beginPath();
        ctx.strokeStyle='rgba('+rgb+','+alpha.toFixed(3)+')';
        ctx.lineWidth = (a.hub||b.hub) ? 1.1 : 0.7;
        ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }

    // nodes
    for(var i=0; i<particles.length; i++){
      var p=particles[i];
      var pulse = 0.5+0.5*Math.sin(t*1.4+p.phase);
      var nearMouse = ((p.x-mx)*(p.x-mx)+(p.y-my)*(p.y-my)) < 6400;

      if(p.hub){
        // outer glow ring
        ctx.beginPath();
        ctx.strokeStyle='rgba('+rgb+','+(0.12+0.14*pulse)+')';
        ctx.lineWidth=1;
        ctx.arc(p.x,p.y,p.r*3+4*pulse,0,Math.PI*2); ctx.stroke();
      }

      // core dot
      var r2 = nearMouse ? p.r*2.2 : p.r;
      ctx.beginPath();
      ctx.fillStyle='rgba('+rgb+','+(p.hub ? 0.9 : 0.55+0.35*pulse)+')';
      ctx.shadowColor=acc;
      ctx.shadowBlur=nearMouse ? 18 : (p.hub ? 12 : 5);
      ctx.arc(p.x,p.y,r2,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
    }
  }

  startLoop(draw, canvas);
}

window.IOSWorld = { initGlobe: initGlobe, initFlatMap: initFlatMap, initParticleNet: initParticleNet,
  initStandaloneProjectMap: initStandaloneProjectMap,
  initOfficesMap: initOfficesMap,
  _lastGlobeState:null, landDots:null };

/* ============================================================
   STANDALONE PROJECT MAP (Impact section)
   ============================================================ */
function initStandaloneProjectMap(canvas){
  var ctx=canvas.getContext('2d');
  var DPR=Math.min(window.devicePixelRatio||1,2);
  var W,H, hoverIdx=-1, pts=[];
  var zoom=1, panX=0, panY=0, dragStart=null;
  function resize(){
    var r=canvas.getBoundingClientRect(); W=r.width; H=r.height;
    canvas.width=W*DPR; canvas.height=H*DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  resize(); window.addEventListener('resize',resize);
  // Tighter lat crop: -60..80 so Antarctica doesn't waste space
  function basePx(lng,lat){
    var LAT_MIN=-60,LAT_MAX=80,padX=W*0.01,padY=H*0.02;
    return {x:padX+(lng+180)/360*(W-2*padX), y:padY+(LAT_MAX-lat)/(LAT_MAX-LAT_MIN)*(H-2*padY)};
  }
  function px(lng,lat){ var b=basePx(lng,lat),cx2=W/2,cy2=H/2; return {x:cx2+(b.x-cx2)*zoom+panX,y:cy2+(b.y-cy2)*zoom+panY}; }
  // expose zoom for external buttons
  canvas._iosZoom=function(f){ zoom=Math.max(0.7,Math.min(12,zoom*f)); };
  canvas._iosResetView=function(){ zoom=1;panX=0;panY=0; };
  var tip=document.createElement('div');
  tip.style.cssText='position:absolute;display:none;background:rgba(3,16,31,.94);border:1px solid rgba(130,196,77,.5);color:#eaf3fb;font-family:Montserrat,sans-serif;font-size:11px;font-weight:600;padding:8px 13px;border-radius:5px;pointer-events:none;z-index:10;white-space:normal;width:260px;line-height:1.5;box-shadow:0 4px 20px rgba(0,0,0,.4)';
  setTimeout(function(){
    var bi=document.getElementById('impactZoomIn'),bo=document.getElementById('impactZoomOut');
    if(bi) bi.addEventListener('click',function(){ canvas._iosZoom(1.3); });
    if(bo) bo.addEventListener('click',function(){ canvas._iosZoom(0.77); });
  },300);
  var cachedDots=null;
  function draw(){
    ctx.clearRect(0,0,W,H);
    var r=accentRGB(),a=ACCENT(),t=performance.now()*0.001;
    if(!cachedDots) cachedDots=buildDots(2.6);
    var ldR=Math.max(0.7,0.9*Math.min(2,zoom));
    for(var i=0;i<cachedDots.length;i++){
      var lat0=cachedDots[i][1]; if(lat0<-60||lat0>80) continue;
      var p=px(cachedDots[i][0],lat0);
      if(p.x<-4||p.x>W+4||p.y<-4||p.y>H+4) continue;
      ctx.beginPath(); ctx.fillStyle='rgba(70,100,135,0.30)'; ctx.arc(p.x,p.y,ldR,0,Math.PI*2); ctx.fill();
    }
    pts=[];
    var pdata=window.__iosProjectData, pCC=window.__iosCC;
    if(!pdata||!pCC) return;
    var countries=Object.keys(pdata);
    for(var ci=0;ci<countries.length;ci++){
      var c=countries[ci], coord=pCC[c]; if(!coord) continue;
      var count=(pdata[c]||[]).length;
      var pt=px(coord[1],coord[0]);
      if(pt.x<-10||pt.x>W+10||pt.y<-10||pt.y>H+10) continue;
      var dr=Math.max(1.8,Math.min(5,1.6+Math.log(count+1)*1.2));
      var pulse=0.5+0.5*Math.sin(t*1.4+ci*0.5);
      var isH=(ci===hoverIdx);
      pts.push({x:pt.x,y:pt.y,count:count,country:c,idx:ci});
      ctx.beginPath(); ctx.fillStyle='rgba('+r+','+(isH?0.22:0.07+0.04*pulse)+')';
      ctx.arc(pt.x,pt.y,dr*1.6+1*pulse,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.fillStyle=isH?a:'rgba('+r+',0.78)';
      ctx.shadowColor=a; ctx.shadowBlur=isH?12:3;
      ctx.arc(pt.x,pt.y,dr,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    }
  }
  startLoop(draw, canvas);
  /* +/- buttons only — no drag, no scroll zoom */
  canvas.addEventListener('mousemove',function(e){
    var rect2=canvas.getBoundingClientRect(),mx=e.clientX-rect2.left,my=e.clientY-rect2.top;
    hoverIdx=-1;
    for(var i=0;i<pts.length;i++){
      var d=pts[i],dx=mx-d.x,dy=my-d.y;
      var hit=Math.max(1.8,Math.min(5,1.6+Math.log(d.count+1)*1.2))+9;
      if(dx*dx+dy*dy<hit*hit){
        hoverIdx=d.idx;
        tip.style.display='block';
        tip.style.left=Math.min(e.offsetX+16,W-274)+'px';
        tip.style.top=Math.max(10,e.offsetY-80)+'px';
        var pdata=window.__iosProjectData;
        var projs=pdata?pdata[d.country]:[];
        var top=projs&&projs.length?projs[0]:{};
        var area=(top.area||'').replace(/^[A-Z]+-/,'').split('|')[0].split(',')[0].trim();
        var desc=top.mission?('<div style="font-weight:400;font-size:10px;color:rgba(207,224,239,0.85);margin-top:4px;line-height:1.45">'+top.mission.slice(0,120)+(top.mission.length>120?'\u2026':'')+'</div>'):'';
        var areaTag=area?('<div style="font-family:JetBrains Mono,monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#82C44D;margin-top:3px">'+area+'</div>'):'';
        tip.innerHTML='<b>'+d.country+'</b>\u00a0<span style="font-weight:400;font-size:10px;color:rgba(207,224,239,0.7)">'+d.count+' project'+(d.count===1?'':'s')+'</span>'+areaTag+desc+'<div style="font-family:JetBrains Mono,monospace;font-size:9px;color:rgba(130,196,77,.5);margin-top:5px">Click to explore \u2192</div>';
        canvas.style.cursor='pointer'; break;
      }
    }
    if(hoverIdx<0){tip.style.display='none'; canvas.style.cursor='default';}
  });
  canvas.addEventListener('mouseleave',function(){ hoverIdx=-1; tip.style.display='none'; });
  canvas.addEventListener('click',function(){
    if(hoverIdx>=0){ var d=pts.find(function(p2){return p2.idx===hoverIdx;}); if(d&&window.IOS_openModal) window.IOS_openModal(d.country); }
  });
  canvas.addEventListener('dblclick',function(){ canvas._iosResetView(); });
}

/* ============================================================
   OFFICES MAP (Contact section) — leader-line labels
   ============================================================ */
function initOfficesMap(canvas,offices){
  var ctx=canvas.getContext('2d');
  var DPR=Math.min(window.devicePixelRatio||1,2);
  var W,H,hoverOff=-1,offPts=[];
  // custom per-office label offsets [dx,dy] to fan out clustered regions (Europe); default [16,-12]
  var LBL_OFF={
    'Brussels, Belgium':[36,-34],
    'Paris, France':[-72,-8],
    'Lisbon, Portugal':[-30,16],
    'Barcelona, Spain':[8,42],
    'Amsterdam, Netherlands':[2,-48],
    'Sarajevo, Bosnia & Herzegovina':[46,-6],
    'Sofia, Bulgaria':[64,26],
    'Tbilisi, Georgia':[72,-22],
    'Miami, FL, USA':[16,22],
    'Washington D.C., USA':[-98,-16],
    'San José, Costa Rica':[18,-28],
    'Bogotá, Colombia':[-78,16]
  };
  // Pre-defined label anchor positions [fracX, fracY] — carefully spaced to avoid overlap
  // Label anchors — each label zone carefully separated, leader lines connect to dots
  var ANC=[
    // Americas (left side)
    [0.10,0.40],[0.12,0.30],[0.08,0.50],[0.09,0.57],[0.09,0.64],
    [0.12,0.70],[0.14,0.77],
    // Europe — spread across top+right to avoid cluster overlap
    [0.46,0.10], // 7  Brussels  → upper mid
    [0.36,0.07], // 8  Paris     → upper left-mid
    [0.70,0.07], // 9  Barcelona → upper right
    [0.78,0.18], // 10 Chisinau  → right side upper
    [0.61,0.34], // 11 Sofia     → right side mid
    [0.71,0.40], // 12 Amman
    [0.71,0.54], // 13 Nairobi
    [0.65,0.68], // 14 Maseru
    [0.62,0.77], // 15 Cape Town
    [0.37,0.25], // 16 Sarajevo  → left side mid (clear of Spain)
    [0.78,0.30], // 17 Tbilisi   → far right (clear of Sofia)
    [0.87,0.43], // 18 Hanoi
    [0.82,0.66]  // 19 Queensland
  ];
  function resize(){
    var r2=canvas.getBoundingClientRect(); W=r2.width; H=r2.height;
    canvas.width=W*DPR; canvas.height=H*DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  resize(); window.addEventListener('resize',resize);
  function px(lng,lat){ var padX=W*0.04,padY=H*0.10; return {x:padX+(lng+180)/360*(W-2*padX),y:padY+(90-lat)/180*(H-2*padY)*0.85+H*0.06}; }
  var dots=buildDots(2.6);
  function draw(){
    ctx.clearRect(0,0,W,H);
    var t=performance.now()*0.001;
    var GREEN='#82C44D', GREENLINE='rgba(130,196,77,0.4)';
    for(var i=0;i<dots.length;i++){
      var p=px(dots[i][0],dots[i][1]);
      ctx.beginPath(); ctx.fillStyle='rgba(255,255,255,0.28)'; ctx.arc(p.x,p.y,0.9,0,Math.PI*2); ctx.fill();
    }
    // HQ connection lines
    var hqPt=null;
    for(var o=0;o<offices.length;o++){ if(offices[o].hq){ hqPt=px(offices[o].lng,offices[o].lat); break; } }
    if(hqPt){
      for(var o=0;o<offices.length;o++){
        if(offices[o].hq) continue;
        var op=px(offices[o].lng,offices[o].lat);
        var mx3=(hqPt.x+op.x)/2, my3=Math.min(hqPt.y,op.y)-Math.abs(op.x-hqPt.x)*0.05-5;
        ctx.beginPath(); ctx.strokeStyle='rgba(130,196,77,0.14)'; ctx.lineWidth=0.5;
        ctx.moveTo(hqPt.x,hqPt.y); ctx.quadraticCurveTo(mx3,my3,op.x,op.y); ctx.stroke();
      }
    }
    offPts=[];
    for(var o=0;o<offices.length;o++){
      var off=offices[o], pt=px(off.lng,off.lat);
      var pulse=0.5+0.5*Math.sin(t*1.3+o*0.6);
      var isH=(o===hoverOff), isHQ=off.hq;
      var lo=LBL_OFF[off.name]||[10,-9];
      var ax=pt.x+lo[0], ay=pt.y+lo[1];
      offPts.push({x:pt.x,y:pt.y,idx:o});
      // glow ring on dot
      ctx.beginPath(); ctx.strokeStyle='rgba(130,196,77,'+(isHQ?0.55:0.25)+')'; ctx.lineWidth=(isHQ?1.2:0.7);
      ctx.arc(pt.x,pt.y,(isHQ?9:4)+4*pulse,0,Math.PI*2); ctx.stroke();
      // core dot
      ctx.beginPath(); ctx.fillStyle=GREEN;
      ctx.shadowColor=GREEN; ctx.shadowBlur=isHQ?18:(isH?12:6);
      ctx.arc(pt.x,pt.y,isHQ?5.5:2.8,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
      // leader line: dot → anchor
      ctx.beginPath();
      ctx.strokeStyle=isHQ?GREENLINE:'rgba(255,255,255,'+(isH?0.5:0.35)+')';
      ctx.lineWidth=isHQ?0.9:0.6;
      ctx.setLineDash(isHQ?[]:[2,3]);
      ctx.moveTo(pt.x,pt.y); ctx.lineTo(ax,ay); ctx.stroke();
      ctx.setLineDash([]);
      // label at anchor — plain white text, no background box
      var lbl=(isHQ?'★ ':'')+(off.city||off.name.split(',')[0]);
      var fs=isHQ?13.5:(isH?13:10.5);
      ctx.font=(isHQ||isH?'700':'600')+' '+fs+'px Montserrat,sans-serif';
      var tw=ctx.measureText(lbl).width;
      // clamp so label doesn't leave canvas
      var lx=ax; if(lx+tw+4>W*0.98) lx=ax-tw-4;
      var ly=ay; if(ly<fs+2) ly=fs+2; if(ly>H-4) ly=H-4;
      ctx.fillStyle=isHQ?GREEN:(isH?'#ffffff':'#ffffff');
      ctx.fillText(lbl,lx,ly);
      if(isHQ&&off.phone){ /* phone shown via button below map */ }
    }
  }
  startLoop(draw, canvas);
  canvas.addEventListener('mousemove',function(e){
    var rect2=canvas.getBoundingClientRect(),mx=e.clientX-rect2.left,my=e.clientY-rect2.top;
    hoverOff=-1;
    for(var i=0;i<offPts.length;i++){
      var d=offPts[i],dx=mx-d.x,dy=my-d.y;
      if(dx*dx+dy*dy<196){ hoverOff=d.idx; break; }
    }
    canvas.style.cursor=(hoverOff>=0?'pointer':'default');
  });
  canvas.addEventListener('mouseleave',function(){ hoverOff=-1; });
}
})();