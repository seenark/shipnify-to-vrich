export type ShipnifyColumn = {
	id: string;
	product_id: string;
	product_code: string;
	product_name: string;
	price: number;
	subproduct_code: string;
	subproduct_name: string;
	barcode: string;
	weight: number;
	threshold: number;
	wholesale_price1: number;
	wholesale_price2: number;
	inventory: number;
	reserved: number;
	available: number;
	category?: string;
};
