import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '../ui/button';
import { verifyFeatureAccessCode } from '@/actions/feature-acces-code';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function FeatureAccessCode({ trigger, onSuccess }: { trigger: React.ReactNode; onSuccess: () => void }) {
	const [accessCode, setAccessCode] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger>{trigger as React.ReactNode}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Feature Access Code</DialogTitle>
					<DialogDescription>Enter the access code to access the feature.</DialogDescription>
					<Input
						type='text'
						placeholder='Enter your access code'
						value={accessCode}
						onChange={(e) => setAccessCode(e.target.value)}
					/>
					<Button
						onClick={async () => {
							setIsLoading(true);
							const result = await verifyFeatureAccessCode(accessCode);
							if (result.success) {
								if (result.data) {
									toast.success('Access code verified');
									setIsOpen(false);
									onSuccess();
								} else {
									toast.error('Access code not verified');
								}
							} else {
								toast.error(result.error);
							}
							setIsLoading(false);
						}}
						disabled={isLoading}
					>
						{isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Verify'}
					</Button>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
