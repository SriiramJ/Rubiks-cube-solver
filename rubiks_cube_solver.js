/**
 * RUBIK'S CUBE SOLVER - NxN IDA* Implementation
 * @Author   : Sriram J
 * @Purpose  : Generalized NxN cube solver using scalable move engine and IDA* search
 * @Algorithms: Iterative Deepening A* (IDA*)
 * @Features :
 *   - Works for any N (≥ 2)
 *   - Generic move generator
 *   - Lightweight heuristic
 *   - Scrambler included
 * @Hackathon Submission: AeroHack 2025 - CS
 */

// ------------------ 1. Cube Representation ------------------
class Cube {
  constructor(size = 3) {
    this.size = size;
    this.faces = Object.fromEntries(
      ["U", "D", "F", "B", "L", "R"].map((face) => [
        face,
        Array(size * size).fill(faceColor(face)),
      ])
    );
  }

  clone() {
    const newCube = new Cube(this.size);
    for (let face in this.faces) {
      newCube.faces[face] = [...this.faces[face]];
    }
    return newCube;
  }

  isSolved() {
    return Object.values(this.faces).every((face) =>
      face.every((color) => color === face[0])
    );
  }
}

function faceColor(face) {
  return { U: "W", D: "Y", F: "G", B: "B", L: "O", R: "R" }[face];
}

function cubeStateToString(cube) {
  return ["U", "D", "F", "B", "L", "R"]
    .map((f) => cube.faces[f].join(""))
    .join("|");
}

// ------------------ 2. Move Engine ------------------
function rotateFace(face, size) {
  const newFace = new Array(size * size);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      newFace[c * size + (size - r - 1)] = face[r * size + c];
    }
  }
  return newFace;
}

function rotateFaceCounter(face, size) {
  const newFace = new Array(size * size);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      newFace[(size - c - 1) * size + r] = face[r * size + c];
    }
  }
  return newFace;
}

function cycleEdges(cube, positions, isCounter = false) {
  const temp = positions.map((pos) => cube.faces[pos[0]][pos[1]]);
  const len = temp.length;
  positions.forEach((pos, i) => {
    const from = isCounter ? (i + 1) % len : (i - 1 + len) % len;
    cube.faces[pos[0]][pos[1]] = temp[from];
  });
}

function getLayerIndices(size, layer) {
  return {
    row: (face, rowIdx) =>
      Array.from({ length: size }, (_, i) => [face, rowIdx * size + i]),
    col: (face, colIdx) =>
      Array.from({ length: size }, (_, i) => [face, i * size + colIdx]),
  };
}

function buildMoves(size) {
  const moves = {};
  const idx = getLayerIndices(size);

  for (let layer = 0; layer < size; layer++) {
    const suffix = layer === 0 ? "" : `${layer + 1}`;
    const rev = (a) => [...a].reverse();

    const defineMove = (name, face, edgesCW, edgesCCW) => {
      moves[`${name}${suffix}`] = (cube) => {
        const c = cube.clone();
        if (layer === 0) c.faces[face] = rotateFace(c.faces[face], size);
        cycleEdges(c, edgesCW, false);
        return c;
      };
      moves[`${name}${suffix}'`] = (cube) => {
        const c = cube.clone();
        if (layer === 0) c.faces[face] = rotateFaceCounter(c.faces[face], size);
        cycleEdges(c, edgesCCW, true);
        return c;
      };
    };

    defineMove(
      "U",
      "U",
      [
        ...idx.row("F", layer),
        ...idx.row("R", layer),
        ...idx.row("B", layer),
        ...idx.row("L", layer),
      ],
      [
        ...idx.row("F", layer),
        ...idx.row("L", layer),
        ...idx.row("B", layer),
        ...idx.row("R", layer),
      ]
    );

    defineMove(
      "D",
      "D",
      [
        ...idx.row("F", size - 1 - layer),
        ...idx.row("L", size - 1 - layer),
        ...idx.row("B", size - 1 - layer),
        ...idx.row("R", size - 1 - layer),
      ],
      [
        ...idx.row("F", size - 1 - layer),
        ...idx.row("R", size - 1 - layer),
        ...idx.row("B", size - 1 - layer),
        ...idx.row("L", size - 1 - layer),
      ]
    );

    defineMove(
      "L",
      "L",
      [
        ...idx.col("U", layer),
        ...idx.col("F", layer),
        ...idx.col("D", layer),
        ...rev(idx.col("B", size - 1 - layer)),
      ],
      [
        ...idx.col("U", layer),
        ...rev(idx.col("B", size - 1 - layer)),
        ...idx.col("D", layer),
        ...idx.col("F", layer),
      ]
    );

    defineMove(
      "R",
      "R",
      [
        ...idx.col("U", size - 1 - layer),
        ...rev(idx.col("B", layer)),
        ...idx.col("D", size - 1 - layer),
        ...idx.col("F", size - 1 - layer),
      ],
      [
        ...idx.col("U", size - 1 - layer),
        ...idx.col("F", size - 1 - layer),
        ...idx.col("D", size - 1 - layer),
        ...rev(idx.col("B", layer)),
      ]
    );

    defineMove(
      "F",
      "F",
      [
        ...idx.row("U", size - 1 - layer),
        ...idx.col("R", layer),
        ...rev(idx.row("D", layer)),
        ...rev(idx.col("L", size - 1 - layer)),
      ],
      [
        ...idx.row("U", size - 1 - layer),
        ...rev(idx.col("L", size - 1 - layer)),
        ...rev(idx.row("D", layer)),
        ...idx.col("R", layer),
      ]
    );

    defineMove(
      "B",
      "B",
      [
        ...idx.row("U", layer),
        ...idx.col("L", layer),
        ...rev(idx.row("D", size - 1 - layer)),
        ...rev(idx.col("R", size - 1 - layer)),
      ],
      [
        ...idx.row("U", layer),
        ...rev(idx.col("R", size - 1 - layer)),
        ...rev(idx.row("D", size - 1 - layer)),
        ...idx.col("L", layer),
      ]
    );
  }
  return moves;
}

