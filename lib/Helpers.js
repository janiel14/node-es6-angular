"use strict";
import crypto from "crypto";
import fs from "fs";
import { encode, decode } from "jwt-simple";
import moment from "moment";

/**
 * Helpers
 * Class
 */
export class Helpers {
    /**
     * constructor
     */
    constructor() {
        this.algorithm = "aes-256-ctr";
        this.hash = "asdf4ads56f4ads5614f5asd1f56we1561e56w1w51ds56df56ads";
        this.secret =
            "190ui9dk1w2ksl10=owe1kw9d1u8dey18gwe12jw9diw0-uer1g2uh8ydg1d127h";
    }

    /**
     * _getRandomInt
     * @param {Number} min
     * @param {Number} max
     */
    _getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * checkBasicFolders
     * Create basic folders for project
     */
    checkBasicFolders() {
        const folders = [];
        try {
            for (let i = 0; i < folders.length; i++) {
                if (!fs.existsSync("./" + folders[i])) {
                    _self.debugging("Creating folder: " + folders[i]);
                    fs.mkdirSync("./" + folders[i]);
                }
            }
        } catch (error) {
            app.logger.log(
                "error",
                "config - utils - checkFolderExists - " + error
            );
            console.error(error);
        }
    }

    /**
     * decrypt
     * @param {String} text
     * @return {String} text
     */
    decrypt(text) {
        const decipher = crypto.createDecipher(this.algorithm, this.hash);
        let dec = decipher.update(text, "hex", "utf8");
        dec += decipher.final("utf8");
        return dec;
    }

    /**
     * encrypt
     * @param {String} text
     * @return {String} text
     */
    encrypt(text) {
        const cipher = crypto.createCipher(this.algorithm, this.hash);
        let crypted = cipher.update(text, "utf8", "hex");
        crypted += cipher.final("hex");
        return crypted;
    }

    /**
     * randomString
     * @param {Number} len
     * @return {String} string
     */
    randomString(len) {
        const date = new Date();
        let buf = [],
            chars =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
                date.getTime(),
            charlen = chars.length;
        for (let i = 0; i < len; ++i) {
            buf.push(chars[this._getRandomInt(0, charlen - 1)]);
        }
        return buf.join("");
    }

    /**
     * replaceAll
     * @param {String} value
     * @param {String} search
     * @param {String} replace
     * @return {String} value
     */
    replaceAll(value, search, replace) {
        for (let i = value.length - 1; i >= 0; i--) {
            value = value.replace(search, replace);
        }
        return value;
    }

    /**
     * createJWT
     * @param {Object} sub
     * @return {String} token
     */
    createJWT(sub) {
        const payload = {
            sub: sub,
            iat: moment().unix(),
            exp: moment()
                .add(1, "days")
                .unix()
        };
        return encode(payload, this.secret);
    }

    /**
     * ensureAuthenticateJWT
     * @param {Object} req
     * @param {Object} res
     * @param {Object} next
     */
    ensureAuthenticateJWT(req, res, next) {
        try {
            const userToken = req.header("Authorization") || req.query.t;
            const secret =
                "190ui9dk1w2ksl10=owe1kw9d1u8dey18gwe12jw9diw0-uer1g2uh8ydg1d127h";
            if (!userToken) {
                res.status(401).send({
                    message: "Access not authorized!"
                });
            } else {
                const token = userToken.split(" ")[1];
                let payload = null;
                payload = decode(token, secret);
                if (payload.exp <= moment().unix()) {
                    res.status(401).send({
                        message: "Token expired"
                    });
                }
                req.authenticated = payload.sub;
                next();
            }
        } catch (error) {
            res.status(401).send({
                message: error.message
            });
        }
    }
}
