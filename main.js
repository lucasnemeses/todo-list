(function () {
    document.addEventListener('DOMContentLoaded', () => {
        loadItem();
        emptyList();
        clickElement();
    });

    function loadItem() {
        if (localStorage.getItem('todoList') !== undefined) {
            const todo = JSON.parse(localStorage.getItem('todoList'));

            if (todo instanceof Array && todo.length !== 0) {
                todo.forEach(function(item) {
                    createTodoElements(item.value, item.id, item.status == 'done' ? true : false);
                });
            }
        }
    }

    function emptyList() {
        [
            {data: 'data-todo-list', type: 'pendente'},
            {data: 'data-todo-done', type: 'concluída'},
        ].forEach(item => {
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

    function clickElement() {
        document.querySelector('[data-todo-input]').addEventListener('keypress', event => {
            if (event.key === 'Enter') {
                addItem();
            }
        });

        window.addEventListener('click', event => {        
            if (event.target.hasAttribute('data-todo-btn')) {
                addItem();
            }

            if (event.target.hasAttribute('data-todo-check')) {
                checkTodoItem(event.target);
            }

            if (event.target.hasAttribute('data-todo-remove')) {
                removeTodoItem(event.target);
            }
        });
    }
    
    function addItem() {
        const todoInput = document.querySelector('[data-todo-input]');

        if (!todoInput.value) return;
    
        createTodoElements(todoInput.value);
        todoInput.value = '';
    }
    
    function createTodoElements(value, id = false, doneList = false) {
        if (!id) {
            id = addToLocalStorage(value);
        }

        const list = document.querySelector(doneList ? '[data-todo-done]' : '[data-todo-list]');
        const li = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const btn = document.createElement('button');
        const icon = document.createElement('i');        
    
        li.setAttribute('data-todo-id', id);
        li.classList.add('group', 'transition', 'text-sm', 'text-neutral-800', 'rounded', 'p-1', 'mb-1', 'hover:bg-neutral-100', 'flex', 'justify-between');
        label.classList.add('flex', 'items-center', 'gap-x-2', 'text-sm', 'w-11/12');
        input.classList.add('cursor-pointer');
        span.classList.add(setClassItem(span, doneList ?? false));
        btn.classList.add('transition', 'opacity-0', 'group-hover:opacity-100');
        btn.setAttribute('data-todo-remove', '');
        icon.classList.add('fas', 'fa-trash', 'pointer-events-none', 'transition', 'text-rose-500');    
        input.classList.add('cursor-pointer');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('data-todo-check', '');
        input.checked = doneList ?? false;
    
        span.innerText = value;
        label.append(input, span);
        btn.append(icon);
        li.append(label);
        li.append(btn);
        list.append(li);
    
        emptyList();
    }

    function setClassItem(span, doneList = false) {
        if (doneList) {
            span.classList.add('text-neutral-500', 'line-through');
            span.classList.remove('text-neutral-800');
        } else {
            span.classList.add('text-neutral-800');
            span.classList.remove('text-neutral-500', 'line-through');
        }
    }
    
    function checkTodoItem(input) {
        const span = input.nextElementSibling;
        const item = input.parentNode.parentNode;
        const dataList = input.checked ? '[data-todo-done]' : '[data-todo-list]';

        if (!item.hasAttribute('data-todo-id')) return;        

        setClassItem(span, input.checked ? true : false);
        document.querySelector(dataList).append(item);
        alterStatusLocalStorage(item.dataset.todoId, input.checked ? true : false);    
        emptyList();
    }
    
    function removeTodoItem(btn) {
        const item = btn.parentNode;
        if ( item.tagName != 'LI' && !item.hasAttribute('data-todo-id')) return;

        removeToLocalStorage(item.dataset.todoId);
        item.remove();
        emptyList();
    }

    function addToLocalStorage(value) {
        let id;
        let todo;
        if (localStorage.todoList == undefined || JSON.parse(localStorage.todoList) == false) {
            id = 1;
            todo = [{
                id: id,
                value: value,
                status: 'todo'
            }];

        } else {
            todo = JSON.parse(localStorage.todoList);
            id = todo[todo.length - 1].id + 1;
            todo.push({
                id: id,
                value: value,
                status: 'todo'
            });
        }
        setlocalStorage(todo);
        return id;
    }

    function setlocalStorage(value) {
        localStorage.todoList = JSON.stringify(value);
    }

    function removeToLocalStorage(id) {
        if (localStorage.todoList == undefined) return;

        const todo = JSON.parse(localStorage.todoList); 
        const index = getIndex(todo, id);

        todo.splice(index, 1);
        setlocalStorage(todo);
    }

    function alterStatusLocalStorage(id, doneList = false) {
        const todo = JSON.parse(localStorage.todoList);
        const index = getIndex(todo, id);
        const status = doneList ? 'done' : 'todo';

        todo[index].status = status;

        setlocalStorage(todo);
    }   

    function getIndex(list, id) {
        for (let i in list) {
            if (list[i].id == id) {
                return i;
            }
        }
    }
}());