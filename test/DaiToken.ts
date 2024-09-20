import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

let owner: any;
let user1: any;
let user2: any;
let user3: any;
let DaiTokenContract: any;
let DaiTokenContractAddress: any;
describe("Create Initial Contracts of all types", function () {
  it("get accounts", async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    console.log("owner: ", owner.address);
    console.log("user1: ", user1.address);
    console.log("user2: ", user2.address);
    console.log("user3: ", user3.address);

    console.log("\tAccount address\t", await owner.getAddress());
  });
  it("should deploy DaiTokenContract", async function () {
    const instanceDai = await ethers.getContractFactory("DAIToken");
    DaiTokenContract = await instanceDai.deploy();
    DaiTokenContractAddress = await DaiTokenContract.getAddress();
    console.log(" DaiTokenContract deployed at:", DaiTokenContractAddress);
  });
});

// Network needs to bootstrap before running this test successfully needs (~1 min)
describe("mint", async function () {
  it("should mint 1000 dais for User1", async function () {
    await DaiTokenContract.connect(user1).mint(
      user1.address,
      ethers.parseEther("1000")
    );

    const user1Balance = await DaiTokenContract.connect(user1).balanceOf(
      user1.address
    );
    expect(user1Balance).to.equal(ethers.parseEther("1000"));
  });
});
