const db = require("electron").remote.require("./resources/js/database.js");
const fs = require("fs");
const NodeID3 = require('node-id3');
var configuration = JSON.parse(fs.readFileSync("./resources/configuration.json"));

let information;
//获取文件目录下的歌曲和歌词music和lrc为对象{歌曲名：“path”}前者不带后缀，后者带后缀
let audio = document.querySelector("audio");
/*三个button选中的其实是图片，为了更好地控制可响应点击的区域*/
let previousBtn = document.querySelector(".bottombar-control__button--previous img");
let nextBtn = document.querySelector(".bottombar-control__button--next img");
let playOrPauseBtn = document.querySelector(".bottombar-control__button--pauseOrPlay img");
/*默认情况下进入页面不播放*/
let play = false;
/*播放页*/
let title = document.querySelector(".information-name");
let singer = document.querySelector("#information-singer");
let album = document.querySelector("#information-album");
let musicImg = document.querySelector(".audio-play__left--img img");
let intervalTime = 0;
let lastAudioTime = 0;
/****************************************/
let wholeTimeSpan = document.querySelector(".timebar-time__whole");//歌曲时长span
let currentTimeSpan = document.querySelector(".timebar-time__current");//00:00时间span
let currentTimeProgress = document.querySelector(".progressbar-current");//当前进度条
let wholeTimeProgress = document.querySelector(".timebar-time__progressbar");//进度条框
let volumebar = document.querySelector(".volume-louder");
let currentVolume = document.querySelector(".volume-louder__current");
let lyricBox = document.querySelector("#lyric-box");
let lyric, lyricArray;
let [lastId, firstId] = readAndSetDatabase();

class controllerClass {
    constructor(volume, id) {
        this.volume = volume;
        for (let i = 1; i <= lastId; i++) {
            if (db.read([["id", i]]).id === undefined) {
                continue;
            } else if (!fs.existsSync(db.read([["id", i]]).path)) {
                db.delete([["id", i]]);
            }
        }
        [lastId,firstId]=readAndSetDatabase();
        while(1){
            if(db.read([["id",id]]).id===undefined){
                if(id===lastId){
                    id=1;
                }else{
                    id++;
                }
            }else{
                break;
            }
        }
        information = db.read([["id", id]]);
        this.id = id;
    }

    nextMusic() {
        do {
            if (controller.id === lastId) {
                controller.id = firstId;
            } else {
                controller.id++;
            }
            if (db.read([["id", controller.id]]).id !== undefined) {
                break;
            }
        } while (1);
        information = db.read([["id", controller.id]]);
        audio.src = information.path;
        intervalTime = 0;
        lastAudioTime = 0;
        analyzeLrc(information.lrc);
        audio.load();
        currentTimeSpan.innerText = "00:00";
        currentTimeProgress.style.width = "0px";
        if (play) {
            audio.play();
        }
        lyricBox.parentNode.scrollTop=0;
    }

    previousMusic() {
        do {
            if (controller.id === firstId) {
                controller.id = lastId;
            } else {
                controller.id--;
            }
            if (db.read([["id", controller.id]]).id !== undefined) {
                break;
            }
        } while (1);
        information = db.read([["id", controller.id]]);
        audio.src = information.path;
        intervalTime = 0;
        lastAudioTime = 0;
        analyzeLrc(information.lrc);
        audio.load();
        currentTimeSpan.innerText = "00:00";
        currentTimeProgress.style.width = "0px";
        if (play) {
            audio.play();
        }
        lyricBox.parentNode.scrollTop=0;
    }

    setProgressWidth(percent) {
        let wholeWidth = wholeTimeProgress.offsetWidth;
        currentTimeProgress.style.width = `${wholeWidth * percent}px`;
    }

    setVolume(percent) {
        let wholeWidth = volumebar.offsetWidth;
        currentVolume.style.width = `${wholeWidth * percent}px`;
        audio.volume = percent;
        controller.volume = percent;
    }
}

