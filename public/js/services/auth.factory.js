angular.module("gestec").factory("auth", function($location, $q) {
    const auth = {
        responseError: (response) => {
            if (response.status == 401)
                window.location.href = window.location.hostname;

            return $q.reject(response);
        }
    };

    return auth;
});
