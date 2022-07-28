import React from 'react';
import './FaceRecognition.css';

export default function FaceRecognition({ imageURL, box }) {
    const styles = {
        top: box.topRow, 
        right: box.rightCol, 
        bottom: box.bottomRow, 
        left: box.leftCol
    }

    console.log("FaceRecognition box: ", box)
    console.log("FaceRecognition box topRow: ", box.topRow)

    return (
        <div className='center ma'>
            <div className='absolute mt2'>
            <img id="inputimage" alt="" src={imageURL} className="mt3" width="500px" height="auto" />
            <div className='bounding-box' style={styles}></div>
            </div>
        </div> 
    )
}