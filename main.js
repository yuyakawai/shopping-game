const containerWidth = 320;
const containerHeight = 480;

const itemElementWidth = 52;
const itemElementHeight = 52;

const itemElementMaxRow = 5;

const basketElementWidth = 64;
const basketElementHeight = 64;

const MaxQuestionNumber = 3;

const remainingTime = 120;

const gameLevelList = ["やさしい", "ふつう", "むずかしい"];
const itemList = {
  やさしい: [
    { name: "🍙", price: 5 },
    { name: "🍔", price: 10 },
    { name: "🍜", price: 20 }
  ],
  ふつう: [
    { name: "🍓", price: 2 },
    { name: "🍄", price: 3 },
    { name: "🥦", price: 5 },
    { name: "🍒", price: 8 }
  ],
  むずかしい: [
    { name: "🍬", price: 12 },
    { name: "🍟", price: 13 },
    { name: "🍰", price: 17 },
    { name: "🍦", price: 20 },
    { name: "🥗", price: 24 },
    { name: "🍛", price: 29 },
    { name: "🍣", price: 36 },
    { name: "🥩", price: 50 }
  ]
};

let mainContainerElement = null;
let statusMessageElement = null;
let itemListMessageElement = null;
let questionMessageElement = null;
let itemContainerElement = null;
let basketElement = null;

let isGameStart = true;
let isGameOver = false;
let isGameClear = false;

let selectLevel = null;
let startTime = 0;
let questionNumber = 0;
let totalPrice = 0;
let anserPrice = 0;

const init = () => {
  mainContainerElement = document.getElementById("main-container");
  mainContainerElement.style.width = containerWidth + "px";
  mainContainerElement.style.height = containerHeight + "px";
  mainContainerElement.style.margin = "5px";
  mainContainerElement.style.fontFamily = "sans-serif";
  mainContainerElement.style.backgroundColor = "#f5deb3";
  mainContainerElement.style.border = "2px solid #deb887";
  mainContainerElement.style.boxSizing = "border-box";
  mainContainerElement.style.borderRadius = "5px";
  mainContainerElement.style.userSelect = "none";
  mainContainerElement.style.webkitUserSelect = "none";

  initTitle();
  tick();
};

const initTitle = () => {
  let titleMessage = document.createElement("div");
  titleMessage.classList.add("title");
  titleMessage.style.position = "relative";
  titleMessage.style.width = containerWidth * 0.95 + "px";
  titleMessage.style.height = containerHeight * 0.1 + "px";
  titleMessage.style.margin = "5px";
  titleMessage.style.fontFamily = "sans-serif";
  titleMessage.style.fontSize = containerWidth * 0.1 + "px";
  titleMessage.style.display = "flex";
  titleMessage.style.alignItems = "center";
  titleMessage.style.justifyContent = "center";
  titleMessage.textContent = "🧺 買い物ゲーム 🧺";
  mainContainerElement.appendChild(titleMessage);

  const messages = [
    "🔰説明🔰",
    "問題と同じ金額になるようカゴの中に商品を入れてね。金額より多く商品を入れたり時間切れになったらゲームオーバー。",
    "",
    "👇から難易度を選択してゲームスタート"
  ];

  messages.forEach((msg) => {
    let descriptionMessage = document.createElement("div");
    descriptionMessage.classList.add("title");
    descriptionMessage.style.position = "relative";
    descriptionMessage.style.width = containerWidth * 0.95 + "px";
    descriptionMessage.style.height = containerHeight * 0.1 + "px";
    descriptionMessage.style.margin = "5px";
    descriptionMessage.style.fontFamily = "sans-serif";
    descriptionMessage.style.fontSize = containerWidth * 0.05 + "px";
    descriptionMessage.style.display = "flex";
    descriptionMessage.style.alignItems = "center";
    descriptionMessage.style.justifyContent = "center";
    descriptionMessage.textContent = msg;

    mainContainerElement.appendChild(descriptionMessage);
  });

  gameLevelList.forEach((level) => {
    let levelButton = document.createElement("div");
    levelButton.classList.add("title");
    levelButton.style.position = "relative";
    levelButton.style.width = containerWidth * 0.95 + "px";
    levelButton.style.height = containerHeight * 0.1 + "px";
    levelButton.style.margin = "5px";
    levelButton.style.borderRadius = "5px";
    levelButton.style.fontFamily = "sans-serif";
    levelButton.style.fontSize = containerWidth * 0.1 + "px";
    levelButton.style.backgroundColor = "#fdf5e6";
    levelButton.style.border = "2px solid #deb887";
    levelButton.style.boxSizing = "border-box";
    levelButton.style.cursor = "pointer";
    levelButton.style.display = "flex";
    levelButton.style.alignItems = "center";
    levelButton.style.justifyContent = "center";

    levelButton.textContent = level;
    levelButton.onpointerdown = (e) => {
      e.preventDefault();
      selectLevel = levelButton.textContent;
      const elements = Array.from(document.getElementsByClassName("title"));
      elements.forEach((e) => e.remove());

      startGame();
    };

    mainContainerElement.appendChild(levelButton);
  });
};

