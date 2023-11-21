
export function regexTest(regex: RegExp, str: string): boolean {
	const result = regex.test(str)
	regex.lastIndex = 0
	return result
}
