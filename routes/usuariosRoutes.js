const express = require('express');
const router = express.Router();
const BD = require('../db');

//Read - Leitura

router.get('/', async(req, res) => {
    try {
        const resultado = await BD.query('select * from usuarios');
        res.render('usuarios/index', {
            usuarios: resultado.rows
        });
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

//CREATE

router.get('/novo', (req, res) => {
    try {
        res.render('usuarios/novo');
    } catch(error) {
        console.log('Erro: ' + error);
    }
});

router.post('/novo', async(req, res) => {
    try {
        const { nome, email, senha, situacao } = req.body;
        await BD.query(
            `insert into usuarios 
            (nome, email, senha, situacao) 
            values ($1, $2, $3, $4)`,
            [nome, email, senha, situacao]
        );
        res.redirect('/usuarios');
    } catch(error) {
        console.log('Erro: ' + error);
    }
});

//Update

router.get('/editar/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const resultado = await BD.query(
            `select * from usuarios where id = $1`,
            [id]
        );
        res.render('usuarios/editar', {
            usuarios: resultado.rows
        });
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

router.post('/editar/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const { nome, email, senha, situacao } = req.body;
        await BD.query(
            `update usuarios set 
            nome = $1, 
            email = $2, 
            senha = $3, 
            situacao = $4 
            where id = $5`,
            [nome, email, senha, situacao, id]
        );
        res.redirect('/usuarios');
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

//Delete

router.post('/excluir/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await BD.query(
            `delete from usuarios where id = $1`,
            [id]
        );
        res.redirect('/usuarios');
    } catch(error) {
        console.log(`Erro: ${error}`);
    }
});

module.exports = router;