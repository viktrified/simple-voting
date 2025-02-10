import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Voting Contract", function () {
     let Voting, voting, owner, addr1, addr2;

     beforeEach(async function () {
       [owner, addr1, addr2] = await ethers.getSigners();
       Voting = await ethers.getContractFactory("Voting");
       voting = await Voting.deploy();
       await voting.deployed();
     });

     it("Should initialize with zero votes", async function () {
       expect(await voting.yesVotes()).to.equal(0);
       expect(await voting.noVotes()).to.equal(0);
     });

     it("Should allow a user to vote Yes", async function () {
       await voting.connect(addr1).voteYes();
       expect(await voting.yesVotes()).to.equal(1);
       expect(await voting.hasVoted(addr1.address)).to.be.true;
     });

     it("Should allow a user to vote No", async function () {
       await voting.connect(addr1).voteNo();
       expect(await voting.noVotes()).to.equal(1);
       expect(await voting.hasVoted(addr1.address)).to.be.true;
     });

     it("Should not allow a user to vote twice", async function () {
       await voting.connect(addr1).voteYes();
       await expect(
         voting.connect(addr1).voteNo(),
       ).to.be.revertedWithCustomError(voting, "HasVoted");
     });

     it("Should allow a user to change their vote", async function () {
       await voting.connect(addr1).voteYes();
       await voting.connect(addr1).changeVote(1); // 1 represents VoteChoice.No
       expect(await voting.yesVotes()).to.equal(0);
       expect(await voting.noVotes()).to.equal(1);
     });

     it("Should not allow a user to change to the same vote", async function () {
       await voting.connect(addr1).voteYes();
       await expect(
         voting.connect(addr1).changeVote(0),
       ).to.be.revertedWithCustomError(voting, "DoubleVote");
     });

     it("Should calculate vote percentages correctly", async function () {
       await voting.connect(addr1).voteYes();
       await voting.connect(addr2).voteNo();
       const [yesPercentage, noPercentage] = await voting.getResult();
       expect(yesPercentage).to.equal(50);
       expect(noPercentage).to.equal(50);
     });

     it("Should return total votes correctly", async function () {
       await voting.connect(addr1).voteYes();
       await voting.connect(addr2).voteNo();
       expect(await voting.getTotalVotes()).to.equal(2);
     });
});
