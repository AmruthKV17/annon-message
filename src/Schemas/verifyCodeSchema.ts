import {z} from "zod";


export const verifyCodeSchema = z.object({
    code : z.string().length(6,{message : "Code must of 6 digits"})
})