// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Voting {
    uint public yesVotes;
    uint public noVotes;

    enum VoteChoice {
        Yes,
        No
    }

    mapping(address => bool) public hasVoted;
    mapping(address => VoteChoice) public voteChoice;

    event userVotedYes(address indexed user, VoteChoice indexed choice);
    event userVotedNo(address indexed user, VoteChoice indexed choice);
    event userChangevote(address indexed user, VoteChoice indexed choice);

    error HasVoted(address caller, bool hasVoted);
    error DoubleVote(address caller, VoteChoice choice);

    function voteYes() public {
        if (hasVoted[msg.sender]) revert HasVoted(msg.sender, true);

        yesVotes++;
        hasVoted[msg.sender] = true;
        voteChoice[msg.sender] = VoteChoice.Yes;

        emit userVotedYes(msg.sender, VoteChoice.Yes);
    }

    function voteNo() public {
        if (hasVoted[msg.sender]) revert HasVoted(msg.sender, true);

        noVotes++;
        hasVoted[msg.sender] = true;
        voteChoice[msg.sender] = VoteChoice.No;

        emit userVotedNo(msg.sender, VoteChoice.No);
    }

    function changeVote(VoteChoice _newVote) public {
        if (!hasVoted[msg.sender]) revert HasVoted(msg.sender, false);

        VoteChoice previousVote = voteChoice[msg.sender];

        if (previousVote == _newVote) revert DoubleVote(msg.sender, _newVote);

        if (previousVote == VoteChoice.Yes && _newVote == VoteChoice.No) {
            yesVotes--;
            noVotes++;
        } else if (
            previousVote == VoteChoice.No && _newVote == VoteChoice.Yes
        ) {
            yesVotes++;
            noVotes--;
        }

        voteChoice[msg.sender] = _newVote;

        emit userChangevote(msg.sender, _newVote);
    }

    function getResult()
        public
        view
        returns (uint yesPercentage, uint noPercentage)
    {
        uint totalVotes = yesVotes + noVotes;

        if (totalVotes == 0) {
            return (0, 0);
        }
        yesPercentage = (yesVotes * 100) / totalVotes;
        noPercentage = (noVotes * 100) / totalVotes;
        return (yesPercentage, noPercentage);
    }

    function getTotalVotes() public view returns (uint) {
        return yesVotes + noVotes;
    }
}
