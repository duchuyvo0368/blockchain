import React, {useEffect, useState} from 'react';
import './item_auction.css'
import creator from '../../assets/seller2.png'
import item from '../../assets/item1.png'
import {useParams} from "react-router";
import axios from "axios";
import abiNFTMarketplace from "../../ABI/abiNFTMarketplace.json"
import abiNFTNumber from "../../ABI/abiNFTNumber.json"
import {nftAuction, nftMarketplaceAddress, nftNumber} from '../../utils/utils'
import Web3 from "web3";
import Web3Modal from 'web3modal'
import connect from "../../utils/auth";
import abiNFTAuction from "../../ABI/abiNFTAuction.json";
import {MetaMaskAvatar} from "react-metamask-avatar";
import {Link} from "react-router-dom";

const web3 = new Web3('http://localhost:7545');

const ItemAuction = () => {
    const {tokenId} = useParams();
    const [productDetail, setProductDetail] = useState(null);
    const [price, setPrice] = useState('');

    useEffect(() => {
        const fetchData = async () => {

            const contractNFTAuction = new web3.eth.Contract(abiNFTAuction, nftAuction);
            const contractNFTNumber = new web3.eth.Contract(abiNFTNumber, nftNumber);
            const tokenURI = await contractNFTNumber.methods.tokenURI(tokenId).call();
            const address = await contractNFTNumber.methods.ownerOf(tokenId).call();
            const productInfo = await contractNFTAuction.methods.auctions(tokenId).call();
            const meta = await axios.get(tokenURI);

            const productDetail = {
                tokenId: productInfo['0'],
                highestBidders: productInfo['1'],
                address: address,
                images: meta.data.image,
                name: meta.data.nftname,
                description: meta.data.description,
                startingBids: parseInt(productInfo['3']),
                highestBids: parseInt(productInfo['2']),
                isSold: productInfo['3'],
            };
            setProductDetail(productDetail);
        };

        fetchData();
    }, [tokenId]);


    const handleBuy = async () => {
        try {
            const {account, web3} = await connect()
            if (!account) {
                console.log('Please connect your wallet');
                return;
            }
            const contractNftMarketplace = new web3.eth.Contract(abiNFTMarketplace, nftMarketplaceAddress);
            const contractNFTNumber = new web3.eth.Contract(abiNFTNumber, nftNumber);
            await contractNFTNumber.methods.approve(nftMarketplaceAddress, tokenId).send({from: account})
            await contractNftMarketplace.methods.putItemForSale(tokenId, price).send({from: account})
        } catch (error) {
            console.error(error);
        }


    };
    const handleAuctionClick = async () => {
        try {
            const {account, web3} = await connect()
            if (!account) {
                console.log('Please connect your wallet');
                return;
            }
            const contractNftAuction = new web3.eth.Contract(abiNFTAuction, nftAuction);
            await contractNftAuction.methods.bid(tokenId).send({
                from: account,
                value: web3.utils.toWei(`${price}`, 'ether')
            });
        } catch (error) {
            console.error(error);
        }
    };
    const cancelAuction=async() =>{
        try {
            const {account, web3} = await connect()
            if (!account) {
                console.log('Please connect your wallet');
                return;
            }
            const contractNftAuction = new web3.eth.Contract(abiNFTAuction, nftAuction);
            await contractNftAuction.methods.cancelAuction(tokenId).send({ from: account});
        } catch (error) {
            console.error(error);
        }
    }


    if (!productDetail) {
        return <p>Loading...</p>;
    }



    return (
        <div className='item section__padding'>
            <div className="item-image">
                <img src={`${productDetail.images}`} alt="item"/>
            </div>
            <div className="item-content">
                <div className="item-content-title">
                    <h1>{productDetail.name}</h1>
                    <p>StartingBids: <span>{productDetail.startingBids} ETH</span></p>
                    <p>HighestBids: <span>{productDetail.highestBids} ETH</span></p>
                </div>
                <div className="item-content-creator">
                    <p>Highest Bidders:</p>
                    <div style={{
                        width: 200,
                        height: 30,
                        border: '1px solid #000',
                        paddingBottom: 10,
                        paddingLeft: 5,
                        borderRadius: '20px'
                    }}>
                        <MetaMaskAvatar address={productDetail.highestBidders} size={34}/>
                        <p className="address">{productDetail.highestBidders}</p>
                    </div>
                    <p>Creater</p>
                    <div style={{
                        width: 200,
                        height: 30,
                        border: '1px solid #000',
                        paddingBottom: 10,
                        paddingLeft: 5,
                        borderRadius: '20px'
                    }}>
                        <MetaMaskAvatar address={productDetail.highestBidders} size={34}/>
                        <p className="address">{productDetail.address}</p>
                    </div>



                </div>

                <div className="item-content-detail">
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                        the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                        of type and scrambled it to make a type specimen book</p>
                </div>

                <div className="formGroup" >
                    <div className="twoForm">
                        <input type="text"  placeholder="Price"
                               onChange={(e) => setPrice(e.target.value)}/>
                    </div>
                </div>
                <div className="item-content-buy">
                    <button className="primary-btn" onClick={handleAuctionClick}>Auction</button>
                    <button className="secondary-btn" onClick={cancelAuction}>Cancel Auction</button>
                </div>

            </div>
        </div>
    )
};

export default ItemAuction;
