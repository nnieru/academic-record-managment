import { ErrorInfo } from "../../models/error/ErrorInfo.model";

function web3ErrorHanlder(error: ErrorInfo): string {
    if (error.code === 4001) {
        return `error: ${error.message}`;
    } else {
        return "An unexpected error occurred"
    }
}

export {web3ErrorHanlder}