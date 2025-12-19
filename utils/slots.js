export const OPENING_HOURS = {
  start: "00:00",
  end: "23:59",
  step: 30,
};

export const generateSlots = (start, end, step) => {
  const slots = [];

  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  while (h < endH || (h === endH && m <= endM)) {
    slots.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    );

    m += step;
    if (m >= 60) {
      h += Math.floor(m / 60);
      m = m % 60;
    }
  }

  return slots;
};
