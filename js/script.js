const categorySection = document.getElementById("category-section");

function getTimeString(time) {
  let hour = Math.floor(time / 3600);
  let remainingSec = time % 3600;
  let minute = Math.floor(remainingSec / 60);
  remainingSec = remainingSec % 60;
  return ` ${hour} hr ${minute} min ${remainingSec} sec ago`;
}
// load and display categories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};

const displayCategories = (catagories) => {
  catagories.map((item) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick='loadCategoryVideo(${item.category_id})' class="btn category-btn">
        ${item.category}
        </button>
    `;
    categorySection.appendChild(categoryContainer);
  });
};
const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  for (const btn of buttons) {
    btn.classList.remove("bg-red-500");
    btn.classList.remove("text-white");
  }
};
const loadCategoryVideo = (id) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("bg-red-500", "text-white");
      displayVideos(data.category);
    });
};

const loadVideos = async (searchVal = "") => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchVal}`
  );
  const data = await res.json();
  displayVideos(data.videos);
};

// {
//     "category_id": "1003",
//     "video_id": "aaae",
//     "thumbnail": "https://i.ibb.co/Yc4p5gD/inside-amy.jpg",
//     "title": "Inside Amy Schumer",
//     "authors": [
//         {
//             "profile_picture": "https://i.ibb.co/YD2mqH7/amy.jpg",
//             "profile_name": "Amy Schumer",
//             "verified": ""
//         }
//     ],
//     "others": {
//         "views": "3.6K",
//         "posted_date": "15147"
//     },
//     "description": "'Inside Amy Schumer' is a comedy show by the popular comedian Amy Schumer, blending sharp satire and unfiltered humor to tackle everyday issues and societal norms. With 3.6K views, the show promises a blend of hilarious sketches, thought-provoking stand-up, and candid interviews. It's a must-watch for fans of bold, edgy comedy."
// }

const displayVideos = (videos) => {
  const videoSection = document.getElementById("video-section");
  videoSection.innerHTML = "";

  if (videos.length === 0) {
    videoSection.classList.remove("grid");
    videoSection.innerHTML = `
        <div class ="flex flex-col gap-5 justify-center items-center">
        <img class="w-1/4 object-cover" src="images/Icon.png"/>
        <h2 class="text-2xl font-bold">NO CONTENT HERE
        </h2>
        </div>
      `;
    return;
  } else {
    videoSection.classList.add("grid");
  }
  videos.map((video) => {
    const videoContainer = document.createElement("div");
    //   videoContainer.innerHTML = "";

    videoContainer.classList = " card-compact bg-base-10";
    videoContainer.innerHTML = `
    <figure class='relative'>
    <img class="w-96 h-52"
      src=${video.thumbnail}
      alt="Shoes" />
      ${
        video.others.posted_date?.length === 0
          ? ""
          : `<span class= 'absolute right-2 bottom-2 bg-black text-white p-1 rounded-lg'>${getTimeString(
              video.others.posted_date
            )}</span>`
      }
      
  </figure>
  <div class="px-0 py-2 flex flex-row gap-5">
  <img class='w-10 h-10 rounded-full' src=${video.authors[0].profile_picture}/>
  <div class ="flex flex-col gap-2">
  
    <h2 class="card-title">${video.title}</h2>
    <div class = "flex items-center gap-2">
    <p>${video.authors[0].profile_name}</p>
    ${
      video.authors[0].verified === true
        ? `<img class="h-5 w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"/>`
        : ""
    }
    </div>
    <p>${video.others.views} views</p>
    <div class="card-actions justify-start">
      <button onclick='loadDetails("${
        video.video_id
      }")' class="btn btn-primary">details</button>
    </div>
    </div>
  </div>
    `;
    videoSection.append(videoContainer);
  });
};

const loadDetails = (videoId) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`)
    .then((res) => res.json())
    .then((data) => displayDetails(data.video));
};
const displayDetails = (video) => {
  const detailsContainer = document.getElementById("modal-content");
  detailsContainer.innerHTML = `
    <img class="w-full" src= ${video.thumbnail}/>
    <p>${video.description}
    </p>
    
    `;
  //   way-1
  //   document.getElementById("showModalData").click();
  //   ekhane jekono button e click korle by default modal er button e click diye dey
  //   way-2
  document.getElementById("customModal").showModal();
  //   ekhane modal content ta dhoreche
};
document.getElementById("search-box").addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
});

document.getElementById("sort-btn").addEventListener("click", () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
    .then((res) => res.json())
    .then((data) => {
      const sortedVideos = data.videos.sort((a, b) => {
        const viewsA = parseFloat(a.others.views.replace("K", "")) * 1000;
        const viewsB = parseFloat(b.others.views.replace("K", "")) * 1000;
        return viewsB - viewsA; // Sort in descending order of views
      });
      displayVideos(sortedVideos);
    });
});

loadCategories();
loadVideos();
