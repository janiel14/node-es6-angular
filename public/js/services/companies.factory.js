angular.module("gestec").factory("Companies", function($resource) {
    const headers = {
        Authorization: "beare " + localStorage.getItem("_TOKEN")
    };
    return $resource(
        "/api/companies",
        {},
        {
            find: {
                method: "GET",
                headers: headers
            },
            findOne: {
                url: "/api/companies/:_id",
                method: "GET",
                headers: headers,
                params: {
                    _id: "@_id"
                }
            },
            delete: {
                url: "/api/companies/:_id",
                method: "DELETE",
                headers: headers,
                params: {
                    _id: "@_id"
                }
            },
            create: {
                method: "POST",
                headers: headers,
                params: {
                    _id: "@_id",
                    active: "@active",
                    cnpj: "@cnpj",
                    name: "@name",
                    address: "@address",
                    number: "@number",
                    complement: "@complement",
                    neighborhood: "@neighborhood",
                    country: "@country",
                    province: "@province",
                    city: "@city"
                }
            },
            search: {
                url: "/api/companiesquery",
                method: "GET",
                headers: headers
            }
        }
    );
});
