/* *********************************************************************
Title: jQuery SpreadButtler
Copyright: Tobi Oetiker <tobi@oetiker.ch>, OETIKER+PARTNER AG

Contans sprintf from  http://kevin.vanzonneveld.net

See the comments in the code.

License: GNU GPL Version 2 or later

* **********************************************************************/
(function($) {


    // setup a namespace for us
    var nsp = 'spreadButler';


    // Public Variables and Methods
    $[nsp] = {
        // let the user override the default
        // $.spreadButtler.defaultOptions.server = false
        defaultOptions: {
           server : './', // where is the spreadButtler server located
           file   : 'default.xlsx', // which file to read
           sheet  : 1, // which sheet to use 1-x
           stopColumns : ['A'], // when all of these this column is empty, stop expanding rows
           startRow: 2, // for the auto rows
           minColumn: null, // 'A'
           maxColumn: null,
           minRow: null,
           maxRow: null,
           sortCol: null,
        }
    };

    function sprintf () {
        // http://kevin.vanzonneveld.net
        // +   original by: Ash Searle (http://hexmen.com/blog/)
        // + namespaced by: Michael White (http://getsprink.com)
        // +    tweaked by: Jack
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Paulo Freitas
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // *     example 1: sprintf("%01.2f", 123.1);
        // *     returns 1: 123.10
        // *     example 2: sprintf("[%10s]", 'monkey');
        // *     returns 2: '[    monkey]'
        // *     example 3: sprintf("[%'#10s]", 'monkey');
        // *     returns 3: '[####monkey]'
        var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
        var a = arguments,
            i = 0,
            format = a[i++];

        // pad()
        var pad = function (str, len, chr, leftJustify) {
            if (!chr) {
                chr = ' ';
            }
            var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;
        };

        // justify()
        var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            var diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, customPadChar, leftJustify);
                } else {
                    value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
                }
            }
            return value;
        };

        // formatBaseX()
        var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            // Note: casts negative numbers to positive ones
            var number = value >>> 0;
            prefix = prefix && number && {
                '2': '0b',
                '8': '0',
                '16': '0x'
            }[base] || '';
            value = prefix + pad(number.toString(base), precision || 0, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        };  

        // formatString()
        var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
            if (precision != null) {
                value = value.slice(0, precision);
            }   
            return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
        };

        // doFormat()
        var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
            var number;
            var prefix;
            var method;
            var textTransform;
            var value;

            if (substring == '%%') {
                return '%';
            }

            // parse flags
            var leftJustify = false,
                positivePrefix = '',
                zeroPad = false,
                prefixBaseX = false,
                customPadChar = ' ';
            var flagsl = flags.length;
            for (var j = 0; flags && j < flagsl; j++) {
                switch (flags.charAt(j)) {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case "'":
                    customPadChar = flags.charAt(j + 1);
                    break;
                case '0':
                    zeroPad = true;
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
                }
            }

            // parameters may be null, undefined, empty-string or real valued
            // we want to ignore null, undefined and empty-string values
            if (!minWidth) {
                minWidth = 0;
            } else if (minWidth == '*') {
                minWidth = +a[i++];
            } else if (minWidth.charAt(0) == '*') {
                minWidth = +a[minWidth.slice(1, -1)];
            } else {
                minWidth = +minWidth;
            }

            // Note: undocumented perl feature:
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }

            if (!isFinite(minWidth)) {
                throw new Error('sprintf: (minimum-)width must be finite');
            }

            if (!precision) {
                precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
            } else if (precision == '*') {
                precision = +a[i++];
            } else if (precision.charAt(0) == '*') {
                precision = +a[precision.slice(1, -1)];
            } else {
                precision = +precision;
            }

            // grab value using valueIndex if required?
            value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
    
            switch (type) {
            case 's':
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
            case 'u':
                return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = (+value) | 0;
                prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            case 'e':
            case 'E':
            case 'f':
            case 'F':
            case 'g':
            case 'G':
                number = +value;
                prefix = number < 0 ? '-' : positivePrefix;
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + Math.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
            }
        };

        return format.replace(regex, doFormat);
    }

    function compileScript(script,data){
        var ret;
        try {
            if (script.match(RegExp('return'))){
               eval( 'ret = function(d,r){ ' + script + ' };' );
            }
            else {
               eval( 'ret = function(d,r){ return ' + script + ' };' );
            }
            ret(data,0);
        }
        catch (error){
            ret =  function(){ return 'ERR: <i>'+ error + '</i>:' + script } ;
        }
        return ret;
    }

    function FillTable(data,node,localOpts,cellUpdaters){
        // $this to access the jQuery object
        if (node.nodeName != 'TABLE'){
            alert("Please apply "+nsp+'FillTable to a table node. This is a '+node.nodeName+' node');
            return;
        }        
        var $node = $(node);
        $('tr.sbReplace',node).each(function(){
            $('td,th',this).each(function(){
                var $this = $(this);
                var cellScript = compileScript($this.text(),data)                
                var value = cellScript(data);
                $this.html(value != null ? value : '')
            });            
        });
        $('tr.sbRepeat',node).each(function(){            
            var $this = $(this);
            var cellScripts = [];
            $('td,th',this).each(function(){
                var $this=$(this);
                var script = $this.text();
                cellScripts.push(compileScript(script,data));
            });
            var rowCounter = localOpts.startRow;
            var rowArr = [];
            while (true){
                var stop = true;
                for (var i=0; i < localOpts.stopColumns.length; i++){
                    if (data.hasOwnProperty(localOpts.stopColumns[i]+rowCounter)){
                        stop = false;
                    }
                }
                if (stop || rowCounter > 400){
                    break;
                }
                var $row = $this.clone();
                rowArr.push($row);
                var colId=0;
                $('td,th',$row).each(function(){
                    var $this=$(this);
                    var r = rowCounter;
                    var i = colId;
                    cellUpdaters.push(function(){ 
                        var value = cellScripts[i](data,r);                   
                        $this.html(value != null ? value : '');
                    });
                    colId++;
                }); 
                $this.before($row);
                rowCounter++;
            }
            $this.hide();
            var rowSorter = function(a,b){          
                var sc = parseInt(localOpts.sortCol) - 1;
                var t1 = $('td:eq('+sc+')',a).text();
                var t2 = $('td:eq('+sc+')',b).text();
                return t1 == t2 ? 0 : t1 > t2 ? 1 : -1;
            };
            cellUpdaters.push(function(){
               if (localOpts.sortCol != null){
                   rowArr.sort(rowSorter);
               }
               for (var i=0;i<rowArr.length;i++){
                   rowArr[i].addClass(i % 2 == 1 ? 'sbOddRow' : 'sbEvenRow');
                   rowArr[i].removeClass(i % 2 == 1 ? 'sbEvenRow' : 'sbOddRow');
                   $this.before(rowArr[i]);
               };
            });         
        });
    };

    function runAll(arr) {
        for (var i = 0; i < arr.length; i++){
            // run the all skip errors!
            try { arr[i](); } catch (err) {};
        }
    };

    $.fn[nsp+'FillTable'] = function(opts) {
        var localOpts = $.extend( 
            {}, // start with an empty map
            $[nsp].defaultOptions, // add defaults
            opts // add options
        );      

        var $tables = $(this);  
        $tables.hide();
        $.getJSON(localOpts.server+'fetch',{ 
            file: localOpts.file,
            sheet: localOpts.sheet,
            minColumn: localOpts.minColumn,
            maxColumn: localOpts.maxColumn,
            minRow: localOpts.minRow,
            maxRow: localOpts.maxRow    
        },function(data){
            var cellUpdaters = [];
            $tables.each(function(){FillTable(data,this,localOpts,cellUpdaters)});
            $tables.show();
            runAll(cellUpdaters);
            if (localOpts.recalcClick){
                localOpts.recalcClick.click(function(){runAll(cellUpdaters)});                
            }
        });
        return this;
        // run the action for each matching node        
    };
})(jQuery);
