self.importScripts('rubiks_cube_solver.js');

self.onmessage = function (e) {
  const { cubeData } = e.data;
  const cube = new Cube(cubeData.size);
  cube.faces = cubeData.faces;

  const solution = idaStar(cube);
  self.postMessage({ solution });
};
