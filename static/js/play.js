/*
	js functions to move the blank tile around
*/

var blank_pos = $(blank).attr('data-pos');
var blank_row = parseInt(blank_pos.split(',')[0]);;
var blank_col = parseInt(blank_pos.split(',')[1]);;
var cellDisplacement = "200px";

$(".start .cell").click(move_tile);

function move_tile()
{
	// Gets the position of the current element
	var pos = $(this).attr('data-pos');
	var posRow = parseInt(pos.split(',')[0]);
	var posCol = parseInt(pos.split(',')[1]);

	// Move Up
	if (posRow + 1 == blank_row && posCol == blank_col)
	{
		$(this).animate({
		'top' : "+=" + cellDisplacement //moves up
		});

		$('#blank').animate({
		'top' : "-=" + cellDisplacement //moves down
		});

		blank_row -= 1;
		$(this).attr('data-pos',(posRow+1) + "," + posCol);
	}

	// Move Down
	if (posRow - 1 == blank_row && posCol == blank_col)
	{
		$(this).animate({
		'top' : "-=" + cellDisplacement //moves down
		});

		$('#blank').animate({
		'top' : "+=" + cellDisplacement //moves up
		});

		blank_row += 1;
		$(this).attr('data-pos', (posRow-1) + "," + posCol);
	}

	// Move Left
	if (posRow == blank_row && posCol + 1 == blank_col)
	{
		$(this).animate({
		'right' : "-=" + cellDisplacement //moves right
		});

		$('#blank').animate({
		'right' : "+=" + cellDisplacement //moves left
		});

		blank_col -= 1;
		$(this).attr('data-pos', posRow + "," + (posCol+1));
	}

	// Move Right
	if (posRow == blank_row && posCol - 1 == blank_col)
	{
		$(this).animate({
		'right' : "+=" + cellDisplacement //moves left
		});

		$('#blank').animate({
		'right' : "-=" + cellDisplacement //moves right
		});

		blank_col += 1;
		$(this).attr('data-pos', posRow + "," + (posCol-1));
	}

	// Update empty position
	$('#blank').attr('data-pos', blank_row + "," + blank_col);
}


// swap the requested element in an array
function swap(arr, r1, c1, r2, c2) {
  var tmp = arr[r1][c1];
  arr[r1][c1] = arr[r2][c2];
  arr[r2][c2] = tmp;
}

//automatically solve the puzzle
function move_blank(move, puzzle) {
	//move left
	if (move == 'L') {
		var pos_row = blank_row, pos_col = blank_col - 1;
		var tile_id = puzzle[pos_row][pos_col];
		swap(puzzle, blank_row, blank_col, pos_row, pos_col);
		$('#' + tile_id.toString()).animate({
		'right' : "-=" + cellDisplacement //moves right
		}, 'slow');

		$('#blank').animate({
		'right' : "+=" + cellDisplacement //moves left
		}, 'slow');

		blank_col -= 1;
		$(tile_id).attr('data-pos', pos_row + "," + (pos_col+1));
	}
	//move right
	if (move == 'R') {
		var pos_row = blank_row, pos_col = blank_col + 1;
		var tile_id = puzzle[pos_row][pos_col];
		swap(puzzle, blank_row, blank_col, pos_row, pos_col);
		$('#' + tile_id.toString()).animate({
		'right' : "+=" + cellDisplacement //moves left
		}, 'slow');

		$('#blank').animate({
		'right' : "-=" + cellDisplacement //moves right
		}, 'slow');

		blank_col += 1;
		$('#' + tile_id.toString()).attr('data-pos', pos_row + "," + (pos_col-1));
	}
	//move down
	if (move == 'D') {
		var pos_row = blank_row + 1, pos_col = blank_col;
		var tile_id = puzzle[pos_row][pos_col];
		swap(puzzle, blank_row, blank_col, pos_row, pos_col);
		$('#' + tile_id.toString()).animate({
		'top' : "-=" + cellDisplacement //moves down
		}, 'slow');

		$('#blank').animate({
		'top' : "+=" + cellDisplacement //moves up
		}, 'slow');

		blank_row += 1;
		$('#' + tile_id.toString()).attr('data-pos', (pos_row - 1) + "," + pos_col);
	}
	//move up
	if (move == 'U') {
		var pos_row = blank_row - 1, pos_col = blank_col;
		var tile_id = puzzle[pos_row][pos_col];
		swap(puzzle, blank_row, blank_col, pos_row, pos_col);
		$('#' + tile_id.toString()).animate({
		'top' : "+=" + cellDisplacement //moves up
		}, 'slow');

		$('#blank').animate({
		'top' : "-=" + cellDisplacement //moves down
		}, 'slow');

		blank_row -= 1;
		$('#' + tile_id.toString()).attr('data-pos',(pos_row + 1) + "," + pos_col);
	}
	// Update empty position
	$('#blank').attr('data-pos', blank_row + "," + blank_col);
}

$("#cheat").click(cheat);

function cheat() {
	var puzzle = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	for (var i = 1; i < 10; i++) {
		if (i == 3)
			continue;
		var pos = $('#' + i.toString()).attr('data-pos');
		var row = parseInt(pos.split(',')[0]);
		var col = parseInt(pos.split(',')[1]);
		puzzle[row][col] = i;
	}
	puzzle[blank_row][blank_col] = 3;
	var answer_path = solve(puzzle);
	//console.log(answer_path);
	my_loop(answer_path, puzzle);
}

var i = 0;

function my_loop (answer_path, puzzle) {
   setTimeout(function () {
	    move_blank(answer_path[i], puzzle);
	    i++;
	    if (i < answer_path.length) {
	       my_loop(answer_path, puzzle);
	    }
   }, 330)
}
