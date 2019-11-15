'use strict'
import { Router } from 'express';
import packageJson from '../../package.json';

/**
 * HomeRouter
 */
export class HomeRouter {
    constructor() {
        this.r = Router();
        this.r.route("/")
            .get((req, res) => {
                res.render('home', {
                    version: packageJson.version
                });
            });
        return this.r;
    }
}