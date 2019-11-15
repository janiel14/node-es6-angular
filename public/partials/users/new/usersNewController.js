angular
    .module("gestec")
    .controller("UsersNewController", function(
        $scope,
        $location,
        $routeParams,
        showMessage,
        Users,
        Pdvs,
        Employees,
        AccessLevel,
        MenuManager
    ) {
        MenuManager("menuUsers");
        $scope._accessLevel = AccessLevel;
        $scope.readonly = $routeParams.view || false;
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
        $scope.pdvs = [];
        $scope.employees = [];
        $scope.user = {
            pdvs: []
        };

        /**
         * validadeForm
         * @param {Object} data
         * @return {Boolean} true/false
         */
        const validadeForm = (data) => {
            if (data.active == undefined) return false;
            if (data.accessLevel == undefined) return false;
            if (!data.name) return false;
            if (!data.email) return false;
            if (!data.password) return false;
            return true;
        };

        /**
         * pdvsGet
         * @return {Array} pdvs
         */
        const pdvsGet = async () => {
            return new Promise((resolve, reject) => {
                const ds = new Pdvs();
                ds.$find({
                    limit: 100000000000000000
                })
                    .then((response) => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        };

        /**
         * employeesGet
         * @return {Array} pdvs
         */
        const employeesGet = async () => {
            return new Promise((resolve, reject) => {
                const ds = new Employees();
                ds.$find({
                    limit: 100000000000000000
                })
                    .then((response) => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        };

        /**
         * eventBack
         */
        $scope.eventBack = () => {
            $location.path("/users");
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
                const ds = new Users($scope.user);
                ds.$create()
                    .then((response) => {
                        $scope.showLoading = false;
                        $location.path("/users");
                    })
                    .catch((error) => {
                        console.error("usersNewController - save: ", error);
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
        const init = async () => {
            try {
                $scope.pdvs = await pdvsGet();
                $scope.employees = await employeesGet();
                if ($routeParams.id) {
                    $scope.showLoading = true;
                    const ds = new Users();
                    const response = await ds.$findOne({
                        _id: $routeParams.id
                    });
                    $scope.showLoading = false;
                    if (response.data) {
                        $scope.user = response.data;
                        const pdv = $scope.pdvs.filter((item) => {
                            const finded = $scope.user.pdvs.find((userPdv) => {
                                return userPdv === item._id;
                            });
                            return finded;
                        });
                        $scope.user.pdvs = pdv;
                        const employee = $scope.employees.find((item) => {
                            return item._id === $scope.user.employeeId;
                        });
                        $scope.user.employeeId = employee;
                        if ($scope.user.active)
                            $scope.user.active = $scope.dsActive[0];
                        else $scope.user.active = $scope.dsActive[1];

                        if ($scope.user.accessLevel === "ADMIN")
                            $scope.user.accessLevel = $scope.dsAccessLevels[0];
                        else if ($scope.user.accessLevel === "MANAGER")
                            $scope.user.accessLevel = $scope.dsAccessLevels[1];
                        else $scope.user.accessLevel = $scope.dsAccessLevels[2];
                    }
                }
            } catch (error) {
                $scope.showLoading = false;
                console.error("usersNewController - init: ", error);
                showMessage("Error ao buscar usuário por id");
            }
        };

        //init
        init();
    });
