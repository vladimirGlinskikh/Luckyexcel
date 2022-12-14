import { columeHeader_word, columeHeader_word_index } from "./constant";
import { IluckySheetSelection } from "../ToLuckySheet/ILuck";
import { IattributeList, stringToNum} from "../ICommon";


export function getRangetxt(range:IluckySheetSelection, sheettxt:string) {

    let row0 = range["row"][0], row1 = range["row"][1];
    let column0 = range["column"][0], column1 = range["column"][1];

    if (row0 == null && row1 == null) {
        return sheettxt + chatatABC(column0) + ":" + chatatABC(column1);
    }
    else if (column0 == null && column1 == null) {
        return sheettxt + (row0 + 1) + ":" + (row1 + 1);
    }
    else {
        if (column0 == column1 && row0 == row1) {
            return sheettxt + chatatABC(column0) + (row0 + 1);
        }
        else {
            return sheettxt + chatatABC(column0) + (row0 + 1) + ":" + chatatABC(column1) + (row1 + 1);
        }
    }
}


export function getcellrange (txt:string, sheets:IattributeList={}, sheetId:string="1") {
    let val = txt.split("!");

    let sheettxt = "",
        rangetxt = "",
        sheetIndex = -1;

    if (val.length > 1) {
        sheettxt = val[0];
        rangetxt = val[1];
        
        let si = sheets[sheettxt];
        if(si==null){
            sheetIndex = parseInt(sheetId);
        }
        else{
            sheetIndex = parseInt(si);
        }
    } 
    else {
        sheetIndex = parseInt(sheetId);
        rangetxt = val[0];
    }
    
    if (rangetxt.indexOf(":") == -1) {
        let row = parseInt(rangetxt.replace(/[^0-9]/g, "")) - 1;
        let col = ABCatNum(rangetxt.replace(/[^A-Za-z]/g, ""));

        if (!isNaN(row) && !isNaN(col)) {
            return {
                "row": [row, row],
                "column": [col, col],
                "sheetIndex": sheetIndex
            };
        }
        else {
            return null;
        }
    } 
    else {
        let rangetxtArray:string[] = rangetxt.split(":");
        let row = [],col = [];
        row[0] = parseInt(rangetxtArray[0].replace(/[^0-9]/g, "")) - 1;
        row[1] = parseInt(rangetxtArray[1].replace(/[^0-9]/g, "")) - 1;
        // if (isNaN(row[0])) {
        //     row[0] = 0;
        // }
        // if (isNaN(row[1])) {
        //     row[1] = sheetdata.length - 1;
        // }
        if (row[0] > row[1]) {
            return null;
        }
        col[0] = ABCatNum(rangetxtArray[0].replace(/[^A-Za-z]/g, ""));
        col[1] = ABCatNum(rangetxtArray[1].replace(/[^A-Za-z]/g, ""));
        // if (isNaN(col[0])) {
        //     col[0] = 0;
        // }
        // if (isNaN(col[1])) {
        //     col[1] = sheetdata[0].length - 1;
        // }
        if (col[0] > col[1]) {
            return null;
        }

        return {
            "row": row,
            "column": col,
            "sheetIndex": sheetIndex
        };
    }
}

//?????????  ???????????????
function ABCatNum(abc:string) {
    abc = abc.toUpperCase();

    let abc_len = abc.length;
    if (abc_len == 0) {
        return NaN;
    }

    let abc_array = abc.split("");
    let wordlen = columeHeader_word.length;
    let ret = 0;

    for (let i = abc_len - 1; i >= 0; i--) {
        if (i == abc_len - 1) {
            ret += columeHeader_word_index[abc_array[i]];
        }
        else {
            ret += Math.pow(wordlen, abc_len - i - 1) * (columeHeader_word_index[abc_array[i]] + 1);
        }
    }

    return ret;
}

//?????????  ???????????????
function chatatABC(index:number) {
    let wordlen = columeHeader_word.length;

    if (index < wordlen) {
        return columeHeader_word[index];
    }
    else {
        let last = 0, pre = 0, ret = "";
        let i = 1, n = 0;

        while (index >= (wordlen / (wordlen - 1)) * (Math.pow(wordlen, i++) - 1)) {
            n = i;
        }

        let index_ab = index - (wordlen / (wordlen - 1)) * (Math.pow(wordlen, n - 1) - 1);//970
        last = index_ab + 1;

        for (let x = n; x > 0; x--) {
            let last1 = last, x1 = x;//-702=268, 3

            if (x == 1) {
                last1 = last1 % wordlen;

                if (last1 == 0) {
                    last1 = 26;
                }

                return ret + columeHeader_word[last1 - 1];
            }

            last1 = Math.ceil(last1 / Math.pow(wordlen, x - 1));
            //last1 = last1 % wordlen;
            ret += columeHeader_word[last1 - 1];

            if (x > 1) {
                last = last - (last1 - 1) * wordlen;
            }
        }
    }
}

