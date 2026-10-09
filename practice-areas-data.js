window.PRACTICE_AREAS = {
  'aviation': { title: 'Aviation', file: './Practice Area - Aviation.dc.html', blurb: 'Advancing aviation sector reform, air-transport policy and airport development across emerging and frontier markets.', match: ['Aviation & Tourism', 'Aviation'] },
  'agriculture': { title: 'Agriculture', file: './Practice Area - Agriculture.dc.html', blurb: 'Strengthening agricultural value chains, food security and rural livelihoods through market-driven, sustainable interventions.', match: ['Agriculture'] },
  'finance': { title: 'Finance', file: './Practice Area - Finance.dc.html', blurb: 'Building resilient financial systems — access to capital, financial-sector reform and investment facilitation.', match: ['Finance'] },
  'tourism': { title: 'Tourism', file: './Practice Area - Tourism.dc.html', blurb: 'Growing inclusive, sustainable tourism economies that create jobs and protect natural and cultural assets.', match: ['Aviation & Tourism', 'Tourism'] },
  'blue-economy': { title: 'Blue Economy', file: './Practice Area - Blue Economy.dc.html', blurb: 'Supporting sustainable use of ocean and coastal resources — fisheries, ports and marine ecosystems.', match: [] },
  'ict4d': { title: 'ICT4D', file: './Practice Area - ICT4D.dc.html', blurb: 'Applying digital technology and e-governance solutions to accelerate inclusive economic development.', match: ['Information and Communication Technology for Development', 'Information Technology'] },
  'infrastructure-development': { title: 'Infrastructure Development', file: './Practice Area - Infrastructure Development.dc.html', blurb: 'Planning and financing transport, energy and urban infrastructure that underpins long-term growth.', match: ['Transport & Infrastructure', 'Energy'] },
  'ports-maritime': { title: 'Ports & Maritime', file: './Practice Area - Ports - Maritime.dc.html', blurb: 'Modernizing port operations, maritime policy and logistics corridors for global trade competitiveness.', match: ['Ports & Maritime'] },
  'private-sector-development': { title: 'Private Sector Development', file: './Practice Area - Private Sector Development.dc.html', blurb: 'Strengthening enterprise competitiveness, entrepreneurship and market systems across our partner countries.', match: ['Private Sector Development'] },
  'public-administration-reform': { title: 'Public Administration & Reform', file: './Practice Area - Public Administration - Reform.dc.html', blurb: 'Modernizing public institutions, governance frameworks and state-owned enterprise performance.', match: ['Public Sector Governance and Public Enterprise Reform', 'Public Sector'] },
  'ppp': { title: 'Public-Private Partnerships (PPP)', file: './Practice Area - Public-Private Partnerships.dc.html', blurb: 'Structuring PPP frameworks that mobilize private capital for public infrastructure and services.', match: [] },
  'special-economic-zones': { title: 'Special Economic Zones', file: './Practice Area - Special Economic Zones.dc.html', blurb: 'Designing and operationalizing economic zones that attract investment and drive export growth.', match: [] },
  'social-development-health': { title: 'Social Development & Health Inclusion', file: './Practice Area - Social Development - Health Inclusion.dc.html', blurb: 'Advancing inclusive social protection, health systems strengthening and community resilience.', match: ['Social Development and Inclusion', 'Health & Social Services'] },
  'trade-investment': { title: 'Trade & Investment', file: './Practice Area - Trade - Investment.dc.html', blurb: 'Facilitating trade policy reform, investment promotion and regional economic integration.', match: ['Trade Facilitation and Investment Promotion', 'Trade Facilitation'] },
  'usg-practice': { title: 'USG Practice', file: './Practice Area - USG Practice.dc.html', blurb: 'Delivering technical assistance and program management for U.S. Government agencies worldwide.', match: [] }
};

