document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const scoreXDisplay = document.getElementById('score-x');
    const scoreODisplay = document.getElementById('score-o');
    const playerXCard = document.querySelector('.player-x');
    const playerOCard = document.querySelector('.player-o');

    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let scores = { X: 0, O: 0 };

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        // Simple scale effect on click
        clickedCell.style.transform = 'scale(0.9)';
        setTimeout(() => clickedCell.style.transform = '', 100);
    }

    function handleResultValidation() {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winningLine = winCondition;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerText = `Player ${currentPlayer} Wins!`;
            statusDisplay.style.background = currentPlayer === 'X' ? 'var(--accent-x)' : 'var(--accent-o)';
            statusDisplay.style.color = '#000';
            gameActive = false;
            updateScore(currentPlayer);
            highlightWinner(winningLine);
            return;
        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            statusDisplay.innerText = "It's a Draw!";
            statusDisplay.style.background = 'var(--glass-bg)';
            gameActive = false;
            return;
        }

        handlePlayerChange();
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerText = `Player ${currentPlayer}'s Turn`;
        updateActivePlayerCard();
    }

    function updateScore(winner) {
        scores[winner]++;
        scoreXDisplay.innerText = scores.X;
        scoreODisplay.innerText = scores.O;
    }

    function highlightWinner(line) {
        line.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    }

    function updateActivePlayerCard() {
        if (currentPlayer === 'X') {
            playerXCard.classList.add('active');
            playerOCard.classList.remove('active');
        } else {
            playerOCard.classList.add('active');
            playerXCard.classList.remove('active');
        }
    }

    function handleRestartGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusDisplay.innerText = "Player X's Turn";
        statusDisplay.style.background = 'var(--glass-bg)';
        statusDisplay.style.color = 'var(--text-color)';
        
        cells.forEach(cell => {
            cell.classList.remove('x', 'o', 'winning-cell');
        });
        
        updateActivePlayerCard();
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', handleRestartGame);

    // Initial active card
    updateActivePlayerCard();
});
