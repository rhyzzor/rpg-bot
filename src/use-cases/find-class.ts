import classJSON from "@/assets/class.json";

interface FindClassProps {
	classId: number;
	locale: string;
}

export function findClassUseCase({ classId, locale }: FindClassProps) {
	const selectedClass = classJSON.find((c) => c.id === classId);

	if (!selectedClass) {
		return null;
	}

	const localeWithoutBar = locale.replace("-", "") as "ptBR" | "enUS";

	const name = selectedClass[`name_${localeWithoutBar}`] || selectedClass.name;
	const description =
		selectedClass[`description_${localeWithoutBar}`] ||
		selectedClass.description;

	return { ...selectedClass, name, description };
}
