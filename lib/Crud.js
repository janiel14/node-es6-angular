"use strict";

/**
 * Crud
 */
export class Crud {
    /**
     * constructor
     * @param {Object} model
     */
    constructor(model) {
        this._model = model;
    }

    /**
     * insertOrUpdate
     * @param {Object} req
     * @return {Object} data
     */
    async insertOrUpdate(req) {
        if (req.body._id) {
            req.body.updatedAt = new Date();
            if (typeof this._beforeUpdate === "function") {
                req.body = await this._beforeUpdate(req.body, req);
            }
            await this._model.updateOne(
                {
                    _id: req.body._id
                },
                req.body
            );
            if (typeof this._afterUpdate === "function") {
                req.body = await this._afterUpdate(req.body);
            }
            return {
                message: `${this._model.modelName} updated`,
                data: req.body
            };
        } else {
            if (typeof this._beforeInsert === "function") {
                req.body = await this._beforeInsert(req.body, req);
            }
            req.body = await this._model.create(req.body);
            if (typeof this._afterInsert === "function") {
                req.body = await this._afterInsert(req.body);
            }
            return {
                message: `${this._model.modelName} created`,
                data: req.body
            };
        }
    }

    /**
     * delete
     * @param {Object} req
     * @return {Object} data
     */
    async delete(req) {
        if (typeof this._beforeDelete === "function") {
            req.params = await this._beforeDelete(req.params);
        }
        await this._model.deleteOne(req.params);
        if (typeof this._afterDelete === "function") {
            await this._afterDelete(req.params);
        }
        return {
            message: `${this._model.modelName} deleted`,
            data: null
        };
    }

    /**
     * findOne
     * @param {Object} req
     * @return {Object}
     */
    async findOne(req) {
        if (typeof this._beforeFindOne === "function") {
            req.params = await this._beforeFindOne(req.params, req);
        }
        let data = await this._model.findOne(req.params);
        if (typeof this._afterFindOne === "function") {
            data = await this._afterFindOne(data);
        }
        return {
            message: `${this._model.modelName} finded`,
            data: data
        };
    }

    /**
     * findAll
     * @param {Object} req
     * @return {Object} data
     */
    async findAll(req) {
        req.query.page = isNaN(req.query.page) ? 0 : req.query.page;
        req.query.limit = isNaN(req.query.limit) ? 20 : req.query.limit;
        req.query.order = isNaN(req.query.order) ? 1 : req.query.order;
        if (typeof this._beforeFindAll === "function") {
            req.params = await this._beforeFindAll(req.params, req);
        }
        const count = await this._model.find(req.params).countDocuments();
        if (req.query.page == 2) {
            req.query.page = req.query.limit;
        } else if (req.query.page >= 3) {
            req.query.page =
                (parseInt(req.query.page) - 1) * parseInt(req.query.limit);
        }
        let data = await this._model
            .find(req.params)
            .skip(parseInt(req.query.page))
            .limit(parseInt(req.query.limit))
            .sort({
                createdAt: req.query.order
            });
        if (typeof this._afterFindAll === "function") {
            data = await this._afterFindAll(data);
        }
        return {
            message: `${this._model.modelName} finds`,
            data: data,
            page: req.query.page,
            limit: req.query.limit,
            total: count
        };
    }

    /**
     * search
     * @param {Object} req
     * @return {Object} data
     */
    async search(req) {
        req.query.page = isNaN(req.query.page) ? 0 : req.query.page;
        req.query.limit = isNaN(req.query.limit) ? 20 : req.query.limit;
        req.query.sort = isNaN(req.query.sort) ? 1 : req.query.sort;
        req.params.$text = {
            $search: req.query.search
        };
        if (typeof this._beforeSearch === "function") {
            req.params = await this._beforeSearch(req.params, req);
        }
        const count = await this._model.find(req.params).countDocuments();
        if (req.query.page == 2) {
            req.query.page = req.query.limit;
        } else if (req.query.page > 3) {
            req.query.page =
                parseInt(req.query.page) * parseInt(req.query.limit);
        }
        let data = await this._model
            .find(req.params)
            .skip(parseInt(req.query.page))
            .limit(parseInt(req.query.limit))
            .sort({
                createdAt: req.query.sort
            });
        if (typeof this._afterSearch === "function") {
            data = await this._afterSearch(data);
        }
        return {
            message: `${this._model.modelName} search`,
            data: data,
            page: req.query.page,
            limit: req.query.limit,
            total: count
        };
    }
}
