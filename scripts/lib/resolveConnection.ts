import { Effect } from "effect";
import { loadConfig, resolveWorkspace, type Workspace } from "./config.ts";

/** Load the registry and resolve the explicitly requested database workspace. */
export function resolveConnection(wsid: string): Effect.Effect<Workspace, Error> {
	return Effect.gen(function* () {
		const config = yield* loadConfig();
		if (config === null) {
			return yield* Effect.fail(
				new Error("Set DATABRILL_CONFIG; unscoped POSTGRES_URL mode is not supported"),
			);
		}
		return yield* Effect.fromResult(resolveWorkspace(config, { wsid }));
	});
}
