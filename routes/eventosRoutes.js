const express = require('express');
const router = express.Router();
const BD = require('../db');

//Read - Leitura

router.get('/', async(req, res) => {
    try {
        const resultado = await BD.query('select * from eventos');
        res.render('eventos/index', {
            eventos: resultado.rows
        });
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

//CREATE

router.get('/novo', async(req, res) => {
    try {
        const categorias = await BD.query('select * from categorias');
        const usuarios = await BD.query('select * from usuarios');
        res.render('eventos/novo', {
            categorias: categorias.rows,
            usuarios: usuarios.rows
        });
    } catch(error) {
        console.log('Erro: ' + error);
    }
});

router.post('/novo', async(req, res) => {
    try {
        const { titulo, descricao, data_evento, horario, local, 
            quantidade_vagas, imagem_url, categoria_id, organizador_id } = req.body;
        await BD.query(
            `insert into eventos (titulo, descricao, 
            data_evento, 
            horario, 
            local, 
            quantidade_vagas, 
            imagem_url, 
            categoria_id, 
            organizador_id) 
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [titulo, descricao, data_evento, horario, local, 
            quantidade_vagas, imagem_url, categoria_id, organizador_id]
        );
        res.redirect('/eventos');
    } catch(error) {
        console.log('Erro: ' + error);
    }
});

//Update

router.get('/editar/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const resultado = await BD.query(
            `select * from eventos where id = $1`,
            [id]
        );
        const categorias = await BD.query('select * from categorias');
        const usuarios = await BD.query('select * from usuarios');
        res.render('eventos/editar', {
            eventos: resultado.rows,
            categorias: categorias.rows,
            usuarios: usuarios.rows
        });
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

router.post('/editar/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const { titulo, descricao, data_evento, horario, local, quantidade_vagas, 
            imagem_url, categoria_id, organizador_id } = req.body;
        await BD.query(
            `update eventos set 
            titulo = $1, 
            descricao = $2, 
            data_evento = $3, 
            horario = $4, 
            local = $5, 
            quantidade_vagas = $6, 
            imagem_url = $7, 
            categoria_id = $8, 
            organizador_id = $9 
            where id = $10`,
            [titulo, descricao, data_evento, horario, local, 
            quantidade_vagas, imagem_url, categoria_id, organizador_id, id]
        );
        res.redirect('/eventos');
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

//Delete

router.post('/excluir/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await BD.query(
            `delete from eventos where id = $1`,
            [id]
        );
        res.redirect('/eventos');
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

module.exports = router;