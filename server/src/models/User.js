const mongoose = require("mongoose");
const config = require("../config/config");
const ProgressUtils = require("../utils/progressUtils");
const NumberUtils = require("../utils/numberUtils");
const HumanUtils = require("../utils/humanUtils");

const { PROGRESS_TYPES } = ProgressUtils;
const EMAIL_VERIFICATION_PIN_LENGTH = 5;

// -------------------------------------- SCHEMA --------------------------------------
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },

    userUID: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        lowerCase: true,
    },

    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },

    emailVerification: {
        type: {
            pin: {
                type: Number,
                immutable: true,
                default: () =>
                    NumberUtils.getRandomIntFromInterval(
                        Math.pow(10, EMAIL_VERIFICATION_PIN_LENGTH - 1),
                        Math.pow(10, EMAIL_VERIFICATION_PIN_LENGTH)
                    ),
            },
            isVerified: {
                type: Boolean,
                required: true,
            },
            provider: {
                type: String,
                required: true,
            },
            _id: false,
        },
        required: true,
    },

    profilePicture: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "MediaFile",
    },

    height: {},

    sex: {
        type: String,
        validate: {
            validator: (sex) => HumanUtils.SEXES.has(sex),
            message: (props) => `${props.value} is not a valid sex`,
        },
    },

    birthday: Date,

    goals: {
        type: {
            [PROGRESS_TYPES.WEIGHT.toLowerCase()]: {
                type: {
                    value: Number,
                    unit: {},
                    _id: false,
                },
            },
            [PROGRESS_TYPES.STEPS.toLowerCase()]: {
                type: Number,
                validate: {
                    validator: (steps) => Number.isInteger(steps) && steps >= 0,
                    message: (props) =>
                        `${props.value} is not a valid step count`,
                },
            },
            calories: {
                type: Number,
                validate: {
                    validator: (calories) => calories >= 0,
                    message: (props) =>
                        `${props.value} is not a valid calorie goal`,
                },
            },
            _id: false,
        },
        default: {},
    },
});

// ------------------------------------- STATICS -------------------------------------
userSchema.statics.isAdmin = async function (userUID) {
    const user = await this.findOne({ userUID: userUID });
    return user?.isAdmin;
};

userSchema.statics.emailIsInUse = async function (email) {
    return (await this.countDocuments({ email: email })) !== 0;
};

userSchema.statics.findUserByEmail = async function (email) {
    const user = await this.findOne({ email: email });
    if (!user || user.email !== email) return null;
    return user;
};

userSchema.statics.findUserByUserUID = async function (userUID) {
    const user = await this.findOne({ userUID });
    if (!user || user.userUID !== userUID) return null;
    return user;
};

module.exports = mongoose.model("Users", userSchema);
