let portfolioRendered = false;
let currentPageFolio = 1;
let totalPagesFolio = 1;
let portfolio = [];
function renderPortFolioPage() {
  portfolio = JSON.parse(localStorage.getItem("coinPurchases")) || [];
  const itemsPerPageFolio = 10;
  totalPagesFolio = Math.ceil(portfolio.length / itemsPerPageFolio);

  updatePageButtonsFolio();
  updatePageFolio();
}

function updatePageButtonsFolio() {
  const prevPageButton = document.querySelector("#prevPageButtonFolio");
  const nextPageButton = document.querySelector("#nextPageButtonFolio");
  const currentPageElement = document.querySelector("#currentPageFolio");
  const totalPagesElement = document.querySelector("#totalPagesFolio");

  currentPageElement.textContent = currentPageFolio;
  totalPagesElement.textContent = totalPagesFolio;

  prevPageButton.disabled = currentPageFolio === 1;
  nextPageButton.disabled = currentPageFolio === totalPagesFolio;
}

function updatePageFolio() {
  currentPageFolio = Math.min(Math.max(currentPageFolio, 1), totalPagesFolio);

  const itemsPerPageFolio = 10;
  clearPortfolioTable();

  const startIndex = (currentPageFolio - 1) * itemsPerPageFolio;
  const endIndex = startIndex + itemsPerPageFolio;
  const displayedDataFolio = portfolio.slice(startIndex, endIndex);

  renderPortfolio(displayedDataFolio);

  updatePageButtonsFolio();
}

updatePageButtonsFolio();

document.querySelector("#prevPageButtonFolio").addEventListener("click", () => {
  if (currentPageFolio > 1) {
    currentPageFolio--;
    updatePageFolio();
  }
});

document.querySelector("#nextPageButtonFolio").addEventListener("click", () => {
  if (currentPageFolio < totalPagesFolio) {
    currentPageFolio++;
    updatePageFolio();
  }
});

portfolioTitle.addEventListener("click", () => {
  if (
    portfolioMenu.style.opacity === "1" &&
    portfolioMenu.style.display === "block"
  ) {
    portfolioMenu.style.opacity = "0";
    portfolioMenu.style.display = "none";
    clearPortfolioTable();
  } else {
    portfolioMenu.style.opacity = "1";
    portfolioMenu.style.display = "block";
    updatePageFolio();
  }
});

function clearPortfolioTable() {
  const tableBody = document.querySelector("#ownCoinTable tbody");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
}

async function renderPortfolio(displayedDataFolio) {
  const coinData = await fetchCoinData();
  const tableBody = document.querySelector("#ownCoinTable tbody");
  const totalBought = document.querySelector("#totalBought");
  const totalCurrent = document.querySelector("#totalCurrent");

  totalBought.textContent = "Total Spent: 0.00₺";
  totalCurrent.textContent = "Total Current: 0.00₺";

  clearPortfolioTable();

  coinData.forEach((coin) => {
    coin.basket = 0;
  });

  const userCoins = JSON.parse(localStorage.getItem("coinPurchases")) || [];

  let totalSpent = 0;
  let totalCurrentValue = 0;

  coinData.forEach((coin) => {
    userCoins.forEach((val) => {
      if (coin.symbol === val.symbol && val.amount > 0) {
        coin.basket += val.amount;
      }
    });

    displayedDataFolio.forEach((val) => {
      if (coin.symbol === val.symbol && val.amount > 0) {
        const gain = (coin.askPrice - val.price) * val.amount;
        const currentTotal = coin.askPrice * val.amount;

        totalSpent += val.tPrice;
        totalCurrentValue += currentTotal;

        const row = document.createElement("tr");
        const colorClass = gain >= 0 ? "green" : "red";
        const gainClass = currentTotal >= val.tPrice ? "green" : "red";
        const totalClass = totalCurrentValue >= totalSpent ? "green" : "red";
        totalBought.classList.add("green");
        totalCurrent.classList.add(totalClass);
        row.innerHTML = `
            <td>${coin.symbol}</td>
            <td>${val.price.toFixed(2)}₺</td>
            <td>${coin.askPrice}₺</td>
            <td>${val.tPrice.toFixed(2)}₺</td>
            <td class="${gainClass}">${currentTotal.toFixed(2)}₺</td>
            <td>${coin.basket}</td>
            <td class="${colorClass}">${gain.toFixed(2)}₺</td>
        `;
        tableBody.appendChild(row);
      }
    });
  });

  totalBought.textContent = `Total Spent: ${totalSpent.toFixed(2)}₺`;
  totalCurrent.textContent = `Total Current: ${totalCurrentValue.toFixed(2)}₺`;
  const storedMoney = localStorage.getItem("moneyData");
  moneyDiv.textContent = `Your cash: ${storedMoney}₺`;
}
