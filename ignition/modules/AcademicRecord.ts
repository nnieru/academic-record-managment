import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AcademicRecordModule = buildModule("AcademicRecordModule", (m) => {
  const academicRecord = m.contract("AcademicRecord", []);

  return { academicRecord };
});

export default AcademicRecordModule;
