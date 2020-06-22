const d = "06/17/2020";

const dat = new Date(d);
const day = dat.getDay();

const xyz = new Date("2020-06-04T20:00:00-04:00");

const days = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

const x = new Date("Jun 17 2020");
const dayOfWeek = days[day];

console.log(x.getDay());
