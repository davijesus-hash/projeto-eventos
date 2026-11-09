const express = require("express");
const session = require("express-session");
const app = express();

//Configuração das Rotas
const route = express.Router();

//Configuração EJS
app.set("view engine", "ejs");

//Codificação das rotas
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//definir o session 
app.use(session({
    secret: 'SESISENAI',
    resave: false,
    saveUninitialized: false
}))

// Controle de Rotas
function exigirLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login')
    }
    next()
}

//Configuração do Banco de Dados
const BD = require('./db');


//Dispolibilizar os arquivos
app.use(express.static("Public"))

// Rota 1: Home
app.get("/", async (req, res) => {
    try {
        const resultado = await BD.query(`
            SELECT
            e.id,
            e.titulo,
            e.descricao,
            e.data_evento,
            TO_CHAR(e.data_evento, 'DD/MM/YYYY') AS data_formatada,
            e.horario,
            TO_CHAR(e.horario, 'HH24:MI') AS horario_formatado,
            e.local,
            e.quantidade_vagas,
            e.imagem_url,
            c.nome AS nome_categoria,
            u.nome AS nome_organizador
        FROM eventos e
        INNER JOIN categorias c
            ON e.categoria_id = c.id
        INNER JOIN usuarios u
            ON e.organizador_id = u.id
            WHERE e.data_evento >= CURRENT_DATE
        ORDER BY e.data_evento ASC`
        );
        const eventosAtivos = resultado.rows
        console.log(eventosAtivos)
        res.render("landing/index", {
            eventosAtivos
        })
    } catch (erro) {
        console.log("Erro ao consultar eventos" + erro);
        res.render("landing/index"),{
            eventosAtivos: {}
        }
    }
});

//Rota 2: Categorias
const categoriasRoutes = require('./routes/categoriasRoutes');
app.use('/categorias', exigirLogin, categoriasRoutes);

// Rota 3: Eventos (AGORA OFICIAL!)
const eventosRoutes = require('./routes/eventosRoutes');
app.use('/eventos', exigirLogin, eventosRoutes);

// Rota 4: Participantes
const participantesRoutes = require('./routes/participantesRoutes');
app.use('/participantes', exigirLogin, participantesRoutes);

// Rota 5: Login
app.get("/login", (req, res) => {
    res.render("login", { erro: null });
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const resultado = await BD.query(`
            SELECT id, nome, email
            FROM usuarios
            WHERE email = $1
              AND senha = $2
              AND situacao = 1
        `, [email, senha]);

        if (resultado.rows.length === 0) {
            return res.render('login', {
                erro: 'E-mail ou senha inválido!'
            });
        }

        // Grava o usuário na sessão antes de ir pro admin/dashboard
        req.session.usuario = resultado.rows[0];
        res.redirect('/admin');

    } catch (erro) {
        console.log('Erro: ' + erro);
        res.status(500).send('Erro no servidor!');
    }
});

//Dashboard
app.get("/dashboard", async (req, res) => {

    try {

        const totalEventos = await BD.query(`
            select count(*) as total 
            from eventos
        `)

        const totalParticipantes = await BD(`
            select count(*) as total
            from participantes
        `);

        const totalIncricoes = await BD.query(`
            select count(*) as total
            from Incricoes
        `);

        const usuariosAtivos = await BD.query(`
            select count(*) as total
            from usuarios where situacao = 1   
        ,`);

        const inscricaoStatus = await BD.query(`
        select 
            status, 
            count(*) as total
        from incricoes
        group by status
        order by status
        `);

        const eventosMaisInscricao = await 
        BD.query(`
            select
                e.titulo,
                count(i.id) as total
            from eventos e
            left join inscricoes i
                on i.evento_id = e.id4
            group by e.id, e.titulo
            order by total desc limit 5`);

        const proximoEventos = await BD.query(`
        select 
            e.titulo,
            count(i.id) as total
        from eventos e 
        left join inscricoes i
            on i.evento_id = e.id
        group by e.id, e.titulo
        order by total desc limit 5
        `);
        
        res.render('dashboard', {
            usuario: req.session.usuario,
            totalEventos: 
                totalEventos.rows[0].total,
            totalParticipantes:
                totalParticipantes.rows[0].total,
            totalIncricoes:
                totalIncricoes.rows[0].total,
            usuariosAtivos:
                usuariosAtivos.rows[0].total,
            inscricaoStatus:
                inscricaoStatus.rows[0].total,
        });


    }catch (erro) {
        console.log('Erro: ' + erro)
    }

});


//Rota 6: Administrativo
app.get("/admin", exigirLogin, (req, res) => {
    res.render('admin', {
        usuario: req.session.usuario || { nome: 'Visitante' } // Fallback de segurança caso a sessão não tenha o nome
    });
});

// Rota 7: Usuários
const usuariosRoutes = require('./routes/usuariosRoutes');
app.use('/usuarios', exigirLogin, usuariosRoutes);

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

// Execução do Servidor
const porta = 3001;
app.listen(porta, () => {
    console.log(`Servidor rodando em: http://localhost:${porta}`);
});