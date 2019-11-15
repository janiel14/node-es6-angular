"use strict";
import { Routing } from "../../lib/Routing";
import { UsersController } from "../controllers/UsersController";

/**
 * UsersRouter
 */
export class UsersRouter extends Routing {
    constructor() {
        super("users", new UsersController());
        this.r.route("/login").post(async (req, res) => {
            const token = await this.controller.login(req.body);
            if (token) {
                res.status(200).json({
                    message: "Login success",
                    data: token
                });
            } else {
                res.status(401).json({
                    message: "E-mail or password is wrong",
                    data: null
                });
            }
        });
        this.r
            .route("/usersemail/:email")
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
