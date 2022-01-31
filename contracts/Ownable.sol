
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

 contract Ownable{
    address public  Owner;
    
    constructor () {
        Owner = msg.sender; 
    }

    modifier onlyOwner {
        require(msg.sender == Owner, "Permission denied");
        _;
    }
 }