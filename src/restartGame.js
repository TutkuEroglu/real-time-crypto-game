//Reset Money
function start() {
  const storedMoney = localStorage.getItem("moneyData");
  if (storedMoney == null) {
    localStorage.setItem("moneyData", 500000);
  }
}

resetButton.addEventListener("click", resetMoney);
//Restart Game
async function resetMoney() {
  localStorage.removeItem("moneyData");
  localStorage.removeItem("coinPurchases");
  localStorage.removeItem("coinAction");
  localStorage.removeItem("ownBusiness");
  clearTotalEarn();
  start();

  const tbody = document.querySelector("#coinTable tbody");
  const rows = tbody.querySelectorAll("tr");
  rows.forEach((row) => {
    const tds = row.querySelectorAll("td");
    const lastTd = tds[tds.length - 1];
    lastTd.textContent = 0;
  });

  moneyDiv.textContent = `Your cash: 500000₺`;
  customAlert("New Beginning", "I hope u will be more lucky!");
}