/** 
 * @return ratio, default 0.75 1in = 2.54cm = 25.4mm = 72pt = 6pc,  pt = 1/72 In, px = 1/dpi In
*/
export function getptToPxRatioByDPI():number{
    return 72/96;
}

/** 
 * @emus EMUs, Excel drawing unit
 * @return pixel
*/
export function getPxByEMUs(emus:number){
    if(emus==null){
        return 0;
    }
    let inch = emus/914400;
    let pt = inch*72;
    let px = pt / getptToPxRatioByDPI();
    return px;
}

/** 
 * @dom xml attribute object
 * @attr attribute name
 * @d if attribute is null, return default value 
 * @return attribute value
*/
export function getXmlAttibute(dom:IattributeList, attr:string, d:string){
    let value = dom[attr];
    value = value==null?d:value;
    return value;
}

/** 
 * @columnWidth Excel column width
 * @return pixel column width
*/
export function getColumnWidthPixel(columnWidth:number){
    let pix = Math.round((columnWidth-0.83) * 8 + 5);
    return pix;
}

/** 
 * @rowHeight Excel row height
 * @return pixel row height
*/
export function getRowHeightPixel(rowHeight:number){
    let pix = Math.round(rowHeight/getptToPxRatioByDPI());
    return pix;
}

export function LightenDarkenColor(sixColor:string, tint:number){
    let hex:string = sixColor.substring(sixColor.length-6,sixColor.length);
    let rgbArray:number[] = hexToRgbArray("#"+hex);
    let hslArray = rgbToHsl(rgbArray[0], rgbArray[1],rgbArray[2]);
    if(tint>0){
        hslArray[2] = hslArray[2] * (1.0-tint) + tint;
    }
    else if(tint<0){
        hslArray[2] = hslArray[2] * (1.0 + tint)
    }
    else{
        return "#"+hex;
    }

    let newRgbArray = hslToRgb(hslArray[0],hslArray[1],hslArray[2]);

    return rgbToHex("RGB(" + newRgbArray.join(",") + ")");
}


function rgbToHex(rgb:string){
    //???????????????????????????????????????
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // ?????????rgb????????????
    if (/^(rgb|RGB)/.test(rgb)) {
        var aColor = rgb.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i=0; i<aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;    
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = rgb;    
        }
        return strHex;
    } else if (reg.test(rgb)) {
        var aNum = rgb.replace(/#/,"").split("");
        if (aNum.length === 6) {
            return rgb;    
        } else if(aNum.length === 3) {
            var numHex = "#";
            for (var i=0; i<aNum.length; i+=1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    return rgb;
}

function hexToRgb(hex:string){
    var sColor = hex.toLowerCase();
    //???????????????????????????????????????
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // ?????????16????????????
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i=1; i<4; i+=1) {
                sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
            }
            sColor = sColorNew;
        }
        //????????????????????????
        var sColorChange = [];
        for (var i=1; i<7; i+=2) {
            sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
        }
        return "RGB(" + sColorChange.join(",") + ")";
    }
    return sColor;
}

function hexToRgbArray(hex:string){
    var sColor = hex.toLowerCase();
    //???????????????????????????????????????
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // ?????????16????????????
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i=1; i<4; i+=1) {
                sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
            }
            sColor = sColorNew;
        }
        //????????????????????????
        var sColorChange:number[] = [];
        for (var i=1; i<7; i+=2) {
            sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
        }
        return  sColorChange;
    }
    return null;
}

/**
 * HSL??????????????????RGB. 
 * ????????????????????? http://en.wikipedia.org/wiki/HSL_color_space.
 * h, s, ??? l ????????? [0, 1] ??????
 * ????????? r, g, ??? b ??? [0, 255]??????
 *
 * @param   Number  h       ??????
 * @param   Number  s       ?????????
 * @param   Number  l       ??????
 * @return  Array           RGB????????????
 */
