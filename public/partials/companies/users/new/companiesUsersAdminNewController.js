angular
    .module("gestec")
    .controller("CompaniesUsersAdminNewController", function(
        $scope,
        $location,
        $routeParams,
        showMessage,
        UsersAdmin,
        MenuManager
    ) {
        MenuManager("menuCompanies");
        $scope.readonly = $routeParams.view || false;
        $scope.companyId = $routeParams.companyId || null;
        $scope.showLoading = false;
        $scope.dsActive = [
            {
                name: "Ativo",
                value: true
            },
            {
                name: "Inativo",
                value: false
            }
        ];
        $scope.dsAccessLevels = [
            {
                name: "Administrador",
                value: "ADMIN"
            },
            {
                name: "Gerente",
                value: "MANAGER"
            },
            {
                name: "Operador",
                value: "OPERATOR"
            }
        ];
        $scope.user = {
            companyId: $scope.companyId,
            pdvs: []
        };

        /**
         * validadeForm
         * @param {Object} data
         * @return {Boolean} true/false
         */
        const validadeForm = (data) => {
            if (data.active == undefined) return false;
            if (!data.companyId) return false;
            if (data.accessLevel == undefined) return false;
            if (!data.name) return false;
            if (!data.email) return false;
            if (!data.password) return false;
            return true;
        };

        /**
         * eventBack
         */
        $scope.eventBack = () => {
            $location.path("/companies/users/" + $scope.companyId);
        };

        /**
         * checkEmailExists
         * @param {String} email
         */
        $scope.checkEmailExists = (email) => {
            if (!$routeParams.id)
                if (email) {
                    if (email.indexOf("@") > -1 && email.indexOf(".") > -1) {
                        const ds = new Users();
                        ds.$findWithEmail({
                            email: email
                        })
                            .then((response) => {
                                if (response.data) {
                                    showMessage(
                                        "E-mail já existe na base de cadastro, tente outro e-mail!"
                                    );
                                    $scope.user.email = "";
                                }
                            })
                            .catch((error) => {
                                console.error(
                                    "usersNewController - checkEmailExists: ",
                                    error
                                );
                                showMessage("Falha ao verificar e-mail!");
                            });
                    }
                }
        };

        /**
         * eventSave
         */
        $scope.eventSave = () => {
            $scope.user.active = $scope.user.active.value;
            $scope.user.accessLevel = $scope.user.accessLevel.value;
            if (validadeForm($scope.user)) {
                $scope.showLoading = true;
                const ds = new UsersAdmin($scope.user);
                ds.$create()
                    .then((response) => {
                        $scope.showLoading = false;
                        $location.path("/companies/users/" + $scope.companyId);
                    })
                    .catch((error) => {
                        console.error(
                            "companiesUsersNewControler - save: ",
                            error
                        );
                        showMessage("Não foi possível salvar novo usuário!");
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
                const ds = new UsersAdmin();
                ds.$findOne({
                    _id: $routeParams.id
                })
                    .then((response) => {
                        $scope.showLoading = false;
                        if (response.data) {
                            $scope.user = response.data;
                            if ($scope.user.active)
                                $scope.user.active = $scope.dsActive[0];
                            else $scope.user.active = $scope.dsActive[1];

                            if ($scope.user.accessLevel === "ADMIN")
                                $scope.user.accessLevel =
                                    $scope.dsAccessLevels[0];
                            else if ($scope.user.accessLevel === "MANAGER")
                                $scope.user.accessLevel =
                                    $scope.dsAccessLevels[1];
                            else
                                $scope.user.accessLevel =
                                    $scope.dsAccessLevels[2];
                        }
                    })
                    .catch((error) => {
                        $scope.showLoading = false;
                        console.error(
                            "companiesUsersNewController - init: ",
                            error
                        );
                        showMessage("Error ao buscar usuário por id");
                    });
            }
        };

        //init
        init();
    });
