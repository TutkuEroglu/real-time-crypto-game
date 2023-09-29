const moneyDiv = document.querySelector("#money");
const resetButton = document.querySelector("#reset");
const menuButton = document.querySelector("#toggleMenu");
const modal = document.getElementById("myModal");
const closeModal = document.getElementById("closeModal");
const portfolioTitle = document.getElementById("portfolio");
const portfolioMenu = document.getElementById("portfolioMenu");
const historyTitle = document.getElementById("history");
const historyMenu = document.getElementById("historyMenu");
const modalContent = document.querySelector(".modal-content");

//Buy Coin
document
  .querySelector("#coinTable tbody")
  .addEventListener("click", function (event) {
    const target = event.target;
    const storedMoney = parseFloat(localStorage.getItem("moneyData"));

    if (target.classList.contains("buyButton")) {
      const row = target.closest("tr");
      const coin = row.querySelector("td:first-child").textContent;
      const quantityInput = row.querySelector(".buyInput");

      const quantity = parseFloat(quantityInput.value);
      const coinPrice = parseFloat(
        row.querySelector("td:nth-child(2)").textContent.replace(/[^0-9.]/g, "")
      );

      if (!isNaN(quantity) && quantity >= 0) {
        const cost = quantity * coinPrice;

        if (storedMoney >= cost) {
          const updatedValue = (storedMoney - cost).toFixed(2);
          localStorage.setItem("moneyData", updatedValue);
          moneyDiv.textContent = `Your cash: ${updatedValue}₺`;

          const updatedBasket =
            parseFloat(row.querySelector("td:last-child").textContent) +
            quantity;
          row.querySelector("td:last-child").textContent = updatedBasket;

          storeCoinPurchase(coin, quantity, coinPrice, cost);
          storeAllAction(coin, quantity, coinPrice, buyAction, successStatus);
          renderPortFolioPage();
          createConfetti(quantity);
          createCoinsQuick(quantity);
        } else {
          customAlert(
            "Warning",
            "Insufficient balance. Take a smaller amount."
          );
          storeAllAction(coin, quantity, coinPrice, buyAction, rejectStatus);
        }
      } else {
        customAlert("Warning", "Invalid amount. Please enter a valid amount.");
      }

      quantityInput.value = "";
    }
  });

//Sell Coin
document
  .querySelector("#coinTable tbody")
  .addEventListener("click", function (event) {
    const target = event.target;
    const storedMoney = parseFloat(localStorage.getItem("moneyData"));

    if (target.classList.contains("sellButton")) {
      const row = target.closest("tr");
      const coin = row.querySelector("td:first-child").textContent;
      const quantityInput = row.querySelector(".sellInput");
      const basket = parseFloat(row.querySelector("td:last-child").textContent);

      const quantity = parseFloat(quantityInput.value);
      const coinPrice = parseFloat(
        row.querySelector("td:nth-child(2)").textContent.replace(/[^0-9.]/g, "")
      );
      const sellCost = coinPrice % 0.2;

      if (!isNaN(quantity) && quantity >= 0) {
        if (basket - quantity >= 0) {
          const cost = quantity * coinPrice;
          const updatedMoney = storedMoney + cost - sellCost;

          localStorage.setItem("moneyData", updatedMoney.toFixed(2));
          moneyDiv.textContent = `Your cash: ${updatedMoney.toFixed(2)}₺`;

          const updatedBasket = basket - quantity;
          row.querySelector("td:last-child").textContent = updatedBasket;

          storeCoinSell(coin, quantity, cost);
          storeAllAction(coin, quantity, coinPrice, sellAction, successStatus);
          renderPortFolioPage();
        } else {
          customAlert(
            "Warning",
            "You don't have as many coins as you want to sell."
          );
          storeAllAction(coin, quantity, coinPrice, sellAction, rejectStatus);
        }
      } else {
        customAlert("Warning", "Invalid amount. Please enter a valid amount.");
      }
      quantityInput.value = "";
    }
  });

//Data
async function fetchCoinData() {
  const url = "https://data.binance.com/api/v3/ticker/24hr";
  const response = await fetch(url);
  const data = await response.json();

  const newData = data
    .filter((val) => {
      const isTryCoin = val.symbol.toLowerCase().includes("try");
      const isValidPrice = val.askPrice >= 0.01;
      return isTryCoin && isValidPrice;
    })
    .map((val) => {
      return {
        symbol: val.symbol.slice(0, -3),
        askPrice: parseFloat(val.askPrice).toFixed(2),
        priceChangePercent: Intl.NumberFormat("tr-TR").format(
          val.priceChangePercent
        ),
        lowPrice: Intl.NumberFormat("tr-TR").format(val.lowPrice),
        highPrice: Intl.NumberFormat("tr-TR").format(val.highPrice),
        quoteVolume: Intl.NumberFormat("tr-TR").format(val.quoteVolume),
      };
    });

  return newData;
}

//First Render Data
async function renderCoinTable() {
  const coinData = await fetchCoinData();
  const tableBody = document.querySelector("#coinTable tbody");
  const userCoins = JSON.parse(localStorage.getItem("coinPurchases")) || [];
  const storedMoney = parseFloat(localStorage.getItem("moneyData"));

  coinData.forEach((coin) => {
    coin.basket = 0;

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
        <td class="${colorClass}">%${coin.priceChangePercent}</td>
        <td>${coin.lowPrice}</td>
        <td>${coin.highPrice}</td>
        <td>${coin.quoteVolume}</td>
        <td><input type="text" class="buyInput" placeholder="Buy"><button class="buyButton">Buy</button></td>
        <td><input type="text" class="sellInput" placeholder="Sell"><button class="sellButton">Sell</button></td>
        <td>${coin.basket}</td>
    `;

    tableBody.appendChild(row);
  });

  moneyDiv.textContent = `Your cash: ${storedMoney.toFixed(2)}₺`;
}

//Render Data
async function updateTable() {
  const storedMoney = localStorage.getItem("moneyData");
  const coinData = await fetchCoinData();
  const tableRows = document.querySelectorAll("#coinTable tbody tr");
  coinData.forEach((coin, index) => {
    const row = tableRows[index];
    row.querySelector("td:nth-child(2)").textContent = coin.askPrice;
    row.querySelector(
      "td:nth-child(3)"
    ).textContent = `%${coin.priceChangePercent}`;
    row.querySelector("td:nth-child(4)").textContent = coin.lowPrice;
    row.querySelector("td:nth-child(5)").textContent = coin.highPrice;
    row.querySelector("td:nth-child(6)").textContent = coin.quoteVolume;
  });
  moneyDiv.textContent = `Your cash: ${storedMoney}₺`;
  renderPortFolioPage();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCoinTable();
  start();
  setInterval(updateTable, 5000);
  setInterval(renderHistoryPage, 1000);
  setInterval(showTotalEarn, 3000);
});
