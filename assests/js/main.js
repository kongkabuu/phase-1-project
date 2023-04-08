const API_KEY = "7f4935f97bmsh9232d23ae7fa54bp17d8edjsn4d59d03e348c";

const HEADERS = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
  "content-type": "application/json",
};

async function fetchData(term = "nairobi") {
  let locationsUrl = new URL(
    "https://hotels4.p.rapidapi.com/locations/v3/search"
  );
  locationsUrl.searchParams.append("q", `${term}`);
  try {
    let data = await fetch(`${locationsUrl}`, {
      method: "GET",
      headers: HEADERS,
    });
    let results = await data.json();
    results.sr.map((obj) => {
      if (obj.type === "HOTEL") {
        console.log(obj.hotelId);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function gettingDetails(propertyId) {
  const options = {
    method: "POST",
    headers: HEADERS,
    body: `{"currency":"USD","eapid":1,"locale":"en_US","siteId":300000001,"propertyId":"${propertyId}"}`,
  };

  try {
    const response = await fetch(
      "https://hotels4.p.rapidapi.com/properties/v2/detail",
      options
    );
    const body = await response.json();
    if (body) {
      renderHotel(body);
    } else {
      console.log("Something went wrong");
    }
  } catch (err) {
    console.error(err);
  }
}

function getName(data) {
  return data.data.propertyInfo.summary.name;
}

function renderHotel(data) {
  // Check if the necessary data is available
  if (
    data &&
    data.data &&
    data.data.propertyInfo &&
    data.data.propertyInfo.propertyGallery &&
    data.data.propertyInfo.propertyGallery.images &&
    data.data.propertyInfo.propertyGallery.images.length > 0
  ) {
    let card = document.querySelector("#card");
    let image = document.createElement("img");
    image.src = `${data.data.propertyInfo.propertyGallery.images[0].image.url}`;
    card.append(image);
  } else {
    console.log("Error: Unable to retrieve property image data");
  }
}

// document.addEventListener("DOMContentLoaded", async () => {
//   await gettingDetails(17924777);
// });
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("search-btn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      let searchTerm = document.getElementById("search").value;

      fetchData(searchTerm);
    });
  console.log(fetchData());
});
