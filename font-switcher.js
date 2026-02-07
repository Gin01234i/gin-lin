(function () {
  var STORAGE_KEY = 'gin-lin-font';
  var DEFAULT_FONT = 'Inter';
  var FONTS = [
    { name: 'Inter', label: 'Inter', desc: 'Current default' },
    { name: 'DM Sans', label: 'DM Sans', desc: 'Geometric, slightly softer' },
    { name: 'Outfit', label: 'Outfit', desc: 'Clean geometric, slightly wider' },
    { name: 'Montserrat', label: 'Montserrat', desc: 'Geometric, urban modernist' },
    { name: 'Roboto', label: 'Roboto', desc: 'Neo-grotesque, neutral and clean' },
    { name: 'Poppins', label: 'Poppins', desc: 'Geometric, rounded and friendly' },
    { name: 'Lora', label: 'Lora', desc: 'Serif, elegant and editorial' },
    { name: 'Helvetica Neue', label: 'Helvetica Neue', desc: 'Classic Swiss neo-grotesque (system font)' }
  ];

  // --- Apply saved font immediately (before render) ---
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved && saved !== DEFAULT_FONT) {
    document.documentElement.style.setProperty('--font-family-base', "'" + saved + "', 'Helvetica Neue', Arial, sans-serif");
    loadFont(saved);
  }

  function loadFont(name) {
    if (name === DEFAULT_FONT || name === 'Helvetica Neue') return;
    var id = 'gf-' + name.replace(/\s+/g, '-').toLowerCase();
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(name) + ':wght@300;400;500;700&display=swap';
    document.head.appendChild(link);
  }

  function loadAllFonts() {
    FONTS.forEach(function (f) { loadFont(f.name); });
  }

  // --- Modal (only after DOM ready) ---
  document.addEventListener('DOMContentLoaded', function () {
    var trigger = document.getElementById('font-trigger');
    if (!trigger) return;

    var overlay = null;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (overlay) { overlay.remove(); overlay = null; return; }
      loadAllFonts();
      showModal();
    });

    function showModal() {
      var current = localStorage.getItem(STORAGE_KEY) || DEFAULT_FONT;

      overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);backdrop-filter:blur(2px);';

      var panel = document.createElement('div');
      panel.style.cssText = 'background:var(--color-bg);border:1px solid var(--color-border-primary);border-radius:12px;padding:2rem;max-width:420px;width:90%;max-height:80vh;overflow-y:auto;';

      var title = document.createElement('h3');
      title.textContent = 'Choose typeface';
      title.style.cssText = 'font-size:1.1rem;font-weight:500;margin-bottom:1.25rem;color:var(--color-text-primary);';
      panel.appendChild(title);

      var list = document.createElement('div');
      list.style.cssText = 'display:flex;flex-direction:column;gap:0.5rem;';

      FONTS.forEach(function (font) {
        var btn = document.createElement('button');
        var isActive = font.name === current;
        btn.style.cssText = 'display:flex;flex-direction:column;gap:0.2rem;width:100%;text-align:left;padding:0.75rem 1rem;border:1px solid ' +
          (isActive ? 'var(--color-text-primary)' : 'var(--color-border-secondary)') +
          ';border-radius:8px;background:' +
          (isActive ? 'var(--color-text-primary)' : 'transparent') +
          ';cursor:pointer;transition:border-color 0.2s,background 0.2s;';

        var nameEl = document.createElement('span');
        nameEl.textContent = font.label;
        nameEl.style.cssText = "font-family:'" + font.name + "',sans-serif;font-size:1.05rem;font-weight:500;color:" +
          (isActive ? 'var(--color-bg)' : 'var(--color-text-primary)') + ';';

        var descEl = document.createElement('span');
        descEl.textContent = font.desc;
        descEl.style.cssText = 'font-size:0.8rem;color:' +
          (isActive ? 'var(--color-bg)' : 'var(--color-text-muted)') + ';';

        btn.appendChild(nameEl);
        btn.appendChild(descEl);

        btn.addEventListener('mouseenter', function () {
          if (!isActive) btn.style.borderColor = 'var(--color-text-secondary)';
        });
        btn.addEventListener('mouseleave', function () {
          if (!isActive) btn.style.borderColor = 'var(--color-border-secondary)';
        });

        btn.addEventListener('click', function () {
          if (font.name === DEFAULT_FONT) {
            localStorage.removeItem(STORAGE_KEY);
            document.documentElement.style.setProperty('--font-family-base', "'" + DEFAULT_FONT + "', 'Helvetica Neue', Arial, sans-serif");
          } else {
            localStorage.setItem(STORAGE_KEY, font.name);
            document.documentElement.style.setProperty('--font-family-base', "'" + font.name + "', 'Helvetica Neue', Arial, sans-serif");
          }
          overlay.remove();
          overlay = null;
        });

        list.appendChild(btn);
      });

      panel.appendChild(list);
      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) { overlay.remove(); overlay = null; }
      });

      document.addEventListener('keydown', function onEsc(e) {
        if (e.key === 'Escape' && overlay) {
          overlay.remove();
          overlay = null;
          document.removeEventListener('keydown', onEsc);
        }
      });
    }
  });
})();
