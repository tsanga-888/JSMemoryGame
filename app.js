// Vanilla JavaScript Memory Card Game
// Inspired by freeCodeCamp.org YouTube video https://youtu.be/lhNdUVh3qCc

document.addEventListener("DOMContentLoaded", () => {
  // Card Options
  const cardDetail = [
    {
      id: "0",
      name: "circle",
      src: "images/circle.png",
      img: (new Image().src = "images/circle.png"),
    },
    {
      id: "1",
      name: "cross",
      src: "images/cross.png",
      img: (new Image().src = "images/cross.png"),
    },
    {
      id: "2",
      name: "hexagram",
      src: "images/hexagram.png",
      img: (new Image().src = "images/hexagram.png"),
    },
    {
      id: "3",
      name: "square",
      src: "images/square.png",
      img: (new Image().src = "images/square.png"),
    },
    {
      id: "4",
      name: "star",
      src: "images/star.png",
      img: (new Image().src = "images/star.png"),
    },
    {
      id: "5",
      name: "triangle",
      src: "images/triangle.png",
      img: (new Image().src = "images/triangle.png"),
    },
    {
      id: "6",
      name: "empty",
      src: "images/empty.png",
      img: (new Image().src = "images/empty.png"),
    },
    {
      id: "7",
      name: "unknown",
      src: "images/unknown.png",
      img: (new Image().src = "images/empty.png"),
    },
  ];

  const resultDisplay = document.querySelector("#result");
  const scoreDisplay = document.querySelector("#score");
  const timerDisplay = document.querySelector("#timer");
  const startButton = document.querySelector("#button");
  const gameCanvas = document.querySelector("#gameCanvas");
  const maxPairs = 6;
  const maxTime = 60;

  var cardsChosen = [];
  var isRunning = false;
  var gameOver = false;
  var gamePause = false;
  var timeLeft = maxTime;
  var setIntervalId;
  // grab the html canvas actual canvas
  const gCanvas = gameCanvas.getContext("2d");
  const cardSetup = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5];

  // Card State
  const cardState = {
    UNKNOWN: "unknown",
    MATCHED: "matched",
    EMPTY: "empty",
    SHOW: "show",
  };

  var score = 0;
  const timeInterval = 250;
  const timeTicToc = 4;
  var ticTocCount = 4;

  // column by row? Not row by column
  const board = [
    [
      { id: "", pos: "", state: "" },
      { id: "", pos: "", state: "" },
      { id: "", pos: "", state: "" },
    ],
    [
      { id: "", pos: "", state: "" },
      { id: "", pos: "", state: "" },
      { id: "", pos: "", state: "" },
    ],
    [
      { id: "", pos: "", state: "" },
      { id: "", pos: "", state: "" },
      { id: "", pos: "", state: "" },
    ],
    [
      { id: "", pos: "", state: "" },
      { id: "", pos: "", state: "" },
      { id: "", pos: "", state: "" },
    ],
  ];

  // gameBoard setup
  var index = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j]["id"] = 0;
      board[i][j]["pos"] = index;
      board[i][j]["state"] = cardState.UNKNOWN;
      index++;
    }
  }

  function initGame() {
    // Game Logic

    // There are 6 different cards plus unknown and empty
    // Set up the card pairs and randomly order them
    var cardSetup = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
    cardSetup.sort(() => 0.5 - Math.random());

    //  Reset the gameBoard
    var index = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j]["id"] = cardSetup[index]; //card type
        board[i][j]["pos"] = index;
        board[i][j]["state"] = cardState.UNKNOWN;
        index++;
      }
    }

    // Set the button so user can pause the game.
    startButton.textContent = "Pause";

    // Reset score
    score = 0;
    scoreDisplay.textContent = "0";

    // reset Timer
    timeLeft = maxTime;
    timerDisplay.textContent = timeLeft;
    resultDisplay.textContent = "";

    ticTocCount = 4;
    isRunning = true;

    setIntervalId = setInterval(runGame, timeInterval);
  }

  // Runs the game
  function runGame() {
    if (score >= maxPairs) {
      redrawGame();
      resultDisplay.textContent = "Congratulation you found all the pairs.";
      gameOver = true;
      isRunning = false;
      gamePause = false;
      startButton.textContent = "Start";
      clearInterval(setIntervalId);
    }
    if (gameOver) {
      redrawGame();
      isRunning = false;
      gamePause = false;
      clearInterval(runGame);
      return;
    }
    if (gamePause) {
      return;
    }
    if (timeLeft <= 0) {
      resultDisplay.textContent = "Game Over";
      startButton.textContent = "Start";
      gameOver = true;
      isRunning = false;
      gamePause = false;
      clearInterval(runGame);
      return;
    }

    if (ticTocCount > timeTicToc) {
      ticTocCount = 0;
      timeLeft -= 1;
      timerDisplay.textContent = timeLeft;
    } else {
      ticTocCount++;
    }

    // render the gameBoard
    redrawGame();
  }

  // Renders the gameBoard state
  function redrawGame() {
    gCanvas.fillStyle = "green";
    gCanvas.fillRect(0, 0, gCanvas.width, gCanvas.height);
    //alert("W: " + gCanvas.width + " H: " + gCanvas.height);
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        var tmpId = board[i][j]["id"];
        var tmpState = board[i][j]["state"];
        var tmpSrc = cardDetail[tmpId]["src"];
        if (tmpState === cardState.UNKNOWN) {
          tmpSrc = cardDetail[7]["src"];
        }
        if (tmpState === cardState.MATCHED) {
          tmpSrc = cardDetail[6]["src"];
        }

        var targetImg = new Image();
        targetImg.src = tmpSrc;
        targetImg.width = 100;
        targetImg.height = 100;

        gCanvas.drawImage(
          targetImg,
          0 + targetImg.width * i,
          0 + targetImg.height * j,
          targetImg.width,
          targetImg.height
        );
      }
    }
  }

  // Determines which cards the user has chosen.
  gameCanvas.addEventListener("click", (event) => {
    // ignore events is game over, paused, or not running
    if (gameOver || gamePause || !isRunning) {
      return;
    }

    // Wait until checkForMatch has completed
    if (cardsChosen.length === 2) {
      return;
    }

    // Absolute geometry of the canvas element
    // left and top are the offset
    // Some weird offset
    var canvasRect = gameCanvas.getBoundingClientRect();
    // alert("x: " + event.x + " y: " + event.y);
    var cardX = Math.floor((event.x - canvasRect.left) / 100);
    var cardY = Math.floor((event.y - canvasRect.top) / 100);
    // alert("Card x: " + cardX + " Card y: " + cardY);

    // conversion is not exact, need to prevent out of bound
    if (
      cardX >= 0 &&
      cardX < board.length &&
      cardY >= 0 &&
      cardY < board[cardX].length
    ) {
      flipCard(cardX, cardY);
    }
  });

  // flip the card on the board
  function flipCard(row, col) {
    card = board[row][col];
    // if card is matched, show or empty exit
    if (
      card["state"] === cardState.MATCHED ||
      card["state"] === cardState.SHOW ||
      card["state"] === cardState.EMPTY
    ) {
      return;
    }

    // set card to show
    card["state"] = cardState.SHOW;

    // Single card add
    if (cardsChosen.length === 0) {
      cardsChosen.push(card);
      return;
    }

    // Second Card
    if (cardsChosen.length === 1 && cardsChosen[0]["pos"] === card["pos"]) {
      return;
    }
    cardsChosen.push(card);
    if (cardsChosen.length === 2) {
      setTimeout(checkForMatch, 500);
    }
  }

  // Start button pauses and starts a game.
  startButton.addEventListener("click", () => {
    if (!isRunning) {
      gameOver = false;
      gamePause = false;
      initGame();
    } else if (isRunning && !gameOver && !gamePause) {
      gamePause = true;
      startButton.textContent = "un-Pause";
    } else if (gamePause) {
      isRunning = true;
      gamePause = false;
      startButton.textContent = "Pause";
      redrawGame();
    }
  });

  // check for matches
  function checkForMatch() {
    //   //if (gameOver) return;
    if (cardsChosen[0]["id"] === cardsChosen[1]["id"]) {
      // Match Found
      cardsChosen[0]["state"] = cardState.MATCHED;
      cardsChosen[1]["state"] = cardState.MATCHED;
      score += 1;
      resultDisplay.textContent = "A match";
    } else {
      // No Match Found
      cardsChosen[0]["state"] = cardState.UNKNOWN;
      cardsChosen[1]["state"] = cardState.UNKNOWN;
      resultDisplay.textContent = "No match";
    }
    cardsChosen = [];
    scoreDisplay.textContent = score;
  }
}); //DOM
