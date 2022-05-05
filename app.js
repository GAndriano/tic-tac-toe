

const gameBoard = (() => {
    let board = ["","","", "","","", "", "", ""];
    
    //allows to add to board
    const setBoard = (index,turn) => {
        if (index > board.length) return; 
        board[index] = turn;    
    };
    
    //returns contents of board
    const getBoard = (index) => {
        if (index > board.length) return;
        return board[index];
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };
    return {setBoard, getBoard, resetBoard}
})();

//creates players
const Player = (turn) => {
    this.turn = turn;
    const getTurn = () => {
        return turn
    };
    return {getTurn}
};

const displayController = (() => {
    const tiles = document.querySelectorAll(".tile")
    const turnAlert = document.getElementById("alert")
    const refreshButton = document.querySelector(".refresh")
    const turnText = document.getElementById("turn")

    //assigns data value to index, setting the board, adding color
    tiles.forEach((tile) => {
        tile.addEventListener("click", (e) => {
            if (gameController.getIsOver()|| e.target.textContent !== "") return;
            gameController.playTurn(parseInt(e.target.dataset.index))
            screenUpdater()
            if (tile.textContent === "O") {
                tile.style.color = "#ef4444"
            } else if (tile.textContent === "X") {
                tile.style.color = "black"
            }
        })
    });

    //sets the text to the content of array
    const screenUpdater = () => {
        for (let i = 0; i < tiles.length; i++) {
           tiles[i].textContent = gameBoard.getBoard(i) 
        } 
    };

    //refreshes game and screen
    refreshButton.addEventListener("click",() => {
            if (gameController.getIsOver() == true) {
                alertTurn("O")
            }
            alertTurn("O")
            gameBoard.resetBoard()
            gameController.reset()
            screenUpdater()
    });
    
    //updates turn messages and wins/draws
    const alertTurn = (turn) => {
        if (turn === "X") {
            turnText.textContent = "Turn: "
            turnAlert.textContent = "O"
            turnAlert.style.fontWeight = "bolder"
            turnAlert.style.color = "#ef4444"
        } else if (turn === "O") {
            turnText.textContent = "Turn: "
            turnAlert.textContent = "X"
            turnAlert.style.fontWeight = "bolder"
            turnAlert.style.color = "black"
        } else {
            turnText.textContent = turn
            turnAlert.textContent = ""
        }
    };

    //sets outcome messages
    const setResultMsg = (winner) => {
        if (winner === "draw") {
            alertTurn("It's a draw!");
        } else if (winner === "X") {
            let winner = "1"
            alertTurn(`Player ${winner} wins!`)
        } else if (winner === "O") {
            let winner = "2"
            alertTurn(`Player ${winner} wins!`)
        } else return;
    };

    return {setResultMsg, alertTurn}

})();



const gameController = (() => {
    const playerOne = Player("X");
    const playerTwo = Player("O");
    let round = 1
    let isOver = false

    //finds current round
    const currentTurn = () => {
        return round % 2 === 1 ? playerOne.getTurn() : playerTwo.getTurn();
    };

    //sets the array with index and player turn, checks for win conditions/draw, increments round
    const playTurn = (tileIndex) => {
        gameBoard.setBoard(tileIndex, currentTurn());
        if (checkWinner(tileIndex)) {
            displayController.setResultMsg(currentTurn())
            isOver = true;
            return;
        }
        if (round === 9) {
            displayController.setResultMsg("draw")
            isOver = true;
            return;
        }
        displayController.alertTurn(currentTurn())
        round++;
    };
    
    //win conditions
    const checkWinner = (tileIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        
        return winConditions
         .filter((combination) => combination.includes(tileIndex))
         .some((possibleCombination) =>
             possibleCombination.every(
                (index) => gameBoard.getBoard(index) === currentTurn()
            )
        );
    };
   
    const getIsOver = () => {
        return isOver;
    };

    const reset = () => {
        round = 1;
        isOver = false;
    };

    return { playTurn, getIsOver, reset, currentTurn}
})();

