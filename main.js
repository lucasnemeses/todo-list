document.addEventListener('DOMContentLoaded', function() {
    clickElement();
    emptyList();
});

function addTodoItem() {
    const todoInput = document.querySelector('[data-todo-input]');
    if (!todoInput.value) return;

    createTodoElements(todoInput.value);
    todoInput.value = '';
}

function createTodoElements(text) {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const btn = document.createElement('button');
    const icon = document.createElement('i');
    const todoList = document.querySelector('[data-todo-list]');

    li.classList.add('group', 'transition', 'text-sm', 'text-neutral-800', 'rounded', 'p-1', 'mb-1', 'hover:bg-neutral-100', 'flex', 'justify-between');
    label.classList.add('flex', 'items-center', 'gap-x-2', 'text-sm', 'w-11/12');
    input.classList.add('cursor-pointer');
    span.classList.add('transition', 'text-neutral-800');
    btn.classList.add('transition', 'opacity-0', 'group-hover:opacity-100');
    btn.setAttribute('data-todo-remove', '');
    icon.classList.add('fas', 'fa-trash', 'pointer-events-none', 'transition', 'text-rose-500');    
    input.classList.add('cursor-pointer');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('data-todo-check', '');

    span.innerText = text;
    label.append(input, span);
    btn.append(icon);
    li.append(label);
    li.append(btn);
    todoList.append(li);

    emptyList();
}

function checkTodoItem(input) {
    const span = input.nextElementSibling;
    if (span.tagName !== 'SPAN') return;

    const parent = input.parentNode.parentNode;

    if (input.checked) {
        span.classList.add('text-neutral-500', 'line-through');
        span.classList.remove('text-neutral-800');
        document.querySelector('[data-todo-done]').append(parent);
    } else {
        span.classList.add('text-neutral-800');
        span.classList.remove('text-neutral-500', 'line-through');
        document.querySelector('[data-todo-list]').append(parent);
    }

    emptyList();
}

function clickElement() {
    window.addEventListener('click', function(event) {
        if (event.target.hasAttribute('data-todo-btn')) {
            addTodoItem();
        }
    
        if (event.target.hasAttribute('data-todo-check')) {
            checkTodoItem(event.target);
        }    
    });
}

function emptyList() {
    [
        {data: 'data-todo-list', type: 'pendente'},
        {data: 'data-todo-done', type: 'concluída'},
    ].forEach(function(item) {
        const list = document.querySelector(`[${item.data}]`);
        const emptyItem = list.parentNode.querySelector('.empty-list');     

        if (list.innerHTML == '' && emptyItem == null) {
            const emptySpan = document.createElement('span');
            emptySpan.innerText = `Nenhuma tarefa ${item.type}`;
            emptySpan.classList.add('empty-list', 'text-neutral-500', 'text-sm');
            list.parentNode.append(emptySpan);
        } else if ( list.innerHTML != '' && emptyItem != null ) {
            emptyItem.remove();
        }
    });
}