/* Loads the live project list from the IOS Partners Google Sheet and replaces
   window.__IOS_PROJECT_DATA__. project-data.js stays as the offline fallback.
   To add a project: add a row to the sheet. The site picks it up on next page load. */
(function () {
  var SHEET_ID = '14iSlCVkLh96VfDUmS2zILfWjxb2D90MoE59RvF4w480';
  var SHEET_GID = '471787958';
  var CACHE_KEY = 'ios-sheet-projects-v4';

  var URLS = [
    'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:csv&gid=' + SHEET_GID,
    'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/export?format=csv&gid=' + SHEET_GID
  ];

  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (x) { return x.trim() !== ''; }); });
  }

  var COLS = {
    country: /^(country|countries|pa[ií]s)$/i,
    title: /^(mission|project|project title|project name|title|assignment)$/i,
    area: /^(categor(y|ies)|sector|sectors|practice area|area)$/i,
    agency: /^(client|client \/ agency|agency|donor|funder|funded by|funding)$/i,
    status: /^status$/i,
    year: /^(year|date|period)$/i,
    description: /^(description|summary|scope|details)$/i,
    image: /^(project image|image|photo)$/i,
    lat: /^(lat|latitude)$/i,
    lng: /^(lng|lon|long|longitude)$/i
  };

  var CANON = [
    [/avia|airport|airline/i, 'Aviation'],
    [/touris/i, 'Tourism'],
    [/agri|fisher|farm/i, 'Agriculture'],
    [/energ|power|electric/i, 'Energy'],
    [/financ|bank/i, 'Finance'],
    [/health|social/i, 'Health & Social Services'],
    [/information|ict|technolog|\bit\b|digital/i, 'Information Technology'],
    [/port|maritime|transport/i, 'Ports & Maritime'],
    [/private sector/i, 'Private Sector Development'],
    [/public sector|governance|public enterprise|privati/i, 'Public Sector'],
    [/trade|investment|export/i, 'Trade Facilitation']
  ];
  function canonAreas(raw) {
    var out = [];
    (raw || '').split(/[|,\/]/).forEach(function (part) {
      part = part.trim().replace(/\s+and\s+/gi, ' & ');
      if (!part) return;
      var hit = null;
      for (var i = 0; i < CANON.length; i++) if (CANON[i][0].test(part)) { hit = CANON[i][1]; break; }
      hit = hit || part;
      if (out.indexOf(hit) === -1) out.push(hit);
    });
    return out;
  }

  function toData(rows) {
    if (rows.length < 2) return null;
    var head = rows[0].map(function (h) { return h.trim(); });
    var idx = {};
    Object.keys(COLS).forEach(function (k) {
      for (var i = 0; i < head.length; i++) {
        if (Object.values(idx).indexOf(i) === -1 && COLS[k].test(head[i])) { idx[k] = i; break; }
      }
    });
    if (idx.country === undefined || idx.title === undefined) return null;
    var data = {}, coords = {};
    rows.slice(1).forEach(function (r) {
      var get = function (k) { return idx[k] === undefined ? '' : (r[idx[k]] || '').trim(); };
      var country = get('country'), title = get('title');
      if (!country || !title) return;
      var list = (data[country] = data[country] || []);
      var areas = canonAreas(get('area'));
      var area = areas.join('|');
      // the sheet lists a project once per category; merge those into one entry
      var dup = list.filter(function (p) { return p.title === title; })[0];
      if (dup) { areas.forEach(function (a) { if (dup.area.split('|').indexOf(a) === -1) dup.area = dup.area ? dup.area + '|' + a : a; }); return; }
      var img = get('image').replace(/^http:\/\//i, 'https://');
      list.push({
        title: title, area: area, agency: get('agency'), status: get('status'),
        year: get('year'), description: get('description'), image: img
      });
      var la = parseFloat(get('lat')), lo = parseFloat(get('lng'));
      if (!coords[country] && !isNaN(la) && !isNaN(lo)) coords[country] = [la, lo];
    });
    return Object.keys(data).length ? { data: data, coords: coords } : null;
  }

  function apply(parsed) {
    window.__IOS_PROJECT_DATA__ = parsed.data;
    window.__IOS_COUNTRY_COORDS__ = Object.assign({}, window.__IOS_COUNTRY_COORDS__ || {}, parsed.coords);
    window.__iosSheetLoaded = true;
    try { window.dispatchEvent(new Event('ios-data-updated')); } catch (e) {}
  }

  // Use the last good copy immediately so pages don't flash old data.
  try {
    var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && cached.data) {
      window.__IOS_PROJECT_DATA__ = cached.data;
      window.__IOS_COUNTRY_COORDS__ = Object.assign({}, window.__IOS_COUNTRY_COORDS__ || {}, cached.coords || {});
    }
  } catch (e) {}

  (function tryUrl(i) {
    if (i >= URLS.length) { console.warn('[sheet-loader] Could not load the Google Sheet; using project-data.js'); return; }
    fetch(URLS[i]).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (text) {
      if (/^\s*</.test(text)) throw 0; // got an HTML login page, not CSV
      var parsed = toData(parseCSV(text));
      if (!parsed) throw 0;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(parsed)); } catch (e) {}
      apply(parsed);
    }).catch(function () { tryUrl(i + 1); });
  })(0);
})();
