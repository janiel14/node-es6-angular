angular
    .module("gestec")
    .controller("CompaniesUsersAdminController", function(
        $scope,
        $location,
        $routeParams,
        showMessage,
        showMessageQuestion,
        UsersAdmin,
        MenuManager
    ) {
        MenuManager("menuCompanies");
        $scope.showLoading = false;
        $scope.companyId = $routeParams.companyId || null;
        $scope.users = [];

        /**
         * eventNew
         */
        $scope.eventNew = () => {
            $location.path("/companies/users/" + $scope.companyId + "/new");
        };

        $scope.eventBack = () => {
            $location.path("/companies");
        };

        /**
         * eventDelete
         * @param {Object} user
         */
        $scope.eventDelete = (user) => {
            if (!user._id) {
                showMessage("Selecione o usuário para excluir");
                return;
            } else {
                showMessageQuestion("Deseja excluir esse usuário?").then(
                    (event) => {
                        const ds = new UsersAdmin();
                        ds.$delete({
                            _id: user._id
                        })
                            .then((response) => {
                                init();
                            })
                            .catch((error) => {
                                console.error(
                                    "companiesUsersController - eventDelete: ",
                                    error
                                );
                                showMessage("Falha ao excluir usuário");
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
            const ds = new UsersAdmin();
            ds.$findWithCompany({
                companyId: $scope.companyId
            })
                .then((response) => {
                    $scope.showLoading = false;
                    $scope.users = response.data;
                })
                .catch((error) => {
                    $scope.showLoading = false;
                    showMessage("Erro ao obter usuários da empresa");
                    console.error("companiesUsersController - init: ", error);
                });
        };

        //init
        init();
    });
