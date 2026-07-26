
# 🛡️ Comprehensive Penetration Testing Solution: AD Credentialed Enumeration from Linux

---

## 1\. THE QUESTION & SYSTEMATIC THOUGHT PROCESS

### Re-stating the Questions in Simple Terms

**Question 1:** Inside a Windows Active Directory (AD) domain, every user/object has a unique ID number called a **RID (Relative Identifier)**. You are given a decimal number `1170` and asked: _which username belongs to that ID number?_

**Question 2:** Inside the same AD domain, there is a group called **"Interns"**. How many user accounts are members of that group?

---

### 🧠 Breaking It Down: What is a RID?

Think of a Windows domain like a company with an employee badge system:

-   The **company ID** = the **Domain SID** (e.g., `S-1-5-21-3842939050-3880317879-2865463114`)
-   The **individual employee badge number** = the **RID**
-   A **full unique employee ID** = SID + RID combined

So `htb-student`'s full identity would be:  
S-1-5-21-3842939050-3880317879-2865463114RID in decimal−1111​​

**The Critical Detail:** Active Directory stores RIDs in **hexadecimal** format, but the question gives you a **decimal** value. You must convert first.

117010​\=?16​

Let's convert step by step:  
1170÷16\=73 remainder 2  
73÷16\=4 remainder 9  
4÷16\=0 remainder 4

Reading remainders bottom to top:  
117010​\=0x49216​

Verification:  
4×256+9×16+2×1\=1024+144+2\=1170✓

---

### 🗺️ Your Lab Environment Map

```
[Your Laptop] 
     ↓ SSH
[Attack Host: 10.129.114.239] (ACADEMY-EA-ATTACK01 - Parrot Linux)
     ↓ Network
[Domain Controller: 172.16.5.5] (ACADEMY-EA-DC01)
     ↓ Holds all AD data
[Domain: INLANEFREIGHT.LOCAL]

Credentials for enumeration:
  User:     forend
  Password: Klmcargo2
```

**Step 0 — Always First:** SSH into the attack host.

bash

```
ssh htb-student@10.129.114.239
# Password: HTB_@cademy_stdnt!
```

---

## 2\. SIX DISTINCT SOLUTION APPROACHES (From Basic to Advanced)

---

### ✅ Approach 1 — `rpcclient` with Direct RID Query (Most Direct)

> **What it is:** `rpcclient` is a Samba tool that communicates with Windows machines over the **SMB/RPC protocol**. It lets you query user and group information directly from a Domain Controller.

**Step 1 — Connect to the Domain Controller:**

bash

```
rpcclient -U "forend%Klmcargo2" 172.16.5.5
```

**Step 2 — Answer Question 1 (RID lookup):**

bash

```
rpcclient $> queryuser 0x492
```

**Step 3 — Answer Question 2 (Interns group):**

bash

```
rpcclient $> enumdomgroups
```

Then find "Interns" in the list, note its RID (e.g. `0x4bc`), and run:

bash

```
rpcclient $> querygroup 0x4bc
```

**🟢 Expected Output for Question 1:**

```
User Name   :   mmorgan
Full Name   :   Matthew Morgan
Home Drive  :
Dir Drive   :
Profile Path:
Logon Script:
Description :
<SNIP>
user_rid :      0x492
group_rid:      0x201
```

> 👆 The `User Name` field is your answer!

**🟢 Expected Output for Question 2:**

```
Group Name  :   Interns
Description :
Group Attribute:7
Num Members :72        <-- THIS is the membercount answer
```

**❌ Failure Scenarios:**

-   `NT_STATUS_LOGON_FAILURE` → wrong password for `forend`
-   `NT_STATUS_ACCESS_DENIED` → SMB signing issues or firewall blocking port 445
-   Connection hangs → DC IP is wrong or the VPN tunnel dropped

**🔄 Pivot Trigger:**

> Stop and move on if you see `NT_STATUS_` errors after your connection attempt, OR if the `queryuser 0x492` returns `NT_STATUS_NO_SUCH_USER`.

---

### ✅ Approach 2 — `CrackMapExec` with `--users` and `--groups`

> **What it is:** CrackMapExec (CME) is an all-in-one network pentesting tool. It enumerates AD over SMB and outputs clean, easy-to-read data.

**Answer Question 1 — Enumerate all users and grep for RID:**

bash

```
sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --users
```

Then either scroll through the output manually, or pipe it to search:

