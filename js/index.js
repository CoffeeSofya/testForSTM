//URL-адрес сервера
let URL_SERVER = 'https://randomuser.me/api/?results=15';
//Наименования колонок таблицы "users__table"
let COLUMN_NAMES = ['Name', 'Picture', 'Location', 'Email', 'Phone', 'Registered date'];

//Функция принимает данные о пользователях в формате json
//Рисует таблицу на основе пришедших данных
const createTemplate = data => {
  let table = document.getElementById('users__table');
 
  let tr1 = document.createElement('tr');
  for (let k = 0; k < 6; k++) {
    let td = document.createElement('td');
    td.innerHTML = COLUMN_NAMES[k]
    tr1.appendChild(td);
  }
  table.appendChild(tr1);

  for (let i = 0; i < 15; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < 6; j++) {
      let td1 = document.createElement('td');
      if (j === 0) {
        td1.id = 'fullName';
        td1.innerHTML = data.results[i].name.first + ' ' + data.results[i].name.last;
      } 
      else if (j === 1) {
        td1.className = 'picture';

        let img = document.createElement('IMG');
        img.src = data.results[i].picture.thumbnail;
        img.id = 'picContainer';
        img.className = `picContainer ${i}`;
        img.addEventListener('mouseover', showTooltip);
        img.addEventListener('mouseout', hideTooltip);
        
        let picHolder = document.createElement('div');
        picHolder.id = 'picHolder';
        picHolder.className = `picHolder ${i}`;
        picHolder.style.display = 'none';
        picHolder.style.height = '128px';
        picHolder.style.width = '128px';
        picHolder.style.backgroundImage = `url(${data.results[i].picture.large})`;

        td1.appendChild(img);
        td1.appendChild(picHolder);
      } 
      else if (j === 2) td1.innerHTML = data.results[i].location.state + ' ' + data.results[i].location.city;
      else if (j === 3) td1.innerHTML = data.results[i].email;
      else if (j === 4) td1.innerHTML = data.results[i].phone;
      else if (j === 5) td1.innerHTML =  formatDate(data.results[i].registered.date);
      tr.appendChild(td1); 
    }
    table.appendChild(tr);
  }
  document.getElementById('loadingImg').style.display = 'none';
  document.appendChild(table);
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
  let filter = input.value.toUpperCase();
  let filterFullName = filter.split(' ');
  let table = document.getElementById('users__table');
  let tr = table.getElementsByTagName('tr');

  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[0];
    if (td) {
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
    } else{
      document.getElementsByClassName('not-found-user').style.display = 'block';
    }
  }
}

//Принимает адрес сервера
//Отправляет запрос на сервер
//Получает json
const getUsers = url => {
  fetch(url)
       .then(response => response.json())
       .then(json => {
          createTemplate(json);
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
    td = tr[i].getElementsByTagName('td')[0];
    if (td) tr[i].style.display = '';
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