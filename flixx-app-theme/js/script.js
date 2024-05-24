//9cd5c6f2b8eb369d26b3f6858fd190c9
const URL = '';
const global = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0
    },
    api: {
        apiKey: '9cd5c6f2b8eb369d26b3f6858fd190c9',
        apiUrl: 'https://api.themoviedb.org/3/'
    }
};

let previousSearchTerm;

async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular');
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="/movie-details.html?id=${movie.id}">
            ${
            movie.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />` : `<img
              src="./images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        `;
        document.querySelector('#popular-movies').appendChild(div);
    });
}

async function displayPopularShows() {
    const { results } = await fetchAPIData('tv/popular');
    console.log(results);
    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="/tv-details.html?id=${show.id}">
            ${show.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />` : `<img
              src="./images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
          </div>
        `;
        document.querySelector('#popular-shows').appendChild(div);
    });
}

//display movie details
async function displayMovieDetails() {
    const movieID = window.location.search.substring(4);
    const results = await fetchAPIData('movie/' + movieID);

    //overlay for background image
    displayBackgroundImage('movie', results.backdrop_path);

    const div = document.createElement('div');
    div.innerHTML = `
        <div class="details-top">
            <div>
            ${results.poster_path
            ? `<img
              src="https://image.tmdb.org/t/p/w500${results.poster_path}"
              class="card-img-top"
              alt="${results.title}"
            />` : `<img
              src="./images/no-image.jpg"
              class="card-img-top"
              alt="${results.title}"
            />`
        }
          </div>
          <div>
            <h2>${results.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${results.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${results.release_date}</p>
            <p>
              ${results.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${results.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
                results.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(results.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(results.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${results.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${results.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${results.production_companies.map((company) => ` ${company.name}`)}</div>
        </div>
    `;
    document.querySelector('#movie-details').appendChild(div);
}

//display movie details
async function displayShowDetails() {
    const showID = window.location.search.substring(4);
    const results = await fetchAPIData('tv/' + showID);
    console.log(results);
    //overlay for background image
    displayBackgroundImage('show', results.backdrop_path);
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="details-top">
            <div>
            ${results.poster_path
            ? `<img
              src="https://image.tmdb.org/t/p/w500${results.poster_path}"
              class="card-img-top"
              alt="${results.name}"
            />` : `<img
              src="./images/no-image.jpg"
              class="card-img-top"
              alt="${results.name}"
            />`
        }
          </div>
          <div>
            <h2>${results.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${results.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date: ${results.last_air_date}</p>
            <p>
              ${results.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${results.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${results.homepage
        }" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${results.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${results.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${results.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${results.production_companies.map((company) => ` ${company.name}`)}</div>
        </div>
    `;
    document.querySelector('#show-details').appendChild(div);
}

//display backdrop in details page
function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath}`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.25';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

//search movies/shows
async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');

    if (global.search.term !== '' && global.search.term !== null) {
        const { results, total_pages, page, total_results } = await searchAPIData();

        global.search.page = page;
        global.search.totalPages = total_pages;
        global.search.totalResults = total_results;

        if (results.length === 0) {
            showAlert('No results found');
            return;
        }

        displaySearchResults(results);
        document.querySelector('#search-term').value = '';

    } else {
        showAlert('Please enter a search term');
    }
}

function displaySearchResults(results) {
    //clear previous results
    document.querySelector('#search-results-heading').innerHTML = '';
    document.querySelector('#search-results').innerHTML = '';
    document.querySelector('#pagination').innerHTML = '';

    results.forEach(result => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="/${global.search.type}-details.html?id=${result.id}">
            ${result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${global.search.type === 'movie' ? result.title : result.name}"
            />` : `<img
              src="./images/no-image.jpg"
              class="card-img-top"
              alt="${global.search.type === 'movie' ? result.title : result.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
            </p>
          </div>
        `;
        document.querySelector('#search-results-heading').innerHTML = `
            <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
        `;

        document.querySelector('#search-results').appendChild(div);
    });

    displayPagination();
}

//create and display pagination for search
function displayPagination() {
    const div = document.createElement('div')
    div.classList.add('pagination');
    div.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `;
    document.querySelector('#pagination').appendChild(div);

    //disable prev btn if on first page
    if (global.search.page === 1) {
        document.querySelector('#prev').disabled = true;
    }

    //disable next btn if on last page
    if (global.search.page === global.search.totalPages) {
        document.querySelector('#next').disabled = true;
    }

    //next page
    document.querySelector('#next').addEventListener('click', async () =>
    {
        global.search.page++;
        const { results, total_pages } = await searchAPIData();
        displaySearchResults(results);
    })

    //prev page
    document.querySelector('#prev').addEventListener('click', async () => {
        global.search.page--;
        const { results, total_pages } = await searchAPIData();
        displaySearchResults(results);
    })
}

//display slider movies
async function displaySlider() {
    const { results } = await fetchAPIData('movie/now_playing');
    results.forEach(movie => {
        const div = document.createElement('div')
        div.classList.add('swiper-slide');
        div.innerHTML = `
            <a href="/movie-details.html?id=${movie.id}">
              ${movie.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />` : `<img
              src="./images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
            </h4>
        `;
        document.querySelector('.swiper-wrapper').appendChild(div);

        initSwiper();
    });
}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        createElements: true,
        naviagation: true,
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        //autoplay: {
        //    delay: 4000,
        //    disableOnInteraction: true,
        //    pauseOnMouseOver: true,
        //    waitForTransition: true,
        //},
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            },
        }
    });
}

//fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    hideSpinner();
    return data;
}

//make request to search
async function searchAPIData() {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    showSpinner();
    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
    const data = await response.json();
    hideSpinner();
    return data;
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

//highlight active link
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link')
    links.forEach(link => {
        if (global.currentPage === link.getAttribute('href')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

//show alert
function showAlert(message, className = 'error') {
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className);
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertEl);

    setTimeout(() => alertEl.remove(), 3000);
}

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
} 

function previousSearch() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    global.search.term = urlParams.get('search-term');
    previousSearchTerm = global.search.term
}

function setPreviousSearch() {
    document.querySelector('#search-term').value = previousSearchTerm
}

//init app
function init() {
    switch (global.currentPage) {
        case URL + '/':
        case URL + '/index.html':
            displayPopularMovies();
            displaySlider();
            break;
        case URL + '/shows.html':
            displayPopularShows();
            break;
        case URL + '/movie-details.html':
            displayMovieDetails();
            break;
        case URL + '/tv-details.html':
            displayShowDetails();
            break;
        case URL + '/search.html':
            //previousSearch();
            //console.log(previousSearchTerm);
            search();
            break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
