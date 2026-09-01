(function () {
  if (window.__iosCursorFxMounted) return;
  window.__iosCursorFxMounted = true;

  function mount() {
    var dot = document.createElement('div');
    var ring = document.createElement('div');
    var trail = document.createElement('div');
    var base = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;';
    dot.style.cssText = base + 'width:10px;height:10px;border-radius:50%;background:#82C44D;box-shadow:0 0 0 4px rgba(130,196,77,0.25),0 2px 10px rgba(0,0,0,0.35);opacity:0;transition:opacity 0.2s ease;';
    trail.style.cssText = base + 'width:10px;height:10px;border-radius:50%;background:rgba(130,196,77,0.35);opacity:0;transition:opacity 0.2s ease;z-index:9997;';
    ring.style.cssText = base + 'width:28px;height:28px;border-radius:50%;border:2px solid rgba(130,196,77,0.6);background:transparent;opacity:0;transition:width 0.25s ease,height 0.25s ease,margin 0.25s ease,border-color 0.25s ease,background 0.25s ease,box-shadow 0.25s ease,opacity 0.2s ease;box-shadow:0 2px 12px rgba(130,196,77,0.3);z-index:9998;';
    document.body.appendChild(trail);
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    var mx = -40, my = -40, ringX = -40, ringY = -40, trailX = -40, trailY = -40, hover = false, visible = false, raf = null;

    function setHover(h) {
      if (h === hover) return;
      hover = h;
      if (h) {
        ring.style.width = '46px'; ring.style.height = '46px'; ring.style.marginLeft = '-23px'; ring.style.marginTop = '-23px';
        ring.style.borderColor = 'oklch(0.28 0.09 264)'; ring.style.background = 'oklch(0.28 0.09 264 / 0.1)';
        ring.style.boxShadow = '0 4px 20px rgba(20,40,80,0.35)';
      } else {
        ring.style.width = '28px'; ring.style.height = '28px'; ring.style.marginLeft = '-14px'; ring.style.marginTop = '-14px';
        ring.style.borderColor = 'rgba(130,196,77,0.6)'; ring.style.background = 'transparent';
        ring.style.boxShadow = '0 2px 12px rgba(130,196,77,0.3)';
      }
    }

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!visible) { visible = true; dot.style.opacity = '1'; ring.style.opacity = '1'; trail.style.opacity = '1'; }
      var el = e.target.closest && e.target.closest('a, button, [onclick], input, textarea, select, [role="button"]');
      setHover(!!el);
    }, { passive: true });
    document.addEventListener('mouseleave', function () {
      visible = false; dot.style.opacity = '0'; ring.style.opacity = '0'; trail.style.opacity = '0';
    });

    function tick() {
      ringX += (mx - ringX) * 0.18; ringY += (my - ringY) * 0.18;
      trailX += (mx - trailX) * 0.07; trailY += (my - trailY) * 0.07;
      dot.style.transform = 'translate(' + (mx - 5) + 'px,' + (my - 5) + 'px)';
      ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px)';
      trail.style.transform = 'translate(' + (trailX - 5) + 'px,' + (trailY - 5) + 'px)';
      raf = window.__cursorHidden ? null : requestAnimationFrame(tick);
    }
    tick();
    document.addEventListener('visibilitychange', function(){
      window.__cursorHidden = document.visibilityState === 'hidden';
      if (!window.__cursorHidden && raf === null) raf = requestAnimationFrame(tick);
    });
  }

  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
