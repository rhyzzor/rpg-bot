import type { PlayerDTO } from "@/lib/database/schema";

export function calculateHpAndMana(player: PlayerDTO) {
	const { stats, level } = player;

	const constitution =
		stats.find((stat) => stat.label.toLowerCase() === "constitution")?.value ??
		0;
	const intelligence =
		stats.find((stat) => stat.label.toLowerCase() === "intelligence")?.value ??
		0;

	const hp = 30 + (level - 1) * 5 + (constitution - 1) * 2;
	const mana = 40 + (level - 1) * 5 + (intelligence - 1) * 2;

	return { hp, mana };
}
