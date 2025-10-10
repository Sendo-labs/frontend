import React from "react";
import AgentCard from "./AgentCard";

export default function CategorySection({ title, agents }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, index) => (
          <AgentCard key={index} agent={agent} />
        ))}
      </div>
    </div>
  );
}