function createBusinessCategory(business) {
    const modalCategory = document.createElement("div");
    modalCategory.classList.add("modal-category");
  
    const categoryImg = document.createElement("div");
    categoryImg.classList.add("category-img");
  
    const img = document.createElement("img");
    img.classList.add("buyEverything");
    img.src = business.imageUrl;
  
    const overlayText = document.createElement("div");
    overlayText.classList.add("overlay-text");
    overlayText.textContent = `${business.name}`;
  
    const businessText = document.createElement("span");
    businessText.classList.add("businessText");
    businessText.textContent = `${business.text}`;
  
    categoryImg.appendChild(img);
    categoryImg.appendChild(overlayText);
    modalCategory.appendChild(categoryImg);
    modalCategory.appendChild(businessText);
  
    return modalCategory;
  }
  
  businesses.forEach((business, index) => {
    const businessCategory = createBusinessCategory(business);
    modalContent.appendChild(businessCategory);
  });
  
  const modalCategories = document.querySelectorAll(".modal-category");
  
  menuButton.addEventListener("click", openMenu);
  
  modalCategories.forEach((modalCategory, index) => {
    modalCategory.addEventListener("click", () => {
      const categoryName = businesses[index].name;
      const ownBusiness = JSON.parse(localStorage.getItem("ownBusiness")) || [];
      const val = ownBusiness.find((business) => business.bName === categoryName);
  
      if (val) {
        if (val.bStatus) {
          const storedMoney = parseFloat(localStorage.getItem("moneyData"));
          if (storedMoney >= val.bPrice) {
            const newMoney = (storedMoney - val.bPrice).toFixed(2);
            localStorage.setItem("moneyData", newMoney);
            moneyDiv.textContent = `Your cash: ${newMoney}₺`;
            val.bStatus = false;
            val.bPurchaseDate = new Date();
            val.bLastCollectionDate = new Date();
            localStorage.setItem("ownBusiness", JSON.stringify(ownBusiness));
            customAlert(
              "The purchase is successful!",
              "I hope you make good money. Good luck!"
            );
            createConfetti(val.bPrice/250);
            createCoinsQuick(val.bPrice/250);
          } else {
            customAlert("Warning", "You don't have enough money");
          }
        } else {
          calculateEarnings(categoryName);
        }
      } else {
        customAlert("Warning", "You don't have enough money");
      }
    });
  });
  
  function calculateEarnings(businessName) {
    const ownBusiness = JSON.parse(localStorage.getItem("ownBusiness")) || [];
    const storedMoney = parseFloat(localStorage.getItem("moneyData"));
    const now = new Date();
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    const millisecondsInAnHour = 1000 * 60 * 60;
    const millisecondsInAMinute = 1000 * 60;
    const millisecondsInASecond = 1000;
  
    ownBusiness.forEach((val) => {
      if (val.bName === businessName && val.bPurchaseDate) {
        const lastCollectionDate = new Date(val.bLastCollectionDate);
        const elapsedTime = now - lastCollectionDate;
        const days = Math.floor(elapsedTime / millisecondsInADay);
        const hours = Math.floor(
          (elapsedTime % millisecondsInADay) / millisecondsInAnHour
        );
        const minutes = Math.floor(
          (elapsedTime % millisecondsInAnHour) / millisecondsInAMinute
        );
        const seconds = Math.floor(
          (elapsedTime % millisecondsInAMinute) / millisecondsInASecond
        );
  
        let totalEarnings = 0;
  
        if (days > 0) {
          totalEarnings += val.bGainHour * 24 * days;
        }
        if (hours > 0) {
          totalEarnings += val.bGainHour * hours;
        }
        if (minutes > 0) {
          totalEarnings += (val.bGainHour / 60) * minutes;
        }
        if (seconds > 0) {
          totalEarnings += (val.bGainHour / 3600) * seconds;
        }
  
        val.bEarnings = parseFloat(totalEarnings.toFixed(2));
        val.bTotalEarnings += parseFloat(totalEarnings.toFixed(2));
  
        const newMoney = parseFloat((storedMoney + totalEarnings).toFixed(2));
        moneyDiv.textContent = `Your cash: ${newMoney}₺`;
        localStorage.setItem("moneyData", newMoney);
  
        customAlert(
          "New Earnings Collected",
          `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds = ${totalEarnings.toFixed(
            2
          )}₺`
        );
        val.bLastCollectionDate = now;
        localStorage.setItem("ownBusiness", JSON.stringify(ownBusiness));
      }
    });
  }
  
  function openMenu() {
    const ownBusiness = JSON.parse(localStorage.getItem("ownBusiness")) || [];
    modal.style.display = "flex";
    let businessData = [];
  
    if (ownBusiness == null || ownBusiness.length === 0) {
      businesses.forEach((val) => {
        let data = {
          bName: val.name,
          bPrice: val.price,
          bGainHour: val.gainPerHour,
          bPurchaseDate: val.purchaseDate,
          bLastCollectionDate: val.lastCollectionDate,
          bEarnings: val.earnings,
          bTotalEarnings: val.totalEarning,
          bStatus: true,
        };
        businessData.push(data);
      });
    } else {
      showTotalEarn();
      return;
    }
    localStorage.setItem("ownBusiness", JSON.stringify(businessData));
  }
  
  function showTotalEarn() {
    let ownBusiness = JSON.parse(localStorage.getItem("ownBusiness")) || [];
    let text = document.querySelectorAll(".overlay-text");
    let textArray = Array.from(text);
  
    ownBusiness.forEach((val) => {
      textArray.forEach((el) => {
        if (val.bStatus == false && el.textContent.includes(val.bName)) {
          el.textContent = `${val.bName} total gain: ${val.bTotalEarnings.toFixed(
            2
          )}₺`;
        }
      });
    });
  }

  function clearTotalEarn() {
    let text = document.querySelectorAll(".overlay-text");
    let textArray = Array.from(text);

    for (let i = 0; i < textArray.length; i++){
      textArray[i].textContent = businesses[i].name
    }
  }
  
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });