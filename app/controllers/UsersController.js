"use strict";

import { Crud } from "../../lib/Crud";
import model from "../models/UsersModel";
import { Helpers } from "../../lib/Helpers";
import EmployeesModel from "../models/EmployeesModel";
import CompaniesModel from "../models/CompaniesModel";

/**
 * UsersController
 */
export class UsersController extends Crud {
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
     * _afterFindAll
     *
     * @param {*} [data=[]]
     * @memberof UsersController
     */
    async _afterFindAll(data = []) {
        return await Promise.all(
            data.map(async (item) => {
                const company = await CompaniesModel.findOne({
                    _id: item.companyId
                }).select({
                    _id: 1,
                    name: 1
                });
                const employee = await EmployeesModel.findOne({
                    _id: item.employeeId
                }).select({
                    _id: 1,
                    name: 1
                });
                item._doc.password = this.helpers.decrypt(item._doc.password);
                Object.assign(
                    item._doc,
                    {
                        company: company
                    },
                    {
                        employee: employee
                    }
                );
                return item._doc;
            })
        );
    }

    /**
     * login
     * @param {Object} body
     * @return {String} token
     */
    async login(body) {
        const user = await this._model.findOne({
            email: body.email
        });
        if (user) {
            const helper = new Helpers();
            if (user.password === helper.encrypt(body.password)) {
                let employee = null;
                if (user.employeeId) {
                    employee = await EmployeesModel.findOne({
                        _id: user.employeeId
                    });
                }
                let company = null;
                if (user.companyId) {
                    company = await CompaniesModel.findOne({
                        _id: user.companyId
                    });
                }
                await this._model.updateOne(
                    {
                        _id: user._id
                    },
                    {
                        lastLogin: new Date()
                    }
                );
                return helper.createJWT({ user, company, employee });
            } else {
                return null;
            }
        } else {
            return null;
        }
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
