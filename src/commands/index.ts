import * as createItem from "./item/create-command";
import * as deleteItem from "./item/delete-command";
import * as editItem from "./item/edit-command";
import * as findItem from "./item/find-command";
import * as ping from "./ping/command";

export const commands = {
	ping,
	createItem,
	editItem,
	findItem,
	deleteItem,
};
