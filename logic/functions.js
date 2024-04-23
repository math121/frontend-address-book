let add = false;
let edit = false;
let selectedAddressID = null;

document.addEventListener("DOMContentLoaded", async () => {
  fetchAddressBook();
});

function fetchAddressBook() {
  fetch("http://localhost:8080/address-book")
    .then((response) => response.json())
    .then((data) => fillTable(data))
    .catch((error) => console.log(error));
}

function fillTable(data) {
  const table = document.getElementsByTagName("table");

  data.forEach((address) => {
    const row = fillRow(address);
    table[0].appendChild(row);
  });
}

function fillRow(address) {
  const row = document.createElement("tr");

  for (const key in address) {
    const cell = document.createElement("td");
    cell.textContent = address[key];
    row.appendChild(cell);
    row.onclick = () => highlightRow(row);
  }

  return row;
}

function highlightRow(row) {
  const previousSelected = document.querySelector("tr.selected");
  if (previousSelected) {
    previousSelected.classList.remove("selected");
  }
  row.classList.add("selected");
}

function closeFormBox() {
  const form_box =document.getElementById("form-box");
  form_box.style.display = "none";
}

const showAddForm = () => {
  const form_box =document.getElementById("form-box");
  form_box.style.display = "block";
  add = true;
}

const showEditForm = () => {
  const selectedAddress = document.querySelector("tr.selected");
  const idNum = selectedAddress.getElementsByTagName("td")[0].textContent;

  const form = document.querySelector("form");
  form.id.value = idNum;
  form.fName.value = selectedAddress.getElementsByTagName("td")[1].textContent;
  form.lName.value = selectedAddress.getElementsByTagName("td")[2].textContent;
  form.company.value = selectedAddress.getElementsByTagName("td")[3].textContent;
  form.street.value = selectedAddress.getElementsByTagName("td")[4].textContent;
  form.tlf.value = selectedAddress.getElementsByTagName("td")[5].textContent;
  form.email.value = selectedAddress.getElementsByTagName("td")[6].textContent;
  form.mobile.value = selectedAddress.getElementsByTagName("td")[7].textContent;
  form.fax.value = selectedAddress.getElementsByTagName("td")[8].textContent;

  const form_box =document.getElementById("form-box");
  form_box.style.display = "block";
  edit = true;
  selectedAddressID = idNum;
}

const getFormData = (data) => {
  const formData = {
    id: data.id.value,
    firstName: data.fName.value,
    lastName: data.lName.value,
    companyName: data.company.value,
    street: data.street.value,
    tlf: data.tlf.value,
    email: data.email.value,
    mobile: data.mobile.value,
    fax: data.fax.value,
  }

  return formData;

}


const addAddress = (data) => {
  const formData = getFormData(data);

  fetch("http://localhost:8080/address-book", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(formData)
    
  })
    .then((response) => console.log(response.json()))
    .catch((error) => console.log(error));
};


const editAddress = (data, idNum) => {
  const formData = getFormData(data);

  fetch("http://localhost:8080/address-book/" + idNum, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(formData)
  })
    .then((response) => console.log(response.json()))
    .catch((error) => console.log(error));
};

const handleSubmit = (data) => {
  if (add) {
    addAddress(data);
    add = false;
    return;
  }

  if (edit) {
    editAddress(data, selectedAddressID);
    edit = false;
    return;
  }

}

const deleteAddress = () => {
  const selectedAddress = document.querySelector("tr.selected");
  const id = selectedAddress.getElementsByTagName("td")[0].textContent;
  fetch("http://localhost:8080/address-book/" + id, {
    method: "DELETE",
  })
    .then(location.reload())
    .catch((error) => console.log(error));
};

const search = () => {
  const name = document.getElementById("searchName").value;
  const street = document.getElementById("searchStreet").value;

  fetch(`http://localhost:8080/address-book/search?name=${name}&street=${street}`)
    .then((response) => response.json())
    .then((data) => showFilteredData(data))
    .catch((error) => console.log(error));
}

const showFilteredData = (data) => {
  const table = document.getElementsByTagName("table");
  const filteredRows = [];

  filteredRows.push(table[0].childNodes[0])
  filteredRows.push(table[0].childNodes[1])
  data.forEach(address => {
    filteredRows.push(fillRow(address));
  });

  table[0].replaceChildren(...filteredRows);
}
