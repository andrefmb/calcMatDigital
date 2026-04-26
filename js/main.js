const QUESTIONS = [
    {
        id: 'q1', dimension: 'Tecnologia', dimKey: 'score_tech',
        text: 'Como você avalia a infraestrutura tecnológica atual da empresa em relação à nuvem?',
        options: [
            { text: 'Ainda usamos servidores físicos locais (on-premise) para quase tudo.', value: 1 },
            { text: 'Temos algumas aplicações isoladas na nuvem, mas o núcleo continua local.', value: 2 },
            { text: 'Migramos os principais sistemas para a nuvem, porém há pouca integração.', value: 3 },
            { text: 'Operamos majoritariamente na nuvem, com arquitetura integrada e escalável.', value: 4 },
            { text: 'Somos cloud-native, utilizando microserviços, serverless e automação contínua.', value: 5 }
        ]
    },
    {
        id: 'q2', dimension: 'Tecnologia', dimKey: 'score_tech',
        text: 'Qual é o nível de automação da segurança da informação na sua rotina?',
        options: [
            { text: 'Segurança é reativa, verificada apenas após a detecção de problemas.', value: 1 },
            { text: 'Existem políticas de segurança básicas, mas dependem de checagem manual.', value: 2 },
            { text: 'Monitoramento contínuo em áreas-chave, com ferramentas automatizadas.', value: 3 },
            { text: 'Segurança integrada aos processos (DevSecOps), com resposta automática.', value: 4 },
            { text: 'Segurança preditiva e altamente automatizada, usando IA para prevenção.', value: 5 }
        ]
    },
    {
        id: 'q3', dimension: 'Dados & Analytics', dimKey: 'score_data',
        text: 'Como os dados são utilizados na tomada de decisão da empresa?',
        options: [
            { text: 'As decisões são baseadas primariamente em intuição ou experiência passada.', value: 1 },
            { text: 'Usamos planilhas simples e relatórios ad-hoc, analisando dados passados.', value: 2 },
            { text: 'Temos dashboards em tempo real (BI) que ajudam nas operações diárias.', value: 3 },
            { text: 'Decisões estratégicas são baseadas em análises preditivas cruzadas.', value: 4 },
            { text: 'Utilizamos modelos de IA/ML integrados na estratégia em tempo real.', value: 5 }
        ]
    },
    {
        id: 'q4', dimension: 'Dados & Analytics', dimKey: 'score_data',
        text: 'Qual é o nível de integração e qualidade dos dados entre departamentos?',
        options: [
            { text: 'Dados vivem em silos completamente isolados por cada departamento.', value: 1 },
            { text: 'Integrações manuais esporádicas. Padrões de dados inconsistentes.', value: 2 },
            { text: 'A maioria dos sistemas está integrada, criando rastreabilidade parcial.', value: 3 },
            { text: 'Data Warehouse/Lake organizado, servindo de single source of truth.', value: 4 },
            { text: 'Governança avançada: dados acessíveis, limpos, seguros e com Data Mesh.', value: 5 }
        ]
    },
    {
        id: 'q5', dimension: 'Processos Digitais', dimKey: 'score_process',
        text: 'Em relação à jornada digital do cliente, como seu processo está estruturado?',
        options: [
            { text: 'Atendimento majoritariamente analógico, sem canais digitais próprios.', value: 1 },
            { text: 'Canais digitais básicos (email, WhatsApp), mas processos desconectados.', value: 2 },
            { text: 'Jornada digital padronizada, porém a customização é muito manual.', value: 3 },
            { text: 'Experiência omnichannel fluida, transitando sem fricção entre canais.', value: 4 },
            { text: 'Jornada ultra-personalizada, guiada por algoritmos que antecipam necessidades.', value: 5 }
        ]
    },
    {
        id: 'q6', dimension: 'Processos Digitais', dimKey: 'score_process',
        text: 'Quão ágil é o desenvolvimento ou adaptação de novos processos internos?',
        options: [
            { text: 'Mudanças levam meses. Processos fortemente burocráticos (Waterfall rígido).', value: 1 },
            { text: 'Tentamos metodologias ágeis ocasionalmente, mas a execução é lenta.', value: 2 },
            { text: 'Temos squads ágeis trabalhando em produtos prioritários.', value: 3 },
            { text: 'A agilidade (Scrum, Kanban, Lean) é cultura. Adaptamos rapidamente.', value: 4 },
            { text: 'Inovação contínua com ciclos de deploy imediatos (CI/CD) por toda a empresa.', value: 5 }
        ]
    },
    {
        id: 'q7', dimension: 'Pessoas & Cultura', dimKey: 'score_people',
        text: 'Como é tratada a capacitação digital (upskilling) dos colaboradores?',
        options: [
            { text: 'Não há programas formais de capacitação digital ou tecnológica.', value: 1 },
            { text: 'Treinamentos ocorrem apenas na adoção pontual de um novo software.', value: 2 },
            { text: 'Programa estruturado de letramento digital, mas é opcional.', value: 3 },
            { text: 'Capacitação digital contínua faz parte das métricas de evolução da equipe.', value: 4 },
            { text: 'Talentos são hubs de inovação autônomos. Cultura de excelência digital.', value: 5 }
        ]
    },
    {
        id: 'q8', dimension: 'Pessoas & Cultura', dimKey: 'score_people',
        text: 'Como as lideranças enxergam a transformação digital e inovações disruptivas (IA)?',
        options: [
            { text: 'Vistas como custos arriscados, adotados apenas por obrigação.', value: 1 },
            { text: 'Aceitos como suporte operacional; foco principal no modelo tradicional.', value: 2 },
            { text: 'Liderança apoia e investe ativamente, entendendo a necessidade competitiva.', value: 3 },
            { text: 'Líderes são patrocinadores diretos: digital está no centro do negócio.', value: 4 },
            { text: 'Liderança disruptiva constante, questionando o status quo antes dos concorrentes.', value: 5 }
        ]
    }
];

