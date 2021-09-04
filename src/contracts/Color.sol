pragma solidity 0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Color is ERC721 {
     string[] public colors;

     constructor ERC721("Color", "COLOR") public {
     }


     function mint(string memory hex_color_code) public {
        uint _id = colors.push(hex_color_code);
        _mint(msg.sender, _id);
		
     }
}