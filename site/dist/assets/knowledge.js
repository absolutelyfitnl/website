(() => {
  'use strict';
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('nl-NL').trim();
  const knowledge = document.querySelector('[data-knowledge]');
  if (knowledge) {
    const input = knowledge.querySelector('[data-knowledge-search]');
    const chips = [...knowledge.querySelectorAll('[data-category-filter]')];
    const cards = [...knowledge.querySelectorAll('[data-knowledge-card]')];
    const count = knowledge.querySelector('[data-knowledge-count]');
    const empty = knowledge.querySelector('[data-knowledge-empty]');
    let category = 'all';
    const update = () => {
      const terms = normalize(input.value).split(/\s+/).filter(Boolean);
      let visible = 0;
      cards.forEach(card => {
        const text = normalize(card.dataset.search);
        card.hidden = !(category === 'all' || card.dataset.category === category) || !terms.every(term => text.includes(term));
        if (!card.hidden) visible += 1;
      });
      count.textContent = `${visible} ${visible === 1 ? 'artikel' : 'artikelen'}${category === 'all' ? ' om verder te bouwen' : ` over ${category.toLocaleLowerCase('nl-NL')}`}`;
      empty.hidden = visible !== 0;
      chips.forEach(chip => chip.setAttribute('aria-pressed', String(chip.dataset.categoryFilter === category)));
    };
    input.addEventListener('input', update);
    chips.forEach(chip => chip.addEventListener('click', () => {category = chip.dataset.categoryFilter; update();}));
    knowledge.querySelector('[data-knowledge-reset]').addEventListener('click', () => {category='all'; input.value=''; update(); input.focus();});
  }

  const faq = document.querySelector('[data-faq]');
  if (faq) {
    const input = faq.querySelector('[data-faq-search]');
    const groups = [...faq.querySelectorAll('[data-faq-group]')];
    const items = [...faq.querySelectorAll('[data-faq-item]')];
    const count = faq.querySelector('[data-faq-count]');
    const empty = faq.querySelector('[data-faq-empty]');
    const update = () => {
      const terms = normalize(input.value).split(/\s+/).filter(Boolean);
      let visible=0;
      items.forEach(item => {
        const text = normalize(item.dataset.search);
        item.hidden = !terms.every(term => text.includes(term));
        if (!item.hidden) visible += 1;
      });
      groups.forEach(group => {group.hidden = ![...group.querySelectorAll('[data-faq-item]')].some(item => !item.hidden);});
      count.textContent = `${visible} ${visible === 1 ? 'antwoord' : 'antwoorden'} op veelgestelde vragen`;
      empty.hidden=visible!==0;
    };
    input.addEventListener('input', update);
    faq.querySelector('[data-faq-reset]').addEventListener('click', () => {input.value=''; update(); input.focus();});
    faq.querySelectorAll('.afk-faq-nav a').forEach(link => link.addEventListener('click', () => {
      if(input.value){input.value='';update();}
    }));
  }

  const sections = [...document.querySelectorAll('[data-article-section]')];
  const anchors = [...document.querySelectorAll('[data-article-anchor]')];
  if (sections.length && anchors.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        anchors.forEach(anchor => {
          if (anchor.hash === `#${entry.target.id}`) anchor.setAttribute('aria-current','true');
          else anchor.removeAttribute('aria-current');
        });
      });
    }, {rootMargin:'-100px 0px -55% 0px',threshold:0});
    sections.forEach(section => observer.observe(section));
  }
})();
