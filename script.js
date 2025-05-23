const labirinto = [
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

const numLinha = labirinto.length;
const numColunas = labirinto[0].length;
let visitado = [];

function desenharLabirinto(botPosicao = null) {
    const labirintoDiv = document.getElementById("labirinto");
    labirintoDiv.innerHTML = "";
    const table = document.createElement("table");

    for (let i = 0; i < numLinha; i++) {
        
        const linha = document.createElement("tr");
        
        for (let j = 0; j < numColunas; j++) {
        
            const celula = document.createElement("td");

            if (botPosicao && botPosicao[0] === i && botPosicao[1] === j) {
                celula.className = "bot";
            } else if (visitado[i][j]) {
                celula.className = "visitado";
            } else if (labirinto[i][j] === 1) {
                celula.className = "parede";
            } else if (i === numLinha - 1 && j === numColunas - 1) {
                celula.className = "fim";
            } else {
                celula.className = "caminho";
            }

            linha.appendChild(celula);
        }

        table.appendChild(linha);
    }

    labirintoDiv.appendChild(table);
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
    if (x < 0 || y < 0 || x >= numLinha || y >= numColunas) return false;
    if (labirinto[x][y] === 1 || visitado[x][y]) return false;

    visitado[x][y] = true;
    desenharLabirinto([x, y]);
    await sleep(150);

    if (x === endX && y === endY) {
        document.getElementById("butaoReset").style.display = "inline-block";

        const sobreporVitoria = document.getElementById("vitoria");
        sobreporVitoria.style.display = "block";
        sobreporVitoria.classList.remove("pop-in");
        sobreporVitoria.classList.add("pop-in");

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

    desenharLabirinto([x, y]);
    await sleep(100);
    return false;
}

window.onload = () => {

    const butaoJogar = document.getElementById("butaoJogar");
    const butaoReset = document.getElementById("butaoReset");

    butaoJogar.addEventListener("click", () => {
        visitado = Array.from({ length: numLinha }, () => Array(numColunas).fill(false));
        desenharLabirinto();
        backtrackSolve(0, 0, numLinha - 1, numColunas - 1);
        butaoReset.style.display = "none";
        butaoJogar.style.display = "none";
        document.getElementById("vitoria").style.display = "none";
        document.getElementById("vitoria").classList.remove("pop-in");
    });

    butaoReset.addEventListener("click", () => {
        visitado = Array.from({ length: numLinha }, () => Array(numColunas).fill(false));
        desenharLabirinto();
        butaoReset.style.display = "none";
        butaoJogar.style.display = "inline-block";
        document.getElementById("vitoria").style.display = "none";
        document.getElementById("vitoria").classList.remove("pop-in");
    });

};