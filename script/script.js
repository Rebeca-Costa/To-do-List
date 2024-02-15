// Seleção dos elementos do HTML
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
// Filtrar a tarefa em diaria, semanal ou mensal
const filterByOption = (option) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
      const todoOption = todo.dataset.option;

      if (option === "all" || todoOption === option) {
          todo.style.display = "flex";
      } else {
          todo.style.display = "none";
      }
  });
};

document.getElementById("diario-todo").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("category-input").value = "diario";
  filterByOption("diario");
  updateTodoPeriodTitle("Diário");
});

document.getElementById("semanal-todo").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("category-input").value = "semanal";
  filterByOption("semanal");
  updateTodoPeriodTitle("Semanal");
});

document.getElementById("mensal-todo").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("category-input").value = "mensal";
  filterByOption("mensal");
  updateTodoPeriodTitle("Mensal");
});

// Função para mudar o título do to-do list de acordo com o updateTodoPeriodTitle
function updateTodoPeriodTitle(title) {
  document.getElementById("todo-period-title").innerText = `${title} To-do List`;
}

//Salvar a nova tarefa / "recriando" a div todo do HTML
const saveTodo = (text, done = 0, save = 1) => {
    const category = document.getElementById("category-input").value;

    const todo = document.createElement("div");
    todo.dataset.option = category;
    todo.classList.add("todo");

    const todoTittle = document.createElement("h3");
    todoTittle.innerText = text;
    todo.appendChild(todoTittle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    if (done) {
        todo.classList.add("done");
    }
    if (save) {
    saveTodoLocalStorage({ text, done: 0, category });
    }

    todoList.appendChild(todo);

    todoInput.value = "";
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        let todoTittle = todo.querySelector("h3");

        if (todoTittle.innerText === oldInputValue){
            todoTittle.innerText = text;

            updateTodoLocalStorage(oldInputValue, text);
        }
    });
};

// Filtrar todos
const getSearchedTodos = (search) => {
const todos = document.querySelectorAll(".todo");

todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
    todo.style.display = "none";
    }
});
};

const filterTodos = (filterValue) => {
const todos = document.querySelectorAll(".todo");

switch (filterValue) {
    case "all":
    todos.forEach((todo) => (todo.style.display = "flex"));

    break;

    case "done":
    todos.forEach((todo) =>
        todo.classList.contains("done")
        ? (todo.style.display = "flex")
        : (todo.style.display = "none")
    );

    break;

    case "todo":
    todos.forEach((todo) =>
        !todo.classList.contains("done")
        ? (todo.style.display = "flex")
        : (todo.style.display = "none")
    );

    break;

    default:
    break;
}
};

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Criar nova Tarefa
    const inputValue = todoInput.value;
    const categoryInput = document.getElementById("category-input").value;

    if (inputValue){
        saveTodo(inputValue);

    }
});

// Identificar os Botões
document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTittle;

    // As edições serão feitas com base no título da tarefa
    if(parentEl && parentEl.querySelector("h3")){
        todoTittle = parentEl.querySelector("h3").innerText || "";
    }

    //Botão de tarefa concluida
    if (targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done");

        updateTodoStatusLocalStorage(todoTittle);
    }

    //Botão de remover tarefa
    if (targetEl.classList.contains("remove-todo")){
        parentEl.remove();
        removeTodoLocalStorage(todoTittle);
    }

    //Botão de editar tarefa
    if (targetEl.classList.contains("edit-todo")){
        toggleForms();

        editInput.value = todoTittle;
        oldInputValue = todoTittle;
    }
});

// Botão cancelar edição
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
});

// Botão de confirmar a edição
editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const editInputValue = editInput.value;

    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
});

// Barra de pesquisa
searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
  
    getSearchedTodos(search);
  });
  
  // Cancelar pesquisa
  eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();
  
    searchInput.value = "";
  
    searchInput.dispatchEvent(new Event("keyup"));
  });
  
  // Filtrar tarefas
  filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;
  
    filterTodos(filterValue);
  });
  
  const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
  
    return todos;
  };
  
  const loadTodos = () => {
    const todos = getTodosLocalStorage();
  
    todos.forEach((todo) => {
      saveTodo(todo.text, todo.done, 0);
    });
  };
  
  const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
  
    todos.push(todo);
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    const filteredTodos = todos.filter((todo) => todo.text != todoText);
  
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  };
  
  const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoText ? (todo.done = !todo.done) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoOldText ? (todo.text = todoNewText) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  loadTodos();