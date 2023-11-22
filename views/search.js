function searchFun() {
  const input = document.getElementById("search-notes");
  const filter = input.value.toUpperCase();
  const table = document.getElementById("styled-table");
  const tr = table.getElementsByTagName("tr");

  for (let i = 0; i < tr.length; i++) {
    const td = tr[i].getElementsByTagName("td");
    let found = false;

    for (let j = 0; j < td.length; j++) {
      const cell = td[j];
      if (cell) {
        const txtValue = cell.textContent || cell.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          found = true;
          break;
        }
      }
    }

    if (found) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}
