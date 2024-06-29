const mongoose = require('mongoose');

const userSchema = mongoose.Schema(

    {
        name: {
            type: 'string',
            require: true
        },
        email: {
            type: 'string',
            require:true,
            unique: true
        },
        avatar: {
            type: 'string',
            defalut: ''
        },
        active: {
            type: Boolean,
            default: false
        }
    }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

module.exports = mongoose.model('User',userSchema);