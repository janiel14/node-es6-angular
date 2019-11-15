'use strict'
import { Router } from 'express';
import packageJson from '../../package.json';

/**
 * IndexRouter
 */
export class IndexRouter {
    constructor() {
        this.r = Router();
        this.r.route("*")
            .get((req, res) => {
                res.render('index', {
                    version: packageJson.version
                });
            });
        return this.r;
    }
}