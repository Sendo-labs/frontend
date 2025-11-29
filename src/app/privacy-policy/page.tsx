import { LegalPage } from '@/components/legal/legal-page';

const content = `This Privacy Policy explains how Sendo (“we”, “our”, “the Project”) collects, uses, stores, and protects information when you (“User”) access or use the Sendo platform, tools, websites, analytics, and related services (the “Service”).

Sendo is an **open-source project without a registered legal entity**.  
The Service is provided on a best-effort basis and is not intended for regulated financial activities.

By using the Service, you agree to this Privacy Policy.

---

# **1. Who We Are**

- **Name:** Sendo
    
- **Legal Entity:** None (open-source project)
    
- **Address:** Solana World
    
- **Contact Email:** [sendo.market@proton.me](mailto:sendo.market@proton.me)
    
- **License:** MIT (open-source components)
    

Since Sendo is not operated by a formal legal entity, data is handled by distributed maintainers.

---

# **2. Information We Collect**

Sendo aims to collect as little data as possible.  
We only process **non-sensitive, non-identifying technical data** required to operate the platform.

## **2.1. Data You Provide Voluntarily**

- Email address (if you contact us or subscribe to updates)
    

## **2.2. Wallet Authentication via Privy**

If you connect a wallet through our interface, authentication may be facilitated by **Privy**, a third-party authentication and embedded wallet provider.

Privy may process:

- Wallet addresses
    
- Authentication signatures
    
- Device/browser metadata
    
- Session information
    

Privy does **not** access your funds or private keys.  
Your use of Privy is subject to their own Privacy Policy and Terms of Service.

## **2.3. Automatically Collected Data**

We may collect:

- Wallet addresses you input for analysis
    
- Public on-chain data from Solana
    
- Technical logs (IP region, device type, error logs)
    
- Usage analytics (page views, navigation behavior, performance metrics)
    

## **2.4. Blockchain Data**

Public blockchain data is not “collected” by Sendo —  
it is inherently public and retrieved from the Solana blockchain through indexing providers.

We cannot modify or delete on-chain data.

---

# **3. How We Use Your Data**

We use collected information strictly to:

- Provide wallet analysis (Missing ATH metric, scoring)
    
- Authenticate sessions (via Privy, when applicable)
    
- Improve Service performance and stability
    
- Debug, monitor, and secure the platform
    
- Prevent abuse, scraping, or attacks
    
- Generate aggregated analytics
    
- Develop agent-based tools (Sendo Worker)
    

We **never**:

- Sell personal data
    
- Build advertising profiles
    
- Link wallet addresses to real-world identities
    
- Use data for targeted marketing without consent
    

---

# **4. Legal Basis (GDPR)**

We rely on:

### **4.1. Consent**

Provided when you input a wallet, authenticate via Privy, or contact us.

### **4.2. Legitimate Interest**

Ensuring service performance, security, fraud prevention, and analytics.

---

# **5. Third-Party Providers**

We integrate the following external services:

---

## **5.1. Privy (Wallet Authentication / Embedded Wallets)**

Privy enables wallet authentication, session management, and user identification without storing private keys.

Privy may process:

- Wallet addresses
    
- Signatures
    
- Device/browser metadata
    
- Session tokens
    

Privy operates under its own Privacy Policy, and Sendo does not control its data handling.

---

## **5.2. Helius (On-Chain Data Indexing)**

Used to reconstruct transactions, track wallet activity, and fetch blockchain data.

## **5.3. Birdeye (Market Data Provider)**

Used for token metadata, price feeds, liquidity, and market information.

---

Sendo does not share user data with any additional third parties.  
No advertising or tracking networks are used.

---

# **6. Data Storage & Retention**

We store **minimal** data and only for operational purposes:

- Privy authentication data is handled by Privy, not by us
    
- Technical logs: short retention (e.g., 30–90 days)
    
- Wallet analysis caching (temporary and non-identifiable)
    
- Emails (if given): retained only for communication
    
- Analytics: aggregated and anonymized
    

We do **not** store private keys, seed phrases, or sensitive personal information.

---

# **7. Data Security**

We apply reasonable security measures:

- HTTPS encryption
    
- No storage of private keys
    
- Privy handles authentication securely
    
- Access controls for infrastructure
    
- Minimal retention of logs
    
- No centralized database of user identities
    

However, as Sendo is open-source and decentralized, absolute security cannot be guaranteed.

---

# **8. Your Rights**

Depending on your jurisdiction, you may have the right to:

- Access your data
    
- Correct inaccurate information
    
- Request deletion of voluntarily provided data
    
- Object to processing
    
- Withdraw consent
    

Blockchain data is public and immutable, so we cannot delete or modify on-chain data.

To exercise your rights, contact:  
📩 **[sendo.market@proton.me](mailto:sendo.market@proton.me)**

---

# **9. Children’s Privacy**

The Service is not intended for users under **18 years old**.  
We do not knowingly collect information from minors.

---

# **10. International Data Transfers**

Because Sendo is decentralized and leverages third-party providers (Privy, Helius, Birdeye), data may be processed:

- In various jurisdictions
    
- On globally distributed infrastructure
    
- Through decentralized networks (Solana blockchain)
    

By using the Service, you consent to these international transfers.

---

# **11. Cookies & Local Storage**

Sendo may use cookies or local storage to:

- Maintain sessions (including Privy authentication)
    
- Measure performance and analytics
    
- Enhance user experience
    
- Ensure security
    

No advertising cookies are used.  
See our **Cookie Policy** for details.

---

# **12. AI Processing**

Sendo uses AI-driven systems (Sendo Worker) to:

- Analyze wallet behaviors
    
- Detect patterns
    
- Generate insights
    

AI outputs may contain inaccuracies and should not be considered financial advice.

---

# **13. Changes to this Privacy Policy**

We may update this Privacy Policy periodically.  
The “Last Updated” date will be updated accordingly.

Continued use of the Service means acceptance of the updated policy.

---

# **14. Contact**

For privacy-related questions or requests:

📩 **[sendo.market@proton.me](mailto:sendo.market@proton.me)**

We will answer on a best-effort basis.

---`;

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="Last Updated: 29/11/2025"
      content={content}
    />
  );
}

