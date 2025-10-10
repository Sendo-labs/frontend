import AgentCard from '@/components/agent-card';
import GroupCard from '@/components/group-card';
import GroupPanel from '@/components/group-panel';
import ProfileOverlay from '@/components/profile-overlay';
import { useAgentsWithDetails, useChannels, useServers } from '@/hooks/use-query-hooks';
import clientLogger from '@/lib/logger';
import { ChannelType as CoreChannelType, AgentStatus } from '@elizaos/core';
import { Plus } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const { data: agentsData, isLoading, isError, error } = useAgentsWithDetails();
  const navigate = useNavigate();

  const agents = useMemo(() => agentsData?.agents || [], [agentsData]);
  const activeAgentsCount = agents.filter((a) => a.status === AgentStatus.ACTIVE).length;

  const { data: serversData } = useServers();
  const servers = serversData?.data?.servers || [];

  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [isGroupPanelOpen, setIsGroupPanelOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [activeTab, setActiveTab] = useState('agents');

  const closeOverlay = () => {
    setSelectedAgent(null);
    setOverlayOpen(false);
  };

  const handleNavigateToDm = async (agent, forceNew) => {
    if (!agent.id) return;
    navigate(`/chat/${agent.id}`, { state: { forceNew } });
  };

  const handleCreateGroup = () => {
    navigate('/group/new');
  };

  useEffect(() => {
    clientLogger.info('[Home] Component mounted/re-rendered. Key might have changed.');
  }, []);

  return (
    <>
      <div className="flex-1 w-full overflow-y-auto bg-background">
        <div className="flex flex-col w-full h-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full h-full flex flex-col"
          >
            <div className="w-full">
              <div className="w-full md:max-w-4xl mx-auto px-6 pt-6 pb-2">
                <div className="flex justify-between items-center mb-3">
                  <TabsList className="h-auto p-0 bg-transparent border-0 border-b-0 gap-2 w-auto">
                    <TabsTrigger
                      value="agents"
                      className="relative rounded-full data-[state=active]:border-b-0 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold cursor-pointer text-lg py-1"
                    >
                      Agents
                      <span
                        className={`
                          absolute -top-2.5 right-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-[8px] font-semibold border border-black
                          transition-all duration-300 ease-in-out
                          ${activeTab === 'agents' && activeAgentsCount > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
                        `}
                      >
                        {activeAgentsCount}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="groups"
                      className="rounded-full data-[state=active]:border-b-0 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold cursor-pointer text-lg py-1"
                    >
                      Groups
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (activeTab === 'agents') {
                        navigate('/create');
                      } else {
                        handleCreateGroup();
                      }
                    }}
                    className="create-agent-button cursor-pointer gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    {activeTab === 'agents' ? 'Create New Agent' : 'Create New Group'}
                  </Button>
                </div>
                <Separator />
              </div>
            </div>

            <TabsContent value="agents" className="flex-1 mt-0 bg-background">
              <div className="flex flex-col gap-6 w-full md:max-w-4xl mx-auto px-6 py-2">
                {isLoading && <div className="text-center py-8">Loading agents...</div>}

                {isError && (
                  <div className="text-center py-8">
                    Error loading agents: {error instanceof Error ? error.message : 'Unknown error'}
                  </div>
                )}

                {agents.length === 0 && !isLoading && (
                  <div className="text-center py-8 flex flex-col items-center gap-4">
                    <p className="text-muted-foreground">
                      No agents currently running. Start a character to begin.
                    </p>
                  </div>
                )}

                {!isLoading && !isError && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 agents-section">
                    {agents
                      .sort((a, b) => {
                        const aActive = a.status === AgentStatus.ACTIVE ? 1 : 0;
                        const bActive = b.status === AgentStatus.ACTIVE ? 1 : 0;
                        return bActive - aActive;
                      })
                      .map((agent) => {
                        return (
                          <AgentCard
                            key={agent.id}
                            agent={agent}
                            onMessageClick={(forceNew) => handleNavigateToDm(agent, forceNew)}
                            onViewProfile={() => {
                              setSelectedAgent(agent);
                              setOverlayOpen(true);
                            }}
                          />
                        );
                      })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}