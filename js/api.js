// API Client for Turso Database
const DB_URL = 'https://calculadoradigital-andrefmb.aws-us-east-2.turso.io/v2/pipeline';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNjMyNjgsImlkIjoiMDE5ZGM3MmYtMTIwMS03YTIwLTg4ODMtY2ZkZmRlNDk2MDE1IiwicmlkIjoiYzBmYTNiZGUtNjQ5OS00YTZmLTg3ODMtNGIyYzIyZjYyYzViIn0.y3_Fd6QF4nQduEWefFcuxELZdJXFd3sSKDGtnQ2UlWTLmuB0TdUlZquKgPqs2GgrCkatwp9veddjEkY8qwe_AQ';

/**
 * Execute a SQL query over Turso HTTP API
 */
async function executeSql(sql, args = []) {
    const body = {
        requests: [
            {
                type: "execute",
                stmt: {
                    sql: sql,
                    args: args.map(arg => {
                        if (typeof arg === 'number') return { type: 'float', value: arg };
                        if (typeof arg === 'string') return { type: 'text', value: arg };
                        return { type: 'text', value: String(arg) };
                    })
                }
            },
            { type: "close" }
        ]
    };

    try {
        const response = await fetch(DB_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`DB Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Ensure successful execution of the first request
        if (!data.results || !data.results[0] || data.results[0].type === "error") {
            console.error("Turso error detail:", data.results[0]?.error);
            throw new Error(data.results[0]?.error?.message || "Unknown database error");
        }
        
        const resultSet = data.results[0].response.result;
        
        // Convert columns and rows to standard object array
        const columns = resultSet.cols.map(c => c.name);
        return resultSet.rows.map(row => {
            const obj = {};
            row.forEach((val, i) => {
                if (val.type === 'number' || val.type === 'integer' || val.type === 'float') {
                    obj[columns[i]] = Number(val.value);
                } else if (val.value !== null && !isNaN(val.value) && val.value !== '' && typeof val.value === 'string' && columns[i].includes('score')) {
                    // Fallback para campos de score caso o SQLite retorne como TEXT misto
                    obj[columns[i]] = Number(val.value);
                } else {
                    obj[columns[i]] = val.value;
                }
            });
            return obj;
        });

    } catch (error) {
        console.error("Execute SQL Failed:", error);
        throw error;
    }
}

// UUID Polyfill just in case
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Generate an easy 6 char code
function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const api = {
    async criarTurma(nome) {
        const id = generateUUID();
        const codigo = generateCode();
        await executeSql(
            "INSERT INTO turmas (id, codigo, nome) VALUES (?, ?, ?)", 
            [id, codigo, nome]
        );
        return { id, codigo, nome };
    },

    async obterTurmas() {
        return await executeSql("SELECT * FROM turmas ORDER BY created_at DESC");
    },
    
    async buscarTurmaPorCodigo(codigo) {
        const result = await executeSql("SELECT * FROM turmas WHERE codigo = ?", [codigo]);
        return result.length > 0 ? result[0] : null;
    },

    async obterTurmaPorId(id) {
        const result = await executeSql("SELECT * FROM turmas WHERE id = ?", [id]);
        return result.length > 0 ? result[0] : null;
    },

    async salvarResposta(aluno) {
        const id = generateUUID();
        await executeSql(
            `INSERT INTO respostas 
             (id, turma_id, nome_aluno, score_tech, score_data, score_process, score_people, score_total, classification) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                aluno.turma_id,
                aluno.nome_aluno,
                aluno.score_tech,
                aluno.score_data,
                aluno.score_process,
                aluno.score_people,
                aluno.score_total,
                aluno.classification
            ]
        );
        return { id };
    },

    async obterRespostasDaTurma(turmaId) {
        return await executeSql("SELECT * FROM respostas WHERE turma_id = ? ORDER BY created_at DESC", [turmaId]);
    },

    async excluirTurma(turmaId) {
        // Delete responses first (cascade)
        await executeSql("DELETE FROM respostas WHERE turma_id = ?", [turmaId]);
        await executeSql("DELETE FROM turmas WHERE id = ?", [turmaId]);
    }
};

window.api = api;
