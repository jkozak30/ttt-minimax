var turn = 0;
var g;
var x = 0;

class Game {
  constructor() {
    this.board = [];
    for (var i=0; i<3; i++) {
      let temp = [];
      temp.push(" ");
      temp.push(" ");
      temp.push(" ");
      this.board.push(temp);
    }
  }

  str() {
    var ret = "";
    for (var i=0; i<3; i++) {
      ret += "|";
      for (var j=0; j<3; j++) {
        ret += this.board[i][j] + "|";
      }
      ret += "\n";
    }
    return ret;
  }

  move(id, r, c) {
    if (id == 1) {this.board[r][c] = "x";}
    else {this.board[r][c] = "o"; }
  }

  remove(r, c) {
    this.board[r][c] = " ";
  }

  canMove() {
    var ctr = 0;
    for (var i=0; i<3; i++) {
      for (var j=0; j<3; j++) {
        if (this.board[i][j] === " ") {ctr++;}
      }
    }
    return ctr > 0;
  }

  canMoveHere(r, c) {
    return this.board[r][c] === " ";
  }

  // 0 none, 1 p1x, -1 p2o
  win() {
    for (var i=0; i<3; i++) {
      if (this.board[i][0] === this.board[i][1] && this.board[i][2] === this.board[i][1]) {
        if (this.board[i][0] === "x") return 1;
        else if (this.board[i][0] === "o") return -1;
      }
      if (this.board[0][i] === this.board[1][i] && this.board[2][i] === this.board[1][i]) {
        if (this.board[0][i] === "x") return 1;
        else if (this.board[0][i] === "o") return -1;
      }
    }
    if (this.board[0][0] === this.board[1][1] && this.board[2][2] === this.board[1][1]) {
      if (this.board[0][0] === "x") return 1;
      else if (this.board[0][0] === "o") return -1;
    }
    if (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
      if (this.board[0][2] === "x") return 1;
      else if (this.board[0][2] === "o") return -1;
    }
    return 0;
  }

  minimax(max) {
    //console.log(this.str());
    if (this.win() == 1) return 1;
    if (this.win() == -1) return -1;
    if (!this.canMove()) return 0;
    else {
      if (max) {
        //console.log("here" + x);
        x++;
        let score = -1;
        for (var i=0; i<3; i++) {
          for (var j=0; j<3; j++) {
            if (this.canMoveHere(i, j)) {
              this.move(1, i, j);
              score = Math.max(score, this.minimax(false));
              this.remove(i, j);
            }
          }
        }
        return score;
      } else {
        let score = 1;
        for (var i=0; i<3; i++) {
          for (var j=0; j<3; j++) {
            if (this.canMoveHere(i, j)) {
              this.move(2, i, j);
              score = Math.min(score, this.minimax(true));
              this.remove(i, j);
            }
          }
        }
        return score;
      }


    }
  }

  bestMove(id) {
    if (id == 1) {
      var br = -1;
      var bc = -1;
      var opt = -1;
      for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
          if (this.canMoveHere(i, j)) {
            this.move(id, i, j);
            let temp = this.minimax(false);
            this.remove(i, j);
            if (temp >= opt) {
              br = i;
              bc = j;
              opt = temp;
            }
          }
        }
      }
      this.move(id, br, bc);
    } else {
      var br = -1;
      var bc = -1;
      var opt = 1;
      for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
          if (this.canMoveHere(i, j)) {
            this.move(id, i, j);
            let temp = minimax(true);
            this.remove(i, j);
            if (temp <= opt) {
              br = i;
              bc = j;
              opt = temp;
            }
          }
        }
      }
      this.move(id, br, bc);
    }
  }




};

function setup() {
  g = new Game();
  createCanvas(450, 450);
  console.log(g.str());
  //g.move(1, 2, 2);
  //console.log(g.str());
  //console.log(g.win());
}

function draw() {
  background(230, 250, 230);
  strokeWeight(5);
  stroke(0);
  line(150, 20, 150, 430);
  line(300, 20, 300, 430);
  line(20, 150, 430, 150);
  line(20, 300, 430, 300);
  place(1, mouseX, mouseY);
  for (var i=0; i<3; i++) {
    for (var j=0; j<3; j++) {
      if (g.board[i][j] === "x") {stroke(0); line(j*150+50, i*150+50, j*150+100, i*150+100);
        line(j*150+50, i*150+100, j*150+100, i*150+50); /*console.log(g.win());*/}
      if (g.board[i][j] === "o") {stroke(0); ellipse(j*150+75, i*150+75, 50, 50); /*console.log(g.win());*/}
    }
  }
  if (mouseX > 0 && mouseX < 450 && mouseY > 0 && mouseY < 450) {hover(1, mouseX, mouseY); hover(2, mouseX, mouseY);}
  /*while (g.win() == 0 && g.canMove()) {

  }*/
}

function mousePressed() {
  //if (turn == 0) {place(1, mouseX, mouseY); }
  if (turn == 1) {place(2, mouseX, mouseY); }
}

function hover(id, x, y) {
  var r = floor(y / 150);
  var c = floor(x / 150);
  if (g.win() == 0 && g.canMoveHere(r, c) && turn == 1 && id == 2) { stroke(150); noFill(); ellipse(c*150+75, r*150+75, 50, 50); return true; }
  if (g.win() == 0 && g.canMoveHere(r, c) && turn == 0 && id == 1) { stroke(150); line(c*150+50, r*150+50, c*150+100, r*150+100);
    line(c*150+50, r*150+100, c*150+100, r*150+50); return true; }
  return false;
}

function place(id, x, y) {
  var r = floor(y / 150);
  var c = floor(x / 150);
  if (turn == 0 && id == 1 /*&& hover(id, x, y)*/) {g.bestMove(id); turn = 1;}
  if (turn == 1 && id == 2 && hover(id, x, y)) {console.log("cons");g.board[r][c] = "o"; turn = 0;}
}
