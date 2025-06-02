// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Transactions {
    uint256 transactionCount;

    event Transfer(address from, address receiver, uint amount, uint256 timestamp);

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        uint256 timestamp;
    }

    TransferStruct[] transactions;

    function addToBlockChain(address payable receiver, uint amount) public {
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, block.timestamp));

        emit Transfer(msg.sender, receiver, amount, block.timestamp);
    }
    function getTransactionsPageAndTotalPages(uint256 startIndex, uint256 pageSize)
        public
        view
        returns (TransferStruct[] memory, uint256 totalPages)
    {
        if (pageSize == 0) { 
            return (new TransferStruct[](0), 0);
        }
        if (pageSize > 100) {
            pageSize = 100;
        }

        if (startIndex >= transactionCount) {
            totalPages = (transactionCount + pageSize - 1) / pageSize;
            return (new TransferStruct[](0), totalPages);
        }

        uint256 actualNewestTransactionIndex = transactionCount - 1;
        uint256 readStartIndex = actualNewestTransactionIndex - startIndex;
        uint256 numAvailableTransactionsFromReadStart = readStartIndex + 1;

        uint256 numToReturn = pageSize;
        if (numToReturn > numAvailableTransactionsFromReadStart) {
            numToReturn = numAvailableTransactionsFromReadStart;
        }

        TransferStruct[] memory page = new TransferStruct[](numToReturn);

        for (uint256 i = 0; i < numToReturn; i++) {
            page[i] = transactions[readStartIndex - i];
        }

        totalPages = (transactionCount + pageSize - 1) / pageSize;

        return (page, totalPages);
    }

    function getTransactionsCount() public view returns (uint256) {
        return transactionCount;
    }
}