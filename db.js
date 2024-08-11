import fs from "fs/promises";
import path from "path";

// JSON dosyasının yolu
const dbFilePath = path.resolve("db.json");

// JSON dosyasını yazan yardımcı fonksiyon
async function writeDataToFile(data) {
  await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), "utf8");
}

// JSON dosyasını okuyan yardımcı fonksiyon
async function readDataFromFile() {
  try {
    const fileContent = await fs.readFile(dbFilePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    // Dosya yoksa veya okuma hatası varsa, boş bir veri yapısı döndür
    if (error.code === "ENOENT") {
      return { data: [] };
    } else {
      throw error;
    }
  }
}

// Veri eklemek için fonksiyon
export async function addItem(item) {
  const data = await readDataFromFile();
  data.data.push(item);
  await writeDataToFile(data);
}

// Veri çıkarmak için fonksiyon
export async function removeItem(id) {
  const data = await readDataFromFile();
  const newData = data.data.filter((item) => item.id !== id);
  await writeDataToFile({ data: newData });
}

// Veriyi okumak için fonksiyon
export async function getItems() {
  const data = await readDataFromFile();
  return data.data;
}

// Belirli bir id'ye sahip öğeyi güncellemek için fonksiyon
export async function updateItem(id, updatedItem) {
  const data = await readDataFromFile();

  let itemFound = false;

  // Belirtilen id'ye sahip öğeyi bul ve güncelle
  const updatedData = data.data.map((item) => {
    if (item.id === id) {
      itemFound = true;
      return { ...item, ...updatedItem }; // Mevcut item'ı updatedItem ile güncelle
    }
    return item;
  });

  if (!itemFound) {
    return false; // Öğeyi bulamazsak, false döndür
  }

  // Güncellenmiş veriyi dosyaya yaz
  await writeDataToFile({ data: updatedData });

  return true; // Başarılı güncelleme için true döndür
}
