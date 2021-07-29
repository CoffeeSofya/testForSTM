//URL-адрес сервера
const URL_SERVER = 'https://randomuser.me/api/?results=15';
//Наименования колонок таблицы 'users__table'
const COLUMN_NAMES = ['Name', 'Picture', 'Location', 'Email', 'Phone', 'Registered date'];
let data;

//Функция принимает данные о пользователях в формате json
//Рисует таблицу на основе пришедших данных
const createTable = () => {
  let table = document.getElementById('users__table');
 
  let header = createHeader();
  table.appendChild(header);

  for (let i = 0; i < 15; i++) {
    let row = createRow(i);
    table.appendChild(row);
  }
  document.getElementById('loadingImg').style.display = 'none';
  document.getElementById('search-id').style.display = 'block';
}  

//Функция создания заголовка таблицы
//Возвращает строку заголовка таблицы
function createHeader() {
  let rowHeader = document.createElement('tr');
  for (let i = 0; i < COLUMN_NAMES.length; i++) {
    let column = document.createElement('td');
    column.innerHTML = COLUMN_NAMES[i]
    rowHeader.appendChild(column);
  }
  return rowHeader;
}

//Функция создания строки с данными пользователя
//Получает индекс пользователя
//Возвращает заполненную строку
function createRow(index) {
  let tr = document.createElement('tr');
  for (let i = 0; i < COLUMN_NAMES.length; i++) {
    let td = document.createElement('td');
    if (i === 0) {
      td.id = 'fullName';
      td.innerHTML = getField(index, 'fullName');
    } 
    else if (i === 1) {
      td.className = 'picture';
      let img = getImage(index);
      td.appendChild(img);

      picHolder = getTooltipImg(index);   
      td.appendChild(picHolder);
    } 
    else if (i === 2) td.innerHTML = getField(index, 'location');
    else if (i === 3) td.innerHTML = getField(index, 'email');
    else if (i === 4) td.innerHTML = getField(index, 'phone');
    else if (i === 5) td.innerHTML = getField(index, 'date');
    tr.appendChild(td); 
  }
  return tr;
}

//Функция получения данных пользователя
//Получает индекс пользователя и данные для поиска
//Возвращает данные пользователя
function getField(index, userData) {
  let value;
  if (userData === 'fullName') value = data.results[index].name.first + ' ' + data.results[index].name.last;
  else if (userData === 'location') value = data.results[index].location.state + ' ' + data.results[index].location.city;
  else if (userData === 'email') value = data.results[index].email;
  else if (userData === 'phone') value = data.results[index].phone;
  else if (userData === 'date') value = formatDate(data.results[index].registered.date);
  else console.log('User data not found');
  return value;
}

//Функция получения изображения профиля
//Получает индекс пользователя
//Возвращает изображение
function getImage(index) {
  let img = document.createElement('IMG');
  img.src = data.results[index].picture.thumbnail;
  img.id = 'picContainer';
  img.className = `picContainer ${index}`;
  img.addEventListener('mouseover', showTooltip);
  img.addEventListener('mouseout', hideTooltip);
  return img;
}

//Функция получения тултипа изображения профиля
//Получает индекс пользователя
//Возвращает тултип
function getTooltipImg(index) {
  let picHolder = document.createElement('div');
  picHolder.id = 'picHolder';
  picHolder.className = `picHolder ${index}`;
  picHolder.style.backgroundImage = `url(${data.results[index].picture.large})`;
  picHolder.style.width = '128px';
  picHolder.style.height = '128px';
  return picHolder;
}

//Принимает неотформатированное значение даты регистрации пользователя
//Форматирует дату
//Возвращает дату по формату "dd.mm.yyyy"
function formatDate(date) {
  let receivedDate = new Date(date);
  let dd = receivedDate.getDate();
  if (dd < 10) dd = '0' + dd;
  let mm = receivedDate.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  let yyyy = receivedDate.getFullYear();
  return dd + '.' + mm + '.' + yyyy;
}

//Функция фильтрации по имени и фамилии
//Сравнивает значения из поля ввода и колонки "Name" и скрывает неподходящие элементы
function searchByName() {
  let input = document.getElementById('input-search');
  let filterFullName = input.value.toUpperCase().split(' ');
  let table = document.getElementById('users__table');
  let tr = table.getElementsByTagName('tr');

  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[0];
    txtValue = td.textContent || td.innerText;
    let arr = txtValue.split(' ');

    if (filterFullName.length == 1) {
      if (arr[0].toUpperCase().indexOf(filterFullName[0]) == 0 || arr[1].toUpperCase().indexOf(filterFullName[0]) == 0) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    } else {
      if (arr[0].toUpperCase().indexOf(filterFullName[0]) == 0 && arr[1].toUpperCase().indexOf(filterFullName[1]) == 0 || 
           arr[0].toUpperCase().indexOf(filterFullName[1]) == 0 && arr[1].toUpperCase().indexOf(filterFullName[0]) == 0) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
    // document.getElementById('not-found').style.display = 'block';
  }
}

//Принимает адрес сервера
//Отправляет запрос на сервер
//Получает json
const getUsers = url => {
  fetch(url)
       .then(response => response.json())
       .then(json => {
          data = json;
          createTable();
       })
}
  
getUsers(URL_SERVER);

//Принимет event события mouseover
//Отображает тултип картинки, на которую наведена мышь
let showTooltip = (event) => {
  let target = event.target;
  let classNamePicContainer = target.className.split(' ');
  document.getElementsByClassName('picHolder')[classNamePicContainer[1]].style.display = 'block';
}
//Принимет event события mouseout
//Скрывает тултип картинки, если мышь не на картинке
let hideTooltip = (event) => {
  let target = event.target;
  let classNamePicContainer = target.className.split(' ');
  document.getElementsByClassName('picHolder')[classNamePicContainer[1]].style.display = 'none';
}

//Очищает поле поиска
//Отображает все скрытые элементы
function resetSearch() {
  document.getElementById('input-search').value = '';
  table = document.getElementById('users__table');
  tr = table.getElementsByTagName('tr');
  for (i = 1; i < tr.length; i++) {
    tr[i].style.display = '';
  }
}

//Принимает функцию, которую нужно отложить и время, после которого ее вызвать
//Откладывает вызов переданной функции
//Возвращает функцию perform
function debounce(func, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();
    if ((previousCall && this.lastCall - previousCall) <= timeoutMs) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => func(...args), timeoutMs);
  }
}

const searchForm = document.getElementById('input-search');
debouncedHandle = debounce(searchByName, 250);
searchForm.addEventListener('input', debouncedHandle);