'use client';

import { Link, CheckCircle, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Connections {
	oauth: string[];
	api_keys: string[];
}

interface ConnectionPanelProps {
	connections: Connections;
	onAddConnection: () => void;
	onRemoveConnection: (connectionId: string) => void;
}

interface AvailableConnection {
	id: string;
	name: string;
	type: 'oauth' | 'api_key';
	connected: boolean;
	logo: string;
}

const AVAILABLE_CONNECTIONS: AvailableConnection[] = [
	{
		id: 'jupiter',
		name: 'Jupiter',
		type: 'oauth',
		connected: true,
		logo: '🪐',
	},
	{
		id: 'raydium',
		name: 'Raydium',
		type: 'oauth',
		connected: false,
		logo: '⚡',
	},
	{
		id: 'defi_provider_x',
		name: 'DeFi Provider X',
		type: 'api_key',
		connected: true,
		logo: '🔑',
	},
	{
		id: 'birdeye',
		name: 'Birdeye',
		type: 'api_key',
		connected: false,
		logo: '👁️',
	},
];

export default function ConnectionPanel({ connections, onAddConnection, onRemoveConnection }: ConnectionPanelProps) {
	const connectedServices = AVAILABLE_CONNECTIONS.filter(
		(c) =>
			(c.type === 'oauth' && connections.oauth.includes(c.id)) ||
			(c.type === 'api_key' && connections.api_keys.includes(c.id)),
	);

	return (
		<div>
			<div className='flex items-center gap-2 mb-4'>
				<Link className='w-5 h-5 text-sendo-orange' />
				<h2 className='text-xl font-bold text-foreground uppercase title-font'>CONNECTIONS</h2>
			</div>

			<div className='bg-foreground/5 border border-foreground/10 p-4' style={{ borderRadius: 0 }}>
				{/* Connected Services */}
				<div className='mb-4'>
					<h3 className='text-xs text-foreground/60 uppercase mb-3'>Connected Services</h3>
					{connectedServices.length > 0 ? (
						<div className='space-y-2'>
							{connectedServices.map((service) => (
								<div
									key={service.id}
									className='flex items-center justify-between p-3 bg-sendo-green/10 border border-sendo-green/30 group'
									style={{ borderRadius: 0 }}
								>
									<div className='flex items-center gap-2'>
										<span className='text-xl'>{service.logo}</span>
										<div>
											<p className='text-sm font-semibold text-foreground'>{service.name}</p>
											<p className='text-xs text-foreground/60'>{service.type === 'oauth' ? 'OAuth' : 'API Key'}</p>
										</div>
									</div>
									<div className='flex items-center gap-2'>
										<CheckCircle className='w-5 h-5 text-sendo-green' />
										<button
											type='button'
											onClick={() => onRemoveConnection(service.id)}
											className='opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 bg-sendo-red/20 hover:bg-sendo-red/40 flex items-center justify-center'
											style={{ borderRadius: 0 }}
										>
											<X className='w-4 h-4 text-sendo-red' />
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className='text-foreground/40 text-sm text-center py-4'>No connections yet. Add one below!</p>
					)}
				</div>

				<Button
					onClick={onAddConnection}
					className='w-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-orange/50 text-foreground h-10'
					style={{ borderRadius: 0 }}
				>
					<Plus className='w-4 h-4 mr-2' />
					<span className='title-font'>ADD CONNECTION</span>
				</Button>
			</div>
		</div>
	);
}
