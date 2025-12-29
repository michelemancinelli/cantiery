/* =========================
   CONFIG (puoi lasciare così)
   ========================= */
const BOOKING_URL = ""; // se hai Calendly metti qui il link. Se vuoto, apre mail/WhatsApp.
const EMAIL = "info@cantiery.it";
const PHONE = "+39 0123 456789";
const CHECKLIST_FILE = "checklist-primo-sopralluogo.pdf";

/* =========================
   UTILS
   ========================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function openBooking() {
  if (BOOKING_URL && BOOKING_URL.trim().length > 0) {
    window.open(BOOKING_URL, "_blank");
    return;
  }
  // fallback: mailto + whatsapp
  const msg = encodeURIComponent("Ciao! Vorrei prenotare una consulenza CANTIERY.");
  const wa = `https://wa.me/${PHONE.replace(/\D/g, "")}?text=${msg}`;
  // prova WhatsApp, se non va l'utente usa email
  window.open(wa, "_blank");
}

/* =========================
   FOOTER YEAR + CONTACT TEXT
   ========================= */
$("#year").textContent = new Date().getFullYear();
$("#emailText").textContent = EMAIL;
$("#phoneText").textContent = PHONE;

/* =========================
   SMOOTH SCROLL: Watch button
   ========================= */
document.addEventListener("click", function (e) {
  const watch = e.target.closest(".watch-btn");
  if (watch) {
    const target = watch.getAttribute("data-scroll");
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  const booking = e.target.closest("[data-booking]");
  if (booking) openBooking();

  const openModalBtn = e.target.closest("[data-open-modal]");
  if (openModalBtn) openModal();

  const closeModalBtn = e.target.closest("[data-close-modal]");
  if (closeModalBtn) closeModal();
});

/* =========================
   MODAL + FORM (Lead Magnet)
   ========================= */
const modal = $("#leadModal");
const leadForm = $("#leadForm");

function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

leadForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(leadForm).entries());
  data.privacy = !!data.privacy;
  data.date = new Date().toISOString();

  // salva lead in localStorage
  const leads = JSON.parse(localStorage.getItem("cantiery_leads") || "[]");
  leads.push(data);
  localStorage.setItem("cantiery_leads", JSON.stringify(leads));

  // prova download
  tryDownloadChecklist();
  closeModal();
});

