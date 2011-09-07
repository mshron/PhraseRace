function init() {
  var out = {};
  out.timeDefault = 60;
  out.timer = out.timeDefault;
  out.scoreA = 0;
  out.scoreB = 0;
  out.scorePlusDefault = 10;
  out.scoreplus = out.scorePlusDefault;
  out.winsA = 0;
  out.winsB = 0;
  out.ticks = 0;
  out.turn = 'A';
  out.phrases = nouns;
  out.phrase = '';
  out.going = false;
  out.started = false;
  out.drawPlusA = false;
  out.drawPlusB = false;
  out.refreshable = false;

  shuffle(out.phrases)
  return out
}

//shuffles list in-place
function shuffle(list) {
  var i, j, t;
  for (i = 1; i < list.length; i++) {
    j = Math.floor(Math.random()*(1+i));  // choose j in [0..i]
    if (j != i) {
      t = list[i];                        // swap list[i] and list[j]
      list[i] = list[j];
      list[j] = t;
    }
  }
}


function draw(gs) {
  var timer = document.getElementById('timer'),
      scoreA = document.getElementById('scoreA'),
      scoreB = document.getElementById('scoreB'),
      winsA = document.getElementById('winsA'),
      winsB = document.getElementById('winsB'),
      otherteam = (gs.turn == 'A') ? 'B' : 'A',
      scoreplus = document.getElementById('score' + gs.turn + 'plus'),
      otherplus = document.getElementById('score' + otherteam + 'plus'), 
      phrase = document.getElementById('phrase');

  timer.innerHTML = gs.timer;
  scoreA.innerHTML = gs.scoreA;
  scoreB.innerHTML = gs.scoreB;
  winsA.innerHTML = gs.winsA;
  winsB.innerHTML = gs.winsB;
  scoreplus.innerHTML = gs.scoreplus;
  otherplus.innerHTML = "";

  if (gs.started) phrase.innerHTML = gs.phrase;

 }

function changeover(gs) {
  if (gs.turn == 'A') {
      gs.turn = 'B';
  } else {
      gs.turn = 'A';
  }
  gs.refreshable = true;
}

function declareWinner(gs) {
    gs.going = false; 
    gs.phrase = "Team " + (gs.scoreA > gs.scoreB ? 'A' : 'B') + " +1 win!";
    gs["wins" + gs.turn] += 1
    if (gs["winsA"] >= 7 &&  (gs["winsA"] - gs["winsB"]) > 2) {
      gs.phrase = "VICTORY FOR TEAM A!";
    }
    if (gs["winsB"] >= 7 &&  (gs["winsB"] - gs["winsA"]) > 2) {
      gs.phrase = "VIBTORY FOR TEBM B!";
    }
}

function tick(gs) {
  if (gs.going) {
    if (gs["timer"] == 0) {
        declareWinner(gs);
        return;
    }

    if (gs["ticks"] > 9) {
      gs["scoreplus"] = 5;
    } 
    if (gs["ticks"] > 19) {
      gs["scoreplus"] = 3;
    }
    
    gs["ticks"] += 1;
    gs["timer"] = gs["timer"] - 1
  }
}

function pop(gs) {
  gs.phrase = gs.phrases.pop();
}



function success(gs) {
  gs["score" + gs.turn] = gs["score" + gs.turn] + gs["scoreplus"];
  gs["score" + gs.turn + "plus"] = gs.scorePlusDefault; 
  gs["drawPlus" + gs.turn] = true;
  gs["ticks"] = 0
  changeover(gs);
  pop(gs);
}



function main() {
  var gs = init();
  pop(gs);
  draw(gs);
  window.setInterval(function () {
      tick(gs);
      draw(gs);
      }, 1000);
  $('#control').click(function() { 
      if (gs.going) {
        success(gs);
      } else {
        var c = document.getElementById('control');
        c.innerHTML = 'Next';
        gs.going = true;
        gs.started = true;
      }
  });
  $("#refresh").click(function (){
    if (gs.refreshable)  {
        gs["ticks" + gs.turn] += 5;
        gs["timer" + gs.turn] -= 5;
        pop(gs);
        gs.refreshable = false;
    } 
  });
}
