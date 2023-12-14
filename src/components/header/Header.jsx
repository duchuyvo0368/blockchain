import React from 'react'
import './header.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import seller1 from '../../assets/seller1.jpg'
// import seller2 from '../../assets/seller2.png'
// import seller3 from '../../assets/seller3.png'
// import seller4 from '../../assets/seller4.png'
// import seller5 from '../../assets/seller5.png'
// import seller6 from '../../assets/seller6.jpg'
// import verify from '../../assets/verify.png'
import coin from '../../assets/coin.png'
// import { Link  } from 'react-router-dom';
const Header = () => {

  return (
    <div className='header section__padding'>
      <div className="header-content">
        <div>
          <h1>Discover, collect, and sell extraordinary NFTs</h1>
          <img className='shake-vertical' src={coin} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Header
