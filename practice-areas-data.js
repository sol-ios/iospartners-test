window.PRACTICE_AREAS = {
  'aviation': { title: 'Aviation', file: './Practice Area - Aviation.dc.html', blurb: 'Advancing aviation sector reform, air-transport policy and airport development across emerging and frontier markets.', match: ['Aviation & Tourism'] },
  'agriculture': { title: 'Agriculture', file: './Practice Area - Agriculture.dc.html', blurb: 'Strengthening agricultural value chains, food security and rural livelihoods through market-driven, sustainable interventions.', match: ['Agriculture'] },
  'finance': { title: 'Finance', file: './Practice Area - Finance.dc.html', blurb: 'Building resilient financial systems — access to capital, financial-sector reform and investment facilitation.', match: ['Finance'] },
  'tourism': { title: 'Tourism', file: './Practice Area - Tourism.dc.html', blurb: 'Growing inclusive, sustainable tourism economies that create jobs and protect natural and cultural assets.', match: ['Aviation & Tourism'] },
  'blue-economy': { title: 'Blue Economy', file: './Practice Area - Blue Economy.dc.html', blurb: 'Supporting sustainable use of ocean and coastal resources — fisheries, ports and marine ecosystems.', match: [] },
  'forestry-environment': { title: 'Forestry & Environment', file: './Practice Area - Forestry - Environment.dc.html', blurb: 'Protecting natural resources and building climate resilience through sound environmental governance.', match: [] },
  'ict4d': { title: 'ICT4D', file: './Practice Area - ICT4D.dc.html', blurb: 'Applying digital technology and e-governance solutions to accelerate inclusive economic development.', match: ['Information and Communication Technology for Development'] },
  'infrastructure-development': { title: 'Infrastructure Development', file: './Practice Area - Infrastructure Development.dc.html', blurb: 'Planning and financing transport, energy and urban infrastructure that underpins long-term growth.', match: ['Transport & Infrastructure'] },
  'ports-maritime': { title: 'Ports & Maritime', file: './Practice Area - Ports - Maritime.dc.html', blurb: 'Modernizing port operations, maritime policy and logistics corridors for global trade competitiveness.', match: [] },
  'private-sector-development': { title: 'Private Sector Development', file: './Practice Area - Private Sector Development.dc.html', blurb: 'Strengthening enterprise competitiveness, entrepreneurship and market systems across our partner countries.', match: ['Private Sector Development'] },
  'public-administration-reform': { title: 'Public Administration & Reform', file: './Practice Area - Public Administration - Reform.dc.html', blurb: 'Modernizing public institutions, governance frameworks and state-owned enterprise performance.', match: ['Public Sector Governance and Public Enterprise Reform'] },
  'ppp': { title: 'Public-Private Partnerships (PPP)', file: './Practice Area - Public-Private Partnerships.dc.html', blurb: 'Structuring PPP frameworks that mobilize private capital for public infrastructure and services.', match: [] },
  'special-economic-zones': { title: 'Special Economic Zones', file: './Practice Area - Special Economic Zones.dc.html', blurb: 'Designing and operationalizing economic zones that attract investment and drive export growth.', match: [] },
  'social-development-health': { title: 'Social Development & Health Inclusion', file: './Practice Area - Social Development - Health Inclusion.dc.html', blurb: 'Advancing inclusive social protection, health systems strengthening and community resilience.', match: ['Social Development and Inclusion'] },
  'trade-investment': { title: 'Trade & Investment', file: './Practice Area - Trade - Investment.dc.html', blurb: 'Facilitating trade policy reform, investment promotion and regional economic integration.', match: ['Trade Facilitation and Investment Promotion'] },
  'usg-practice': { title: 'USG Practice', file: './Practice Area - USG Practice.dc.html', blurb: 'Delivering technical assistance and program management for U.S. Government agencies worldwide.', match: [] }
};

window.PRACTICE_AREA_KEYWORDS = {
  'blue-economy': /fisher|marine|coastal|ocean|blue economy|aquacultur/i,
  'forestry-environment': /forest|environment|climate|natural resource|biodivers/i,
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
      const areaMatch = meta.match.length && meta.match.some((m) => (p.area || '').indexOf(m) === 0);
      const kwMatch = kw && (kw.test(p.title || '') || kw.test(p.agency || ''));
      if (areaMatch || kwMatch) out.push({ ...p, country });
    });
  });
  return out;
};
