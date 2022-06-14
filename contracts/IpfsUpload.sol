// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract IpfsUpload {

    struct ImageStruct {
        uint _id;
        string _path;
    }

    ImageStruct[] public _ipfsImages;
    address public _manager;
    uint _idInc;

    constructor()public{
        _manager = msg.sender;
    }

    function addFile(string memory _ipfsHashWithBaseUrl) public  {
        _idInc++;
        _ipfsImages.push(
            ImageStruct({
                _id:_idInc,
                _path:_ipfsHashWithBaseUrl
            })
        );
    }

    function deleteFile(uint _index) public{
        _ipfsImages[_index] = _ipfsImages[_ipfsImages.length-1];
        _ipfsImages.pop();
    }

    function getFiles()public  returns(ImageStruct[] memory) {
        return _ipfsImages;
    }

}