bash

```
sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --users | grep -i "1170"
```

**Answer Question 2 — Enumerate all groups:**

bash

```
sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --groups | grep -i "Interns"
```

**🟢 Expected Output for Question 1:**

```
SMB  172.16.5.5  445  ACADEMY-EA-DC01  [*] Windows 10.0 Build 17763 x64
SMB  172.16.5.5  445  ACADEMY-EA-DC01  [+] INLANEFREIGHT.LOCAL\forend:Klmcargo2
SMB  172.16.5.5  445  ACADEMY-EA-DC01  [+] Enumerated domain user(s)
SMB  172.16.5.5  445  ACADEMY-EA-DC01  INLANEFREIGHT.LOCAL\mmorgan  badpwdcount: 0 baddpwdtime: ...
```

> ⚠️ Note: CME displays RIDs differently — it may not directly show the decimal RID in the same way as rpcclient. You may need to cross-reference.

**🟢 Expected Output for Question 2:**

```
SMB  172.16.5.5  445  ACADEMY-EA-DC01  Interns   membercount: 72
```

**❌ Failure Scenarios:**

-   `[-] INLANEFREIGHT.LOCAL\forend:Klmcargo2 STATUS_LOGON_FAILURE` → bad creds
-   Command not found → CME not installed; try `netexec` as it's the modern replacement
-   Output too large to visually scan → pipe to `grep`

**🔄 Pivot Trigger:**

> If `[+]` doesn't appear after the credentials line, authentication failed. If `--users` returns 0 results, move to Approach 3.

---

### ✅ Approach 3 — `rpcclient` with `enumdomusers` + Manual RID Brute

> **What it is:** Instead of directly querying by hex RID (which requires you to know the conversion), you dump ALL users and their RIDs, then identify the one matching 1170.

bash

```
rpcclient -U "forend%Klmcargo2" 172.16.5.5 -c "enumdomusers"
```

Or from inside rpcclient interactively:

bash

```
rpcclient $> enumdomusers
```

**🟢 Expected Output:**

```
user:[administrator] rid:[0x1f4]
user:[guest] rid:[0x1f5]
user:[krbtgt] rid:[0x1f6]
user:[lab_adm] rid:[0x3e9]
user:[htb-student] rid:[0x457]
user:[avazquez] rid:[0x458]
...
user:[mmorgan] rid:[0x492]   <-- 0x492 = 1170 decimal = ANSWER
...
```

You can also pipe the one-liner and grep for `0x492`:

bash

```
rpcclient -U "forend%Klmcargo2" 172.16.5.5 -c "enumdomusers" | grep "0x492"
```

**❌ Failure Scenarios:**

-   Large domain with thousands of users makes output hard to read → always use `grep`
-   `rpcclient` version mismatch → older Samba versions may format output differently

**🔄 Pivot Trigger:**

> If `grep "0x492"` returns nothing, double-check your hex conversion. If still empty, the user may have been deleted or the RID is wrong.

---

### ✅ Approach 4 — `Impacket` `lookupsid.py` (RID Cycling/Brute-Force)

> **What it is:** `lookupsid.py` is an Impacket script that **brute-forces RIDs** from 0 up to a specified maximum, translating each numeric RID into a username. This is useful even without knowing the exact RID in advance.

bash

```
lookupsid.py INLANEFREIGHT.LOCAL/forend:Klmcargo2@172.16.5.5 | grep "1170"
```

Or to enumerate a range and look for our specific target:

bash

```
lookupsid.py INLANEFREIGHT.LOCAL/forend:Klmcargo2@172.16.5.5 2000
```

> The number `2000` tells it to check RIDs from 0 to 2000.

**🟢 Expected Output:**

```
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

[*] Brute forcing SIDs at 172.16.5.5
[*] StringBinding ncacn_np:172.16.5.5[\pipe\lsarpc]
[*] Domain SID is: S-1-5-21-3842939050-3880317879-2865463114
498: INLANEFREIGHT\Enterprise Read-only Domain Controllers (SidTypeGroup)
500: INLANEFREIGHT\Administrator (SidTypeUser)
...
1170: INLANEFREIGHT\mmorgan (SidTypeUser)   <-- ANSWER
...
```

> 👆 Notice: Here RIDs appear in **decimal** already! No hex conversion needed with this tool.

**❌ Failure Scenarios:**

