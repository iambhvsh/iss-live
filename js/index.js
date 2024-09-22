const NASA_API_KEY = '0VGbAi70CllmfYst3s4IOhdzPJBpWDUwHvniB2zP';
const ISS_API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const NASA_NEWS_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=10`;
const ISS_CREW_API_URL = 'http://api.open-notify.org/astros.json';

let lastNewsUpdate = 0;

async function getISSData() {
  try {
    const response = await fetch(ISS_API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ISS data:', error);
  }
}

async function getNASANews() {
  try {
    const response = await fetch(NASA_NEWS_API_URL);
    const data = await response.json();
    return data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
  } catch (error) {
    console.error('Error fetching NASA news:', error);
  }
}

async function getISSCrew() {
  try {
    const response = await fetch(ISS_CREW_API_URL);
    const data = await response.json();
    return data.people.filter(person => person.craft === 'ISS');
  } catch (error) {
    console.error('Error fetching ISS crew data:', error);
  }
}

function updateISSPosition(lat, lng) {
  const mapWidth = document.getElementById('map-container').offsetWidth;
  const mapHeight = document.getElementById('map-container').offsetHeight;

  const x = (lng + 180) * (mapWidth / 360);
  const y = (90 - lat) * (mapHeight / 180);

  const issMarker = document.getElementById('iss-marker');
  issMarker.style.left = `${x}px`;
  issMarker.style.top = `${y}px`;
}

function updateISSInfo(data) {
  document.getElementById('iss-latitude').textContent = data.latitude.toFixed(4) + '°';
  document.getElementById('iss-longitude').textContent = data.longitude.toFixed(4) + '°';
  document.getElementById('iss-altitude').textContent = data.altitude.toFixed(2) + ' km';
  document.getElementById('iss-velocity').textContent = data.velocity.toFixed(2) + ' km/h';
}

function calculateNextSunriseSunset(lat, lng) {
  // This is a simplified calculation and may not be 100% accurate
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const sunriseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);
  const sunsetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);

  // Adjust times based on latitude and day of year (simplified)
  const latAdjustment = (lat / 90) * 3 * 60 * 60 * 1000; // 3 hours max adjustment
  const dayAdjustment = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 2 * 60 * 60 * 1000; // 2 hours max adjustment

  sunriseTime.setTime(sunriseTime.getTime() + latAdjustment - dayAdjustment);
  sunsetTime.setTime(sunsetTime.getTime() - latAdjustment + dayAdjustment);

  if (now > sunriseTime) {
    sunriseTime.setDate(sunriseTime.getDate() + 1);
  }
  if (now > sunsetTime) {
    sunsetTime.setDate(sunsetTime.getDate() + 1);
  }

  return { sunrise: sunriseTime, sunset: sunsetTime };
}

function updateSunriseSunset(lat, lng) {
  const { sunrise, sunset } = calculateNextSunriseSunset(lat, lng);
  document.getElementById('next-sunrise').textContent = sunrise.toLocaleTimeString();
  document.getElementById('next-sunset').textContent = sunset.toLocaleTimeString();
}

function updateDayNightStatus(lat, lng) {
  const now = new Date();
  const { sunrise, sunset } = calculateNextSunriseSunset(lat, lng);
  const isDaytime = now > sunrise && now < sunset;

  const statusElement = document.getElementById('day-night-status');
  const iconElement = document.getElementById('day-night-icon');

  if (isDaytime) {
    statusElement.textContent = 'Day';
    iconElement.setAttribute('name', 'sunny-outline');
  } else {
    statusElement.textContent = 'Night';
    iconElement.setAttribute('name', 'moon-outline');
  }
}

function updateSpaceNews(newsData) {
  const newsElement = document.getElementById('space-news');
  newsElement.innerHTML = '';

  newsData.slice(0, 10).forEach(item => {
    const newsItem = document.createElement('ion-item');
    newsItem.classList.add('news-item');
    newsItem.innerHTML = `
      <ion-label>
        <h3>${item.title}</h3>
        <p>${new Date(item.date).toLocaleDateString()}</p>
        <p>${item.explanation.substring(0, 100)}...</p>
      </ion-label>
    `;
    newsElement.appendChild(newsItem);
  });
}

function updateISSCrew(crewData) {
  const crewElement = document.getElementById('iss-crew');
  crewElement.innerHTML = '';

  crewData.forEach(astronaut => {
    const crewItem = document.createElement('ion-item');
    crewItem.innerHTML = `
      <ion-icon name="person-outline" slot="start"></ion-icon>
      <ion-label>${astronaut.name}</ion-label>
    `;
    crewElement.appendChild(crewItem);
  });
}

async function updateAll() {
  const issData = await getISSData();
  if (issData) {
    updateISSPosition(issData.latitude, issData.longitude);
    updateISSInfo(issData);
    updateSunriseSunset(issData.latitude, issData.longitude);
    updateDayNightStatus(issData.latitude, issData.longitude);
  }

  const currentTime = Date.now();
  if (currentTime - lastNewsUpdate >= 3600000) { // 3600000 ms = 1 hour
    const newsData = await getNASANews();
    if (newsData) {
      updateSpaceNews(newsData);
      lastNewsUpdate = currentTime;
    }
  }

  const crewData = await getISSCrew();
  if (crewData) {
    updateISSCrew(crewData);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateAll();
  setInterval(updateAll, 5000); // Update ISS data every 5 seconds

  const refresher = document.getElementById('refresher');
  refresher.addEventListener('ionRefresh', async () => {
    await updateAll();
    refresher.complete();
  });

  const streamSelect = document.getElementById('streamSelect');
  streamSelect.addEventListener('ionChange', (e) => {
    const liveStream = document.getElementById('liveStream');
    liveStream.src = e.detail.value;
  });
});

// Set platform to iOS
(function() {
  document.documentElement.classList.add('ios');
})();
