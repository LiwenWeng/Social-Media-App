const usersPromise = fetch("https://jsonplaceholder.typicode.com/users")
                .then(response => response.json())
                .catch(error => console.error(error));

const albumsPromise = fetch("https://jsonplaceholder.typicode.com/albums")
                .then(response => response.json())
                .catch(error => console.error(error));

const photosPromise = fetch("https://jsonplaceholder.typicode.com/photos")
                .then(response => response.json())
                .catch(error => console.error(error));
const photosByAlbums = photosPromise.then(photos => 
    Array.from(
        { length: 100 },
        (_, i) => Array.from({ length: 50 }, (_, j) => photos[i * 50 + j])
    )
)

export function getAlbum(albumId) {
    return albumsPromise.then(albums => albums[albumId - 1]);
}

export function getUser(userId) {
    return usersPromise.then(users => users[userId - 1]);
}

export function getPhotosForAlbum(albumId) {
    return photosByAlbums.then(albums => {
        const photos = albums[albumId - 1];
        const randomLength = Math.floor(Math.random() * 10) + 1;
        const shuffledPhotos = photos.sort(() => Math.random() - 0.5);
        return shuffledPhotos.slice(0, randomLength);
    })
}
