"use strict";
import { UsersAdminController } from "../controllers/UsersAdminControllers";
import { RoutingAdmin } from "../../lib/RoutingAdmin";

/**
 * UsersAdminRouter
 */
export class UsersAdminRouter extends RoutingAdmin {
    constructor() {
        super("usersadmin", new UsersAdminController());
        this.r
            .route("/usersadmincompany/:companyId")
            .get(this.helpers.ensureAuthenticateJWT, async (req, res) => {
                try {
                    const response = await this.controller.findAll(
                        req.query,
                        req.params
                    );
                    res.status(200).json(response);
                } catch (error) {
                    res.status(500).json(error.message);
                }
            });
        this.r
            .route("/usersadminemail/:email")
            .get(this.helpers.ensureAuthenticateJWT, async (req, res) => {
                try {
                    const response = await this.controller.checkEmailExist(
                        req.params
                    );
                    res.status(200).json({
                        message: "E-mail found",
                        data: response
                    });
                } catch (error) {
                    res.status(500).json(error.message);
                }
            });
        return this.r;
    }
}
