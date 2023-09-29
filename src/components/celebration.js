function createConfetti(quantity) {
  let confettiNumber = quantity / 10;
  for (let i = 0; i < confettiNumber; i++) {
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    let startLocationX = `${Math.floor(Math.random() * 201) - 40}%`;
    let finishLocationX = `${Math.floor(Math.random() * 201) - 40}%`;
    let startLocationY = `${Math.floor(Math.random() * 101) - 1100}%`;
    let finishLocationY = "-50%";

    let seconds = `${Math.floor(Math.random() * (25 - 10 + 1)) + 10}s`;

    styleElement.sheet.insertRule(`
          @keyframes custom-confetti-fall-${i} {
            0% {
              transform: translate(${startLocationX}, ${startLocationY});
              opacity: 1;
            }
            100% {
              transform: translate(${finishLocationX}, ${finishLocationY});
              opacity: 0.5;
            }
          }
        `);

    const confetti = document.createElement("img");
    confetti.classList.add("confetti");
    confetti.src = "./public/assets/confetti.png";
    document.body.appendChild(confetti);
    confetti.style.display = "block";
    confetti.style.animation = `custom-confetti-fall-${i} ease-out ${seconds}`;
  }

  setTimeout(() => {
    for (let i = 0; i < confettiNumber; i++) {
      const confetti = document.querySelector(`.confetti`);
      const fall = document.querySelector(`.fall-${i}`);
      if (confetti) {
        confetti.remove();
      }
      if (fall) {
        fall.remove();
      }
    }
  }, 25000);
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
        let finishLocationY = "-50%";

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
      let seconds = `${Math.floor(Math.random() * (22.5 - 12.5 + 1)) + 12.5}s`;

      const coin = document.createElement("img");
      coin.classList.add("coin");
      document.body.appendChild(coin);
      coin.style.display = "block";
      coin.style.animation = `custom-coin-fall-${i} ease-out ${seconds}`;
    }
  }, 2500);

  setTimeout(() => {
    for (let i = 0; i < quantity; i++) {
      const coin = document.querySelector(`.coin`);
      const fall = document.querySelector(`.drop-${i}`);
      if (coin) {
        coin.remove();
      }
      if (fall) {
        fall.remove();
      }
    }
  }, 25500);
}
