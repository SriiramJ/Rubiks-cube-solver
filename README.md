# NxN Rubik's Cube Solver using IDA\*

> **Hackathon Submission**: AeroHack 2025 (CS Track)  
> **Team**: RubiGenius  
> **Contributor**: Sriram J

---

## 🚀 Overview

This project is a **scalable, browser-based Rubik’s Cube solver** built using a generalized cube model and an **Iterative Deepening A\*** (IDA*) search algorithm. It supports **NxN cube sizes** (2x2 to 4x4+), features a dynamic move engine, and provides a **visual, interactive** solving experience directly in the browser.

---

## 🎯 Objectives

- Simulate and solve NxN Rubik’s Cubes with real-world logical moves.
- Optimize for both memory and speed using the IDA* search.
- Build a clean, interactive user interface to visualize solving.
- Allow scrambling, solving, and viewing of cube states.

---

## 🧠 Features

- ✅ NxN Support: 2x2, 3x3, 4x4... (scalable logic)
- ✅ Dynamic move generator (no hardcoding per size)
- ✅ Efficient IDA* Search with pruning and state hashing
- ✅ Lightweight heuristic function for solving performance
- ✅ Web-based GUI with `Scramble`, `Solve`, and cube rendering
- ✅ Animations for move visualization
- ✅ Timeout and max-depth handling for stability

---

## 🛠️ Tech Stack

| Component     | Technology     |
|---------------|----------------|
| Frontend      | HTML5, CSS3    |
| Logic & Engine| Vanilla JavaScript |
| Algorithm     | Iterative Deepening A* |
| Visualization | DOM + CSS Grid |

---

## 📂 Project Structure

├── index.html # Main UI page
├── style.css # Styling for layout and cube
├── rubiks_cube_solver.js # Cube logic, engine, IDA* algorithm
├── solverWorker.js # (Optional) Web worker for offloading solve task


---

## 🧪 How to Use

1. Clone or download the repo:
   ```bash
   git clone https://github.com/your-username/nxn-rubiks-solver.git
   cd nxn-rubiks-solver
Open index.html in your browser (no server required).

Interact:

Set cube size (default is 3)

Click Generate

Click Scramble

Click Solve

Scrambled using:
["D2'", "R2'", 'D2', 'R', 'L3', 'B3', "U2'", 'R3', 'F', "B2'", 'F2', "B3'", 'L3', "B2'", 'L', "U2'", "L2'", 'F2', 'D3', "R2'"]

Output:
Moves to solve: null (if unsolvable within constraints)
