window.I18N = {
  ES: {
    'Our work': 'Nuestro trabajo',
    'About us': 'Sobre nosotros',
    'Who we are': 'Quiénes somos',
    'Practice areas': 'Áreas de práctica',
    'Work with us': 'Trabaja con nosotros',
    'Contact us': 'Contáctanos',
    'Site links': 'Enlaces del sitio',
    'All rights reserved.': 'Todos los derechos reservados.',
    "Let's Make History Together": 'Hagamos historia juntos',
    'Our practice areas': 'Nuestras áreas de práctica',
    'Our Diverse Global Portfolio': 'Nuestro diverso portafolio global',
    'Global Offices': 'Oficinas globales',
    'Learn about our story': 'Conoce nuestra historia',
    'News': 'Noticias',
    'Highlighted projects': 'Proyectos destacados',
    'around the world': 'en el mundo',
    'Working in': 'Trabajando en',
    'Every highlighted country on the globe has a': 'Cada país destacado en el mapa tiene un proyecto de',
    'assignment in our portfolio. Click a dot to explore a project.': 'en nuestro portafolio. Haz clic en un punto para explorar un proyecto.',
    'Drag to rotate · click a highlighted dot to explore a project': 'Arrastra para girar · haz clic en un punto para explorar un proyecto',
    'Tell us about your challenge and we will put the right specialists on it.': 'Cuéntanos tu desafío y pondremos a los especialistas indicados a trabajar en él.',
    'What we do': 'Qué hacemos',
    'Trusted by': 'Confían en nosotros',
    'Our mission': 'Nuestra misión',
    'Send us a message': 'Envíanos un mensaje',
    'Our team typically responds within one business day.': 'Nuestro equipo suele responder dentro de un día hábil.',
    'Join our team': 'Únete a nuestro equipo',
    'Apply as an individual specialist or consultant.': 'Postúlate como especialista o consultor individual.',
    'Partner with us': 'Asóciate con nosotros',
    'Firms and consultancies looking to collaborate.': 'Firmas y consultoras que buscan colaborar.'
  },
  FR: {
    'Our work': 'Notre travail',
    'About us': 'À propos de nous',
    'Who we are': 'Qui sommes-nous',
    'Practice areas': "Domaines d'expertise",
    'Work with us': 'Travaillez avec nous',
    'Contact us': 'Contactez-nous',
    'Site links': 'Liens du site',
    'All rights reserved.': 'Tous droits réservés.',
    "Let's Make History Together": "Écrivons l'histoire ensemble",
    'Our practice areas': "Nos domaines d'expertise",
    'Our Diverse Global Portfolio': 'Notre portefeuille mondial diversifié',
    'Global Offices': 'Bureaux dans le monde',
    'Learn about our story': 'Découvrez notre histoire',
    'News': 'Actualités',
    'Highlighted projects': 'Projets phares',
    'around the world': 'dans le monde',
    'Working in': 'Travailler dans',
    'Every highlighted country on the globe has a': 'Chaque pays mis en avant sur la carte a un projet de',
    'assignment in our portfolio. Click a dot to explore a project.': 'dans notre portefeuille. Cliquez sur un point pour explorer un projet.',
    'Drag to rotate · click a highlighted dot to explore a project': 'Faites glisser pour pivoter · cliquez sur un point pour explorer un projet',
    'Tell us about your challenge and we will put the right specialists on it.': 'Parlez-nous de votre projet et nous mobiliserons les bons spécialistes.',
    'What we do': 'Ce que nous faisons',
    'Trusted by': 'Ils nous font confiance',
    'Our mission': 'Notre mission',
    'Send us a message': 'Envoyez-nous un message',
    'Our team typically responds within one business day.': 'Notre équipe répond généralement sous un jour ouvré.',
    'Join our team': 'Rejoignez notre équipe',
    'Apply as an individual specialist or consultant.': 'Postulez en tant que spécialiste ou consultant indépendant.',
    'Partner with us': 'Devenez partenaire',
    'Firms and consultancies looking to collaborate.': 'Cabinets et consultants souhaitant collaborer.'
  },
  PT: {
    'Our work': 'Nosso trabalho',
    'About us': 'Sobre nós',
    'Who we are': 'Quem somos',
    'Practice areas': 'Áreas de atuação',
    'Work with us': 'Trabalhe conosco',
    'Contact us': 'Fale conosco',
    'Site links': 'Links do site',
    'All rights reserved.': 'Todos os direitos reservados.',
    "Let's Make History Together": 'Vamos fazer história juntos',
    'Our practice areas': 'Nossas áreas de atuação',
    'Our Diverse Global Portfolio': 'Nosso diverso portfólio global',
    'Global Offices': 'Escritórios globais',
    'Learn about our story': 'Conheça nossa história',
    'News': 'Notícias',
    'Highlighted projects': 'Projetos em destaque',
    'around the world': 'ao redor do mundo',
    'Working in': 'Trabalhando em',
    'Every highlighted country on the globe has a': 'Cada país em destaque no mapa tem um projeto de',
    'assignment in our portfolio. Click a dot to explore a project.': 'em nosso portfólio. Clique em um ponto para explorar um projeto.',
    'Drag to rotate · click a highlighted dot to explore a project': 'Arraste para girar · clique em um ponto para explorar um projeto',
    'Tell us about your challenge and we will put the right specialists on it.': 'Conte-nos seu desafio e colocaremos os especialistas certos nele.',
    'What we do': 'O que fazemos',
    'Trusted by': 'Confiam em nós',
    'Our mission': 'Nossa missão',
    'Send us a message': 'Envie-nos uma mensagem',
    'Our team typically responds within one business day.': 'Nossa equipe geralmente responde em um dia útil.',
    'Join our team': 'Junte-se à nossa equipe',
    'Apply as an individual specialist or consultant.': 'Candidate-se como especialista ou consultor individual.',
    'Partner with us': 'Seja nosso parceiro',
    'Firms and consultancies looking to collaborate.': 'Empresas e consultorias que buscam colaborar.'
  }
};
window.tr = function (lang, s) {
  var d = window.I18N && window.I18N[lang];
  return (d && d[s]) || s;
};

