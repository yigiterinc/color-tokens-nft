pragma solidity 0.5.0;

import "./ERC721Full.sol";


contract Color is ERC721Full {
     string[] public colors;

     constructor() ERC721Full("Color", "COLOR") public {
     }


     function mint(string memory hex_color_code) public {
        colors.push(hex_color_code);
		uint _id = colors.length;
        _mint(msg.sender, _id);
     }
}