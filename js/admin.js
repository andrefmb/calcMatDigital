document.addEventListener('DOMContentLoaded', () => {
    carregarTurmas();

    // ─── Create Turma ───
    document.getElementById('form-nova-turma').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nomeTurma').value.trim();
        if (!nome) return;
        const btn = e.target.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        
        try {
            btn.innerHTML = '<span class="spinner"></span> Criando...';
            btn.disabled = true;
            
            const turma = await window.api.criarTurma(nome);
            
            const linkDiv = document.getElementById('resultadoTurmaCriada');
            const linkInput = document.getElementById('linkTurma');
            const urlBase = window.location.href.replace(/\/admin\.html.*$/, '').replace(/\/$/, '');
            linkInput.value = `${urlBase}/index.html?turma=${turma.codigo}`;
            linkDiv.classList.remove('hidden');
            document.getElementById('nomeTurma').value = '';
            
            carregarTurmas();
        } catch (error) {
            alert('Erro ao criar turma: ' + error.message);
        } finally {
            btn.innerHTML = original;
            btn.disabled = false;
        }
    });

    // ─── Copy Link ───
    document.getElementById('btnCopiarLink').addEventListener('click', async () => {
        const link = document.getElementById('linkTurma').value;
        try {
            await navigator.clipboard.writeText(link);
            const btn = document.getElementById('btnCopiarLink');
            const original = btn.innerHTML;
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copiado!';
            setTimeout(() => { btn.innerHTML = original; }, 2000);
        } catch { 
            document.getElementById('linkTurma').select();
            document.execCommand('copy');
        }
    });

    // ─── Close Dashboard ───
    document.getElementById('btnFecharResultados').addEventListener('click', () => {
        document.getElementById('secaoResultados').classList.add('hidden');
        document.getElementById('turmaOverviewStats').classList.remove('hidden');
    });

    // ─── Table Event Delegation ───
    document.getElementById('tabelaTurmas').addEventListener('click', (e) => {
        const btnRes = e.target.closest('.btn-resultados');
        if (btnRes) {
            verResultados(btnRes.dataset.id, btnRes.dataset.nome);
            return;
        }
        const btnDel = e.target.closest('.btn-excluir');
        if (btnDel) {
            abrirModalExcluir(btnDel.dataset.id, btnDel.dataset.nome);
        }
    });

    // ─── Modal Controls ───
    document.getElementById('btnCancelExcluir').addEventListener('click', fecharModal);
    document.getElementById('modalExcluir').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) fecharModal();
    });
});

// ═══════════════════════════════════════════
// DELETE MODAL
// ═══════════════════════════════════════════
let turmaParaExcluir = null;

function abrirModalExcluir(id, nome) {
    turmaParaExcluir = id;
    document.getElementById('modalExcluir').classList.add('active');

    const btnConfirm = document.getElementById('btnConfirmExcluir');
    // Clone to remove old listeners
    const newBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);
    
    newBtn.addEventListener('click', async () => {
        newBtn.disabled = true;
        newBtn.innerHTML = 'Excluindo...';
        try {
            await window.api.excluirTurma(turmaParaExcluir);
            fecharModal();
            document.getElementById('secaoResultados').classList.add('hidden');
            carregarTurmas();
        } catch (error) {
            alert('Erro ao excluir turma: ' + error.message);
        } finally {
            newBtn.disabled = false;
            newBtn.innerHTML = 'Excluir';
        }
    });
}

function fecharModal() {
    document.getElementById('modalExcluir').classList.remove('active');
    turmaParaExcluir = null;
}

