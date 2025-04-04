import data from "@/assets/class.json";

interface ListClassesProps {
	locale: string;
}

export function listClassesUseCase({ locale }: ListClassesProps) {
	const localeWithoutBar = locale.replace("-", "") as "ptBR" | "enUS";

	const formattedData = data.map((item) => {
		const name = item[`name_${localeWithoutBar}`] || item.name;
		const description =
			item[`description_${localeWithoutBar}`] || item.description;

		return {
			...item,
			name,
			description,
		};
	});

	return formattedData;
}
