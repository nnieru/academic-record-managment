import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("AcademicRecord", function () {
  let AcademicRecord: any;
  let academicRecord: any;

  beforeEach(async function () {
    AcademicRecord = await hre.ethers.getContractFactory("AcademicRecord");
    academicRecord = await AcademicRecord.deploy();
    await academicRecord.waitForDeployment();
  });

  it("should add a new record", async function () {
    const tx = await academicRecord.AddRecord(ethers.randomBytes(32));
    await tx.wait();
  });

  it("verify a  new record, should return false if no exist", async function () {
    const tx = await academicRecord.isRecordTxHashExist(ethers.randomBytes(32));

    console.log(tx);
    // await tx.wait();
    expect(tx).to.equal(false);
  });

  // it("should retrieve a record by index", async function () {
  //   await academicRecord.addRecord("Jane Doe", "Science", "B");
  //   const record = await academicRecord.getRecord(0);
  //   expect(record.studentName).to.equal("Jane Doe");
  //   expect(record.course).to.equal("Science");
  //   expect(record.grade).to.equal("B");
  // });

  // it("should update a record", async function () {
  //   await academicRecord.addRecord("John Doe", "Math", "A");
  //   const tx = await academicRecord.updateRecord(0, "John Doe", "Math", "A+");
  //   await tx.wait();
  //   const record = await academicRecord.getRecord(0);
  //   expect(record.grade).to.equal("A+");
  // });

  // it("should delete a record", async function () {
  //   await academicRecord.addRecord("John Doe", "Math", "A");
  //   const tx = await academicRecord.deleteRecord(0);
  //   await tx.wait();
  //   await expect(academicRecord.getRecord(0)).to.be.revertedWith(
  //     "Record does not exist"
  //   );
  // });
});
