'use strict'

import { Crud } from '../../lib/Crud';
import model from '../models/CompaniesModel';

/**
 * CompaniesController
 */
export class CompaniesController extends Crud {
    constructor() {
        super(model);
    }
}