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
let wholeTimeProgress=document.querySelector(".timebar-time__progressbar");//进度条框
let volumebar=document.querySelector(".volume-louder");
let currentVolume=document.querySelector(".volume-louder__current");
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
        audio.load();
        currentTimeSpan.innerText = "00:00";
        currentTimeProgress.style.width = "0px";
        if(play){
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
        audio.load();
        currentTimeSpan.innerText = "00:00";
        currentTimeProgress.style.width = "0px";
        if(play){
            audio.play();
        }
    }

    setProgressWidth(percent){
        let wholeWidth=wholeTimeProgress.offsetWidth;
        currentTimeProgress.style.width=`${wholeWidth*percent}px`;
    }

    setVolume(percent){
        let wholeWidth=volumebar.offsetWidth;
        currentVolume.style.width=`${wholeWidth*percent}px`;
        audio.volume=percent;
        controller.volume=percent;
    }
}

/*TODO：初始化*/
let controller = new controllerClass(0.5, "轮回之境");//传入音量，乐曲名,以后将由储存的配置表传入
audio.src = music[`${controller.musicName}`];
audio.load();
controller.setVolume(controller.volume);
audio.addEventListener("canplay",()=>{
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
        playOrPauseBtn.src = "resources/images/播放正方形.png";
        play = false;
        audio.pause();
    } else {
        playOrPauseBtn.src = "resources/images/暂停正方形.png";
        play = true;
        audio.play();
    }
});

/****************************上一首，下一首**************************/

previousBtn.addEventListener("click", controller.previousMusic);
nextBtn.addEventListener("click", controller.nextMusic);

/******************************************************************/


/**************************设置时间，进度条，音量条********************/
let mouseIsDownForTime=false;
let mouseIsDownForVolume=false;
let downPosition=0;
let movePosition=0;
let distance=0;
let percent=0;
let isout=0;

audio.addEventListener("timeupdate",()=>{
    if(mouseIsDownForTime)
        return;
    let time=audio.currentTime;
   let wholeTime=audio.duration;
   let percent=time/wholeTime;
    currentTimeSpan.innerText=transTimeToMin(time);
    controller.setProgressWidth(percent);
});
wholeTimeProgress.addEventListener("mousedown",mouseDownFunctionForTime);
wholeTimeProgress.addEventListener("mousemove",mouseMoveFunctionForTime);
document.addEventListener("mousemove",mouseOutFunctionForTime);
document.addEventListener("mouseup",mouseUpFunctionForTime);
wholeTimeProgress.addEventListener("mouseup",mouseUpFunctionForTime);
function mouseDownFunctionForTime(e) {
    mouseIsDownForTime=true;
    downPosition=e.clientX;
    distance = downPosition - wholeTimeProgress.offsetLeft;
    percent=distance/wholeTimeProgress.offsetWidth;
    controller.setProgressWidth(percent);
    currentTimeSpan.innerText=transTimeToMin(audio.duration*percent);
}
function mouseMoveFunctionForTime(e) {
    if(!mouseIsDownForTime)
        return;
    movePosition=e.clientX;
    distance=movePosition-wholeTimeProgress.offsetLeft;
    percent=distance/wholeTimeProgress.offsetWidth;
    controller.setProgressWidth(percent);
    currentTimeSpan.innerText=transTimeToMin(audio.duration*percent);
}
function mouseOutFunctionForTime(e) {
    if(!mouseIsDownForTime)
        return;
    movePosition=e.clientX;
    isout=movePosition-wholeTimeProgress.offsetLeft-wholeTimeProgress.offsetWidth;
    if(isout>0){
        percent=1;
        controller.setProgressWidth(percent);
        currentTimeSpan.innerText=transTimeToMin(audio.duration*percent);
    }else if(isout<(-wholeTimeProgress.offsetWidth)){
        percent=0;
        controller.setProgressWidth(percent);
        currentTimeSpan.innerText=transTimeToMin(audio.duration*percent);
    }else{
        distance=movePosition-wholeTimeProgress.offsetLeft;
        percent=distance/wholeTimeProgress.offsetWidth;
        controller.setProgressWidth(percent);
        currentTimeSpan.innerText=transTimeToMin(audio.duration*percent);
    }
}
function mouseUpFunctionForTime(e) {
    if(!mouseIsDownForTime)
        return;
    mouseIsDownForTime=false;
    audio.currentTime=audio.duration*percent;
    downPosition=0;
    movePosition=0;
    distance=0;
    percent=0;
    isout=0;
}
volumebar.addEventListener("mousedown",mouseDownFunctionForVolume);
volumebar.addEventListener("mousemove",mouseMoveFunctionForVolume);
document.addEventListener("mousemove",mouseOutFunctionForVolume);
document.addEventListener("mouseup",mouseUpFunctionForVolume);
volumebar.addEventListener("mouseup",mouseUpFunctionForVolume);
function mouseDownFunctionForVolume(e) {
    mouseIsDownForVolume=true;
    downPosition=e.clientX;
    distance = downPosition - volumebar.offsetLeft;
    percent=distance/volumebar.offsetWidth;
    controller.setVolume(percent);
}
function mouseMoveFunctionForVolume(e) {
    if(!mouseIsDownForVolume)
        return;
    movePosition=e.clientX;
    distance=movePosition-volumebar.offsetLeft;
    percent=distance/volumebar.offsetWidth;
    controller.setVolume(percent);
}
function mouseOutFunctionForVolume(e) {
    if(!mouseIsDownForVolume)
        return;
    movePosition=e.clientX;
    isout=movePosition-volumebar.offsetLeft-volumebar.offsetWidth;
    if(isout>0){
        percent=1;
        controller.setVolume(percent);
    }else if(isout<(-volumebar.offsetWidth)){
        percent=0;
        controller.setVolume(percent);
    }else{
        distance=movePosition-volumebar.offsetLeft;
        percent=distance/volumebar.offsetWidth;
        controller.setVolume(percent);
    }
}
function mouseUpFunctionForVolume(e) {
    if(!mouseIsDownForVolume)
        return;
    mouseIsDownForVolume=false;
    downPosition=0;
    movePosition=0;
    distance=0;
    percent=0;
    isout=0;
}
/******************************************************************/



/*获取music函数*//*TODO：必须改写*/
function getMusicAndLrc() {
    let fs = require("fs");
    let music = {};
    let lrc = {};
    let musicArray=fs.readdirSync("./resources/musics");
    let lrcArray=fs.readdirSync("./resources/lrc");
    let name;
    for(let i=0;i<musicArray.length;i++){
        name = musicArray[i].replace(/\.[\S]+/, "");
        music[name] = `resources/musics/${musicArray[i]}`;
    }
    for(let i=0;i<lrcArray.length;i++){
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
    return m+":"+s;
}