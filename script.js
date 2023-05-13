class GameContainerInterface {

  cellBoxes = [];

  resizeCanvas(size) {

    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style.width = size;
    this.canvas.style.height = size;
  }

  createTable(row = 4, column = 4) {
    let width = column * 100 + 100;
    let heigth = row * 100 + 100;

    switch (row) {
      case 3:
        this.resizeCanvas(370);
        break;

      default:
        this.canvas.width = width;
        this.canvas.height = heigth;
        this.canvas.style.width = width;
        this.canvas.style.height = heigth;
        break;
    }

    this.canvas.classList.add("canvasBorder")
    this.contex = this.canvas.getContext("2d")
    this.createNumberContainer(row, column);
    this.putNumberInContainer(row * column);
    document.body.insertBefore(this.canvas, document.body.childNodes[0])
    this.loadSave(row * column);
    this.redrawCanvas();
    this.handleClick()
  }

  loadSave(size) {
    const savedBoxes = localStorage.getItem("lastSavedField")
      ? JSON.parse(localStorage.getItem("lastSavedField"))
      : this.cellBoxes;
    if (savedBoxes.length !== size) {
      console.log("different size, will not load");
    } else {
      this.moves = localStorage.getItem("lastSavedMoves") ?? 0;
      this.cellBoxes = savedBoxes;
    }
  }

  moves = 0;

  putNumberInContainer(numbers) {
    for (let i = 1; i < numbers; i++) {
      let box = this.cellBoxes[i];
      box.empty = false;
      this.contex.fillStyle = "#4d222b"
      this.contex.font = "bold 18px Arial"
      this.contex.fillText(i, (box.x + box.width / 2), (box.y + box.heigth / 2),)
    }
    this.cellBoxes[0].empty = true;
    this.drawCellBox(this.cellBoxes[0])
  }

  createNumberContainer(row = 4, column = 4) {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        let cellBox = {
          x: i * 130,
          y: j * 130,
          width: 105,
          heigth: 105,
          strokeWidth: 105,
          strokeHeigth: 105,
          empty: false
        };
        this.drawCellBox(cellBox);
        this.cellBoxes.push(cellBox);
      }
    }
  }
  drawCellBox(cellBox) {
    if (cellBox.empty) {
      this.contex.fillStyle = "rgba(0,0,0,0)";
      this.contex.fillRect(cellBox.x, cellBox.y, cellBox.width, cellBox.heigth);
    } else {
      this.contex.fillStyle = "#FFAABB";
      this.contex.fillRect(cellBox.x, cellBox.y, cellBox.width, cellBox.heigth);
      this.contex.fillStyle = "#ABC";
      this.contex.strokeRect(cellBox.x, cellBox.y, cellBox.strokeWidth, cellBox.strokeHeigth);
    }
  }


  isMouseInCellBox(mouseX, mouseY, box) {
    const boxLeft = box.x;
    const boxTop = box.y;
    const boxRight = box.x + box.width;
    const boxBottom = box.y + box.heigth;

    return mouseX < boxRight && mouseX > boxLeft && mouseY > boxTop && mouseY < boxBottom;
  }

  redrawCanvas() {
    this.contex.clearRect(0, 0, this.canvas.width, this.canvas.width);
    for (let box of this.cellBoxes) {
      this.drawCellBox(box);
    }
    this.putNumberInContainer(this.cellBoxes.length);
  }

  canvas = document.createElement("canvas");

  handleClick() {
    this.canvas.addEventListener("click", (evt) => {
      for (let box of this.cellBoxes) {
        if (this.isMouseInCellBox(evt.offsetX, evt.offsetY, box)) {

          let emptyBox = this.findEmptyBox(box);
          if (emptyBox) {
            this.swapBoxes(box, emptyBox);
          };
        }
      }
    }, true)
  }

  swapBoxes(targetBox, box) {
    this.contex.clearRect(targetBox.x, targetBox.y, targetBox.width, targetBox.heigth);
    if (targetBox.y !== box.y) {
      this.swapVertical(targetBox, box);
    } else {
      this.swapHorizontal(targetBox, box);
    }
    this.moves++;
    console.log(this.moves)
  }

  swapVertical(targetBox, box) {
    let initialYClick = targetBox.y;
    let destinationYClick = box.y;
    let initialYEmpty = box.y;
    while (targetBox.y !== destinationYClick) {
      this.redrawCanvas();
      if (initialYClick > initialYEmpty) {
        targetBox.y -= 13;
        box.y += 13;
      } else {
        targetBox.y += 13;
        box.y -= 13;
      }
    }
    setTimeout(() => this.redrawCanvas(), 100)
  }

  swapHorizontal(targetBox, box) {
    let initialXClick = targetBox.x;
    let destinationXClick = box.x;
    let initialXEmpty = box.x;
    while (targetBox.x !== destinationXClick) {
      this.redrawCanvas();
      if (initialXClick > initialXEmpty) {
        targetBox.x -= 13;
        box.x += 13;
      } else {
        targetBox.x += 13;
        box.x -= 13;
      }
      setTimeout(() => this.redrawCanvas(), 100);
    }
  }

  findEmptyBox(clickedBox) {
    for (let box of this.cellBoxes) {
      if (
        !(clickedBox.x === box.x && clickedBox.y === box.y) &&
        (clickedBox.x === box.x || clickedBox.y === box.y)
        && Math.abs(clickedBox.x - box.x) <= 130
        && Math.abs(clickedBox.y - box.y) <= 130) {
        if (box.empty) {
          return box;
        }
      }
    }
    return false;
  }
}