/*TODO：初始化*/
let controller = new controllerClass(configuration.volume, configuration.id);//传入音量，乐曲名,以后将由储存的配置表传入

audio.src = information.path;
analyzeLrc(information.lrc);
audio.load();
audio.currentTime = configuration.currentTime;
controller.setProgressWidth(controller.currentTime / audio.duration);
controller.setVolume(controller.volume);
audio.addEventListener("canplay", () => {
    wholeTimeSpan.innerText = transTimeToMin(audio.duration);
});


/*几个点击时改变图标的监听*/
previousBtn.addEventListener("mousedown", () => {
    previousBtn.src = "resources/images/preHover.png";
});
nextBtn.addEventListener("mousedown", () => {
    nextBtn.src = "resources/images/nextHover.png";
});
document.addEventListener("mouseup", () => {
    previousBtn.src = "resources/images/pre.png";
    nextBtn.src = "resources/images/next.png";
});

/*暂停/播放*/
playOrPauseBtn.addEventListener("click", () => {
    if (play) {
        playOrPauseBtn.src = "resources/images/play.png";
        play = false;
        audio.pause();
    } else {
        playOrPauseBtn.src = "resources/images/pause.png";
        play = true;
        audio.play();
    }
});

/****************************上一首，下一首**************************/

previousBtn.addEventListener("click", controller.previousMusic);
nextBtn.addEventListener("click", controller.nextMusic);
audio.addEventListener("ended", controller.nextMusic);

/******************************************************************/


/**************************设置时间，进度条，音量条********************/
let mouseIsDownForTime = false;
let mouseIsDownForVolume = false;
let downPosition = 0;
let movePosition = 0;
let distance = 0;
let percent = 0;
let isout = 0;

audio.addEventListener("timeupdate", () => {
    if (mouseIsDownForTime)
        return;
    let time = audio.currentTime;
    let wholeTime = audio.duration;
    let percent = time / wholeTime;
    currentTimeSpan.innerText = transTimeToMin(time);
    controller.setProgressWidth(percent);
});
wholeTimeProgress.addEventListener("mousedown", mouseDownFunctionForTime);
wholeTimeProgress.addEventListener("mousemove", mouseMoveFunctionForTime);
document.addEventListener("mousemove", mouseOutFunctionForTime);
document.addEventListener("mouseup", mouseUpFunctionForTime);
wholeTimeProgress.addEventListener("mouseup", mouseUpFunctionForTime);

function mouseDownFunctionForTime(e) {
    mouseIsDownForTime = true;
    downPosition = e.clientX;
    distance = downPosition - wholeTimeProgress.offsetLeft;
    percent = distance / wholeTimeProgress.offsetWidth;
    controller.setProgressWidth(percent);
    currentTimeSpan.innerText = transTimeToMin(audio.duration * percent);
}

function mouseMoveFunctionForTime(e) {
    if (!mouseIsDownForTime)
        return;
    movePosition = e.clientX;
    distance = movePosition - wholeTimeProgress.offsetLeft;
    percent = distance / wholeTimeProgress.offsetWidth;
    controller.setProgressWidth(percent);
    currentTimeSpan.innerText = transTimeToMin(audio.duration * percent);
}

function mouseOutFunctionForTime(e) {
    if (!mouseIsDownForTime)
        return;
    movePosition = e.clientX;
    isout = movePosition - wholeTimeProgress.offsetLeft - wholeTimeProgress.offsetWidth;
    if (isout > 0) {
        percent = 1;
        controller.setProgressWidth(percent);
        currentTimeSpan.innerText = transTimeToMin(audio.duration * percent);
    } else if (isout < (-wholeTimeProgress.offsetWidth)) {
        percent = 0;
        controller.setProgressWidth(percent);
        currentTimeSpan.innerText = transTimeToMin(audio.duration * percent);
    } else {
        distance = movePosition - wholeTimeProgress.offsetLeft;
        percent = distance / wholeTimeProgress.offsetWidth;
        controller.setProgressWidth(percent);
        currentTimeSpan.innerText = transTimeToMin(audio.duration * percent);
    }
}

