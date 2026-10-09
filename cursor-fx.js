(function () {
  if (window.__iosCursorFxMounted) return;
  window.__iosCursorFxMounted = true;
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

  function mount() {
    // soft glowing shadow that trails behind the dot and swells with speed
    var glow = document.createElement('div');
    glow.style.cssText = 'position:fixed;top:0;left:0;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;background:radial-gradient(circle,rgba(130,196,77,0.2) 0%,rgba(130,196,77,0.07) 45%,rgba(130,196,77,0) 70%);pointer-events:none;z-index:9997;opacity:0;transition:opacity 0.3s ease;will-change:transform;';
    // fading trail of small dots
    var TRAIL = 4, trail = [];
    for (var i = 0; i < TRAIL; i++) {
      var t = document.createElement('div');
      var s = 8 - i;
      t.style.cssText = 'position:fixed;top:0;left:0;width:' + s + 'px;height:' + s + 'px;margin:' + (-s / 2) + 'px 0 0 ' + (-s / 2) + 'px;border-radius:50%;background:#82C44D;pointer-events:none;z-index:9998;opacity:0;will-change:transform;';
      document.body.appendChild(t);
      trail.push({ el: t, x: -100, y: -100 });
    }
    var dot = document.createElement('div');
    dot.style.cssText = 'position:fixed;top:0;left:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#82C44D;border:2px solid #ffffff;box-shadow:0 2px 10px rgba(0,0,0,0.35),0 0 14px rgba(130,196,77,0.55);pointer-events:none;z-index:9999;opacity:0;transition:opacity 0.2s ease,width 0.15s ease,height 0.15s ease,margin 0.15s ease;will-change:transform;';
    document.body.appendChild(glow);
    document.body.appendChild(dot);

    var mx = -100, my = -100, gx = -100, gy = -100, speed = 0, lastX = 0, lastY = 0;
    var hover = false, visible = false, raf = null;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      if (!visible) {
        visible = true; gx = mx; gy = my;
        trail.forEach(function (p) { p.x = mx; p.y = my; });
        dot.style.opacity = '1'; glow.style.opacity = '1';
      }
      var h = !!(e.target.closest && e.target.closest('a, button, [onclick], input, textarea, select, [role="button"]'));
      if (h !== hover) {
        hover = h;
        dot.style.width = dot.style.height = h ? '20px' : '12px';
        dot.style.margin = h ? '-10px 0 0 -10px' : '-6px 0 0 -6px';
      }
      if (!raf && !document.hidden) raf = requestAnimationFrame(tick);
    }, { passive: true });

    function tick() {
      gx += (mx - gx) * 0.14; gy += (my - gy) * 0.14;
      var v = Math.hypot(mx - lastX, my - lastY); lastX = mx; lastY = my;
      speed += (Math.min(v, 60) - speed) * 0.18;
      var scale = (hover ? 1.5 : 1) + speed / 45;
      glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0) scale(' + scale.toFixed(3) + ')';
      var px = mx, py = my;
      for (var i = 0; i < trail.length; i++) {
        var p = trail[i];
        p.x += (px - p.x) * 0.42; p.y += (py - p.y) * 0.42;
        p.el.style.transform = 'translate3d(' + p.x + 'px,' + p.y + 'px,0)';
        p.el.style.opacity = (Math.min(1, speed / 8) * (0.32 - i * 0.05)).toFixed(3);
        px = p.x; py = p.y;
      }
      var settled = speed < 0.05 && Math.abs(mx - gx) < 0.3 && Math.abs(my - gy) < 0.3;
      raf = settled || document.hidden ? null : requestAnimationFrame(tick);
    }

    document.addEventListener('mouseleave', function () {
      visible = false;
      dot.style.opacity = '0'; glow.style.opacity = '0';
      trail.forEach(function (p) { p.el.style.opacity = '0'; });
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && visible && !raf) raf = requestAnimationFrame(tick);
    });
  }

  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
