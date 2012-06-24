mp = {
    code: null,
    parse: null,
    morph: null,
    parser: null,
    
    init: function() {
        code = document.getElementById("code");
        parse = document.getElementById("parse");
        morph = document.getElementById("morph");
        parser = new MorphParse();
        code.select();
    }(),
    
    parseClick: function() {
        var morphCode = code.value;
        morph.value = parser.Parse(morphCode);
    }
}