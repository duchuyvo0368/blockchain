// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NumbersNFT.sol";
import "./NFTMarketplace.sol";

contract ArtAuction {
    ArtToken private token;
    address public owner;

    struct Auction {
        uint256 tokenId;
        address payable highestBidder;
        uint256 highestBid;
        uint256 startingBid;
        bool ended;
    }

    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256[]) public tokensWon;

    constructor(ArtToken _token) {
        token = _token;
        owner = msg.sender;
    }

    function createAuction(uint256 tokenId, uint256 startingBid) public {
        require(token.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(
            token.getApproved(tokenId) == address(this),
            "Not approved to transfer token"
        );
        auctions[tokenId] = Auction({
            tokenId: tokenId,
            highestBidder: payable(address(0)),
            highestBid: 0,
            startingBid: startingBid,
            ended: false
        });
    }
    

   function bid(uint256 tokenId) public payable {
    Auction storage auction = auctions[tokenId];
    require(!auction.ended, "Auction already ended");
    require(msg.value > auction.highestBid, "There already is a higher bid");
    require(msg.value >= auction.startingBid, "Bid must be at least the starting bid");

    if (auction.highestBid != 0) {
        auction.highestBidder.transfer(auction.highestBid);
    }

    auction.highestBidder = payable(msg.sender);
    auction.highestBid = msg.value;


}

function endAuction(uint256 tokenId) public {
    Auction storage auction = auctions[tokenId];
    require(!auction.ended, "Auction already ended");
    token.safeTransferFrom(token.ownerOf(tokenId), auction.highestBidder, tokenId);
    auction.ended = true;
}



    function getAllAuctionDetails()
    public
    view
    returns (
        uint256[] memory tokenIds,
        address[] memory highestBidders,
        uint256[] memory highestBids,
        uint256[] memory startingBids,
        bool[] memory endedStatus
    )
{
    uint256 auctionCount = 0;
    for (uint256 i = 1; i <= token.totalSupply(); i++) {
        // Start from 1 assuming token IDs start from 1
        if (auctions[i].tokenId != 0 && !auctions[i].ended) {
            auctionCount++;
        }
    }

    tokenIds = new uint256[](auctionCount);
    highestBidders = new address[](auctionCount);
    highestBids = new uint256[](auctionCount);
    startingBids = new uint256[](auctionCount);
    endedStatus = new bool[](auctionCount);

    uint256 index = 0;
    for (uint256 i = 1; i <= token.totalSupply(); i++) {
        if (auctions[i].tokenId != 0 && !auctions[i].ended ) {
            Auction storage auction = auctions[i];

            tokenIds[index] = auction.tokenId;
            highestBidders[index] = auction.highestBidder;
            highestBids[index] = auction.highestBid;
            startingBids[index] = auction.startingBid;
            endedStatus[index] = auction.ended;

            index++;
        }
    }

    return (
        tokenIds,
        highestBidders,
        highestBids,
        startingBids,
        endedStatus
    );
}


    function getAuctionDetailsByAccount()
        public
        view
        returns (
            uint256[] memory tokenIds,
            uint256[] memory highestBids,
            uint256[] memory startingBids,
            bool[] memory endedStatus
        )
    {
        uint256 auctionCount = 0;
        address account = msg.sender; // Get the account from the function caller

        for (uint256 i = 1; i <= token.totalSupply(); i++) {
            // Start from 1 assuming token IDs start from 1
            if (
                auctions[i].tokenId != 0 &&
                token.ownerOf(auctions[i].tokenId) == account
            ) {
                auctionCount++;
            }
        }

        tokenIds = new uint256[](auctionCount);
        highestBids = new uint256[](auctionCount);
        startingBids = new uint256[](auctionCount);
        endedStatus = new bool[](auctionCount);

        uint256 index = 0;
        for (uint256 i = 1; i <= token.totalSupply(); i++) {
            if (
                auctions[i].tokenId != 0 &&
                token.ownerOf(auctions[i].tokenId) == account
            ) {
                Auction storage auction = auctions[i];

                tokenIds[index] = auction.tokenId;
                highestBids[index] = auction.highestBid;
                startingBids[index] = auction.startingBid;
                endedStatus[index] = auction.ended;

                index++;
            }
        }

        return (tokenIds, highestBids, startingBids, endedStatus);
    }
}
