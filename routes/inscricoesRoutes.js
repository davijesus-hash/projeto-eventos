const express = require('express');
const router = express.Router();
const BD = require('../db');

// Listar
router.get('/', async (req, res) => {
    const busca = req.query.busca || '';
    const ordem = req.query.ordem || 'id';
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = 10; // Quantidade de registros por página
    const offset = (pagina - 1) * limite;

    const ordenacoesPermitidas = {
        id: 'i.id ASC',
        id_desc: 'i.id DESC',
        participante: 'p.nome ASC',
        evento: 'e.titulo ASC',
        status: 'i.status ASC'
    };
    const orderBy = ordenacoesPermitidas[ordem] || 'i.id ASC';

    try {
        // 1. Conta o total de registros que batem com a busca (para a paginação)
        const countResult = await BD.query(`
            SELECT COUNT(*) AS total
            FROM inscricoes i
            INNER JOIN participantes p ON i.participante_id = p.id
            INNER JOIN eventos e ON i.evento_id = e.id
            WHERE p.nome ILIKE $1 OR e.titulo ILIKE $1 OR i.status ILIKE $1
        `, [`%${busca}%`]);

        const totalRegistros = parseInt(countResult.rows[0].total);
        const totalPaginas = Math.ceil(totalRegistros / limite) || 1;

        // 2. Busca apenas os registros da página atual
        const resultado = await BD.query(`
            SELECT
                i.id,
                i.participante_id,
                i.evento_id,
                i.data_inscricao,
                i.status,
                i.presente,
                p.nome AS participante,
                e.titulo AS evento
            FROM inscricoes i
            INNER JOIN participantes p ON i.participante_id = p.id
            INNER JOIN eventos e ON i.evento_id = e.id
            WHERE p.nome ILIKE $1 OR e.titulo ILIKE $1 OR i.status ILIKE $1
            ORDER BY ${orderBy}
            LIMIT $2 OFFSET $3;
        `, [`%${busca}%`, limite, offset]);

        res.render('inscricoes/index', {
            inscricoes: resultado.rows,
            totalRegistros,
            busca,
            ordem,
            pagina,
            totalPaginas,
            usuario: req.session.usuario
        });

    } catch (erro) {
        console.log('Erro ao listar inscrições: ' + erro);
        res.status(500).send('Erro ao carregar inscrições');
    }
});


// Novo
router.get('/novo', async (req, res) => {
    try {

        const participantes = await BD.query(`
            SELECT *
            FROM participantes
            ORDER BY nome;
        `);

        const eventos = await BD.query(`
            SELECT *
            FROM eventos
            ORDER BY titulo;
        `);

        res.render('inscricoes/novo', {
            participantes: participantes.rows,
            eventos: eventos.rows,
            usuario: req.session.usuario
        });

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});


router.post('/novo', async (req, res) => {
    try {

        const {
            participante_id,
            evento_id,
            status,
            presente
        } = req.body;

        console.log(req.body);

        await BD.query(`
            INSERT INTO inscricoes
            (
                participante_id,
                evento_id,
                status,
                presente
            )
            VALUES ($1, $2, $3, $4);
        `, [
            participante_id,
            evento_id,
            status,
            presente
        ]);

        res.redirect('/inscricoes');

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});


// editar
router.get('/editar/:id', async (req, res) => {
    try {

        const id = req.params.id;

        const inscricao = await BD.query(`
            SELECT *
            FROM inscricoes
            WHERE id = $1;
        `, [id]);

        const participantes = await BD.query(`
            SELECT *
            FROM participantes
            ORDER BY nome;
        `);

        const eventos = await BD.query(`
            SELECT *
            FROM eventos
            ORDER BY titulo;
        `);

        res.render('inscricoes/editar', {
            inscricao: inscricao.rows[0],
            participantes: participantes.rows,
            eventos: eventos.rows,
            usuario: req.session.usuario
        });

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});

router.post('/editar/:id', async (req, res) => {
    try {

        const id = req.params.id;

        const {
            participante_id,
            evento_id,
            status,
            presente
        } = req.body;

        await BD.query(`
            UPDATE inscricoes
            SET
                participante_id = $1,
                evento_id = $2,
                status = $3,
                presente = $4
            WHERE id = $5;
        `, [
            participante_id,
            evento_id,
            status,
            presente,
            id
        ]);

        res.redirect('/inscricoes');

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});

// excluir 
router.post('/excluir/:id', async (req, res) => {
    try {

        const id = req.params.id;

        await BD.query(`
            DELETE FROM inscricoes
            WHERE id = $1;
        `, [id]);

        res.redirect('/inscricoes');

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});

module.exports = router;