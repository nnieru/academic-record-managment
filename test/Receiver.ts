import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Receiver", function () {
  let Receiver: any;
  let receiver: any;
  beforeEach(async function () {
    Receiver = await hre.ethers.getContractFactory("Receiver");
    receiver = await Receiver.deploy();
    await receiver.waitForDeployment();
  });

  it("should register an receiver", async function () {
    const name = "John doe";
    const email = "johndoe@example.com";

    // Get the first signer
    const [signer] = await hre.ethers.getSigners();

    // Get the signer's address
    const signerAddress = await signer.getAddress();

    await receiver.register(name, email);

    const institutionData = await receiver.institutions(signerAddress);

    expect(institutionData.name).to.equal(name);
    expect(institutionData.email).to.equal(email);
    expect(institutionData.addr).to.equal(signerAddress);
  });

  // it("should emit an event when receiver registration success", async function () {
  //   const name = "John doe";
  //   const email = "johndoe@example.com";

  //   // Get the first signer
  //   const [signer] = await hre.ethers.getSigners();

  //   // Get the signer's address
  //   const signerAddress = await signer.getAddress();

  //   // Expect the event to be emitted when registering
  //   await expect(receiver.register(name, email))
  //     .to.emit(receiver, "ReceiverRegistered")
  //     .withArgs(name, email, signerAddress);

  //   // Check if institution data is stored correctly
  //   const institutionData = await receiver.institutions(signerAddress);
  //   expect(institutionData.name).to.equal(name);
  //   expect(institutionData.email).to.equal(email);
  //   expect(institutionData.addr).to.equal(signerAddress);
  // });
});
