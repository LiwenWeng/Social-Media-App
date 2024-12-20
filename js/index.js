import { getAlbum, getPhotosForAlbum, getUser } from "./data.mjs";

const scrollContainer = document.querySelector("#scroll-container");
const dotContainer = document.querySelector("#dot-container");

const data = new Map();
const activeSlide = new Map();
let currentSection = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createInteractionBar() {
    const interactionBar = document.createElement("div");
    interactionBar.id = "interaction-bar";

    const heartContainer = document.createElement("div");
    heartContainer.classList.add("heart-container");
    heartContainer.onclick = () => {
        svg.classList.toggle("filled");
        data.get(currentSection).liked = svg.classList.contains("filled");
    }
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.classList.add("heart-icon");
    heartContainer.appendChild(svg);

    const heartPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    heartPath.setAttribute(
        "d",
        "M20.8 4.6c-2.3-2.3-6-2.3-8.3 0L12 5.1l-.5-.5c-2.3-2.3-6-2.3-8.3 0s-2.3 6 0 8.3l8.3 8.3 8.3-8.3c2.3-2.3 2.3-6 0-8.3z"
    );
    svg.appendChild(heartPath);

    const commentIcon = document.createElement("img");
    commentIcon.src = "assets/comment.png"
    commentIcon.classList.add("comment-icon");

    const shareIcon = document.createElement("img");
    shareIcon.src = "assets/share.png"
    shareIcon.classList.add("share-icon");

    interactionBar.appendChild(heartContainer);
    interactionBar.appendChild(commentIcon);
    interactionBar.appendChild(shareIcon);
    return interactionBar;
}

function setupSection(n, id, section) {
    const photosPromise = getPhotosForAlbum(id);

    photosPromise.then(photos => {
        data.set(n, { len: photos.length, liked: false });
        activeSlide.set(n, 0);
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
            if (data.get(0).len === 1) return;
            for (let j = 0; j < data.get(0).len; j++) {
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
            activeSlide.set(n+1, currentSlide);
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

    scrollContainer.appendChild(createInteractionBar());

    let previousSection = 0;
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
            if (data.get(currentSection-1).len === 1) return;
            for (let i = 0; i < data.get(currentSection-1).len; i++) {
                const dot = document.createElement("div");
                dot.classList.add("dot");
                if (i === activeSlide.get(currentSection)) dot.classList.add("active");
                dotContainer.appendChild(dot);
            }
            
            const heartIcon = document.querySelector(".heart-icon");
            if (data.get(currentSection).liked) {
                heartIcon.classList.add("filled");
            } else {
                heartIcon.classList.remove("filled");
            }
        }
    });
}

init();
