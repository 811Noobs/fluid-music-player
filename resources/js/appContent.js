class Sidebar {
    constructor(node) {
        this.node = node;
        this.originWidth = this.node.offsetWidth;
        this.resizer = null;
        this.resizable = null;

        this.initResizer();
    }
    getWidth() {
        return this.node.offsetWidth;
    }
    setWidth(width) {
        this.node.style.width = width + "px";
    }
    initResizer() {
        this.resizer = this.node.querySelector(".sidebar-resizer");
        this.widthVarity = 0;
        this.resizer.addEventListener("mousedown", (event) => {
            this.dragBeginX = event.clientX;
            this.dragBeginWidth = this.node.offsetWidth;
            this.resizable = true;
            console.log("down!" + this.dragBeginX);
        });
        // this.resizer.addEventListener("mousemove", (event) => {
        //     if (!this.resizable) { return; }
        //     // this.varity += event.clientX;
        //     //this.dragBeginX = event.clientX;
        //     this.widthVarity = event.clientX - this.dragBeginX;
        //     console.log("!");
        //     this.setWidth(this.originWidth + this.widthVarity);
        // });
        // this.resizer.addEventListener("mouseout", (event) => {
        //     if (!this.resizable) { return; }
        //     // this.varity += event.clientX;
        //     //this.dragBeginX = event.clientX;
        //     console.log()
        //     this.setWidth(event.clientX);
        // });
        this.resizer.addEventListener("mouseup", (event) => {
            if (!this.resizable) { return; }
            this.resizable = false;
        });

        // this.resizer.addEventListener("mouseout", (event) => {
        //     if (!this.resizable) { return; }
        //     this.resizable = false;
        // });
    }

}

class SectionWrap {
    constructor(node) {
        this.node = node;
        this.originWidth = this.node.offsetWidth;
        this.setWidth(document.body.offsetWidth - sidebar.getWidth() - 1);
    }
    getWidth() {
        return this.node.offsetWidth;
    }
    setWidth(width) {
        this.node.style.width = width + "px";
    }
}



const sidebar = new Sidebar(document.querySelector(".app-content__sidebar"));
const sectionWrap = new SectionWrap(document.querySelector(".app-content__section"));

document.addEventListener("mousemove", (event) => {
    if (!sidebar.resizable) { return; }
    sidebar.widthVarity = event.clientX - sidebar.dragBeginX;
    console.log("!wi" + event.clientX);
    if (sidebar.dragBeginWidth + sidebar.widthVarity > document.body.offsetWidth / 2) {
        sidebar.setWidth(document.body.offsetWidth / 2);
        sectionWrap.setWidth(document.body.offsetWidth - sidebar.getWidth());
        //sidebar.resizable = false;
        return;
    }
    if (sidebar.dragBeginWidth + sidebar.widthVarity < sidebar.originWidth) {
        sidebar.setWidth(sidebar.originWidth);
        sectionWrap.setWidth(document.body.offsetWidth - sidebar.getWidth());
        //sidebar.resizable = false;
        return;
    }
    sidebar.setWidth(sidebar.dragBeginWidth + sidebar.widthVarity);
    sectionWrap.setWidth(document.body.offsetWidth - sidebar.getWidth());
});
document.addEventListener("mouseup", (event) => {
    if (!sidebar.resizable) { return; }
    sidebar.resizable = false;
});

window.onresize = () => {
    sectionWrap.setWidth(document.body.offsetWidth - sidebar.getWidth() - 1);
}