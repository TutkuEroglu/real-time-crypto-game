const moneyDiv = document.querySelector("#money");
const resetButton = document.querySelector("#reset");
const menuButton = document.querySelector("#toggleMenu");
const modal = document.getElementById("myModal");
const closeModal = document.getElementById("closeModal");

function start() {
  const storedMoney = localStorage.getItem("moneyData");
  if (storedMoney == null) {
    localStorage.setItem("moneyData", 275000);
  }
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
  start();
  const tbody = document.querySelector("#coinTable tbody");
  const rows = tbody.querySelectorAll("tr");
  rows.forEach((row) => {
    const tds = row.querySelectorAll("td");
    const lastTd = tds[tds.length - 1];
    lastTd.textContent = 0;
  });
  moneyDiv.textContent = `Your cash: 275000₺`;
  alert("Good Luck :)");
}

function storeCoinPurchase(coinSymbol, quantity, purchasePrice) {
  const storedData = JSON.parse(localStorage.getItem("coinPurchases")) || [];
  let coinExists = false;
  storedData.forEach((val) => {
    if (val.symbol === coinSymbol) {
      val.amount += quantity;
      val.price = (purchasePrice + val.price) / 2;
      coinExists = true;
    }
  });
  if (!coinExists) {
    const purchaseData = {
      symbol: coinSymbol,
      amount: quantity,
      price: purchasePrice,
    };
    storedData.push(purchaseData);
  } else {
  }
  localStorage.setItem("coinPurchases", JSON.stringify(storedData));
}

function storeCoinSell(coinSymbol, quantity) {
  const storedData = JSON.parse(localStorage.getItem("coinPurchases")) || [];
  const itemsToRemove = [];
  storedData.forEach((val, index) => {
    if (val.symbol === coinSymbol) {
      val.amount -= quantity;
      val.price = val.price;

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
          const updatedValue = storedMoney - cost;
          localStorage.setItem("moneyData", updatedValue.toFixed(2));
          moneyDiv.textContent = `Your cash: ${updatedValue.toFixed(2)}₺`;
          row.querySelector("td:last-child").textContent =
            parseFloat(row.querySelector("td:last-child").textContent) +
            quantity;
          storeCoinPurchase(coin, quantity, coinPrice);
        } else {
          alert("Insufficient balance. Take a smaller amount.");
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
        const cost = (quantity * coinPrice) ;
        const sellCost = cost%0.20;
        if (basket - quantity >= 0) {
          const updatedMoney = parseFloat(storedMoney) + cost - sellCost;
          localStorage.setItem("moneyData", updatedMoney.toFixed(2));
          moneyDiv.textContent = `Your cash: ${updatedMoney.toFixed(2)}₺`;
          row.querySelector("td:last-child").textContent =
            parseFloat(row.querySelector("td:last-child").textContent) -
            quantity;
          storeCoinSell(coin, quantity, coinPrice);
        } else {
          alert("You don't have the coin you want to sell.");
        }
      } else {
        alert("Invalid amount. Please enter a valid amount.");
      }
      sellInput.value = "";
    }
  });

async function fetchCoinData() {
  const response = await fetch("https://data.binance.com/api/v3/ticker/24hr");
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
});
