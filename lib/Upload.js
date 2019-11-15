"use strict";

import { IncomingForm } from "formidable";

export class Upload {
    /**
     * constructor
     * @param {String} uploadDir
     * @param {Boolean} multiples
     * @param {Number} maxFileSize
     * @param {Number} maxFieldsSize
     * @param {Number} maxFields
     * @param {Boolean} keepExtensions
     * @param {String} encoding
     */
    constructor(
        uploadDir = "/tmp",
        multiples = false,
        maxFileSize = 200,
        maxFieldsSize = 20,
        maxFields = 1000,
        keepExtensions = true,
        encoding = "utf-8"
    ) {
        this.form = new IncomingForm();
        this.form.encoding = encoding;
        this.form.uploadDir = uploadDir;
        this.form.keepExtensions = keepExtensions;
        this.form.maxFieldsSize = maxFieldsSize * 1024 * 1024;
        this.form.maxFileSize = maxFileSize * 1024 * 1024;
        this.form.maxFields = maxFields;
        this.form.multiples = multiples;
    }

    /**
     * getUploadedFile
     * @return {Object} form
     */
    getUploadedFile(req) {
        return new Promise((resolve, reject) => {
            this.form.parse(req, (error, fields, files) => {
                if (error) {
                    console.error("Upload - getUploadedFile: ", error);
                    reject(error);
                } else {
                    const keys = Object.keys(files);
                    const list = [];
                    keys.forEach((k) => {
                        files[k].extension = files[k].name.substring(
                            files[k].name.indexOf("."),
                            files[k].name.length
                        );
                        list.push(files[k]);
                    });
                    resolve({
                        fields: fields,
                        files: list
                    });
                }
            });
        });
    }
}
