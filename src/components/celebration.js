function createConfetti(quantity) {
  let confettiNumber = quantity / 10;
  for (let i = 0; i < confettiNumber; i++) {
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    let startLocationX = `${Math.floor(Math.random() * 201) - 35}%`;
    let finishLocationX = `${Math.floor(Math.random() * 201) - 35}%`;
    let startLocationY = `${Math.floor(Math.random() * 101) - 1100}%`;
    let finishLocationY = "-100%";

    let seconds = `${Math.floor(Math.random() * (25 - 12 + 1)) + 12}s`;

    styleElement.sheet.insertRule(`
          @keyframes custom-confetti-fall-${i} {
            0% {
              transform: translate(${startLocationX}, ${startLocationY});
              opacity: 1;
            }
            100% {
              transform: translate(${finishLocationX}, ${finishLocationY});
              opacity: 1;
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
  let coinNumber = quantity / 10;
  setTimeout(() => {
    for (let i = 0; i < coinNumber; i++) {
      const styleElement = document.createElement("style");
      document.head.appendChild(styleElement);

      let keyframes = `@keyframes custom-coin-fall-${i} {\n`;
      for (let j = 0; j <= 100; j += 5) {
        let imageUrl = `./public/assets/coin${
          Math.floor(Math.random() * 5) + 1
        }.png`;
        let startLocationX = `${Math.floor(Math.random() * 1801)}px`;
        let finishLocationX = `${Math.floor(Math.random() * 1801)}px`;
        let startLocationY = `${Math.floor(Math.random() * 101) - 12000}%`;
        let finishLocationY = "-115%";

        keyframes += ` 0% {
            transform: translate(${startLocationX}, ${startLocationY});
            background-image: url('${imageUrl}');
        }\n`;

        keyframes += ` ${j}% {
            background-image: url('${imageUrl}');
        }\n`;

        keyframes += ` 100% {
            transform: translate(${finishLocationX}, ${finishLocationY});
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
  }, 2500);

  
}
