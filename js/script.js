$(function () {
  $(document).on("dbClick", function (event) {
    event.preventDefault();
  });
  $(document).on("contextmenu", function (event) {
    event.preventDefault();
  });
});

var score = 0;
var color = "blue";
var runGame;
var currentPlayer;

const smashSound = new Audio();
smashSound.src = "sounds/crash.mp4";

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function dropBox() {
  var length = random(100, $(".game").width() - 100);
  var velocity = random(1000, 10000);
  var size = random(50, 150);
  var thisBox = $("<div/>", {
    class: "box",
    style: "width:" + size + "px; height:" + size + "px; left:" + length + "px; transition: transform " + velocity + "ms linear;",
  });
  thisBox.css({ background: "url('imgs/fat.png')", "background-size": "contain", "background-repeat": "no-repeat" });

  //insert gift element
  $(".game").append(thisBox);

  //random start for animation
  setTimeout(function () {
    thisBox.addClass("move");
  }, random(0, 5000));

  //remove this object when animation is over
  thisBox.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function (event) {
    $(this).remove();
  });
}

$(document).on("click", ".glove", function () {
  $(this).addClass("clicked");
  if ($(".clicked").length == 2) {
    boomEffect();
  }
});

function boomEffect() {
  $("#rightGlove").css({ left: "50%" }, 300);
  $("#leftGlove").css({ right: "50%" }, 300);
  setTimeout(function () {
    smashAll();
    $("#rightGlove").css({ transform: "scale(1)", left: "calc(100% - 100px)" }, 300);
    $("#leftGlove").css({ transform: "scale(1)", right: "calc(100% - 100px)" }, 300);
    $(".clicked").removeClass("clicked");
  }, 500);
}

function smashAll() {
  smashSound.play();
  $(".move").addClass("smashed");
  $(".move").css("backgroundImage", "url('imgs/crashing-fats.gif')");
  $(".move").fadeOut(1000);
  score += $(".move").length;
  $(".points").html((score < 10 ? "0" : "") + String(score));
}

function countdown() {
  var seconds = 15;
  function tick() {
    var counter = document.getElementById("counter");
    seconds--;
    counter.innerHTML = (seconds < 10 ? "0" : "") + String(seconds);
    if (seconds > 0) {
      setTimeout(tick, 1000);
    } else {
      $(".final-score").html(score);
      $(".game").hide();
      $(".result").show();
      clearInterval(runGame);
      currentPlayer.score = score;
      saveToFirebase(currentPlayer);
    }
  }
  tick();
}

$(".reset").click(resetGame);
function resetGame() {
  score = 0;
  $(".reset").css({
    zIndex: 10,
  });
  $(".clicked").removeClass("clicked");
  $(".points").html("00");
  $(".box").remove();
  $(".result").hide();
  $(".home").show();
}

$("#playButton").click(function (eInfo) {
  eInfo.preventDefault();
  currentPlayer = registerPlayer();
  if (currentPlayer) {
    startGame();
  }
});

function startGame() {
  $(".home").hide();
  $(".game").show();
  for (i = 0; i < 10; i++) {
    dropBox();
  }
  runGame = setInterval(function () {
    for (i = 0; i < 10; i++) {
      dropBox();
    }
  }, 5000);
  countdown();
}
