angular.module("gestec").factory("AccessLevel", function() {
    /**
     * parseJwt
     */
    const _getAccessLevel = () => {
        let accessLevel = "OPERATOR";
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
            accessLevel = auth.sub.user.accessLevel[0];
        }
        return accessLevel;
    };

    return _getAccessLevel();
});