const startGame = () => {
  isGameStart = true;
  startTime = Date.now();

  statusMessageElement = document.createElement("div");
  statusMessageElement.style.position = "relative";
  statusMessageElement.style.width = containerWidth + "px";
  statusMessageElement.style.height = containerHeight * 0.05 + "px";
  statusMessageElement.style.margin = "5px";
  statusMessageElement.style.borderRadius = "5px";
  statusMessageElement.style.fontFamily = "sans-serif";
  statusMessageElement.style.fontSize = containerWidth * 0.05 + "px";
  statusMessageElement.textContent = "";
  mainContainerElement.appendChild(statusMessageElement);

  itemListMessageElement = document.createElement("div");
  itemListMessageElement.style.position = "relative";
  itemListMessageElement.style.width = containerWidth * 0.95 + "px";
  itemListMessageElement.style.height = containerHeight * 0.12 + "px";
  itemListMessageElement.style.margin = "5px";
  itemListMessageElement.style.borderRadius = "5px";
  itemListMessageElement.style.fontFamily = "sans-serif";
  itemListMessageElement.style.fontSize = containerWidth * 0.05 + "px";
  itemListMessageElement.style.backgroundColor = "#98fb98";
  itemListMessageElement.style.border = "2px solid #00ff7f";
  itemListMessageElement.style.boxSizing = "border-box";

  const itemListText = itemList[selectLevel].map(
    (item) => item.name + "=" + item.price + "円"
  );
  itemListMessageElement.textContent = itemListText;
  mainContainerElement.appendChild(itemListMessageElement);

  questionMessageElement = document.createElement("div");
  questionMessageElement.style.position = "relative";
  questionMessageElement.style.width = containerWidth * 0.9 + "px";
  questionMessageElement.style.height = containerHeight * 0.1 + "px";
  questionMessageElement.style.margin = "5px";
  questionMessageElement.style.borderRadius = "5px";
  questionMessageElement.style.fontFamily = "sans-serif";
  questionMessageElement.style.fontSize = containerWidth * 0.05 + "px";
  questionMessageElement.textContent = "";
  mainContainerElement.appendChild(questionMessageElement);

  itemContainerElement = document.createElement("div");
  itemContainerElement.style.position = "relative";
  itemContainerElement.style.width = containerWidth + "px";
  itemContainerElement.style.height = containerHeight * 0.7 + "px";
  itemContainerElement.style.borderRadius = "5px";
  itemContainerElement.style.fontFamily = "sans-serif";
  itemContainerElement.style.boxSizing = "border-box";
  mainContainerElement.appendChild(itemContainerElement);

  basketElement = document.createElement("div");
  basketElement.style.position = "relative";
  basketElement.style.width = basketElementWidth + "px";
  basketElement.style.height = basketElementHeight + "px";
  basketElement.style.top = containerHeight * 0.5 + "px";
  basketElement.style.left = containerWidth / 2 - basketElementWidth / 2 + "px";
  basketElement.style.backgroundColor = "#00bfff";
  basketElement.style.border = "2px solid #1e90ff";
  basketElement.style.boxSizing = "border-box";
  basketElement.style.borderRadius = "5px";
  basketElement.style.fontSize = basketElementWidth * 0.7 + "px";
  basketElement.style.display = "flex";
  basketElement.style.alignItems = "center";
  basketElement.style.justifyContent = "center";
  basketElement.textContent = "🧺";
  itemContainerElement.appendChild(basketElement);

  createQuestion();
};

const mouseDown = (e) => {
  e.preventDefault();

  e.target.classList.add("drag");

  if (e.type !== "mousedown") {
    e = e.changedTouches[0];
  }

  e.target.x = e.pageX - e.target.offsetLeft;
  e.target.y = e.pageY - e.target.offsetTop;

  document.body.addEventListener("mousemove", mouseMove, false);
  document.body.addEventListener("touchmove", mouseMove, false);
};

const mouseMove = (e) => {
  e.preventDefault();
  let drag = document.getElementsByClassName("drag")[0];

  if (e.type !== "mousemove") {
    e = e.changedTouches[0];
  }

  drag.style.top = e.pageY - e.target.y + "px";
  drag.style.left = e.pageX - e.target.x + "px";

  drag.addEventListener("mouseup", mouseUp, false);
  document.body.addEventListener("mouseleave", mouseUp, false);
  drag.addEventListener("touchend", mouseUp, false);
  document.body.addEventListener("touchleave", mouseUp, false);

  changeBasketElementStyle(collisionCheck(e.target, basketElement));
};

const mouseUp = (e) => {
  e.preventDefault();
  changeBasketElementStyle(false);
  let drag = document.getElementsByClassName("drag")[0];

  document.body.removeEventListener("mousemove", mouseMove, false);
  drag.removeEventListener("mouseup", mouseUp, false);
  document.body.removeEventListener("touchmove", mouseMove, false);
  drag.removeEventListener("touchend", mouseUp, false);

  drag.classList.remove("drag");

  if (collisionCheck(e.target, basketElement)) {
    e.target.remove();

    totalPrice += e.target.price;
    if (anserPrice === totalPrice) {
      if (questionNumber === MaxQuestionNumber) {
        gameClear();
      } else {
        createQuestion();
      }
    } else if (anserPrice < totalPrice) {
      gameOver(false);
    }
  }
};

