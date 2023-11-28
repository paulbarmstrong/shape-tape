export function regexTest(regex: RegExp, str: string): boolean {
	const result = regex.test(str)
	regex.lastIndex = 0
	return result
}

type ClassConstructor<T, Args extends any[]> = new (...args: Args) => T
export function getConstructFunction<T, Args extends any[]>(Constructor: ClassConstructor<T, Args>): (...args: Args) => T {
    return (...args: Args) => new Constructor(...args)
}