function hslToRgb(h:number, s:number, l:number) {
    var r, g, b;

    if(s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p:number, q:number, t:number) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


/**
 * RGB ?????????????????? HSL.
 * ????????????????????? http://en.wikipedia.org/wiki/HSL_color_space.
 * r, g, ??? b ????????? [0, 255] ?????????
 * ????????? h, s, ??? l ??? [0, 1] ??????
 *
 * @param   Number  r       ????????????
 * @param   Number  g       ????????????
 * @param   Number  b       ????????????
 * @return  Array           HSL????????????
 */
function rgbToHsl(r:number, g:number, b:number) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min){ 
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
 
export function generateRandomIndex(prefix:string):string {
    if(prefix == null){
        prefix = "Sheet";
    }

    let userAgent = window.navigator.userAgent.replace(/[^a-zA-Z0-9]/g, "").split("");

    let mid = "";

    for(let i = 0; i < 5; i++){
        mid += userAgent[Math.round(Math.random() * (userAgent.length - 1))];
    }

    let time = new Date().getTime();

    return prefix + "_" + mid + "_" + time;
}


export function escapeCharacter(str:string){
    if(str==null || str.length==0){
        return str;
    }

    return str.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&apos;/g, "'").replace(/&iexcl;/g, "??").replace(/&cent;/g, "??").replace(/&pound;/g, "??").replace(/&curren;/g, "??").replace(/&yen;/g, "??").replace(/&brvbar;/g, "??").replace(/&sect;/g, "??").replace(/&uml;/g, "??").replace(/&copy;/g, "??").replace(/&ordf;/g, "??").replace(/&laquo;/g, "??").replace(/&not;/g, "??").replace(/&shy;/g, "??").replace(/&reg;/g, "??").replace(/&macr;/g, "??").replace(/&deg;/g, "??").replace(/&plusmn;/g, "??").replace(/&sup2;/g, "??").replace(/&sup3;/g, "??").replace(/&acute;/g, "??").replace(/&micro;/g, "??").replace(/&para;/g, "??").replace(/&middot;/g, "??").replace(/&cedil;/g, "??").replace(/&sup1;/g, "??").replace(/&ordm;/g, "??").replace(/&raquo;/g, "??").replace(/&frac14;/g, "??").replace(/&frac12;/g, "??").replace(/&frac34;/g, "??").replace(/&iquest;/g, "??").replace(/&times;/g, "??").replace(/&divide;/g, "??").replace(/&Agrave;/g, "??").replace(/&Aacute;/g, "??").replace(/&Acirc;/g, "??").replace(/&Atilde;/g, "??").replace(/&Auml;/g, "??").replace(/&Aring;/g, "??").replace(/&AElig;/g, "??").replace(/&Ccedil;/g, "??").replace(/&Egrave;/g, "??").replace(/&Eacute;/g, "??").replace(/&Ecirc;/g, "??").replace(/&Euml;/g, "??").replace(/&Igrave;/g, "??").replace(/&Iacute;/g, "??").replace(/&Icirc;/g, "??").replace(/&Iuml;/g, "??").replace(/&ETH;/g, "??").replace(/&Ntilde;/g, "??").replace(/&Ograve;/g, "??").replace(/&Oacute;/g, "??").replace(/&Ocirc;/g, "??").replace(/&Otilde;/g, "??").replace(/&Ouml;/g, "??").replace(/&Oslash;/g, "??").replace(/&Ugrave;/g, "??").replace(/&Uacute;/g, "??").replace(/&Ucirc;/g, "??").replace(/&Uuml;/g, "??").replace(/&Yacute;/g, "??").replace(/&THORN;/g, "??").replace(/&szlig;/g, "??").replace(/&agrave;/g, "??").replace(/&aacute;/g, "??").replace(/&acirc;/g, "??").replace(/&atilde;/g, "??").replace(/&auml;/g, "??").replace(/&aring;/g, "??").replace(/&aelig;/g, "??").replace(/&ccedil;/g, "??").replace(/&egrave;/g, "??").replace(/&eacute;/g, "??").replace(/&ecirc;/g, "??").replace(/&euml;/g, "??").replace(/&igrave;/g, "??").replace(/&iacute;/g, "??").replace(/&icirc;/g, "??").replace(/&iuml;/g, "??").replace(/&eth;/g, "??").replace(/&ntilde;/g, "??").replace(/&ograve;/g, "??").replace(/&oacute;/g, "??").replace(/&ocirc;/g, "??").replace(/&otilde;/g, "??").replace(/&ouml;/g, "??").replace(/&oslash;/g, "??").replace(/&ugrave;/g, "??").replace(/&uacute;/g, "??").replace(/&ucirc;/g, "??").replace(/&uuml;/g, "??").replace(/&yacute;/g, "??").replace(/&thorn;/g, "??").replace(/&yuml;/g, "??");

}


