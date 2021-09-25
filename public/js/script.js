createLocalStorage();
renderTodos()
const todos = document.querySelectorAll('.todo');
const all_status = document.querySelectorAll('.status');

let dragableTodo = null;

function dragStart() {
    dragableTodo = this;
    setTimeout(() => {
        this.style.display = 'none';
    }, 0);
};

function dragEnd() {
    dragableTodo = null;
    setTimeout(() => {
        this.style.display = 'block';
    }, 0);
};

all_status.forEach(status => {
    status.addEventListener('dragover', dragOver);
    status.addEventListener('dragenter', dragEnter);
    status.addEventListener('dragleave', dragLeave);
    status.addEventListener('drop', dragDrop);
});

function dragOver(e) {
    e.preventDefault();
};

function dragEnter() {
    this.style.border = '1px dashed #ccc';
};

function dragLeave() {
    this.style.border = 'none';
};

function dragDrop() {
    this.style.border = 'none';
    this.appendChild(dragableTodo);
    let column_id = this.id;
    let todo_id = dragableTodo.id;
    let todo_div = dragableTodo.outerHTML;

    //add the todo in local storage under no_status
    const todos_obj = JSON.parse(localStorage.getItem("todos"));
        for (let key in todos_obj) {
            delete todos_obj[key][todo_id]
            todos_obj[column_id] = {...todos_obj[column_id],...{[todo_id]: {'todo': todo_div}}};
        
        }
    localStorage.setItem('todos', JSON.stringify(todos_obj));
    renderTodos();
};

/* Create Todo */

const todo_submit = document.getElementById('todo_submit');

todo_submit.addEventListener('click', createTodo);

function createTodo() {
    //set a unique id
    const id = uid();
    // grab the value from the modal input 
    const input_val = document.getElementById('todo_input').value;
    // create the todo 
    const todo = `<div id="${id}" class="todo" draggable="true"><div class="todo_content">${input_val}</div><span class="close remove_todo">×</span></div>`;
    //add the todo in local storage under no_status
    const todos_obj = JSON.parse(localStorage.getItem("todos"));
    for (let key in todos_obj) {
        todos_obj['no_status'] = {
            ...todos_obj['no_status'],
            ...{
                [id]: {
                    'todo': todo
                }
            }
        };
    }
    localStorage.setItem('todos', JSON.stringify(todos_obj));

    renderTodos();
}

function renderTodos() {
    // clear the no_status column
    document.querySelectorAll('.todo').forEach(e => e.remove());
    // get local storage object
    const todos_obj = JSON.parse(localStorage.getItem("todos"));
    // loop though the object and append each todo to the corresponding column
    for (let key in todos_obj) {
        for (let todo in todos_obj[key]) {
            for (let item in todos_obj[key][todo]) {
                let column = document.getElementById(key);
                column.insertAdjacentHTML('beforeend', todos_obj[key][todo][item]);
            }
        }
    }
    // make all new todos dragable 
    let todos = document.querySelectorAll('.todo');
    todos.forEach(todo => {
        todo.addEventListener('dragstart', dragStart);
        todo.addEventListener('dragend', dragEnd);
        todo.style.display = 'block';
    });

    // make all new todos edditable 
    let todo_content_div = document.querySelectorAll('.todo_content')
    todo_content_div.forEach(todo => {
        todo.addEventListener('dblclick', function () {
            this.setAttribute('contentEditable', 'true');
            this.classList.add('inEdit')
        });

        todo.addEventListener('blur', function () {
            this.setAttribute('contentEditable', 'false');
            this.classList.remove('inEdit');
            editTodo(this);
        });

    });

    todo_input.value = '';
    $('#todo_modal').modal('hide');

    const remove_todo = document.querySelectorAll('.remove_todo');
    remove_todo.forEach(btn => {
        btn.addEventListener('click', function () {
            removeTodo(this);
        });
    });
    $('.todo').wrap("<div class='todo_wrapper'></div>")
}

function editTodo(todo) {
    // get local storage object
    const todos_obj = JSON.parse(localStorage.getItem("todos"));
    let todo_id = todo.parentElement.id;
    let todo_div = todo.parentElement.outerHTML;
    // loop though the object and update the todo
    for (let key in todos_obj) {
        for (let todoid in todos_obj[key]) {
            if (todoid == todo_id) {
                todos_obj[key][todoid]['todo'] = todo_div;
            }

        }
    }
    localStorage.setItem('todos', JSON.stringify(todos_obj));
    //console.log(todo.parentElement.id)
}

function removeTodo(btn) {
    // get local storage object
    const todos_obj = JSON.parse(localStorage.getItem("todos"));
    let todo_id = btn.parentElement.id;

    for (let key in todos_obj) {
        for (let todoid in todos_obj[key]) {
            if (todoid == todo_id) {
                delete todos_obj[key][todoid];
            }

        }
    }
    localStorage.setItem('todos', JSON.stringify(todos_obj));
    renderTodos()
}

function createLocalStorage() {
    const todos = {
        "no_status": {},
        "in_progress": {},
        "completed": {}
    }
    if (localStorage.getItem("todos") === null) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

// create  unique id
const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}