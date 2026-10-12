(() => {
  'use strict';
  const recommendations = {
    sterker: { title: 'Kracht met een plan', mix: ['Krachttraining', 'Techniektraining', 'Persoonlijk schema'], text: 'Een rustige opbouw in basisoefeningen, met aandacht voor techniek en meetbare progressie.' },
    fitter: { title: 'Sterk én conditioneel', mix: ['Cardio & conditie', 'Spierconditie', 'Krachttraining'], text: 'Een afwisselende trainingsweek die conditie en kracht combineert zonder onnodige ingewikkeldheid.' },
    afvallen: { title: 'Een ritme dat je volhoudt', mix: ['Krachttraining', 'Conditie', 'Persoonlijke begeleiding'], text: 'De focus ligt op consistentie, een haalbare trainingsbelasting en begeleiding die bij jouw dagelijks leven past.' },
    spiermassa: { title: 'Gericht bouwen', mix: ['Krachttraining', 'Bodybuilding', 'Trainingsschema'], text: 'Een progressief schema met passende trainingsvolumes, goede uitvoering en vaste evaluatiemomenten.' },
    prestatie: { title: 'Train voor je sport', mix: ['Strength & Conditioning', 'Sportspecifieke training', 'Programmering'], text: 'We verbinden kracht, conditie, techniek en belastbaarheid aan de eisen van jouw sport.' },
  };
  document.querySelectorAll('[data-training-route]').forEach(widget => {
    const form = widget.querySelector('[data-route-form]');
    const panels = [...widget.querySelectorAll('[data-route-step]')];
    const previous = widget.querySelector('[data-route-prev]');
    const next = widget.querySelector('[data-route-next]');
    const result = widget.querySelector('[data-route-result]');
    const progress = widget.querySelector('[data-route-progress]');
    const progressText = widget.querySelector('[data-route-progress-text]');
    const names = ['doel', 'ervaring', 'begeleiding'];
    let step = 0;
    const values = () => Object.fromEntries(names.map(name => [name, form.elements[name].value]));
    function update(focus = false) {
      const answers = values();
      const count = names.filter(name => answers[name]).length;
      panels.forEach((panel, index) => { panel.hidden = index !== step; });
      form.hidden = step === 3;
      result.hidden = step !== 3;
      previous.disabled = step === 0;
      next.disabled = !answers[names[step]];
      next.innerHTML = step === 2 ? 'Bekijk jouw richting <span aria-hidden="true">→</span>' : 'Volgende stap <span aria-hidden="true">→</span>';
      progress.value = count;
      progress.setAttribute('aria-label', `${count} van 3 vragen beantwoord`);
      progressText.textContent = step === 3 ? 'Jouw persoonlijke richting' : `Vraag 0${step + 1} / 03 · ${count}/3 gekozen`;
      if (focus && step < 3) panels[step].querySelector('legend').focus({ preventScroll: true });
    }
    function showResult() {
      const answers = values();
      const advice = recommendations[answers.doel];
      if (!advice || !answers.ervaring || !answers.begeleiding) return;
      const levelPlan = answers.ervaring === 'start' ? 'Basisbewegingen en startniveau rustig bepalen' : answers.ervaring === 'regelmatig' ? 'Huidige training analyseren en progressie structureren' : 'Details, belasting en programmering aanscherpen';
      const supportPlan = answers.begeleiding === 'zelf' ? 'Een zelfstandig plan met een helder evaluatiemoment' : answers.begeleiding === 'start' ? 'Een begeleide start met techniekfeedback en evaluatie' : 'Regelmatige coachmomenten en intensief bijsturen';
      const query = new URLSearchParams({ onderwerp: 'intake', doel: answers.doel, begeleiding: answers.begeleiding, ervaring: answers.ervaring });
      result.innerHTML = `<div class="split"><div><span class="eyebrow">Jouw startpunt</span><h3 tabindex="-1">${advice.title}</h3><p>${advice.text}</p><ul class="list-check">${advice.mix.map(item => `<li>${item}</li>`).join('')}</ul><div class="actions"><a class="btn" href="/contact/?${query.toString()}">Vraag je gratis intake aan <span aria-hidden="true">↗</span></a><button class="btn secondary" type="button" data-route-reset>Opnieuw kiezen</button></div></div><div class="training-result-plan"><span class="eyebrow">Jouw antwoorden vertaald</span><ol><li>Gratis intake en jouw doel concreet maken</li><li>${levelPlan}</li><li>${supportPlan}</li></ol><small>De coach gebruikt je drie keuzes als startpunt en maakt samen met jou het definitieve plan.</small></div></div>`;
      step = 3;
      update();
      result.querySelector('h3').focus({ preventScroll: true });
      result.querySelector('[data-route-reset]').addEventListener('click', () => {
        form.reset();
        step = 0;
        update(true);
      });
    }
    form.addEventListener('change', () => update());
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!values()[names[step]]) return;
      if (step === 2) showResult();
      else { step += 1; update(true); }
    });
    previous.addEventListener('click', () => { step = Math.max(0, step - 1); update(true); });
    update();
  });
})();
