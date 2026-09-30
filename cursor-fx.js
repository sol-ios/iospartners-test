(function () {
  if (window.__iosCursorFxMounted) return;
  window.__iosCursorFxMounted = true;

  function mount() {
    var dot = document.createElement('div');
    dot.style.cssText = 'position:fixed;top:0;left:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#82C44D;border:2px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.35);pointer-events:none;z-index:9999;opacity:0;transition:opacity 0.2s ease,width 0.15s ease,height 0.15s ease,margin 0.15s ease;will-change:transform;';
    document.body.appendChild(dot);
    var hover = false;
    document.addEventListener('mousemove', function (e) {
      dot.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      dot.style.opacity = '1';
      var h = !!(e.target.closest && e.target.closest('a, button, [onclick], input, textarea, select, [role="button"]'));
      if (h !== hover) {
        hover = h;
        dot.style.width = dot.style.height = h ? '20px' : '12px';
        dot.style.margin = h ? '-10px 0 0 -10px' : '-6px 0 0 -6px';
      }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; });
  }

  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
