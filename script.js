// global variables
const videoCategory = document.getElementById("Video_categories");
const videoContainer = document.getElementById("videos");
const sort = document.getElementById("sort");
// global variables
const time = (time) => {
    const hours = parseInt(time / 3600);
    const minutes = parseInt((time % 3600) / 60);
    const secconds = (time % 3600) % 60;
    if (hours === 0 && minutes === 0 && secconds === 0) {
        return "Just now";
    } else if (hours === 0 && minutes === 0) {
        return `${secconds} seconds ago`;
    } else if (hours === 0 && secconds === 0) {
        return `${minutes} minutes ago`;
    } else if (secconds === 0 && minutes === 0) {
        return `${hours} hours ago`;
    } else if (hours === 0) {
        return `${minutes} minutes ${secconds} seconds ago`;
    } else if (minutes === 0) {
        return `${hours} hours ${secconds} seconds ago`;
    } else if (secconds === 0) {
        return `${hours} hours ${minutes} minutes ago`;
    } else {
        return `${hours} hours ${minutes} minutes ${secconds} seconds ago`;
    }
}
const LoadCategories = async () => {
    try {
        const response = await fetch(
            "https://openapi.programming-hero.com/api/phero-tube/categories"
        );
        const data = await response.json();
        const categories = data.categories;
        DisplayCategories(categories);
    } catch (error) {
        console.error("Error:", error);
    }
};
const DisplayCategories = (data) => {
    const videoArray = [2];
    data.forEach((item) => {
        videoArray.push(item.category_id);
    });
    const all = document.createElement("button");
    all.classList.add(
        "btn",
        "btn-outline-primary",
        "m-2",
        "rounded-md",
        "text-center",
        "bg-slate-200",
        "hover:bg-[rgb(255,0,0)]",
        "hover:text-white",
        "hover:font-bold",
        "px-4",
        "py-2"
    );
    all.innerText = "All";
    videoCategory.appendChild(all);
    all.addEventListener("click", () => {
        all.classList.remove("bg-slate-200");
        all.classList.add("active");
        videoContainer.innerHTML = "";
        LoadVideos();
    });
    data.forEach((element) => {
        const button = document.createElement("button");
        button.classList.add(
            "btn",
            "btn-outline-primary",
            "m-2",
            "rounded-md",
            "text-center",
            "bg-slate-200",
            "hover:bg-[rgb(255,0,0)]",
            "hover:text-white",
            "hover:font-bold",
            "px-4",
            "py-2"
        );
        button.innerText = element.category;
        videoCategory.appendChild(button);
    });
    for (let i = 1; i <= videoArray.length; i++) {
        videoCategory.children[i].addEventListener("click", () => {
            videoContainer.innerHTML = "";
            videoCategory.children[i].classList.remove("bg-slate-200");
            for (let item of videoCategory.children) {
                item.classList.remove("active");
            }
            videoCategory.children[i].classList.add("active");
            const clickFunc = async () => {
                try {
                    let res = await fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${videoArray[i]}`);
                    let data = await res.json();
                    let categoryOfVideo = data.category;
                    displayVideos(categoryOfVideo);
                    if (videoContainer.children.length === 0) {
                        videoContainer.classList.remove("grid", "grid-cols-4", "gap-4");
                        videoContainer.classList.add("flex", "flex-col", "items-center", "justify-center");
                        videoContainer.innerHTML = `
                        <img src="Icon.png" alt="verified" class="w-30 h-25 mx-auto"/>
                        <h1 class="text-3xl font-bold mx-auto">Oops!! There is <br> no content here</h1>`;
                    }else{
                        videoContainer.classList.remove("flex", "flex-col", "items-center", "justify-center");
                        videoContainer.classList.add("grid", "grid-cols-4", "gap-4");
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
            clickFunc();
        });
    }
};
LoadCategories();
// vidoes
const LoadVideos = async (searchText = "") => {
    try {
        const video_response = await fetch(
            `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
        );
        const video_data = await video_response.json();
        const videos = video_data.videos;
        displayVideos(videos);
    } catch (error) {
        console.error("Error:", error);
    }
};
const searchInput = document.getElementById("searchText");
searchInput.addEventListener("input", (e) => { //input eventlistener works when i cross the input
    console.log(e.target.value);
    videoContainer.innerHTML = "";
    LoadVideos(e.target.value);
});
async function showVideoDetails(id) {
    const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${id}`);
    const data = await response.json();
    const modalContent = document.getElementById("modalcontent");
    modalContent.innerHTML = `<img src="${data.video.thumbnail}" alt="videosOfPhero" class="h-full w-full object-cover"/>
    <p class="text-md my-2">${data.video.description}</p>`;
    const modalbtn = document.getElementById("modalButton");
    modalbtn.click();
}
const displayVideos = (videos) => {
    videos.forEach((video) => {
        let card = document.createElement("div");
        card.classList.add("card", "bg-base-100", "cursor-pointer");
        card.setAttribute("onclick", "showVideoDetails('" + video.video_id + "')");
        card.innerHTML = `
        <figure class="h-[200px] relative">
            <img src="${video.thumbnail}" alt="Shoes" class="h-full w-full object-cover"/>
            ${video.others.posted_date.length === 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black text-white text-sm rounded-md px-3 py-2">${time(video.others.posted_date)}</span>`}
        </figure>
        <div class="px-0 py-4 flex items-start gap-4">
            <div class="">
                <img src="${video.authors[0].profile_picture}" alt="Shoes" class="w-10 h-10 rounded-full"/>
            </div>
            <div class="">
                <h2 class="text-lg font-semibold">${video.title}</h2>
                <p class="text-md text-gray-500 flex items-center gap-0">
                    ${video.authors[0].profile_name}
                    ${video.authors[0].verified === true ? `<img src="https://img.icons8.com/?size=100&id=2AuMnRFVB9b1&format=png&color=000000" alt="verified" class="w-6 h-6"/>` : ""}
                </p>
                <p class="text-md text-gray-500">${video.others.views} views</p>
            </div>
        </div>
        </div>`;
        videoContainer.appendChild(card);
    });
};

LoadVideos();

// sort videos
const sortVideos = async (id) => {
    try {
        const video_response = await fetch(
            `https://openapi.programming-hero.com/api/phero-tube/video/${id}`
        );
        const video_data = await video_response.json();
        const video = video_data.video;
        sorting(video);
    } catch (error) {
        console.error("Error:", error);
    }
};

const sorting = (video) => {
    let card = document.createElement("div");
    card.classList.add("card", "bg-base-100", "cursor-pointer");
    card.setAttribute("onclick", "showVideoDetails('" + video.video_id + "')");
    card.innerHTML = `
        <figure class="h-[200px] relative">
            <img src="${video.thumbnail}" alt="Shoes" class="h-full w-full object-cover"/>
            ${video.others.posted_date.length === 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black text-white text-sm rounded-md px-3 py-2">${time(video.others.posted_date)}</span>`}
        </figure>
        <div class="px-0 py-4 flex items-start gap-4">
            <div class="">
                <img src="${video.authors[0].profile_picture}" alt="Shoes" class="w-10 h-10 rounded-full"/>
            </div>
            <div class="">
                <h2 class="text-lg font-semibold">${video.title}</h2>
                <p class="text-md text-gray-500 flex items-center gap-0">
                    ${video.authors[0].profile_name}
                    ${video.authors[0].verified === true ? `<img src="https://img.icons8.com/?size=100&id=2AuMnRFVB9b1&format=png&color=000000" alt="verified" class="w-6 h-6"/>` : ""}
                </p>
                <p class="text-md text-gray-500">${video.others.views} views</p>
            </div>
        </div>
        </div>`;
    videoContainer.appendChild(card);
};
sort.addEventListener("click", async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/phero-tube/videos');
    const data = await response.json();
    const videos = data.videos;
    const sortList = [];
    const sortId = [];
    const sortObj = {};
    videoContainer.innerHTML = "";
    videos.forEach((video) => {
        sortList.push(parseFloat((video.others.views).split("K")[0]));
        sortId.push(video.video_id);
    });
    for (let i = 0; i < sortId.length; i++) {
        sortObj[sortId[i]] = sortList[i];
    }
    const sortedValues = Object.values(sortObj).sort((a, b) => b - a);
    // const sortedKeys = [];
    // console.log(sortList.indexOf(sortedValues[0]));
    for (let i = 0; i < sortedValues.length; i++) {
        let id = Object.keys(sortObj).find(key => sortObj[key] === sortedValues[i]);
        sortVideos(id);
    }
});