const collisionCheck = (e1, e2) => {
  const left1 = parseInt(e1.style.left);
  const top1 = parseInt(e1.style.top);
  const right1 = parseInt(e1.style.left) + parseInt(e1.style.width);
  const bottom1 = parseInt(e1.style.top) + parseInt(e1.style.height);

  const left2 = parseInt(e2.style.left);
  const top2 = parseInt(e2.style.top);
  const right2 = parseInt(e2.style.left) + parseInt(e2.style.width);
  const bottom2 = parseInt(e2.style.top) + parseInt(e2.style.height);

  if ((right2 < left1) | (right1 < left2)) {
    return false;
  }

  if ((bottom2 < top1) | (bottom1 < top2)) {
    return false;
  }

  return true;
};

const createQuestion = () => {
  cleanup();

  anserPrice = 0;
  totalPrice = 0;

  questionNumber++;
  const itemNum = questionNumber * 5;
  const itemArray = itemList[selectLevel];
  const resultPriceSeed = Math.floor(Math.random() * (itemNum - 3)) + 3; // range 3-Max

  for (let i = 0; i < itemNum; i++) {
    const randomIndex = Math.floor(Math.random() * itemArray.length);
    let itemElement = document.createElement("div");
    itemElement.classList.add("item");
    itemElement.style.position = "absolute";
    itemElement.style.width = itemElementWidth + "px";
    itemElement.style.height = itemElementHeight + "px";

    const column = Math.floor(i / itemElementMaxRow);
    itemElement.style.top = column * 1.2 * itemElementHeight + "px";
    itemElement.style.left =
      (i % itemElementMaxRow) * itemElementWidth * 1.2 + 7 + "px";
    itemElement.style.backgroundColor = "white";
    itemElement.style.border = "2px solid #deb887";
    itemElement.style.boxSizing = "border-box";
    itemElement.style.borderRadius = "5px";
    itemElement.style.fontSize = itemElementWidth * 0.7 + "px";
    itemElement.style.cursor = "pointer";
    itemElement.style.display = "flex";
    itemElement.style.alignItems = "center";
    itemElement.style.justifyContent = "center";

    itemElement.textContent = itemArray[randomIndex].name;
    itemElement.price = itemArray[randomIndex].price;

    itemElement.addEventListener("mousedown", mouseDown, false);
    itemElement.addEventListener("touchstart", mouseDown, false);

    itemContainerElement.appendChild(itemElement);

    if (i < resultPriceSeed) {
      anserPrice += itemElement.price;
    }
  }

  questionMessageElement.textContent =
    "問題：合計 " + anserPrice + " 円になるようにカゴの中に商品を入れてね。";
};

const cleanup = () => {
  const elements = Array.from(document.getElementsByClassName("item"));
  elements.forEach((e) => e.remove());
};

const changeBasketElementStyle = (isOverlap) => {
  if (isOverlap) {
    basketElement.style.backgroundColor = "#ff9999";
    basketElement.style.border = "2px solid #ff0033";
  } else {
    basketElement.style.backgroundColor = "#00bfff";
    basketElement.style.border = "2px solid #1e90ff";
  }
};

const gameClear = () => {
  isGameClear = true;
  cleanup();
  mainContainerElement.style.backgroundColor = "#00bfff";
  mainContainerElement.style.border = "2px solid #1e90ff";

  if (selectLevel === "むずかしい") {
    questionMessageElement.textContent =
      "ゲームクリア☺️「むずかしい」をクリアするなんてスゴイ！！🎉";
  } else {
    questionMessageElement.textContent = "おめでとう！！ ゲームクリア😊";
  }

  basketElement.remove();
};

const gameOver = (isTimeUp) => {
  isGameOver = true;
  cleanup();
  mainContainerElement.style.backgroundColor = "#ff9999";
  mainContainerElement.style.border = "2px solid #ff0033";

  if (isTimeUp) {
    questionMessageElement.textContent = "時間切れ！！ ゲームオーバー😭";
  } else {
    questionMessageElement.textContent = "不正解！！ ゲームオーバー😭";
  }

  basketElement.remove();
};

const tick = () => {
  requestAnimationFrame(tick);
  if (isGameClear | isGameOver) {
    return;
  }

  if (isGameStart) {
    const elapsedTime = Date.now() - startTime;
    statusMessageElement.textContent =
      " 💪" +
      selectLevel +
      " 📄" +
      questionNumber +
      " / " +
      MaxQuestionNumber +
      " 問目 ⌛" +
      Math.max(remainingTime - elapsedTime / 1000, 0).toFixed(2) +
      " 秒";

    if (remainingTime - elapsedTime / 1000 <= 0) {
      gameOver(true);
    }
  }
};

window.onload = () => {
  init();
};
