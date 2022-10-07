import './css/styles.css';
import debounce from './modules/debounce';
import fetchCountries from './fetchCountries';
import countryTempl from './templates/country.hbs';
import countriesTempl from './templates/countries.hbs';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
};
refs.input.addEventListener(
  'input',
  debounce(getInputCountryName, DEBOUNCE_DELAY)
);

function getInputCountryName(e) {
  clearRender();
  let countryName = e.target.value;
  if (!countryName.length) {
    return;
  }

  fetchCountries(countryName).then(renderCountryCard).catch(onFetchError);
}

function renderCountryCard(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  } else if (countries.length === 1) {
    let markup = countryTempl(...countries);
    refs.countryList.classList.add('hidden');
    refs.countryCard.innerHTML = markup;
  } else if (countries.length > 1 && countries.length < 10) {
    let markup = countriesTempl(countries);
    refs.countryList.classList.remove('hidden');
    refs.countryList.innerHTML = markup;
  }
}

function clearRender() {
  refs.countryList.innerHTML = '';
  refs.countryCard.innerHTML = '';
}

function onFetchError() {
  Notiflix.Notify.failure(
    'Too many matches found. Please enter a more specific name.'
  );
}
