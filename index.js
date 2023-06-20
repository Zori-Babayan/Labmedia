"use strict"
const BASE_URL = "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users"

const userList = document.querySelector('#data');
let usersData = []

let pageSize = 5;
let currentPage = 1;


async function renderTable(page = 1) {
    await getUsers()

    if (page == 1) {
        prevButton.style.visibility = "hidden"
    } else {
        prevButton.style.visibility = "visible"
    }
    if (page == numOfPages()) {
        nextButton.style.visibility = "hidden"
    } else {
        nextButton.style.visibility = "visible"
    }
    //create HTML Table
    let output = "";
    console.log(usersData);
    usersData.filter((row, index) => {
        let start = (currentPage - 1) * pageSize
        let end = currentPage * pageSize

        if (index >= start && index < end) return true;
    }).forEach(user => {
        output += `<tr  id='${user.id}'>`
        output += `<th class="user-name">${user.username}</th>`
        output += `<td class="email">${user.email}</td>`
        output += `<td>${getDate(user.registration_date)}</td>`
        output += `<td>${user.rating}</td>`
        output += `<td><div onclick={removeUser(${user.id})}><img class="remove" src="uploads/cancel.png" alt=""></div></td>`
        "<tr>"
    })
    userList.innerHTML = output;
}

const options = {
    day: 'numeric', month: 'numeric', year: 'numeric'
}

function getDate(str) {
    const date = new Date(str);
    return date.toLocaleString('ru', options)
}

renderTable()


const previousPage = () => {
    if (currentPage > 1) currentPage--;
    renderTable(currentPage)
}

const nextPage = () => {
    if ((currentPage * pageSize) < usersData.length) currentPage++;
    renderTable(currentPage)
}

function numOfPages() {
    return Math.ceil(usersData.length / pageSize)
}


document.querySelector('#prevButton').addEventListener('click', previousPage, false)
document.querySelector('#nextButton').addEventListener('click', nextPage, false)


//getData
async function getUsers() {

    await axios.get(`${BASE_URL}`)
        .then(response => {
            usersData = response.data
        })
        .catch(error => {
        })

}


const modal = document.querySelector('.mymodal');
const popup = document.querySelector(".popup-fade");

const removeUser = (id) => {
    const user = document.getElementById(id)
    modal.classList.remove('hidden');
    popup.style.display = "block";
    const clicker = (event) => {
        if (event.target.classList.contains('cancel')) {
            modal.classList.add('hidden')
            popup.style.display = "none";
        } else if (event.target.classList.contains('confirm')) {
            modal.classList.add('hidden')
            popup.style.display = "none";
            user.remove()
        }

    }
    modal.addEventListener('click', clicker);

}

const table = document.querySelector('.table')
const tableSort = document.querySelector('.sort-block')
let colIndex = -1;

const sortTable = function (index, type, isSorted) {
    const tbody = table.querySelector('tbody');

    const compare = function (rowA, rowB) {

        const rowDataA = rowA.cells[index].innerHTML;
        const rowDataB = rowB.cells[index].innerHTML;

        switch (type) {
            case 'rating':
                return rowDataA - rowDataB;
                break;
            case 'date':
                const dateA = rowDataA.split('.').reverse().join('-');
                const dateB = rowDataB.split('.').reverse().join('-');
                return new Date(dateA).getTime() - new Date(dateB).getTime();
                break;
        }

    }
    let rows = [].slice.call(tbody.rows);

    rows.sort(compare);

    if (isSorted) rows.reverse();

    table.removeChild(tbody);

    for (let i = 0; i < rows.length; i++) {
        tbody.appendChild(rows[i]);
    }

    table.appendChild(tbody)
}


tableSort.addEventListener('click', (e) => {
    let el = e.target;
    if (el.nodeName !== "TH") return;
    const index = el.cellIndex;
    el.classList.toggle("active")
    const type = el.getAttribute('data-type');
    sortTable(index, type, colIndex === index);
    colIndex = (colIndex === index) ? -1 : index;
    if(document.querySelector('.sort-link.active')){
        document.querySelector('.clear-filter').style.display = 'flex';
    }else{
        document.querySelector('.clear-filter').style.display = '';
    }
})


/* SEARCH */

function tableSearch() {
    const phrase = document.querySelector('#input');
    const table = document.querySelector('#table');
    const regPhrase = new RegExp(phrase.value, 'i');
    let flag = false;
    for (let i = 1; i < table.rows.length; i++) {
        flag = false;
        for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }

    }

    if (document.querySelector('#input').value !== "" ) {
        document.querySelector('.clear-filter').style.display = 'flex';

    }
    else{
        document.querySelector('.clear-filter').style.display = '';
    }

}
/* SEARCH */

/* CLEARFILTER */

function sortDefault() {
    renderTable();
    const sortLinks = document.querySelectorAll('.sort-link')
    for (let i = 0; i <= sortLinks.length; i++) {
        if (document.querySelector('.sort-link.active')) {
            sortLinks[i].classList.remove('active')
        }
    }
    document.querySelector('#input').value = '';
    document.querySelector('.clear-filter').style.display = '';
}

/* CLEARFILTER */



