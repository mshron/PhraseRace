function init() {
  var out = {};
  out.timeDefault = 30;
  out.timerA = out.timeDefault;
  out.timerB = out.timeDefault;
  out.scoreA = 0;
  out.scoreB = 0;
  out.timePlusDefault = 30;
  out.timerAplusDefault = out.timePlusDefault;
  out.timerBplusDefault = out.timePlusDefault;
  out.timerAplus = out.timerAplusDefault;
  out.timerBplus = out.timerBplusDefault;
  out.scorePlusDefault = 16;
  out.scoreAplus = out.scorePlusDefault;
  out.scoreBplus = out.scorePlusDefault;
  out.turnsA = 0;
  out.turnsB = 0;
  out.ticksA = 0;
  out.ticksB = 0;
  out.turn = 'A';
  out.phrases = ["British Parliament", "George W Bush"];
  out.phrase = '';
  out.going = false;
  out.oneTeam = false;
  return out
}

function draw(gs) {
  var timerA = document.getElementById('timerA'),
      timerB = document.getElementById('timerB'),
      scoreA = document.getElementById('scoreA'),
      scoreB = document.getElementById('scoreB'),
      timerAplus = document.getElementById('timerAplus'),
      timerBplus = document.getElementById('timerBplus'),
      scoreAplus = document.getElementById('scoreAplus'),
      scoreBplus = document.getElementById('scoreBplus'),
      phrase = document.getElementById('phrase');

  timerA.innerHTML = gs.timerA;
  timerB.innerHTML = gs.timerB;
  scoreA.innerHTML = gs.scoreA;
  scoreB.innerHTML = gs.scoreB;
  timerAplus.innerHTML = "+" + gs.timerAplus;
  timerBplus.innerHTML = "+" + gs.timerBplus;
  scoreAplus.innerHTML = "+" + gs.scoreAplus;
  scoreBplus.innerHTML = "+" + gs.scoreBplus;

  phrase.innerHTML = gs.phrase
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
    console.log(gs.scoreA > gs.scoreB ? 'A' : 'B');
}

function tick(gs) {
  if (gs.going) {
    if (gs["timer" + gs.turn] == 0) {
      if (gs.oneTeam) {
        declareWinner(gs);
        return;
      } else {
        gs.oneTeam = true;
        var thisTeam = gs.turn,
            otherTeam = thisTeam == 'A' ? 'B' : 'A',
            thisScore = gs["score" + thisTeam],
            otherScore = gs["score" + otherTeam];
        if (thisScore < otherScore) {
           declareWinner(gs);
           return;
        }
        changeover(gs);
      }  
    }

    gs["ticks" + gs.turn] += 1;
    gs["timer" + gs.turn] = gs["timer" + gs.turn] - 1
    if (gs["ticks" + gs.turn] % 10 == 0) {
      gs["score" + gs.turn + "plus"] = Math.max(2,gs["score" + gs.turn + "plus"]/2)
    }
  }
}

function pop(gs) {
  gs.phrase = gs.phrases.pop();
}



function success(gs) {
  gs["score" + gs.turn] = gs["score" + gs.turn] + gs["score" + gs.turn + "plus"];
  if ((gs["timer" + gs.turn == "A" ? "A" : "B"] == 0)
      && (gs["score" + gs.turn] > gs["score" + gs.turn == "A" ? "A" : "B"])) {
    declareWinner(gs);  
  }
  gs["timer" + gs.turn] = gs["timer" + gs.turn] + gs["timer" + gs.turn + "plus"];
  gs["score" + gs.turn + "plus"] = gs.scorePlusDefault; 
  var turns = gs["turns" + gs.turn],
      pd = "timer" + gs.turn + "plusDefault";
  if (turns < 1) {
    gs[pd] = 30;
  } else if (turns < 3) {
    gs[pd] = 15;
  } else {
    gs[pd] = 5;
  }
  gs["timer" + gs.turn + "plus"] = gs["timer" + gs.turn + "plusDefault"];
  gs["ticks" + gs.turn] = 0
  gs["turns" + gs.turn] += 1
  if (!gs.oneTeam) changeover(gs);
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
      }
      });
}
