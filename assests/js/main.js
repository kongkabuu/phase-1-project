const API_KEY = "7f4935f97bmsh9232d23ae7fa54bp17d8edjsn4d59d03e348c";
const HEADERS = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
  "content-type": "application/json",
};

async function fetchData() {
  let data = await fetch(" https://hotels4.p.rapidapi.com/v2/get-meta-data", {
    method: "GET",
    headers: HEADERS,
  });
  let results = await Response.json();
  return results;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});
