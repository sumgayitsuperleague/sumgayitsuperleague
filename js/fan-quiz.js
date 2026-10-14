import * as UI from './i18n.js';
const numbers=n=>[n>=2?n-2:n+1,n,n+2,n>=2?n+4:n+3].map(String);
export function quizQuestions(league){
 const played=(league.matches||[]).filter(m=>m.status==='done'),goals=played.reduce((n,m)=>n+m.hs+m.as,0);
 const numeric=(id,title,n)=>({id,title,choices:numbers(n),answer:1,note:String(n)});
 const items=[numeric('teams','Mövsümdə neçə komanda iştirak edir?',league.teams.length)];
 if(played.length){items.push(numeric('played','Saytda neçə oyun tamamlanmış kimi qeyd olunub?',played.length),numeric('goals','Tamamlanmış oyunlarda ümumilikdə neçə qol vurulub?',goals),numeric('record','Ən məhsuldar bir oyunda neçə qol vurulub?',Math.max(...played.map(m=>m.hs+m.as))));}
 items.push({id:'own-goal',title:'Öz qapısına vurulan qol hansı komandaya yazılır?',choices:['Qolu vuranın komandasına','Hər iki komandaya','Rəqib komandaya','Heç birinə'],answer:2,note:'Qol rəqibin hesabına əlavə olunur; bombardir siyahısına daxil edilmir.'});
 return items;
}
export function quizCard(ctx){
 if(ctx.CMS.community.showQuiz===false)return '';
 return `<section class="league-quiz" aria-labelledby="quiz-title"><div class="quiz-introduction"><span class="eyebrow">Liqa testi</span><h2 id="quiz-title">Liqanı nə qədər tanıyırsan?</h2><p>Cavablar mövsümün saytdakı məlumatlarına əsaslanır.</p><small>Cavabların serverdə saxlanmır.</small></div><div id="league-quiz" class="quiz-panel"></div></section>`;
}
export function bindQuiz(ctx){
 const box=ctx.$('#league-quiz');if(!box)return;
 const questions=quizQuestions(ctx.L);let index=0,score=0,answered=false;
 const draw=()=>{
  answered=false;
  if(index===questions.length){box.innerHTML=`<span class="eyebrow">${UI.t('Test tamamlandı')}</span><h3 tabindex="-1">${score} / ${questions.length}</h3><p>${UI.t('Düzgün cavablar')}</p><div class="quiz-actions"><button type="button" data-quiz-restart>${UI.t('Yenidən başla')} ↻</button><a href="statistika.html">${UI.t('Mövsümün statistikasına bax')} ↗</a></div>`;UI.enhanceRoot(box);return;}
  const q=questions[index];box.innerHTML=`<div class="quiz-progress"><span>${UI.t('Sual')} ${index+1} / ${questions.length}</span><span class="quiz-progress-score">${UI.t('Düzgün cavablar')}: ${score}</span></div><div class="quiz-track" aria-hidden="true"><i style="width:${index/questions.length*100}%"></i></div><h3 tabindex="-1">${ctx.esc(UI.t(q.title))}</h3><div class="quiz-answers" role="group" aria-label="${ctx.esc(UI.t(q.title))}">${q.choices.map((choice,i)=>`<button type="button" data-quiz-answer="${i}"><span>${String.fromCharCode(65+i)}</span>${ctx.esc(UI.t(choice))}</button>`).join('')}</div><div class="quiz-feedback" role="status" aria-live="polite"></div><button class="quiz-next" type="button" data-quiz-next hidden>${UI.t(index===questions.length-1?'Nəticəyə bax':'Növbəti sual')} →</button>`;
 };
 box.addEventListener('click',event=>{
  if(event.target.closest('[data-quiz-restart]')){index=0;score=0;draw();box.querySelector('h3').focus();return;}
  if(event.target.closest('[data-quiz-next]')&&answered){index++;draw();box.querySelector('h3').focus();return;}
  const button=event.target.closest('[data-quiz-answer]');if(!button||answered||index>=questions.length)return;
  answered=true;const q=questions[index],selected=Number(button.dataset.quizAnswer);if(selected===q.answer)score++;
  box.querySelector('.quiz-progress-score').textContent=UI.t('Düzgün cavablar')+': '+score;box.querySelector('.quiz-track i').style.width=(index+1)/questions.length*100+'%';
  for(const answer of box.querySelectorAll('[data-quiz-answer]')){answer.disabled=true;answer.classList.toggle('correct',Number(answer.dataset.quizAnswer)===q.answer);answer.classList.toggle('incorrect',answer===button&&selected!==q.answer);}
  box.querySelector('.quiz-feedback').textContent=UI.t('Düzgün cavab')+': '+UI.t(q.choices[q.answer])+'. '+(q.note!==q.choices[q.answer]?UI.t(q.note):'');box.querySelector('[data-quiz-next]').hidden=false;
 });draw();
}
