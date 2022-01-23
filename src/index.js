import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiServise from "./js/fetch_API.js";
import markup from './templates/markup.hbs';
import LoadBtn from './js/button';

const refs = {
    formEl: document.querySelector("#search-form"),
    galleryEl: document.querySelector(".gallery"),
}
const newApiServise = new ApiServise();

const loadMoreBtn = new LoadBtn({
  selector: ".load-more",
  hidden: true,
});

let counter = 0;

refs.formEl.addEventListener("submit", onFormElSubmit);
loadMoreBtn.refs.button.addEventListener("click", fetchImages);

function onFormElSubmit(e) { 
    e.preventDefault();

    newApiServise.searchQuery = e.target.elements.searchQuery.value;

    galleryReset();
    
    fetchImages()
        .then(warningOnSuccsess)
        .catch(console.log);
}

function fetchImages() { 
    loadMoreBtn.hide();

    return newApiServise.getImages()
        .then(({ data }) => {
            if (data.totalHits === 0) { 
                return warningOnFail();
            }

            newApiServise.incrementPage();

            loadMoreBtn.show();
            loadMoreBtn.enable();

            renderMarkup(data.hits);
            
            const totalHits = data.totalHits;
            if ((totalHits - counter) <= 40) { 
                warningOnEndOfCollection()
                loadMoreBtn.hide();
            }
            counter += 40;

            return totalHits;
        })
        .catch(console.log);
}

function renderMarkup(images) {
    refs.galleryEl.insertAdjacentHTML('beforeend', markup(images));
    let lightbox = new SimpleLightbox('.gallery a', { 'animationSpeed': "250" });
    
}

function warningOnFail() {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function warningOnSuccsess(totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
}

function warningOnEndOfCollection(totalHits) {
    Notify.warning("We're sorry, but you've reached the end of search results.");
}

function galleryReset() {
    refs.galleryEl.innerHTML = '';
    newApiServise.resetPage();
    counter = 0;
}