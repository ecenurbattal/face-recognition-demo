import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div style={{display:'flex',flexDirection:'column'}}>
            <Link to='/description'>Resim Ekle</Link>
            <Link to='/recognition'>Resim Tanıt</Link>
        </div>
    )
}

export default Home
