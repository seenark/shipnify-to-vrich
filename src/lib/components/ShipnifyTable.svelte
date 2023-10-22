<script lang="ts">
	import type { ShipnifyColumn } from "$lib/shipnify/columns";
	import { writable } from "svelte/store";
	import {
		type ColumnDef,
		type TableOptions,
		getCoreRowModel,
		createSvelteTable,
		flexRender,
	} from "@tanstack/svelte-table";

	export let shipnify: ShipnifyColumn[] = [];
	const defaultColumns: ColumnDef<ShipnifyColumn>[] = [
		{
			accessorKey: "id",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "product_id",
			cell: (info) => info.getValue(),
			header: () => "Product Id",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "product_code",
			cell: (info) => info.getValue(),
			header: () => "Product Code",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "product_name",
			cell: (info) => info.getValue(),
			header: () => "Product Name",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "price",
			cell: (info) => info.getValue(),
			header: () => "Price",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "subproduct_code",
			cell: (info) => info.getValue(),
			header: () => "Sub Product Code",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "subproduct_name",
			cell: (info) => info.getValue(),
			header: () => "Sub Product Name",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "barcode",
			id: "barcode",
			cell: (info) => info.getValue(),
			header: () => "Barcode",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "brand",
			cell: (info) => info.getValue(),
			header: () => "Brand",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "category",
			cell: (info) => info.getValue(),
			header: () => "Category",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "weight",
			cell: (info) => info.getValue(),
			header: () => "Weight",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "threshold",
			cell: (info) => info.getValue(),
			header: () => "Threshold",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "wholesale_price1",
			cell: (info) => info.getValue(),
			header: () => "Whole sale price 1",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "wholesale_price2",
			cell: (info) => info.getValue(),
			header: () => "Whole sale price 2",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "inventory",
			cell: (info) => info.getValue(),
			header: () => "Inventory",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "reserve",
			cell: (info) => info.getValue(),
			header: () => "Reserve",
			footer: (info) => info.column.id,
		},
		{
			accessorKey: "available",
			cell: (info) => info.getValue(),
			header: () => "Available",
			footer: (info) => info.column.id,
		},
	];
	const tableOptions = writable<TableOptions<ShipnifyColumn>>({
		data: [],
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	const rerender = (newData: ShipnifyColumn[]) => {
		tableOptions.update((options) => ({
			...options,
			data: newData,
		}));
	};
	$: {
		rerender(shipnify);
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
