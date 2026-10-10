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

	return {
		getBoard,
		printBoard,
		dropToken,
		isCellEmpty,
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

	const playRound = (row, column) => {
		if (!board.isCellEmpty(row, column)) {
			console.log("Token Already Exists Place Again");
			console.log(`${getActivePlayer().name} Turn`);
			return;
		}

		console.log(` dropping ${getActivePlayer().token} Token`);
		board.dropToken(row, column, getActivePlayer().token);
		switchPlayer();
		printNewRound();
	};

	return { playRound, getActivePlayer };
}
const game = GameController();