const DIMENSIONS = ['Tecnologia', 'Dados & Analytics', 'Processos Digitais', 'Pessoas & Cultura'];
const DIM_KEYS = ['score_tech', 'score_data', 'score_process', 'score_people'];

let state = {
    turma: null,
    currentQ: 0,
    answers: {}
};

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('turma');

    if (!code) { showView('errorView'); return; }

    try {
        const turma = await window.api.buscarTurmaPorCodigo(code);
        if (!turma) { showView('errorView'); return; }
        state.turma = turma;
        document.getElementById('lblNomeTurma').innerText = turma.nome;
        showView('welcomeView');
    } catch (e) {
        console.error(e);
        showView('errorView');
    }

    document.getElementById('formInit').addEventListener('submit', (e) => {
        e.preventDefault();
        state.currentQ = 0;
        state.answers = {};
        renderQuestion();
        showView('wizardView');
    });

    document.getElementById('btnNext').addEventListener('click', handleNext);
    document.getElementById('btnPrev').addEventListener('click', handlePrev);
});

function showView(id) {
    ['loadingView', 'errorView', 'welcomeView', 'wizardView', 'resultView'].forEach(v => document.getElementById(v).classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function renderQuestion() {
    const q = QUESTIONS[state.currentQ];
    const total = QUESTIONS.length;

    document.getElementById('lblDimension').innerText = q.dimension;
    document.getElementById('lblProgress').innerText = `${state.currentQ + 1} / ${total}`;
    document.getElementById('progressBar').style.width = `${((state.currentQ + 1) / total) * 100}%`;
    document.getElementById('questionTitle').innerText = q.text;

    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.type = 'button';
        if (state.answers[q.id] === opt.value) btn.classList.add('selected');
        btn.innerHTML = `<div class="option-num">${opt.value}</div><span>${opt.text}</span>`;
        btn.addEventListener('click', () => selectOption(opt.value, btn));
        container.appendChild(btn);
    });

    updateNav();
}

function selectOption(value, el) {
    state.answers[QUESTIONS[state.currentQ].id] = value;
    document.querySelectorAll('.option-btn').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('btnNext').disabled = false;
}

function updateNav() {
    const isFirst = state.currentQ === 0;
    const isLast = state.currentQ === QUESTIONS.length - 1;
    const hasAnswer = !!state.answers[QUESTIONS[state.currentQ].id];

    document.getElementById('btnPrev').classList.toggle('hidden', isFirst);
    document.getElementById('spacerLeft').classList.toggle('hidden', !isFirst);
    
    const btnNext = document.getElementById('btnNext');
    btnNext.innerText = isLast ? 'Finalizar ✓' : 'Avançar →';
    btnNext.disabled = !hasAnswer;
}

function handleNext() {
    if (state.currentQ < QUESTIONS.length - 1) { state.currentQ++; renderQuestion(); }
    else finishAssessment();
}

