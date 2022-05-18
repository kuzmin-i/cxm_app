const handleColor = (label_type) => {
  let radius;
  let color;

  if (label_type === 0) {
    radius = 0.45;
    color = "#00FF85";
  }
  if (label_type === 1) {
    radius = 0.45;
    color = "#EBFF00";
  }
  if (label_type === 2) {
    radius = 0.45;
    color = "#FFB800";
  }
  if (label_type === 3) {
    radius = 1;
    color = "#FF6B00";
  }
  if (label_type === 4) {
    radius = 1;
    color = "#FB0707";
  }

  return [radius, color];
};

export default handleColor;
