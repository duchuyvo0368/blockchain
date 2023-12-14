// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NumbersNFT.sol";

contract ArtMarketplace {
    ArtToken private token;

    struct ItemForSale {
        uint256 id;
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isSold;
    }

    ItemForSale[] public itemsForSale;
    mapping(uint256 => bool) public activeItems; // tokenId => ativo?

    event itemAddedForSale(uint256 id, uint256 tokenId, uint256 price);
    event itemSold(uint256 id, address buyer, uint256 price);

    constructor(ArtToken _token) {
        token = _token;
    }

    modifier OnlyItemOwner(uint256 tokenId) {
        require(
            token.ownerOf(tokenId) == msg.sender,
            "Sender does not own the item"
        );
        _;
    }

    modifier HasTransferApproval(uint256 tokenId) {
        require(
            token.getApproved(tokenId) == address(this),
            "Market is not approved"
        );
        _;
    }

    modifier ItemExists(uint256 id) {
        require(
            id < itemsForSale.length && itemsForSale[id].id == id,
            "Could not find item"
        );
        _;
    }

    modifier IsForSale(uint256 id) {
        require(!itemsForSale[id].isSold, "Item is already sold");
        _;
    }

    function putItemForSale(uint256 tokenId, uint256 price)
        external
        OnlyItemOwner(tokenId)
        HasTransferApproval(tokenId)
        returns (uint256)
    {
        require(!activeItems[tokenId], "Item is already up for sale");
        require(
            token.getApproved(tokenId) == address(this),
            "Not approved to transfer token"
        );
        uint256 newItemId = itemsForSale.length;
        itemsForSale.push(
            ItemForSale({
                id: newItemId,
                tokenId: tokenId,
                seller: payable(msg.sender),
                price: price,
                isSold: false
            })
        );
        activeItems[tokenId] = true;

        assert(itemsForSale[newItemId].id == newItemId);
        emit itemAddedForSale(newItemId, tokenId, price);
        return newItemId;
    }

    function buyItem(uint256 id)
        external
        payable
        ItemExists(id)
        IsForSale(id)
        HasTransferApproval(itemsForSale[id].tokenId)
    {
        require(msg.value >= itemsForSale[id].price, "Not enough funds sent");
        require(msg.sender != itemsForSale[id].seller);

        itemsForSale[id].isSold = true;
        activeItems[itemsForSale[id].tokenId] = false;
        token.safeTransferFrom(
            itemsForSale[id].seller,
            msg.sender,
            itemsForSale[id].tokenId
        );
        itemsForSale[id].seller.transfer(msg.value);

        emit itemSold(id, msg.sender, itemsForSale[id].price);
    }

    function markAsSold(uint256 tokenId) public {
        for (uint256 i = 0; i < itemsForSale.length; i++) {
            if (itemsForSale[i].tokenId == tokenId) {
                itemsForSale[i].isSold = true;
                break;
            }
        }
    }

    function getItemIds() external view returns (uint256[] memory) {
        uint256[] memory itemIds = new uint256[](itemsForSale.length);

        for (uint256 i = 0; i < itemsForSale.length; i++) {
            itemIds[i] = itemsForSale[i].id;
        }

        return itemIds;
    }

    function getReverseTokenDetails(uint256 tokenId)
        external
        view
        returns (
            uint256 id,
            address seller,
            uint256 price,
            bool isSold
        )
    {
        for (uint256 i = itemsForSale.length; i > 0; i--) {
            uint256 index = i - 1;
            if (itemsForSale[index].tokenId == tokenId) {
                return (
                    itemsForSale[index].id,
                    itemsForSale[index].seller,
                    itemsForSale[index].price,
                    itemsForSale[index].isSold
                );
            }
        }
        revert("Token not found in the marketplace");
    }

    function cancelSale(uint256 id)
        external
        OnlyItemOwner(itemsForSale[id].tokenId)
        IsForSale(id)
    {
        activeItems[itemsForSale[id].tokenId] = false;
        itemsForSale[id].isSold = true;
        emit itemSold(id, address(0), 0); // Emit an event to indicate the sale is cancelled
    }

    function getAllItemDetails()
        external
        view
        returns (
            uint256[] memory,
            address[] memory,
            uint256[] memory,
            bool[] memory
        )
    {
        uint256 unsoldItemCount = 0;
        for (uint256 i = 0; i < itemsForSale.length; i++) {
            if (!itemsForSale[i].isSold) {
                unsoldItemCount++;
            }
        }

        uint256[] memory ids = new uint256[](unsoldItemCount);
        address[] memory sellers = new address[](unsoldItemCount);
        uint256[] memory prices = new uint256[](unsoldItemCount);
        bool[] memory isSolds = new bool[](unsoldItemCount);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < itemsForSale.length; i++) {
            if (!itemsForSale[i].isSold) {
                ids[currentIndex] = itemsForSale[i].tokenId;
                sellers[currentIndex] = itemsForSale[i].seller;
                prices[currentIndex] = itemsForSale[i].price;
                isSolds[currentIndex] = itemsForSale[i].isSold;
                currentIndex++;
            }
        }

        return (ids, sellers, prices, isSolds);
    }


    function getItemIdByTokenId(uint256 tokenId)
        external
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < itemsForSale.length; i++) {
            if (itemsForSale[i].tokenId == tokenId) {
                return itemsForSale[i].id;
            }
        }
        revert("TokenId not found in the marketplace");
    }

    function fetchAllItemsOfOwner()
        external
        view
        returns (
            uint256[] memory,
            address[] memory,
            uint256[] memory,
            uint256[] memory,
            bool[] memory
        )
    {
        uint256 soLuongSanPham = 0;
        address chuSoHuu = msg.sender;

        // Đếm số lượng sản phẩm mà người gọi đã mua hoặc tạo
        for (uint256 i = 0; i < itemsForSale.length; i++) {
            if (token.ownerOf(itemsForSale[i].tokenId) == chuSoHuu) {
                soLuongSanPham++;
            }
        }

        // Khởi tạo mảng để lưu trữ chi tiết của từng sản phẩm
        uint256[] memory idsSanPham = new uint256[](soLuongSanPham);
        address[] memory chuSoHuuSanPham = new address[](soLuongSanPham);
        uint256[] memory idsToken = new uint256[](soLuongSanPham);
        uint256[] memory giaBan = new uint256[](soLuongSanPham);
        bool[] memory daBan = new bool[](soLuongSanPham);

        // Đổ dữ liệu chi tiết của sản phẩm vào mảng
        uint256 currentIndex = 0;
        for (int256 i = int256(itemsForSale.length) - 1; i >= 0; i--) {
            if (token.ownerOf(itemsForSale[uint256(i)].tokenId) == chuSoHuu) {
                ItemForSale memory item = itemsForSale[uint256(i)];
                idsSanPham[currentIndex] = item.id;
                chuSoHuuSanPham[currentIndex] = chuSoHuu;
                idsToken[currentIndex] = item.tokenId;
                giaBan[currentIndex] = item.price;
                daBan[currentIndex] = item.isSold;
                currentIndex++;
            }
        }

        return (idsSanPham, chuSoHuuSanPham, idsToken, giaBan, daBan);
    }
}