window.PRACTICE_AREA_KEYWORDS = {
  'blue-economy': /fisher|marine|coastal|ocean|blue economy|aquacultur/i,
  'ports-maritime': /\bports?\b|maritime|shipping|harbou?r|stevedor|\bquay\b|container terminal/i,
  'ppp': /public-private partnership|\bppp\b/i,
  'special-economic-zones': /economic zone|special economic zone|\bsez\b|free zone/i,
  'usg-practice': /USAID|USTDA|U\.S\. Government|United States Agency/i
};

window.getPracticeAreaProjects = function (slug) {
  const meta = window.PRACTICE_AREAS[slug];
  if (!meta || !window.__IOS_PROJECT_DATA__) return [];
  const out = [];
  const kw = window.PRACTICE_AREA_KEYWORDS[slug];
  Object.keys(window.__IOS_PROJECT_DATA__).forEach((country) => {
    window.__IOS_PROJECT_DATA__[country].forEach((p) => {
      const parts = (p.area || '').split('|').map((a) => a.trim());
      const areaMatch = meta.match.length && meta.match.some((m) => parts.some((a) => a.indexOf(m) === 0));
      const kwMatch = kw && (kw.test(p.title || '') || kw.test(p.agency || ''));
      if (areaMatch || kwMatch) out.push({ ...p, country });
    });
  });
  return out;
};

window.IOS_AGENCY_LOGOS = [
    [/asian development bank|\bADB\b/i, './assets/client-adb.webp'],
    [/AECOM/i, './assets/client-aecom.webp'],
    [/african development bank|AfDB/i, './assets/client-afdb.webp'],
    [/APEC/i, './assets/client-apec.webp'],
    [/adam smith/i, './assets/client-asi.webp'],
    [/booz/i, './assets/client-booz.webp'],
    [/chemonics/i, './assets/client-chemonics.webp'],
    [/deloitte/i, './assets/client-deloitte.webp'],
    [/european bank|EBRD/i, './assets/client-ebrd.webp'],
    [/ECOWAS/i, './assets/client-ecowas.webp'],
    [/USTDA|trade and development agency/i, './assets/client-ustda.webp'],
    [/world bank|\bIDA\b|\bIBRD\b|\bWB\b/i, './assets/client-worldbank.webp'],
    [/millennium challenge|\bMCC\b/i, './assets/client-mcc.webp'],
    [/USAID|agency for international development/i, './assets/client-usaid.webp'],
    [/international finance corp|\bIFC\b/i, './assets/client-ifc.png'],
    [/inter-american development bank|\bIDB\b|\bIADB\b/i, './assets/client-idb.png'],
    [/international fund for agricultural development|\bIFAD\b/i, './assets/client-ifad.png'],
    [/dept\.? of state|department of state/i, './assets/client-dos.png'],
    [/garnier\s*&?\s*garnier/i, './assets/client-garnier.png'],
    [/\bONDA\b|office national des a[eé]roports/i, './assets/client-onda.png'],
    [/air\s*mada(gascar)?/i, './assets/client-airmada.png'],
    [/national bank of ethiopia|\bNBE\b/i, './assets/client-nbe.png'],
    [/\bTMEA\b|trademark africa/i, './assets/client-tmea.png'],
    [/outreach aid to the america|\bOAA\b/i, './assets/client-oaa.png'],
    [/state of california/i, './assets/client-ca-gov.jpeg'],
    [/lesotho national development|\bLNDC\b/i, './assets/client-lndc.png']
  ];
window.iosLogoFor = function (agency) {
  const a = (agency || '').trim();
  if (!a || /^(n\/a|\?|-|none)$/i.test(a)) return null;
  const hit = window.IOS_AGENCY_LOGOS.find(function (x) { return x[0].test(a); });
  return hit ? hit[1] : null;
};

