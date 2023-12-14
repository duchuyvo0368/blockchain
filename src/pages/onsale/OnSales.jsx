import React, {useEffect, useState} from 'react'
import './onsale.css'
import {AiFillHeart} from "react-icons/ai";
import bids1 from '../../assets/bids1.png'
import {Link} from 'react-router-dom';
import {nftMarketplaceAddress, nftNumber, nftAuction} from '../../utils/utils'
import abiNFTAuction from "../../ABI/abiNFTAuction.json"
import connect from "../../utils/auth";
import axios from "axios";
import Web3 from "web3";
import bids2 from "../../assets/bids2.png";
import bids3 from "../../assets/bids3.png";
import bids4 from "../../assets/bids4.png";
import bids5 from "../../assets/bids5.png";
import bids6 from "../../assets/bids6.png";
import bids7 from "../../assets/bids7.png";
import bids8 from "../../assets/bids8.png";
import abiNFTNumber from "../../ABI/abiNFTNumber.json";

const OnSales = ({title}) => {


    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    let productAll = {};
    useEffect(() => {
        const fetchData = async () => {

            try {
                const {account, web3} = await connect()

                const contractAuction = new web3.eth.Contract(abiNFTAuction, nftAuction);
                const contractNFTNumber = new web3.eth.Contract(abiNFTNumber, nftNumber);


                const auctionDetails = await contractAuction.methods.getAllAuctionDetails().call();
                const productsData = await Promise.all(
                    auctionDetails[0].map(async (tokenId, index) => {
                        const tokenURI = await contractNFTNumber.methods
                            .tokenURI(tokenId)
                            .call();
                        const meta = await axios.get(tokenURI);

                        return {
                            tokenID: tokenId,
                            address: auctionDetails[1][index],
                            images: meta.data.image,
                            name: meta.data.nftname,
                            highestBids: parseInt(auctionDetails[2][index]),
                            startingBids:parseInt(auctionDetails[3][index]),
                            isSold: auctionDetails[4][index],
                        };

                    })

                );
                setProducts(productsData);
                setLoading(false);


            } catch (error) {
                console.error('Error fetching NFT details:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='bids section__padding'>
            <div className="bids-container">
                <div className="bids-container-text">
                    <h1>{title}</h1>
                </div>
                <div className="bids-container-card">
                    {loading ? (
                        <p>Loading...</p>
                    ) : products.length === 0 ? (
                        <p>No products available</p>
                    ) : (
                        products.map((product) => (
                            !product.isSold && (
                                <div className="card-column">
                                    <div className="bids-card">
                                        <div className="bids-card-top">
                                            <img src={`${product.images}`} alt="" />

                                            <Link to={`/auction/${product.tokenID}`}>
                                                <p className="bids-title">{product.name}</p>
                                            </Link>
                                        </div>
                                        <div className="bids-card-bottom">
                                            <p> {product.startingBids} <span>ETH</span></p>
                                            <p><AiFillHeart/> 92</p>
                                        </div>
                                    </div>
                                </div>
                            )))
                    )}
                    <div className="card-column">
                        <div className="bids-card">
                            <div className="bids-card-top">
                                <img src={bids2} alt=""/>
                                <Link to={`/post/123`}>
                                    <p className="bids-title">Mountain Landscape</p>
                                </Link>
                            </div>
                            <div className="bids-card-bottom">
                                <p>0.20 <span>ETH</span></p>
                                <p><AiFillHeart/> 25</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-column">
                        <div className="bids-card">
                            <div className="bids-card-top">
                                <img src={bids3} alt=""/>
                                <Link to={`/post/123`}>
                                    <p className="bids-title">Paint Color on Wall</p>
                                </Link>
                            </div>
                            <div className="bids-card-bottom">
                                <p>{productAll.price} <span>ETH</span></p>
                                <p><AiFillHeart/> 55</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-column">
                        <div className="bids-card">
                            <div className="bids-card-top">
                                <img src={bids4} alt=""/>
                                <Link to={`/post/123`}>
                                    <p className="bids-title">Abstract Patern</p>
                                </Link>
                            </div>
                            <div className="bids-card-bottom">
                                <p>0.87 <span>ETH</span></p>
                                <p><AiFillHeart/> 82</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-column">
                        <div className="bids-card">
                            <div className="bids-card-top">
                                <img src={bids5} alt=""/>
                                <Link to={`/post/123`}>
                                    <p className="bids-title">White Line Grafiti</p>
                                </Link>
                            </div>
                            <div className="bids-card-bottom">
                                <p>0.09 <span>ETH</span></p>
                                <p><AiFillHeart/> 22</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-column">
                        <div className="bids-card">
                            <div className="bids-card-top">
                                <img src={bids6} alt=""/>
                                <Link to={`/post/123`}>
                                    <p className="bids-title">Abstract Triangle</p>
                                </Link>
                            </div>
                            <div className="bids-card-bottom">
                                <p>0.90 <span>ETH</span></p>
                                <p><AiFillHeart/> 71</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-column">
                        <div className="bids-card">
                            <div className="bids-card-top">
                                <img src={bids7} alt=""/>
                                <Link to={`/post/123`}>
                                    <p className="bids-title">Lake Landscape</p>
                                </Link>
                            </div>
                            <div className="bids-card-bottom">
                                <p>0.52 <span>ETH</span></p>
                                <p><AiFillHeart/> 63</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-column">
                        <div className="bids-card">
                            <div className="bids-card-top">
                                <img src={bids8} alt=""/>
                                <Link to={`/post/123`}>
                                    <p className="bids-title">Blue Red Art</p>
                                </Link>
                            </div>
                            <div className="bids-card-bottom">
                                <p>0.85 <span>ETH</span></p>
                                <p><AiFillHeart/> 66</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="load-more">
                <button>Load More</button>
            </div>
        </div>
    )
}

export default OnSales
