let currentPage = 1;
let totalPages = 1;
let history = [];

function renderHistoryPage() {
  history = JSON.parse(localStorage.getItem("coinAction")) || [];
  const itemsPerPage = 10;
  totalPages = Math.ceil(history.length / itemsPerPage);

  updatePageButtons();
  updatePage();
}

function updatePageButtons() {
  const prevPageButton = document.querySelector("#prevPageButton");
  const nextPageButton = document.querySelector("#nextPageButton");
  const currentPageElement = document.querySelector("#currentPage");
  const totalPagesElement = document.querySelector("#totalPages");

  currentPageElement.textContent = currentPage;
  totalPagesElement.textContent = totalPages;

  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
}

function updatePage() {
  currentPage = Math.min(Math.max(currentPage, 1), totalPages);
  clearHistory();
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = history.slice(startIndex, endIndex);
  renderHistory(displayedData);

  updatePageButtons();
}

updatePageButtons();

document.querySelector("#prevPageButton").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updatePage();
  }
});

document.querySelector("#nextPageButton").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    updatePage();
  }
});

historyTitle.addEventListener("click", () => {
  if (
    historyMenu.style.opacity === "1" &&
    historyMenu.style.display === "block"
  ) {
    historyMenu.style.opacity = "0";
    historyMenu.style.display = "none";
    clearHistory();
  } else {
    historyMenu.style.opacity = "1";
    historyMenu.style.display = "block";
    updatePage();
  }
});

async function renderHistory(displayedData) {
  const tableBody = document.querySelector("#boughtCoinTable tbody");

  displayedData.forEach((val) => {
    const row = document.createElement("tr");
    const statusClass = val.status === "Success" ? "green" : "red";
    row.innerHTML = `
            <td>${val.symbol}</td>
            <td>${val.price}</td>
            <td>${val.amount}</td>
            <td>${val.date}</td>
            <td>${val.action}</td>
            <td class="${statusClass}">${val.status}</td>
        `;
    tableBody.appendChild(row);
  });
}

function clearHistory() {
  const tableBody = document.querySelector("#boughtCoinTable tbody");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
}
