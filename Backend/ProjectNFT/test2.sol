// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin/contracts/access/Ownable.sol";
// Import thư viện SafeMath
import "openzeppelin/contracts/utils/math/SafeMath.sol";


contract NFT is ERC721Enumerable, Ownable {
    using SafeMath for uint256;

    uint256 public tokenCounter;
    uint256 public price = 1 ether;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        tokenCounter = 0;
    }

    function createNFT() public onlyOwner {
        _mint(msg.sender, tokenCounter);
        tokenCounter = tokenCounter.add(1);
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function buyNFT(uint256 tokenId) public payable {
        require(msg.value >= price, "Insufficient funds");
        require(ownerOf(tokenId) == msg.sender, "You don't own this NFT");

        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);

        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
}
