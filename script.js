let activitySlider, tempSlider, massSlider;
let particles = [];

function setup() {
  const canvas = createCanvas(650, 430);
  canvas.parent("canvas-holder");

  activitySlider = createSlider(0, 100, 50, 1);
  activitySlider.parent("activitySlider");
  activitySlider.style("width", "100%");

  tempSlider = createSlider(0, 100, 50, 1);
  tempSlider.parent("tempSlider");
  tempSlider.style("width", "100%");

  massSlider = createSlider(0, 100, 50, 1);
  massSlider.parent("massSlider");
  massSlider.style("width", "100%");

  for (let i = 0; i < 24; i++) {
    particles.push(createParticle());
  }

  setupQuiz();
  loadSavedScore();

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetSimulation);
  }
}

function draw() {
  background(225, 242, 250);

  const activity = activitySlider.value();
  const temp = tempSlider.value();
  const mass = massSlider.value();
  const energy = calculateEnergy(activity, temp, mass);

  updateLabels(activity, temp, mass);
  updateText(energy);

  drawEnvironment(temp);
  drawOrganism(mass, activity);
  drawEquationBox(activity, temp, mass, energy);
  drawEnergyParticles(energy);
  drawLegend(energy);
}

function calculateEnergy(activity, temp, mass) {
  return Math.round((activity * 0.5) + (temp * 0.2) + (mass * 0.3));
}

function updateLabels(activity, temp, mass) {
  document.getElementById("activityValue").textContent = activity;
  document.getElementById("tempValue").textContent = temp;
  document.getElementById("massValue").textContent = mass;
}

function updateText(energy) {
  document.getElementById("statusText").textContent =
    "Consommation d'énergie : " + energy + "%";

  const energyBar = document.getElementById("energyBar");
  energyBar.style.width = energy + "%";

  if (energy < 30) {
    energyBar.style.background = "linear-gradient(90deg, #3b82f6, #60a5fa)";
    document.getElementById("explanation").textContent =
      "La dépense énergétique est faible.";
  } else if (energy < 70) {
    energyBar.style.background = "linear-gradient(90deg, #22c55e, #84cc16)";
    document.getElementById("explanation").textContent =
      "La dépense énergétique est moyenne.";
  } else {
    energyBar.style.background = "linear-gradient(90deg, #f97316, #ef4444)";
    document.getElementById("explanation").textContent =
      "La dépense énergétique est élevée.";
  }
}

function drawEnvironment(temp) {
  const bg = map(temp, 0, 100, 210, 255);

  noStroke();
  fill(180, 220, bg);
  rect(0, 0, width, 250);

  fill(140, 200, 120);
  rect(0, 250, width, 180);

  fill(255, 215, 0, 180);
  circle(80, 70, map(temp, 0, 100, 40, 90));
}

function drawOrganism(mass, activity) {
  const size = map(mass, 0, 100, 70, 150);
  const speed = map(activity, 0, 100, 0.01, 0.12);
  const move = sin(frameCount * speed) * 10;

  fill(70, 100, 180);
  noStroke();
  ellipse(width / 2 + move, 240, size, size * 0.75);

  fill(50, 80, 150);
  circle(width / 2 + move + size * 0.2, 210, size * 0.32);

  stroke(40, 60, 100);
  strokeWeight(6);
  line(width / 2 - 25 + move, 285, width / 2 - 45 + move, 330);
  line(width / 2 + 20 + move, 285, width / 2 + 40 + move, 330);
  line(width / 2 - 15 + move, 235, width / 2 - 45 + move, 265);
  line(width / 2 + 30 + move, 235, width / 2 + 60 + move, 260);
}

function drawEquationBox(activity, temp, mass, energy) {
  noStroke();
  fill(255, 255, 255, 230);
  rect(20, 20, 360, 110, 12);

  fill(20);
  textSize(17);
  text("Équations et modèle simplifié", 35, 45);

  textSize(14);
  text("Glucose + O2 → énergie + CO2 + H2O", 35, 70);
  text("Énergie = activité + température + masse", 35, 92);
  text(
    "Activité: " + activity + " | Température: " + temp + " | Masse: " + mass,
    35,
    114
  );
}

function drawEnergyParticles(energy) {
  const visibleCount = floor(map(energy, 0, 100, 4, particles.length));

  for (let i = 0; i < visibleCount; i++) {
    let p = particles[i];

    noStroke();
    fill(255, 140, 0, 170);
    circle(p.x, p.y, p.size);

    p.y -= p.speed;
    p.x += sin(frameCount * 0.03 + i) * 0.3;

    if (p.y < 140) {
      particles[i] = createParticle();
    }
  }
}

function createParticle() {
  return {
    x: random(250, 420),
    y: random(220, 330),
    size: random(8, 18),
    speed: random(0.6, 1.8)
  };
}

