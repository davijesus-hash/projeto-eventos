const express = require('express');
const router = express.Router();
const BD = require('../db');


// ============================================
// LISTAR USUÁRIOS
// ============================================

router.get('/', async (req, res) => {
    try {
        const resultado = await BD.query(`
            SELECT
                id,
                nome,
                email,
                situacao,
                criado_em
            FROM usuarios
            ORDER BY nome
        `); 
        console.log(resultado.rows)
        res.render('usuarios/index', {
            usuarios: resultado.rows,
            usuario: req.session.usuario
        });
    }
    catch (erro) {
        console.log('Erro ao listar usuários: ' + erro);
        res.status(500).send(
            'Erro ao carregar usuários'
        ).render('usuarios/index', {
            usuarios: [],
            usuario: req.session.usuario
        }); 
    }

});


// ============================================
// ABRIR TELA NOVO USUÁRIO
// ============================================

router.get('/novo', (req, res) => {
    res.render('usuarios/novo', { usuario: req.session.usuario });

});


// ============================================
// CADASTRAR USUÁRIO
// ============================================

router.post('/novo', async (req, res) => {

    const {
        nome,
        email,
        senha,
        situacao
    } = req.body;

    try {

        await BD.query(`
            INSERT INTO usuarios
            (
                nome,
                email,
                senha,
                situacao
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
        `,
        [
            nome,
            email,
            senha,
            situacao
        ]);

        res.redirect('/usuarios');

    }
    catch (erro) {

        console.log(
            'Erro ao cadastrar usuário: ' + erro
        );

        res.status(500).send(
            'Erro ao cadastrar usuário'
        );

    }

});


// ============================================
// ABRIR TELA EDITAR
// ============================================

router.get('/editar/:id', async (req, res) => {

    const id = req.params.id;

    try {

        const resultado = await BD.query(`
            SELECT *
            FROM usuarios
            WHERE id = $1
        `,
        [
            id
        ]);
        if (resultado.rows.length === 0) {
            return res.status(404).send(
                'Usuário não encontrado'
            );

        }
        res.render('usuarios/editar', {
            usuarioEditado: resultado.rows[0],
            usuario: req.session.usuario
        });
    }
    catch (erro) {
        console.log(
            'Erro ao carregar usuário: ' + erro
        );
        res.status(500).send(
            'Erro ao carregar usuário'
        );
    }
});

// ============================================
// ATUALIZAR USUÁRIO
// ============================================
router.post('/editar/:id', async (req, res) => {
    const id = req.params.id;
    const {
        nome,
        email,
        senha,
        situacao
    } = req.body;
    try {
        await BD.query(`
            UPDATE usuarios
            SET
                nome = $1,
                email = $2,
                senha = $3,
                situacao = $4
            WHERE id = $5
        `,
        [
            nome,
            email,
            senha,
            situacao,
            id
        ]);
        res.redirect('/usuarios');
    }
    catch (erro) {
        console.log(
            'Erro ao atualizar usuário: ' + erro
        );
        res.status(500).send(
            'Erro ao atualizar usuário'
        );
    }
});
// ============================================
// EXCLUIR USUÁRIO
// ============================================
router.post('/excluir/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await BD.query(`
            DELETE FROM usuarios
            WHERE id = $1
        `,
        [
            id
        ]);
        res.redirect('/usuarios');
    }
    catch (erro) {
        console.log(
            'Erro ao excluir usuário: ' + erro
        );
        res.status(500).send(
            'Erro ao excluir usuário'
        );
    }
});
module.exports = router;