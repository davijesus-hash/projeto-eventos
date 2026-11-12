const express = require('express');
const router = express.Router();
const BD = require('../db');


// ======================================================
// LISTAR EVENTOS
// ======================================================

router.get('/', async (req, res) => {

    try {

        const resultado = await BD.query(`
            SELECT
                e.id,
                e.titulo,
                e.descricao,
                e.data_evento,
                e.horario,
                e.local,
                e.quantidade_vagas,
                e.imagem_url,
                e.categoria_id,
                e.organizador_id,
                c.nome AS categoria,
                u.nome AS organizador

            FROM eventos e

            INNER JOIN categorias c
                ON e.categoria_id = c.id

            INNER JOIN usuarios u
                ON e.organizador_id = u.id

            ORDER BY e.id
        `);

        res.render('eventos/index', {
            eventos: resultado.rows,
            usuario: req.session.usuario
        });

    } catch (erro) {

        console.log('Erro ao listar eventos: ' + erro);
        res.status(500).send(
            'Erro ao carregar eventos'
        );
    }
});
// ======================================================
// ABRIR TELA NOVO EVENTO
// ======================================================
router.get('/novo', async (req, res) => {
    try {
        const categorias = await BD.query(`
            SELECT *
            FROM categorias
            ORDER BY nome
        `);
        const usuarios = await BD.query(`
            SELECT *
            FROM usuarios
            ORDER BY nome
        `);
        res.render('eventos/novo', {
            categorias: categorias.rows,
            usuarios: usuarios.rows,
            usuario: req.session.usuario
        });
    } catch (erro) {
        console.log(
            'Erro ao abrir cadastro de evento: ' + erro
        );
        res.status(500).send(
            'Erro ao abrir cadastro de evento'
        );
    }
});
// ======================================================
// CADASTRAR EVENTO
// ======================================================
router.post('/novo', async (req, res) => {
    try {
        const {
            titulo,
            descricao,
            data_evento,
            horario,
            local,
            quantidade_vagas,
            imagem_url,
            categoria_id,
            organizador_id
        } = req.body;


        await BD.query(`
            INSERT INTO eventos
            (
                titulo,
                descricao,
                data_evento,
                horario,
                local,
                quantidade_vagas,
                imagem_url,
                categoria_id,
                organizador_id
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9
            )
        `,
        [
            titulo,
            descricao,
            data_evento,
            horario,
            local,
            quantidade_vagas,
            imagem_url,
            categoria_id,
            organizador_id
        ]);
        res.redirect('/eventos');
    } catch (erro) {
        console.log(
            'Erro ao cadastrar evento: ' + erro
        );
        res.status(500).send(
            'Erro ao cadastrar evento'
        );
    }
});
// ======================================================
// ABRIR TELA EDITAR EVENTO
// ======================================================
router.get('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const eventos = await BD.query(`
            SELECT *
            FROM eventos
            WHERE id = $1
        `,
        [
            id
        ]);
        if (eventos.rows.length === 0) {

            return res.status(404).send(
                'Evento não encontrado'
            );

        }
        const categorias = await BD.query(`
            SELECT *
            FROM categorias
            ORDER BY nome
        `);
        const usuarios = await BD.query(`
            SELECT *
            FROM usuarios
            ORDER BY nome
        `);
        res.render('eventos/editar', {
            evento: eventos.rows[0],
            categorias: categorias.rows,
            usuarios: usuarios.rows,
            usuario: req.session.usuario
        });
    } catch (erro) {
        console.log(
            'Erro ao carregar evento: ' + erro
        );
        res.status(500).send(
            'Erro ao carregar evento'
        );
    }
});

// ======================================================
// ATUALIZAR EVENTO
// ======================================================
router.post('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {
            titulo,
            descricao,
            data_evento,
            horario,
            local,
            quantidade_vagas,
            imagem_url,
            categoria_id,
            organizador_id
        } = req.body;
        await BD.query(`
            UPDATE eventos

            SET
                titulo = $1,
                descricao = $2,
                data_evento = $3,
                horario = $4,
                local = $5,
                quantidade_vagas = $6,
                imagem_url = $7,
                categoria_id = $8,
                organizador_id = $9

            WHERE id = $10
        `,
        [
            titulo,
            descricao,
            data_evento,
            horario,
            local,
            quantidade_vagas,
            imagem_url,
            categoria_id,
            organizador_id,
            id
        ]);
        res.redirect('/eventos');
    } catch (erro) {
        console.log(
            'Erro ao atualizar evento: ' + erro
        );
        res.status(500).send(
            'Erro ao atualizar evento'
        );
    }
});

// ======================================================
// EXCLUIR EVENTO
// ======================================================
router.get('/excluir/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await BD.query(`
            DELETE FROM eventos
            WHERE id = $1
        `,
        [
            id
        ]);
        res.redirect('/eventos');
    } catch (erro) {
        console.log(
            'Erro ao excluir evento: ' + erro
        );
        res.status(500).send(
            'Erro ao excluir evento'
        );
    }
});
module.exports = router;