function mouseUpFunctionForTime(e) {
    if (!mouseIsDownForTime)
        return;
    mouseIsDownForTime = false;
    audio.currentTime = audio.duration * percent;
    downPosition = 0;
    movePosition = 0;
    distance = 0;
    percent = 0;
    isout = 0;
    intervalTime = 0;
    lastAudioTime = 0;
}

volumebar.addEventListener("mousedown", mouseDownFunctionForVolume);
volumebar.addEventListener("mousemove", mouseMoveFunctionForVolume);
document.addEventListener("mousemove", mouseOutFunctionForVolume);
document.addEventListener("mouseup", mouseUpFunctionForVolume);
volumebar.addEventListener("mouseup", mouseUpFunctionForVolume);

function mouseDownFunctionForVolume(e) {
    mouseIsDownForVolume = true;
    downPosition = e.clientX;
    distance = downPosition - volumebar.offsetLeft;
    percent = distance / volumebar.offsetWidth;
    controller.setVolume(percent);
}

function mouseMoveFunctionForVolume(e) {
    if (!mouseIsDownForVolume)
        return;
    movePosition = e.clientX;
    distance = movePosition - volumebar.offsetLeft;
    percent = distance / volumebar.offsetWidth;
    controller.setVolume(percent);
}

function mouseOutFunctionForVolume(e) {
    if (!mouseIsDownForVolume)
        return;
    movePosition = e.clientX;
    isout = movePosition - volumebar.offsetLeft - volumebar.offsetWidth;
    if (isout > 0) {
        percent = 1;
        controller.setVolume(percent);
    } else if (isout < (-volumebar.offsetWidth)) {
        percent = 0;
        controller.setVolume(percent);
    } else {
        distance = movePosition - volumebar.offsetLeft;
        percent = distance / volumebar.offsetWidth;
        controller.setVolume(percent);
    }
}

function mouseUpFunctionForVolume(e) {
    if (!mouseIsDownForVolume)
        return;
    mouseIsDownForVolume = false;
    downPosition = 0;
    movePosition = 0;
    distance = 0;
    percent = 0;
    isout = 0;
}

/******************************************************************/


/*获取music函数*/

/*TODO：必须改写*/
function readAndSetDatabase() {
    let musicArray = fs.readdirSync("./resources/musics");
    let _name, _singer, _album, _lrc, _id, _path;
    for (let i = 0; i < musicArray.length; i++) {
        if (db.read([["path", `resources/musics/${musicArray[i]}`]]).id !== undefined) {
            continue;
        }
        NodeID3.read(`resources/musics/${musicArray[i]}`, (err, tags) => {
            _name = (tags.title === undefined) ? musicArray[i].replace(/\.\w+$/, "") : tags.title;
            _singer = (tags.artist === undefined) ? "未知艺术家" : tags.artist;
            _album = (tags.album === undefined) ? "未知唱片集" : tags.album;
            _path = `resources/musics/${musicArray[i]}`;
            _lrc = `resources/lrc/${musicArray[i].replace(/\.\w+$/, ".lrc")}`;
            for (let i = 1; 1; i++) {
                if (db.read([["id", i]]).id === undefined) {
                    _id = i;
                    break;
                }
            }
            db.insert([_name, _id, _lrc, _path, _singer, _album, 0]);
        });
    }
    db.save();
    return [db.read()[0].values[0][1], db.read()[0].values[db.read()[0].values.length - 1][1]];
    // NodeID3.read(music[`${controller.musicName}`], (err, tags) => {
    //     title.innerText = (tags.title===undefined)?controller.musicName:tags.title;
    //     singer.innerText = (tags.artist===undefined)?"未知艺术家":tags.artist;
    //     album.innerText = (tags.album===undefined)?"未知唱片集":tags.album;
    //     //if(tags.image.imageBuffer)
    //     musicImg.src = `data:;base64,${tags.image.imageBuffer.toString('base64')}`;
    // });


    // let music = {};
    // let lrc = {};
    // let musicArray = fs.readdirSync("./resources/musics");
    // let lrcArray = fs.readdirSync("./resources/lrc");
    // let name;
    // for (let i = 0; i < musicArray.length; i++) {
    //     name = musicArray[i].replace(/\.[\S]+/, "");
    //     music[name] = `resources/musics/${musicArray[i]}`;
    // }
    // for (let i = 0; i < lrcArray.length; i++) {
    //     name = lrcArray[i].replace(/\.[\S]+/, "");
    //     lrc[name] = `resources/lrc/${lrcArray[i]}`;
    // }
    // return [music, lrc];
}

