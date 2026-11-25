// تحقق من بيانات تسجيل الدخول والتسجيل (رسائل بالعربي)

const EMAIL_RE =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

// أخطاء كتابة شائعة في الدومين → التصحيح المقترح
const DOMAIN_TYPOS = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmaill.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
};

export const normalizeEmail = (value) => String(value ?? "").trim().toLowerCase();

// بيرجّع رسالة الخطأ أو null لو الإيميل سليم
export const validateEmail = (value) => {
  const email = normalizeEmail(value);
  if (!email) return "اكتب البريد الإلكتروني";
  if (!email.includes("@")) return "البريد الإلكتروني لازم يحتوي على @";
  if (email.length > 254 || email.includes("..") || !EMAIL_RE.test(email)) {
    return "اكتب بريد إلكتروني صحيح مثل name@gmail.com";
  }
  const suggestion = DOMAIN_TYPOS[email.split("@")[1]];
  if (suggestion) return `هل تقصد ${email.split("@")[0]}@${suggestion}؟`;
  return null;
};

export const validatePassword = (value, { min = 6 } = {}) => {
  if (!value) return "اكتب كلمة المرور";
  if (value.length < min) return `كلمة المرور لازم تكون ${min} أحرف على الأقل`;
  return null;
};

export const validateUsername = (value) => {
  const name = String(value ?? "").trim();
  if (!name) return "اكتب اسمك";
  if (name.length < 3) return "الاسم لازم يكون 3 أحرف على الأقل";
  if (name.length > 40) return "الاسم طويل جداً";
  return null;
};

// ترجمة رسائل الباك الشائعة (لو الباك بيرجّعها بالإنجليزي)
export const translateAuthError = (message) => {
  const m = String(message || "");
  if (/[؀-ۿ]/.test(m)) return m; // عربي بالفعل
  const rules = [
    [/invalid (credentials|email or password)|incorrect|wrong password|not found/i, "البريد الإلكتروني أو كلمة المرور غير صحيحة"],
    [/already (exist|registered|in use)|duplicate|taken/i, "هذا البريد أو الاسم مسجل بالفعل"],
    [/network request failed|failed to fetch|timeout/i, "تعذر الاتصال بالسيرفر، تأكد من الإنترنت"],
    [/password.*(at least|short|6)/i, "كلمة المرور لازم تكون 6 أحرف على الأقل"],
    [/email.*(invalid|valid)/i, "البريد الإلكتروني غير صحيح"],
    [/required|all fields|missing/i, "من فضلك املأ كل الحقول"],
  ];
  const hit = rules.find(([re]) => re.test(m));
  return hit ? hit[1] : "حصلت مشكلة، حاول تاني";
};