window.IOS_COUNTRY_CODES = {"Burkina Faso":"BF","Morocco":"MA","Lesotho":"LS","Madagascar":"MG","Sierra Leone":"SL","Seychelles":"SC","Haiti":"HT","Benin":"BJ","Georgia":"GE","Hungary":"HU","Mali":"ML","Nigeria":"NG","Nicaragua":"NI","Senegal":"SN","Iraq":"IQ","Samoa":"WS","Philippines":"PH","Tuvalu":"TV","Cambodia":"KH","Fiji":"FJ","Solomon Islands":"SB","Ethiopia":"ET","Saint Vincent and The Grenadines":"VC","Jamaica":"JM","Djibouti":"DJ","Canada":"CA","Costa Rica":"CR","United Arab Emirates":"AE","Bangladesh":"BD","Bosnia and Herzegovina":"BA","Brazil":"BR","Chile":"CL","Cameroon":"CM","Cape Verde":"CV","Ecuador":"EC","Egypt":"EG","Greece":"GR","Hong Kong":"HK","India":"IN","Kenya":"KE","Laos":"LA","Myanmar":"MM","Mongolia":"MN","Mozambique":"MZ","Malawi":"MW","Peru":"PE","Palau":"PW","Puerto Rico":"PR","Qatar":"QA","Indonesia":"ID","Rwanda":"RW","Saudi Arabia":"SA","El Salvador":"SV","Somalia":"SO","Suriname":"SR","Togo":"TG","Trinidad and Tobago":"TT","Tanzania":"TZ","United States":"US","Vanuatu":"VU","Barbados":"BB","China":"CN","Gambia":"GM","Moldova":"MD","Macedonia":"MK","Montenegro":"ME","Nepal":"NP","Russia":"RU","Zambia":"ZM","Guyana":"GY","Saint Lucia":"LC","Palestine":"PS","Bahamas":"BS","Tunisia":"TN","Sint Maarten":"SX","Angola":"AO","Republic of Guinea":"GN","Maldives":"MV","Albania":"AL","Comoros Islands":"KM","Pakistan":"PK","Kiribati":"KI","Belize":"BZ","Brunei Darussalam":"BN","Antigua & Barbuda":"AG","Afghanistan":"AF","Cote d'Ivoire":"CI","Congo, Democratic Republic":"CD","Colombia":"CO","Jordan":"JO","Kyrgyzstan":"KG","Lebanon":"LB","Azerbaijan":"AZ","Bolivia":"BO","Serbia":"RS","South Africa":"ZA","Zimbabwe":"ZW","Kingdom of Bahrain":"BH","Dominican Republic":"DO","Honduras":"HN","Kuwait":"KW","Sri Lanka":"LK","Sudan":"SD","Yemen":"YE","Vietnam":"VN","Bulgaria":"BG","Cook Islands":"CK","Kazakhstan":"KZ","Kosovo":"XK","Romania":"RO","Slovakia":"SK","Ukraine":"UA"};
window.iosFlagUrl = function (country) {
  const c = window.IOS_COUNTRY_CODES[(country || '').trim()];
  return c ? 'https://flagcdn.com/w160/' + c.toLowerCase() + '.png' : null;
};

window.IOS_COUNTRY_CODES_EXTRA = { 'Republic of Georgia': 'GE', 'Saint Vincent and the Grenadines': 'VC', 'Central African Republic': 'CF', 'Micronesia': 'FM', 'Malaysia': 'MY', 'Marshall Islands': 'MH', 'Papua New Guinea': 'PG', 'Thailand': 'TH', 'Timor-Leste': 'TL', 'Tonga': 'TO', 'Bosnia & Herzegovina': 'BA', 'Cuba': 'CU', 'Ivory Coast': 'CI', 'Côte d’Ivoire': 'CI', "Côte d'Ivoire": 'CI', 'Democratic Republic of Congo': 'CD', 'Ghana': 'GH', 'British Virgin Islands': 'VG', 'Burundi': 'BI', 'Saint Maarten': 'SX' };
Object.assign(window.IOS_COUNTRY_CODES, window.IOS_COUNTRY_CODES_EXTRA);
