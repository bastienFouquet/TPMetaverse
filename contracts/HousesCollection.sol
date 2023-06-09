// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract HousesCollection is ERC721URIStorage, Ownable {
    uint public constant MAX_SUPPLY = 10;
    uint public constant COST = 0.00001 ether;
    uint public constant TOTAL_SUPPLY = 3;

    struct House {
        uint number;
        string color;
    }

    House[] public houses;

    mapping(uint => uint) private _tokenIdMinted;
    mapping(address => uint[]) private _tokenIdsOfOwner;
    mapping(uint => address) private _ownerOfTokenId;

    uint _tokenIdMintedSize = 0;

    string[] colors = [
        "red",
        "orange",
        "yellow",
        "blue",
        "green",
        "gray",
        "white",
        "black"
    ];

    constructor() ERC721("Houses", "HSE") {
        for (uint i = 1; i <= MAX_SUPPLY; i++) {
            houses.push(House(i, colors[i % colors.length]));
        }
    }

    function mint(uint tokenId) public payable returns (uint) {
        require(
            tokenId <= houses.length && tokenId > 0,
            "TokenID do not match a NFT"
        );
        require(_tokenIdMinted[tokenId] == 0, "NFT already minted");
        require(
            _tokenIdMintedSize <= MAX_SUPPLY,
            "This collection is sold out!"
        );
        require(
            _tokenIdsOfOwner[msg.sender].length <= TOTAL_SUPPLY,
            "You have received the maximum amount of NFTs allowed."
        );
        require(msg.value >= COST, "Not enough ether to purchase NFT.");

        _safeMint(msg.sender, tokenId);
        _setTokenURI(
            tokenId,
            string(
                abi.encodePacked(
                    "https://ipfs.io/ipfs/QmcypXjBsPak3xG524fdXwygMNqSwBqCjQTmrTU2BoX4L8/",
                    Strings.toString(tokenId),
                    ".json"
                )
            )
        );
        _tokenIdMinted[tokenId]++;
        _tokenIdMintedSize++;
        _tokenIdsOfOwner[msg.sender].push(tokenId);
        _ownerOfTokenId[tokenId] = msg.sender;
        return tokenId;
    }

    function getOwnerOfTokenId(uint tokenId) external view returns (address) {
        return _ownerOfTokenId[tokenId];
    }

    function contractURI() public pure returns (string memory) {
        return
            '{"name":"HousesCollection","description":"NFTs Collection of Houses 3Ds","image":"https://ipfs.io/ipfs/QmefttQaKisD5Jrq2TgE3mRGQTJcXMbUhskWgp3YFgseSC/collection.jpg"}';
    }

    function getHouses() external view returns (House[] memory) {
        return houses;
    }
}
