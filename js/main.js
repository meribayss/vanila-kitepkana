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
let searchValue = ""; // переменная для нашего поика
let currentPage = 1; // переменная для пагинации текущая страница
let countPage = 1; // кол-во всех страниц

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
  //отправляем запрос в db.json с настройками поиска и пагинации. знак q - нужен для того чтобы найти элемент во всей базе данных.знак & ставится если добавляем новые настройки к предыдущим. _page - для тошо чтобы открыть конкретную страницу. _limit - для отображения несколльких элементов на сайте
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=8`) // для получения данных из db.json
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
      sumPage(); // вызов функции для нахождения кол-во страниц
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
let editBtnSave = document.getElementById("editBtnSave");

// событие на кнопку изменить
document.addEventListener("click", (event) => {
  // с помощью обьекта event ищем класс нашего элемента
  let editArr = [...event.target.classList];
  if (editArr.includes("btnEdit")) {
    // проверем есть ли в массиве с классами наш класс btnEdit
    let id = event.target.id; // сохраняем в переменную id,ша нашего элемента
    fetch(`${API}/${id}`) // с помощью запроса GET обращаемся к конкретному обьекту
      .then((res) => res.json())
      .then((data) => {
        // созраняем в инпуты модального окна данные из db,json
        editInpName.value = data.bookName;
        editInpAuthor.value = data.bookAuthor;
        editInpImage.value = data.bookImage;
        editInpPrice.value = data.bookPrice;
        // добавляем при помощи метода setAttribute id в нашу кнопку сохранить дл того чтобы передать в дальнейшем в аргументы функции editBook
        editBtnSave.setAttribute("id", data.id);
      });
  }
}); //событие на кнопку сохранить
editBtnSave.addEventListener("click", () => {
  // создаем обьект с измененными данными и в дальнейшем для отправки db.json
  let editedBook = {
    bookName: editInpName.value,
    bookAuthor: editInpAuthor.value,
    bookImage: editInpImage.value,
    bookPrice: editInpPrice.value,
  };
  editBook(editedBook, editBtnSave.id); // вызов функции для отправки измененных данных в db.json в качестве аргумента передаем вышесозданный обьект и значение атрибута id из кнопки сохранить
});
function editBook(objEditBook, id) {
  // функция для отправки измененных данных в db.json
  fetch(`${API}/${id}`, {
    // в параметры принимаем: измененный обьект и id jп котрому будем обращаться
    method: "PATCH", // используем метод PATCH для запроса на изменение данных на db.json
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objEditBook),
  }).then(() => readBooks()); // вызов функции для отображения данных сразу же после нажатия на кнопку сохранить
}

//! SEARCH
//сохраняем в переменную инпут поиска из inde.html
let inpSearch = document.getElementById("inpSearch");

inpSearch.addEventListener("input", (event) => {
  searchValue = event.target.value; // сохраняем в  переменную значение инпута
  readBooks(); // вызываем функцию для отображения данных и сразу же после изменения инпута Поиск
});
//!    PAGINATION
// сохраняем в переменные кнопки назад и вперед из index.html для пагинации
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  // событие на кнопку prev
  if (currentPage <= 1) {
    // проверка на то чтобы текуцая мтраница не уменьшалась на 1
    return;
  }
  currentPage = currentPage - 1; // ументшение текущей страницы на одну если условие не сработает
  readBooks(); // вызов функции для отображения дапнных после нажатия кнопки prev
});
// событие на кнопку next
nextBtn.addEventListener("click", () => {
  //
  if (currentPage >= countPage) {
    return; // проверка на то чтобы текущая страницв не увеличилась количества всех страниц(щсuntPage)
  }
  currentPage = currentPage + 1; // увеличение текущей страницы на одну если условик не сработает
  readBooks(); //вызов функции для отображения дапнных после нажатия кнопки next
});
// функция для нахождения кол-ва страниц
function sumPage() {
  fetch(API) // запрос в db.json для того чтобы получить весь массив с книгами
    .then((res) => res.json()) // переформатируем в обычный формат js
    .then((data) => {
      // сохраняем в переменную кол-во всех страниц с помощью свойства length узнаем длину массива и затем делим на лимит(сколько карточек хотим отобразить на одной странице) и оборачиваем в метод Math.ceil() для того чтобы округлить результат
      countPage = Math.ceil(data.length / 8);
    });
}
