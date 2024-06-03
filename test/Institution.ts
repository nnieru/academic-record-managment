import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";

describe("Institution", function () {
    let Institution;
    let institution;
    beforeEach(async function () {
        Institution = await hre.ethers.getContractFactory("Institution");
        institution = await Institution.deploy();
        await institution.waitForDeployment();
    });

    it("should register an institution", async function () {
        const name = "Example Institution";
        const email = "example@example.com";
    
        // Get the first signer
        const [signer] = await hre.ethers.getSigners();
        
        // Get the signer's address
        const signerAddress = await signer.getAddress();
    
        await institution.register(name, email);
    
        const institutionData = await institution.institutions(signerAddress);
    
        expect(institutionData.name).to.equal(name);
        expect(institutionData.email).to.equal(email);
        expect(institutionData.addr).to.equal(signerAddress);
    });
   
    it("should emit an event when insitution registration success", async function() {
        const name = "Example Institution";
        const email = "example@example.com";
    
        // Get the first signer
        const [signer] = await hre.ethers.getSigners();
        
        // Get the signer's address
        const signerAddress = await signer.getAddress();
    
        // Expect the event to be emitted when registering
        await expect(institution.register(name, email))
            .to.emit(institution, "InstitutionRegistered")
            .withArgs(name, email, signerAddress);
    
        // Check if institution data is stored correctly
        const institutionData = await institution.institutions(signerAddress);
        expect(institutionData.name).to.equal(name);
        expect(institutionData.email).to.equal(email);
        expect(institutionData.addr).to.equal(signerAddress);
    })
})