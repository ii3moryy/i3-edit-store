import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; dir: "rtl" | "ltr" };

const dict: Record<string, { ar: string; en: string }> = {
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.plans": { ar: "الخطط", en: "Plans" },
  "nav.order": { ar: "اطلب الآن", en: "Order Now" },
  "hero.badge": { ar: "⚡ الاشتراك الأصلي بأقل سعر", en: "⚡ Original subscription, lowest price" },
  "hero.title": { ar: "Adobe Creative Cloud", en: "Adobe Creative Cloud" },
  "hero.subtitle": { ar: "على حسابك الشخصي", en: "On Your Personal Account" },
  "hero.desc": {
    ar: "احصل على جميع تطبيقات Adobe الاحترافية بسعر مناسب. نفعّل الاشتراك مباشرة على حسابك الشخصي بضمان كامل.",
    en: "Get all professional Adobe apps at a great price. We activate the subscription directly on your personal account with a full guarantee.",
  },
  "hero.order": { ar: "اطلب الآن", en: "Order Now" },
  "hero.viewPlans": { ar: "عرض الخطط", en: "View Plans" },
  "hero.activation": { ar: "وقت التفعيل", en: "Activation Time" },
  "hero.original": { ar: "اشتراك أصلي", en: "Original" },
  "testimonials.title": { ar: "آراء العملاء", en: "Customer Reviews" },
  "testimonials.sub": { ar: "أكثر من +5000 عميل سعيد", en: "Over 5,000 happy customers" },
  "plans.title": { ar: "اختر خطتك", en: "Choose Your Plan" },
  "plans.sub": { ar: "أوفر طريقة لاشتراك Adobe الاحترافي", en: "The most affordable way to get Adobe Pro" },
  "creators.title": { ar: "صنّاع المحتوى الذين يثقون بنا", en: "Creators Who Trust Us" },
  "creators.sub": { ar: "يستخدم مجموعتنا من Adobe Creative Cloud", en: "Using our Adobe Creative Cloud bundle" },
  "how.title": { ar: "كيف يعمل؟", en: "How It Works" },
  "how.sub": { ar: "خطوات بسيطة للحصول على Adobe Creative Cloud", en: "Simple steps to get Adobe Creative Cloud" },
  "why.title": { ar: "لماذا تختارنا؟", en: "Why Choose Us?" },
  "faq.title": { ar: "الأسئلة الشائعة", en: "Frequently Asked Questions" },
  "cta.title": { ar: "جاهز للبدء؟", en: "Ready to Start?" },
  "cta.sub": { ar: "اشترك الآن واحصل على اشتراك Adobe Creative Cloud", en: "Subscribe now and get Adobe Creative Cloud" },
  "cta.whatsapp": { ar: "تواصل واتساب", en: "WhatsApp Us" },
  "cta.order": { ar: "اطلب اشتراكك الآن", en: "Order Your Subscription" },
  "order.title": { ar: "اطلب الآن", en: "Order Now" },
  "order.sub": { ar: "أدخل بياناتك لإتمام الطلب والدفع عبر PayPal", en: "Enter your details to complete the order via PayPal" },
  "order.choosePlan": { ar: "اختر خطة الاشتراك", en: "Choose Subscription Plan" },
  "order.personal": { ar: "بياناتك الشخصية", en: "Personal Information" },
  "order.fullName": { ar: "الاسم الكامل", en: "Full Name" },
  "order.email": { ar: "البريد الإلكتروني", en: "Email" },
  "order.phone": { ar: "رقم الهاتف / واتساب", en: "Phone / WhatsApp" },
  "order.discount": { ar: "كود الخصم (اختياري)", en: "Discount Code (Optional)" },
  "order.discountPlaceholder": { ar: "أدخل كود الخصم", en: "Enter discount code" },
  "order.apply": { ar: "تطبيق", en: "Apply" },
  "order.notes": { ar: "ملاحظات (اختياري)", en: "Notes (Optional)" },
  "order.notesPlaceholder": { ar: "أي ملاحظات أو استفسارات...", en: "Any notes or questions..." },
  "order.selectedPlan": { ar: "الخطة المختارة", en: "Selected Plan" },
  "order.price": { ar: "السعر", en: "Price" },
  "order.discountApplied": { ar: "خصم", en: "Discount" },
  "order.tax": { ar: "ضرائب PayPal (6%)", en: "PayPal tax (6%)" },
  "order.total": { ar: "المبلغ الإجمالي للتحويل", en: "Total Amount" },
  "order.taxNote": { ar: "* المبلغ الإجمالي يشمل 6% ضرائب PayPal", en: "* Total includes 6% PayPal tax" },
  "order.paypalTitle": { ar: "تعليمات الدفع عبر PayPal", en: "PayPal Payment Instructions" },
  "order.paypalAccount": { ar: "حساب PayPal", en: "PayPal Account" },
  "order.transferAmount": { ar: "حوّل المبلغ", en: "Transfer Amount" },
  "order.afterTransfer": { ar: "بعد التحويل — أرسل لقطة شاشة الإيصال على واتساب", en: "After transfer — send a screenshot of the receipt on WhatsApp" },
  "order.submit": { ar: "إرسال الطلب عبر واتساب", en: "Send Order via WhatsApp" },
  "order.submitNote": {
    ar: "سيفتح واتساب مع تفاصيل طلبك — أرسل الرسالة ثم حوّل المبلغ وأرسل الإيصال",
    en: "WhatsApp will open with your order — send the message, then transfer and send the receipt",
  },
  "order.promoSuccess": { ar: "تم تطبيق الخصم", en: "Discount applied" },
  "order.promoInvalid": { ar: "كود الخصم غير صالح", en: "Invalid discount code" },
  "plans.includedTitle": { ar: "تطبيقات Adobe المشمولة", en: "Included Adobe Apps" },
  "lang.choose": { ar: "اختر اللغة", en: "Choose Your Language" },
  "lang.welcome": { ar: "مرحباً بك في i3 Store", en: "Welcome to i3 Store" },
  /* Steps */
  "step.1.title": { ar: "اختر خطتك", en: "Choose Your Plan" },
  "step.1.desc": { ar: "حدد المدة المناسبة لك — شهري أو سنوي.", en: "Pick the duration that suits you — monthly or yearly." },
  "step.2.title": { ar: "أرسل طلبك", en: "Send Your Order" },
  "step.2.desc": { ar: "أدخل بياناتك عبر النموذج وأرسل الطلب.", en: "Enter your details via the form and send the order." },
  "step.3.title": { ar: "ادفع عبر PayPal", en: "Pay via PayPal" },
  "step.3.desc": { ar: "حول المبلغ عبر PayPal (آمن، بسيط، وسريع).", en: "Transfer the amount via PayPal (safe, simple, and fast)." },
  "step.4.title": { ar: "تفعيل فوري", en: "Instant Activation" },
  "step.4.desc": { ar: "نفعّل الاشتراك على حسابك الشخصي خلال ساعة.", en: "We activate the subscription on your personal account within an hour." },
  /* Why Us */
  "why.1.title": { ar: "آمن 100%", en: "100% Secure" },
  "why.1.desc": { ar: "اشتراك Adobe أصلي مع ضمان كامل طوال فترة الاشتراك.", en: "Original Adobe subscription with full guarantee for the entire duration." },
  "why.2.title": { ar: "تفعيل فوري", en: "Instant Activation" },
  "why.2.desc": { ar: "نفعّل اشتراكك على حسابك الشخصي خلال ساعة من الدفع.", en: "We activate your subscription on your personal account within an hour of payment." },
  "why.3.title": { ar: "على حسابك", en: "On Your Account" },
  "why.3.desc": { ar: "الاشتراك يُضاف على حسابك الشخصي في Adobe بدون مشاركة.", en: "The subscription is added to your personal Adobe account without sharing." },
  /* FAQ */
  "faq.1.q": { ar: "ما هو Adobe Creative Cloud؟", en: "What is Adobe Creative Cloud?" },
  "faq.1.a": { ar: "Adobe Creative Cloud هو مجموعة شاملة من تطبيقات Adobe تشمل Photoshop, Illustrator, Premiere Pro, After Effects وأكثر من 20 تطبيق احترافي.", en: "Adobe Creative Cloud is a comprehensive suite of Adobe apps including Photoshop, Illustrator, Premiere Pro, After Effects, and more than 20 professional apps." },
  "faq.2.q": { ar: "كيف يتم التفعيل على حسابي؟", en: "How is it activated on my account?" },
  "faq.2.a": { ar: "نضيف اشتراك Adobe الرسمي على حسابك الشخصي مباشرة. كل ما تحتاجه هو إيميل حسابك في Adobe وكلمة المرور.", en: "We add the official Adobe subscription to your personal account directly. All you need is your Adobe account email and password." },
  "faq.3.q": { ar: "ما هي طرق الدفع المتاحة؟", en: "What payment methods are available?" },
  "faq.3.a": { ar: "ندعم الدفع عبر PayPal لضمان أمان عالي وحماية كاملة للمشتري والبائع.", en: "We support payment via PayPal for high security and full protection for buyer and seller." },
  "faq.4.q": { ar: "هل الاشتراك أصلي؟", en: "Is the subscription original?" },
  "faq.4.a": { ar: "نعم، الاشتراك أصلي 100% من Adobe مع جميع المميزات والتطبيقات. ضمان كامل طوال فترة الاشتراك.", en: "Yes, the subscription is 100% original from Adobe with all features and apps. Full guarantee for the entire subscription period." },
  "faq.5.q": { ar: "ماذا يحدث بعد انتهاء الاشتراك؟", en: "What happens after the subscription ends?" },
  "faq.5.a": { ar: "تستطيع تجديد الاشتراك من خلالنا بنفس السعر، أو استخدام حسابك بدون اشتراك.", en: "You can renew the subscription through us at the same price, or use your account without a subscription." },
  /* Plan Card */
  "plan.featured": { ar: "الأكثر طلباً", en: "Most Popular" },
  "plan.save": { ar: "وفر", en: "Save" },
  "plan.perMonth": { ar: "يعادل", en: "Equals" },
  "plan.subscribe": { ar: "اشترك الآن", en: "Subscribe Now" },
  "plan.month": { ar: "شهر", en: "month" },
  /* Footer */
  "footer.rights": { ar: "جميع الحقوق محفوظة © 2026", en: "All rights reserved © 2026" },
  /* Creators */
  "creators.empty": { ar: "لا يوجد صنّاع بعد — أضفهم من", en: "No creators yet — add them from" },
  "creators.adminLink": { ar: "صفحة الإدارة", en: "Admin page" },
  /* Auth */
  "auth.signin": { ar: "تسجيل الدخول", en: "Sign In" },
  "auth.signup": { ar: "إنشاء حساب", en: "Sign Up" },
  "auth.signinNote": { ar: "ادخل بياناتك للوصول للوحة الإدارة", en: "Enter your details to access the admin panel" },
  "auth.signupNote": { ar: "أول حساب يتم إنشاؤه يصبح مدير تلقائياً", en: "The first account created becomes admin automatically" },
  "auth.email": { ar: "البريد الإلكتروني", en: "Email" },
  "auth.password": { ar: "كلمة المرور (6+ أحرف)", en: "Password (6+ characters)" },
  "auth.login": { ar: "دخول", en: "Login" },
  "auth.createAccount": { ar: "إنشاء حساب", en: "Create Account" },
  "auth.noAccount": { ar: "ليس لديك حساب؟ أنشئ حساباً", en: "Don't have an account? Create one" },
  "auth.hasAccount": { ar: "لديك حساب؟ سجّل الدخول", en: "Already have an account? Sign in" },
  "auth.verifyEmail": { ar: "تحقق من بريدك لتأكيد الحساب (أو سجّل الدخول إذا كان التأكيد معطّلاً).", en: "Check your email to confirm the account (or sign in if confirmation is disabled)." },
  /* Admin */
  "admin.title": { ar: "لوحة الإدارة", en: "Admin Panel" },
  "admin.beta": { ar: "BETA — لا توجد كلمة مرور", en: "BETA — No password required" },
  "admin.creators": { ar: "صنّاع المحتوى", en: "Creators" },
  "admin.add": { ar: "إضافة", en: "Add" },
  "admin.name": { ar: "الاسم", en: "Name" },
  "admin.imageUrl": { ar: "رابط الصورة (https://...)", en: "Image URL (https://...)" },
  "admin.channelUrl": { ar: "رابط القناة (اختياري) https://...", en: "Channel URL (optional) https://..." },
  "admin.noChannel": { ar: "لا يوجد رابط قناة", en: "No channel link" },
  "admin.promos": { ar: "أكواد الخصم", en: "Promo Codes" },
  "admin.code": { ar: "كود (مثال: SAVE20)", en: "Code (e.g. SAVE20)" },
  "admin.discountPercent": { ar: "نسبة الخصم %", en: "Discount %" },
  "admin.addCode": { ar: "إضافة كود", en: "Add Code" },
  "admin.active": { ar: "مفعّل", en: "Active" },
  "admin.inactive": { ar: "متوقف", en: "Inactive" },
  "admin.reviews": { ar: "آراء العملاء", en: "Reviews" },
  "admin.stars": { ar: "نجوم", en: "stars" },
  "admin.description": { ar: "الوصف", en: "Description" },
  "admin.addReview": { ar: "إضافة تقييم", en: "Add Review" },
  "admin.noItems": { ar: "لا يوجد بعد", en: "None yet" },
  "admin.error": { ar: "خطأ:", en: "Error:" },
  /* Admin - Prices */
  "admin.prices": { ar: "الأسعار والخطط", en: "Plans & Prices" },
  "admin.priceNameAr": { ar: "الاسم بالعربية", en: "Arabic name" },
  "admin.priceNameEn": { ar: "الاسم بالإنجليزية", en: "English name" },
  "admin.priceBefore": { ar: "السعر قبل الخصم ($)", en: "Price before discount ($)" },
  "admin.priceAfter": { ar: "السعر بعد الخصم ($)", en: "Price after discount ($)" },
  "admin.savePrice": { ar: "حفظ", en: "Save" },
  "admin.saved": { ar: "تم الحفظ", en: "Saved" },
  /* Tabs */
  "admin.tab.creators": { ar: "صنّاع المحتوى", en: "Creators" },
  "admin.tab.promos": { ar: "أكواد الخصم", en: "Promo Codes" },
  "admin.tab.reviews": { ar: "آراء العملاء", en: "Reviews" },
  "admin.tab.prices": { ar: "الأسعار", en: "Prices" },
  /* Not Found */
  "notfound.home": { ar: "الرئيسية", en: "Home" },
};

const Context = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    localStorage.setItem("lang", l);
    setLangState(l);
  };

  const t = (k: string) => dict[k]?.[lang] ?? k;

  return (
    <Context.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </Context.Provider>
  );
}

export const useI18n = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("I18nProvider missing");
  return ctx;
};
