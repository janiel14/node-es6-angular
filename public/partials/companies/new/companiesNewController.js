angular
    .module("gestec")
    .controller("CompaniesNewController", function(
        $scope,
        $location,
        $routeParams,
        showMessage,
        Companies,
        MenuManager
    ) {
        MenuManager("menuCompanies");
        $scope.readonly = $routeParams.view || false;
        $scope.showLoading = false;
        $scope.dsActive = [
            {
                name: "Ativa",
                value: true
            },
            {
                name: "Inativa",
                value: false
            }
        ];
        $scope.company = {};

        /**
         * validadeForm
         * @param {Object} data
         * @return {Boolean} true/false
         */
        const validadeForm = (data) => {
            if (data.active == undefined) return false;
            if (!data.cnpj) return false;
            if (!data.name) return false;
            if (!data.address) return false;
            if (!data.number) return false;
            if (!data.neighborhood) return false;
            if (!data.country) return false;
            if (!data.province) return false;
            if (!data.city) return false;
            return true;
        };

        /**
         * eventBack
         */
        $scope.eventBack = () => {
            $location.path("/companies");
        };

        /**
         * eventSave
         */
        $scope.eventSave = () => {
            $scope.company.active = $scope.company.active.value;
            if (validadeForm($scope.company)) {
                $scope.showLoading = true;
                const ds = new Companies($scope.company);
                ds.$create()
                    .then((response) => {
                        $scope.showLoading = false;
                        $location.path("/companies");
                    })
                    .catch((error) => {
                        console.error("companiesNewControler - save: ", error);
                        showMessage("Não foi possível salvar nova empresa!");
                        $scope.showLoading = false;
                    });
            } else {
                showMessage("Informe todos os campos obrigatórios com *!");
            }
        };

        /**
         * init
         */
        const init = () => {
            if ($routeParams.id) {
                $scope.showLoading = true;
                const ds = new Companies();
                ds.$findOne({
                    _id: $routeParams.id
                })
                    .then((response) => {
                        $scope.showLoading = false;
                        $scope.company = response.data;
                        if ($scope.company.active)
                            $scope.company.active = $scope.dsActive[0];
                        else $scope.company.active = $scope.dsActive[1];
                    })
                    .catch((error) => {
                        $scope.showLoading = false;
                        console.error("companiesNewController - init: ", error);
                        showMessage("Error ao buscar empresa por id");
                    });
            }
        };

        //init
        init();
    });
