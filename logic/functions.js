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
  }

  return row;
}
