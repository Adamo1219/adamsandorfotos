fetch('content/site.json', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) throw new Error('A tartalom nem tölthető be.');
    return response.json();
  })
  .then(d => {
    const $ = selector => document.querySelector(selector);

    const esc = value =>
      String(value ?? '').replace(/[&<>"]/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
      }[char]));

    if ($('.brand b')) $('.brand b').textContent = d.site.name;
    if ($('.brand small')) $('.brand small').textContent = d.site.role;

    if ($('#hero-eyebrow')) $('#hero-eyebrow').textContent = d.hero.eyebrow;
    if ($('#hero-title')) {
      $('#hero-title').innerHTML = esc(d.hero.title).replace(
        /(A pillanatok megmaradnak\.)$/, '<i>$1</i>'
      );
    }
    if ($('#hero-text')) $('#hero-text').textContent = d.hero.text;

    if ($('#about-image')) {
      $('#about-image').src = d.about.image;
      $('#about-image').alt = 'Ádám Sándor Fotós';
    }
    if ($('#about-title')) {
      $('#about-title').innerHTML = esc(d.about.title).replace(
        /(hanem megvárom\.)$/, '<i>$1</i>'
      );
    }
    if ($('#about-text')) {
      $('#about-text').innerHTML = String(d.about.text ?? '')
        .split(/\n\s*\n/)
        .map(p => `<p>${esc(p)}</p>`).join('');
    }

    if ($('#services-list')) {
      $('#services-list').innerHTML = (d.services || []).map(s => {
        const visual = s.before ? `
          <div class="before-after">
            <figure><img src="${esc(s.before)}" alt="Előtte"><figcaption>ELŐTTE</figcaption></figure>
            <figure><img src="${esc(s.after)}" alt="Utána"><figcaption>UTÁNA</figcaption></figure>
            <figure><img src="${esc(s.before2)}" alt="Előtte"><figcaption>ELŐTTE</figcaption></figure>
            <figure><img src="${esc(s.after2)}" alt="Utána"><figcaption>UTÁNA</figcaption></figure>
          </div>` : `
          <div class="service-main">
            <img src="${esc(s.image)}" alt="${esc(s.title)}">
          </div>`;

        return `
          <article class="service">
            <div class="service-copy">
              <span class="number">${esc(s.number)}</span>
              <h3>${esc(s.title)}</h3>
              <p><b>${esc(s.lead)}</b></p>
              <p>${esc(s.text)}</p>
              <div class="price">${esc(s.price)}</div>
              ${s.extra ? `<div class="extra">${esc(s.extra)}</div>` : ''}
            </div>
            ${visual}
          </article>`;
      }).join('');
    }

    if ($('#process-list')) {
      $('#process-list').innerHTML = (d.process || []).map(p => `
        <div class="step">
          <b>${esc(p.number)}</b>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.text)}</p>
        </div>`).join('');
    }

    if ($('#gallery-grid')) {
      $('#gallery-grid').innerHTML = (d.gallery || []).map((image, i) => `
        <a href="${esc(image)}" target="_blank" rel="noopener">
          <img src="${esc(image)}" alt="Ádám Sándor Fotós – gyermekfotó ${i + 1}">
        </a>`).join('');
    }

    if ($('#faq-list')) {
      $('#faq-list').innerHTML = (d.faq || []).map(f => `
        <details>
          <summary>${esc(f.q)}</summary>
          <p>${esc(f.a)}</p>
        </details>`).join('');
    }
  })
  .catch(error => console.error('CMS tartalom betöltési hiba:', error));
