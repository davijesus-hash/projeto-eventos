const express = require('express');
const router = express.Router();
const BD = require('../db');

// LISTAR
router.get('/', async (req, res) => {
    try {
        const resultado = await BD.query(`
            SELECT
                a.id_aluno,
                a.nome AS aluno,
                d.nome_disciplina AS disciplina,
                p.nome_professor AS professor
            FROM alunos a
            INNER JOIN alunos_disciplinas ad
                ON a.id_aluno = ad.id_aluno
            INNER JOIN disciplinas d
                ON ad.id_disciplina = d.id_disciplina
            INNER JOIN professores p
                ON d.id_professor = p.id_professor
            ORDER BY a.id_aluno;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: "Erro ao listar os alunos"
        });
    }
});

// FORMULÁRIO / DADOS PARA CRIAR REGISTRO
router.get('/novo', async (req, res) => {
    try {
        const participantes = await BD.query(`
            SELECT * FROM participantes 
            ORDER BY nome
        `);

        const eventos = await BD.query(`
            SELECT * FROM eventos
            ORDER BY titulo
        `);

        // Renderiza a view passando as linhas recuperadas do banco
        res.render('inscricoes/novo', {
            participantes: participantes.rows,
            eventos: eventos.rows
        });
    } catch (erro) {
        console.error('Erro ao carregar formulário:', erro);
        res.status(500).send("Erro ao carregar dados para o cadastro");
    }
});

module.exports = router;