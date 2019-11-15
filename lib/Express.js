"use strict";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import methodOverride from "method-override";
import { MongoDB } from "./MongoDB";
import { CompaniesRouter } from "../app/routes/CompaniesRouter";
import { UsersAdminRouter } from "../app/routes/UsersAdminRouter";
import { IndexRouter } from "../app/routes/IndexRouter.js";
import { HomeRouter } from "../app/routes/HomeRouter";

/**
 * Express
 */
export class Express {
    /**
     * constructor
     */
    constructor() {
        this.app = new express();
        this.app.set("port", process.env.NODE_PORT || 7010);
        this.app.env = process.env.NODE_ENV || "development";
        this.app.set("view engine", "pug");
        this.app.set("views", "./app/views");
        this.app.use(express.static("./public"));
        this.app.use(
            bodyParser.urlencoded({ limit: "1024mb", extended: true })
        );
        this.app.use(bodyParser.json({ limit: "1024mb" }));
        this.app.use(new methodOverride());
        this.app.use(new cors());
        this.app.use(new helmet());
        this.app.use(new compression());
    }

    /**
     * listen
     */
    async listen() {
        return new Promise((resolve, reject) => {
            const mongoDB = new MongoDB();
            mongoDB
                .connectDB()
                .then(connection => {
                    //load routes
                    this.app.use("/api", new CompaniesRouter());
                    this.app.use("/api", new UsersAdminRouter());
                    this.app.use("/home", new HomeRouter());
                    this.app.use("*", new IndexRouter());
                    resolve(this.app);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}
