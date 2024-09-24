import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { DAIToken } from "../typechain-types/contracts/DAI.sol/DAIToken";

const main = async (): Promise<any> => {
  const DaiTokenContract: ContractFactory = await ethers.getContractFactory(
    "DAIToken"
  );
  const DaiToken: Contract = (await DaiTokenContract.deploy()) as Contract;
  DaiToken.waitForDeployment();
  const address = await DaiToken.getAddress();
  console.log(`DaiToken deployed to: ${address}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
