import React, {useEffect, useState} from 'react'
import './navbar.css'
import {RiMenu3Line, RiCloseLine} from 'react-icons/ri';
import logo from '../../assets/logo.png'
import {Link} from "react-router-dom";
import {MetaMaskAvatar} from 'react-metamask-avatar';
import connect from "../../utils/auth";
const Menu = () => (
    <>
        <Link to={`/OnSale`}><p>On Sale</p></Link>
        <Link to={`/profile/Rian`}><p>My Item</p></Link>
        <Link to={'/MyAuction'}><p>My Auction</p></Link>
    </>
)

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false)
    const [user, setUser] = useState(false)
    const [account, setAccount] = useState(null)

    const handleLogout = async () => {
        if (window.ethereum && window.ethereum.selectedAddress) {
            try {
                await window.ethereum.request({
                    method: 'eth_requestAccounts',
                    params: [
                        {
                            eth_accounts: {},
                        },
                    ],
                });

                // Set user state to false
                setUser(false);
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
    }
    const handleLogin = async () => {
        const connection = await connect();
        if (connection.account && connection.web3) {
            setUser(true);
            setAccount(connection.account);
            localStorage.setItem('userAccount', connection.account);
        }
    }

    // Lắng nghe sự kiện thay đổi tài khoản từ Metamask
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
        <div className='navbar'>
            <div className="navbar-links">
                <div className="navbar-links_logo">
                    <img src={logo} alt="logo"/>
                    <Link to="/">
                        <h1>CryptoKet</h1>
                    </Link>
                </div>
                <div className="navbar-links_container">
                    <input type="text" placeholder='Search Item Here' autoFocus={true}/>
                    <Menu/>
                    <Link to="/"><p onClick={handleLogout}>Logout</p></Link>
                </div>
            </div>
            <div className="navbar-sign">
                {user ? (
                    <>
                        <div style={{display: 'flex', alignItems: 'center', border: '1px solid ', borderRadius: '25px', padding: '4px'}}>
                            <p className="address-account" style={{marginRight: '10px'}}>{account}</p>
                            <MetaMaskAvatar className="avatar" address={account} size={34}/>
                        </div>

                        <Link to="/create">
                            <button type='button' className='primary-btn'>Create</button>
                        </Link>
                    </>
                ) : (
                    <>
                        <button type='button' className='primary-btn' onClick={handleLogin}>Connect</button>
                    </>
                )}
            </div>
            <div className="navbar-menu">
                {toggleMenu ?
                    <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)}/>
                    : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)}/>}
                {toggleMenu && (
                    <div className="navbar-menu_container scale-up-center">
                        <div className="navbar-menu_container-links">
                            <Menu/>
                        </div>
                        <div className="navbar-menu_container-links-sign">
                            {user ? (
                                <>
                                    <Link to="/create">
                                        <button type='button' className='primary-btn'>Create</button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
