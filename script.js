
var canvas = document.getElementById("maze");
var ctx = canvas.getContext("2d");
var currentCell;
var nextCell;

var currentCellX = 0;
var currentCellY = 0;
var newMaze;
var cellPlayer;


function start() {
  let height = document.querySelector("body").clientHeight * 0.8;
  let columns = document.querySelector("#colNum").value;
  let rows = document.querySelector("#rowNum").value;

  if (!isNaN(rows) && !isNaN(columns) && columns !== "" && rows !== "") {

    if (rows <= 1000 && columns <= 1000) {
      newMaze = new Maze(columns, rows, height);
      newMaze.generateArray();
      newMaze.setAllCellsInGrid();
      cellPlayer = { cellSize: newMaze.cellSize, x: 0, y: 0 };
      newMaze.draw();
      Player.drawPlayer();
    } else {
      Swal.fire({
        title: "Error",
        text: "Please keep the dimensions up to 1000 x 1000",
        background: "#f2f2f2",
        showConfirmButton: true,
        confirmButtonColor: "#49bf88",
      });
    }
  } else
    Swal.fire({
      title: "Error",
      text: "Please enter the number of rows and columns",
      background: "#f2f2f2",
      showConfirmButton: true,
      confirmButtonColor: "#49bf88",
    });
}
class Maze {
  constructor(rownum, colnum, size) {
    this.stack = [];
    this.rowNum = rownum;
    this.colNum = colnum;
    this.size = size;
    this.grid = [];
    this.cellSize = this.size / this.rowNum;
  }
  static cellSize = this.cellSize;
  static returnGrid() {
    return this.grid;
  }
  generateArray() {
    for (let i = 0; i < this.rowNum; i++) {
      let row = [];
      for (let j = 0; j < this.colNum; j++) {
        row.push(new Cell(i, j));
      }
      this.grid.push(row);
    }
  }
  setAllCellsInGrid() {
    currentCell = this.grid[0][0];
    this.stack.push(currentCell);
    while (this.stack.length != 0) {
      newMaze.setCellState();
    }
  }

  setCellState() {
    let visitedArray = [];
    let x = currentCell.x;
    let y = currentCell.y;
    if (!(x + 1 >= this.rowNum)) {
      nextCell = this.grid[x + 1][y];
      if (!nextCell.visited) visitedArray.push(nextCell);
    }
    if (!(y + 1 >= this.colNum)) {
      nextCell = this.grid[x][y + 1];
      if (!nextCell.visited) visitedArray.push(nextCell);
    }
    if (!(x - 1 < 0)) {
      nextCell = this.grid[x - 1][y];
      if (!nextCell.visited) visitedArray.push(nextCell);
    }
    if (!(y - 1 < 0)) {
      nextCell = this.grid[x][y - 1];
      if (!nextCell.visited) visitedArray.push(nextCell);
    }
    nextCell = visitedArray[Math.floor(Math.random() * visitedArray.length)];
    if (nextCell != undefined) {
      if (nextCell.x > currentCell.x) {
        currentCell.bottomWall = false;
        nextCell.topWall = false;
      }
      if (nextCell.x < currentCell.x) {
        currentCell.topWall = false;
        nextCell.bottomWall = false;
      }
      if (nextCell.y < currentCell.y) {
        nextCell.rightWall = false;
        currentCell.leftWall = false;
      }
      if (nextCell.y > currentCell.y) {
        nextCell.leftWall = false;
        currentCell.rightWall = false;
      }
      currentCell.visited = true;
      this.stack.push(currentCell);
      currentCell = nextCell;
      currentCell.visited = true;
    } else {
      currentCell = this.stack.pop();
    }
  }

  draw() {
    //set width according to column/row ratio
    let widthMult = this.colNum / this.rowNum;
    canvas.width = this.size * widthMult;
    canvas.height = this.size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentCellX = 0;
    currentCellY = 0;

    //draw finish
    let x = (this.colNum - 1) * this.cellSize;
    let y = (this.rowNum - 1) * this.cellSize;
    ctx.fillStyle = "#49BF88";
    ctx.fillRect(x, y, this.cellSize, this.cellSize);

    //draw all cells
    for (let i = 0; i < this.rowNum; i++) {
      for (let j = 0; j < this.colNum; j++) {
        this.grid[i][j].drawCell(
          this.grid[i][j].topWall,
          this.grid[i][j].bottomWall,
          this.grid[i][j].leftWall,
          this.grid[i][j].rightWall
        );
        currentCellX = currentCellX + this.cellSize;
      }
      currentCellY = currentCellY + this.cellSize;
      currentCellX = 0;
    }

    //add outline to maze
    ctx.strokeStyle = "#F2F2F2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
  }
}