-   `lookupsid.py` not in PATH → try `python3 /usr/share/doc/python3-impacket/examples/lookupsid.py`
-   Reaches the max RID before finding the target → increase the number (e.g., `3000`)
-   Slow on large ranges → be patient, or narrow using `grep` on 1170 specifically

**🔄 Pivot Trigger:**

> If `grep "1170"` shows no results after running to 2000, increase to 3000. If the tool errors out, move to Approach 5.

---

### ✅ Approach 5 — `ldapsearch` (Raw LDAP Query)

> **What it is:** `ldapsearch` sends direct LDAP (Lightweight Directory Access Protocol) queries to the Domain Controller. LDAP is the protocol that underlies all AD queries. This is the most "raw" and precise method.

**Answer Question 1 — Find user by RID using LDAP filter:**

The RID is actually stored in the `objectSid` attribute. A simpler approach is to query all users and filter:

bash

```
ldapsearch -x -H ldap://172.16.5.5 \
  -D "forend@INLANEFREIGHT.LOCAL" \
  -w "Klmcargo2" \
  -b "DC=INLANEFREIGHT,DC=LOCAL" \
  "(objectClass=user)" sAMAccountName objectSid | grep -A1 "1170"
```

Or directly query with the SID ending in 1170:

bash

```
ldapsearch -x -H ldap://172.16.5.5 \
  -D "forend@INLANEFREIGHT.LOCAL" \
  -w "Klmcargo2" \
  -b "DC=INLANEFREIGHT,DC=LOCAL" \
  "(&(objectClass=user)(objectSid=*-1170))" sAMAccountName
```

**Answer Question 2 — Query Interns group:**

bash

```
ldapsearch -x -H ldap://172.16.5.5 \
  -D "forend@INLANEFREIGHT.LOCAL" \
  -w "Klmcargo2" \
  -b "DC=INLANEFREIGHT,DC=LOCAL" \
  "(&(objectClass=group)(cn=Interns))" member | grep "member:" | wc -l
```

**🟢 Expected Output for Q1:**

```
# mmorgan, Users, INLANEFREIGHT.LOCAL
dn: CN=Matthew Morgan,CN=Users,DC=INLANEFREIGHT,DC=LOCAL
sAMAccountName: mmorgan
```

**❌ Failure Scenarios:**

-   `ldap_sasl_bind(SIMPLE): Can't contact LDAP server` → port 389 blocked, try 636 (LDAPS)
-   `Invalid credentials (49)` → wrong username format; try `INLANEFREIGHT\forend` instead
-   SID-based filter may not work directly → use `lookupsid.py` instead

**🔄 Pivot Trigger:**

> Any error code 49 = authentication failure. Error code 32 = no such object (wrong base DN). Move to Approach 6 if LDAP port is inaccessible.

---

### ✅ Approach 6 — `BloodHound.py` (Full AD Ingestion + GUI Analysis)

> **What it is:** BloodHound collects ALL AD data at once (users, groups, permissions, sessions, ACLs) and lets you visualize and query it. This is overkill for two simple questions but is the most powerful and complete approach, and essential for real engagements.

**Step 1 — Collect all AD data:**

bash

```
sudo bloodhound-python \
  -u 'forend' \
  -p 'Klmcargo2' \
  -ns 172.16.5.5 \
  -d inlanefreight.local \
  -c all
```

**Step 2 — Zip the output:**

bash

```
zip -r inlanefreight_bh.zip *.json
```

**Step 3 — Start Neo4j and BloodHound GUI:**

bash

```
sudo neo4j start
bloodhound &
```

**Step 4 — Answer Question 1** using a custom Cypher query in BloodHound's Raw Query box:

cypher

```
MATCH (u:User) WHERE u.objectid ENDS WITH '-1170' RETURN u.name
```

**Step 5 — Answer Question 2** using another Cypher query:

cypher

```
MATCH (g:Group {name:"INTERNS@INLANEFREIGHT.LOCAL"}) 
RETURN size([(g)<-[:MemberOf]-(m) | m]) AS memberCount
```

**🟢 Expected Output:**  
BloodHound GUI returns a node with username for Q1, and a numeric count for Q2.

**❌ Failure Scenarios:**

-   `neo4j` service fails to start → run `sudo neo4j stop` first, then `start`
-   Ingestor takes too long → use `-c DCOnly` for faster but limited collection
-   GUI won't connect → check if Neo4j is actually running on port 7474

