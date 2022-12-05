import React from 'react';
import './FaceRecognition.css';

export default function FaceRecognition({ imageURL, boxes }) {
    const styles = {
        top: box.topRow, 
        right: box.rightCol, 
        bottom: box.bottomRow, 
        left: box.leftCol
    }


    return (
        <div className='center ma'>
            <div className='absolute mt2'>
            <img id="inputimage" alt="" src={imageURL} className="mt3" width="500px" height="auto" />
            {boxes.map((box,i) => {
                return(
                    <div key={i}className='bounding-box' style={styles}></div>
                )
            })}
            </div>
        </div> 
    )
}