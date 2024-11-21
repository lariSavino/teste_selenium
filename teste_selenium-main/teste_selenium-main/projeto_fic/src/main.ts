interface Tarefa {
   id: number;
   nome: string;
   dataLimite:  Date;
}
interface Observer {
   update(): void;
}

const getRandomId = (seed: number, max: number, min: number) => {
   return Math.floor(Math.random() * max) + min - seed;
};

class TodoList {
   public tarefas: Tarefa[] = [];
   public observers: Observer[] = [];

   public addObserver = (observer: Observer) => {
      this.observers.push(observer);
   }

   public notifyObservers = () => {
      this.observers.forEach((observer) => observer.update());
   }

   public adicionarTarefa = (tarefa: Tarefa) => {
      this.tarefas.push(tarefa);
      this.notifyObservers();
   }

   public removerTarefa = (tarefa: Tarefa) => {
      const index = this.tarefas.indexOf(tarefa);
      if(index !== -1) {
         this.tarefas.splice(index, 1);
         this.notifyObservers();
      }
   }

   public editarTarefa = (idTarefa: number,fieldstarefa: Partial<Tarefa>) => {
      this.tarefas =  this.tarefas.map((t) => {
         if(idTarefa === t.id){
            return{
               ...t, ...fieldstarefa
            }
         }
         return t;
      });
      this.notifyObservers();
   }
}
class TodoListObserver implements Observer{
   update(): void {
       renderizarTarefas();
   }
}

const tarefaContainer = (tarefa: Tarefa) => {
   const element = document.createElement("div");
   element.classList.add("todo");
   element.setAttribute("tarefa-id", `${tarefa.id}`);
   element.innerHTML = `<h3><strong>${tarefa.nome}</strong> <br> <br> 
   ${tarefa.dataLimite.toLocaleDateString()} - ${tarefa.dataLimite.toLocaleTimeString()}</h3> `;

   const botaoEditar = document.createElement("button");
   botaoEditar.innerHTML = '<i class="fa-solid fa-pen"></i>';
   botaoEditar.classList.add("edit-todo");
   botaoEditar.setAttribute("data-bs-toggle", "modal");
   botaoEditar.setAttribute("data-bs-target", "#modalAtualizarTarefa");
   botaoEditar.addEventListener("click", editarTarefa);

   const botaoDeletar = document.createElement("button");
   botaoDeletar.innerHTML = '<i class="fa-solid fa-xmark"></i>';
   botaoDeletar.classList.add("remove-todo");
   botaoDeletar.addEventListener("click", removerTarefa);

   const botaoConcluir = document.createElement("button");
   botaoConcluir.innerHTML = '<i class="fa-solid fa-check"></i>';
   botaoConcluir.addEventListener("click", concluirTarefa);
   element.appendChild(botaoConcluir);
   element.appendChild(botaoEditar);
   element.appendChild(botaoDeletar);

   return element;
}


const renderizarTarefas = () => {
   const todoDiv = document.querySelector("#todo-list");
   todoDiv!.innerHTML = "";
   todoList.tarefas.forEach((tarefa) => {
      todoDiv!.appendChild(tarefaContainer(tarefa));
   })
   console.log(todoList.tarefas);
   
}

const todoListObserver = new TodoListObserver();
const todoList = new TodoList();
todoList.tarefas = [];
todoList.addObserver(todoListObserver);

const criarTarefa = (e: MouseEvent) => {
   e.preventDefault();
   e.stopPropagation();
   const inputNome: HTMLInputElement | null = document.querySelector("input#todo-input");
   const inputData:HTMLInputElement | null= document.querySelector("input#data");
   if(inputNome!.value !== "" && inputData!.value !== ""){
      const novaTarefa: Tarefa = {
         id: getRandomId(getRandomId(5, 2000, 10), 10000, 2000),
         nome: inputNome!.value,
         dataLimite: new Date(inputData!.value.replace('T',' ').replace('-','/'))
      };
      todoList.adicionarTarefa(novaTarefa);
      inputData!.value = "";
      inputNome!.value = "";
   }
}
const editarTarefa = (e: MouseEvent) => {
   e.preventDefault();
   e.stopPropagation();
   const tarefaDiv = <HTMLElement> e.target;
   const inputNomeUpdate: HTMLInputElement | null = document.querySelector("input#nome-update");
   const inputDataUpdate: HTMLInputElement | null = document.querySelector("input#data-update");
   const botaoConfirmar: HTMLButtonElement | null = document.querySelector("button#btn-editar");
   const tarefa = todoList.tarefas.find(tarefa =>`${tarefa.id}` === tarefaDiv.parentElement?.getAttribute("tarefa-id"));
   inputNomeUpdate!.value = tarefa!?.nome;
   inputDataUpdate!.value = tarefa!?.dataLimite.toISOString().slice(0,16);
   botaoConfirmar!.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if(inputNomeUpdate!.value !== "" && inputDataUpdate!.value !== ""){
         todoList.editarTarefa(tarefa!.id, {
            nome: inputNomeUpdate!.value,
            dataLimite: new Date(inputDataUpdate!.value),
         })
      }
   })

}
const removerTarefa = (e: MouseEvent) => {
   e.preventDefault();
   e.stopPropagation();
   const button = <HTMLElement> e.target;
   const tarefa = todoList.tarefas.find(tarefa => `${tarefa.id}` === button.parentElement?.getAttribute("tarefa-id"));
   if(tarefa){
      todoList.removerTarefa(tarefa);
   }
}
const concluirTarefa = (e: MouseEvent) => {
   e.preventDefault();
   e.stopPropagation();
   const button = <HTMLElement> e.target;
   const divPai = button.parentElement;
   if(!divPai!.classList.contains("done")){
         divPai!.classList.add("done");
      }else{
         divPai!.classList.remove("done");
      }
}

const filterTodos = (filterValue: string) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {

    case "all":
      todos.forEach((todo) => {
         if(todo instanceof HTMLElement) todo.style.display = "flex"
      });
      break;

    case "done":
      todos.forEach((todo) =>{
         if(todo instanceof HTMLElement)
               todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none");
      });

      break;

    case "todo":
      todos.forEach((todo) => {
         if(todo instanceof HTMLElement)
            !todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none");
      });

      break;

    default:
      break;
  }
};
const filterBtn: HTMLSelectElement | null = document.querySelector("#filter-select");

filterBtn?.addEventListener("change", (e: Event) => {
   const filter = <HTMLOptionElement> e.target;
   filterTodos(filter.value);
})

const buttonCreate: HTMLButtonElement | null = document.querySelector("#todo-form > button");
buttonCreate!.addEventListener("click", criarTarefa);