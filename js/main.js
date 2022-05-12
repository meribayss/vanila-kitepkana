// Сохраняем API (базу данных) в переменную API
const API = "http://localhost:8000/books";

// Сохраняем элементы из html в переменные
let inpName = document.getElementById("inpName");
let inpAuthor = document.getElementById("inpAuthor");
let inpImage = document.getElementById("inpImage");
let inpPrice = document.getElementById("inpPrice");
let btnAdd = document.getElementById("btnAdd");
let sectionBooks = document.getElementById("sectionBooks");

let btnOpenFor = document.getElementById("flush-collapseOne");

// Навешиваем событие на кнопку Добавить
btnAdd.addEventListener("click", () => {
  if (
    // проверка на заполненность полей
    !inpName.value.trim() ||
    !inpAuthor.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  let newBook = {
    // создаём новый объект, куда добавляем значения наших инпутов
    bookName: inpName.value,
    bookAuthor: inpAuthor.value,
    bookImage: inpImage.value,
    bookPrice: inpPrice.value,
  };
  createBooks(newBook); // вызываем функуцию для добавления в базу данных и передаем в качестве аргумента обьект созданный выше
  readBooks(); // для отображения даннх
});

// ! ================= CREATE =====================
// Функция для добавления новых книг в базу данных (db.json)
function createBooks(book) {
  fetch(API, {
    // отправляем запрос с поиощью метода POST для отправки данных
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(book),
  }).then(() => readBooks());
  inpAuthor.value = "";
  inpImage.value = "";
  inpName.value = "";
  inpPrice.value = "";
  //менякм класс с помощью toggle у аккордиона для тошо чтобы закрывался аккордион при клике на кнопку лобавить
  btnOpenFor.classList.toggle("show");
}

// !=============== READ ====================
// Создаём функцию для отображения
function readBooks() {
  fetch(API) // для получения данных из db.json
    .then((res) => res.json())
    .then((data) => {
      sectionBooks.innerHTML = ""; // очищаем тег section чтобы не было дубликатов
      data.forEach((item) => {
        // перебираем наш полученный массив с обьектами
        // добавляем нвш тег section верстку карточек с данными
        sectionBooks.innerHTML += `
        <div class="card mt-3" style="width: 18rem;">
        <img src="${item.bookImage}" class="card-img-top" style="height:250px" alt="${item.bookName}">
         <div class="card-body">
        <h5 class="card-title">${item.bookName}</h5>
        <p class="card-text">${item.bookAuthor}</p>
        <p class="card-text">${item.bookPrice}</p>
        <button class="btn btn-outline-danger btnDelete" id="${item.id}">
        Удалить
        </button>
        <button class="btn btn-outline-warning btnEdit" id = "${item.id}" data-bs-toggle="modal"
        data-bs-target="#exampleModal">
        Изменить
        </button>
        </div>
        </div>
        `;
      });
    });
}
readBooks(); // один раз вызываем функцию отобраэеня данных для того чтобы при первом посещении данные отобразились

//! DELETE
//собыитие на кнопку удалить
document.addEventListener("click", (event) => {
  // с помощью обьекта event ищем класс нашего элемента
  let del_class = [...event.target.classList]; //сохраняем массив с классами в переменную, используя spread оператор
  if (del_class.includes("btnDelete")) {
    // проверяет есть ли в нашем поиске класс btnDelete
    let del_id = event.target.id; //сохраняем в переменную id нашего элемента по которому кликнули
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readBooks()); // для того чтобы вызов функции отображения данных подождал пока запрос delete выполнился а затем сработал
  }
});

//! EDIT
//сохраняем в переменные названия инпутов и кнопки
let editInpName = document.getElementById("editInpName");
let editInpAuthor = document.getElementById("editInpAuthor");
let editInpImage = document.getElementById("editInpImage");
let editInpPrice = document.getElementById("editInpPrice");
document.addEventListener("click", (event) => {
  let editArr = [...event.target.classList];
  if (editArr.includes("btnEdit")) {
    let id = event.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.bookName;
        editInpAuthor.value = data.bookAuthor;
        editInpImage.value = data.bookImage;
        editInpPrice.value = data.bookPrice;
      });
  }
});
