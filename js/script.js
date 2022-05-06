function test() {
    console.log("yabadabadoo")
}

var words = [];
var green = "45ADBB";
var red = "FFAB67";
var gray = "FFFFFF";

function vomit_words() {
    let lines = poem.split("\n");
    let num_lines = lines.length;
    //var words = [];

    max_line_length = 0;

    for (let i = 0; i < num_lines; i++) {
        let line = lines[i].split(" ");
        let insertable_line = [];
        max_line_length = Math.max(max_line_length, line.length);
        for (let j = 0; j < line.length; j++) {
            syllables_for_this_word = count_syllables(line[j])
            tuple = [line[j], count_syllables(line[j]), 0, null, Math.random()*2-1];
            insertable_line.push(tuple);
        }
        words.push(insertable_line);
    }

    let button_div = document.getElementById("inner_div");

    horizontal_padding = 2;
    vertical_padding = 2;

    let width = button_div.offsetWidth;
    let height = button_div.offsetHeight;

    /*width_per_word = width - horizontal_padding * (max_line_length + 1);
    width_per_word /= max_line_length;
    height_per_word = height - vertical_padding * (num_lines + 1);
    height_per_word /= num_lines;*/

    
    //ctx.font = "48px serif";
    //ctx.fillText("boo", 100, 100, 400);
    var word_positions = [

    ];

    for (let i = 0; i < num_lines; i++) {
        this_line = {};
        //current_offset = 1;
        for (let j = 0; j < words[i].length; j++) {
            //x = horizontal_padding * (j + 1) + width_per_word * j;
            //y = vertical_padding * (i + 1) + height_per_word * i;

            let btn = document.createElement("div");
            btn.setAttribute("id", "word" + i + "|" + j);
            btn.classList.add("row" + i);
            btn.classList.add("word");
            btn.setAttribute("draggable", "true");
            words[i][j][3] = btn;

            //btn.style.border = "1px solid black";
            button_div.appendChild(btn);
            let span = document.createElement("span");
            span.innerHTML = words[i][j][0] + " " + words[i][j][1];
            span.classList.add("word_text");
            btn.appendChild(span);
            btn.setAttribute("onClick", "word_clicked(\""+"word" + i + "|" + j+"\")");
        }
    }
    recalc_offsets();
}

function recalc_offsets() {
    for (i = 0; i < words.length; i++) {
        current_offset = 1;
        for (j = 0; j < words[i].length; j++) {
            words[i][j][2] = current_offset;
            //btn.style.gridColumn = String(j + 1 + current_offset) + " / span " + count_syllables(words[i][j]);
            btn = words[i][j][3]

            btn.style.gridColumn = String(current_offset) + " / span " + String(words[i][j][1]);
            btn.style.gridRow = String(i + 1) + " / span 1";
            btn.style["background-color"] = "#" + getColorBetween(red, gray, green, words[i][j][4]);

            //console.log(words[i][j] + ", " + words[i][j][1]);
            current_offset += words[i][j][1];
        }
    }
}

function recolor_words(res) {
    console.log("here");
    counter = 0;
    for (i = 0; i < words.length; i++) {
        for (j = 0; j < words[i].length; j++) {
            //all_words.push(clean(words[i][j][0]));
            words[i][j][4] = parseFloat(res[counter]);
            console.log("setting " + words[i][j] + " to " + res[counter]);
            counter++;
        }
    }
    recalc_offsets();
}

function color() {
    word2 = "happy";
    all_words = [];
    for (i = 0; i < words.length; i++) {
        for (j = 0; j < words[i].length; j++) {
            all_words.push(clean(words[i][j][0]));
        }
    }
    d = {
        "all_words": all_words,
        "comparator": word2
    }
    socket.emit("request", d, (err, msg) => {
        if (err) {
            console.log(err);
        }
        console.log(msg);
    });
}