function tryDownloadChecklist() {
  const a = document.createElement("a");
  a.href = CHECKLIST_FILE;
  a.download = "CANTIERY-Checklist-Sopralluogo.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* =========================
   QUIZ DATA + LOGIC
   ========================= */
const quizQuestions = [
  // PREVEDI
  {
    id: 1,
    area: "prevedi",
    question: "Prima di iniziare, quanto è chiaro lo stato reale dell’immobile?",
    options: [
      { text: "Ho un’idea, ma niente di strutturato", score: 0 },
      { text: "Ho fatto un sopralluogo, ma senza checklist completa", score: 1 },
      { text: "Ho una lista controlli + priorità abbastanza chiara", score: 2 },
      { text: "Ho checklist, rischi e decisioni principali già impostate", score: 3 },
    ],
  },
  {
    id: 2,
    area: "prevedi",
    question: "Hai definito le priorità (necessario vs desiderio) prima di spendere?",
    options: [
      { text: "No, decido strada facendo", score: 0 },
      { text: "In parte, ma cambio spesso idea", score: 1 },
      { text: "Sì, con una lista e un ordine", score: 2 },
      { text: "Sì, con criteri chiari (budget/uso/valore)", score: 3 },
    ],
  },
  {
    id: 3,
    area: "prevedi",
    question: "Quando parli con tecnici/impresa, sai esattamente cosa chiedere?",
    options: [
      { text: "No, mi affido a loro", score: 0 },
      { text: "Faccio domande generiche", score: 1 },
      { text: "Ho domande preparate e confronto risposte", score: 2 },
      { text: "Ho domande + controlli incrociati e segnali d’allarme", score: 3 },
    ],
  },

  // CONTROLLA
  {
    id: 4,
    area: "controlla",
    question: "Durante i lavori, come monitori avanzamento e qualità?",
    options: [
      { text: "Vado a occhio", score: 0 },
      { text: "Controllo ogni tanto, senza metodo", score: 1 },
      { text: "Ho verifiche a step nei momenti chiave", score: 2 },
      { text: "Ho step, criteri di accettazione e report chiaro", score: 3 },
    ],
  },
  {
    id: 5,
    area: "controlla",
    question: "Come gestisci le varianti (extra/cambi in corsa)?",
    options: [
      { text: "Le accetto e poi vedo il conto", score: 0 },
      { text: "Le valuto, ma senza numeri chiari", score: 1 },
      { text: "Le approvo solo se motivate e tracciate", score: 2 },
      { text: "Regole fisse: costo/tempo/beneficio prima di dire sì", score: 3 },
    ],
  },
  {
    id: 6,
    area: "controlla",
    question: "Chi decide davvero in cantiere (e con quali regole)?",
    options: [
      { text: "Decide l’impresa/chi è sul posto", score: 0 },
      { text: "Decidiamo a sentimento", score: 1 },
      { text: "Decidiamo con priorità e vincoli", score: 2 },
      { text: "Processo chiaro: proposta → impatto → decisione → esecuzione", score: 3 },
    ],
  },

  // RISPARMIA
  {
    id: 7,
    area: "risparmia",
    question: "Sai dove rischi di buttare soldi senza accorgertene?",
    options: [
      { text: "No, lo scopro dopo", score: 0 },
      { text: "Ho sospetti, ma non li misuro", score: 1 },
      { text: "Ho già individuato 2–3 sprechi tipici", score: 2 },
      { text: "Ho una lista precisa: sprechi + contromisure", score: 3 },
    ],
  },
  {
    id: 8,
    area: "risparmia",
    question: "Come scegli materiali e soluzioni tecniche?",
    options: [
      { text: "Mi faccio guidare dal prezzo o dall’estetica", score: 0 },
      { text: "Scelgo quello che mi piace senza comparare", score: 1 },
      { text: "Confronto alternative con pro/contro", score: 2 },
      { text: "Scelgo per valore: durata, manutenzione, costo totale", score: 3 },
    ],
  },
  {
    id: 9,
    area: "risparmia",
    question: "Se domani arriva un extra, sai gestirlo senza panico?",
    options: [
      { text: "No, mi manda fuori rotta", score: 0 },
      { text: "Sì, ma improvviso", score: 1 },
      { text: "Sì, ho margini e priorità", score: 2 },
      { text: "Sì: margini + criteri (accetto/negozio/compenso)", score: 3 },
    ],
  },
];

function getLevel(total) {
  if (total <= 7) {
    return {
      name: "Esploratore",
      desc: "Stai entrando nel cantiere senza strumenti stabili. È qui che nascono extra, ritardi e decisioni impulsive. Buona notizia: puoi migliorare molto in poco tempo.",
    };
  }
  if (total <= 14) {
    return {
      name: "Pratico",
      desc: "Hai buon senso e inizi a controllare, ma ti manca una struttura che ti protegga quando arriva pressione (varianti, tempi, fornitori).",
    };
  }
  if (total <= 20) {
    return {
      name: "Organizzato",
      desc: "Stai già lavorando con logica. Il passo successivo è rendere il controllo ripetibile: meno sorprese e più decisioni pulite.",
    };
  }
  return {
    name: "Controller",
    desc: "Approccio maturo: decisioni tracciate, verifiche nei momenti giusti e scelte guidate dal valore. Qui si ottimizza fino all’ultimo spreco.",
  };
}

function getWeakestArea(scores) {
  const arr = [
    { key: "prev", label: "Prevedi", score: scores.prev },
    { key: "cont", label: "Controlla", score: scores.cont },
    { key: "risp", label: "Risparmia", score: scores.risp },
  ];
  return arr.sort((a, b) => a.score - b.score)[0].key;
}

function getTips(scores) {
  const weakest = getWeakestArea(scores);

  if (weakest === "prev") {
    return [
      "Fai un sopralluogo con checklist: l’obiettivo è scoprire prima criticità e priorità.",
      "Definisci 5 decisioni che non vuoi prendere “in corsa” (budget, layout, impianti, finiture).",
      "Prepara domande standard per tecnici/impresa: se le risposte non sono chiare, il rischio sale.",
    ];
  }

  if (weakest === "cont") {
    return [
      "Imposta controlli a step nei momenti chiave (prima di chiudere lavorazioni e prima delle finiture).",
      "Regola anti-varianti: ogni extra deve avere impatto su costo/tempo prima di approvare.",
      "Traccia le decisioni: proposta → impatto → ok → esecuzione. Anche su WhatsApp, ma chiaro.",
    ];
  }

  return [
    "Smetti di scegliere solo per prezzo: valuta il costo totale (durata, manutenzione, rifacimenti).",
    "Crea una lista sprechi tipici: rifacimenti, tempi morti, extra non necessari, scelte impulsive.",
    "Definisci margine e priorità: se arriva un extra, sai subito da dove compensare.",
  ];
}

/* =========================
   QUIZ RENDER
   ========================= */
const quizRoot = $("#quizApp");
let state = {
  step: 0, // 0 start, 1 questions, 2 results
  current: 0,
  scores: { prev: 0, cont: 0, risp: 0 },
};

renderQuiz();

function renderQuiz() {
  if (!quizRoot) return;

  if (state.step === 0) {
    quizRoot.innerHTML = `
      <div class="quiz-start" id="startQuiz">
        <h3 style="margin:0 0 6px; font-weight:900; font-size:22px;">INIZIA IL TEST (2 min)</h3>
        <div style="color:rgba(255,255,255,.65); font-size:13px;">Risultato immediato + dashboard finale</div>
      </div>
    `;
    $("#startQuiz").addEventListener("click", () => {
      state.step = 1;
      renderQuiz();
    });
    return;
  }

  if (state.step === 1) {
    const q = quizQuestions[state.current];
    const pct = Math.round(((state.current + 1) / quizQuestions.length) * 100);
    const micro =
      state.current < 3
        ? "Stai costruendo il tuo profilo cantiere…"
        : state.current < 6
        ? "Qui si vincono (o si perdono) soldi: avanti."
        : "Ultimo tratto: stai per vedere il tuo punto debole.";

    quizRoot.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress">
          <span>Domanda ${state.current + 1} di ${quizQuestions.length}</span>
          <span>${pct}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>

        <div class="quiz-q">${q.question}</div>

        <div class="quiz-options">
          ${q.options
            .map(
              (o, idx) => `
              <button class="quiz-option" type="button" data-opt="${idx}">
                ${o.text}
              </button>
            `
            )
            .join("")}
        </div>

        <div class="quiz-micro">${micro}</div>
      </div>
    `;

    $$(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-opt"));
        answerQuestion(q.area, q.options[idx].score);
      });
    });

    return;
  }

  // RESULTS
  const total = state.scores.prev + state.scores.cont + state.scores.risp;
  const level = getLevel(total);
  const tips = getTips(state.scores);

  const prevPct = Math.round((state.scores.prev / 9) * 100);
  const contPct = Math.round((state.scores.cont / 9) * 100);
  const rispPct = Math.round((state.scores.risp / 9) * 100);

  quizRoot.innerHTML = `
    <div class="result-card">
      <div class="result-kicker">Il tuo profilo</div>
      <div class="result-level">${level.name}</div>
      <div class="result-desc">${level.desc}</div>

      <div class="bars">
        ${bar("Prevedi", prevPct)}
        ${bar("Controlla", contPct)}
        ${bar("Risparmia", rispPct)}
      </div>

      <div class="tips">
        <h4>3 consigli per te:</h4>
        <ul>
          ${tips.map((t) => `<li>${t}</li>`).join("")}
        </ul>
      </div>

      <div class="result-actions">
        <button class="btn btn-primary" type="button" data-booking>Prenota consulenza</button>
        <button class="btn btn-ghost-dark" type="button" data-open-modal>Scarica checklist</button>
        <button class="btn btn-ghost-dark" type="button" id="restartQuiz">Rifai il test</button>
      </div>
    </div>
  `;

  // anima barre
  setTimeout(() => {
    $$(".bar-fill").forEach((el) => {
      el.style.width = el.getAttribute("data-w") + "%";
    });
  }, 50);

  $("#restartQuiz").addEventListener("click", () => {
    state = { step: 1, current: 0, scores: { prev: 0, cont: 0, risp: 0 } };
    renderQuiz();
  });
}

function bar(label, pct) {
  return `
    <div>
      <div class="bar-top"><span>${label}</span><span>${pct}%</span></div>
      <div class="bar-bg"><div class="bar-fill" data-w="${pct}" style="width:0%"></div></div>
    </div>
  `;
}

function answerQuestion(area, score) {
  if (area === "prevedi") state.scores.prev += score;
  if (area === "controlla") state.scores.cont += score;
  if (area === "risparmia") state.scores.risp += score;

  if (state.current < quizQuestions.length - 1) {
    state.current += 1;
    renderQuiz();
  } else {
    state.step = 2;
    renderQuiz();
  }
}
