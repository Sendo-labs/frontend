"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Star, Download } from "lucide-react";

export default function MarketplacePage() {
  const plugins = [
    { name: "Sniper Bot", description: "Fast token sniping", rating: 4.8 },
    { name: "Copy Trading", description: "Copy successful traders", rating: 4.6 },
    { name: "Risk Manager", description: "Manage your portfolio risk", rating: 4.9 }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            MARKETPLACE
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover and install powerful trading plugins
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {plugins.map((plugin, index) => (
            <Card key={index}>
              <CardHeader>
                <Package className="w-10 h-10 mb-4 text-primary" />
                <CardTitle>{plugin.name}</CardTitle>
                <CardDescription>{plugin.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{plugin.rating}</span>
                  </div>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Install
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
