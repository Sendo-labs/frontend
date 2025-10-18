"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, Shield, CheckCircle } from "lucide-react";

export default function WorkerPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            WORKER
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Automate your trading strategies with powerful workers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 mb-4 text-primary" />
              <CardTitle>Fast Execution</CardTitle>
              <CardDescription>
                Lightning-fast trade execution with minimal latency
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-10 h-10 mb-4 text-primary" />
              <CardTitle>Smart Strategies</CardTitle>
              <CardDescription>
                AI-powered trading strategies optimized for profit
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 mb-4 text-primary" />
              <CardTitle>Secure</CardTitle>
              <CardDescription>
                Bank-level security for your assets and data
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            Activate Worker
          </Button>
        </div>
      </div>
    </div>
  );
}
