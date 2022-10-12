const shooter = [
  document.getElementById("shooter_facing_right"),
  document.getElementById("shooter_facing_left"),
];
const tank = [
  document.getElementById("tank_facing_right"),
  document.getElementById("tank_facing_left"),
];
const health_display = [
  document.getElementById("health_bar_1"),
  document.getElementById("health_bar_2"),
];
const move_display = document.getElementById("move_display");
const move_name_display = document.getElementById("move_name_display");
const power_display = document.getElementById("power_display");
const angle_display = document.getElementById("angle_display");
const bomb = document.getElementById("bomb");
const turn_display = document.getElementById("turn_display");
const explosion = document.getElementById("explosion");
var angle = [45, 45];
var dist = [10, 10];
var turn = 0;
var gameplay = 0;
var current_move = [0, 0];
var health = [100, 100];
var move_name = ["Grenade", "Bomb", "Dynamite"];
var power = [50, 50];
var move_count = [5, 5];
var fire_control;
const pi = 3.14159;
var paused = 0;

bombplacement();
health_bar_update();
update_control_bar();

function pxtoVW(px) {
  return px * (100 / document.documentElement.clientWidth);
}

function move_name_change() {
  if (!gameplay) {
    if (current_move[turn] == 2) current_move[turn] = 0;
    else current_move[turn]++;
    move_name_display.innerHTML = move_name[current_move[turn]];
    bombImageSetter();
  }
}

function power_change(increase) {
  power[turn] += increase;
  power_display.innerHTML = "Power: " + power[turn];
}

function angle_change(increase) {
  if (!turn) {
    angle[turn] *= -1;
    angle[turn] -= increase;
    shooter[turn].style.rotate = angle[turn] + "deg";
    angle_display.innerHTML = "Angle: " + -angle[turn];
    angle[turn] *= -1;
  } else {
    angle[turn] += increase;
    shooter[turn].style.rotate = angle[turn] + "deg";
    angle_display.innerHTML = "Angle: " + angle[turn];
  }
}

function damage(x) {
  if (100 - x < dist[turn] + 10 && 100 - x > dist[turn])
    health[1 + turn * -1] -= 20 + current_move[turn] * 10;
  else if (x < dist[turn * -1 + 1] + 10 && x > dist[turn * -1 + 1])
    health[turn] -= 20 + current_move[turn] * 10;
  health_bar_update();
}

function stop_game(isRestart, tanktolose = 0) {
  overlay.style.display = "flex";
  overlay_text.style.display = "block";
  overlay_button.style.display = "block";
  if (isRestart) {
    health = [100, 100];
    overlay_text.innerHTML = "Player " + (tanktolose * -1 + 2) + " Wins";
    overlay_button.innerHTML = "Try Again";
    turn = 0;
    current_move = [0, 0];
    power = [50, 50];
    move_count = [5, 5];
    angle = [45, 45];
    dist = [10, 10];
    bombplacement();
    health_bar_update();
    update_control_bar();
  } else {
    overlay_text.innerHTML = "PAUSED";
    overlay_button.innerHTML = "RESUME";
  }
  window.setTimeout(function () {
    gameplay = 1;
  }, 500);
}
function replay_game() {
  gameplay = 0;
  overlay.style.display = "none";
  overlay_text.style.display = "none";
  overlay_button.style.display = "none";
  paused = 0;
}

function health_bar_update() {
  if (health[0] <= 0) stop_game(1);
  if (health[1] <= 0) stop_game(1, 1);
  health_display[0].style.width = health[0] + "%";
  health_display[1].style.width = health[1] + "%";
}

function explode(x) {
  x = x - pxtoVW(64);
  if (!turn) {
    explosion.style.left = x + "vw";
    explosion.style.right = "";
  } else {
    explosion.style.left = "";
    explosion.style.right = x + "vw";
  }
  explosion.style.display = "block";
  window.setTimeout(function () {
    explosion.style.display = "none";
  }, 2000);
}

function move_animation(direction) {
  gameplay = 1;
  var checker = 0;
  if (turn) direction *= -1;
  var mover = setInterval(function () {
    checker += 0.05;
    if (!turn) tank[turn].style.left = dist[turn] + direction * checker + "vw";
    else tank[turn].style.right = dist[turn] + direction * checker + "vw";
    if (checker >= 2) {
      clearInterval(mover);
      dist[turn] += 2 * direction;
      bombplacement();
      gameplay = 0;
    }
  }, 10);
  move_count[turn]--;
  move_display.innerHTML = "Moves:" + move_count[turn];
  update_control_bar();
}
function update_control_bar() {
  turn_display.innerHTML = "Player " + (turn + 1) + "'s Turn";
  move_display.innerHTML = "Moves:" + move_count[turn];
  move_name_display.innerHTML = move_name[current_move[turn]];
  power_display.innerHTML = "Power: " + power[turn];
  angle_display.innerHTML = "Angle: " + angle[turn];
}

function bombplacement() {
  if (!turn) {
    bomb.style.left = dist[0] + 5 + "vw";
    bomb.style.right = "";
  } else {
    bomb.style.left = "";
    bomb.style.right = dist[1] + 5 + "vw";
  }
  bomb.style.bottom = 32 + "vh";
}

function bombImageSetter() {
  if (current_move[turn] == 0) {
    bomb.src = "Assests/Images/grenade.png";
    explosion.src = "Assests/Images/grenade_explosion.png";
  }
  if (current_move[turn] == 1) {
    bomb.src = "Assests/Images/bomb.png";
    explosion.src = "Assests/Images/bomb_explosion.png";
  }
  if (current_move[turn] == 2) {
    bomb.src = "Assests/Images/dynamite.png";
    explosion.src = "Assests/Images/dynamite_explosion.png";
  }
}

function fire() {
  gameplay = 1;
  var time = 0,
    x,
    y;
  bomb.style.display = "block";
  fire_control = setInterval(function () {
    time += 0.01;
    x =
      ((power[turn] * Math.cos((angle[turn] * pi) / 180)) / 1.5) * time +
      dist[turn] +
      5;
    y =
      ((power[turn] * Math.sin((angle[turn] * pi) / 180)) / 1.5) * time -
      0.5 * 10 * time * time +
      32;
    if (!turn) {
      bomb.style.left = x + "vw";
    } else {
      bomb.style.right = x + "vw";
    }
    bomb.style.bottom = y + "vh";
    if (y < 20) {
      clearInterval(fire_control);
      damage(x);
      bomb.style.display = "none";
      explode(x);
      turn = turn * -1 + 1;
      bombplacement();
      update_control_bar();
      if (!paused) gameplay = 0;
    }
  }, 10);
}

window.addEventListener("keydown", (event) => {
  if (!gameplay) {
    switch (event.key) {
      case "ArrowLeft":
        if (move_count[turn] > 0) {
          move_animation(-1);
        }
        break;
      case "ArrowRight":
        if (move_count[turn] > 0) {
          move_animation(1);
        }
        break;
      case "ArrowUp":
        if (power[turn] < 100) power_change(1);
        break;
      case "ArrowDown":
        if (power[turn] > 10) power_change(-1);
        break;
      case "z":
        if (angle[turn] < 90) angle_change(1);
        break;
      case "c":
        if (angle[turn] > 10) angle_change(-1);
        break;
      case "p":
        fire();
        break;
    }
  }

  switch (event.key) {
    case " ":
      if (paused != 1) {
        stop_game(0);
        paused = 1;
      } else {
        replay_game();
      }
  }
});
