export const genDefaultNote = (columnId: string, order?: number) => ({
	uuid: crypto.randomUUID(),
	columnId: columnId,
	content: "New note",
	order: order ?? 0,
});

export const genDefaultBoard = () => ({
	uuid: crypto.randomUUID(),
	title: "New Board",
	columns: [
		{
			uuid: crypto.randomUUID(),
			title: "backlog",
			order: 0,
			headerColor: parseInt("f48897", 16),
			notes: [
				{
					uuid: crypto.randomUUID(),
					order: 0,
					content: "Add a new note",
				},
				{
					uuid: crypto.randomUUID(),
					order: 1,
					content: "Edit a note",
				},
			],
		},
		{
			uuid: crypto.randomUUID(),
			title: "todo",
			order: 1,
			headerColor: parseInt("f4e688", 16),
			notes: [
				{
					uuid: crypto.randomUUID(),
					content: "Delete a note",
				},
			],
		},
		{
			uuid: crypto.randomUUID(),
			title: "doing",
			order: 2,
			headerColor: parseInt("88f48e", 16),
			notes: [
				{
					uuid: crypto.randomUUID(),
					content: "Add a new board",
				},
			],
		},
		{
			uuid: crypto.randomUUID(),
			title: "done",
			order: 3,
			headerColor: parseInt("88e2f4", 16),
			notes: [],
		},
	],
});
