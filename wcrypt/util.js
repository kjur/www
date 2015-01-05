var WC = null;
var WCS = null;
if (window.msCrypto) WC = window.msCrypto; // IE11+
if (window.crypto) WC = window.crypto;     // FF34+,CH37+ and others
if (WC.subtle) WCS = WC.subtle;            // IE11+,FF34+,CH37+ and others
if (WC.webkitSubtle) WCS = WC.webkitSubtle; // Safari 7.1+

/* ================================
 * 未整理のユーティリティー
 * ================================ */
function consoleLogObjProperties(obj) {
  for (var prop in obj) {
    if (prop == "algorithm") {
      console.log(obj + "." + prop + "=" + JSON.stringify(obj[prop]));
    } else {
      console.log(obj + "." + prop + "=" + obj[prop]);
    }
  }
}

function getRandomBytesHex(nBytes) {
  var a = new Uint8Array(nBytes);
  WC.getRandomValues(a);
  var s = "";
  for (var i = 0; i < a.length; i++) {
    s = s + uint8tohex(a[i]);
  }
  return s;
}

/* ================================
 * 変換ユーティリティー
 * ================================ */
/*
 * Int32Arrayの要素を16進数文字列に
 */
function int32tohex(i) {
  var hex;
  if (i < 0) {
    hex = (i >>> 0).toString(16);
  } else {
    hex = i.toString(16);
  }
  hex = "00000000".substr(0, 8 - hex.length) + hex;
  return hex;
}

/*
 * Uint8Arrayの要素を16進数文字列に
 */
function uint8tohex(i) {
  var hex = i.toString(16);
  hex = "00".substr(0, 2 - hex.length) + hex;
  return hex;
}

function uint8atohex(a) {
  var s = "";
  for (var i = 0; i < a.length; i++) {
    s += uint8tohex(a[i]);
  }
  return s;
}

function hextouint8a(hexString) {
  if (hexString.length % 2 != 0)
    throw "Invalid hexString";
  var arrayBuffer = new Uint8Array(hexString.length / 2);

  for (var i = 0; i < hexString.length; i += 2) {
    var byteValue = parseInt(hexString.substr(i, 2), 16);
    if (byteValue == NaN)
      throw "Invalid hexString";
    arrayBuffer[i/2] = byteValue;
  }

  return arrayBuffer;
}

/*
 * UTF8のバイト列である整数配列をUTF-8文字列に変換
 */
function intatoutf8(inta) {
  if (inta == null)
    return null;
  var result = "";
  var i;
  while (i = inta.shift()) {
    if (i <= 0x7f) {
      result += String.fromCharCode(i);
    } else if (i <= 0xdf) {
      var c = ((i&0x1f)<<6);
      c += arr.shift()&0x3f;
      result += String.fromCharCode(c);
    } else if (i <= 0xe0) {
      var c = ((arr.shift()&0x1f)<<6)|0x0800;
      c += arr.shift()&0x3f;
      result += String.fromCharCode(c);
    } else {
      var c = ((i&0x0f)<<12);
      c += (arr.shift()&0x3f)<<6;
      c += arr.shift() & 0x3f;
      result += String.fromCharCode(c);
      }
  }
  return result;
}

/*
 * UTF-8文字列を整数の配列に変換
 */
function utf8tointa(s) {
  var result = [];
  if (s == null)
    return result;
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c <= 0x7f) {
      result.push(c);
    } else if (c <= 0x07ff) {
      result.push(((c >> 6) & 0x1F) | 0xC0);
      result.push((c & 0x3F) | 0x80);
    } else {
      result.push(((c >> 12) & 0x0F) | 0xE0);
      result.push(((c >> 6) & 0x3F) | 0x80);
      result.push((c & 0x3F) | 0x80);
    }
  }
  return result;
}

/*
 * UTF-8文字列をUint8Arrayの配列に変換
 */
function utf8touint8a(s) {
  var inta = utf8tointa(s);
  var buf = new Uint8Array(inta.length);
  for (var i = 0; i < inta.length; i++) {
    buf[i] = inta[i];
  }
  return buf;
}

/*
 * ASCII文字列をUint8Arrayの配列に変換
 */
function asciitouint8a(s) {
    var buf = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) {
        buf[i] = s.charCodeAt(i);
    }
    return buf;
}

/*
 * ArrayBufferから16進数文字列に変換
 */
function abtohex(arrayBuffer) {
  var s = "";
  var dataView = new DataView(arrayBuffer);
  for (var i = 0; i < arrayBuffer.byteLength; i++) {
    var hex = dataView.getUint8(i).toString(16);
    hex = "00".substr(0, 2 - hex.length) + hex;
    s += hex;
  }
  return s;
}


