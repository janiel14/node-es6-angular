"use strict";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import methodOverride from "method-override";
import { MongoDB } from "./MongoDB";
import { CompaniesRouter } from "../app/routes/CompaniesRouter";
import { PDVSRouter } from "../app/routes/PDVSRouter";
import { EmployeeTypesRouter } from "../app/routes/EmployeeTypesRouter";
import { UsersAdminRouter } from "../app/routes/UsersAdminRouter";
import { UsersRouter } from "../app/routes/UsersRouter";
import { IndexRouter } from "../app/routes/IndexRouter.js";
import { HomeRouter } from "../app/routes/HomeRouter";
import { EmployeesRouter } from "../app/routes/EmployeesRouter";
import { ProvidersRouter } from "../app/routes/ProvidersRouter";
import { CampaignsRouter } from "../app/routes/CampaignsRouter";
import { CustomersRouter } from "../app/routes/CustomersRouter";
import { CategoriesPlanRouter } from "../app/routes/CategoriesPlanRouter";
import { ProductsRouter } from "../app/routes/ProductsRouter";
import { PlansRouter } from "../app/routes/PlansRouter";
import { TicketsRouter } from "../app/routes/TicketsRouter";
import { TicketsMessagesRouter } from "../app/routes/TicketsMessagesRouter";

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
                .then((connection) => {
                    //load routes
                    this.app.use("/api", new CompaniesRouter());
                    this.app.use("/api", new PDVSRouter());
                    this.app.use("/api", new EmployeeTypesRouter());
                    this.app.use("/api", new UsersAdminRouter());
                    this.app.use("/api", new UsersRouter());
                    this.app.use("/api", new EmployeesRouter());
                    this.app.use("/api", new ProvidersRouter());
                    this.app.use("/api", new CampaignsRouter());
                    this.app.use("/api", new CustomersRouter());
                    this.app.use("/api", new CategoriesPlanRouter());
                    this.app.use("/api", new ProductsRouter());
                    this.app.use("/api", new PlansRouter());
                    this.app.use("/api/", new TicketsRouter());
                    this.app.use("/api/", new TicketsMessagesRouter());
                    this.app.use("/home", new HomeRouter());
                    this.app.use("*", new IndexRouter());
                    resolve(this.app);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
