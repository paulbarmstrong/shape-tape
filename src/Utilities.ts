

export function getGlobalRegex(regex: RegExp): RegExp {
	return new RegExp(regex.source, regex.flags + regex.global ? "" : "g")
}