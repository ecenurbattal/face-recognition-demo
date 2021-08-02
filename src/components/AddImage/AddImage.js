import React, { useState } from 'react'
import { getFullFaceDescriptions } from '../../services/faceapi';
import { createDescription } from '../../services/fakeapi';

const AddImage = () => {

    const [newUser,setNewUser] = useState({
        name:'',
        descriptors:[]
    })

    const [drawBox,setDrawBox] = useState(null);
    const [imageUrl,setImageUrl] = useState();

    const create = async () => {
        try {
            await createDescription(newUser)
            //console.log(data);
            alert('Resim Eklendi');
        } catch (error) {
            console.log(error)
        }
    }

    const handleFileChange = async (event) => {
        setImageUrl(URL.createObjectURL(event.target.files[0]))
        //handleImage();
        const data = await getFullFaceDescriptions(URL.createObjectURL(event.target.files[0]));
        if(!!data){
            drawDetection(data.map(fd => fd.detection))
            setNewUser({
                ...newUser,
                descriptors:data.map(fd => Object.values(fd.descriptor))
            })
          //drawDetection(data.map(fd => fd.detection))
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
        <div>
            <input
            id="myFileUpload"
            type="file"
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png"
            />
            <label>İsim giriniz: </label>
            <input
                type='text'
                onChange={(event) => setNewUser({...newUser,name:event.target.value})}
            />
            <button type='button' onClick={() => create()}>
                Resmi Ekle
            </button>
             <div style={{position:'relative'}}>
            <div style={{position:'absolute'}}>
            <img src={imageUrl} alt='imageUrl'/>
            </div>
            {!!drawBox ? drawBox : null}
            </div>
        </div>
    )
}

export default AddImage
