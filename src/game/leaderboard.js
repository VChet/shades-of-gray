import { readValue, writeValue } from "./helpers/storage.js";

const STORAGE_KEY = "leaderboard";
const MAX_RECORDS = 10;

function getLeaderboard() {
  return readValue(STORAGE_KEY, []);
}

export function addRecord(score) {
  const records = getLeaderboard();

  records.push({
    date: new Date().toISOString(),
    score
  });

  records.sort((a, b) => b.score - a.score);
  records.splice(MAX_RECORDS);

  writeValue(STORAGE_KEY, records);
  return records;
}

export function getBestScore() {
  const [first] = getLeaderboard();
  return first?.score ?? 0;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "numeric",
  day: "numeric"
});
export function renderLeaderboard(element) {
  const records = getLeaderboard();

  const children = records.map((record) => {
    const item = document.createElement("li");
    const date = dateFormatter.format(new Date(record.date));
    item.textContent = `${record.score} · ${date}`;
    return item;
  });

  element.replaceChildren(...children);
}
