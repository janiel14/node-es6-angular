angular
    .module("gestec", [
        "ngRoute",
        "ngResource",
        "angular-loading-bar",
        "ngAnimate",
        "ngMaterial",
        "ngMessages",
        "ngCurrencyMask",
        "ngFileUpload"
    ])
    .config(($routeProvider, $httpProvider, $mdDateLocaleProvider) => {
        $mdDateLocaleProvider.formatDate = function(date) {
            var m = moment(date);
            return m.isValid() ? m.format("DD/MM/YYYY") : "";
        };
        $httpProvider.interceptors.push("auth");
        //routing
        $routeProvider.when("/dashboard", {
            templateUrl: "partials/dashboard/index.html"
        });
        $routeProvider.otherwise({ redirectTo: "/dashboard" });

        /**
         * parseJwt
         */
        const _parseJwt = () => {
            const token = localStorage.getItem("_TOKEN");
            if (token) {
                var base64Url = token.split(".")[1];
                var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                var jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split("")
                        .map(function(c) {
                            return (
                                "%" +
                                ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                            );
                        })
                        .join("")
                );
                const auth = JSON.parse(jsonPayload);
                document.getElementById("userLogged").innerHTML =
                    auth.sub.user.name;
                _acl(auth.sub.user.accessLevel);
                localStorage.setItem("_authenticated", jsonPayload);
            } else {
                window.location.href = "/";
            }
        };

        /**
         * _showOwner
         */
        const _showOwner = () => {
            document.getElementById("menuCompanies").classList.remove("hide");
            //routes OWNER
            $routeProvider.when("/companies", {
                templateUrl: "partials/companies/companies.html",
                controller: "CompaniesController"
            });
            $routeProvider.when("/companies/new", {
                templateUrl: "partials/companies/new/new.html",
                controller: "CompaniesNewController"
            });
            $routeProvider.when("/companies/edit/:id", {
                templateUrl: "partials/companies/new/new.html",
                controller: "CompaniesNewController"
            });
            $routeProvider.when("/companies/view/:id/:view", {
                templateUrl: "partials/companies/new/new.html",
                controller: "CompaniesNewController"
            });
            $routeProvider.when("/companies/users/:companyId", {
                templateUrl: "partials/companies/users/users.html",
                controller: "CompaniesUsersAdminController"
            });
            $routeProvider.when("/companies/users/:companyId/new", {
                templateUrl: "partials/companies/users/new/new.html",
                controller: "CompaniesUsersAdminNewController"
            });
            $routeProvider.when("/companies/users/:companyId/edit/:id", {
                templateUrl: "partials/companies/users/new/new.html",
                controller: "CompaniesUsersAdminNewController"
            });
            $routeProvider.when("/companies/users/:companyId/view/:id/:view", {
                templateUrl: "partials/companies/users/new/new.html",
                controller: "CompaniesUsersAdminNewController"
            });
        };

        /**
         * _acl
         * @param {Array} accessLevel
         */
        const _acl = accessLevel => {
            accessLevel.forEach(level => {
                switch (level) {
                    case "ONWER":
                        _showOwner();
                        break;
                    case "ADMIN":
                        break;
                    case "MANAGER":
                        break;
                    default:
                        document
                            .getElementById("menuCustomers")
                            .classList.remove("hide");
                        break;
                }
            });
        };

        _parseJwt();
    });

/**
 * logout
 */
function logout() {
    localStorage.removeItem("_TOKEN");
    localStorage.removeItem("_authenticated");
    window.location.href = "/";
}
