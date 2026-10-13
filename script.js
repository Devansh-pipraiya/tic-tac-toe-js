// ==========================================
//              CELL
// ==========================================

function Cell() {
	// --- State ---
	let value = " ";

	// --- Methods ---
	const addToken = (player) => {
		value = player;
	};

	const getValue = () => value;

	// --- Public API ---
	return { addToken, getValue };
}

// ==========================================
//              GAMEBOARD
// ==========================================

function Gameboard() {
	// --- State ---
	const rows = 3;
	const columns = 3;
	const board = [];

	// --- Setup ---
	const createBoard = () => {
		for (let i = 0; i < rows; i++) {
			board[i] = [];
			for (let j = 0; j < columns; j++) {
				board[i].push(Cell());
			}
		}
	};
	createBoard();

	// --- Queries ---
	const getBoard = () => board;

	const isCellEmpty = (row, column) => board[row][column].getValue() === " ";

	const isBoardFull = () => board.every((row) => row.every((cell) => cell.getValue() !== " "));

	// --- Debug ---
	const printBoard = () => {
		const boardWithCellValues = board.map((rows) => rows.map((cell) => cell.getValue()));
		console.log(boardWithCellValues);
	};

	// --- Mutations ---
	const dropToken = (row, column, player) => board[row][column].addToken(player);

	// --- Public API ---
	return {
		getBoard,
		printBoard,
		dropToken,
		isCellEmpty,
		isBoardFull,
		createBoard,
	};
}

// ==========================================
//              GAME CONTROLLER
// ==========================================

function GameController() {
	// --- State ---
	const board = Gameboard();
	const players = [
		{
			name: "Player One",
			token: "✖️",
		},
		{
			name: "Player Two",
			token: "⭕",
		},
	];

	let activePlayer = players[0];

	// --- Player Management ---
	const getActivePlayer = () => activePlayer;

	const switchPlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	// --- Reset ---
	const resetGame = () => {
		board.createBoard();
		activePlayer = players[0];
	};

	// --- Debug ---
	const printNewRound = () => {
		board.printBoard();
		console.log(`${getActivePlayer().name} Turn`);
	};
	printNewRound();

	// --- Win Conditions ---
	// Returns "win" if active player has a full row, column, or diagonal; "tie" if board is full
	const checkWinConditions = () => {
		const isToken = (row, column) => board.getBoard()[row][column].getValue();
		const token = getActivePlayer().token;

		const rowAndColumnCheck = () => {
			for (let i = 0; i < 3; i++) {
				const arr = [];
				const arr2 = [];
				for (let j = 0; j < 3; j++) {
					arr.push(isToken(i, j));
					arr2.push(isToken(j, i));
				}
				if (arr.every((value) => value === token) || arr2.every((value) => value === token))
					return true;
			}
		};

		const diagonalCheck = () => {
			return (
				(isToken(0, 0) === token && isToken(1, 1) === token && isToken(2, 2) === token) ||
				(isToken(0, 2) === token && isToken(1, 1) === token && isToken(2, 0) === token)
			);
		};

		if (rowAndColumnCheck() || diagonalCheck()) {
			return "win";
		} else if (board.isBoardFull()) {
			return "tie";
		}
	};

	// --- Game Loop ---
	const playRound = (row, column) => {
		if (!board.isCellEmpty(row, column)) {
			console.log("⚠️ Token Already Exists Place Again ⚠️");
			console.log(`${getActivePlayer().name} Turn`);
			return;
		}

		console.log(` dropping ${getActivePlayer().token} Token`);
		board.dropToken(row, column, getActivePlayer().token);

		switch (checkWinConditions()) {
			case "win":
				console.log(getActivePlayer().name, getActivePlayer().token, "won");
				return "win";
			case "tie":
				console.log("its a tie");
				return "tie";
			default:
				switchPlayer();
				printNewRound();
				return "continue";
		}
	};

	// --- Public API ---
	return { playRound, getActivePlayer, getBoard: board.getBoard, resetGame };
}

// ==========================================
//              DISPLAY CONTROLLER
// ==========================================

function DisplayController() {
	// --- State ---
	const game = GameController();
	const playerTurnElem = document.querySelector(".playerTurn");
	const headingElem = document.querySelector(".heading");
	const boardDiv = document.querySelector(".board");
	let gameStatus;

	// --- Helpers ---
	const setHeadingText = (text, animate = false) => {
		headingElem.textContent = text;
		if (animate) {
			headingElem.classList.remove("typewriter");
			void headingElem.offsetWidth; // Trigger reflow so animation restarts reliably
			headingElem.classList.add("typewriter");
		}
	};

	// --- Round Reset ---
	const resetScreen = () => {
		const playAgainBtn = document.createElement("button");
		playAgainBtn.classList.add("play-again-btn");
		playAgainBtn.textContent = "Play Again";
		playerTurnElem.replaceWith(playAgainBtn);
		playAgainBtn.addEventListener("click", () => {
			gameStatus = "continue";
			playAgainBtn.replaceWith(playerTurnElem);
			setHeadingText("Tic Tac Toe", true);
			updateScreen();
		});
	};

	// --- Rendering ---
	const renderBoard = () => {
		const board = game.getBoard();
		boardDiv.textContent = "";
		board.forEach((row, rowIndex) => {
			row.forEach((cell, cellIndex) => {
				const cellBtn = document.createElement("button");
				cellBtn.classList.add("cell");
				cellBtn.dataset.row = rowIndex;
				cellBtn.dataset.column = cellIndex;
				cellBtn.textContent = cell.getValue();
				boardDiv.appendChild(cellBtn);
			});
		});
	};

	const updateScreen = () => {
		const activePlayer = game.getActivePlayer();
		playerTurnElem.textContent = `${activePlayer.name} (${activePlayer.token}) Turn`;
		renderBoard();
		if (gameStatus === "win") {
			setHeadingText(`${activePlayer.name} ${activePlayer.token} Won!`, true);
			game.resetGame();
			resetScreen();
		}
		if (gameStatus === "tie") {
			setHeadingText(`ITS A TIE`, true);
			game.resetGame();
			resetScreen();
		}
	};

	// --- Event Listeners ---
	boardDiv.addEventListener("click", (e) => {
		if (gameStatus === "win" || gameStatus === "tie") return;
		const cellRow = e.target.dataset.row;
		const cellColumn = e.target.dataset.column;
		if (cellRow === undefined || cellColumn === undefined) return;
		gameStatus = game.playRound(cellRow, cellColumn);
		updateScreen();
	});

	// --- Init ---
	setHeadingText("Tic Tac Toe", true);
	updateScreen();
}

// ==========================================
//              INIT
// ==========================================

DisplayController();
