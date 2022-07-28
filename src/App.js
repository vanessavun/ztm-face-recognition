import React, { useCallback } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

import './App.css';

const options = {
  bounce: false,
  fullScreen: true,
  fpsLimit: 120,
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.2,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
};

function App() {
  const [input, setInput] = React.useState('')
  const [imageURL, setImageURL] = React.useState('')
  const [box, setBox] = React.useState({})

  function calculateFaceLocation(data) {
    const parsed = JSON.parse(data);
    const clarifaiFace = parsed.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  function displayFaceBox(box) {
    console.log("Display Facebox: ", box)
    setBox(box)
  }

  function onInputChange(event) {
    setInput(event.target.value)
  }

  function onButtonSubmit() {
    setImageURL(input)
    const USER_ID = 'nessabyte';
    const PAT = '63d9310bff304a7486be5471c990b3fc';
    const APP_ID = 'my-first-application';
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';    
    const IMAGE_URL = input;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.text())
        .then(result => displayFaceBox(calculateFaceLocation(result)))
        .catch(error => console.log('error', error));
  }

  const particlesInit = useCallback(async(main) => {
    await loadFull(main);
  }, []);

  const particlesLoaded = useCallback((container) => {
    console.log(container)
  }, [])

  return (
    <div className="App">
      
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm 
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit} 
      />
      <FaceRecognition 
        imageURL={imageURL}
        box={box}
      />
      <Particles
        id="tsparticles"
        options={options}
        init={particlesInit}
        loaded={particlesLoaded}
      />
    </div>
    
  );
}


export default App;