// ═══════════════════════════════════════════
// LOAD TURMAS TABLE
// ═══════════════════════════════════════════
async function carregarTurmas() {
    try {
        const turmas = await window.api.obterTurmas();
        const tbody = document.getElementById('turmasBody');
        
        if (turmas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state" style="padding:2rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <h3>Nenhuma turma criada</h3>
                <p>Use o formulário acima para criar sua primeira turma.</p>
            </div></td></tr>`;
            return;
        }

        // Fetch response counts for each turma in parallel
        const countPromises = turmas.map(t => window.api.obterRespostasDaTurma(t.id).then(r => r.length).catch(() => 0));
        const counts = await Promise.all(countPromises);
        
        tbody.innerHTML = '';

        turmas.forEach((turma, idx) => {
            const tr = document.createElement('tr');
            const dataCriacao = turma.created_at ? new Date(turma.created_at + 'Z').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
            const respCount = counts[idx];
            
            tr.innerHTML = `
                <td style="font-weight:600;">${turma.nome}</td>
                <td><span class="code-pill">${turma.codigo}</span></td>
                <td style="color:var(--text-muted);">${dataCriacao}</td>
                <td>
                    <span style="font-weight:700;color:${respCount > 0 ? 'var(--primary)' : 'var(--text-light)'};">${respCount}</span>
                </td>
                <td style="text-align:right;">
                    <div class="flex gap-2" style="justify-content:flex-end;">
                        <button class="btn btn-secondary btn-sm btn-resultados" data-id="${turma.id}" data-nome="${turma.nome.replace(/"/g, '&quot;')}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                            Dashboard
                        </button>
                        <button class="btn btn-danger btn-sm btn-excluir" data-id="${turma.id}" data-nome="${turma.nome.replace(/"/g, '&quot;')}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar turmas', error);
    }
}

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
const DIMENSIONS = ['Tecnologia', 'Dados & Analytics', 'Processos Digitais', 'Pessoas & Cultura'];
const DIM_KEYS = ['score_tech', 'score_data', 'score_process', 'score_people'];

let radarChart = null;
let barChart = null;

async function verResultados(turmaId, turmaNome) {
    document.getElementById('turmaOverviewStats').classList.add('hidden');
    document.getElementById('secaoResultados').classList.remove('hidden');
    document.getElementById('tituloResultadosTurma').innerText = turmaNome;

    try {
        const respostas = await window.api.obterRespostasDaTurma(turmaId);
        const n = respostas.length;

        // KPIs
        document.getElementById('kpiRespostas').innerText = n;
        document.getElementById('statTotalRespostas').innerText = n;
        
        if (n === 0) {
            document.getElementById('kpiMedia').innerText = '–';
            document.getElementById('kpiStrength').innerText = '–';
            document.getElementById('kpiWeakness').innerText = '–';
            document.getElementById('statMediaGeral').innerText = '–';
            document.getElementById('subtituloResultados').innerText = 'Nenhuma resposta registrada ainda.';
            document.getElementById('insightsStrengths').innerHTML = '<p style="font-size:0.875rem;">Ainda não há dados suficientes.</p>';
            document.getElementById('insightsWeaknesses').innerHTML = '<p style="font-size:0.875rem;">Ainda não há dados suficientes.</p>';
            renderCharts([0,0,0,0], [0,0,0,0]);
            return;
        }
        
        document.getElementById('subtituloResultados').innerText = `${n} resposta${n > 1 ? 's' : ''} registrada${n > 1 ? 's' : ''}`;

        // Aggregate Averages
        const sums = { score_tech: 0, score_data: 0, score_process: 0, score_people: 0, score_total: 0 };
        const niveisCount = { Starter: 0, Beginner: 0, Adopter: 0, Leader: 0 };
        
        respostas.forEach(r => {
            DIM_KEYS.forEach(k => { sums[k] += Number(r[k]) || 0; });
            sums.score_total += Number(r.score_total) || 0;
            niveisCount[r.classification] = (niveisCount[r.classification] || 0) + 1;
        });

        const avgs = {};
        DIM_KEYS.forEach(k => { avgs[k] = sums[k] / n; });
        const avgTotal = sums.score_total / n;

        document.getElementById('kpiMedia').innerText = `${avgTotal.toFixed(1)}%`;
        document.getElementById('statMediaGeral').innerText = `${avgTotal.toFixed(1)}%`;

        // Find Strongest + Weakest Dimension
        const dimScores = DIMENSIONS.map((name, i) => ({ name, score: avgs[DIM_KEYS[i]] }));
        dimScores.sort((a, b) => b.score - a.score);
        
        const strongest = dimScores[0];
        const weakest = dimScores[dimScores.length - 1];

        document.getElementById('kpiStrength').innerText = strongest.name;
        document.getElementById('kpiWeakness').innerText = weakest.name;

        // Render Insights
        renderInsights(dimScores);

        // Render Charts
        renderCharts(
            DIM_KEYS.map(k => avgs[k]),
            [niveisCount.Starter, niveisCount.Beginner, niveisCount.Adopter, niveisCount.Leader]
        );

    } catch (error) {
        console.error('Erro ao buscar as respostas:', error);
        alert('Ocorreu um erro ao carregar o dashboard: ' + error.message);
    }
}

