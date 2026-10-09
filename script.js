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

	return {
		getBoard,
		printBoard,
	};
}

function Cell() {
	value = " ";

	const addToken = (player) => {
		value = player;
	};

	const getValue = () => value;

	return { addToken, getValue };
}

function GameController() {
	const board = Gameboard();
	console.log(board.getBoard());
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
}
GameController();
