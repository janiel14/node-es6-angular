'use strict'
import { Router } from 'express';
import { Helpers } from './Helpers';

export class RoutingAdmin {

    /**
     * constructor
     * @param {String} name 
     * @param {Object} controller 
     */
    constructor(name, controller) {
        this.helpers = new Helpers();
        this.controller = controller;
        this.r = Router();
        this.r.route(`/${name}`)
            .get(this.helpers.ensureAuthenticateJWT, async (req, res) => {
                try {
                    const response = await this.controller.findAll(req.query, req.params);
                    res.status(200).json(response);
                } catch (error) {
                    res.status(500).json(error.message);
                }
            })
            .post(this.helpers.ensureAuthenticateJWT, async (req, res) => {
                try {
                    const response = await this.controller.insertOrUpdate(req.body);
                    res.status(200).json(response);
                } catch (error) {
                    res.status(500).json(error.message);
                }
            });
        this.r.route(`/${name}/:_id`)
            .get(this.helpers.ensureAuthenticateJWT, async (req, res) => {
                try {
                    const response = await this.controller.findOne(req.params);
                    res.status(200).json(response);
                } catch (error) {
                    res.status(500).json(error.message);
                }
            })
            .delete(this.helpers.ensureAuthenticateJWT, async (req, res) => {
                try {
                    const response = await this.controller.delete(req.params);
                    res.status(200).json(response);
                } catch (error) {
                    res.status(500).json(error.message);
                }
            });
        this.r.route(`/${name}query`)
            .get(this.helpers.ensureAuthenticateJWT, async (req, res) => {
                try {
                    const response = await this.controller.search(req.query,req.params);
                    res.status(200).json(response);
                } catch (error) {
                    res.status(500).json(error.message);
                }
            });
    }
}