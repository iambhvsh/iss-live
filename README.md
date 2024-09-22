# ISS Tracker README

## Overview
The ISS Tracker is a web application that provides real-time information about the International Space Station (ISS), including its current location, altitude, velocity, crew members, and upcoming sunrise and sunset events. The application uses various APIs to fetch data and displays it in an intuitive interface built with the Ionic framework.

## Features
- Real-time location tracking of the ISS on a world map.
- Display of current latitude, longitude, altitude, and velocity of the ISS.
- Information about whether it’s daytime or nighttime at the ISS's current location.
- Upcoming sunrise and sunset times.
- List of current astronauts aboard the ISS.
- Live streaming of views from the ISS.
- Space news updates.
- User discussion section.

## Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript, Ionic Framework
- **APIs:** 
  - Where The ISS At?
  - NASA APOD (Astronomy Picture of the Day)
  - Open Notify (ISS Crew)

## Installation
To run this application locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/iss-tracker.git
   cd iss-tracker
   ```
2. Open `index.html` in your browser.

## Code Structure
The main HTML file is structured as follows:

```html
<!DOCTYPE html>
<html lang="en" mode="ios">
<head>
  ...
</head>
<body>
  <ion-app>
    <ion-header translucent="true">
      ...
    </ion-header>
    <ion-content fullscreen="true">
      ...
    </ion-content>
  </ion-app>
  <script>
    ...
  </script>
</body>
</html>
```

### Key Components
- **Header:** Displays the title of the application.
- **Content:**
  - **Map:** Displays the current location of the ISS.
  - **Real-time Data Cards:** Show latitude, longitude, altitude, and velocity.
  - **Day/Night Status:** Indicates whether it's currently day or night.
  - **Sunrise/Sunset Times:** Displays the next sunrise and sunset times.
  - **Crew Information:** Lists current astronauts aboard the ISS.
  - **Live Stream:** Allows users to select and view live streams from the ISS.
  - **Discussion Section:** Integrated discussion platform for user interactions.
  - **Space News:** Fetches and displays the latest space news updates.
  
### CSS Styling
Custom styles are defined in the `<style>` section, using CSS variables for theming and responsive design principles to ensure compatibility across devices.

## Scripts
The application fetches data from the APIs and updates the UI using JavaScript. Key functionalities include:
- Fetching ISS location and status.
- Calculating next sunrise and sunset times based on ISS latitude and longitude.
- Updating the live stream based on user selection.

## API Keys
Make sure to set your NASA API key in the JavaScript section:
```javascript
const NASA_API_KEY = 'YOUR_API_KEY';
```

## Usage
- Open the application in a web browser.
- The application will automatically fetch and display real-time ISS data.
- Use the refresher to update data manually.
- Select different live streams from the dropdown menu to change the view.

## Credits
- **Developer:** Bhavesh Patil (iambhvsh)
- **Version:** 1.0

## License
This project is licensed under the MIT License. Feel free to modify and use it as needed.
