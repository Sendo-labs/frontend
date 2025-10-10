import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AgentSettings from '@/components/agent-settings';
import { useAgent } from '@/hooks/use-query-hooks';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function AgentSettingsRoute() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { data: agentData, isLoading } = useAgent(agentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!agentData?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Agent not found</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const agent = {
    ...agentData.data,
    createdAt: agentData.data.createdAt ?? Date.now(),
    bio: agentData.data.bio ?? [],
    topics: agentData.data.topics ?? [],
    adjectives: agentData.data.adjectives ?? [],
    style: agentData.data.style ?? { all: [], chat: [], post: [] },
    settings: agentData.data.settings ?? { secrets: {} },
  };

  return (
    <div className="flex w-full justify-center px-4 sm:px-6 overflow-y-auto">
      <div className="w-full md:max-w-4xl py-6">
        <AgentSettings agent={agent} agentId={agentId} onSaveComplete={() => {}} />
      </div>
    </div>
  );
}