**🔄 Pivot Trigger:**

> If data ingestion fails or GUI won't connect, use one of the simpler CLI approaches above. BloodHound is best used when you need _relationships_ and _attack paths_, not just simple lookups.

---

## 3\. THE "WHAT IF" MASTERCLASS (6 Scenarios for CPTS Preparation)

---

### 🔴 Scenario 1: What if CrackMapExec is NOT installed on the attack host?

**The Situation:** You type `crackmapexec` and get `command not found`. The tool may have been replaced by its successor, `netexec`.

**The Solution:**

Try the modern replacement — **NetExec (nxc)**:

bash

```
# Try this first
netexec smb 172.16.5.5 -u forend -p Klmcargo2 --users
netexec smb 172.16.5.5 -u forend -p Klmcargo2 --groups | grep -i "Interns"
```

If that also fails, install CME:

bash

```
sudo apt install crackmapexec -y
# OR via pip
pip3 install crackmapexec
```

Or fall back to `rpcclient` which is almost always available since it's part of the core Samba package:

bash

```
rpcclient -U "forend%Klmcargo2" 172.16.5.5
```

**Key Lesson:** Tools get renamed and replaced. `netexec` is the spiritual successor to `crackmapexec` and uses nearly identical syntax. Always check both.

---

### 🔴 Scenario 2: What if port 445 (SMB) is blocked by a firewall?

**The Situation:** All SMB-based tools (CME, smbmap, rpcclient) fail with connection refused or timeout. Port 445 is blocked.

**The Solution:**

Try **LDAP (port 389)** directly with `ldapsearch`:

bash

```
# Check which ports are open first
nmap -p 389,445,636,3268,3269 172.16.5.5
```

If LDAP (389) is open:

bash

```
ldapsearch -x -H ldap://172.16.5.5 \
  -D "forend@INLANEFREIGHT.LOCAL" \
  -w "Klmcargo2" \
  -b "DC=INLANEFREIGHT,DC=LOCAL" \
  "(objectClass=user)" sAMAccountName
```

If only LDAPS (636) is open (SSL version):

bash

```
ldapsearch -x -H ldaps://172.16.5.5 \
  -D "forend@INLANEFREIGHT.LOCAL" \
  -w "Klmcargo2" \
  -b "DC=INLANEFREIGHT,DC=LOCAL" \
  "(objectClass=user)" sAMAccountName
```

**Key Lesson:** SMB, LDAP, RPC, and Kerberos are different protocols all pointing to the same AD data. If one port is blocked, another often isn't. A pentester always has multiple vectors.

---

### 🔴 Scenario 3: What if the `forend` account is locked out mid-enumeration?

**The Situation:** You're running CME and suddenly get `STATUS_ACCOUNT_LOCKED_OUT`. An automated security system saw your rapid queries and locked the account.

**The Solution:**

**Immediately stop** all enumeration with that account. Never keep hammering a locked account.

Check if you have _any other credentials_ from earlier in the engagement:

bash

```
# You might have gotten other hashes or passwords earlier
# For example, if you have wley's credentials:
rpcclient -U "wley%transporter@4" 172.16.5.5
```

If you only have NTLM hashes (not cleartext passwords), use **Pass-the-Hash**:

bash

```
# CME supports hash authentication
sudo crackmapexec smb 172.16.5.5 -u forend -H <NTLM_HASH> --users
```

If no other creds, wait for the IT team's lockout policy to expire (usually 30 minutes), then proceed with **one slow query at a time** to avoid triggering lockout again.

**Key Lesson:** Always check `badpwdcount` before spraying. The CME output shows `badpwdcount: X` for each user — if it's at 2 and the policy locks at 3, **do not query that user further**.

---

### 🔴 Scenario 4: What if you don't know the Domain Controller's IP address?

**The Situation:** You have the attack host and credentials, but you don't know which host is the DC (172.16.5.5 wasn't given to you). You need to find it first.

**The Solution:**

**Method A — DNS Query** (DCs register themselves in DNS):

bash

```
# Query for DC location via DNS
nslookup -type=SRV _ldap._tcp.dc._msdcs.INLANEFREIGHT.LOCAL 172.16.5.5
```

**Method B — CME subnet scan** (if you know the subnet):

bash

```
# Scan the entire subnet for SMB hosts
sudo crackmapexec smb 172.16.5.0/24
# Look for output showing "(domain:INLANEFREIGHT.LOCAL) (signing:True)"
# Signing:True almost always = Domain Controller
```

