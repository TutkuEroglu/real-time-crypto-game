const moneyDiv = document.querySelector("#money");
const resetButton = document.querySelector("#reset");
const menuButton = document.querySelector("#toggleMenu");
const modal = document.getElementById("myModal");
const closeModal = document.getElementById("closeModal");
const portfolioTitle = document.getElementById("portfolio");
const portfolioMenu = document.getElementById("portfolioMenu");
const historyTitle = document.getElementById("history");
const historyMenu = document.getElementById("historyMenu");

function start() {
  const storedMoney = localStorage.getItem("moneyData");
  if (storedMoney == null) {
    localStorage.setItem("moneyData", 300000);
  }
}
let currentPage = 1;
let totalPages = 50;

function renderHistoryPage() {
  let history = JSON.parse(localStorage.getItem("coinAction")) || [];

  updatePageButtons();
  updatePage(history);
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

function updatePage(history) {
  currentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const itemsPerPage = 10;

  clearHistory();

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

const successStatus = "Success";
const rejectStatus = "Rejected";
const buyAction = "Buy";
const sellAction = "Sell";

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

let portfolioRendered = false;
let currentPageFolio = 1;
let totalPagesFolio = 50;
function renderPortFolioPage() {
  let portfolio = JSON.parse(localStorage.getItem("coinPurchases")) || [];

  updatePageButtonsFolio();
  updatePageFolio(portfolio);
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

function updatePageFolio(portfolio) {
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
    renderPortFolioPage();
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

menuButton.addEventListener("click", () => {
  modal.style.display = "flex";
  menuButton.textContent = "Close Menu";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  menuButton.textContent = "Open Menu";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    menuButton.textContent = "Open Menu";
  }
});

resetButton.addEventListener("click", resetMoney);

async function resetMoney() {
  localStorage.removeItem("moneyData");
  localStorage.removeItem("coinPurchases");
  localStorage.removeItem("coinAction");
  start();
  const tbody = document.querySelector("#coinTable tbody");
  const rows = tbody.querySelectorAll("tr");
  rows.forEach((row) => {
    const tds = row.querySelectorAll("td");
    const lastTd = tds[tds.length - 1];
    lastTd.textContent = 0;
  });
  moneyDiv.textContent = `Your cash: 300000₺`;
  alert("Good Luck :)");
}

function storeAllAction(coinSymbol, quantity, purchasePrice, action, status) {
  const storedAction = JSON.parse(localStorage.getItem("coinAction")) || [];

  const transaction = new Date();

  const purchaseAction = {
    symbol: coinSymbol,
    amount: quantity,
    price: purchasePrice,
    date: transaction.toLocaleString(),
    action: action,
    status: status,
  };

  if (
    (action === "Buy" || action === "Sell") &&
    (status === "Success" || status === "Rejected")
  ) {
    storedAction.unshift(purchaseAction);
  }
  localStorage.setItem("coinAction", JSON.stringify(storedAction));
}

function storeCoinPurchase(coinSymbol, quantity, purchasePrice, totalPrice) {
  const storedData = JSON.parse(localStorage.getItem("coinPurchases")) || [];
  let coinExists = false;

  storedData.forEach((val) => {
    if (val.symbol === coinSymbol) {
      val.price = parseFloat(((val.price * val.amount + purchasePrice * quantity) / (val.amount+quantity)).toFixed(2));
      val.amount += quantity;
      val.tPrice += parseFloat(totalPrice.toFixed(2));
      coinExists = true;
    }
  });

  if (!coinExists) {
    const purchaseData = {
      symbol: coinSymbol,
      amount: quantity,
      price: purchasePrice,
      tPrice: totalPrice,
    };
    storedData.push(purchaseData);
  }

  localStorage.setItem("coinPurchases", JSON.stringify(storedData));
}

function storeCoinSell(coinSymbol, quantity, totalPrice) {
  const storedData = JSON.parse(localStorage.getItem("coinPurchases")) || [];
  const itemsToRemove = [];
  storedData.forEach((val, index) => {
    if (val.symbol === coinSymbol) {
      val.amount -= quantity;
      val.tPrice = parseFloat((val.tPrice - totalPrice).toFixed(2));
      val.price = parseFloat((val.price).toFixed(2));

      if (val.amount === 0) {
        itemsToRemove.push(index);
      }
    }
  });

  for (let i = itemsToRemove.length - 1; i >= 0; i--) {
    const indexToRemove = itemsToRemove[i];
    storedData.splice(indexToRemove, 1);
  }

  localStorage.setItem("coinPurchases", JSON.stringify(storedData));
}

document
  .querySelector("#coinTable tbody")
  .addEventListener("click", function (event) {
    const target = event.target;
    const storedMoney = localStorage.getItem("moneyData");
    if (target.classList.contains("buyButton")) {
      const row = target.closest("tr");
      const coin = row.querySelector("td:first-child").textContent;
      const quantity = parseFloat(row.querySelector(".buyInput").value);
      const buyInput = row.querySelector(".buyInput");

      if (!isNaN(quantity) && quantity >= 0) {
        const coinPrice = parseFloat(
          row
            .querySelector("td:nth-child(2)")
            .textContent.replace(/[^0-9.]/g, "")
        );
        const cost = quantity * coinPrice;
        if (storedMoney >= cost) {
          const updatedValue = (storedMoney - cost).toFixed(2);
          localStorage.setItem("moneyData", updatedValue);
          moneyDiv.textContent = `Your cash: ${updatedValue}₺`;
          row.querySelector("td:last-child").textContent =
            parseFloat(row.querySelector("td:last-child").textContent) +
            quantity;
          storeCoinPurchase(coin, quantity, coinPrice, cost);
          storeAllAction(coin, quantity, coinPrice, buyAction, successStatus);
          renderPortFolioPage();
        } else {
          alert("Insufficient balance. Take a smaller amount.");
          storeAllAction(coin, quantity, coinPrice, buyAction, rejectStatus);
        }
      } else {
        alert("Invalid amount. Please enter a valid amount.");
      }
      buyInput.value = "";
    }
  });

document
  .querySelector("#coinTable tbody")
  .addEventListener("click", function (event) {
    const target = event.target;
    const storedMoney = localStorage.getItem("moneyData");
    if (target.classList.contains("sellButton")) {
      const row = target.closest("tr");
      const coin = row.querySelector("td:first-child").textContent;
      const quantity = parseFloat(row.querySelector(".sellInput").value);
      const basket = row.querySelector("td:last-child").textContent;
      const sellInput = row.querySelector(".sellInput");

      if (!isNaN(quantity) && quantity >= 0) {
        const coinPrice = parseFloat(
          row
            .querySelector("td:nth-child(2)")
            .textContent.replace(/[^0-9.]/g, "")
        );
        const cost = quantity * coinPrice;
        const sellCost = coinPrice % 0.2;
        if (basket - quantity >= 0) {
          const updatedMoney = parseFloat(storedMoney) + cost - sellCost;
          localStorage.setItem("moneyData", updatedMoney.toFixed(2));
          moneyDiv.textContent = `Your cash: ${updatedMoney.toFixed(2)}₺`;
          row.querySelector("td:last-child").textContent =
            parseFloat(row.querySelector("td:last-child").textContent) -
            quantity;
          storeCoinSell(coin, quantity, cost);
          storeAllAction(coin, quantity, coinPrice, sellAction, successStatus);
        } else {
          alert("You don't have the coin you want to sell.");
          storeAllAction(coin, quantity, coinPrice, sellAction, rejectStatus);
        }
      } else {
        alert("Invalid amount. Please enter a valid amount.");
      }
      sellInput.value = "";
    }
  });

async function fetchCoinData() {
  const url = "https://data.binance.com/api/v3/ticker/24hr"
  const response = await fetch(url);
  const data = await response.json();
  let newData = [];
  data.forEach((val) => {
    if (val.symbol.toLowerCase().includes("try")) {
      val.symbol = val.symbol.slice(0, -3);
      val.askPrice = parseFloat(val.askPrice).toFixed(2);
      val.priceChangePercent = Intl.NumberFormat("tr-TR").format(
        val.priceChangePercent
      );
      val.lowPrice = Intl.NumberFormat("tr-TR").format(val.lowPrice);
      val.highPrice = Intl.NumberFormat("tr-TR").format(val.highPrice);
      val.quoteVolume = Intl.NumberFormat("tr-TR").format(val.quoteVolume);
      newData.push(val);
    }
  });
  return newData;
}

async function renderCoinTable() {
  const coinData = await fetchCoinData();
  const tableBody = document.querySelector("#coinTable tbody");

  coinData.forEach((coin) => {
    coin.basket = 0;
  });

  const userCoins = JSON.parse(localStorage.getItem("coinPurchases")) || [];

  coinData.forEach((coin) => {
    userCoins.forEach((val) => {
      if (coin.symbol === val.symbol) {
        coin.basket += val.amount;
      }
    });

    const row = document.createElement("tr");
    const priceChangePercent = parseFloat(
      coin.priceChangePercent.replace(",", ".")
    );
    const colorClass = priceChangePercent >= 0 ? "green" : "red";
    row.innerHTML = `
            <td>${coin.symbol}</td>
            <td>${coin.askPrice}</td>
            <td class="${colorClass}">${coin.priceChangePercent}</td>
            <td>${coin.lowPrice}</td>
            <td>${coin.highPrice}</td>
            <td>${coin.quoteVolume}</td>
            <td><input type="text" class="buyInput" placeholder="Buy"><button class="buyButton">Buy</button></td>
            <td><input type="text" class="sellInput" placeholder="Sell"><button class="sellButton">Sell</button></td>
            <td>${coin.basket}</td>
        `;
    tableBody.appendChild(row);
  });
  const storedMoney = localStorage.getItem("moneyData");
  moneyDiv.textContent = `Your cash: ${storedMoney}₺`;
}

async function updateCoinPrices() {
  const storedMoney = localStorage.getItem("moneyData");
  const coinData = await fetchCoinData();
  const tableRows = document.querySelectorAll("#coinTable tbody tr");
  coinData.forEach((coin, index) => {
    const row = tableRows[index];
    row.querySelector("td:nth-child(2)").textContent = coin.askPrice;
    row.querySelector("td:nth-child(3)").textContent = coin.priceChangePercent;
    row.querySelector("td:nth-child(4)").textContent = coin.lowPrice;
    row.querySelector("td:nth-child(5)").textContent = coin.highPrice;
    row.querySelector("td:nth-child(6)").textContent = coin.quoteVolume;
  });
  moneyDiv.textContent = `Your cash: ${storedMoney}₺`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderCoinTable();
  start();
  setInterval(updateCoinPrices, 5000);
  setInterval(renderHistoryPage, 1000);
  setInterval(renderPortFolioPage, 10000);
});
