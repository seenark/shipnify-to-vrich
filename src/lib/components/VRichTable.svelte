<script lang="ts">
	import { writable } from "svelte/store";
	import {
		type ColumnDef,
		type TableOptions,
		getCoreRowModel,
		createSvelteTable,
		flexRender,
	} from "@tanstack/svelte-table";
	import type { VRichColumn } from "$lib/vrich/column";

	export let vrich: VRichColumn[] = [];
	// stock_id: string;
	// sell_id: string;
	// desc: string;
	// unit: string;
	// quantity: number;
	// price: number;
	const defaultColumns: ColumnDef<VRichColumn>[] = [
		{
			accessorKey: "stock_id",
			header: () => "Stock Id",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "sell_id",
			cell: (info) => info.getValue(),
			header: () => "Sell Id",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "desc",
			cell: (info) => info.getValue(),
			header: () => "Description",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "unit",
			cell: (info) => info.getValue(),
			header: () => "Unit",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "quantity",
			cell: (info) => info.getValue(),
			header: () => "Quantity",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "price",
			cell: (info) => info.getValue(),
			header: () => "Price",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "cost",
			cell: (info) => info.getValue(),
			header: () => "Cost",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "delivery_cost",
			cell: (info) => info.getValue(),
			header: () => "Delivery cost",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "note",
			cell: (info) => info.getValue(),
			header: () => "Note",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "position",
			cell: (info) => info.getValue(),
			header: () => "Position",
			footer: (info) => info.column.id,
		},
	];
	const tableOptions = writable<TableOptions<VRichColumn>>({
		data: [],
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	const rerender = (newData: VRichColumn[]) => {
		tableOptions.update((options) => ({
			...options,
			data: newData,
		}));
	};

	$: {
		rerender(vrich);
	}

	const table = createSvelteTable(tableOptions);
</script>

<div class="w-full overflow-auto">
	<table class="w-full">
		<thead>
			{#each $table.getHeaderGroups() as headerGroup}
				<tr class="">
					{#each headerGroup.headers as header}
						<th class="whitespace-nowrap px-8 py-4 border">
							{#if !header.isPlaceholder}
								<svelte:component
									this={flexRender(header.column.columnDef.header, header.getContext())}
								/>
							{/if}
						</th>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody>
			{#each $table.getRowModel().rows as row}
				<tr>
					{#each row.getVisibleCells() as cell}
						<td class="whitespace-nowrap px-8 py-4 border">
							<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
