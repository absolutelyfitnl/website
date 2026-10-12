(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const goals = [
    ['sterker','Sterker worden','Kracht, techniek en belastbaarheid'],
    ['fitter','Fitter worden','Conditie, energie en een vast ritme'],
    ['afvallen','Afvallen','Een haalbare aanpak die je kunt volhouden'],
    ['spiermassa','Spiermassa opbouwen','Gericht trainen en progressie volgen'],
    ['prestatie','Beter presteren','Sportspecifiek en doelgericht ontwikkelen']
  ];
  const moments = [
    ['ochtend','In de ochtend','Rustig starten en energiek je dag in'],
    ['middag','In de middag','Trainen tussen werk, studie of afspraken'],
    ['avond','In de avond','Na je werk of aan het einde van de dag'],
    ['wisselend','Dat wisselt','Samen zoeken naar een flexibel ritme']
  ];
  const guidance = [
    ['wegwijs','Eerst wegwijs worden','De club, apparatuur en basis rustig leren kennen'],
    ['startplan','Een persoonlijk startplan','Doel, oefeningen en trainingsweek helder op papier'],
    ['coaching','Regelmatige coaching','Techniekfeedback, evaluatie en bijsturen'],
    ['weet-nog-niet','Dat weet ik nog niet','We leggen de mogelijkheden zonder haast uit']
  ];
  const products = {
    weekly:['1× per week','Voor wie één vast trainingsmoment per week wil opbouwen.'],
    unlimited:['Onbeperkt trainen','Voor wie vaker wil trainen en het weekritme flexibel wil indelen.'],
    'ten-visit':['10-rittenkaart','Een losse reeks van tien trainingsbezoeken.'],
    youth:['Jeugd','De trainingsmogelijkheid voor jeugd, met leeftijd en praktische voorwaarden persoonlijk afgestemd.']
  };
  const results = {
    sterker:{title:'Sterk beginnen, slim opbouwen.',intro:'We starten bij je huidige niveau en bouwen techniek, kracht en belastbaarheid stap voor stap op.',first:'Gratis intake en doelbespreking'},
    fitter:{title:'Meer energie in een haalbaar ritme.',intro:'Kracht en conditie komen samen in een aanpak die realistisch blijft naast werk, gezin of studie.',first:'Jouw startpunt bespreken'},
    afvallen:{title:'Een aanpak die je kunt volhouden.',intro:'Geen snelle beloftes, wel een duidelijk trainingsritme en begeleiding die aansluit bij je dagelijks leven.',first:'Doel en dagelijkse routine bespreken'},
    spiermassa:{title:'Gericht bouwen aan progressie.',intro:'We brengen structuur in oefenkeuze, techniek en trainingsbelasting, passend bij jouw ervaring.',first:'Ervaring en doel concreet maken'},
    prestatie:{title:'Train voor wat jouw sport vraagt.',intro:'Kracht, conditie, techniek en belastbaarheid worden verbonden aan de eisen van jouw sport.',first:'Sport en wedstrijdcontext analyseren'}
  };
  const momentRoute = {ochtend:'Een rustig ochtendmoment kiezen dat in je week past',middag:'Een vast middagmoment rond werk of studie plannen',avond:'Een realistisch avondritme opbouwen',wisselend:'Een flexibele weekstructuur met alternatieven maken'};
  const guidanceRoute = {wegwijs:'Samen de club, apparatuur en eerste oefeningen doorlopen',startplan:'Een persoonlijk startplan en trainingsweek uitwerken',coaching:'Vaste coachmomenten voor techniek en evaluatie afspreken','weet-nog-niet':'Tijdens de gratis intake rustig de opties vergelijken'};
  const params = new URLSearchParams(location.search);
  const requestedProduct = params.get('abonnement');
  const product = requestedProduct && Object.hasOwn(products,requestedProduct) ? requestedProduct : '';
  const wizard = $('[data-intake-wizard]');
  if (wizard) {
    const steps = [
      {key:'goal',title:'Waar wil je aan werken?',options:goals},
      {key:'moment',title:'Wanneer train je het liefst?',options:moments},
      {key:'guidance',title:'Wat heb je nodig om goed te beginnen?',options:guidance}
    ];
    const answers = {goal:'',moment:'',guidance:''};
    let step = 0;
    if (product) {
      $('[data-membership-context]',wizard).hidden = false;
      $('[data-membership-name]',wizard).textContent = products[product][0];
      $('[data-membership-summary]',wizard).textContent = products[product][1];
    }
    const answerLabel = index => steps[index].options.find(choice=>choice[0]===answers[steps[index].key])?.[1] || 'Nog te kiezen';
    const sync = () => {
      const count = Object.values(answers).filter(Boolean).length;
      $('[data-progress-label]',wizard).textContent = step < 3 ? `Stap ${step+1} van 3` : 'Jouw startvoorstel';
      $('[data-progress-count]',wizard).textContent = `${count}/3 gekozen`;
      const progress = $('[data-progress]',wizard);
      progress.value = count;
      progress.setAttribute('aria-label',`Intakevoorbereiding: ${count} van 3 gekozen`);
      $$('[data-step-marker]',wizard).forEach((item,index)=>{
        if(index===step) item.setAttribute('aria-current','step'); else item.removeAttribute('aria-current');
        $('i',item).textContent = answers[steps[index].key] && index!==step ? '✓' : String(index+1);
      });
      steps.forEach((item,index)=>$(`[data-preview-${item.key}]`,wizard).textContent=answerLabel(index));
      $('[data-preview-title]',wizard).textContent=count?'Jouw route krijgt vorm.':'Vertel ons waar je wilt beginnen.';
      if(step<3){
        const current=steps[step];
        $('[data-wizard-prev]',wizard).disabled=step===0;
        $('[data-wizard-next]',wizard).disabled=!answers[current.key];
        $('[data-wizard-next]',wizard).textContent=step===2?'Bekijk mijn startvoorstel →':'Volgende stap →';
        $('[data-choice-notice]',wizard).textContent=answers[current.key]?`${answerLabel(step)} geselecteerd.`:'Kies één optie om verder te gaan.';
      }
    };
    const render = (focus=false) => {
      $('[data-wizard-questions]',wizard).hidden=step===3;
      $('[data-wizard-result]',wizard).hidden=step!==3;
      if(step<3){
        const current=steps[step];
        $('[data-wizard-question]',wizard).textContent=current.title;
        $('[data-wizard-choices]',wizard).innerHTML=current.options.map(([value,label,note])=>`<label class="pr-choice"><input type="radio" name="wizard-${current.key}" value="${value}" ${answers[current.key]===value?'checked':''}><span><strong>${escape(label)}</strong><small>${escape(note)}</small></span><span class="pr-choice-tick" aria-hidden="true">✓</span></label>`).join('');
      }else{
        const result=results[answers.goal];
        $('[data-result-title]',wizard).textContent=result.title;
        $('[data-result-intro]',wizard).textContent=result.intro;
        const summary=[['Doel',answerLabel(0)],['Moment',answerLabel(1)],['Begeleiding',answerLabel(2)]];
        if(product) summary.push(['Product',products[product][0]]);
        $('[data-result-summary]',wizard).innerHTML=summary.map(([key,value])=>`<div><dt>${key}</dt><dd>${escape(value)}</dd></div>`).join('');
        $('[data-result-route]',wizard).innerHTML=[result.first,momentRoute[answers.moment],guidanceRoute[answers.guidance]].map(text=>`<li>${escape(text)}</li>`).join('');
        const query=new URLSearchParams({onderwerp:'intake',doel:answers.goal,moment:answers.moment,begeleiding:answers.guidance});
        if(product) query.set('abonnement',product);
        $('[data-result-contact]',wizard).href='/contact/?'+query.toString();
      }
      sync();
      if(focus) $(step<3?'[data-wizard-question]':'[data-result-title]',wizard).focus({preventScroll:true});
    };
    $('[data-wizard-choices]',wizard).addEventListener('change',event=>{
      const choice=event.target;
      if(choice instanceof HTMLInputElement && steps[step].options.some(option=>option[0]===choice.value)){
        answers[steps[step].key]=choice.value;
        sync();
      }
    });
    $('[data-wizard-next]',wizard).addEventListener('click',()=>{if(step<3&&answers[steps[step].key]){step++;render(true);}});
    $('[data-wizard-prev]',wizard).addEventListener('click',()=>{if(step>0){step--;render(true);}});
    $('[data-wizard-edit]',wizard).addEventListener('click',()=>{step=0;render(true);});
    $('[data-wizard-reset]',wizard).addEventListener('click',()=>{Object.keys(answers).forEach(key=>answers[key]='');step=0;render(true);});
    render();
  }

  const form=$('[data-contact-form]');
  if(form){
    const allowed={
      topic:['intake','abonnement','personal-training','begeleiding','ooievaarspas','anders'],
      membership:Object.keys(products),goal:goals.map(choice=>choice[0]),moment:moments.map(choice=>choice[0]),
      experience:['start','regelmatig','ervaren'],guidance:[...guidance.map(choice=>choice[0]),'zelf','start','intensief']
    };
    const paramKeys={topic:'onderwerp',membership:'abonnement',goal:'doel',moment:'moment',experience:'ervaring',guidance:'begeleiding'};
    let count=0;
    Object.entries(paramKeys).forEach(([name,key])=>{
      const value=params.get(key);
      if(value&&allowed[name].includes(value)){form.elements.namedItem(name).value=value;count++;}
    });
    $('[data-contact-prefill]',form).hidden=!count;
    const prepared=$('[data-message-ready]');
    const message=$('[data-prepared-message]');
    const copyStatus=$('[data-copy-status]');
    const topicLabel=()=>form.elements.namedItem('topic').selectedOptions[0]?.textContent||'Contact';
    const optionLabel=name=>{
      const field=form.elements.namedItem(name);
      return field.value ? field.selectedOptions[0].textContent : '';
    };
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!form.reportValidity()) return;
      const get=name=>form.elements.namedItem(name).value.trim();
      const context=[['Onderwerp',topicLabel()],['Product',optionLabel('membership')],['Doel',optionLabel('goal')],['Voorkeursmoment',optionLabel('moment')],['Ervaring',optionLabel('experience')],['Begeleiding',optionLabel('guidance')]].filter(([,value])=>value).map(([label,value])=>`${label}: ${value}`).join('\n');
      const body=`Hallo Absolutely Fit,\n\n${context}\n\n${get('message')}\n\nMet vriendelijke groet,\n${get('name')}\nE-mailadres: ${get('email')}${get('phone')?'\nTelefoonnummer: '+get('phone'):''}`;
      message.value=body;
      $('[data-open-email]').href='mailto:info@absolutely-fit.nl?subject='+encodeURIComponent('Absolutely Fit · '+topicLabel())+'&body='+encodeURIComponent(body);
      prepared.hidden=false;
      copyStatus.textContent='';
      $('#message-ready-heading').focus({preventScroll:true});
      prepared.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
    });
    form.addEventListener('input',()=>{prepared.hidden=true;copyStatus.textContent='';});
    form.addEventListener('change',()=>{prepared.hidden=true;copyStatus.textContent='';});
    $('[data-copy-message]').addEventListener('click',async()=>{
      try{
        if(!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(message.value);
        copyStatus.textContent='Bericht gekopieerd. Plak het in je e-mail aan info@absolutely-fit.nl.';
      }catch{
        message.focus();message.select();
        copyStatus.textContent='De tekst is geselecteerd. Kopieer hem met de kopieerfunctie van je apparaat.';
      }
    });
    $('[data-prepare-message]',form).disabled=false;
  }

  const schedule=$('[data-schedule]');
  const amsterdamDay=()=>{
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Amsterdam',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const part=key=>Number(parts.find(item=>item.type===key).value);
    return new Date(Date.UTC(part('year'),part('month')-1,part('day'),12));
  };
  const today=amsterdamDay();
  const todayIndex=(today.getUTCDay()+6)%7;
  $$('[data-hours-day]').forEach(row=>row.classList.toggle('is-today',Number(row.dataset.hoursDay)===todayIndex));
  if(schedule){
    let offset=0;
    const days=['Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag','Zondag'];
    const dateFormat=new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'long',timeZone:'UTC'});
    const shortDateFormat=new Intl.DateTimeFormat('nl-NL',{month:'short',timeZone:'UTC'});
    const renderWeek=()=>{
      const monday=new Date(today);monday.setUTCDate(today.getUTCDate()-todayIndex+offset*7);
      const sunday=new Date(monday);sunday.setUTCDate(monday.getUTCDate()+6);
      $('[data-week-range]',schedule).textContent=`${dateFormat.format(monday)} – ${dateFormat.format(sunday)} ${sunday.getUTCFullYear()}`;
      $('[data-week-label]',schedule).textContent=offset===0?'Deze week':offset===1?'Volgende week':offset===-1?'Vorige week':'Geselecteerde week';
      $('[data-week-current]',schedule).disabled=offset===0;
      $('[data-week-days]',schedule).innerHTML=days.map((name,index)=>{
        const date=new Date(monday);date.setUTCDate(monday.getUTCDate()+index);
        const current=offset===0&&index===todayIndex;
        const opens=index<5?'07:00':'08:00';
        const closes=index<4?'22:00':index===4?'21:00':'15:00';
        return `<article class="pr-day${current?' is-today':''}"><span class="pr-day-name">${name}${current?' · vandaag':''}</span><time datetime="${date.toISOString().slice(0,10)}">${date.getUTCDate()} <span style="font-size:13px;font-weight:500;letter-spacing:0;color:#6f829c">${shortDateFormat.format(date)}</span></time><strong>${opens} – ${closes}</strong><small>Reguliere openingstijden</small></article>`;
      }).join('');
    };
    const move=next=>{offset=next;renderWeek();$('[data-schedule-notice]',schedule).textContent=`${$('[data-week-range]',schedule).textContent}: reguliere openingstijden getoond. Vraag afwijkende tijden en begeleide momenten na bij de club.`;};
    $('[data-week-prev]',schedule).addEventListener('click',()=>move(offset-1));
    $('[data-week-next]',schedule).addEventListener('click',()=>move(offset+1));
    $('[data-week-current]',schedule).addEventListener('click',()=>move(0));
    renderWeek();
  }
  const filters=$$('[data-training-filter]');
  filters.forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.trainingFilter;
    filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    let count=0;
    $$('[data-training-card]').forEach(card=>{card.hidden=filter!=='all'&&!card.dataset.trainingCard.split(' ').includes(filter);if(!card.hidden)count++;});
    const status=$('[data-filter-notice]');
    if(status) status.textContent=`${button.textContent}: ${count} ${count===1?'mogelijkheid':'mogelijkheden'}. Exacte begeleide momenten op aanvraag.`;
  }));
})();
