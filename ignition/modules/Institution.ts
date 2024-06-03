import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const InstitutionModule = buildModule("InstitutionModule", (m) => {
    const institution = m.contract("Institution", [])

    return  { institution }
})

export default InstitutionModule;