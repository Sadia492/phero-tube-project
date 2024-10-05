let currentCategory = null;
// for formatting time
function timeString(time) {
  const hour = Math.floor(time / 3600);
  let remainingSec = time % 3600;
  const minute = Math.floor(remainingSec / 60);
  remainingSec = remainingSec % 60;
  return `${hour}:${minute}:${remainingSec}`;
}
// for loading categories
const loadCategories = async () => {
  let res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/categories`
  );
  let data = await res.json();
  displayCategories(data.categories);
};

// for displaying categories
const displayCategories = (categories) => {
  const categorySection = document.getElementById("category-section");
  categories.forEach((category) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <button onclick="loadCategoryVideo(${category.category_id})" class="btn">${category.category}</button>
    
    `;

    categorySection.appendChild(div);
  });
};
// for loading videos
const loadVideos = async (searchVal = "") => {
  currentCategory = null;
  let res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchVal}`
  );
  let data = await res.json();
  displayVideos(data.videos);
};
// for displaying videos
const displayVideos = (videos) => {
  const videoSection = document.getElementById("video-section");
  videoSection.innerHTML = "";
  if (videos.length === 0) {
    document.getElementById("no-video").classList.remove("hidden");
  } else {
    document.getElementById("no-video").classList.add("hidden");
  }

  videos.forEach((video) => {
    const {
      thumbnail,
      others: { posted_date, views },
      title,
      video_id,
    } = video;

    const [{ profile_picture, profile_name, verified }] = video.authors;
    const div = document.createElement("div");
    div.innerHTML = `
    <figure class='relative'>
    <img class="w-96 h-52"
      src=${thumbnail}
      alt="Shoes" />
      ${
        posted_date
          ? `<span class= 'absolute right-2 bottom-2 bg-black text-white p-1 rounded-lg'>${timeString(
              posted_date
            )}</span>`
          : ""
      }
      
  </figure>
  <div class="px-0 py-2 flex flex-row gap-5">
  <img class='w-10 h-10 rounded-full' src=${profile_picture}/>
  <div class ="flex flex-col gap-2">
  
    <h2 class="card-title">${title}</h2>
    <div class = "flex items-center gap-2">
    <p>${profile_name ? profile_name : "Unknown"}</p>
    ${
      verified
        ? `<img class="h-5 w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"/>`
        : ""
    }
    </div>
    <p>${views} views</p>
    <div class="card-actions justify-start">
      <button onclick='loadDetails("${video_id}")' class="btn btn-primary">details</button>
    </div>
    </div>
  </div>
    `;
    videoSection.appendChild(div);
  });
};
// for loading category based video while clicking category
const loadCategoryVideo = async (id) => {
  currentCategory = id;
  let res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
  );
  let data = await res.json();
  displayVideos(data.category);
};
// another way of searching by title
// document.getElementById("search-box").addEventListener("keyup", (e) => {
//   loadVideos(e.target.value);
// });
// loading details to show in modal
const loadDetails = async (id) => {
  let res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/video/${id}`
  );
  let data = await res.json();
  showAModal(data.video);
};
// showing modal
const showAModal = (video) => {
  const modalContainer = document.getElementById("modal-container");

  modalContainer.innerHTML = `
 <dialog id="customModal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <div id="modal-content">
        <img class="w-full" src= ${video.thumbnail}/>
    <p>${video.description}
    </p>
        </div>
        <div class="modal-action">
          <form method="dialog">
         
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  
  `;
  customModal.showModal();
};
// sorting the videos by views
document.getElementById("sort-btn").addEventListener("click", async () => {
  if (currentCategory) {
    // If a category is selected, fetch and sort category videos
    let res = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/category/${currentCategory}`
    );
    let data = await res.json();
    const sortedVideos = data.category.sort((a, b) => {
      const viewsA = parseFloat(a.others.views.replace("K", "")) * 1000;
      const viewsB = parseFloat(b.others.views.replace("K", "")) * 1000;
      return viewsB - viewsA; // Sort in descending order of views
    });
    displayVideos(sortedVideos);
  } else {
    // If no category is selected, sort all videos
    let res = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/videos"
    );
    let data = await res.json();
    const sortedVideos = data.videos.sort((a, b) => {
      const viewsA = parseFloat(a.others.views.replace("K", "")) * 1000;
      const viewsB = parseFloat(b.others.views.replace("K", "")) * 1000;
      return viewsB - viewsA; // Sort in descending order of views
    });
    displayVideos(sortedVideos);
  }
});

// searching videos by title when search button is clicked
const showSearch = () => {
  const searchVal = document.getElementById("search-box").value;
  loadVideos(searchVal);
};

loadCategories();
loadVideos();