// ═══════════════════════════════════════════
// INSIGHTS 
// ═══════════════════════════════════════════
const INSIGHT_DETAILS = {
    'Tecnologia': {
        high: 'Infraestrutura robusta e segurança automatizada indicam alta prontidão tecnológica.',
        low: 'Infraestrutura legada e segurança reativa representam riscos operacionais significativos.'
    },
    'Dados & Analytics': {
        high: 'Cultura orientada a dados consolidada, com governança e decisões baseadas em analytics.',
        low: 'Dados em silos e decisões por intuição limitam a capacidade analítica e estratégica.'
    },
    'Processos Digitais': {
        high: 'Jornadas digitais fluidas e agilidade metodológica garantem velocidade de adaptação.',
        low: 'Processos manuais e ciclos lentos de entrega dificultam a competitividade digital.'
    },
    'Pessoas & Cultura': {
        high: 'Liderança engajada e upskilling contínuo formam uma cultura digital madura.',
        low: 'Lacunas de capacitação e resistência da liderança freiam a transformação digital.'
    }
};

function renderInsights(dimScores) {
    const strengthsEl = document.getElementById('insightsStrengths');
    const weaknessesEl = document.getElementById('insightsWeaknesses');
    strengthsEl.innerHTML = '';
    weaknessesEl.innerHTML = '';

    // Strengths: top 2
    dimScores.slice(0, 2).forEach(dim => {
        strengthsEl.innerHTML += `
            <div class="insight-chip">
                <div class="insight-icon strength">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <div>
                    <div class="insight-title">${dim.name} · ${dim.score.toFixed(1)}%</div>
                    <div class="insight-subtitle">${INSIGHT_DETAILS[dim.name]?.high || ''}</div>
                </div>
            </div>
        `;
    });

    // Weaknesses: bottom 2 (reversed)
    dimScores.slice(-2).reverse().forEach(dim => {
        weaknessesEl.innerHTML += `
            <div class="insight-chip">
                <div class="insight-icon weakness">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                </div>
                <div>
                    <div class="insight-title">${dim.name} · ${dim.score.toFixed(1)}%</div>
                    <div class="insight-subtitle">${INSIGHT_DETAILS[dim.name]?.low || ''}</div>
                </div>
            </div>
        `;
    });
}

// ═══════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════
function renderCharts(radarData, barData) {
    const chartColors = {
        primary: 'rgba(79, 70, 229, 1)',
        primaryBg: 'rgba(79, 70, 229, 0.15)',
        primaryBorder: 'rgba(79, 70, 229, 0.6)',
    };

    // Radar
    const ctxRadar = document.getElementById('turmaRadarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    radarChart = new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: DIMENSIONS,
            datasets: [{
                label: 'Média (%)',
                data: radarData,
                backgroundColor: chartColors.primaryBg,
                borderColor: chartColors.primary,
                borderWidth: 2.5,
                pointBackgroundColor: chartColors.primary,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { r: { min: 0, max: 100, ticks: { stepSize: 20, font: { family: 'Outfit' } }, pointLabels: { font: { family: 'Outfit', size: 12, weight: '600' } } } },
            plugins: { legend: { display: false } }
        }
    });

    // Bar
    const ctxBar = document.getElementById('turmaBarChart').getContext('2d');
    if (barChart) barChart.destroy();
    const barColors = ['#fca5a5', '#fcd34d', '#93c5fd', '#6ee7b7'];
    const barBorders = ['#dc2626', '#d97706', '#2563eb', '#059669'];
    barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Starter', 'Beginner', 'Adopter', 'Leader'],
            datasets: [{
                label: 'Alunos',
                data: barData,
                backgroundColor: barColors,
                borderColor: barBorders,
                borderWidth: 1.5,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: 'Outfit' } }, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { ticks: { font: { family: 'Outfit', weight: '600' } }, grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}
