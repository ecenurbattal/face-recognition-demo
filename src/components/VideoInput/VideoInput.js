// import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Webcam from 'react-webcam';
import React, { useEffect, useState } from 'react'
import { createMatcher, getFullFaceDescriptions } from '../../services/faceapi';
import { getDescriptions } from '../../services/fakeapi';
import * as faceapi from 'face-api.js';

const VideoInput = () => {
    // const JSON_PROFILE = require('../db.json');

    const [drawBox, setDrawBox] = useState(null);
    const [dbFaces, setDbFaces] = useState(null);
    const [faceMatcher, setFaceMatcher] = useState();
    const [descriptions, setDescriptions] = useState();
    const [facingMode, setFacingMode] = useState();
    const [webcamRef, setWebcamRef] = useState();
    const [match, setMatch] = useState();
    const [videoConstraints, setVideoConstraints] = useState();
    const [camera, setCamera] = useState();
    const [detections, setDetections] = useState();

    const WIDTH = 420;
    const HEIGHT = 420;
    const inputSize = 160;

    useEffect(() => {
        const init = async () => {
            //await loadModels();
            setWebcamRef(React.createRef());
            try {
                const { data } = await getDescriptions();
                console.log('dbFaces', data)
                //setFaceMatcher(createMatcher(data))
                await setDbFaces(data)

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
                setInputDevice();
            }
        }
        init();

    }, [dbFaces])

    useEffect(() => {
        if (!!facingMode) {
            setVideoConstraints({
                width: WIDTH,
                height: HEIGHT,
                facingMode: facingMode
            })

            if (facingMode === 'user') {
                setCamera('Front')
                // camera = 'Front';
            } else {
                setCamera('Back')
                // camera = 'Back';
            }
        }
    }
        , [facingMode])

    useEffect(() => {
        const interval = setInterval(() => {
            capture();
        }, 1500);
        return () => clearInterval(interval);
    }, [webcamRef])


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


    useEffect(() => {
        const drawDetection = () => {
            // let videoConstraints = null;
            // let camera = '';

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
                                {!!match && !!match[i] ? (
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
        drawDetection();
    }, [detections, match])

    const setInputDevice = () => {
        navigator.mediaDevices.enumerateDevices().then(async devices => {
            let inputDevice = await devices.filter(
                device => device.kind === 'videoinput'
            );
            if (inputDevice.length < 5) {
                await setFacingMode('user')

            } else {
                await setFacingMode('environment')

            }

        });
    };


    const capture = async () => {
        // const contentType = 'image/png'
        // const blob = b64toBlob(webcamRef.current.getScreenshot(), contentType);
        // const blobUrl = URL.createObjectURL(blob);
        // URL.createObjectURL(new Blob([/*whatever content*/], { type: 'text/plain' }));
        //URL.createObjectURL(new Blob([webcamRef.current.getScreenshot()], { type: 'image/*' }))//önemli olabilir
        if (!!webcamRef.current) {
            await getFullFaceDescriptions(
                webcamRef.current.getScreenshot(),
                inputSize
            ).then(fullDesc => {
                if (!!fullDesc) {
                    setDetections(fullDesc.map(fd => fd.detection))
                    console.log(fullDesc.map(fd => fd.descriptor))
                    setDescriptions(fullDesc.map(fd => fd.descriptor))
                }
            }).catch((e) => {
                console.error(e)
            })
        };

    }





    return (
        <div
            className="Camera"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <p>Camera: {camera}</p>
            <div
                style={{
                    width: WIDTH,
                    height: HEIGHT
                }}
            >
                <div style={{ position: 'relative', width: WIDTH }} >
                    {!!videoConstraints ? (
                        <div style={{ position: 'absolute' }}>
                            <Webcam
                                audio={false}
                                width={WIDTH}
                                height={HEIGHT}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                            />
                        </div>
                    ) : null}
                    {!!drawBox ? drawBox : null}
                </div>
            </div>
        </div>
    );

}

export default VideoInput;