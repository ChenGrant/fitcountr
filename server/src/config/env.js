const dotenv = require("dotenv");
const path = require("path");

const loadEnvironmentVariables = () => {
    const { NODE_ENV } = process.env;
    console.log(`NODE_ENV=${NODE_ENV}`);
    dotenv.config({
        path: path.resolve(__dirname, `..\\..\\env\\.env.${NODE_ENV}`),
    });
};

module.exports = { loadEnvironmentVariables };
