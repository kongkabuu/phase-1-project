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
        gettingDetails(obj.hotelId);
        getReview(obj.hotelId);
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

async function getReview(id) {
  const options = {
    method: "POST",
    headers: HEADERS,
    body: `{"currency":"USD","eapid":1,"locale":"en_US","siteId":300000001,"propertyId":"${id}","size":10,"startingIndex":0}`,
  };

  try {
    const response = await fetch(
      "https://hotels4.p.rapidapi.com/reviews/v3/list",
      options
    );
    const body = await response.json();
    if (body) {
      renderReviews(body);
    } else {
      console.log("Something went wrong");
    }
  } catch (err) {
    console.error(err);
  }
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
    let overlay = document.createElement("div");
    overlay.className = "overlay";
    let name = document.createElement("h2");
    name.textContent = `${data.data.propertyInfo.summary.name}`;
    let description = document.createElement("p");
    description.textContent = `${data.data.propertyInfo.summary.tagline}`;

    overlay.append(name, description);
    card.append(image, overlay);
  } else {
    console.log("Error: Unable to retrieve property image data");
  }
}

function renderReviews(data) {
  let card = document.querySelector("#hotel1-review");
  let name = document.createElement("p");
  name.textContent = `${data.data.propertyInfo.reviewInfo.reviews[0].reviewRegion.__typename}`;
  let text = document.createElement("p");
  text.textContent = `review 1: ${data.data.propertyInfo.reviewInfo.reviews[0].text}`;
  let value = document.createElement("p");
  value.textContent = `${data.data.propertyInfo.reviewInfo.reviews[0].reviewScoreWithDescription.value}`;
  card.append(text, value, name);
}
function storeUserData() {
  let form = document.querySelector("#user-data");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new formData(form);
    const data = object.fromEntries(formData);
    postingUserData(data);
  });
}

async function postingUserData(data) {
  let options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(" http://localhost:3000/book", options);
    const body = await response.json();
    if (body) {
      renderReviews(data);
    } else {
      console.log("Something went wrong");
    }
  } catch (err) {
    console.error(err);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("search-btn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      let searchTerm = document.getElementById("search").value;

      fetchData(searchTerm);
      storeUserData();
    });
});
