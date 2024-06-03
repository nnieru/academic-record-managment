import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ReceiverModule = buildModule("ReceiverModule", (m) => {
    const receiver = m.contract("Receiver", [])

    return  { receiver }
})

export default ReceiverModule;