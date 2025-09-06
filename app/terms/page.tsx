"use client";

import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 font-inter">الشروط والأحكام</h1>
        <p className="text-slate-300 text-lg font-inter">Terms & Conditions</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="glass-morphism rounded-3xl p-10 border border-blue-500/20 text-slate-300 leading-relaxed whitespace-pre-line font-inter">
{`🔹 بالعربية

باستخدامك Xstructure.ai فإنك توافق على الشروط التالية:

1. الملكية الفكرية:
جميع الحقوق الفكرية والمحتوى والتصاميم والبرمجيات تعود ملكيتها إلى Xstructure.ai ولا يجوز نسخها أو إعادة استخدامها بدون إذن خطي.

2. استخدام الخدمة:
- يجب استخدام الخدمة لأغراض قانونية فقط.
- يحظر استخدام المنصة لأي أنشطة غير مشروعة أو مضرة.
- الشركة تحتفظ بحق تعليق أو إنهاء أي حساب عند مخالفة هذه الشروط.

3. إنشاء المحتوى:
- المحتوى الذي تنشئه أو ترفعه هو مسؤوليتك الكاملة.
- Xstructure.ai لا تتحمل أي مسؤولية قانونية عن المحتوى المرفوع من المستخدمين.

4. المدفوعات والاشتراكات:
- الرسوم المدفوعة غير قابلة للاسترداد إلا في الحالات المنصوص عليها قانونياً.
- الشركة تحتفظ بحق تعديل الأسعار أو الخطط مع إخطار المستخدمين مسبقاً.

5. حدود المسؤولية:
- لا تتحمل Xstructure.ai أي مسؤولية عن أضرار غير مباشرة أو خسائر مالية ناتجة عن استخدام الخدمة.
- الخدمة مقدمة "كما هي" بدون أي ضمانات صريحة أو ضمنية.

6. التعديلات:
- يحق لـ Xstructure.ai تعديل هذه الشروط في أي وقت.
- استمرارك باستخدام الخدمة بعد التعديل يعني موافقتك على الشروط الجديدة.

7. القانون المطبق وحل النزاعات:
- تخضع هذه الشروط لأنظمة ولوائح المملكة العربية السعودية.
- أي نزاع يخضع للتحكيم وفق القوانين السعودية.

---

🔹 In English

By accessing or using Xstructure.ai, you agree to the following terms:

1. Intellectual Property:
All intellectual property rights, content, designs, and software belong to Xstructure.ai and may not be copied or reused without prior written consent.

2. Use of Service:
- The service must be used for lawful purposes only.
- Misuse, illegal, or harmful activities are strictly prohibited.
- Xstructure.ai reserves the right to suspend or terminate accounts for violations.

3. User Content:
- You are solely responsible for any content you create or upload.
- Xstructure.ai shall not be held liable for user-generated content.

4. Payments & Subscriptions:
- Fees are non-refundable unless required by law.
- The company reserves the right to change pricing or plans with prior notice.

5. Limitation of Liability:
- Xstructure.ai shall not be liable for indirect damages, financial loss, or consequential harm resulting from service use.
- The service is provided "as is" without warranties of any kind.

6. Modifications:
- Xstructure.ai may update these terms at any time.
- Continued use of the service after changes constitutes acceptance.

7. Governing Law & Dispute Resolution:
- These terms are governed by the laws and regulations of the Kingdom of Saudi Arabia.
- Disputes shall be resolved through arbitration in accordance with Saudi law.`}
        </div>
      </div>
    </div>
  );
}
