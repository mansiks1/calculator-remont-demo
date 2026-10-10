import { site } from './content.js';

// Экранируем данные, чтобы тексты из content.js оставались текстами.
const текст = (значение) => String(значение).replace(/[&<>"']/g, (символ) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[символ]);
const элемент = (id) => document.getElementById(id);
const деньги = (сумма) => new Intl.NumberFormat(site.settings.locale, {
  style: 'currency', currency: site.settings.currency, maximumFractionDigits: 0,
}).format(сумма);
const фраза = (шаблон) => шаблон.replace('{min}', site.settings.minArea).replace('{max}', site.settings.maxArea);
const стрелка = () => `<span class="arrow" aria-hidden="true">${текст(site.ui.arrow)}</span>`;

function логотип() {
  return `<a class="brand" href="#hero"><span class="brand-mark" aria-hidden="true"></span>
    <div><div class="brand-name">${текст(site.brand.name)}</div><div class="brand-slogan">${текст(site.brand.slogan)}</div></div></a>`;
}

function отрисоватьШапку() {
  элемент('header').innerHTML = `<a class="skip-link" href="#estimate">${текст(site.ui.skip)}</a>
    <div class="container header-inner">${логотип()}
      <nav class="navigation" aria-label="${текст(site.ui.navigation)}">${site.navigation.map((ссылка) => `<a href="${текст(ссылка.href)}">${текст(ссылка.label)}</a>`).join('')}</nav>
      <span class="badge">${текст(site.brand.badge)}</span></div>`;
}

function иллюстрацияПлана() {
  return `<div class="plan-art" aria-hidden="true"><p class="eyebrow">${текст(site.hero.planTag)}</p>
    <div class="floor-plan">${['living', 'bedroom', 'kitchen', 'bathroom'].map((класс, номер) => `<div class="plan-room ${класс}"><div class="furniture"></div><span>${текст(site.hero.planRooms[номер])}</span></div>`).join('')}</div>
    <div class="plan-caption"><div><strong>${текст(site.hero.planTitle)}</strong><small>${текст(site.hero.planCaption)}</small></div>${стрелка()}</div></div>`;
}

function отрисоватьПервыйЭкран() {
  элемент('hero').innerHTML = `<div class="container hero-inner"><div>
    <p class="eyebrow">${текст(site.hero.eyebrow)}</p><h1>${текст(site.hero.title)} <span>${текст(site.hero.accent)}</span></h1>
    <p class="hero-lead">${текст(site.hero.subtitle)}</p>
    <div class="hero-actions"><a class="button" href="#estimate">${текст(site.hero.button)}${стрелка()}</a><p class="muted">${текст(site.hero.note)}</p></div>
    </div>${иллюстрацияПлана()}</div>`;
}

function поляКвартиры() {
  const настройки = site.settings;
  return `<div class="dimensions"><div class="field">
    <label for="area">${текст(site.calculator.area)}</label>
    <input class="text-input" id="area" name="area" type="number" inputmode="decimal" min="${настройки.minArea}" max="${настройки.maxArea}" step="any" value="${настройки.defaultArea}" required aria-describedby="area-hint area-error">
    <p id="area-hint" class="field-hint muted">${текст(фраза(site.calculator.areaHint))}</p>
    <p id="area-error" class="field-error" aria-live="polite"></p>
    <label for="area-range" hidden>${текст(site.calculator.range)}</label>
    <input class="area-range" id="area-range" type="range" aria-label="${текст(site.calculator.range)}" min="${настройки.minArea}" max="${настройки.maxArea}" step="any" value="${настройки.defaultArea}">
    </div><div class="field"><label for="rooms">${текст(site.calculator.rooms)}</label>
    <select id="rooms" name="rooms">${site.rooms.map((комнаты) => `<option value="${текст(комнаты.id)}" ${комнаты.id === настройки.defaultRooms ? 'selected' : ''}>${текст(комнаты.label)}</option>`).join('')}</select></div></div>`;
}

function карточкиТарифов() {
  return Object.entries(site.pricing).map(([id, тариф]) => `<label class="type-option" for="type-${текст(id)}">
    <input type="radio" id="type-${текст(id)}" name="type" value="${текст(id)}" ${id === site.settings.defaultType ? 'checked' : ''}>
    <span class="type-name">${текст(тариф.title)}</span><span class="type-description">${текст(тариф.description)}</span>
    <span class="type-price">${текст(деньги(тариф.price))} <small>${текст(site.ui.perMeter)}</small></span></label>`).join('');
}

function списокОпций() {
  return site.options.map((опция) => `<label class="option-row" for="option-${текст(опция.id)}">
    <input id="option-${текст(опция.id)}" name="options" type="checkbox" value="${текст(опция.id)}">
    <span><strong>${текст(опция.title)}</strong><small>${текст(опция.description)}</small><span class="option-price">${текст(site.ui.plus)} ${текст(деньги(опция.price))}</span></span></label>`).join('');
}

function отрисоватьКалькулятор() {
  элемент('calculator').setAttribute('aria-labelledby', 'calculator-title');
  элемент('calculator').innerHTML = `<div class="section-heading"><p class="eyebrow">${текст(site.calculator.eyebrow)}</p>
    <h2 id="calculator-title">${текст(site.calculator.title)}</h2><p class="muted">${текст(site.calculator.subtitle)}</p></div>
    <form id="calculator-form">${поляКвартиры()}
      <fieldset><legend>${текст(site.calculator.type)}</legend><div class="type-grid">${карточкиТарифов()}</div></fieldset>
      <fieldset><legend>${текст(site.calculator.options)}</legend><div class="option-list">${списокОпций()}</div><p class="options-hint">${текст(site.calculator.optionsHint)}</p></fieldset>
    </form><p class="disclaimer">${текст(site.calculator.disclaimer)}</p>`;
}

function отрисоватьРезультат() {
  элемент('results').setAttribute('aria-labelledby', 'result-title');
  элемент('results').innerHTML = `<div class="result-card"><p class="eyebrow">${текст(site.result.eyebrow)}</p>
    <h2 id="result-title">${текст(site.result.title)}</h2>
    <div id="live-result" role="status" aria-live="polite" aria-atomic="true"><span class="total-price">${текст(site.ui.dash)}</span></div>
    <button id="open-form" class="button" type="button" disabled>${текст(site.result.button)}${стрелка()}</button>
    <p class="result-note">${текст(site.result.note)}</p></div><p class="result-scope">${текст(site.result.scope)}</p>`;
}

function отрисоватьОКомпании() {
  элемент('about').setAttribute('aria-labelledby', 'about-title');
  элемент('about').innerHTML = `<div class="container about-inner"><div><p class="eyebrow">${текст(site.about.eyebrow)}</p>
    <h2 id="about-title" class="about-title">${текст(site.about.title)}</h2></div><div><p class="about-text">${текст(site.about.text)}</p>
    ${site.about.points.map((пункт, номер) => `<div class="principle"><span class="principle-number">${String(номер + 1).padStart(2, '0')}</span><div><h3>${текст(пункт.title)}</h3><p>${текст(пункт.text)}</p></div></div>`).join('')}</div></div>`;
}

function отрисоватьОтзывы() {
  элемент('reviews').setAttribute('aria-labelledby', 'reviews-title');
  элемент('reviews').innerHTML = `<div class="container reviews-inner"><div class="section-heading"><p class="eyebrow">${текст(site.reviewsHeading.eyebrow)}</p>
    <h2 id="reviews-title">${текст(site.reviewsHeading.title)}</h2><p class="muted">${текст(site.reviewsHeading.note)}</p></div>
    <div class="review-grid">${site.reviews.map((отзыв) => `<figure class="review"><span class="quote-mark" aria-hidden="true">${текст(site.ui.quote)}</span><blockquote>${текст(отзыв.text)}</blockquote>
      <figcaption><span class="avatar" aria-hidden="true">${текст(отзыв.initials)}</span><div><cite>${текст(отзыв.name)}</cite><small>${текст(отзыв.project)}</small></div></figcaption></figure>`).join('')}</div></div>`;
}

function отрисоватьПодвал() {
  элемент('footer').innerHTML = `<div class="container footer-inner"><div class="footer-top">${логотип()}
    <address class="contacts">${site.contacts.map((контакт) => `<div><span class="contact-label">${текст(контакт.label)}</span>${контакт.href ? `<a href="${текст(контакт.href)}">${текст(контакт.value)}</a>` : `<p>${текст(контакт.value)}</p>`}</div>`).join('')}</address></div>
    <p class="footer-note">${текст(site.footerNote)} ${текст(site.ui.demoContact)}</p></div>`;
}

function отрисоватьСайт() {
  document.title = site.meta.title;
  document.querySelector('meta[name="description"]').content = site.meta.description;
  [отрисоватьШапку, отрисоватьПервыйЭкран, отрисоватьКалькулятор, отрисоватьРезультат,
    отрисоватьОКомпании, отрисоватьОтзывы, отрисоватьПодвал].forEach((отрисовать) => отрисовать());
}

if (typeof document !== 'undefined') отрисоватьСайт();
