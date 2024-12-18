import { getAlbum, getPhotosForAlbum, getUser } from "./data.mjs";

const scrollContainer = document.querySelector("#scroll-container");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function setupSection(id, section) {
    const photosPromise = getPhotosForAlbum(id);

    photosPromise.then(photos => {
        for (const i in photos) {
            const slide = document.createElement("div");
            slide.classList.add("slide");

            const img = document.createElement("img");
            img.src = photos[i].url;
            slide.appendChild(img);

            const title = document.createElement("h3");
            title.textContent = photos[i].title;
            title.classList.add("title");
            slide.appendChild(title);
            
            section.appendChild(slide);
        }
    });

    section.classList.add("section");
    return section;
}

function init() {
    const array = Array.from({ length: 100 }, (_, index) => index + 1);
    shuffleArray(array);

    for (let i = 0; i < array.length; i++) {
        const section = setupSection(
            array[i],
            document.createElement("div"),
        );

        const author = document.createElement("h3");
        author.classList.add("author");

        scrollContainer.appendChild(author);
        scrollContainer.appendChild(section);
    }

    scrollContainer.addEventListener("scroll", () => {
        const scrollPosition = scrollContainer.scrollTop; 
        const slideWidth = scrollContainer.offsetHeight;
        const currentSection = Math.floor(scrollPosition / slideWidth) + 1;
        
        const albumPromise = getAlbum(array[currentSection - 1]);
        albumPromise.then(album => {
            const userPromise = getUser(album.userId);
            userPromise.then(user => {
                document.querySelector(".author").textContent = `Author: ${user.name}`;
            });
        }); 
    });
}

init()
