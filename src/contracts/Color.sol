pragma solidity 0.5.0;

import "./ERC721Full.sol";


contract Color is ERC721Full {
     string[] public colors;
     mapping(string => bool) mintedColors;

     constructor() ERC721Full("Color", "COLOR") public {
     }

     modifier colorIsNotMinted(string memory colorCode) {
         require(!mintedColors[colorCode]);
         _;
     }

     function mint(string memory hex_color_code) public colorIsNotMinted(hex_color_code) {
        colors.push(hex_color_code);
		uint _id = colors.length;
        mintedColors[hex_color_code] = true;
        _mint(msg.sender, _id);
     }
}