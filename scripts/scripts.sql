DROP TABLE IF EXISTS inscricoes;
DROP TABLE IF EXISTS participantes;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

-- ============================================
-- 1. TABELA USUARIOS
-- 1234============================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,

    situacao INTEGER NOT NULL DEFAULT 1,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_usuario_situacao
        CHECK (situacao IN (0, 1))
);


-- ============================================
-- 2. TABELA CATEGORIAS
-- ============================================

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);


-- ============================================
-- 3. TABELA EVENTOS
-- ============================================

CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,

    titulo VARCHAR(150) NOT NULL,

    descricao TEXT,

    data_evento DATE NOT NULL,

    horario TIME NOT NULL,

    local VARCHAR(150) NOT NULL,

    quantidade_vagas INTEGER NOT NULL,

    imagem_url VARCHAR(255),

    categoria_id INTEGER NOT NULL,

    organizador_id INTEGER NOT NULL,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evento_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id),

    CONSTRAINT fk_evento_organizador
        FOREIGN KEY (organizador_id)
        REFERENCES usuarios(id),

    CONSTRAINT chk_quantidade_vagas
        CHECK (quantidade_vagas > 0)
);


-- ============================================
-- 4. TABELA PARTICIPANTES
-- ============================================

CREATE TABLE participantes (
    id SERIAL PRIMARY KEY,

    nome VARCHAR(120) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    telefone VARCHAR(20),

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- 5. TABELA INSCRICOES
-- ============================================

CREATE TABLE inscricoes (
    id SERIAL PRIMARY KEY,

    participante_id INTEGER NOT NULL,

    evento_id INTEGER NOT NULL,

    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'confirmada',

    presente BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_inscricao_participante
        FOREIGN KEY (participante_id)
        REFERENCES participantes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_inscricao_evento
        FOREIGN KEY (evento_id)
        REFERENCES eventos(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_participante_evento
        UNIQUE (participante_id, evento_id),

    CONSTRAINT chk_status_inscricao
        CHECK (
            status IN (
                'confirmada',
                'cancelada',
                'pendente'
            )
        )
);


-- ============================================
-- INSERTS INICIAIS
-- ============================================


-- USUARIOS
-- 1 = ATIVO
-- 0 = INATIVO

INSERT INTO usuarios (
    nome,
    email,
    senha,
    situacao
)
VALUES
(
    'Administrador',
    'admin@email.com',
    '123456',
    1
),
(
    'Carlos Silva',
    'carlos@email.com',
    '123456',
    1
),
(
    'Mariana Souza',
    'mariana@email.com',
    '123456',
    0
);


-- CATEGORIAS

INSERT INTO categorias (
    nome,
    descricao
)
VALUES
(
    'Tecnologia',
    'Eventos relacionados à tecnologia e desenvolvimento'
),
(
    'Educação',
    'Palestras, oficinas e atividades educacionais'
),
(
    'Negócios',
    'Eventos sobre empreendedorismo e gestão'
),
(
    'Cultura',
    'Eventos culturais e apresentações'
);


-- EVENTOS

INSERT INTO eventos (
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
    'Workshop de Desenvolvimento Web',
    'Workshop introdutório sobre HTML, CSS e JavaScript.',
    '2026-11-10',
    '19:00',
    'SENAI Araçatuba',
    40,
    'evento1.jpg',
    1,
    2
),
(
    'Palestra sobre Inteligência Artificial',
    'Palestra sobre aplicações da inteligência artificial no mercado de trabalho.',
    '2026-11-15',
    '14:00',
    'Auditório Municipal',
    100,
    'evento2.jpg',
    1,
    3
),
(
    'Feira de Profissões',
    'Evento para apresentar diferentes carreiras e oportunidades profissionais.',
    '2026-11-20',
    '09:00',
    'SESI Mirandópolis',
    150,
    'evento3.jpg',
    2,
    2
),
(
    'Workshop de Empreendedorismo',
    'Workshop sobre planejamento de negócios, empreendedorismo e desenvolvimento de ideias inovadoras.',
    '2026-11-25',
    '19:00',
    'SENAI Araçatuba',
    50,
    'evento4.jpg',
    3,
    3
),
(
    'Palestra de Marketing Digital',
    'Palestra sobre estratégias de marketing digital, redes sociais e oportunidades no mercado.',
    '2026-12-03',
    '14:00',
    'SESI Mirandópolis',
    100,
    'evento5.jpg',
    3,
    3
),
(
    'Feira de Inovação e Negócios',
    'Evento destinado à apresentação de projetos empreendedores, soluções inovadoras e oportunidades de negócios.',
    '2026-12-10',
    '09:00',
    'Praça de Mirandópolis',
    150,
    'evento6.jpg',
    3,
    3
);


-- PARTICIPANTES

INSERT INTO participantes (
    nome,
    email,
    telefone
)
VALUES
(
    'João Pedro',
    'joao@email.com',
    '18999990001'
),
(
    'Ana Clara',
    'ana@email.com',
    '18999990002'
),
(
    'Lucas Mendes',
    'lucas@email.com',
    '18999990003'
),
(
    'Fernanda Lima',
    'fernanda@email.com',
    '18999990004'
),
(
    'Pedro Henrique',
    'pedro@email.com',
    '18999990005'
);


-- INSCRICOES

INSERT INTO inscricoes (
    participante_id,
    evento_id,
    status,
    presente
)
VALUES
(
    1,
    1,
    'confirmada',
    FALSE
),
(
    2,
    1,
    'confirmada',
    FALSE
),
(
    3,
    1,
    'pendente',
    FALSE
),
(
    1,
    2,
    'confirmada',
    FALSE
),
(
    4,
    2,
    'confirmada',
    FALSE
),
(
    2,
    3,
    'confirmada',
    FALSE
),
(
    5,
    3,
    'cancelada',
    FALSE
);