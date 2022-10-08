const shooter = [
  document.getElementById("shooter_facing_right"),
  document.getElementById("shooter_facing_left"),
];
const tank = [
  document.getElementById("tank_facing_right"),
  document.getElementById("tank_facing_left"),
];
const move_display = document.getElementById("move_display");
const move_name_display = document.getElementById("move_name_display");
const power_display = document.getElementById("power_display");
const angle_display = document.getElementById("angle_display");
const bomb = document.getElementById("bomb");
var angle = [45, 45];
var dist = [10, 10];
var turn = 0;
var current_move = [0, 0];
var move_name = ["Small Shot", "Medium Shot", "Big Shot"];
var power = [50, 50];
var move_count = [5, 5];
var loopcntrl = [0, 0];
const pi = 3.14159;

bombplacement();

function move(direction) {
  if (!turn) {
    if (direction == 1) {
      dist[turn] += 2;
      tank[turn].style.left = dist[turn] + "vw";
    } else {
      dist[turn] -= 2;
      tank[turn].style.left = dist[turn] + "vw";
    }
  } else {
    if (direction == 1) {
      dist[turn] += 2;
      tank[turn].style.right = dist[turn] + "vw";
    } else {
      dist[turn] -= 2;
      tank[turn].style.right = dist[turn] + "vw";
    }
  }
  move_count[turn]--;
  move_display.innerHTML = "Moves:" + move_count[turn];
  bombplacement();
}

function move_name_change() {
  if (current_move[turn] == 2) current_move[turn] = 0;
  else current_move[turn]++;

  move_name_display.innerHTML = move_name[current_move[turn]];
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

function update_control_bar() {
  move_display.innerHTML = "Moves:" + move_count[turn];
  move_name_display.innerHTML = move_name[current_move[turn]];
  power_display.innerHTML = "Power: " + power[turn];
  angle_display.innerHTML = "Angle: " + angle[turn];
}

function bombplacement() {
  if (!turn) {
    bomb.style.bottom = 40 + "vh";
    bomb.style.left = dist[0] + 9 + "vw";
    bomb.style.right = "";
  } else {
    bomb.style.bottom = 40 + "vh";
    bomb.style.left = "";
    bomb.style.right = dist[1] + 9 + "vw";
  }
}

function fire() {
  var time = 0;
  var y;
  var x;
  if (!turn) {
    loopcntrl[0] = setInterval(function () {
      time += 0.01;

      x =
        ((power[1] * Math.cos((angle[0] * pi) / 180)) / 2) * time + dist[0] + 9;
      y =
        ((power[1] * Math.sin((angle[0] * pi) / 180)) / 2) * time -
        0.5 * 10 * time * time +
        40;
      bomb.style.left = x + "vw";
      bomb.style.bottom = y + "vh";
      if (y < 20) {
        clearInterval(loopcntrl[0]);
        bombplacement();
        update_control_bar();
      }
    }, 10);
    turn = 1;
  } else {
    loopcntrl[1] = setInterval(function () {
      time += 0.01;

      x =
        ((power[1] * Math.cos((angle[1] * pi) / 180)) / 2) * time + dist[0] + 9;
      y =
        ((power[1] * Math.sin((angle[1] * pi) / 180)) / 2) * time -
        0.5 * 10 * time * time +
        40;
      bomb.style.right = x + "vw";
      bomb.style.bottom = y + "vh";
      if (y < 20) {
        clearInterval(loopcntrl[1]);
        bombplacement();
        update_control_bar();
      }
    }, 10);
    turn = 0;
  }
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      if (move_count[turn] > 0) {
        if (!turn) {
          move(-1);
        } else {
          move(1);
        }
      }
      break;
    case "ArrowRight":
      if (move_count[turn] > 0) {
        if (!turn) {
          move(1);
        } else {
          move(-1);
        }
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
});
