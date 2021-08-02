import { useEffect, useState } from 'react';
import './App.css';
import { getFullFaceDescriptions, loadModels } from './services/faceapi';
import * as faceapi from 'face-api.js';
import { drawDetections, drawFaceLandmarks } from 'face-api.js/build/commonjs/draw';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import AddImage from './components/AddImage/AddImage';
import RecognizeImage from './components/RecognizeImage/RecognizeImage';


function App() {

  const [imageUrl,setImageUrl] = useState();
  //const [detections,setDetections] = useState();
  const [drawBox, setDrawBox] = useState(null);

  // const handleImage = async () => {
    
  // }

  useEffect(() => {
    const init = async () => {
      await loadModels();
    }
    init();
  },[])

  const handleFileChange = async (event) => {
    setImageUrl(URL.createObjectURL(event.target.files[0]))
    //handleImage();
    const data = await getFullFaceDescriptions(URL.createObjectURL(event.target.files[0]));
    if(!!data){
      drawDetection(data.map(fd => fd.detection))
      //setDetections(data.map(fd => fd.detection))
    }
    //drawDetections('overlay', data.map(res => res.detection), {withScore:false})
    //drawFaceLandmarks('overlay', data.map(res => res.landmarks), {lineWidth:4, color:'red'})
  }

  const drawDetection = (detections) => {
    if(!!detections) {
      let temp = detections.map((detection, i) => {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                border: 'solid',
                borderColor: 'blue',
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`
              }}
            />
          </div>
        );
      });
      setDrawBox(temp)
    }
  }

  return (
    <div className="App">
       <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/description' component={AddImage}/>
        <Route exact path='/recognition' component={RecognizeImage}/>
      </Switch>
    </div>
    //  <input
    //     id="myFileUpload"
    //     type="file"
    //     onChange={handleFileChange}
    //     accept=".jpg, .jpeg, .png"
    //   />
    //   {/* <canvas
    //     id='overlay'
    //   /> */}
    //   <div style={{position:'relative'}}>
    //     <div style={{position:'absolute'}}>
    //       <img src={imageUrl} alt='imageUrl'/>
    //     </div>
    //     {!!drawBox ? drawBox : null}
    //   </div>
  );
}

export default App;
