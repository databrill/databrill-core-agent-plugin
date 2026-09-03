import { assertEquals, assertThrows } from "jsr:@std/assert@1.0.16";
import { assertReadOnlyStatement } from "./query.ts";

Deno.test("assertReadOnlyStatement accepts a bounded SELECT", () => {
	assertEquals(
		assertReadOnlyStatement('SELECT "id" FROM "orders" LIMIT 10;'),
		'SELECT "id" FROM "orders" LIMIT 10;',
	);
});

Deno.test("assertReadOnlyStatement accepts WITH SELECT", () => {
	assertEquals(
		assertReadOnlyStatement(
			'WITH "recent" AS (SELECT 1 AS "value") SELECT * FROM "recent"',
		),
		'WITH "recent" AS (SELECT 1 AS "value") SELECT * FROM "recent"',
	);
});

Deno.test("assertReadOnlyStatement ignores keywords in string values and comments", () => {
	assertEquals(
		assertReadOnlyStatement("-- delete nothing\nSELECT 'update' AS \"word\";"),
		"-- delete nothing\nSELECT 'update' AS \"word\";",
	);
});

Deno.test("assertReadOnlyStatement accepts semicolons inside values and comments", () => {
	assertEquals(
		assertReadOnlyStatement(
			"SELECT ';' AS \"punctuation\"; -- one statement; still",
		),
		"SELECT ';' AS \"punctuation\"; -- one statement; still",
	);
});

Deno.test("assertReadOnlyStatement rejects multiple statements", () => {
	assertThrows(() => assertReadOnlyStatement("SELECT 1; SELECT 2"));
});

Deno.test("assertReadOnlyStatement rejects modifying CTEs", () => {
	assertThrows(() =>
		assertReadOnlyStatement(
			"WITH removed AS (DELETE FROM orders RETURNING *) SELECT * FROM removed",
		)
	);
});

Deno.test("assertReadOnlyStatement rejects session changes", () => {
	assertThrows(() => assertReadOnlyStatement("SET search_path = public"));
});
