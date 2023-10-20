
// setup for obniz
var Obniz = require("obniz");
var obniz = new Obniz("9484-3306");
const https = require("https")
const querystring = require("querystring")

const Token = "WJERKQeHBMW00oG0BDg6MKL5LP1OiSJSwHgWXVRtiyb"
const content = querystring.stringify({
    message: "餌をだしたよ"
})

const options = {
    hostname: "notify-api.line.me",
    path: "/api/notify",
    method: "POST",
    headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(content),
        "Authorization": `Bearer ${Token}`
    }
}

const request = https.request(options, res => {
    res.setEncoding("utf8")
    res.on("data", console.log)
    res.on("error", console.log)
})


obniz.onconnect = async function () {
  
    var servo = obniz.wired("ServoMotor", { gnd: 0, vcc: 1, signal: 2 });
    var sensor = obniz.wired("HC-SR505", { vcc: 10, signal: 9, gnd: 11 });

    sensor.onchange = async val => {
        console.log(val ? 'Moving Something!' : 'Nothing moving');

        if (val) {

            let angle_list = [0, 90, 0, 90, 0];
            for (let i = 0; i < angle_list.length; i++) {
                servo.angle(angle_list[i]);
                await obniz.wait(1000);
            }

            request.write(content)
            request.end()

        }
    };
}