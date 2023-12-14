import React, {useEffect, useState} from 'react';
import './profile.css'
import profile_banner from '../../assets/profile_banner.png'
import profile_pic from '../../assets/profile.jpg'
import Bids from '../../components/bids/Bids'
import MyItem from "../../components/myitem/MyItem";
import OnSales from "../onsale/OnSales";
import {MetaMaskAvatar} from "react-metamask-avatar";
import connect from "../../utils/auth";

const Profile = () => {
    const [toggleMenu, setToggleMenu] = useState(false)
    const [user, setUser] = useState(false)
    const [account, setAccount] = useState(null)


    useEffect(() => {
        const storedAccount = localStorage.getItem('userAccount');
        if (storedAccount) {
            setUser(true);
            setAccount(storedAccount);
        }
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                setAccount(accounts[0]);
            });
        }
    }, []);
  return (
    <div className='profile section__padding'>
      <div className="profile-top">
        <div className="profile-banner">
          <img src={profile_banner} alt="banner" />
        </div>
        <div className="profile-pic">
            <MetaMaskAvatar className="avatar" address={account} size={130}/>
            <h3>{account}</h3>
        </div>
      </div>
      <div className="profile-bottom">
        <div className="profile-bottom-input">
          <input type="text" placeholder='Search Item here' />
          <select>
            <option>Recently Listed</option>
            <option>Popular</option>
            <option>Low to High</option>
            <option>High to Low</option>
          </select>
        </div>
        <MyItem  title="Item" />
      </div>
    </div>
  );
};

export default Profile;
