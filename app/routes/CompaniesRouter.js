'use strict'
import { CompaniesController } from '../controllers/CompaniesController';
import { RoutingAdmin } from '../../lib/RoutingAdmin';

export class CompaniesRouter extends RoutingAdmin {
    constructor() {
        super('companies', new CompaniesController());
        return this.r;
    }
}