export class fromulaRef {

    static operator = '==|!=|<>|<=|>=|=|+|-|>|<|/|*|%|&|^'
    static error = {
        v: "#VALUE!",    //???????????????????????????
        n: "#NAME?",     //??????????????????
        na: "#N/A",      //????????????????????????????????????
        r: "#REF!",      //??????????????????????????????????????????
        d: "#DIV/0!",    //?????????0???????????????
        nm: "#NUM!",     //?????????????????????????????????????????????
        nl: "#NULL!",    //??????????????????????????????????????????
        sp: "#SPILL!"    //????????????????????????
    }

    static operatorjson:stringToNum = null

    static trim(str:string) {  
        if(str == null){  
            str = "";  
        }  
        return str.replace(/(^\s*)|(\s*$)/g, "");  
    }

    static functionCopy(txt:string, mode:string, step:number) {
        let _this = this;

        if (_this.operatorjson == null) {
            let arr = _this.operator.split("|"),
                op:stringToNum = {};

            for (let i = 0; i < arr.length; i++) {
                op[arr[i].toString()] = 1;
            }

            _this.operatorjson = op;
        }

        if (mode == null) {
            mode = "down";
        }

        if (step == null) {
            step = 1;
        }

        if (txt.substr(0, 1) == "=") {
            txt = txt.substr(1);
        }

        let funcstack = txt.split("");
        let i = 0,
            str = "",
            function_str = "",
            ispassby = true;
        
        let matchConfig = {
            "bracket": 0,
            "comma": 0,
            "squote": 0,
            "dquote": 0
        };

        while (i < funcstack.length) {
            let s = funcstack[i];

            if (s == "(" && matchConfig.dquote == 0) {
                matchConfig.bracket += 1;

                if (str.length > 0) {
                    function_str += str + "(";
                } 
                else {
                    function_str += "(";
                }

                str = "";
            } 
            else if (s == ")" && matchConfig.dquote == 0) {
                matchConfig.bracket -= 1;
                function_str += _this.functionCopy(str, mode, step) + ")";
                str = "";
            }
            else if (s == '"' && matchConfig.squote == 0) {
                if (matchConfig.dquote > 0) {
                    function_str += str + '"';
                    matchConfig.dquote -= 1;
                    str = "";
                } 
                else {
                    matchConfig.dquote += 1;
                    str += '"';
                }
            } 
            else if (s == ',' && matchConfig.dquote == 0) {
                function_str += _this.functionCopy(str, mode, step) + ',';
                str = "";
            } 
            else if (s == '&' && matchConfig.dquote == 0) {
                if (str.length > 0) {
                    function_str += _this.functionCopy(str, mode, step) + "&";
                    str = "";
                } 
                else {
                    function_str += "&";
                }
            } 
            else if (s in _this.operatorjson && matchConfig.dquote == 0) {
                let s_next = "";

                if ((i + 1) < funcstack.length) {
                    s_next = funcstack[i + 1];
                }

                let p = i - 1, 
                    s_pre = null;

                if(p >= 0){
                    do {
                        s_pre = funcstack[p--];
                    }
                    while (p>=0 && s_pre ==" ")
                }

                if ((s + s_next) in _this.operatorjson) {
                    if (str.length > 0) {
                        function_str += _this.functionCopy(str, mode, step) + s + s_next;
                        str = "";
                    } 
                    else {
                        function_str += s + s_next;
                    }

                    i++;
                }
                else if(!(/[^0-9]/.test(s_next)) && s=="-" && (s_pre=="(" || s_pre == null || s_pre == "," || s_pre == " " || s_pre in _this.operatorjson ) ){
                    str += s;
                }
                else {
                    if (str.length > 0) {
                        function_str += _this.functionCopy(str, mode, step) + s;
                        str = "";
                    } 
                    else {
                        function_str += s;
                    }
                }
            } 
            else {
                str += s;
            }

            if (i == funcstack.length - 1) {
                if (_this.iscelldata(_this.trim(str))) {
                    if (mode == "down") {
                        function_str += _this.downparam(_this.trim(str), step);
                    } 
                    else if (mode == "up") {
                        function_str += _this.upparam(_this.trim(str), step);
                    } 
                    else if (mode == "left") {
                        function_str += _this.leftparam(_this.trim(str), step);
                    } 
                    else if (mode == "right") {
                        function_str += _this.rightparam(_this.trim(str), step);
                    }
                } 
                else {
                    function_str += _this.trim(str);
                }
            }
            
            i++;
        }

        return function_str;
    }