**Method C — nmap service scan:**

bash

```
nmap -p 389,88,445 172.16.5.0/24 --open
# Port 88 (Kerberos) + 389 (LDAP) + 445 (SMB) all open = likely DC
```

**Key Lesson:** Domain Controllers are usually identifiable by their combination of open ports: **88 (Kerberos), 135 (RPC), 389 (LDAP), 445 (SMB), 636 (LDAPS), 3268 (Global Catalog LDAP)**.

---

### 🔴 Scenario 5: What if `rpcclient` connects but `enumdomusers` returns "Access Denied"?

**The Situation:** You connect with `rpcclient` successfully but when you type `enumdomusers`, you get `NT_STATUS_ACCESS_DENIED`. Your credentials are valid but this _specific action_ is restricted.

**The Solution:**

This happens when the AD environment has hardened its RPC null session / anonymous enumeration settings, or when the authenticated user lacks specific RPC rights.

**Try a different query verb** in rpcclient:

bash

```
# Instead of enumdomusers, try:
rpcclient $> querydispinfo        # List users differently
rpcclient $> querydominfo         # Domain info
rpcclient $> enumdomgroups        # May still work
```

**Fall back to LDAP** — it has different access controls:

bash

```
ldapsearch -x -H ldap://172.16.5.5 \
  -D "forend@INLANEFREIGHT.LOCAL" \
  -w "Klmcargo2" \
  -b "DC=INLANEFREIGHT,DC=LOCAL" \
  "(&(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))" \
  sAMAccountName
```

**Try with a different user account** if you have one — some accounts may have more enumeration rights.

**Key Lesson:** In hardened environments, you mix protocols. What's blocked over RPC might be readable over LDAP, and vice versa.

---

### 🔴 Scenario 6: What if you find a group but the membercount shows 0, yet you know there are members?

**The Situation:** CME shows `Interns membercount: 0` but you find Interns referenced elsewhere, or the hint says it's non-zero. This can happen with **nested group membership** or a CME display bug.

**The Solution:**

CME sometimes only counts _direct_ members and misses nested (inherited) members. Use `rpcclient` to get the true picture:

bash

```
# Step 1: Find the group RID
rpcclient $> enumdomgroups
# Note the rid:[0xXXX] for Interns

# Step 2: Query the group members
rpcclient $> querygroupmem 0xXXX
```

Or use `ldapsearch` which respects nested membership:

bash

```
ldapsearch -x -H ldap://172.16.5.5 \
  -D "forend@INLANEFREIGHT.LOCAL" \
  -w "Klmcargo2" \
  -b "DC=INLANEFREIGHT,DC=LOCAL" \
  "(&(objectClass=group)(cn=Interns))" \
  member memberOf
```

Or use **windapsearch** which recursively resolves nested groups:

bash

```
python3 /opt/windapsearch/windapsearch.py \
  --dc-ip 172.16.5.5 \
  -u forend@inlanefreight.local \
  -p Klmcargo2 \
  -m "Interns"
```

**Key Lesson:** AD groups can contain _other groups_ (called nested groups). A user in "Group A" which is _inside_ "Interns" is technically a member of Interns — but some tools only count direct members. Always verify with multiple tools and specifically look for nested membership when numbers seem wrong.

---

## 📋 Quick Reference Summary

Goal

Tool & Command

Convert RID to hex

`python3 -c "print(hex(1170))"` → `0x492`

Look up user by RID

`rpcclient $> queryuser 0x492`

List all users + RIDs

`rpcclient $> enumdomusers`

List all groups + counts

`sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --groups`

RID brute force (shows decimal)

`lookupsid.py INLANEFREIGHT.LOCAL/forend:Klmcargo2@172.16.5.5 2000`

LDAP user query

`ldapsearch -x -H ldap://172.16.5.5 -D "forend@INLANEFREIGHT.LOCAL" -w "Klmcargo2" -b "DC=INLANEFREIGHT,DC=LOCAL" "(objectClass=user)" sAMAccountName`

> 💡 **Pro Tip for the CPTS Exam:** Always save your output to files! Commands like `sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --users | tee users_output.txt` let you `grep` through results later without re-running slow scans.

$0.178,527 tok143.8s

8

Responses are AI-generated and can be inaccurate. Review all outputs before relying on them.

Select a modelSelect a model

## Embedded Content