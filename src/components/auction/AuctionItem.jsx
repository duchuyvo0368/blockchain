import React, {useEffect, useState} from 'react'
import './auctionitem.css'
import {AiFillHeart} from "react-icons/ai";
import bids1 from '../../assets/bids1.png'
import bids2 from '../../assets/item1.png'
import bids3 from '../../assets/bids3.png'
import bids4 from '../../assets/bids4.png'
import bids5 from '../../assets/bids5.png'
import bids6 from '../../assets/bids6.png'
import bids7 from '../../assets/bids7.png'
import bids8 from '../../assets/bids8.png'
import {Link} from 'react-router-dom';
import {nftAuction, nftMarketplaceAddress, nftNumber} from '../../utils/utils'
import axios from "axios";
import abiNFTAuction from "../../ABI/abiNFTAuction.json"
import abiNFTNumber from "../../ABI/abiNFTNumber.json"
import Web3 from "web3";
import connect from "../../utils/auth";
import auction from "../../pages/auction/Auction";

const AuctionItem = ({title}) => {


    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {account, web3} = await connect()
                const contractNFTNumber = new web3.eth.Contract(
                    abiNFTNumber,
                    nftNumber
                );
                const contractNFTAuction = new web3.eth.Contract(abiNFTAuction, nftAuction);

                const productInfo = await contractNFTAuction.methods
                    .getAuctionDetailsByAccount()
                    .call({from:account});
                const productsData = await Promise.all(
                    productInfo[0].map(async (tokenId, index) => {
                        const tokenURI = await contractNFTNumber.methods
                            .tokenURI(tokenId)
                            .call();
                        const meta = await axios.get(tokenURI);

                        return {
                            tokenID: tokenId,
                            addressSeller: productInfo[1][index],
                            images: meta.data.image,
                            name: meta.data.nftname,
                            price: parseInt(productInfo[2][index]),
                            isSold: productInfo[3][index],
                        };

                    })

                );

                setProducts(productsData);
                setLoading(false);


            } catch (error) {
                console.error('Error fetching data from blockchain:', error);
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

                                            <Link to={`/post/${product.tokenID}`}>
                                                <p className="bids-title">{product.name}</p>
                                            </Link>
                                        </div>
                                        <div className="bids-card-bottom">
                                            <p> {product.price} <span>ETH</span></p>
                                            <p><AiFillHeart/> 92</p>
                                        </div>
                                    </div>
                                </div>
                            )))
                    )}

                    <div className="card-column">
                        <div className="bids-card">
                            <div className="bids-card-top">
                                <img src={bids3} alt=""/>
                                <Link to={`/post/123`}>
                                    <p className="bids-title">Paint Color on Wall</p>
                                </Link>
                            </div>
                            <div className="bids-card-bottom">
                                <p>0.55 <span>ETH</span></p>
                                <p><AiFillHeart/> 55</p>
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

export default AuctionItem
