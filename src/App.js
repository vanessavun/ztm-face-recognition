import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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
      enable: false,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 900,
      },
      value: 80,
    },
    opacity: {
      value: 0.2,
    },
    shape: {
      type: "star",
    },
    size: {
      value: { min: 1, max: 4 },
    },
  },
};

const particlesInit = async (main) => {
	// console.log(main);
	await loadFull(main);
};

const particlesLoaded = (container) => {
	// console.log(container);
};

const initialState = {
    input: '',
    imageURL: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
}

class App extends React.Component {

  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
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

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    //fetch result from Face Recognition API
    fetch("https://face-recognition-api-b5ey.onrender.com/imageurl", {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.input
            })
    })
    .then(result => result.json())
      .then(result => {
        if (result) {
          fetch('https://face-recognition-api-b5ey.onrender.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(result => result.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(console.log)
        }
      this.displayFaceBox(this.calculateFaceLocation(result))
      })  
      .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        { route === 'home' 
        ? <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries} />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit} 
            />
            <FaceRecognition 
              imageURL={imageURL}
              box={box}
            />
          </div>
        : (
            route === 'signin' 
            ? <Signin 
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange} /> 
            : <Register 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange} />
          )
        
        }
        
        <Particles
          id="tsparticles"
          options={options}
          init={particlesInit}
          loaded={particlesLoaded}
        />
      </div>
      
    );
  }
  
}


export default App;
