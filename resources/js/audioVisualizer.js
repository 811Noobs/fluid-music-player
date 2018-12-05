// function how(height) {
//     if (height > 0 && height <= 20) {
//         return 20;
//     } else if (height > 20 && height <= 40) {
//         return 40;
//     } else if (height > 40 && height <= 60) {
//         return 60;
//     } else if (height > 60 && height <= 80) {
//         return 80;
//     } else if (height > 80 && height <= 100) {
//         return 100;
//     } else {
//         return 0;
//     }
// }

// class AudioVisualizer {
//     constructor(audioNode, canvasNode, interval) {

//         this.interval = 5;
//         this.audio= null;
//         this.audioContext = null;
//         this.audioSrc = null;
//         this.analyser = null;
//         this.canvasContext = null;
//         this.oW = null;
//         this.oH = null;
//         this.voiceHeight = null;
//         this.initAudioContext(audioNode);
//         this.initCanvasContext(canvasNode);
//         this.changeInterval(5)
//     }
//     initAudioContext(audioNode) {
//         this.audio = document.getElementById(audioNode);
//         this.audioContext = new AudioContext();
//         this.audioSrc = this.audioContext.createMediaElementSource(this.audio);
//         // Analyser
//         this.analyser = this.audioContext.createAnalyser();
//         // Connect
//         this.audioSrc.connect(this.analyser); // Audio source
//         this.analyser.connect(this.audioContext.destination); //Output destination
//         //this.voiceHeight = new Uint8Array(this.analyser.frequencyBinCount);
//     }
//     initCanvasContext(canvasNode) {
//         this.canvasContext = canvas.getContext('2d');
//         this.oW = canvas.width;
//         this.oH = canvas.height;
//     }
//     changeInterval(num) {
//         this.interval = num;
//     }
//     canvasDrawCircle() {
//         console.log(this.interval);
//         // 将当前的频率数据复制到传入的无符号字节数组中，做到实时连接
//         let that = this;
//         this.voiceHeight = new Uint8Array(this.analyser.frequencyBinCount);
//         this.analyser.getByteFrequencyData(this.voiceHeight);
//         // console.log(voiceHeight);
//         // 自定义获取数组里边数据的频步
//         var step = Math.round(this.voiceHeight.length / this.interval);
//         this.canvasContext.clearRect(0, 0, this.oW, this.oH);
//         for (var i = 0; i < this.interval; i++) {
//             if (this.voiceHeight[step * i] < 20) { continue };
//             //if (voiceHeight[step * i]>80){continue};

//             var audioHeight = this.voiceHeight[step * i];
//             //console.log(audioHeight);

//             //ctx.fillRect(oW / 2 + (i * 10), oH / 2, 7, -audioHeight);
//             //ctx.fillRect(oW / 2 - (i * 10), oH / 2, 7, -audioHeight);
//             this.canvasContext.beginPath();
//             this.canvasContext.arc(this.oW / 2, this.oH / 2, audioHeight, 0, 2 * Math.PI);
//             this.canvasContext.fillStyle = "rgba(192, 80, 77, 0.7)";
//             this.canvasContext.closePath();
//             this.canvasContext.fill();
//         }
//         window.requestAnimationFrame(this.canvasDrawCircle);
//     }

// }


window.onload = function () {
    const audio1 = document.getElementById('audio1');
    const audioContext = new AudioContext();

    // 创建媒体源,除了audio本身可以获取，也可以通过audioContext对象提供的api进行媒体源操作
    const audioSrc = audioContext.createMediaElementSource(audio1);
    // 创建分析机 
    const analyser = audioContext.createAnalyser();
    // 媒体源与分析机连接
    audioSrc.connect(analyser);
    // 输出的目标：将分析机分析出来的处理结果与目标点（耳机/扬声器）连接
    analyser.connect(audioContext.destination);


    //   根据分析音频的数据去获取音频频次界定音频图的高度
    //   放在与音频频次等长的8位无符号字节数组
    //   Uint8Array:初始化默认值为1024

    const ctx = canvas.getContext('2d');
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    var oW = canvas.width;
    var oH = canvas.height;
    // 音频图的条数
    var count = 20;
    // 缓冲区:进行数据的缓冲处理，转换成二进制数据
    var voiceHeight = new Uint8Array(analyser.frequencyBinCount);
    // console.log(voiceHeight);

    function drawRound() {
        // 将当前的频率数据复制到传入的无符号字节数组中，做到实时连接
        analyser.getByteFrequencyData(voiceHeight);
        // console.log(voiceHeight);
        // 自定义获取数组里边数据的频步
        var step = Math.round(voiceHeight.length / count);
        ctx.clearRect(0, 0, oW, oH);
        for (var i = 0; i < count; i++) {
            if (voiceHeight[step * i] < 20) { continue };
            //if (voiceHeight[step * i]>80){continue};


            var audioHeight = voiceHeight[step * i];
            //console.log(audioHeight);

            //ctx.fillRect(oW / 2 + (i * 10), oH / 2, 7, -audioHeight);
            //ctx.fillRect(oW / 2 - (i * 10), oH / 2, 7, -audioHeight);
            ctx.beginPath();
            ctx.arc(oW / 2, oH / 2, audioHeight, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(192, 80, 77, 0.7)";
            ctx.closePath();
            ctx.fill();
        }
        window.requestAnimationFrame(arguments.callee);
    }
    function drawRound() {
        // 将当前的频率数据复制到传入的无符号字节数组中，做到实时连接
        analyser.getByteFrequencyData(voiceHeight);
        // console.log(voiceHeight);
        // 自定义获取数组里边数据的频步
        var step = Math.round(voiceHeight.length / count);
        ctx.clearRect(0, 0, oW, oH);
        for (var i = 0; i < count; i++) {
            if (voiceHeight[step * i] < 20) { continue };
            //if (voiceHeight[step * i]>140){continue};


            var audioHeight = voiceHeight[step * i];
            //console.log(audioHeight);

            //ctx.fillRect(oW / 2 + (i * 10), oH / 2, 7, -audioHeight);
            //ctx.fillRect(oW / 2 - (i * 10), oH / 2, 7, -audioHeight);
            let x = oW / 2 + Math.sin((2 * Math.PI / (count-5) * i)) * audioHeight;
            let y = oH / 2 - Math.cos(2 * Math.PI / (count-5) * i) * audioHeight;
            //ctx.moveTo(oW / 2 + Math.sin(2 * Math.PI / step * i), oH / 2 - Math.cos(2 * Math.PI./ step * i))
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(192, 80, 77, 0.7)";
            ctx.closePath();
            ctx.fill();
        }
        window.requestAnimationFrame(arguments.callee);
    }
    drawRound();


    /*
      analyserNode 提供了时时频率以及时间域的分析信息
          允许你获取实时的数据，并进行音频可视化
          analyserNode接口的fftSize属性
              fftSize:无符号长整型值，用于确定频域的FFT(快速傅里叶变换)
              ffiSize属性值是从32位到32768范围内的2的非零幂,默认值是2048
    */
}