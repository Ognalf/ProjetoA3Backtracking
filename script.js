const maze = [
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
  [1,0,1,0,1,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,0,0,1,0,1,0,0,0,1,1,1,0,1,0,1],
  [1,0,1,0,0,0,1,1,0,1,1,1,0,1,0,0,0,1,0,1],
  [1,0,0,0,1,0,1,0,0,0,0,1,0,1,1,1,1,1,0,1],
  [1,0,1,1,1,0,1,1,1,1,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,1,1,0,0,0,0,1,1,1,1,1,0,1,1,1],
  [1,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1],
  [1,0,1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,1,1,1,1,1,0,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1],
  [1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0]
];

const numRows = maze.length;
const numCols = maze[0].length;
let visited = [];

function drawMaze(botPosition = null) {
    const mazeDiv = document.getElementById("maze");
    mazeDiv.innerHTML = "";
    const table = document.createElement("table");

    for (let i = 0; i < numRows; i++) {
        
        const row = document.createElement("tr");
        
        for (let j = 0; j < numCols; j++) {
        
            const cell = document.createElement("td");

            if (botPosition && botPosition[0] === i && botPosition[1] === j) {
                cell.className = "bot";
            } else if (visited[i][j]) {
                cell.className = "visited";
            } else if (maze[i][j] === 1) {
                cell.className = "wall";
            } else if (i === numRows - 1 && j === numCols - 1) {
                cell.className = "end";
            } else {
                cell.className = "path";
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    mazeDiv.appendChild(table);
}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

  return array;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function backtrackSolve(x, y, endX, endY) {
    if (x < 0 || y < 0 || x >= numRows || y >= numCols) return false;
    if (maze[x][y] === 1 || visited[x][y]) return false;

    visited[x][y] = true;
    drawMaze([x, y]);
    await sleep(150);

    if (x === endX && y === endY) {
        document.getElementById("resetBtn").style.display = "inline-block";

        const victoryOverlay = document.getElementById("victory");
        victoryOverlay.style.display = "block";
        victoryOverlay.classList.remove("pop-in"); // reset anim
        void victoryOverlay.offsetWidth; // força reflow
        victoryOverlay.classList.add("pop-in");    // reaplica anim

        return true;
    }


    const directions = shuffle([
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ]);

    for (const [dx, dy] of directions) {
        const nextX = x + dx;
        const nextY = y + dy;
        const reachedEnd = await backtrackSolve(nextX, nextY, endX, endY);
        if (reachedEnd) return true;
    }

    drawMaze([x, y]);
    await sleep(100);
    return false;
}

window.onload = () => {

    const startBtn = document.getElementById("startBtn");
    const resetBtn = document.getElementById("resetBtn");

    startBtn.addEventListener("click", () => {
        visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
        drawMaze();
        backtrackSolve(0, 0, numRows - 1, numCols - 1);
        resetBtn.style.display = "none";
        startBtn.style.display = "none";
        document.getElementById("victory").style.display = "none";
        document.getElementById("victory").classList.remove("pop-in");
    });

    resetBtn.addEventListener("click", () => {
        visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
        drawMaze();
        resetBtn.style.display = "none";
        startBtn.style.display = "inline-block";
        document.getElementById("victory").style.display = "none";
        document.getElementById("victory").classList.remove("pop-in");
    });

};