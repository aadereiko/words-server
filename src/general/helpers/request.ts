import { AppResponse } from "../types/request.types";

export const generateResponse = (data: any, err?: string | null, msg?: string): AppResponse => ({
    data,
    msg: msg || null,
    error: err?.toString() || null,
})