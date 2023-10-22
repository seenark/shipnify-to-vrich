<script lang="ts">
	import ShipnifyTable from "$lib/components/ShipnifyTable.svelte";
	import VRichTable from "$lib/components/VRichTable.svelte";
	import type { ShipnifyColumn } from "$lib/shipnify/columns";
	import {
		convertVRichColumnThToEn,
		type VRichColumn,
		type VRichColumnTH,
		convertVRichColumnEnToTh,
	} from "$lib/vrich/column";
	import {
		convertShipnifyToVRichForBarCode,
		convertShipnifyToVRichForNormal,
	} from "$lib/vrich/fromShipnify";
	import {
		downloadExcelProcedure,
		fileListToJson,
		jsonToSheet,
		sheetToWorkbook,
	} from "$lib/xlsx/file";
	import { Effect } from "effect";

	let shipnifyExcelFile: FileList | undefined = undefined;
	let shipnify: ShipnifyColumn[] = [];
	$: {
		(async () => {
			if (shipnifyExcelFile === undefined) return;
			const json = await Effect.runPromise(
				fileListToJson<ShipnifyColumn>(shipnifyExcelFile).pipe(
					Effect.catchAll(() => Effect.succeed([])),
					// Effect.tap(Console.log),
				),
			);
			shipnify = json;
		})();
	}
	let vrichExcelFiles: FileList | undefined = undefined;
	let vrich: VRichColumn[] = [];
	$: {
		(async () => {
			if (vrichExcelFiles === undefined) return;
			const json = await Effect.runPromise(
				fileListToJson<VRichColumnTH>(vrichExcelFiles).pipe(
					Effect.map((d) => d.filter((_, i) => i <= 10)),
					Effect.map((d) => d.map(convertVRichColumnThToEn)),
					// Effect.tap(Console.log),
				),
			);
			vrich = json;
		})();
	}

	let minimumAvailableStock: number = 0;
	let discount: number = 0;
	let discountType: "percentage" | "amount" = "percentage";

	function calculcatePrice(price: number, discount: number, discountType: "percentage" | "amount") {
		if (discountType === "percentage") {
			return price - (price * discount) / 100;
		} else {
			return price - discount;
		}
	}

	function filterByMinimumAvailableStock(item: ShipnifyColumn) {
		if (minimumAvailableStock === 0) return true;
		return item.available >= minimumAvailableStock;
	}
	function updatePriceByDiscount(item: ShipnifyColumn) {
		return {
			...item,
			price: calculcatePrice(item.price, discount, discountType),
		};
	}

	function updateShipnifyArray(shipnify: ShipnifyColumn[]) {
		return Effect.succeed(shipnify).pipe(
			Effect.map((d) => d.filter(filterByMinimumAvailableStock)),
			Effect.map((d) => d.map(updatePriceByDiscount)),
		);
	}

	async function onClickConvertUsingBarCode() {
		vrich = await Effect.runPromise(
			updateShipnifyArray(shipnify).pipe(
				Effect.map((d) => d.map(convertShipnifyToVRichForBarCode)),
			),
		);
		console.log("vrich", vrich);
	}
	async function onClickConverUsingNormal() {
		vrich = await Effect.runPromise(
			updateShipnifyArray(shipnify).pipe(Effect.map((d) => d.map(convertShipnifyToVRichForNormal))),
		);
	}

	async function onClickDownloadXlsx() {
		const name = "vrich";
		Effect.runPromise(
			Effect.succeed(vrich).pipe(
				Effect.map((d) => d.map(convertVRichColumnEnToTh)),
				Effect.map(jsonToSheet),
				// Effect.map((d) => [getVRichColumnThNames(VRichColumnMapping), ...d]),
				// Effect.map(aoaToSheet),
				Effect.flatMap((d) => sheetToWorkbook(d, name)),
				Effect.map((d) => downloadExcelProcedure(d, name)),
			),
		);
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="flex flex-col gap-8">
	<div class="flex flex-row gap-4 justify-center items-center">
		<label class="px-8 py-4 bg-blue-500 rounded-lg text-white font-bold text-[24px] cursor-pointer"
			>Upload Shipnify Excel 📊
			<input hidden bind:files={shipnifyExcelFile} type="file" />
		</label>
		<!-- <label
			class="px-8 py-4 bg-indigo-300 rounded-lg text-white font-bold text-[24px] cursor-pointer"
			>Upload VRich Excel 🧧
			<input hidden bind:files={vrichExcelFiles} type="file" />
		</label> -->
		<div />
	</div>

	<h1 class="text-2xl px-8 py-4 border-2 text-center">Shipnify Table</h1>
	<ShipnifyTable {shipnify} />
	<div class="grid grid-cols-2 gap-4">
		<div class="border p-2">
			<label for="minimumAvailableStock" class="px-8 py-4">Minimum Available Stock</label>
			<input
				id="minimumAvailableStock"
				type="number"
				min="0"
				bind:value={minimumAvailableStock}
				class="border px-4 py-4"
			/>
		</div>
		<div class="border p-2">
			<label for="discount" class="px-8 py-4">Adjust price by discount</label>
			<input id="discount" type="number" min="0" bind:value={discount} class="border px-4 py-4" />
			<div>
				<div>
					<input
						checked
						type="radio"
						id="discount-percent"
						name="discount-type"
						value="percentage"
						class="peer hidden"
						on:change={() => (discountType = "percentage")}
					/>
					<label
						for="discount-percent"
						class="before:content-['⬜'] peer-checked:before:content-['✅'] before:pr-4 before:text-[24px] cursor-pointer"
						>Discount by percent</label
					>
				</div>
				<div>
					<input
						type="radio"
						id="discount-price"
						name="discount-type"
						value="fixed"
						class="peer hidden"
						on:change={() => (discountType = "amount")}
					/>
					<label
						for="discount-price"
						class="before:content-['⬜'] peer-checked:before:content-['✅'] before:pr-4 before:text-[24px] cursor-pointer"
						>Discount by price</label
					>
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-row gap-4">
		<button
			class="px-8 py-4 border rounded-lg hover:bg-blue-300"
			on:click={onClickConvertUsingBarCode}>convert VRich table using Barcode method</button
		>
		<button
			class="px-8 py-4 border rounded-lg hover:bg-indigo-400"
			on:click={onClickConverUsingNormal}>convert VRich table using no Barcode method</button
		>
	</div>
	<h1 class="text-2xl px-8 py-4 border-2 text-center">VRich Table</h1>
	<VRichTable {vrich} />
	<button class="px-8 py-4 border rounded-lg hover:bg-red-300" on:click={onClickDownloadXlsx}
		>Download VRich excel</button
	>
</section>

<style>
</style>
