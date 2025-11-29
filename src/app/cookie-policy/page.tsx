import { LegalPage } from '@/components/legal/legal-page';

const content = `This Cookie Policy explains how Sendo (“we”, “our”, “the Project”) uses cookies, local storage, session tokens, and similar technologies (“Cookies”) when you access or use the Sendo website and services (the “Service”).

Sendo is an open-source, decentralized project with no registered legal entity.  
Cookies are used strictly to operate the Service and improve functionality.

---

# **1. What Are Cookies?**

Cookies are small files stored on your device when you visit a website.  
Sendo may also use related technologies such as:

- Local Storage
    
- Session Storage
    
- Privy authentication tokens
    
- Browser crypto-provider storage
    
- Security and session identifiers
    

These technologies help the Service function correctly.

---

# **2. Why We Use Cookies**

Sendo uses Cookies only for essential and functional purposes.

We do **NOT** use:

- Advertising cookies
    
- Marketing trackers
    
- Retargeting pixels
    
- Behavioral advertising tools
    

Below are the categories of Cookies we use.

---

# **3. Types of Cookies We Use**

## **3.1. Essential Cookies (Required)**

These cookies are necessary for the Service to function.

They include:

- **Privy authentication tokens**
    
- Secure session IDs
    
- Wallet connection state
    
- Infrastructure and request routing cookies
    
- Security tokens preventing fraud and abuse
    
- Anti-bot and performance cookies
    

Disabling these cookies will prevent the Service from functioning.

---

## **3.2. Functional Cookies**

Used to improve user experience, such as:

- Remembering UI preferences (theme, layout)
    
- Keeping your wallet connection open
    
- Saving dashboard configuration
    
- Tracking “last used” wallet provider
    

These do not track or identify users.

---

## **3.3. Analytics Cookies**

Used to understand the performance of the Service:

- Page views
    
- Error reporting
    
- Anonymous usage metrics
    
- Load time statistics
    

Analytics used by Sendo:

- Do **not** track identity
    
- Do **not** profile users
    
- Are aggregated and privacy-preserving
    

---

# **4. Cookies Used by Third-Party Providers**

Sendo integrates third-party tools that may set their own cookies or storage tokens.

## **4.1. Privy (Wallet Authentication)**

Privy uses secure tokens stored in cookies or browser storage to:

- Authenticate the user
    
- Maintain login sessions
    
- Verify device integrity
    
- Prevent malicious activity
    

Privy does **not** access private keys or funds.  
Privy’s own policies apply to their cookies.

---

## **4.2. Analytics Providers**

We may use lightweight analytics tools to improve the Service.  
These tools may store:

- Anonymized session identifiers
    
- Performance metrics
    
- Error logs
    

No analytics tool used by Sendo engages in advertising, retargeting, or user profiling.

---

# **5. What Data Cookies Collect**

Sendo may process:

- Authentication/session IDs
    
- Wallet connection preferences
    
- Device and browser metadata
    
- Performance and error logs
    
- Basic anonymous traffic statistics
    

Sendo does **not** collect or store:

- Private keys
    
- Seed phrases
    
- Sensitive personal data
    
- Real-world identity information
    

---

# **6. How to Manage Cookies**

You can:

- Disable cookies in your browser settings
    
- Delete cookies manually
    
- Block non-essential cookies
    
- Revoke consent (EU users)
    

But note:

➡️ **If you disable essential cookies (especially Privy authentication cookies), the Service may not work.**

### How to manage cookies in your browser:

- Chrome → Settings → Privacy → Cookies
    
- Safari → Preferences → Privacy
    
- Firefox → Options → Privacy & Security
    
- Brave → Settings → Shields
    
- Edge → Settings → Site permissions
    

Search “clear cookies + your browser name” for instructions.

---

# **7. Cookie Consent (EU Users)**

For users located in the European Union:

- Essential cookies do **not** require consent
    
- Analytics cookies may require opt-in consent
    
- No advertising cookies are used
    

If required, a consent banner will appear on first visit.

---

# **8. Local Storage & Web3-Specific Storage**

Sendo may also use browser-based storage technologies:

- **Local Storage** (UI preferences, theme, configuration)
    
- **Session Storage** (temporary dashboard/session states)
    
- **Provider storage** (wallet provider metadata)
    
- **Privy storage** (session persistence)
    

These are treated the same as cookies under this Policy.

---

# **9. Updates to This Cookie Policy**

We may update this Cookie Policy from time to time.  
The “Last Updated” date at the top will be modified accordingly.

Continued use of the Service means acceptance of the updated policy.

---

# **10. Contact**

For questions about Cookies or data handling:

📩 **[sendo.market@proton.me](mailto:sendo.market@proton.me)**

We will respond on a best-effort basis.

---`;

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      lastUpdated="Last Updated: 29/11/2025"
      content={content}
    />
  );
}

