"use strict";

import { Crud } from "../../lib/Crud";
import model from "../models/UsersModel";
import { Helpers } from "../../lib/Helpers";

/**
 * UsersAdminController
 */
export class UsersAdminController extends Crud {
    constructor() {
        super(model);
        this.helpers = new Helpers();
    }

    /**
     * _beforeInsert
     */
    _beforeInsert(body) {
        body.password = this.helpers.encrypt(body.password);
        return body;
    }

    /**
     * _beforeUpdate
     */
    _beforeUpdate(body) {
        body.password = this.helpers.encrypt(body.password);
        return body;
    }

    /**
     * _afterFindOne
     *
     * @param {*} data
     * @returns
     * @memberof UsersController
     */
    _afterFindOne(data) {
        data.password = this.helpers.decrypt(data.password);
        return data;
    }

    /**
     * checkEmailExist
     * Return e-mail existing
     * @param {Object} params
     * @returns {Object} user
     * @memberof UsersAdminController
     */
    async checkEmailExist(params) {
        return await model.findOne({
            email: params.email
        });
    }
}