let MOVES = buildMoves(3);

// ------------------ 3. Heuristic ------------------
function heuristic(cube) {
  let wrong = 0;
  for (let face in cube.faces) {
    const arr = cube.faces[face];
    const center = arr[Math.floor(arr.length / 2)];
    wrong += arr.filter((c) => c !== center).length;
  }
  return Math.ceil(wrong / 8);
}

// ------------------ 4. IDA* Solver (With Max Depth Cap) ------------------
function idaStar(startCube) {
  MOVES = buildMoves(startCube.size);
  let threshold = heuristic(startCube);
  const visited = new Set();
  const maxThreshold = 50; // Cap to prevent infinite loops

  function search(cube, g, threshold, path, lastMove) {
    const f = g + heuristic(cube);
    if (f > threshold) return { found: false, threshold: f };
    if (cube.isSolved()) return { found: true, path };

    const state = cubeStateToString(cube);
    if (visited.has(state)) return { found: false, threshold: Infinity };
    visited.add(state);

    let min = Infinity;
    for (let move in MOVES) {
      if (lastMove && move[0] === lastMove[0]) continue;
      const result = search(
        MOVES[move](cube),
        g + 1,
        threshold,
        [...path, move],
        move
      );
      if (result.found) return result;
      min = Math.min(min, result.threshold);
    }
    return { found: false, threshold: min };
  }

  while (threshold <= maxThreshold) {
    visited.clear();
    const result = search(startCube, 0, threshold, [], null);
    if (result.found) return result.path;
    if (result.threshold === Infinity) return null;
    threshold = result.threshold;
  }
  return null; // Could not solve within threshold cap
}

// ------------------ 5. Safe Scramble ------------------
function scramble(cube, count = 20) {
  MOVES = buildMoves(cube.size);
  const keys = Object.keys(MOVES).filter((k) => /^[UDLRFB]('?|2)?$/.test(k));
  const moves = [];
  let result = cube;
  for (let i = 0; i < count; i++) {
    let m;
    do {
      m = keys[Math.floor(Math.random() * keys.length)];
    } while (i > 0 && m[0] === moves[i - 1][0]);
    result = MOVES[m](result);
    moves.push(m);
  }
  return { scrambledCube: result, moves };
}

// ------------------ 6. Example Manual Test ------------------
const cube = new Cube(3);
const { scrambledCube, moves: scrambleMoves } = scramble(cube);
console.log("✅ Scrambled using:", scrambleMoves);

console.time("SolveTime");
const solution = idaStar(scrambledCube);
console.timeEnd("SolveTime");

if (solution) {
  console.log("✅ Moves to solve:", solution);
} else {
  console.log("❌ No solution found (within 50 depth)");
}
