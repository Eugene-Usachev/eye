"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eye = exports.MessageStyles = void 0;
var newLogGroupStep = function (eye, elem, groupName) {
    return {
        startTime: Date.now(),
        timer: setTimeout(function () {
            eye.warn("Step ".concat(JSON.stringify(elem.name), " from log group \"").concat(groupName, "\" is working after 2 seconds!"));
        }, 2000)
    };
};
var LogGroup = /** @class */ (function () {
    function LogGroup(eye, name, message) {
        this.eye = eye;
        this.steps = new Map();
        this.name = name;
        this.message = message;
    }
    ;
    LogGroup.prototype.newStep = function (elem) {
        this.steps.set(elem.name, newLogGroupStep(this.eye, elem, this.name));
    };
    ;
    LogGroup.prototype.ready = function (key, finish) {
        var step = this.steps.get(key);
        if (!step) {
            return false;
        }
        clearTimeout(step.timer);
        this.eye.ready("Step \"".concat(key, "\" from log group \"").concat(this.name, "\" is ready by ").concat(Date.now() - step.startTime, " ms!"));
        if (finish) {
            if (this.message) {
                this.eye.ready(this.message + " by ".concat(Date.now() - this.steps.entries().next().value[1].startTime, " ms!"));
            }
            else {
                this.eye.ready("Step group \"".concat(this.name, "\" is ready by ").concat(Date.now() - this.steps.entries().next().value[1].startTime, " ms!"));
            }
            return true;
        }
        else {
            return false;
        }
    };
    return LogGroup;
}());
var MessageStyles;
(function (MessageStyles) {
    MessageStyles["warn"] = "warn";
    MessageStyles["info"] = "info";
    MessageStyles["error"] = "error";
    MessageStyles["success"] = "success";
})(MessageStyles = exports.MessageStyles || (exports.MessageStyles = {}));
var formatDate = function () {
    var DateNow = new Date(), Year = DateNow.getFullYear(), MonthConst = DateNow.getMonth() + 1, Month = MonthConst < 10 ? '0' + MonthConst : MonthConst, Day = DateNow.getDate(), Hours = DateNow.getHours(), MinutesConst = DateNow.getMinutes(), Minutes = MinutesConst < 10 ? "0".concat(MinutesConst) : MinutesConst, SecondsConst = DateNow.getSeconds(), Seconds = SecondsConst < 10 ? "0".concat(SecondsConst) : SecondsConst, Milliseconds = DateNow.getMilliseconds();
    return "".concat(Year, "/").concat(Month, "/").concat(Day, " ").concat(Hours, ":").concat(Minutes, ":").concat(Seconds, ".").concat(Milliseconds, "   ");
};
var Eye = /** @class */ (function () {
    function Eye(readyStyleIs, baseStyle, warnStyle, errorStyle, infoStyle, successStyle) {
        if (readyStyleIs === void 0) { readyStyleIs = MessageStyles.success; }
        if (baseStyle === void 0) { baseStyle = []; }
        if (warnStyle === void 0) { warnStyle = []; }
        if (errorStyle === void 0) { errorStyle = []; }
        if (infoStyle === void 0) { infoStyle = []; }
        if (successStyle === void 0) { successStyle = []; }
        this.groups = new Map();
        this.baseStyle = baseStyle.length == 0 ? [
            "color: #fff",
            "width: 100%",
            "background-color: #333",
            "padding: 2px 4px",
            "font-size: 14px",
            "border-radius: 2px"
        ] : baseStyle;
        this.warnStyle = warnStyle.length == 0 ? [
            "color: orange",
        ] : warnStyle;
        this.errorStyle = errorStyle.length == 0 ? [
            "color: #fa0000",
        ] : errorStyle;
        this.infoStyle = infoStyle.length == 0 ? [
            "color: lightblue",
        ] : infoStyle;
        this.successStyle = successStyle.length == 0 ? [
            "color: #0fff83",
        ] : successStyle;
        switch (readyStyleIs) {
            case MessageStyles.success: {
                this.readyStyle = this.successStyle;
                break;
            }
            case MessageStyles.error: {
                this.readyStyle = this.errorStyle;
                break;
            }
            case MessageStyles.info: {
                this.readyStyle = this.infoStyle;
                break;
            }
            case MessageStyles.warn: {
                this.readyStyle = this.warnStyle;
                break;
            }
        }
    }
    Eye.prototype.newLogGroup = function (key, firstElem, message) {
        this.info("".concat(formatDate(), "Group: \"").concat(key, "\" was created."));
        this.groups.set(key, new LogGroup(this, key, message));
        this.groups.get(key).newStep(firstElem);
    };
    Eye.prototype.newStep = function (key, elem) {
        this.groups.get(key).newStep(elem);
    };
    Eye.prototype.stepReady = function (key, stepName, finish) {
        if (finish === void 0) { finish = false; }
        if (this.groups.get(key).ready(stepName, finish)) {
            this.groups.delete(key);
        }
    };
    /**
     * styled log message
     * */
    Eye.prototype.enter = function (message, isTimeNecessary, style) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        if (style === void 0) { style = []; }
        var realStyle = this.baseStyle.join(';') + ';' + style.join(';') + ';';
        if (typeof message === 'string') {
            console.log("%c".concat(isTimeNecessary ? formatDate() : '').concat(message), realStyle);
        }
        else {
            console.log("%c".concat(isTimeNecessary ? formatDate() : '').concat(JSON.stringify(message, null, 2)), realStyle);
        }
    };
    /**
     * log warn
     * */
    Eye.prototype.warn = function (message, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        this.enter(message, isTimeNecessary, this.warnStyle);
    };
    /**
     * log error
     * */
    Eye.prototype.error = function (message, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        this.enter(message, isTimeNecessary, this.errorStyle);
        console.trace();
    };
    /**
     * log info
     * */
    Eye.prototype.info = function (message, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        this.enter(message, isTimeNecessary, this.infoStyle);
    };
    /**
     * log success
     * */
    Eye.prototype.success = function (message, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        this.enter(message, isTimeNecessary, this.successStyle);
    };
    /**
     * log ready
     * */
    Eye.prototype.ready = function (message, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        this.enter(message, isTimeNecessary, this.readyStyle);
    };
    /**
     * log date, type and object. It can be used to log object or array.
     * */
    Eye.prototype.log = function (object, isTimeNecessary, type, style) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        if (type === void 0) { type = "log"; }
        if (style === void 0) { style = []; }
        var realStyle = this.baseStyle.join(';') + ';' + style.join(';') + ';';
        console.log("%c".concat(isTimeNecessary ? formatDate() : '', "type: ").concat(type), realStyle, object);
    };
    /**
     * log date, type and object. It can be used to log object or array.
     * */
    Eye.prototype.logWarn = function (object, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        this.log(object, isTimeNecessary, 'warning', this.warnStyle);
    };
    /**
     * log date, type and object. It can be used to log object or array.
     * */
    Eye.prototype.logError = function (object, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        this.log(object, isTimeNecessary, 'error', this.errorStyle);
        console.trace();
    };
    /**
     * log date, type and object. It can be used to log object or array.
     * */
    Eye.prototype.logInfo = function (object, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        this.log(object, isTimeNecessary, 'info', this.infoStyle);
    };
    /**
     * log date, type and object. It can be used to log object or array.
     * */
    Eye.prototype.logSuccess = function (object, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        this.log(object, isTimeNecessary, 'success', this.successStyle);
    };
    /**
     * log date, type and object. It can be used to log object or array.
     * */
    Eye.prototype.logReady = function (object, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        this.log(object, isTimeNecessary, 'ready', this.readyStyle);
    };
    Eye.prototype.fetchSend = function (url, method, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        var realStyle = this.baseStyle.join(';') + ';' + this.infoStyle.join(';') + ';';
        var methodStyle;
        switch (method) {
            case "GET": {
                methodStyle = [
                    "background-color: #245980",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "POST": {
                methodStyle = [
                    "background-color: #00a550",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "DELETE": {
                methodStyle = [
                    "background-color: #fa0000",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "PUT":
            case "PATCH": {
                methodStyle = [
                    "background-color: #ff8000",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
        }
        var methodText = method;
        while (methodText.length < 7) {
            methodText += ' ';
        }
        console.log("%c".concat(isTimeNecessary ? formatDate() : '', "fetch to |%c").concat(methodText, "%c \"").concat(url, "\""), realStyle, methodStyle, realStyle);
    };
    Eye.prototype.fetchGet = function (url, method, statusCode, time, isTimeNecessary) {
        if (isTimeNecessary === void 0) { isTimeNecessary = true; }
        var realStyle;
        var methodStyle, statusCodeStyle;
        switch (method) {
            case "GET": {
                methodStyle = [
                    "background-color: #245980",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "POST": {
                methodStyle = [
                    "background-color: #00a550",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "DELETE": {
                methodStyle = [
                    "background-color: #fa0000",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "PUT":
            case "PATCH": {
                methodStyle = [
                    "background-color: #ff8000",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
        }
        switch (+statusCode.toString()[0]) {
            case 1: {
                statusCodeStyle = [
                    "background-color: #245980",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                realStyle = this.baseStyle.join(';') + ';' + this.infoStyle.join(';') + ';';
                break;
            }
            case 2: {
                statusCodeStyle = [
                    "background-color: #00a550",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                realStyle = this.baseStyle.join(';') + ';' + this.successStyle.join(';') + ';';
                break;
            }
            case 3: {
                statusCodeStyle = [
                    "background-color: orange",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                realStyle = this.baseStyle.join(';') + ';' + this.infoStyle.join(';') + ';';
                break;
            }
            case 4: {
                statusCodeStyle = [
                    "background-color: #c26910",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                realStyle = this.baseStyle.join(';') + ';' + this.errorStyle.join(';') + ';';
                break;
            }
            case 5: {
                statusCodeStyle = [
                    "background-color: #fa0000",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                realStyle = this.baseStyle.join(';') + ';' + this.errorStyle.join(';') + ';';
                break;
            }
        }
        var methodText = method;
        while (methodText.length < 7) {
            methodText += ' ';
        }
        console.log("%c".concat(isTimeNecessary ? formatDate() : '', "fetch to |%c").concat(methodText, "%c \"").concat(url, "\"   |%c ").concat(statusCode, " %c|    ").concat(time, " ms"), realStyle, methodStyle, realStyle, statusCodeStyle, realStyle);
    };
    return Eye;
}());
exports.Eye = Eye;
