const eventos = [
    {
        id: 1,
        titulo: 'Workshop de Node.js',
        descricao: 'Workshop introdutório sobre desenvolvimento com Node.js.',
        data_evento: '10/09/2026',
        horario: '19:00',
        local: 'Laboratório 01',
        quantidade_vagas: 30,
        imagem_url: '/uploads/eventos/node.jpg',
        categoria_id: 1,
        organizador_id: 1
    },
    {
        id: 2,
        titulo: 'Introdução ao PostgreSQL',
        descricao: 'Encontro para aprender fundamentos de banco de dados.',
        data_evento: '15/09/2026',
        horario: '18:30',
        local: 'Laboratório 02',
        quantidade_vagas: 25,
        imagem_url: '/uploads/eventos/postgresql.jpg',
        categoria_id: 1,
        organizador_id: 2
    },
    {
        id: 3,
        titulo: 'Oficina de Desenvolvimento Web',
        descricao: 'Oficina prática utilizando HTML, CSS e JavaScript.',
        data_evento: '20/09/2026',
        horario: '19:30',
        local: 'Sala 05',
        quantidade_vagas: 35,
        imagem_url: '/uploads/eventos/web.jpg',
        categoria_id: 2,
        organizador_id: 1
    },
    {
        id: 4,
        titulo: 'Palestra sobre Empreendedorismo',
        descricao: 'Palestra introdutória sobre empreendedorismo e negócios.',
        data_evento: '25/09/2026',
        horario: '20:00',
        local: 'Auditório',
        quantidade_vagas: 100,
        imagem_url: '/uploads/eventos/empreendedorismo.jpg',
        categoria_id: 3,
        organizador_id: 3
    }
];

module.exports = eventos;