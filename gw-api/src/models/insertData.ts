import fs from "fs";

export async function writeData<T>(fileName: string, data: T) {
  const dataString = JSON.stringify(data);
  fs.writeFile(fileName, dataString, "utf8", (err) => {
    if (err) {
      console.log("Error writing data: ", err);
    } else {
      console.log("Data written successfully!");
    }
  });
}
