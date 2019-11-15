angular.module("gestec").factory("Users", function($resource) {
    const headers = {
        Authorization: "beare " + localStorage.getItem("_TOKEN")
    };
    return $resource(
        "/api/users",
        {},
        {
            find: {
                method: "GET",
                headers: headers
            },
            findWithEmail: {
                url: "/api/usersemail/:email",
                method: "GET",
                headers: headers,
                params: {
                    email: "@email"
                }
            },
            findOne: {
                url: "/api/users/:_id",
                method: "GET",
                headers: headers,
                params: {
                    _id: "@_id"
                }
            },
            delete: {
                url: "/api/users/:_id",
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
                url: "/api/usersquery",
                method: "GET",
                headers: headers
            }
        }
    );
});
