const successStatus = "Success";
const rejectStatus = "Rejected";
const buyAction = "Buy";
const sellAction = "Sell";

//Log All Moves
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
  //Buy Coin From Storage
  function storeCoinPurchase(coinSymbol, quantity, purchasePrice, totalPrice) {
    const storedData = JSON.parse(localStorage.getItem("coinPurchases")) || [];
  
    const existingPurchase = storedData.find(
      (purchase) => purchase.symbol === coinSymbol
    );
  
    if (existingPurchase) {
      existingPurchase.price = parseFloat(
        (
          (existingPurchase.price * existingPurchase.amount +
            purchasePrice * quantity) /
          (existingPurchase.amount + quantity)
        ).toFixed(2)
      );
      existingPurchase.amount += quantity;
      existingPurchase.tPrice += parseFloat(totalPrice.toFixed(2));
    } else {
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
  
  //Sell Coin From Storage
  function storeCoinSell(coinSymbol, quantity, totalPrice) {
    const storedData = JSON.parse(localStorage.getItem("coinPurchases")) || [];
  
    const updatedData = storedData.map((purchase) => {
      if (purchase.symbol === coinSymbol) {
        purchase.amount -= quantity;
        purchase.tPrice = parseFloat((purchase.tPrice - totalPrice).toFixed(2));
        purchase.price = parseFloat(purchase.price.toFixed(2));
      }
  
      return purchase;
    });
  
    const filteredData = updatedData.filter((purchase) => purchase.amount > 0);
  
    localStorage.setItem("coinPurchases", JSON.stringify(filteredData));
  }
  