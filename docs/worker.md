# Frontend - Documentation Sendo Worker

**Version**: 1.0
**Date**: 2025-01-18
**Public cible**: Développeurs Frontend (React/Next.js)

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Frontend](#architecture-frontend)
3. [API Worker disponibles](#api-worker-disponibles)
4. [ElizaOS Sessions API](#elizaos-sessions-api)
5. [Gestion des sessions](#gestion-des-sessions)
6. [WebSocket et temps réel](#websocket-et-temps-réel)
7. [Flow complet d'une action](#flow-complet-dune-action)
8. [Implémentation Frontend Backend](#implémentation-frontend-backend)
9. [Implémentation Frontend UI](#implémentation-frontend-ui)
10. [Filtrage des actions intermédiaires](#filtrage-des-actions-intermédiaires)

---

## Vue d'ensemble

Le **Frontend** (UI + Backend) communique avec deux APIs distinctes :

1. **Worker API** (Agent Backend - ElizaOS)
   - Récupère les analyses et actions recommandées
   - Envoie les décisions (accept/reject)
   - Update les résultats d'exécution

2. **ElizaOS Sessions API** (Agent Backend - ElizaOS)
   - Crée des sessions pour communiquer avec l'agent
   - Envoie des messages à l'agent
   - Reçoit les réponses via WebSocket

### Principe fondamental

**1 action = 1 session = 1 channel**

Chaque action acceptée crée une **nouvelle session** distincte pour isolation complète.

---

## Architecture Frontend

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND STACK                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Frontend UI (React/Next.js)                       │ │
│  │                                                    │ │
│  │  Composants:                                       │ │
│  │  - AnalysisDashboard (liste des analyses)         │ │
│  │  - ActionsPanel (liste des actions)               │ │
│  │  - ActionCard (accept/reject button)              │ │
│  │  - ActionStatus (affiche progression en temps réel)│ │
│  │                                                    │ │
│  │  Hooks:                                            │ │
│  │  - useAnalyses() → fetch analyses                 │ │
│  │  - useActions(analysisId) → fetch actions         │ │
│  │  - useActionStatus() → listen WebSocket events    │ │
│  └────────────────────────────────────────────────────┘ │
│                           ↕                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Frontend Backend (Node.js/Express/Next.js API)    │ │
│  │                                                    │ │
│  │  Services:                                         │ │
│  │  - WorkerApiClient → call Worker API              │ │
│  │  - AgentService → gère sessions + WebSocket       │ │
│  │                                                    │ │
│  │  Routes:                                           │ │
│  │  - GET  /api/analyses                             │ │
│  │  - GET  /api/analyses/:id/actions                 │ │
│  │  - POST /api/actions/accept                       │ │
│  │  - POST /api/actions/reject                       │ │
│  │                                                    │ │
│  │  WebSocket:                                        │ │
│  │  - io.connect() → connexion globale               │ │
│  │  - socket.on('messageBroadcast') → écoute         │ │
│  │  - Filtrage actions intermédiaires                │ │
│  │  - Emit events vers Frontend UI                   │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTP + WebSocket
                         │
┌────────────────────────┴────────────────────────────────┐
│                 AGENT BACKEND (ElizaOS)                  │
│                                                          │
│  - Worker API (plugin-sendo-worker)                     │
│  - ElizaOS Sessions API                                 │
│  - WebSocket Server (Socket.IO)                         │
└──────────────────────────────────────────────────────────┘
```

---

## API Worker disponibles

Base URL: `http://localhost:3000/api/agents/:agentId/plugins/worker`

### 1. GET /worker/analysis

Récupère toutes les analyses de l'agent.

**Response**:
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "id": "uuid",
        "agentId": "uuid",
        "timestamp": "2025-01-18T10:00:00Z",
        "analysis": {
          "walletOverview": "Votre portefeuille de 12,450 USDC...",
          "marketConditions": "Les conditions actuelles...",
          "riskAssessment": "Niveau de risque: MODÉRÉ...",
          "opportunities": "3 opportunités détectées..."
        },
        "pluginsUsed": ["plugin-cryptoscore", "plugin-swap"],
        "executionTimeMs": 2340
      }
    ]
  }
}
```

### 2. GET /worker/analysis/:analysisId/actions

Récupère les actions d'une analyse.

**Response**:
```json
{
  "success": true,
  "data": {
    "actions": [
      {
        "id": "action-1",
        "analysisId": "uuid",
        "actionType": "SWAP_TOKEN",
        "pluginName": "plugin-swap",
        "priority": "high",
        "reasoning": "SOL montre un CryptoScore de 8.5/10...",
        "confidence": 0.85,
        "triggerMessage": "Swap 100 USDC vers SOL avec slippage 1%",
        "status": "pending",
        "createdAt": "2025-01-18T10:00:00Z"
      }
    ]
  }
}
```

### 3. GET /worker/action/:actionId

Récupère une action spécifique (utile pour le filtrage).

**Response**:
```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action-1",
      "actionType": "SWAP_TOKEN",
      "status": "executing",
      "result": null
    }
  }
}
```

### 4. POST /worker/actions/decide

Accepte ou rejette une ou plusieurs actions.

**Request**:
```json
{
  "decisions": [
    { "actionId": "action-1", "decision": "accept" },
    { "actionId": "action-2", "decision": "reject" }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "processed": 2,
    "accepted": [
      {
        "id": "action-1",
        "actionType": "SWAP_TOKEN",
        "triggerMessage": "Swap 100 USDC vers SOL avec slippage 1%",
        "status": "accepted"
      }
    ],
    "rejected": [
      { "actionId": "action-2", "status": "rejected" }
    ]
  }
}
```

### 5. PATCH /worker/action/:actionId/result

Update le résultat d'une action (appelé après WebSocket).

**Request**:
```json
{
  "status": "completed",
  "result": {
    "text": "Swap executed successfully",
    "data": { "txHash": "0x123...", "amountIn": 100, "amountOut": 2.5 },
    "timestamp": "2025-01-18T10:05:00Z"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "actionId": "action-1",
    "status": "completed"
  }
}
```

---

## ElizaOS Sessions API

Base URL: `http://localhost:3000/api/messaging`

### 1. POST /api/messaging/sessions

Crée une nouvelle session pour communiquer avec l'agent.

**Request**:
```json
{
  "agentId": "uuid",
  "userId": "uuid",
  "metadata": {
    "actionId": "action-1",
    "actionType": "SWAP_TOKEN",
    "source": "sendo-worker"
  }
}
```

**Response**:
```json
{
  "sessionId": "session-abc",
  "expiresAt": "2025-01-18T11:00:00Z",
  "timeoutConfig": { "inactivityMs": 1800000, "maxDurationMs": 3600000 }
}
```

### 2. GET /api/messaging/sessions/:sessionId

Récupère les détails d'une session (notamment le `channelId`).

**Response**:
```json
{
  "sessionId": "session-abc",
  "channelId": "channel-xyz",
  "agentId": "uuid",
  "userId": "uuid",
  "serverId": "default-server",
  "expiresAt": "2025-01-18T11:00:00Z"
}
```

### 3. POST /api/messaging/sessions/:sessionId/messages

Envoie un message dans une session.

**Request**:
```json
{
  "content": "Swap 100 USDC vers SOL avec slippage 1%",
  "metadata": {
    "actionId": "action-1",
    "actionType": "SWAP_TOKEN",
    "source": "sendo-worker"
  }
}
```

**Response**:
```json
{
  "id": "message-uuid",
  "content": "Swap 100 USDC vers SOL avec slippage 1%",
  "authorId": "uuid",
  "channelId": "channel-xyz",
  "createdAt": "2025-01-18T10:02:00Z"
}
```

---

## Gestion des sessions

### Principe: 1 session par action

**Important**: Chaque action acceptée doit créer une **nouvelle session** distincte.

```typescript
// ❌ MAUVAIS: Réutiliser la même session
const { sessionId } = await createSession();
for (const action of acceptedActions) {
  await sendMessage(sessionId, action.triggerMessage);
}

// ✅ BON: Créer une nouvelle session par action
for (const action of acceptedActions) {
  const { sessionId } = await createSession();
  await sendMessage(sessionId, action.triggerMessage);
}
```

### Architecture Session ↔ Channel

Quand on crée une session, ElizaOS crée automatiquement un **channel** lié :

```
POST /api/messaging/sessions
   ↓
ElizaOS crée:
   ├─ Session (in-memory, avec timeout)
   │  ├─ sessionId: "session-abc"
   │  └─ channelId: "channel-xyz" ─────┐
   │                                    │
   └─ Channel (database, persistant)   │
      ├─ channelId: "channel-xyz" ◄────┘
      ├─ name: "session-session-abc"
      └─ metadata: { sessionId, ... }
```

**Points clés**:
- `channelId` est **inclus** dans la session
- WebSocket broadcast au niveau du **channel** (pas session)
- Il faut **rejoindre le channel** via WebSocket pour recevoir les messages

---

## WebSocket et temps réel

### Connexion WebSocket

```typescript
import io from 'socket.io-client';

// Connexion globale (une seule fois au démarrage)
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ WebSocket connected');
});

socket.on('disconnect', () => {
  console.log('❌ WebSocket disconnected');
});
```

### Rejoindre un channel

Après avoir créé une session, il faut **rejoindre le channel** pour recevoir les broadcasts :

```typescript
// 1. Créer la session
const { sessionId } = await fetch('/api/messaging/sessions', {
  method: 'POST',
  body: JSON.stringify({ agentId, userId: agentId })
}).then(r => r.json());

// 2. Récupérer le channelId
const { channelId, serverId } = await fetch(`/api/messaging/sessions/${sessionId}`)
  .then(r => r.json());

// 3. Rejoindre le channel via WebSocket
socket.emit('message', {
  type: 1, // ROOM_JOINING
  payload: {
    channelId,
    roomId: channelId,
    entityId: agentId,
    serverId
  }
});

console.log(`✅ Joined channel ${channelId}`);
```

### Écouter les messages

```typescript
socket.on('messageBroadcast', (message) => {
  console.log('📨 Received message:', message);

  // message structure:
  // {
  //   id: "message-uuid",
  //   text: "Swap executed successfully",
  //   channelId: "channel-xyz",
  //   senderId: "agent-uuid",
  //   senderName: "Agent",
  //   rawMessage: {
  //     actions: ["SWAP"],
  //     content: { ... }
  //   },
  //   metadata: {
  //     actionId: "action-1",
  //     actionType: "SWAP_TOKEN"
  //   },
  //   createdAt: 1234567890
  // }
});
```

---

## Flow complet d'une action

### 1. User clique "Accept"

```typescript
// Frontend UI
<button onClick={() => acceptAction('action-1')}>
  Accept
</button>
```

### 2. Frontend Backend: Décider + Créer session + Envoyer message

```typescript
// Frontend Backend
async function acceptAction(actionId: string) {
  // 1️⃣ Décider l'action via Worker API
  const response = await fetch(`/api/agents/${agentId}/plugins/worker/actions/decide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      decisions: [{ actionId, decision: 'accept' }]
    })
  });

  const { data } = await response.json();
  const acceptedActions = data.accepted;

  // 2️⃣ Pour chaque action acceptée
  for (const action of acceptedActions) {
    // 2.1. Créer une session
    const sessionRes = await fetch('/api/messaging/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId,
        userId: agentId,
        metadata: {
          actionId: action.id,
          actionType: action.actionType,
          source: 'sendo-worker'
        }
      })
    });

    const { sessionId } = await sessionRes.json();

    // 2.2. Récupérer le channelId
    const sessionDetails = await fetch(`/api/messaging/sessions/${sessionId}`)
      .then(r => r.json());

    const { channelId, serverId } = sessionDetails;

    // 2.3. Tracker cette session
    activeSessions.set(action.id, {
      sessionId,
      channelId,
      actionId: action.id,
      expectedActionType: action.actionType
    });

    // 2.4. Rejoindre le channel via WebSocket
    socket.emit('message', {
      type: 1,
      payload: { channelId, roomId: channelId, entityId: agentId, serverId }
    });

    // 2.5. Envoyer le message
    await fetch(`/api/messaging/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: action.triggerMessage,
        metadata: {
          actionId: action.id,
          actionType: action.actionType,
          source: 'sendo-worker'
        }
      })
    });

    console.log(`✅ Action ${action.id} sent to agent`);
  }
}
```

### 3. Agent exécute et broadcast

```
Agent reçoit: "Swap 100 USDC vers SOL avec slippage 1%"
   ↓
Agent exécute:
   1. REPLY → "I'm swapping 100 USDC..."
      └─ WebSocket broadcast: { actions: ['REPLY'], metadata: { actionId: 'action-1' } }

   2. SWAP → Exécute le swap
      └─ WebSocket broadcast: { actions: ['SWAP'], metadata: { actionId: 'action-1' } }
```

### 4. Frontend Backend: Filtrer et update

```typescript
// Frontend Backend - WebSocket Handler
socket.on('messageBroadcast', async (message) => {
  const actionId = message.metadata?.actionId;
  if (!actionId) return;

  const sessionInfo = activeSessions.get(actionId);
  if (!sessionInfo) return;

  // ⭐ FILTRER: Vérifier si c'est l'action target
  const messageActions = message.rawMessage?.actions || [];
  const isTargetAction = messageActions.some(
    action => action.toUpperCase() === sessionInfo.expectedActionType.toUpperCase()
  );

  if (!isTargetAction) {
    console.log(`⏩ Ignoring intermediate action for ${actionId}`);
    return;
  }

  console.log(`✅ Target action executed for ${actionId}`);

  // Update en BDD via Worker API
  await fetch(`/api/agents/${agentId}/plugins/worker/action/${actionId}/result`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'completed',
      result: {
        text: message.text,
        data: message.content,
        timestamp: new Date().toISOString()
      }
    })
  });

  // Nettoyer
  activeSessions.delete(actionId);

  // Emit event vers Frontend UI
  eventEmitter.emit('action:completed', {
    actionId,
    result: message.text,
    data: message.content
  });
});
```

### 5. Frontend UI: Afficher le résultat

```typescript
// Frontend UI
useEffect(() => {
  const handleActionCompleted = ({ actionId, result }) => {
    setActions(prev =>
      prev.map(a => (a.id === actionId ? { ...a, status: 'completed', result } : a))
    );
  };

  eventEmitter.on('action:completed', handleActionCompleted);

  return () => {
    eventEmitter.off('action:completed', handleActionCompleted);
  };
}, []);
```

---

## Implémentation Frontend Backend

Voir le fichier [FRONTEND_BACKEND_EXAMPLE.md](FRONTEND_BACKEND_EXAMPLE.md) pour un exemple complet.

### Structure recommandée

```
frontend-backend/
├── src/
│   ├── services/
│   │   ├── WorkerApiClient.ts      # Call Worker API
│   │   └── AgentService.ts         # Gère sessions + WebSocket
│   ├── controllers/
│   │   └── ActionController.ts     # Routes Express
│   └── index.ts                    # Point d'entrée
└── package.json
```

### Services principaux

**WorkerApiClient.ts**: Client pour l'API Worker

```typescript
export class WorkerApiClient {
  constructor(
    private agentBackendUrl: string,
    private agentId: string
  ) {}

  async getAnalyses(): Promise<AnalysisResult[]> { ... }
  async getActions(analysisId: string): Promise<RecommendedAction[]> { ... }
  async decideActions(decisions: ActionDecision[]): Promise<...> { ... }
  async updateActionResult(actionId: string, result: any): Promise<void> { ... }
}
```

**AgentService.ts**: Gère les sessions et WebSocket

```typescript
export class AgentService extends EventEmitter {
  private socket: Socket;
  private activeSessions = new Map<string, SessionInfo>();

  async acceptActions(actionIds: string[]): Promise<void> { ... }
  async rejectActions(actionIds: string[]): Promise<void> { ... }
  private async executeAction(action: RecommendedAction): Promise<void> { ... }
  private async handleMessageBroadcast(message: any): Promise<void> { ... }
}
```

---

## Implémentation Frontend UI

### Hook: useAnalyses

```typescript
// hooks/useAnalyses.ts
export function useAnalyses() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/analyses')
      .then(res => res.json())
      .then(data => {
        setAnalyses(data.data);
        setLoading(false);
      });
  }, []);

  return { analyses, loading };
}
```

### Hook: useActions

```typescript
// hooks/useActions.ts
export function useActions(analysisId: string) {
  const [actions, setActions] = useState<RecommendedAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/analyses/${analysisId}/actions`)
      .then(res => res.json())
      .then(data => {
        setActions(data.data);
        setLoading(false);
      });
  }, [analysisId]);

  const acceptAction = async (actionId: string) => {
    await fetch('http://localhost:4000/api/actions/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionIds: [actionId] })
    });

    setActions(prev =>
      prev.map(a => (a.id === actionId ? { ...a, status: 'executing' } : a))
    );
  };

  const rejectAction = async (actionId: string) => {
    await fetch('http://localhost:4000/api/actions/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionIds: [actionId] })
    });

    setActions(prev =>
      prev.map(a => (a.id === actionId ? { ...a, status: 'rejected' } : a))
    );
  };

  return { actions, loading, acceptAction, rejectAction };
}
```

### Hook: useActionStatus

```typescript
// hooks/useActionStatus.ts
export function useActionStatus() {
  const [actionStatuses, setActionStatuses] = useState<Map<string, ActionStatus>>(new Map());

  useEffect(() => {
    // Écouter les events du Frontend Backend
    const handleActionExecuting = ({ actionId }) => {
      setActionStatuses(prev => new Map(prev).set(actionId, { status: 'executing' }));
    };

    const handleActionCompleted = ({ actionId, result }) => {
      setActionStatuses(prev =>
        new Map(prev).set(actionId, { status: 'completed', result })
      );
    };

    const handleActionFailed = ({ actionId, error }) => {
      setActionStatuses(prev =>
        new Map(prev).set(actionId, { status: 'failed', error })
      );
    };

    eventEmitter.on('action:executing', handleActionExecuting);
    eventEmitter.on('action:completed', handleActionCompleted);
    eventEmitter.on('action:failed', handleActionFailed);

    return () => {
      eventEmitter.off('action:executing', handleActionExecuting);
      eventEmitter.off('action:completed', handleActionCompleted);
      eventEmitter.off('action:failed', handleActionFailed);
    };
  }, []);

  return actionStatuses;
}
```

### Composant: ActionsPanel

```tsx
// components/ActionsPanel.tsx
export function ActionsPanel({ analysisId }: { analysisId: string }) {
  const { actions, loading, acceptAction, rejectAction } = useActions(analysisId);
  const actionStatuses = useActionStatus();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="actions-panel">
      <h2>Recommended Actions</h2>
      {actions.map(action => {
        const status = actionStatuses.get(action.id);

        return (
          <div key={action.id} className="action-card">
            <h3>{action.actionType}</h3>
            <p>{action.triggerMessage}</p>
            <p>Priority: {action.priority}</p>
            <p>Confidence: {(action.confidence * 100).toFixed(0)}%</p>

            {action.status === 'pending' && (
              <div className="action-buttons">
                <button onClick={() => acceptAction(action.id)}>
                  Accept
                </button>
                <button onClick={() => rejectAction(action.id)}>
                  Reject
                </button>
              </div>
            )}

            {status?.status === 'executing' && (
              <div className="action-status">
                ⏳ Executing...
              </div>
            )}

            {status?.status === 'completed' && (
              <div className="action-status">
                ✅ Completed: {status.result}
              </div>
            )}

            {status?.status === 'failed' && (
              <div className="action-status">
                ❌ Failed: {status.error}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

## Filtrage des actions intermédiaires

### Pourquoi filtrer ?

Quand l'agent reçoit un message, il peut exécuter **plusieurs actions en chaîne** :

```
Message: "Swap 100 USDC to SOL"
   ↓
Agent exécute:
   1. REPLY → Génère réponse text
   2. SWAP  → Exécute le swap réel
```

**Sans filtrage**: L'action serait marquée "completed" après REPLY ❌
**Avec filtrage**: L'action est marquée "completed" après SWAP ✅

### Comment filtrer ?

```typescript
// Frontend Backend - WebSocket Handler
socket.on('messageBroadcast', async (message) => {
  const actionId = message.metadata?.actionId;
  if (!actionId) return;

  // Récupérer la session active
  const sessionInfo = activeSessions.get(actionId);
  if (!sessionInfo) return;

  // Récupérer le type d'action attendu
  const expectedActionType = sessionInfo.expectedActionType; // "SWAP"

  // Extraire les actions du message
  const messageActions = message.rawMessage?.actions || message.content?.actions || [];

  // Vérifier si c'est l'action target
  const isTargetAction = messageActions.some(
    action => action.toUpperCase() === expectedActionType.toUpperCase()
  );

  // Si c'est une action intermédiaire, ignorer
  if (!isTargetAction) {
    console.log(`⏩ Ignoring ${messageActions.join(',')} for ${actionId} (waiting for ${expectedActionType})`);
    return;
  }

  console.log(`✅ Target action ${expectedActionType} executed for ${actionId}`);

  // Traiter le résultat...
});
```

### Exemple de flow

```
Frontend accepte "Swap 100 USDC to SOL"
   ↓
Agent exécute:
   1. REPLY
      └─ WebSocket: { actions: ['REPLY'], actionId: 'action-1' }
      └─ Frontend Backend: ⏩ Ignoring REPLY (waiting for SWAP)

   2. SWAP
      └─ WebSocket: { actions: ['SWAP'], actionId: 'action-1' }
      └─ Frontend Backend: ✅ Target action SWAP executed
      └─ PATCH /worker/action/action-1/result
```

---

## Résumé

### Responsabilités Frontend

1. **Frontend UI**:
   - Affiche analyses et actions
   - Boutons accept/reject
   - Affiche résultats en temps réel

2. **Frontend Backend**:
   - Appelle Worker API pour CRUD
   - Crée les sessions ElizaOS
   - Envoie les messages aux agents
   - Gère le WebSocket
   - Filtre les actions intermédiaires
   - Update les résultats en BDD

### APIs utilisées

- **Worker API**: `/worker/analysis`, `/worker/actions/decide`, `/worker/action/:id/result`
- **Sessions API**: `/api/messaging/sessions`, `/api/messaging/sessions/:id/messages`
- **WebSocket**: `messageBroadcast` event

### Concepts clés

- **1 action = 1 session = 1 channel**
- **Filtrage des actions intermédiaires** (CRITIQUE)
- **WebSocket broadcast au niveau du channel**
- **`channelId` inclus dans la session**

---

**Fin de la documentation Frontend**

Pour l'implémentation complète du Frontend Backend, voir [FRONTEND_BACKEND_EXAMPLE.md](FRONTEND_BACKEND_EXAMPLE.md).
