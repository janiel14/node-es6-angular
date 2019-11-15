angular.module("gestec").factory("showMessage", function($mdToast) {
    return (message, delay = 3000) => {
        $mdToast.show(
            $mdToast
                .simple()
                .textContent(message)
                .position("bottom right")
                .hideDelay(delay)
        );
    };
});
