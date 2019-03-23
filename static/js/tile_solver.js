/*
A* algorithm to solve tile puzzles
Author: Yao Li
Date: Dec 30, 2018; On the Air from NYC to Beijing via Tokyo
*/


/* a class to represent the state
   where cost is int, path is an array of char, board is a 2d array
   str_board is an unrolled string representation of board
*/
function State(cost, path, board) {
  this.cost = cost;
  this.path = path;
  this.board = board;
  this.str_board = convert_str(board);
  /*
  //convert the 2d array to string
  var dim = board.length;
  for (var i = 0; i < dim; i++) {
    for (var j = 0; j < dim; j++)
      this.str_board += board[i][j] + ',';
  }
  */
};

function convert_str(board) {
  var str_board = '';
  var dim = board.length;
  for (var i = 0; i < dim; i++) {
    for (var j = 0; j < dim; j++)
      str_board += board[i][j] + ',';
  }

  return str_board;
}

/*
A* algorithm to solve the tile puzzle
basically an improvement from bfs => dijkstra => A*
*/
function a_star(puzzle) {
  //check if the inital puzzle is the goal state
  if (check_goal(puzzle.board))
    return puzzle;
  //set to store all the visited states
  var visited = new HashSet();
  //priority queue to find the most promising node to explore
  var fringe = new PriorityQueue({comparator: function(a, b) {
                                                if (a.cost > b.cost)
                                                  return 1;
                                                if (a.cost < b.cost)
                                                  return -1;
                                                return 0;
                                              }});
  fringe.queue(puzzle);
  visited.add(puzzle.str_board);
  while (fringe.length > 0) {
    //pop the most promising state
    var cur_state = fringe.dequeue();
    //check if it is the goal state
    if (check_goal(cur_state.board))
      return cur_state;
    //explore every branches
    var branches = slide(cur_state, visited);
    for (var i = 0; i < branches.length; i++) {
      var b = branches[i];
      visited.add(b.str_board);
      fringe.queue(b);
    }
  }
  //cannot find the goal state
  return;
}

/*
 here we only use manhattan distance as the heuristic
 board is a 2D array
*/
function h_manh(board) {
  var cost = 0;
  var dim = board.length;
  //check each block
  for (var i = 0; i < dim; i++)
    for (var j = 0; j < dim; j++) {
      var cur_val = board[i][j];
      //update the cost
      if (cur_val != i*dim + j + 1) {
        var row = Math.floor((cur_val - 1) / dim);
        var col = Math.floor((cur_val - 1) % dim);
        cost += Math.abs(i - row) + Math.abs(j - col);
      }
    }

  return cost;
}

// check if the goal state is reached
function check_goal(board) {
  var dim = board.length;
  for (var i = 0; i < dim; i++)
    for (var j = 0; j < dim; j++) {
      if (board[i][j] != i*dim + j + 1)
        return false;
    }

  return true;
}

// get the current blank tile position
function get_blank(board) {
  var dim = board.length;
  var blank_val = dim * dim;
  var blank_pos = new Array(2);
  for (var i = 0; i < dim; i++)
    for (var j = 0; j < dim; j++)
      if (board[i][j] == 3) {
        blank_pos[0] = i;
        blank_pos[1] = j;
        break;
      }

  return blank_pos;
}

/*
 get the valid branches
 return a list of new states
*/
function slide(state, visited) {
  var branches = new Array();
  var moves = ['L', 'R', 'D', 'U'];
  var dim = state.board.length;
  var blank_pos = get_blank(state.board);
  var i = blank_pos[0], j = blank_pos[1];
  for (var k = 0; k < moves.length; k++) {
    var m = moves[k];
    var new_board = JSON.parse(JSON.stringify(state.board));
    //move Left
    if (m == 'L' && j > 0)
      swap(new_board, i, j, i, j-1);
    //move right
    if (m == 'R' && j < dim - 1)
      swap(new_board, i, j, i, j+1);
    //move down
    if (m == 'D' && i < dim - 1)
      swap(new_board, i, j, i+1, j);
    //move up
    if (m == 'U' && i > 0)
      swap(new_board, i, j, i-1, j);
    // check if this state is visited
    var new_board_str = convert_str(new_board);
    if (!visited.contains(new_board_str)) {
      var new_path = JSON.parse(JSON.stringify(state.path));
      new_path.push(m);
      var new_cost = new_path.length + h_manh(new_board);
      var new_state = new State(new_cost, new_path, new_board);
      branches.push(new_state);
    }
  }

  return branches;
}

// swap the requested element in an array
function swap(arr, r1, c1, r2, c2) {
  var tmp = arr[r1][c1];
  arr[r1][c1] = arr[r2][c2];
  arr[r2][c2] = tmp;
}

// read the puzzle from txt
function read_puzzle() {

}

// main function?
function solve(puzzle) {
  var init_cost = h_manh(puzzle);
  var init_state = new State(init_cost, [], puzzle);

  var res = a_star(init_state);

  if (res) {
    /*
    console.log(res.path);
    console.log(res.path.length);
    console.log(res.str_board);
    */
    return res.path;
  } else {
    console.log('No answer');
  }

}

//var puzzle = [[16, 5, 1, 3], [2, 10, 6, 4], [9, 7, 11, 8], [13, 14, 15, 12]];
//var puzzle = [[6, 4, 7], [8, 5, 9], [3, 2, 1]];
//var puzzle = [[6, 4, 7], [8, 5, 3], [9, 2, 1]];
//var puzzle = [[1, 3, 9], [4, 2, 5], [7, 8 ,6]];
