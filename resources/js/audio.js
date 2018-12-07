//获取文件目录下的歌曲和歌词music和lrc为对象{歌曲名：“path”}前者不带后缀，后者带后缀
let audio = document.querySelector("audio");
/*三个button选中的其实是图片，为了更好地控制可响应点击的区域*/
let previousBtn = document.querySelector(".bottombar-control__button--previous img");
let nextBtn = document.querySelector(".bottombar-control__button--next img");
let playOrPauseBtn = document.querySelector(".bottombar-control__button--pauseOrPlay img");
/*默认情况下进入页面不播放*/
let play = false;
let wholeTimeSpan = document.querySelector(".timebar-time__whole");//歌曲时长span
let currentTimeSpan = document.querySelector(".timebar-time__current");//00:00时间span
let currentTimeProgress = document.querySelector(".progressbar-current");//当前进度条
let wholeTimeProgress = document.querySelector(".timebar-time__progressbar");//进度条框
let volumebar = document.querySelector(".volume-louder");
let currentVolume = document.querySelector(".volume-louder__current");
let lyricBox = document.querySelector("#lyric-box");
let lyric, lyricArray;
let [music, lrc] = getMusicAndLrc();

class controllerClass {
    constructor(volume, name) {
        this.volume = volume;
        this.musicName = name;
    }

    nextMusic() {
        let nameArray = Object.getOwnPropertyNames(music);
        let num = nameArray.length;
        for (let count = 0; count < num; count++) {
            if (controller.musicName === nameArray[count]) {
                controller.musicName = nameArray[(count + 1) % num];
                break;
            }
        }
        audio.src = music[`${controller.musicName}`];
        analyzeLrc(lrc[`${controller.musicName}`]);
        audio.load();
        currentTimeSpan.innerText = "00:00";
        currentTimeProgress.style.width = "0px";
        if (play) {
            audio.play();
        }
    }

    previousMusic() {
        let nameArray = Object.getOwnPropertyNames(music);
        let num = nameArray.length;
        for (let count = 0; count < num; count++) {
            if (controller.musicName === nameArray[count]) {
                controller.musicName = nameArray[(count + num - 1) % num];
                break;
            }
        }
        audio.src = music[`${controller.musicName}`];
        analyzeLrc(lrc[`${controller.musicName}`]);
        audio.load();
        currentTimeSpan.innerText = "00:00";
        currentTimeProgress.style.width = "0px";
        if (play) {
            audio.play();
        }
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
let controller = new controllerClass(0.5, "故梦");//传入音量，乐曲名,以后将由储存的配置表传入
audio.src = music[`${controller.musicName}`];
analyzeLrc(lrc[`${controller.musicName}`]);
audio.load();
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
    scrollLyric();
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
function getMusicAndLrc() {
    let fs = require("fs");
    let music = {};
    let lrc = {};
    let musicArray = fs.readdirSync("./resources/musics");
    let lrcArray = fs.readdirSync("./resources/lrc");
    let name;
    for (let i = 0; i < musicArray.length; i++) {
        name = musicArray[i].replace(/\.[\S]+/, "");
        music[name] = `resources/musics/${musicArray[i]}`;
    }
    for (let i = 0; i < lrcArray.length; i++) {
        name = lrcArray[i].replace(/\.[\S]+/, "");
        lrc[name] = `resources/lrc/${lrcArray[i]}`;
    }
    return [music, lrc];
}

function transTimeToMin(value) {
    let m = Math.floor(value / 60);
    let s = Math.floor(value % 60);
    m = (m < 10) ? `0${m}` : `${m}`;
    s = (s < 10) ? `0${s}` : `${s}`;
    return m + ":" + s;
}


/*****************歌词解析**********************************/
var title = document.querySelector(".information-name");
var singer = document.querySelector("#information-singer");
var album = document.querySelector("#information-album");
var musicImg = document.querySelector(".audio-play__left--img img");
var intervalTime=0;
var lastAudioTime=0;
function analyzeLrc(path) {
    lyricBox.innerHTML = "";
    let fs = require("fs");
    fs.open(path, "r", (err, fd) => {
        if (err) {
            console.log(err);
        } else {
            fs.readFile(path, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    lyric = data.toLocaleString().split('\n');
                    setInformation();
                }
            })
        }
    })
}

function setInformation() {
    let NodeID3 = require('node-id3')
    NodeID3.read(music[`${controller.musicName}`], (err, tags) => {
        console.log(tags);
        title.innerText = tags.title;
        singer.innerText = tags.artist;
        album.innerText = tags.album;
        musicImg.src = `data:;base64,${tags.image.imageBuffer.toString('base64')}`;
    });
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
}

function scrollLyric() {
    if(Math.abs(audio.currentTime-lastAudioTime)<intervalTime)
        return;
    let li = document.querySelectorAll("#lyric-box li");
    for (let i = 0; i < lyricArray.length; i++) {
        if (audio.currentTime > lyricArray[i][0]) {
            let selected = lyricBox.querySelector(".selected");
            selected.classList.remove("selected");
            li[i].classList.add("selected");
            lyricBox.parentNode.scrollTop = i * 50;
            lastAudioTime=audio.currentTime;
            intervalTime=lyricArray[i+1][0]-lyricArray[i][0];
        }
    }
}