import type { ShipnifyColumn } from "$lib/shipnify/columns";
import type { VRichColumn } from "./column";

export function convertShipnifyToVRichForBarCode(shipnify: ShipnifyColumn): VRichColumn {
	return {
		stock_id: shipnify.barcode,
		sell_id: shipnify.product_code,
		desc: shipnify.subproduct_name,
		quantity: shipnify.available,
		price: shipnify.price,
		cost: 0,
		delivery_cost: 0,
		note: "",
		position: "",
		unit: "",
	};
}

export function convertShipnifyToVRichForNormal(shipnify: ShipnifyColumn): VRichColumn {
	return {
		stock_id: shipnify.id,
		sell_id: shipnify.product_code,
		desc: shipnify.subproduct_name,
		quantity: shipnify.available,
		price: shipnify.price,
		cost: 0,
		delivery_cost: 0,
		note: "",
		position: "",
		unit: "",
	};
}