function transTimeToMin(value) {
    let m = Math.floor(value / 60);
    let s = Math.floor(value % 60);
    m = (m < 10) ? `0${m}` : `${m}`;
    s = (s < 10) ? `0${s}` : `${s}`;
    return `${m}:${s}`;
}


/*****************歌词解析**********************************/


function analyzeLrc(path) {
    if (!fs.existsSync(path)) {
        lyricBox.innerHTML = `<li class="selected">暂无本地歌词</li>`;
        setInformation(false);
    } else {
        fs.open(path, "r", (err, fd) => {
            if (err) {
                console.log(err);
            } else {
                fs.readFile(path, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        lyric = data.toLocaleString().split('\n');
                        setInformation(true);
                    }
                })
            }
        })
    }

}

function setInformation(hasLrc) {
    NodeID3.read(information.path, (err, tags) => {
        if (tags === false || typeof tags.image === "undefined" || typeof tags.image.imageBuffer === "undefined") {
            musicImg.src = "./resources/images/audioImg-Temp.jpg";
        } else {
            musicImg.src = `data:;base64,${tags.image.imageBuffer.toString('base64')}`;
        }
    });
    title.innerText = information.name;
    singer.innerText = information.singer;
    album.innerText = information.album;
    if (hasLrc) {
        lyricArray = [];
        let timeReg = /\[\d{2}:\d{2}.\d{2,}]/g;
        while (!timeReg.test(lyric[0])) {
            lyric = lyric.slice(1);
        }
        if (lyric[lyric.length - 1] === "") {
            lyric.pop();
        }
        for (let i = 0; i < lyric.length; i++) {
            let time = lyric[i].match(timeReg);
            let line = lyric[i].replace(timeReg, "");
            for (let j = 0; j < time.length; j++) {
                let temp = `${time[j]}`;
                temp = temp.slice(1, -1).split(":");
                temp = parseInt(temp[0]) * 60 + parseFloat(temp[1]);
                lyricArray.push([temp, line]);
            }
        }
        lyricArray.sort((a, b) => {
            return a[0] - b[0];
        });
        let temp = "";
        for (let i = 0; i < lyricArray.length; i++) {
            if (i === 0)
                temp = `<li class="selected">${lyricArray[i][1]}</li>`;
            else
                temp = temp + `<li>${lyricArray[i][1]}</li>`;
        }
        lyricBox.innerHTML = temp;
        audio.removeEventListener("timeupdate", scrollLyric);
        audio.addEventListener("timeupdate", scrollLyric);
    } else {
        audio.removeEventListener("timeupdate", scrollLyric);
    }
}


function scrollLyric() {
    if (audio.currentTime - lastAudioTime <= intervalTime)
        return;
    let li = document.querySelectorAll("#lyric-box li");
    if (li[lyricArray.length - 1].classList.contains("selected") && audio.currentTime > lyricArray[lyricArray.length - 1][0])
        return;
    for (let i = 0; i < lyricArray.length; i++) {
        if (audio.currentTime > lyricArray[i][0]) {
            lastAudioTime = lyricArray[i][0];
            if (!(i === lyricArray.length - 1))
                intervalTime = lyricArray[i + 1][0] - lyricArray[i][0];
            let selected = lyricBox.querySelector(".selected");
            selected.classList.remove("selected");
            li[i].classList.add("selected");
            lyricBox.parentNode.scrollTop = li[i].offsetTop;
        }
    }
}