    static downparam(txt:string, step:number) {
        return this.updateparam("d", txt, step);
    }

    static upparam(txt:string, step:number) {
        return this.updateparam("u", txt, step);
    }

    static leftparam(txt:string, step:number) {
        return this.updateparam("l", txt, step);
    }

    static rightparam (txt:string, step:number) {
        return this.updateparam("r", txt, step);
    }


    static updateparam (orient:string, txt:string, step:number) {
        let _this = this;
        let val = txt.split("!"),
            rangetxt, prefix = "";
        
        if (val.length > 1) {
            rangetxt = val[1];
            prefix = val[0] + "!";
        } 
        else {
            rangetxt = val[0];
        }

        if (rangetxt.indexOf(":") == -1) {
            let row = parseInt(rangetxt.replace(/[^0-9]/g, ""));
            let col = ABCatNum(rangetxt.replace(/[^A-Za-z]/g, ""));
            let freezonFuc = _this.isfreezonFuc(rangetxt);
            let $row = freezonFuc[0] ? "$" : "",
                $col = freezonFuc[1] ? "$" : "";
            
            if (orient == "u" && !freezonFuc[0]) {
                row -= step;
            } 
            else if (orient == "r" && !freezonFuc[1]) {
                col += step;
            } 
            else if (orient == "l" && !freezonFuc[1]) {
                col -= step;
            } 
            else if (!freezonFuc[0]) {
                row += step;
            }

            if(row < 0 || col < 0){
                return _this.error.r;
            }
            
            if (!isNaN(row) && !isNaN(col)) {
                return prefix + $col + chatatABC(col) + $row + (row);
            } 
            else if (!isNaN(row)) {
                return prefix + $row + (row);
            } 
            else if (!isNaN(col)) {
                return prefix + $col + chatatABC(col);
            } 
            else {
                return txt;
            }
        } 
        else {
            rangetxt = rangetxt.split(":");
            let row = [],
                col = [];

            row[0] = parseInt(rangetxt[0].replace(/[^0-9]/g, ""));
            row[1] = parseInt(rangetxt[1].replace(/[^0-9]/g, ""));
            if (row[0] > row[1]) {
                return txt;
            }
            
            col[0] = ABCatNum(rangetxt[0].replace(/[^A-Za-z]/g, ""));
            col[1] = ABCatNum(rangetxt[1].replace(/[^A-Za-z]/g, ""));
            if (col[0] > col[1]) {
                return txt;
            }

            let freezonFuc0 = _this.isfreezonFuc(rangetxt[0]);
            let freezonFuc1 = _this.isfreezonFuc(rangetxt[1]);
            let $row0 = freezonFuc0[0] ? "$" : "",
                $col0 = freezonFuc0[1] ? "$" : "";
            let $row1 = freezonFuc1[0] ? "$" : "",
                $col1 = freezonFuc1[1] ? "$" : "";
            
            if (orient == "u") {
                if (!freezonFuc0[0]) {
                    row[0] -= step;
                }

                if (!freezonFuc1[0]) {
                    row[1] -= step;
                }
            } 
            else if (orient == "r") {
                if (!freezonFuc0[1]) {
                    col[0] += step;
                }

                if (!freezonFuc1[1]) {
                    col[1] += step;
                }
            } 
            else if (orient == "l") {
                if (!freezonFuc0[1]) {
                    col[0] -= step;
                }

                if (!freezonFuc1[1]) {
                    col[1] -= step;
                }
            } 
            else {
                if (!freezonFuc0[0]) {
                    row[0] += step;
                }

                if (!freezonFuc1[0]) {
                    row[1] += step;
                }
            }

            if(row[0] < 0 || col[0] < 0){
                return _this.error.r;
            }

            if (isNaN(col[0]) && isNaN(col[1])) {
                return prefix + $row0 + (row[0]) + ":" + $row1 + (row[1]);
            } 
            else if (isNaN(row[0]) && isNaN(row[1])) {
                return prefix + $col0 + chatatABC(col[0]) + ":" + $col1 + chatatABC(col[1]);
            } 
            else {
                return prefix + $col0 + chatatABC(col[0]) + $row0 + (row[0]) + ":" + $col1 + chatatABC(col[1]) + $row1 + (row[1]);
            }
        }
    }


