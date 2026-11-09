const express = require('express');
const router = express.Router();
const BD = require('../db');

//Read - Leitura
router.get('/', async(req, res)=>{

    try {
    const resultado = await BD.query(
        'select * from categorias'
    );

    res.render('categorias/index')
}

catch(error){
    console.log(`Erro: ${error}`)
    }
})

//CREATE
router.get('/novo', (req, res) => {
    try {
        res.render('categorias/novo');
    }
    catch (error) {
        console.log('Erro: ' + error);
    }

});

router.post('/novo', async (req, res) => {

    try {
        const {nome, descricao } = req.body;
        await BD.query(
            `insert into categorias 
            (nome, descricao) 
            values ($1, $2)`, [nome, descricao]);

        res.redirect('/categorias');
    } catch (erro) {
        console.log('Erro: ' + erro);
    }
    });

//Update

router.get('/editar/:id', async (req, res) =>{
try {
    const id = req.params.id;
    const resultado = await BD.query(
        `select  * from categorias where id= $1`,
        [id]
    );

    res.render('categorias/editar', {
        categorias: resultado.rows
    })
} catch(error)
 {
    console.log(`Erro: ${error}`)
 }

});

router.post(`/editar/:id`, async (req, res) => {
    try{
        const id = req.params.id;
        const { nome, descricao} = req.body
        await BD.query(`update categorias
            set nome = $1, 
                descricao = $2
            where id = $3` , [nome, descricao, id]);

        res.redirect('/categorias');
    } catch(error){
        console.log(`Erro: ${error}`);
    }
});


//Delete
router.post('/excluir/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const resultado = await BD.query(`
            delete from categorias where id = $1`,
             [id]);

             res.redirect('/categorias');
    } catch(error) {
        console.log(`Erro: ` + error);
    }
})


module.exports = router;