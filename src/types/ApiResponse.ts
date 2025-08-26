import { Message } from "@/Models/User.model";

export interface ApiResponse {
    success : boolean;
    message :string;
    isAcceptingMsg?:boolean;
    messages ?:  Array<Message>;
}