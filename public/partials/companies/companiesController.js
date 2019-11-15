angular
    .module("gestec")
    .controller("CompaniesController", function(
        $scope,
        $location,
        showMessage,
        showMessageQuestion,
        Companies,
        MenuManager
    ) {
        MenuManager("menuCompanies");
        $scope.showLoading = false;
        $scope.companies = [];

        /**
         * eventNew
         */
        $scope.eventNew = () => {
            $location.path("/companies/new");
        };

        /**
         * eventDelete
         * @param {Object} company
         */
        $scope.eventDelete = (company) => {
            if (!company._id) {
                showMessage("Selecione a empresa para excluir");
                return;
            } else {
                showMessageQuestion("Deseja excluir essa empresa?").then(
                    (event) => {
                        const ds = new Companies();
                        ds.$delete({
                            _id: company._id
                        })
                            .then((response) => {
                                init();
                            })
                            .catch((error) => {
                                console.error(
                                    "companiesController - eventDelete: ",
                                    error
                                );
                                showMessage("Falha ao excluir empresa");
                            });
                    },
                    () => {}
                );
            }
        };

        /**
         * init
         */
        const init = () => {
            $scope.showLoading = true;
            const ds = new Companies();
            ds.$find()
                .then((response) => {
                    $scope.showLoading = false;
                    $scope.companies = response.data;
                })
                .catch((error) => {
                    $scope.showLoading = false;
                    showMessage("Erro ao obter empresas");
                    console.error("companiesController - init: ", error);
                });
        };

        //init
        init();
    });
