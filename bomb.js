console.log("javascript running");

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded");
});

console.log(document.getElementById("bomb_time"));

/* TIMER FUNCTIONS AND STUFF */
var set_time = 1000 * 30; // in milliseconds
var start_time = set_time;
var intvl=1;

var time_display = document.getElementById("bomb_time");

wire_set = initialize_wires();
safewires = randomize_wires();

bombTimer = setInterval(countdown, intvl);
bombTimeout = setTimeout(explode_state, start_time);

function countdown() {
  document.getElementById("bomb_time").textContent = start_time-=intvl;
}

/* WIRE FUNCTIONS AND STUFF */

function initialize_wires() {
  var wire_set = document.getElementsByClassName("wire");
  for (var i=0; i<wire_set.length; i++) {
    wire_set[i].addEventListener("click", cut_wire);
  }
  return wire_set;
}

function randomize_wires() {
  var coinflip;
  var safe = 0; // count number of safe wires;
  for (var i=0; i<wire_set.length; i++) {
    coinflip = Math.round(Math.random());
    wire_set[i].setAttribute("explode", coinflip);
    if (coinflip == 0){
      safe += 1;
    }
  }
  // at least one wire should be safe
  // at least one wire should explode the bomb
  if (safe == 0) { // if there are no safe wires
    // add a random safe wire
    wire_set[Math.round(Math.random()*wire_set.length)].setAttribute("explode", 0);
    safe += 1;
  } else if (safe == wire_set.length) { // if all wires are safe
    // remove a random safe wire
    wire_set[Math.round(Math.random()*wire_set.length)].setAttribute("explode", 1);
    safe -= 1;
  }
  return safe;
}

function cut_wire() {
  // change image from uncut to cut
  this.src = "img/cut-" + this.id + "-wire.png";
  
  // check for explode attribute
  if (this.getAttribute("explode") == "1") {
    clearInterval(bombTimer);
    clearTimeout(bombTimeout);
    setTimeout(explode_state, 1000);
  } else { // didn't explode yet? keep goin' on
    safewires -= 1;
  }
  // are there any safe wires left?
  if (safewires == 0) {
    clearInterval(bombTimer);
    clearTimeout(bombTimeout);
    setTimeout(safe_state, 1000);
  }
}

/* STATE FUNCTIONS AND STUFF */
function explode_state() {
  clearInterval(bombTimer);
  clearTimeout(bombTimeout);
  document.getElementById("restart").disabled = false;
  document.body.className = "exploded";
  document.getElementById("explosion").play();
}

function safe_state() {
  clearInterval(bombTimer);
  clearTimeout(bombTimeout);
  document.getElementById("restart").disabled = false;
  document.getElementById("cheer").play();
}

function resetgame() {
  document.body.className = "unexploded";
  for (var i=0; i<wire_set.length; i++) {
    wire_set[i].src = "img/uncut-" + wire_set[i].id + "-wire.png";
  }
  wire_set = initialize_wires();
  safewires = randomize_wires();
  start_time = set_time;
  bombTimer = setInterval(countdown, intvl);
  bombTimeout = setTimeout(explode_state, start_time);
}
