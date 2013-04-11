<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>OSHB Parsing</title>
        <link rel="stylesheet" href="Style/OshbStyle.css" />
        <link rel="shortcut icon" href="Image/OSHB.ico" />
        <!--[if IE]>
        <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
    </head>
    <body>
        <header>
            <h1><span class="logo"><span>The OpenScriptures</span><br />Hebrew Bible</span> – Parsing</h1>
        </header>
        <nav>
            <form>
                <label for="book">Book</label>
                <select id="book">
                    <?php
                    $bc = array('Gen', 1);
                    foreach (Books::$ot as $sbl => $name) {
                        $option = '<option value="' . $sbl . '"';
                        if ($sbl == $bc[0]) {
                            $option .= ' selected="selected"';
                        }
                        $option .= '>' . $name . '</option>';
                        echo $option;
                    }
                    ?>
                </select>
                <label for="chapter">Chapter</label>
                <select id="chapter">
                    <?php
                    echo '<option value="' . $bc[1] . '">' . $bc[1] . '</option>';
                    ?>
                </select>
                <button id="select" title="Select the reference">Select</button>
            </form>
        </nav>
        <section id="parser">
            <section id="panel">
                <article id="text"></article>
                <div id="explain">
                    <h2>Explanation</h2>
                    <div id="morphText"></div>
                </div>
            </section>
            <section id="word">
                <button id="foreWord" class="move" title="Next word">&lt;</button>
                <span id="wordBox">&nbsp;</span>
                <button id="backWord" class="move" title="Previous word">&gt;</button>
                <br />
                <label for="morph">Morphology</label>
                <input type="text" id="morph" />
                <button id="apply" title="Apply">Apply</button>
            </section>
            <div id="morphHint"></div>
            <div id="langSet">
                <h3>Language</h3>
                <input type="radio" name="lang" id="heb" checked="checked" />
                <label for="heb">Hebrew</label>
                <br />
                <input type="radio" name="lang" id="arc" />
                <label for="arc">Aramaic</label>
            </div>
        </section>
        <script src="Script/Parsing.js"></script>
    </body>
</html>