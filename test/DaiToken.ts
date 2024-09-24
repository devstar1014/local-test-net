import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import ABI from "./abi.json";

let owner: any;
let user1: any;
let user2: any;
let user3: any;
let DaiTokenContractAddress: any = "0x422A3492e218383753D8006C7Bfa97815B44373F";

describe("Create Initial Contracts of all types", function () {
  it("get accounts", async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    console.log("owner: ", owner.address);
    console.log("user1: ", user1.address);
    console.log("user2: ", user2.address);
    console.log("user3: ", user3.address);

    console.log("\tAccount address\t", await owner.getAddress());
  });
});

let dai: any;
// Network needs to bootstrap before running this test successfully needs (~1 min)
describe("mint", async function () {
  it("get contract", async function () {
    dai = new ethers.Contract(DaiTokenContractAddress, ABI, owner);
  });
  it("should mint 1000 dais for User1", async function () {
    console.log(await dai.name());
    const beforeBalance = await dai.balanceOf(user1.address);
    const tx = await dai
      .connect(user1)
      .mint(user1.address, ethers.parseEther("1000"));
    await sleep(13000); // wait slot time
    console.log("owner balance", await dai.balanceOf(owner));
    const user1Balance = await dai.balanceOf(user1.address);
    expect(user1Balance).to.equal(beforeBalance + ethers.parseEther("1000"));
  });
});

function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
