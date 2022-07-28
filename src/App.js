import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
//import Clarifai from 'clarifai';
import './App.css';

function App() {
  // const app = new Clarifai.App({
  //   apiKey: 'ad8f48f499b847ad9403887a80cda19e'
  //  });

    const [input, setInput] = React.useState('')
    const [imageURL, setImageURL] = React.useState('')
    const [box, setBox] = React.useState({})

    function calculateFaceLocation(data) {
      const parsed = JSON.parse(data)
      const clarifaiFace = parsed.outputs[0].data.regions[0].region_info.bounding_box
      const image = document.getElementById('inputimage')
      const width = Number(image.width)
      const height = Number(image.height)
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    }

    function displayFaceBox(box) {
      console.log(box)
      setBox({box: box})
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
      </div>
      
    );
}


export default App;
