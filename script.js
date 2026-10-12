function Gameboard() {
	const rows = 3;
	const columns = 3;
	const board = [];

	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < columns; j++) {
			board[i].push(Cell());
		}
	}

	const getBoard = () => board;

	const printBoard = () => {
		const boardWithCellValues = board.map((rows) => rows.map((cell) => cell.getValue()));
		console.log(boardWithCellValues);
	};

	const isCellEmpty = (row, column) => board[row][column].getValue() === " ";

	const dropToken = (row, column, player) => board[row][column].addToken(player);

	const isBoardFull = () => board.every((row) => row.every((cell) => cell.getValue() !== " "));

	return {
		getBoard,
		printBoard,
		dropToken,
		isCellEmpty,
		isBoardFull,
	};
}

function Cell() {
	let value = " ";

	const addToken = (player) => {
		value = player;
	};

	const getValue = () => value;

	return { addToken, getValue };
}

function GameController() {
	const board = Gameboard();
	// console.log(board.getBoard());
	// board.printBoard();

	const players = [
		{
			name: "PlayerOne",
			token: "X",
		},
		{
			name: "PlayerTwo",
			token: "O",
		},
	];

	let activePlayer = players[0];

	const getActivePlayer = () => activePlayer;

	const switchPlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const printNewRound = () => {
		board.printBoard();
		console.log(`${getActivePlayer().name} Turn`);
	};
	printNewRound();

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
				arr.length = 0;
				arr2.length = 0;
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
				return;
			case "tie":
				console.log("its a tie");
				return;
		}
		switchPlayer();
		printNewRound();
	};

	return { playRound, getActivePlayer };
}
const game = GameController();
game.playRound(0, 0);
game.playRound(1, 1);
game.playRound(1, 0);
game.playRound(1, 2);
game.playRound(2, 0);
