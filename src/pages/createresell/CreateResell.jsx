import './createresell.css';
import Image from '../../assets/Image.png';
import {useEffect, useState} from 'react';
import axios from 'axios';
import abiNFTNumber from "../../ABI/abiNFTNumber.json";
import {nftAuction, nftMarketplaceAddress, nftNumber} from "../../utils/utils";
import connect from "../../utils/auth";
import abiNFTMarketplace from "../../ABI/abiNFTMarketplace.json";
import {Contract} from "web3";
import {useParams} from "react-router";
import abiNFTAuction from "../../ABI/abiNFTAuction.json";


const CreateResell = () => {
    const {tokenId} = useParams();
    const [productDetail, setProductDetail] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const {account, web3} = await connect();
            const contractNFTAuction = new web3.eth.Contract(abiNFTAuction, nftAuction);
            const contractNFTNumber = new web3.eth.Contract(abiNFTNumber, nftNumber);
            const tokenURI = await contractNFTNumber.methods.tokenURI(tokenId).call();
            const meta = await axios.get(tokenURI);

            const productDetailData = {
                tokenId: tokenId,
                images: meta.data.image,
                name: meta.data.nftname,
                description: meta.data.description,
            };
            setProductDetail(productDetailData);
        };

        fetchData();
    }, [tokenId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
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

    return (
        <div className="create section__padding">
            <div className="create-container">
                <h1>Create new Item</h1>
                <p className="upload-file">Upload File</p>
                <div className="upload-img-show">
                    <h3>JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.</h3>
                    <img style={{width: 400, height: 200}} src={productDetail.images} alt="banner"/>
                    <p>Drag and Drop File</p>
                </div>
                <form className="writeForm" autoComplete="off" onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Name</label>
                        <input type="text" placeholder="Item Name" value={productDetail?.name} readOnly/>
                    </div>
                    <div className="formGroup">
                        <label>Description</label>
                        <textarea type="text" rows={4} placeholder="Description of your item"
                                  value={productDetail.description} readOnly></textarea>
                    </div>
                    <div className="formGroup">
                        <label>Price</label>
                        <div className="twoForm">
                            <input type="text" placeholder="Price"
                                   onChange={(e) => setPrice(e.target.value)}/>
                            <select>
                                <option value="ETH">ETH</option>
                                <option value="BTC">BTC</option>
                                <option value="LTC">LTC</option>
                            </select>
                        </div>
                    </div>
                    <button className="writeButton" type="submit">
                        Create Item
                    </button>

                </form>
            </div>
        </div>
    );
}

export default CreateResell;
