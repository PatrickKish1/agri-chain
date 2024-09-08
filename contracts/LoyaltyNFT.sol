// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoyaltyNFT is ERC721URIStorage {
    uint256 private _tokenIds;

    constructor() ERC721("LoyaltyNFT", "TEWO") {}

    
    function mintNFT(address recipient, string memory tokenURI) public  returns (uint256) {
        _tokenIds += 1;
        uint256 newItemId = _tokenIds;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);  

        return newItemId;
    }

    
    function _baseURI() internal view virtual override returns (string memory) {
        return ""; 
    }
}
