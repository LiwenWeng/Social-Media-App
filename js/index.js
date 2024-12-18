import { getAlbum, getPhotosForAlbum, getUser } from "./data.mjs";

const scrollContainer = document.querySelector("#scroll-container");
const dotContainer = document.querySelector("#dot-container");

const data = new Map();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function setupSection(n, id, section) {
    const photosPromise = getPhotosForAlbum(id);

    photosPromise.then(photos => {
        data.set(n, photos.length);
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

        if (n === 0) {
            for (let j = 0; j < data.get(0); j++) {
                const dot = document.createElement("div");
                dot.classList.add("dot");
                if (j === 0) dot.classList.add("active");
                dotContainer.appendChild(dot);
            }
        }
    });

    let previousSlide = -1;
    let currentSlide = 0;
    let previousScrollLeft = 0;
    section.addEventListener("scroll", () => {
        let currentScrollLeft = section.scrollLeft;
        const slideWidth = [...section.children][0].offsetWidth;
        previousSlide = currentSlide;

        if (currentScrollLeft < previousScrollLeft) {
            currentSlide = Math.floor(currentScrollLeft / slideWidth);
        } else if (currentScrollLeft > previousScrollLeft) {
            currentSlide = Math.ceil(currentScrollLeft / slideWidth);
        }
        previousScrollLeft = currentScrollLeft;
        
        const children = dotContainer.children;
        if (previousSlide !== currentSlide) {
            children[currentSlide].classList.add("active");
            children[previousSlide].classList.remove("active");
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
            i,
            array[i],
            document.createElement("div")
        );

        scrollContainer.appendChild(section);
    }

    let previousSection = 0;
    let currentSection = 0;
    scrollContainer.addEventListener("scroll", () => {
        const scrollPosition = scrollContainer.scrollTop; 
        const slideHeight = scrollContainer.offsetHeight;
        previousSection = currentSection;
        currentSection = Math.floor(scrollPosition / slideHeight) + 1;
        
        const albumPromise = getAlbum(array[currentSection - 1]);
        albumPromise.then(album => {
            const userPromise = getUser(album.userId);
            userPromise.then(user => {
                document.querySelector(".author").textContent = `Author: ${user.name}`;
            });
        });

        if (currentSection !== previousSection) {
            dotContainer.innerHTML = "";
            if (data.get(currentSection-1) === 1) return;
            for (let i = 0; i < data.get(currentSection-1); i++) {
                const dot = document.createElement("div");
                dot.classList.add("dot");
                if (i === 0) dot.classList.add("active");
                dotContainer.appendChild(dot);
            }
        }
    });
}

init();