/* Whole-page translation.
   The curated I18N dictionary above covers navigation labels. Everything else on the page
   (headings, paragraphs, project titles and descriptions from the Google Sheet, popup text)
   is machine-translated in the browser when a visitor picks ES / FR / PT, cached per browser,
   and kept in sync as content changes. The chosen language is remembered across pages. */
(function () {
  var KEY = 'ios-lang';
  var CODES = { ES: 'es', FR: 'fr', PT: 'pt' };
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1, SVG: 1, CANVAS: 1 };
  var KEEP = /^(IOS Partners|IOSsoft|EN|ES|FR|PT|English|Español|Français|Português)$/;
  var lang = 'EN';
  try { lang = localStorage.getItem(KEY) || 'EN'; } catch (e) {}
  if (!CODES[lang]) lang = 'EN';

  var textState = new WeakMap();   // text node -> { orig, set }
  var attrState = new WeakMap();   // element -> { placeholder: {orig,set}, ... }
  var memo = {};                   // lang -> { english: translated }
  var pending = {};                // lang -> { english: true }
  var curated = {};                // lang -> set of dictionary values (already translated)

  function cacheFor(l) {
    if (!memo[l]) {
      try { memo[l] = JSON.parse(localStorage.getItem('ios-tr-' + l) || '{}'); } catch (e) { memo[l] = {}; }
    }
    return memo[l];
  }
  var saveTimer = {};
  function saveCache(l) {
    clearTimeout(saveTimer[l]);
    saveTimer[l] = setTimeout(function () { try { localStorage.setItem('ios-tr-' + l, JSON.stringify(memo[l])); } catch (e) {} }, 400);
  }
  function curatedSet(l) {
    if (!curated[l]) {
      curated[l] = {};
      var d = (window.I18N && window.I18N[l]) || {};
      Object.keys(d).forEach(function (k) { curated[l][d[k]] = 1; });
    }
    return curated[l];
  }

  function worth(s) {
    var t = s.trim();
    if (t.length < 2 || !/[A-Za-z]{2}/.test(t)) return false;
    if (KEEP.test(t)) return false;
    if (/^(https?:\/\/|www\.)\S+$/i.test(t) || /^\S+@\S+\.\S+$/.test(t)) return false;
    if (/^[\d\s+()\-./:·,%$]+$/.test(t)) return false;
    return true;
  }
  function skipEl(el) {
    for (var n = el; n && n !== document.body; n = n.parentElement) {
      if (SKIP_TAGS[n.tagName && n.tagName.toUpperCase()]) return true;
      if (n.getAttribute && (n.getAttribute('translate') === 'no' || n.hasAttribute('data-no-translate'))) return true;
      if (n.isContentEditable) return true;
    }
    return false;
  }

  function translateBatch(l, list) {
    var code = CODES[l], cache = cacheFor(l);
    var chunks = [], cur = [], len = 0;
    list.forEach(function (s) {
      if (len + s.length > 1500 && cur.length) { chunks.push(cur); cur = []; len = 0; }
      cur.push(s); len += s.length + 1;
    });
    if (cur.length) chunks.push(cur);
    var one = function (strings) {
      var q = strings.map(function (s) { return s.replace(/\n/g, ' '); }).join('\n');
      return fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + code + '&dt=t&q=' + encodeURIComponent(q))
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (j) {
          var out = (j[0] || []).map(function (x) { return x[0]; }).join('').split('\n');
          if (out.length !== strings.length) {
            if (strings.length === 1) { cache[strings[0]] = out.join(' '); return; }
            return Promise.all(strings.map(function (s) { return one([s]); }));
          }
          strings.forEach(function (s, i) { cache[s] = out[i].trim() || s; });
        })
        .catch(function () { strings.forEach(function (s) { delete pending[l][s]; }); });
    };
    var i = 0;
    var next = function () {
      if (i >= chunks.length) return Promise.resolve();
      var c = chunks[i++];
      return one(c).then(next);
    };
    return Promise.all([next(), next(), next()]).then(function () { saveCache(l); });
  }

  var applying = false;
  function applyNode(node, l, cache, need) {
    var st = textState.get(node);
    var v = node.nodeValue;
    if (!st || (v !== st.set && v !== st.orig)) { st = { orig: v, set: null }; textState.set(node, st); }
    if (l === 'EN') { if (st.set !== null && node.nodeValue !== st.orig) node.nodeValue = st.orig; st.set = null; return; }
    var key = st.orig.trim();
    if (!worth(st.orig) || curatedSet(l)[key]) return;
    var tr = cache[key];
    if (tr) {
      var lead = st.orig.match(/^\s*/)[0], trail = st.orig.match(/\s*$/)[0];
      var val = lead + tr + trail;
      if (node.nodeValue !== val) { st.set = val; node.nodeValue = val; }
    } else need[key] = 1;
  }
  function applyAttr(el, name, l, cache, need) {
    var map = attrState.get(el); if (!map) { map = {}; attrState.set(el, map); }
    var v = el.getAttribute(name); if (v == null) return;
    var st = map[name];
    if (!st || (v !== st.set && v !== st.orig)) { st = map[name] = { orig: v, set: null }; }
    if (l === 'EN') { if (st.set !== null) el.setAttribute(name, st.orig); st.set = null; return; }
    if (!worth(st.orig)) return;
    var tr = cache[st.orig.trim()];
    if (tr) { if (v !== tr) { st.set = tr; el.setAttribute(name, tr); } }
    else need[st.orig.trim()] = 1;
  }

  function apply() {
    if (!document.body) return;
    var l = lang, cache = l === 'EN' ? {} : cacheFor(l), need = {};
    applying = true;
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      if (!n.parentElement || skipEl(n.parentElement)) continue;
      applyNode(n, l, cache, need);
    }
    var els = document.body.querySelectorAll('[placeholder],[title],img[alt]');
    for (var i = 0; i < els.length; i++) {
      if (skipEl(els[i].parentElement || els[i])) continue;
      ['placeholder', 'title'].forEach(function (a) { if (els[i].hasAttribute(a)) applyAttr(els[i], a, l, cache, need); });
    }
    applying = false;
    document.documentElement.lang = l === 'EN' ? 'en' : CODES[l];
    if (l === 'EN') return;
    pending[l] = pending[l] || {};
    var todo = Object.keys(need).filter(function (s) { return !pending[l][s]; });
    if (!todo.length) return;
    todo.forEach(function (s) { pending[l][s] = 1; });
    translateBatch(l, todo).then(function () { if (lang === l) schedule(); });
  }

  var t = null;
  function schedule() { clearTimeout(t); t = setTimeout(apply, 120); }

  function start() {
    if (lang !== 'EN') apply();
    new MutationObserver(function () { if (!applying && (lang !== 'EN' || true)) schedule(); })
      .observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.iosGetLang = function () { return lang; };
  window.iosSetLang = function (code) {
    lang = CODES[code] ? code : 'EN';
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply();
  };
})();