function handlePrev() {
    if (state.currentQ > 0) { state.currentQ--; renderQuestion(); }
}

async function finishAssessment() {
    showView('loadingView');

    const v = (ids) => ids.reduce((s, id) => s + state.answers[id], 0);
    const sTech = (v(['q1', 'q2']) / 10) * 100;
    const sData = (v(['q3', 'q4']) / 10) * 100;
    const sProc = (v(['q5', 'q6']) / 10) * 100;
    const sPeop = (v(['q7', 'q8']) / 10) * 100;
    const sTotal = (sTech + sData + sProc + sPeop) / 4;

    let classification = 'Starter';
    if (sTotal >= 80) classification = 'Leader';
    else if (sTotal >= 60) classification = 'Adopter';
    else if (sTotal >= 40) classification = 'Beginner';

    try {
        await window.api.salvarResposta({
            turma_id: state.turma.id,
            nome_aluno: 'Anônimo',
            score_tech: sTech, score_data: sData,
            score_process: sProc, score_people: sPeop,
            score_total: sTotal, classification
        });
    } catch (e) {
        console.error('Falha ao salvar no banco:', e);
    }

    renderResult(sTotal, classification, [sTech, sData, sProc, sPeop]);
    showView('resultView');
}

function renderResult(sTotal, classification, scores) {
    document.getElementById('resScoreTotal').innerText = `${sTotal.toFixed(1)}%`;
    
    const badge = document.getElementById('resClassificationBadge');
    badge.className = `badge badge-${classification.toLowerCase()}`;
    badge.innerText = classification;

    const descriptions = {
        Starter: 'A empresa está nos primeiros passos da jornada digital. Tecnologias e processos ainda seguem padrões tradicionais com muito trabalho manual não integrado.',
        Beginner: 'Há entendimento do potencial digital e esforços iniciais em silos, mas integração e cultura data-driven ainda não são uma realidade espalhada na organização.',
        Adopter: 'A mentalidade digital sustenta as operações. Grande parte dos processos é suportada por dados consistentes e ferramentas automatizadas estão escalando o negócio.',
        Leader: 'Operam no estado da arte. Liderança disruptiva, uso intenso de nuvem, IA e dados moldam o modelo de negócio de forma preditiva. Vocês definem o padrão de mercado.'
    };
    document.getElementById('resDescription').innerText = descriptions[classification];

    // Radar Chart
    const ctx = document.getElementById('studentRadarChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: DIMENSIONS,
            datasets: [{
                label: 'Sua Maturidade (%)',
                data: scores,
                backgroundColor: 'rgba(79,70,229,0.15)',
                borderColor: 'rgba(79,70,229,1)',
                borderWidth: 2.5,
                pointBackgroundColor: 'rgba(79,70,229,1)',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { r: { min: 0, max: 100, ticks: { stepSize: 20, font: { family: 'Outfit' } }, pointLabels: { font: { family: 'Outfit', size: 12, weight: '600' } } } },
            plugins: { legend: { display: false } }
        }
    });

    // Dimension Breakdown Cards
    const breakdown = document.getElementById('dimBreakdown');
    breakdown.innerHTML = '';
    
    const dimData = DIMENSIONS.map((name, i) => ({ name, score: scores[i] }));
    dimData.sort((a, b) => b.score - a.score);

    dimData.forEach((dim, idx) => {
        const isStrength = idx < 2;
        const color = isStrength ? 'var(--success)' : 'var(--danger)';
        const bgColor = isStrength ? 'var(--success-light)' : 'var(--danger-light)';
        const label = isStrength ? 'Força' : 'Oportunidade';
        const icon = isStrength 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>';
        
        breakdown.innerHTML += `
            <div class="card" style="padding:1.25rem;">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <div style="width:32px;height:32px;border-radius:8px;background:${bgColor};color:${color};display:flex;align-items:center;justify-content:center;">
                            ${icon}
                        </div>
                        <h4 style="font-size:0.9375rem;font-weight:600;">${dim.name}</h4>
                    </div>
                    <span style="font-weight:800;font-size:1.25rem;color:${color};">${dim.score.toFixed(0)}%</span>
                </div>
                <div style="height:6px;background:var(--border-light);border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:${dim.score}%;background:${color};border-radius:3px;transition:width 0.6s ease;"></div>
                </div>
                <p style="font-size:0.75rem;color:var(--text-light);margin-top:0.5rem;">${label}</p>
            </div>
        `;
    });
}
