const { Schema, model } = require('mongoose')
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {      // mongoose pre save exampele
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/public/images/OIP.jpg',
    },
    role: {
        type: String,
        enum: ['USER', "ADMIN"],
        default: "USER"
    }

}, { timestamps: true })


// explaining userSchema.pre 
/* Instead of "save", you can use various other event names in the `userSchema.pre()` method to define middleware functions that are executed before different events occur on a document. Here are some commonly used event names:

1. **"validate":**
This event is triggered before a document's validation process. It is useful for performing validation logic or data transformations before the document is validated.

2. **"remove":**
This event is triggered before a document is removed from the database. It allows you to execute logic or perform cleanup tasks before the document is deleted.

3. **"update":**
This event is triggered before an update operation is applied to a document. It can be used to modify the update query or perform additional logic before the update is performed.

4. **"findOneAndUpdate":**
This event is triggered before a `findOneAndUpdate()` operation is executed on a document. It allows you to modify the update query or perform logic before the update is performed.

5. **"findOneAndRemove":**
This event is triggered before a `findOneAndRemove()` operation is executed on a document. It allows you to perform logic or modify the query before the removal is performed.

6. **"init":**
This event is triggered when a document is initialized from the database or by calling the `init()` method. It can be useful for performing initialization tasks or setting default values.

7. **"insertMany":**
This event is triggered before multiple documents are inserted into the database using the `insertMany()` method. It allows you to modify or validate the documents before the insertion occurs.

These are just a few examples of event names you can use with `userSchema.pre()` to define middleware functions in Mongoose. You can refer to the Mongoose documentation for a complete list of available events and their descriptions. */

userSchema.pre('save', function (next) {
    const user = this;
    // if user password is not changed we will return 
    if (!user.isModified("password")) return;

    //if user passwrod is created or modified we will bycrypt 
    const salt = randomBytes(16).toString();          // secret key
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex")

    //we can also user Bycrypt instead of crypto
    //const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds of hashing
    //const hashedPassword = await bcrypt.hash(this.password, salt);
    this.salt = salt
    this.password = hashedPassword

    next();
})



userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error('User not found')

    const salt = user.salt;
    const hasedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');

    if (hasedPassword !== userProvidedHash) throw new Error("invalid Password");

    const token = createTokenForUser(user)

    return token
})


const User = model('user', userSchema)



module.exports = {
    User
}

