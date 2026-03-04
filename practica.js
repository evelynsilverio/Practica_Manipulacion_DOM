'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const formTarea = $('#formTarea');
const inputTitulo = $('#inputTitulo');
const selectTag = $('#selectTag');
const listaTareas = $('#listaTareas');

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