class GameInterfaceButtons {
  shuffleAndStartButton = document.createElement("button")
  startGameButton = document.createElement("button")
  saveGameButton = document.createElement("button")
  resultOrScoreGameButton = document.createElement("button")

  buttonBox = document.createElement("div")

  shuffleAndStart(gameField) {
    if (this.easyMode) {

    }
    for (let i = 0; i < 999; i++) {

      let random = (Math.floor(Math.random() * (gameField.cellBoxes.length - 1)));
      let box = gameField.cellBoxes[random];
      let emptyBox = gameField.findEmptyBox(box);

      if (emptyBox) {
        gameField.swapBoxes(box, emptyBox);
      }
    }
    gameField.moves = 0;
  }

  constructor() {
    document.body.append(this.buttonBox)
    this.buttonBox.append(
      this.shuffleAndStartButton,
      this.startGameButton,
      this.saveGameButton,
      this.resultOrScoreGameButton)
    this.buttonBox.classList.add("buttonContainer")
    this.shuffleAndStartButton.classList.add("buttons")
    this.startGameButton.classList.add("buttons")
    this.saveGameButton.classList.add("buttons")
    this.resultOrScoreGameButton.classList.add("buttons")
    this.shuffleAndStartButton.textContent = "shuffle and start".toUpperCase()
    this.startGameButton.textContent = "stop".toUpperCase()
    this.saveGameButton.textContent = "save".toUpperCase()
    this.resultOrScoreGameButton.textContent = "result".toUpperCase()
  }

  /* boxDesignForshuffleAndStartButton
   boxDesignstartGameButton
   boxDesignsaveGameButton
   boxDesignresultOrScoreGameButton*/

}

class GameInterfaceProgressCounter {
  movesText = document.createElement('p')
  movesCounter = document.createElement('p')
  timerText = document.createElement('p')
  interactiveTimer = document.createElement('p')
  countGameprogress = document.createElement('div')
  moves = 0;
  timer = null;
  gameMoves(moves) {
    this.moves = moves;
    this.movesCounter.textContent = `${moves}`;
  }
  gameTime() {
    // this.interactiveTimer.textContent = "00:00";
    let minutes = +this.interactiveTimer.textContent.split(":")[0];
    let seconds = +this.interactiveTimer.textContent.split(":")[1];
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (seconds == 60) {
        seconds = 0;
        minutes = + minutes + 1;
      } else {
        seconds = + seconds + 1;
      }

      if (minutes < 10) {
        minutes = `0${+minutes}`;
      }
      if (seconds < 10) {
        seconds = `0${+seconds}`;
      }
      this.interactiveTimer.textContent = `${minutes}:${seconds}`;
    }, 1000);

  }

  timerStopped = false;

  toggleTimer() {
    if (this.timerStopped) {
      this.gameTime();
    } else {
      clearInterval(this.timer);
    }
    this.timerStopped = !this.timerStopped;
  }

  constructor() {
    document.body.append(this.countGameprogress)
    this.countGameprogress.append(
      this.movesText,
      this.movesCounter,
      this.timerText,
      this.interactiveTimer)
    this.movesText.textContent = "moves:".toUpperCase()
    this.movesCounter.textContent = "0"
    this.timerText.textContent = 'time:'.toUpperCase()
    this.interactiveTimer.textContent = localStorage.getItem("lastSavedTime") ?? '00:00';

    this.countGameprogress.classList.add('countGameProgressContainer')
    this.movesText.classList.add('movesText')
    this.movesCounter.classList.add('movesCounter')
    this.timerText.classList.add('timerText')
    this.interactiveTimer.classList.add('interactiveTimer')

  }
}



