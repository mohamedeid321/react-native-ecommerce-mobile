// أدوات مشتركة بين شاشة الإضافة وشاشة التعديل

// بيحوّل النص لرقم (بيقبل الأرقام العربية والفاصلة)
export const toNumber = (text) => {
  const normalized = String(text)
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(",", ".")
    .trim();
  return normalized === "" ? NaN : Number(normalized);
};

// بيجهز الصورة للإرسال في FormData
export const toFilePart = (asset, fallbackName) => {
  const type = asset.mimeType || "image/jpeg";
  const ext = type.split("/")[1] || "jpg";
  return { uri: asset.uri, name: `${fallbackName}.${ext}`, type };
};

// بيبني FormData من القيم اللي طلعت من ProductForm
// الصور بتتبعت بس لو اتغيرت (في التعديل)
export const buildProductFormData = (values) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("price", String(values.price));
  formData.append("discount", String(values.discount));
  formData.append("unit", values.unit);
  formData.append("stock", String(values.stock));
  formData.append("category", values.category);
  if (values.image) formData.append("image", toFilePart(values.image, "card"));
  if (values.detailImage) {
    formData.append("detailImage", toFilePart(values.detailImage, "detail"));
  }
  return formData;
};
