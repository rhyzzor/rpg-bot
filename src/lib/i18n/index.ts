import i18next from "i18next";

import en from "./locales/en-US.json";
import ptBR from "./locales/pt-BR.json";

i18next
	.init({
		lng: "en-US",
		fallbackLng: "en-US",
		preload: ["en-US", "pt-BR"],
		resources: {
			"en-US": { translation: en },
			"pt-BR": { translation: ptBR },
		},
	})
	.then(() => console.log("i18n ready"))
	.catch((err) => console.error(err));

type TranslateOptions = {
	lng: string;
	[key: string]: unknown;
};

export function translate(field: string, options: TranslateOptions) {
	return i18next.t(field, options);
}
