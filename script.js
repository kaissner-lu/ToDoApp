//1. State als Variable mit Dummy-Daten
//2. ul im HTML, wo die Daten gerendert werden
//3. function render () - um auf jeden datensatz zuzugreifen braucht man z.B. for each o. for of Schleife
//4. Listenelemente erstellen und die description rendern
//5. HTML: inputfeld für description eines neuen todos u. button zum Hinzufügen
//6. function zum Hinzufügen von neuen Todos in den State: push-Methode
//zu 6. was soll gepusht werden: alles was im Objekt drinsteht,
//zu 6. Status automatisch false beim neuen Todo, Description dynamisch aus Inputfeld, daher als parameter
//zu 6.ID individuell generieren
//7. function zum Neurendern der gesamten Liste mit zugefügten Todos
//8. checkboxelement pro tod do implementieren
//9. -> zu 8. state aktualisieren
//10.HTML remove button erstellen
//11. funktion, die alle todos mit dem state done: true aus dem state löscht
//12. funktion, die die liste neu rendert
//13. HTML: radiobuttons (label u. input über for und id verbinden, über name attribut verknüfen, wenn das gleich ist kann nur eins zeitgleich ausgewählt werden)
//14. was ist der aktuelle Zustand der Radiobuttonfilter? --> in state mit aufnehmen
//zu 14. Hilfsvariable let todosByFilter erstellt - da speichern wir dann die gefilterten oder eben all, dann rendern wir - wie nach jeder Filterfunktion - in der renderfunktion haben wir denn todo.state dann ntürlich durch die neue hilfsvariable ersetzt.

// 15. local storage implementieren: Ziel ist keine dummydaten im State, Daten sollen beim Starten der App aus dem local storage geladen werden
// man braucht dafür 2 Funktionen: getStateFromLocalStorage : wichtig per if abfragen ob es was auszulesen gibt und nur dann den state zu "getten"
//die andere Funktion ist zum updaten und synchronisieren




const addNewTodoButton = document.querySelector(".new-todo-add-button");
const newTodoInput = document.querySelector(".new-todo-description");
const removeButton = document.querySelector(".remove-done-todos-button");
const radioButtonsFilter = document.querySelector(".radiobutton-filter-to-dos");

/*
const state = {
  currentFilter: "filter-all", //14. selbst gewählt, kann all, done oder open sein - dummydaten

  todos: [],
};
*/

let state = {};

let todosByFilter = []; 

function getStateFromLocalStorage() {
  if (localStorage.getItem("state")) {
    state = JSON.parse(localStorage.getItem("state"));
  }
}

function updateLocalStorage() {
  localStorage.setItem("state", JSON.stringify(state)); 
}

radioButtonsFilter.addEventListener("change", (event) => {
  const currentClickedFilter = event.target.id;
  if (currentClickedFilter === "filter-all") {
    state.currentFilter = "filter-all";
    todosByFilter = state.todos;
  } else if (currentClickedFilter === "filter-done") {
    state.currentFilter = "filter-done";
    todosByFilter = state.todos.filter((todo) => todo.done === true);
  } else if (currentClickedFilter === "filter-open") {
    state.currentFilter = "filter-open";
    todosByFilter = state.todos.filter((todo) => todo.done === false);
  }
  render();
});


function removeDoneTodos() {
  const newTodoWithDoneFalse = state.todos.filter(
    (todo) => todo.done === false
  );

  state.todos = newTodoWithDoneFalse;
}

/* Alternative 11.
function removeDoneTodos() {
  const newTodoArray = []; //jetzt kommt durch for of schleife eine neue variable todo - repräsentiert einen datensatz des states
  for (let todo of state.todos) {
    if (todo.done === false) {
      newTodoArray.push(todo);
    } //wenn es nicht abgehakt ist, dann pushe es in ein neues array
  }
  state.todos = newTodoArray;
}
*/

removeButton.addEventListener("click", () => {
  removeDoneTodos();
  render();
});


function addNewTodoToState(description1) {
  state.todos.push({
    id: new Date().getTime(), //sekunden seit Januar 1970, geeignet für individuelle id in unserem Fall darf eben pro sekunde eine neue id generiert werden, das reicht für hier...
    description: description1,
    done: false,
  });
}

addNewTodoButton.addEventListener("click", () => {
  addNewTodoToState(newTodoInput.value); 

  updateLocalStorage();

  render(); 

  newTodoInput.value = "";
});



function generateNewTodoListItem(todoData) {
  const listItem = document.createElement("li");
  //listItem.innerText = todoData.description;



  const label = document.createElement("label");
  label.setAttribute("for", "todo-" + todoData.id); //alternativ label.htmlfor = " ";
  label.innerText = todoData.description;

  const checkbox = document.createElement("input");
  checkbox.id = "todo-" + todoData.id;
  checkbox.type = "checkbox";

  // ===true muss nicht unbedingt geschrieben werden, da automatisch truthy value angenommen wird
  if (todoData.done === true) {
    checkbox.checked = "checked";
  }

  //9.
  checkbox.addEventListener("change", () => {
    todoData.done = !todoData.done; //wenn es vorher true war soll es durch change event false werden und umgekehrt
  });

  listItem.append(checkbox, label);

  return listItem; 


function render() {
  document.querySelector(".todo-list").innerHTML = ""; 
  for (const todoData of todosByFilter)  {
    const newTodoListItem = generateNewTodoListItem(todoData); 
    document.querySelector(".todo-list").appendChild(newTodoListItem);
  }
}

getStateFromLocalStorage();