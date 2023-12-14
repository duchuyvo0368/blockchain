import './create.css';
import Image from '../../assets/Image.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import abiNFTNumber from "../../ABI/abiNFTNumber.json";
import {nftMarketplaceAddress, nftNumber} from "../../utils/utils";
import connect from "../../utils/auth";
import abiNFTMarketplace from "../../ABI/abiNFTMarketplace.json";
import {Contract} from "web3";

const CreateItem = (message) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [nftname, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('ETH');
    const [successMessage, setSuccessMessage] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { account, web3 } = await connect()
        const contractNFTNumber = new web3.eth.Contract(abiNFTNumber, nftNumber);
        const contractNftMarketplace = new web3.eth.Contract(abiNFTMarketplace, nftMarketplaceAddress);
        const imageData = new FormData();
        imageData.append('file', selectedImage);

        try {
            const imageResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', imageData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': '7826c6148ec83d5f40d3',
                    'pinata_secret_api_key': '57a75e616467c99ebfe81e56388d88f6f36871a02f9d0e7d7b10a617b7556d87',
                },
            });


            console.log('Image uploaded to Pinata with IPFS hash:', imageResponse.data.IpfsHash);
            const imageHash = imageResponse.data.IpfsHash;
            alert(imageHash)
            const jsonData = {
                nftname: nftname,
                description: description,
                image: `https://gateway.pinata.cloud/ipfs/${imageHash}`,
             };

            const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
            const jsonFormData = new FormData();
            jsonFormData.append('file', jsonBlob, 'data.json');

            const jsonResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', jsonFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': '7826c6148ec83d5f40d3',
                    'pinata_secret_api_key': '57a75e616467c99ebfe81e56388d88f6f36871a02f9d0e7d7b10a617b7556d87',
                },
            });
            //
            const jsonHash = "https://gateway.pinata.cloud/ipfs/"+jsonResponse.data.IpfsHash;
            await contractNFTNumber.methods.mint(jsonHash).send({from:account});
            const tokenId = await contractNFTNumber.methods.totalSupply().call();
            await contractNFTNumber.methods.approve(nftMarketplaceAddress, tokenId).send({from:account})
            await contractNftMarketplace.methods.putItemForSale(tokenId,price).send({from:account})

        } catch (error) {
            console.error( error);
        }
    };

    return (
        <div className="create section__padding">
            <div className="create-container">
                <h1>Create new Item</h1>
                <p className="upload-file">Upload File</p>
                <div className="upload-img-show">
                    <h3>JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.</h3>
                    <img style={{ width: 400, height: 200 }} src={imagePreview || Image} alt="banner" />
                    <p>Drag and Drop File</p>
                </div>
                <form className="writeForm" autoComplete="off" onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Upload</label>
                        <input type="file" className="custom-file-input" onChange={handleImageChange} required />
                    </div>
                    <div className="formGroup">
                        <label>Name</label>
                        <input type="text" placeholder="Item Name" autoFocus={true} onChange={(e) => setItemName(e.target.value)} />
                    </div>
                    <div className="formGroup">
                        <label>Description</label>
                        <textarea type="text" rows={4} placeholder="Description of your item" onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="formGroup">
                        <label>Price</label>
                        <div className="twoForm">
                            <input type="text" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
                            <select onChange={(e) => setCurrency(e.target.value)}>
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
                {successMessage && <p>{successMessage}</p>}
            </div>
        </div>
    );
};

export default CreateItem;
