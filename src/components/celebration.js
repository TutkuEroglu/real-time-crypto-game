function createConfetti(quantity) {
  let confettiNumber = quantity / 50;
  for (let i = 0; i < confettiNumber; i++) {
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    let startX = `${Math.floor(Math.random() * 201) - 35}%`;
    let finishX = `${Math.floor(Math.random() * 201) - 35}%`;
    let startY = `${Math.floor(Math.random() * 101) - 1100}%`;
    let finishY = "-100%";

    let seconds = `${Math.floor(Math.random() * (25 - 12 + 1)) + 12}s`;

    styleElement.sheet.insertRule(`
          @keyframes custom-confetti-fall-${i} {
            0% {
              transform: translate(${startX}, ${startY});
            }
            100% {
              transform: translate(${finishX}, ${finishY});
            }
          }
        `);

    const confetti = document.createElement("img");
    confetti.classList.add("confetti");
    confetti.src = "./public/assets/confetti.png";
    document.body.appendChild(confetti);
    
    confetti.style.animation = `custom-confetti-fall-${i} ease-out ${seconds}`;

    confetti.addEventListener("animationend", () => {
      confetti.remove();
    });
  }
}

function createCoins(quantity) {
    let coinNumber = quantity / 50;
    for (let i = 0; i < coinNumber; i++) {
      const styleElement = document.createElement("style");
      document.head.appendChild(styleElement);

      let keyframes = `@keyframes custom-coin-fall-${i} {\n`;
      for (let j = 0; j <= 100; j += 5) {
        let imageUrl = `./public/assets/coin${
          Math.floor(Math.random() * 5) + 1
        }.png`;
        let startX = `${Math.floor(Math.random() * 1801)}px`;
        let finishX = `${Math.floor(Math.random() * 1801)}px`;
        let startY = `${Math.floor(Math.random() * 101) - 12000}%`;
        let finishY = "-115%";

        keyframes += ` 0% {
            transform: translate(${startX}, ${startY});
            background-image: url('${imageUrl}');
        }\n`;

        keyframes += ` ${j}% {
            background-image: url('${imageUrl}');
        }\n`;

        keyframes += ` 100% {
            transform: translate(${finishX}, ${finishY});
            background-image: url('${imageUrl}');
      }`;
      }
      styleElement.sheet.insertRule(keyframes);
      let seconds = `${Math.floor(Math.random() * (25 - 12.5 + 1)) + 12.5}s`;

      const coin = document.createElement("div");
      coin.classList.add("coin");
      document.body.appendChild(coin);
      coin.style.display = "block";
      coin.style.animation = `custom-coin-fall-${i} ease-out ${seconds}`;

      coin.addEventListener("animationend", () => {
        coin.remove();
      });
    }
}

function createCoinsQuick(quantity, quick) {
    if(!quick){
      setTimeout(() => {
        createCoins(quantity)
    }, 2500);
  } else {
    createCoins(quantity)
  }
}