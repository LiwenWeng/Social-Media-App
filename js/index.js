import { getAlbum, getPhotosForAlbum } from "./data.mjs";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function setupSection(id, section) {
    const albumPromise = getAlbum(id);
    const photosPromise = getPhotosForAlbum(id);

    photosPromise.then(photos => {
        for (const photo in photos) {
            const slide = document.createElement("div");
            slide.classList.add("slide");
            const img = document.createElement("img");
            
            section.appendChild(slide);
        }
    })

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
        document.querySelector("#scroll-container").appendChild(section);
    }
}

init()
