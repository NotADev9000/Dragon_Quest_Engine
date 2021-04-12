//-----------------------------------------------------------------------------
/**
 * Returns if a string needs 'a' or 'an' before it.
 *
 * @method String.prototype.aOrAn
 * @return {String} 'a' if consonant, 'an' if vowel
 */
String.prototype.aOrAn = function () {
    const char = this.charAt(0).toLowerCase();
    return char === 'a' || char === 'e' || char === 'i' || char === 'o' || char === 'u' ? 'an' : 'a';
};