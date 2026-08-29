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

  if (!records.length) {
    const empty = document.createElement("li");
    empty.textContent = "No records yet";
    empty.classList.add("empty");
    element.replaceChildren(empty);
    return;
  }

  const maxScoreLength = Math.max(...records.map((record) => String(record.score).length), 0);

  const children = records.map((record) => {
    const item = document.createElement("li");
    const score = String(record.score).padStart(maxScoreLength, "0");
    const date = dateFormatter.format(new Date(record.date));
    item.textContent = `${score} · ${date}`;
    return item;
  });

  element.replaceChildren(...children);
}
