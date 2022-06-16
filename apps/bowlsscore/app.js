// @ts-check
// @ts-ignore
const menu = require("graphical_menu");
/**
 * @type {{showMenu: (config) => void}}
 */
let E;
/**
 * @type {{clear: () => void}}
 */
let g;

let ends_count = 10;
let team_count = 2;
/**
 * @type {number[][]}
 */
let course = new Array(ends_count).map(() => new Array(team_count).fill(0));

const main_menu = {
  "": {
    "title": "-- Bowls --"
  },
  "Setup": function () { E.showMenu(setup_menu); },
  "Score Card": function () {
    calculate_score();
    E.showMenu(score_card);
  },
};

function calculate_score() {
  let scores = course.reduce((acc, hole) => {
    hole.forEach((stroke_count, player) => {
      acc[player] = acc[player]+stroke_count;
    });
    return acc;
  }, new Array(team_count).fill(0));

  score_card = {
    "": {
      "title": "score card"
    },
    "< Back": function () { E.showMenu(main_menu); },
  };

  for (let player = 0; player < team_count; player++) {
    score_card["Team - " + (player + 1)] = {
      value: scores[player]
    };
  }
}

let score_card = {};

const setup_menu = {
  "": {
    "title": "-- Bowls Setup --"
  },
  "Ends": {
    value: ends_count,
    min: 1, max: 20, step: 1, wrap: true,
    onchange: v => { ends_count = v; add_ends(); }
  },
  "Teams": {
    value: team_count,
    min: 1, max: 10, step: 1, wrap: true,
    onchange: v => { team_count = v; }
  },
  "< Back": function () { E.showMenu(main_menu); },
};

function inc_hole(i, player) { return function (v) { course[i][player] = v; }; }

function add_ends() {
  for (let j = 0; j < 20; j++) {
    delete main_menu["End - " + (j + 1)];
  }
  for (let i = 0; i < ends_count; i++) {
    course[i] = new Array(team_count).fill(0);
    main_menu["End - " + (i + 1)] = goto_hole_menu(i);
  }
  E.showMenu(main_menu);
}

function goto_hole_menu(i) {
  return function () {
    E.showMenu(hole_menu(i));
  };
}

function hole_menu(i) {
  let menu = {
    "": {
      "title": `-- End ${i + 1}--`
    },
    "Next end": goto_hole_menu(i + 1),
    "< Back": function () { E.showMenu(main_menu); },
  };

  for (let player = 0; player < team_count; player++) {
    menu[`Team - ${player + 1}`] = {
      value: course[i][player],
      min: 1, max: 20, step: 1, wrap: true,
      onchange: inc_hole(i, player)
    };
  }

  return menu;
}

// @ts-ignore
g.clear();
add_ends();
