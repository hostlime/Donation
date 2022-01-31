//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Ownable.sol";

contract Donation is Ownable {

    mapping(address => uint) internal Donors;
    address[]  internal allDonorAddress;


    // - В контракте имеется функция вноса любой суммы пожертвования в нативной валюте блокчейна
    receive() external payable {
      if(Donors[msg.sender] == 0){
        allDonorAddress.push(msg.sender);
      }
      Donors[msg.sender]    += msg.value;
    }

    // - В контракте имеется функция вывода любой суммы на любой адрес, при этом функция может быть вызвана только владельцем контракта
    function withdrawDonation(uint _value, address payable _donor) public payable onlyOwner{
        require( address(this).balance >= _value, "Not enough money (");
        _donor.transfer(_value);
    }
    
    // - В контракте имеется view функция позволяющая получить общую сумму всех пожертвований для определённого адреса
    function getBelance(address _donor) public view returns (uint256){
        return Donors[_donor];
    }

    //- В контракте имеется view функция, которая возвращает список всех пользователей когда либо вносивших пожертвование. В списке не должно быть повторяющихся элементов
    function getAllDonors() public view returns (address[] memory) {
        return allDonorAddress;
    }
}