    static iscelldata(txt:string) { //??????????????????????????????
        let val = txt.split("!"),
            rangetxt;

        if (val.length > 1) {
            rangetxt = val[1];
        } 
        else {
            rangetxt = val[0];
        }

        let reg_cell = /^(([a-zA-Z]+)|([$][a-zA-Z]+))(([0-9]+)|([$][0-9]+))$/g; //????????????????????????????????????+????????????????????? A1:B3
        let reg_cellRange = /^(((([a-zA-Z]+)|([$][a-zA-Z]+))(([0-9]+)|([$][0-9]+)))|((([a-zA-Z]+)|([$][a-zA-Z]+))))$/g; //????????????????????????????????????+?????????????????????????????? A1:B3???A:A
        
        if (rangetxt.indexOf(":") == -1) {
            let row = parseInt(rangetxt.replace(/[^0-9]/g, "")) - 1;
            let col = ABCatNum(rangetxt.replace(/[^A-Za-z]/g, ""));
            
            if (!isNaN(row) && !isNaN(col) && rangetxt.toString().match(reg_cell)) {
                return true;
            } 
            else if (!isNaN(row)) {
                return false;
            } 
            else if (!isNaN(col)) {
                return false;
            } 
            else {
                return false;
            }
        } 
        else {
            reg_cellRange = /^(((([a-zA-Z]+)|([$][a-zA-Z]+))(([0-9]+)|([$][0-9]+)))|((([a-zA-Z]+)|([$][a-zA-Z]+)))|((([0-9]+)|([$][0-9]+s))))$/g;

            rangetxt = rangetxt.split(":");

            let row = [],col = [];
            row[0] = parseInt(rangetxt[0].replace(/[^0-9]/g, "")) - 1;
            row[1] = parseInt(rangetxt[1].replace(/[^0-9]/g, "")) - 1;
            if (row[0] > row[1]) {
                return false;
            }

            col[0] = ABCatNum(rangetxt[0].replace(/[^A-Za-z]/g, ""));
            col[1] = ABCatNum(rangetxt[1].replace(/[^A-Za-z]/g, ""));
            if (col[0] > col[1]) {
                return false;
            }

            if(rangetxt[0].toString().match(reg_cellRange) && rangetxt[1].toString().match(reg_cellRange)){
                return true;
            }
            else{
                return false;
            }
        }
    }

    static isfreezonFuc(txt:string) {
        let row = txt.replace(/[^0-9]/g, "");
        let col = txt.replace(/[^A-Za-z]/g, "");
        let row$ = txt.substr(txt.indexOf(row) - 1, 1);
        let col$ = txt.substr(txt.indexOf(col) - 1, 1);
        let ret = [false, false];

        if (row$ == "$") {
            ret[0] = true;
        }
        if (col$ == "$") {
            ret[1] = true;
        }

        return ret;
    }

}



export function isChinese(temp:string):boolean
{ 
    var re = /[^\u4e00-\u9fa5]/; 
    var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
    if(reg.test(temp)) return true; 
    if(re.test(temp)) return false; 
	return true; 
}
 
export function isJapanese(temp:string):boolean
{ 
	var re = /[^\u0800-\u4e00]/; 
	if(re.test(temp)) return false; 
	return true; 
}
 
export function isKoera(chr:any):boolean {
	
	if(((chr > 0x3130 && chr < 0x318F) || 
	    (chr >= 0xAC00 && chr <= 0xD7A3))) 
	{
		return true;
	}
	return false;
}

export function isContainMultiType(str:string):boolean {
	
    let isUnicode = false;
    if(escape(str).indexOf("%u")>-1){
        isUnicode = true;
    }

    let isNot = false;
    let reg = /[0-9a-z]/gi; 
    if(reg.test(str)){
        isNot = true;
    }

    let reEnSign = /[\x00-\xff]+/g;
    if(reEnSign.test(str)){
        isNot = true;
    }

    if(isUnicode && isNot){
        return true;
    }

    return false;

}








