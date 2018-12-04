let jmore_ul = document.getElementById("more_ul");
let ribbons = [
    document.getElementById("more_nav_ribbon1"),
    document.getElementById("more_nav_ribbon2"),
    document.getElementById("more_nav_ribbon3"),
];
let containers = [
    document.getElementById("more_container1"),
    document.getElementById("more_container2"),
    document.getElementById("more_container3"),
];
let more_center_ribbon = 2;
let doing = false;

function ribbonOnClick(target) {
    let click_id = Number.parseInt(target.dataset.num);
    if (click_id === more_center_ribbon) return false;
    let delta = click_id - more_center_ribbon;
    if (delta === 2) delta = -1;
    else if (delta === -2) delta = 1;
    let _index = more_center_ribbon - 1 + delta;
    if(_index===3) _index = 0;
    else if(_index===-1) _index = 2;
    moreOnClick(containers[_index]);
}

function moreOnClick(target) {
    let dir = target.dataset.dir;
    if (dir === "none") return false;
    if (doing) return false;
    doing = true;
    let toCenter = target;
    let targetNum = target.dataset.num;
    let toLeft, toRight;
    for (let _li of jmore_ul.children) {
        let _dir = _li.dataset.dir;
        if (_dir === dir) continue;
        switch (_dir) {
            case "left":
                toRight = _li;
                break;
            case "right":
                toLeft = _li;
                break;
            case "none":
                if (dir === "left") {
                    toRight = _li;
                } else if (dir === "right") {
                    toLeft = _li;
                }
                break;
        }
    }
    let collection = [toLeft, toRight, toCenter];
    for (let _div of collection) {
        _div.classList.remove("more_container");
    }
    for (let i = 1; i <= 3; i++) {
        let __dom = document.querySelector(`.more_nav_item[data-num="${i}"]`);
        if (i === more_center_ribbon) {
            __dom.classList.remove("more_nav_active");
            __dom.classList.add("more_nav_noactive");
        } else if (i === Number.parseInt(targetNum)) {
            __dom.classList.remove("more_nav_noactive");
            __dom.classList.add("more_nav_active");
        }
    }
    if (toLeft.dataset.dir === "right") {
        toLeft.style.zIndex = 0;
        toRight.style.zIndex = 1;
    } else {
        toLeft.style.zIndex = 1;
        toRight.style.zIndex = 0;
    }
    toCenter.style.zIndex = 50;
    for (let _div of collection) {
        _div.classList.add("more_container");
    }
    toLeft.style.left = "0";
    toLeft.classList.remove("more_container_active");
    toLeft.classList.add("more_container_noactive");
    toRight.style.left = "40vw";
    toRight.classList.remove("more_container_active");
    toRight.classList.add("more_container_noactive");
    toCenter.style.left = "20vw";
    toCenter.classList.add("more_container_active");
    toCenter.classList.remove("more_container_noactive");
    toLeft.dataset.dir = "left";
    toRight.dataset.dir = "right";
    toCenter.dataset.dir = "none";
    more_center_ribbon = Number.parseInt(targetNum);
    setTimeout(() => {
        toLeft.style.zIndex = "";
        toRight.style.zIndex = "";
        doing = false;
    }, 600);
}