const api_key = "AIzaSyD2LbPfF2ILyJh65KfqeExWG9xWrlhJWMg";

const input = document.getElementById("input");
const button = document.getElementById("btn");
const videoList = document.getElementById("video-list");
const loader = document.getElementById("loader");

let lastSearch = "";

// Search button
button.addEventListener("click", () => getItems());

// Press Enter to search
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getItems();
});

// Main fetch function
async function getItems(filter = "relevance") {
  const searchQuery = input.value.trim() || lastSearch;

  if (!searchQuery) return;

  lastSearch = searchQuery;
  loader.classList.remove("d-none");
  videoList.innerHTML = "";

  const api_url = `https://www.googleapis.com/youtube/v3/search?key=${api_key}&q=${searchQuery}&type=video&videoEmbeddable=true&order=${filter}&part=snippet&maxResults=20`;

  try {
    const response = await fetch(api_url);
    const data = await response.json();

    loader.classList.add("d-none");

    if (!data.items.length) {
      videoList.innerHTML = `<p class="text-center text-warning">No videos found.</p>`;
      return;
    }

    data.items.forEach(video => {
      const videoId = video.id.videoId;
      const snippet = video.snippet;

      videoList.innerHTML += `
        <div class="col-md-4">
          <div class="card bg-secondary text-light video-card" onclick="playVideo('${videoId}')">
            <img src="${snippet.thumbnails.high.url}" class="card-img-top">
            <div class="card-body">
              <h6 class="card-title">${snippet.title}</h6>
              <p class="card-text text-warning">${snippet.channelTitle}</p>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    loader.classList.add("d-none");
    console.log(error);
    alert("Error fetching videos");
  }
}

// Replace thumbnail with embedded player
function playVideo(id) {
  videoList.innerHTML = `
    <div class="col-12">
      <div class="ratio ratio-16x9">
        <iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>
      </div>
    </div>
  `;
}

// Filter dropdown
function searchFilter() {
  if (!lastSearch) return;
  const filter = document.getElementById("filterInput").value;
  getItems(filter);
}
// CATEGORY CLICK HANDLER
document.querySelectorAll(".category").forEach(item => {
  item.addEventListener("click", () => {

    // Remove previous active highlight
    document.querySelectorAll(".category").forEach(c => c.classList.remove("active-category"));

    // Highlight selected
    item.classList.add("active-category");

    // Get category name
    const category = item.dataset.cat;

    // Convert category to search query
    const searchTerm =
      category === "home" ? "popular videos" :
      category === "trending" ? "trending videos" :
      category === "music" ? "music videos" :
      category === "gaming" ? "gaming videos" :
      category === "news" ? "latest news" :
      category === "sports" ? "sports highlights" :
      category === "movies" ? "movie trailers" :
      category === "learning" ? "educational videos" :
      category === "fashion" ? "fashion beauty tutorials" :
      category === "live" ? "live streams" :
      category;

    input.value = searchTerm;
    getItems("relevance");
  });
});

window.onload = () => {
  // Highlight Home category
  const home = document.querySelector('[data-cat="home"]');
  home.classList.add("active-category");

  // Auto-load popular videos
  input.value = "popular videos";
  getItems("relevance");
};