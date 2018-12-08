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
        this.resizer.addEventListener("mouseup", (event) => {
            if (!this.resizable) { return; }
            this.resizable = false;
        })
    }

}

// class SectionWrap {
//     constructor(node) {
//         this.node = node;
//         this.originWidth = this.node.offsetWidth;
//         this.setWidth(document.body.offsetWidth - sidebar.getWidth());
//     }
//     getWidth() {
//         return this.node.offsetWidth;
//     }
//     setWidth(width) {
//         this.node.style.width = width + "px";
//     }
// }



const sidebar = new Sidebar(document.querySelector(".app-content__sidebar"));
//const sectionWrap = new SectionWrap(document.querySelector(".app-content__section"));

document.addEventListener("mousemove", (event) => {
    if (!sidebar.resizable) { return; }
    sidebar.widthVarity = event.clientX - sidebar.dragBeginX;
    console.log("!wi" + sidebar.widthVarity);
    if (sidebar.dragBeginWidth + sidebar.widthVarity > document.body.offsetWidth / 2) {
        sidebar.setWidth(document.body.offsetWidth / 2);
        // sectionWrap.setWidth(document.body.offsetWidth - sidebar.getWidth());
        //sidebar.resizable = false;
        return;
    }
    if (sidebar.dragBeginWidth + sidebar.widthVarity < sidebar.originWidth) {
        sidebar.setWidth(sidebar.originWidth);
        // sectionWrap.setWidth(document.body.offsetWidth - sidebar.getWidth() - 0);
        //sidebar.resizable = false;
        return;
    }
    sidebar.setWidth(sidebar.dragBeginWidth + sidebar.widthVarity);
    // sectionWrap.setWidth(document.body.offsetWidth - sidebar.getWidth() - 0);
});
document.addEventListener("mouseup", (event) => {
    if (!sidebar.resizable) { return; }
    sidebar.resizable = false;
});

const sidebarPlayerToggle = document.querySelector(".sidebar-info__cover");
const PlayerPlayerToggle = document.querySelector(".audio-play__left--img img");
const playerSection = document.getElementById("audio-play__section");

function togglePlayer() {
    let classList = playerSection.classList;
    if (classList.contains("active")) {
        classList.remove("active");
    } else {
        classList.add("active");
    }
}


sidebarPlayerToggle.addEventListener("click", (event) => {
    togglePlayer();
});
PlayerPlayerToggle.addEventListener("click", (event) => {
    togglePlayer();
});

window.onresize = () => {
    // sectionWrap.setWidth(document.body.offsetWidth - sidebar.getWidth() - 1);
}