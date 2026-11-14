import { Result } from "effect";

/** Remove --wsid and its value, refusing a missing or blank workspace id. */
export function parseWsidArgument(
	args: readonly string[],
): Result.Result<{ readonly wsid: string; readonly rest: readonly string[] }, Error> {
	const rest: string[] = [];
	let wsid: string | undefined;

	for (const [index, argument] of args.entries()) {
		if (args[index - 1] === "--wsid") {
			continue;
		}
		if (argument === "--wsid") {
			const value = args[index + 1];
			if (value === undefined || value.startsWith("--")) {
				return Result.fail(new Error("--wsid requires a value"));
			}
			wsid = value;
			continue;
		}
		rest.push(argument);
	}
	if (wsid === undefined || wsid.trim() === "") {
		return Result.fail(new Error("Pass --wsid ID; every database command must name its workspace explicitly"));
	}

	return Result.succeed({ wsid: wsid.trim(), rest });
}