export function getBinaryContent (path:any, options:any) {
    let promise, resolve:any, reject:any;
    let callback:any;

    if (!options) {
        options = {};
    }

    // taken from jQuery
    let createStandardXHR = function () {
        try {
            return new window.XMLHttpRequest();
        } catch( e ) {}
    }

    let createActiveXHR = function () {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch( e ) {}
    }

    // Create the request object
    var createXHR = (typeof window !== "undefined" && window.ActiveXObject) ?
        /* Microsoft failed to properly
        * implement the XMLHttpRequest in IE7 (can't request local files),
        * so we use the ActiveXObject when it is available
        * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
        * we need a fallback.
        */
        function() {
        return createStandardXHR() || createActiveXHR();
    } :
        // For all other browsers, use the standard XMLHttpRequest object
        createStandardXHR;

    // backward compatible callback
    if (typeof options === "function") {
        callback = options;
        options = {};
    } else if (typeof options.callback === 'function') {
        // callback inside options object
        callback = options.callback;
    }

    resolve = function (data:any) { callback(null, data); };
    reject = function (err:any) { callback(err, null); };

    try {
        var xhr = createXHR();

        xhr.open('GET', path, true);

        // recent browsers
        if ("responseType" in xhr) {
            xhr.responseType = "arraybuffer";
        }

        // older browser
        if(xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }

        xhr.onreadystatechange = function (event:Event) {
            // use `xhr` and not `this`... thanks IE
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    try {
                        resolve(function (xhr:XMLHttpRequest) {
                            // for xhr.responseText, the 0xFF mask is applied by JSZip
                            return xhr.response || xhr.responseText;
                        }(xhr));
                    } catch(err) {
                        reject(new Error(err));
                    }
                } else {
                    reject(new Error("Ajax error for " + path + " : " + this.status + " " + this.statusText));
                }
            }
        };

        if(options.progress) {
            xhr.onprogress = function(e:any) {
                options.progress({
                    path: path,
                    originalEvent: e,
                    percent: e.loaded / e.total * 100,
                    loaded: e.loaded,
                    total: e.total
                });
            };
        }

        xhr.send();

    } catch (e) {
        reject(new Error(e), null);
    }

    // returns a promise or undefined depending on whether a callback was
    // provided
    return promise;
}

/**
 * multi sequence conversion
 * example:
 *  1???E14 -> 13_4
 *  2???E14 J14 O14 T14 Y14 AD14 AI14 AN14 AS14 AX14 ->
 *     ['13_4', '13_9','13_14', '13_19', '13_24', '13_3', '13_8',  '13_13', '13_18', '13_23']
 *  3???E46:E47 -> ['45_4',  '46_4']
 *
 * @param {string} sqref - before sequence
 * @returns {string[]}
 */
export function getMultiSequenceToNum(sqref: string): string[] {
  if (!sqref || sqref?.length <= 0) return [];
  sqref = sqref.toUpperCase();
  let sqrefRawArr = sqref.split(" ");
  let sqrefArr = sqrefRawArr.filter((e) => e && e.trim());
  let sqrefLastArr = getSqrefRawArrFormat(sqrefArr);

  let resArr: string[] = [];
  for (let i = 0; i < sqrefLastArr.length; i++) {
    let _res = getSingleSequenceToNum(sqrefLastArr[i]);
    if (_res) resArr.push(_res);
  }
  return resArr;
}

/**
 * get region sequence
 * example:
 *  1???[A1:C2'] -> ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
 *
 * @param {string[]} arr - formats arr
 * @returns {string[]} - after arr
 */
export function getRegionSequence(arr: string[]): string[] {
  let formatArr: string[] = [];
  
  const regEn = new RegExp(/[A-Z]+|[0-9]+/g);
  const startArr = arr[0]?.match(regEn);
  const lastArr = arr[1]?.match(regEn);
  const columnMax = Math.max(...[ABCatNum(startArr[0]), ABCatNum(lastArr[0])]);
  const columnMin = Math.min(...[ABCatNum(startArr[0]), ABCatNum(lastArr[0])]);
  const rowMax = Math.max(...[parseInt(startArr[1]), parseInt(lastArr[1])]);
  const rowMin = Math.min(...[parseInt(startArr[1]), parseInt(lastArr[1])]);
  
  for (let i = columnMin; i <= columnMax; i++) {
    for (let j = rowMin; j <= rowMax; j++) {
      formatArr.push(`${chatatABC(i)}${j}`);
    }
  }

  return formatArr;
}

