// Reveal on scroll (effetto moderno “scorri e appare”, senza essere Apple-complesso)
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add("show");
  });
},{threshold:0.12});

document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

// Mini test (semplice ma funziona)
const quiz = {
  step: 0,
  score: 0,
  questions: [
    { q:"Quando fai un sopralluogo, da cosa parti?",
      a:[
        {t:"Estetica e sensazioni", v:0},
        {t:"Distribuzione spazi", v:1},
        {t:"Stato reale + criticità + potenziale", v:2},
      ]
    },
    { q:"Come valuti i costi di ristrutturazione?",
      a:[
        {t:"Mi affido a chi farà i lavori", v:0},
        {t:"Chiedo una stima generale", v:1},
        {t:"Faccio domande mirate e verifiche", v:2},
      ]
    },
    { q:"La scelta più “pericolosa” è:",
      a:[
        {t:"Decidere tardi", v:0},
        {t:"Decidere senza numeri", v:0},
        {t:"Decidere senza metodo e controllo", v:0},
      ]
    },
    { q:"Obiettivo principale dell’immobile:",
      a:[
        {t:"Abitarci", v:1},
        {t:"Investimento / rendita", v:2},
        {t:"Non lo so ancora", v:0},
      ]
    },
  ]
};

function renderQuiz(){
  const box = document.getElementById("quizBox");
  const result = document.getElementById("quizResult");
  if(!box) return;

  result.innerHTML = "";
  const item = quiz.questions[quiz.step];

  box.innerHTML = `
    <div class="card" style="min-height:auto">
      <p class="title"><span class="dot"></span> Test rapido (${quiz.step+1}/${quiz.questions.length})</p>
      <h3 style="margin:0 0 10px; font-size:18px;">${item.q}</h3>
      <div style="display:grid; gap:10px; margin-top:10px;">
        ${item.a.map((x,i)=>`<button class="btn" onclick="answer(${i})" style="justify-content:flex-start">${x.t}</button>`).join("")}
      </div>
    </div>
  `;
}

window.answer = (i)=>{
  quiz.score += quiz.questions[quiz.step].a[i].v;
  quiz.step++;

  if(quiz.step >= quiz.questions.length){
    const result = document.getElementById("quizResult");
    const box = document.getElementById("quizBox");
    box.innerHTML = "";

    let label = "Sotto controllo";
    let msg = "Hai già una buona impostazione. Ora ti serve una checklist chiara per non perdere valore.";
    if(quiz.score <= 2){
      label = "A rischio";
      msg = "Stai rischiando extra-costi e scelte sbagliate. La checklist ti fa partire col piede giusto.";
    }
    if(quiz.score <= 1){
      label = "Fuori controllo";
      msg = "Qui il rischio è alto: senza metodo potresti bruciare budget e valore. Scarica la checklist e riparti.";
    }

    result.innerHTML = `
      <div class="quote reveal show">
        <b>Risultato: ${label}</b>
        <p>${msg}</p>
        <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap">
          <a class="btn btn-primary" href="#download">Scarica la checklist</a>
          <a class="btn" href="chi-sono.html">Chi sono</a>
        </div>
      </div>
    `;
    return;
  }

  renderQuiz();
};

document.addEventListener("DOMContentLoaded", renderQuiz);