function getColorBetween(start, middle, end, amount) {
    if (amount == 0) {
        return middle;
    }
    colorA = middle;
    colorB = end;
    if (amount < 0) {
        colorB = start;
        amount *= -1;
    }
    let aR = parseInt(colorA.substring(0, 2), 16);
    let aG = parseInt(colorA.substring(2, 4), 16);
    let aB = parseInt(colorA.substring(4, 6), 16);
    let bR = parseInt(colorB.substring(0, 2), 16);
    let bG = parseInt(colorB.substring(2, 4), 16);
    let bB = parseInt(colorB.substring(4, 6), 16);
    r = amount * bR + (1 - amount) * aR;
    g = amount * bG + (1 - amount) * aG;
    b = amount * bB + (1 - amount) * aB;
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    let rH = r.toString(16);
    let gH = g.toString(16);
    let bH = b.toString(16);

    //pad hex if needed
    if (rH.length == 1)
        rH = "0" + rH;
    if (gH.length == 1)
        gH = "0" + gH;
    if (bH.length == 1)
        bH = "0" + bH;

    return rH + gH + bH;
}

var word_has_been_clicked = false;
var previous_word = null;
var previous_row = null;
//var previous_col = null;
function word_clicked(word_id) {
    word = document.getElementById(word_id);
    row = word.style["grid-row-start"] - 1
    col = word.style["grid-column-start"] - 1

    if(word_has_been_clicked) {
        previous_word.classList.add("word-inactive");
        previous_word.classList.remove("word-active");
        word_has_been_clicked = false;
        tuple1 = null;
        pos1 = null;
        tuple2 = null;
        pos2 = null;
        row_A = words[previous_row];
        for (i = 0; i < row_A.length; i++) {
            if (row_A[i][3] == previous_word) {
                tuple1 = row_A[i];
                pos1 = i;
                break;
            }
        }
        row_B = words[row];
        for (i = 0; i < row_B.length; i++) {
            if (row_B[i][3] == word) {
                tuple2 = row_B[i];
                pos2 = i;
                break;
            }
        }
        row_A[pos1] = tuple2;
        row_B[pos2] = tuple1;
        
        recalc_offsets();

    } else {
        previous_row = row;
        //previous_col = col;
        previous_word = word;
        console.log("clicked word " +word.innerHTML + " at pos r" + row + " c" + col);
        //word.style["background-color"] = "#FFFFFF";
        word.style["background-color"] = null;
        word.classList.remove("word-inactive");
        word.classList.add("word-active");
        word_has_been_clicked = true;
    }
}

const poem = `When, in disgrace with fortune and men’s eyes,
I all alone beweep my outcast state,
And trouble deaf heaven with my bootless cries,
And look upon myself and curse my fate,
Wishing me like to one more rich in hope,
Featured like him, like him with friends possessed,
Desiring this man’s art and that man’s scope,
With what I most enjoy contented least;
Yet in these thoughts myself almost despising,
Haply I think on thee, and then my state,
(Like to the lark at break of day arising
From sullen earth) sings hymns at heaven’s gate;
For thy sweet love remembered such wealth brings
That then I scorn to change my state with kings.`

const cmudict_url = "https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict.dict"
var cmudict = {};

$ (document).ready(() => {
    var socket = io();

    $.get(cmudict_url, function(data, status){
        lines = String(data).split("\n");
        //d = {}
        for (i = 0; i < lines.length; i++) {
            index = lines[i].indexOf(" ");

            cmudict[lines[i].substring(0, index)] = lines[i].substring(index+1);
        }
        console.log(cmudict["desiring"]);
        console.log(cmudict["featured"]);
        console.log(count_syllables("potato"));
    })
});

function clean(word) {
    word = word.toLowerCase();
    word = word.replace(/[^\w\s]|_/g, "")
         .replace(/\s+/g, " ");
    return word;
}

function count_syllables(word) {
    word = clean(word);
    if (cmudict[word] !== undefined) {
        result = cmudict[word];
        tokens = result.split(" ");
        c = 0;
        for (i = 0; i < tokens.length; i++) {
            l = tokens[i].length;
            if (!isNaN(tokens[i][l-1])) {
                c += 1;
            }
        }
        return c;
    } else {
        
        c = 0;
        consonant = 1;
        for (i = 0; i < word.length; i++) {
            if ("aeiou".indexOf(word[i]) >= 0) {
                consonant = 0;
            } else if ("qwrtypsdfghjklzxcvbnm".indexOf(word[i]) >= 0) {
                if (consonant == 0) {
                    c += 1;
                }
                consonant = 1;
            }
        }
        if (c == 0) return 1;
        return c;
    }
}