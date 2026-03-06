'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const formTarea = $('#formTarea');
const inputTitulo = $('#inputTitulo');
const selectTag = $('#selectTag');
const listaTareas = $('#listaTareas');
const filtros = $$('.chip');
const inputBuscar = $('#inputBuscar');
let filtroActual = 'all';
let textoBusqueda = '';

const buildCard = ({title, tag}) => {
    const li = document.createElement('li');
    li.className = 'card';
    li.dataset.tag = tag;
    li.dataset.fav = '0';
    li.innerHTML = `
        <div class="card__head">
            <span class="badge"></span>
            <div class="actions">
                <button class="icon" type="button" data-action="fav">☆</button>
                <button class="icon" type="button" data-action="done">✓</button>
                <button class="icon danger" type="button" data-action="del">🗑</button>
            </div>
        </div>
        <p class="card__title"></p>
    `;

    li.querySelector('.badge').textContent = tag;
    li.querySelector('.card__title').textContent = title;
    return li;
};

formTarea.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = inputTitulo.value.trim();
    const tag = selectTag.value;
    if (!title) return;
    const card = buildCard({
        title: title,
        tag: tag
    });
    listaTareas.append(card);
    aplicarFiltro();

    inputTitulo.value = '';
});

//eliminar tareas
listaTareas.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="del"]');
    if (!btn) return;
    const card = btn.closest('.card');
    if (!card) return;

    card.remove();
});

// marcar tareas como completadas
listaTareas.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="done"]');
    if (!btn) return;
    const card = btn.closest('.card');
    if (!card) return;

    marcarCompletada(card);
});

//función marcar como completas
const marcarCompletada = (card) => {
    const estado = card.dataset.done === '1';
    card.dataset.done = estado ? '0' : '1';
    card.classList.toggle('completada');
};

//funcion para marcar favorita
const marcarFavorita = (card) => {
    const estado = card.dataset.fav === '1';
    card.dataset.fav = estado ? '0' : '1';
    const btn = card.querySelector('button[data-action="fav"]');
    btn.textContent = estado ? '☆' : '★';
};

//evento para marcar tareas como favoritas
listaTareas.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="fav"]');
    if (!btn) return;
    const card = btn.closest('.card');
    if (!card) return;
    marcarFavorita(card);
});

//funcion para filtrar categorias y búsqueda
const aplicarFiltro = () => {
    const cards = $$('#listaTareas .card');

    cards.forEach((card) => {
        const tag = card.dataset.tag;
        const fav = card.dataset.fav === '1';
        const title = card.querySelector('.card__title').textContent.toLowerCase();

        // verificr filtro por categoria
        let pasaFiltro = false;

        if (filtroActual === 'all') pasaFiltro = true;
        else if (filtroActual === 'fav') pasaFiltro = fav;
        else pasaFiltro = tag === filtroActual;

        //verificar busqueda por texto
        let pasaBusqueda = true;
        if (textoBusqueda){
            pasaBusqueda = title.includes(textoBusqueda)
            }
            if (pasaFiltro && pasaBusqueda) {
                card.classList.remove('is-hidden');
            } else {
                card.classList.add('is-hidden');
        }
    });
};

//evento para filtar categorias
filtros.forEach((chip) => {
    chip.addEventListener('click', () => {
        filtroActual = chip.dataset.filter;
        filtros.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        aplicarFiltro();
    });
});

//evento de búsqueda
inputBuscar.addEventListener('input', () => {
    textoBusqueda = inputBuscar.value.toLowerCase();
    aplicarFiltro();
});

