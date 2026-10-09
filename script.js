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

	const dropToken = (row, column, player) => {
		board[row][column].addToken(player);
		printBoard();
	};

	return {
		getBoard,
		printBoard,
		dropToken,
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
	board.printBoard();

	const players = [
		{
			name: "PlayerOneName",
			token: "X",
		},
		{
			name: "PlayerTwoName",
			token: "O",
		},
	];

	let activePlayer = players[0];
	const switchPlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const playRound = (row, column) => {
		board.dropToken(row, column, activePlayer.token);
		switchPlayer();
	};

	return { playRound };
}
const game = GameController();
game.playRound(0, 0);
game.playRound(0, 1);
game.playRound(0, 2);
