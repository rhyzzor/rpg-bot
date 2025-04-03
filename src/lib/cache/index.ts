import { Cacheable } from "cacheable";

export const sheetCache = new Cacheable({
	namespace: "sheets",
	ttl: "30m",
});

export const itemCache = new Cacheable({
	namespace: "items",
	ttl: "30m",
});

export const classCache = new Cacheable({
	namespace: "classes",
	ttl: "30m",
});
