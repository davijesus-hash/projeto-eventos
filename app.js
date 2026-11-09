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
        res.redirect('/dashboard');

    } catch (erro) {
        console.log('Erro: ' + erro);
        res.status(500).send('Erro no servidor!');
    }
});

app.get('/dashboard', exigirLogin, async (req, res) => {
    try {
        const totalEventos = await BD.query(`
            SELECT COUNT(*) AS total
            FROM eventos
        `);

        const totalParticipantes = await BD.query(`
            SELECT COUNT(*) AS total
            FROM participantes
        `);

        const totalInscricoes = await BD.query(`
            SELECT COUNT(*) AS total
            FROM inscricoes
        `);

        const usuariosAtivos = await BD.query(`
            SELECT COUNT(*) AS total
            FROM usuarios
            WHERE situacao = 1
        `);

        const inscricaoStatus = await BD.query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM inscricoes
            GROUP BY status
            ORDER BY status
        `);

        const eventosCategoria = await BD.query(`
            SELECT
                c.nome AS categoria,
                COUNT(e.id) AS total
            FROM categorias c
            LEFT JOIN eventos e
                ON e.categoria_id = c.id
            GROUP BY c.id, c.nome
            ORDER BY c.id, c.nome
        `);

        const eventosMaisInscricoes = await BD.query(`
            SELECT
                e.titulo,
                COUNT(i.id) AS total
            FROM eventos e
            LEFT JOIN inscricoes i
                ON i.evento_id = e.id
            GROUP BY e.id, e.titulo
            ORDER BY total DESC
            LIMIT 5
        `);

        const proximosEventos = await BD.query(`
            SELECT
                id,
                titulo,
                data_evento,
                horario,
                local
            FROM eventos
            WHERE data_evento >= CURRENT_DATE
            ORDER BY data_evento, horario
            LIMIT 5
        `);

        res.render('dashboard', {
            usuario: req.session.usuario,
            totalEventos: totalEventos.rows[0].total,
            totalParticipantes: totalParticipantes.rows[0].total,
            totalInscricoes: totalInscricoes.rows[0].total,
            usuariosAtivos: usuariosAtivos.rows[0].total,
            inscricaoStatus: inscricaoStatus.rows,
            eventosCategoria: eventosCategoria.rows,
            eventosMaisInscricoes: eventosMaisInscricoes.rows,
            proximosEventos: proximosEventos.rows
        });

    } catch (erro) {
        console.error('Erro no dashboard:', erro);
        res.status(500).send('Erro ao carregar o dashboard!');
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