class Cell {
  constructor(x, y) {
    this.cellSize = newMaze.cellSize;
    this.x = x;
    this.y = y;
    this.topWall = true;
    this.rightWall = true;
    this.bottomWall = true;
    this.leftWall = true;
    this.visited = false;
  }
  drawCell(top, bottom, left, right) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#F2F2F2";
    //top wall
    if (top) {
      ctx.beginPath();
      ctx.moveTo(currentCellX, currentCellY);
      ctx.lineTo(currentCellX + this.cellSize, currentCellY);
      ctx.stroke();
    }
    //right wall
    if (right) {
      ctx.beginPath();
      ctx.moveTo(currentCellX + this.cellSize, currentCellY);
      ctx.lineTo(currentCellX + this.cellSize, currentCellY + this.cellSize);
      ctx.stroke();
    }
    //bottom wall
    if (bottom) {
      ctx.beginPath();
      ctx.moveTo(currentCellX + this.cellSize, currentCellY + this.cellSize);
      ctx.lineTo(currentCellX, currentCellY + this.cellSize);
      ctx.stroke();
    }
    //left wall
    if (left) {
      ctx.beginPath();
      ctx.moveTo(currentCellX, currentCellY + this.cellSize);
      ctx.lineTo(currentCellX, currentCellY);
      ctx.stroke();
    }
  }
}
class Player {
  static movePlayer(xMOD, yMOD) {
    if (!newMaze.grid[cellPlayer.y][cellPlayer.x].topWall && yMOD < 0) {
      this.removePlayer();
      cellPlayer.y = cellPlayer.y + yMOD;
      cellPlayer.x = cellPlayer.x + xMOD;
      this.drawPlayer();
    }
    if (!newMaze.grid[cellPlayer.y][cellPlayer.x].bottomWall && yMOD > 0) {
      this.removePlayer();
      cellPlayer.y = cellPlayer.y + yMOD;
      cellPlayer.x = cellPlayer.x + xMOD;
      this.drawPlayer();
    }
    if (!newMaze.grid[cellPlayer.y][cellPlayer.x].leftWall && xMOD < 0) {
      this.removePlayer();
      cellPlayer.y = cellPlayer.y + yMOD;
      cellPlayer.x = cellPlayer.x + xMOD;
      this.drawPlayer();
    }
    if (!newMaze.grid[cellPlayer.y][cellPlayer.x].rightWall && xMOD > 0) {
      this.removePlayer();
      cellPlayer.y = cellPlayer.y + yMOD;
      cellPlayer.x = cellPlayer.x + xMOD;
      this.drawPlayer();
    }
    if (
      cellPlayer.x == newMaze.rowNum - 1 &&
      cellPlayer.y == newMaze.colNum - 1
    ) {
      Swal.fire({
        title: "You win!",
        text: "Generate new maze?",
        background: "#f2f2f2",
        showConfirmButton: true,
        confirmButtonColor: "#49bf88",
      }).then((result) => {
        if (result.isConfirmed) {
          start();
        }
      })

    }
  }
  static drawPlayer() {
    ctx.fillStyle = "#F0553E";
    ctx.fillRect(
      cellPlayer.x * cellPlayer.cellSize + cellPlayer.cellSize * 0.25,
      cellPlayer.y * cellPlayer.cellSize + cellPlayer.cellSize * 0.25,
      cellPlayer.cellSize - cellPlayer.cellSize * 0.5,
      cellPlayer.cellSize - cellPlayer.cellSize * 0.5
    );
  }
  static removePlayer() {
    ctx.clearRect(
      cellPlayer.x * cellPlayer.cellSize + cellPlayer.cellSize * 0.2,
      cellPlayer.y * cellPlayer.cellSize + cellPlayer.cellSize * 0.2,
      cellPlayer.cellSize - cellPlayer.cellSize * 0.3,
      cellPlayer.cellSize - cellPlayer.cellSize * 0.3
    );
  }
}

document.addEventListener(
  "keydown",
  function (event) {
    if (event.defaultPrevented) {
      return;
    }

    switch (event.key) {
      case "Enter":
        start();
        break;
      case "ArrowDown":
        Player.movePlayer(0, +1);
        break;
      case "ArrowUp":
        Player.movePlayer(0, -1);
        break;
      case "ArrowLeft":
        Player.movePlayer(-1, 0);

        break;
      case "ArrowRight":
        Player.movePlayer(+1, 0);

        break;
      default:
        return;
    }
    event.preventDefault();
  },
  true
);