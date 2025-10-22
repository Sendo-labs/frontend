import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
	AlertCircle, 
	RefreshCw, 
	Loader2
} from 'lucide-react';
import { useWalletTrades } from '@/hooks/useWalletTrades';

interface WalletAnalyzerProps {
	address: string;
	className?: string;
}

interface LoadMoreButtonProps {
	onLoadMore: () => void;
	loading: boolean;
	hasMore: boolean;
}

interface ErrorStateProps {
	error: string;
	onRetry: () => void;
}

interface LoadingSkeletonProps {
	count?: number;
}

/**
 * Composant pour le bouton Load More
 */
const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onLoadMore, loading, hasMore }) => {
	if (!hasMore) {
		return (
			<div className="text-center py-6">
				<div className="text-foreground/60 text-sm uppercase title-font">
					🎉 All signatures loaded!
				</div>
			</div>
		);
	}

	return (
		<div className="text-center py-6">
			<Button
				onClick={onLoadMore}
				disabled={loading}
				className="bg-gradient-to-r from-sendo-orange to-sendo-red text-white hover:from-sendo-orange/90 hover:to-sendo-red/90 h-12 px-8 transition-all group"
				style={{ borderRadius: 0 }}
			>
				{loading ? (
					<>
						<Loader2 className="w-5 h-5 mr-2 animate-spin" />
						<span className="title-font">LOADING MORE...</span>
					</>
				) : (
					<>
						<RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform" />
						<span className="title-font">LOAD MORE SIGNATURES</span>
					</>
				)}
			</Button>
		</div>
	);
};

/**
 * Composant pour l'état d'erreur
 */
const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
	return (
		<Card className="p-6 text-center" style={{ borderRadius: 0 }}>
			<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
			<h3 className="text-lg font-semibold text-foreground mb-2">
				Error Loading Trades
			</h3>
			<p className="text-foreground/70 mb-4">{error}</p>
			<Button
				onClick={onRetry}
				className="bg-sendo-red text-white hover:bg-sendo-red/90"
				style={{ borderRadius: 0 }}
			>
				<RefreshCw className="w-4 h-4 mr-2" />
				Retry
			</Button>
		</Card>
	);
};

/**
 * Composant pour le skeleton loading
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 5 }) => {
	return (
		<div className="space-y-3">
			{Array.from({ length: count }).map((_, index) => (
				<Card key={index} className="p-4" style={{ borderRadius: 0 }}>
					<div className="animate-pulse">
						<div className="flex items-center justify-between mb-3">
							<div className="h-4 bg-foreground/20 rounded w-24"></div>
							<div className="h-4 bg-foreground/20 rounded w-32"></div>
						</div>
						<div className="space-y-2">
							<div className="h-3 bg-foreground/20 rounded w-full"></div>
							<div className="h-3 bg-foreground/20 rounded w-3/4"></div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
};

/**
 * Composant principal WalletAnalyzer
 */
export const WalletAnalyzer: React.FC<WalletAnalyzerProps> = ({ 
	address, 
	className = '' 
}) => {
	const { 
		data, 
		loading, 
		loadingMore, 
		error, 
		loadMore, 
		hasMore, 
		retry 
	} = useWalletTrades({ address });

	if (loading) {
		return (
			<div className={`space-y-6 ${className}`}>
				<LoadingSkeleton count={3} />
			</div>
		);
	}

	if (error && !data) {
		return (
			<div className={className}>
				<ErrorState error={error} onRetry={retry} />
			</div>
		);
	}

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Load More Button pour les signatures */}
			<Card className="p-6" style={{ borderRadius: 0 }}>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold text-foreground uppercase title-font">
						SIGNATURES LOADED ({data?.pagination?.total || 0})
					</h2>
					{data?.pagination && (
						<div className="text-sm text-foreground/60">
							{data.pagination.total} signatures loaded
						</div>
					)}
				</div>

				{/* Load More Button */}
				<LoadMoreButton 
					onLoadMore={loadMore} 
					loading={loadingMore} 
					hasMore={hasMore} 
				/>

				{/* Error State for Load More */}
				{error && data && (
					<div className="mt-4">
						<ErrorState error={error} onRetry={retry} />
					</div>
				)}
			</Card>
		</div>
	);
};

export default WalletAnalyzer;
