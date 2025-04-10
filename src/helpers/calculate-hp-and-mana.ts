import type { PlayerDTO } from "@/lib/database/schema";

export function calculateHpAndMana(player: PlayerDTO) {
	const { stats, level } = player;

	const constitution =
		stats.find((stat) => stat.label.toLowerCase() === "constitution")?.value ??
		0;
	const intelligence =
		stats.find((stat) => stat.label.toLowerCase() === "intelligence")?.value ??
		0;

	const hp = 30 + (level - 1) * 5 + constitution * 3;
	const mana = 40 + (level - 1) * 5 + intelligence * 3;

	return { hp, mana };
}
