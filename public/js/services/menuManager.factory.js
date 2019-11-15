angular.module("gestec").factory("MenuManager", function() {
    return (divId) => {
        const childs = document.getElementById("sideBarMenu").childNodes;
        childs.forEach((element) => {
            element.classList.remove("active");
        });
        document.getElementById(divId).classList.add("active");
        document
            .getElementsByTagName("body")[0]
            .classList.remove("sidebar-open");
    };
});
