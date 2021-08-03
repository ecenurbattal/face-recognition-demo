import React, { useEffect, useState } from 'react'
import { createMatcher, getFullFaceDescriptions, loadModels } from '../../services/faceapi';
import { getDescriptions } from '../../services/fakeapi';

const RecognizeImage = () => {


  const [drawBox, setDrawBox] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  const [faceMatcher, setFaceMatcher] = useState();
  const [dbFaces, setDbFaces] = useState(null);
  const [match, setMatch] = useState();
  const [descriptions, setDescriptions] = useState();
  const [fullDes, setFullDes] = useState();

  useEffect(() => {
    const init = async () => {
      //await loadModels();
      try {
        const { data } = await getDescriptions();
        console.log('dbFaces', data)
        //setFaceMatcher(createMatcher(data))
        setDbFaces(data)
      } catch (error) {
        console.log(error)
      }
    }
    init();
  }, [])

  useEffect(() => {
    const init = async () => {
      if (!!dbFaces) {
        setFaceMatcher(createMatcher(dbFaces))
      }
    }
    init();
  }, [dbFaces])

  useEffect(() => {
    const init = () => {
      if (!!descriptions && !!faceMatcher) {
        console.log('description', descriptions)
        let temp = descriptions.map(desc => faceMatcher.findBestMatch(desc))
        console.log(temp)
        setMatch(temp)
      }
    }
    init();
  }, [descriptions, faceMatcher])

  const handleFileChange = async (event) => {
    await setImageUrl(URL.createObjectURL(event.target.files[0]))
    const data = await getFullFaceDescriptions(URL.createObjectURL(event.target.files[0]));
    if (!!data) {
      drawDetection(data.map(fd => fd.detection))
      console.log(data.map(fd => fd.descriptor))
      // setMatch(faceMatcher.findBestMatch(data.map(fd => fd.descriptor.map(item => item.descriptor))))
      setDescriptions(data.map(fd => fd.descriptor))
      // setFullDes(data)
    }
  }

  const drawDetection = (detections) => {
    if (!!detections) {
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
            >
              {!!match ? (
                <p
                  style={{
                    backgroundColor: 'blue',
                    border: 'solid',
                    borderColor: 'blue',
                    width: _W,
                    marginTop: 0,
                    color: '#fff',
                    transform: `translate(-3px,${_H}px)`
                  }}
                >
                  {match[i]._label}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
      setDrawBox(temp);
    }
  }

  return (
    <div>
      <input
        id="myFileUpload"
        type="file"
        onChange={handleFileChange}
        accept=".jpg, .jpeg, .png"
      />
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute' }}>
          <img src={imageUrl} alt='imageUrl' />
        </div>
        {!!drawBox ? drawBox : null}
      </div>
    </div>
  )
}

export default RecognizeImage
