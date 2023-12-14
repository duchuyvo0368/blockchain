import React, {useEffect, useState} from 'react';
import './item.css'
import creator from '../../assets/seller2.png'
import item from '../../assets/item1.png'
import {useParams} from "react-router";
import axios from "axios";
import abiNFTMarketplace from "../../ABI/abiNFTMarketplace.json"
import abiNFTNumber from "../../ABI/abiNFTNumber.json"
import {nftMarketplaceAddress, nftNumber} from '../../utils/utils'
import Web3 from "web3";
import Web3Modal from 'web3modal'
import connect from "../../utils/auth";
import {MetaMaskAvatar} from "react-metamask-avatar";

const web3 = new Web3('http://localhost:7545');

const Item = () => {
    const {tokenId} = useParams();
    const [productDetail, setProductDetail] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            try {
                // Assuming you have a Web3 instance and ABI definitions for your contracts
                const contractNftMarketplace = new web3.eth.Contract(abiNFTMarketplace, nftMarketplaceAddress);
                const contractNFTNumber = new web3.eth.Contract(abiNFTNumber, nftNumber);

                const tokenURI = await contractNFTNumber.methods.tokenURI(tokenId).call();
                const productInfo = await contractNftMarketplace.methods.getReverseTokenDetails(tokenId).call();
                const address = await contractNFTNumber.methods.ownerOf(tokenId).call();
                const meta = await axios.get(tokenURI);

                const productDetail = {
                    id: productInfo['0'],
                    addressSeller: address,
                    images: meta.data.image,
                    name: meta.data.nftname,
                    description: meta.data.description,
                    price: parseInt(productInfo['2']),
                    isSold: productInfo['3'],
                };

                setProductDetail(productDetail);
            } catch (error) {
                console.error('Error fetching NFT details:', error);
            }
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
            const receipt = await contractNftMarketplace.methods.buyItem(productDetail.id).send({
                from: account,
                value: web3.utils.toWei(`${productDetail.price}`, 'ether')
            });
            console.log('Transaction Receipt:', receipt);
        } catch (error) {
            console.error( error);
        }

    };
    const cancelSale = async () => {
        try {
            const {account, web3} = await connect()
            if (!account) {
                console.log('Please connect your wallet');
                return;
            }
            const contractNftMarketplace = new web3.eth.Contract(abiNFTMarketplace, nftMarketplaceAddress);
            const receipt = await contractNftMarketplace.methods.cancelSale(productDetail.id).send({
                from: account,
            });
            console.log('Transaction Receipt:', receipt);
        } catch (error) {
            console.error( error);
        }
    }
    if (!productDetail) {
        return <p>Loading...</p>;
    }



    return (
        <div className='item section__padding'>
            <div className="item-image">
                <img src={`${productDetail.images}`} alt="item" />
            </div>
            <div className="item-content">
                <div className="item-content-title">
                    <h1>{productDetail.name}</h1>
                    <p>From <span>{productDetail.price} ETH</span> ‧ 20 of 25 available</p>
                </div>
                <div className="item-content-creator">
                    <p>SellerAddress</p>
                    <div style={{width:200,height:30, border: '1px solid #000',paddingBottom:10,paddingLeft:5, borderRadius: '20px' }}>
                        <MetaMaskAvatar address={productDetail.addressSeller} size={34} />
                        <p className="address">{productDetail.addressSeller}</p>
                    </div>

                </div>
                <div className="item-content-detail">
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                        the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                        of type and scrambled it to make a type specimen book</p>
                </div>
                <div className="item-content-buy">
                    <button className="primary-btn" onClick={handleBuy}>Buy For {productDetail.price} ETH</button>
                    <button className="secondary-btn" onClick={cancelSale}>Cancel Sale</button>
                </div>
            </div>
        </div>
    )
};

export default Item;
