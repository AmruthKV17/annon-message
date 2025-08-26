import mongoose, {Schema, Document} from 'mongoose'

export interface Message extends Document{
    content : string ;
    createdAt : Date
}

const MessageSchema: Schema<Message> = new Schema ({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required: true,
        default : Date.now()

    }
})


export interface User extends Document{
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : Boolean;
    isAccepting : Boolean;
    messages : Message[];
}

const UserSchema: Schema<User> = new Schema({
    username : {
        type : String,
        required: [true, "Username is Required!"],
        trim : true,
        unique : true
    },
    email : {
        type : String,
        required : [true, "Email is Required!"],
        unique : true,
        match : [/.+\@.+\..+/,"Provide valid Email!"]

    },
    password : {
        type : String,
        required : [true, "Password is Required"]
    },
    verifyCode : {
        type : String,
        required : [true, "Fill the verify code"]
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true, "Verify code expiry is required!"]
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAccepting : {
        type : Boolean,
        default : true
    },
    messages : [MessageSchema]

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

export default UserModel;