/**
 * unified processing of conversion formats
 * example:
 *  1???['E38', 'A1:C2'] -> ['E38', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
 *
 * @param {string[]} arr - formats arr
 * @returns {string[]} - after arr
 */
export function getSqrefRawArrFormat(arr: string[]): string[] {
  arr?.map((el) => {
    if (el.includes(":")) {
      let tempArr: string[] = el.split(":");
      if (tempArr?.length === 2) {
        arr = arr.concat(getRegionSequence(tempArr));
        arr.splice(arr.indexOf(el), 1);
      }
    }
  });

  const resultArr = arr.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  return resultArr;
}

/**
 * single sequence to number
 * example:
 *  1???A1 -> 0_0
 *  2???ES14 -> 13_4
 *
 * @param {string} sqref - before sequence
 * @returns {string} - after sequence
 */
export function getSingleSequenceToNum(sqref: string): string {
  let sqrefArray = sqref.match(/[A-Z]+|[0-9]+/g);
  let sqrefLen = sqrefArray.length;
  let regEn = new RegExp("^[A-Z]+$");
  let ret = "";
  for (let i = sqrefLen - 1; i >= 0; i--) {
    let cur = sqrefArray[i];
    if (regEn.test(cur)) {
      ret += ABCatNum(cur) + "_";
    } else {
      ret += parseInt(cur) - 1 + "_";
    }
  }
  return ret.substring(0, ret.length - 1);
}

/**
 * R1C1 to Sequence
 * example: sheet2!R1C1 => sheet!A1
 *
 * @param {string} value - R1C1 value
 * @returns
 */
export function getTransR1C1ToSequence(value: string): string {
  if (!value && value?.length <= 0) return "";

  const len = value.length;
  const index = value.lastIndexOf("!");
  const valueArr = [value.slice(0, index), value.slice(index + 1, len)];
  const repStr = valueArr[1] || "";
  const indexR = repStr.indexOf("R");
  const indexC = repStr.indexOf("C");
  
  const row = Number(repStr.slice(indexR + 1, indexC));
  const column = chatatABC(Number(repStr.slice(indexC + 1, repStr?.length)) - 1);

  return `${valueArr[0]}!${column}${row}`;
}

/**
 * strip x14 format data
 *
 * @param {string} value
 * @returns {Object} - { formula, sqref }
 */
export function getPeelOffX14(value: string): {  [key: string]: any} {
  if (!value || value?.length <= 0) return {};

  // formula
  const formulaReg = new RegExp("</x14:formula[^]>", "g");
  const lastIndex = value.match(formulaReg)?.length;
  const lastValue = `</x14:formula${lastIndex}>`;
  const lastValueEnd = value.indexOf(lastValue);
  let formulaValue = value.substring(0, lastValueEnd + lastValue.length);
  formulaValue = formulaValue
    .replace(/<xm:f>/g, "")
    .replace(/<\/xm:f>/g, "")
    .replace(/x14:/g, "")
    .replace(/\/x14:/g, "");
  const formula = formulaValue;
  
  // sqref
  const xmSqrefLen = "<xm:sqref>".length;
  const sqrefStart = value.indexOf("<xm:sqref>");
  const sqrefEnd = value.indexOf("</xm:sqref>");
  const sqref = value.substring(sqrefStart + xmSqrefLen, sqrefEnd);

  return {
    formula,
    sqref,
  };
}


/**
 * get the value in the formula
 *
 * @param {string} value - extracted value
 * @returns {string[]}
 */
export function getMultiFormulaValue(value: string): string[] {
  if (!value || value?.length <= 0) return [];
  
  const lenReg = new RegExp("formula", "g");
  const len = (value.match(lenReg)?.length || 0) / 2;
  
  if (len === 0) return [];
  
  let retArr: any = [];
  for (let i = 1; i <= len; i++) {
    const startLen = `<formula${i}>`?.length;
    const start = value.indexOf(`<formula${i}>`);
    const end = value.indexOf(`</formula${i}>`);
    const _value = value.substring(start + startLen, end);
    retArr.push(escapeCharacter(_value.replace(/&quot;|^\"|\"$/g, "")));
  }
  return retArr;
}