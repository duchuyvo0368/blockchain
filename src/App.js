import './App.css';
import {Navbar, Footer, AuctionItem} from './components'
import {Home, Profile, Item, Create, Login, Register, OnSales, Auction,CreateAuction,ItemAuction,CreateResell} from './pages'
import {Routes, Route} from "react-router-dom";



function App() {

    return (
        <div>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path=":item/:tokenId" element={<Item/>}/>
                <Route path="/create/:tokenId" element={<Auction/>}/>
                <Route path="/auction/:tokenId" element={<ItemAuction/>}/>
                <Route path="/createAuction/:tokenId" element={<CreateAuction/>}/>
                <Route path="/createResell/:tokenId" element={<CreateResell/>}/>
                <Route path="/create" element={<Create/>}/>
                <Route path="/OnSale" element={<OnSales/>}/>
                <Route path="/MyAuction" element={<AuctionItem/>}/>
                <Route path="/profile/:id" element={<Profile/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;
