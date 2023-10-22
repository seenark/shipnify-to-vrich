export type VRichColumn = {
	stock_id: string;
	sell_id: string;
	desc: string;
	unit: string;
	quantity: number;
	price: number;
	cost: number;
	delivery_cost: number;
	note: string;
	position: string;
};
export interface VRichColumnTH {
	รหัสสต็อก: string;
	รหัสขาย: string;
	รายละเอียด: string;
	หน่วย: string;
	จำนวน: number;
	ราคา: number;
	ต้นทุน: number;
	ค่าส่งเพิ่ม: number;
	หมายเหตุ: string;
	ตำแหน่ง: string;
}
type VRichColumnMapping = { th: keyof VRichColumnTH; en: keyof VRichColumn };
export const VRichColumnMapping: VRichColumnMapping[] = [
	{
		th: "รหัสสต็อก",
		en: "stock_id",
	},
	{
		th: "รหัสขาย",
		en: "sell_id",
	},
	{
		th: "รายละเอียด",
		en: "desc",
	},
	{
		th: "หน่วย",
		en: "unit",
	},
	{
		th: "จำนวน",
		en: "quantity",
	},
	{
		th: "ราคา",
		en: "price",
	},
	{
		th: "ต้นทุน",
		en: "cost",
	},
	{
		th: "ค่าส่งเพิ่ม",
		en: "delivery_cost",
	},
	{
		th: "หมายเหตุ",
		en: "note",
	},
	{
		th: "ตำแหน่ง",
		en: "position",
	},
];

export function convertVRichColumnThToEn(row: VRichColumnTH): VRichColumn {
	return {
		stock_id: row["รหัสสต็อก"],
		sell_id: row["รหัสขาย"],
		desc: row["รายละเอียด"],
		unit: row["หน่วย"],
		quantity: row["จำนวน"],
		price: row["ราคา"],
		note: row["หมายเหตุ"],
		position: row["ตำแหน่ง"],
		cost: row["ราคา"],
		delivery_cost: row["ค่าส่งเพิ่ม"],
	};
}

export function convertVRichColumnEnToTh(row: VRichColumn): VRichColumnTH {
	return {
		รหัสสต็อก: row.stock_id,
		รหัสขาย: row.sell_id,
		รายละเอียด: row.desc,
		หน่วย: row.unit,
		จำนวน: row.quantity,
		ราคา: row.price,
		หมายเหตุ: row.note,
		ตำแหน่ง: row.position,
		ค่าส่งเพิ่ม: row.delivery_cost,
		ต้นทุน: row.cost,
	};
}

export function getVRichColumnThNames(vrichColumnMapping: VRichColumnMapping[]): string[] {
	return vrichColumnMapping.map((item) => item.th);
}