function drawLegend(energy) {
  noStroke();
  fill(255, 255, 255, 220);
  rect(390, 20, 230, 90, 12);

  fill(20);
  textSize(15);
  text("Interprétation", 405, 45);
  textSize(13);
  text("Plus l'énergie augmente,", 405, 68);
  text("plus l'activité cellulaire est forte.", 405, 88);
  text("Valeur actuelle : " + energy + "%", 405, 108);
}

function setupQuiz() {
  const quizForm = document.getElementById("quizForm");
  const quizResult = document.getElementById("quizResult");
  const quizScore = document.getElementById("quizScore");
  const correctionBox = document.getElementById("correctionBox");
  const gradeText = document.getElementById("gradeText");

  if (!quizForm) return;

  const answers = {
    q1: {
      correct: "a",
      text: "Les êtres vivants ont besoin d'énergie pour vivre, grandir, bouger et assurer les fonctions vitales."
    },
    q2: {
      correct: "b",
      text: "La respiration cellulaire libère de l'énergie utilisable par l'organisme."
    },
    q3: {
      correct: "b",
      text: "Quand l'activité augmente, l'organisme a souvent besoin de plus d'énergie."
    },
    q4: {
      correct: "b",
      text: "Dans ce modèle, la température du milieu peut modifier la consommation d'énergie."
    }
  };

  quizForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(quizForm);
    let score = 0;
    const total = Object.keys(answers).length;

    correctionBox.innerHTML = "";

    for (const [question, data] of Object.entries(answers)) {
      const userAnswer = formData.get(question);
      const isCorrect = userAnswer === data.correct;

      if (isCorrect) {
        score++;
      }

      const item = document.createElement("div");
      item.className = "correction-item " + (isCorrect ? "good" : "bad");
      item.innerHTML =
        "<strong>" + question.toUpperCase() + "</strong> : " +
        (isCorrect ? "Bonne réponse" : "Réponse à revoir") +
        "<br>Corrigé : " + data.text;

      correctionBox.appendChild(item);
    }

    const percent = Math.round((score / total) * 100);

    let mention = "";
    if (percent >= 80) {
      mention = "Excellent 👍";
    } else if (percent >= 50) {
      mention = "Bien 🙂";
    } else {
      mention = "À revoir ⚠️";
    }

    quizScore.textContent =
      "Tu as obtenu " + score + "/" + total + " (" + percent + "%).";
    gradeText.textContent = "Note automatique : " + mention;
    quizResult.classList.remove("hidden");

    localStorage.setItem("quizScore", score);
    localStorage.setItem("quizPercent", percent);
    localStorage.setItem("quizMention", mention);
  });
}

function loadSavedScore() {
  const savedScore = localStorage.getItem("quizScore");
  const savedPercent = localStorage.getItem("quizPercent");
  const savedMention = localStorage.getItem("quizMention");

  if (savedScore !== null && savedPercent !== null) {
    document.getElementById("quizScore").textContent =
      "Dernier score enregistré : " + savedScore + "/4 (" + savedPercent + "%)";
    document.getElementById("gradeText").textContent =
      "Note automatique : " + savedMention;
    document.getElementById("quizResult").classList.remove("hidden");
  }
}

function resetSimulation() {
  activitySlider.value(50);
  tempSlider.value(50);
  massSlider.value(50);

  document.getElementById("activityValue").textContent = 50;
  document.getElementById("tempValue").textContent = 50;
  document.getElementById("massValue").textContent = 50;

  document.getElementById("statusText").textContent =
    "Consommation d'énergie : 50%";
  document.getElementById("energyBar").style.width = "50%";
  document.getElementById("energyBar").style.background =
    "linear-gradient(90deg, #22c55e, #2563eb)";
  document.getElementById("explanation").textContent =
    "La dépense énergétique est moyenne.";

  const quizForm = document.getElementById("quizForm");
  if (quizForm) {
    quizForm.reset();
  }

  const quizResult = document.getElementById("quizResult");
  if (quizResult) {
    quizResult.classList.add("hidden");
  }

  const correctionBox = document.getElementById("correctionBox");
  if (correctionBox) {
    correctionBox.innerHTML = "";
  }

  const quizScore = document.getElementById("quizScore");
  if (quizScore) {
    quizScore.textContent = "";
  }

  const gradeText = document.getElementById("gradeText");
  if (gradeText) {
    gradeText.textContent = "";
  }

  localStorage.removeItem("quizScore");
  localStorage.removeItem("quizPercent");
  localStorage.removeItem("quizMention");
}
let mention = "";
if (percent >= 80) {
  mention = "Excellent travail";
} else if (percent >= 50) {
  mention = "Bon travail";
} else {
  mention = "Résultat à améliorer";
}
