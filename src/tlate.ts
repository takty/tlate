/**
 * Tlate - Template Literals As Template Engine
 *
 * @package tlate
 * @author Takuto Yanagida
 * @version 2024-02-06
 */

export default function t(ss: string[], ...vs: any[]): string {
	let ret = '';

	let rm;
	for (let i = 0; i < vs.length; ++i) {
		let s = ss[i], v = vs[i], sn = ss[i + 1];

		s = s.replace(/\n[ \t]*\n/g, '\n\n');     // '\n   \n' -> '\n\n'
		if (rm) s = s.replace(/^[ \t]*\n/g, '');  // ^     \n' -> ^'

		let _ = s.match(/(?<=\n)([ \t]+)$/g)?.[0] ?? '';  // '\n(   )$
		if (0 === i && '' === _) _ = s.match(/^([ \t]+)$/g)?.[0] ?? '';  // ^(   )$

		if (typeof v === 'function') {
			v = v();
			if (Array.isArray(v)) {
				if ((v?.[0]?.includes('\n') ?? false) && _.length) {
					s = s.slice(0, - _.length);  // '\n___$ -> '\n$
					_ = '';
				}
				v = v.join(`\n${_}`);
			} else {
				if (v.includes('\n') && _.length) {
					s = s.slice(0, - _.length);  // '\n___$ -> '\n$
					_ = '';
				}
			}
		} else {
			v = e(v);
			if (v.includes('\n') && _.length) {
				s = s.slice(0, - _.length);  // '\n___$ -> '\n$
				_ = '';
			}
		}

		rm = ('' !== _ && '' === v && /^[ \t]*\n/.test(sn));  // ^(   )\n'
		if (rm) s = s.slice(0, - _.length);  // '\n___$ -> '\n$

		ret += s;
		ret += v;
	}
	let s = ss[ss.length - 1];

	s = s.replace(/\n[ \t]*\n/g, '\n\n');     // '\n   \n' -> '\n\n'
	if (rm) s = s.replace(/^[ \t]*\n/g, '');  // ^     \n' -> ^'

	s = s.replace(/(?<=\n)([ \t]+)$/g, '');  // '\n   $ -> '\n$

	ret += s;
	return ret;
}

export const e = (s: string) => ('' + s)
	.replace(/[<>"']/g, c => m[c] as string)
	.replace(/&(?!([a-z\d]{2,32}|#\d{1,7}|#x[\da-f]{1,6});)/ig, '&amp;');

const m = {
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
} as {[k in string]: string};
