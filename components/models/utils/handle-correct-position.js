export const handleCorrectPosition = (point = []) => {
  const [x0, y0, z0] = point;

  const x_offset = -70279 - 1270;
  const y_offset = 32342.6 - 67846;

  const position = [
    (x0 + x_offset) * 0.001,
    (y0 + y_offset) * 0.001,
    z0 * 0.001,
  ];

  return position;
};
