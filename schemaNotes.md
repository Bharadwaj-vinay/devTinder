Schema-level validations are run for:

save()
create()
Update methods (updateOne, updateMany, findByIdAndUpdate, etc.) if runValidators: true is set.
insertMany() if validateBeforeSave: true is set.



mongoose: Used to define the schema and interact with the MongoDB database.
validator: Provides utility functions for validating strings (e.g., email, URL).
jsonwebtoken: Used to generate and verify JSON Web Tokens (JWTs) for authentication.
bcrypt: Used to hash and compare passwords securely.

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { ... },
    lastName: { ... },
    emailId: { ... },
    password: { ... },
    age: { ... },
    gender: { ... },
    photoUrl: { ... },
    about: { ... },
    skills: { ... },
}, {
    timestamps: true
});

Schema: Defines the structure of the User document in MongoDB.
timestamps: true: Automatically adds createdAt and updatedAt fields to the schema.


firstName:

Type: String
Validations:
Required (required: true).
Minimum length of 4 characters (minLength: 4).
Maximum length of 50 characters (maxLength: 50).

lastName:

Type: String
Optional field.

emailId:

Type: String
Validations:
Required (required: true).
Must be unique (unique: true).
Converted to lowercase (lowercase: true).
Whitespace is trimmed (trim: true).
Validated using validator.isEmail() to ensure it’s a valid email address.

password:

Type: String

Validations:
Required (required: true).
Validated using validator.isStrongPassword() to ensure it meets security requirements:
    Minimum length of 8 characters.
    At least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.


age:

Type: Number
Validations:
Minimum value of 18 (min: 18).

gender:

Type: String
Validations:
Converted to lowercase (lowercase: true).
Must be one of male, female, or other.

photoUrl:

Type: String
Default: A generic profile picture URL.
Validations:
Validated using validator.isURL() to ensure it’s a valid URL.

about:

Type: String
Default: "Hey there! I'm using DevTinder."

skills:

Type: Array of Strings
Represents the user’s skills (e.g., programming languages).

Schema Methods
Mongoose allows you to define custom methods on the schema. These methods are available on instances of the model.

getJWT Method

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DevTinderPractice", {
        expiresIn: '7d'
    });
    return token;
};

Purpose: Generates a JSON Web Token (JWT) for the user.

How it works:
The method is called on a User instance (e.g., user.getJWT()).
It uses the jsonwebtoken library to create a token.

The token:
Encodes the user’s _id as the payload.
Is signed with the secret key "DevTinderPractice".
Expires in 7 days (expiresIn: '7d').
The generated token is returned.


Exporting the Model

module.exports = mongoose.model("User", userSchema);

mongoose.model():
Creates a Mongoose model named "User" based on the userSchema.
The model provides methods like create(), find(), findById(), etc., to interact with the User collection in MongoDB.