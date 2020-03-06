function breakoutController() {
    let view = new breakoutView();

    this.init = function () {
        view.init();
    };
}


let controller = new breakoutController();
window.addEventListener("load", controller.init);