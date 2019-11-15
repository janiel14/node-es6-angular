angular
    .module("gestec")
    .controller("UsersController", function(
        $scope,
        $location,
        showMessage,
        showMessageQuestion,
        Users,
        AccessLevel,
        MenuManager
    ) {
        MenuManager("menuUsers");
        $scope._accessLevel = AccessLevel;
        $scope.showLoading = false;
        $scope.itens = [];
        $scope.limit = 20;
        $scope.page = 0;
        $scope.pages = [];

        /**
         * paginate
         * @param {Number} total
         */
        const paginate = (total) => {
            let maxPages = total / $scope.limit;
            maxPages = Math.ceil(maxPages);
            let count = 1;
            while (maxPages > $scope.pages.length) {
                $scope.pages.push(count);
                count++;
            }
        };

        /**
         * paginateNext
         * @param {Number} page
         */
        $scope.paginateNext = (page) => {
            init(page, $scope.limit);
        };

        /**
         * eventNew
         */
        $scope.eventNew = () => {
            $location.path("/users/new");
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
                        const ds = new Users();
                        ds.$delete({
                            _id: user._id
                        })
                            .then((response) => {
                                init();
                            })
                            .catch((error) => {
                                console.error(
                                    "usersController - eventDelete: ",
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
        const init = (page = 0, limit = 20) => {
            $scope.showLoading = true;
            const ds = new Users();
            ds.$find({
                limit: limit,
                page: page
            })
                .then((response) => {
                    $scope.showLoading = false;
                    $scope.itens = response.data;
                    paginate(response.total);
                })
                .catch((error) => {
                    $scope.showLoading = false;
                    showMessage("Erro ao obter usuários");
                    console.error("usersController - init: ", error);
                });
        };

        //init
        init(0, $scope.limit);
    });
