angular.module("gestec").factory("showMessageQuestion", function($mdDialog) {
    return (message, title = "Dúvida?") => {
        return $mdDialog.show(
            $mdDialog
                .confirm()
                .title(title)
                .textContent(message)
                .ok("Sim")
                .cancel("Não")
        );
    };
});
