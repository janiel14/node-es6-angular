angular.module("gestec").factory("UsersAdmin", function($resource) {
    const headers = {
        Authorization: "beare " + localStorage.getItem("_TOKEN")
    };
    return $resource(
        "/api/usersadmin",
        {},
        {
            find: {
                method: "GET",
                headers: headers
            },
            findWithCompany: {
                url: "/api/usersadmincompany/:companyId",
                method: "GET",
                headers: headers,
                params: {
                    companyId: "@companyId"
                }
            },
            findWithEmail: {
                url: "/api/usersadminemail/:email",
                method: "GET",
                headers: headers,
                params: {
                    email: "@email"
                }
            },
            findOne: {
                url: "/api/usersadmin/:_id",
                method: "GET",
                headers: headers,
                params: {
                    _id: "@_id"
                }
            },
            delete: {
                url: "/api/usersadmin/:_id",
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
                    companyId: "@companyId",
                    employeeId: "@employeeId",
                    active: "@active",
                    accessLevel: "@accessLevel",
                    name: "@name",
                    email: "@email",
                    password: "@password",
                    pdvs: "@pdvs"
                }
            },
            search: {
                url: "/api/usersadminquery",
                method: "GET",
                headers: headers
            }
        }
    );
});