class GameInterfaceSettings {
  frameSizeText = document.createElement('p')
  currentFrameSizeValue = document.createElement('p')
  otherFrameSize = document.createElement('p')
  frameSizeChoiseValue = document.createElement('ul')
  sizes = []


  constructor() {
    this.frameSizeText.textContent = 'frame size:'.toUpperCase()
    this.currentFrameSizeValue.textContent = '4x4'
    this.otherFrameSize.textContent = 'other sizes:'.toUpperCase()
    for (let i = 3; i <= 8; i++) {
      let sizeChoise = document.createElement('li');
      sizeChoise.textContent = `${i}x${i}`;
      this.sizes.push(sizeChoise);
      this.frameSizeChoiseValue.append(sizeChoise);
    }
    document.body.append(this.frameSizeChoiseValue);
    document.body.append(this.currentFrameSizeValue);

  }

  currentFrameSize(value) {
    this.currentFrameSizeValue.textContent = value;
  }

  frameSizeChoise(gameField) {
    for (let size of this.sizes) {
      size.addEventListener("click", () => {
        let sizeOptions = size.textContent.split("x");
        let rows = sizeOptions[0];
        let columns = sizeOptions[1];
        gameField.cellBoxes = [];
        gameField.createTable(+rows, +columns);
      })
    }
  }
}
class Game {
  // class intances / экземпляры или объекты класса
  gameField = new GameContainerInterface();
  gameInterfaceButtons = new GameInterfaceButtons();
  progressCounterExample = new GameInterfaceProgressCounter()
  gameSettings = new GameInterfaceSettings()

  constructor() {
    this.initButtons();
    this.gameField.createTable();
    this.progressCounterExample.gameMoves(localStorage.getItem("lastSavedMoves") ?? 0)
    this.progressCounterExample.gameTime();
    if (!localStorage.getItem("lastSavedField")) {
      this.gameInterfaceButtons.shuffleAndStart(this.gameField);
    }
    this.gameSettings.frameSizeChoise(this.gameField);
  }

  initButtons() {
    this.gameInterfaceButtons.shuffleAndStartButton.addEventListener(
      'click', () => {
        this.gameInterfaceButtons.shuffleAndStart(this.gameField);
        this.progressCounterExample.interactiveTimer.textContent = '00:00';
        this.gameInterfaceButtons.startGameButton.textContent = "stop".toUpperCase();
        this.progressCounterExample.gameTime();
        this.progressCounterExample.gameMoves(this.gameField.moves);
      });
    this.gameInterfaceButtons.startGameButton.addEventListener("click", () => {
      this.progressCounterExample.toggleTimer();
      this.gameInterfaceButtons.startGameButton.textContent =
        this.progressCounterExample.timerStopped
          ? "proceed".toUpperCase()
          : "stop".toUpperCase();

    });
    this.gameField.canvas.addEventListener('click', () => {
      this.progressCounterExample.gameMoves(this.gameField.moves);
    });

    this.gameInterfaceButtons.saveGameButton.addEventListener("click", () => {
      localStorage.setItem("lastSavedField",
        JSON.stringify(this.gameField.cellBoxes));

      localStorage.setItem("lastSavedMoves", this.gameField.moves);
      localStorage.setItem("lastSavedTime", this.progressCounterExample.interactiveTimer.textContent);
    });
  }

}

const game = new Game();



