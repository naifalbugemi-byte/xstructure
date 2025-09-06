"use client";

import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 font-inter">سياسة الخصوصية</h1>
        <p className="text-slate-300 text-lg font-inter">Privacy Policy</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="glass-morphism rounded-3xl p-10 border border-blue-500/20 text-slate-300 leading-relaxed whitespace-pre-line font-inter">
{`🔹 بالعربية

في Xstructure.ai، نولي خصوصيتك وحماية بياناتك الشخصية أعلى درجات الأهمية. 
تهدف هذه السياسة إلى توضيح كيفية جمع البيانات واستخدامها وحمايتها، وفقًا لأفضل الممارسات العالمية.

1. البيانات التي نجمعها:
- البريد الإلكتروني وبيانات الحساب الأساسية.
- سجلات الاستخدام والتفاعل داخل المنصة.
- المحتوى المجدول أو المرفوع من قبلك.
- بيانات الدفع والتعاملات المالية (عبر مزودي الدفع المعتمدين).

2. كيفية استخدام البيانات:
- تشغيل الخدمة وتقديم المزايا.
- تحسين الأداء وتجربة المستخدم.
- إرسال إشعارات وتنبيهات متعلقة بالخدمة.
- ضمان الامتثال للقوانين والأنظمة المحلية والدولية.

3. مشاركة البيانات:
- قد نشارك بيانات محدودة مع مزودي خدمات الدفع أو منصات النشر (مثل YouTube, Facebook, Instagram, Threads) لغرض تشغيل الخدمة فقط.
- لا يتم بيع بياناتك أو مشاركتها مع أطراف ثالثة لأغراض تجارية.

4. حماية البيانات:
- نستخدم بروتوكولات تشفير ومعايير أمان عالية المستوى.
- مع ذلك، لا يمكن ضمان الحماية المطلقة ضد أي خرق أمني خارج عن إرادتنا.

5. حقوق المستخدم:
- لك الحق في تعديل أو تصحيح بياناتك في أي وقت.
- لك الحق في طلب حذف حسابك نهائيًا.
- يمكنك طلب نسخة من بياناتك الشخصية وفقًا للقوانين المعمول بها.

6. حدود المسؤولية:
- Xstructure.ai غير مسؤولة عن أي وصول غير مصرّح به أو تسرب بيانات ناتج عن قوة قاهرة أو خرق أمني خارج سيطرتنا.

7. القانون المطبق وحل النزاعات:
- تخضع هذه السياسة لأنظمة ولوائح المملكة العربية السعودية، وأي نزاع يخضع للتحكيم وفق القوانين السعودية.

---

🔹 In English

At Xstructure.ai, we highly value your privacy and are committed to protecting your personal data. 
This policy explains how we collect, use, and safeguard your data in line with global best practices.

1. Data Collected:
- Email and basic account information.
- Usage logs and activity within the platform.
- Scheduled or uploaded content.
- Payment and transaction details (through authorized payment providers).

2. Use of Data:
- To operate and deliver the services.
- To improve performance and user experience.
- To send service-related notifications and alerts.
- To ensure compliance with local and international regulations.

3. Data Sharing:
- Limited data may be shared with payment providers or publishing platforms (e.g., YouTube, Facebook, Instagram, Threads) strictly for service operation.
- We do not sell or share your data with third parties for commercial gain.

4. Data Security:
- We implement industry-standard encryption and security measures.
- However, absolute protection against breaches cannot be guaranteed beyond our control.

5. User Rights:
- You have the right to modify or correct your data at any time.
- You have the right to request permanent deletion of your account.
- You may request a copy of your personal data in compliance with applicable laws.

6. Limitation of Liability:
- Xstructure.ai shall not be held liable for unauthorized access or data leaks resulting from force majeure events or breaches beyond its control.

7. Governing Law & Dispute Resolution:
- This policy is governed by the laws and regulations of the Kingdom of Saudi Arabia.
- Any disputes shall be resolved through arbitration in accordance with Saudi law.`}
        </div>
      </div>
    </div>
  );
}
