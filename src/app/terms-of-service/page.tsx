import { LegalPage } from '@/components/legal/legal-page';

const content = `These Terms of Service (“Terms”) govern your access to and use of the Sendo platform, tools, websites, analytics, wallet authentication systems, and any related services (collectively, the “Service”).  
By accessing or using the Service, you (“User”) agree to be bound by these Terms.

If you do not agree, you may not use the Service.

---

# **1. About Sendo**

Sendo is an open-source project focused on Solana wallet analytics, behavioral scoring, and agent-powered tools.

- **Name:** Sendo
    
- **Legal Entity:** No registered legal entity
    
- **Address:** Solana World
    
- **Contact Email:** [sendo.market@proton.me](mailto:sendo.market@proton.me)
    
- **Open-Source License:** MIT License
    

Because Sendo is open-source and not operated by any registered company, the Service is provided **"as-is"**, without warranties or guarantees of any kind.

---

# **2. Description of the Service**

Sendo provides analytics and tooling related to on-chain activity, including:

- Wallet Analyzer (Missing ATH metric)
    
- Wallet behavioral scoring
    
- Agent AI (Sendo Worker)
    
- Data analytics API
    
- Dashboard & web interface
    
- Plugin ecosystem
    
- **Wallet authentication and session management using Privy**
    

Wallet analysis is free.  
Additional features (API, plugins, advanced tools) may become paid.

Sendo does **not** provide financial advice, investment recommendations, brokerage services, or any regulated financial service.

---

# **3. Wallet Authentication via Privy**

Sendo integrates **Privy**, a third-party service that enables:

- Wallet authentication
    
- Embedded wallet features
    
- Session management
    
- Secure user identification without private key storage
    

By using the Service, you agree to Privy’s own Terms and Privacy Policy.  
Privy may collect metadata such as wallet address, signatures, device information, and session identifiers.

Sendo does **not** access or store private keys, seed phrases, or confidential wallet information.

---

# **4. Eligibility**

To use Sendo, you must:

- Be at least 18 years old
    
- Not be restricted from using blockchain tools under applicable laws
    
- Use the Service only for lawful and non-malicious purposes
    

If your local regulations prohibit the use of wallet analytics or blockchain-based tools, you must stop using the Service.

---

# **5. User Responsibilities**

You agree **not** to:

- Scrape, extract, or harvest data from the Service
    
- Resell, sublicense, or commercially exploit Sendo’s proprietary analyses
    
- Use the Service for automated trading unless explicitly authorized
    
- Reverse engineer, decompile, or bypass components not covered by MIT license
    
- Use the Service for illegal, fraudulent, harmful, or malicious purposes
    
- Perform DDoS attacks or disrupt the Service
    
- Interfere with security protocols, including those managed by Privy
    
- Impersonate others or misuse authentication tools
    

Violation may result in immediate suspension or permanent blocking.

---

# **6. Open-Source Notice**

Sendo’s open-source components are distributed under the **MIT License**, allowing free modification and reuse.

However, the following **remain proprietary and protected**:

- Hosted Missing ATH computations
    
- API endpoints
    
- Behavioral scoring logic
    
- Dashboard UI
    
- Dataset aggregation
    
- Privy integration wrappers
    
- Any non-open-source server-side code
    

The MIT license **does not grant** the right to:

- Clone the service
    
- Host a competing version
    
- Extract proprietary data
    
- Degrade or overload the infrastructure
    

---

# **7. No Financial Advice**

Sendo is a tool for analytics and experimentation.

**Sendo does not provide financial advice and accepts no responsibility for trading losses.**

All metrics—including Missing ATH, wallet scoring, and AI-generated insights—are:

- Informational only
    
- Experimental
    
- Based on public blockchain data that may contain errors or gaps
    

You are solely responsible for your investment decisions.

---

# **8. Data Use & Privacy**

Sendo processes minimal data strictly for technical and analytical purposes, including:

- Wallet addresses
    
- Authentication metadata from Privy
    
- Technical logs
    
- Usage analytics
    
- Blockchain data accessed via Helius and Birdeye
    

Sendo does **not** store identifiable personal data unless you voluntarily provide it (e.g., email).

See the **Privacy Policy** for full details.

---

# **9. Third-Party Services**

Sendo integrates several external providers necessary to operate the Service:

### **9.1. Privy**

Used for wallet authentication, embedded wallets, and secure session management.

### **9.2. Helius**

Used for on-chain indexing and transaction reconstruction.

### **9.3. Birdeye**

Used for token data, liquidity information, and price feeds.

These third parties operate under their own terms and privacy policies.  
Sendo is not responsible for their availability, accuracy, or data handling.

---

# **10. Service Availability & Modification**

Sendo may, at any time and without notice:

- Update or modify the Service
    
- Add or remove features
    
- Temporarily suspend access
    
- Permanently discontinue the Service
    
- Change providers (e.g., RPCs, Privy, analytics tools)
    

Because Sendo is an experimental open-source project, uninterrupted availability cannot be guaranteed.

---

# **11. Intellectual Property**

- Open-source components = MIT License
    
- Proprietary components = All rights reserved
    

You may not:

- Reproduce proprietary dashboards or datasets
    
- Host a competing analytics service
    
- Use Sendo’s branding without permission
    
- Redistribute or commercialize protected components
    

---

# **12. Disclaimers & Limitation of Liability**

The Service is provided **"AS IS"**, without any warranty.

To the maximum extent allowed by law:

- Sendo is not liable for errors, bugs, downtime, or data inaccuracies
    
- Sendo is not responsible for blockchain irregularities or failures
    
- Sendo is not responsible for losses, damages, missed profits, or trading outcomes
    
- Wallet authentication via Privy is used at your own risk
    
- Blockchain networks, RPC providers, and third-party APIs may fail unexpectedly
    

You assume full responsibility for your actions when using the Service.

---

# **13. No Jurisdiction / Decentralized Operation**

Because Sendo has **no legal entity or jurisdiction**, the following apply:

- No specific legal venue is designated
    
- Contributors act voluntarily
    
- No liability is assumed by individual maintainers
    

If any part of these Terms is held invalid, the remaining parts stay in effect.

---

# **14. Termination**

Sendo may suspend or terminate your access immediately in case of:

- Violation of these Terms
    
- Abuse, fraud, or automated attacks
    
- Security risks
    
- Misuse of Privy authentication
    
- Excessive scraping or overload
    

Users may stop using the Service at any time.

---

# **15. Changes to the Terms**

Sendo may revise these Terms periodically.  
The updated version will be posted with a new “Last Updated” date.

Continued use of the Service constitutes acceptance of updates.

---

# **16. Contact**

For questions about these Terms:

📩 **[sendo.market@proton.me](mailto:sendo.market@proton.me)**

---`;

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="Last Updated: 29/11/2025"
      content={content}
    />
  );
}

