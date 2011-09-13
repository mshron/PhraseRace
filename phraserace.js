function init() {
  var out = {};
  out.timeDefault = 60;
  out.timerA = out.timeDefault;
  out.timerB = out.timeDefault;
  out.winsA = 0;
  out.winsB = 0;
  out.turn = 'A';
  out.phrases = nouns;
  out.phrase = '';
  out.going = false;
  out.started = false;
  out.won = false;
  out.hitreset = false;
  out.paused = false;

  out.lowtick = new Audio("beep-7.mp3");
  out.hightick = new Audio("beep-8.mp3");
  out.buzzer = new Audio("Buzzer1-JD.wav");

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
  var timerA = document.getElementById('timerA'),
      timerB = document.getElementById('timerB'),
      winsA = document.getElementById('winsA'),
      winsB = document.getElementById('winsB'),
      round = document.getElementById('round');
      phrase = document.getElementById('phrase');

  timerA.innerHTML = gs.timerA;
  timerB.innerHTML = gs.timerB;
  winsA.innerHTML = gs.winsA;
  winsB.innerHTML = gs.winsB;
  round.innerHTML = gs.winsA + gs.winsB;

  if (gs.started) phrase.innerHTML = gs.phrase;

  

 }

function changeover(gs) {
  if (gs.turn == 'A') {
      gs.turn = 'B';
  } else {
      gs.turn = 'A';
  }
}

function declareWinner(gs) {
    gs.going = false; 
    if (gs["timerB"] <= 0) {
      gs.phrase = "ROUND FOR TEAM A!";
      gs.turn = 'A';
      gs.winsA += 1;
    }
    if (gs["timerA"] <= 0) {
      gs.phrase = "ROUND FOR TEAM B!";
      gs.turn = 'B';
      gs.winsB += 1;
    }
    if (gs.winsB >= 3 && gs.winsB - gs.winsA > 1) {
      gs.phrase = "VICTORY FOR TEAM B!";
      gs.won = true;
    }
    if (gs.winsA >= 3 && gs.winsA - gs.winsB > 1) {
      gs.phrase = "VICTORY FOR TEAM A!";
      gs.won = false;
    }


    var control = document.getElementById('control');
    control.innerHTML = 'Next round';
}

function tick(gs) {
  if (gs.going) {
    if (gs["timerA"] <= 0 || gs["timerB"] <= 0) {
        gs.buzzer.play();
        declareWinner(gs);
        return;
    }

    if (gs["timer" + gs.turn] > 10) {
      gs.lowtick.play()
    } else {
      gs.hightick.play()
    }
    gs["timer" + gs.turn] = gs["timer" + gs.turn] - 1;
  }
}

function pop(gs) {
  gs.phrase = gs.phrases.pop();
}



function success(gs) {
    //gs["timer" + gs.turn] += 2;
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
      if (gs.won) {
        gs.going = false;
        gs.started = false;
        var control = document.getElementById('control');
        control.innerHTML = 'New Game'
      }
      }, 1000);
  $('#control').click(function() { 
      if (!gs.started) {
        gs = init();
      }
      if (gs.going && !gs.paused) {
        success(gs);
      } else if (gs.paused) {
        return;
      } else {
        var c = document.getElementById('control');
        c.innerHTML = 'Got it!';
        gs.going = true;
        gs.started = true;
        pop(gs); 
        gs.timerA = gs.timeDefault;
        gs.timerB = gs.timeDefault;
      }
  });
  $("#refresh").click(function (){
    if (gs.going && gs["timer" + gs.turn] > 5)  {
        gs["timer" + gs.turn] -= 5;
        pop(gs);
    } else if (gs.going) {
       gs["timer" + gs.turn] = 0;
    }
  });

  $("#reset").dblclick(function () {
    if (!gs.going) {
      gs = init();
      var control = document.getElementById('control');
      control.innerHTML = 'New Game'
    }
  });

  $("#pause").click(function () {
    if (gs.going) {
      gs.paused = true;
      gs.going = false;
    } else {
      gs.paused = false;
      gs.going = true;
    }
  });
}
