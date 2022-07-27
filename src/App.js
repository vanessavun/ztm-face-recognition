import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import React from 'react';

function App() {
    const [input, setInput] = React.useState('')

    function onInputChange(event) {
      console.log(event.target.value)
    }

    function onButtonSubmit() {
      console.log('clicked')
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
        {/* <FaceRecognition onInputChange={this.onInputChange} />  */}
      </div>
      
    );
}


export default App;
