const express = require('express');
const router = express.Router();
const BD = require('../db');

//Read - Leitura

router.get('/', async(req, res) => {
    try {
        const resultado = await BD.query('select * from participantes');
        res.render('participantes/index', {
            participantes: resultado.rows
        });
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

//CREATE

router.get('/novo', (req, res) => {
    try {
        res.render('participantes/novo');
    } catch(error) {
        console.log('Erro: ' + error);
    }
});

router.post('/novo', async(req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        await BD.query(
            `insert into participantes (nome, email, telefone) values ($1, $2, $3)`,
            [nome, email, telefone]
        );
        res.redirect('/participantes');
    } catch(error) {
        console.log('Erro: ' + error);
    }
});

//Update

router.get('/editar/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const resultado = await BD.query(
            `select * from participantes where id = $1`,
            [id]
        );
        res.render('participantes/editar', {
            participantes: resultado.rows
        });
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

router.post('/editar/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const { nome, email, telefone } = req.body;
        await BD.query(
            `update participantes set nome = $1, email = $2, telefone = $3 where id = $4`,
            [nome, email, telefone, id]
        );
        res.redirect('/participantes');
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

//Delete

router.post('/excluir/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await BD.query(
            `delete from participantes where id = $1`,
            [id]
        );
        res.redirect('/participantes');
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

module.exports = router;