import fs from "fs/promises";

export async function readFile<T>(fileName: string): Promise<T | null> {
  try {
    const data = await fs.readFile(fileName, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log("Error reading data: ", err);
    return null;
  }
}
