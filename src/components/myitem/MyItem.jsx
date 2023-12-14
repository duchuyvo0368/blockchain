import React, {useEffect, useState} from 'react'
import './MyItem.css'
import {AiFillHeart} from "react-icons/ai";
import bids1 from '../../assets/bids1.png'
import bids2 from '../../assets/bids2.png'
import bids3 from '../../assets/bids3.png'
import bids4 from '../../assets/bids4.png'
import bids5 from '../../assets/bids5.png'
import bids6 from '../../assets/bids6.png'
import bids7 from '../../assets/bids7.png'
import bids8 from '../../assets/bids8.png'
import {Link} from 'react-router-dom';
import {nftMarketplaceAddress, nftNumber} from '../../utils/utils'
import axios from "axios";
import abiNFTMarketplace from "../../ABI/abiNFTMarketplace.json"
import abiNFTNumber from "../../ABI/abiNFTNumber.json"
import connect from "../../utils/auth";

const MyItem = ({title}) => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState(null);

    const fetchData = async () => {
        try {
            const {account, web3} = await connect()
            const contractNftMarketplace = new web3.eth.Contract(
                abiNFTMarketplace,
                nftMarketplaceAddress
            );
            const contractNFTNumber = new web3.eth.Contract(abiNFTNumber, nftNumber);

            const productsData = await contractNftMarketplace.methods.fetchAllItemsOfOwner().call({from: account});
            const allProduct = await fetchProductData(productsData);

            setProducts(allProduct);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data from blockchain:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [account]); // Gọi lại fetchData khi account thay đổi

    useEffect(() => {
        const updateAccount = async () => {
            const {account} = await connect();
            setAccount(account);
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                setAccount(accounts[0]);
                updateAccount(); // Cập nhật tài khoản khi sự kiện thay đổi xảy ra
            });
        }
    }, []);


    async function fetchProductData(productArray) {
        const { account, web3 } = await connect();
        const contractNFTNumber = new web3.eth.Contract(abiNFTNumber, nftNumber);

        // Sử dụng Set để theo dõi các tokenId đã xuất hiện
        const seenTokenIds = new Set();

        return await Promise.all(
            productArray[2].map(async (tokenId, index) => {
                // Nếu tokenId đã xuất hiện, bỏ qua và không thêm vào kết quả
                if (seenTokenIds.has(tokenId)) {
                    return null;
                }

                const tokenURI = await contractNFTNumber.methods.tokenURI(tokenId).call();
                const meta = await axios.get(tokenURI);

                // Thêm tokenId vào Set để đảm bảo không lấy ra nó lần thứ 2
                seenTokenIds.add(tokenId);

                return {
                    id: productArray[0][0],
                    tokenId: tokenId,
                    addressSeller: productArray[1][index],
                    images: meta.data.image,
                    name: meta.data.nftname,
                    price: parseInt(productArray[3][index]),
                    isSold: productArray[4][index]
                };
            })
        )
            // Lọc bỏ những phần tử null (có thể là các tokenId đã xuất hiện trước đó)
            .then(products => {
                const latestProduct = {}; // Sử dụng đối tượng để theo dõi sản phẩm mới nhất với mỗi tokenId
                products.forEach(product => {
                    if (!latestProduct[product.tokenId] || product.id > latestProduct[product.tokenId].id) {
                        latestProduct[product.tokenId] = product;
                    }
                });

                return Object.values(latestProduct);
            });
    }



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
                        <p></p>
                    ) : (
                        products.map((product) => (
                            <div className="card-column">
                                <div className="bids-card">
                                    <div className="bids-card-top">
                                        <img src={`${product.images}`}  alt=""/>
                                        {product.isSold ?
                                            <Link to={`/create/${product.tokenId}`}>
                                                <p className="bids-title">{product.name}</p>
                                            </Link>
                                            :
                                            <Link to={`/post/${product.tokenId}`}>
                                                <p className="bids-title">{product.name}</p>
                                            </Link>
                                        }
                                    </div>

                                    <div className="bids-card-bottom">
                                        <p> {product.price} <span>ETH</span></p>
                                        {product.isSold ? <p style={{marginLeft: 70, color: "red"}}>Đã mua</p> :
                                            <p style={{marginLeft: 70, color: "red"}}>Đang bán</p>}
                                        <p><AiFillHeart/> 92</p>
                                    </div>
                                </div>
                            </div>
                        ))
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
                                <p>0.55 <span>ETH</span></p>
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

export default MyItem
