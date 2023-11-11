module.exports = function slugGenerator(req, res, next) {
    // Put the title in lower case.
    let titleSlug = req.body.title.toLowerCase();

    // Replace for some non-ascent characters
    const ascent = "áéíóúàçñ";
    const noAscent = "aeiouacn";

    for (letter in titleSlug) {
        titleSlug = titleSlug.replaceAll(ascent[letter], noAscent[letter]);
    }

    // Replace all non alphanumeric by "-"
    regexNonAlphaNum = /[^a-z0-9]+/g;
    const firstReplace = titleSlug.replaceAll(regexNonAlphaNum, "-");

    // Remove "-" from the beginning or and.
    regexStartEnd = /(^\W+|\W+$)/g;
    res.locals.titlePostSlug = firstReplace.replace(regexStartEnd, "");
    next();
};
