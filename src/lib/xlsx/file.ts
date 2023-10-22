import * as XLSX from "xlsx";
import { Effect } from "effect";

export class NoFileList {
	_tag = "NoFileList";
}
export function getFirstFileFromFileList(
	fileList: FileList,
): Effect.Effect<never, NoFileList, File> {
	if (fileList.length === 0) return Effect.fail(new NoFileList());
	return Effect.succeed(fileList[0]);
}

export class GetArrayBufferFromFileError {
	_tag = "GetArrayBufferFromFileError";
}

export function fileToArrayBuffer(file: File) {
	return Effect.tryPromise({
		try: () => file.arrayBuffer(),
		catch: () => new GetArrayBufferFromFileError(),
	});
}

export class ArrayBufferToWorkbookError {
	_tag = "ConvertArrayBufferToWorkbookError";
	constructor(readonly msg: string) {}
}
export function arrayBufferToWorkbook(arrBuf: ArrayBuffer) {
	return Effect.tryPromise({
		try: async () => XLSX.read(arrBuf),
		catch: () => new ArrayBufferToWorkbookError("array buffer to workbook error"),
	});
	// return XLSX.read(arrBuf);
}

export class NoSheetInWorkbook {
	_tag = "NoSheetInWorkbook";
}

export function getFirstSheetName(
	wb: XLSX.WorkBook,
): Effect.Effect<never, NoSheetInWorkbook, string> {
	if (wb.SheetNames.length === 0) return Effect.fail(new NoSheetInWorkbook());
	return Effect.succeed(wb.SheetNames[0]);
}

export function getFirstSheetFromWorkBook(
	wb: XLSX.WorkBook,
	sheetName: string,
): Effect.Effect<never, NoSheetInWorkbook, XLSX.WorkSheet> {
	if (wb.SheetNames.length === 0) return Effect.fail(new NoSheetInWorkbook());
	const sheet = wb.Sheets[sheetName];
	if (sheet === undefined) return Effect.fail(new NoSheetInWorkbook());
	return Effect.succeed(sheet);
}

export class SheetToJsonError {
	_tag = "SheetToJsonError";
}
export function sheetToJson<T>(sheet: XLSX.WorkSheet) {
	return Effect.tryPromise({
		try: async () => XLSX.utils.sheet_to_json<T>(sheet),
		catch: () => new SheetToJsonError(),
	});
}

export class SheetToAoAError {
	_tag = "SheetToJsonError";
}
export function sheetToAoA(sheet: XLSX.WorkSheet) {
	return Effect.tryPromise({
		try: async () => XLSX.utils.sheet_to_json(sheet, { header: 1 }),
		catch: () => new SheetToAoAError(),
	});
}

export function fileListToSheet(fileList: FileList) {
	return getFirstFileFromFileList(fileList).pipe(
		Effect.flatMap(fileToArrayBuffer),
		Effect.bind("wb", arrayBufferToWorkbook),
		Effect.bind("sheetname", ({ wb }) => getFirstSheetName(wb)),
		Effect.flatMap(({ wb, sheetname }) => getFirstSheetFromWorkBook(wb, sheetname)),
	);
}

export function fileListToJson<T>(fileList: FileList) {
	return fileListToSheet(fileList).pipe(Effect.flatMap(sheetToJson<T>));
}

export function fileListToAoA(fileList: FileList) {
	return fileListToSheet(fileList).pipe(Effect.flatMap(sheetToAoA));
}

export function jsonToAoA<T extends object, K extends keyof T, V extends T[K]>(json: T[]): V[][] {
	return json.map((row) => {
		const subArr = [];
		for (const [, val] of Object.entries(row)) {
			subArr.push(val);
		}
		return subArr;
	});
}

export function jsonToSheet<T extends object>(json: T[]) {
	return XLSX.utils.json_to_sheet(json);
}

class SheetToWorkbookError {
	_tag = "SheetToWorkbookError";
}
export function sheetToWorkbook(sheet: XLSX.Sheet, sheetName: string) {
	return Effect.tryPromise({
		try: async () => {
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, sheet, sheetName);
			return wb;
		},
		catch: () => new SheetToWorkbookError(),
	});
}
export function aoaToSheet<T>(aoa: T[][]) {
	return XLSX.utils.aoa_to_sheet(aoa);
}

export function downloadExcelProcedure(wb: XLSX.WorkBook, name: string) {
	const ext = ".xlsx";
	const nameAndExt = `${name}${ext}`;
	XLSX.writeFile(wb, nameAndExt);
}
