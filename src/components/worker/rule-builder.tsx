'use client';

import { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkerSwitch } from './worker-switch';

interface RuleParams {
	min_usd?: number;
	target_pct?: number;
	target?: {
		SOL?: number;
		USDC?: number;
	};
}

interface Rule {
	id: string;
	enabled: boolean;
	params: RuleParams;
}

interface RuleBuilderProps {
	rules: Rule[];
	onRuleUpdate: (ruleId: string, updates: Partial<Rule>) => void;
}

const RULE_LABELS: Record<string, string> = {
	sell_dust: 'Sell Dust Tokens',
	take_profit: 'Take Profit Automation',
	rebalance: 'Portfolio Rebalancing',
};

const RULE_DESCRIPTIONS: Record<string, string> = {
	sell_dust: 'Automatically sell tokens below a certain USD value',
	take_profit: 'Take profits when tokens reach your target percentage',
	rebalance: 'Maintain target portfolio allocation',
};

export default function RuleBuilder({ rules, onRuleUpdate }: RuleBuilderProps) {
	const [expandedRule, setExpandedRule] = useState<string | null>(null);

	const toggleRule = (ruleId: string) => {
		setExpandedRule(expandedRule === ruleId ? null : ruleId);
	};

	return (
		<div>
			<div className='flex items-center gap-2 mb-4'>
				<Settings className='w-5 h-5 text-sendo-orange' />
				<h2 className='text-xl font-bold text-foreground uppercase title-font'>
					AUTOMATION{' '}
					<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>RULES</span>
				</h2>
			</div>

			<div className='space-y-3'>
				{rules.map((rule) => (
					<div
						key={rule.id}
						className='bg-foreground/5 border border-foreground/10 overflow-hidden transition-all'
						style={{ borderRadius: 0 }}
					>
						<div className='p-4 flex items-center justify-between'>
							<div className='flex items-center gap-3 flex-1'>
								<WorkerSwitch
									checked={rule.enabled}
									onCheckedChange={(checked) => onRuleUpdate(rule.id, { enabled: checked })}
								/>
								<div className='flex-1'>
									<h3 className='text-base font-bold text-foreground mb-0.5'>{RULE_LABELS[rule.id]}</h3>
									<p className='text-xs text-foreground/60'>{RULE_DESCRIPTIONS[rule.id]}</p>
								</div>
							</div>

							<Button
								onClick={() => toggleRule(rule.id)}
								variant='ghost'
								size='icon'
								className='text-foreground/60 hover:text-foreground hover:bg-foreground/10'
								style={{ borderRadius: 0 }}
							>
								{expandedRule === rule.id ? <ChevronUp className='w-5 h-5' /> : <ChevronDown className='w-5 h-5' />}
							</Button>
						</div>

						{expandedRule === rule.id && (
							<div className='px-4 pb-4 border-t border-foreground/10 pt-4'>
								{rule.id === 'sell_dust' && (
									<div>
										<label htmlFor='min-usd-input' className='text-xs text-foreground/60 mb-2 block'>
											Minimum USD Value
										</label>
										<Input
											type='number'
											value={rule.params.min_usd || ''}
											onChange={(e) =>
												onRuleUpdate(rule.id, {
													params: {
														...rule.params,
														min_usd: Number(e.target.value),
													},
												})
											}
											className='h-10 bg-background border-foreground/20 text-foreground'
											style={{ borderRadius: 0 }}
											placeholder='15'
										/>
										<p className='text-xs text-foreground/40 mt-2'>Tokens valued below this amount will be sold</p>
									</div>
								)}

								{rule.id === 'take_profit' && (
									<div>
										<label htmlFor='target-profit-percentage-input' className='text-xs text-foreground/60 mb-2 block'>
											Target Profit Percentage
										</label>
										<Input
											type='number'
											value={rule.params.target_pct || ''}
											onChange={(e) =>
												onRuleUpdate(rule.id, {
													params: {
														...rule.params,
														target_pct: Number(e.target.value),
													},
												})
											}
											className='h-10 bg-background border-foreground/20 text-foreground'
											style={{ borderRadius: 0 }}
											placeholder='25'
										/>
										<p className='text-xs text-foreground/40 mt-2'>Sell when token is within this % of ATH</p>
									</div>
								)}

								{rule.id === 'rebalance' && (
									<div className='space-y-3'>
										<div>
											<label htmlFor='sol-target-percentage-input' className='text-xs text-foreground/60 mb-2 block'>
												SOL Target %
											</label>
											<Input
												type='number'
												value={rule.params.target?.SOL ? rule.params.target.SOL * 100 : ''}
												onChange={(e) =>
													onRuleUpdate(rule.id, {
														params: {
															target: {
																...rule.params.target,
																SOL: Number(e.target.value) / 100,
															},
														},
													})
												}
												className='h-10 bg-background border-foreground/20 text-foreground'
												style={{ borderRadius: 0 }}
												placeholder='60'
											/>
										</div>
										<div>
											<label htmlFor='usdc-target-percentage-input' className='text-xs text-foreground/60 mb-2 block'>
												USDC Target %
											</label>
											<Input
												type='number'
												value={rule.params.target?.USDC ? rule.params.target.USDC * 100 : ''}
												onChange={(e) =>
													onRuleUpdate(rule.id, {
														params: {
															target: {
																...rule.params.target,
																USDC: Number(e.target.value) / 100,
															},
														},
													})
												}
												className='h-10 bg-background border-foreground/20 text-foreground'
												style={{ borderRadius: 0 }}
												placeholder='40'
											/>
										</div>
										<p className='text-xs text-foreground/40'>
											Automatically rebalance when allocation deviates by 10%+
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
